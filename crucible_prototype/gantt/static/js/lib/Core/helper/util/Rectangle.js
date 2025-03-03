/**
 * @module Core/helper/util/Rectangle
 */

import DomHelper from '../DomHelper.js';
import BrowserHelper from '../BrowserHelper.js';
import ObjectHelper from '../ObjectHelper.js';
import VersionHelper from '../VersionHelper.js';

let zeroBased;
const
    allBorders        = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
    allMargins        = ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
    allPaddings       = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
    borderNames       = {
        t : 'border-top-width',
        r : 'border-right-width',
        b : 'border-bottom-width',
        l : 'border-left-width'
    },
    paddingNames      = {
        t : 'padding-top',
        r : 'padding-right',
        b : 'padding-bottom',
        l : 'padding-left'
    },
    alignSpecRe       = /^([trblc])(\d*)-([trblc])(\d*)$/i,
    alignPointRe      = /^([trblc])(\d*)$/i,
    edgeNames         = [
        'top',
        'right',
        'bottom',
        'left'
    ],
    edgeIndices       = {
        t : 0,
        r : 1,
        b : 2,
        l : 3
    },
    defaultAlignments = [
        'b-t',
        'l-r',
        't-b',
        'r-l'
    ],
    edgeAligments     = {
        bt : 1,
        tb : 1,
        lr : 2,
        rl : 2
    },
    emptyArray        = Object.freeze([]),
    zeroOffsets       = Object.freeze([0, 0]),
    matchDimensions   = ['width', 'height'],
    parseEdges        = (top, right = top, bottom = top, left = right) =>
        // use apply() to spread array and apply default values to missing elements
        Array.isArray(top) ? parseEdges.apply(null, top) : [top, right, bottom, left],
    parseTRBL         = (top, right, bottom, left) =>
        Array.isArray(top)
            ? parseEdges.apply(null, top)
            // Rectangle or vanilla rectangle (DOMRect)
            : (typeof top.top === 'number') ? [top.top, top.right, top.bottom, top.left] : [top, right, bottom, left],
    // Parse a l0-r0 (That's how Menus align to their owning MenuItem) align spec.
    // If we are in an RTL env, then reverse the percentage values if we are
    // aligning horizontal edges.
    parseAlign        = (alignSpec, rtl) => {
        const parts        = alignSpecRe.exec(alignSpec),
            myEdge       = parts[1],
            targetEdge   = parts[3],
            mO           = parseInt(parts[2] || 50),
            tO           = parseInt(parts[4] || 50),
            myOffset     = rtl && !(edgeIndices[myEdge] & 1) ? 100 - mO : mO,
            targetOffset = rtl && !(edgeIndices[targetEdge] & 1) ? 100 - tO : tO,
            edgeAligned  = edgeAligments[myEdge + targetEdge];



        // Comments assume the Menu's alignSpec of l0-r0 is used.
        return {
            myAlignmentPoint     : myEdge + myOffset,         // l0
            myEdge,                                           // l
            myOffset,                                         // 0
            targetAlignmentPoint : targetEdge + targetOffset, // r0
            targetEdge,                                       // r
            targetOffset,                                     // 0
            startZone            : edgeIndices[targetEdge],   // 1 - start trying zone 1 in TRBL order
            edgeAligned                                       // Edge-to-edge align requested
        };
    },
    // Takes a result from the above function and flips edges for the axisLock config
    flipAlign         = align =>
        `${edgeNames[(edgeIndices[align.myEdge] + 2) % 4][0]}${align.myOffset}-${
            edgeNames[(edgeIndices[align.targetEdge] + 2) % 4][0]}${align.targetOffset}`,
    createOffsets     = offset => {
        if (offset == null) {
            return zeroOffsets;
        }
        else if (typeof offset === 'number') {
            return [offset, offset];
        }

        return offset;
    };

export { parseAlign };

/**
 * Encapsulates rectangular areas for comparison, intersection etc.
 *
 * Note that the `right` and `bottom` properties are *exclusive*.
 */
export default class Rectangle {

    // Class does not extend Base, so we need to define this
    isRectangle = true;

    /**
     * Returns the Rectangle in document based coordinates of the passed element.
     *
     * *Note:* If the element passed is the `document` or `window` the `window`'s
     * rectangle is returned which is always at `[0, 0]` and encompasses the
     * browser's entire document viewport.
     * @param {HTMLElement|Core.widget.Widget|Core.widget.Mask} element The element to calculate the Rectangle for.
     * @param {HTMLElement} [relativeTo] Optionally, a parent element in whose space to calculate the Rectangle.
     * @param {Boolean} [ignorePageScroll=false] Use browser viewport based coordinates.
     * @returns {Core.helper.util.Rectangle} The Rectangle in document based (or, optionally viewport based) coordinates. Relative to the _relativeTo_ parameter if passed.
     */
    static from(element, relativeTo, ignorePageScroll) {
        // Convenient in tests
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        // If a shadowRoot or other type of document fragment passed, get closest Element
        else if (element?.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            element = element.host || element.ownerDocument;
        }

        if (typeof relativeTo === 'string') {
            relativeTo = document.querySelector(relativeTo);
        }

        if (element == null || element.isRectangle) {
            return element;
        }

        element = element.element || element;  // works for Widget and Mask

        if (ignorePageScroll === undefined && typeof relativeTo === 'boolean') {
            ignorePageScroll = relativeTo;
            relativeTo       = null;
        }

        if (!relativeTo?.isRectangle) {
            if (relativeTo) {

                let { scrollLeft, scrollTop } = relativeTo;
                if (BrowserHelper.isSafari && relativeTo === document.body) {
                    scrollLeft = scrollTop = 0;
                }

                relativeTo = Rectangle.from(relativeTo).translate(-scrollLeft, -scrollTop);
            }
            else {
                if (!zeroBased) {
                    zeroBased = new Rectangle(0, 0, 0, 0);
                }

                relativeTo = zeroBased;
            }
        }

        // Viewport is denoted by requesting window or document.
        // document.body may overflow the viewport, so this must not be evaluated as the viewport.
        const
            // If body is 0 height we should treat this case as a viewport
            isViewport   = element === document || element === globalThis,
            isSFViewport = element === document.body && document.body.offsetHeight === 0,
            sfElRect     = isSFViewport && element.getBoundingClientRect(),
            viewRect     = isSFViewport
                // In Salesforce body and html have 0 height so to get correct viewport vertical size we have to use
                // scrollHeight on html element.
                ? new Rectangle(sfElRect.left, sfElRect.top, sfElRect.width, document.body.parentElement.scrollHeight)
                : isViewport
                    ? new Rectangle(0, 0, globalThis.innerWidth, globalThis.innerHeight)
                    : element.getBoundingClientRect(),
            scrollOffset = (ignorePageScroll || isViewport) ? [0, 0] : [globalThis.pageXOffset, globalThis.pageYOffset];

        return new Rectangle(
            viewRect.left + scrollOffset[0] - relativeTo.x,
            viewRect.top + scrollOffset[1] - relativeTo.y,
            viewRect.width,
            viewRect.height
        );
    }

