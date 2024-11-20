import './Checkbox.js';
import Container from './Container.js';
import './Label.js';
import './FieldFilterPicker.js';

/**
 * @module Core/widget/FieldFilterPickerGroup
 */

/**
 * A set of {@link Core.widget.FieldFilterPicker}s, representing an array
 * of {@link Core.util.CollectionFilter}s. The filters are provided to the
 * picker as an array of filter configuration objects.
 *
 * {@inlineexample Core/widget/FieldFilterPickerGroup.js}
 *
 * When {@link #config-store} is provided in the configuration, the picker group will
 * read filters from the store and monitor for filter changes, and reflect any changes. It is
 * possible to synchronize multiple {@link Core.widget.FieldFilterPickerGroup}s by configuring
 * them with the same store.
 *
 * Does not support modifying filters defined as custom functions.
 *
 * @extends Core/widget/Container
 * @classtype fieldfilterpickergroup
 * @widget
 */
export default class FieldFilterPickerGroup extends Container {
    //region Config

    static $name = 'FieldFilterPickerGroup';

    static type = 'fieldfilterpickergroup';

    /**
     * @private
     */
    static addFilterButtonDefaultText = 'L{FieldFilterPickerGroup.addFilter}';

    static configurable = {
        /**
         * Array of {@link Core.util.CollectionFilter} configuration objects. One
         * {@link Core.widget.FieldFilterPicker} will be created
         * for each object in the array.
         *
         * When {@link #config-store} is provided, any filters in the store will
         * be automatically added and do not need to be provided explicitly.
         *
         * Example:
         * ```javascript
         * filters: [{
         *     // Filter properties should exist among field names configured
         *     // via `fields` or `store`
         *     property: 'age',
         *     operator: '<',
         *     value: 30
         * },{
         *     property: 'title',
         *     operator: 'startsWith',
         *     value: 'Director'
         * }]
         * ```
         *
         * @config
         * @type {CollectionFilterConfig[]}
         */
        filters : [],

        /**
         * Dictionary of {@link Core.widget.FieldFilterPicker#typedef-FieldOption} representing the fields against which filters can be defined,
         * keyed by field name.
         *
         * If filtering a {@link Grid.view.Grid}, consider using {@link Grid.widget.GridFieldFilterPicker}, which can be configured
         * with an existing {@link Grid.view.Grid} instead of, or in combination with, defining fields manually.
         *
         * Example:
         * ```javascript
         * fields: {
         *     // Allow filters to be defined against the 'age' and 'role' fields in our data
         *     age  : { text: 'Age', type: 'number' },
         *     role : { text: 'Role', type: 'string' }
         * }
         * ```
         *
         * @config {Object<String,FieldOption>}
         * @deprecated 5.3.0 Syntax accepting FieldOptions[] was deprecated in favor of dictionary and will be removed in 6.0
         */
        fields : null,

        /**
         * Whether the picker group is disabled.
         *
         * @config {Boolean}
         * @default
         */
        disabled : false,

        /**
         * Whether the picker group is read-only.
         *
         * Example:
         * fields: [
         *    { name: 'age', type: 'number' },
         *    { name: 'title', type: 'string' }
         * ]
         *
         * @config {Boolean}
         * @default
         */
        readOnly : false,

        layout : 'vbox',

        /**
         * The {@link Core.data.Store} whose records will be filtered. The store's {@link Core.data.Store#property-modelClass}
         * will be used to determine field types.
         *
         * This store will be kept in sync with the filters defined in the picker group, and new filters added to the store
         * via other means will appear in this filter group when they are able to be modified by it. (Some types of filters,
         * like arbitrary filter functions, cannot be managed through this widget.)
         *
         * As a corollary, multiple `FieldFilterPickerGroup`s configured with the same store will stay in sync, showing the
         * same filters as the store's filters change.
         *
         * @config {Core.data.Store}
         */
        store : null,

        /**
         * When `limitToProperty` is set to the name of an available field (as specified either
         * explicitly in {@link #config-fields} or implicitly in the
         * {@link #config-store}'s model), it has the following effects:
         *
         * - the picker group will only show filters defined on the specified property
         * - it will automatically set the `property` to the specified property for all newly added
         *   filters where the property is not already set
         * - the property selector is made read-only
         *
         * @config {String}
         */
        limitToProperty : null,

        /**
         * Optional CSS class to apply to the value field(s).
         *
         * @config {String}
         * @private
         */
        valueFieldCls : null,

        /**
         * Show a button at the bottom of the group that adds a new, blank filter to the group.
         *
         * @config {Boolean}
         * @default
         */
        showAddFilterButton : true,

        /**
         * Optional predicate that returns whether a given filter can be deleted. When `canDeleteFilter` is provided,
         * it will be called for each filter and will not show the delete button for those for which the
         * function returns `false`.
         *
         * @config {Function}
         * @param {*} filter  filter for checking
         * @returns {Boolean} truthy value if filter can be deleted
         */
        canDeleteFilter : null,

        /**
         * Optional function that returns {@link Core.widget.FieldFilterPicker} configuration properties for
         * a given filter. When `getFieldFilterPickerConfig` is provided, it will be called for each filter and the returned
         * object will be merged with the configuration properties for the individual
         * {@link Core.widget.FieldFilterPicker} representing that filter.
         *
         * The supplied function should accept a single argument, the {@link Core.util.CollectionFilter} whose picker
         * is being created.
         *
         * @config {Function}
         * @returns {FieldFilterPickerConfig}
         */
        getFieldFilterPickerConfig : null,

        /**
         * Optional predicate that returns whether a given filter can be managed by this widget. When `canManageFilter`
         * is provided, it will be used to decide whether to display filters found in the configured
         * {@link #config-store}.
         *
         * @config {Function}
         * @param {*} filter  filter for checking
         * @returns {Boolean} truthy value if filter can be managed
         */
        canManageFilter : null,

        /**
         * Sets the text displayed in the 'add filter' button if one is present.
         *
         * @config {String}
         */
        addFilterButtonText : null,

        /**
         * Whether to raise {@link #event-change} events as the user types into a value field. If `false`,
         * {@link #event-change} events will be raised only when the value input field's own `change` event
         * occurs, for example on field blur.
         *
         * @config {Boolean}
         * @default
         */
        triggerChangeOnInput : true,

        /**
         * @private
         */
        items : {
            pickers : {
                type       : 'container',
                layout     : 'vbox',
                scrollable : true,
                items      : {}
            },
            addFilterButton : {
                type   : 'button',
                text   : FieldFilterPickerGroup.addFilterButtonDefaultText,
                cls    : `b-${FieldFilterPickerGroup.type}-add-button`,
                hidden : true
            }
        },

        /**
         * When specified, overrides the built-in list of available operators. See
         * {@link Core.widget.FieldFilterPicker#config-operators}.
         *
         * @config {Object}
         */
        operators : null,

        /**
         * The date format string used to display dates when using the 'is one of' / 'is not one of' operators with a date
         * field. Defaults to the current locale's `FieldFilterPicker.dateFormat` value.
         *
         * @config {String}
         * @default
         */
        dateFormat : 'L{FieldFilterPicker.dateFormat}'
    };

