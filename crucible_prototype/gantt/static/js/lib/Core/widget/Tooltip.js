import Widget from './Widget.js';
import Popup from './Popup.js';
import { Point } from '../helper/util/Rectangle.js';
import EventHelper from '../helper/EventHelper.js';
import Objects from '../helper/util/Objects.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import StringHelper from '../helper/StringHelper.js';
import DomHelper from '../helper/DomHelper.js';

const
    realignTransitions = {
        left      : true,
        right     : true,
        top       : true,
        bottom    : true,
        transform : true
    },
    isBoolean          = {
        true  : 1,
        false : 1
    },
    immediatePromise   = Promise.resolve();

/**
 * @module Core/widget/Tooltip
 */

/**
 * A simple Tooltip class that offers a flexible way to show a popover when hovering or clicking elements. The easiest
 * way of assigning a tooltip to a widget is by setting {@link Core.widget.Widget#config-tooltip}, see example below.
 *
 * ```javascript
 * new Button({
 *     text    : 'Hover me',
 *     tooltip : 'Click me and you won\'t believe what happens next'
 * });
 * ```
 *
 * By default, tooltips of widgets use a singleton Tooltip instance which may be accessed from the
 * `{@link Core.widget.Widget}` class under the name `Widget.tooltip`.
 * This is configured according to the config object on pointer over.
 *
 * To request a separate instance be created just for this widget, add `newInstance : true`
 * to the configuration:
 *
 * ```javascript
 * new Button {
 *     text    : 'Hover me',
 *     tooltip : {
 *         html        : 'Click me and you won\'t believe what happens next',
 *         newInstance : true
 *     }
 * });
 * ```
 *
 * You can ask for the singleton instance to display configured tips for your own DOM structure using
 * `data-btip` element attributes:
 *
 * ```html
 * <button class="my-button" data-btip="Contextual help for my button" data-btip-scroll-action="realign">Hover me</button>
 * ```
 *
 * ## Showing async content
 * To load remote content into a simple tooltip, just load your data in the `beforeShow` listener (but ensure that the {@link #property-activeTarget} is the same when the data arrives)
 *
 * ```javascript
 * new Tooltip({
 *     listeners : {
 *         beforeShow : ({ source : tip }) => tip.html = AjaxHelper.get('someurl').then(response => response.text());
 *     }
 * });
 * ```
 *
 * If you have multiple targets that should show a tooltip when hovered over, look at {@link #config-forSelector} and {@link #config-getHtml}.
 *
 * ```javascript
 * new Tooltip({
 *     forSelector : '.myCssClass',
 *     getHtml     : ({ source : tip }) => AjaxHelper.fetch('data').then(response => response.text())
 * });
 * ```
 *
 * {@inlineexample Core/widget/Tooltip.js}
 *
 * @extends Core/widget/Popup
 * @classtype tooltip
 */
export default class Tooltip extends Popup {
    //region Default config

    static $name = 'Tooltip';

    static type = 'tooltip';

    /**
     * Triggered before tooltip widget is shown. Return `false` to prevent the action.
     * @preventable
     * @async
     * @event beforeShow
     * @param {Core.widget.Tooltip} source The Tooltip
     * @param {Event} source.triggeredByEvent The event that triggered this Tooltip to show.
     */