    /**
     * Returns the Rectangle in viewport coordinates of the passed element.
     *
     * *Note:* If the element passed is the `document` or `window` the `window`'s rectangle is returned which is always
     * at `[0, 0]` and encompasses the browser's entire document viewport.
     * @param {HTMLElement} element The element to calculate the Rectangle for.
     * @param {HTMLElement} [relativeTo] Optionally, a parent element in whose space to calculate the Rectangle.
     * @returns {Core.helper.util.Rectangle} The Rectangle in viewport based coordinates. Relative to the _relativeTo_
     * parameter if provided.
     */
    static fromScreen(element, relativeTo) {
        return Rectangle.from(element, relativeTo, /* ignorePageScroll = */ true);
    }

    /**
     * Returns the inner Rectangle (within border) in document based coordinates of the passed element.
     * @param {HTMLElement} element The element to calculate the Rectangle for.
     * @param {HTMLElement} [relativeTo] Optionally, a parent element in whose space to calculate the Rectangle.
     * @param {Boolean} [ignorePageScroll] Use browser viewport based coordinates.
     * @returns {Core.helper.util.Rectangle} The Rectangle in document based (or, optionally viewport based) coordinates. Relative to the _relativeTo_ parameter if passed.
     */
    static inner(element, relativeTo, ignorePageScroll = false) {
        const result = this.from(element, relativeTo, ignorePageScroll);

        // Can only ask for the following styles if element is in the document.
        if (document.body.contains(element)) {
            const borders = DomHelper.getStyleValue(element, allBorders);

            result.x += parseFloat(borders[borderNames.l]);
            result.y += parseFloat(borders[borderNames.t]);
            result.right -= parseFloat(borders[borderNames.r]);
            result.bottom -= parseFloat(borders[borderNames.b]);
        }

        return result;
    }

    /**
     * Returns the content Rectangle (within border and padding) in document based coordinates of the passed element.
     * @param {HTMLElement} element The element to calculate the Rectangle for.
     * @param {HTMLElement} [relativeTo] Optionally, a parent element in whose space to calculate the Rectangle.
     * @param {Boolean} [ignorePageScroll] Use browser viewport based coordinates.
     * @returns {Core.helper.util.Rectangle} The Rectangle in document based (or, optionally viewport based) coordinates. Relative to the _relativeTo_ parameter if passed.
     */
    static content(element, relativeTo, ignorePageScroll = false) {
        const result = this.from(element, relativeTo, ignorePageScroll);

        // Can only ask for the following styles if element is in the document.
        if (document.body.contains(element)) {
            const borders = DomHelper.getStyleValue(element, allBorders),
                padding = DomHelper.getStyleValue(element, allPaddings);

            result.x += parseFloat(borders[borderNames.l]) + parseFloat(padding[paddingNames.l]);
            result.y += parseFloat(borders[borderNames.t]) + parseFloat(padding[paddingNames.t]);
            result.right -= parseFloat(borders[borderNames.r]) + parseFloat(padding[paddingNames.r]);
            result.bottom -= parseFloat(borders[borderNames.b]) + parseFloat(padding[paddingNames.b]);
        }

        return result;
    }

    /**
     * Returns the client Rectangle (within border and padding and scrollbars) in document based coordinates of the
     * passed element.
     * @param {HTMLElement} element The element to calculate the Rectangle for.
     * @param {HTMLElement} [relativeTo] Optionally, a parent element in whose space to calculate the Rectangle.
     * @param {Boolean} [ignorePageScroll] Use browser viewport based coordinates.
     * @param {Boolean} [clipStickies] Return the Rectangle *within* any sticky elements docked at the element edges.
     * @returns {Core.helper.util.Rectangle} The Rectangle in document based (or, optionally viewport based) coordinates. Relative to the _relativeTo_ parameter if passed.
     */
    static client(element, relativeTo, ignorePageScroll = false, clipStickies, targetEl) {
        const
            result         = this.content(element, relativeTo, ignorePageScroll),
            scrollbarWidth = DomHelper.scrollBarWidth;

        let padding,
            stickies = clipStickies ? [...element.children].filter(e => DomHelper.getStyleValue(e, 'position') === 'sticky') : emptyArray;

        // Don't clip a sticky which contains the element we are checking is in the client.
        if (targetEl) {
            stickies = stickies.filter(e => !e.contains(targetEl));
        }

        // Do not subtract scrollbar space if the scrollbar is overlayed, or has been hidden.
        if (scrollbarWidth && !element.classList.contains('b-hide-scroll')) {
            // Capture width taken by any vertical scrollbar.
            // If there is a vertical scrollbar, shrink the box.


            if (element.scrollHeight > element.clientHeight && DomHelper.getStyleValue(element, 'overflow-y') !== 'hidden') {
                padding = parseFloat(DomHelper.getStyleValue(element, 'padding-right'));
                result.right += padding - Math.max(padding, scrollbarWidth);
            }

            // Capture height taken by any horizontal scrollbar.
            // If there is a horizontal scrollbar, shrink the box.
            if (element.scrollWidth > element.clientWidth && DomHelper.getStyleValue(element, 'overflow-x') !== 'hidden') {
                padding = parseFloat(DomHelper.getStyleValue(element, 'padding-bottom'));
                result.bottom += padding - Math.max(padding, scrollbarWidth);
            }
        }

        // Allow stickies docked at the edges to reduce the viewport at that edge.
        for (let i = 0, { length } = stickies; i < length; i++) {
            const
                e = stickies[i],
                r = this.fromScreen(e);

            if (parseFloat(DomHelper.getStyleValue(e, 'left')) === 0) {
                result.x += r.width;
            }
            else if (parseFloat(DomHelper.getStyleValue(e, 'right')) === 0) {
                result.right -= r.width;
            }
            else if (parseFloat(DomHelper.getStyleValue(e, 'top')) === 0) {
                result.y += r.height;
            }
            else if (parseFloat(DomHelper.getStyleValue(e, 'bottom')) === 0) {
                result.bottom -= r.height;
            }
        }

        // The client region excluding any scrollbars.
        return result;
    }

