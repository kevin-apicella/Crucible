import Base from '../Base.js';
import DateHelper from '../helper/DateHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import FunctionHelper from '../helper/FunctionHelper.js';
import Identifiable from '../mixin/Identifiable.js';
import Duration from '../data/Duration.js';

/**
 * @module Core/util/CollectionFilter
 */

const
    nestedValueReducer = (object, path) => object?.[path],
    relativeDateUnitRegExp = /^is(this|next|last)(week|month|year)$/i,
    relativeDateOperators = [
        'isToday',
        'isTomorrow',
        'isYesterday',
        'isThisWeek',
        'isNextWeek',
        'isLastWeek',
        'isThisMonth',
        'isNextMonth',
        'isLastMonth',
        'isThisYear',
        'isNextYear',
        'isLastYear',
        'isYearToDate'
    ];

/**
 * The operator to use when comparing a collection object.
 *
 * ### Valid Values:
 *
 * Following are the operators supported by CollectionFilter. **Text** is the label shown when this operator is
 * displayed in a {@link Core.widget.FieldFilterPicker}. To customize the list of operators displayed in a
 * {@link Core.widget.FieldFilterPicker}, see {@link Core.widget.FieldFilterPicker#config-operators}.
 *
 * | Operator          | Text              | Description                                                          |
 * |-------------------|-------------------|----------------------------------------------------------------------|
 * | `=`               | equals            | Match records having values exactly equal to a given value           |
 * | `!=`              | does not equal    | Match records having values not equal to a given value               |
 * | `>`               | greater than      | Match records having values greater than a given value               |
 * | `>=`              | greater or equals | Match records having values greater than or equal to a given value   |
 * | `<`               | less than         | Match records having values less than a given value                  |
 * | `<=`              | less or equals    | Match records having values less than or equal to a given value      |
 * | `*`               | contains          | Match records where a value includes a specified substring           |
 * | `startsWith`      | starts with       | Match records starting with a specific string                        |
 * | `endsWith`        | ends with         | Match records ending with a specific string                          |
 * | `isIncludedIn`    | one of            | Match records where a value is included in a given set of values     |
 * | `isNotIncludedIn` | not one of        | Match records where a value is not included in a given set of values |
 * | `includes`        | contains          | Match records where a value includes a specified substring           |
 * | `doesNotInclude`  | does not contain  | Match records where a value does not include a specified substring   |
 * | `empty`           | empty             | Match records where a field is empty                                 |
 * | `notEmpty`        | not empty         | Match records where a field is not empty                             |
 * | `between`         | between           | Match records where a value falls within a specified range           |
 * | `notBetween`      | not between       | Match records where a value falls outside a specified range          |
 * | `isToday`         | today             | Match records where a date is today's date                           |
 * | `isTomorrow`      | tomorrow          | Match records where a date is tomorrow's date                        |
 * | `isYesterday`     | yesterday         | Match records where a date is yesterday's date                       |
 * | `isThisWeek`      | this week         | Match records where a date is within the current week                |
 * | `isLastWeek`      | last week         | Match records where a date is within the previous week               |
 * | `isNextWeek`      | next week         | Match records where a date is within the next week                   |
 * | `isThisMonth`     | this month        | Match records where a date is within the current month               |
 * | `isLastMonth`     | last month        | Match records where a date is within the previous month              |
 * | `isNextMonth`     | next month        | Match records where a date is within the next month                  |
 * | `isThisYear`      | this year         | Match records where a date is within the current year                |
 * | `isLastYear`      | last year         | Match records where a date is within the previous year               |
 * | `isNextYear`      | next year         | Match records where a date is within the next year                   |
 * | `isYearToDate`    | year to date      | Match records where a date is within the current year to date        |
 * | `isTrue`          | true              | Match records where a boolean value is true                          |
 * | `isFalse`         | false             | Match records where a boolean value is false                         |
 * @typedef {'='|'!='|'>'|'>='|'<'|'<='|'*'|'startsWith'|'endsWith'|'isIncludedIn'|'isNotIncludedIn'|'includes'|'doesNotInclude'|'empty'|'notEmpty'|'between'|'notBetween'|'sameDay'|'isToday'|'isTomorrow'|'isYesterday'|'isThisWeek'|'isLastWeek'|'isNextWeek'|'isThisMonth'|'isLastMonth'|'isNextMonth'|'isThisYear'|'isLastYear'|'isNextYear'|'isYearToDate'|'isTrue'|'isFalse'} CollectionCompareOperator
 */

