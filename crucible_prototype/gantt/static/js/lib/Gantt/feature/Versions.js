import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import TaskModel from '../model/TaskModel.js';
import SchedulerProVersions from '../../SchedulerPro/feature/Versions.js';

/**
 * @module Gantt/feature/Versions
 */

/**
 * Captures versions (snapshots) of the active project, including a detailed log of the changes new in each version.
 *
 * When active, the feature monitors the project for changes and appends them to the changelog. When a version is captured,
 * the version will consist of a complete snapshot of the project data at the time of the capture, in addition to the list
 * of changes in the changelog that have occurred since the last version was captured.
 *
 * For information about the data structure representing a version and how to persist it, see {@link SchedulerPro.model.VersionModel}.
 *
 * For information about the data structures representing the changelog and how to persist them, see
 * {@link SchedulerPro.model.changelog.ChangeLogTransactionModel}.
 *
 * This feature is **disabled** by default.
 * For info on enabling it, see {@link Grid.view.mixin.GridFeatures}.
 *
 * ```javascript
 * const gantt = new Gantt({
 *     features : {
 *         versions : true
 *     }
 * });
 * ```
 *
 * To display versions and their changes, use a {@link SchedulerPro.widget.VersionGrid} configured with a {@link Gantt.model.ProjectModel}.
 *
 * {@inlineexample Gantt/guides/whats-new/5.3.0/versions.js}
 *
 * See also:
 * - {@link SchedulerPro.model.VersionModel} A stored version of a ProjectModel, captured at a point in time, with change log
 * - {@link SchedulerPro.model.changelog.ChangeLogTransactionModel} The set of add/remove/update actions that occurred in response to a user action
 * - {@link SchedulerPro.widget.VersionGrid} Widget for displaying a project's versions and changes
 *
 * @extends SchedulerPro/feature/Versions
 * @classtype versions
 * @feature
 *
 * @typings SchedulerPro.feature.Versions -> SchedulerPro.feature.SchedulerProVersions
 */
export default class GanttVersions extends SchedulerProVersions {

    static $name = 'Versions';

    static configurable = {

        /**
         * The set of Model types whose subtypes should be recorded as the base type in the change log. For example,
         * by default if a subclassed TaskModelEx exists and an instance of one is updated, it will be recorded in the
         * changelog as a TaskModel.
         * @config {Array}
         * @default [TaskModel, AssignmentModel, DependencyModel, ResourceModel]
         */
        knownBaseTypes : [TaskModel, ...SchedulerProVersions.configurable.knownBaseTypes]
    };

    construct(gantt, config) {
        super.construct(gantt, config);
        gantt.ion({
            taskMenuItem : ({ item, selection }) => {
                const
                    me         = this,
                    isMultiple = selection.length > 1;
                if (item.ref === 'deleteTask') {
                    me.transactionDescription = isMultiple ? me.L('L{Versions.deletedTasks}')
                        : me.L('L{Versions.deletedTask}');
                }
                else if (item.ref === 'indent') {
                    me.transactionDescription = me.L('L{Versions.indented}');
                }
                else if (item.ref === 'outdent') {
                    me.transactionDescription = me.L('L{Versions.outdented}');
                }
                else if (item.ref === 'cut') {
                    me.transactionDescription = me.L('L{Versions.cut}');
                }
                else if (item.ref === 'paste') {
                    me.transactionDescription = me.L('L{Versions.pasted}');
                }
            }
        });
    }
}

GridFeatureManager.registerFeature(GanttVersions, false, 'Gantt');
