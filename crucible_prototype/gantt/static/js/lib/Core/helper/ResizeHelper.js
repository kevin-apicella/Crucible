import Base from '../Base.js';
import Events from '../mixin/Events.js';
import BrowserHelper from './BrowserHelper.js';
import EventHelper from './EventHelper.js';
import DomHelper from './DomHelper.js';
import ObjectHelper from './ObjectHelper.js';
import Rectangle from './util/Rectangle.js';



const documentListeners = {
    down       : 'onMouseDown',
    move       : 'onMouseMove',
    up         : 'onMouseUp',
    docclick   : 'onDocumentClick',
    touchstart : {
        handler : 'onTouchStart',
        // We preventDefault touchstart so as not to scroll. Must not be passive.
        // https://developers.google.com/web/updates/2017/01/scrolling-intervention
        passive : false
    },
    touchmove : 'onTouchMove',
    touchend  : 'onTouchEnd',
    keydown   : 'onKeyDown'
};

/**
 * @module Core/helper/ResizeHelper
 */

/**
 * Contextual information available during a resize.
 *
 * @typedef {Object} ResizeContext
 * @property {HTMLElement} element Element being resized
 * @property {'top'|'right'|'bottom'|'left'} edge Edge being dragged
 * @property {Boolean} valid `true` if the resize is valid, `false` if it is not
 * @property {Boolean} async Set to `true` in a `resize` listener to allow asynchronous finalization of the resize
 * @property {Function} finalize Call this function to finalize the resize, required if it was flagged as `async` in a
 * `resize` listener
 * @property {Number} newWidth New width of the element
 * @property {Number} newHeight New height of the element
 * @property {Number} newX New x coordinate of the element, when dragging left edge
 * @property {Number} newY New y coordinate of the element, when dragging top edge
 */

/**
 * Handles resizing of elements using handles. Handles can be actual elements or virtual handles specified as a border
 * area on elements left and right edges.
 *
 * ```javascript
 * // enable resizing all elements with class 'resizable'
 * let resizer = new ResizeHelper({
 *   targetSelector: '.resizable'
 * });
 * ```
 *
 * @mixes Core/mixin/Events
 * @internal
 */
export default class ResizeHelper extends Events(Base) {
    //region Config

