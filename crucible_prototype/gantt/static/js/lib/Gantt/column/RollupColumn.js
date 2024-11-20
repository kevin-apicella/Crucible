import CheckColumn from '../../Grid/column/CheckColumn.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * @module Gantt/column/RollupColumn
 */

/**
 * A column that displays a checkbox to edit the {@link Gantt.model.TaskModel#field-rollup rollup} data field.
 * This field indicates if a task should rollup to its closest parent or not.
 * Requires the {@link Gantt.feature.Rollups} feature to be enabled.
 *
 * This column uses a {@link Core.widget.Checkbox} as its editor, and it is not intended to be changed.
 *
 * @extends Grid/column/CheckColumn
 * @classtype rollup
 * @column
 */
export default class RollupColumn extends CheckColumn {

    static $name          = 'RollupColumn';
    static type          = 'rollup';
    static isGanttColumn = true;

    static defaults = {
        field : 'rollup',
        text  : 'L{Rollup}'
    };
}

ColumnStore.registerColumnType(RollupColumn);