/**
 * A class which encapsulates a single filter operation which may be applied to any object to decide whether to
 * include or exclude it from a set.
 *
 * A CollectionFilter generally has at least three main properties:
 *
 * * `property` - The name of a property in candidate objects from which to extract the value to test
 * * `value` - The value which  this filter uses to test against.
 * * `operator` - The comparison operator, eg: `'='` or `'>'` etc.
 *
 * Given these three essential values, further configurations may affect how the filter is applied:
 *
 * * `caseSensitive` - If configured as `false`, string comparisons are case insensitive.
 * * `convert` - A function which, when passed the extracted value from the candidate object, returns the value to test.
 *
 * A filter may also be configured with a single `filterBy` property. This function is just passed the raw
 * candidate object and must return `true` or `false`.
 *
 * A CollectionFilter may be configured to encapsulate a single filtering function by passing that function as the sole
 * parameter to the constructor:
 *
 * ```javascript
 * new CollectionFilter(candidate => candidate.title.contains('search string'));
 * ```
 */
export default class CollectionFilter extends Base.mixin(Identifiable) {
    static $name = 'CollectionFilter';

    static get defaultConfig() {
        return {
            /**
             * The value against which to compare the {@link #config-property} of candidate objects.
             * @config {*}
             */
            value : null,

            /**
             * The operator to use when comparing a candidate object's {@link #config-property} with this CollectionFilter's {@link #config-value}.
             * @config {CollectionCompareOperator}
             */
            operator : null,

            /**
             * May be used in place of the {@link #config-property}, {@link #config-value} and {@link #config-property} configs. A function which
             * accepts a candidate object and returns `true` or `false`
             * @config {Function}
             * @param {*} data Data object for filtering
             * @returns {Boolean}
             */
            filterBy : null,

            /**
             * A function which accepts a value extracted from a candidate object using the {@link #config-property} name, and
             * returns the value which the filter should use to compare against its {@link #config-value}.
             * @config {Function}
             * @param {*} value
             * @returns {*}
             */
            convert : null,

            /**
             * Configure as `false` to have string comparisons case insensitive.
             * @config {Boolean}
             * @default
             */
            caseSensitive : true,

            /**
             * The `id` of this Filter for when used by a {@link Core.util.Collection} Collection.
             * By default the `id` is the {@link #config-property} value.
             * @config {String}
             */
            id : null,

            // Type is required to process the Date value in State API. Store doesn't always know about field type to
            // process filter value, when it applies it from the state, e.g. when you don't declare model field as `date`
            // type but provide a Date instance there. When DateColumn is used to shows this field, it could add date
            // filters to the store. When store is applying state it cannot just infer type, because model doesn't
            // declare it. Only column knows. So to properly process the Date instance for the filter State API would
            // have to process the field additionally, checking model field type and column type. So it is simpler to
            // make Filter to put this information. That way when filter is instantiated by the store, it can gracefully
            // handle value processing, converting date string to the Date instance.
            // Date is the only known value type so far which requires this processing.
            type : null,

            /**
             * Setting the `internal` config on a filter means that it is a fixed part of your store's operation.
             *
             * {@link Core.data.Store#function-clearFilters} does not remove `internal` filters. If you add an
             * `internal` filter, you must explicitly remove it if it is no longer required.
             *
             * Grid features which offer column-based filtering do *not* ingest existing store filters on
             * their data field if the filter is `internal`
             * @config {Boolean}
             * @default false
             */
            internal : null,

            /**
             * When `true`, the filter will not be applied.
             * @config {Boolean}
             * @default
             */
            disabled : false
        };
    }

    static get configurable() {
        return {
            /**
             * The name of a property of candidate objects which yields the value to compare against this CollectionFilter's {@link #config-value}.
             * @member {String} property
             */
            /**
             * The name of a property of candidate objects which yields the value to compare against this CollectionFilter's {@link #config-value}.
             * @config {String}
             */
            property : null
        };
    }

    construct(config) {
        if (typeof config === 'function') {
            config = {
                filterBy : config
            };
        }

        // If Filter is created without a type (yet everything except applying state) create one
        if (!config.type) {
            if (DateHelper.isDate(config.value) || (Array.isArray(config.value) && config.value.every(DateHelper.isDate))) {
                config.type = 'date';
            }
            else if (config.value instanceof Duration) {
                config.type = 'duration';
            }
        }
        // If type already exist, it means we are applying state and should process value
        else {
            if (config.type === 'date' && config.value != null && !Array.isArray(config.value)) {
                config.value = new Date(config.value);
            }
            else if (config.type === 'duration' && config.value != null && !Array.isArray(config.value)) {
                config.value = new Duration(config.value);
            }
        }

        super.construct(config);


    }