    static get defaultConfig() {
        return {
            /**
             * CSS class added when resizing
             * @config {String}
             * @default
             */
            resizingCls : 'b-resizing',

            /**
             * The amount of pixels to move mouse before it counts as a drag operation
             * @config {Number}
             * @default
             */
            dragThreshold : 5,

            /**
             * Resizing handle size
             * @config {Number}
             * @default
             */
            handleSize : 10,

            /**
             * Automatically shrink virtual handles when available space < handleSize. The virtual handles will
             * decrease towards width/height 1, reserving space between opposite handles to for example leave room for
             * dragging. To configure reserved space, see {@link #config-reservedSpace}.
             * @config {Boolean}
             * @default false
             */
            dynamicHandleSize : null,

            //
            /**
             * Room in px to leave unoccupied by handles when shrinking them dynamically (see
             * {@link #config-dynamicHandleSize}).
             * @config {Number}
             * @default
             */
            reservedSpace : 10,

            /**
             * Resizing handle size on touch devices
             * @config {Number}
             * @default
             */
            touchHandleSize : 30,

            /**
             * Minimum width when resizing
             * @config {Number}
             * @default
             */
            minWidth : 1,

            /**
             * Max width when resizing.
             * @config {Number}
             * @default
             */
            maxWidth : 0,

            /**
             * Minimum height when resizing
             * @config {Number}
             * @default
             */
            minHeight : 1,

            /**
             * Max height when resizing
             * @config {Number}
             * @default
             */
            maxHeight : 0,

            // outerElement, attach events to it and use as outer limit when looking for ancestors
            outerElement : document.body,

            /**
             * Optional scroller used to read scroll position. If unspecified, the outer element will be used.
             * @config {Core.helper.util.Scroller}
             */
            scroller : null,

            /**
             * Assign a function to determine if a hovered element can be resized or not.
             * Return `true` to allow resizing or `false` to prevent.
             * @config {Function}
             * @param {HTMLElement} element
             * @returns {Boolean}
             * @default
             */
            allowResize : null,

            /**
             * Outer element that limits where element can be dragged
             * @config {HTMLElement}
             * @default
             */
            dragWithin : null,

            /**
             * A function that determines if dragging an element is allowed. Gets called with the element as argument,
             * return `true` to allow dragging or `false` to prevent.
             * @config {Function}
             * @param {HTMLElement} element
             * @returns {Boolean}
             * @default
             */
            isElementResizable : null,

            /**
             * A CSS selector used to determine if resizing an element is allowed.
             * @config {String}
             * @default
             */
            targetSelector : null,

            /**
             * Use left handle when resizing. Only applies when `direction` is 'horizontal'
             * @config {Boolean}
             * @default
             */

            leftHandle : true,

            /**
             * Use right handle when resizing. Only applies when `direction` is 'horizontal'
             * @config {Boolean}
             * @default
             */
            rightHandle : true,

            /**
             * Use top handle when resizing. Only applies when `direction` is 'vertical'
             * @config {Boolean}
             * @default
             */

            topHandle : true,

            /**
             * Use bottom handle when resizing. Only applies when `direction` is 'vertical'
             * @config {Boolean}
             * @default
             */
            bottomHandle : true,

            /**
             * A CSS selector used to determine where handles should be "displayed" when resizing. Defaults to
             * targetSelector if unspecified
             * @config {String}
             */
            handleSelector : null,

            /**
             * A CSS selector used to determine which inner element contains handles.
             * @config {String}
             */
            handleContainerSelector : null,

            startEvent : null,

            /*
             * Optional config object, used by EventResize feature: it appends proxy and has to start resizing immediately
             * @config {Object}
             * @private
             */
            grab : null,

            /**
             * CSS class added when the resize state is invalid
             * @config {String}
             * @default
             */
            invalidCls : 'b-resize-invalid',

            // A number that controls whether or not the element is wide enough for it to make sense to show resize handles
            // e.g. handle width is 10px, so doesn't make sense to show them unless handles on both sides fit
            handleVisibilityThreshold : null,

            // Private config that disables translation when resizing left edge. Useful for example in cases when element
            // being resized is part of a flex layout
            skipTranslate : false,

            /**
             * Direction to resize in, either 'horizontal' or 'vertical'
             * @config {'horizontal'|'vertical'}
             * @default
             */
            direction : 'horizontal',

            clickSwallowDuration : 50,
            constrainToParent    : true,
            rtlSource            : null
        };
    }

    static configurable = {
        // Private config that disables updating elements width and position, for when data is live updated during
        // resize, leading to element being redrawn
        skipUpdatingElement : null
    };

    //endregion

    //region Events

    /**
     * Fired while dragging
     * @event resizing
     * @param {Core.helper.ResizeHelper} source
     * @param {ResizeContext} context Resize context
     * @param {MouseEvent} event Browser event
     */

    /**
     * Fired when dragging starts.
     * @event resizeStart
     * @param {Core.helper.ResizeHelper} source
     * @param {ResizeContext} context Resize context
     * @param {MouseEvent|TouchEvent} event Browser event
     */

    /**
     * Fires after resize, and allows for asynchronous finalization by setting 'async' to `true` on the context object.
     * @event resize
     * @param {Core.helper.ResizeHelper} source
     * @param {ResizeContext} context Context about the resize operation. Set 'async' to `true` to indicate asynchronous
     * validation of the resize flow (for showing a confirmation dialog etc)
     */

    /**
     * Fires when a resize is canceled (width & height are reverted)
     * @event cancel
     * @param {Core.helper.ResizeHelper} source
     * @param {ResizeContext} context Resize context
     * @param {MouseEvent|TouchEvent} event Browser event
     */
    //endregion

    //region Init

    construct(config) {
        const me = this;

        super.construct(config);

        // Larger draggable zones on pure touch devices with no mouse
        if (!me.handleSelector && !BrowserHelper.isHoverableDevice) {
            me.handleSize = me.touchHandleSize;
        }

        me.handleVisibilityThreshold = me.handleVisibilityThreshold || 2 * me.handleSize;

        me.initListeners();

        me.initResize();
    }

