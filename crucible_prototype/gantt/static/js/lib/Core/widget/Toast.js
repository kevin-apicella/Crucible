import Widget from './Widget.js';
import DomClassList from '../helper/util/DomClassList.js';
import DomHelper from '../helper/DomHelper.js';

/**
 * @module Core/widget/Toast
 */

/**
 * Basic toast. Toasts are stacked on top of each other
 *
 * ```javascript
 * // simplest possible
 * Toast.show('Just toasting');
 *
 * // with config
 * Toast.show({
 *   html         : 'Well toasted',
 *   showProgress : false
 * });
 *
 * // as instance (instance is also returned from Toast.show()
 * let toast = new Toast({
 *   html    : 'Not going away',
 *   timeout : 0
 * });
 *
 * toast.show();
 * ```
 *
 * To show toasts from the top and have them stack downwards, specify `side` as `'top'`:
 *
 * ```
 * Toast.show({
 *   html : 'Well toasted',
 *   side : 'top'
 * });
 * ```
 *
 * By default, Toasts show at the `inline-end` side of the screen, so on the right in LTR environments
 * and on the left in RTL environments.
 *
 * Append `-start` to the side to display at the required edge, or just use `side : 'start'` to show
 * at the bottom but at the `inline-start` side of the screen.
 *
 * ```
 * Toast.show({
 *   html : 'Well toasted on the left',
 *   side : 'start'
 * });
 * ```
 *
 * {@inlineexample Core/widget/Toast.js}
 *
 * @extends Core/widget/Widget
 * @classtype toast
 */
export default class Toast extends Widget {

    static $name = 'Toast';

    static type = 'toast';

    static get configurable() {
        return {
            testConfig : {
                destroyTimeout : 1,
                timeout        : 1000
            },

            floating : true,

            /**
             * Timeout (in ms) until the toast is automatically dismissed. Set to 0 to never hide.
             * @config {Number}
             * @default
             */
            timeout : 2500,

            autoDestroy : null,

            // How long to wait after hide before destruction
            destroyTimeout : 200,

            /**
             * Show a progress bar indicating the time remaining until the toast is dismissed.
             * @config {Boolean}
             * @default
             */
            showProgress : true,

            /**
             * Toast color (should have match in toast.scss or your custom styling).
             * Valid values in Bryntum themes are:
             * * b-amber
             * * b-blue
             * * b-dark-gray
             * * b-deep-orange
             * * b-gray
             * * b-green
             * * b-indigo
             * * b-lime
             * * b-light-gray
             * * b-light-green
             * * b-orange
             * * b-purple
             * * b-red
             * * b-teal
             * * b-white
             * * b-yellow
             *
             * ```
             * new Toast({
             *    color : 'b-blue'
             * });
             * ```
             *
             * @config {String}
             */
            color : null,

            sideMargin : 20,

            /**
             * Which side to show the toast at, `'top'` or `'bottom'`. Defaults to `'bottom'`.
             *
             * May also define the inline edge to show at, by using `'top-start'`, or `'top-end'` etc.
             *
             * By default, toasts are shown at the bottom at the inline-end edge.
             * @config {'top'|'bottom'|'start'|'end'|'top-start'|'top-end'|'bottom-start'|'bottom-end'} side
             * @default
             */
            side : 'bottom',

            role : 'alert'
        };
    }

    static toasts = {
        'top-start'    : [],
        'top-end'      : [],
        'bottom-start' : [],
        'bottom-end'   : []
    };

    changeSide(side) {
        if (side == 'top' || side == 'bottom') {
            side += '-end';
        }
        else if (side === 'start' || side == 'end') {
            side = 'bottom-' + side;
        }
        return side;
    }

    compose() {
        const { appendTo, color, html, showProgress, style, timeout, side } = this;

        return {
            parent : appendTo || this.floatRoot,
            class  : {
                ...DomClassList.normalize(color, 'object'),
                [`b-side-${side}`] : 1,
                'b-toast-hide'     : 1  // toasts start hidden so we can animate them into view
            },

            html,
            style : {
                ...DomHelper.parseStyle(style),
                '--side' : side.split('-')[0]
            },

            children : {
                progressElement : showProgress && {
                    style : `animation-duration:${timeout / 1000}s;`,
                    class : {
                        'b-toast-progress' : 1
                    }
                }
            },

            // eslint-disable-next-line bryntum/no-listeners-in-lib
            listeners : {
                click : 'hide'
            }
        };
    }

    doDestroy() {
        this.untoast();

        super.doDestroy();
    }

    getNextInset(side) {
        const { sideMargin, element } = this;

        return parseInt(element.style[side], 10) + element.offsetHeight + sideMargin;
    }

    /**
     * Show the toast
     */
    async show() {
        await super.show(...arguments);

        const
            me = this,
            { element, side } = me,
            toasts = Toast.toasts[side],
            s      = side.split('-')[0];

        if (!toasts.includes(me)) {
            element.style[s] = (toasts[0]?.getNextInset(s) ?? me.sideMargin) + 'px';

            toasts.unshift(me);
            element.getBoundingClientRect();  // force layout so that removing b-toast-hide runs our transition

            element.classList.remove('b-toast-hide');

            if (me.timeout > 0) {
                me.hideTimeout = me.setTimeout('hide', me.timeout);
            }
            DomHelper.addAttributeValue(document.body, 'aria-describedby', me.id);
        }
    }

    /**
     * Hide the toast
     */
    async hide() {
        const me = this;

        me.untoast();
        me.element.classList.add('b-toast-hide');

        if (me.autoDestroy && !me.destroyTimer) {
            me.destroyTimer = me.setTimeout('destroy', me.destroyTimeout);
        }
    }

    untoast() {
        const toasts = Toast.toasts[this.side];

        if (toasts.includes(this)) {
            toasts.splice(toasts.indexOf(this), 1);
        }
        DomHelper.removeAttributeValue(document.body, 'aria-describedby', this.id);
    }

    /**
     * Hide all visible toasts
     */
    static hideAll() {
        Object.keys(Toast.toasts).forEach(k => Toast.toasts[k].slice().reverse().forEach(toast => toast.hide()));
    }

    /**
     * Easiest way to show a toast
     *
     * ```javascript
     * Toast.show('Hi');
     *
     * Toast.show({
     *   html   : 'Read quickly, please',
     *   timeout: 1000
     * });
     * ```
     *
     * @param {String|ToastConfig} config Message or toast config object
     * @returns {Core.widget.Toast}
     */
    static show(config) {
        const toast = Toast.new({
            autoDestroy : true,
            rootElement : document.body
        }, (typeof config === 'string') ? { html : config } : config);

        toast.show();

        return toast;
    }
}

// Register this widget type with its Factory
Toast.initClass();