    /**
     * Returns the outer Rectangle (including margin) in document based coordinates of the passed element.
     * @param {HTMLElement} element The element to calculate the Rectangle for.
     * @param {HTMLElement} [relativeTo] Optionally, a parent element in whose space to calculate the Rectangle.
     * @param {Boolean} [ignorePageScroll] Use browser viewport based coordinates.
     * @returns {Core.helper.util.Rectangle} The Rectangle in document based (or, optionally viewport based) coordinates.
     * Relative to the _relativeTo_ parameter if passed.
     * @internal
     */
    static outer(element, relativeTo, ignorePageScroll = false) {
        const result = this.from(element, relativeTo, ignorePageScroll);

        // Can only ask for the following styles if element is in the document.
        if (document.body.contains(element)) {
            const margin = DomHelper.getStyleValue(element, allMargins);

            result.x -= parseFloat(margin['margin-left']);
            result.y -= parseFloat(margin['margin-top']);
            result.right += parseFloat(margin['margin-right']);
            result.bottom += parseFloat(margin['margin-bottom']);
        }

        return result;
    }

    /**
     * Returns a new rectangle created as the union of all supplied rectangles.
     * @param {Core.helper.util.Rectangle[]} rectangles
     * @returns {Core.helper.util.Rectangle}
     */
    static union(...rectangles) {
        let { x, y, right, bottom } = rectangles[0],
            current;

        if (rectangles.length > 1) {
            for (let i = 1; i < rectangles.length; i++) {
                current = rectangles[i];

                if (current.x < x) {
                    x = current.x;
                }

                if (current.y < y) {
                    y = current.y;
                }

                if (current.right > right) {
                    right = current.right;
                }

                if (current.bottom > bottom) {
                    bottom = current.bottom;
                }
            }
        }

        return new Rectangle(x, y, right - x, bottom - y);
    }

    /**
     * Rounds this Rectangle to the pixel resolution of the current display or to the nearest
     * passed unit which defaults to the current display's [`devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio).
     * @param {Number} [devicePixelRatio] device pixel ratio which defaults to `window.devicePixelRatio`
     */
    roundPx(devicePixelRatio = globalThis.devicePixelRatio || 1) {
        const
            me = this;

        me._x      = DomHelper.roundPx(me._x, devicePixelRatio);
        me._y      = DomHelper.roundPx(me._y, devicePixelRatio);
        me._width  = DomHelper.roundPx(me._width, devicePixelRatio);
        me._height = DomHelper.roundPx(me._height, devicePixelRatio);

        return me;
    }

    // This class doesn't extend Base and extending doesn't seem to be
    // the way to go. Instead we duplicate smallest piece of logic here
    static get $$name() {
        return hasOwnProperty.call(this, '$name') && this.$name ||
            // _$name is filled by webpack for every class (cls._$name = '...')
            hasOwnProperty.call(this, '_$name') && this._$name ||
            this.name;
    }

    get $$name() {
        return this.constructor.$$name;
    }

    /**
     * Constructs a Rectangle
     * @param {Number} x The X coordinate
     * @param {Number} y The Y coordinate
     * @param {Number} width The width
     * @param {Number} height The height
     */
    constructor(x, y, width, height) {
        ObjectHelper.assertNumber(x, 'Rectangle.x');
        ObjectHelper.assertNumber(y, 'Rectangle.y');
        ObjectHelper.assertNumber(width, 'Rectangle.width');
        ObjectHelper.assertNumber(height, 'Rectangle.height');

        const me = this;

        // Normalize rectangle definitions with -ve offsets from their origin
        if (width < 0) {
            x += width;
            width = -width;
        }
        if (height < 0) {
            y += height;
            height = -height;
        }

        me._x      = x;
        me._y      = y;
        me._width  = width;
        me._height = height;
    }

    /**
     * Creates a copy of this Rectangle.
     */
    clone() {
        const
            me     = this,
            result = new Rectangle(me.x, me.y, me.width, me.height);

        result.isAlignRectangle = me.isAlignRectangle;
        result.minHeight        = me.minHeight;
        result.minWidth         = me.minWidth;

        return result;
    }

    /**
     * Returns `true` if this Rectangle wholly contains the passed rectangle.
     *
     * Note that a {@link Core.helper.util.Rectangle.Point} may be passed.
     * @param {Core.helper.util.Rectangle} other The Rectangle to test for containment within this Rectangle
     * @returns {Boolean} `true` if the other Rectangle is wholly contained within this Rectangle
     */
    contains(other) {
        const me = this;

        if (other.isRectangle) {
            return other._x >= me._x &&
                other._y >= me._y &&
                other.right <= me.right &&
                other.bottom <= me.bottom;
        }
        else {
            return false;
        }
    }

    /**
     * Checks if this Rectangle intersects the passed Rectangle
     * @param {Core.helper.util.Rectangle} other The Rectangle to intersect with this.
     * @param {Boolean} [useBoolean] Specify `true` to return a boolean value instead of constructing a new Rectangle
     * @param {Boolean} [allowZeroDimensions] `true` to consider zero-width or zero-hight rectangles as intersecting if coordinates indicate the intersection
     * @returns {Core.helper.util.Rectangle|Boolean} Returns the intersection Rectangle or `false` if there is no intersection.
     */
    intersect(other, useBoolean = false, allowZeroDimensions = false) {
        const
            me        = this,
            y         = Math.max(me.y, other.y),
            r         = Math.min(me.right, other.right),
            b         = Math.min(me.bottom, other.bottom),
            x         = Math.max(me.x, other.x),
            intersect = allowZeroDimensions ? (b >= y && r >= x) : (b > y && r > x);

        if (intersect) {
            return useBoolean ? true : new Rectangle(x, y, r - x, b - y);
        }
        else {
            return false;
        }
    }

    equals(other, round = false) {
        const processor = round ? x => Math.round(x) : x => x;

        return other.isRectangle &&
            processor(other.x) === processor(this.x) &&
            processor(other.y) === processor(this.y) &&
            processor(other.width) === processor(this.width) &&
            processor(other.height) === processor(this.height);
    }

    /**
     * Translates this Rectangle by the passed vector. Size is maintained.
     * @param {Number} x The X translation vector.
     * @param {Number} y The Y translation vector.
     * @returns {Core.helper.util.Rectangle} This Rectangle;
     */
    translate(x, y) {
        this._x += x || 0;
        this._y += y || 0;
        return this;
    }

    /**
     * Moves this Rectangle to the passed `x`, `y` position. Size is maintained.
     * @param {Number} x The new X position.
     * @param {Number} y The new Y position.
     * @returns {Core.helper.util.Rectangle}  This Rectangle;
     */
    moveTo(x, y) {
        if (x != null) {
            this._x = x;
        }
        if (y != null) {
            this._y = y;
        }
        return this;
    }

