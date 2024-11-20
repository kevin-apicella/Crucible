import Base from '../../Base.js';
import WalkHelper from '../../helper/WalkHelper.js';

/**
 * @module Core/data/mixin/StoreSync
 */

/**
 * Options available when supplying a config object to the `syncDataOnLoad` config.
 * @typedef {Object} SyncDataOnLoadOptions
 * @property {Boolean} [keepMissingValues] How to handle values for missing fields, see
 * {@link Core/data/Store#config-syncDataOnLoad}
 * @property {String|Number} [threshold] Threshold above which events are batched, see
 * {@link Core/data/Store#config-syncDataOnLoad}
 */

/**
 * Mixin that allows Store to sync a new dataset with its existing records, instead of fully replacing everything.
 * Configure Store with `syncDataOnLoad: true` to activate the functionality. Sync is performed when a new dataset
 * is loaded, either by directly assigning it to `store.data` or by loading it using Ajax (if using an AjaxStore).
 *
 * ```javascript
 * const store = new Store({
 *   syncDataOnLoad : true,
 *   data           : [
 *     { id : 1, name : 'Saitama' },
 *     { id : 2, name : 'Genos' },
 *     { id : 3, name : 'Mumen Rider' }
 *   ]
 * });
 *
 * // Sync a new dataset by assigning to data:
 * store.data = [
 *   { id : 1, name : 'Caped Baldy' },
 *   { id : 4, name : 'Horse-Bone' }
 * ];
 *
 *  // Result : Record 1 updated, record 2 & 3 removed, record 4 added
 * ```
 *
 * For more details, please see {@link #config-syncDataOnLoad}.
 *
 * @mixin
 */
