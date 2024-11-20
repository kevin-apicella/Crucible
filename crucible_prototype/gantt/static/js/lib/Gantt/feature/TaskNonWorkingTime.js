import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import AttachToProjectMixin from '../../Scheduler/data/mixin/AttachToProjectMixin.js';
import Tooltip from '../../Core/widget/Tooltip.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import EventHelper from '../../Core/helper/EventHelper.js';

const casedEventName = {
    click       : 'Click',
    dblclick    : 'DblClick',
    contextmenu : 'ContextMenu'
};

/**
 * @module Gantt/feature/TaskNonWorkingTime
 */

/**
 * Feature highlighting the non-working time intervals for tasks, based on their {@link Gantt.model.TaskModel#field-calendar}.
 * If a task has no calendar defined, the project's calendar will be used. The non-working time interval can also be
 * recurring. You can find a live example showing how to achieve this in the [Task Calendars Demo](../examples/calendars/).
 *
 * {@inlineexample Gantt/feature/TaskNonWorkingTime.js}
 *
 * The demo above shows the default `row` mode, but the feature also supports a `bar` {@link #config-mode} that shades
 * parts of the task bars:
 *
 * {@inlineexample Gantt/feature/TaskNonWorkingTimeBar.js}
 *
 * If you want a tooltip to be displayed when hovering over the non-working time interval, you can configure a
 * {@link #config-tooltipTemplate}.
 *
 * ## Data structure
 * Below you see an example of data defining calendars and assigning the tasks a calendar:
 * ```javascript
 * const gantt = new Gantt({
 *     features : {
 *         taskNonWorkingTime : true
 *     },
 *
 *     // A Project holding the data and the calculation engine for the Gantt. It also acts as a CrudManager, allowing
 *     project   : {
 *         tasksData : [
 *             { id : 1, name : 'Task 1' },
 *             { id : 2, name : 'Task 2', calendar : 'break' }
 *         ],
 *         calendarsData : [
 *             {
 *                 id        : 'general',
 *                 name      : 'General',
 *                 intervals : [
 *                     {
 *                         recurrentStartDate : 'on Sat at 0:00',
 *                         recurrentEndDate   : 'on Mon at 0:00',
 *                         isWorking          : false
 *                     }
 *                 ]
 *             },
 *             {
 *                 id        : 'break',
 *                 name      : 'Breaks',
 *                 intervals : [
 *                     {
 *                         startDate : '2022-08-07',
 *                         endDate   : '2022-08-11',
 *                         isWorking : false
 *                     },
 *                     {
 *                         startDate : '2022-08-18',
 *                         endDate   : '2022-08-20',
 *                         isWorking : false
 *                     }
 *                 ]
 *             }
 *         ]
 *     }
 * }):
 * ```
 *
 * ## Styling non-working time interval elements
 *
 * To style the elements representing the non-working time elements you can set the {@link SchedulerPro.model.CalendarModel#field-cls}
 * field in your data. This will add a CSS class to all non-working time elements for the calendar. You can also add an
 * {@link SchedulerPro.model.CalendarModel#field-iconCls} value specifying an icon to display inside the interval.
 *
 * ```javascript
 * {
 *   "success"   : true,
 *   "calendars" : {
 *       "rows" : [
 *           {
 *               "id"                       : "day",
 *               "name"                     : "Day shift",
 *               "unspecifiedTimeIsWorking" : false,
 *               "cls"                      : "dayshift",
 *               "intervals"                : [
 *                   {
 *                       "recurrentStartDate" : "at 8:00",
 *                       "recurrentEndDate"   : "at 17:00",
 *                       "isWorking"          : true
 *                   }
 *               ]
 *           }
 *       ]
 *    }
 * }
 * ```
 *
 * You can also add a `cls` value and an `iconCls` to **individual** intervals:
 *
 * ```javascript
 * {
 *   "success"   : true,
 *   "calendars" : {
 *       "rows" : [
 *           {
 *               "id"                       : "day",
 *               "name"                     : "Day shift",
 *               "unspecifiedTimeIsWorking" : true,
 *               "intervals"                : [
 *                   {
 *                      "startDate"          : "2022-03-23T02:00",
 *                      "endDate"            : "2022-03-23T04:00",
 *                      "isWorking"          : false,
 *                      "cls"                : "factoryShutdown",
 *                      "iconCls"            : "warningIcon"
 *                  }
 *               ]
 *           }
 *       ]
 *    }
 * }
 * ```
 *
 * This feature is **disabled** by default.
 * For info on enabling it, see {@link Grid.view.mixin.GridFeatures}.
 *
 * @extends Core/mixin/InstancePlugin
 * @demo Gantt/calendars
 * @classtype taskNonWorkingTime
 * @feature
 */
