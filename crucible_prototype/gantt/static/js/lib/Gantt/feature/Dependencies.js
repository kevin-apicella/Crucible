import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';
import { DependencyType } from '../../Engine/scheduling/Types.js';
import SchedulerProDependencies from '../../SchedulerPro/feature/Dependencies.js';

/**
 * @module Gantt/feature/Dependencies
 */

const
    // Map dependency type to side of a box, for displaying an icon in the tooltip
    fromBoxSide        = [
        'start',
        'start',
        'end',
        'end'
    ],
    toBoxSide          = [
        'start',
        'end',
        'start',
        'end'
    ],
    // Round to half pixels, more precise is not reliable x-browser
    round              = num => Math.round(num * 2) / 2;

// noinspection JSClosureCompilerSyntax
/**
 * Feature that draws dependencies between tasks. Uses a dependency {@link Gantt.model.ProjectModel#property-dependencyStore store}
 * to determine which dependencies to draw.
 *
 * {@inlineexample Gantt/guides/gettingstarted/basic.js}
 *
 * To customize the dependency tooltip, you can provide the {@link Scheduler.feature.Dependencies#config-tooltip} config
 * and specify a {@link Core.widget.Tooltip#config-getHtml} function. For example:
 *
 * ```javascript
 * const gantt = new Gantt({
 *     features : {
 *         dependencies : {
 *             tooltip : {
 *                 getHtml({ activeTarget }) {
 *                     const dependencyModel = gantt.resolveDependencyRecord(activeTarget);
 *
 *                     if (!dependencyModel) return null;
 *
 *                     const { fromEvent, toEvent } = dependencyModel;
 *
 *                     return `${fromEvent.name} (${fromEvent.id}) -> ${toEvent.name} (${toEvent.id})`;
 *                 }
 *             }
 *         }
 *     }
 * }
 * ```
 *
 * ## Styling dependency lines
 *
 * You can easily customize the arrows drawn between events. To change all arrows, apply
 * the following basic SVG CSS:
 *
 * ```css
 * .b-sch-dependency {
 *    stroke-width: 2;
 *    stroke : red;
 * }
 *
 * .b-sch-dependency-arrow {
 *     fill: red;
 * }
 * ```
 *
 * To style an individual dependency line, you can provide a [cls](#Scheduler/model/DependencyModel#field-cls) in your
 * data:
 *
 * ```json
 * {
 *     "id"   : 9,
 *     "from" : 7,
 *     "to"   : 8,
 *     "cls"  : "special-dependency"
 * }
 * ```
 *
 * ```scss
 * // Make line dashed
 * .b-sch-dependency {
 *    stroke-dasharray: 5, 5;
 * }
 * ```
 *
 * By default predecessors and successors in columns and the task editor are displayed using task id and name. The id
 * part is configurable, any task field may be used instead (for example wbsCode or sequence number) by
 * {@link Gantt/view/GanttBase#config-dependencyIdField Gantt#dependencyIdField} property.
 *
 * ```javascript
 * const gantt = new Gantt({
 *    dependencyIdField: 'wbsCode',
 *
 *    project,
 *    columns : [
 *        { type : 'name', width : 250 }
 *    ],
 * });
 * ```
 *
 * Also see {@link Gantt/column/DependencyColumn#config-dependencyIdField DependencyColumn#dependencyIdField} to
 * configure columns only if required.
 *
 * This feature is **enabled** by default
 *
 * @extends SchedulerPro/feature/Dependencies
 * @demo Gantt/basic
 * @classtype dependencies
 * @feature
 *
 * @typings SchedulerPro.feature.Dependencies -> SchedulerPro.feature.SchedulerProDependencies
 */
export default class Dependencies extends SchedulerProDependencies {

    //region Config

    static $name = 'Dependencies';

    static configurable = {
        terminalSides                     : ['left', 'right'],
        highlightDependenciesOnEventHover : true,

        tooltipTemplate(dependency) {
            if (!dependency) {
                return null;
            }

            const
                me                     = this,
                { dependencyIdField }  = me.client,
                { fromEvent, toEvent } = dependency;

            return {
                children : [{
                    className : 'b-sch-dependency-tooltip',
                    children  : [
                        { tag : 'label', text : me.L('L{from}') },
                        { text : `${fromEvent.name} ${fromEvent[dependencyIdField]}` },
                        { className : `b-sch-box b-${dependency.fromSide || fromBoxSide[dependency.type]}` },
                        { tag : 'label', text : me.L('L{to}') },
                        { text : `${toEvent.name} ${toEvent[dependencyIdField]}` },
                        { className : `b-sch-box b-${dependency.toSide || toBoxSide[dependency.type]}` },
                        dependency.lag ? { tag : 'label', text : me.L('L{DependencyEdit.Lag}') } : null,
                        dependency.lag ? { text : dependency.fullLag } : null
                    ]
                }]
            };
        },

        pathFinderConfig : {
            otherHorizontalMargin : 0,
            otherVerticalMargin   : 0
        }
    };

