import Container from './Container.js';
import Toolable from './mixin/Toolable.js';
import FunctionHelper from '../helper/FunctionHelper.js';
import ArrayHelper from '../helper/ArrayHelper.js';
import DomHelper from '../helper/DomHelper.js';

import { canonicalDock } from './mixin/Rotatable.js';

import './layout/VBox.js';
import './Button.js';

/**
 * @module Core/widget/Toolbar
 */

const
    asElementRefs = { refs : 'element' },
    onCreateTwin  = overflowTwin => overflowTwin.element.style.margin = '',
    isToolbar     = w => w.isToolbar,
    itemScoreFn   = ent => ent[0] + (ent[1].minifiable ? 0 : 9e9),
    twinOverrides = {
        // If the initialConfig was hidden, we must override that
        hidden : false,

        // Item must obey menu's align-items : stretch style.
        width : ''
    },
    twinOverridesHorz = {
        ...twinOverrides,

        // Don't allow horizontal flex styles to apply in the vertical layout of the Menu.
        flex : ''
    },
    widthAffecting = {
        flex     : 1,
        hidden   : 1,
        maxWidth : 1,
        minWidth : 1,
        width    : 1
    },
    _axisProps = [{
        box            : 'hbox',
        clientSizeProp : 'clientWidth',
        edgeProp       : 'right',
        flexDir        : 'row',
        horizontal     : true,
        max            : 'maxX',
        overflow       : 'overflowX',
        pos            : 'x',
        scrollSize     : 'scrollWidth',
        sizeProp       : 'width'
    }, {
        box            : 'vbox',
        clientSizeProp : 'clientHeight',
        edgeProp       : 'bottom',
        flexDir        : 'column',
        horizontal     : false,
        max            : 'maxY',
        overflow       : 'overflowY',
        pos            : 'y',
        scrollSize     : 'scrollHeight',
        sizeProp       : 'height'
    }],
    defaultRepeat = {
        delay              : 0,
        startRate          : 40,
        endRate            : 200,
        accelerateDuration : 500
    },
    nonSyncedConfigs = {
        menu    : 1,
        pressed : 1
    };

/**
 * Toolbar items:
 * - `'->'` - push widgets to the right side
 * - `'|'` - add toolbar separator
 * - `WidgetConfig` - object with widget configuration
 * @typedef {'|'|'->'|ContainerItemConfig} ToolbarItems
 */

/**
 * A container widget that can contain Buttons or other widgets, and is docked to the bottom or top of
 * a {@link Core.widget.Panel Panel}.
 *
 * {@inlineexample Core/widget/Toolbar.js}
 *
 * ## Arranging widgets
 *
 * You can use the special `->` item to push widgets to the right side:
 *
 * ```javascript
 * items    : [
 *     { text : 'Left button 1', icon : 'b-fa b-fa-plus' },
 *     { text : 'Left button 2', icon : 'b-fa b-fa-minus' },
 *     '->',
 *     { text : 'Right button 1', icon : 'b-fa b-fa-gear'}
 * ]
 * ```
 *
 * {@inlineexample Core/widget/ToolbarPositioning.js}
 *
 * @extends Core/widget/Container
 * @mixes Core/widget/mixin/Toolable
 * @classtype toolbar
 * @widget
 */
export default class Toolbar extends Container.mixin(Toolable) {

    static $name = 'Toolbar';

    static type = 'toolbar';

    static get delayable() {
        return {
            syncOverflowVisibility : {
                type              : 'raf',
                cancelOutstanding : true
            } // && 50   // restore the "&& 50" here to help when debugging syncOverflowVisibility
        };
    }