export default class TaskNonWorkingTime extends InstancePlugin.mixin(AttachToProjectMixin) {
    /**
     * Triggered when clicking a nonworking time element
     * @event taskNonWorkingTimeClick
     * @param {Gantt.view.Gantt} source The Gantt chart instance
     * @param {Gantt.model.TaskModel} taskRecord Task record
     * @param {Object} interval The raw data describing the nonworking time interval
     * @param {String} interval.name The interval name (if any)
     * @param {Date} interval.startDate The interval start date
     * @param {Date} interval.endDate The interval end date
     * @param {MouseEvent} domEvent Browser event
     * @on-owner
     */

    /**
     * Triggered when double-clicking a nonworking time element
     * @event taskNonWorkingTimeDblClick
     * @param {Gantt.view.Gantt} source The Gantt chart instance
     * @param {Gantt.model.TaskModel} taskRecord Task record
     * @param {Object} interval The raw data describing the nonworking time interval
     * @param {String} interval.name The interval name (if any)
     * @param {Date} interval.startDate The interval start date
     * @param {Date} interval.endDate The interval end date
     * @param {MouseEvent} domEvent Browser event
     * @on-owner
     */

    /**
     * Triggered when right-clicking a nonworking time element
     * @event taskNonWorkingTimeContextMenu
     * @param {Gantt.view.Gantt} source The Gantt chart instance
     * @param {Gantt.model.TaskModel} taskRecord Task record
     * @param {Object} interval The raw data describing the nonworking time interval
     * @param {String} interval.name The interval name (if any)
     * @param {Date} interval.startDate The interval start date
     * @param {Date} interval.endDate The interval end date
     * @param {MouseEvent} domEvent Browser event
     * @on-owner
     */

    //region Config

    static $name = 'TaskNonWorkingTime';

    static configurable = {
        idPrefix : 'TaskNonWorkingTime',

        /**
         * The largest time axis unit to display non working ranges for ('hour' or 'day' etc).
         * When zooming to a view with a larger unit, no non-working time elements will be rendered.
         *
         * **Note:** Be careful with setting this config to big units like 'year'. When doing this,
         * make sure the timeline {@link Scheduler.view.TimelineBase#config-startDate start} and
         * {@link Scheduler.view.TimelineBase#config-endDate end} dates are set tightly.
         * When using a long range (for example many years) with non-working time elements rendered per hour,
         * you will end up with millions of elements, impacting performance.
         * When zooming, use the {@link Scheduler.view.mixin.TimelineZoomable#config-zoomKeepsOriginalTimespan} config.
         * @config {String}
         * @default
         */
        maxTimeAxisUnit : 'week',

        /**
         * A template function used to generate contents for a tooltip when hovering non-working time intervals
         * ```javascript
         * const gantt = new Gantt({
         *     features : {
         *         taskNonWorkingTime : {
         *             tooltipTemplate({ taskRecord, startDate, endDate }) {
         *                 return 'Non-working time';
         *             }
         *         }
         *     ]
         * });
         * ```
         * @config {Function} tooltipTemplate
         * @param {Object} data Tooltip data
         * @param {Gantt.model.TaskModel} data.taskRecord The taskRecord
         * @param {Date} data.startDate The start date of the-non working interval
         * @param {Date} data.endDate The end date of the non-working interval
         * @param {String} data.name The name of the non-working interval
         * @param {String} data.cls The cls of the non-working interval
         * @param {String} data.iconCls The iconCls of the non-working interval
         * @returns {String|DomConfig|DomConfig[]}
         */
        tooltipTemplate : null,

        tooltip : {},

        /**
         * Rendering mode, one of:
         * - 'row' - renders non-working time intervals to the task row
         * - 'bar' - renders non-working time intervals inside the task bar
         * - 'both - combines 'row' and 'bar' rendering modes
         * @prp {'row'|'bar'|'both'}
         */
        mode : 'row',

        /**
         * Config that allows rendering to take into account the Gantt {@link Gantt.view.Gantt#config-fillTicks} config:
         * - `true` - renders non-working time intervals taking into account the Gantt {@link Gantt.view.Gantt#config-fillTicks} config
         * - `false` - (default) renders non-working time intervals without taking into account the Gantt {@link Gantt.view.Gantt#config-fillTicks} config
         * @prp {Boolean}
         */
        respectFillTicks : false
    };

