import ColumnStore from '../../Grid/data/ColumnStore.js';
import DurationColumn from '../../Scheduler/column/DurationColumn.js';

/**
 * @module Gantt/column/BaselineDurationColumn
 */

/**
 * A column that displays the task baseline duration.
 *
 * @extends Scheduler/column/DurationColumn
 * @classtype baselineduration
 * @column
 */
export default class BaselineDurationColumn extends DurationColumn {

    static $name = 'BaselineDurationColumn';

    static type = 'baselineduration';

    static defaults = {
        text  : 'L{baselineDuration}',
        field : 'baselines[0].fullDuration'
    };

}

ColumnStore.registerColumnType(BaselineDurationColumn);
