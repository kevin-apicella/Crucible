import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import AbstractTimeRanges from '../../Scheduler/feature/AbstractTimeRanges.js';
import AttachToProjectMixin from '../../Scheduler/data/mixin/AttachToProjectMixin.js';

/**
 * @module Gantt/feature/ProjectLines
 */

/**
 * This feature draws two vertical lines in the schedule area, indicating project start/end dates.
 *
 * {@inlineexample Gantt/guides/gettingstarted/basic.js}
 *
 * This feature is **enabled** by default
 *
 * @extends Scheduler/feature/TimeRanges
 * @demo Gantt/advanced
 * @classtype projectLines
 * @feature
 */
export default class ProjectLines extends AbstractTimeRanges.mixin(AttachToProjectMixin) {
    //region Config

    static get $name() {
        return 'ProjectLines';
    }

    static get defaultConfig() {
        return {
            showHeaderElements : true,
            cls                : 'b-gantt-project-line'
        };
    }

    //endregion

    //region Project

    attachToProject(project) {
        super.attachToProject(project);

        project.ion({
            name    : 'project',
            refresh : this.onProjectRefresh,
            thisObj : this
        });
    }

    //endregion

    //region Init

    // We must override the TimeRanges superclass implementation which ingests the client's project's
    // timeRangeStore. We implement our own store
    startConfigure() {}

    updateLocalization() {
        this.renderRanges();
    }

    //endregion

    onProjectRefresh() {
        this.renderRanges();
    }

    shouldRenderRange(range) {
        const { client } = this;

        return client.timeAxis.dateInAxis(range.startDate);
    }

    get timeRanges() {
        const { startDate, endDate } = this.client.project;

        return startDate && endDate ? [
            {
                name : this.L('L{Project Start}'),
                startDate
            },
            {
                name      : this.L('L{Project End}'),
                startDate : endDate
            }
        ] : [];
    }
}

GridFeatureManager.registerFeature(ProjectLines, true, 'Gantt');
