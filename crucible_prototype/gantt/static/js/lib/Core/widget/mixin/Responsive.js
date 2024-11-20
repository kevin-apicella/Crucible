import Base from '../../Base.js';
import BrowserHelper from '../../helper/BrowserHelper.js';
import FunctionHelper from '../../helper/FunctionHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';
import Delayable from '../../mixin/Delayable.js';
import Fencible from '../../mixin/Fencible.js';

/**
 * @module Core/widget/mixin/Responsive
 */

const
    EMPTY = [],
    isStateName = name => name[0] !== '*',
    pop = (object, key) => {
        const ret = object[key] || null;
        delete object[key];
        return ret;
    },
    responsiveRootFn = widget => widget.responsiveRoot,
    scoring = {
        number : threshold => ({ width }) => width <= threshold && threshold
    },
    splitConfigs = configs => {
        delete configs.once;

        return {
            callback : pop(configs, 'callback'),
            configs,
            when     : pop(configs, 'when')
        };
    },
    // We cheat a bit and leave "once", "when" and "callback" in the config object for the merge.
    splitMergedConfigs = (cls, ...parts) => {
        const
            once = parts.flatMap(p => p?.once || EMPTY), // onces are not arrays, so are unchanged; ==> filter().map()
            configs = cls.mergeConfigs(...parts),
            ret = splitConfigs(configs);

        ret.once = once.length ? splitConfigs(cls.mergeConfigs(...once)) : null;

        return ret;
    },
    // Allow responsiveTarget to be a DOM element? (see git history for wrapElement impl)
    wrapWidget = (widget, handler) => {
        let triggers,
            desc = Proxy.revocable(widget, {
                get(o, name) {
                    if (triggers) {
                        triggers[name] = true;
                    }

                    return widget[name];
                }
            }),
            detacher = FunctionHelper.after(widget, 'onConfigChange', (ignore, { name }) => {
                if (triggers?.[name]) {
                    handler();
                }
            }),
            resizer = widget.ion({
                resize : () => {
                    handler();
                }
            });

        widget.monitorResize = true;

        return {
            widget,

            get object() {
                return desc?.proxy;
            },

            destroy() {
                if (desc) {
                    desc.revoke();
                    detacher();
                    resizer();

                    desc = detacher = resizer = null;
                }
            },

            reset() {
                triggers = Object.create(null);
            }
        };
    };

/**
 * A state definition object used by the {@link Core.widget.mixin.Responsive#config-responsive} config property.
 *
 * ```javascript
 *  {
 *      responsive : {
 *          small : {
 *              // a ResponsiveState object
 *              when : 400,
 *
 *              callback() {
 *                  console.log('Applied small not first time');
 *              },
 *
 *              once : {
 *                  mode : 'full',
 *
 *                  callback() {
 *                      console.log('Applied small first time');
 *                  }
 *              }
 *
 *              // All other properties are configs to apply when
 *              // the state is active
 *              text  : null,
 *              color : 'b-blue'
 *          }
 *      }
 *  }
 * ```
 *
 * See {@link Core.widget.mixin.Responsive} for more details.
 *
 * @typedef ResponsiveState
 * @property {ResponsiveState} once A `ResponsiveState` object applied only one time when a state is first activated. It
 * is not valid to specify a `when` or `once` property on these `ResponsiveState` objects. It is valid to supply a
 * `callback`, and if done, this callback will be called instead of the `callback` on the parent `ResponsiveState`
 * object on first activation.
 * @property {Function|Number} when A two argument function to return the score for the state, or a number for both the
 * width threshold and score. The arguments passed are as follows:
 *  - `widget` The {@link Core.widget.mixin.Responsive#config-responsiveTarget widget} whose properties should determine
 *  the state's score
 *  - `browserHelper` The {@link Core.helper.BrowserHelper} singleton object
 * @property {Function} [callback] An optional callback, called when the state is activated. This function receives an
 * object with the following properties:
 *  - `source` The instance whose state is being activated (typically a {@link Core.widget.Widget})
 *  - `target` The {@link Core.widget.Widget} identified as the {@link Core.widget.mixin.Responsive#config-responsiveTarget}
 *  - `state` The name of the newly active responsive state
 *  - `oldState` The name of the previously active responsive state
 */

