import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import SchedulingModePicker from '../../SchedulerPro/widget/SchedulingModePicker.js';

/**
 * @module Gantt/column/SchedulingModeColumn
 */

/**
 * A column which displays a task's scheduling {@link Gantt.model.TaskModel#field-schedulingMode mode} field.
 *
 * Default editor is a {@link SchedulerPro.widget.SchedulingModePicker SchedulingModePicker}.
 *
 * @extends Grid/column/Column
 * @classtype schedulingmodecolumn
 * @column
 */
export default class SchedulingModeColumn extends Column {

    static get $name() {
        return 'SchedulingModeColumn';
    }

    static get type() {
        return 'schedulingmodecolumn';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field  : 'schedulingMode',
            text   : 'L{Scheduling Mode}',
            editor : {
                type         : SchedulingModePicker.type,
                allowInvalid : false,
                picker       : {
                    minWidth : '8.5em'
                }
            }
        };
    }

    afterConstruct() {
        const me = this;

        super.afterConstruct();

        let store;
        if (me.editor) {
            store = me.editor.store;
        }
        else {
            store = new SchedulingModePicker().store;
        }
        this.store = store;
    }

    renderer({ value }) {
        const model = this.store.getById(value);
        return model && model.text || '';
    }

    // Refreshes the column **after** the editor locale change
    // to display properly translated scheduling modes
    onEditorLocaleChange() {
        this.grid.refreshColumn(this);
    }

    // Only allow if complete range is only inside this column
    canFillValue({ range }) {
        return range.every(cs => cs.column === this);
    }

}

ColumnStore.registerColumnType(SchedulingModeColumn);