    // endregion

    static childPickerType = 'fieldfilterpicker';

    afterConstruct() {
        const me = this;
        me.validateConfig();
        const { addFilterButton } = me.widgetMap;
        addFilterButton.ion({ click : 'addFilter', thisObj : me });

        addFilterButton.text = me.L(addFilterButton.text);
        me.store && me.updateStore(me.store);
        super.afterConstruct();
    }

    changeDateFormat(dateFormat) {
        return this.L(dateFormat);
    }

    validateConfig() {
        if (!this.fields && !this.store) {
            throw new Error(
                `FieldFilterPickerGroup requires either a 'fields' or 'store' config property.`
            );
        }
    }

    updateFields(newFields) {
        this.widgetMap.pickers.childItems.forEach(picker => picker.fields = newFields);
    }

    updateFilters(newFilters, oldFilters) {
        const me = this;
        if (oldFilters) {
            oldFilters
                .filter(filter => !newFilters.find(newFilter => newFilter.id === filter.id))
                .forEach(filter => me.store?.removeFilter(filter.id));
        }
        newFilters.forEach(filter => filter.id = filter.id || me.nextFilterId);
        me.widgetMap.pickers.items = newFilters?.map(filter => me.getPickerRowConfig(filter)) || [];
    }

    changeFilters(newFilters) {
        const { canManageFilter } = this;
        return (newFilters && canManageFilter)
            ? newFilters.filter(filter => this.callback(canManageFilter, this, [filter]))
            : newFilters;
    }

