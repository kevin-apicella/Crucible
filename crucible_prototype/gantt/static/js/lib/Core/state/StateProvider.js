import Base from '../Base.js';
import Delayable from '../mixin/Delayable.js';
import Events from '../mixin/Events.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import StateStorage from './StateStorage.js';

/**
 * @module Core/state/StateProvider
 */

class Local extends StateStorage {
    constructor(stateProvider) {
        super();
        this.prefix = stateProvider.prefix || '';
    }

    get isLocal() {
        return true;
    }

    get data() {
        const
            data = empty(),
            keys = this.keys;

        for (const key of keys) {
            data[key] = this.getItem(key);
        }

        return data;
    }

    get keys() {
        return getKeys(this.prefix, this.prefix.length);
    }

    clear() {
        // It's important that we only clear our own StateProvider's keys, not all of localStorage. We get the
        // full keys not the suffixes since we're just going to call removeItem() with them...
        const keys = getKeys(this.prefix);

        for (const key of keys) {
            localStorage.removeItem(key);
        }
    }

    getItem(key) {
        const value = localStorage.getItem(this.prefix + key);

        // We handle the JSON translation at this layer because the Memory storage does not do any such pickling
        // of data but localStorage only handles strings
        return (value === null) ? value : JSON.parse(value);
    }

    removeItem(key) {
        return localStorage.removeItem(this.prefix + key);
    }

    setItem(key, value) {
        return localStorage.setItem(this.prefix + key, JSON.stringify(value));
    }
}

class Memory extends StateStorage {
    constructor() {
        super();
        this.clear();
    }

    get isMemory() {
        return true;
    }

    get data() {
        return ObjectHelper.clone(this._data);
    }

    get keys() {
        return Object.keys(this._data);
    }

    clear() {
        this._data = empty();
    }

    getItem(key) {
        return (key in this._data) ? this._data[key] : null;
    }

    removeItem(key) {
        delete this._data[key];
    }

    setItem(key, value) {
        this._data[key] = value;
    }
}

const
    empty = () => Object.create(null),
    getKeys = (prefix, pos = 0) => {
        const
            keys = [],
            count = localStorage.length;

        for (let key, i = 0; i < count; ++i) {
            key = localStorage.key(i);

            key.startsWith(prefix) && keys.push(key.slice(pos));
        }

        return keys;
    },
    nullStorage = new StateStorage(),
    storageTypes = {
        local  : Local,
        memory : Memory
    };

/**
 * Instances of this class are used to manage data storage for objects that use the {@link Core.mixin.State} mixin, i.e.
 * stateful components. When such components change their {@link Core.mixin.State#config-stateful} properties, they
 * notify the associated {@link Core.mixin.State#config-stateProvider}, which will save the changes after a short
 * delay (to allow multiple changes to coalesce into a single save operation).
 *
 * There are two (2) built-in types of storage supported by `StateProvider`:
 *
 *  - `local` : Stores data in the browser's `localStorage`. Because of this, all `StateProvider` instances share their
 *    state data if they have the same {@link #config-prefix}.
 *  - `memory` : Stores data in the provider's memory. Each instance has its own storage. This is typically used when
 *    the state data is saved to a backend server.
 *
 * ## Using `local` Storage
 *
 * The global `StateProvider` is typically to use `localStorage` for the page or application like so:
 *
 * ```javascript
 *  StateProvider.setup('local');
 * ```
 *
 * With this provider in place, all {@link Core.mixin.State stateful components} will save their
 * {@link Core.mixin.State#property-state} to this provider by default.
 *
 * This is the most typical, and recommended, strategy for proving data to stateful components. This approach allows
 * various widgets on the page to simply declare their {@link Core.mixin.State#config-stateId} to participate in the
 * saving and restoring of application state.
 *
 * Because this storage type uses `localStorage`, the `StateProvider` applies a string prefix to isolate its data from
 * other users of `localStorage`. The default prefix is `'bryntum-state:'`, but this can be configured to a different
 * value. This could be desired, for example, to isolate state data from multiple pages or for version changes.
 *
 * ```javascript
 *  StateProvider.setup({
 *      storage : 'local',
 *      prefix  : 'myApp-v1:'
 *  });
 * ```
 *
 * ## Using `memory` Storage
 *
 * In some applications it may be desirable to save state to a server and restore it on other devices for the user.
 * Because state data is consumed synchronously, and server I/O is asynchronous, the `StateProvider` can be configured
 * to use `'memory'` storage and the actual state data can be loaded/saved by the application.
 *
 * Two factors are important to consider before deciding to save application state on the server (beyond the async
 * adaptation):
 *
 * - State properties are often more of a reflection of the user's device than they are application preferences
 *   and, therefore, may not apply well on other devices.
 * - Potentially undesired application state will not be cleared by clearing local browser user data (a common
 *   troubleshooting strategy) and will follow the user to other browsers (another common troubleshooting technique).
 *
 * The use this type of storage, the global `StateProvider` is configured like so:
 *
 * ```javascript
 * StateProvider.setup('memory');
 * ```
 *
 * In this scenario, application code would download the user's state and use {@link #property-data} to populate
 * the {@link #property-instance-static StateProvider.instance}. In this case, the {@link #event-save} event is used
 * to save the data back to the server when it changes.
 *
 * See [state](https://bryntum.com/products/grid/examples/state/) demo for a usage example.
 * @mixes Core/mixin/Events
 */
