/**
 * @copyright 2024 Certinia Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// A custom implementation of the built-in Map for performance critical Lightning Web Components and third-party libraries running in Salesforce Lightning Experience with Lightning Web Security switched on.
export class MapPolyfill {
    /**
     * The `Map()` constructor creates `Map` objects.
     *
     * @param {Iterable} [iterable] An Array or other iterable object whose elements are key-value pairs. (For example, arrays with two elements, such as [[ 1, 'one' ],[ 2, 'two' ]].) Each key-value pair is added to the new Map.
     */
    constructor(iterable) {
        Object.defineProperties(this, {
            _keys_: {
                value: [],
                writable: false,
                enumerable: false,
                configurable: false,
            },
            _data_: {
                value: [],
                writable: false,
                enumerable: false,
                configurable: false,
            },
        });

        if (iterable?.[Symbol.iterator]) {
            for (let [key, value] of iterable) {
                this.set(key, value);
            }
        }
    }

    /**
     * The value of `size` is an integer representing how many entries the `Map` object has. A set accessor function for `size` is `undefined`; you can not change this property.
     *
     * @type {Number}
     */
    get size() {
        return this._keys_.length;
    }

    /**
     * Returns a boolean indicating whether an element with the specified key exists in this map or not.
     *
     * @param {*} key The key of the element to test for presence in the `Map` object.
     * @returns {Boolean} `true` if an element with the specified key exists in the `Map` object; otherwise `false`.
     */
    has(key) {
        return this._keys_.indexOf(key) !== -1;
    }

    /**
     * Returns a specified element from this map. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the `Map` object.
     *
     * @param {*} key The key of the element to return from the `Map` object.
     * @returns {*} The element associated with the specified key, or `undefined` if the key can't be found in the `Map` object.
     */
    get(key) {
        return this._data_[this._keys_.indexOf(key)];
    }

    /**
     * Adds or updates an entry in this map with a specified key and a value.
     *
     * @param {*} key The key of the element to add to the `Map` object. The key may be any JavaScript type (any primitive value or any type of JavaScript object).
     * @param {*} value The value of the element to add to the `Map` object. The value may be any JavaScript type (any primitive value or any type of JavaScript object).
     * @returns {MapPolyfill} The `Map` object.
     */
    set(key, value) {
        const { _keys_: keys, _data_: data } = this;

        let at = keys.indexOf(key);

        if (at < 0) {
            keys.push(key);
            data.push(value);
        } else {
            data[at] = value;
        }

        return this;
    }

    /**
     * Removes the specified element from this map by key.
     *
     * @param {*} key
     * @returns {Boolean} `true` if an element in the `Map` object existed and has been removed, or `false` if the element does not exist.
     */
    delete(key) {
        const { _keys_: keys, _data_: data } = this;

        const at = keys.indexOf(key);

        if (at === -1) {
            return false;
        }

        keys.splice(at, 1);
        data.splice(at, 1);

        return true;
    }

    /**
     * Removes all elements from this map.
     */
    clear() {
        const { _keys_: keys, _data_: data } = this;

        if (!keys.length) return;

        keys.length = 0;
        data.length = 0;
    }

    /**
     * Returns a new map iterator object that contains the keys for each element in this map in insertion order.
     *
     * @returns {Iterator} A new iterable iterator object.
     */
    keys() {
        return (function* (keys) {
            yield* keys;
        })([...this._keys_]);
    }

    /**
     * Returns a new map iterator object that contains the values for each element in this map in insertion order.
     *
     * @returns {Iterator} A new iterable iterator object.
     */
    values() {
        return (function* (data) {
            yield* data;
        })([...this._data_]);
    }

    /**
     * Returns a new map iterator object that contains the `[key, value]` pairs for each element in this map in insertion order.
     *
     * @returns {Iterator} A new iterable iterator object.
     */
    entries() {
        return (function* (that) {
            const keys = that.keys();
            const values = that.values();

            while (true) {
                const { done, value: key } = keys.next();
                const { value } = values.next();

                if (done) break;

                yield [key, value];
            }
        })(this);
    }

    /**
     * Executes a provided function once per each key/value pair in this map, in insertion order.
     *
     * @param {Object} callback A function to execute for each entry in the map.
     * @param {*} callback.value
     * @param {*} callback.key
     * @param {MapPolyfill} callback.map
     * @param {*} [thisArg] A value to use as `this` when executing `callback` function.
     */
    forEach(callback, thisArg) {
        for (let [key, value] of this) {
            Reflect.apply(callback, thisArg, [value, key, this]);
        }
    }

    get [Symbol.iterator]() {
        return this.entries;
    }

    static get [Symbol.species]() {
        return MapPolyfill;
    }

    static groupBy(items, callback) {
        const result = new MapPolyfill();

        for (let entry of items) {
            const key = callback(entry);
            const group = result.get(key) || [];

            group.push(entry);
            result.set(key, group);
        }

        return result;
    }
}
