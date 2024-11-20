import Container from './Container.js';
import Widget from './Widget.js';
import PanelCollapser from './panel/PanelCollapser.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import EventHelper from '../helper/EventHelper.js';
import DomClassList from '../helper/util/DomClassList.js';
import DomHelper from '../helper/DomHelper.js';
import FunctionHelper from '../helper/FunctionHelper.js';
import DynamicObject from '../util/DynamicObject.js';
import State from '../mixin/State.js';
import Toolable from './mixin/Toolable.js';

import './Toolbar.js';

/**
 * @module Core/widget/Panel
 */

/**
 * An object that describes a Panel's header.
 *
 * @typedef {Object} PanelHeader
 * @property {String|Object} [cls] Additional CSS class or classes to add to the header element.
 * @property {'top'|'right'|'bottom'|'left'} [dock="top"] Specify "left", "bottom", or "right" to control panel edge to which the header docks.
 * @property {String} title
 * @property {'start'|'center'|'end'} [titleAlign="start"] Specify "center" or "end" to align the panel's title differently.
 */

const
    acceptNode      = e => !e.classList.contains('b-focus-trap') && DomHelper.isFocusable(e) ? DomHelper.NodeFilter.FILTER_ACCEPT : DomHelper.NodeFilter.FILTER_SKIP,
    emptyArray      = [],
    emptyObject     = {},
    emptySplit      = [emptyArray, emptyArray],

    finishBodyWrap = (config, classes, final) => {
        const { vertical } = config;

        delete config.vertical;

        return {
            ...config,
            class : {
                ...classes,
                [`b-${vertical ? 'v' : 'h'}box`] : 1,
                'b-box-center'                   : 1,
                'b-panel-bar-wrap'               : !final
            }
        };
    },

    wrapBody = (inner, bodyWrapTag, vertical = false) => {
        const wrap = {
            vertical,
            children : inner ? [inner] : []
        };

        if (bodyWrapTag) {
            wrap.tag = bodyWrapTag;
        }

        return wrap;
    },

    setCls = (elOrConfig, cls) => {
        if (elOrConfig?.classList) {
            elOrConfig?.classList.add(cls);
        }
        else if (elOrConfig?.class) {
            if (typeof elOrConfig.class === 'string') {
                elOrConfig.class = { [elOrConfig.class] : 1 };
            }
            elOrConfig.class[cls] = 1;
        }
    },

    barConfigs = {
        dock   : 1,
        hidden : 1,
        weight : 1
    },

    dockDirection = {
        //       [vertical, before]
        top    : [true, true],
        bottom : [true, false],
        left   : [false, true],
        right  : [false, false]
    },

    headerDock = {
        header       : 1,
        'pre-header' : 1
    };

/**
 * Panel widget is a general purpose container which may be used to contain child {@link Core.widget.Container#config-items}
 * or {@link Core.widget.Widget#config-html}.
 *
 * Also may dock a {@link #config-header} and {@link #config-footer} either at top/bottom or left/right
 *
 * ```javascript
 * let panel = new Panel({
 *   title : 'A Test Panel',
 *   items : {
 *     customerName : { type : 'text', placeholder: 'Text' },
 *   },
 *   bbar : {
 *     items : {
 *       proceedButton : {
 *         text : 'Proceed',
 *         onClick : () => {
 *           alert('Proceeding!');
 *         }
 *       }
 *     }
 * });
 * ```
 *
 * {@inlineexample Core/widget/Panel.js}
 *
 * @mixes Core/mixin/State
 * @mixes Core/widget/mixin/Toolable
 * @extends Core/widget/Container
 * @classtype panel
 * @widget
 */
export default class Panel extends Container.mixin(State, Toolable) {
    //region Config

    static $name = 'Panel';

    static type = 'panel';