    static get configurable() {
        return {
            /**
             * By default, a Tooltip is transient, and will {@link #function-hide} when the mouse exits the target
             * element. Configure as `false` to make a Tooltip non-transient.
             * @config {Boolean}
             * @default
             */
            autoHide : true,

            /**
             * By default, a Tooltip is transient, and will {@link #function-hide} when the user clicks or
             * taps outside its widget. Configure as `false` to make a Tooltip non-transient when user clicks outside it.
             *
             * If you would like the Tooltip to stay visible when mouse leaves the Tooltip target, please see
             * {#config-autoHide}.
             *
             * @config {Boolean} autoClose
             * @default true
             */

            /**
             * Horizontal offset from mouse when {@link #config-anchorToTarget} is `false`.
             *
             * Direction independent, the value is internally flipped (by multiplying it with -1) for RTL.
             *
             * @config {Number}
             * @default
             */
            mouseOffsetX : 15,

            /**
             * Vertical offset from mouse when {@link #config-anchorToTarget} is `false`
             * @config {Number}
             * @default
             */
            mouseOffsetY : 15,

            html : {
                // Ensure the html setter can never veto the operation as a no-change.
                // Because of beforeShow listeners augmenting the content.
                $config : {
                    equals : () => false
                }
            },

            /**
             * A method, or the *name* of a method called to update the tooltip's content when the
             * cursor is moved over a target. It receives one argument containing context about the
             * tooltip and show operation. The function should return a string, or a Promise yielding
             * a string.
             *
             * ```javascript
             * new Grid({
             *     title    : 'Client list',
             *     appendTo : myElement,
             *     store    : myStore,
             *     columns  : myColumns,
             *     tbar     : {
             *         items : {
             *             text : 'Reload,
             *             tooltip : {
             *                 // Will look in ownership hierarchy for the method
             *                 // which will be found on the grid.
             *                 getHtml : 'up.getReloadButtonTip'
             *             }
             *         }
             *     },
             *     getReloadButtonTip() {
             *         return `Reload ${this.title}`;
             *     }
             * });
             * ```
             *
             * @config {Function|String}
             * @param {Object} context
             * @param {Core.widget.Tooltip} context.tip The tooltip instance
             * @param {HTMLElement} context.element The Element for which the Tooltip is monitoring mouse movement
             * @param {HTMLElement} context.activeTarget The target element that triggered the show
             * @param {Event} context.event The raw DOM event
             * @returns {String|Promise}
             */
            getHtml : null,

            /**
             * DOM element to attach tooltip to. By default, the mouse entering this element will kick off a timer
             * (see {@link #config-hoverDelay}) to show itself.
             *
             * If the {@link #config-forSelector} is specified, then mouse entering matching elements within the `forElement`
             * will trigger the show timer to start.
             *
             * Note that when moving from matching element to matching element within the `forElement`, the tooltip
             * will remain visible for {@link #config-hideDelay} milliseconds after exiting one element, so that rapidly
             * entering another matching element will not cause hide+show flicker. To prevent this behaviour configure
             * with `hideDelay: 0`.
             * @config {HTMLElement}
             */
            forElement : null,

            /**
             * By default, once a tooltip is shown aligned as requested, it stays put.
             *
             * Setting this to `true` causes the tooltip to be aligned by the mouse,
             * offset by `[{@link #config-mouseOffsetX}, {@link #config-mouseOffsetY}]` and
             * keeps the tooltip aligned to the mouse maintaining the configured offsets
             * as the mouse moves within its activating element.
             * @config {Boolean}
             * @default false
             */
            trackMouse : null,

            /**
             * By default, a tooltip displays static content. In the Scheduler however, there are
             * plenty of uses cases when the tip content is based on the current mouse position (dragging events, resizing events, schedule hover tip, drag creation of events etc). Set
             * to `true` to update contents on mouse movement.
             * @config {Boolean}
             * @private
             * @default
             */
            updateContentOnMouseMove : false,

            /**
             * A CSS selector which targets child elements of the {@link #config-forElement} that should produce a
             * tooltip when hovered over.
             * @config {String}
             */
            forSelector : null,

            /**
             * By default, when moving rapidly from target to target, if, when mouseovering
             * a new target, the tip is still visible, the tooltip does not hide, it remains
             * visible, but updates its content however it is configured to do so.
             *
             * Configure `hideOnDelegateChange : true` to have the tip hide, and then trigger
             * a new show delay upon entry of a new target while still visible.
             * @config {Boolean}
             * @default false
             */
            hideOnDelegateChange : null,

            /**
             * Set to true to anchor tooltip to the triggering target. If set to `false`, the tooltip
             * will align to the mouse position. When set to `false`, it will also set `anchor: false`
             * to hide anchor arrow.
             * @config {Boolean}
             * @default
             */
            anchorToTarget : true,

            /**
             * Show on hover
             * @config {Boolean}
             * @default false
             */
            showOnHover : null,

            /**
             * The amount of time to hover before showing
             * @prp {Number}
             * @default
             */
            hoverDelay : 500,

            /**
             * Show immediately when created
             * @config {Boolean}
             * @default
             */
            autoShow : false,

            /**
             * The time (in milliseconds) that the Tooltip should stay visible for when it shows over its
             * target. If the tooltip is anchored to its target, then moving the mouse during this time
             * resets the timer so that the tooltip will remain visible.
             *
             * Defaults to `0` which means the Tooltip will persist until the mouse leaves the target.
             * @config {Number}
             * @default
             */
            dismissDelay : 0,

            /**
             * The time (in milliseconds) for which the Tooltip remains visible when the mouse leaves the target.
             *
             * May be configured as `false` to persist visible after the mouse exits the target element. Configure it
             * as 0 to always retrigger `hoverDelay` even when moving mouse inside `fromElement`
             * @config {Number|Boolean}
             * @default
             */
            hideDelay : 500,

            /**
             * The message to show while an async tooltip is fetching its content.
             * @config {String}
             * @default
             */
            loadingMsg : 'Loading...',

            /**
             * Keep the tooltip open if user moves the mouse over it.
             *
             * If this is *not* explicitly configured as `false`, then this is automatically set
             * when there are any visible, interactive child items added such as {@link #config-tools}, or
             * {@link #config-items} which are interactive such as buttons or input fields.
             * @config {Boolean}
             * @default false
             */
            allowOver : null,

            anchor : true,

            align : {
                align : 'b-t',

                // This signals to the align code that this widget is prepared to shrink
                // in height in order to comply with alignTo specifications.
                // Without a minHeight, it is assumed that the height of the widget
                // is inviolable.
                minHeight : 300
            },

            axisLock : true,

            /**
             * The HTML element that triggered this Tooltip to show
             * @readonly
             * @member {HTMLElement} activeTarget
             */
            activeTarget : {
                $config : {
                    // Any nullish is equal, so setting to null when undefined is no-change
                    equal : (t1, t2) => (t1 == null && t2 == null) || t1 === t2
                },
                value : null
            },

            testConfig : {
                hideDelay     : 100,
                hoverDelay    : 100,
                showAnimation : null,
                hideAnimation : null
            },

            role : 'tooltip',

            // Private for accessibility. If the activeTarget contains the current activeElement, the
            // describedElement is set to that activeElement while that activeTarget remains active.
            // This is so that it can have the aria-describedby property set to reference this tooltip.
            describedElement : null
        };
    }

    //endregion

    //region Events

    /**
     * Triggered when a mouseover event is detected on a potential target element.
     * Return false to prevent the action
     * @event pointerOver
     * @param {Core.widget.Tooltip} sourceThe tooltip instance.
     * @param {Event} event The mouseover event.
     * @preventable
     */

