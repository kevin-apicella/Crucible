/**
 * @module Core/helper/TimeZoneHelper
 */

// region Internal

// Used internally to save offset info
class TimeZoneOffsetInfo extends Array {
    constructor(timeZone, year) {
        super();
        this.timeZone = timeZone;
        this.year = year;
    }
}

// Used internally to handle more info than possible with ordinary Date
class TimeZoneDate {
    constructor(asString, timeZone) {
        this.asString = asString;
        this.timeZone = timeZone;
        this.asArray = parseStringDate(asString);
    }

    // Lazy, used in TZH.toTimeZone
    get asLocalDate() {
        if (!this._asLocalDate) {
            this._asLocalDate = new Date(...this.asArray);
        }
        return this._asLocalDate;
    }

    // Lazy, used when finding offsets
    get asTicksUtc() {
        if (!this._asTicksUtc) {
            this._asTicksUtc = new Date(Date.UTC(...this.asArray)).getTime();
        }
        return this._asTicksUtc;
    }
}

// Takes a local date and converts it to a TimeZoneDate by converting to string and parsing it
const
    toTimeZoneInternal = (date, timeZone) => {
        const tzDateString = date.toLocaleString('sv-SE', { timeZone });
        return new TimeZoneDate(tzDateString, timeZone);
    },

    // Takes ticks (Date.getTime()) and a timezone and returns the difference
    getOffsetUtc = (ticks, timeZone) => {
        const { asTicksUtc, asString }  = toTimeZoneInternal(new Date(ticks), timeZone);
        return { offset : (ticks - asTicksUtc) / 60000, tzTicksUtc : asTicksUtc, tzString : asString };
    },

    // Parse a 'YYYY-MM-DD HH:MM' formatted datetime into an array of numbers (month is zero-based)
    parseStringDate = stringDate => {
        const parsed = stringDate.split(/[\s-:]/).map(i => i * 1);
        parsed[1] -= 1;
        return parsed;
    },

    min   = -60000,
    hour  = 3600000,
    day   = -86400000,
    month = 2592000000,

    // This function will take a IANA time zone and any year, and then loop through each month and test for UTC offsets
    // If it finds more than one, that implies that current time zone has DST that actual year. The function will then go
    // deeper and find the exact datetimes where DST changes occurs.
    // All data is cached, so when same year is asked for later it's already calculated
    findOffsetDates = (timeZone, year) => {
        const cached = offsetDateCache.get(timeZone, year);
        if (cached) {
            return cached;
        }
        const
            offsets        = new TimeZoneOffsetInfo(timeZone, year),
            // The check runs with UTC ticks
            startUtcTicks  = new Date(Date.UTC(year, 0, 1)).getTime();
        let ticks          = startUtcTicks,
            incr           = month,
            monthIndex     = 0,
            previousOffset = [],
            currentOffset  = null,
            tzTicksUtc, tzString, offset,  done;

        // Loop is perhaps a bit difficult to understand. Basically, what it does is this:
        // (1) Go forward month by month looking for changed offsets, if found continue reading (2), else no DST found.
        // (2) Go backwards from date found in (1) day by day until offset changes back to the first one found.
        // (3) Go forwards hour by hour from date found in (2) until offset changes again.
        // (4) Go backwards minute by minute from date found in (3) until offset changes back to the first one found.
        // (5) The offset we're looking for is the one previous to that found in (4).
        // (6) Continue loop for next DST change date.

        while (!done) {
        // Gets UTC offset for current utc ticks
            ({ offset, tzTicksUtc, tzString } = getOffsetUtc(ticks, timeZone));

            // If first call, add that offset to the list of found offsets.
            // Also save this offset as the current one found
            if (currentOffset == null) {
                currentOffset = offset;
                offsets.push({ offset });
            }
            // If we are looping months or hours and the offset has changed from the one previously found
            else if (incr > 0 && offset !== currentOffset) {
            // Change to loop days or minutes
                incr = incr === month ? day : min;
            }
            // If we are looping days or minutes and the offset again equals the one previously found
            else if (incr < 0 && offset === currentOffset) {
            // If we are looping days, change to loop hours
                if (incr === day) {
                    incr = hour;
                }
                // If we are looping minutes, that means that we have found the exact DST change position
                else {
                // Just one offset, add another
                    if (offsets.length === 1) {
                        offsets.push(previousOffset);
                        currentOffset = previousOffset.offset;
                    // Continue to find the ending of offset2/start of offset1
                    }
                    // Has two offset, found ending of offset2/start of offset1
                    else {
                        offsets[0].startTicks = previousOffset.startTicks;
                        offsets[0].startDateString = previousOffset.startDateString;
                        // We are done
                        done = true;
                    }
                    // Change to loop months again
                    incr = month;
                }
            }

            // Always store previous offset as to easily be able to get back to it in loop
            previousOffset = { offset, startDateString : tzString, startTicks : tzTicksUtc };

            // If we're looping months, we need to ignore the day/hour/minute loop on ticks
            if (incr === month) {
                ticks = startUtcTicks;
                ticks += monthIndex * month;
                monthIndex += 1;
            }

            ticks += incr;

            // If now DST, we are done after 12 months
            if (monthIndex > 11) {
                done = true;
            }
        }

        // Save to cache
        offsetDateCache.set(offsets);

        return offsets;
    },

    offsetDateCache = {
        _cache : {},
        get(timeZone, year) {
            return this._cache[timeZone]?.[year];
        },
        set(offsetInfo) {
            const
                { timeZone } = offsetInfo,
                { _cache } = this;

            if (!_cache[timeZone]) {
                _cache[timeZone] = {};
            }
            _cache[timeZone][offsetInfo.year] = offsetInfo;
        }
    };

