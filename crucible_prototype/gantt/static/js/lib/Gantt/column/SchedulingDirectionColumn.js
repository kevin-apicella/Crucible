import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import SchedulingDirectionPicker from '../../SchedulerPro/widget/SchedulingDirectionPicker.js';

/**
 * @module Gantt/column/SchedulingDirectionColumn
 */

/**
 * This is a column class for the {@link Gantt/model/TaskModel#field-direction scheduling direction}
 * field of the task model. Please refer to the documentation of that field for more details.
 *
 * Default editor is a {@link SchedulerPro/widget/SchedulingDirectionPicker}.
 *
 * The direction can be one of:
 *
 * - Forward
 * - Backward
 *
 * @extends Grid/column/Column
 * @classtype schedulingdirection
 * @column
 */
export default class SchedulingDirectionColumn extends Column {

    static $name = 'SchedulingDirectionColumn';

    static type = 'schedulingdirection';

    static isGanttColumn = true;

    // has to be a getter for the localization test to pick up the `L{schedulingDirection}` usage
    static get defaults() {
        return {
            field  : 'direction',
            text   : 'L{schedulingDirection}',
            width  : 146,
            editor : {
                type         : 'schedulingdirectionpicker',
                allowInvalid : false
            },
            filterable : {
                filterField : {
                    type : 'schedulingdirectionpicker'
                }
            }
        };
    }

    getEnforcedName(task) {
        return task.name || (task.isRoot ? 'Project' : `Task #${ task.id }`);
    }

    get tooltipRenderer() {
        if (this._tooltipRenderer !== undefined) {
            return this._tooltipRenderer;
        }

        return this._tooltipRenderer = ({ record }) => {
            const { effectiveDirection } = record;

            if (!effectiveDirection) {
                return false;
            }

            if (effectiveDirection.kind === 'enforced') {
                return this.L('L{enforcedBy}') + ` "${ this.getEnforcedName(effectiveDirection.enforcedBy) }"`;
            }
            else if (effectiveDirection.kind === 'inherited') {
                return this.L('L{inheritedFrom}') + ` "${ this.getEnforcedName(effectiveDirection.inheritedFrom) }"`;
            }
            else {
                return undefined;
            }
        };
    }

    renderer({ record }) {
        const { effectiveDirection } = record;

        if (!effectiveDirection) {
            return '';
        }

        let value;

        if (effectiveDirection.kind === 'enforced') {
            value = effectiveDirection.direction;
        }
        else if (effectiveDirection.kind === 'inherited') {
            value = effectiveDirection.direction;
        }
        else {
            value = record.direction;
        }

        return SchedulingDirectionPicker.localize(value) || '';
    }
}

ColumnStore.registerColumnType(SchedulingDirectionColumn);
