import Panel from './Panel.js';
import EventHelper from '../helper/EventHelper.js';
import GlobalEvents from '../GlobalEvents.js';
import DomHelper from '../helper/DomHelper.js';

/**
 * @module Core/widget/Popup
 */

/**
 * A floating Popup widget, which can contain child {@link Core.widget.Container#config-items widgets} or plain html. Serves as the base class
 * for Menu / Tooltip.
 *
 * When it contains focus, the `Escape` key {@link #config-closeAction closes} the picker. When it hides,
 * focus is reverted to the element from which it entered the Popup, or, if that is no longer focusable,
 * a close relative of that element.
 *
 * ```javascript
 * let popup = new Popup({
 *   forElement : document.querySelector('button'),
 *   items      : [
 *     { type : 'text', placeholder: 'Text' },
 *     { type: 'button', text: 'Okay', style: 'width: 100%', color: 'b-orange'}
 *   ]
 * });
 * ```
 *
 * {@inlineexample Core/widget/Popup.js}
 *
 * @extends Core/widget/Panel
 * @classtype popup
 */
export default class Popup extends Panel {
    //region Config

    static $name = 'Popup';

    static type = 'popup';

    static get configurable() {
        return {

            /**
             * Auto show flag for Popup.
             * If truthy then Popup is shown automatically upon hover.
             * @config {Boolean}
             * @default
             */
            autoShow : true,

            /**
             * By default, a Popup is transient, and will {@link #function-close} when the user clicks or
             * taps outside its owned widgets and when focus moves outside its owned widgets.
             *
             * **Note**: {@link #config-modal Modal} popups won't {@link #function-close} when focus moves outside even
             * if autoClose is `true`.
             *
             * Configure as `false` to make a Popup non-transient.
             * @config {Boolean}
             * @default
             */
            autoClose : true,

            /**
             * Show popup when user clicks the element that it is anchored to. Cannot be combined with showOnHover
             * @config {Boolean}
             * @default
             */
            showOnClick : false,

            /**
             * DOM element to attach popup.
             * @config {HTMLElement}
             */
            forElement : null,

            monitorResize : true,

            floating : true,
            hidden   : true,

            axisLock : true, // Flip edges if align violates constrainTo

            hideAnimation : {
                opacity : {
                    from     : 1,
                    to       : 0,
                    duration : '.3s',
                    delay    : '0s'
                }
            },

            showAnimation : {
                opacity : {
                    from     : 0,
                    to       : 1,
                    duration : '.4s',
                    delay    : '0s'
                }
            },

            stripDefaults : {
                bbar : {
                    layout : {
                        justify : 'flex-end'
                    }
                }
            },

            testConfig : {
                hideAnimation : null,
                showAnimation : null
            },

            /**
             * The action to take when calling the {@link #function-close} method.
             * By default, the popup is hidden.
             *
             * This may be set to `'destroy'` to destroy the popup upon close.
             * @config {'hide'|'destroy'}
             * @default
             */
            closeAction : 'hide',

            /**
             * By default, tabbing within a Popup is circular - that is it does not exit.
             * Configure this as `false` to allow tabbing out of the Popup.
             * @config {Boolean}
             * @default
             */
            trapFocus : true,

            /**
             * By default a Popup is focused when it is shown.
             * Configure this as `false` to prevent automatic focus on show.
             * @config {Boolean}
             * @default
             */
            focusOnToFront : true,

            /**
             * Show a tool in the header to close this Popup, and allow `ESC` close it.
             * The tool is available in the {@link Core.widget.mixin.Toolable#property-tools} object
             * under the name `close`. It uses the CSS class `b-popup-close` to apply a
             * default close icon. This may be customized with your own CSS rules.
             * @default false
             * @config {Boolean}
             */
            closable : null,

            /**
             * Show a tool in the header to maximize this popup
             * @config {Boolean}
             * @default false
             */
            maximizable : null,

            /**
             * Optionally show an opaque mask below this Popup when shown.
             * Configure this as `true` to show the mask.
             *
             * When a Popup is modal, it defaults to being {@link Core.widget.Widget#config-centered}.
             * Also, it won't {@link #function-close} when focus moves outside even if {@link #config-autoClose} is
             * `true`.
             *
             * The default action is to focus the popup.
             *
             * Usage:
             * ```javascript
             * new Popup({
             *     title  : 'I am modal',
             *     modal  : {
             *         closeOnMaskTap : true
             *     },
             *     height : 100,
             *     width  : 200
             * });
             * ```
             *
             * @default false
             * @config {Boolean|Object}
             * @property {Boolean} [closeOnMaskTap=false] Specify as `true` to close when mask is tapped.
             * @property {Boolean} [transparent=false] Specify as `true` to use a transparent mask.
             */
            modal : null,

            /**
             * Set to `true` to make this widget take all available space in the visible viewport.
             * @member {Boolean} maximized
             * @category Float & align
             */
            /**
             * Set to `true` to make this widget take all available space in the visible viewport.
             * @config {Boolean}
             * @default false
             * @category Float & align
             */
            maximized : null,

            tools : {
                close : {
                    cls       : 'b-popup-close',
                    handler   : 'close',
                    weight    : -1000,
                    ariaLabel : 'L{Popup.close}',
                    hidden    : true // shown when closable set to true
                },
                maximize : {
                    cls     : 'b-popup-expand',
                    handler : 'toggleMaximized',
                    weight  : -999,
                    hidden  : true // shown when maximizable set to true
                }
            },

            highlightReturnedFocus : true,

            role : 'dialog'
        };
    }