    static get configurable() {
        return {
            defaultType : 'button',

            dock : 'top',

            layout : {
                type : 'box'
            },

            /**
             * An object containing typed child widget config objects or {@link Core/widget/Widget Widgets}. Can also be
             * specified as an array.
             *
             * If configured as an Object, the property names are used as the child component's
             * {@link Core.widget.Widget#config-ref} name, and the value is the child component's config object.
             *
             * ```javascript
             *  new Toolbar({
             *      appendTo : document.body
             *      items    : [{
             *          type : 'button',
             *          onClick() {
             *
             *          }
             *      }]
             *  })
             * ```
             *
             * Some special items can also be added:
             *
             * - `->` Pushes following items to the other side
             * - `|` Adds a vertical separator
             *
             * ```javascript
             *  new Toolbar({
             *      appendTo : document.body
             *      items    : [
             *      {
             *          type : 'button',
             *          text : 'Click me',
             *          onClick() {
             *
             *          }
             *      },
             *      '|', // separator
             *      {
             *          type : 'textfield',
             *          label : 'Enter name'
             *      },
             *      // Align following items to the end of the toolbar
             *      '->',
             *      {
             *          type : 'button',
             *          text : 'Save',
             *          onClick() {
             *
             *          }
             *      }]
             *  })
             * ```
             *
             * @config {Object<String,ToolbarItems|Boolean|null>|ToolbarItems[]|Core.widget.Widget[]} items
             * @category Content
             */

            /**
             * How this Toolbar should deal with items that overflow its main axis.
             *
             * Values may be:
             * - `'menu'` A button with a menu is shown and the menu contains the overflowing items.
             * - `'scroll'` The items overflow and mey be scrolled into view using the mouse or scroll buttons.
             * - `null` Disable overflow handling
             *
             * When mode is `'menu'`, clones of overflowing toolbar item are created and added to a Menu. Any config
             * changes to the original toolbar item are propagated to the menu's clone, so disabling a toolbar
             * item will make the clone in the menu disabled.
             *
             * The clone of an input field will propagate its `value` changes back to the original. The
             * overflow button, its menu, and the clones should not be accessed or manipulated by application code.
             *
             * Note that cloned items will be allocated a unique, generated ID because all IDs must be unique,
             * so CSS targeting an element ID will not apply to a clone in the overflow menu.
             *
             * Values may also be specified in object form containing the following properties:
             * @config {String|Object|null} overflow
             * @property {'scroll'|'menu'} overflow.type `'scroll'` or `'menu'`
             * @property {ClickRepeaterConfig} overflow.repeat A config object to reconfigure the
             * {@link Core.util.ClickRepeater} which controls auto repeat speed when holding down the scroll buttons
             * when `type` is `'scroll'`
             * @property {Function} overflow.filter A filter function which may return a falsy value to prevent toolbar
             * items from being cloned into the overflow menu.
             * @default 'menu'
             */
            overflow : {
                // Wait until first paint to evaluate so that we can read our CSS style.
                // Set to null on destroy which destroys the overflow Tools and Scroller.
                $config : ['lazy', 'nullify'],
                value   : {
                    type : 'menu'
                }
            },

            toolDefaults : {
                overflowMenuButton : {
                    type      : 'button',
                    hidden    : true,
                    icon      : 'b-icon-menu',
                    menuIcon  : null,
                    ariaLabel : 'Show overflowing items',

                    defaultCls : {
                        'b-overflow-button' : 1
                    }
                },

                overflowScrollEnd : {
                    handler : 'up.onEndScrollClick',
                    hidden  : true,

                    defaultCls : {
                        'b-icon-angle-right' : 1,
                        'b-overflow-button'  : 1,
                        'b-icon'             : 1
                    }
                },

                overflowScrollStart : {
                    align   : 'start',
                    handler : 'up.onStartScrollClick',
                    hidden  : true,

                    defaultCls : {
                        'b-icon-angle-left' : 1,
                        'b-overflow-button' : 1,
                        'b-icon'            : 1
                    }
                }
            },

            /**
             * Custom CSS class to add to toolbar widgets
             * @config {String}
             * @category CSS
             */
            widgetCls : null,

            /**
             * Determines if the toolbars read-only state should be controlled by its parent.
             *
             * When set to `true`, setting a parent container to read-only will not affect the widget. When set to
             * `false`, it will affect the widget.
             *
             * @category Misc
             * @config {Boolean}
             * @default
             */
            ignoreParentReadOnly : true
        };
    }