    //endregion

    //region Properties

    //endregion

    //region Init & destroy

    afterConfigure() {
        const
            me              = this,
            { forSelector } = me;

        if (forSelector) {
            me.showOnHover = me.showOnHover !== false;
            if (!me.forElement) {
                if (!me.anchorToTarget) {
                    me.trackMouse = true;
                }
                me.forElement = me.rootElement.host || me.rootElement;
            }
        }

        super.afterConfigure();

        // There's a triggering element, and we're showing on hover, add the mouse listeners
        if (me.forElement && me.showOnHover) {
            me.pointerOverOutDetacher = EventHelper.on({
                element     : me.forElement,
                // Using pointerover/pointerout since mouseover events are not fired in Chrome when the native `disabled`
                // attribute is present https://github.com/bryntum/support/issues/3179
                pointerover : 'internalOnPointerOver',
                pointerout  : 'internalOnPointerOut',
                thisObj     : me
            });
        }
    }

    doDestroy() {
        this.pointerOverOutDetacher?.();

        super.doDestroy();
    }

    set focusOnToFront(focusOnToFront) {
        super.focusOnToFront = focusOnToFront;
    }

    get focusOnToFront() {
        // We must not get focus if our tiggering event was a focus.
        // It would bounce between them as the blur of the triggering element would hide this tip.
        // Transient things like tooltips should not focus when invoked by pointer events
        return this.triggeredByEvent?.pointerType === 'focus' ? false : super.focusOnToFront && DomHelper.usingKeyboard;
    }

    get focusElement() {
        const result = super.focusElement;

        if (result !== this.element) {
            return result;
        }
    }

    get anchorToTarget() {
        // We do not anchor to the target if we are tracking the mouse
        return this._anchorToTarget && !this.trackMouse;
    }

    get anchor() {
        // We do not anchor to the target if we are tracking the mouse
        return super.anchor && !this.trackMouse;
    }

    set anchor(anchor) {
        super.anchor = anchor;
    }
    //endregion

    //region Hovering, show and hide

    onDocumentMouseDown({ event }) {
        const
            me                   = this,
            { triggeredByEvent } = me;

        // If it's a tap that is caused by the touch that was converted into a mouseover we should not hide.
        // That is if it's a touch and at the same place and within 500ms
        if (triggeredByEvent && DomHelper.isTouchEvent) {
            if (event.pageX === triggeredByEvent.pageX && event.pageY === triggeredByEvent.pageY && me.activeTarget.contains(event.target) && (performance.now() - triggeredByEvent.timeStamp < 500)) {
                return;
            }
        }

        me.abortDelayedShow();

        super.onDocumentMouseDown({ event });
    }

    internalOnPointerOver(event) {
        const
            me                                        = this,
            { target, relatedTarget }                 = event,
            { forElement, forSelector, activeTarget } = me;

        let newTarget;

        // Respect our owner's wish to not show when it's disabled
        if (me.disabled || (me.owner && !me.owner.showTooltipWhenDisabled && me.owner.disabled)) {
            return;
        }

        // If the mouse moves over this tooltip, it is theoretically a mouseout of its
        // forElement, but allowOver lets us tolerate this ane remain visible.
        if (me.allowOver && me.element.contains(target)) {
            return;
        }

        // There's been a mouseover. If we have a forSelector, we have to check
        // if it's an enter of a matching child
        if (forSelector) {
            const autoTipElement = event.target.closest('[data-btip]');

            // If we're over a child with its own intrinsic tooltip, we must not show
            // and if we're visible, we must hide.
            if (autoTipElement && !autoTipElement.matches(forSelector)) {
                if (activeTarget) {
                    me.handleForElementOut();
                }
                return;
            };

            newTarget = me.filterTarget(target);

            // Bail out if moving inside a forSelector matching element, unless nested element matching the selector
            if (activeTarget?.contains(target) && activeTarget.contains(relatedTarget) && newTarget === activeTarget) {
                return;
            }

            // Mouseovers while within a target do nothing.
            // Unless the target we are leaving had intrinsic tooltip - in this case it's an activate event.
            if (newTarget && relatedTarget?.closest(forSelector) === newTarget && !relatedTarget.dataset.btip) {
                return;
            }
        }
        // There's no forSelector, so check if we moved from outside the target
        else if (!forElement.contains(relatedTarget)) {
            newTarget = forElement;
        }
        // Mouseover caused by moving from child to child inside the target
        else {
            return;
        }

        // If pointer entered the target or a forSelector child, then show.
        if (newTarget) {
            me.handleForElementOver(event, newTarget);
        }
        // If over a non-forSelector child, behave as in forElement out
        else if (activeTarget) {
            me.handleForElementOut();
        }
    }

    filterTarget(element) {
        return element.closest(this.forSelector);
    }

    // Handle a transitioned reposition when the activeTarget moved beneath the pointer.
    // When it comes to an end, if the mouseout has not hidden, then realign at the new position
    // if the activeTarget is still beneath the pointer.
    realignOnTransitionEnd(event) {
        const
            me                     = this,
            { currentOverElement } = Tooltip;

        if (realignTransitions[event.propertyName]) {
            // Don't realign if the mouse is over this, and is allowed to be over this
            // If user is interacting with this Tooltip, they won't expect it to move.
            if (me.allowOver && me.element.contains(currentOverElement)) {
                return;
            }

            // If we are still visible, and mouse is still over the activeTarget, realign
            if (me.activeTarget?.contains(currentOverElement) && !me.trackMouse) {
                me.realign();
            }
        }
    }