    //endregion

    //region Init

    construct(gantt, config = {}) {
        // Scheduler might be using gantt's feature, when on same page
        if (gantt.isGantt) {
            this.gantt = gantt;
        }

        super.construct(gantt, config);
    }

    //endregion

    //region Scheduler overrides

    // Add critical path marker which has different color
    createMarker() {
        super.createMarker();

        const
            me               = this,
            { markerDef }    = me,
            criticalMarkerId = markerDef ? `${me.client.id}-arrowEndCritical` : 'arrowEndCritical';

        me.criticalMarker?.remove();

        const criticalMarker = me.criticalMarker = me.marker.cloneNode(true);

        criticalMarker.setAttribute('id', criticalMarkerId);
        criticalMarker.retainElement = true;

        me.client.svgCanvas.appendChild(criticalMarker);
    }

    /**
     * Returns the dependency record for a DOM element
     * @function resolveDependencyRecord
     * @param {HTMLElement} element The dependency line element
     * @returns {Gantt.model.DependencyModel} The dependency record
     */

    get rowStore() {
        return this.client.store;
    }

    // We don't care about the resourceStore in gantt
    attachToResourceStore(...args) {
        // But we have to care for Scheduler Pro using Gantt:s feature (shared bundle)
        if (!this.gantt) {
            super.attachToResourceStore(...args);
        }
    }

    getDependencyKey(dependency, ...args) {
        if (!this.gantt) {
            super.getDependencyKey(dependency, ...args);
        }

        return `dep:${dependency.id};gen:${this.generation}`;
    }

    // Gantt draws between tasks, replace Schedulers assignment element lookup
    getAssignmentElement(task) {
        if (!this.gantt) {
            return super.getAssignmentElement(task);
        }

        return this.client.getElementFromTaskRecord(task);
    }

    // Gantt draws between tasks, replace Schedulers assignment bounds lookup
    getAssignmentBounds(task) {
        if (!this.gantt) {
            return super.getAssignmentBounds(task);
        }

        const
            { client } = this,
            element    = client.getElementFromTaskRecord(task);

        if (element && !client.isExporting) {
            return Rectangle.from(element, this.relativeTo);
        }

        return client.isEngineReady && client.getTaskBox(task, true, true);
    }

    //region Export

    // Export calls this fn to determine if a dependency should be included or not
    isDependencyVisible(dependency) {
        if (!this.gantt) {
            return super.isDependencyVisible(dependency);
        }

        return dependency.fromEvent?.isScheduled && dependency.toEvent?.isScheduled;
    }

    //endregion

    // Override Schedulers dependency drawing
    drawDependency(dependency, batch = false, forceBoxes = null) {
        if (!this.gantt) {
            return super.drawDependency(dependency, batch, forceBoxes);
        }

        const
            me                     = this,
            {
                domConfigs,
                client
            } = me,
            { store }              = client,
            topIndex               = client.firstVisibleRow.dataIndex,
            bottomIndex            = client.lastVisibleRow.dataIndex,
            { startMS, endMS }     = client.visibleDateRange,
            { fromEvent, toEvent } = dependency;

        if (store.isAvailable(fromEvent) && store.isAvailable(toEvent)) {
            const
                fromIndex  = store.indexOf(fromEvent),
                toIndex    = store.indexOf(toEvent),
                fromDateMS = Math.min(fromEvent.startDateMS, toEvent.startDateMS),
                toDateMS   = Math.max(fromEvent.endDateMS, toEvent.endDateMS);

            // Draw only if dependency intersects view, unless it is part of an export
            if (client.isExporting || fromIndex != null && toIndex != null && !(
                // Both ends above view
                (fromIndex < topIndex && toIndex < topIndex) ||
                // Both ends below view
                (fromIndex > bottomIndex && toIndex > bottomIndex) ||
                // Both ends before view
                (fromDateMS < startMS && toDateMS < startMS) ||
                // Both ends after view
                (fromDateMS > endMS && toDateMS > endMS)
            )) {
                const lineDomConfigs = me.getDomConfigs(dependency, fromEvent, toEvent, forceBoxes);

                if (lineDomConfigs) {
                    domConfigs.set(dependency.id, lineDomConfigs);
                }
                // No room to draw a line
                else {
                    domConfigs.delete(dependency.id);
                }
            }

            // Give mixins a shot at running code after a dependency is drawn. Used by grid cache to cache the
            // dependency (when needed)
            me.afterDrawDependency(dependency, fromIndex, toIndex, fromDateMS, toDateMS);
        }

        if (!batch) {
            me.domSync();
        }
    }