    static get configurable() {
        return {
            localizableProperties : ['title'],

            /**
             * Controls whether the panel is collapsed (the body of the panel is hidden while only the header is
             * visible). Only valid if the panel is {@link #config-collapsible}.
             * @config {Boolean}
             * @category Layout
             */
            collapsed : {
                value   : null,
                $config : null,
                default : false
            },

            /**
             * This config enables collapsibility for the panel. See {@link #config-collapsed}.
             *
             * For example:
             * ```javascript
             *      {
             *          type        : 'panel',
             *          collapsible : true
             *      }
             * ```
             * This is managed by an instance of {@link Core.widget.panel.PanelCollapser} which can be configured if an
             * object is passed for this config property:
             * ```javascript
             *      {
             *          type        : 'panel',
             *          collapsible : {
             *              direction : 'left'
             *          }
             *      }
             * ```
             * The config object form can contain a `type` property to specify the type of collapse the panel will use.
             * This property can be one of the following:
             *
             * - `'inline'` (see {@link Core.widget.panel.PanelCollapser})
             * - `'overlay'` (see {@link Core.widget.panel.PanelCollapserOverlay})
             *
             * @config {Boolean|PanelCollapserConfig|PanelCollapserOverlayConfig}
             * @category Layout
             */
            collapsible : {
                value   : null,
                $config : 'nullify'
            },

            /**
             * Custom CSS classes to add to the panel's body element.
             *
             * May be specified as a space separated string, or as an object in which property names
             * with truthy values are used as the class names:
             *
             * ```javascript
             *  bodyCls : {
             *      'b-my-class'     : 1,
             *      [this.extraCls]  : 1,
             *      [this.activeCls] : this.isActive
             *  }
             *  ```
             *
             * @config {String|Object}
             * @category CSS
             */
            bodyCls : {
                $config : {
                    merge : 'classList'
                },

                value : null
            },

            bodyTag     : null,
            bodyWrapTag : null,

            /**
             * By default, tabbing within a Panel is not contained, ie you can TAB out of the Panel
             * forwards or backwards.
             * Configure this as `true` to disallow tabbing out of the Panel, and make tabbing circular within this Panel.
             * @config {Boolean}
             * @default false
             * @category Content
             */
            trapFocus : null,

            /**
             * Get/set this Panel's title which is used when the panel has a header, or is part of a TabPanel. If a
             * header has been disabled by configuring the {@link #config-header}as `false`, setting it will have no
             * effect.
             * @member {String} title
             */
            /**
             * A title to display in the header or owning TabPanel. Causes creation and docking of a header
             * to the top if no header is configured.
             *
             * If specified, overrides any title configured within the {@link #config-header} configuration.
             * @default
             * @config {String}
             * @category Misc
             */
            title : null,

            /**
             * A config {@link PanelHeader object} for the panel's header or a string in place of a `title`.
             *
             * Configuring this as `false` explicitly removes the header bar, overriding any
             * {@link #config-tools} or {@link #config-title} configs.
             * @default
             * @config {String|Boolean|PanelHeader}
             * @category Content
             */
            header : null,

            stateful : ['collapsed'],

            /**
             * An object containing config defaults for corresponding {@link #config-strips} objects with a matching name.
             *
             * By default, this object contains the keys `'bbar'` and `'tbar'` to provide default config values for the
             * {@link #config-bbar} and {@link #config-tbar} configs.
             *
             * This object also contains a key named `'*'` with default config properties to apply to all strips. This
             * object provides the default `type` (`'toolbar') and {@link Core.widget.Widget#config-dock} (`'top'`)
             * property for strips.
             * @config {Object} stripDefaults
             * @internal
             * @category Content
             */
            stripDefaults : {
                '*' : {
                    type : 'toolbar',
                    dock : 'top'
                },

                bbar : {
                    dock   : 'bottom',
                    weight : -1000
                },

                tbar : {
                    weight : -1000
                }
            },

            /**
             * An object containing widgets keyed by name. By default (when no `type` is given), strips are
             * {@link Core.widget.Toolbar toolbars}. If you want to pass an array, you can use
             * the toolbar's {@link Core.widget.Container#config-items}.
             *
             * The {@link #config-bbar} and {@link #config-tbar} configs are shortcuts for adding toolbars to the
             * panel's `strips`.
             *
             * Strips are arranged based on their {@link Core.widget.Widget#config-dock} and
             * {@link Core.widget.Widget#config-weight} configs.
             *
             * For widgets using a `dock` of `'top'`, `'bottom'`, `'left'`, `'right'`, `'start'` or `'end'`(an "edge
             * strip"), the higher the `weight` assigned to a widget, the closer that widget will be to the panel body.
             *
             * For widgets with `'header'` or `'pre-header'` for `dock` (a "header strip"), higher `weight` values
             * cause the widget to be placed closer to the panel's title.
             *
             * ```javascript
             *  new Panel({
             *      title : 'Test',
             *      html  : 'Panel strip test',
             *      strips : {
             *          left : {
             *              dock  : 'left'
             *              items : [{
             *                  text : 'Go'
             *                }]
             *          }
             *      }
             *  });
             *
             * // Pass an array to tbar
             * strips : {
             *     tbar : {
             *         items: [
             *             {
             *                 type : 'button',
             *                 text : 'Add column',
             *                 icon : 'b-fa-plus',
             *                 onAction : ({ source }) => addColumn(source.element)
             *             },
             *             `Today is ${getCurrentDate()}` // consider 'getCurrentDate()` a custom function
             *         ]
             *     }
             * }
             * ```
             * @config {Object<String,ContainerItemConfig>} strips
             * @category Content
             */
            strips : {
                value   : null,
                $config : 'nullify'
            },

            toolDefaults : {
                close : {
                    weight : -1000
                },

                collapse : {
                    weight : -990
                }
            },

            /**
             * Config object of a footer. May contain a `dock`, `html` and a `cls` property. A footer is not a widget,
             * but rather plain HTML that follows the last element of the panel's body and {@link #config-strips}.
             *
             * The `dock` property may be `top`, `right`, `bottom`, `left`, `start` or `end`
             *
             * @config {Object|String}
             * @property {'top'|'right'|'bottom'|'left'|'start'|'end'} dock Where to dock
             * @property {String} html Html to populate the footer with
             * @property {String} cls CSS class to add to the footer
             * @default
             * @category Content
             */
            footer : null,

            /**
             * This config is used with {@link Core.widget.panel.PanelCollapserOverlay} to programmatically control the
             * visibility of the panel's body. In this mode of collapse, the body of a collapsed panel is a floating
             * overlay. Setting this config to `true` will show this element, while `false` will hide it.
             * @config {Boolean}
             * @private
             */
            revealed : null,

            /**
             * The tool Widgets as specified by the {@link #config-tools} configuration
             * (and the {@link Core.widget.Popup#config-closable} configuration in the Popup subclass).
             * Each is a {@link Core.widget.Widget} instance which may be hidden, shown and observed and styled
             * just like any other widget.
             *
             * ```javascript
             * panel.tools.add = {
             *     cls : 'b-fa b-fa-plus',
             *     handler() {
             *         // Clicked the tool
             *     }
             * }
             * ```
             * @member {Object<String,Core.widget.Tool>} tools
             * @accepts {Object<String,Core.widget.Tool|ToolConfig>}
             */
            /**
             * The {@link Core.widget.Tool tools} to add either before or after the `title` in the Panel header. Each
             * property name is the reference by which an instantiated tool may be retrieved from the live
             * `{@link Core.widget.mixin.Toolable#property-tools}` property.
             * ```javascript
             * new Panel({
             *     ...
             *     tools : {
             *         add : {
             *             cls : 'b-fa b-fa-plus',
             *             handler() {
             *                 // Clicked the tool
             *             }
             *         }
             *     }
             * });
             * ```
             * @config {Object<string,ToolConfig>} tools
             * @category Content
             */

            /**
             * Get toolbar {@link Core.widget.Toolbar} docked to the top of the panel
             * @member {Core.widget.Toolbar} tbar
             * @readonly
             * @category Content
             */
            /**
             * A Config object representing the configuration of a {@link Core.widget.Toolbar},
             * or array of config objects representing the child items of a Toolbar.
             * This creates a toolbar docked to the top of the panel immediately below the header.
             *
             * To add toolbars not docked to the top, see {@link #config-bbar} and {@link #config-strips}.
             *
             *```javascript
             * // Text only
             * tbar : ['Project Timeline Overview', '->', 'Key Milestones & Deadlines'],
             *
             * // Buttons
             * tbar : [
             *    {
             *       type     : 'button',
             *       ref      : 'addButton',
             *       text     : 'Add column',
             *       icon     : 'b-fa-plus',
             *       tooltip  : 'Add new column',
             *       onAction : ({ source }) => addColumn(source.element) // add new column
             *   },
             *   {
             *       type     : 'button',
             *       ref      : 'removeButton',
             *       text     : 'Remove last',
             *       icon     : 'b-fa-minus',
             *       tooltip  : 'Remove last column',
             *       onAction : () => grid.columns.count > 1 && grid.columns.last.remove() // remove last column
             *   }
             * ]
             *
             * // ToolbarConfig
             * tbar : {
             *     height : '4em',
             *     items  : {
             *         button1 : { text : 'A button', icon : 'b-fa b-fa-plus' },
             *         button2 : { text : 'Right button 1', icon : 'b-fa b-fa-trash', style : 'margin-left:auto' },
             *         button3 : { icon : 'b-fa b-fa-gear' }
             *     }
             * }
             * ```
             *
             * @config {Array<ContainerItemConfig|String>|ToolbarConfig}
             * @typings {Array<ContainerItemConfig|String>||ToolbarConfig||PagingToolbarConfig}
             * @category Content
             */
            tbar : null,

            /**
             * Get toolbar {@link Core.widget.Toolbar} docked to the bottom of the panel
             * @member {Core.widget.Toolbar} bbar
             * @readonly
             * @category Content
             */
            /**
             * A Config object representing the configuration of a {@link Core.widget.Toolbar},
             * or array of config objects representing the child items of a Toolbar. Another way to add a bbar is to use {@link #config-strips}.
             *
             * ```javascript
             * // Text only
             * bbar : [`Total number of students: ${totalStds}`, '->', `Passed Students: ${passedStds}`],
             *
             * // Buttons
             * bbar : [
             *    {
             *       type     : 'button',
             *       ref      : 'addButton',
             *       text     : 'Add column',
             *       icon     : 'b-fa-plus',
             *       tooltip  : 'Add new column',
             *       onAction : ({ source }) => addColumn(source.element) // add new column
             *   },
             *   {
             *       type     : 'button',
             *       ref      : 'removeButton',
             *       text     : 'Remove last',
             *       icon     : 'b-fa-minus',
             *       tooltip  : 'Remove last column',
             *       onAction : () => grid.columns.count > 1 && grid.columns.last.remove() // remove last column
             *   }
             * ]
             *
             * // ToolbarConfig
             * bbar : {
             *     height : '4em',
             *     items  : {
             *         button1 : { text : 'A button', icon : 'b-fa b-fa-plus' },
             *         button2 : { text : 'Right button 1', icon : 'b-fa b-fa-trash', style : 'margin-left:auto' },
             *         button3 : { icon : 'b-fa b-fa-gear' }
             *     }
             * }
             * ```
             *
             * This creates a toolbar docked to the bottom of the panel immediately above the footer.
             * @config {Array<ContainerItemConfig|String>|ToolbarConfig}
             * @typings {Array<ContainerItemConfig|String>||ToolbarConfig||PagingToolbarConfig}
             * @category Content
             */
            bbar : null,

            role : 'region'
        };
    }