/**
 * A breakpoint definition. Used when defining breakpoints, see {@link #config-breakpoints}.
 *
 * ```javascript
 * {
 *     name    : 'Small',
 *     configs : {
 *         text  : null,
 *         color : 'b-blue'
 *     },
 *     callback() {
 *         console.log('Applied small');
 *     }
 * }
 * ```
 *
 * @typedef Breakpoint
 * @property {String} name Name of the breakpoint
 * @property {Object} [configs] An optional configuration object to apply to the widget when the breakpoint is activated
 * @property {Function} [callback] An optional callback, called when the breakpoint is activated
 * @deprecated 5.0 Breakpoints have been replaced by {@link Core.widget.mixin.Responsive#config-responsive}.
 */

/**
 * This mixin provides management of a named set of {@link #typedef-ResponsiveState} objects that are conditionally
 * applied in response to the widget's size or other platform details. The names of the {@link #typedef-ResponsiveState}
 * objects are the keys of the {@link #config-responsive} config object. For example:
 *
 * ```javascript
 *  class ResponsiveButton extends Button.mixin(Responsive) {
 *      static configurable = {
 *          responsive : {
 *              small : {
 *                  // this is a ResponsiveState object named "small"
 *                  text : 'S'
 *              },
 *              medium : {
 *                  text : 'M'
 *              }
 *              large : {
 *                  text : 'L'
 *              }
 *          }
 *      };
 *  }
 * ```
 *
 * When the conditions are right for the button to be in the `'small'` responsive state, the `text` config will be set
 * to `'S'`.
 *
 * Any desired configs can be present in a {@link #typedef-ResponsiveState} object, however, the `when` and `callback`
 * properties have special meaning to this mixin and are reserved.
 *
 * ## Selecting the Responsive State
 *
 * To determine the current responsive state, the `when` property is consulted for each candidate state.
 *
 * If `when` is a number, it is understood to be a width threshold and, if the widget's `width` is equal or less than
 * that value, the score is that value. For example, a value of 400 would produce a score of 400 if the widget's width
 * were less than or equal to 400. If the widget's width is greater than 400, the state would be skipped.
 *
 * If `when` is a function, it is called with two parameters: a readonly reference to the widget and the
 * {@link Core.helper.BrowserHelper} singleton object. The function should return the numeric score if the state is
 * applicable, or `null` or `false` if the state should be skipped.
 *
 * The state that has the minimum score is selected as the responsive state for the widget.
 *
 * Consider the default responsive states and their `when` values:
 *
 * ```javascript
 *  responsive : {
 *      small : {
 *          when : 400
 *      },
 *
 *      medium : {
 *          when : 800
 *      },
 *
 *      large : {
 *          when : () => Infinity
 *      },
 *
 *      '*' : {}
 *  },
 * ```
 *
 * For example, if the width of the widget is 300: the score for the `small` responsive state is 400, the score for
 * the `medium` responsive state is 800, and the score for `large` is infinity. In effect, the `large` state is always
 * a candidate, but will also always lose to other candidate states. In this case, the `small` state has the minimum
 * score and is selected as the responsive state.
 *
 * If the width of the widget is 600: the `small` state would be skipped, while the `medium` and `large` states would
 * produce the same scores resulting in `medium` being the responsive state.
 *
 * The `when` functions have access to any properties of the widget instance in the first argument, but are also passed
 * the {@link Core.helper.BrowserHelper} singleton as a second argument. This can be used as shown in the following,
 * over-simplified example:
 *
 * ```javascript
 *  class ResponsiveWidget extends Widget.mixin(Responsive) {
 *      static configurable = {
 *          responsive : {
 *              small : {
 *                  when : ({ width }, { isMobileSafari }) => isMobileSafari && width <= 600 && 10
 *                  text : 'iPhone'
 *              },
 *              medium : {
 *                  when : ({ width }, { isMobileSafari }) => isMobileSafari && width <= 1024 && 20
 *                  text : 'iPad'
 *              }
 *              large : {
 *                  text : 'Desktop'
 *              }
 *          }
 *      };
 *  }
 * ```
 *
 * It is best to avoid mixing `when` threshold values and `when` functions as the resulting scores can be confusing.
 * @mixin
 */
