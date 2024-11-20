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

// The `Set` object lets you store unique values of any type, whether primitive values or object references.
export class SetPolyfill {
    /**
     * The `Set()` constructor creates `Set` objects.
     *
     * @param {Iterable} [iterable] If an iterable object is passed, all of its elements will be added to the new `Set`. If you don't specify this parameter, or its value is null, the new Set is empty.
     */
    constructor(iterable) {
        Object.defineProperties(this, {
            _data_: {
                value: [],
                writable: false,
                enumerable: false,
                configurable: false,
            },
        });

        if (iterable?.[Symbol.iterator]) {
            for (let value of iterable) {
                this.add(value);
            }
        }
    }

    /**
     * The size accessor property of `Set` instances returns the number of (unique) elements in this set.
     */
    get size() {
        return this._data_.length;
    }

    /**
     * The `has()` method of `Set` instances returns a boolean indicating whether an element with the specified value exists in this set or not.
     *
     * @param {*} value The value to test for presence in the `Set` object.
     * @returns {Boolean} Returns `true` if an element with the specified value exists in the `Set` object; otherwise `false`.
     */
    has(value) {
        return this._data_.indexOf(value) !== -1;
    }

    /**
     * The `add()` method of `Set` instances inserts a new element with a specified value in to this set, if there isn't an element with the same value already in this set.
     *
     * @param {*} value The value of the element to add to the `Set` object.
     * @returns {*} The `Set` object with added value.
     */
    add(value) {
        const { _data_: data } = this;

        let at = data.indexOf(value);

        if (at < 0) {
            data.push(value);
        } else {
            data[at] = value;
        }

        return this;
    }

    /**
     * The `delete()` method of `Set` instances removes a specified value from this set, if it is in the set.
     *
     * @param {*} value The value to remove from `Set`.
     * @returns {Boolean} Returns `true` if value was already in `Set`; otherwise `false`.
     */
    delete(value) {
        const { _data_: data } = this;

        const at = data.indexOf(value);

        if (at === -1) {
            return false;
        }

        data.splice(at, 1);

        return true;
    }

    /**
     * The clear() method of Set instances removes all elements from this set.
     */
    clear() {
        const { _data_: data } = this;

        if (!data.length) return;

        data.length = 0;
    }

    /**
     * The `keys()` method of `Set` instances is an alias for the `values()` method.
     *
     * @returns {Iterator} A new iterable iterator object.
     */
    keys() {
        return (function* (data) {
            yield* data;
        })([...this._data_]);
    }

    /**
     * The `values()` method of `Set` instances returns a new set iterator object that contains the values for each element in this set in insertion order.
     *
     * @returns {Iterator} A new iterable iterator object.
     */
    values() {
        return (function* (data) {
            yield* data;
        })([...this._data_]);
    }

    /**
     * The `entries()` method of `Set` instances returns a new set iterator object that contains an array of `[value, value]` for each element in this set, in insertion order.
     * For `Set` objects there is no key like in `Map` objects. However, to keep the API similar to the `Map` object, each entry has the same value for its key and value here,
     * so that an array `[value, value]` is returned.
     *
     * @returns {Iterator}
     */
    entries() {
        return (function* (that) {
            const data = that.values();

            while (true) {
                const { done, value } = data.next();

                if (done) break;

                yield [value, value];
            }
        })(this);
    }

    /**
     * The `forEach()` method of `Set` instances executes a provided function once for each value in this set, in insertion order.
     *
     * @param {Object} callback A function to execute for each entry in the set.
     * @param {*} callback.value
     * @param {*} callback.key
     * @param {SetPolyfill} callback.set
     * @param {*} thisArg A value to use as `this` when executing callback function.
     */
    forEach(callback, thisArg) {
        for (let [key, value] of this.entries()) {
            Reflect.apply(callback, thisArg, [value, key, this]);
        }
    }

    get [Symbol.iterator]() {
        return this.values;
    }

    static get [Symbol.species]() {
        return SetPolyfill;
    }
}
