import Base from '../../Base.js';
import Filter from '../../util/CollectionFilter.js';
import FunctionHelper from '../../helper/FunctionHelper.js';
import Collection from '../../util/Collection.js';
import ArrayHelper from '../../helper/ArrayHelper.js';

/**
 * @module Core/data/mixin/StoreFilter
 */

/**
 * Mixin for Store that handles filtering.
 * Filters are instances of {@link Core/util/CollectionFilter} class.
 *
 * - Adding a filter for the same property will replace the current one (unless a unique {@link Core.util.CollectionFilter#config-id} is specified),
 * but will not clear any other filters.
 * - Adding a filter through the {@link #function-filterBy} function is ultimate.
 * It will clear all the property based filters and replace the current filterBy function if present.
 * - Removing records from the store does not remove filters!
 * The filters will be reapplied if {@link #config-reapplyFilterOnAdd}/{@link #config-reapplyFilterOnUpdate} are true and you add new records or update current.
 *
 * ```javascript
 * // Add a filter
 * store.filter({
 *     property : 'score',
 *     value    : 10,
 *     operator : '>'
 * });
 *
 * // Add filter as a function
 * store.filter(record => record.score > 10);
 *
 * // Add named filter as a function
 * store.filter({
 *     id : 'my filter',
 *     filterBy : record => record.score > 10
 * });
 *
 * // Replace any filter set with new filters
 * store.filter({
 *     filters : {
 *         property : 'score',
 *         value    : 10,
 *         operator : '>'
 *     },
 *     replace : true
 * });
 *
 * // Remove this one specific filter, leaving any possible others in place.
 * // A filter's id defaults to the property name that it's filtering on.
 * store.removeFilter('score');
 *
 * // Reapply filters without firing an event.
 * // Use if making multiple data mutations with the
 * // intention of updating UIs when all finished.
 * store.filter({
 *     silent : true
 * });
 * ```
 *
 * @mixin
 */
