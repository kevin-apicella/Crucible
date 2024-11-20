import BrowserHelper from '../../../Core/helper/BrowserHelper.js';
import DH from '../../../Core/helper/DateHelper.js';
import GridFeatureManager from '../../../Grid/feature/GridFeatureManager.js';
import InstancePlugin from '../../../Core/mixin/InstancePlugin.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import XMLHelper from '../../../Core/helper/XMLHelper.js';
import Model from '../../../Core/data/Model.js';

const

    MIN_DATE = DH.clearTime(new Date(1900, 5, 15)),
    taskUnitMap = {
        minute : 3,
        hour   : 5,
        day    : 7,
        week   : 9,
        month  : 11
    },
    projectUnitMap = {
        minute : 1,
        hour   : 2,
        day    : 3,
        week   : 4,
        month  : 5
    },
    constraintMap = {
        finishnoearlierthan : 6,
        finishnolaterthan   : 7,
        mustfinishon        : 3,
        muststarton         : 2,
        startnoearlierthan  : 4,
        startnolaterthan    : 5
    },
    typeMap = {
        FixedDuration : 1,
        FixedUnits    : 0,
        FixedEffort   : 2,
        Normal        : 0
    },
    dependencyTypeMap = {
        0 : 3,
        1 : 2,
        2 : 1,
        3 : 0
    },
    commaRegExp = /,/g;

/**
 * @module Gantt/feature/export/MspExport
 */

/**
 * A feature that allows exporting Gantt to Microsoft Project without involving a server.
 *
 * [Microsoft Project XML specification](https://docs.microsoft.com/en-us/office-project/xml-data-interchange/introduction-to-project-xml-data)
 *
 * This feature supports exporting to an XML format that can be imported by MS Project Professional 2013 / 2019.
 *
 * Here is an example of how to add the feature:
 *
 * ```javascript
 * const gantt = new Gantt({
 *     features : {
 *         mspExport : {
 *             // Choose the filename for the exported file
 *             filename : 'Gantt Export'
 *         }
 *     }
 * });
 * ```
 *
 * And how to trigger an export:
 *
 * ```javascript
 * gantt.features.mspExport.export({
 *     filename : 'Gantt Export'
 * })
 * ```
 *
 * ## Processing of exported data
 *
 * Use the {@link #event-dataCollected} event to process exported data before it is written to the XML-file:
 *
 * ```javascript
 * // set listener on Gantt construction step
 * const gantt = new Gantt({
 *     ---
 *     features : {
 *         mspExport : {
 *             listeners : {
 *                 dataCollected : ({ data }) => {
 *                     // patch <Project><Name> tag content
 *                     data.Name = 'My Cool Project';
 *                 }
 *             }
 *         }
 *     }
 * });
 *
 * // set listener at runtime
 * gantt.features.mspExport.on({
 *     dataCollected : ({ data }) => {
 *         // patch <Project><Name> tag content
 *         data.Name = 'My Cool Project';
 *     }
 * })
 * ```
 *
 * This feature is **disabled** by default.
 * For info on enabling it, see {@link Grid/view/mixin/GridFeatures}.
 *
 * @classtype mspExport
 *
 * @extends Core/mixin/InstancePlugin
 * @feature
 * @demo Gantt/msprojectexport
 */
export default class MspExport extends InstancePlugin {

    static $name = 'MspExport';

    resourceCalendar = new Map();

    static configurable = {
        /**
         * Name of the exported file (including extension)
         * @config {String}
         * @default
         */
        filename : null,

        /**
         * Defines how dates are formatted for MS Project. Information about formats can be found in {@link Core.helper.DateHelper}
         * @config {String}
         * @default
         */
        dateFormat : 'YYYY-MM-DDTHH:mm:ss',

        /**
         * Defines how time is formatted for MSProject. Information about formats can be found in {@link Core.helper.DateHelper}
         * @config {String}
         * @default
         */
        timeFormat : 'HH:mm:ss',

        /**
         * Defines the version used for MSProject (2013 or 2019)
         * @config {Number}
         * @default
         */
        msProjectVersion : 2019,

        /**
         * Specify `true` to replace commas in resource names with semicolons.
         * @config {Boolean}
         * @default
         */
        replaceResourceNameCommas : false
    };

