/**
 * @module Core/state/StateStorage
 */

/**
 * Base class representing interface used by the {@link Core.state.StateProvider} to actually store the state data.
 * This class is not intended to be used directly.
 *
 * This class has an interface similar to the [Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage).
 */
export default class StateStorage {
    /**
     * Returns an object with all stored keys and their values as its properties
     * @member {Object}
     */
    get data() {
        return Object.create(null);
    }

    /**
     * Returns the stored keys as set by {@link #function-setItem}
     * @member {String[]}
     */
    get keys() {
        return [];
    }

    /**
     * Remove all stored keys
     */
    clear() {}

    /**
     * Returns key value as set by {@link #function-setItem}
     * @param {String} key
     * @returns {*}
     */
    getItem(key) {
        return null;
    }

    /**
     * Removes the specified key
     * @param {String} key
     */
    removeItem(key) {}

    /**
     * Sets the specified key to the given value
     * @param {String} key
     * @param {*} value The item value
     */
    setItem(key, value) {}
}