    doDestroy() {
        this.abort(true);
        super.doDestroy();
    }

    updateSkipUpdatingElement(skip) {
        if (skip) {
            this.skipTranslate = true;
        }
    }

    /**
     * Initializes resizing
     * @private
     */
    initResize() {
        const me = this;

        if (!me.isElementResizable && me.targetSelector) {
            me.isElementResizable = element => element.closest(me.targetSelector);
        }

        if (me.grab) {
            const { edge, element, event } = me.grab;

            me.startEvent = event;

            const cursorOffset = me.getCursorOffsetToElementEdge(event, element, edge);

            // emulates mousedown & grabResize
            me.context = {
                element,
                edge,
                valid         : true,
                async         : false,
                elementStartX : DomHelper.getTranslateX(element) || element.offsetLeft, // extract x from translate
                elementStartY : DomHelper.getTranslateY(element) || element.offsetTop, // extract x from translate
                newX          : DomHelper.getTranslateX(element) || element.offsetLeft, // No change yet on start, but info must be present
                newY          : DomHelper.getTranslateY(element) || element.offsetTop, // No change yet on start, but info must be present
                elementWidth  : element.offsetWidth,
                elementHeight : element.offsetHeight,
                cursorOffset,
                startX        : event.clientX + cursorOffset.x + me.scrollLeft,
                startY        : event.clientY + cursorOffset.y + me.scrollTop,
                finalize      : () => me.reset?.()
            };

            element.classList.add(me.resizingCls);

            me.internalStartResize(me.isTouch);
        }
    }

    /**
     * Initialize listeners
     * @private
     */
    initListeners() {
        const
            me                 = this,
            dragStartListeners = {
                element    : me.outerElement,
                mousedown  : documentListeners.down,
                touchstart : documentListeners.touchstart,
                thisObj    : me
            };

        if (!me.handleSelector && BrowserHelper.isHoverableDevice) {
            dragStartListeners.mousemove = {
                handler : documentListeners.move,

                // Filter events for checkResizeHandles so we only get called if the mouse
                // is over one of our targets.
                delegate : me.targetSelector
            };

            // We need to clean up when we exit one of our targets
            dragStartListeners.mouseleave = {
                handler  : 'onMouseLeaveTarget',
                delegate : me.targetSelector,
                capture  : true
            };
        }

        // These will be autoDetached upon destroy
        EventHelper.on(dragStartListeners);
    }

    get isRTL() {
        return Boolean(this.rtlSource?.rtl);
    }

    //endregion

    //region Scroll helpers

    get scrollLeft() {
        if (this.scroller) {
            return this.scroller.x;
        }

        return this.outerElement.scrollLeft;
    }

    get scrollTop() {
        if (this.scroller) {
            return this.scroller.y;
        }

        return this.outerElement.scrollTop;
    }

    //endregion

    //region Events

    internalStartResize(isTouch) {
        const dragListeners = {
            element : document,
            keydown : documentListeners.keydown,
            thisObj : this
        };

        if (isTouch) {
            dragListeners.touchmove = documentListeners.touchmove;
            // Touch desktops don't fire touchend event when touch has ended, instead pointerup is fired
            // iOS do fire touchend
            dragListeners.touchend = dragListeners.pointerup = documentListeners.touchend;
        }
        else {
            dragListeners.mousemove = documentListeners.move;
            dragListeners.mouseup   = documentListeners.up;
        }

        // A listener detacher is returned
        this.removeDragListeners = EventHelper.on(dragListeners);

        this.onResizeHandlePointerDown?.(this.startEvent);
    }

    // Empty class implementation. If listeners *are* added, the detacher is added
    // as an instance property. So this is always callable.
    removeDragListeners() {}

    reset() {
        this.removeDragListeners?.();
        this.context = null;
        this.trigger('reset');
    }

    canResize(element, event) {
        return !this.isElementResizable || this.isElementResizable(element, event);
    }