    /**
     * Returns the vector which would translate this Rectangle (or Point) to the same position as the other Rectangle (or point)
     * @param {Core.helper.util.Rectangle|Core.helper.util.Rectangle.Point} other The Rectangle or Point to calculate the delta to.
     * @returns {Array} Returns a vector using format `[deltaX, deltaY]`
     * @internal
     */
    getDelta(other) {
        return [other.x - this.x, other.y - this.y];
    }

    /**
     * The center point of this rectangle.
     * @property {Core.helper.util.Rectangle.Point}
     */
    get center() {
        const result  = new Point(this.x + this.width / 2, this.y + this.height / 2, 0, 0);
        result.target = this.target;
        return result;
    }

    /**
     * Get/sets the X coordinate of the Rectangle. Note that this does *not* translate the
     * Rectangle. The requested {@link #property-width} will change.
     * @property {Number}
     */
    set x(x) {
        const xDelta = x - this._x;

        this._x = x;
        this._width -= xDelta;
    }

    get x() {
        return this._x;
    }

    get start() {
        return this.left;
    }

    /**
     * Alias for x. To match DOMRect.
     * @property {Number}
     */
    set left(x) {
        this.x = x;
    }

    get left() {
        return this.x;
    }

    /**
     * Alias for y. To match DOMRect.
     * @property {Number}
     */
    set top(y) {
        this.y = y;
    }

    get top() {
        return this.y;
    }

    /**
     * Get/sets the Y coordinate of the Rectangle. Note that this does *not* translate the
     * Rectangle. The requested {@link #property-height} will change.
     * @property {Number}
     */
    set y(y) {
        const yDelta = y - this._y;

        this._y = y;
        this._height -= yDelta;
    }

    get y() {
        return this._y;
    }

    /**
     * Get/sets the width of the Rectangle. Note that the requested {@link #property-right} will change.
     * @property {Number}
     */
    set width(width) {
        this._width = width;
    }

    get width() {
        return this._width;
    }

    /**
     * Get/sets the height of the Rectangle. Note that the requested {@link #property-bottom} will change.
     * @property {Number}
     */
    set height(height) {
        this._height = height;
    }

    get height() {
        return this._height;
    }

    /**
     * Get/sets the right edge of the Rectangle. Note that the requested {@link #property-width} will change.
     *
     * The right edge value is exclusive of the calculated rectangle width. So x=0 and right=10
     * means a width of 10.
     * @property {Number}
     */
    set right(right) {
        this._width = right - this._x;
    }

    get right() {
        return this._x + this._width;
    }

    get end() {
        return this.right;
    }

    /**
     * Get/sets the bottom edge of the Rectangle. Note that the requested {@link #property-height} will change.
     *
     * The bottom edge value is exclusive of the calculated rectangle height. So y=0 and bottom=10
     * means a height of 10.
     * @property {Number}
     */
    set bottom(bottom) {
        this._height = bottom - this._y;
    }

    get bottom() {
        return this._y + this._height;
    }

    getStart(rtl, horizontal = true) {
        if (horizontal) {
            return rtl ? this.right : this.left;
        }

        return this.top;
    }

    getEnd(rtl, horizontal = true) {
        if (horizontal) {
            return rtl ? this.left : this.right;
        }

        return this.bottom;
    }

    get area() {
        return this.width * this.height;
    }

    set minWidth(minWidth) {
        const
            me = this;

        if (isNaN(minWidth)) {
            me._minWidth = null;
        }
        else {
            me._minWidth = Number(minWidth);

            // If this is being used as an alignment calculation rectangle, minWidth has a different meaning.
            // It does not mean that the width has to be at least this value. It means that under constraint,
            // it is willing to shrink down to that value before falling back to another align position.
            if (!me.isAlignRectangle) {
                me.width = Math.max(me.width, me._minWidth);
            }
        }
    }

    get minWidth() {
        return this._minWidth;
    }

    set minHeight(minHeight) {
        const
            me = this;

        if (isNaN(minHeight)) {
            me._minHeight = null;
        }
        else {
            me._minHeight = Number(minHeight);

            // If this is being used as an alignment calculation rectangle, minHeight has a different meaning.
            // It does not mean that the height has to be at least this value. It means that under constraint,
            // it is willing to shrink down to that value before falling back to another align position.
            if (!me.isAlignRectangle) {
                me.height = Math.max(me.height, me._minHeight);
            }
        }
    }

    get minHeight() {
        return this._minHeight;
    }

    /**
     * Modifies the bounds of this Rectangle by the specified deltas.
     * @param {Number} x How much to *add* to the x position.
     * @param {Number} y  How much to *add* to the y position.
     * @param {Number} width  How much to add to the width.
     * @param {Number} height  How much to add to the height.
     * @returns {Core.helper.util.Rectangle} This Rectangle
     */
    adjust(x, y, width, height) {
        const me = this;
        me.x += x;
        me.y += y;
        me.width += width;
        me.height += height;
        return me;
    }

    /**
     * Modifies the bounds of this rectangle by expanding them by the specified amount in all directions.
     * The parameters are read the same way as CSS margin values.
     *
     * Number of values passed:
     * - One: all edges are inflated by that value.
     * - Two: values are top/bottom deflation and left/right inflation.
     * - Three: values are top, left/right, and bottom.
     * - Four: the values are top, right, bottom, and left.
     *
     * @param {Number|Number[]|Core.helper.util.Rectangle|DOMRect} top How much to inflate, or the top value if more
     * than one value is passed. If an array is passed, it is spread as the arguments to this method.
     * @param {Number} [right] How much to inflate the right side, or both left and right is only two values passed. If
     * one value is passed, this defaults to the same as `top`.
     * @param {Number} [bottom] How much to inflate the bottom side. If 2 values are passed, this defaults to the `top`
     * value.
     * @param {Number} [left] How much to inflate the left side. If 3 values are passed, this defaults to the `right`
     * value.
     * @returns {Core.helper.util.Rectangle} This Rectangle
     * @internal
     */
    inflate(top, right = top, bottom = top, left = right) {
        [top, right, bottom, left] = parseTRBL(top, right, bottom, left);

        return this.adjust(-left, -top, right, bottom);
    }