    async handleForElementOver(event, newTarget) {
        const
            me          = this,
            {
                activeTarget,
                hideOnDelegateChange,
                anchorToTarget
            }           = me,
            isNewTarget = newTarget !== activeTarget,
            needsHide   = isNewTarget && hideOnDelegateChange;

        // Vetoed, then behave as if a targetout
        if (me.trigger('pointerOver', { event, target : newTarget }) === false) {
            me.internalOnPointerOut(event);
        }
        else {
            me.triggeredByEvent = event;

            // Not actually hidden yet - mouse moved back over a target before the timer hid us.
            if (me.hasTimeout('hide')) {
                me.abortDelayedHide();

                // It's back into the same target so basically nothing has happened.
                if (!isNewTarget) {
                    return;
                }
            }

            // Abort any in-flight animated hide.
            // This is needed when entering a new delegate immeditely from a previous delegate
            // or when allowOver is false (which is the default), and mouseovering
            // hides, but that immediately causes the mouse to be over another delegate.
            // We need to abort the animation.
            // This brings us back into full visibility.
            if (!hideOnDelegateChange && me.element.classList.contains('b-hiding')) {
                me.cancelHideShowAnimation();
            }

            // If we have changed targets and we have to hide on delegate change.
            if (!me._hidden && needsHide) {
                me.hide(false);
            }

            // This can happen when targets contain targets.
            // For example nested events. Mousover the outer event sets the activeTarget and starts a show timer.
            // If then the mouse moves over a nested event, the code will arrive here with a new activeTarget
            // and delayShow will not respond if there's already a show timer counting down.
            if (me.activeTarget && me.hasTimeout('show')) {
                me.clearTimeout('show');
            }
            me.activeTarget = newTarget;

            // We are visible. This could be if we made an immediate delegate change and the
            // hide timer has not yet fired and we don't have hide on delegate change, or
            // the target has not in fact changed.
            // In this case, we need to ensure the content is corrected before beforeShow
            // is triggered which is how user code augments content
            if (me.isVisible) {
                // We have not hidden between targets, but the target is different, so
                // invalidate the lastAlignSpec.
                me.lastAlignSpec = null;

                const result = me.updateContent();

                // Edge case, we have no loadingMsg meaning we're not visible until content has arrived
                if (Objects.isPromise(result) && !me.loadingMsg) {
                    await result;
                }

                // Allow user code to augment in a beforeShow listener even if we have not actually hidden.
                if (me.trigger('beforeShow') === false) {
                    return me.hide();
                }
                me.alignTo({
                    [anchorToTarget ? 'target' : 'position'] : anchorToTarget ? newTarget : 'mouse',
                    overlap                                  : !(anchorToTarget && me.anchor)
                });

                me.trigger('show');
                me.afterShowByTarget();
            }
            // We are not visible. Either we have never been shown, or the hide timeout
            // fired, and hid us, or we aborted a hideAnimation and cleaned up to the final state,
            // or we had to hide on delegate change.
            else {
                // The activeTarget can be cleared by an overTarget listener
                // so ensure that it's still set.
                me.activeTarget = newTarget;
                me.delayShow(newTarget);
            }
        }
    }

    async delayShow(target) {
        const me = this;

        // Caught in a show animation - cancel it,
        // If we're fading away, that's fine.
        if (me.currentAnimation?.showing) {
            me.cancelHideShowAnimation();
        }

        if (!me.isVisible && !me.hasTimeout('show')) {
            // Allow hoverDelay:0 or rapid movement from delegate to delegate to show immediately
            if (!me.hoverDelay || (me.forSelector && Date.now() - me.lastHidden < me.quickShowInterval)) {
                const result = me.updateContent();

                // Edge case, we have no loadingMsg meaning we're not visible until content has arrived
                if (Objects.isPromise(result) && !me.loadingMsg) {
                    await result;
                }

                me.showByTarget(target);
            }
            else {
                // If a mouse down happens during the delay period, we cancel the show
                me.addDocumentMouseDownListener();

                // If we're not going to anchor to the hovered element, then we need to keep track
                // of mousemoves until the show happens so we can show where the mouse currently is.
                if (!me.listeningForMouseMove && !me.anchorToTarget) {
                    me.mouseMoveRemover = EventHelper.on({
                        element   : me.rootElement,
                        mousemove : 'onMouseMove',
                        thisObj   : me
                    });
                }
                // If a tap event triggered, do not wait. Show immediately.
                me.setTimeout(async() => {
                    if (me.activeTarget === target && target.isConnected) {
                        const result = me.updateContent();

                        // Edge case, we have no loadingMsg meaning we're not visible until content has arrived
                        if (Objects.isPromise(result) && !me.loadingMsg) {
                            await result;
                        }

                        me.showByTarget(target);
                    }
                }, (!me.triggeredByEvent || me.triggeredByEvent.type === 'pointerover') ? me.hoverDelay : 0, 'show', true);
            }
        }
        else if (me.isVisible) {
            me.showByTarget(target);
        }
    }

    changeAllowOver(allowOver) {
        // Only cache it when configured from outside, not when temporarily set upon show.
        if (!this.inAfterShow) {
            this.configuredAllowOver = allowOver;
        }
        return allowOver;
    }

