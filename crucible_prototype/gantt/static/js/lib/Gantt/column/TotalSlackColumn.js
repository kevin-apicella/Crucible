import ColumnStore from '../../Grid/data/ColumnStore.js';
import DurationColumn from '../../Scheduler/column/DurationColumn.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import Duration from '../../Core/data/Duration.js';

/**
 * @module Gantt/column/TotalSlackColumn
 */

/**
 * A column that displays the task's {@link Gantt.model.TaskModel#field-totalSlack total slack}.
 *
 * Default editor is a {@link Core.widget.DurationField}.
 *
 * @extends Scheduler/column/DurationColumn
 * @classtype totalslack
 * @column
 */
export default class TotalSlackColumn extends DurationColumn {

    static $name = 'TotalSlackColumn';
    static type = 'totalslack';
    static isGanttColumn = true;

    durationUnitField = 'slackUnit';

    static get defaults() {
        return {
            field : 'totalSlack',
            text  : 'L{Total Slack}',
            filterable({ value, record, operator, column }) {
                const
                    a = DateHelper.asMilliseconds(column.roundValue(record.totalSlack), record.slackUnit),
                    b = value.milliseconds;

                switch (operator) {
                    case '='  : return a === b;
                    case '<'  : return a < b;
                    case '<=' : return a <= b;
                    case '>'  : return a > b;
                    case '>=' : return a >= b;
                    default   : throw new Error('Invalid operator ' + operator);
                }
            }
        };
    }

    getFilterableValue(record) {
        return new Duration({
            magnitude : record.totalSlack,
            unit      : record.slackUnit
        });
    }
}

ColumnStore.registerColumnType(TotalSlackColumn);
