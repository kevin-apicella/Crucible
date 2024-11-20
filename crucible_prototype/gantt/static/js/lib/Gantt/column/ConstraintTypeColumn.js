import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import ConstraintTypePicker from '../../SchedulerPro/widget/ConstraintTypePicker.js';

/**
 * @module Gantt/column/ConstraintTypeColumn
 */
const directionMap = { Forward : 'assoonaspossible', Backward : 'aslateaspossible' };

/**
 * {@link Gantt/model/TaskModel#field-constraintType Constraint type} column.
 *
 * Default editor is a {@link SchedulerPro/widget/ConstraintTypePicker}.
 *
 * By default, the constraint type can be one of:
 *
 * - As soon as possible
 * - As late as possible
 * - Must start on [date]
 * - Must finish on [date]
 * - Start no earlier than [date]
 * - Start no later than [date]
 * - Finish no earlier than [date]
 * - Finish no later than [date]
 *
 * If you want to allow only certain constraint types to be selected, please refer to the docs for the
 * {@link SchedulerPro/widget/ConstraintTypePicker}.
 *
 * The date of the constraint can be specified with the {@link Gantt/column/ConstraintDateColumn}
 *
 * @extends Grid/column/Column
 * @classtype constrainttype
 * @column
 */
export default class ConstraintTypeColumn extends Column {
    static $name = 'ConstraintTypeColumn';

    static type = 'constrainttype';

    static isGanttColumn = true;

    static defaults = {
        field  : 'constraintType',
        text   : 'L{Constraint Type}',
        width  : 146,
        editor : {
            type         : 'constrainttypepicker',
            clearable    : true,
            allowInvalid : false
        },
        filterable : {
            filterField : {
                type : 'constrainttypepicker'
            }
        }
    };

    get editor() {
        const editor = super.editor;

        editor.includeAsapAlapAsConstraints = this.grid.project.includeAsapAlapAsConstraints;

        return editor;
    }

    renderer({ record, value }) {
        return ConstraintTypePicker.localize((this.grid.project.includeAsapAlapAsConstraints && directionMap[record.direction]) || value) || '';
    }
}

ColumnStore.registerColumnType(ConstraintTypeColumn);