    onPointerDown(isTouch, event) {
        const me = this;

        me.startEvent = event;

        if (me.canResize(event.target, event) && me.grabResizeHandle(isTouch, event)) {
            // Stop event if resize handle was grabbed (resize started)
            event.stopImmediatePropagation();
            if (event.type === 'touchstart') {
                event.preventDefault();
            }
            me.internalStartResize(isTouch);
        }
    }

    onTouchStart(event) {
        // only allowing one finger for now...
        if (event.touches.length > 1) {
            return;
        }

        this.onPointerDown(true, event);
    }

    /**
     * Grab draggable element on mouse down.
     * @private
     * @param {MouseEvent|PointerEvent} event
     */
    onMouseDown(event) {
        // only dragging with left mouse button
        if (event.button !== 0) {
            return;
        }

        this.onPointerDown(false, event);
    }

    internalMove(isTouch, event) {
        const
            me                     = this,
            { context, direction } = me;

        if (context?.element && (context.started || EventHelper.getDistanceBetween(me.startEvent, event) >= me.dragThreshold)) {
            if (!context.started) {
                me.scrollManager?.startMonitoring(ObjectHelper.merge({
                    scrollables : [
                        {
                            element : me.dragWithin || me.outerElement,

                            direction
                        }
                    ],
                    callback : config => me.context?.element && me.lastMouseMoveEvent && me.update(me.lastMouseMoveEvent, config)
                }, me.monitoringConfig));

                me.trigger('resizeStart', { context, event });

                context.started = true;
            }

            me.update(event);
        }
        // If a mousemove, and we are using zones, and not handles, we have to
        // programmatically check whether we are over a handle, and add/remove
        // classes to change the mouse cursor to resize.
        // If we are using handles, their CSS will set the mouse cursor.
        else if (!isTouch && !me.handleSelector) {
            me.checkResizeHandles(event);
        }
    }

    onTouchMove(event) {
        this.internalMove(true, event);
    }

    /**
     * Move grabbed element with mouse.
     * @param {MouseEvent|PointerEvent} event
     * @fires resizestart
     * @private
     */
    onMouseMove(event) {
        this.internalMove(false, event);
    }

    onPointerUp(isTouch, event) {
        const
            me      = this,
            context = me.context;

        me.removeDragListeners?.();

        if (context) {
            me.scrollManager?.stopMonitoring();

            if (context.started) {
                // Prevent the impending document click from the mouseup event from propagating
                // into a click on our element.
                EventHelper.on({
                    element : document,
                    thisObj : me,
                    click   : documentListeners.docclick,
                    expires : me.clickSwallowDuration, // In case a click did not ensue, remove the listener
                    capture : true,
                    once    : true
                });
            }
            me.finishResize(event);
        }
        else {
            me.reset?.();
        }
    }

    onTouchEnd(event) {
        this.onPointerUp(true, event);
    }

    /**
     * Drop on mouse up (if dropped on valid target).
     * @param {MouseEvent|PointerEvent} event
     * @private
     */
    onMouseUp(event) {
        this.onPointerUp(false, event);
    }

    /**
     * This is a capture listener, only added during drag, which prevents a click gesture
     * propagating from the terminating mouseup gesture
     * @param {MouseEvent} event
     * @private
     */
    onDocumentClick(event) {
        event.stopPropagation();
    }

    /**
     * Cancel on ESC key
     * @param {KeyboardEvent} event
     * @private
     */
    onKeyDown(event) {
        if (event.key === 'Escape') {
            this.abort();
        }
    }

    //endregion

    //region Grab, update, finish

    /**
     * Updates resize, called when an element is grabbed and mouse moves
     * @private
     * @fires resizing
     */
    update(event) {
        const
            me                 = this,
            { context,  constrainToParent } = me,
            { element }                     = context;

        if (constrainToParent) {
            const parentRectangle = Rectangle.from(me.outerElement);

            // Calculate the current pointer X. Do not allow overflowing either edge
            context.currentX = Math.max(Math.min(event.clientX + context.cursorOffset.x, parentRectangle.right), parentRectangle.x) + me.scrollLeft;
            context.currentY = Math.max(Math.min(event.clientY + context.cursorOffset.y, parentRectangle.bottom), parentRectangle.y) + me.scrollTop;
        }
        else {
            context.currentX = event.clientX + context.cursorOffset.x + me.scrollLeft;
            context.currentY = event.clientY + context.cursorOffset.y + me.scrollTop;
        }

        element.classList.add(me.resizingCls);

        if (me.updateResize(event)) {
            me.trigger('resizing', { context, event });
            element.classList.toggle(me.invalidCls, context.valid === false);
        }

        me.lastMouseMoveEvent = event;
    }