    /**
     * Modifies the bounds of this rectangle by reducing them by the specified amount in all directions.
     * The parameters are read the same way as CSS margin values.
     *
     * Number of values passed:
     * - One: all edges are deflated by that value.
     * - Two: values are top/bottom deflation and left/right deflation.
     * - Three: values are top, left/right, and bottom.
     * - Four: the values are top, right, bottom, and left.
     *
     * @param {Number|Number[]|Core.helper.util.Rectangle|DOMRect} top How much to deflate, or the top value if more
     * than one value is passed. If an array is passed, it is spread as the arguments to this method.
     * @param {Number} [right] How much to deflate the right side, or both left and right is only two values passed. If
     * one value is passed, this defaults to the same as `top`.
     * @param {Number} [bottom] How much to deflate the bottom side. If 2 values are passed, this defaults to the `top`
     * value.
     * @param {Number} [left] How much to deflate the left side. If 3 values are passed, this defaults to the `right`
     * value.
     * @returns {Core.helper.util.Rectangle} This Rectangle
     * @internal
     */
    deflate(top, right = top, bottom = top, left = right) {
        [top, right, bottom, left] = parseTRBL(top, right, bottom, left);

        return this.adjust(left, top, -right, -bottom);
    }

    /**
     * Attempts to constrain this Rectangle into the passed Rectangle. If the `strict` parameter is `true`
     * then this method will return `false` if constraint could not be achieved.
     *
     * If this Rectangle has a `minHeight` or `minWidth` property, size will be adjusted while attempting to constrain.
     *
     * Right and bottom are adjusted first leaving the top and bottom sides to "win" in the case that this Rectangle overflows
     * the constrainTo Rectangle.
     * @param {Core.helper.util.Rectangle} constrainTo The Rectangle to constrain this Rectangle into if possible.
     * @param {Boolean} strict Pass `true` to return false, and leave this Rectangle unchanged if constraint
     * could not be achieved.
     * @returns {Core.helper.util.Rectangle|Boolean} This Rectangle. If `strict` is true, and constraining was not successful, `false`.
     */
    constrainTo(constrainTo, strict) {
        const
            me             = this,
            originalHeight = me.height,
            originalY      = me.y,
            minWidth       = me.minWidth || me.width,
            minHeight      = me.minHeight || me.height;

        if (me.height >= constrainTo.height) {
            // If we're strict, fail if we could *never* fit into available height.
            if (strict && minHeight > constrainTo.height) {
                return false;
            }
            // If we are >= constrain height, we will have to be at top edge of constrainTo
            me._y     = constrainTo.y;
            me.height = constrainTo.height;
        }

        if (me.width >= constrainTo.width) {
            // If we're strict, fail if we could *never* fit into available width.
            if (strict && minWidth > constrainTo.width) {
                // Could not be constrained; undo any previous attempt with height
                me.y      = originalY;
                me.height = originalHeight;
                return false;
            }
            // If we are >= constrain width, we will have to be at left edge of constrainTo
            me._x    = constrainTo.x;
            me.width = constrainTo.width;
        }

        // Overflowing the bottom or right sides, translate upwards or leftwards.
        me.translate.apply(me, me.constrainVector = [
            Math.min(constrainTo.right - me.right, 0),
            Math.min(constrainTo.bottom - me.bottom, 0)
        ]);

        // Now, after possible translation upwards or left,
        // if we overflow the top or left, translate downwards or right.
        me.translate(Math.max(constrainTo.x - me.x, 0), Math.max(constrainTo.y - me.y, 0));

        return me;
    }

