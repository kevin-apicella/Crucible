import TimelineSummary from '../../Scheduler/feature/TimelineSummary.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';

/**
 * @module Gantt/feature/Summary
 */

/**
 * Describes a summary level for the time axis in Gantt
 * @typedef GanttSummaryOptions
 * @property {String} label Label for the summary
 * @property {Function} renderer Function to calculate the and render the summary value
 * @property {Date} startDate Tick start date
 * @property {Date} endDate Tick end date
 * @property {Gantt.data.TaskStore} taskStore Task store
 * @property {Gantt.data.TaskStore} store Display store, for when Gantt is configured to display tasks from another
 * store than its task store (for example when using the TreeGroup feature)
 */

/**
 * A feature displaying a summary bar in the grid footer.
 *
 * ## Summaries in the locked grid
 * For regular columns in the locked section - specify type of summary on columns, available types are:
 * <dl class="wide">
 * <dt>sum <dd>Sum of all values in the column
 * <dt>add <dd>Alias for sum
 * <dt>count <dd>Number of rows
 * <dt>countNotEmpty <dd>Number of rows containing a value
 * <dt>average <dd>Average of all values in the column
 * <dt>function <dd>A custom function, used with store.reduce. Should take arguments (sum, record)
 * </dl>
 * Columns can also specify a {@link Grid.column.Column#config-summaryRenderer} to format the calculated sum.
 *
 * ## Summaries in the time axis grid
 *
 * To output summaries in the ticks of the time axis summary bar, either provide a {@link #config-renderer} or use
 * {@link #config-summaries}. The `renderer` method provides the current tick `startDate` and `endDate` which you
 * can use to output the data you want to present in each summary cell.
 *
 * ```javascript
 * features : {
 *     summary     : {
 *         // Find all intersecting task and render the count in each cell
 *         renderer: ({ taskStore, startDate, endDate }) => {
 *             const intersectingTasks = taskStore.query(task =>
 *                 // Gantt by default renders tasks as early as possible, if loaded with un-normalized data there
 *                 // might not be any start and end dates calculated yet
 *                 task.isScheduled &&
 *                 // Find tasks that intersect the current tick
 *                 DateHelper.intersectSpans(task.startDate, task.endDate, startDate, endDate)
 *             );
 *
 *             return intersectingTasks.length;
 *         }
 *     }
 * }
 * ```
 *
 * {@inlineexample Gantt/feature/Summary.js}
 *
 * This feature is <strong>disabled</strong> by default.
 *
 * @extends Scheduler/feature/TimelineSummary
 * @classtype summary
 * @feature
 * @demo Gantt/summary
 *
 * @typings Grid.feature.Summary -> Grid.feature.GridSummary
 * @typings Scheduler.feature.Summary -> Scheduler.feature.SchedulerSummary
 */
export default class Summary extends TimelineSummary {
    //region Config

    static get $name() {
        return 'Summary';
    }

    static get configurable() {
        return {
            /**
             * Array of summary configs which consists of a label and a {@link #config-renderer} function
             *
             * ```javascript
             * new Gantt({
             *     features : {
             *         summary : {
             *             summaries : [
             *                 {
             *                     label : 'Label',
             *                     renderer : ({ startDate, endDate, taskStore }) => {
             *                         // return display value
             *                         returns '<div>Renderer output</div>';
             *                     }
             *                 }
             *             ]
             *         }
             *     }
             * });
             * ```
             *
             * @config {GanttSummaryOptions[]}
             */
            summaries : null,

            /**
             * Renderer function for a single time axis tick. Should calculate a sum and return HTML as a result.
             *
             * ```javascript
             * new Gantt({
             *     features : {
             *         summary : {
             *             renderer : ({ startDate, endDate, taskStore }) => {
             *                 // return display value
             *                 returns '<div>Renderer output</div>';
             *             }
             *         }
             *     }
             * });
             * ```
             *
             * @param {Object} context Rendering context object
             * @param {Date} context.startDate Tick start date
             * @param {Date} context.endDate Tick end date
             * @param {Gantt.data.TaskStore} context.taskStore Task store
             * @param {Gantt.data.TaskStore} context.store Display store, for when Gantt is configured to display tasks from
             *   another store than its task store (for example when using the TreeGroup feature)
             * @returns {String} Html content
             * @config {Function}
             */
            renderer : null
        };
    }

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        const config = super.pluginConfig;

        config.chain.push('updateTaskStore', 'bindStore');

        return config;
    }

    //endregion

    //region Init

    construct(gantt, config) {
        super.construct(gantt, config);

        // Feature might be run from Grid (in docs), should not crash
        if (gantt.isGanttBase) {
            this.updateTaskStore(gantt.taskStore);
        }
    }

    bindStore() {
        this.updateTimelineSummaries();
    }

    //endregion

    //region Render

    updateTaskStore(taskStore) {
        this.detachListeners('summaryTaskStore');

        taskStore.ion({
            name    : 'summaryTaskStore',
            filter  : 'updateTimelineSummaries',
            thisObj : this
        });
    }

    /**
     * Updates summaries.
     * @private
     */
    updateTimelineSummaries() {
        const
            me                = this,
            {
                client,
                summaries
            }                 = me,
            { timeAxis }      = client,
            summaryContainer  = me.summaryBarElement;

        if (summaryContainer && client.isEngineReady) {
            Array.from(summaryContainer.children).forEach((element, i) => {
                const tick = timeAxis.getAt(i);

                let html    = '',
                    tipHtml = `<header>${me.L('L{Summary for}', client.getFormattedDate(tick.startDate))}</header>`;

                summaries.forEach(config => {
                    const
                        value     = config.renderer({
                            startDate     : tick.startDate,
                            endDate       : tick.endDate,
                            taskStore     : client.taskStore,
                            store         : client.store,
                            resourceStore : client.resourceStore,
                            gantt         : client,
                            element
                        }),
                        valueHtml = `<div class="b-timeaxis-summary-value">${value ?? '&nbsp;'}</div>`;

                    if (summaries.length > 1 || value !== '') {
                        html += valueHtml;
                    }

                    tipHtml += `<label>${config.label || ''}</label>` + valueHtml;
                });

                element.innerHTML = html;
                element._tipHtml  = tipHtml;
            });
        }
    }
}

// Override Grids Summary with this improved version
GridFeatureManager.registerFeature(Summary, false, 'Gantt');