export default class StateProvider extends Base.mixin(Delayable, Events) {
    static get $name() {
        return 'StateProvider';
    }

    static get configurable() {
        return {
            /**
             * The key prefix applied when using the `'local'` {@link #config-storage} type.
             * @config {String}
             * @default
             */
            prefix : 'bryntum-state:',

            /**
             * Storage instance
             * @member {Core.state.StateStorage} storage
             */
            /**
             * One of the following storage types:
             *  - `local` : Stores data in the browser's `localStorage` using the {@link #config-prefix}.
             *  - `memory` : Stores data in the provider's memory.
             *
             * @config {'local'|'memory'|Core.state.StateStorage}
             * @default
             */
            storage : 'local'
        };
    }

    static get delayable() {
        /*
            The StateProvider uses a delayed write to save stateful components in batches. To illustrate, consider the
            "collapsed" config for a Panel that has been marked as "stateful":

                App                         Stateful                      State
                Code                        Component                    Provider
                  :                             :                           :
                  | .collapsed=true             :                           :
                  |---------------------------->|                           :
                  |         onConfigChange() +--|                           :
                  |                          |  |                           :
                  |                          +->|                           :
                  |              saveState() +--|                           :
                  |                          |  |                           :
                  |                          +->| saveStateful()            :
                  |                             |-------------------------->|
                  |                             |                           | pendingSaves.push()
                  |                             |                           |----+ writeStatefuls()
                  | .collapsed=true             |<..........................:    :
                  |<............................:                           :    :  (maybe other changes)
                  :                             :                           :    :
                  :                             :                           |<---+ (50 ms later)
                  :                             :                           | writeStatefuls()
                  :                             :       saveState({         |
                  :                             :         immediate:true})  | <---------------+
                  :                             |<--------------------------|                  \
                  :                             | setValue()                |                   \
                  :                             |-------------------------->|                    \
                  :                             |                           | .trigger('set')     ) one or more of these
                  :                             |<..........................|                    /
                  :                             |              saveState()  |                   /
                  :                             :..........................>|                  /
                  :                             :                           | <---------------+
                  :                             :                           |
                  :                             :                           | .trigger('save')
                  :                             :                           |
                  :                             :                           :....> writeStatefuls()
                  :                             :                           :

        */
        return {
            writeStatefuls : 50
        };
    }

    /**
     * The default {@link Core.mixin.State#config-stateProvider} for stateful objects.
     * @property {Core.state.StateProvider}
     */
    static get instance() {
        return this._instance;
    }

    static set instance(inst) {
        if (inst == null) {
            inst = nullProvider;
        }
        else {
            if (typeof inst === 'string' || ObjectHelper.isClass(inst) || (inst instanceof StateStorage)) {
                inst = {
                    storage : inst
                };
            }

            if (ObjectHelper.isObject(inst)) {
                inst = new StateProvider(inst);
            }
        }

        this._instance = inst;
    }

    /**
     * Initializes the default `StateProvider` instance for the page. This method can be passed an instance or one of
     * the following type aliases:
     *
     *  - `'local'` : use `localStorage` to store application state (most common)
     *  - `'memory'` : holds application state in the `StateProvider` instance (used when state is saved to a server)
     *
     * Once the `StateProvider` is initialized, components that use {@link Core.mixin.State} and assign components a
     * {@link Core.mixin.State#config-stateId} will use this default provider to automatically save and restore their
     * state.
     *
     * @param {'local'|'memory'|Core.state.StateProvider} inst The state provider storage type ('local' or 'memory') or
     * the `StateProvider` instance.
     * @returns {Core.state.StateProvider}
     */
    static setup(inst) {
        this.instance = inst;  // use smart setter

        return this.instance;
    }

    doDestroy() {
        self.writeStatefuls.flush();

        super.doDestroy();
    }

    /**
     * On read, this property returns all state data stored in the provider. On write, this property _adds_ all the
     * given values to the state provider's data. To replace the data, call {@link #function-clear} before assigning
     * this property. This is used to bulk populate this `StateProvider` with data for stateful components.
     * @member {Object}
     */
    get data() {
        return this.storage.data;
    }

    set data(data) {
        if (!data) {
            this.clear();
        }
        else {
            for (const key in data) {
                this.setValue(key, data[key]);
            }
        }
    }