    /**
     * Returns a cloned version of this Rectangle aligned to a target Rectangle, or element or {@link Core.widget.Widget}.
     * @param {Object} spec Alignment specification.
     * @param {HTMLElement|Core.widget.Widget|Core.helper.util.Rectangle} spec.target The Widget or element or Rectangle to align to.
     * @param {Number[]} [spec.anchorSize] The `[width, height]` of the anchor pointer when in `top` position. The
     * width is the baseline length, and the height is the height of the arrow. If passed, the anchor position
     * will be calculated to be at the centre of the overlap of the two aligned edges and returned in the `anchor`
     * property of the resulting Rectangle:
     *
     *     {
     *         edge: 'top',         // or 'right' or 'bottom' or 'left'
     *         x/y: offset          // dimension to translate and value to translate by.
     *     }
     *
     * @param {Object} [spec.anchorPosition] an `{ x: n, y: n }` anchor translation to be used *if the requested alignment
     * succeeds without violating constraints*. If a fallback alignment is used, the anchor will be centered in the
     * overlap of the aligned edges as usual.
     * @param {Boolean} [spec.overlap] True to allow this to overlap the target.
     * @param {String} spec.align The edge alignment specification string, specifying two points to bring together.
     *
     * Each point is described by an edge initial (`t` for top edge, `b` for bottom edge etc) followed
     * by a percentage along that edge.
     *
     * So the form would be `[trblc][n]-[trblc][n].` The `n` is the percentage offset along that edge
     * which defines the alignment point. This is not valid for alignment point `c` which means the center point.
     *
     * For example `t0-b0' would align this Rectangle's top left corner with the bottom left corner of the `target`.
     * @param {HTMLElement|Core.widget.Widget|Core.helper.util.Rectangle} [spec.constrainTo] The Widget or Element or Rectangle to constrain to.
     * If the requested alignment cannot be constrained (it will first shrink the resulting Rectangle according
     * to the `minWidth` and `minHeight` properties of this rectangle), then it will try aligning at other edges
     * (honouring the `axisLock` option), and pick the fallback alignment which results in the shortest translation.
     * @param {Boolean} [spec.axisLock] Specify as a truthy value to fall back to aligning against the opposite
     * edge first if the requested alignment cannot be constrained into the `constrainTo` option. If specified
     * as `'flexible'`, then fallback will continue searching for solutions on the remaining two sides.
     * @param {Boolean} [spec.matchSize] When aligning edge-to-edge, match the length of the aligned-to
     * edge of the target. This is only honored when `axisLock` is enabled and alignment succeeds on the requested axis.
     * If __not__ aligning edge-to-edge, `matchSize` matches both dimensions of the target.
     * @param {Number|Number[]} [spec.offset] The 'x' and 'y' offset values to create an extra margin round the target
     * to offset the aligned widget further from the target. May be configured as -ve to move the aligned widget
     * towards the target - for example producing the effect of the anchor pointer piercing the target.
     * @param {Number|Number[]} [spec.constrainPadding] The amount of pixels to pad from the `constrainTo` target,
     * either a single value, or an array of values in CSS edge order.
     * @param {Boolean} [spec.rtl] Pass as true if this is being used in an RTL environment, and aligning 0% to
     * 100% along a horizontal edge must proceed from right to left.
     * @returns {Core.helper.util.Rectangle} A new Rectangle aligned as requested if possible, but if the requested position violates
     * the `constrainTo` Rectangle, the shortest translation from the requested position which obeys constraints will be used.
     */
    alignTo(spec) {


        // The target and constrainTo may be passed as HtmlElements or Widgets.
        // If so, extract the Rectangles without mutating the incoming spec.
        let result = this.clone(),
            {
                target,
                constrainTo,
                constrainPadding
            }      = spec,
            calculatedAnchorPosition, zone, resultZone, constrainingToViewport;

        if (target && !target.isRectangle) {
            target = Rectangle.from(target.element ? target.element : target);
        }
        if (constrainTo) {
            if (!constrainTo.isRectangle) {
                // Viewport is denoted by requesting window or document.
                // document.body may overflow the viewport, so this must not be evaluated as the viewport.
                constrainingToViewport = constrainTo === globalThis || constrainTo === document;

                // When rectangle is constrained to some element on the page other than window/document, page scroll
                // should not be taken into account
                const ignorePageScroll = 'ignorePageScroll' in spec ? spec.ignorePageScroll : !constrainingToViewport;

                constrainTo = Rectangle.from(constrainTo.element ? constrainTo.element : constrainTo, null, ignorePageScroll);
            }

            // Shrink the constrainTo Rectangle to account for the constrainPadding
            if (constrainPadding) {
                // An array may be used to specify sides in the CSS standard order.
                // One value means all sides reduce by the same amount.
                constrainPadding = parseEdges(constrainPadding);

                // If we are aligning to an element which is closer to an edge than the
                // constrainPadding value for that edge, override the constrainPadding so that
                // the visual alignment is maintained.
                constrainPadding[0] = Math.min(constrainPadding[0], target.top);
                constrainPadding[1] = Math.min(constrainPadding[1], constrainTo.right - target.right);
                constrainPadding[2] = Math.min(constrainPadding[2], constrainTo.bottom - target.bottom);
                constrainPadding[3] = Math.min(constrainPadding[3], target.left);
                // Must clone a passed Rectangle so as not to mutate objects passed in.
                constrainTo         = constrainTo.deflate.apply(constrainTo.clone(), constrainPadding);
            }
        }
        const me                  = this,
            targetOffsets       = createOffsets(spec.offset),
            {
                align,
                axisLock,
                anchorSize,
                anchorPosition,
                matchSize,
                position,
                rtl
            }                   = spec,
            isPoint             = target && (target.width < 2 && target.height < 2),
            alignSpec           = parseAlign(align, rtl),
            targetConstrainRect = constrainTo && constrainTo.clone(),
            constraintZones     = [],
            zoneOrder           = [{
                zone : zone = alignSpec.startZone,
                align
            }],
            matchDimension      = matchSize && matchDimensions[alignSpec.startZone & 1],
            originalSize        = me[matchDimension];

        // Match the size of the edge we are aligning against
        if (matchDimension && axisLock) {
            result[matchDimension] = target[matchDimension];
        }
        // If we are not aligning to an edge, match both dimensions
        else if (!alignSpec.edgeAligned && matchSize) {
            result.width  = target.width;
            result.height = target.height;
        }

        // Ensure we will fit before trying
        if (constrainTo) {
            result.constrainTo(constrainTo);
        }

        // If we are aligning edge-to-edge, then plan our fallback strategy when we are constrained.
        if (constrainTo && alignSpec.startZone != null) {
            // Create the list of zone numbers and alignments to try in the preferred order.
            //
            // In the case of axisLock, go through the zones by each axis.
            // So if they asked for t-b, which is zone 2,
            // the array will be [2, 0, 3, 1] (t-b, b-t, r-l, l-r)
            if (axisLock) {
                // First axis flip has to maintain the offset along that axis.
                // so align: l0-r0 has to flip to align: r0-l0. See submenu flipping when
                // constrained to the edge. It flips sides but maintains vertical position.
                zoneOrder.push({
                    zone  : zone = (zone + 2) % 4,
                    align : flipAlign(alignSpec)
                });

                // Only try the other axis is axisLock is 'flexible'
                if (axisLock === 'flexible') {
                    zoneOrder.push({
                        zone  : zone = (alignSpec.startZone + 1) % 4,
                        align : defaultAlignments[zone]
                    });
                    zoneOrder.push({
                        zone  : zone = (zone + 2) % 4,
                        align : defaultAlignments[zone]
                    });
                }
            }
            // Go through the zones in order from the requested start.
            // So if they asked for t-b, which is zone 2,
            // the array will be [2, 3, 0, 1] (t-b, r-l, b-t, l-r)
            else {
                for (let i = 1; i < 4; i++) {
                    zoneOrder.push({
                        zone  : zone = (zone + 1) % 4,
                        align : defaultAlignments[zone]
                    });
                }
            }
        }

        // Allow them to pass anchorPosition: {x: 10} to indicate that after a fully successful,
        // unconstrained align, the anchor should be 10px from the start.
        if (anchorPosition) {
            const pos = (alignSpec.startZone & 1) ? 'y' : 'x';

            calculatedAnchorPosition = {
                [pos] : anchorPosition[pos],
                edge  : edgeNames[(alignSpec.startZone + 2) % 4]
            };
        }

        // Keep the target within reach. If it's way outside, pull it back so that it's only just outside);
        if (targetConstrainRect && target) {
            targetConstrainRect.adjust(-target.width, -target.height, target.width, target.height);
            target.constrainTo(targetConstrainRect);
        }

        // As part of fallback process when fitting within constraints, result may shrink to our minima
        result.minWidth  = me.minWidth;
        result.minHeight = me.minHeight;

        // We're being commanded to try to align at a position
        if (position) {
            result.moveTo(position.x, position.y);
            result.translate.apply(result, targetOffsets);
            if (constrainTo) {
                result.constrainTo(constrainTo);
            }
        }

        // We're aligning to a Target Rectangle within a ConstrainTo Rectangle, taking into account
        // a possible anchor pointer, or x/y offsets. Here's the situation:
        //
        //                             <-- ConstrainTo Rectangle -->
        //  +-----------------------------------+--------------------+-------------------------+
        //  |                                   |                    |                         |
        //  |                                   |                    |                         |
        //  |                                   |                    |                         |
        //  |-----------------------------------+--------------------+-------------------------+
        //  |                                   |          ▼         |                         |
        //  |                                   | +----------------+ |                         |
        //  |                                   | |                | |                         |
        //  |                                   | |                | |                         |
        //  |                                   |▶|     Target     |◀|                         |
        //  |                                   | |                | |                         |
        //  |                                   | |                | |                         |
        //  |                                   | +----------------+ |                         |
        //  |                                   |          ▲         |                         |
        //  +-----------------------------------+--------------------+-------------------------|
        //  |                                   |                    |                         |
        //  |                                   |                    |                         |
        //  |                                   |                    |                         |
        //  +-----------------------------------+--------------------+-------------------------+
        //
        // Which results in the four possible constraint zones above, which we index in standard CSS order.
        //
        // Top    = 0
        // Right  = 1
        // Bottom = 2
        // Left   = 3
        //
        // If the initially requested alignment is not within the constrainTo rectangle
        // then, calculate these four, and then loop through them, beginning at the requested one,
        // quitting when we find a position which does not violate constraints. This includes
        // shrinking the aligning Rectangle towards its minima to attempt a fit.
        //
        // The final fallback, if there is no position which does not violate constraints
        // is to position in whichever of the four rectangles has the largest area shrinking overflowing
        // dimensions down to minima if specified.
        //
        else {
            // Offsets: If we are using an anchor to move away from the target, use anchor height in both dimensions.
            // It's rotated so that "height" always has the same meaning. It's the height of the arrow.
            const
                centerAligned = alignSpec.myEdge === 'c' || alignSpec.targetEdge === 'c',
                offsets       = anchorSize && !centerAligned ? [anchorSize[1] + targetOffsets[0], anchorSize[1] + targetOffsets[1]] : targetOffsets;

            const
                baseTargetPoint = target.getAlignmentPoint(alignSpec.targetAlignmentPoint),
                targetPoint     = target.getAlignmentPoint(alignSpec.targetAlignmentPoint, offsets),
                myPoint         = result.getAlignmentPoint(alignSpec.myAlignmentPoint);
                // Calculate before doing the translation whether the result being asked for
                // is an overlap position with the target, eg t0-t0, c-c etc
                // If we're aligning to a point 1x1 or less, there is no overlap.
            let overlap         = !isPoint && result.clone().translate(baseTargetPoint[0] - myPoint[0], baseTargetPoint[1] - myPoint[1]).intersect(target, true);

            result.translate(targetPoint[0] - myPoint[0], targetPoint[1] - myPoint[1]);

            // If we are aligned over our target, we just obey that within any constraint.
            // No complex edge alignment attempts to fall back to.
            if (overlap) {
                // Technically, we could deduce "overlap" from the align spec but it is rather complex. Roughly this:
                //
                //  - if myEdge.isOpposite(targetEdge) then overlap = false
                //  - else if myEdge === targetEdge then overlap = not(one offset is 0 and the other is 100)
                //  - else overlap = true unless 0 or 100 effectively flips the adjacent edge to a corner
                //
                // Given the complexity of the above, it is easier to just do the calculation and check the result.
                // Since there is overlap, we back out the translation and re-translate w/o using the offset as a
                // margin. Then constrain and apply "offsets" as pure delta x/y.
                result.translate(-(targetPoint[0] - myPoint[0]), -(targetPoint[1] - myPoint[1]));

                // Apply the calculated translation before constraining
                result.translate(baseTargetPoint[0] - myPoint[0], baseTargetPoint[1] - myPoint[1]);
                result.translate(...offsets);

                if (constrainTo) {
                    result.constrainTo(constrainTo);
                }

                resultZone = alignSpec.startZone;
            }
            // Aligned to outside of our target, and we need to be constrained
            else if (constrainTo && !constrainTo.contains(result)) {
                const
                    requestedResult = result.clone(),
                    solutions       = [];
                let zone, largestZone;

                // Any configured anchorPosition becomes invalid now that we're having to move the resulting zone
                // to some unpredictable new place where it fits. It will have to be calculated based upon where
                // we end up aligning.
                calculatedAnchorPosition = null;

                // Calculate the four constraint zones illustrated above.
                // Top
                constraintZones[0] = zone = constrainTo.clone();
                zone.bottom        = target.y - offsets[1];

                // Right
                constraintZones[1] = zone = constrainTo.clone();
                zone.x             = target.right + offsets[0];

                // Bottom
                constraintZones[2] = zone = constrainTo.clone();
                zone.y             = target.bottom + offsets[1];

                // Left
                constraintZones[3] = zone = constrainTo.clone();
                zone.right         = target.x - offsets[0];

                // Start from the preferred edge and see if we are able to constrain to within each rectangle
                for (let i = 0; i < zoneOrder.length; i++) {
                    // Revert to incoming dimension for fallback out of axisLock
                    if (matchDimension && i === 2) {
                        result[matchDimension] = originalSize;
                    }

                    zone = constraintZones[resultZone = zoneOrder[i].zone];

                    // Perform unconstrained alignment at the calculated alignment for the zone
                    result = result.alignTo({
                        target,
                        offsets,
                        align : zoneOrder[i].align
                    });

                    // If we are able to strictly constrain into this area, then it's one of the possible solutions.
                    // We choose the solution which result in the shortest translation from the initial position.
                    if (result.constrainTo(zone, true)) {
                        solutions.push({
                            result,
                            zone : resultZone
                        });

                        // If this successful constraint is at the requested alignment, or at a fallback
                        // alignment which has used min size constraints, then that's the correct solution.
                        // If there's no size compromising, we have to pick the shortest translation.
                        if (!largestZone || result.width < me.width || result.height < me.height) {
                            result.align = zoneOrder[i].align;
                            break;
                        }
                    }

                    // Cache the largest zone we find in case we need the final fallback.
                    if (!largestZone || zone.area > largestZone.area) {
                        const r = result.clone();

                        // And just move the result clone into the edge zone
                        switch (resultZone) {
                            // Top
                            case 0:
                                r.moveTo(null, zone.bottom - r.height);
                                break;
                            // Right
                            case 1:
                                r.moveTo(zone.left);
                                break;
                            // Bottom
                            case 2:
                                r.moveTo(null, zone.top);
                                break;
                            // Left
                            case 3:
                                r.moveTo(zone.right - r.width);
                                break;
                        }

                        largestZone = {
                            area   : zone.area,
                            result : r,
                            zone   : resultZone
                        };
                    }
                }

                // The loop found at least one solution
                if (solutions.length) {
                    // Multiple fallbacks with no axisLock.
                    // Use the solution which resulted in the shortest translation distance from the requested alignment.
                    if (solutions.length > 1 && !axisLock) {
                        solutions.sort((s1, s2) => {
                            const
                                s1TranslationDistance = Math.sqrt((requestedResult.x - s1.result.x) ** 2 + (requestedResult.y - s1.result.y) ** 2),
                                s2TranslationDistance = Math.sqrt((requestedResult.x - s2.result.x) ** 2 + (requestedResult.y - s2.result.y) ** 2);

                            return s1TranslationDistance - s2TranslationDistance;
                        });
                    }
                    // Initial success, or axisLock. Use first successful solution.
                    result     = solutions[0].result;
                    resultZone = solutions[0].zone;
                }
                // No solutions found - use the largest rectangle.
                else {
                    result     = largestZone.result;
                    resultZone = largestZone.zone;

                    // When we are constraining to the viewport, we must still must be constrained,
                    // even after we've given up making it align *and* constrain.
                    if (constrainingToViewport) {
                        result.constrainTo(constrainTo);
                    }
                }
            }
            else {
                resultZone = alignSpec.startZone;
            }

            // If we are aligning to a 1 pixel point, then overlap is not relevant, and we
            // take it that we are aligning to the opposite edge of our edge so that an anchor
            // can be calculated if requested.
            if (isPoint) {
                result.overlap = overlap = false;
            }
            else {
                result.overlap = overlap = result.intersect(target, true);
            }

            result.zone = resultZone;

            // If they included an anchor, calculate its position along its edge.

            if (anchorSize && !overlap) {
                // If we were passed an anchorPosition, and it has remained valid (meaning the requested
                // alignment succeeded with no constraint), then anchorPosition will be set. If not,
                // we have to calculate it based upon the aligned edge.
                if (!calculatedAnchorPosition) {
                    const
                        isLeftOrRight = resultZone & 1,
                        start         = isLeftOrRight ? 'y' : 'x',
                        end           = isLeftOrRight ? 'bottom' : 'right',
                        startValue    = Math.max(target[start], result[start]),
                        endValue      = Math.min(target[end], result[end]);
                    let anchorStart   = (startValue + (endValue - startValue) / 2 - anchorSize[0] / 2);
                    const anchorEnd   = anchorStart + anchorSize[0];

                    if (anchorEnd > result[end]) {
                        anchorStart -= (anchorEnd - result[end]);
                    }
                    if (anchorStart < result[start]) {
                        anchorStart += (result[start] - anchorStart);
                    }

                    // Return an anchor property which will have an x or y property and an edge name onto which the
                    // arrow should be aligned.
                    calculatedAnchorPosition = {
                        [start] : anchorStart - result[start],
                        edge    : edgeNames[(resultZone + 2) % 4]
                    };
                }

                result.anchor = calculatedAnchorPosition;
            }
        }

        return result;
    }

