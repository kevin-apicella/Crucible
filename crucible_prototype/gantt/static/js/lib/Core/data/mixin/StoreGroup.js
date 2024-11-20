import Base from '../../Base.js';
import ArrayHelper from '../../helper/ArrayHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';
import StringHelper from '../../helper/StringHelper.js';
import Collection from '../../util/Collection.js';

/**
 * @module Core/data/mixin/StoreGroup
 */

const
    resortActions      = {
        add     : 1,
        replace : 1
    },
    defaultGroupSortFn = ({ _groupValue : lhs }, { _groupValue : rhs }) => lhs < rhs ? -1 : lhs > rhs ? 1 : 0,
    arrayAt = (array, index) => array[index < 0 ? array.length + index : index];

/**
 * An immutable object representing a store grouper.
 *
 * @typedef {Object} Grouper
 * @property {String} field Field name
 * @property {Boolean} [ascending=true] `true` to group ascending, `false` to group descending
 */

/**
 * Mixin for Store that handles grouping.
 *
 * ```javascript
 * // simple grouper
 * store.group('city');
 *
 * // grouper as object, descending order
 * store.group({ field : 'city', ascending : false });
 *
 * // using custom sorting function
 * store.group({
 *     field : 'city',
 *     fn : (recordA, recordB) => {
 *         // apply custom logic, for example:
 *         return recordA.city.length < recordB.city.length ? -1 : 1;
 *     }
 * });
 * ```
 *
 * Currently grouping is not supported when using pagination, the underlying store cannot group data that is split into pages.
 *
 * @mixin
 */