    /**
     * Abort dragging
     */
    abort(silent = false) {
        const me = this;

        me.scrollManager?.stopMonitoring?.();

        if (me.context) {
            me.abortResize(null, silent);
        }
        else if (!me.isDestroyed) {
            me.reset();
        }
    }

    /**
     * Starts resizing, updates ResizeHelper#context with relevant info.
     * @private
     * @param {Boolean} isTouch
     * @param {MouseEvent} event
     * @returns {Boolean} True if handled, false if not
     */
    grabResizeHandle(isTouch, event) {
        const me = this;

        if (me.allowResize && !me.allowResize(event.target, event)) {
            return false;
        }

        const
            handleSelector = me.handleSelector,
            coordsFrom     = event.type === 'touchstart' ? event.changedTouches[0] : event,
            clientX        = coordsFrom.clientX,
            clientY        = coordsFrom.clientY;
        // go up from "handle" to resizable element

        let element = me.targetSelector ? event.target.closest(me.targetSelector) : event.target;

        if (element) {
            let edge;

            // Calculate which edge to resize
            // If there's a handle selector, see if it's anchored on the left or the right
            if (handleSelector) {
                if (event.target.matches(handleSelector)) {
                    if (me.direction === 'horizontal') {
                        if (event.pageX < DomHelper.getPageX(element) + element.offsetWidth / 2) {
                            edge = me.isRTL ? 'right' : 'left';
                        }
                        else {
                            edge = me.isRTL ? 'left' : 'right';
                        }

                    }
                    else {
                        if (event.pageY < DomHelper.getPageY(element) + element.offsetHeight / 2) {
                            edge = 'top';
                        }
                        else {
                            edge = 'bottom';
                        }
                    }
                }
                else {
                    return false;
                }
            }
            // If we're not using handles, but just active zones
            // then test whether the event position is in an active resize zone.
            else {
                if (me.direction === 'horizontal') {
                    if (me.overLeftHandle(event, element)) {
                        edge = me.isRTL ? 'right' : 'left';
                    }
                    else if (me.overRightHandle(event, element)) {
                        edge = me.isRTL ? 'left' : 'right';
                    }
                }
                else {
                    if (me.overTopHandle(event, element)) {
                        edge = 'top';
                    }
                    else if (me.overBottomHandle(event, element)) {
                        edge = 'bottom';
                    }
                }

                if (!edge) {
                    me.context = null;
                    // not over an edge, abort
                    return false;
                }
            }

            // If resizing is initiated by a touch, we must preventDefault on the touchstart
            // so that scrolling is not invoked when dragging. This is in lieu of a functioning
            // touch-action style on iOS Safari. When that's fixed, this will not be needed.
            if (event.type === 'touchstart') {
                event.preventDefault();
            }

            const
                cursorOffset   = me.getCursorOffsetToElementEdge(coordsFrom, element, edge),
                mutatedContext = me.internalBeforeStart?.({ element, edge });

            // Allow outside world to flip edges (to make a top-edge interaction apply to the bottom-edge instead)
            if (mutatedContext) {
                element = mutatedContext.element;
                edge    = mutatedContext.edge;
            }

            if (me.trigger('beforeResizeStart', { element, event }) !== false) {
                // store initial size
                me.context = {
                    element,
                    edge,
                    isTouch,
                    valid         : true,
                    async         : false,
                    direction     : me.direction,
                    elementStartX : DomHelper.getTranslateX(element) || element.offsetLeft, // extract x from translate
                    elementStartY : DomHelper.getTranslateY(element) || element.offsetTop, // extract y from translate
                    newX          : DomHelper.getTranslateX(element) || element.offsetLeft, // No change yet on start, but info must be present
                    newY          : DomHelper.getTranslateY(element) || element.offsetTop, // No change yet on start, but info must be present
                    elementWidth  : element.offsetWidth,
                    elementHeight : element.offsetHeight,
                    cursorOffset,
                    startX        : clientX + cursorOffset.x + me.scrollLeft,
                    startY        : clientY + cursorOffset.y + me.scrollTop,
                    finalize      : () => me.reset?.()
                };

                element.classList.add(me.resizingCls);

                return true;
            }
        }

        return false;
    }

