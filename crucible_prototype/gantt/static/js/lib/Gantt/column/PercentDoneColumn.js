import NumberColumn from '../../Grid/column/NumberColumn.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import '../../Core/widget/NumberField.js';

/**
 * @module Gantt/column/PercentDoneColumn
 */

/**
 * A column representing the {@link SchedulerPro.model.mixin.PercentDoneMixin#field-percentDone percentDone} field of the task.
 *
 * {@inlineexample Gantt/column/PercentDoneColumn.js}
 *
 * ## Styling
 *
 * Cells in this column get a `b-percentdone-cell` class added.
 *
 * If {@link #config-showCircle} is set, the resulting progress circle element in the cell gets a
 * few special CSS classes added:
 *
 * - If value equals 0, a `b-empty` CSS class is added to the circle element.
 * - If value equals 100, a `b-full` CSS class is added to the circle element.
 * - If value is > 100, a `b-over` CSS class is added to the circle element.
 *
 * Default editor is a {@link Core.widget.NumberField}.
 *
 * @extends Grid/column/NumberColumn
 * @classtype percentdone
 * @column
 */
export default class PercentDoneColumn extends NumberColumn {
    circleHeightPercentage = 0.75;

    static $name = 'PercentDoneColumn';

    static type = 'percentdone';

    static isGanttColumn = true;

    //region Config

    static fields = [
        /**
         * Set to `true` to render a circular progress bar to visualize the task progress
         * @config {Boolean} showCircle
         */
        'showCircle'
    ];

    static defaults = {
        field : 'percentDone',
        text  : 'L{% Done}',
        unit  : '%',
        step  : 1,
        min   : 0,
        max   : 100,
        width : 90,
        align : 'center'
    };

    //endregion

    construct(config) {
        super.construct(...arguments);

        if (this.showCircle) {
            this.htmlEncode = false;
        }
    }

    defaultRenderer({ record, isExport, value }) {
        value = record.getFormattedPercentDone(value);

        if (isExport) {
            return value;
        }

        if (this.showCircle) {
            return {
                tabIndex        : 0,
                role            : 'progressbar',
                'aria-valuemin' : 0,
                'aria-valuemax' : 100,
                'aria-valuenow' : value,
                'aria-label'    : `${record.name} ${value}${this.L('% Done')}`,
                className       : {
                    'b-percentdone-circle' : 1,
                    'b-full'               : value === 100,
                    'b-over'               : value > 100,
                    'b-empty'              : value === 0
                },
                style : {
                    // Math.round to work around Chrome bug: https://bugs.chromium.org/p/chromium/issues/detail?id=1468916
                    height                      : Math.round(this.circleHeightPercentage * this.grid.rowHeight) + 'px',
                    width                       : Math.round(this.circleHeightPercentage * this.grid.rowHeight) + 'px',
                    '--gantt-percentdone-angle' : `${value / 100}turn`
                },
                dataset : {
                    value
                }
            };

        }

        return value + this.unit;
    }
}

ColumnStore.registerColumnType(PercentDoneColumn);