export default Target => class StoreGroup extends (Target || Base) {
    static $name = 'StoreGroup';

    //region Config

    static configurable = {
        /**
         * Currently used groupers.
         * To set groupers when remote sorting is enabled by {@link Core/data/AjaxStore#config-sortParamName} you should
         * use {@link #function-setGroupers} instead to be able to wait for the operation to finish.
         * @member {Grouper[]} groupers
         * @category Sort, group & filter
         */
        /**
         * Initial groupers, specify to have store grouped automatically after initially setting data
         * @config {Grouper[]}
         * @category Common
         */
        groupers : null,

        useGroupFooters : false,

        /**
         * To have all groups __initially loaded__ start collapsed, configure this as `true`.
         *
         * Note that this only affects the initial load of the store. Subsequent reloads maintain
         * current group state where possible.
         * @config {Boolean}
         * @default false
         * @category Advanced
         */
        startGroupsCollapsed : null
    };

    static get properties() {
        return {
            collapsedGroups : new Set()
        };
    }

    //endregion

    //region Init

    construct(config) {
        super.construct(config);

        // For handling record mutation, *not* add/remove of records.
        // Sorts dataset if necessary.
        this.ion({ change : 'onDataChanged', thisObj : this });
    }

    get GroupRow() {
        return this._GroupRowClass || (this._GroupRowClass = class extends this.modelClass {
            static isSpecialRow = true;

            // The calculated group value for this group header/footer.
            static fields = [{
                name : '_groupValue'
            }];

            get isCollapsed() {
                return this.meta.collapsed;
            }
        });
    }

    updateGroupers(groupers) {
        this.setGroupers(groupers);
    }

    /**
     * Set groupers.
     * @param {Grouper[]} groupers Array of groupers to apply to store
     * @returns {Promise|null} If {@link Core/data/AjaxStore#config-sortParamName} is set on store, this method returns
     * `Promise` which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @category Sort, group & filter
     */
    setGroupers(groupers, options = null) {
        const
            me         = this,
            { storage } = me;

        let result;

        if (groupers?.length) {
            me._groupers = groupers.map(g => me.createGrouper(g));
        }
        else if (me.groupers) {
            delete me._groupers;

            me.includeCollapsed();

            storage.replaceValues({
                values         : me.removeHeadersAndFooters(storage._values),
                filteredValues : storage.isFiltered ? me.removeHeadersAndFooters(storage._filteredValues) : null,
                silent         : true
            });

            result = me.group(null, null, null, false, options?.silent);
        }

        // Need to clear the id map so it gets rebuilt next time its accessed
        me._idMap = null;
        return result;
    }

    createGrouper(grouper) {
        if (!grouper || grouper.isGrouper) {
            return grouper;
        }
        if (typeof grouper === 'string') {
            grouper = {
                field : grouper
            };
        }

        const
            { field }      = grouper,
            dotPos         = field?.indexOf('.'),
            complexMapping = dotPos > 0,
            path           = field?.split('.'),
            rootFieldName  = complexMapping ? path[0] : field,
            leafFieldName  = complexMapping ? arrayAt(path, -1) : field,
            fieldPath      = complexMapping ? field.slice(dotPos + 1) : field;

        return {
            isGrouper : true,
            ...grouper,
            complexMapping,
            rootFieldName,
            leafFieldName,
            fieldPath
        };
    }

    get unfilteredGroupRecords() {
        const me = this;

        if (me.isGrouped) {
            const { generation } = me.storage;

            if (me._unfilteredGroupRecords?.generation !== generation) {
                me._unfilteredGroupRecords = me.storage.allValues.filter(r => r.isSpecialRow);
                me._unfilteredGroupRecords.generation = generation;
            }
        }

        return me._unfilteredGroupRecords || [];
    }

    /**
     * Returns group header record for the passed record or last group header in the store
     * @param {Core.data.Model} [targetRecord]
     * @param {Boolean} [ignoreFilter] Pass true to search in the complete collection
     * @returns {Core.data.Model}
     * @internal
     */
    getGroupHeaderForRecord(targetRecord, ignoreFilter = false) {
        if (this.isGrouped) {
            return targetRecord ? (targetRecord.meta.groupRowFor ? targetRecord : targetRecord.groupParent.get(this.id)) : this.groupRecords.last;
        }
    }

    // Temporarily include records from collapsed groups, for example prior to filtering
    includeCollapsed() {
        for (const groupId of this.collapsedGroups) {
            this.expand(this.getById(groupId), false);
        }
    }

    // Exclude records in collapsed groups, intended to be used after a call to includeCollapsed()
    excludeCollapsed() {
        for (const groupId of this.collapsedGroups) {
            this.collapse(this.getById(groupId));
        }
    }

    onDataChange({ source : storage, action, removed }) {
        const
            me           = this,
            { groupers } = me;

        // Only do grouping transformations if we have groupers to apply.
        // In stores which never use grouping, this code is superfluous and will reduce performance.
        // The else side will simply replace the ungrouped data with itself.
        if (groupers) {
            // When records are added or removed, re-evaluate the group records
            // so that when the events are fired by the super call, the group
            // records are in place.
            if (groupers.length) {
                if ((action === 'splice' && removed?.length) || action === 'move') {
                    storage.replaceValues({
                        ...me.prepareGroupRecords(),
                        silent : true
                    });
                }
            }
            // Remove all group headers and footers
            else {
                storage.replaceValues({
                    values         : me.removeHeadersAndFooters(storage._values),
                    filteredValues : storage.isFiltered ? me.removeHeadersAndFooters(storage._filteredValues) : null,
                    silent         : true
                });
            }
        }

        super.onDataChange?.(...arguments);
    }

    move(records, beforeRecord) {
        const me = this;

        if (me.isGrouped && !me.tree) {
            let prevRecord = beforeRecord;

            if (beforeRecord?.isSpecialRow) {
                prevRecord = me.getPrev(beforeRecord, false, false);

                if (!prevRecord) {
                    // Trying to move above first group header, no-op
                    return;
                }
            }

            // Target group header always exists
            const
                targetGroupHeader         = me.getGroupHeaderForRecord(prevRecord),
                groupField                = me.groupers[0].field,
                newGroupValue             = targetGroupHeader.meta.groupRowFor,
                { reapplyFilterOnUpdate } = me;

            // Disable reapply filter on update because it will rebuild groups faster than we need. Groups will be
            // updated in super.move call anyway
            me.reapplyFilterOnUpdate = false;

            me.beginBatch();

            records.forEach(record => record.setValue(groupField, newGroupValue));

            me.endBatch();

            me.reapplyFilterOnUpdate = reapplyFilterOnUpdate;

            // If store is filtered, we might have hidden groups between target group header and `beforeRecord`. To
            // make move safe we need to find new target group (visible) and find next group in the unfiltered
            // collection. But only if `beforeRecord is a group header
            if (me.isFiltered && beforeRecord?.isSpecialRow) {
                const
                    { unfilteredGroupRecords } = me,
                    // Find index of the group header we're moving record into
                    index = unfilteredGroupRecords.indexOf(targetGroupHeader);

                // If `beforeRecord` exists, index cannot point to the last group in the store, meaning we can
                // safely access element at index + 1
                beforeRecord = unfilteredGroupRecords[index + 1];
            }
        }

        super.move(records, beforeRecord);
    }

    // private function that collapses on the data level
    collapse(groupRecord) {
        if (groupRecord && !groupRecord.meta.collapsed) {
            this.excludeGroupRecords(groupRecord);
            groupRecord.meta.collapsed = true;
            // Track which groups are collapsed
            this.collapsedGroups.add(groupRecord.id);

            this.trigger('toggleGroup', { groupRecord, collapse : true });

            return true;
        }
        return false;
    }

    // private function that expands on the data level
    expand(groupRecord, updateMap = true) {
        if (groupRecord?.meta.collapsed) {
            this.includeGroupRecords(groupRecord);
            groupRecord.meta.collapsed = false;
            // Optionally track which groups are collapsed (not done when expanding temporarily prior to filtering etc)
            updateMap && this.collapsedGroups.delete(groupRecord.id);

            updateMap && this.trigger('toggleGroup', { groupRecord, collapse : false });

            return true;
        }
        return false;
    }

    removeHeadersAndFooters(records) {
        return records.filter(r => {
            // Clear down a group header's children so it is reusable
            if (r.unfilteredGroupChildren) {
                r.groupChildren.length = r.unfilteredGroupChildren.length = r.meta.childCount = 0;
            }

            // Remove the group headers/footers and any linked records which may have been
            // interpolated due to a record being a member of two groups.
            // Unregister them. If they are reused, they will be registered.
            if (r.isSpecialRow || (r.isLinked && r.groupParent?.get(this.id))) {
                this.unregister(r);
                return false;
            }
            return true;
        });
    }

    prepareGroupRecords() {
        const
            me                = this,
            {
                GroupRow,
                isFiltered,
                reapplyFilterOnUpdate,
                groupRecords
            }                 = me,
            grouper           = me.groupers[0],
            multiplier        = grouper.ascending !== false ? 1 : -1,
            {
                field,
                fn : groupSortFn = defaultGroupSortFn,
                leafFieldName
            }                 = grouper,
            byFn              = typeof field === 'function',
            groupingById      = field === me.modelClass.idField,
            newGroupRecords   = new Collection(),
            // this property is set by StoreChanges mixin to keep in view records which were visible prior to
            // `applyChangeset` call but after update no longer match the filter
            visibleRecordsIds = me._groupVisibleRecordIds || [],
            isVisible         = (record) => {
                const matchesFilter = !isFiltered || me.filtersFunction(record);

                return reapplyFilterOnUpdate ? matchesFilter : (matchesFilter || visibleRecordsIds.includes(record.id));
            },
            collapseAll = Boolean(me.startGroupsCollapsed && !groupRecords?.count);

        // Expand collapsed groups back into the storage to that groups can be rebuilt.
        groupRecords?.forEach(groupRec => {
            if (groupRec.isCollapsed) {
                me.includeGroupRecords(groupRec);
            }
        });

        const records = me.removeHeadersAndFooters(me.storage._values);

        // Ensure main Store sorters are applied before we extract the groups and groupChildren
        if (me.sorters.length) {
            records.sort(me.sorterFn);
        }

        // Update filters function
        if (isFiltered) {
            me.filtersFunction = null;
        }

        // Collect new group records into which we will go on to add groupChildren
        records.forEach(rec => {
            const
                original    = rec,
                v           = byFn ? field(rec) : rec.getValue(field),
                groupValues = ArrayHelper.asArray(v == undefined ? '!!novalue!!' : v),
                multiValue  = Array.isArray(groupValues),
                emptyArray  = multiValue && !groupValues.length,
                length      = emptyArray ? 1 : groupValues.length;

            for (let i = 0; i < length; i++) {
                const
                    groupValue = emptyArray ? [] : groupValues[i],
                    id         = `group-header-${typeof groupValue === 'number' ? groupValue : StringHelper.createId(groupValue)}`;

                // If we already have a group record for this group, use it.
                let groupRec = newGroupRecords.get(id);

                // If not, reuse the previous group record for this group, or create a new one
                if (!groupRec) {
                    groupRec = groupRecords?.get(id) || new GroupRow({
                        [me.modelClass.idField]             : id,
                        [groupingById ? '' : leafFieldName] : groupValue,
                        _groupValue                         : groupValue
                    }, me, {
                        collapsed   : collapseAll,
                        specialRow  : true,
                        groupRowFor : groupValue,
                        groupField  : leafFieldName,
                        emptyArray
                    });

                    // Put it in the new group set
                    newGroupRecords.add(groupRec);

                    // It needs clearing
                    groupRec.meta.childCount = 0;
                    groupRec.groupChildren = [];
                    groupRec.unfilteredGroupChildren = [];

                    // Used by indexOf to determine if part of store
                    groupRec.stores = [me];
                }

                me.register(groupRec);



                // When in multiple groups, child records are links
                if (i > 0) {
                    const links = original.groupLinks || (original.groupLinks = []);
                    rec = links[groupValue] || (links[groupValue] = original.link());
                    rec.stores = [me];
                    me.register(rec);
                }

                // Set silently. DOM must not be updated from here
                if (!rec.groupParent) {
                    rec.setData('groupParent', new Map());
                }
                rec.groupParent.set(me.id, groupRec);

                // Add the record to its group parent if it's filtered in
                if (isVisible(rec)) {
                    groupRec.groupChildren.push(rec);
                    groupRec.meta.childCount++;
                }

                groupRec.unfilteredGroupChildren.push(rec);
            }
        });

        // Sort the groups by the calculated group value
        newGroupRecords._values.sort((lhs, rhs) => groupSortFn(lhs, rhs) * multiplier);

        // Now that all the groups have all their groupChildren, we can calculate the footers
        if (me.useGroupFooters) {
            for (let index = 0, length = newGroupRecords.count; index < length; index++) {
                const
                    groupRec = newGroupRecords.values[index],
                    val    = groupRec.meta.groupRowFor,
                    id     = `group-footer-${typeof val === 'number' ? val : StringHelper.createId(val)}`,
                    footer = me.getById(id) || new GroupRow({
                        [me.modelClass.idField]             : id,
                        [groupingById ? '' : leafFieldName] : val,
                        _groupValue                         : val
                    }, me, {
                        specialRow     : true,
                        groupFooterFor : val,
                        groupRecord    : groupRec
                    });

                // Used by indexOf to determine if part of store
                footer.stores = [me];

                me.register(footer);
                footer.groupChildren = groupRec.groupChildren;

                // Inject the group footer record after the group header record
                newGroupRecords.splice(++index, 0, footer);
                length++;

                // Add the footer to the  children of the group header
                groupRec.groupChildren.push(footer);
                groupRec.unfilteredGroupChildren.push(footer);
                groupRec.meta.childCount++;
            }
        }

        me._idMap = null;

        // Unroll all the groups into the result array
        const result = {
            values : newGroupRecords.reduce((result, groupRec) => {
                if (!groupRec.isGroupFooter) {
                    result.push(groupRec);
                    if (!groupRec.meta.collapsed) {
                        result.push(...groupRec.unfilteredGroupChildren);
                    }
                }
                return result;
            }, false, [])
        };

        if (isFiltered) {
            result.filteredValues = result.values.filter(isVisible);
        }

        // Ensure obsolete group records are destroyed.
        me.groupRecords?.forEach(oldGroupRec => {
            if (!newGroupRecords.includes(oldGroupRec)) {
                oldGroupRec.destroy();
            }
        });

        // Our new group set
        me.groupRecords = newGroupRecords;

        return result;
    }

    //endregion

    //region Group and ungroup

    /**
     * Is store currently grouped?
     * @property {Boolean}
     * @readonly
     * @category Sort, group & filter
     */
    get isGrouped() {
        return Boolean(this.groupers?.length);
    }

    /**
     * Group records, either by replacing current sorters or by adding to them.
     * A grouper can specify a **_custom sorting function_** which will be called with arguments (recordA, recordB).
     * Works in the same way as a standard array sorter, except that returning `null` triggers the stores
     * normal sorting routine. Grouped store **must** always be sorted by the same field.
     *
     * ```javascript
     * // simple grouper
     * store.group('city');
     *
     * // grouper as object, descending order
     * store.group({ field : 'city', ascending : false });
     *
     * // using custom sorting function
     * store.group({
     *     field : 'city',
     *     fn : (recordA, recordB) => {
     *         // apply custom logic, for example:
     *         return recordA.city.length < recordB.city.length ? -1 : 1;
     *     }
     * });
     * ```
     *
     * @param {String|Object} field Field to group by.
     * Can also be a config containing a field to group by and a custom sorting function called `fn`.
     * @param {String} field.field Field to group by
     * @param {Function} field.fn Custom sorting function
     * @param {Boolean} field.ascending  Sort order of the group titles
     * @param {Boolean} [ascending] Sort order of the group titles
     * @param {Boolean} [add] Add a grouper (true) or use only this grouper (false)
     * @param {Boolean} [performSort] Trigger sort directly, which does the actual grouping
     * @param {Boolean} [silent] Set as true to not fire events
     * @category Sort, group & filter
     * @fires group
     * @fires Core.data.Store#event-refresh
     * @returns {Promise|null} If {@link Core/data/AjaxStore#config-sortParamName} is set on store, this method returns `Promise`
     * which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     */
    group(field, ascending, add = false, performSort = true, silent = false) {
        const
            me      = this,
            grouper = me.createGrouper(field);

        let newGrouper;

        if (add) {
            me.groupers.push(grouper);
        }
        else if (field) {
            if (ascending == null && !('ascending' in grouper)) {
                grouper.ascending = grouper.fn && me.groupInfo?.field === grouper.field && me.groupInfo?.fn === grouper.fn ? !me.groupInfo.ascending : true;
            }

            me.groupInfo = newGrouper = grouper;
            me.groupers = [me.groupInfo];
        }

        if (newGrouper) {
            const { prototype } = me.modelClass;

            // Create a getter for complex field names like "get resource.city"
            if (newGrouper.complexMapping && !Object.prototype.hasOwnProperty.call(prototype, field)) {
                Object.defineProperty(prototype, field, {
                    get() {
                        return ObjectHelper.getPath(this, field);
                    }
                });
            }
        }

        // as far as the store is concerned, grouping is just more sorting. so trigger sort
        if (performSort !== false) {
            if (me.remoteSort && !me.isRemoteDataLoading) {
                return me.sort(null, null, false, true).then(() => me.onAfterGrouping(silent));
            }
            else {
                me.sort(null, null, false, true);
            }
        }

        me.onAfterGrouping(silent);
    }

    onAfterGrouping(silent) {
        if (silent) {
            return;
        }
        const
            me = this,
            groupers = me.groupers || [];
        /**
         * Fired when grouping changes
         * @event group
         * @param {Core.data.Store} source This Store
         * @param {Grouper[]} groupers Applied groupers
         * @param {Core.data.Model[]} records Grouped records
         */
        me.trigger('group', { isGrouped : me.isGrouped, groupers, records : me.storage.values });
        me.trigger('refresh', { action : 'group', isGrouped : me.isGrouped, groupers, records : me.storage.values });
    }

    // Internal since UI does not support multi grouping yet
    /**
     * Add a grouping level (a grouper).
     * @param {String} field Field to group by
     * @param {Boolean} ascending Group direction
     * @category Sort, group & filter
     * @returns {Promise|null} If {@link Core/data/AjaxStore#config-sortParamName} is set on store, this method returns `Promise`
     * which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @internal
     */
    addGrouper(field, ascending = true) {
        return this.group(field, ascending, true);
    }

    // Internal since UI does not support multi grouping yet
    /**
     * Removes a grouping level (a grouper)
     * @param {String} field Grouper to remove
     * @category Sort, group & filter
     * @returns {Promise|null} If {@link Core/data/AjaxStore#config-sortParamName} is set on store, this method returns `Promise`
     * which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @internal
     */
    removeGrouper(field) {
        const
            me           = this,
            { groupers } = me;

        if (!groupers) {
            return;
        }

        const index = groupers.findIndex(grouper => grouper.field === field);

        if (index > -1) {
            groupers.splice(index, 1);

            if (!groupers.length) {
                return me.clearGroupers();
            }
            else {
                return me.group();
            }
        }
    }

    /**
     * Removes all groupers, turning store grouping off.
     * @privateparam {Boolean} [silent=false] Pass true to suppress events.
     * @returns {Promise|null} If {@link Core/data/AjaxStore#config-sortParamName} is set on store, this method returns `Promise`
     * which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @category Sort, group & filter
     */
    clearGroupers(silent = false) {
        return this.setGroupers(null, { silent });
    }

    //endregion

    //region Get and check

    /**
     * Check if a record belongs to a certain group (only for the first grouping level)
     * @param {Core.data.Model} record The Record
     * @param {*} groupValue The group value
     * @returns {Boolean} True if the record belongs to the group, otherwise false
     * @category Sort, group & filter
     */
    isRecordInGroup(record, groupValue) {
        if (!this.isGrouped) {
            return null;
        }

        const groupField = this.groupers[0]?.field;

        return record.getValue(groupField) === groupValue && !record.isSpecialRow;
    }

    isInCollapsedGroup(record) {
        const parentGroupRec = record.groupParent.get(this.id);

        return parentGroupRec?.meta.collapsed;
    }

    /**
     * Returns all records in the group with specified groupValue.
     * @param {*} groupValue
     * @returns {Core.data.Model[]} Records in specified group or null if store not grouped
     * @category Sort, group & filter
     */
    getGroupRecords(groupValue) {
        if (!this.isGrouped) {
            return null;
        }

        return this.storage.values.filter(record => this.isRecordInGroup(record, groupValue));
    }

    /**
     * Get all group titles.
     * @returns {String[]} Group titles
     * @category Sort, group & filter
     */
    getGroupTitles() {
        if (!this.isGrouped) {
            return null;
        }

        return this.getDistinctValues(this.groupers[0].field);
    }

    //endregion

    onDataChanged({ changes, action }) {
        if (
            this.isGrouped && (
                // If an action flagged as requiring resort is performed...
                (!changes && resortActions[action]) ||
                // ...or if the group field has changes...
                (changes && this.groupers.some(grouper => grouper.rootFieldName in changes))
            )
        ) {
            // ...then re-sort
            this.sort();
        }
    }

    /**
     * Adds or removes records in a group from storage. Used when expanding/collapsing groups.
     * @private
     * @param {Core.data.Model} groupRecord Group which records should be added or removed
     * @param {Boolean} include Include (true) or exclude (false) records
     * @category Grouping
     */
    internalIncludeExcludeGroupRecords(groupRecord, include) {
        const
            me                      = this,
            index                   = me.indexOf(groupRecord),
            allIndex                = me.allIndexOf(groupRecord),
            { id : mapId, storage } = me,
            {
                _filteredValues,
                _values
            }                       = storage,
            {
                meta,
                groupChildren,
                unfilteredGroupChildren
            }                       = groupRecord;

        // Skip if group record is not found, otherwise it removes records from wrong position.
        // Also prevent removing from already collapsed and vice versa
        if (allIndex === -1 || (meta.collapsed && !include) || (!meta.collapsed && include)) {
            return;
        }

        unfilteredGroupChildren.forEach(child =>
            child.instanceMeta(mapId).hiddenByCollapse = !include
        );

        if (include) {
            // Avoid adding record duplicates which may already have been reinserted by clearing filters
            if (_filteredValues) {
                _filteredValues.splice(index + 1, 0, ...groupChildren.filter(r => !me.isAvailable(r.id)));
            }

            storage._values.splice(allIndex + 1, 0, ...unfilteredGroupChildren.filter(r => !me.isAvailable(r.id)));
        }
        else {
            if (_filteredValues) {
                _filteredValues.splice(index + 1, groupChildren.length);
            }

            _values.splice(allIndex + 1, unfilteredGroupChildren.length);
        }

        storage._indicesInvalid = true;
        me._idMap = null;
    }

    /**
     * Removes records in a group from storage. Used when collapsing a group.
     * @private
     * @param groupRecord Group which records should be removed
     * @category Grouping
     */
    excludeGroupRecords(groupRecord) {
        this.internalIncludeExcludeGroupRecords(groupRecord, false);
    }

    /**
     * Adds records in a group to storage. Used when expanding a group.
     * @private
     * @param groupRecord Group which records should be added
     * @category Grouping
     */
    includeGroupRecords(groupRecord) {
        this.internalIncludeExcludeGroupRecords(groupRecord, true);
    }

    /**
     * Collects all group headers + children, whether expanded or not
     * @private
     * @param {Boolean} allRecords True to include filtered out records
     * @param {Boolean} includeHeaders True to also include group headers
     * @returns {Core.data.Model[]}
     */
    collectGroupRecords(allRecords, includeHeaders = true) {
        const records = allRecords ? this.storage.allValues : this.storage.values;

        return records.reduce((records, record) => {
            if (record.isSpecialRow) {
                if (includeHeaders && !record.isGroupFooter) {
                    records.push(record);
                }

                if (record.isGroupHeader) {
                    records.push.apply(records, allRecords ? record.unfilteredGroupChildren : record.groupChildren);
                }
            }

            return records;
        }, []);
    }
};