    updateStore(newStore) {
        const me = this;
        me.detachListeners('store');
        if (newStore) {
            // Make sure the store has all of our configured filters
            me.widgetMap.pickers.childItems.forEach(({ widgetMap: { filterPicker: { filter, isValid } } }) => {
                newStore.removeFilter(filter.id, true);
                if (isValid) {
                    newStore.addFilter(filter, true);
                }
            });
            newStore.filter();
            me.appendFiltersFromStore();
            newStore.ion({
                name    : 'store',
                filter  : 'onStoreFilter',
                thisObj : me
            });
        }
        me.widgetMap.pickers.childItems.forEach(picker => picker.store = newStore);
    }

    updateShowAddFilterButton(newShow) {
        this.widgetMap.addFilterButton.hidden = !newShow;
    }

    updateAddFilterButtonText(newText) {
        this.widgetMap.addFilterButton.text = newText ?? FieldFilterPickerGroup.addFilterButtonDefaultText;
    }

    /**
     * Find any filters the store has that we don't know about yet, and add to our list
     * @private
     */
    appendFiltersFromStore() {
        const
            me = this;
        me.store.filters.forEach(filter => {
            const
                canManage = me.canManage(filter),
                { property, operator, id } = filter;
            if (canManage && property && operator &&
                !me.filters?.find(filter => filter.id === id)
            ) {
                me.appendFilter(filter);
            }
        });
    }

    /**
     * @private
     */
    canManage(filter) {
        const me = this;
        return !me.canManageFilter || (me.callback(me.canManageFilter, me, [filter]) === true);
    }

    /**
     * Get the configuration object for one child FieldFilterPicker.
     * @param {Core.util.CollectionFilter} filter The filter represented by the child FieldFilterPicker
     * @returns {Object} The FieldFilterPicker configuration
     */
    getFilterPickerConfig(filter) {
        const
            me = this,
            {
                fields, store, disabled, readOnly, valueFieldCls, operators, limitToProperty, dateFormat,
                getFieldFilterPickerConfig, triggerChangeOnInput
            } = me;
        return {
            type              : me.constructor.childPickerType,
            fields            : fields ?? me.getFieldsFromStore(store),
            filter,
            store,
            disabled,
            readOnly,
            propertyLocked    : Boolean(limitToProperty),
            valueFieldCls,
            operators,
            dateFormat,
            internalListeners : {
                change  : 'onFilterPickerChange',
                thisObj : me
            },
            flex : 1,
            triggerChangeOnInput,
            ...(getFieldFilterPickerConfig ? me.callback(getFieldFilterPickerConfig, me, [filter]) : undefined)
        };
    }

    /**
     * Get store fields as {@link Core.widget.FieldFilterPicker#typedef-FieldOption}s in a dictionary keyed by name.
     * @private
     */
    getFieldsFromStore(store) {
        return Object.fromEntries(store.modelClass?.fields.map(({ name, type }) => [name, { type }]) ?? []);
    }

    getPickerRowConfig(filter) {
        const
            me = this,
            { disabled, readOnly, canDeleteFilter } = me,
            canDelete = !(canDeleteFilter && (me.callback(canDeleteFilter, me, [filter]) === false));
        return {
            type   : 'container',
            layout : 'box',
            cls    : {
                [`b-${FieldFilterPickerGroup.type}-row`]           : true,
                [`b-${FieldFilterPickerGroup.type}-row-removable`] : canDelete
            },
            dataset : {
                separatorText : me.L('L{FieldFilterPicker.and}')
            },
            items : {
                activeCheckbox : {
                    type              : 'checkbox',
                    disabled,
                    readOnly,
                    checked           : !Boolean(filter.disabled),
                    internalListeners : {
                        change  : 'onFilterActiveChange',
                        thisObj : me
                    },
                    cls : `b-${FieldFilterPickerGroup.type}-filter-active`
                },
                filterPicker : me.getFilterPickerConfig(filter),
                removeButton : {
                    type              : 'button',
                    ref               : 'removeButton',
                    disabled,
                    readOnly,
                    hidden            : !canDelete,
                    cls               : `b-transparent b-${FieldFilterPickerGroup.type}-remove`,
                    icon              : 'b-fa-trash',
                    internalListeners : {
                        click   : 'removeFilter',
                        thisObj : me
                    }
                }
            }
        };
    }

