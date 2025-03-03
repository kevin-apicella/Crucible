import Base from '../../Base.js';

/**
 * @module Core/data/mixin/StoreSum
 */

/**
 * Mixin for Store that handles summaries.
 *
 * @mixin
 */
export default Target => class StoreSum extends (Target || Base) {
    static get $name() {
        return 'StoreSum';
    }

    /**
     * Returns sum calculated by adding value of specified field for specified records. Defaults to using all records
     * in store
     * @param {String} field Field to summarize by
     * @param {Core.data.Model[]} records Records to summarize, uses all records if unspecified.
     * @returns {Number}
     * @category Sum
     */
    sum(field, records = this.storage.values) {
        if (!records) {
            return 0;
        }

        return records.reduce((sum, record) => {
            if (record.isSpecialRow) {
                return sum;
            }

            const v = Number(record.getValue(field));

            return isNaN(v) ? sum : sum + v;
        }, 0);
    }

    /**
     * Returns min value for the specified field, can be used with Date or Number values. Defaults to look through all records in store
     * @param {String} field Field to find min value for
     * @param {Core.data.Model[]} records Records to process, uses all records if unspecified
     * @returns {Number|Date}
     * @category Sum
     */
    min(field, records = this.storage.values) {
        if (!records?.length) {
            return 0;
        }

        return records.reduce((min, record) => {
            const
                fieldValue = record.getValue(field),
                type       = typeof fieldValue?.valueOf();

            if (type === 'number' && (fieldValue < min || min == null)) {
                min = fieldValue;
            }
            return min;
        }, records[0].getValue(field));
    }

    /**
     * Returns max value for the specified field, can be used with Date or Number values. Defaults to look through all records in store
     * @param {String} field Field to find max value for
     * @param {Core.data.Model[]} records Records to process, uses all records if unspecified
     * @returns {Number|Date}
     * @category Sum
     */
    max(field, records = this.storage.values) {
        if (!records?.length) {
            return 0;
        }

        return records.reduce((max, record) => {
            const
                fieldValue = record.getValue(field),
                type       = typeof fieldValue?.valueOf();

            if (type === 'number' && (fieldValue > max || max == null)) {
                max = fieldValue;
            }
            return max;
        }, records[0].getValue(field));
    }

    /**
     * Returns the average value for the specified field. Defaults to look through all records in store
     * @param {String} field Field to calculate average value for
     * @param {Core.data.Model[]} records Records to process, uses all records if unspecified
     * @returns {Number}
     * @category Sum
     */
    average(field, records = this.storage.values) {
        if (!records?.length) {
            return 0;
        }

        let count = 0;

        const sum = records.reduce((sum, record) => {
            if (record.isSpecialRow) {
                return sum;
            }

            const v = parseFloat(record.getValue(field));

            if (!isNaN(v)) {
                count++;
                return sum + v;
            }
            else {
                return sum;
            }
        }, 0);

        return count > 0 ? sum / count : 0;
    }

    /**
     * Returns sum by adding value of specified field for records in the group with the specified groupValue.
     * @param {*} groupValue The group to summarize
     * @param {String} field Field to summarize by
     * @returns {Number} Sum or null if store not grouped
     * @category Sum
     */
    groupSum(groupValue, field) {
        return this.sum(field, this.getGroupRecords(groupValue));
    }
};