// endregion

/**
 * Helper for time zone manipulation.
 */
export default class TimeZoneHelper {

    static get $name() {
        return 'TimeZoneHelper';
    }

    /**
     * Adjusts the time of the specified date to match the specified time zone. i.e. "what time is it now in this
     * timezone?"
     *
     * JavaScript dates are always in the local time zone. This function adjusts the time to match the time in the
     * specified time zone, without altering the time zone. Thus, it won't hold the same time as the original date.
     *
     * Note that this time zone calculation relies on the browsers built-in functionality to convert a local date to a
     * string in a given time zone and then converting the string back into a date. If browsers time zone information
     * or interpretation is inaccurate or lacks data, the conversion will probably be inaccurate as well.
     *
     * ```javascript
     * const localDate = new Date(2020, 7, 31, 7); // UTC+2 ('Europe/Stockholm')
     * const cstDate   = TimeZoneHelper.toTimezone(localDate, 'America/Chicago'); // 2020, 7, 31, 0 (still UTC+2, but
     * // appear as UTC-6)
     * ```
     *
     * @static
     * @param {Date} date
     * @param {String|Number} timeZone Timezone supported by `Intl.DateFormat` or a UTC offset in minutes
     * @returns {Date}
     */
    static toTimeZone(date, timeZone) {
        if (typeof timeZone === 'number') {
            return this.toUtcOffset(date, timeZone);
        }
        const tzDate = toTimeZoneInternal(date, timeZone);

        if (tzDate.asArray[3] !== tzDate.asLocalDate.getHours()) {
            console.warn('Incorrect time zone conversion due to local DST-switch detected');
        }
        return tzDate.asLocalDate;
    }

    /**
     * Adjusts the time of the specified date to match local system time zone in the specified time zone. i.e. "what
     * time in my timezone would match time in this timezone?"
     *
     * JavaScript dates are always in the local time zone. This function adjusts the time to match the time in the
     * specified time zone, without altering the time zone. Thus, it won't hold the same time as the original date.
     *
     * Note that this time zone calculation relies on the browsers built-in functionality to convert a date from a given
     * timezone into a local date by calculating specified time zone UTC offsets and using those to perform the date
     * conversion. If browsers time zone information or interpretation is inaccurate or lacks data, the conversion will
     * probably be inaccurate as well.
     *
     * ```javascript
     * const cstDate   = new Date(2022, 8, 27, 4); // CST 'America/Chicago'
     * const localDate = TimeZoneHelper.fromTimeZone(cstDate, 'America/Chicago'); // 2022, 8, 27, 11 (UTC+2 Europe/Stockholm)
     * ```
     *
     * @static
     * @param {Date} date
     * @param {String|Number} timeZone Timezone supported by Intl.DateFormat or a UTC offset in minutes
     * @returns {Date}
     */
    static fromTimeZone(date, timeZone) {
        if (typeof timeZone === 'number') {
            return this.fromUtcOffset(date, timeZone);
        }

        const
            dateArr     = this.dateAsArray(date),
            offsetDates = findOffsetDates(timeZone, date.getUTCFullYear());
        let useOffset = offsetDates[0].offset;

        if (offsetDates.length === 2) {
            const utcTicks = Date.UTC(...dateArr);
            if (utcTicks >= offsetDates[1].startTicks && utcTicks < offsetDates[0].startTicks) {
                useOffset = offsetDates[1].offset;
            }
        }

        // Converting without having to deal with local time
        dateArr[4] += useOffset; // Adds offset minutes

        return new Date(Date.UTC(...dateArr));
    }

    /**
     * Adjusts the time of the specified date with provided UTC offset in minutes
     *
     * JavaScript dates are always in the local time zone. This function adjusts the time to match the time in the
     * specified time zone, without altering the time zone. Thus, it won't hold the same time as the original date.
     *
     * ```javascript
     * const localDate = new Date(2020, 7, 31, 7); // UTC+2
     * const utcDate   = TimeZoneHelper.toUtcOffset(localDate, 0); // 2020, 7, 31, 5 (still UTC+2, but appear as UTC+0)
     * ```
     *
     * @static
     * @private
     * @param {Date} date
     * @param {Number} utcOffset in minutes
     * @returns {Date}
     */
    static toUtcOffset(date, utcOffset) {
        const offset = date.getTimezoneOffset() + utcOffset;

        return new Date(date.getTime() + offset * 60 * 1000);
    }

    /**
     * Adjusts the time of the specified date by removing the provided UTC offset in minutes.
     *
     * JavaScript dates are always in the local time zone. This function adjusts the time to match the time in the
     * specified time zone, without altering the time zone. Thus, it won't hold the same time as the original date.
     *
     * ```javascript
     * const utcDate = new Date(2020, 7, 31, 7); // UTC
     * const utcDate = TimeZoneHelper.fromUtcOffset(localDate, 0); // 2020, 7, 31, 9 (matches 2020-08-31 07:00+00:00)
     * ```
     *
     * @static
     * @private
     * @param {Date} date
     * @param {Number} utcOffset in minutes
     * @returns {Date}
     */
    static fromUtcOffset(date, utcOffset) {
        const offset = -date.getTimezoneOffset() - utcOffset;

        return new Date(date.getTime() + offset * 60 * 1000);
    }

    // Converts a date into an array of its parts ([year, month, day, etc.]).
    // Convenient as a date info bearer which is not affected by local time zone
    static dateAsArray(date) {
        return [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()];
    }
}

TimeZoneHelper.findOffsetDates = findOffsetDates;