export default Target => class StoreSync extends (Target || Base) {
    static get $name() {
        return 'StoreSync';
    }

    static get configurable() {
        return {
            /**
             * Configure with `true` to sync loaded data instead of replacing existing with a new dataset.
             *
             * By default (or when configured with `false`) assigning to `store.data` replaces the entire dataset
             * with a new one, creating all new records:
             *
             * ```javascript
             * store.data = [ { id : 1, name : 'Saitama' } ];
             *
             * const first = store.first;
             *
             * store.data = [ { id : 1, name : 'One-Punch man' } ];
             *
             * // store.first !== first;
             * ```
             *
             * When configured with `true` the new dataset is instead synced against the old, figuring out what was
             * added, removed and updated:
             *
             * ```javascript
             * store.data = [ { id : 1, name : 'Saitama' } ];
             *
             * const first = store.first;
             *
             * store.data = [ { id : 1, name : 'One-Punch man' } ];
             *
             * // store.first === first;
             * ```
             *
             * After the sync, any configured sorters, groupers and filters will be reapplied.
             *
             * #### Threshold
             *
             * The sync operation has a configurable threshold, above which the operation will be treated as a
             * batch/refresh and only trigger a single `refresh` event. If threshold is not reached, individual events
             * will be triggered (single `add`, `remove` and possible multiple `update`). To enable the threshold,
             * supply a config object with a `threshold` property instead of `true`:
             *
             * ```javascript
             * const store = new Store({
             *     syncDataOnLoad : {
             *         threshold : '20%'
             *     }
             * });
             * ```
             *
             * `threshold` accepts numbers or strings. A numeric threshold means number of affected records, while a
             * string is used as a percentage of the whole dataset (appending `%` is optional). By default no threshold
             * is used.
             *
             * #### Missing fields
             *
             * The value of any field not supplied in the new dataset is by default kept as is (if record is not removed
             * by the sync). This behaviour is configurable, by setting `keepMissingValues : false` in a config object
             * it will reset any unspecified field back to their default values:
             *
             * ```javascript
             * const store = new Store({
             *     syncDataOnLoad : {
             *         keepMissingValues : false
             *     }
             * });
             * ```
             *
             * Considering the following sync operation:
             *
             * ```javascript
             * // Existing data
             * { id : 1, name : 'Saitama', powerLevel : 100 }
             * // Sync data
             * { id : 1, name : 'One-Punch Man' }
             * ```
             *
             * The result would by default (or when explicitly configured with `true`)  be:
             *
             * ```javascript
             * { id : 1, name : 'One-Punch Man', powerLevel : 100 }
             * ```
             *
             * If configured with `keepMissingValues : false` it would instead be:
             *
             * ```javascript
             * { id : 1, name : 'One-Punch Man' }
             * ```
             *
             * <div class="note">Never enable `syncDataOnLoad` on a chained store, it will create an infinite loop when
             * it is populated from the main store (the main store can use the setting)</div>
             *
             * @config {Boolean|SyncDataOnLoadOptions} syncDataOnLoad
             * @default false
             * @category Common
             */
            syncDataOnLoad : null,

            /**
             * Experimental hook to allow app to determine if sync should be performed, and/or for which records.
             *
             * @config {Function} shouldSyncDataset
             * @param {Object} options
             * @param {Object[]} options.data New dataset, an array of incoming data objects
             * @param {Core.data.Store} options.store This store
             * @param {Core.data.Model[]} options.records Records currently in this store
             * @returns {Set|Boolean} A set of ids to apply changes to, or `false` to skip sync
             * @private
             */
            shouldSyncDataset : null,
            shouldSyncRecord  : null,

            /**
             * When using {@link #config-syncDataOnLoad} and the store is neither sorted nor grouped, the order of the
             * incoming dataset is respected. This has a cost, since records in the store might have to be moved around.
             *
             * For stores where the order is not important, this behavior can be disabled to improve performance by
             * configuring `reorderOnSync` as `false`.
             *
             * @default
             * @private
             */
            reorderOnSync : true
        };
    }

    /**
     * Syncs a new dataset against the already loaded one, only applying changes.
     * Not intended to be called directly, please configure store with `syncDataOnLoad: true` and assign to
     * `store.data` as usual instead.
     *
     * ```
     * const store = new Store({
     *    syncDataOnLoad : true,
     *    data : [
     *        // initial data
     *    ]
     * });
     *
     * store.data = [ // new data ]; //  Difference between initial data and new data will be applied
     * ```
     *
     * @param {Object[]|Core.data.Model[]} data New dataset, an array of records or data objects
     * @private
     */
    syncDataset(data) {
        const
            me          = this,
            { storage } = me,
            // Allow app to determine if sync should be performed, and/or for which records. It might have better
            // knowledge of the data to make a cheaper decision
            idsToCheck  = me.shouldSyncDataset?.({ data, store : me, records : me.records }) ??
                // If part of project, it might have an aggregated version of the hook
                me.project?.shouldSyncDataset?.({ data, store : me, records : me.records });

        if (idsToCheck === false) {
            return;
        }

        me.trigger('startApplyChangeset');
        me.isSyncingDataOnLoad = true;

        const { toAdd, toRemove, toMove, updated, ids } = me.tree ? me.syncTreeDataset(data, idsToCheck) : me.syncFlatDataset(data, idsToCheck);

        let { threshold } = me.syncDataOnLoad,
            surpassed = false;

        // Check if threshold is surpassed
        if (threshold) {
            // Any string is treated as a percentage
            if (typeof threshold === 'string') {
                threshold = parseInt(threshold, 10) / 100 * me.count;
            }

            surpassed = toAdd.length + toRemove.length + toMove.length + updated.length > threshold;
        }

        if (me.tree) {
            // Flat data is spliced into/out of the collection, but in a tree it has to be added/removed from store
            // to end up on correct parents
            if (toAdd.length) {
                // Add all new nodes in one go, will be added to correct parent using `parentId`. Triggering multiple times
                const added = me.add(toAdd, surpassed);

                // parentId was tucked on in syncTreeDataset() to allow the single flat add above, clean it out
                added.forEach(node => node.clearParentId());
            }

            if (toMove.length) {
                for (const { parent, node, index } of toMove) {
                    const newParent = me.getById(parent.id);
                    newParent.insertChild(node, index);
                }
            }

            // Remove in one go, removing from each parent. Triggering multiple times
            me.remove(toRemove, surpassed);
        }
        else {
            if (surpassed) {
                me.suspendEvents();
            }

            // Add and remove, will trigger if below threshold/no threshold
            // We cannot simply splice into our Collection because of the extra
            // processing various Store mixins do in add and remove implementations
            me.remove(toRemove);
            me.add(toAdd);

            if (surpassed) {
                me.resumeEvents();
            }
        }

        // Trigger updates if using threshold, but have not surpassed it. If threshold is not used, the updates
        // are triggered when data is set (avoiding another iteration)
        if (threshold && !surpassed) {
            updated.forEach(({ record, toSet, wasSet }) => me.onModelChange(record, toSet, wasSet));
        }

        // Clear change-tracking
        me.acceptChanges();

        const event = { added : toAdd, removed : toRemove, updated, thresholdSurpassed : surpassed };

        if (me.isFiltered && !me.remoteFilter) {
            // Apply filtering to the next dataset if filtering is local
            me.filter({
                silent : me.isRemoteDataLoading
            });
        }

        if (me.isGrouped) {
            // Announced group
            me.group(null, null, false, true, me.isRemoteDataLoading);
        }
        else if (me.isSorted) {
            // If we updated records in-place, the order may not match what we sent to
            // the server, so silently sort the collection according to our sorters.
            if (me.remoteSort) {
                storage.replaceValues({
                    values : storage.values.sort(me.createSorterFn(me.sorters)),
                    silent : true
                });
            }
            // If we are sorting locally, just do a normal sort
            else {
                me.sort();
            }
        }
        // Neither grouped nor sorted, match order in incoming data?
        else if (me.reorderOnSync) {
            if (!me.tree) {
                // Only bother if data isn't already in order (to avoid unnecessary re-rendering)
                if (storage.values.some((record, index) => ids[record.id] !== index)) {
                    storage.replaceValues({
                        values : storage.values.sort((a, b) => ids[a.id] - ids[b.id]),
                        silent : true
                    });

                    // Announce the sort, unless we will refresh below
                    !surpassed && me.afterPerformSort();
                }
            }
            // Ditto, but not flat data
            else {
                let unsorted = false,
                    i        = 0;
                WalkHelper.preWalk(
                    me.rootNode,
                    n => Array.isArray(n.children) && !unsorted ? n.children : null,
                    node => {
                        if (node.id !== ids[i++]) {
                            unsorted = true;
                        }
                    }
                );

                // Only bother if data isn't already in order (to avoid unnecessary re-rendering)
                if (unsorted) {
                    me.sort((a, b) => ids[a.id] - ids[b.id], undefined, undefined, true);
                    me.clearSorters(true);

                    // Announce the sort, unless we will refresh below
                    !surpassed && me.afterPerformSort();
                }
            }
        }

        // Trigger `batch` if threshold is surpassed, more similar to a batch than a full `dataset`
        if (surpassed) {
            me.trigger('refresh', {
                action   : 'batch',
                data,
                records  : storage.values,
                syncInfo : event
            });
        }

        me.isSyncingDataOnLoad = false;

        me.trigger('endApplyChangeset');
        me.trigger('loadSync', event);
    }

    // Used by syncDataset()
    syncFlatDataset(data, idsToCheck) {
        if (!data) {
            return {
                toRemove : this.records
            };
        }

        const
            me                     = this,
            { idField, allFields } = me.modelClass,
            toRemove               = [],
            toAdd                  = [],
            updated                = [],
            usedIds                = {},
            ids                    = {},
            limitedSet             = idsToCheck instanceof Set;

        const { threshold, keepMissingValues } = me.syncDataOnLoad;
        let hitCount = 0;

        data.forEach((rawData, i) => {
            rawData = rawData.isModel ? rawData.data : rawData;

            const
                id     = rawData[idField],
                record = me.getById(id);

            // Only bother checking for changes if not passed a specific set of ids to check, or if the id is in the set
            if (!limitedSet || idsToCheck.has(id)) {
                // Record exists, might be an update
                if (record) {
                    // Allow app to determine if sync should be performed, it might have better knowledge of the data to
                    // make a cheaper decision. If app has no opinion, we skip checking for changes if we are passed the
                    // same data object as the record already has (happens with data objects in state and useRawData)
                    if (me.shouldSyncRecord ? me.shouldSyncRecord({ record, data : rawData, store : me }) !== false : rawData !== record.data) {
                        // Internal hook
                        me.beforeSyncRecord?.({ record, data : rawData });

                        // Apply default value for any missing fields if configured to do so
                        if (keepMissingValues === false) {
                            for (const field of allFields) {
                                if (!(field.dataSource in rawData) && (field.dataSource in record.data)) {
                                    rawData[field.dataSource] = field.defaultValue;
                                }
                            }
                        }

                        // Update silently if using threshold, otherwise trigger away
                        const wasSet = record.set(rawData, null, Boolean(threshold));
                        if (wasSet) {
                            updated.push({
                                record,
                                wasSet,
                                toSet : rawData
                            });
                        }

                        // Internal hook
                        me.afterSyncRecord?.({ record, data : rawData });
                    }
                }
                // Does not exist, add
                else {
                    toAdd.push(me.processRecord(me.createRecord(rawData)));
                }
            }

            if (record) {
                hitCount++;
            }

            usedIds[id] = 1;
            ids[id] = i;
        });

        // Check removals, unless all records were visited above
        if (hitCount < me.allRecords.filter(x => !x.isSpecialRow).length) {
            // If given a set of ids that should be checked, limit removals to those. Any id not represented in the new
            // dataset will be removed
            if (idsToCheck) {
                for (const id of idsToCheck) {
                    if (!usedIds[id]) {
                        toRemove.push(me.getById(id));
                    }
                }
            }
            // Otherwise, check all records
            else {
                me.forEach(record => {
                    if (!usedIds[record.id]) {
                        toRemove.push(record);
                    }
                }, me, {
                    includeFilteredOutRecords    : true,
                    includeCollapsedGroupRecords : true
                });
            }
        }

        return { toAdd, toRemove, toMove : [], updated, ids };
    }

    // Used by syncDataset()
    syncTreeDataset(data) {
        if (!data) {
            return {
                toRemove : this.records
            };
        }

        const
            me           = this,
            {
                idField,
                parentIdField,
                childrenField,
                allFields
            }            = me.modelClass,
            {
                keepMissingValues,
                threshold
            }            = me.syncDataOnLoad,
            toRemove     = [],
            toAdd        = [],
            toMove       = [],
            updated      = [],
            matchedNodes = new Set(),
            ids          = {};

        let index = 0;

        if (me.transformFlatData) {
            data = me.treeifyFlatData(data);
        }

        WalkHelper.preWalkWithParent({ isRoot : true, id : me.rootNode.id, children : data }, n => n.children, (parent, rawData) => {
            if (parent) {
                const { id, node } = me.resolveSyncNode(rawData);

                // Record exists, might be an update
                if (node) {
                    // Allow app to determine if sync should be performed, it might have better knowledge of the data to
                    // make a cheaper decision. If app has no opinion, we skip checking for changes if we are passed the
                    // same data object as the record already has (happens with data objects in state and useRawData)
                    if (me.shouldSyncRecord ? me.shouldSyncRecord({ record : node, data : rawData, store : me }) !== false : rawData !== node.data) {
                        let childrenUpdated;
                        const oldChildrenValue = node.children;

                        // Edge case: Check for conversion from normal parent to lazy loaded
                        if (oldChildrenValue !== true && rawData[childrenField] === true) {
                            node.clearChildren();
                            node.data[childrenField] = node.children = true;
                            delete rawData[childrenField];
                            me.toggleCollapse(node, true);
                            childrenUpdated = true;
                        }

                        // Changed parent?
                        if (node.parent.id !== parent[idField]) {
                            toMove.push({
                                node,
                                parent,
                                index : parent[childrenField].indexOf(rawData)
                            });
                        }
                        // parentIdField has no default value to not pollute flat data,
                        // assign to root here if no value specified
                        // else if (parent.isRoot && !(parentIdField in rawData)) {
                        //     rawData[parentIdField] = null;
                        // }

                        // Apply default value for any missing fields if configured to do so
                        if (keepMissingValues === false) {
                            for (const field of allFields) {
                                // Ignore parentId, handled above since it has no default
                                if (field.name !== 'parentId' && !(field.dataSource in rawData) && (field.dataSource in node.data)) {
                                    rawData[field.dataSource] = field.defaultValue;
                                }
                            }
                        }

                        if (typeof rawData.expanded === 'boolean') {
                            this.toggleCollapse(node, !rawData.expanded);
                        }

                        // Update silently if using threshold, otherwise trigger away
                        const wasSet = node.set(rawData, null, Boolean(threshold));
                        if (wasSet) {
                            updated.push({
                                record : node,
                                wasSet,
                                toSet  : rawData
                            });
                        }
                        else if (childrenUpdated) {
                            node.signalNodeChanged({
                                [childrenField] : {
                                    value    : true,
                                    oldValue : oldChildrenValue
                                }
                            });
                        }
                    }
                }
                // Does not exist, add
                else {
                    rawData[parentIdField] = parent[idField];

                    toAdd.push({ ...rawData, ...(Array.isArray(rawData[childrenField]) ? { children : [] } : undefined) });
                }

                matchedNodes.add(node);
                ids[id] = index++;
            }
        });

        if (matchedNodes.length !== data.length) {
            me.traverse(node => {
                if (!matchedNodes.has(node)) {
                    toRemove.push(node);
                }
            });
        }

        return { toAdd, toRemove, toMove, updated, ids };
    }

    // ColumnStore overrides this fn to allow syncing by field & type
    resolveSyncNode(rawData) {
        const
            id   = rawData[this.modelClass.idField],
            node = this.getById(id);

        return { id, node };
    }
};