    updateAllowOver(allowOver) {
        const
            me          = this,
            { element } = me;

        element.classList.toggle('b-allow-over', Boolean(allowOver));

        if (allowOver) {
            me.allowOverlisteners = EventHelper.on({
                element,
                mouseenter : 'onOwnElementMouseEnter',
                mouseleave : 'internalOnPointerOut',
                thisObj    : me
            });
        }
        else {
            me.allowOverlisteners?.();
        }
    }

    updateContent() {
        const me = this;

        if (me.getHtml) {
            const result = me.callback(me.getHtml, me, [{
                tip          : me,
                element      : me.element,
                activeTarget : me.activeTarget,
                event        : me.triggeredByEvent
            }]);
            me.html      = result;

            return result;
        }
    }

    // There are 3 possible scenarios:
    // - Static content
    // - Remote content being loaded (meaning we (possibly) set a loading message as the `html`
    // - Tooltip acts as a Container
    get hasContent() {
        return Boolean(DomHelper.isReactElement(this._html) || (this._html !== '' && (typeof this.html === 'string' && this.html.length) || this.items.length));
    }

    internalBeforeShow() {
        // In case we update content on mouse move, need to show empty tooltip first
        return (this.updateContentOnMouseMove || this.hasContent) && !this.disabled;
    }

    /**
     * Shows a spinner and a message to indicate an async flow is ongoing
     * @param {String} message The message, defaults to {@link #config-loadingMsg}
     */
    showAsyncMessage(message = this.optionalL(this.loadingMsg)) {

        if (message) {
            this.html = `
                <div class="b-tooltip-loading">
                    <i class="b-icon b-icon-spinner"></i>
                    ${StringHelper.encodeHtml(message)}
                </div>
            `;
        }
    }

    showByTarget(target) {
        const
            me                 = this,
            { anchorToTarget } = me;

        me.mouseMoveRemover = me.mouseMoveRemover?.();

        // Show by the correct thing.
        // If we are not anchored to the target, then it's the current pointer event, handled in beforeAlignTo() above.
        // Otherwise it's the activeTarget.
        me.showBy({
            [anchorToTarget ? 'target' : 'position'] : anchorToTarget ? target : 'mouse',
            overlap                                  : !(anchorToTarget && me.anchor)
        });
    }

    afterShowByTarget() {
        const
            me               = this,
            { dismissDelay } = me;

        me.abortDelayedShow();
        if (dismissDelay) {
            me.setTimeout('hide', dismissDelay);
        }

        // Bring the element to front if it's not detached
        if (me.element.parentNode) {
            me.toFront();
        }

        // If we've shown, and are tracking the mouse and not anchored to (aligned to) the target, track the mouse
        if (!me.mouseMoveRemover && (me.trackMouse || me.updateContentOnMouseMove)) {
            me.mouseMoveRemover = EventHelper.on({
                element     : me.rootElement,
                pointermove : 'onMouseMove',
                thisObj     : me
            });
        }

        // Set allowOver to true if there are things that the user is able to interact with.
        // Unless it is explicitly configured as false
        me.inAfterShow = true;
        me.allowOver   = me.allowOver || (me.configuredAllowOver != false && me.childItems.some(w => w.isVisible && !w.disabled && w.focusElement));
        me.inAfterShow = false;
    }

    updateActiveTarget(newTarget, lastTarget) {
        const
            me            = this,
            activeElement = DomHelper.getActiveElement(newTarget);

        if (newTarget) {
            if (!me.isConfiguring) {
                me.trigger('overTarget', { newTarget, lastTarget });
            }

            // If the target which we are active for contains the currently active element
            // then that is the element this tooltip is describing,
            me.describedElement = newTarget.contains(activeElement) ? activeElement : null;
        }
        else {
            me.trigger('targetOut', { lastTarget });
            me.describedElement = null;
        }
    }

    updateDescribedElement(describedElement, oldDescribedElement) {
        if (describedElement) {
            // This tooltip describes that element while active.
            DomHelper.addAttributeValue(describedElement, 'aria-describedby', this.id);
        }
        if (oldDescribedElement) {
            DomHelper.removeAttributeValue(oldDescribedElement, 'aria-describedby', this.id);
        }
    }

    internalOnPointerOut(event) {
        const
            me        = this,
            toElement = event.relatedTarget;

        // Edge case: If there is no space to fit the tooltip, and as a result of showing the tooltip - the mouse is over the tooltip
        // Make sure we don't end up in an infinite hide/show loop
        if (me.allowOver && me.element.contains(toElement)) {
            return;
        }

        // If we were in an allowOver situation and exited
        // into the activeTarget, do nothing; in this situation
        // the tip is treated as if it were part of the target.
        if (me.element.contains(event.target) && me.activeTarget?.contains(toElement)) {
            return;
        }

        // We have exited the active target
        if (me.activeTarget && !me.activeTarget.contains(toElement)) {
            me.handleForElementOut();
        }
    }

    handleForElementOut() {
        // Separated from onTargetOut so that subclasses can handle target out in any way.
        const
            me            = this,
            { hideDelay } = me;

        // Allow outside world to veto the hide
        if (me.trigger('pointerOut') === false) {
            me.activeTarget = null;
            return true;
        }

        me.abortDelayedShow();

        // Even if there is a hide timer, it's a *dismiss* timer which hides the tip
        // after a hover time. We begin a new delay on target out.
        if (me.isVisible && hideDelay !== false) {
            me.abortDelayedHide();
            if (hideDelay > 0) {
                me.setTimeout('hide', hideDelay);
            }
            else {
                // Hide immediately when configured with `hideDelay: 0`. Used by async cell tooltips that always should
                // retrigger `hoverDelay`, to not spam the backend
                me.hide();
            }
        }
    }

