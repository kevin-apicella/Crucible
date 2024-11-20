import ColumnStore from '../../Grid/data/ColumnStore.js';
import DurationColumn from '../../Scheduler/column/DurationColumn.js';

/**
 * @module Gantt/column/BaselineDurationVarianceColumn
 */

/**
 * A column that displays the task Duration Variance. The duration variance field is "0 days" until the
 * task duration varies from the baseline duration. This field is calculated as:
 *
 * ```
 * Duration Variance = Duration - Baseline Duration
 * ```
 *
 * @extends Scheduler/column/DurationColumn
 * @classtype baselinedurationvariance
 * @column
 */
export default class BaselineDurationVarianceColumn extends DurationColumn {

    static $name = 'BaselineDurationVarianceColumn';

    static type = 'baselinedurationvariance';

    static defaults = {
        editor   : false,
        readOnly : true,
        text     : 'L{durationVariance}',
        field    : 'baselines[0].durationVariance'
    };

}

ColumnStore.registerColumnType(BaselineDurationVarianceColumn);
