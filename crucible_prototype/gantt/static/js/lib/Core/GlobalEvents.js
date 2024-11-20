import Base from './Base.js';
import Events from './mixin/Events.js';
import DomHelper from './helper/DomHelper.js';
import BrowserHelper from './helper/BrowserHelper.js';
import Rectangle from './helper/util/Rectangle.js';

/**
 * @module Core/GlobalEvents
 */
const
    // Allow an unsteady finger to jiggle by this much
    longpressMoveThreshold = 5,
    isFloatingWidget       = w => w.floating,
    longPressCancelEvents  = {
        touchend  : 1,
        pointerup : 1
    },
    ignoreModifierKeys     = {
        Meta    : 1,
        Control : 1,
        Alt     : 1
    },
    GlobalEvents = new (class GlobalEventsHandler extends Base.mixin(Events) {
        suspendFocusEvents() {
            focusEventsSuspended = true;
        }

        resumeFocusEvents() {
            focusEventsSuspended = false;
        }

        setupFocusListenersOnce(rootElement, EventHelper) {
            if (rootElement && !GlobalEvents.observedElements.has(rootElement)) {
                GlobalEvents.setupFocusListeners(rootElement, EventHelper);
                GlobalEvents.observedElements.add(rootElement);
            }
        }

        detachFocusListeners(rootElement) {
            if (rootElement.$globalEventsDetacher) {
                rootElement.$globalEventsDetacher();
                rootElement.$globalEventsDetacher = null;
                GlobalEvents.observedElements.delete(rootElement);
            }
        }

        // This is imported by EventHelper and that makes the call to set up the listeners
        // `detach` argument is required to not setup more listeners than we need to. In case of salesforce we include floatroot
        // inside the webcomponent element and thus don't need default listeners on document. In regular webcomponents demo we
        // don't need to do it, because with multiple components on one page that would force us to make more complex lookups.
        setupFocusListeners(element = document, EventHelper, detach = false) {
            let lastPinchPos, pinchCenter, pinchTarget;

            const listeners = {
                element,
                touchstart(touchstart) {
                    const { touches : ct } = touchstart;

                    // Only monitor pinch gestures within our widgets
                    if (ct.length === 2 && ct[0].target.closest('.b-widget') && ct[1].target.closest('.b-widget')) {
                        // While there are precisely two touchpoints, we capture
                        // the initial center and the element at that point.
                        // during pinch or zoom, we fire CTRL/wheel events
                        // into that element at that point.
                        lastPinchPos = [ct[0], ct[1]];
                        pinchCenter  = [
                            (lastPinchPos[0].clientX + lastPinchPos[1].clientX) / 2,
                            (lastPinchPos[0].clientY + lastPinchPos[1].clientY) / 2
                        ];
                        pinchTarget  = document.elementFromPoint(pinchCenter[0], pinchCenter[1]);
                        return;
                    }
                    if (!globalTouchStart && touchstart.changedTouches.length === 1) {
                        globalTouchStart = touchstart.changedTouches[0];
                        if (!BrowserHelper.isAndroid) {
                            // On single touch start, set up a timer so that a longpress results in a
                            // synthesized contextmenu event being injected into the target element.
                            const
                                // This is what gets called if the user moves their touchpoint,
                                // or releases the touch before <longPressTime>ms is up
                                onMoveOrPointerUp = ({ clientX, clientY, type }) => {
                                    // globalTouchStart gets set to null on second touchstart, use that to abort the longpress
                                    if (longPressCancelEvents[type] || !globalTouchStart || Math.max(Math.abs(clientX - globalTouchStart.clientX), Math.abs(clientY - globalTouchStart.clientY)) > longpressMoveThreshold) {
                                        contextMenuTouchId = null;
                                        touchMoveRemover();
                                        clearTimeout(tapholdTimer);
                                    }
                                },
                                // Touchmove or touchend before that timer fires cancels the timer and removes these listeners.
                                touchMoveRemover = EventHelper.on({
                                    element     : document,
                                    touchmove   : onMoveOrPointerUp,
                                    touchend    : onMoveOrPointerUp,
                                    pointermove : onMoveOrPointerUp,
                                    pointerup   : onMoveOrPointerUp,
                                    capture     : true
                                }),
                                tapholdTimer = setTimeout(() => {
                                    // The global touchend listener prevents a touchend from proceeding
                                    // to a click if it was used to trigger contextmenu
                                    contextMenuTouchId = globalTouchStart.identifier;

                                    // Remove the gesture cancelling listeners
                                    touchMoveRemover();

                                    touchstart.target.dispatchEvent(new MouseEvent('contextmenu', EventHelper.copyEvent({}, touchstart)));
                                }, EventHelper.longPressTime);
                        }
                    }
                    else {
                        globalTouchStart = null;
                    }
                },
                touchmove : {
                    handler : (touchMove) =>  {
                        const { touches : ct } = touchMove;

                        // If we have two touchpoints, track the distance changes
                        // between the two points and fire CTRL/wheel events in
                        // at the initial center position with the dimension deltas.
                        if (ct.length === 2 && lastPinchPos) {
                            const
                                pinchPos = [ct[0], ct[1]],
                                delta    = EventHelper.getDistanceBetween(lastPinchPos[0], lastPinchPos[1]) - EventHelper.getDistanceBetween(pinchPos[0], pinchPos[1]),
                                deltaX   = Math.abs(lastPinchPos[0].clientX - lastPinchPos[1].clientX) - Math.abs(pinchPos[0].clientX - pinchPos[1].clientX),
                                deltaY   = Math.abs(lastPinchPos[0].clientY - lastPinchPos[1].clientY) - Math.abs(pinchPos[0].clientY - pinchPos[1].clientY);

                            if (Math.abs(delta) > 2) {
                                const
                                    pinch = {
                                        clientX : pinchCenter[0],
                                        clientY : pinchCenter[1],
                                        bubbles : true
                                    };

                                if (GlobalEvents.Widget.convertPinchToMousewheel) {
                                    touchMove.preventDefault();
                                    touchMove.stopImmediatePropagation();

                                    const e = new MouseEvent('wheel', { ...pinch, ctrlKey : true });
                                    e.deltaY = deltaY;
                                    e.deltaX = deltaX;
                                    pinchTarget.dispatchEvent(e);
                                }
                                const e = new MouseEvent('bryntum-pinch', pinch);
                                e.deltaY = deltaY;
                                e.deltaX = deltaX;
                                e.touchMove = touchMove;
                                pinchTarget.dispatchEvent(e);
                            }
                            lastPinchPos = pinchPos;
                        }
                    },
                    passive : false
                },
                // Just this one has to be passive: false so that we are allowed to preventDefault
                // if we are part of a contextmenu longpress emulation. Otherwise the gesture will
                // proceed to cause a mousedown event.
                touchend : {
                    handler : event => {
                        // Stop pinch-zoom tracking when touch count not two.
                        if (event.touches.length !== 2) {
                            lastPinchPos = null;
                        }
                        if (globalTouchStart) {
                            // If the touchstart was used to synthesize a contextmenu event
                            // stop the touch gesture processing right now.
                            // Also prevent the conversion of the touch into click.
                            if (event.changedTouches[0].identifier === contextMenuTouchId) {
                                event.stopImmediatePropagation();
                                if (event.cancelable !== false) {
                                    event.preventDefault();
                                }
                            }
                            else if (event.changedTouches.length === 1 && event.changedTouches[0].identifier === globalTouchStart.identifier) {
                                GlobalEvents.trigger('globaltap', { event });
                            }
                            globalTouchStart = null;
                        }
                    },
                    passive : false
                },
                mousedown : {
                    handler : event => {
                        lastInteractionType = 'mouse';
                        if (!globalTouchStart) {
                            GlobalEvents.trigger('globaltap', { event });
                        }
                        currentMouseDown = event;
                        // If no keydown is catched, and the mouse down has modifier key. Add a fake key event.
                        const hasModifierKey = event.ctrlKey || event.altKey || event.shiftKey || event.metaKey;
                        if (!currentKeyDown && hasModifierKey) {
                            currentKeyDown = new KeyboardEvent('keydown', {
                                key : event.ctrlKey ? 'Control'
                                    : (event.shiftKey ? 'Shift'
                                        : (event.altKey ? 'Alt' : 'Meta')),
                                ctrlKey  : event.ctrlKey,
                                altKey   : event.altKey,
                                shiftKey : event.shiftKey,
                                metaKey  : event.metaKey
                            });
                        }
                        else if (currentKeyDown && !hasModifierKey) {
                            currentKeyDown = null;
                        }
                    },
                    passive : false
                },
                mouseup() {
                    currentMouseDown = null;
                },
                pointerdown : {
                    passive : false,
                    handler : event => {
                        currentPointerDown = event;

                        // Remove keyboard flag if last user action used pointer
                        // Moved this from EventHelper, need to be once per root to support nested widgets
                        DomHelper.usingKeyboard = false;
                        element.classList?.remove('b-using-keyboard');
                        // if shadow root, remove from children (shadow root itself lacks a classList :( )
                        if (element.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                            DomHelper.removeClsGlobally(element, 'b-using-keyboard');
                        }
                    }
                },
                pointerup : {
                    passive : false,
                    handler : event => {
                        if (currentPointerDown?.pointerId === event.pointerId) {
                            currentPointerDown = null;
                        }
                    }
                },
                keydown(ev) {
                    const { key, target } = ev;

                    lastInteractionType = 'key';
                    currentKeyDown = ev;
                    currentOverElement = target;

                    // Flag root if last user action used keyboard, used for focus styling etc.
                    // Moved this from EventHelper, need to be once per root to support nested widgets
                    if (!ignoreModifierKeys[key]) {
                        DomHelper.usingKeyboard = true;

                        // ESC will hide any tooltip.
                        if (key === 'Escape') {
                            GlobalEvents.Widget.queryAll(w => w.isTooltip && w.isVisible).forEach(w => w.hide());
                        }

                        // if shadow root, add to outer children (shadow root itself lacks a classList :( )
                        if (element.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                            for (const node of element.children) {
                                if (node.matches('.b-outer')) {
                                    node.classList.add('b-using-keyboard');
                                }
                            }
                        }
                        else {
                            element.classList.add('b-using-keyboard');
                        }
                    }

                },
                mouseenter(ev) {
                    currentOverElement = ev.target;
                },
                keypress() {
                    lastInteractionType = 'key';
                },
                keyup() {
                    currentKeyDown = null;
                },
                focusin(focusin) {
                    const
                        { Widget } = GlobalEvents,
                        { target } = focusin;

                    // Ignore if focus is going into a shadow root
                    if (target?.shadowRoot || target?._shadowRoot) {
                        return;
                    }

                    // If accessibility mode has been avtivated, any available tooltip should be activated.
                    if (target && Widget.accessibility) {
                        const
                            // Attempt to target the inner element if it's there because Scheduler
                            // focuses the wrap, but the tooltip's forSelector is the inner .b-sch-event
                            inner  = target.firstElementChild || target,
                            rect   = Rectangle.from(target),
                            center = rect.center;

                        // Drill into the element that's at the center of the focused element if possible.
                        // The activation PointerEvent has a pointerType property of 'focus' which
                        // the event processing can use to detect that it is an "accessible" pointerover.
                        (DomHelper.childFromPoint(inner, rect.width / 2, rect.height / 2) || inner).dispatchEvent(new PointerEvent('pointerover', {
                            bubbles     : true,
                            clientX     : center.x,
                            clientY     : center.y,
                            pointerType : 'focus'
                        }));
                    }

                    // Firing the pointerOver event above may have consequences
                    if (focusEventsSuspended || (target && !target.isConnected)) {
                        return;
                    }

                    const
                        fromElement     = !focusin.relatedTarget
                            ? null
                            : (focusin.relatedTarget instanceof HTMLElement ? focusin.relatedTarget : document.body),
                        toElement       = target || document.body,
                        fromWidget      = Widget.fromElement(fromElement),
                        toWidget        = Widget.fromElement(toElement),
                        commonAncestor  = DomHelper.getCommonAncestor(fromWidget, toWidget),
                        // Flag if the fromElement is DOCUMENT_POSITION_FOLLOWING toElement
                        backwards       = !!(fromElement && (toElement.compareDocumentPosition(fromElement) & 4)),
                        topVisibleModal = Widget.query(isTopVisibleModal);

                    let currentFocus = null;

                    if (toElement && toElement !== document.body) {
                        currentFocus = DomHelper.getActiveElement(toElement);
                    }
                    else {
                        currentFocus = DomHelper.getActiveElement(document);
                    }

                    // If there is a topmost modal that is not actively reverting focus, and the focus is moving to
                    // somewhere *not* a descendant of that modal, and that somewhere is not in a floater that us
                    // *above* that modal (the compareDocumentPosition call), then we enforce modality and sweep focus
                    // back into the modal.
                    // By default, the Container class will yield the first focusable descendant widget's focusEl as its
                    // focusEl, so that will be out of the box behaviour for Popups.
                    if (topVisibleModal && !topVisibleModal._isRevertingFocus) {
                        if (!toWidget || (!topVisibleModal.owns(toWidget) && !(topVisibleModal.element.compareDocumentPosition(toWidget.element) & 4 && toWidget.up(isFloatingWidget)))) {
                            return topVisibleModal.focus();
                        }
                    }

                    let event = createWidgetEvent('focusout', fromElement, target, fromWidget, toWidget, backwards);

                    // Bubble focusout event up the "from" side of the tree
                    for (let targetWidget = fromWidget, owner; targetWidget && targetWidget !== commonAncestor; targetWidget = owner) {
                        // Capture before any focus out handling is done. It may be manipulated.
                        owner = targetWidget.owner;

                        if (!targetWidget.isDestroying && targetWidget.onFocusOut) {
                            targetWidget.onFocusOut(event);

                            // It is possible for focusout handlers to refocus themselves (editor's invalidAction='block'), so
                            // check if the focus is still where it was when we started unless we are in a document
                            // loss of focus situation (no target)
                            if (target && currentFocus !== DomHelper.getActiveElement(target)) {
                                // If the focus has moved, that movement would have kicked off a nested sequence of focusin/out
                                // notifications, so everyone has already been notified... no more to do here.
                                return;
                            }
                        }
                    }

                    // Focus is moving upwards to the ancestor widget.
                    // Its focus method might delegate focus to a focusable descendant.
                    if (commonAncestor && target === commonAncestor.element) {
                        // If one of the handlers above has not moved focus onwards
                        // and the common ancestor is a container which delegates
                        // focus inwards to a descendant, then give it the opportunity to do that.
                        if (!commonAncestor.isDestroying && DomHelper.getActiveElement(commonAncestor) === toElement && commonAncestor.focusElement && commonAncestor.focusElement !== commonAncestor.element) {
                            // If focus is not inside, move focus inside
                            if (!commonAncestor.element.contains(currentFocus) || commonAncestor.focusDescendant) {
                                // Wait until out of the focusin handler to move focus on.
                                commonAncestor.setTimeout(() => commonAncestor.focus?.(), 0);
                            }
                        }
                    }
                    // Focus is moving between two branches of a subtree.
                    // Bubble focusin event up the "to" side of the tree
                    else {
                        event = createWidgetEvent('focusin', toElement, fromElement, fromWidget, toWidget, backwards);
                        for (let targetWidget = toWidget; targetWidget && targetWidget !== commonAncestor; targetWidget = targetWidget.owner) {
                            if (!targetWidget.isDestroying) {
                                targetWidget.onFocusIn?.(event);
                            }
                        }
                    }

                    // Fire element focusmove event. Grid navigation will use  this when cells are focusable.
                    const commonAncestorEl = DomHelper.getCommonAncestor(fromElement?.nodeType === Element.ELEMENT_NODE ? fromElement : null, toElement) || toElement.parentNode;

                    // Common ancestor may be null is salesforce
                    // https://github.com/bryntum/support/issues/4865
                    if (commonAncestorEl) {
                        event = createWidgetEvent('focusmove', toElement, fromElement, fromWidget, toWidget, backwards, { bubbles : true });
                        commonAncestorEl.dispatchEvent(event);
                    }
                },
                focusout(focusout) {
                    if (focusEventsSuspended) {
                        return;
                    }

                    if (!focusout.relatedTarget || !GlobalEvents.Widget.fromElement(focusout.relatedTarget)) {
                        // When switching between tabs in Salesforce app `relatedTarget` of the focusout event might be not an instance of
                        // HTMLElement.
                        const target = focusout.relatedTarget && focusout.relatedTarget instanceof HTMLElement ? focusout.relatedTarget : null;

                        listeners.focusin({
                            target,
                            relatedTarget : focusout.target
                        });

                        currentKeyDown = currentMouseDown = null;
                    }
                },
                // This will clear keydown and mousedown status on window blur
                blur : {
                    element : globalThis,
                    handler(event) {
                        if (event.target === globalThis) {
                            currentKeyDown = null;
                            currentMouseDown = null;
                        }
                    }
                },
                capture : true,
                passive : true
            };

            // detach previous listeners
            detach && detacher?.();

            detacher = this.detachEvents = element.$globalEventsDetacher = EventHelper.on(listeners);
        }

        get lastInteractionType() {
            return lastInteractionType;
        }

        get shiftKeyDown() {
            return currentKeyDown?.shiftKey;
        }

        get ctrlKeyDown() {
            return currentKeyDown?.ctrlKey || currentKeyDown?.metaKey;
        }

        get altKeyDown() {
            return currentKeyDown?.altKey;
        }

        get currentOverElement() {
            return currentOverElement;
        }

        isKeyDown(key) {
            return !key ? Boolean(currentKeyDown) : (currentKeyDown?.key === key || currentKeyDown[key?.toLowerCase() + 'Key'] === true);
        }

        isMouseDown(button = 0) {
            return currentMouseDown?.button === button;
        }

        get currentMouseDown() {
            return currentMouseDown;
        }

        get currentPointerDown() {
            return currentPointerDown;
        }

        get currentTouch() {
            return globalTouchStart;
        }

        get currentKeyDown() {
            return currentKeyDown;
        }

    })(),
    isTopVisibleModal = w => w.isVisible && w.isTopModal;