    // Cannot use `static properties = {}`, new Map/Set would pollute the prototype
    static get properties() {
        return {
            rowMap  : new Map(),
            taskMap : new Map()
        };
    };

    static pluginConfig = {
        before : ['updateFillTicks'],
        chain  : ['onTaskDataGenerated', 'onInternalPaint']
    };

    // No feature based styling needed, do not add a cls to Scheduler
    static featureClass = '';

    //endregion

    //region Init

    construct() {
        super.construct(...arguments);

        const
            me         = this,
            { client } = me;

        client.timeAxis.ion({
            name        : 'timeAxis',
            reconfigure : 'onTimeAxisReconfigure',
            // should trigger before event rendering chain
            prio        : 100,
            thisObj     : me
        });

        client.timeAxisViewModel.ion({
            name    : 'timeAxisViewModel',
            update  : 'onTimeAxisReconfigure',
            // should trigger before event rendering chain
            prio    : 100,
            thisObj : me
        });

        client.ion({
            beforeToggleNode : 'clear',
            thisObj          : me
        });
    }

    attachToProject(project) {
        super.attachToProject(project);

        project.ion({
            name    : 'project',
            refresh : 'onProjectRefresh',
            prio    : 100,
            thisObj : this
        });
    }

    attachToEventStore(store) {
        super.attachToEventStore(store);

        store.ion({
            name    : 'eventStore',
            filter  : 'clear',
            sort    : 'clear',
            thisObj : this
        });
    }

    onProjectRefresh() {
        this.clear();
    }

    onInternalPaint({ firstPaint }) {
        if (firstPaint) {
            this.mouseEventsDetacher = EventHelper.on({
                element     : this.client.foregroundCanvas,
                delegate    : '.b-tasknonworkingtime',
                click       : 'handleMouseEvent',
                dblclick    : 'handleMouseEvent',
                contextmenu : 'handleMouseEvent',
                thisObj     : this
            });
        }
    }

    doDisable(disable) {
        super.doDisable(disable);

        this.clear();
        this.client.refresh();
    }

    updateMode() {
        if (!this.isConfiguring) {
            this.clear();
            this.client.refresh();
        }
    }

    updateFillTicks() {
        this.clear();
    }

    updateRespectFillTicks() {
        this.clear();
        this.client.refreshWithTransition();
    }

    clear() {
        this.taskMap.clear();
        this.rowMap.clear();
    }

    //endregion

    //region Events

    onTimeAxisReconfigure() {
        this.clear();
    }

    //endregion

    //region Rendering

    // Called on render of resources events to get events to render. Add any ranges
    // (chained function from Scheduler)
    onTaskDataGenerated(renderData) {
        if (!renderData.task.effectiveVisualCalendar) {
            return;
        }

        if (this.mode !== 'bar') {
            const calendarIntervals = this.getCalendarIntervalsToRender(renderData, false);

            // Convert indicator timespans to DOMConfigs for rendering
            renderData.extraConfigs.push(...calendarIntervals);
        }

        if (this.mode !== 'row') {
            const calendarIntervals = this.getCalendarIntervalsToRender(renderData, true);

            renderData.children.push(...calendarIntervals);
        }
    }

