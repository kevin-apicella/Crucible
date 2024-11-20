import SchedulerProDependencyModel from '../../SchedulerPro/model/DependencyModel.js';

/**
 * @module Gantt/model/DependencyModel
 */

/**
 * This class represents a single dependency between the tasks in your Gantt project.
 *
 * ## Subclassing the Dependency class
 *
 * The name of any field in data can be customized in the subclass, see the example below.
 *
 * ```javascript
 * class MyDependencyModel extends DependencyModel {
 *   static get fields() {
 *     return [
 *       { name: 'to', dataSource : 'targetId' },
 *       { name: 'from', dataSource : 'sourceId' }
 *     ];
 *   }
 * }
 * ```
 *
 * @extends SchedulerPro/model/DependencyModel
 *
 * @typings Scheduler.model.DependencyModel -> Scheduler.model.SchedulerDependencyModel
 * @typings SchedulerPro.model.DependencyModel -> SchedulerPro.model.SchedulerProDependencyModel
 */
export default class DependencyModel extends SchedulerProDependencyModel {

    construct(data) {
        super.construct(...arguments);

        // might be provided as `0` indicating task with numeric id 0
        if (data?.fromTask != null) {
            this.fromEvent = data.fromTask;
        }
        if (data?.toTask != null) {
            this.toEvent = data.toTask;
        }
    }

    get from() {
        return this.fromEvent?.id;
    }

    set from(value) {
        super.from = value;
    }

    /**
     * The origin task of this dependency.
     *
     * Accepts multiple formats but always returns an {@link Gantt.model.TaskModel}.
     *
     * **NOTE:** This is not a proper field but rather an alias, it will be serialized but cannot be remapped. If you
     * need to remap, consider using {@link #field-from} instead.
     *
     * @field {Gantt.model.TaskModel} fromTask
     * @accepts {String|Number|Gantt.model.TaskModel}
     * @category Dependency
     */

    /**
     * The destination task of this dependency.
     *
     * Accepts multiple formats but always returns an {@link Gantt.model.TaskModel}.
     *
     * **NOTE:** This is not a proper field but rather an alias, it will be serialized but cannot be remapped. If you
     * need to remap, consider using {@link #field-to} instead.
     *
     * @field {Gantt.model.TaskModel} toTask
     * @accepts {String|Number|Gantt.model.TaskModel}
     * @category Dependency
     */

    get fromTask() {
        return this.fromEvent;
    }

    set fromTask(task) {
        this.fromEvent = task;
    }

    get to() {
        return this.toEvent?.id;
    }

    set to(value) {
        super.to = value;
    }

    get toTask() {
        return this.toEvent;
    }

    set toTask(task) {
        this.toEvent = task;
    }


    get persistableData() {
        const
            data                 = super.persistableData,
            { fromTask, toTask } = data;

        if (fromTask) {
            data.fromTask = fromTask.id;
        }

        if (toTask) {
            data.toTask = toTask.id;
        }

        return data;
    }

    shouldRecordFieldChange(fieldName, oldValue, newValue) {
        if (fieldName === 'from' || fieldName === 'to') {
            // we don't need to record the changes in the computed `to/from` fields
            // note, that at the scheduler basic level, we do record changes in those fields,
            // because there the fields are "real"
            return false;
        }
        else {
            return super.shouldRecordFieldChange(fieldName, oldValue, newValue);
        }
    }
}