    //endregion

    /**
     * A header {@link #config-tools tool} has been clicked.
     * @event toolClick
     * @param {Core.widget.Tool} source - This Panel.
     * @param {Core.widget.Tool} tool - The tool which is being clicked.
     */
    /**
     * Fires when a Panel is collapsed using the {@link Core.widget.Panel#config-collapsible} setting.
     * @event collapse
     * @param {Core.widget.Panel} source - This Panel.
     */
    /**
     * Fires when a Panel is expanded using the {@link Core.widget.Panel#config-collapsible} setting.
     * @event expand
     * @param {Core.widget.Panel} source - This Panel.
     */

    //region Composition

    updateElement(element, oldElement) {
        const result = super.updateElement(element, oldElement);

        if (this.titleElement) {
            DomHelper.setAttributes(this.ariaElement, {
                'aria-describedby' : this.titleElement.id
            });
        }

        return result;
    }

    changeFooter(footer) {
        if (footer) {
            if (footer.dock === 'start') {
                footer.dock = 'left';
            }
            else if (footer.dock === 'end') {
                footer.dock = 'right';
            }
        }

        return footer;
    }

    compose() {
        const
            me = this,
            { collapsible, focusable, hasItems, revealed, tools } = me,
            header = me.composeHeader(),
            horz = header?.class['b-dock-left'] || header?.class['b-dock-right'];

        let body = me.composeBody(),
            key  = 'bodyWrapElement';

        if (collapsible) {
            [key, body] = collapsible.wrapCollapser(key, body);
        }

        return {
            tabIndex : ((hasItems && focusable !== false) || focusable) ? 0 : null,

            class : {
                [`b-panel-collapsible-${collapsible?.type}`]     : collapsible,
                [`b-panel-collapse-${collapsible?.collapseDir}`] : collapsible,
                [`b-${horz ? 'h' : 'v'}box`]                     : 1,
                'b-panel-collapsible'                            : collapsible,
                'b-panel-has-header'                             : header,
                'b-panel-has-tools'                              : tools ? 1 : 0,
                'b-panel-overlay-revealed'                       : revealed
            },

            children : {
                topFocusTrap : {
                    'aria-hidden' : true,
                    tabIndex      : 0,
                    class         : {
                        'b-focus-trap' : 1
                    }
                },

                // Note: we always put header before bodyWrap since it is likely (though untested) to be better for
                // a11y. We use flexbox order to make the right/bottom docking appear correct but it is likely that
                // the DOM order of the <header> element vs (optional) <footer> is important to screen readers.
                headerElement : header,

                [key] : body,

                bottomFocusTrap : {
                    'aria-hidden' : true,
                    tabIndex      : 0,
                    class         : {
                        'b-focus-trap'     : 1,
                        'b-end-focus-trap' : 1
                    }
                }
            }
        };
    }