    getCalendarIntervalsToRender(renderData, barMode = false) {
        const
            me           = this,
            {
                rowMap,
                taskMap,
                client
            }            = me,
            { timeAxis } = client,
            fillTicks    = client.fillTicks && me.respectFillTicks,
            {
                unit,
                increment
            }            = timeAxis,
            { task }     = renderData,
            intervals    = [],
            shouldPaint  = !me.maxTimeAxisUnit || DateHelper.compareUnits(timeAxis.unit, me.maxTimeAxisUnit) <= 0,
            map          = barMode ? taskMap : rowMap;

        if (!me.disabled && shouldPaint) {
            const oneTickMs = timeAxis.first.durationMS;

            if (!map.has(task.id)) {
                const
                    calendar    = task.effectiveVisualCalendar,
                    // In bar mode we only care about intervals fitting in the task, while in row mode we care about
                    // all intervals
                    ranges      = (!barMode || task.isScheduled) ? calendar.getNonWorkingTimeRanges(
                        barMode ? task.startDate : client.startDate,
                        barMode ? task.endDate : client.endDate
                    ) : [],
                    domConfigs  = [];

                let prevRange = null;

                // iterate ranges + 1 more step after
                for (let i = 0; i <= ranges.length; i++) {
                    const range = ranges[i];

                    // intervals returned by the calendar are not merged, let's combine them to yield fewer elements
                    if (prevRange && range && range.startDate <= prevRange.endDate && range.name === prevRange.name) {
                        // extend last interval if current one overlaps it
                        prevRange.endDate = range.endDate;
                    }
                    else {
                        // add its DOM config
                        if (prevRange) {
                            // When filling ticks, non-working-time ranges are snapped to full ticks too
                            if (fillTicks) {
                                prevRange.startDate = DateHelper.ceil(prevRange.startDate, { magnitude : increment, unit });
                                prevRange.endDate = DateHelper.floor(prevRange.endDate, { magnitude : increment, unit });
                            }

                            if (prevRange.endDate - prevRange.startDate >= oneTickMs) {
                                domConfigs.push(me.createIntervalDOMConfig({
                                    id           : `r${task.id}i${i - 1}`,
                                    iconCls      : prevRange.iconCls || calendar.iconCls || '',
                                    cls          : `${calendar.cls ? `${calendar.cls} ` : ''}${prevRange.cls || ''}`,
                                    startDate    : prevRange.startDate,
                                    endDate      : prevRange.endDate,
                                    name         : prevRange.name,
                                    isNonWorking : true
                                }, renderData, barMode));
                            }
                        }

                        prevRange = range;
                    }
                }

                map.set(task.id, domConfigs);
            }

            intervals.push(...ObjectHelper.clone(map.get(task.id)));
        }

        return intervals;
    }

    createIntervalDOMConfig(interval, renderData, barMode = false) {
        const
            { client : gantt } = this,
            { taskRecord }     = renderData,
            {
                cls,
                iconCls,
                name,
                startDate,
                endDate
            }                  = interval,
            x                  = gantt.getCoordinateFromDate(startDate) - (barMode ? renderData.left : 0),
            width              = gantt.getCoordinateFromDate(endDate) - x - (barMode ? renderData.left : 0),
            top                = barMode ? null : gantt.store.indexOf(taskRecord) * gantt.rowManager.rowOffsetHeight,
            height             = barMode ? null : gantt.rowHeight;

        return {
            className : {
                'b-tasknonworkingtime' : 1,
                [cls]                  : 1
            },

            style : {
                left  : x,
                top,
                height,
                // Crop to fit task's width in bar mode
                width : barMode && width + x > renderData.width ? renderData.width - x : width
            },

            children : [
                iconCls ? {
                    tag       : 'i',
                    className : iconCls
                } : null,
                name
            ],

            dataset : {
                taskId : interval.id
            },

            elementData : {
                taskRecord,
                interval
            }
        };
    }

    //endregion

    //region Tooltip

    changeTooltip(tooltip, old) {
        const me = this;

        old?.destroy();

        if (!me.tooltipTemplate || !tooltip) {
            return null;
        }

        return Tooltip.new({
            align          : 'b-t',
            forSelector    : '.b-timelinebase:not(.b-eventeditor-editing):not(.b-resizing-event):not(.b-dragcreating):not(.b-dragging-event):not(.b-creating-dependency) .b-sch-foreground-canvas > .b-tasknonworkingtime',
            forElement     : me.client.timeAxisSubGridElement,
            showOnHover    : true,
            hideDelay      : 0,
            anchorToTarget : true,
            trackMouse     : false,
            getHtml        : ({ activeTarget }) => {
                const
                    {
                        taskRecord,
                        interval
                    } = activeTarget.elementData;

                return me.tooltipTemplate({ taskRecord, ...interval });
            }
        }, tooltip);
    }

    //endregion

    handleMouseEvent(domEvent) {
        const
            me                       = this,
            target                   = domEvent.target.closest('.b-tasknonworkingtime'),
            { taskRecord, interval } = target.elementData;

        me.client.trigger('taskNonWorkingTime' + casedEventName[domEvent.type], {
            feature : me,
            taskRecord,
            interval,
            domEvent
        });
    }
}

GridFeatureManager.registerFeature(TaskNonWorkingTime, false, 'Gantt');