    getCursorOffsetToElementEdge(event, element, edge) {
        const rectEl = Rectangle.from(element);

        let x = 0,
            y = 0;

        switch (edge) {
            case 'left':
                x = rectEl.x - (this.isRTL ? rectEl.width : 0) - event.clientX; // negative
                break;
            case 'right':
                x = rectEl.x + (this.isRTL ? 0 : rectEl.width) - event.clientX; // positive
                break;
            case 'top':
                y = rectEl.y - event.clientY; // negative
                break;
            case 'bottom':
                y = rectEl.y + rectEl.height - event.clientY; // positive
                break;
        }

        return { x, y };
    }

    /**
     * Check if mouse is over a resize handle (virtual). If so, highlight.
     * @private
     * @param {MouseEvent} event
     */
    checkResizeHandles(event) {
        const
            me     = this,
            target = me.targetSelector ? event.target.closest(me.targetSelector) : event.target;

        // mouse over a target element and allowed to resize?
        if (target && (!me.allowResize || me.allowResize(event.target, event))) {
            me.currentElement = me.handleContainerSelector ? event.target.closest(me.handleContainerSelector) : event.target;

            if (me.currentElement) {
                let over;

                if (me.direction === 'horizontal') {
                    over = me.overLeftHandle(event, target) || me.overRightHandle(event, target);
                }
                else {
                    over = me.overTopHandle(event, target) || me.overBottomHandle(event, target);
                }

                if (over) {
                    me.highlightHandle(); // over handle
                }
                else {
                    me.unHighlightHandle(); // not over handle
                }
            }
        }
        else if (me.currentElement) {
            me.unHighlightHandle(); // outside element
        }
    }

    onMouseLeaveTarget(event) {
        const me = this;

        me.currentElement = me.handleContainerSelector ? event.target.closest(me.handleContainerSelector) : event.target;

        if (me.currentElement) {
            me.unHighlightHandle();
        }
    }