    /**
     * Generate the export data to generate the XML.
     * @returns {Object} Gantt data on MS Project structure to generate the XML
     * @private
     */
    generateExportData() {
        const me = this;

        me.tasks = me.collectProjectTasks();

        return {
            ...me.getMsProjectConfig(),
            Calendars : {
                Calendar : me.getCalendarsData()
            },
            Tasks : {
                Task : me.getTasksData()
            },
            Resources : {
                Resource : me.getResourcesData()
            },
            Assignments : {
                Assignment : me.getAssignmentsData()
            }
        };
    }

    /**
     * Generates and downloads the .XML file.
     * @param {Object} [config] Optional configuration object, which overrides the initial settings of the feature/exporter.
     * @param {String} [config.filename] The filename to use
     */
    export(config = {}) {
        const me = this;

        if (me.disabled) {
            return;
        }

        me.resourceCalendar.clear();

        config = ObjectHelper.assign({}, me.config, config);

        if (!config.filename) {
            config.filename = `${me.client.$$name}.xml`;
        }

        /**
         * Fires on the owning Gantt before export starts. Return `false` to cancel the export.
         * @event beforeMspExport
         * @preventable
         * @on-owner
         * @param {Object} config Export config
         */
        if (me.client.trigger('beforeMspExport', { config }) !== false) {

            const data = me.generateExportData(config);

            /**
             * Fires when project data is collected to an object
             * that is going to be exported as XML text.
             *
             * The event can be used to modify exported data before it is written to the XML-file:
             *
             * ```javascript
             * const gantt = new Gantt({
             *     ---
             *     features : {
             *         mspExport : {
             *             listeners : {
             *                 // listener to process exported data
             *                 dataCollected : ({ data }) => {
             *                     // patch <Project><Name> tag content
             *                     data.Name = 'My Cool Project';
             *                 }
             *             }
             *         }
             *     }
             * });
             * ```
             * @event dataCollected
             * @param {Object} config Export config
             * @param {Object} data Collected data to export
             */
            me.trigger('dataCollected', { config, data });

            const
                fileContent = me.convertToXml(data),
                eventParams = { config, data, fileContent };

            /**
             * Fires on the owning Gantt when project content is exported
             * to XML, before the XML is downloaded by the browser.
             * @event mspExport
             * @on-owner
             * @param {Object} config Export config
             * @param {String} fileContent Exported XML-file content
             */
            me.client.trigger('mspExport', eventParams);

            BrowserHelper.download(config.filename, `data:text/xml;charset=utf-8,${encodeURIComponent(eventParams.fileContent)}`);
        }
    }

    /**
     * Convert Object data to XML.
     * @param {Object} data The Object with data.
     * @returns {String} The XML data.
     * @private
     */
    convertToXml(data) {
        return XMLHelper.convertFromObject(data, {
            rootName            : 'Project',
            elementName         : '',
            xmlns               : 'http://schemas.microsoft.com/project',
            rootElementForArray : false
        });
    }

    /**
     * Get the XML configurations in MS Project format.
     * @returns {Object} MS Project configurations for the XML
     * @private
     */
    getMsProjectConfig() {
        const
            me = this,
            dateFormat = me.dateFormat,
            { project } = me.client,
            fileName = me.filename || me.client.$$name;

        return {
            CalendarUID                : me.getCalendarUID(project.effectiveCalendar),
            CreationDate               : DH.format(new Date(), dateFormat),
            SplitsInProgressTasks      : 0,
            MoveCompletedEndsBack      : 0,
            MoveRemainingStartsBack    : 0,
            MoveRemainingStartsForward : 0,
            MoveCompletedEndsForward   : 0,
            NewTaskStartDate           : 0,
            DaysPerMonth               : project.daysPerMonth,
            FinishDate                 : DH.format(project.endDate, dateFormat),
            MinutesPerDay              : project.hoursPerDay * 60,
            MinutesPerWeek             : project.daysPerWeek * project.hoursPerDay * 60,
            Name                       : fileName,
            ScheduleFromStart          : project.direction === 'Forward' ? 1 : 0,
            StartDate                  : DH.format(project.startDate, dateFormat),
            Title                      : fileName,
            WorkFormat                 : projectUnitMap[project.effortUnit],
            ProjectExternallyEdited    : 0
        };
    }