    composeBody() {
        const
            me = this,
            { bodyCls, bodyConfig, bodyWrapTag, footer, uiClassList } = me,
            strips = ObjectHelper.values(me.strips, (k, v) => !dockDirection[v?.dock]).sort(me.byWeightSortFn),
            innermostStrips = {
                top    : null,
                right  : null,
                bottom : null,
                left   : null
            };

        let bar, before, dock, i, name, vertical, wrap;

        if (footer) {
            dock = footer.dock || 'bottom';

            strips.unshift({
                dock,
                element : {
                    tag       : 'footer',
                    reference : 'footerElement',
                    html      : (typeof footer === 'string') ? footer : footer.html,
                    class     : {
                        ...uiClassList,
                        [`b-dock-${dock}`]      : 1,
                        [`${footer.cls || ''}`] : 1
                    }
                }
            });
        }

        if (bodyCls) {
            if (!bodyConfig[name = 'className']) {
                name = 'class';
            }

            bodyConfig[name] = new DomClassList(bodyConfig[name]).assign(bodyCls);
        }

        /*
            The higher the weight, the closer to the center we place the toolbar. Consider:

                {
                    tbar : ...,
                    bbar :...,
                    strips : {
                        lbar1 : { weight : 10, ... },
                        tbar2 : { weight : 20, ... },
                        lbar2 : { weight : 30, ... },
                        rbar  : { weight : 40, ... }
                    }
                }

                +---------------------------------------------------+
                | tbar                                              |
                +---------+-----------------------------------------+
                |         | tbar2                                   |
                |         +---------+----------------------+--------+
                |         |         |                      |        |
                |  lbar1  |         |                      |        |
                |         |  lbar2  |                      |  rbar  |
                |         |         |                      |        |
                |         |         |                      |        |
                +---------+---------+----------------------+--------+
                | bbar                                              |
                +---------------------------------------------------+
         */
        for (i = strips.length; i-- > 0; /* empty */) {
            bar = strips[i];
            [vertical, before] = dockDirection[bar.dock];

            if (!wrap) {
                wrap = wrapBody(bodyConfig, bodyWrapTag, vertical);
            }
            else if (wrap.vertical !== vertical) {
                wrap = wrapBody(finishBodyWrap(wrap, uiClassList), '', vertical);
            }

            wrap.children[before ? 'unshift' : 'push'](bar.element);
            innermostStrips[bar.dock] = bar;
        }

        // Flag strips which touch the bodyElement
        setCls(innermostStrips.top, 'b-innermost');
        setCls(innermostStrips.right, 'b-innermost');
        setCls(innermostStrips.bottom, 'b-innermost');
        setCls(innermostStrips.left, 'b-innermost');

        const body = finishBodyWrap(wrap || wrapBody(bodyConfig, bodyWrapTag), uiClassList, true);

        body.class[`${me.layout?.containerCls}-panel`] = Boolean(me.layout?.containerCls);
        body.class['b-panel-body-wrap'] = 1;
        body.class[`b-${me.$$name.toLowerCase()}-body-wrap`] = 1;

        return body;
    }