GlobalEvents.observedElements = new Set();

/**
 * Fired after the theme is changed
 * @event theme
 * @param {Core.GlobalEvents} source
 * @typings source -> {typeof GlobalEvents}
 * @param {String} theme The new theme name
 */

let globalTouchStart,
    contextMenuTouchId,
    focusEventsSuspended = false,
    lastInteractionType,
    currentKeyDown,
    currentMouseDown,
    currentPointerDown,
    currentOverElement,
    detacher;

function createWidgetEvent(eventName, target, relatedTarget, fromWidget, toWidget, backwards, options) {
    const result = new CustomEvent(eventName, options);

    // Workaround for Salesforce. They use strict mode and define non-configurable property `target`. We use this
    // CustomEvent as a synthetic one, feels fine to use non-standard handle for target.
    Object.defineProperty(result, '_target', {
        get() {
            return target;
        }
    });
    Object.defineProperty(result, 'relatedTarget', {
        get() {
            return relatedTarget;
        }
    });
    result.fromWidget = fromWidget;
    result.toWidget = toWidget;
    result.backwards = backwards;

    return result;
}

/**
 * A singleton firing global application level events like 'theme'.
 *
 * ```javascript
 * GlobalEvents.on({
 *    theme() {
 *        // react to theme changes here
 *    }
 * });
 * ```
 *
 * @class
 * @singleton
 * @mixes Core/mixin/Events
 */
export default GlobalEvents;