    show(spec) {
        const me = this;

        // If we know what element to show it by, and we are anchoring to it
        // and there's no ambiguity with a selector for sub elements,
        // then show it by our forElement (Unless we're being called from showBy)
        if (!spec && me.forElement && me.anchorToTarget && !me.forSelector) {
            me.showByTarget(me.forElement);
        }
        // All we can do is the basic Widget show.
        else {
            super.show(...arguments);
        }

        // Show may be been vetoed
        if (me.isVisible) {
            me.afterShowByTarget();
        }
        // The show has been vetoed - we no longer have an active target
        else {
            me.activeTarget = null;
        }
    }

    get hoverDelay() {
        // Show must be immediate if the over event was a converted focus event
        return this.triggeredByEvent?.pointerType === 'focus' ? 0 : this._hoverDelay;
    }

    get hideDelay() {
        // Hide must be immediate if the over event was a converted focus event
        return this.triggeredByEvent?.pointerType === 'focus' ? 0 : this.autoHide ? this._hideDelay : false;
    }

    hide() {
        const me = this;
        // If we are asked to hide, we must always abort any impending show.
        me.abortDelayedShow();

        // But if we are not hidden, go ahead and hide
        if (!me._hidden) {
            me.abortDelayedHide();

            const result = super.hide(...arguments);

            me.lastHidden   = Date.now();
            me.activeTarget = null;

            me.mouseMoveRemover?.();
            me.mouseMoveRemover = null;

            me.transitionEndDetacher?.();
            me.transitionEndDetacher = null;

            return result;
        }
        else {
            return immediatePromise;
        }
    }

    abortDelayedShow() {
        const me = this;
        if (me.hasTimeout('show')) {
            // This listener is added in delayShow to make a mousedown abort,
            // So we must remove it here because it's only removed in onHide.
            me.mouseDownRemover?.();
            me.mouseDownRemover = null;

            me.clearTimeout('show');

            me.mouseMoveRemover?.();
            me.mouseMoveRemover = null;

            me.transitionEndDetacher?.();
            me.transitionEndDetacher = null;
        }
    }

    /**
     * Stops both timers which may hide this tooltip, the one which counts down from mouseout
     * and the one which counts down from mouseover show for dismissDelay ms
     * @private
     */
    abortDelayedHide() {
        this.clearTimeout('hide');
    }

    realign() {
        const
            me   = this,
            spec = me.lastAlignSpec;

        // If we are hidden because our align target scrolled, or otherwise
        // moved out of its clipping boundaries, then check if it's moved back in.
        // For example EventDrag might move the element outside of the scheduler
        // SubGrid, which will cause the tip to hide, but then moving it back in
        // must reshow it.
        if (!me.isConfiguring && !me.isVisible && spec?.targetOutOfView) {
            // If there is an intersecting Rectangle with the forElement, align
            if (spec.allowTargetOut || DomHelper.isInView(spec.target, false, me)) {
                me.show();
                spec.targetOutOfView = false;
            }
        }

        super.realign();
    }

    alignTo(spec) {
        const
            me           = this,
            mouseOffsetX = (me.mouseOffsetX || 1) * (me.rtl ? -1 : 1),
            mouseOffsetY = me.mouseOffsetY || 1,
            xMargin      = Math.max(Math.min(mouseOffsetX, 5), 0),
            yMargin      = Math.max(Math.min(mouseOffsetY, 5), 0);

        if (!me.isVisible) {
            return;
        }

        let mousePosition;

        if (!me.anchorToTarget && spec.position === 'mouse') {
            mousePosition = new Point(
                me.triggeredByEvent.pageX - globalThis.scrollX,
                me.triggeredByEvent.pageY - globalThis.scrollY
            );
            spec.position = new Point(
                mousePosition.x + (mouseOffsetX || 1) - (mouseOffsetX < 0 ? me.width : 0),
                mousePosition.y + (mouseOffsetY || 1) - (mouseOffsetY < 0 ? me.height : 0)
            );
        }

        // If mouse pointer is over this, do not attempt
        // to call the getHtml method.
        if (spec && !(me.triggeredByEvent && me.element.contains(me.triggeredByEvent.target))) {

            if (spec.nodeType === Node.ELEMENT_NODE) {
                spec = {
                    target : spec
                };
            }
        }

        super.alignTo(spec);

        // If the mouse comes within 5 or mouseOffset(X|Y) pixels of our result position, flip the mouseOffsets to the opposite sides
        if (mousePosition && me.lastAlignSpec.result.inflate(yMargin, xMargin).contains(mousePosition)) {
            me.lastAlignSpec.position = 'mouse';
            me.mouseOffsetY           = -mouseOffsetY;
            me.mouseOffsetX           = -mouseOffsetX;
            me.realign();
            me.mouseOffsetY = mouseOffsetY;
            me.mouseOffsetX = mouseOffsetX;
        }
    }

    //endregion

    //region Tooltip contents