    get hasHeader() {
        // Shortcut to avoid instantiating tools if header has been configured away
        if (this.header === false) {
            return false;
        }
        const
            { header, title, tools, parent } = this,
            hasVisibleTools                  = this.maximizable || Object.values(tools || {}).some(tool => !tool.hidden);

        // Explicitly declared header should always be shown.
        // Implicitly created from title or tools can be suppressed by parent.
        // Explicitly disabled header using false should mean no header at all.
        return header || (!parent?.suppressChildHeaders && (title || hasVisibleTools));
    }

    get rootUiClass() {
        return Panel;
    }

    composeHeader(force) {
        const me = this;

        // Don't add a header unless we have one configured, have a title or have visible tools (or are forced to)
        if (!me.hasHeader && !force) {
            return;
        }

        const
            header          = me.header || {},
            dock            = header.dock || 'top',
            [before, after] = me.splitHeaderItems({ as : 'element', dock }),
            classes         = me.$meta.hierarchy,
            title           = me.composeTitle(header),
            cls             = new DomClassList({
                [`b-dock-${dock}`] : 1,
                ...me.uiClassList
            }, header.cls);

        let i, name;

        for (i = classes.indexOf(Panel); i < classes.length; ++i) {
            name = classes[i].$$name;

            if (name !== 'Grid') {
                cls[`b-${name.toLowerCase()}-header`] = 1;
            }
        }

        const headerConfig = {
            tag      : 'header',
            class    : cls,
            children : [
                ...before,
                title,
                ...after
            ]
        };

        return me.collapsible?.composeHeader(headerConfig) || headerConfig;
    }

