import ColumnStore from '../../Grid/data/ColumnStore.js';
import GanttDateColumn from '../../Gantt/column/GanttDateColumn.js';

/**
 * @module Gantt/column/BaselineStartDateColumn
 */

/**
 * A column that displays the task baseline start date.
 *
 * @extends Gantt/column/GanttDateColumn
 * @classtype baselinestartdate
 * @column
 */
export default class BaselineStartDateColumn extends GanttDateColumn {

    static $name = 'BaselineStartDateColumn';

    static type = 'baselinestartdate';

    static defaults = {
        text  : 'L{baselineStart}',
        field : 'baselines[0].startDate'
    };

}
ColumnStore.registerColumnType(BaselineStartDateColumn);
