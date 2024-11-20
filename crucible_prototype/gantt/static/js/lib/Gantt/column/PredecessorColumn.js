import ColumnStore from '../../Grid/data/ColumnStore.js';
import DependencyColumn from './DependencyColumn.js';

/**
 * @module Gantt/column/PredecessorColumn
 */

/**
 * A column which displays, in textual form, the dependencies which link from tasks
 * upon which the contextual task depends.
 *
 * This type of column is editable by default. Default editor is a {@link Gantt/widget/DependencyField}.
 *
 * This column will be ignored if using {@link Grid/feature/CellCopyPaste} to paste or {@link Grid/feature/FillHandle}
 * to fill values.
 *
 * @classtype predecessor
 * @extends Gantt/column/DependencyColumn
 * @column
 */
export default class PredecessorColumn extends DependencyColumn {

    static get $name() {
        return 'PredecessorColumn';
    }

    static get type() {
        return 'predecessor';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            text  : 'L{Predecessors}',
            field : 'predecessors'
        };
    }

    calculateFillValue({ record, value : dependencyRecords }) {
        return dependencyRecords.map(rec => rec.copy({
            id : undefined,
            to : record.id
        }));
    }
}

ColumnStore.registerColumnType(PredecessorColumn);