    /**
     * Formats an individual calendar to MS Project format.
     * @param {Gantt.model.CalendarModel} calendar A calendar
     * @returns {Object} Calendar formatted
     * @private
     */
    getCalendarData(calendar) {
        const uid = this.getCalendarUID(calendar);

        let
            calendarName    = calendar.name || calendar.internalId,
            baseCalendarUID = 0,
            isBaseCalendar  = 0;

        // MS Project does not support calendars hierarchy fully
        // it has two level hierarchy:
        // - first level - so called base calendars
        // - second level - any other calendars (including resource calendars) that extend the base ones

        if (!calendar.isResourceCalendar) {
            calendarName    += ' - imported';
            // all non-dummy calendars we import as base calendars (the one that can be extended in MSP)
            isBaseCalendar  = 1;
        }
        else {
            baseCalendarUID = this.getCalendarUID(calendar.parent, 0);
        }

        return {
            ID              : uid,
            UID             : uid,
            BaseCalendarUID : baseCalendarUID,
            // all non-dummy calendars we import as base calendars (the one that can be extended in MSP)
            IsBaseCalendar  : isBaseCalendar,
            Name            : calendarName,
            WeekDays        : {
                WeekDay : this.formatWeekDays(calendar)
            }

        };
    }

    /**
     * Format Calendars from Gantt to MS Project format.
     * @returns {Array} Calendars array formatted
     * @private
     */
    getCalendarsData() {
        const
            me = this,
            {
                calendarManagerStore,
                project
            } = me.client,
            // clone calendarManagerStore to not affect real data
            calendarManagerStoreCopy = new calendarManagerStore.constructor({
                rootNode : calendarManagerStore.rootNode.copy(false, true)
            }),
            { effectiveCalendar } = project,
            calendars             = calendarManagerStoreCopy.allRecords || [];

        // if project's calendar is not included on calendars array, include it
        if (effectiveCalendar && !calendarManagerStore.getByInternalId(effectiveCalendar.internalId)) {
            calendars.push(effectiveCalendar);
        }

        // Each resource in MS Project data model has its own calendar
        // so let's make dummy calendars for all resources

        for (const resource of me.client.resources) {
            const calendar = new resource.effectiveCalendar.constructor({ name : resource.name });

            // parent calendar for this dummy will be the real calendar the resource uses
            calendar.parent = resource.effectiveCalendar;

            calendar.isResourceCalendar = true;

            // remember the resource calendar
            me.resourceCalendar.set(resource, calendar);

            calendars.push(calendar);
        }

        return calendars.map(calendar => me.getCalendarData(calendar));
    }

    /**
     * Format intervals to MS project format for the WeekDays property.
     * @param {Array} calendar Array of intervals data.
     * @returns {Array} Array with data formatted
     * @private
     */
    formatWeekDays(calendar) {
        const
            { timeFormat } = this,
            ticks          = [],
            daysData       = {};

        let startDate = MIN_DATE,
            endDate;

        for (let i = 0; i < 7; i++) {
            // week day index
            const day = startDate.getDay();

            daysData[day] = {
                DayType    : day + 1,
                DayWorking : 0
            };

            endDate = DH.clearTime(DH.add(startDate, 1, 'day'));

            ticks.push({ startDate, endDate });

            // proceed to next day
            startDate = endDate;
        }

        // clone original calendar to get rid of its existing caches
        calendar = calendar.copy();

        const
            // dummy calendar with 7 day borders ..to force forEachAvailabilityInterval to stop on each day start
            dummyCalendar        = new calendar.constructor({ intervals : ticks }),
            calendarsCombination = this.client.project.combineCalendars([calendar, dummyCalendar]);

        calendarsCombination.forEachAvailabilityInterval(
            { startDate : MIN_DATE, endDate },
            (startDate, endDate, calendarCacheInterval) => {
                const
                    calendarsStatus   = calendarCacheInterval.getCalendarsWorkStatus(),
                    dayData           = daysData[startDate.getDay()];

                // if the calendar has working interval for that period
                if (calendarsStatus.get(calendar)) {
                    // consider the day as working
                    dayData.DayWorking = 1;

                    dayData.WorkingTimes = dayData.WorkingTimes || { WorkingTime : [] };

                    // put that time range
                    dayData.WorkingTimes.WorkingTime.push({
                        FromTime : DH.format(startDate, timeFormat),
                        ToTime   : DH.format(endDate, timeFormat)
                    });
                }
            }
        );

        return Object.values(daysData);
    }



