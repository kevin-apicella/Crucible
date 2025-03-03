import ColumnStore from '../../Grid/data/ColumnStore.js';
import GanttDateColumn from '../../Gantt/column/GanttDateColumn.js';
import '../../SchedulerPro/widget/StartDateField.js';

/**
 * @module Gantt/column/StartDateColumn
 */

/**
 * A column that displays (and allows user to update) the task's {@link Gantt.model.TaskModel#field-startDate start date}.
 *
 * Default editor is a {@link SchedulerPro.widget.StartDateField StartDateField}.
 *
 * If {@link #config-format} is omitted, Gantt's {@link Scheduler.view.mixin.TimelineViewPresets#config-displayDateFormat} will be used as a default value and
 * the format will be dynamically updated while zooming according to the {@link Scheduler.preset.ViewPreset#field-displayDateFormat} value specified for the ViewPreset being selected.
 *
 * @extends Gantt/column/GanttDateColumn
 * @classtype startdate
 * @column
 */
export default class StartDateColumn extends GanttDateColumn {

    static get $name() {
        return 'StartDateColumn';
    }

    static get type() {
        return 'startdate';
    }

    static get defaults() {
        return {
            field : 'startDate',
            text  : 'L{Start}'
        };
    }

    get defaultEditor() {
        const editorCfg = super.defaultEditor;

        editorCfg.type = 'startdate';

        return editorCfg;
    }
}

ColumnStore.registerColumnType(StartDateColumn);
