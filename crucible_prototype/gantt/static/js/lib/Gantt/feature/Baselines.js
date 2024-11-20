import TooltipBase from '../../Scheduler/feature/base/TooltipBase.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';

/**
 * @module Gantt/feature/Baselines
 */

const baselineSelector = '.b-task-baseline';

/**
 * Displays a {@link Gantt.model.TaskModel task}'s {@link Gantt.model.TaskModel#field-baselines} below the tasks in the
 * timeline.
 *
 * {@inlineexample Gantt/feature/Baselines.js}
 *
 * This feature also optionally shows a tooltip when hovering any of the task's baseline elements. The
 * tooltip's content may be customized.
 *
 * <div class="note">If dates (startDate and endDate) are left out in the baseline data, the task's dates will be
 * applied. If dates are `null`, they will be kept empty and the baseline bar won't be displayed in the UI.</div>
 *
 * To customize the look of baselines, you can supply `cls` or `style´ in the baseline data.
 *
 * This feature is **disabled** by default.
 * For info on enabling it, see {@link Grid.view.mixin.GridFeatures}.
 *
 * @extends Scheduler/feature/base/TooltipBase
 * @demo Gantt/baselines
 * @classtype baselines
 * @feature
 */
export default class Baselines extends TooltipBase {
    //region Config

    static get $name() {
        return 'Baselines';
    }

    // Default configuration.
    static get defaultConfig() {
        return {
            cls         : 'b-gantt-task-tooltip',
            align       : 't-b',
            forSelector : baselineSelector,
            recordType  : 'baseline'
        };
    }

    static configurable = {
        /**
         * An empty function by default, but provided so that you can override it. This function is called each time
         * a task baseline is rendered into the gantt to render the contents of the baseline element.
         *
         * Returning a string will display it in the baseline bar, it accepts both plain text or HTML. It is also
         * possible to return a DOM config object which will be synced to the baseline bars content.
         *
         * ```javascript
         * // using plain string
         * new Gantt({
         *     features : {
         *         baselines : {
         *             renderer : ({ baselineRecord }) => baselineRecord.startDate
         *         }
         *     }
         * });
         *
         * // using DOM config
         * new Gantt({
         *     features : {
         *         baselines : {
         *             renderer : ({ baselineRecord }) => {
         *                 return {
         *                     tag : 'b',
         *                     html : baselineRecord.startDate
         *                 };
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * @param {Object} detail An object containing the information needed to render a Baseline.
         * @param {Gantt.model.TaskModel} detail.taskRecord The task record.
         * @param {Gantt.model.Baseline} detail.baselineRecord The baseline record.
         * @param {DomConfig} detail.renderData An object containing details about the baseline element.
         * @returns {DomConfig|DomConfig[]|String} A string or an DomObject config object to append to a baseline element children
         * @prp {Function}
         */
        renderer : null
    };

    static get pluginConfig() {
        return {
            chain : [
                // onTaskDataGenerated for populating task with baselines
                'onTaskDataGenerated',
                // onInternalPaint for creating tooltip (in TooltipBase)
                'onInternalPaint'
            ]
        };
    }

    updateRenderer() {
        this.gantt.refresh();
    }

    //endregion

    //region Init & destroy

    construct(gantt, config) {
        this.tipId = `${gantt.id}-baselines-tip`;
        this.gantt = gantt;

        super.construct(gantt, config);
    }

    doDisable(disable) {
        // Hide or show the baseline elements
        this.client.refreshWithTransition();

        super.doDisable(disable);
    }

    //endregion

    //region Element & template

    resolveTimeSpanRecord(forElement) {
        const baselineElement = forElement.closest(baselineSelector);
        return baselineElement?.elementData.baseline;
    }

    /**
     * Template (a function accepting event data and returning a string) used to display info in the tooltip.
     * The template will be called with an object as with fields as detailed below
     * @config {Function}
     * @param {Object} data A data block containing the information needed to create tooltip content
     * @param {Gantt.model.Baseline} data.baseline The Baseline record to display
     * @param {String} data.startClockHtml Predefined HTML to show the start time
     * @param {String} data.endClockHtml Predefined HTML to show the end time
     * @returns {DomConfig|String|null}
     */
    template(data) {
        const
            me              = this,
            { baseline }    = data,
            { task }        = baseline,
            displayDuration = me.client.formatDuration(baseline.duration);

        return `
            <div class="b-gantt-task-title">${StringHelper.encodeHtml(task.name)} (baseline ${baseline.parentIndex + 1})</div>
            <table>
            <tr><td>${me.L('L{TaskTooltip.Start}')}:</td><td>${data.startClockHtml}</td></tr>
            ${baseline.milestone ? '' : `
                <tr><td>${me.L('L{TaskTooltip.End}')}:</td><td>${data.endClockHtml}</td></tr>
                <tr><td>${me.L('L{TaskTooltip.Duration}')}:</td><td class="b-right">${displayDuration + ' ' + DateHelper.getLocalizedNameOfUnit(baseline.durationUnit, baseline.duration !== 1)}</td></tr>
            `}
            </table>
            `;
    }

    getTaskDOMConfig(taskRecord, top) {
        const
            me        = this,
            baselines = taskRecord.baselines.allRecords,
            { rtl }   = me.client,
            position  = rtl ? 'right' : 'left';

        return {
            className : {
                'b-baseline-wrap' : true
            },
            style : {
                transform : `translateY(${top}px)`
            },
            dataset : {
                // Prefix task id to allow element reusage also for baseline wrap
                taskId : `baselinesFor${taskRecord.id}`
            },
            children : baselines.map((baseline, i) => {
                const
                    baselineBox = me.gantt.taskRendering.getTaskBox(baseline),
                    inset       = baselineBox ? (rtl ? me.client.timeAxisSubGrid.totalFixedWidth - baselineBox.left : baselineBox.left) : 0;

                if (baselineBox) {
                    const renderData = {
                        className : {
                            [baseline.cls]              : baseline.cls,
                            'b-task-baseline'           : 1,
                            'b-task-baseline-milestone' : baseline.milestone
                        },
                        style : {
                            width      : baselineBox.width,
                            [position] : inset,
                            style      : baseline.style
                        },
                        dataset : {
                            index : i
                        },
                        elementData : {
                            baseline
                        }
                    };

                    const value = me.renderer ? me.renderer({ baselineRecord : baseline, taskRecord, renderData }) : '';

                    if (typeof value === 'string') {
                        renderData.html = value;
                    }
                    else {
                        renderData.children = [value].flat();
                    }

                    return renderData;
                }
                else {
                    return null;
                }
            }),
            syncOptions : {
                syncIdField : 'index',
                strict      : true
            }
        };
    }

    onTaskDataGenerated({ taskRecord, top, extraConfigs, wrapperCls }) {
        if (!this.disabled && taskRecord.hasBaselines) {
            wrapperCls['b-has-baselines'] = 1;
            extraConfigs.push(this.getTaskDOMConfig(taskRecord, top));
        }
    }

    //endregion
}

GridFeatureManager.registerFeature(Baselines, false, 'Gantt');