    collectProjectTasks() {
        const result = [];

        this.client.store.rootNode.traverse(node => result.push(node), true);

        return result;
    }

    getPredecessorLinkData(predecessor) {
        return {
            LagFormat      : taskUnitMap[predecessor.lagUnit],
            LinkLag        : this.client.project.convertDuration(predecessor.lag, predecessor.lagUnit, 'minute') * 10,
            PredecessorUID : this.getTaskUID(predecessor.fromEvent),
            Type           : dependencyTypeMap[predecessor.type]
        };
    }

    getBaselineData(baseline, index) {
        return {
            Number   : index,
            Finish   : DH.format(baseline.endDate, this.dateFormat),
            Start    : DH.format(baseline.startDate, this.dateFormat),
            Duration : MspExport.convertDurationToMspDuration(baseline.duration, baseline.durationUnit)
        };
    }

    /**
     * Formats a tasks to MS Project format.
     * @param {Gantt.model.TaskModel} task Task to format
     * @returns {Object} Task formatted
     * @private
     */
    getTaskData(task) {
        const
            me             = this,
            { project }    = me.client,
            isForward      = project.direction == 'Forward',
            { dateFormat } = me,
            { startDate, endDate, wbsCode } = task,
            // filter out broken dependencies
            predecessors     = task.predecessors.filter(({ fromEvent }) => fromEvent),
            durationMs       = project.convertDuration(task.duration, task.durationUnit, 'millisecond'),
            effortMs         = project.convertDuration(task.effort, task.effortUnit, 'millisecond'),
            actualDurationMs = task.percentDone * 0.01 * durationMs,
            startDateStr     = DH.format(startDate, dateFormat),
            endDateStr       = DH.format(endDate, dateFormat),
            durationStr      = MspExport.convertDurationToMspDuration(durationMs, 'ms'),
            uid              = me.getTaskUID(task),
            result           = {
                UID                    : uid,
                Name                   : task.name,
                Active                 : me.inactive ? 0 : 1,
                Manual                 : task.manuallyScheduled ? 1 : 0,
                Type                   : task.isLeaf ? typeMap[task.schedulingMode] : 1,
                IsNull                 : startDate && endDate ? 0 : 1,
                WBS                    : wbsCode,
                OutlineNumber          : wbsCode,
                OutlineLevel           : wbsCode.split('.').length,
                Start                  : startDateStr,
                Finish                 : endDateStr,
                Duration               : durationStr,
                ManualStart            : startDateStr,
                ManualFinish           : endDateStr,
                ManualDuration         : durationStr,
                DurationFormat         : taskUnitMap[task.durationUnit],
                Work                   : MspExport.convertDurationToMspDuration(effortMs, 'ms'),
                EffortDriven           : task.effortDriven ? 1 : 0,
                Estimated              : 0,
                Milestone              : task.isMilestone ? 1 : 0,
                Summary                : task.isLeaf ? 0 : 1,
                PercentComplete        : Math.round(task.percentDone),
                ActualStart            : startDateStr,
                ActualDuration         : MspExport.convertDurationToMspDuration(actualDurationMs, 'ms'),
                RemainingDuration      : MspExport.convertDurationToMspDuration(durationMs - actualDurationMs, 'ms'),
                PredecessorLink        : predecessors.map(predecessor => me.getPredecessorLinkData(predecessor)),
                Baseline               : task.baselines.map((baseline, index) => me.getBaselineData(baseline, index)),
                IgnoreResourceCalendar : task.ignoreResourceCalendar ? 1 : 0,
                Rollup                 : task.rollup ? 1 : 0,
                ConstraintType         : task.constraintType ? constraintMap[task.constraintType] : (isForward ? 0 : 1),
                CalendarUID            : me.getCalendarUID(task.calendar)
            };

        if (task.constraintDate) {
            result.ConstraintDate = DH.format(task.constraintDate, dateFormat);
        }

        if (task.deadlineDate) {
            result.Deadline = DH.format(task.deadlineDate, dateFormat);
        }

        if (task.note) {
            result.Notes = task.note;
        }

        return result;
    }

    /**
     * Format Tasks from Gantt to MS Project format.
     * @returns {Array} Tasks array formatted
     * @private
     */
    getTasksData() {
        return this.tasks.map(task => this.getTaskData(task));
    }