    /**
     * When in a Collection (A Collection holds its Filters in a Collection), we need an id.
     * @property {String}
     * @private
     */
    get id() {
        if (!this._id) {
            // Internal filters get a special, unique property so that they cannot collide
            // with default filters for a field.
            if (this.internal) {
                this._id = CollectionFilter.generateId(`b-internal-${this.property}-filter-`);
            }
            else {
                this._id = this.property || CollectionFilter.generateId('b-filter-');
            }
        }
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    onChange(propertyChanged) {
        const me = this;

        // Inform any owner (eg a Store), that it has to reassess its CollectionFilters
        if (!me.isConfiguring && me.owner?.onFilterChanged && !me.owner.isConfiguring) {
            me.owner.onFilterChanged(me, propertyChanged);
        }
    }

    get filterBy() {
        return this._filterBy || this.defaultFilterBy;
    }

    /**
     * May be used in place of the {@link #config-property}, {@link #config-value} and {@link #config-property} configs. A function which
     * accepts a candidate object and returns `true` or `false`
     * @type {Function}
     * @param {*} data Data object for filtering
     * @returns {Boolean} Returns `true` for data valid for including
     */
    set filterBy(filterBy) {
        this._filterBy = filterBy;
    }

    defaultFilterBy(candidate) {
        const me = this;
        let candidateValue;

        // Let records handle retrieving their own values
        if (candidate.isModel) {
            candidateValue = candidate.getValue(me.property);
        }
        // check if is nested property
        else if (me._propertyItems.length > 1) {
            // support nested props (https://github.com/bryntum/support/issues/1861)
            candidateValue = me._propertyItems.reduce(nestedValueReducer, candidate);
        }
        else {
            candidateValue = candidate[me.property];
        }

        return me[me.operator](me.convert(candidateValue));
    }

    updateProperty(property) {
        this._propertyItems = property.split('.');

        // Signal to owner about filter change
        this.onChange('property');
    }

    /**
     * The value against which to compare the {@link #config-property} of candidate objects.
     * @type {*}
     */
    set value(value) {
        const me = this;
        me._value = value;

        // Filter value is a processed value to be used by the comparators. Useful when value is object, like Duration field
        if (Array.isArray(value) && (
            { date : 1, duration : 1 }[me.type] ||
            (value.length > 0 && typeof value[0] === 'string')
        )) {
            me._filterValue = value.map(v => me.convert(v));
        }
        else if (!me.caseSensitive && Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
            me._filterValue = value.map(s => s?.toLowerCase());
        }
        else if (!me.caseSensitive && typeof value === 'string') {
            me._filterValue = value.toLowerCase();
        }
        else {
            me._filterValue = me.convert(value);
        }

        // Signal to owner about filter change
        me.onChange('value');
    }

    get value() {
        return this._value;
    }

    get filterValue() {
        return this._filterValue;
    }

    /**
     * The operator to use when comparing a candidate object's {@link #config-property} with this CollectionFilter's {@link #config-value}.
     * @type {CollectionCompareOperator}
     */
    set operator(operator) {
        this._operator = operator;

        // Signal to owner about filter change
        this.onChange('operator');
    }

    get operator() {
        const me = this;
        if (me._operator) {
            return me._operator;
        }

        if (Array.isArray(me.filterValue)) {
            return 'isIncludedIn';
        }

        return typeof me.filterValue === 'string' ? '*' : '=';
    }

    convert(value) {
        // This is a workaround for filterbar feature: it always converts input value to string. When date is typed,
        // it is converted into string, and Date.valueOf() would return number. So if we are matching date against string
        // type, we should not convert it.
        if (this.operator !== 'sameTime' && !(typeof this.filterValue === 'string' && value instanceof Date)) {
            if (this.operator === 'sameDay') {
                value = DateHelper.clearTime(value);
            }

            // if value is a complex type, try to access `value` property to get primitive value
            value = value?.valueOf() ?? value;
        }

        value = !this.caseSensitive && (typeof value === 'string') ? value.toLowerCase() : value;

        return value;
    }

    filter(candidate) {
        return this.filterBy(candidate);
    }

    startsWith(v) {
        return String(v).startsWith(this.filterValue);
    }

    endsWith(v) {
        return String(v).endsWith(this.filterValue);
    }

    isIncludedIn(v) {
        return this.filterValue.length === 0 || this.filterValue.includes(v);
    }

    isNotIncludedIn(v) {
        return !this.isIncludedIn(v);
    }

    includes(v) {
        return this.filterValue.length === 0 || String(v).includes(this.filterValue);
    }

    doesNotInclude(v) {
        return !this.includes(v);
    }

    sameTime(v) {
        return DateHelper.isSameTime(v, this.filterValue);
    }

    sameDay(v) {
        return v === this.filterValue;
    }

    '='(v) {
        return ObjectHelper.isEqual(v, this.filterValue);
    }

    '!='(v) {
        return !ObjectHelper.isEqual(v, this.filterValue);
    }

    '>'(v) {
        return ObjectHelper.isMoreThan(v, this.filterValue);
    }

    '>='(v) {
        return ObjectHelper.isMoreThan(v, this.filterValue) || ObjectHelper.isEqual(v, this.filterValue);
    }

    '<'(v) {
        return ObjectHelper.isLessThan(v, this.filterValue);
    }

    '<='(v) {
        return ObjectHelper.isLessThan(v, this.filterValue) || ObjectHelper.isEqual(v, this.filterValue);
    }

    '*'(v) {
        return ObjectHelper.isPartial(v, this.filterValue);
    }

    between(v) {
        const [start, end] = this._filterValue;
        return (ObjectHelper.isMoreThan(v, start) || ObjectHelper.isEqual(v, start)) &&
            (ObjectHelper.isLessThan(v, end) || ObjectHelper.isEqual(v, end));
    }

    notBetween(v) {
        return !this.between(v);
    }

    empty(v) {
        return v === undefined || v === null || String(v).length === 0;
    }

    notEmpty(v) {
        return !this.empty(v);
    }

    isToday(v) {
        // Values have already been converted to fixed date range
        return this.between(v);
    }

    isTomorrow(v) {
        return this.between(v);
    }

    isYesterday(v) {
        return this.between(v);
    }

    isThisWeek(v) {
        return this.between(v);
    }

    isNextWeek(v) {
        return this.between(v);
    }

    isLastWeek(v) {
        return this.between(v);
    }

    isThisMonth(v) {
        return this.between(v);
    }

    isNextMonth(v) {
        return this.between(v);
    }

    isLastMonth(v) {
        return this.between(v);
    }

    isThisYear(v) {
        return this.between(v);
    }

    isNextYear(v) {
        return this.between(v);
    }

    isLastYear(v) {
        return this.between(v);
    }

    isYearToDate(v) {
        return this.between(v);
    }

    isTrue(v) {
        return v === true;
    }

    isFalse(v) {
        return v === false;
    }

    // Fill in actual dates relative to now
    setRelativeDateValues() {
        this._filterValue = CollectionFilter.getRelativeDateRange(this._operator)
            .map(date => date.valueOf());
    }

    static getRelativeDateRange(relativeExpr, now = new Date()) {
        let todayStart, tomorrowStart, parts, oneTimeUnit, unitStart, which, timeUnit;
        switch (relativeExpr) {
            case 'isYearToDate':
                return [DateHelper.floor(now, '1 year'), now];
            case 'isToday':
                todayStart = DateHelper.floor(now, '1 day');
                return [todayStart, DateHelper.add(todayStart, 1, 'day')];
            case 'isYesterday':
                todayStart = DateHelper.floor(now, '1 day');
                return [DateHelper.add(todayStart, -1, 'day'), todayStart];
            case 'isTomorrow':
                tomorrowStart = DateHelper.getStartOfNextDay(now);
                return [tomorrowStart, DateHelper.add(tomorrowStart, 1, 'day')];
            case 'isThisWeek':
            case 'isNextWeek':
            case 'isLastWeek':
            case 'isThisMonth':
            case 'isNextMonth':
            case 'isLastMonth':
            case 'isThisYear':
            case 'isNextYear':
            case 'isLastYear':
                parts = relativeExpr.toLowerCase().match(relativeDateUnitRegExp);
                if (!parts) {
                    throw new Error(`Unrecognized relative date expression: ${relativeExpr}`);
                }
                [, which, timeUnit] = parts;
                oneTimeUnit = `1 ${timeUnit}`;
                unitStart = DateHelper.floor(now, oneTimeUnit);
                if (which === 'next') {
                    unitStart = DateHelper.add(unitStart, 1, timeUnit);
                }
                else if (which === 'last') {
                    unitStart = DateHelper.add(unitStart, -1, timeUnit);
                }
                return [unitStart, DateHelper.add(unitStart, 1, timeUnit)];
        }
    }

    /**
     * Generates a filter function based on provided collection filters.
     * @advanced
     * @param {Core.util.CollectionFilter[]|Core.util.Collection} filters Filters used for creating a filtering function
     * @returns {Function} Returns a filter function
     */
    static generateFiltersFunction(filters) {
        if (!filters || (!filters.length && !filters.count)) {
            return FunctionHelper.returnTrue;
        }

        for (const filter of filters) {
            if (filter.type === 'date' && relativeDateOperators.includes(filter._operator)) {
                filter.setRelativeDateValues();
            }
        }

        return function(candidate) {
            let match = true;

            for (const filter of filters) {
                // Skip disabled filters
                if (!filter.disabled) {
                    match = filter.filter(candidate);
                }
                if (!match) {
                    break;
                }
            }

            return match;
        };
    }
}
