import SchedulerProAssignmentModel from '../../SchedulerPro/model/AssignmentModel.js';
import { isSerializableEqual } from '../../Engine/chrono/ModelFieldAtom.js';

/**
 * @module Gantt/model/AssignmentModel
 */

/**
 * This class represents a single assignment of a {@link Gantt.model.ResourceModel resource} to a
 * {@link Gantt.model.TaskModel task} in your gantt chart.
 *
 * @extends SchedulerPro/model/AssignmentModel
 *
 * @uninherit Core/data/mixin/TreeNode
 *
 * @typings SchedulerPro.model.AssignmentModel -> SchedulerPro.model.SchedulerProAssignmentModel
 */
export default class AssignmentModel extends SchedulerProAssignmentModel {
    //region Fields
    static get fields() {
        /**
         * @hidefields eventId, resourceId
         */

        /**
         * The numeric, percent-like value, indicating what is the "contribution level"
         * of the resource availability to the task.
         * Number 100, means that the assigned resource spends 100% of its working time to the task.
         * Number 50 means that the resource spends only half of its available time for the assigned task.
         * @field {Number} units
         */
        /**
         * A numeric value indicating the effort contributed by the assigned {@link #field-resource} to the
         * {@link #field-event}.
         * @field {Number} effort
         * @category Common
         */
        return [
            /**
             * Id for event to assign. Note that after load it will be populated with the actual event.
             * @field {Gantt.model.TaskModel} event
             * @accepts {String|Number|Gantt.model.TaskModel}
             */
            {
                name      : 'event',
                persist   : true,
                serialize : record => record?.id,
                isEqual   : isSerializableEqual
            },

            /**
             * Id for resource to assign to. Note that after load it will be populated with the actual resource.
             * @field {Gantt.model.ResourceModel} resource
             * @accepts {String|Number|Gantt.model.ResourceModel}
             */
            {
                name      : 'resource',
                persist   : true,
                serialize : record => record?.id,
                isEqual   : isSerializableEqual
            }
        ];
    }
    //endregion
}