    composeTitle(header) {
        const
            title       = (typeof header === 'string') ? header : (this.title || header.title),
            titleConfig = {
                reference : 'titleElement',
                id        : `${this.id}-panel-title`,
                html      : title ?? '\xA0',
                class     : {
                    [`b-align-${header.titleAlign || 'start'}`] : 1,
                    'b-header-title'                            : 1,
                    ...this.uiClassList
                }
            };

        if (ObjectHelper.isObject(title)) {
            delete titleConfig.html;
            ObjectHelper.merge(titleConfig, title);
        }

        return this.collapsible?.composeTitle(titleConfig) || titleConfig;
    }

    // Needed to make title go through recompose
    updateTitle() {}

    afterRecompose() {
        super.afterRecompose();

        const
            me = this,
            { headerElement } = me;

        me._headerClickDetacher?.();
        me._headerClickDetacher = headerElement && EventHelper.on({
            element : headerElement,
            // Click might have lead to panel being destroyed (clicking close tool with `hideAction : 'destroy'`)
            click   : ev => me.trigger?.('panelHeaderClick', { event : ev })
        });
    }

    onPanelHeaderClick(info) {
        this.collapsible?.onPanelHeaderClick(info);
    }

    onInternalPaint() {
        super.onInternalPaint(...arguments);

        this.collapsible?.onPanelPaint(this);
    }

    splitHeaderItems({ as, dock, alt } = emptyObject) {
        const
            me = this,
            asElement = as === 'element',
            { collapsed } = me,
            endTools = me.getEndTools({ alt }),
            startTools = me.getStartTools({ alt }),
            strips = ObjectHelper.values(me.strips,
                (k, v) => !headerDock[v?.dock] && v.isCollapsified({ collapsed, alt }));

        let ret = emptySplit,
            after, before, i;

        if (strips.length + endTools.length + startTools.length) {
            // The "natural" order of equal weight tools/strips is: tool -> strip -> header <- strip <- tool
            ret = [
                // the problem w/mixing tools and strips is the strip weight needs to do two jobs (one when docked
                // in the body and one when docked in the header)
                before = [
                    ...startTools,
                    ...strips.filter(e => e.dock === 'pre-header').sort(me.byWeightSortFn)
                ],
                after = [
                    ...strips.filter(e => e.dock === 'header').sort(me.byWeightReverseSortFn),
                    ...endTools
                ]
            ];

            for (i = 0; i < before.length; ++i) {
                dock && before[i].syncRotationToDock?.(dock);

                if (asElement) {
                    before[i] = before[i].element;
                }
            }

            for (i = 0; i < after.length; ++i) {
                dock && after[i].syncRotationToDock?.(dock);

                if (asElement) {
                    after[i] = after[i].element;
                }
            }
        }

        return ret;
    }

    set bodyConfig(bodyConfig) {
        this._bodyConfig = bodyConfig;
    }

    get bodyConfig() {
        const
            me          = this,
            { bodyTag } = me,
            result      = ObjectHelper.merge({
                reference : 'bodyElement',
                className : {
                    ...me.getStaticWidgetClasses(Panel, '-content'),
                    'b-box-center'   : 1,
                    'b-text-content' : me.textContent && me.hasNoChildren
                }
            }, me._bodyConfig);

        if (bodyTag) {
            result.tag = bodyTag;
        }

        return result;
    }

    //endregion
    //region Configs

    changeBodyCls(cls) {
        return DomClassList.from(cls);
    }

    changeTbar(bar) {
        this.getConfig('strips');

        this.strips = {
            tbar : bar
        };

        return this.strips.tbar;
    }

    changeBbar(bar) {
        this.getConfig('strips');

        this.strips = {
            bbar : bar
        };

        return this.strips.bbar;
    }