    static get prototypeProperties() {
        return {
            flexRowCls : 'b-hbox',
            flexColCls : 'b-vbox'
        };
    }

    /**
     * Returns the Core.widget.Widget[] of items to hide to clear an overflow. The `visibleItems` array should be in
     * order of the `items` in the container.
     * @param {Core.widget.Widget[]} visibleItems
     * @returns {Array}
     * @private
     */
    static getEvictionList(visibleItems) {
        // this is a static method to allow unit testing
        const ret = visibleItems.filter(it => it.overflowable !== 'none');

        ret.forEach((it, n) => ret[n] = [n, it]);
        ret.sort((a, b) => itemScoreFn(b) - itemScoreFn(a));  // b - a => reverse order

        return ret;
    }

    compose() {
        const
            me = this,
            { axisProps, dock } = me,
            endToolElementRefs = me.getEndTools(asElementRefs),
            startToolElementRefs = me.getStartTools(asElementRefs);

        return {
            class : {
                [`b-dock-${dock}`]     : 1,
                [`b-${dock}-toolbar`]  : 1,
                [`b-${axisProps.box}`] : 1
            },

            children : {
                ...startToolElementRefs,
                toolbarContent : {
                    class : {
                        'b-box-center'      : 1,
                        'b-toolbar-content' : 1
                    }
                },
                ...endToolElementRefs
            }
        };
    }

    get axisProps() {
        return _axisProps[this.layout.horizontal ? 0 : 1];
    }

    get contentElement() {
        return this.toolbarContent;
    }

    get overflowMenuButton() {
        return this.tools?.overflowMenuButton;
    }

    get overflowType() {
        const { overflow } = this;

        return (typeof overflow === 'string') ? overflow : overflow?.type;
    }

    onChildAdd(item) {
        super.onChildAdd(item);

        this.processAddedLeafItem(item);

        item.syncRotationToDock?.(this.dock);
    }

    onChildRemove(item) {
        super.onChildRemove(item);
        this.syncOverflowVisibility();
    }

    processAddedLeafItem(item) {
        // Any configurable config changes in the original are propagated to a possible clone.
        // Also a reevaluation of scroll state may be necessary. Any part of the UI may have changed,
        FunctionHelper.after(item, 'onConfigChange', this.onLeafItemConfigChange, item);

        // And all the way down. Eg, hiding a ButtonGroup must schedule a syncOverflowVisibility
        // but also hiding any of its children must also schedule a syncOverflowVisibility
        if (item.isContainer) {
            item.eachWidget(w => this.processAddedLeafItem(w));
        }
    }

    onInternalPaint({ firstPaint }) {
        super.onInternalPaint?.(...arguments);

        // Evaluate the overflow late so that we have access to styles and measurements.
        if (firstPaint) {
            this.getConfig('overflow');
        }
    }

    updateDock(dock) {
        const
            me = this,
            { layout } = me,
            { vertical } = layout;

        layout.vertical = canonicalDock(dock)[1];

        if (!me.initialItems) {
            if (vertical !== layout.vertical) {
                me.updateOverflow(me.overflow);
            }

            for (const item of me.childItems) {
                item.syncRotationToDock?.(dock);
            }
        }
    }

