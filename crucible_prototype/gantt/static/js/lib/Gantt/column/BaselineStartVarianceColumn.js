import ColumnStore from '../../Grid/data/ColumnStore.js';
import DurationColumn from '../../Scheduler/column/DurationColumn.js';

/**
 * @module Gantt/column/BaselineStartVarianceColumn
 */

/**
 * A column that displays the task Start Variance. The start variance field is "0 days" until the
 * task start date varies from the baseline start date. This field is calculated as:
 *
 * ```
 * Start Variance = Start - Baseline Start
 * ```
 *
 * @extends Scheduler/column/DurationColumn
 * @classtype baselinestartvariance
 * @column
 */
export default class BaselineStartVarianceColumn extends DurationColumn {

    static $name = 'BaselineStartVarianceColumn';

    static type = 'baselinestartvariance';

    static defaults = {
        editor   : false,
        readOnly : true,
        text     : 'L{startVariance}',
        field    : 'baselines[0].startVariance'
    };

}

ColumnStore.registerColumnType(BaselineStartVarianceColumn);
