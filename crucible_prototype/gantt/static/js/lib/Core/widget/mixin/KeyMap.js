import Base from '../../Base.js';
import ArrayHelper from '../../helper/ArrayHelper.js';
import EventHelper from '../../helper/EventHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';

/**
 * @module Core/widget/mixin/KeyMap
 */

/**
 * Mixin for widgets that allows for standardized and customizable keyboard shortcuts functionality. Can be configured
 * on any widget or compatible feature.
 *
 * ```javascript
 * const grid = new Grid({
 *     keyMap: {
 *         // Changing keyboard navigation to respond to WASD keys.
 *         w : 'navigateUp',
 *         a : 'navigateLeft',
 *         s : 'navigateDown',
 *         d : 'navigateRight',
 *
 *         // Removes mappings for arrow keys.
 *         ArrowUp    : null,
 *         ArrowLeft  : null,
 *         ArrowDown  : null,
 *         ArrowRight : null
 *     }
 * });
 * ```
 *
 * The invoking `KeyboardEvent` is passed as the first argument into all handlers.
 *
 * The owning Widget of the KeyMap is injected into the passed `KeyboardEvent` in the `widget` property.
 *
 * For more information on how to customize keyboard shortcuts, please see our guide (Guides/Customization/Keyboard
 * shortcuts)
 * @mixin
 */