    get allInputs() {
        const childInputTypes = [this.constructor.childPickerType, 'button', 'checkbox'];
        return this.queryAll(w => childInputTypes.includes(w.type));
    }

    updateDisabled(newDisabled) {
        this.allInputs.forEach(input => input.disabled = newDisabled);
    }

    updateReadOnly(newReadOnly) {
        this.allInputs.forEach(input => input.readOnly = newReadOnly);
    }

    onFilterActiveChange({ source, checked }) {
        const
            me = this,
            filterIndex = me.getFilterIndex(source),
            filter = me.filters[filterIndex],
            filterPicker = me.getFilterPicker(filterIndex);
        filter.disabled = !checked;
        filterPicker.onFilterChange();
        if (me.store && filterPicker.isValid) {
            me.store.addFilter(filter, true);
        }
        me.updateStoreFilter();
        me.triggerChange();
    }

    onFilterPickerChange({ source, filter, isValid }) {
        const
            me = this,
            { store } = me,
            filterIndex = me.getFilterIndex(source);
        if (store) {
            store.removeFilter(filter.id, true);
            if (isValid) {
                store.addFilter(filter, true);
            }
            me.updateStoreFilter();
        }
        Object.assign(me.filters[filterIndex], filter);
        me.triggerChange();
    }

    getFilterIndex(eventSource) {
        return parseInt(eventSource.parent.element.dataset.itemIndex);
    }

    getPickerRow(index) {
        return this.widgetMap.pickers.childItems[index];
    }

    /**
     * Return the {@link Core.widget.FieldFilterPicker} for the filter at the specified index.
     * @param {Number} filterIndex
     * @returns {Core.widget.FieldFilterPicker}
     */
    getFilterPicker(filterIndex) {
        return this.getPickerRow(filterIndex).widgetMap.filterPicker;
    }

    get nextFilterId() {
        this._nextId = (this._nextId || 0) + 1;
        return `${this.id}-filter-${this._nextId}`;
    }

    removeFilter({ source }) {
        const
            me = this,
            filterIndex = me.getFilterIndex(source),
            filter = me.filters[filterIndex],
            pickerRow = me.getPickerRow(filterIndex),

            newFocusWidget = me.query(w => w.isFocusable && w.type !== 'container' && !pickerRow.contains(w));

        if (newFocusWidget) {
            newFocusWidget.focus();
        }
        me.removeFilterAt(filterIndex);
        if (me.store) {
            me.store.removeFilter(filter.id, true);
            me.updateStoreFilter();
        }
        me.trigger('remove', { filter });
        me.triggerChange();
    }

    /**
     * Appends a filter at the bottom of the list.
     * @param {CollectionFilterConfig} [filter={}] Configuration object for the {@link Core.util.CollectionFilter} to
     * add. Defaults to an empty filter.
     */
    addFilter({ property = null, operator = null, value = null } = {}) {
        const
            me = this,
            { filters } = me,
            newFilter = {
                property      : me.limitToProperty || property,
                operator,
                value,
                disabled      : false,
                id            : me.nextFilterId,
                caseSensitive : false
            };

        /**
         * Fires before a new filter is added to the picker group (and its store, if configured and the filter is valid).
         * Return `false` from the event handler to prevent the filter being added.
         *
         * @event beforeAddFilter
         * @preventable
         * @param {Core.widget.FieldFilterPicker} source The FieldFilterPicker instance that fired the event.
         * @param {CollectionFilterConfig} filter The {@link Core.util.CollectionFilter} configuration object for the
         *        filter represented by this {@link Core.widget.FieldFilterPicker}.
         */
        if (!me.trigger('beforeAddFilter', { filter : newFilter })) {
            return;
        }

        me.appendFilter(newFilter);
        if (me.getFilterPicker(filters.length - 1).isValid) {
            me.store?.addFilter(newFilter, true);
            me.store && me.updateStoreFilter();
        }
        me.trigger('add', { filter : newFilter });
        me.triggerChange();
    }

    /**
     * @private
     */
    appendFilter(filter) {
        const me = this;
        if (!me.limitToProperty || filter.property === me.limitToProperty) {
            me.filters.push(filter);
            me.widgetMap.pickers.add(
                me.getPickerRowConfig(filter, me.filters.length - 1)
            );
        }
    }