    /**
     * Clears all state date
     * @returns {Core.state.StateProvider} this instance
     */
    clear() {
        this.storage.clear();

        return this;
    }

    changeStorage(storage) {
        if (storage == null) {
            storage = nullStorage;
        }
        else {
            if (typeof storage === 'string') {
                if (!storageTypes[storage]) {
                    throw new Error(`Invalid storage type "${storage}" (expected one of: "${
                        Object.keys(storageTypes).join('", "')}")`);
                }

                storage = storageTypes[storage];
            }

            if (ObjectHelper.isClass(storage)) {
                storage = new storage(this);
            }
        }

        return storage;
    }

    /**
     * This method is called to schedule saving the given `stateful` object.
     * @param {Core.mixin.State} stateful The stateful object to save.
     * @param {Object} [options] An object of options that affect the state saving process.
     * @param {String} [options.id] The key for the saved state.
     * @param {Boolean} [options.immediate] Pass `true` to save the data synchronously instead of on a delay.
     * @internal
     */
    saveStateful(stateful, options) {
        (this.pendingSaves || (this.pendingSaves = [])).push([stateful, options]);

        this.writeStatefuls();
    }

    /**
     * A delayable method that flushes pending stateful objects.
     * @private
     */
    writeStatefuls() {
        const
            me = this,
            { pendingSaves } = me,
            n = pendingSaves?.length,
            stateIds = [],
            saved = [];

        me.pendingSaves = null;

        if (n) {
            for (let options, stateful, stateId, i = 0; i < n; ++i) {
                [stateful, options] = pendingSaves[i];

                if (!stateful.isDestroying && stateful.isSaveStatePending) {
                    stateId = stateful.saveState({
                        ...options,
                        immediate : true
                    });

                    if (stateId) {
                        stateIds.push(stateId);
                        saved.push(stateful);
                    }
                }
            }

            if (stateIds.length) {
                /**
                 * Triggered after one or more stateful objects save their state to the state provider. This event can
                 * be used to save state to a backend server.
                 *
                 * For example, to save the page's state object as a single object on the server:
                 *
                 * ```javascript
                 *  StateProvider.instance.on({
                 *      save() {
                 *          const data = StateProvider.instance.data;
                 *          // Save "data" to server
                 *      }
                 *  });
                 * ```
                 *
                 * Or, to save individual stateful components to the server:
                 *
                 * ```javascript
                 *  StateProvider.instance.on({
                 *      save({ stateIds }) {
                 *          for (const stateId of stateIds) {
                 *              const data = StateProvider.instance.getValue(stateId);
                 *
                 *              if (data == null) {
                 *                  // Remove "stateId" from the server
                 *              }
                 *              else {
                 *                  // Save new "data" for "stateId" to the server
                 *              }
                 *          }
                 *      }
                 *  });
                 * ```
                 *
                 * Multi-page applications should probably include a page identifier in addition to the `stateId` to
                 * prevent state from one page affecting other pages. If there are common components across all (or
                 * many) pages, the `stateId` values would need to be assigned with all pages in mind.
                 *
                 * @event save
                 * @param {Core.state.StateProvider} source The source of the event
                 * @param {String[]} stateIds An array of `stateId` values that were saved to the state provider.
                 * @param {Core.mixin.State[]} saved An array of stateful objects saved just saved to state provider
                 * storage, in the same order as the `stateIds` array.
                 */
                me.trigger('save', {
                    stateIds,
                    saved
                });
            }
        }
    }

    /**
     * Returns the stored state given its `key`.
     * @param {String} key The identifier of the state to return.
     * @returns {Object}
     */
    getValue(key) {
        this.writeStatefuls.flush();

        return this.storage.getItem(key);
    }

    /**
     * Stores the given state `value` under the specified `key`.
     * @param {String} key The identifier of the state value.
     * @param {Object} value The state value to set.
     * @returns {Core.state.StateProvider} this instance
     */
    setValue(key, value) {
        const
            me = this,
            { storage } = me,
            was = me.getValue(key);

        if (value != null) {
            storage.setItem(key, value);

            /**
             * Triggered after an item is stored to the state provider.
             * @event set
             * @param {Core.state.StateProvider} source The source of the event
             * @param {String} key The name of the stored item.
             * @param {*} value The value of the stored item.
             * @param {*} was The previous value of the stored item.
             */
            me.trigger('set', { key, value, was });
        }
        else if (was !== null) {
            storage.removeItem(key);

            /**
             * Triggered after an item is removed from the state provider.
             * @event remove
             * @param {Core.state.StateProvider} source The source of the event
             * @param {String} key The name of the removed item.
             * @param {*} was The value of the removed item.
             */
            me.trigger('remove', { key, was });
        }

        return me;
    }
};

const nullProvider = new StateProvider({
    storage : nullStorage
});

StateProvider._instance = nullProvider;