    updateOverflow(overflow, oldOverflow) {
        const
            me                                          = this,
            { axisProps, contentElement, overflowType } = me,
            { flexDir }                                 = axisProps,
            overflowMenu                                = me.overflowMenuButton?._menu,
            overflowTools                               = {};

        if (overflowMenu) {
            if (overflow) {
                // Save the overflowTwins from destruction
                overflowMenu?.removeAll();
            }
            else {
                // Break link between original and clone
                overflowMenu.eachWidget(overflowTwin => {
                    overflowTwin._overflowTwinOrigin.overflowTwin = null;
                });
            }
        }

        if (oldOverflow === 'menu') {
            overflowTools.overflowMenuButton = null;
        }
        else if (oldOverflow === 'scroll') {
            overflowTools.overflowScrollStart = overflowTools.overflowScrollEnd = null;
        }

        if (overflowType === 'menu') {
            // Not needed for menu type overflowing
            me.scrollable?.destroy();

            // Must allow things like Badges to escape the bounds.
            contentElement.style.overflow =
                contentElement.style.overflowX =
                    contentElement.style.overflowY = '';

            overflowTools.overflowMenuButton = {
                cls : {
                    [`b-${flexDir}-menu`] : 1
                }
            };
        }
        else if (overflowType === 'scroll') {
            const repeat = ((typeof overflow === 'object') && overflow?.repeat) || defaultRepeat;

            // We need a scroller.
            me.scrollable = {
                [axisProps.overflow] : 'hidden-scroll',
                element              : contentElement,
                internalListeners    : {
                    scroll  : 'onContentScroll',
                    thisObj : me
                }
            };

            overflowTools.overflowScrollStart = {
                repeat,
                invertRotate : true,
                cls          : {
                    [`b-${flexDir}-start-scroller`] : 1
                }
            };

            overflowTools.overflowScrollEnd = {
                repeat,
                invertRotate : true,
                cls          : {
                    [`b-${flexDir}-end-scroller`] : 1
                }
            };
        }

        me.tools = overflowTools;

        if (overflowType) {
            // Stops items from flex-shrinking down now that we have a way of showing them in full.
            contentElement.classList.add('b-overflow');

            // Need to hide/show overflow buttons when necessary
            me.monitorResize = true;
            me.syncOverflowVisibility();
        }
        else {
            contentElement.classList.remove('b-overflow');
            me.monitorResize = false;
        }
    }

    onContentScroll() {
        this.syncScrollerState();
    }

    onStartScrollClick() {
        this.scrollable[this.axisProps.pos] -= 2;
    }

    onEndScrollClick() {
        this.scrollable[this.axisProps.pos] += 2;
    }

    // Only called when monitorResize is true, which is only set when we have an overflow mode
    onInternalResize() {
        super.onInternalResize(...arguments);

        // If it's not the initial undefined->first size from the initial paint, reevaluate overflow
        if (this.isPainted) {
            this.syncOverflowVisibility();
        }
    }