    //endregion

    //region Draw & render

    getDependenciesToConsider(startMS, endMS, startIndex, endIndex) {
        const
            dependencies    = super.getDependenciesToConsider?.(startMS, endMS, startIndex, endIndex),
            criticalFeature = this.client.features.criticalPaths;

        if (dependencies && criticalFeature?.enabled && criticalFeature.criticalDependencies?.size) {
            const sorted = [];

            // Critical deps sort above normal deps
            for (const dependency of dependencies) {
                sorted[criticalFeature.criticalDependencies.has(dependency) ? 'push' : 'unshift'](dependency);
            }

            return sorted;
        }

        return dependencies;
    }

    adjustLineDef(dependency, lineDef) {
        const me = this;

        // Do not adjust for scheduler using Gantts feature
        if (!me.gantt) {
            return lineDef;
        }

        const
            { rtl }              = me.gantt,
            { startBox, endBox } = lineDef,
            arrowMargin          = me.pathFinder.startArrowMargin,
            startRowBox          = me.client.getRecordCoords(dependency.fromEvent, true),
            endRowBox            = me.client.getRecordCoords(dependency.toEvent, true),
            startBoxEnd          = round(startBox.getEnd(rtl)),
            endBoxStart          = round(endBox.getStart(rtl)),
            endBoxEnd            = round(endBox.getEnd(rtl)),
            // Detecting whether the source box ends before (or at the same point) as the end box start
            // is different between LRT and RTL
            sourceEndsBeforeStart = rtl
                ? (endBoxStart <= startBoxEnd && endBoxEnd <= (startBoxEnd + arrowMargin))
                : (endBoxStart >= startBoxEnd && endBoxEnd >= (startBoxEnd + arrowMargin));

        if (
            dependency.type === DependencyType.EndToStart &&
            // Target box is below source box
            startBox.bottom < endBox.y &&
            // If source box ends before target box start - draw line to target box top edge.
            // Round coordinates to make behavior more consistent on zoomed page
            sourceEndsBeforeStart
        ) {
            // Arrow to left part of top
            lineDef.endSide = 'top';

            // The default entry point for top is the center, but for Gantt Tasks, we join to startArrowMargin inwards
            // to top-start, so we give the end box a width of arrowMargin.
            // Milestones always have the top entry point left in the center.
            if (!dependency.toEvent.milestone) {
                if (rtl) {
                    endBox.x = endBox.right - arrowMargin * 2;
                }
                else {
                    endBox.width = arrowMargin * 2;
                }
            }
        }

        return {
            ...lineDef,
            // Reversing start/end endpoints generate more Gantt-friendly arrows
            startBox      : endBox,
            endBox        : startBox,
            endSide       : lineDef.startSide,
            startSide     : lineDef.endSide,
            boxesReversed : true,
            // Add vertical box for each task. They are supposed to push line to row boundary
            otherBoxes    : [
                {
                    start  : startBox.x,
                    end    : startBox.right,
                    top    : startRowBox.y,
                    bottom : startRowBox.bottom
                },
                {
                    start  : endBox.x,
                    end    : endBox.right,
                    top    : endRowBox.y,
                    bottom : endRowBox.bottom
                }
            ]
        };
    }

    /**
     * Draws all dependencies for the specified task.
     * @deprecated 5.1 The Dependencies feature was refactored and this fn is no longer needed
     */
    drawForTask() {
        VersionHelper.deprecate('Gantt', '6.0.0', 'Dependencies.drawForTask() is no longer needed');
        this.refresh();
    }

    //endregion

    //region Tooltip

    /**
     * Generates html for the tooltip shown when hovering a dependency
     * @param {Object} tooltipConfig
     * @returns {String} Html to display in the tooltip
     * @private
     */
    getHoverTipHtml({ activeTarget }) {
        const dependency = this.resolveDependencyRecord(activeTarget);

        return this.tooltipTemplate(dependency);
    }

    //endregion

    //region Dependency creation

    /**
     * Create a new dependency from source terminal to target terminal
     * @internal
     */
    async createDependency(data) {
        const
            me         = this,
            {
                source,
                target,
                fromSide,
                toSide
            }          = data,
            type       = (fromSide === 'start' ? 0 : 2) + (toSide === 'end' ? 1 : 0),
            dependency = me.dependencyStore.add({
                fromEvent : source,
                toEvent   : target,
                type
            });

        if (dependency !== null) {
            await me.dependencyStore.project.commitAsync();
            return dependency[0];
        }

        return dependency;
    }

    // endregion
}

GridFeatureManager.registerFeature(Dependencies, true, 'Gantt');
