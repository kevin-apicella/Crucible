import ColumnStore from '../../Grid/data/ColumnStore.js';
import DurationColumn from '../../Scheduler/column/DurationColumn.js';

/**
 * @module Gantt/column/BaselineEndVarianceColumn
 */

/**
 * A column that displays the task End Variance. The end variance field is "0 days" until the
 * task start date varies from the baseline end date. This field is calculated as:
 *
 * ```
 * End Variance = End - Baseline End
 * ```
 *
 * @extends Scheduler/column/DurationColumn
 * @classtype baselineendvariance
 * @column
 */
export default class BaselineEndVarianceColumn extends DurationColumn {

    static $name = 'BaselineEndVarianceColumn';

    static type = 'baselineendvariance';

    static defaults = {
        editor   : false,
        readOnly : true,
        text     : 'L{endVariance}',
        field    : 'baselines[0].endVariance'
    };

}

ColumnStore.registerColumnType(BaselineEndVarianceColumn);