    //endregion

    //region Init & destroy

    finalizeInit() {
        const
            me             = this,
            { forElement } = me;

        me.anchoredTo    = forElement;
        me.initialAnchor = me.anchor;

        if (forElement && me.showOnClick) {
            // disable autoShow if not enabled by config
            if (!me.initialConfig.autoShow) {
                me.autoShow = false;
            }
            EventHelper.on({
                element : forElement,
                click   : 'onElementUserAction',
                thisObj : me
            });
        }

        super.finalizeInit();

        // We must not autoShow if there's a forElement but it's not visible
        if (me.autoShow && (!forElement || DomHelper.isVisible(forElement))) {
            if (me.autoShow === true) {
                me.show();
            }
            else {
                me.setTimeout(() => me.show(), me.autoShow);
            }
        }
    }

    onInternalPaint({ firstPaint }) {
        super.onInternalPaint?.(...arguments);

        const me = this;

        // Only add the listener the frst time we paint. If we are not maximizable, it does no harm.
        if (firstPaint && me.headerElement) {
            EventHelper.on({
                element  : me.headerElement,
                dblclick : me.onHeaderDblClick,
                thisObj  : me
            });
        }
    }

    doDestroy() {
        this.syncModalMask();
        super.doDestroy();
    }

    //endregion

    compose() {
        const { hasNoChildren, textContent } = this;

        return {
            class : {
                // Popup has extra CSS responsibilities at the top level.
                // The CSS needs to know whether it should impose a max-width.
                'b-text-popup' : Boolean(textContent && hasNoChildren)
            }
        };
    }

    //region Show/hide

    /**
     * Performs the configured {@link #config-closeAction} upon this popup.
     * By default, the popup hides. The {@link #config-closeAction} may be
     * configured as `'destroy'`.
     * @fires beforeClose
     */
    close() {
        const me = this;

        /**
         * Fired when the {@link #function-close} method is called and the popup is not hidden.
         * May be vetoed by returning `false` from a handler.
         * @event beforeClose
         * @preventable
         * @param {Core.widget.Popup} source - This Popup
         */
        if (
            (!me._hidden && me.trigger('beforeClose') !== false) ||
            // we should destroy it even if it's hidden just omit beforeclose event
            (me._hidden && me.closeAction === 'destroy')
        ) {
            // Revert focus early when closing a modal popup will lead to destruction, to give listeners a shot at doing
            // their thing. Without this, focus will be reverted as part of the destruction process, and listeners won't
            // be called.
            me.modal && me.closeAction === 'destroy' && me.revertFocus();

            me.unmask();

            // Focus moves unrelated to where the user's attention is upon this gesture.
            // Go into the keyboard mode where the focused widget gets a rendition so that
            // it is obvious where focus now is.
            // Must jump over EventHelper's global mousedown listener which will remove this class.
            if (me.containsFocus && me.highlightReturnedFocus) {
                me.setTimeout(() => me.element.classList.add('b-using-keyboard'), 0);
            }

            // Get any errorTip associated with any item in the popup and hide them
            const errorTip = me.items.length && me.items.find(item => item.errorTip)?.errorTip;

            if (errorTip) {
                errorTip.pointerOverOutDetacher?.();
                errorTip.hide();
            }

            return me[me.closeAction]();
        }
    }

    toggleMaximized() {
        this.maximized = !this.maximized;
    }

    updateMaximized(value) {
        DomHelper.toggleClasses(this.element, ['b-maximized'], value);
    }

    //endregion

    //region Events

    onInternalKeyDown(event) {
        const me = this;

        // Close or collapse/unreveal on escape key
        if (event.key === 'Escape') {
            event.stopImmediatePropagation();
            if (me.floating || me.positioned) {
                me.close(true);
            }
            else if (me.collapsible) {
                if (me.revealed) {
                    me.collapsible.toggleReveal();
                }
                else {
                    me.collapse();
                }
            }
        }
    }

    onDocumentMouseDown({ event }) {
        const
            me         = this,
            { owner }  = me,
            { target } = event;

        // If mousedown was on our owning Button, it is that button's responsibility to
        // toggle its pressed state thereby hiding its menu, so prevent the focus move of the mousedown.
        if (event.type !== 'touchend' && owner?.isButton && owner._menu === me && owner.element.contains(target)) {
            event.preventDefault();
            return false;
        }
        if (me.modal && target === Popup.modalMask) {
            event.preventDefault();
            if (me.modal.closeOnMaskTap) {
                me.close();
            }
            else if (!me.containsFocus) {
                me.focus();
            }
        }
        // in case of outside click and if popup is focused, focusout will trigger closing
        else if (!me.owns(target) && me.autoClose && !me.containsFocus) {
            me.close();
        }
    }

