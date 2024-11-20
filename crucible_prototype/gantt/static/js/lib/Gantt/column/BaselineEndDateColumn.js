import ColumnStore from '../../Grid/data/ColumnStore.js';
import GanttDateColumn from '../../Gantt/column/GanttDateColumn.js';
import '../../SchedulerPro/widget/StartDateField.js';

/**
 * @module Gantt/column/BaselineEndDateColumn
 */

/**
 * A column that displays the task baseline finish date.
 *
 * @extends Gantt/column/GanttDateColumn
 * @classtype baselineenddate
 * @column
 */
export default class BaselineEndDateColumn extends GanttDateColumn {

    static $name = 'BaselineEndDateColumn';

    static type = 'baselineenddate';

    static defaults = {
        text  : 'L{baselineEnd}',
        field : 'baselines[0].endDate'
    };

}

ColumnStore.registerColumnType(BaselineEndDateColumn);