export default Target => class Responsive extends (Target || Base).mixin(Delayable, Fencible) {
    static $name = 'Responsive';

    static configurable = {
        /**
         * Specifies the various responsive state objects keyed by their name. Each key (except `'*'`, see below) in
         * this object is a state name (see {@link #config-responsiveState}) and its corresponding value is the
         * associated {@link #typedef-ResponsiveState} object.
         *
         * Some properties of a `ResponsiveState` object are special, for example `when` and `callback`. All other
         * properties of the state object are config properties to apply when that state is active.
         *
         * The `when` property can be a function that computes the score for the state. The state whose `when` function
         * returns the lowest score is selected and its non-special properties will be assigned to the instance. If
         * `when` is a number, it will be converted into a scoring function (see below).
         *
         * A `when` function accepts two readonly parameters and returns either a numeric score if the state should be
         * considered, or `false` or `null` if the state should be ignored (i.e., it does match with the current state).
         *
         * The first parameter is a readonly proxy for the {@link #config-responsiveTarget widget} whose size and other
         * properties determine the state's score. The proxy tracks property access to that widget in order to update
         * the responsive state should any of those properties change.
         *
         * The second argument to a `when` function is the {@link Core.helper.BrowserHelper} singleton. This allows
         * a `when` function to conveniently test platform and browser information.
         *
         * The state whose `when` function returns the lowest score is selected as the new
         * {@link #config-responsiveState} and its config object (minus the `when` function and other special
         * properties) is applied to the instance.
         *
         * If `when` is a number, it is converted to function. The following two snippets produce the same `when`
         * scoring:
         *
         * ```javascript
         *      small : {
         *          when : 400,
         *          ...
         *      }
         * ```
         *
         * The above converted to:
         *
         * ```javascript
         *      small : {
         *          when : ({ width }) => width <= 400 && 400,
         *          ...
         *      }
         * ```
         * Selecting the lowest score as the winner allows for the simple conversion of width threshold to score value,
         * such that the state with the smallest matching width is selected.
         *
         * If the `responsive` config object has an asterisk key (`'*'`), its value is used as the default set of config
         * properties to apply all other states. This will be the only config properties to apply if no `when` function
         * returns a score. In this way, this special state object acts as a default state as well as a set of
         * default values for other states to share. This state object has no `when` function.
         *
         * The default for this config is:
         * ```javascript
         *  {
         *      small : {
         *          when : 400
         *      },
         *
         *      medium : {
         *          when : 800
         *      },
         *
         *      large : {
         *          when : () => Infinity
         *      },
         *
         *      '*' : {}
         *  }
         * ```
         *
         * A derived class (or instance) can use these states by populating other config properties, define
         * additional states, and/or adjust the `when` properties to use different size thresholds.
         *
         * @config {Object}
         */
        responsive : {
            $config : {
                lazy : 'paint'
            },

            value : null
        },

        /**
         * The defaults for the {@link #config-responsive} config. These are separated so that the act of setting the
         * {@link #config-responsive} config is what triggers additional processing.
         * @config {Object}
         * @internal
         * @default
         */
        responsiveDefaults : {
            small : {
                when : 400
            },

            medium : {
                when : 800
            },

            large : {
                when : () => Infinity
            },

            '*' : {}
        },

        /**
         * Set to `true` to mark this instance as the default {@link #config-responsiveTarget} for descendants that do
         * not specify an explicit {@link #config-responsiveTarget} of their own.
         * @config {Boolean}
         * @default false
         */
        responsiveRoot : null,

        /**
         * The name of the active state of the {@link #config-responsive} config. This is assigned internally
         * and should not be assigned directly.
         *
         * @config {String}
         * @readonly
         */
        responsiveState : null,

        /**
         * The widget whose size and other properties drive this object's responsive behavior. If this config is not
         * specified, the closest ancestor that specified {@link #config-responsiveRoot responsiveRoot=true} will be
         * used. If there is no such ancestor, then the instance using this mixin is used.
         *
         * If this value is set to `'@'`, then this instance is used even if there is a {@link #config-responsiveRoot}
         * ancestor.
         *
         * If this config is a string that starts with `'@'`, the text following the first character is the name of the
         * property on this instance that holds the target to use. For example, `'@owner'` to use the value of the
         * `owner` property as the responsive target.
         *
         * If this config is a string that does not start with `'@'`, that string is passed to
         * {@link Core.widget.Widget#function-up} to find the closest matching ancestor.
         *
         * If another widget is used as the `responsiveTarget` and if this instance does not specify any explicit `when`
         * properties in its {@link #config-responsive} config, then the `when` definitions of the `responsiveTarget`
         * will be used for this instance.
         * @config {String|Core.widget.Widget}
         */
        responsiveTarget : {
            value   : null,
            $config : {
                lazy : 'paint'
            }
        },

        responsiveWidget : {
            value   : null,
            $config : {
                nullify : true
            }
        },

        /**
         * Defines responsive breakpoints, based on max-width or max-height.
         *
         * When the widget is resized, the defined breakpoints are queried to find the closest larger or equal
         * breakpoint for both width and height. If the found breakpoint differs from the currently applied, it is
         * applied.
         *
         * Applying a breakpoint triggers an event that applications can catch to react to the change. It also
         * optionally applies a set of configs and calls a configured callback.
         *
         * ```javascript
         * breakpoints : {
         *     width : {
         *         50 : { name : 'small', configs : { text : 'Small', ... } }
         *         100 : { name : 'medium', configs : { text : 'Medium', ... } },
         *         '*' : { name : 'large', configs : { text : 'Large', ... } }
         *     }
         * }
         * ```
         *
         * @config {Object}
         * @param {Object} width Max-width breakpoints, with keys as numerical widths (or '*' for larger widths than the
         * largest defined one) and the value as a {@link #typedef-Breakpoint breakpoint definition}
         * @param {Object} height Max-height breakpoints, with keys as numerical heights (or '*' for larger widths than
         * the largest defined one) and the value as a {@link #typedef-Breakpoint breakpoint definition}
         * @deprecated 5.0 Use {@link #config-responsive} instead.
         */
        breakpoints : null
    };

    static delayable = {
        responsiveUpdate : 'raf'
    };

    static fenced = {
        syncResponsiveWidget : true
    };

    static prototypeProperties = {
        responsiveStateChanges : 0,
        responsiveUpdateCount  : 0
    };

    get isResponsivePending() {
        return this.responsiveUpdateCount === 0 && this.hasConfig('responsive');
    }

    get isResponsiveUpdating() {
        return this._responsiveUpdating || this.responsiveWidget?._responsiveUpdating;
    }

    // responsive

    updateResponsive(responsive) {
        const
            me  = this,
            cls = me.constructor,
            { responsiveDefaults } = me,
            stateNames = Array.from(
                new Set(ObjectHelper.keys(responsive).concat(ObjectHelper.keys(responsiveDefaults)))).filter(isStateName);

        let states = null,
            hasWhen, name, state, when;

        if (responsive) {
            states = {
                '*' : splitMergedConfigs(cls, responsiveDefaults['*'], responsive['*'])
            };

            for (name of stateNames) {
                state = responsive[name];

                if (state !== null && state !== false) {
                    // Track whether any state has an explicit "when" property
                    hasWhen = hasWhen || (state && 'when' in state);

                    states[name] = splitMergedConfigs(cls,
                        responsiveDefaults['*'], responsiveDefaults[name], responsive['*'], state);

                    when = states[name].when;
                    states[name].when = scoring[typeof when]?.(when) || when;  // convert numbers to fns based on width
                }
            }
        }

        me.$responsiveStates = states;
        me.$responsiveWhen = hasWhen;
        me.syncResponsiveWidget();
    }

    // responsiveState

    updateResponsiveState(state, oldState) {
        const
            me = this,
            { $responsiveStates : states } = me,
            initial = ++me.responsiveStateChanges === 1,
            classList = me.element?.classList,
            defaults = states['*'],
            def = states[state] || defaults,
            once = initial && (def.once || defaults.once),
            isStateful = initial && me.isStateful,
            target = me.responsiveWidget;

        let config = def.configs,
            otherConfigs = once?.configs;

        if (otherConfigs) {
            // overlay ":once" configs on normal configs (the mergeConfigs method clones the first parameter before
            // merging it with other values)
            config = config ? me.constructor.mergeConfigs(config, otherConfigs) : otherConfigs;
        }

        oldState && classList?.remove(`b-responsive-${oldState.toLowerCase()}`);
        state && classList?.add(`b-responsive-${state.toLowerCase()}`);

        if (isStateful) {
            // our responsiveState is munged with the stateId to retrieve state info for this responsiveState (to track
            // state by small/medium/large/etc). If we don't load the state on each call here we would end up smashing
            // the values saved in state with those defined by the developer in the responsive config.
            otherConfigs = me.loadStatefulData();

            if (otherConfigs) {
                // if there is stateful data for this responsiveState, it takes priority over our config object
                config = config ? me.constructor.mergeConfigs(config, otherConfigs) : otherConfigs;
            }

            // We don't want responsive changes to configs to trigger state save:
            me.suspendStateful();
        }

        me._responsiveUpdating = true;

        try {
            /**
             * Triggered before a new {@link #config-responsiveState} is applied.
             * @event beforeResponsiveStateChange
             * @param {Core.widget.Widget} source The widget whose `responsiveState` is to be changed
             * @param {String} state The new value for the widget's `responsiveState`
             * @param {String} oldState The previous value for the widget's `responsiveState`
             */
            me.trigger?.('beforeResponsiveStateChange', { state, oldState, target });

            config && me.setConfig(config);

            def.callback?.({ source : me, state, oldState, target, initial });
            once?.callback?.({ source : me, state, oldState, target, initial });

            /**
             * Triggered when a new {@link #config-responsiveState} is applied.
             * @event responsiveStateChange
             * @param {Core.widget.Widget} source The widget whose `responsiveState` has changed
             * @param {String} state The new value for the widget's `responsiveState`
             * @param {String} oldState The previous value for the widget's `responsiveState`
             */
            me.trigger?.('responsiveStateChange', { state, oldState, target });
            // we normally would check for !me.isConstructing or !me.isConfiguring but this event needs to be fired
            // during that time to allow the app to receive the initial responsive state since it is dynamic (i.e.,
            // not something the app has configured into the widget)
        }
        finally {
            // Be sure to reset these even if an exception occurs
            me._responsiveUpdating = false;
            isStateful && me.resumeStateful();
        }
    }

    // responsiveTarget

    get responsiveTarget() {
        return this.responsiveWidget || this._responsiveTarget;
    }

    updateResponsiveTarget() {
        this.syncResponsiveWidget();
    }

    // responsiveWidget

    updateResponsiveWidget(target) {
        const
            me = this,
            // being a delayable raf method effectively auto-bind's our this pointer
            responsiveUpdate = target && me.responsiveUpdate;

        me.$responsiveWrapper?.destroy();
        me.$responsiveWrapper = target && wrapWidget(target, responsiveUpdate);

        responsiveUpdate?.now();
    }

    // Support methods

    responsiveUpdate() {
        const
            me = this,
            { $responsiveStates : states, $responsiveWrapper : wrapper } = me,
            responsiveTarget = wrapper?.widget;

        if (states && wrapper) {
            let best = null,
                bestScore = 0,  // 0 doesn't get used (since !best) but data flow warnings arise w/o assignment
                fromWhen = states,
                score, state;

            // If this instance has a responsiveWidget (via responsiveTarget being set to a widget), and that widget
            // is not this instance, and if this instance did not specify any explicit "when" properties in its own
            // "responsive" config, use those of the target
            if (responsiveTarget && responsiveTarget !== me && !me.$responsiveWhen) {
                responsiveTarget.getConfig('responsive');  // make sure the config has been evaluated
                fromWhen = responsiveTarget.$responsiveStates || fromWhen;
            }

            wrapper.reset();

            for (state in states) {
                if (state !== '*') {
                    score = fromWhen[state].when(wrapper.object, BrowserHelper);

                    if (score != null && score !== false && (!best || score < bestScore)) {
                        best = state;
                        bestScore = score;
                    }
                }
            }

            ++me.responsiveUpdateCount; // this unlocks statefulId() getter in State mixin

            me.responsiveState = best;
        }
    }

    syncResponsiveWidget() {
        const me = this;

        let widget = null,
            responsiveTarget;

        if (!me.isDestroying && me.responsive) {
            responsiveTarget = me.responsiveTarget;

            if (!(widget = responsiveTarget)) {
                widget = (!me.responsiveRoot && me.up?.(responsiveRootFn)) || me;
            }
            else if (typeof responsiveTarget === 'string') {
                widget = responsiveTarget === '@' ? me : (
                    responsiveTarget[0] === '@' ? me[responsiveTarget.substring(1)] : me.up(responsiveTarget)
                );

                if (!widget) {
                    throw new Error(`No match for responsiveTarget="${responsiveTarget}"`);
                }
            }

            if (!widget.isWidget) {
                throw new Error(`${widget.constructor.$$name} is not a widget and cannot be a responsiveTarget`);
            }
        }

        me.responsiveWidget = widget;

        return widget;
    }



    changeBreakpoints(breakpoints) {
        ObjectHelper.assertObject(breakpoints, 'breakpoints');

        // Normalize breakpoints
        if (breakpoints?.width) {
            Object.keys(breakpoints.width).forEach(key => {
                breakpoints.width[key].maxWidth = key;
            });
        }

        if (breakpoints?.height) {
            Object.keys(breakpoints.height).forEach(key => {
                breakpoints.height[key].maxHeight = key;
            });
        }

        return breakpoints;
    }

    updateBreakpoints(breakpoints) {
        if (breakpoints) {
            this.monitorResize = true;
        }
    }

    // Get a width/height breakpoint for the supplied dimension
    getBreakpoint(levels, dimension) {
        const
            // Breakpoints as reverse sorted array of numerical widths [NaN for *, 50, 100]
            ascendingLevels = Object.keys(levels).map(l => parseInt(l)).sort(),
            // Find first one larger than current width
            breakpoint     = ascendingLevels.find(bp => dimension <= bp);

        // Return matched breakpoint or * if available and none matched
        return levels[breakpoint ?? (levels['*'] && '*')];
    }

    // Apply a breakpoints configs, trigger event and call any callback
    activateBreakpoint(orientation, breakpoint) {
        const
            me             = this,
            prevBreakpoint = me[`current${orientation}Breakpoint`];

        if (breakpoint !== prevBreakpoint) {
            me[`current${orientation}Breakpoint`] = breakpoint;

            me.setConfig(breakpoint.configs);

            prevBreakpoint && me.element.classList.remove(`b-breakpoint-${prevBreakpoint.name.toLowerCase()}`);
            me.element.classList.add(`b-breakpoint-${breakpoint.name.toLowerCase()}`);

            /**
             * Triggered when a new max-width based breakpoint is applied.
             * @event responsiveWidthChange
             * @param {Core.widget.Widget} source The widget
             * @param {Breakpoint} breakpoint The applied breakpoint
             * @param {Breakpoint} prevBreakpoint The previously applied breakpoint
             * @deprecated 5.0 This event is associated with {@link #config-breakpoints} which is deprecated in favor of
             * {@link #config-responsive}.
             */
            /**
             * Triggered when a new max-height based breakpoint is applied.
             * @event responsiveHeightChange
             * @param {Core.widget.Widget} source The widget
             * @param {Breakpoint} breakpoint The applied breakpoint
             * @param {Breakpoint} prevBreakpoint The previously applied breakpoint
             * @deprecated 5.0 This event is associated with {@link #config-breakpoints} which is deprecated in favor of
             * {@link #config-responsive}.
             */

            me.trigger(`responsive${orientation}Change`, { breakpoint, prevBreakpoint });

            breakpoint.callback?.({ source : me, breakpoint, prevBreakpoint });

            me.recompose?.();
        }
    }

    // Called on resize to pick and apply a breakpoint, if size changed enough
    applyResponsiveBreakpoints(width, height) {
        const
            me = this,
            {
                width  : widths,
                height : heights
            }  = me.breakpoints ?? {};

        if (widths) {
            const breakpoint = me.getBreakpoint(widths, width);
            me.activateBreakpoint('Width', breakpoint);
        }

        if (heights) {
            const breakpoint = me.getBreakpoint(heights, height);
            me.activateBreakpoint('Height', breakpoint);
        }
    }

    onInternalResize(element, width, height, oldWidth, oldHeight) {
        super.onInternalResize(element, width, height, oldWidth, oldHeight);

        this.applyResponsiveBreakpoints(width, height);
    }
};