    getTaskUID(task) {
        return task.internalId;
    }

    getCalendarUID(calendar, fallbackValue = -1) {
        return calendar && !calendar.isRoot ? calendar.internalId : fallbackValue;
    }

    /**
     * Format Resources from Gantt to MS Project format.
     * @returns {Array} Resources array formatted
     * @private
     */
    getResourcesData() {
        const {
            replaceResourceNameCommas,
            msProjectVersion,
            resourceCalendar
        } = this;

        return this.client.resources.map(resource => {
            const name = (resource.name || '');

            return {
                UID         : resource.internalId,
                Name        : replaceResourceNameCommas ? name.replace(commaRegExp, ';') : name,
                Type        : 1,
                MaxUnits    : '1.00',
                PeakUnits   : '1.00',
                // seems for version 2013 setting the calendar id it breaks so only Project level calendar is importable
                CalendarUID : msProjectVersion === 2013 ? null : this.getCalendarUID(resourceCalendar.get(resource))
            };
        });
    }

    /**
     * Format Assignments from Gantt to MS Project format.
     * @returns {Array} Assignments array formatted
     * @private
     */
    getAssignmentsData() {
        const result = [];

        // for version 2013 the assignments doesn't work
        if (this.msProjectVersion === 2013) {
            return result;
        }

        const { project } = this.client;

        for (const task of this.tasks) {
            const
                assigned    = task.assigned,
                taskUID     = this.getTaskUID(task),
                percentDone = Math.round(task.percentDone),
                start       = DH.format(task.startDate, this.dateFormat),
                finish      = DH.format(task.endDate, this.dateFormat);

            if (assigned.size) {
                for (const assignment of assigned) {
                    const
                        assignmentWorkMs          = project.convertDuration(assignment.effort, task.effortUnit, 'millisecond'),
                        actualAssignmentWorkMs    = project.convertDuration(assignment.actualEffort, task.effortUnit, 'millisecond'),
                        remainingAssignmentWorkMs = assignmentWorkMs - actualAssignmentWorkMs;

                    result.push({
                        UpdateNeeded        : 0,
                        UID                 : assignment.internalId,
                        TaskUID             : taskUID,
                        ResourceUID         : assignment.resource.internalId,
                        PercentWorkComplete : percentDone,
                        Work                : MspExport.convertDurationToMspDuration(assignmentWorkMs, 'ms'),
                        ActualWork          : MspExport.convertDurationToMspDuration(actualAssignmentWorkMs, 'ms'),
                        RemainingWork       : MspExport.convertDurationToMspDuration(remainingAssignmentWorkMs, 'ms'),
                        Start               : start,
                        Finish              : finish,
                        Units               : assignment.units / 100
                    });
                }
            }
            else {
                const
                    effortMs       = project.convertDuration(task.effort, task.effortUnit, 'millisecond'),
                    actualEffortMs = effortMs * percentDone * 0.01,
                    effortStr      = MspExport.convertDurationToMspDuration(effortMs, 'ms');

                result.push({
                    UID                 : Model._internalIdCounter++,
                    TaskUID             : taskUID,
                    ResourceUID         : -65535,
                    PercentWorkComplete : percentDone,
                    ActualWork          : MspExport.convertDurationToMspDuration(actualEffortMs, 'ms'),
                    RemainingWork       : MspExport.convertDurationToMspDuration(effortMs - actualEffortMs, 'ms'),
                    Start               : start,
                    Finish              : finish,
                    Units               : 1,
                    Work                : effortStr
                });
            }
        }

        return result;
    }

    /**
     * Convert to MS Project Span Date Time format.
     * @param {Number} value The value to be converted.
     * @param {DurationUnit} unit The unit of the value to be converted
     * @returns {String} The value formatted to "PTnHnMnS". E.g: PT10H30M, PT6H20M13S
     * @private
     */
    static convertDurationToMspDuration(value, unit) {
        if (value == null) {
            return '';
        }

        const
            delta = DH.getDelta(DH.as('ms', value, unit), { ignoreLocale : true, maxUnit : 'hour' }),
            { hour = 0, minute = 0, second = 0 } = delta;

        return `PT${hour}H${minute}M${second}S`;
    }
}

GridFeatureManager.registerFeature(MspExport, false, 'Gantt');