export default Target => class StoreFilter extends (Target || Base) {
    static get $name() {
        return 'StoreFilter';
    }

    //region Config

    static get defaultConfig() {
        return {
            /**
             * Specify one or more {@link Core/util/CollectionFilter} config objects to apply initially.
             *
             * For example:
             *
             * ```javascript
             *  // Configure the store to filter in clients over the age of 30
             *  new Store({
             *      ...,
             *      filters : [{
             *          property : 'age',
             *          value    : 30,
             *          operator : '>'
             *      }],
             *      ...
             *  })
             * ```
             *
             * or:
             *
             * ```javascript
             *  // Configure the store to filter based on a complex operation
             *  new Store({
             *      ...,
             *      filters : [{
             *          filterBy(record) {
             *              // Return true or false for filtering in or out
             *              return shouldClientBeVisible(record);
             *          }
             *      }],
             *      ...
             *  })
             * ```
             *
             * @config {CollectionFilterConfig|CollectionFilterConfig[]}
             * @category Filtering
             */
            filters : null,

            /**
             * Specify true to reapply filters when a record is added to the store.
             * @config {Boolean}
             * @default
             * @category Filtering
             */
            reapplyFilterOnAdd : false,

            /**
             * Specify true to reapply filters when a record is updated in the store.
             * @config {Boolean}
             * @default
             * @category Filtering
             */
            reapplyFilterOnUpdate : false
        };
    }

    static properties = {
        filterBatching : 0,
        needsFiltering : false
    };
    //endregion

    //region Events

    /**
     * Fired after applying filters to the store
     * @event filter
     * @param {Core.data.Store} source This Store
     * @param {Core.util.Collection} filters Filters used by this Store
     * @param {Core.data.Model[]} removed The records which were filtered out by the action.
     * @param {Core.data.Model[]} added The records which were filtered back in by the action.
     * @param {Core.data.Model[]} records Filtered records
     */

    //endregion

    //region Properties

    set reapplyFilterOnAdd(enable) {
        this.storage.autoFilter = enable;
    }

    get reapplyFilterOnAdd() {
        return this.storage.autoFilter;
    }

    /**
     * Currently applied filters. A collection of {@link Core.util.CollectionFilter} instances.
     * @type {Core.util.Collection}
     * @readonly
     * @category Sort, group & filter
     */
    set filters(filters) {
        const
            me         = this,
            collection = me.filters;

        collection.clear();

        // Invalidate the filtersFunction so that it has to be recalculated upon next access
        me._filtersFunction = null;

        // If we are being asked to filter, parse the filters.
        if (filters) {
            if (filters.constructor.name === 'Object') {
                for (const f of Object.entries(filters)) {
                    // Entry keys are either a field name with its value being the filter value
                    // or, there may be one filterBy property which specifies a filtering function.
                    if (f[0] === 'filterBy' && typeof f[1] === 'function') {
                        collection.add(new Filter({
                            filterBy : f[1]
                        }));
                    }
                    else {
                        collection.add(new Filter(f[1].constructor.name === 'Object' ? Object.assign({
                            property : f[0]
                        }, f[1]) : {
                            property : f[0],
                            value    : f[1]
                        }));
                    }
                }
            }
            else if (Array.isArray(filters)) {
                // Make sure we are adding CollectionFilters
                collection.add(...filters.map(filterConfig => {
                    if (filterConfig instanceof Filter) {
                        return filterConfig;
                    }
                    return new Filter(filterConfig);
                }));
            }
            else if (filters.isCollection) {
                // Use supplied collection? Opting to use items from it currently
                collection.add(...filters.values);
            }
            else {

                collection.add(new Filter({
                    filterBy : filters
                }));
            }

            collection.forEach(item => item.owner = me);
        }
    }

    get filters() {
        return this._filters || (this._filters = new Collection({ extraKeys : ['property'] }));
    }

    set filtersFunction(filtersFunction) {
        this._filtersFunction = filtersFunction;
    }

    get filtersFunction() {
        const
            me                     = this,
            { filters, isGrouped } = me;

        if (!me._filtersFunction) {
            if (filters.count) {
                const generatedFilterFunction = Filter.generateFiltersFunction(filters);

                me._filtersFunction = candidate => {
                    // A group record is filtered in if it has passing groupChildren.
                    if (isGrouped && candidate.isSpecialRow) {
                        return candidate.groupChildren.some(generatedFilterFunction);
                    }

                    return generatedFilterFunction(candidate);
                };
            }
            else {
                me._filtersFunction = FunctionHelper.returnTrue;
            }
        }

        return me._filtersFunction;
    }

    /**
     * Check if store is filtered
     * @property {Boolean}
     * @readonly
     * @category Sort, group & filter
     */
    get isFiltered() {
        return this.filters.values.some(filter => !filter.disabled);
    }

    isFilteredOut(record) {
        return this.isFiltered && !this.filtersFunction(record);
    }

    //endregion

    traverseFilter(record, deep = true, forceInclusionSet = undefined) {
        const
            me          = this,
            { filtersFunction } = me,
            hitsCurrent = !record.isRoot && filtersFunction(record),
            children    = record.unfilteredChildren || record.children;

        // leaf, bail out
        if (!children || !children.length) {
            return hitsCurrent;
        }

        if (!record.unfilteredChildren) {
            record.unfilteredChildren = record.children.slice();
        }

        record.children = record.unfilteredChildren.filter(
            r => deep
                ? me.traverseFilter(r, deep)
                : filtersFunction(r) || forceInclusionSet?.has(r)
        );

        if (me.isSorted) {
            record.children.sort(me.sorterFn);
        }

        // unfilteredIndex must be set for child elements
        record.updateChildrenIndices(record.unfilteredChildren, 'unfilteredIndex', true);

        // parentIndex must be set for visible child elements
        record.updateChildrenIndices(record.children, 'parentIndex', true);

        return hitsCurrent || Boolean(record.children.length);
    }

    traverseClearFilter(record) {
        const me = this;

        if (record.unfilteredChildren) {
            // the code might seem a bit weird here, but yes - we want to copy from `orderedChildren`
            // and clear `unfilteredChildren`
            record.children = record.orderedChildren.slice();
            record.unfilteredChildren = null;
        }

        if (record.children) {
            if (me.isSorted) {
                record.children.sort(me.sorterFn);
            }
            record.children.forEach(r => me.traverseClearFilter(r));
            record.updateChildrenIndices(record.children, 'parentIndex', true);
        }
    }


    get latestFilterField() {
        return this.filters.last ? this.filters.last.property : null;
    }

    /**
     * Adds a single filter to the {@link #config-filters} collection. By default, filters are reevaluated
     * and a Store change event fired.
     *
     * If the `silent` parameter is passed as `true`, multiple filters can be added without causing data changes.
     *
     * When the filters are as required, call {@link #function-filter} with no parameters
     * to apply the filters to the store.
     *
     * @param {CollectionFilterConfig|Function} newFilter A {@link Core.util.CollectionFilter filter} config,
     * or a function to use for filtering.
     * @param {Boolean} [silent] Pass `true` to *not* refilter the store immediately. Such as when
     * adding multiple filters.
     * @returns {Promise|Core.util.CollectionFilter} If {@link Core/data/AjaxStore#config-filterParamName} is set on store, this method
     * returns Collection filter inside a `Promise` which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @category Sort, group & filter
     */
    addFilter(filter, silent = false) {

        const me = this;
        filter = filter instanceof Filter ? filter : new Filter(filter);

        // We want notification upon change of field, value or operator
        filter.owner = me;

        // Collection will replace any already existing filter on the field, unless it has id specified
        me.filters.add(filter);

        if (!silent) {
            if (me.remoteFilter) {
                return me.filter().then(() => filter);
            }
            else {
                me.filter();
            }
        }
        return filter;
    }

    /**
     * Filters the store by **adding** the specified filter(s) to the existing filters collection applied to this Store.
     * If a filter has an {@link Core.util.CollectionFilter#config-id id} specified,
     * or a {@link Core.util.CollectionFilter#config-property property} specified,
     * it will search for corresponding filter(s) in the existing filters first and replace it with a new filter.
     * **It will not remove other filters applied to the store!**
     *
     * To **add** a new filter:
     *
     * ```javascript
     * // Filter using simple object
     * store.filter({
     *     property : 'age',
     *     operator : '>',
     *     value    : 90
     * });
     *
     * // Filter using function
     * store.filter(r => r.age < 90);
     *
     * // Filter using a named filter as a function
     * store.filter({
     *     id : 'my-filter',
     *     filterBy : record => record.score > 10
     * });
     * ```
     *
     * To **remove** a specific filter, but keep other filters applied
     *
     * ```javascript
     * // Remove by filter `id` or `property`. Filter `id` defaults to the `property` name.
     * store.removeFilter('age');
     * store.removeFilter('my-filter');
     * ```
     *
     * To **replace** all existing filters with a new filter
     *
     * ```javascript
     * // Remove all filters and filter using simple object
     * store.filter({
     *     filters : {
     *         property : 'age',
     *         operator : '<',
     *         value    : 90
     *     },
     *     replace : true
     * });
     *
     * // Remove all filters and filter using function
     * store.filter({
     *     filters : r => r.age > 90,
     *     replace : true
     * });
     *
     * // Remove all filters and filter using a named filter as a function
     * store.filter({
     *     filters : {
     *         id : 'my-filter',
     *         filterBy : record => record.score > 10
     *     },
     *     replace : true
     * });
     * ```
     *
     * Basically filters replacing is an equivalent of having two sequenced calls:
     * {@link #function-clearFilters clearFilters} and {@link #function-filter filter}.
     *
     * Call without arguments to reapply filters.
     *
     * ```javascript
     * // Re-filter the store
     * store.filter();
     * ```
     *
     * @param {Object|CollectionFilterConfig|CollectionFilterConfig[]|Function} newFilters
     *        A {@link Core.util.CollectionFilter filter} config,
     *        or an array of {@link Core.util.CollectionFilter filter} configs,
     *        or a function to use for filtering,
     *        or a special object like: ```{ replace : true, filters : newFilters }```
     * @param {Boolean} [newFilters.replace]
     *        A flag, indicating whether or not the previous filters should be removed.
     * @param {Boolean} [newFilters.silent]
     *        Set as true to not fire events. UI will not be informed about the changes.
     * @param {CollectionFilterConfig|CollectionFilterConfig[]|Function} [newFilters.filters]
     *        If `newFilters` is an object and `replace` property is defined in the `newFilters`,
     *        it means that special object is used and real filter configuration must be nested down to this `filters` property.
     *        It can be:
     *        A {@link Core.util.CollectionFilter filter} config,
     *        or an array of {@link Core.util.CollectionFilter filter} configs,
     *        or a function to use for filtering.
     * @fires filter
     * @fires Core.data.Store#event-change
     * @returns {Promise|null} If {@link Core/data/AjaxStore#config-filterParamName} is set on store, this method returns Promise
     * which is resolved after data is loaded from remote server, otherwise it returns null value
     * @async
     * @category Sort, group & filter
     */
    filter(newFilters) {
        const me = this;

        let silent = false, internal;

        if (newFilters) {
            let fieldType = typeof newFilters;

            if (fieldType === 'object') {
                if (('silent' in newFilters) || ('replace' in newFilters) || newFilters.filters) {
                    silent = newFilters.silent;
                    if (newFilters.replace) {
                        // If replacing with empty filters (i.e. clearing filters), clearFilters should trigger a re-filter
                        me.clearFilters(newFilters.filters.length === 0);
                    }
                    internal = newFilters.internal;
                    newFilters = newFilters.filters;
                    fieldType = typeof newFilters;
                }
            }

            // If it was just a config object containing no filters, this will be null
            if (newFilters) {
                const wasFiltered = me.isFiltered;

                // We will not be informed about Filter mutations while configuring.
                me.isConfiguring = true;

                // If we provide array of objects looking like :
                //  {
                //      property  : 'fieldName',
                //      value     : 'someValue',
                //      [operator : '>']
                //  }
                //  or ...
                //  {
                //      property : 'fieldName',
                //      filterBy : function (value, record) {
                //          return value > 50;
                //      }
                //  }
                if (Array.isArray(newFilters)) {
                    newFilters.forEach(f => me.addFilter(f, true), me);
                }
                else if (fieldType === 'function') {

                    const filter = new Filter(newFilters);
                    filter.internal = internal;
                    me.addFilter(filter, true);
                }
                // Old signature of field name, value with implicit equality test.
                // Not documented, but still tested.
                else if (fieldType === 'string') {
                    me.addFilter({
                        property : newFilters,
                        value    : arguments[1]
                    }, true);
                }
                // An object-based filter definition
                else {
                    me.addFilter(newFilters, true);
                }

                // Open up to receiving Filter mutation notifications again
                me.isConfiguring = false;

                // We added a disabled filter to either no filters, or all disabled filters, so no change.
                if (!me.isFiltered && !wasFiltered) {
                    return null;
                }
            }
        }

        // Invalidate the filtersFunction so that it has to be recalculated upon next access
        me.filtersFunction = null;

        // Implemented here for local filtering.
        // AjaxStore implements for remote and returns a Promise, so MUST return the call value.
        const result = me.performFilter(silent);

        // Force rebuild of idMap
        me._idMap = null;

        return result;
    }

    suspendFilterOnUpdate() {
        this.filterBatching++;
    }

    resumeFilterOnUpdate(silent) {
        this.filterBatching--;

        if (this.filterBatching < 0) {
            throw new Error('No matching `startFilterBatching` call');
        }

        if (this.filterBatching === 0 && this.needsFiltering) {
            this.needsFiltering = false;
            // note, that at this point the store might not be filtered already (if all filters have been removed)
            // but we still need to perform the filtering for that, since it was delayed
            this.performFilter(silent);
        }
    }

    /**
     * Perform filtering according to the {@link #property-filters} Collection.
     * This is the internal implementation which is overridden in {@link Core.data.AjaxStore} and
     * must not be overridden.
     * @private
     */
    performFilter(silent) {
        const
            me                             = this;

        if (me.filterBatching > 0) {
            me.needsFiltering = true;
            return;
        }

        const
            { storage, filters, rootNode } = me,
            oldCount                       = me.count;

        // Private event, did not need it documented or preventable right now
        me.trigger('beforeFilter', { filters });

        let added, removed;

        if (me.tree) {
            const oldDataset = storage.values;

            if (me.isFiltered) {
                me.traverseFilter(rootNode);
            }
            else {
                me.traverseClearFilter(rootNode);
            }

            const newDataset = me.collectDescendants(rootNode).visible;

            storage.replaceValues({
                values : newDataset,
                silent : true
            });

            const delta = ArrayHelper.delta(newDataset, oldDataset, true);

            added   = delta.toAdd;
            removed = delta.toRemove;
        }
        else {
            // Collect the added and removed deltas from the filter operation
            storage.ion({
                change({ removed : r, added : a }) {
                    removed = r;
                    added = a;
                },
                once : true
            });

            if (me.isFiltered) {
                // Bring collapsed away records in, to be considered in filtering
                me.isGrouped && me.includeCollapsed();

                storage.addFilter({
                    id       : 'primary-filter', 
                    filterBy : me.filtersFunction
                });

                // Take them back out again after filtering
                me.isGrouped && me.excludeCollapsed();
            }
            else {
                storage.filters.clear();
            }
        }

        me.afterPerformFilter(silent || me.isRemoteDataLoading ? null : {
            action  : 'filter',
            filters,
            oldCount,
            added,
            removed,
            records : me.storage.values
        });
    }

    afterPerformFilter(event) {
        this.resetRelationCache();

        if (event) {
            this.triggerFilterEvent(event);
        }
    }

    // Used from filter() and StoreCRUD when reapplying filters
    triggerFilterEvent(event) {
        this.trigger('filter', event);

        // Only fire these events if it's a local filter.
        // If we are configured with filterParamName, the loadData will fire them.
        if (!this.remoteFilter) {
            this.trigger('refresh', event);
            this.trigger('change', event);
        }
    }

    /**
     * *Adds* a function used to filter the store. Alias for calling `filter(fn)`. Return `true` from the function to
     * include record in filtered set
     *
     * ```javascript
     * store.filterBy(record => record.age > 25 && record.name.startsWith('A'));
     * ```
     *
     * @param {Function} fn Function used to test records
     * @returns {Promise|null} If {@link Core/data/AjaxStore#config-filterParamName} is set on store, this method returns `Promise`
     * which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @category Sort, group & filter
     */
    filterBy(fn) {
        return this.filter(fn);
    }

    /**
     * Removes the passed filter, or the filter by the passed ID from the {@link #config-filters} collection.
     * By default, filters are reevaluated and a Store change event fired.
     *
     * If the `silent` parameter is passed as `true`, multiple filters can be removed without causing data changes.
     *
     * When the filters are as required, call {@link #function-filter} with no parameters
     * to apply the filters to the store.
     *
     * ```javascript
     * // Only view top priority events
     * myEventStore.filter({
     *     id       : 'priorityFilter',
     *     property : 'priority',
     *     value    : 1,
     *     operator : '='
     * });
     *
     * // That individual filter can be removed like this
     * myEventStore.removeFilter('priorityFilter');
     *
     * // Add named filter as a function
     * store.filter({
     *     id : 'my filter',
     *     filterBy : record => record.score > 10
     * });
     *
     * // Remove named filter function
     * store.removeFilter('my filter');
     * ```
     *
     * @param {String|Core.util.CollectionFilter} idOrInstance Filter to remove, or ID of the filter to remove. By default,
     * filters are reevaluated and a change event fired.
     * @param {Boolean} [silent] Pass `true` to *not* refilter the store immediately. Such as when
     * removing multiple filters.
     * @returns {Promise|Core.util.CollectionFilter} If {@link Core/data/AjaxStore#config-filterParamName} is set on store, this method
     * returns Collection filter inside a `Promise` which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @category Sort, group & filter
     */
    removeFilter(idOrInstance, silent = false) {
        const
            me     = this,
            filter = idOrInstance instanceof Filter ? idOrInstance : me.filters.get(idOrInstance);

        // If we have such a filter, remove it.
        if (filter) {
            me.filters.remove(filter);

            // Invalidate the filtersFunction so that it has to be recalculated upon next access
            me._filtersFunction = null;

            if (!silent) {
                if (me.remoteFilter) {
                    return me.filter().then(() => filter);
                }
                else {
                    me.filter();
                }
            }

            return filter;
        }
    }

    /**
     * Removes all filters from the store.
     * @returns {Promise|null} If {@link Core/data/AjaxStore#config-filterParamName} is set on store, this method returns `Promise`
     * which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @category Sort, group & filter
     */
    clearFilters(apply = true) {
        // Remove all non-internal filters (those have to be explicitly removed)
        this.filters.remove(this.filters.values.filter(f => !f.internal));

        if (apply) {
            return this.filter();
        }
    }

    convertFilterToString(field) {
        const filter = this.filters.getBy('property', field);
        return (filter && !filter.filterBy) ? String(filter) : '';
    }

    doDestroy() {
        this._filters?.destroy();

        super.doDestroy();
    }
};
