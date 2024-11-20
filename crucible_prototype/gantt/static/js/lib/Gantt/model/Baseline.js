import TimeSpan from '../../Scheduler/model/TimeSpan.js';
import Duration from '../../Core/data/Duration.js';
import DateHelper from '../../Core/helper/DateHelper.js';

/**
 * @module Gantt/model/Baseline
 */

/**
 * This class represents a baseline of a Task.
 *
 * Records based on this model are initially created when tasks are loaded into the TaskStore. If dates (startDate and
 * endDate) are left out, the task's dates will be used. If dates are `null`, dates will be empty and the baseline bar
 * won't be displayed in the UI.
 *
 * @extends Scheduler/model/TimeSpan
 */
export default class Baseline extends TimeSpan {
    //region Fields


    static fields = [
        /**
         * The owning Task of the Baseline
         * @field {Gantt.model.TaskModel} task
         */
        {
            name    : 'task',
            persist : false
        }

        /**
         * Start date of the baseline in ISO 8601 format.
         *
         * Note that the field always returns a `Date`.
         *
         * @field {Date} startDate
         * @accepts {String|Date}
         */

        /**
         * End date of the baseline in ISO 8601 format.
         *
         * Note that the field always returns a `Date`.
         *
         * @field {Date} endDate
         * @accepts {String|Date}
         */

        /**
         * An encapsulation of the CSS classes to be added to the rendered baseline element.
         *
         * Always returns a {@link Core.helper.util.DomClassList}, but may still be treated as a string. For
         * granular control of adding and removing individual classes, it is recommended to use the
         * {@link Core.helper.util.DomClassList} API.
         *
         * @field {Core.helper.util.DomClassList} cls
         * @accepts {Core.helper.util.DomClassList|String}
         */

    ];

    //endregion

    isBaseline = true;

    //region Milestone

    get milestone() {
        // a summary baseline may have zero duration when "recalculateParents" is on
        // and a child baseline has working time on the summary baseline non-working time
        // so we operate start and end date pair here
        if (!this.isLeaf) {
            const { startDate, endDate } = this;

            if (startDate && endDate) {
                return endDate.getTime() === startDate.getTime();
            }
        }

        return this.duration === 0;
    }

    set milestone(value) {
        value ? this.convertToMilestone() : this.convertToRegular();
    }

    async setMilestone(value) {
        return value ? this.convertToMilestone() : this.convertToRegular();
    }

    /**
     * Converts this baseline to a milestone (start date will match the end date).
     *
     * @propagating
     */
    async convertToMilestone() {
        return this.setDuration(0, this.durationUnit, false);
    }

    /**
     * Converts a milestone baseline to a regular baseline with a duration of 1 (keeping current `durationUnit`).
     *
     * @propagating
     */
    async convertToRegular() {
        if (this.milestone) {
            return this.setDuration(1, this.durationUnit, false);
        }
    }

    //endregion

    internalCalculateStartDate(endDate, duration, durationUnit = this.durationUnit) {
        if (this.task.graph) {
            return this.task.run('calculateProjectedXDateWithDuration', endDate, false, duration);
        }

        return super.internalCalculateStartDate(endDate, duration, durationUnit);
    }

    internalCalculateEndDate(startDate, duration, durationUnit = this.durationUnit) {
        if (this.task.graph) {
            return this.task.run('calculateProjectedXDateWithDuration', startDate, true, duration);
        }

        return super.internalCalculateEndDate(startDate, duration, durationUnit);
    }

    internalCalculateDuration(startDate, endDate, durationUnit = this.durationUnit) {
        if (this.task.graph) {
            return this.task.run('calculateProjectedDuration', startDate, endDate);
        }

        return super.internalCalculateDuration(startDate, endDate, durationUnit);
    }

    // Uses engine to calculate dates and/or duration.
    normalize() {
        const { task, startDate, endDate, duration } = this;

        if (!task.graph) {
            // Baselines are initialized on first access (first render), for initially visible tasks we need to
            // normalize after first commit, since we render early before entering graph.
            // Tasks rendered later will take the cheaper code path below
            task.project?.once('dataReady', () => this.internalNormalize(startDate, endDate, duration));
        }

        super.normalize();
    }

    //region Baseline APIs

    /**
     * Baseline start variance in the task's duration unit.
     * @member {Core.data.Duration}
     * @category Scheduling
     */
    get startVariance() {
        const
            { task } = this,
            variance = DateHelper.getDurationInUnit(this.startDate, task.startDate, task.durationUnit);

        return new Duration({ magnitude : variance, unit : task.durationUnit });
    }

    /**
     * Baseline end variance in the task's duration unit.
     * @member {Core.data.Duration}
     * @category Scheduling
     */
    get endVariance() {
        const
            { task } = this,
            variance = DateHelper.getDurationInUnit(this.endDate, task.endDate, task.durationUnit);

        return new Duration({ magnitude : variance, unit : task.durationUnit });
    }

    /**
     * Baseline duration variance in the task's duration unit.
     * @member {Core.data.Duration}
     * @category Scheduling
     */
    get durationVariance() {
        return this.fullDuration && this.task.fullDuration.diff(this.fullDuration);
    }

    //endregion
}
