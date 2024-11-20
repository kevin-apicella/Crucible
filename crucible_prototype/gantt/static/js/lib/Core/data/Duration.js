import NumberFormat from '../helper/util/NumberFormat.js';
import DateHelper from '../helper/DateHelper.js';

/**
 * @module Core/data/Duration
 */

/**
 * Object describing a duration.
 * @typedef {Object} DurationConfig
 * @property {Number} magnitude The magnitude of the duration
 * @property {DurationUnit} unit The unit of the duration
 */

/**
 * Class which represents a duration object. A duration consists of a `magnitude` and a `unit`.
 *
 * ```javascript
 * {
 *    unit      : String,
 *    magnitude : Number
 * }
 * ```
 *
 * Valid values are:
 * - "millisecond" - Milliseconds
 * - "second" - Seconds
 * - "minute" - Minutes
 * - "hour" - Hours
 * - "day" - Days
 * - "week" - Weeks
 * - "month" - Months
 * - "quarter" - Quarters
 * - "year"- Years
 */
export default class Duration {

    /**
     * Duration constructor.
     * @function constructor
     * @param {Number|String} magnitude Duration magnitude value or a duration + magnitude string ('2h', '4d')
     * @param {DurationUnit} [unit] Duration unit value
     * @category Lifecycle
     */
    constructor(magnitude, unit) {
        // we treat `magnitude === null` specially, it indicates the user intention
        // to unschedule the task
        if (typeof magnitude === 'number' || magnitude === null) {
            this._magnitude = magnitude;
            this._unit = unit;
        }
        else {
            if (typeof magnitude === 'string') {
                Object.assign(this, DateHelper.parseDuration(magnitude));
            }
            if (typeof magnitude === 'object') {
                Object.assign(this, magnitude);
            }
        }
    }

    /**
     * Get/Set numeric magnitude `value`.
     * @property {Number}
     */
    get magnitude() {
        return this._magnitude;
    }

    set magnitude(value) {
        this._magnitude = (typeof value === 'number') && value;
    }

    /**
     * Get/set duration unit to use with the current magnitude value.
     * Valid values are:
     * - "millisecond" - Milliseconds
     * - "second" - Seconds
     * - "minute" - Minutes
     * - "hour" - Hours
     * - "day" - Days
     * - "week" - Weeks
     * - "month" - Months
     * - "quarter" - Quarters
     * - "year"- Years
     *
     * @member {DurationUnit}
     */
    get unit() {
        return this._unit;
    }

    set unit(value) {
        this._unit = DateHelper.parseTimeUnit(value);
    }

    get isValid() {
        return this._magnitude != null && Boolean(DateHelper.normalizeUnit(this._unit));
    }

    /**
     * The `milliseconds` property is a read only property which returns the number of milliseconds in this Duration
     * @property {Number}
     * @readonly
     */
    get milliseconds() {
        // There's no smaller time unit in the Date class than milliseconds, so round any divided values
        return this.isValid ? Math.round(DateHelper.asMilliseconds(this._magnitude, this._unit)) : 0;
    }

    /**
     * Returns truthy value if this Duration equals the passed value.
     * @param {Core.data.Duration} value
     * @returns {Boolean}
     */
    isEqual(value) {
        return Boolean(value) && this._magnitude != null && value._magnitude != null && this.milliseconds === value.milliseconds;
    }

    /**
     * Returns a readable localized representation of this Duration (e.g. 5 days).
     * @param {Boolean} useAbbreviation Pass `true` to return an abbreviated version (e.g. 5 d)
     * @returns {String}
     */
    toString(useAbbreviation) {
        const
            me             = this,
            abbreviationFn = useAbbreviation ? 'getShortNameOfUnit' : 'getLocalizedNameOfUnit';
        return me.isValid ? `${NumberFormat.get('9.#').format(me._magnitude)} ${DateHelper[abbreviationFn](me._unit, me._magnitude !== 1)}` : '';
    }

    toJSON() {
        return this.toString();
    }

    valueOf() {
        return this.milliseconds;
    }

    diff(otherDuration) {
        return new Duration({
            unit      : this.unit,
            magnitude : DateHelper.as(this.unit, this.milliseconds - otherDuration.milliseconds)
        });
    }
};