    syncOverflowVisibility() {
        const
            me = this,
            { overflowType, contentElement, isVisible } = me,
            { clientSizeProp, edgeProp, sizeProp } = me.axisProps,
            { overflowMenuButton, overflowScrollStart, overflowScrollEnd } = me.tools,
            rtl = me.rtl && me.layout.horizontal,
            menuOverflow  = overflowType === 'menu',
            getAvailSpace = () => Math.ceil(
                contentElement[clientSizeProp] +
                // Since we cannot simply hide these to remove their influence, we need to add their width/height:
                ((!overflowScrollStart || overflowScrollStart.hidden) ? 0 : overflowScrollStart.rectangle('outer')[sizeProp]) +
                ((!overflowScrollEnd || overflowScrollEnd.hidden) ? 0 : overflowScrollEnd.rectangle('outer')[sizeProp])
            ),
            getContentSize = () => {
                if (visibleItems.length === 0) {
                    return 0;
                }
                // Firefox doesn't calculate scrollWidth correctly if overflow is hidden which it has to be. To get
                // around this, we use the edge of the most "extreme" widget (the one laid out last in the flow)
                const rect = visibleItems[visibleItems.length - 1].rectangle(contentElement);

                // Elements in an RTL ct are basically at right:0 and then have increasing right coordinates. To see
                // how much space is occupied we subtract the left edge of the last widget (which may be negative) from
                // the rightmost side of the contentElement container (i.e., the width).
                return Math.floor(rtl ? contentElement[clientSizeProp] - rect.left : rect[edgeProp]);  // right or bottom
                // we use Math.floor() to discard fractional px sizes of content (it is ok to just clip that)
            };

        let availableSpace, contentSize, eviction, evictionList, it, itemSize, minifiable, minifiables, minified,
            overflowable, overflowItems, visibleItems;

        // Method can be called for hidden toolbar (e.g. after event editor is hidden), bail out early in such case
        if (!isVisible || !overflowType || me.items.length === 0) {
            return;
        }

        // Prevent recursion
        me.inSyncOverflowVisibility = true;

        // Give the contents a chance to lay out with no scroll tools taking space.
        overflowMenuButton?.hide();
        // NOTE: if we hide the scroller buttons that will affect the scroll range and can trigger a scroll. The scroll
        // does not fire synchronously (at least in Chrome) so it cannot be swallowed here.

        // Iterate all leaf widgets.
        // Restore only the ones that we hid to visibility so that we can accurately ascertain overflow.
        // Collect all visible leaf widgets. These are what we are interested in hiding and showing.
        // Anything may have changed. Text inside buttons, label of fields, visibility or
        // disabled status. The only way to ascertain overflow is to show them all, and
        // force a synchronous layout by measuring the resulting scrollWidth/Height
        me.eachWidget((item, control) => {
            minifiable = item.minifiable;
            // We want to descend into containers (esp ButtonGroup) but don't want to descend into normal widgets (like
            // button's which may have menus).
            overflowable = item.overflowable;
            // falsy overflowable normally means to descend into its items, but if item is minifiable, we do not
            // descend into the widget. It becomes all or nothing just like overflowable:true. Since overflowable can
            // also be set to 'none', we need to keep whatever it has for a value if truthy.
            overflowable = minifiable ? overflowable || minifiable : overflowable;

            if (item.floating) {
                // not in the flow of the container (i.e., no space occupied in the way we handle it), so skip
                control.down = false;
            }
            else {
                control.down = !overflowable;

                if (item.innerItem) {
                    // Undo whatever we may have done to the items on a previous cycle:
                    if (item._toolbarOverflow) {
                        // Order is important here. _toolbarOverflow must be set first
                        // so that onLeafItemConfigChange doesn't recurse infinitely.
                        item.hidden = item._toolbarOverflow = false;
                    }

                    if (item._toolbarMinified) {
                        // Order is important here. _toolbarMinified must be set first
                        // so that onLeafItemConfigChange doesn't recurse infinitely.
                        item.minified = item._toolbarMinified = false;
                    }

                    if (item.isVisible) {
                        minifiable && (minifiables || (minifiables = [])).push(item);
                        overflowable && (visibleItems || (visibleItems = [])).push(item);
                    }
                }
            }
        });

        if (visibleItems) {
            availableSpace = getAvailSpace(); // get the size of the content area
            contentSize = getContentSize();
        }

        if (visibleItems && contentSize > availableSpace) {
            if (menuOverflow) {
                /*
                      |◄──────────────────────────────── contentSize ──────────────────────────────────►|
                    ┌──────────────────────────────────────────────────────────────────────────────┐
                    │┌────────────┐┌────────────┐┌────────────┐┌────────────┐┌────────────┐┌────────────┐
                    ││ visItem[0] ││ visItem[1] ││ visItem[2] ││ visItem[3] ││ visItem[4] ││ visItem[5] │
                    │└────────────┘└────────────┘└────────────┘└────────────┘└────────────┘└────────────┘
                    └──────────────────────────────────────────────────────────────────────────────┘
                                                            │
                                                            ▼
                    ┌──────────────────────────────────────────────────────────────────────────────┐
                    │                                                                         ┌───┐│
                    │                                                                         │ = ││
                    │                                                                         └─▲─┘│
                    └───────────────────────────────────────────────────────────────────────────│──┘
                    |◄──────────────────────────── availableSpace ──────────────────────────►|  │
                                                                                                │
                                                                                          overflowMenuButton

                    If any of the visibleItems is marked as "overflow = 'none'" then we skip it, and its size must
                    be accommodated by hiding other items. This means we cannot use item edges to determine when we
                    have cleared enough space, so we just use sizes (and mind the gap).

                    For example, visibleItem[5] has overflowable='none', so [4] gets hidden:

                    ┌──────────────────────────────────────────────────────────────────────────────┐
                    │┌────────────┐┌────────────┐┌────────────┐┌────────────┐┌────────────┐   ┌───┐│
                    ││ visItem[0] ││ visItem[1] ││ visItem[2] ││ visItem[3] ││ visItem[5] │   │ = ││
                    │└────────────┘└────────────┘└────────────┘└────────────┘└────────────┘   └───┘│
                    └──────────────────────────────────────────────────────────────────────────────┘
                */

                // Minify the minifiables (starting at the end) and see if that frees up enough space
                while (contentSize > availableSpace && (it = minifiables?.pop())) {
                    itemSize = contentSize;

                    // Order is important here. _toolbarMinified must be set first
                    // so that onLeafItemConfigChange doesn't recurse infinitely.
                    it._toolbarMinified = true;
                    it.minified = true;

                    contentSize = getContentSize();
                    itemSize -= contentSize;  // number of px saved by minification

                    // Remember these fellows since we may be able to revert their minification
                    (minified || (minified = [])).push([it, itemSize]);
                }

                if (contentSize > availableSpace) {
                    // Not enough space, so we'll need that overflow button (most likely)
                    overflowMenuButton.show();
                    availableSpace = getAvailSpace(); // get the new size of the content area

                    // Process the visibleItems (starting from the end) and see if any are willing to be moved to the
                    // overflow menu. We prefer to keep the minifiables
                    evictionList = Toolbar.getEvictionList(visibleItems);

                    for (eviction of evictionList) {
                        if (contentSize > availableSpace) {
                            it = eviction[1];
                            it._toolbarOverflowWidth = it.width;

                            // Order is important here. _toolbarOverflow must be set first
                            // so that onLeafItemConfigChange doesn't recurse infinitely.
                            it._toolbarOverflow = true;
                            it.hidden = true;   // hide things as we go to make getContentSize() work

                            visibleItems.splice(visibleItems.indexOf(it), 1);  // also important for getContentSize()

                            // Remember these pairs of [itemIndex, item] as we hide them so that we can add them to the
                            // menu in the correct order (the itemIndex is used make the menu item order match the
                            // toolbar order since this won't match the eviction order)
                            (overflowItems || (overflowItems = [])).push(eviction);

                            contentSize = getContentSize();
                        }
                    }

                    if (overflowItems) {
                        // Restore the items to the order in the toolbar and unwrap the entries to be just widgets
                        overflowItems.sort((a, b) => a[0] - b[0]).forEach((ent, n) => overflowItems[n] = ent[1]);

                        // Space was created by moving items out... see if we can unminify any minified items. This
                        // is a FIFO so we revert from the start, but we'll revert any items we can. We just give
                        // priority to items as we go from start to end.
                        while (minified?.length) {
                            [it, itemSize] = minified.pop();

                            // In dire cases we'll hide minified items, so check to see if the item is in the
                            // overflowItems bucket and ignore it if so:
                            if (contentSize + itemSize <= availableSpace && !it._toolbarOverflow) {
                                contentSize += itemSize;
                                it.minified = it._toolbarMinified = false;
                            }
                        }

                        me.syncOverflowMenuButton(overflowItems);
                    }
                    else {
                        overflowMenuButton.hide();  // no items were willing to move into the overflow menu...
                    }
                }
            }
            else {
                overflowScrollEnd.show();
                overflowScrollStart.show();
                me.syncScrollerState();
            }
        }
        else if (!menuOverflow) {
            overflowScrollEnd?.hide();
            overflowScrollStart?.hide();
        }

        me.inSyncOverflowVisibility = false;
    }