    /**
     * Updates size of target (on mouse move).
     * @private
     * @param {MouseEvent|PointerEvent} event
     */
    updateResize(event) {
        const
            me = this,
            {
                context,
                allowEdgeSwitch,
                skipTranslate,
                skipUpdatingElement
            }  = me;

        let updated;

        // flip which edge is being dragged depending on whether we're to the right or left of the mousedown
        if (allowEdgeSwitch) {
            if (me.direction === 'horizontal') {
                context.edge = context.currentX > context.startX ? 'right' : 'left';
            }
            else {
                context.edge = context.currentY > context.startY ? 'bottom' : 'top';
            }
        }

        const
            {
                element,
                elementStartX,
                elementStartY,
                elementWidth,
                elementHeight,
                edge
            }         = context,
            { style } = element,
            // limit to outerElement if set
            deltaX    = context.currentX - context.startX,
            deltaY    = context.currentY - context.startY,
            minWidth  = DomHelper.getExtremalSizePX(element, 'minWidth') || me.minWidth,
            maxWidth  = DomHelper.getExtremalSizePX(element, 'maxWidth') || me.maxWidth,
            minHeight = DomHelper.getExtremalSizePX(element, 'minHeight') || me.minHeight,
            maxHeight = DomHelper.getExtremalSizePX(element, 'maxHeight') || me.maxHeight,
            // dragging the right edge right increases the width, dragging left edge right decreases width
            sign      = (edge === 'right' && !me.isRTL) || edge === 'bottom' ? 1 : -1,
            // new width, not allowed to go below minWidth
            newWidth  = elementWidth + deltaX * sign,
            newHeight = elementHeight + deltaY * sign;

        let
            width  = Math.max(minWidth, newWidth),
            height = Math.max(minHeight, newHeight);

        if (maxWidth > 0) {
            width = Math.min(width, maxWidth);
        }

        if (maxHeight > 0) {
            height = Math.min(height, maxHeight);
        }

        if (me.direction === 'horizontal' && elementWidth !== width) {
            if (!skipUpdatingElement) {
                style.flex = '';
                style.width = Math.abs(width) + 'px';
            }
            context.newWidth = width;

            // when dragging left edge, also update position (so that right edge remains in place)
            if (edge === 'left' || width < 0) {
                const newX = Math.max(Math.min(elementStartX + elementWidth - me.minWidth, elementStartX + deltaX), 0);

                if (!skipTranslate) {
                    DomHelper.setTranslateX(element, Math.round(newX));
                }

                context.newX = newX;
            }
            // When dragging the right edge and we're allowed to flip the drag from left to right
            // through the start point (eg drag event creation) the element must be at its initial X position
            else if (edge === 'right' && allowEdgeSwitch && !skipTranslate) {
                DomHelper.setTranslateX(element, elementStartX);
            }
            updated = true;
        }
        else if (me.direction === 'vertical' && elementHeight !== newHeight) {
            if (!skipUpdatingElement) {
                style.flex = '';
                style.height = Math.abs(height) + 'px';
            }
            context.newHeight = height;

            // when dragging top edge, also update position (so that bottom edge remains in place)
            if (edge === 'top' || height < 0) {
                context.newY = Math.max(Math.min(elementStartY + elementHeight - me.minHeight, elementStartY + deltaY), 0);
                if (!skipTranslate) {
                    DomHelper.setTranslateY(element, context.newY);
                }
            }
            // When dragging the bottom edge and we're allowed to flip the drag from top to bottom
            // through the start point (eg drag event creation) the element must be at its initial Y position
            else if (edge === 'bottom' && allowEdgeSwitch && !skipTranslate) {
                DomHelper.setTranslateY(element, elementStartY);
            }
            updated = true;
        }
        return updated;
    }

    /**
     * Finalizes resize, fires drop.
     * @private
     * @param {MouseEvent|PointerEvent} event
     * @fires resize
     * @fires cancel
     */
    finishResize(event) {
        const
            me          = this,
            context     = me.context,
            eventObject = { context, event };

        context.element.classList.remove(me.resizingCls);

        if (context.started) {
            let changed = false;

            if (me.direction === 'horizontal') {
                changed = context.newWidth && context.newWidth !== context.elementWidth;
            }
            else {
                changed = context.newHeight && context.newHeight !== context.elementHeight;
            }
            me.trigger(changed ? 'resize' : 'cancel', eventObject);

            if (!context.async) {
                context.finalize();
            }
        }
        else {
            me.reset?.();
        }
    }

    /**
     * Abort resizing
     * @private
     * @fires cancel
     */
    abortResize(event = null, silent = false) {
        const
            me      = this,
            context = me.context;

        context.element.classList.remove(me.resizingCls);
        if (me.direction === 'horizontal') {
            // With these statements, no x pos is changed when resizing. Should therefor not reset it when cancelling
            if (context.edge === 'left' || (context.allowEdgeSwitch && !context.skipTranslate)) {
                DomHelper.setTranslateX(context.element, context.elementStartX);
            }
            context.element.style.width = context.elementWidth + 'px';
        }
        else {
            DomHelper.setTranslateY(context.element, context.elementStartY);
            context.element.style.height = context.elementHeight + 'px';
        }

        !silent && me.trigger('cancel', { context, event });

        if (!me.isDestroyed) {
            me.reset();
        }
    }

    //endregion

    //region Handles

    /**
     * Highlights handles (applies css that changes cursor).
     * @private
     */
    highlightHandle() {
        const
            me     = this,
            target = me.targetSelector ? me.currentElement.closest(me.targetSelector) : me.currentElement;

        // over a handle, add cls to change cursor
        me.currentElement.classList.add('b-resize-handle');
        target.classList.add('b-over-resize-handle');
    }

    /**
     * Unhighlight handles (removes css).
     * @private
     */
    unHighlightHandle() {
        const
            me     = this,
            target = me.targetSelector ? me.currentElement.closest(me.targetSelector) : me.currentElement;

        target && target.classList.remove('b-over-resize-handle');
        me.currentElement.classList.remove('b-resize-handle');
        me.currentElement = null;
    }