    get isTopModal() {
        return DomHelper.isVisible(Popup.modalMask) && this.element.previousElementSibling === Popup.modalMask;
    }

    onFocusIn(e) {
        const activeEl = DomHelper.getActiveElement(this);

        super.onFocusIn(e);

        // No event handler has moved focus, and target is outermost el
        // then delegate to the focusElement which for a Container
        // is found by finding the first visible, focusable descendant widget.
        if (DomHelper.getActiveElement(this) === activeEl && e.target === this.element) {
            this.focus();
        }
    }

    onFocusOut(e) {
        // For mobile browsers with virtual keyboard, when pressing Done key, focus should move back to the popup
        // https://github.com/bryntum/support/issues/2903
        // window.visualViewport.height could be a decimal value. Using 1px threshold for correct comparing
        const usingVirtualKeyboard = globalThis.visualViewport && globalThis.visualViewport.height < document.documentElement.clientHeight - 1;

        if (!usingVirtualKeyboard && !this.modal && this.autoClose) {
            this.close();
        }

        super.onFocusOut(e);
    }

    afterShow() {
        const me = this;

        if (me.autoClose || me.modal) {
            me.addDocumentMouseDownListener();
        }

        // Showing a Popup means show at the top of the stack.
        me.toFront();

        super.afterShow(...arguments);
    }

    toFront() {
        // Allow for configuration against the default, eg floating : false which can
        // be done with Menus to create static menu UIs.
        if (this.floating) {
            super.toFront();

            // Insert the modal mask below this Popup if needed
            this.syncModalMask();
        }

        if (this.focusOnToFront) {
            this.focus();
        }
    }

    addDocumentMouseDownListener() {
        if (!this.mouseDownRemover) {
            this.mouseDownRemover = GlobalEvents.ion({
                globaltap : 'onDocumentMouseDown',
                thisObj   : this
            });
        }
    }

    updateModal(modal) {
        // Modal implies that this is floating. There's no ability for positioned widgets
        // to acquire a modal mask.
        if (modal) {
            this.floating = true;
        }
    }

    syncModalMask() {
        const
            me = this,
            {
                modal,
                element
            }  = me;

        // Cast because modal may be specified as an object
        element.setAttribute('aria-modal', Boolean(modal));

        // Note the difference between Popup.modalMask and this.modalMask.
        // this.modalMask syncs the position of the element in the DOM
        // to be below this element. Popup.modalMask just returns the element.
        if (modal && me.isVisible) {
            // If we have not been explicitly positioned, a modal is centered.
            // And if it's centered, it cannot show an anchor arrow.
            if (typeof me._x !== 'number' && typeof me._y !== 'number') {
                me.centered = true;
                me.anchor = false;
            }
            me.modalMask.classList.remove('b-hide-display');
            me.modalMask.classList.toggle('b-modal-transparent', Boolean(modal.transparent));
            element.classList.add('b-modal');
        }
        else if (me.isPainted) {
            element.classList.remove('b-modal');

            const
                remainingModals = me.floatRoot.querySelectorAll('.b-modal'),
                topModal        = remainingModals.length ? Popup.fromElement(remainingModals[remainingModals.length - 1], 'popup') : null;

            // If there are any other visible modals, drop the mask to just below the new topmost
            if (topModal) {
                topModal.syncModalMask();
            }
            else {
                Popup.modalMask.classList.add('b-hide-display');
            }
        }
    }

    afterHide() {
        const me = this;

        super.afterHide(...arguments);

        me.mouseDownRemover?.();
        me.mouseDownRemover = null;

        // Insert the modal mask below the topmost Popup if needed, else hide it
        me.syncModalMask();
    }

    onElementUserAction() {
        this.show();
    }

    onHeaderDblClick() {
        if (this.maximizable) {
            this.toggleMaximized();
        }
    }

    //endregion

    updateClosable(closable) {
        this.tools.close.hidden = !closable;
    }

    updateMaximizable(maximizable) {
        this.tools.maximize.hidden = !maximizable;
    }

    /**
     * Returns the modal mask element for this Popup correctly positioned just below this Popup.
     * @internal
     */
    get modalMask() {
        const { modalMask } = Popup;

        if (modalMask.nextElementSibling !== this.element) {
            this.floatRoot.insertBefore(modalMask, this.element);
        }

        return modalMask;
    }

    /**
     * Returns the modal mask element. It does NOT guarantee its placement in the DOM relative
     * to any Popup. To get the modal mask for a particular Popup, use the instance property.
     * @internal
     */
    static get modalMask() {
        if (!this._modalMask) {
            this._modalMask = DomHelper.createElement({
                className : 'b-modal-mask b-hide-display'
            });
            // Mousewheel should not scroll the body "through" a modal mask.
            EventHelper.on({
                element : this._modalMask,
                wheel   : e => e.preventDefault()
            });
        }
        return this._modalMask;
    }
}

// Register this widget type with its Factory
Popup.initClass();
