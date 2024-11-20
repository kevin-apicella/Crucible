import Base from '../../../Core/Base.js';

/**
 * @module Gantt/view/mixin/GanttState
 */

/**
 * Mixin for Gantt that handles state. It serializes the following gantt properties:
 *
 * * barMargin
 * * tickSize
 * * zoomLevel
 *
 * See {@link Grid.view.mixin.GridState} and {@link Core.mixin.State} for more information on state.
 *
 * @mixin
 */
export default Target => class GanttState extends (Target || Base) {
    static get $name() {
        return 'GanttState';
    }

    updateProject(project, old) {
        super.updateProject(project, old);

        this.detachListeners('suspendStateDuringDelayedCalculation');

        // Delay calculation code path involves changing readOnly of the Gantt panel. This will also
        // trigger state change, we don't need that. So we pause `triggerUpdate` listener to not trigger `stateChange`
        if (project?.delayCalculation) {
            project.ion({
                name                  : 'suspendStateDuringDelayedCalculation',
                delayCalculationStart : {
                    fn   : 'suspendStateListener',
                    prio : 10
                },
                delayCalculationEnd : {
                    fn   : 'resumeStateListener',
                    prio : -10
                },
                thisObj : this
            });
        }
    }

    suspendStateListener() {
        this.stateListenerSuspended = (this.stateListenerSuspended || 0) + 1;
    }

    resumeStateListener() {
        const me = this;

        me.stateListenerSuspended = (me.stateListenerSuspended || 1) - 1;

        if (!me.stateListenerSuspended && me.isSaveStatePending) {
            me.saveState({ immediate : true });
        }
    }

    saveState(...args) {
        if (!this.stateListenerSuspended) {
            return super.saveState(...args);
        }
    }

    /**
     * Gets or sets gantt's state. Check out {@link Gantt.view.mixin.GanttState} mixin for details.
     * @member {Object} state
     * @member {Object} state
     * @property {Object[]} state.columns
     * @property {Number} state.rowHeight
     * @property {Object} state.scroll
     * @property {Number} state.scroll.scrollLeft
     * @property {Number} state.scroll.scrollTop
     * @property {Array} state.selectedRecords
     * @property {String} state.style
     * @property {String} state.selectedCell
     * @property {Object} state.store
     * @property {Sorter[]} state.store.sorters
     * @property {Grouper[]} state.store.groupers
     * @property {CollectionFilterConfig[]} state.store.filters
     * @property {Object} state.subGrids
     * @property {Number} state.barMargin
     * @property {Number} state.zoomLevel
     * @category State
     */

    /**
     * Apply previously stored state.
     * @param {Object} state
     * @private
     */
    applyState(state) {
        const me = this;

        // Applying sorters too early might lead to unexpected results if fields in the incoming dataset will be changed
        // after initial commit
        // state.store might be undefined if responsive level is being applied
        if (!me.project.isInitialCommitPerformed && (state.store?.sorters || state.store?.filters)) {
            const storeState = state.store;

            me.project.commitAsync().then(() => {
                if (!me.isDestroyed) {
                    me.suspendRefresh();
                    me.store.state = storeState;
                    me.resumeRefresh(true);
                }
            });

            delete state.store;
        }

        // Restoring selected cell and records during startup attempts to access task DOM elements which are not yet
        // rendered. So we filter out these props and apply them in onInternalPaint handler
        const specialKeys = ['selectedCell', 'selectedRecords'];
        if (specialKeys.some(key => key in state)) {
            const subState = {};

            // Copy special keys to a partial state object to apply later
            specialKeys.forEach(key => {
                if (key in state) {
                    subState[key] = state[key];

                    delete state[key];
                }
            });

            // Create fixer method that will apply state after
            me._applyStateAfterPaint = () => {
                me._applyStateAfterPaint = null;

                me.suspendRefresh();
                Object.keys(subState).forEach(key => me[key] = subState[key]);
                me.resumeRefresh(true);
            };
        }

        super.applyState(state);
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}

    onInternalPaint(...args) {
        super.onInternalPaint(...args);

        const me = this;

        if (me._applyStateAfterPaint) {
            if (!me.project.isInitialCommitPerformed) {
                me.project.ion({
                    commitFinalized() {
                        me._applyStateAfterPaint();
                    },
                    thisObj : me,
                    once    : true
                });
            }
            else {
                me._applyStateAfterPaint();
            }
        }
    }
};
