import CheckColumn from '../../Grid/column/CheckColumn.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * @module Gantt/column/IgnoreResourceCalendarColumn
 */

/**
 * A column that displays (and allows user to change) whether the task ignores its assigned resource calendars
 * when scheduling or not ({@link Gantt.model.TaskModel#field-ignoreResourceCalendar} field).
 *
 * This column uses a {@link Core.widget.Checkbox checkbox} as its editor, and it is not intended to be changed.
 *
 * @extends Grid/column/CheckColumn
 * @classtype ignoreresourcecalendar
 * @column
 */
export default class IgnoreResourceCalendarColumn extends CheckColumn {

    static $name = 'IgnoreResourceCalendarColumn';

    static type = 'ignoreresourcecalendar';

    static isGanttColumn = true;

    static get defaults() {
        return {
            field : 'ignoreResourceCalendar',
            text  : 'L{Ignore resource calendar}'
        };
    }
}

ColumnStore.registerColumnType(IgnoreResourceCalendarColumn);