    /**
     * Returns the `[x, y]` position of the specified anchor point of this Rectangle in <edge><offset> format.
     * for example passing "t50" will return the centre point of the top edge, passing "r0" will return the start
     * position of the right edge (the top right corner).
     *
     * Note that the offset defaults to 50, so "t" means the centre of the top edge.
     * @param {String} alignmentPoint The alignment point to calculate. Must match the RegExp `[trbl]\d*`
     * @param {Number[]} margins The `[x, y]` margins to add from the left/right, top/bottom edge.
     * @internal
     */
    getAlignmentPoint(alignmentPoint, margins = zeroOffsets) {
        alignmentPoint = String(alignmentPoint);

        const
            me         = this,
            parts      = alignPointRe.exec(alignmentPoint) || alignSpecRe.exec(alignmentPoint),
            edge       = parts && parts[1].toLowerCase(),
            edgeOffset = parts && Math.min(Math.max(parseInt(parts[2] || 50), 0), 100) / 100;



        switch (edge) {
            case 't':
                return [me.x + me.width * edgeOffset, me.y - margins[1]];
            case 'r':
                return [me.right + margins[0], me.y + me.height * edgeOffset];
            case 'b':
                return [me.x + me.width * edgeOffset, me.bottom + margins[1]];
            case 'l':
                return [me.x - margins[0], me.y + me.height * edgeOffset];
            case 'c': {
                return [me.x + me.width / 2, me.y + me.height / 2];
            }
        }
    }

