import Base from '../../Base.js';
import ArrayHelper from '../../helper/ArrayHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';

/**
 * @module Core/data/mixin/StoreChanges
 */

/**
 * Mixin for Store that handles applying changes (presumable from a backend)
 *
 * @mixin
 */
export default Target => class StoreChanges extends (Target || Base) {
    static get $name() {
        return 'StoreChanges';
    }

    static get configurable() {
        return {
            /**
             * Specifies target to filter and sort after applying changeset:
             * * `'changes'` - apply sort and filter to changeset only (see more below)
             * * `'none'` - do not apply sort and filter
             *
             * ### `changes` behavior
             * If the store has filters in effect when the changeset is applied, the following rules will determine how the
             * filtered values are affected:
             * - Among added records, only those that match the filter will be included in the filtered set
             * - Among updated records, those that did not previously match the filter but now do will be added to the filtered set,
             *   and those that did match but no longer do will also remain in the filtered set. This means that new records may
             *   appear in the filtered set as a result of `applyChanges`, but records will not disappear until filters are
             *   re-applied.
             *
             * @default
             * @prp {'changes'|'none'}
             * @category Advanced
             */
            applyChangesetFilterSortTarget : 'changes'
        };
    }

    /**
     * Applies changes from another store to this store. Useful if cloning records in one store to display in a
     * grid in a popup etc. to reflect back changes.
     * @param {Core.data.Store} otherStore
     * @category CRUD
     */
    applyChangesFromStore(otherStore) {
        const
            me          = this,
            { changes } = otherStore;

        if (!changes) {
            return;
        }

        if (changes.added) {
            me.add(changes.added);
        }

        if (changes.removed) {
            // Remove using id, otherwise indexOf in remove fn won't yield correct result
            me.remove(changes.removed.map(r => r.id));
        }

        if (changes.modified) {
            changes.modified.forEach(record => {
                const localRecord = me.getById(record.id);
                localRecord?.set(record.modifications);
            });
        }
    }

    /**
     * Applies a set of changes (presumable from a backend) expressed as an object matching the format outputted by the
     * {@link Core/data/Store#property-changes} property: `{ added : [], modified/updated : [], removed : [] }`
     *
     * `added` is expected to be an array of raw data objects consumable by the stores model class for records to add to
     * the store (see example snippet below).
     *
     * `modified` (or `updated` for compatibility with Schedulers CrudManager) is expected to have the same format as
     * `added`, but should always include the `id` of the record to update.
     *
     * Records that have been created locally and gets assigned a proper id by the backend are expected to also pass a
     * `phantomId` field (name of the field is configurable using the `phantomIdField` arg, more info on phantom ids
     * below), to match it with the current id of a local record (`id` will contain the new id).
     *
     * Note that it is also possible to pass this `phantomId` -> `id` mapping in the `added` array. When encountering a
     * record in that array that already exists in the local store, it will be treated the same was as a record in the
     * `modified` array.
     *
     * `removed` is expected to be an array of objects with the `{ id : xx }` shape. Any matches on an id in the store
     * will be removed, those and any non matches will also be cleared from the change tracking of the store.
     *
     * If the store has filters in effect when the changeset is applied, the following rules will determine how the
     * filtered values are affected:
     * - Among added records, only those that match the filter will be included in the filtered set
     * - Among updated records, those that did not previously match the filter but now do will be added to the filtered set,
     *   and those that did match but no longer do will also remain in the filtered set. This means that new records may
     *   appear in the filtered set as a result of `applyChanges`, but records will not disappear until filters are
     *   re-applied.
     *
     * As an example, consider a store with the following initial state and some operations performed on it:
     *
     * ```javascript
     * // Load some data into the store
     * store.data = [
     *     { id : 1, name : 'Minerva' },
     *     { id : 2, name : 'Mars' },
     *     { id : 3, name : 'Jupiter' }
     * ];
     * // Add a new record. It gets assigned a generated id,
     * // for example 'generated56'
     * store.add({ name : 'Artemis' });
     * // Remove Jupiter
     * store.remove(3);
     * ```
     *
     * After syncing those operations to a custom backend (however you chose to solve it in your application) we might
     * get the following response (see "Transforming a response to the correct format" below if your backend responds
     * in another format):
     *
     * ```javascript
     * const serverResponse = {
     *     added : [
     *         // Added by the backend, will be added locally
     *         { id : 5, name : 'Demeter' }
     *     ],
     *
     *     updated : [
     *         // Will change the name of Minerva -> Athena
     *         { id : 1, name : 'Athena' },
     *         // Will set proper id 4 for Artemis
     *         { $PhantomId : 'generated56', id : 4 }
     *     ],
     *
     *     removed : [
     *         // Confirmed remove of Jupiter
     *         { id : 3 },
     *         // Removed by the backend, Mars will be removed locally
     *         { id : 2 }
     *     ]
     * };
     * ```
     *
     * If that response is then passed to this function:
     *
     * ```javascript
     * store.applyChangeSet(serverResponse);
     * ```
     *
     * The end result will be the following data in the store:
     *
     * ```javascript
     * [
     *     { id : 1, name : 'Athena' }, // Changed name
     *     { id : 4, name : 'Artemis' }, // Got a proper id
     *     { id : 5, name : 'Demeter' } // Added by the backend
     * ]
     * ```
     *
     * ### Phantom ids
     *
     * When a record is created locally, it is always assigned a generated id. That id is called a phantom id (note that
     * it is assigned to the normal id field). When passing the new record to the backend, the id is sent with it. When
     * the backend inserts the record into the database, it (normally) gets a proper id assigned. That id then needs to
     * be passed back in the response, to update the local record with the correct id. Making sure that future updates
     * match the correct row in the database.
     *
     * For example a newly created record should be passed similar to this to the backend (pseudo format, up to the
     * application/backend to decide):
     *
     * ```json
     * {
     *     "added" : {
     *         "id" : "generated79",
     *         "name" : "Hercules",
     *         ...
     *     }
     * }
     * ```
     *
     * For the backend response to be applicable for this function, it should then respond with:
     *
     * ```json
     * {
     *     "updated" : {
     *         {
     *             "$PhantomId" : "generated79",
     *             "id" : 465
     *         }
     *     }
     * }
     * ```
     *
     * (Or, as stated above, it can also be passed in the "added" array. Which ever suits your backend best).
     *
     * This function will then change the id of the local record using the phantom id `generated79` to `465`.
     *
     * ### Transforming a response to the correct format
     *
     * This function optionally accepts a `transformFn`, a function that will be called with the `changes`. It is
     * expected to return a changeset in the format described above (`{ added : [], updated : [], removed : [] }`),
     * which then will be used to apply the changes.
     *
     * Consider the following "non standard" (made up) changeset:
     *
     * ```javascript
     * const changes = {
     *     // Database ids for records previously added locally
     *     assignedIds : {
     *         'phantom1' : 10,
     *         'phantom2' : 15
     *     },
     *     // Ids records removed by the backend
     *     removed : [11, 27],
     *     // Modified records, keyed by id
     *     altered : {
     *         12 : { name : 'Changed' }
     *     },
     *     // New records, keyed by id
     *     inserted : {
     *         20  : { name : 'New' }
     *     }
     * }
     * ```
     *
     * Since it does not match the expected format it has to be transformed:
     *
     * ```javascript
     * store.applyChangeset(changes, ({ assignedIds, inserted, altered, removed }) => ({
     *    // Convert inserted to [{ id : 20, name : 'New' }]
     *    added : Object.entries(inserted).map(([id, data] => ({ id, ...data }),
     *    updated : [
     *        // Convert assignedIds to [{ $PhantomId : 'phantom1', id : 10 }, ...]
     *       ...Object.entries(assignedIds).map(([phantomId, id])) => ({ $PhantomId : phantomId, id }),
     *       // Convert altered to [{ id : 12, name : 'Changed' }]
     *       ...Object.entries(modified).map(([id, data] => ({ id, ...data })
     *    ],
     *    // Convert removed to [{ id : 11 }, ...]
     *    removed : removed.map(id => ({ id }))
     * }));
     * ```
     *
     * The transform function above would output:
     *
     * ```javascript
     * {
     *     added : [
     *         {  id : 20, name : 'New' }
     *     ],
     *     updated : [
     *         { $PhantomId : 'phantom1', id : 10 },
     *         { $PhantomId : 'phantom2', id : 15 },
     *         {  id : 12, name : 'Changed' }
     *     ],
     *     removed : [
     *        { id : 11 },
     *        { id : 12 }
     *     ]
     * }
     * ```
     *
     * And that format can then be applied.
     *
     * @param {Object} changes Changeset to apply to the store, see specification above
     * @param {Function} [transformFn] Optional function used to preprocess a changeset in a different format,
     * should return an object with the format expected by this function (see above)
     * @param {String} [phantomIdField] Field used by the backend when communicating a record being assigned a proper id
     * instead of a phantom id (see above)
     * @privateparam {Boolean} [remote] Set to true to indicate changes are from the remote source. Remote changes have
     * precedence over local.
     * @privateparam {Boolean} [logChanges] Used by CrudManager to be able to revert specific changes later
     * @category CRUD
     */
    applyChangeset(changes, transformFn = null, phantomIdField = '$PhantomId', remote = true, logChanges = false) {
        const
            me                                    = this,
            { added, updated, modified, removed } = transformFn?.(changes, me) ?? changes,
            // To support both updated & modified (store uses modified, CM updated)
            altered                               = updated ?? modified ?? [],
            idDataSource                          = me.modelClass.getFieldDataSource('id'),
            parentIdDataSource                    = me.modelClass.getFieldDataSource('parentId'),
            log                                   = logChanges ? new Map() : null,
            allAdded                              = [],
            allAltered                            = [];

        let rootUpdated = false, modifiedParents = [];

        me.trigger('startApplyChangeset');
        // Store currently visible records to keep records which no longer match filter in view
        me._groupVisibleRecordIds = [];
        // We only need this for grouped store which cannot be a tree store
        me.isGrouped && me.forEach(record => {
            me._groupVisibleRecordIds.push(record.id);
        });

        // Process added records
        if (added?.length > 0) {
            const
                toUpdate = [],
                toAdd    = [];

            // Separate actually new records from added records that get a proper id set up, to match more backends
            for (const data of added) {
                if (me.getById(data[phantomIdField]) || me.getById(ObjectHelper.getPath(data, idDataSource))) {
                    // we need to keep order of the added records
                    // https://github.com/bryntum/support/issues/5189
                    toUpdate.push(data);
                }
                else {
                    toAdd.push(data);
                }
            }

            altered.unshift.apply(altered, toUpdate);

            // it's too early to sort immediately on add here, because there might be updated record
            // which also affect sorting, so it's too early to sort at this point
            // we will apply sort after all changes are applied
            const prevReapplySortersOnAdd = me.reapplySortersOnAdd;
            me.reapplySortersOnAdd = false;

            // Create new records in the store, and clear them out of the added bag
            // When applying remote changes we do not want to update ordered tree index until all
            // add/update/remove action are finalized. After that we can sort it correctly.
            const addedRecords = me.add(toAdd, false, { orderedParentIndex : { skip : true }, clean : remote }) ?? [];
            allAdded.push(...addedRecords);

            me.reapplySortersOnAdd = prevReapplySortersOnAdd;

            if (me.tree) {
                // Go over added records and find all parents which children are modified in case
                // we need to restore ordered tree
                for (const record of addedRecords) {
                    const { parent } = record;

                    // If root WBS should be updated
                    if (parent.isRoot) {
                        rootUpdated = true;
                        modifiedParents = [parent];
                        break;
                    }

                    if (!parent.isRoot && modifiedParents.every(r => !r.contains(parent))) {
                        modifiedParents.push(parent);
                    }
                }
            }

            for (const record of addedRecords) {
                log?.set(record.id, record.data);
                record.internalClearChanges();
            }
        }

        // Process modified records
        if (altered?.length > 0) {
            for (const data of altered) {
                const
                    phantomId = data[phantomIdField],
                    id        = ObjectHelper.getPath(data, idDataSource),
                    parentId  = ObjectHelper.getPath(data, parentIdDataSource),
                    record    = me.getById(phantomId) ?? me.getById(id);

                // Matching an existing record -> update it
                if (record) {
                    const newParentWasLeaf = parentId != null ? me.getById(parentId)?.isLeaf : false;

                    const changes = record.applyChangeset(data, phantomIdField, remote);

                    if (newParentWasLeaf) {
                        me.toggleCollapse(record.parent, false);
                    }

                    // If current record is not part of tree already scheduled to ordering, add it
                    if (me.tree && !rootUpdated && modifiedParents.every(r => !r.contains(record))) {
                        if (record.parent.isRoot) {
                            rootUpdated = true;
                            modifiedParents = [record.parent];
                        }
                        else {
                            modifiedParents.push(record.parent);
                        }
                    }

                    log?.set(id, changes);
                    allAltered.push(record);
                }
            }
        }

        // Process removed records
        if (removed?.length > 0) {
            me.applyRemovals(removed);
        }

        if (me.applyChangesetFilterSortTarget === 'changes') {
            const parentsModifiedByFilter = me.filterChangeset(allAdded, allAltered);
            modifiedParents.push(...parentsModifiedByFilter);
        }

        me.afterChangesetApplied(modifiedParents);

        if (me.tree && me.isSorted && me.reapplySortersOnAdd && (added?.length || altered?.length)) {
            // perhaps should be doing just `me.sort()` here
            // however, this code is more efficient - only the changed parents are re-sorted
            // the `storage` collection is updated fully though

            const refreshed = new Set();

            modifiedParents.forEach(record => {
                if (refreshed.has(record)) {
                    return;
                }
                refreshed.add(record);

                record.sortVisibleChildren(false, me.sorterFn);
                record.sortUnfilteredChildren(false, me.sorterFn);
            });

            // update the flat store fully, don't bother with incremental update for every `modifiedParent`
            me.storage.replaceValues({
                values : me.collectDescendants(me.rootNode).visible,
                silent : true
            });

            me.afterPerformSort(false);
        }

        me._groupVisibleRecordIds = null;

        me.trigger('endApplyChangeset');
        return log;
    }

    afterChangesetApplied(modifiedParents) {
        const visited = new Set();

        // Can we always safely use ordered tree?
        modifiedParents.forEach(parent => {
            if (visited.has(parent)) {
                return;
            }

            parent.traverse(record => {
                if (visited.has(record)) {
                    return;
                }

                visited.add(record);

                record.sortOrderedChildren(false, false);

                // Parent index from the remote source might have been applied, in which case
                // we need to update local index because we do not want any movements in the tree
                if (record.children) {
                    record.updateChildrenIndices(record.children, 'parentIndex', true);
                }
                if (record.unfilteredChildren) {
                    record.updateChildrenIndices(record.unfilteredChildren, 'unfilteredIndex', true);
                }
            });
        });
    }

    // Apply removals, removing records and updating the `removed` bag to match.
    //
    // Accepts an array of objects containing an `id` property. Records in the store matching an entry in the array
    // will be removed from the store and the `removed` bag. Unmatched entries will be removed from the `removed` bag.
    applyRemovals(removals) {
        const
            me                         = this,
            { removed : removedStash } = me,
            idDataSource               = me.modelClass.idField,
            toRemove                   = [];

        for (const removedEntry of removals) {
            const id = ObjectHelper.getPath(removedEntry, idDataSource);

            // Removed locally and confirmed by server, just remove the record from the removed stash
            if (removedStash.includes(id)) {
                const record = removedStash.get(id);

                // also clear the `meta.modified` object for such record, since after applying remote response
                // all changes are supposed to be cleared

                // fix for https://github.com/bryntum/support/issues/7344
                // covered with `Should correctly track changes after undo/redo` in `Gantt/tests/data_components/UndoRedo.t.js`
                record.internalClearChanges(false, true, null);
                record.$isPhantom = true;

                removedStash.remove(id);
            }
            // Server driven removal (most likely), collect for removal locally too
            else  {
                toRemove.push(id);
            }
        }

        if (me.tree) {
            const modifiedParents = toRemove.reduce((parents, id) => {
                if (me.getById(id)) {
                    parents.add(me.getById(id).parentNode ?? me.rootNode);
                }
                return parents;
            }, new Set());

            // Sort ordered tree before removing records
            // https://github.com/bryntum/support/issues/9181
            modifiedParents.forEach(parent => parent.sortOrderedChildren(false, false));
        }

        // Remove collected records in one go
        me.remove(toRemove);

        // Leave no trace of them at all
        for (const record of toRemove) {
            removedStash.remove(record);
        }
    }

    /**
     * Filters records that have been added/updated as part of a changeset. The `added` and `updated` parameters
     * are arrays of values that have already been added/updated in the Collection's values. This method brings
     * the Collection's `_filteredValues` in sync without performing a full sort or filter, using the following rules:
     *
     * - Added records that do not match the filter are removed from _filteredValues
     *
     * - Updated records that now match the filter are inserted at the correct position in _filteredValues
     *   if they were not formerly included
     *
     * - Updated records that formerly matched the filter, but now do not, are NOT removed from _filteredValues
     *
     * If the collection is sorted, either on its own or via a sort applied at the store level, that sort order is
     * respected when adding items to _filteredValues. If not, items are inserted in the same order they occur in
     * _values.
     *
     * @param {Object[]} added An array of unique values that were added as part of the changeset.
     * @param {Object[]} updated An array of unique values that were updated as part of the changeset.
     * @returns {Object[]} Any records that were added or removed from view, or whose children were modified.
     * @private
     */
    filterChangeset(added, updated) {
        const
            me = this,
            {
                isFiltered,
                tree,
                isGrouped,
                filtersFunction
            } = me,
            storeSortFunction = me.isSorted ? me.createSorterFn(me.sorters) : undefined,
            {
                allValues,
                addedValues,
                isSorted
            } = me.storage,
            sorter = storeSortFunction != null || isSorted ? storeSortFunction ?? me.storage.sortFunction : null,
            modifiedParents = new Set();

        if (!isFiltered) {
            return [];
        }

        let trigger = false, groupers;

        // When groups are involved we always rebuild them entirely. We need to store groupers, remove them to get flat
        // store, apply flat store logic regarding filtering changes, and then re-group store again
        // https://github.com/bryntum/support/issues/6134
        if (isGrouped) {
            groupers = me.groupers;
            me.clearGroupers(true);
        }

        if (tree) {
            const nodesToInclude = new Set(updated.filter(filtersFunction));

            // Tree store does not automatically include new filter-matching nested descendants inside
            // collapsed branches; we must make sure they and their ancestors are all included in the filtered set
            for (const matchingAdd of added.filter(filtersFunction)) {
                nodesToInclude.add(matchingAdd);
            }

            // Expand to include all ancestors of included rows
            nodesToInclude.forEach(node => node.bubble(ancestor => nodesToInclude.add(ancestor)));
            nodesToInclude.delete(me.rootNode);

            const nodesToIncludeByParent = ArrayHelper.groupByIndexed(
                // filter out the nodes that are already included to `children`
                Array.from(nodesToInclude).filter(child => !child.parent?.children?.includes(child)),
                r => r.parent
            );

            for (const [parent, siblingsToInclude] of nodesToIncludeByParent) {
                // If `unfilteredChildren` is null, we assume `children` already contains all available children
                if (parent.unfilteredChildren) {
                    // Ignore ordering here and just append non-duplicates to `children`
                    // here we rely on order-keeping feature of the JS Set implementation (for `siblingsToInclude`)
                    parent.children.push(...siblingsToInclude);
                    modifiedParents.add(parent); // Remember that we modified this, to re-sort later
                    me.traverseFilter(parent, false, siblingsToInclude);
                }
            }
        }
        // If store is grouped, sorter will be applied anyway
        else if (sorter && !isGrouped) {
            // Non-tree, sorted store
            // Current approach is to divide the filtered list into a "sorted" head and an unsorted tail (items added
            // since last sort). Insert the newly-matching items into the sorted part, re-sort that, then re-append
            // the unsorted tail
            const
                // Must wait to read filteredValues after clearGroupers
                { filteredValues } = me.storage,
                sortedLength = addedValues
                    ? (filteredValues.findLastIndex(value => !addedValues.has(value)) + 1)
                    : filteredValues.length,
                sorted = filteredValues.slice(0, sortedLength),
                updatedMatches = new Set(updated.filter(filtersFunction));
            for (const value of filteredValues) {
                if (updatedMatches.has(value)) {
                    updatedMatches.delete(value);
                }
            }
            for (const newMatch of updatedMatches) {
                sorted.push(newMatch);
            }
            sorted.sort(sorter);
            filteredValues.splice(0, sortedLength, ...sorted);
            trigger = true;
        }
        else {
            // Non-tree, non-sorted store
            // Move through filtered and unfiltered lists in order, inserting raw value into filtered list whenever one
            // is encountered that's in the set of matching, updated values
            const updatedMatches = updated.filter(item =>
                filtersFunction(item) && !me.storage.includes(item));
            if (updatedMatches.length > 0) {
                me.includeInSubset(allValues, me.storage.filteredValues, updatedMatches);
                trigger = true;
            }
        }

        // Un-show non-matching added records
        const nonMatchingAdds = new Set(added.filter(value => !filtersFunction(value)));
        if (nonMatchingAdds.size > 0) {
            if (tree) {
                for (const addedChild of nonMatchingAdds) {
                    ArrayHelper.remove(addedChild.parent.children, addedChild);
                    modifiedParents.add(addedChild.parent);
                }
            }
            else {
                ArrayHelper.remove(me.storage.filteredValues, nonMatchingAdds);
            }
            trigger = true;
        }

        if (groupers) {
            me.group(groupers[0], null, false, true, true);
            trigger = true;
        }

        if (tree && modifiedParents.size > 0) {
            me.storage.replaceValues({
                values : me.collectDescendants(me.rootNode).visible,
                silent : true
            });
        }
        else if (trigger) {
            // Storage content has changed, clear idMap to rebuild it
            me._idMap = null;
            me.trigger('refresh');
        }

        return [...modifiedParents];
    }

    /**
     * Given an array `all`, an array `subset` that is a subset of `all` in the same order, and another array
     * `toInclude` that is a different subset of `all` disjoint with `subset`, add each item from `toInclude`
     * to `subset`, in an order matching the order in `all`. The order of `subset` must match the order of `all`.
     * The order of `toInclude` is unimportant.
     *
     * Modifies `subset` in-place.
     *
     * @param {Array} all An array of unique items (e.g. records)
     * @param {Array} subset An array containing a subset of the items in `all` (same order as `all`)
     * @param {Array} toInclude An array or items from `all` that should be included in `subset` (unordered)
     * @returns {Array} The subset modified in-place.
     * @private
     */
    includeInSubset(all, subset, toInclude) {
        const toIncludeSet = new Set(toInclude);
        let
            subsetIndex = 0,
            allIndex = 0,
            done = toIncludeSet.size === 0;
        while (allIndex < all.length && !done) {
            const subsetItem = subset[subsetIndex];
            let allItem = all[allIndex];
            // Move ahead in raw list until we find the matching item, inserting new items along the way
            while (subsetItem !== allItem) {
                if (toIncludeSet.has(allItem)) {
                    subset.splice(subsetIndex, 0, allItem);
                    subsetIndex++;
                    toIncludeSet.delete(allItem);
                    done = toIncludeSet.size === 0;
                }
                allItem = all[++allIndex];
            }
            // Ignore "to include" items that are already in the subset (prevents duplicates)
            if (toIncludeSet.has(subsetItem)) {
                toIncludeSet.delete(subsetItem);
            }
            // Keep going in filtered list
            if (subsetIndex < subset.length) {
                subsetIndex++;
            }
        }
        return subset;
    }
};