    overAnyHandle(event, target) {
        return this.overStartHandle(event, target) || this.overEndHandle(event, target);
    }

    overStartHandle(event, target) {
        return this.direction === 'horizontal' ? this.overLeftHandle(event, target) : this.overTopHandle(event, target);
    }

    overEndHandle(event, target) {
        return this.direction === 'horizontal' ? this.overRightHandle(event, target) : this.overBottomHandle(event, target);
    }

    getDynamicHandleSize(opposite, offsetWidth) {
        const
            handleCount    = opposite ? 2 : 1,
            { handleSize } = this;

        // Shrink handle size when configured to do so, preserving reserved space between handles
        if (this.dynamicHandleSize && handleSize * handleCount > offsetWidth - this.reservedSpace) {
            return Math.max(Math.floor((offsetWidth - this.reservedSpace) / handleCount), 0);
        }

        return handleSize;
    }

    /**
     * Check if over left handle (virtual).
     * @private
     * @param {MouseEvent} event MouseEvent
     * @param {HTMLElement} target The current target element
     * @returns {Boolean} Returns true if mouse is over left handle, otherwise false
     */
    overLeftHandle(event, target) {
        const
            me              = this,
            { offsetWidth } = target;

        if (me.leftHandle && me.canResize(target, event) && (offsetWidth >= me.handleVisibilityThreshold || me.dynamicHandleSize)) {
            const leftHandle = Rectangle.from(target);

            leftHandle.width = me.getDynamicHandleSize(me.rightHandle, offsetWidth);

            return leftHandle.width > 0 && leftHandle.contains(EventHelper.getPagePoint(event));
        }
        return false;
    }

    /**
     * Check if over right handle (virtual).
     * @private
     * @param {MouseEvent} event MouseEvent
     * @param {HTMLElement} target The current target element
     * @returns {Boolean} Returns true if mouse is over left handle, otherwise false
     */
    overRightHandle(event, target) {
        const
            me              = this,
            { offsetWidth } = target;

        if (me.rightHandle && me.canResize(target, event) && (offsetWidth >= me.handleVisibilityThreshold || me.dynamicHandleSize)) {
            const rightHandle = Rectangle.from(target);

            rightHandle.x = rightHandle.right - me.getDynamicHandleSize(me.leftHandle, offsetWidth);

            return rightHandle.width > 0 && rightHandle.contains(EventHelper.getPagePoint(event));
        }
        return false;
    }

    /**
     * Check if over top handle (virtual).
     * @private
     * @param {MouseEvent} event MouseEvent
     * @param {HTMLElement} target The current target element
     * @returns {Boolean} Returns true if mouse is over top handle, otherwise false
     */
    overTopHandle(event, target) {
        const
            me               = this,
            { offsetHeight } = target;

        if (me.topHandle && me.canResize(target, event) && (offsetHeight >= me.handleVisibilityThreshold || me.dynamicHandleSize)) {
            const topHandle = Rectangle.from(target);

            topHandle.height = me.getDynamicHandleSize(me.bottomHandle, offsetHeight);

            return topHandle.height > 0 && topHandle.contains(EventHelper.getPagePoint(event));
        }
        return false;
    }

    /**
     * Check if over bottom handle (virtual).
     * @private
     * @param {MouseEvent} event MouseEvent
     * @param {HTMLElement} target The current target element
     * @returns {Boolean} Returns true if mouse is over bottom handle, otherwise false
     */
    overBottomHandle(event, target) {
        const
            me               = this,
            { offsetHeight } = target;

        if (me.bottomHandle && me.canResize(target, event) && (offsetHeight >= me.handleVisibilityThreshold || me.dynamicHandleSize)) {
            const bottomHandle = Rectangle.from(target);

            bottomHandle.y = bottomHandle.bottom - me.getDynamicHandleSize(me.bottomHandle, offsetHeight);

            return bottomHandle.height > 0 && bottomHandle.contains(EventHelper.getPagePoint(event));
        }
        return false;
    }

    //endregion
}
