import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import AssignmentField from '../widget/AssignmentField.js';
import AssignmentModel from '../model/AssignmentModel.js';
import ChipView from '../../Core/widget/ChipView.js';
import '../../Core/widget/NumberField.js';
import AvatarRendering from '../../Core/widget/util/AvatarRendering.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import DragHelper from '../../Core/helper/DragHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';

/**
 * @module Gantt/column/ResourceAssignmentColumn
 */

const resourceNameRegExp = a => a.resourceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Column allowing resource manipulation (assignment/unassignment/units changing) on a task. In the column cells,
 * assignments are either shown as badges or avatars. To show avatars, set {@link #config-showAvatars} to `true`. When
 * showing avatars there are two options for how to specify image paths:
 *
 * * You may provide a {@link Gantt.view.Gantt#config-resourceImageFolderPath} on your Gantt panel pointing to where
 *   resource images are located. Set the resource image filename in the `image` field of the resource data.
 * * And/or you may provide an `imageUrl` on your record, which then will take precedence when showing images.
 *
 * If a resource has no name, or its image cannot be loaded, the resource initials are rendered. If the resource has
 * an {@link Scheduler/model/mixin/ResourceModelMixin#field-eventColor} specified, it will be used as the background
 * color of the initials.
 *
 * Default editor is a {@link Gantt.widget.AssignmentField}.
 *
 * ## Customizing displayed elements
 *
 * If {@link #config-showAvatars} is false, column will render resource name and utilization wrapped in a
 * small element called _a chip_. Content of the chip can be customized. For example, if you don't want to see percent
 * value, or want to display different resource name, you can specify an {@link #config-itemTpl} config. Please keep in
 * mind that when you start editing the cell, chip will be rendered by the default editor. If you want chips to be
 * consistent, you need to customize the editor too.
 *
 * ```javascript
 * new Gantt({
 *     columns: [
 *         {
 *             type     : 'resourceassignment',
 *             itemTpl  : (assignment) => assignment.resourceName,
 *             editor   : {
 *                 chipView : {
 *                     itemTpl : assignment => assignment.resourceName
 *                 }
 *             }
 *         }
 *     ]
 * });
 * ```
 *
 * ## Subscribing to avatar click events
 *
 * The owning Gantt instance triggers a {@link Gantt.view.Gantt#event-resourceAssignmentClick}` event when a resource
 * avatar or chip is clicked.
 *
 * ```javascript
 * new Gantt({
 *     columns: [
 *         {
 *             type         : 'resourceassignment',
 *             showAvatars : true
 *         }
 *     ],
 *     listeners : {
 *          resourceAssignmentClick({ taskRecord, resourceRecord, event }) {
 *              console.log(resourceRecord.name);
 *          }
 *      }
 * });
 * ```
 *
 * {@inlineexample Gantt/column/ResourceAssignmentColumn.js}
 *
 * @extends Grid/column/Column
 * @classtype resourceassignment
 * @column
 */
export default class ResourceAssignmentColumn extends Column {
    internalCellCls = 'b-resourceassignment-cell';

    static $name = 'ResourceAssignmentColumn';
    static type  = 'resourceassignment';

    static isGanttColumn = true;

    static fields = [
        /**
         * True to show a resource avatar for every assignment. Note that you also have to provide a
         * {@link Gantt.view.Gantt#config-resourceImageFolderPath} for where to load images from. And/or you may
         * provide an `imageUrl` on your record, which then will take precedence when showing images.
         * @config {Boolean} showAvatars
         * @category Common
         */
        'showAvatars',

        'sideMargin',

        /**
         * A function which produces the content to put in the resource assignment cell.
         * May be overridden in subclasses, or injected into the column
         * to customize the Chip content.
         *
         * Defaults to returning `${assignment.resourceName} ${assignment.units}%`
         *
         * @config {Function} itemTpl
         * @param {Gantt.model.AssignmentModel} assignment The assignment
         * @param {Number} index The index - zero based.
         * @returns {DomConfig|String|null}
         * @category Rendering
         */
        {
            name         : 'itemTpl',
            defaultValue : (assignment, index, htmlEncode = true) => {
                return htmlEncode ? StringHelper.encodeHtml(assignment.toString()) : assignment.toString();
            }
        },

        /**
         * A function which receives data about the resource and returns a html string to be displayed in the
         * tooltip.
         *
         * ```javascript
         * const gantt = new Gantt({
         *     columns : [
         *          {
         *              type          : 'resourceassignment',
         *              showAvatars : true,
         *              avatarTooltipTemplate({ resourceRecord }) {
         *                  return `<b>${resourceRecord.name}</b>`;
         *              }
         *          }
         *     ]
         * });
         * ```
         *
         * This function will be called with an object containing the fields below:
         * @config {Function} avatarTooltipTemplate
         * @param {Object} data
         * @param {Gantt.model.TaskModel} data.taskRecord Hovered task
         * @param {Gantt.model.ResourceModel} data.resourceRecord Hovered resource
         * @param {Gantt.model.AssignmentModel} data.assignmentRecord Hovered assignment
         * @param {Core.widget.Tooltip} data.tooltip The tooltip instance
         * @param {Number} data.overflowCount Number of overflowing resources, only valid for last shown resource
         * @param {Gantt.model.AssignmentModel[]} data.overflowAssignments Array of overflowing assignments, only
         * valid for last shown resource
         * @returns {DomConfig|String|null}
         */
        'avatarTooltipTemplate',

        /**
         * When `true`, the names of all overflowing resources are shown in the tooltip. When `false`, the number of
         * overflowing resources is displayed instead.
         * Only valid for last shown resource, if there are overflowing resources.
         * @config {Boolean} showAllNames
         * @default true
         * @category Common
         */
        { name : 'showAllNames', type : 'boolean', defaultValue : true },

        /**
         * True to allow drag-drop of resource avatars between rows. Dropping a resource outside the
         * resource assignment cells will unassign the resource.
         * @config {Boolean} enableResourceDragging
         * @category Common
         */
        { name : 'enableResourceDragging' },

        /**
         * A config object passed to the avatar {@link Core.widget.Tooltip}
         *
         * ```javascript
         * const gantt = new Gantt({
         *     columns : [
         *          {
         *              type          : 'resourceassignment',
         *              showAvatars : true,
         *              avatarTooltip : {
         *                  // Allow moving mouse over the tooltip
         *                  allowOver : true
         *              }
         *          }
         *     ]
         * });
         * ```
         *
         * This function will be called with an object containing the fields below:
         *
         * @config {TooltipConfig} avatarTooltip
         */
        'avatarTooltip',

        { name : 'avatarMaxSize', defaultValue : 50 }
    ];

    static defaults = {
        field         : 'assignments',
        instantUpdate : false,
        text          : 'L{Assigned Resources}',
        width         : 250,
        showAvatars   : false,
        sideMargin    : 20,
        sortable(task1, task2) {
            const
                a1 = task1.assignments.join(''),
                a2 = task2.assignments.join('');

            if (a1 === a2) {
                return 0;
            }
            return a1 < a2 ? -1 : 1;
        },

        filterable({ value, record }) {
            // We're being passed an array of Assignments
            if (Array.isArray(value)) {
                // Shortcut if we're matching no assignments.
                if (!value.length) {
                    return Boolean(!record.assignments.length);
                }
                // Create a multi resource name Regexp, eg /Macy|Lee|George/.
                value = value.map(resourceNameRegExp).join('|');
            }
            const regexp = new RegExp(value, 'gi');

            return record.assignments.some(assignment => regexp.test(assignment.resourceName));
        },
        alwaysClearCell : false
    };

    construct() {
        super.construct(...arguments);

        const
            me       = this,
            { grid } = me;

        if (me.showAvatars) {
            Object.assign(me, {
                repaintOnResize : true,
                htmlEncode      : false,
                avatarRendering : new AvatarRendering({
                    element : grid.element,
                    tooltip : ObjectHelper.assign({
                        forSelector       : '.b-resourceassignment-cell .b-resource-avatar',
                        internalListeners : {
                            beforeShow({ source : tooltip }) {
                                const
                                    {
                                        taskRecord,
                                        resourceRecord,
                                        assignmentRecord,
                                        overflowCount,
                                        overflowAssignments
                                    }      = tooltip.activeTarget.elementData,
                                    result = me.avatarTooltipTemplate?.({
                                        taskRecord, resourceRecord, assignmentRecord, overflowCount, tooltip, overflowAssignments
                                    });

                                if (tooltip.items.length === 0) {
                                    const text   = me.showAllNames
                                        ? `${StringHelper.encodeHtml(assignmentRecord)}<br />${overflowAssignments.join('<br />')}`
                                        : StringHelper.xss`${assignmentRecord}${overflowCount ? ` (+${overflowCount} ${me.L('L{more resources}')})` : ''}`;
                                    tooltip.html = result ?? text;
                                }
                            }
                        }
                    }, me.avatarTooltip)
                })
            });
        }

        if (me.enableResourceDragging) {
            me.grid.ion({
                paint   : me.setupDragging,
                thisObj : me,
                once    : true
            });
        }

        grid.ion({
            beforeCellEditStart : me.onBeforeCellEditStart,
            finishCellEdit      : me.onDoneCellEdit,
            cancelCellEdit      : me.onDoneCellEdit,
            thisObj             : me
        });

        if (me.showAvatars) {
            grid.ion({
                beforeRenderRows : me.calculateAvatarSize,
                once             : true,
                thisObj          : me
            });

            grid.rowManager.ion({
                beforeRowHeight : me.calculateAvatarSize,
                thisObj         : me
            });
        }

        grid.resourceStore.ion({
            name    : 'resourceStore',
            update  : me.onResourceUpdate,
            thisObj : me
        });
    }

    calculateAvatarSize({ height }) {
        const
            { grid }        = this,
            rowHeight       = height || grid.rowHeight,
            { cellElement } = grid.beginGridMeasuring();

        cellElement.classList.add(this.internalCellCls);

        const
            cellStyles = globalThis.getComputedStyle(cellElement),
            padding    = parseInt(cellStyles.paddingTop, 10);

        this.avatarRendering.size = Math.min(this.avatarMaxSize, rowHeight - (2 * padding));

        cellElement.classList.remove(this.internalCellCls);
        grid.endGridMeasuring();
    }

    doDestroy() {
        super.doDestroy();

        this.avatarRendering?.destroy();
        this.dragHelper?.destroy();
    }

    get defaultEditor() {
        return {
            type  : AssignmentField.type,
            store : {
                modelClass : this.grid.project.assignmentStore.modelClass
            }
        };
    }

    onBeforeCellEditStart({ editorContext : { record, column } }) {
        const me = this;

        if (column === me) {
            const { editor } = me;

            editor.resourceImageFolderPath = me.grid.resourceImageFolderPath;
            editor.projectEvent            = record;

            me.detachListeners('editorStore');

            editor.store.ion({
                name           : 'editorStore',
                changesApplied : me.onEditorChangesApplied,
                thisObj        : me
            });
        }
    }

    onDoneCellEdit() {
        this.detachListeners('editorStore');
    }

    onEditorChangesApplied() {
        const
            me          = this,
            cellElement = me.grid.getCell({ id : me.editor.projectEvent.id, columnId : me.id });

        if (cellElement) {
            me.renderer({ value : me.editor.projectEvent.assignments, cellElement });
        }
    }

    onResourceUpdate({ source }) {
        // no need for this listener when the gantt is loading data
        if (!source.project?.propagatingLoadChanges) {
            this.grid.refreshColumn(this);
        }
    }

    get chipView() {
        const me = this;

        if (!me._chipView) {
            me._chipView = new ChipView({
                parent         : me,
                cls            : 'b-assignment-chipview',
                navigator      : null,
                itemsFocusable : false,
                closable       : false,
                itemTpl        : me.itemTpl,
                store          : {},
                scrollable     : {
                    overflowX : 'hidden-scroll'
                }
            });
            // The List class only refreshes itself when visible, so
            // since this is an offscreen, rendering element
            // we have to fake visibility.
            Object.defineProperty(me.chipView, 'isVisible', {
                get() {
                    return true;
                }
            });
            // Complete the initialization, which is finalized on first paint.
            // In particular the lazy scrollable config is ingested on paint.
            me.chipView.triggerPaint();
        }
        return me._chipView;
    }

    defaultRenderer({ cellElement, value, isExport }) {
        if (this.showAvatars) {
            return this.rendererWithAvatars.apply(this, arguments);
        }

        value = value.filter(a => a.resource)
            .sort((lhs, rhs) => lhs.resourceName.localeCompare(rhs.resourceName));

        if (isExport) {
            return value.map((val, i) => this.itemTpl(val, i, false)).join(',');
        }
        else {
            const
                { chipView } = this,
                chipViewWrap = cellElement.querySelector('.b-assignment-chipview-wrap') || (
                    DomHelper.createElement({
                        parent    : cellElement,
                        className : 'b-assignment-chipview-wrap'
                    })
                );

            chipView.store.storage.replaceValues({
                values : value,
                silent : true
            });

            chipView.refresh();
            const chipCloneElement = chipView.element.cloneNode(true);
            chipCloneElement.removeAttribute('id');

            chipViewWrap.innerHTML = '';
            chipViewWrap.appendChild(chipCloneElement);
        }
    }

    rendererWithAvatars({ record : taskRecord, value, isExport }) {
        value = value.filter(a => a.resource)
            .sort((lhs, rhs) => lhs.resourceName.localeCompare(rhs.resourceName));

        const
            me                  = this,
            { size }            = me.avatarRendering,
            nbrVisible          = Math.floor((me.width - me.sideMargin) / (size + 2)),
            overflowCount       = value.length > nbrVisible ? value.length - nbrVisible : 0,
            overflowAssignments = value.length > nbrVisible ? value.filter(assignment => value.indexOf(assignment) >= nbrVisible) : [];

        if (isExport) {
            return value.map((as, i) => this.itemTpl(as, i, false)).join(',');
        }

        return {
            className : 'b-resource-avatar-container',
            children  : value.map((assignmentRecord, i) => {
                const { resource : resourceRecord } = assignmentRecord;

                if (i < nbrVisible) {
                    const
                        isLastOverflowing = overflowCount > 0 && i === nbrVisible - 1,
                        imgConfig         = me.renderAvatar({
                            taskRecord,
                            resourceRecord,
                            assignmentRecord,
                            overflowCount       : isLastOverflowing ? overflowCount : 0,
                            overflowAssignments : isLastOverflowing ? overflowAssignments : []
                        });

                    if (isLastOverflowing) {
                        return {
                            className : 'b-overflow-img b-resource-avatar',
                            style     : {
                                height : size + 'px',
                                width  : size + 'px'
                            },
                            'aria-label' : value.slice(nbrVisible).map(assignmentRecord => assignmentRecord.resourceName).join(','),
                            children     : [
                                imgConfig,
                                {
                                    tag       : 'span',
                                    className : 'b-overflow-count',
                                    html      : `+${overflowCount}`
                                }
                            ]
                        };
                    }

                    return imgConfig;
                }
            })
        };
    }

    renderAvatar({ taskRecord, resourceRecord, assignmentRecord, overflowCount, overflowAssignments }) {
        const
            {
                resourceImageFolderPath
            }        = this.grid,
            imageUrl = resourceRecord.imageUrl || resourceRecord.image && resourceImageFolderPath && (resourceImageFolderPath + resourceRecord.image),
            avatar   = this.avatarRendering.getResourceAvatar({
                resourceRecord,
                initials        : resourceRecord.initials,
                color           : resourceRecord.eventColor,
                iconCls         : resourceRecord.iconCls,
                defaultImageUrl : this.defaultAvatar,
                imageUrl
            });

        // Some paths in avatarRendering does not yield elementData
        if (!avatar.elementData) {
            avatar.elementData = {};
        }

        Object.assign(avatar.elementData, {
            taskRecord,
            resourceRecord,
            assignmentRecord,
            overflowCount,
            overflowAssignments
        });

        return avatar;
    }

    get defaultAvatar() {
        const { grid } = this;

        return grid.defaultResourceImageName ? grid.resourceImageFolderPath + grid.defaultResourceImageName : '';
    }

    // Used with CellCopyPaste to be able to copy assignments from one task to another
    toClipboardString({ record }) {
        return StringHelper.safeJsonStringify(record[this.field]);
    }

    // Used with CellCopyPaste to be able to copy assignments from one task to another
    fromClipboardString({ string, record }) {
        const
            parsedAssignments = StringHelper.safeJsonParse(string),
            newAssignments    = [];

        if (parsedAssignments?.length) {
            for (const assignmentData of parsedAssignments) {
                delete assignmentData.id;
                delete assignmentData.event;
                delete assignmentData.resource;
                assignmentData.eventId = record.id;
                newAssignments.push(new AssignmentModel(assignmentData));
            }
        }

        return newAssignments;
    }

    // Only allow if complete range is only inside this column
    canFillValue({ range }) {
        return range.every(cs => cs.column === this);
    }

    calculateFillValue({ record, value }) {
        const string = JSON.stringify(value);
        return this.fromClipboardString({ string, record });
    }

    setupDragging() {
        const
            me       = this,
            { grid } = me;

        // Prevent row reorders from resource assignment cell
        if (grid.features.rowReorder) {
            grid.features.rowReorder.dragHelper.targetSelector += ' .b-grid-cell:not(.b-resourceassignment-cell)';
        }

        me.subGrid.element.classList.add('b-draggable-resource-avatars');

        me.dragHelper = new DragHelper({
            callOnFunctions : true,
            // Don't drag the actual element, clone the avatar instead
            cloneTarget     : true,
            // Allow drag of row elements inside the resource grid
            targetSelector  : '.b-resource-avatar-container > .b-resource-avatar',
            onDragStart({ context }) {
                const { grabbed } = context;

                context.resourceRecord = grabbed.elementData.resourceRecord;
                grid.enableScrollingCloseToEdges();
            },

            onDrag({ context, event }) {
                const targetTask = context.targetTask = grid.resolveTaskRecord(event.target);

                context.valid = Boolean(targetTask && !targetTask.resources.includes(context.resourceRecord));
            },

            // Drop callback after a mouse up. If drop is valid, the element is animated to its final position before the data transfer
            async onDrop({ context, event }) {
                const
                    { targetTask, resourceRecord, valid, grabbed, element } = context,
                    { assignmentRecord, taskRecord }                        = grabbed.elementData,
                    validDropTarget                                         = event.target.closest('.b-resourceassignment-cell');

                // We handle case of "invalid" drop ourselves, and when you don't drop on a resource
                // assignment cell it means unassign (i.e. DragHelper never aborts a drop)
                if (valid) {
                    grabbed.style.display = 'none';
                }
                if (!validDropTarget) {
                    element.style.display = 'none';
                    // Invalid drop target means unassign
                    taskRecord.unassign(resourceRecord);
                }
                else if (valid) {
                    // Valid drop, provide a point to animate the proxy to before finishing the operation
                    const
                        resourceAssignmentCell = grid.getCell({
                            column : me,
                            record : targetTask
                        }),
                        avatarContainer        = resourceAssignmentCell?.querySelector('.b-resource-avatar-container');

                    // Before we finalize the drop and update the task record, transition the element to the target point
                    if (avatarContainer) {
                        await this.animateProxyTo(avatarContainer, {
                            align : 'l0-r0'
                        });
                    }

                    if (!targetTask.resources.includes(resourceRecord)) {
                        assignmentRecord.event = targetTask;
                    }
                }

                grid.disableScrollingCloseToEdges();
            }
        });
    }

    onCellClick({ record, event }) {
        let avatarElement;

        if (this.showAvatars) {
            avatarElement = event.target.closest('.b-resource-avatar');
            if (avatarElement) {
                this.grid.trigger('resourceAssignmentClick', { resourceRecord : avatarElement.elementData.resourceRecord, taskRecord : record, event });
            }
        }
        else {
            avatarElement = event.target.closest('.b-chip');
            if (avatarElement) {
                const assignment = this.grid.assignmentStore.getById(avatarElement.dataset.id);
                this.grid.trigger('resourceAssignmentClick', { resourceRecord : assignment.resource, taskRecord : record, event });
            }
        }
    }
}

ColumnStore.registerColumnType(ResourceAssignmentColumn);
