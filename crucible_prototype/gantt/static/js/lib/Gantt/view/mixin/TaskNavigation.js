import Base from '../../../Core/Base.js';

/**
 * @module Gantt/view/mixin/TaskNavigation
 */
const animate100 = {
    animate : 100
};

/**
 * Mixin that tracks event or assignment selection by clicking on one or more events in the scheduler.
 * @mixin
 */
export default Target => class TaskNavigation extends (Target || Base) {
    static get $name() {
        return 'TaskNavigation';
    }

    static get defaultConfig() {
        return {
            navigator : {
                inlineFlow : false,
                prevKey    : 'ArrowUp',
                nextKey    : 'ArrowDown',
                keys       : {
                    Enter : 'onTaskEnterKey'
                }
            },

            isNavigationKey : {
                ArrowDown  : 1,
                ArrowUp    : 1,
                ArrowLeft  : 0,
                ArrowRight : 0
            }
        };
    }

    processEvent(event) {
        const me = this,
            eventElement = event.target.closest(me.eventSelector);

        if (!me.navigator.disabled && eventElement) {
            event.taskRecord = event.eventRecord = me.resolveTaskRecord(eventElement);
        }

        return event;
    }

    normalizeTarget(event) {
        return event.taskRecord;
    }

    // Makes sure you a click on a task that is already focused will call cell selection
    onElementMouseDown(event) {
        const
            me               = this,
            { _focusedCell } = me,
            taskEl           = event.target.closest(me.navigator.itemSelector),
            isFocused        = taskEl && taskEl === _focusedCell?.target;

        super.onElementMouseDown(event);

        if (isFocused && me.lastNavigationEvent !== event) {
            me.onCellNavigate?.(me, _focusedCell, _focusedCell, true);
            me.lastNavigationEvent = event; // Saved the navigation event so to not process this event twice
        }
    }

    selectEvent(record, preserveSelection = false) {
        if (!this.isSelected(record)) {
            // Select row without scrolling any column into view
            this.selectRow({
                record         : record.id,
                column         : false,
                addToSelection : preserveSelection
            });
        }
    }

    deselectEvent(record) {
        this.deselectRow(record.id);
    }

    getNext(taskRecord) {
        const
            me        = this,
            { store } = me;

        for (let rowIdx = store.indexOf(taskRecord) + 1; rowIdx < store.count; rowIdx++) {
            const nextTask = store.getAt(rowIdx);

            // Skip tasks which are outside the TimeAxis
            if (me.isInTimeAxis(nextTask)) {
                return nextTask;
            }
        }
    }

    getPrevious(taskRecord) {
        const
            me        = this,
            { store } = me;

        for (let rowIdx = store.indexOf(taskRecord) - 1; rowIdx >= 0; rowIdx--) {
            const prevTask = store.getAt(rowIdx);

            // Skip tasks which are outside the TimeAxis
            if (me.isInTimeAxis(prevTask)) {
                return prevTask;
            }
        }
    }

    set activeEvent(record) {
        this.navigator.activeItem = this.getElementFromTaskRecord(record, false);
    }

    get activeEvent() {
        const { activeItem } = this.navigator;

        if (activeItem) {
            return this.resolveTaskRecord(activeItem);
        }
    }

    async navigateTo(targetEvent, {
        scrollIntoView = true,
        uiEvent        = {}
    }) {
        const
            me                      = this,
            { navigator }           = me,
            { skipScrollIntoView }  = navigator;

        if (targetEvent) {
            if (scrollIntoView) {
                // No key processing during scroll
                navigator.disabled = true;
                await me.scrollTaskIntoView(targetEvent, animate100);
                navigator.disabled = false;
            }
            else {
                navigator.skipScrollIntoView = true;
            }

            // Panel can be destroyed before promise is resolved
            if (!me.isDestroyed) {
                me.activeEvent = targetEvent;
                navigator.skipScrollIntoView = skipScrollIntoView;
                navigator.trigger('navigate', {
                    event : uiEvent,
                    item  : me.getElementFromTaskRecord(targetEvent, false)
                });
            }
        }
    }

    clearEventSelection() {
        this.deselectAll();
    }

    onTaskEnterKey() {
        // Empty, to be chained by features (used by TaskEdit)
    }

    // OVERRIDE for EventNavigation#onDeleteKey
    onDeleteKey(keyEvent) {
        const record = keyEvent.eventRecord;

        if (!this.readOnly && this.enableDeleteKey && record) {
            this.removeEvents([record]);
        }
    }

    onGridBodyFocusIn(focusEvent) {
        // Task navigation only has a say when navigation is inside the TimeAxisSubGrid
        if (this.timeAxisSubGridElement.contains(focusEvent.target)) {
            const
                me                  = this,
                { navigationEvent } = me,
                { target }          = focusEvent,
                eventFocus          = target.closest(me.navigator.itemSelector),
                task                = eventFocus ? me.resolveTaskRecord(target) : me.getRecordFromElement(target),
                destinationCell     = me.normalizeCellContext({
                    rowIndex : me.store.indexOf(task),
                    column   : me.timeAxisColumn,
                    target
                });

            // Don't take over what the event navigator does if it's doing task navigation.
            // Just silently cache our actionable location.
            if (eventFocus) {
                if (me.lastNavigationEvent !== navigationEvent) {
                    const { _focusedCell } = me;

                    me._focusedCell = destinationCell;
                    me.onCellNavigate?.(me, _focusedCell, destinationCell, true);
                    // Saved the navigation event so to not process this event twice
                    me.lastNavigationEvent = navigationEvent;
                }
                return;
            }

            // Try to focus the task.
            me.navigateTo(task, {
                scrollIntoView : Boolean(navigationEvent?.type !== 'mousedown'),
                uiEvent        : navigationEvent
            });
            return;
        }

        super.onGridBodyFocusIn(focusEvent);
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