    onStoreFilter(event) {
        const me = this;
        if (me._isUpdatingStore) {
            return;
        }
        const
            { filters } = event,
            storeFiltersById = filters.values.reduce((byId, filter) =>
                ({ ...byId, [filter.id] : filter }), {});
        for (
            let filterIndex = me.filters.length - 1;
            filterIndex >= 0;
            filterIndex--
        ) {
            const
                filter = me.filters[filterIndex],
                storeFilter = storeFiltersById[filter.id],
                filterRow = me.getPickerRow(filterIndex);
            if (filterRow) {
                const { filterPicker, activeCheckbox } = filterRow.widgetMap;
                if (!storeFilter && filterPicker.isValid) {
                    me.removeFilterAt(filterIndex);
                }
                else if (storeFilter !== undefined) {
                    const
                        { operator, value, property, disabled, caseSensitive } = storeFilter;
                    if (filter !== storeFilter) {
                        Object.assign(filter, { operator, value, property, disabled, caseSensitive });
                    }
                    filterPicker.filter = filter;
                    filterPicker.onFilterChange();
                    activeCheckbox.checked = !disabled;
                }
            }
        }
        me.appendFiltersFromStore();
        me.triggerChange();
    }

    /**
     * Remove the filter at the given index.
     * @param {Number} filterIndex The index of the filter to remove
     */
    removeFilterAt(filterIndex) {
        const { widgetMap: { pickers }, filters } = this;
        pickers.remove(pickers.childItems[filterIndex]);
        filters.splice(filterIndex, 1);
        this.triggerChange();
    }

    /**
     * Trigger a store re-filter after filters have been silently modified.
     * @private
     */
    updateStoreFilter() {
        this._isUpdatingStore = true;
        this.store?.filter();
        this._isUpdatingStore = false;
    }

    /**
     * Returns the array of filter configuration objects currently represented by this picker group.
     * @type {CollectionFilterConfig[]}
     */
    get value() {
        return this.filters;
    }

    triggerChange() {
        const
            { filters } = this,
            validFilters = filters.filter((f, index) => this.getPickerRow(index).widgetMap.filterPicker.isValid);

        /**
         * Fires when any filter in the group is added, removed, or modified.
         * @event change
         * @param {Core.widget.FieldFilterPickerGroup} source The FieldFilterPickerGroup instance that fired the event.
         * @param {CollectionFilterConfig[]} filters The array of {@link Core.util.CollectionFilter} configuration
         * objects currently represented by the FieldFilterPickerGroup. **IMPORTANT:** Note that this includes all filters
         * currently present in the UI, including partially completed ones that may not be ready to apply to a Store.
         * To retrieve only valid filters, use the `validFilters` parameter on this event, or filter out incomplete filters
         * in your own code.
         * @param {CollectionFilterConfig[]} validFilters The subset of {@link Core.util.CollectionFilter} configuration
         * objects in the `filters` parameter on this event that are complete and valid for application to a Store.
         */
        this.trigger('change', {
            filters,
            validFilters
        });
    }

    /**
     * Sets all current filters to enabled and checks their checkboxes.
     */
    activateAll() {
        this.setAllActiveStatus(true);
    }

    /**
     * Sets all current filters to disabled and clears their checkboxes.
     */
    deactivateAll() {
        this.setAllActiveStatus(false);
    }

    /**
     * @private
     */
    setAllActiveStatus(newActive) {
        const
            me = this,
            { _filters, store } = me;
        _filters.forEach((filter, filterIndex) => {
            // Only do anything if status is changing
            if (newActive === filter.disabled) {
                const { filterPicker, activeCheckbox } = me.getPickerRow(filterIndex).widgetMap;
                filter.disabled = !newActive;
                filterPicker.onFilterChange();
                activeCheckbox.checked = newActive;
                if (newActive && store && filterPicker.isValid) {
                    store.addFilter(filter, true);
                }
            }
        });
        me.updateStoreFilter();
    }

    get focusElement() {
        const { length } = this._filters;
        return length > 0
            ? this.getPickerRow(length - 1).widgetMap.filterPicker.focusElement
            : super.focusElement;
    }
}

FieldFilterPickerGroup.initClass();