    /**
     * Get/set the HTML to display. When specifying HTML, this widget's element will also have `b-html` added to its
     * classList, to allow targeted styling. To create async tooltip and show the {@link #config-loadingMsg}, see code below:
     * For example:
     *
     * ```javascript
     * new Tooltip({
     *     listeners : {
     *         beforeShow : ({ source : tip }) => {
     *             tip.showAsyncMessage();
     *             AjaxHelper.get('someurl').then(response => tip.html = 'Done!');
     *         }
     *     }
     * });
     * ```
     *
     * @member {String} html
     * @category DOM
     */
    set html(html) {
        super.html = html;

        // Realign here in setter rather than updater because this might be called with no change.
        if (this.isVisible) {
            this.realign();
        }
    }

    get html() {
        return super.html;
    }

    changeHtml(htmlOrPromise) {
        const me = this;

        if (Objects.isPromise(htmlOrPromise)) {
            me.showAsyncMessage();
            htmlOrPromise.target = me.activeTarget;

            htmlOrPromise.then(html => {
                // Cursor might have exited the element while loading
                if (htmlOrPromise.target === me.activeTarget) {
                    me.html = html;
                }
            });

            return;
        }

        // Allow objects to pass through, to be used with DomSync
        if (typeof htmlOrPromise !== 'object') {
            // Stringify in case a number was passed in
            htmlOrPromise = htmlOrPromise != null ? me.optionalL(String(htmlOrPromise)) : '';
        }

        return htmlOrPromise;
    }

    updateHtml(value, was) {
        const me = this;

        let empty = value === '';

        // As setting empty string as content should hide the tooltip, we don't want to actually update the
        // element innerHTML with blank space during the hide transition, we check _html for emptiness in hasContent

        if (!empty) {
            super.updateHtml(value, was);

            if (me.hasContent) {
                if (!Objects.isPromise(value)) {
                    me.trigger('innerHtmlUpdate', { value });
                }
            }
            else {
                empty = true;
            }
        }

        if (empty) {
            // Hide empty tooltips
            me.hide();
        }
    }

    //endregion

    //region Events

    /**
     * Mouse move event listener which updates tooltip
     * @private
     */
    onMouseMove(event) {
        const
            me       = this,
            {
                forElement,
                activeTarget
            }        = me,
            // If we are trackMouse: true
            // we must keep out of the way of the mouse by continuing
            // to track if we are on the way out due to a hide timer.
            isHiding = me.hasTimeout('hide'),
            target   = event.target;

        // MouseMove is listened for during the hover show timer wait phase if anchorToTarget is false
        // so that when the timer fires, it can show near the most recent pointer position.
        // It's also listened for after show when we are not anchored to the target and so tracking the mouse.
        /**
         * The DOM event that triggered this tooltip to show
         * @member {Event} triggeredByEvent
         * @readonly
         */
        me.triggeredByEvent = event;

        // Check that we are still valid to be visible, and if so, track the mouse.
        if (!me._hidden) {
            let hideVetoed;

            const
                // It's a move within our target
                isWithinTarget           = activeTarget?.contains(target),

                // Work out whether we have just exited our target.
                // If we are still *inside* the target, do not test the selector.
                isElementOut             = !isWithinTarget && me.forSelector && activeTarget && !isHiding && (target.nodeType === Node.ELEMENT_NODE) && !target.matches(me.forSelector) && !(me.allowOver && me.element.contains(target)),

                // We need an element we can ask the "contains" question about our target.
                // If we are using window, we need to step down to the documentElement.
                containingElement        = forElement?.document ? forElement.document.documentElement : forElement,

                // If the forElement is a ShadowRoot, it won't implement contains
                // but it does implement compareDocumentPosition.
                forElementContainsTarget = containingElement && (containingElement.contains ? containingElement.contains(target) : (containingElement.compareDocumentPosition(target) & 16));

            // Check whether the element we are over is still a valid delegate matching the forSelector,
            // or it's the tip element, and we're allowOver. If not, we have to hide.
            // nodeType check is for FF on Linux, event.target is sometimes a text node
            if (isElementOut) {
                hideVetoed = me.handleForElementOut();
            }
            // If we are not hiding due to moving mouse outside our forElement (or hide being vetoed), tooltip stays visible and optionally realigns based on trackMouse setting.
            if (hideVetoed || !isHiding || forElementContainsTarget) {
                // Mousemoves restart the dismiss timer.
                if (me.dismissDelay && !isHiding) {
                    me.setTimeout('hide', me.dismissDelay);
                }

                if (me.updateContentOnMouseMove && me.getHtml) {
                    me.html = me.callback(me.getHtml, me, [{
                        tip        : me,
                        element    : me.element,
                        forElement : activeTarget,
                        event
                    }]);

                    if (!me.html) {
                        // Nothing to display, hide
                        me.hide();
                        return;
                    }
                }

                // If we're not anchoring to the target, track the mouse
                if (me.trackMouse) {
                    me.alignTo({
                        position         : 'mouse',
                        ignorePageScroll : true
                    });
                }
            }
        }
    }

    // Handle if implementer has defined "showOnClick"
    onElementUserAction(event) {
        this.internalOnPointerOver(event);
    }

    onOwnElementMouseEnter(event) {
        this.abortDelayedHide();
    }

    //endregion