    syncOverflowMenuButton(overflowItems) {
        const
            me = this,
            { axisProps, overflowMenuButton } = me,
            menu = {
                cls      : 'b-toolbar-overflow-menu',
                minWidth : 280,
                items    : [],
                align    : {
                    align    : axisProps.horizontal ? 't100-b100' : 'r100-l100',
                    axisLock : 'flexible'
                }
            };

        // Add clones, or surrogates of the overflowing things to the menu.
        // Input fields will be cloned, buttons will result in a MenuItem.
        // Any Containers
        me.addToMenu(menu, overflowItems.filter(item => me.overflowItemFilter(item)));

        if (overflowMenuButton._menu?.isMenu) {
            const
                existingMenu = overflowMenuButton.menu,
                {
                    toAdd,
                    toRemove
                } = ArrayHelper.delta(menu.items, existingMenu.items, 1);

            existingMenu.remove(toRemove);

            if (existingMenu.items.length) {
                // Insert the ones which we just got too narrow to show at the top of the menu
                for (let i = toAdd.length - 1; i >= 0; i--) {
                    existingMenu.insert(toAdd[i], 0);
                }
            }
            else {
                existingMenu.add(toAdd);
            }
        }
        else {
            overflowMenuButton.menu = menu;
        }
    }

    syncScrollerState() {
        const
            me            = this,
            { axisProps, scrollable } = me,
            { overflowScrollStart, overflowScrollEnd } = me.tools,
            scrollPos    = scrollable[axisProps.pos],
            maxScrollPos = scrollable[axisProps.max];

        overflowScrollStart.disabled = !scrollPos;
        // abs for rtl, which uses negative values
        overflowScrollEnd.disabled = Math.abs(Math.ceil(scrollPos)) >= Math.abs(maxScrollPos);
    }

