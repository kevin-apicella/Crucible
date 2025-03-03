import ColumnStore from '../../Grid/data/ColumnStore.js';
import GanttDateColumn from './GanttDateColumn.js';

/**
 * @module Gantt/column/EarlyStartDateColumn
 */

/**
 * A column that displays the task's {@link Gantt.model.TaskModel#field-earlyStartDate early start date}.
 *
 * Default editor is a {@link Core.widget.DateField DateField}.
 *
 * If {@link #config-format} is omitted, Gantt's {@link Scheduler.view.mixin.TimelineViewPresets#config-displayDateFormat} will be used as a default value and
 * the format will be dynamically updated while zooming according to the {@link Scheduler.preset.ViewPreset#field-displayDateFormat} value specified for the ViewPreset being selected.
 *
 * @extends Gantt/column/GanttDateColumn
 * @classtype earlystartdate
 * @column
 */
export default class EarlyStartDateColumn extends GanttDateColumn {

    static get $name() {
        return 'EarlyStartDateColumn';
    }

    static get type() {
        return 'earlystartdate';
    }

    static get defaults() {
        return {
            field : 'earlyStartDate',
            text  : 'L{Early Start}'
        };
    }
}

ColumnStore.registerColumnType(EarlyStartDateColumn);