export default Target => class KeyMap extends (Target || Base) {

    static $name = 'KeyMap';

    get widgetClass() {}

    /**
     * Override to attach the keyMap keydown event listener to something else than this.element
     * @private
     */
    get keyMapElement() {
        return this.element;
    }

    /**
     * Override to make keyMap resolve subcomponent actions to something else than this.features.
     * @private
     */
    get keyMapSubComponents() {
        return this.features;
    }

    static configurable = {
        keyMap : {
            value : null,

            $config : {
                merge   : 'objects',
                nullify : true
            }
        }
    };

    /**
     * Returns the `keyMap` property name which matches the passed KeyboardEvent if any.
     * @param {KeyboardEvent} keyEvent
     * @param {Object} [keyMap=this.keyMap]
     * @returns {String} the key into the `keyMap` matched by the passed KeyboardEvent
     * @internal
     */
    matchKeyMapEntry(keyEvent, keyMap = this.keyMap) {
        if (keyMap && !keyEvent.handled && keyEvent.key !== undefined) {
            // Match a defined key combination, such as `Ctrl + Enter`
            return ObjectHelper.keys(keyMap).find(keyString => {
                const
                    keys         = keyString.split('+'),
                    requireAlt   = keys.includes('Alt'),
                    requireShift = keys.includes('Shift'),
                    requireCtrl  = keys.includes('Ctrl');
                // Last key should be the actual key,
                let actualKey    = keys[keys.length - 1].toLowerCase();

                if (actualKey === 'space') {
                    actualKey = ' ';
                }

                // Modifiers in any order before the actual key
                return actualKey === keyEvent.key.toLowerCase() &&
                    ((!keyEvent.altKey && !requireAlt) || (keyEvent.altKey && requireAlt)) &&
                    ((!keyEvent.ctrlKey && !requireCtrl) || (keyEvent.ctrlKey && requireCtrl)) &&
                    ((!keyEvent.shiftKey && !requireShift) || (keyEvent.shiftKey && requireShift));
            });
        }
    }

    /**
     * Called on keyMapElement keyDown
     * @private
     */
    performKeyMapAction(event) {
        const { keyMap } = this;
        let actionHandled = false;

        // We ignore if event is marked as handled
        if (keyMap && !event.handled && event.key !== undefined) {
            const key = this.matchKeyMapEntry(event);

            // Is there an action (fn to call) for that key combination
            if (keyMap[key]) {
                // Internally, action can be an array of actions in case of key conflicts
                const actions = ArrayHelper.asArray(keyMap[key]);

                // Flags to let actions know that's its keyMap that's calling and who owns it
                event.fromKeyMap = true;
                event.widget = this;

                let preventDefault;
                // The actions will be called in the order they were added to the array.
                for (let action of actions) {
                    preventDefault = true;
                    // Support for providing a config object as handler function to prevent event.preventDefault
                    if (ObjectHelper.isObject(action)) {
                        if (!action.handler) {
                            continue;
                        }
                        if (action.preventDefault === false) {
                            preventDefault = false;
                        }
                        action = action.handler;
                    }

                    if (typeof action === 'string') {
                        const {
                            thisObj,
                            handler
                        } = this.resolveKeyMapAction(action);

                        // Check if action is available, for example widget is enabled
                        if (thisObj.isActionAvailable?.({ key, action, event, actionName : action.split('.').pop() }) !== false) {

                            // If action function returns false, that means that it did not handle the action
                            if (handler.call(thisObj, event) !== false) {
                                actionHandled = true;
                                break;
                            }
                        }
                    }
                    else if (action.call(this, event) !== false) {
                        actionHandled = true;
                        break;
                    }
                }

                // Remove flags when completed
                delete event.fromKeyMap;
                delete event.widget;

                if (actionHandled) {
                    if (preventDefault) {
                        event.preventDefault();
                    }
                    event.handled = true;
                }
            }
        }

        return actionHandled;
    }

    /**
     * Resolves correct `this` and handler function.
     * If subComponent (action includes a dot) it will resolve in keyMapSubComponents (defaults to this.features).
     *
     * For example, in feature configurable:
     * `keyMap: {
     *     ArrowUp: 'navigateUp'
     * }`
     *
     * Will be translated (by InstancePlugin) to:
     * `keyMap: {
     *     ArrowUp: 'featureName.navigateUp'
     * }
     *
     * And resolved to correct function path here.
     *
     * Override to change action function mapping.
     * @private
     */
    resolveKeyMapAction(action) {
        const { keyMapSubComponents } = this;

        if (action.startsWith('up.') || action.startsWith('this.')) {
            return this.resolveCallback(action);
        }

        if (keyMapSubComponents && action.includes('.')) {
            const [component, actionName] = action.split('.');
            if (component && actionName) {
                return {
                    thisObj : keyMapSubComponents[component],
                    handler : keyMapSubComponents[component][actionName]
                };
            }
        }
        return {
            thisObj : this,
            handler : this[action]
        };
    }

    updateKeyMap(keyMap) {
        this.keyMapDetacher?.();
        if (!ObjectHelper.isEmpty(keyMap)) {
            this.keyMapDetacher = EventHelper.on({
                element : this.keyMapElement,
                keydown : 'keyMapOnKeyDown',
                thisObj : this
            });
        }
    }

    // Hook on to this to catch keydowns before keymap does
    keyMapOnKeyDown(event) {
        this.performKeyMapAction(event);
    }

    /**
     * This function is used for merging two keyMaps with each other. It can be used for example by a Grid's feature to
     * merge the fetature's keyMap into the Grid's with the use of a subPrefix.
     * @param {Object} target - The existing keyMap.
     * @param {Object} source - The keyMap we want to merge into target.
     * @param {Object} subPrefix - If keyMap actions in source should be prefixed, the prefix should be provided here.
     * As example, the prefix * `rowCopyPaste` will give the action 'rowCopyPaste.action'.
     * @private
     */
    mergeKeyMaps(target, source, subPrefix = null) {
        const mergedKeyMap = {};

        if (target) {
            ObjectHelper.assign(mergedKeyMap, target);
        }

        for (const key in source) {
            if (!source[key]) {
                continue;
            }

            const
                existingActions = ArrayHelper.asArray(target?.[key]),
                actions         = [];

            if (existingActions?.length) {
                actions.push(...existingActions);
            }

            if (!existingActions?.some(a => {
                const handler = (a.handler ? a.handler : a);

                return typeof  handler === 'string' && handler.startsWith(subPrefix + '.');
            })) {

                for (const action of ArrayHelper.asArray(source[key])) {
                    // Mapping keymap actions to their corresponding feature's name, like group.toggleGroup
                    if (ObjectHelper.isObject(action) && action.handler) {
                        actions.push(ObjectHelper.assignIf({
                            handler : (subPrefix ? subPrefix + '.' : '') + action.handler
                        }, action));
                    }
                    else if (typeof action === 'function') {
                        actions.push(action);
                    }
                    else {
                        actions.push((subPrefix ? subPrefix + '.' : '') + action);
                    }
                }

                actions.sort((a, b) => {
                    // Sort on weight
                    const weight = (a.weight || 0) - (b.weight || 0);
                    // Then put new actions before old
                    if (weight === 0 && existingActions?.length) {
                        return existingActions.indexOf(a) - existingActions.indexOf(b);
                    }
                    return weight;
                });
            }
            mergedKeyMap[key] = actions;
        }
        return mergedKeyMap;
    }

};
