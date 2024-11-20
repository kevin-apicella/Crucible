import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import CalendarPicker from '../widget/CalendarPicker.js';

/**
 * @module Gantt/column/CalendarColumn
 */

/**
 * A column that displays (and allows user to update) the current {@link Gantt.model.CalendarModel calendar} of the task.
 *
 * Default editor is a {@link Gantt.widget.CalendarPicker CalendarPicker}.
 *
 * @extends Grid/column/Column
 * @classtype calendar
 * @column
 */
export default class CalendarColumn extends Column {

    static $name = 'CalendarColumn';

    static type =  'calendar';

    static isGanttColumn = true;

    static defaults = {
        field  : 'calendar',
        text   : 'L{Calendar}',
        editor : {
            type         : CalendarPicker.type,
            clearable    : true,
            allowInvalid : false
        }
    };

    afterConstruct() {
        super.afterConstruct();

        const
            me      = this,
            gantt   = me.grid,
            project = gantt.project;

        // Store default calendar to filter out this value
        me.defaultCalendar = project.defaultCalendar;

        gantt.ion({
            projectChange : 'bindProject',
            thisObj       : me
        });

        me.bindProject();
    }

    bindProject() {
        const me = this;
        me.detachListeners('project');

        me.grid.project.calendarManagerStore.ion({
            name            : 'project',
            changePreCommit : me.refreshCalendars,
            refresh         : me.refreshCalendars,
            thisObj         : me
        });
        me.refreshCalendars();
    }

    // region Events

    refreshCalendars() {
        if (this.editor) {
            const project = this.grid.project;

            this.editor.refreshCalendars(project.calendarManagerStore.allRecords);
        }
    }

    // endregion

    renderer({ value }) {
        if (value !== this.defaultCalendar && value?.id != null) {
            const model = this.grid.project.calendarManagerStore.getById(value.id);
            return model?.name ?? '';
        }
        return '';
    }

    fromClipboardString({ string, record }) {
        return this.grid.project.calendarManagerStore.find(rec => rec.name === string);
    }
}

ColumnStore.registerColumnType(CalendarColumn);