    overflowItemFilter(item) {
        const { filter } = this.overflow;

        return Boolean(filter
            // Allow user-defined filter
            ? filter.call(this, item)
            // If no Elements, for example displaying text which will have a Node type 3
            // or a toolbar spacer or separator, then omit it from the menu
            : DomHelper.getChildElementCount(item.element));
    }

    addToMenu(menu, overflowingItems) {
        const overrides = this.horizontal ? twinOverridesHorz : twinOverrides;

        for (const item of overflowingItems) {
            const overflowTwin = item.ensureOverflowTwin(overrides, onCreateTwin);

            menu.items.push(overflowTwin);
        }
    }

    // Note that this is called with the thisObj of the tbar item being reconfigured.
    // It propagates the new setting into its toolbar overflow clone.
    onLeafItemConfigChange(origResult, { name, value }) {
        const
            item              = this,
            toolbar           = item.up(isToolbar),
            overflow          = toolbar.hasConfig('overflow'),
            { overflowTwin } = item;

        // If it's a hide/show, and its in sync with its _toolbarOverflow state, do nothing
        if (!overflow || toolbar?.inSyncOverflowVisibility || (name === 'hidden' && value === item._toolbarOverflow)) {
            return;
        }

        // In cases where the config change cannot affect the widget's width, we can ignore the change.
        if (!widthAffecting[name]) {
            if (
                // The way fixed-width widgets manage their _width property is a bit tricky because when monitorResize
                // is in effect. The _width property holds a cached width instead of a configured one.
                (item._width != null && !item.monitorResize) ||
                // The size of a widget w/flex like '1 1 auto' (ie, the flex-basis is auto) is influenced by its content
                // so config changes could affect its size. Otherwise, the widget is sized to the toolbar's content
                // element and is unaffected by other configs.
                (item._flex && !String(item._flex).endsWith('auto'))) {
                return;
            }
        }

        // If the changed item has a clone in the overflow menu and the config is not one
        // of the unshared ones, sync the clone
        if (overflowTwin && !nonSyncedConfigs[name]) {
            overflowTwin[name] = value;
        }

        // Any part of the UI might have changed shape, so we must reevaluate scroll state.
        if (toolbar?.isPainted && item.ref !== 'overflowMenuButton') {
            if (!(item.isTextField && name === 'value' && (item.containsFocus || overflowTwin?.containsFocus))) {
                toolbar.syncOverflowVisibility();
            }
        }
    }

    createWidget(widget) {
        if (widget === '->') {
            widget = {
                type : 'widget',
                cls  : 'b-toolbar-fill'
            };
        }
        else if (widget === '|') {
            widget = {
                type : 'widget',
                cls  : 'b-toolbar-separator'
            };
        }
        else if (typeof widget === 'string') {
            widget = {
                type : 'widget',
                cls  : 'b-toolbar-text',
                html : widget
            };
        }

        const result = super.createWidget(widget);

        if (this.widgetCls) {
            result.element.classList.add(this.widgetCls);
        }

        return result;
    }
}

// Register this widget type with its Factory
Toolbar.initClass();