    // rootElement = where to find the float root
    // forElement = where to set up listeners
    // Can be different when using a shadowRoot not part of a webcomponent
    static getSharedTooltip(rootElement, forElement, skipCreating) {
        let sharedTooltip = forElement.bryntum?.tooltip?.get(Tooltip);

        if (!sharedTooltip && !skipCreating) {
            // Store shared tooltips in a map on root element,
            // keyed by the class to work with multiple bundles on page
            if (!forElement.bryntum?.tooltip) {
                ObjectHelper.setPath(forElement, 'bryntum.tooltip', new Map());
            }

            const map = forElement.bryntum.tooltip;

            // Avoid infinite loop as the Tooltip gets created with rootElement too
            map.set(Tooltip, true);

            sharedTooltip = new Tooltip({
                forElement,
                rootElement,
                forSelector       : '[data-btip]',
                resetCfg          : {},
                isSharedTooltip   : true,
                cls               : 'b-tooltip-shared',
                internalListeners : {
                    // Reconfigure on pointerOver
                    pointerOver({ source : me, target }) {
                        // Revert last pointerOver config set to initial setting.
                        for (const key in me.resetCfg) {
                            if (key === 'listeners') {
                                me.un(me.resetCfg[key].set);
                            }
                            // Do not reset HTML to "". It causes an unwanted inter-delegate hide.
                            // hideOnDelegateChange defaults to false.
                            else if (key !== 'html') {
                                me[key] = me.resetCfg[key].was;
                            }
                        }
                        me.resetCfg = {};

                        const
                            forComponent = Widget.getById(target.id),
                            // If it's a component's tooltip, configure from the component,
                            // Otherwise gather from the dataset
                            config       = forComponent?.tipConfig || me.gatherDataConfigs(target.dataset);

                        // getById might find an entry with same id in different context, or element might belong to a
                        // widget that could not be resolved since it is in another context -> ignore
                        if (
                            (forComponent && forComponent.element !== target) ||
                            (!forComponent && target.matches('.b-widget')) ||
                            // Respect our forComponent's wish to not show when it's disabled
                            (forComponent?.disabled && !forComponent.showTooltipWhenDisabled)
                        ) {
                            return false;
                        }

                        // Tooltip must be linked to an activating owner before it shows
                        // so that configs which use 'up.propName' will be work as expected.
                        // Set the private property so we do not create an ownership registration
                        // in the forComponent
                        me._owner = forComponent;

                        for (const key in config) {
                            me.resetCfg[key] = {
                                set : config[key],
                                was : me[key]
                            };

                            if (key === 'listeners') {
                                me.ion(config[key]);
                            }
                            else {
                                me[key] = config[key];
                            }
                        }
                    },
                    hide({ source : me }) {
                        me.owner = null;
                    }
                },

                gatherDataConfigs(dataset) {
                    const
                        me     = this,
                        config = {};

                    for (const key in dataset) {
                        if (key.startsWith('btip')) {
                            if (key.length > 4) {
                                const configProp = StringHelper.uncapitalize(key.substr(4)); // Snip off "btip" prefix to convert to property name

                                // If we have a config by the name, set it
                                if (configProp in me.getDefaultConfiguration()) {
                                    const value = dataset[key];

                                    // gather the found config value
                                    config[configProp] = isBoolean[value] ? (value === 'true') : isNaN(value) ? value : parseInt(value, 10);
                                }
                            }
                            else {
                                config.html = dataset[key];
                            }
                        }
                    }
                    return config;
                },

                filterTarget(element) {
                    const target = element.closest(this.forSelector);
                    if (target) {
                        return target;
                    }
                    // If we are inside a Bryntum widget, and set to show overflow
                    // find the closest overflowing element.
                    if (Tooltip.showOverflow && element.closest('.b-widget')) {
                        while (element?.nodeType === Element.ELEMENT_NODE) {
                            if (DomHelper.getStyleValue(element, 'text-overflow') === 'ellipsis' && element.clientWidth < element.scrollWidth) {
                                this.html = StringHelper.encodeHtml(element.textContent);
                                return element;
                            }
                            element = element.parentNode;
                        }
                    }
                }
            });

            EventHelper.on({
                element    : forElement,
                mouseenter : event => Tooltip.currentOverElement = event.target,
                // If mouse is not used for editing cell then Tooltip has no `currentOverElement` and no error tooltip is shown. We use keydown event.target for this
                keydown    : event => Tooltip.currentOverElement = event.target,
                capture    : true,
                thisObj    : sharedTooltip
            });

            map.set(Tooltip, sharedTooltip);
        }

        return sharedTooltip;
    }

    static encodeConfig(tooltip) {
        const dataset = {};

        if (typeof tooltip === 'string') {
            dataset.btip = tooltip;
        }
        // Encode a full config into data-btip-allow-over etc.
        else {
            for (const config in tooltip) {
                dataset[`btip${config === 'html' ? '' : StringHelper.capitalize(config)}`] = tooltip[config];
            }
        }
        return dataset;
    }
}

// Register this widget type with its Factory
Tooltip.initClass();

// This is documented as a member in Widget
Object.defineProperty(Widget, 'tooltip', {
    get() {
        return Tooltip.getSharedTooltip(document.body, document.body);
    }
});

/**
 * Updated dynamically with the current element that the mouse is over. For use when showing a Tooltip
 * from code which is not triggered by a pointer event so that a tooltip can be positioned.
 * @member {HTMLElement} currentOverElement
 * @readonly
 * @static
 */
/**
 * Set this to true to have the {@link Core.widget.Widget#property-tooltip-static shared tooltip} pop up
 * to show the full text for elements which have overflowing text and have `text-overflow:ellipsis`.
 * @member {Boolean} showOverflow
 * @static
 */

// Register this widget type with its Factory
Widget.Tooltip = Tooltip;