    // Override to iterate docked Toolbars in the correct order around contained widgets.
    get childItems() {
        const
            me     = this,
            strips = ObjectHelper.values(me.strips, (k, v) => !dockDirection[v?.dock]).sort(me.byWeightSortFn),
            [before, after] = me.splitHeaderItems(),  // tools and header strips
            [before2, after2] = me.collapsible?.splitHeaderItems() || emptySplit;

        return [
            ...before,
            ...before2,
            ...after,
            ...after2,
            ...strips.filter(b => dockDirection[b.dock][1]),  // the "before" strips come before the items
            ...(me._items || emptyArray),
            ...strips.filter(b => !dockDirection[b.dock][1]).reverse()
        ];
    }

    get childItemsOrderedByRelevance() {
        const
            me                = this,
            strips            = ObjectHelper.values(me.strips, (k, v) => !dockDirection[v?.dock]).sort(me.byWeightSortFn),
            [before, after]   = me.splitHeaderItems(),  // tools and header strips
            [before2, after2] = me.collapsible?.splitHeaderItems() || emptySplit;

        return [
            ...(me._items || emptyArray),
            ...strips.filter(b => !dockDirection[b.dock][1]).reverse(),
            ...before,
            ...before2,
            ...after,
            ...after2,
            ...strips.filter(b => dockDirection[b.dock][1])
        ];
    }

    changeStrips(strips, oldStrips) {
        const
            me      = this,
            manager = me.$strips || (me.$strips = new DynamicObject({
                configName : 'strips',
                factory    : Widget,
                inferType  : false,  // the name of a bar in the strips object is not its type
                owner      : me,

                created(instance) {
                    const { dock } = instance;

                    if (!headerDock[dock] && !dockDirection[dock]) {
                        throw new Error(
                            `Invalid dock value "${dock}"; must be: top, left, right, bottom, header, or pre-header`);
                    }

                    FunctionHelper.after(instance, 'onConfigChange', (ret, { name }) => {
                        if (barConfigs[name]) {
                            me.onConfigChange({
                                name  : 'strips',
                                value : manager.target
                            });
                        }
                    });

                    instance.innerItem = false;
                    me.onChildAdd(instance);

                    instance.parent = me;  // in case we are given an instanced widget
                    instance.layout?.renderChildren();

                    if (instance.hasItems) {
                        me.hasItems = true;
                    }
                },

                setup(config, name) {
                    config = ObjectHelper.merge(ObjectHelper.clone(me.stripDefaults['*']), me.stripDefaults[name], config);

                    config.parent = me;  // so parent can be accessed during construction
                    config.ref    = name;

                    return config;
                },

                transform(config) {
                    if (Array.isArray(config)) {
                        config = {
                            items : config
                        };
                    }

                    return config || null;
                }
            }));

        manager.update(strips);

        if (!oldStrips) {
            // Only return the target once. Further calls are processed above so we need to return undefined to ensure
            // onConfigChange is called. By returning the same target on 2nd+ call, it passes the === test and won't
            // trigger onConfigChange.
            return manager.target;
        }
    }

    //endregion
    //region Collapse/Expand

    /**
     * This property is `true` if the panel is currently collapsing.
     * @property {Boolean}
     * @readonly
     * @category Layout
     */
    get collapsing() {
        return this.collapsible?.collapsing;
    }

    /**
     * This property is `true` if the panel is currently either collapsing or expanding.
     * @property {Boolean}
     * @readonly
     * @internal
     * @category Layout
     */
    get collapsingExpanding() {
        return this.collapsible?.collapsingExpanding;
    }

    /**
     * This property is `true` if the panel is currently expanding.
     * @property {Boolean}
     * @readonly
     * @category Layout
     */
    get expanding() {
        return this.collapsible?.expanding;
    }

    changeCollapsed(value) {
        const
            me = this,
            { collapsible } = me;

        me.recompose.flush();

        value = Boolean(value);

        if (!collapsible || me.changingCollapse || !me.isPainted) {  // if (the collapser is asking...)
            return value;
        }

        collapsible?.collapse({
            animation : null,
            collapsed : value
        });
    }

    changeCollapsible(collapsible, was) {
        const me = this;

        me.getConfig('tools');

        if (collapsible) {
            if (collapsible === true) {
                collapsible = {};
            }
            else if (typeof collapsible === 'string') {
                collapsible = {
                    [dockDirection[collapsible] ? 'direction' : 'type'] : collapsible
                };
            }
        }

        return PanelCollapser.reconfigure(was, collapsible, {
            owner    : me,
            defaults : {
                panel : me
            },
            cleanup() {
                if (me.collapsed) {
                    was.collapse({
                        animation : null,
                        collapsed : false
                    });
                    me._collapsed = 1;
                }
            }
        });
    }