    /**
     * Highlights this Rectangle using the highlighting effect of {@link Core.helper.DomHelper}
     * on a transient element which encapsulates the region's area.
     */
    highlight() {
        const
            me               = this,
            highlightElement = DomHelper.createElement({
                parent : document.body,
                style  : `position:absolute;z-index:9999999;pointer-events:none;
                            left:${me.x}px;top:${me.y}px;width:${me.width}px;height:${me.height}px`
            });

        return DomHelper.highlight(highlightElement).then(() => highlightElement.remove());
    }

    /**
     * Visualizes this Rectangle by adding a DOM element which encapsulates the region's area into the provided parent element.
     * @param {DomConfig} config Element config object
     * @returns {Element} The highlight element
     * @internal
     */
    visualize(config, asDomConfig) {
        const
            me        = this,
            domConfig = ObjectHelper.merge({
                style : {
                    left          : `${me.x}px`,
                    top           : `${me.y}px`,
                    width         : `${me.width}px`,
                    height        : `${me.height}px`,
                    pointerEvents : 'none',
                    // If this visualization is provided a CSS class, let outside handle position + z-index
                    ...(config.class ? {} : { position : 'absolute', 'z-index' : 9999999 })
                }
            }, config);
        return asDomConfig ? domConfig : DomHelper.createElement(domConfig);
    }

    toString(delimiter = ',') {
        return [`${this.top}px`, `${this.right}px`, `${this.bottom}px`, `${this.left}px`].join(delimiter);
    }


}

/**
 * Encapsulates an X,Y coordinate point.
 *
 * This class uses named export from {@link Core.helper.util.Rectangle} module.
 *
 * Importing from sources:
 * ```javascript
 * import { Point } from 'path-to-lib/Core/helper/util/Rectangle.js';
 * ```
 *
 * @extends Core/helper/util/Rectangle
 */
export class Point extends Rectangle {
    /**
     * Creates a new Point encapsulating the event's page position.
     * @param {Event} event The DOM event
     * @returns {Core.helper.util.Rectangle}
     * @typings ignore
     */
    static from(event, relativeToPage = VersionHelper.checkVersion('core', '6.0', '>=')) {
        const
            propName = relativeToPage ? 'client' : 'screen';

        if (event.changedTouches) {
            event = event.changedTouches[0];
        }

        const
            x = event[`${propName}X`],
            y = event[`${propName}Y`];

        return new this(x, y);
    }

    /**
     * Constructs a Point
     * @param x The X coordinate
     * @param y The Y coordinate
     */
    constructor(x, y) {
        super(x, y, 0, 0);
    }

    /**
     * Coerces this Point to be within the passed Rectangle. Translates it into the bounds.
     * @param {Core.helper.util.Rectangle} into The Rectangle into which to coerce this Point.
     */
    constrain(into) {
        this.x = Math.min(Math.max(this.x, into.x), into.right - 1);
        this.y = Math.min(Math.max(this.y, into.y), into.bottom - 1);
        return this;
    }

    toArray() {
        return [this.x, this.y];
    }
}