    updateCollapsible(collapsible) {
        const
            me = this,
            tools = collapsible?.toolsConfig;

        me.tools = {
            collapse   : tools?.collapse || null,
            recollapse : tools?.recollapse || null
        };

        if (collapsible && me.isPainted && me.collapsed) {
            me._collapsed = 1;
        }

        if (me.collapsed === 1) {
            me.collapsed = true;
        }
    }

    _collapse(collapsed, options) {
        if (options !== true && options !== undefined) {
            // allow expand(false) to be equivalent to collapse(true)
            // or collapse(false) to be equivalent to expand(true)
            if (options === false) {
                collapsed.collapsed = !collapsed.collapsed;
            }
            else if (typeof options === 'number') {
                collapsed.animation = {
                    duration : options
                };
            }
            else if (options === null) {
                collapsed.animation = options;
            }
            else if (options === true) {
                // ignore
            }
            // Must be an options object...
            else if ('animation' in options) {
                ObjectHelper.merge(collapsed, options);
            }
            else {
                collapsed.animation = options;
            }
        }

        return this.collapsible?.collapse(collapsed);
    }

    collapse(options) {
        return this._collapse({ collapsed : true }, options);
    }

    expand(options) {
        return this._collapse({ collapsed : false }, options);
    }

    /**
     * Toggles collapsed state of the panel.
     * Collapses an expanded or expands a collapsed panel.
     * @privateparam [options] options object with animation config (for internal use)
     * @returns {Boolean} `true` value for collapsed panel or `false` for expanded
     */
    toggleCollapsed(options) {
        return this.collapsed ? this.expand(options) : this.collapse(options);
    }

    //endregion
    //region Misc

    get expandedHeaderDock() {
        return this._expandedHeaderDock ?? this.initialConfig.header?.dock ?? 'top';
    }

    set expandedHeaderDock(v) {
        this._expandedHeaderDock = v?.toLowerCase();
    }

    updateHeader(header) {
        if (!this.changingCollapse) {
            this.expandedHeaderDock = header?.dock;
        }
    }

    updateTrapFocus(trapFocus) {
        const me = this;

        me.element.classList[trapFocus ? 'add' : 'remove']('b-focus-trapped');

        me.focusTrapListener = me.focusTrapListener?.();

        if (trapFocus) {
            me.focusTrapListener = EventHelper.on({
                element  : me.element,
                focusin  : 'onFocusTrapped',
                delegate : '.b-focus-trap',
                thisObj  : me
            });

            // Create a TreeWalker which visits focusable elements.
            if (!me.treeWalker) {
                me.treeWalker = this.setupTreeWalker(me.element, DomHelper.NodeFilter.SHOW_ELEMENT, acceptNode);
            }
        }
    }

    setupTreeWalker(root, whatToShow, filter) {
        return document.createTreeWalker(root, whatToShow, filter);
    }

    onFocusTrapped(e) {
        const me         = this,
            treeWalker = me.treeWalker;

        // The only way of focusing these invisible elements is by TAB-ing to them.
        // If we hit the bottom one, wrap to the top.
        if (e.target === me.bottomFocusTrap) {
            treeWalker.currentNode = me.topFocusTrap;
            treeWalker.nextNode();
        }
        // If we hit the top one, wrap to the bottom.
        else if (e.target === me.topFocusTrap) {
            treeWalker.currentNode = me.bottomFocusTrap;
            treeWalker.previousNode();
        }
        // It was the focus trap of a child widget
        else {
            return;
        }

        me.requestAnimationFrame(() => treeWalker.currentNode.focus());
    }

    get focusElement() {
        // Either use our Containerness to yield the focus element of
        // a descendant or fall back to the encapsulating element.
        return this.hasItems && (super.focusElement || this.element);
    }

    get contentElement() {
        return this.element && this.bodyElement;
    }

    get widgetClassList() {
        const
            me         = this,
            result     = super.widgetClassList;

        if (me.hasHeader) {
            result.push('b-panel-has-header', `b-header-dock-${me.header?.dock || 'top'}`);
        }

        if (me.tbar) {
            result.push('b-panel-has-top-toolbar');
        }

        if (me.bbar) {
            result.push('b-panel-has-bottom-toolbar');
        }

        return result;
    }
}

// Register this widget type with its Factory
Panel.initClass();
