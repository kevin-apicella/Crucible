/**
 * @module Core/helper/ArrayHelper
 */

/**
 * Helper with useful functions for handling Arrays
 * @internal
 */
export default class ArrayHelper {
    static clean(array) {
        return array.reduce((res, item) => {
            if (item !== null && item !== undefined && !(Array.isArray(item) && item.length === 0) && item !== '') res.push(item);
            return res;
        }, []);
    }

    /**
     * Similar to [`Array.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)
     * this method creates an array from an `iterable` object. Where `Array.from()` accepts a mapper function as the
     * second argument, this method accepts a `filter` function as its second argument. If a mapper function is also
     * needed, it can be passed as the third argument. Unlike `Array.from()`, if this method is passed `null`, it will
     * return an empty array.
     * @param {Array} iterable The iterable object to convert (must support `for-of` loop iteration).
     * @param {Function} [filter] A function to apply to each item of the `iterable` which must return a truthy value
     * to include that item in the resulting array.
     * @param {Function} [map] A function to apply to each item of the `iterable` that returns the actual value to put
     * into the returned array. If a `filter` is also supplied, this method is only called for those items that pass
     * the filter test.
     * @returns {Array}
     */
    static from(iterable, filter, map) {
        const array = [];

        if (iterable) {
            for (const it of iterable) {
                if (!filter || filter(it)) {
                    array.push(map ? map(it) : it);
                }
            }
        }

        return array;
    }

    /**
     * Remove one or more items from an array
     * @param {Array} array Array to remove from
     * @param {Object[]|Set} items One or more items to remove, or one Set containing items to remove
     * @returns {Boolean} Returns true if any item was removed
     */
    static remove(array, ...items) {
        let index,
            item,
            removed = false;

        items = items[0] instanceof Set ? [...items[0]] : items;
        for (let i = 0; i < items.length; i++) {
            item = items[i];
            if ((index = array.indexOf(item)) !== -1) {
                array.splice(index, 1);
                removed = true;
            }
        }

        return removed;
    }

    /**
     * Calculates the insertion index of a passed object into the passed Array according
     * to the passed comparator function. Note that the passed Array *MUST* already be ordered.
     * @param {Object} item The item to calculate the insertion index for.
     * @param {Array} array The array into which the item is to be inserted.
     * @param {Function} comparatorFn The comparison function. Must return -1 or 0 or 1.
     * @param {Object} comparatorFn.lhs The left object to compare.
     * @param {Object} comparatorFn.rhs The right object to compare.
     * @param {Number} index The possible correct index to try first before a binary
     * search is instigated.
     * @internal
     */
    static findInsertionIndex(item, array, comparatorFn = this.lexicalCompare, index) {
        const len = array.length;
        let beforeCheck, afterCheck;

        if (index < len) {
            beforeCheck = index > 0 ? comparatorFn(array[index - 1], item) : 0;
            afterCheck = index < len - 1 ? comparatorFn(item, array[index]) : 0;
            if (beforeCheck < 1 && afterCheck < 1) {
                return index;
            }
        }

        return this.binarySearch(array, item, comparatorFn);
    }

    /**
     * Similar to the native `Array.find()` call, but this finds the *last* element in the array for which
     * the passed function returns a truthy value.
     * @param {Object[]} array The array to find in.
     * @param {Function} fn The testing function.
     * @param {Object} [thisObj] The scope (`this` reference) in which to call the function.
     */
    static findLast(array, fn, thisObj) {
        for (let { length } = array, i = length - 1; i >= 0; i--) {
            if (fn.call(thisObj, array[i], i, array)) {
                return array[i];
            }
        }
    }

    /**
     * This method returns the index that a given item would be inserted into the
     * given (sorted) `array`. Note that the given `item` may or may not be in the
     * array. This method will return the index of where the item *should* be.
     *
     * For example:
     *
     *      var array = [ 'A', 'D', 'G', 'K', 'O', 'R', 'X' ];
     *      var index = ArrayHelper.binarySearch(array, 'E');
     *
     *      console.log('index: ' + index);
     *      // logs "index: 2"
     *
     *      array.splice(index, 0, 'E');
     *
     *      console.log('array : ' + array.join(''));
     *      // logs "array: ADEGKORX"
     *
     * @param {Object[]} array The array to search.
     * @param {Object} item The item that you want to insert into the `array`.
     * @param {Number} [begin=0] The first index in the `array` to consider.
     * @param {Number} [end=array.length] The index that marks the end of the range
     * to consider. The item at this index is *not* considered.
     * @param {Function} [compareFn] The comparison function that matches the sort
     * order of the `array`. The default `compareFn` compares items using less-than
     * and greater-than operators.
     * @returns {Number} The index for the given item in the given array based on
     * the passed `compareFn`.
     */
    static binarySearch(array, item, begin = 0, end = array.length, compareFn = this.lexicalCompare) {
        const length = array.length;
        let middle, comparison;

        if (begin instanceof Function) {
            compareFn = begin;
            begin = 0;
        }
        else if (end instanceof Function) {
            compareFn = end;
            end = length;
        }

        --end;

        while (begin <= end) {
            middle = (begin + end) >> 1;
            comparison = compareFn(item, array[middle]);
            if (comparison >= 0) {
                begin = middle + 1;
            }
            else if (comparison < 0) {
                end = middle - 1;
            }
        }

        return begin;
    }

    magnitudeCompare(lhs, rhs) {
        return (lhs < rhs) ? -1 : ((lhs > rhs) ? 1 : 0);
    }

    lexicalCompare(lhs, rhs) {
        lhs = String(lhs);
        rhs = String(rhs);

        return (lhs < rhs) ? -1 : ((lhs > rhs) ? 1 : 0);
    }

    /**
     * Similar to Array.prototype.fill(), but constructs a new array with the specified item count and fills it with
     * clones of the supplied item.
     * @param {Number} count Number of entries to create
     * @param {Object|Array} itemOrArray Item or array of items to clone (uses object spread to create shallow clone)
     * @param {Function} [fn] An optional function that is called for each item added, to allow processing
     * @returns {Array} A new populated array
     */
    static fill(count, itemOrArray = {}, fn = null) {
        const
            result = [],
            items  = Array.isArray(itemOrArray) ? itemOrArray : [itemOrArray];

        for (let i = 0; i < count; i++) {
            for (const item of items) {
                // Using object spread here forces us to use more babel plugins and will make
                // react_typescript demo very difficult to setup
                const processedItem = Object.assign({}, item);

                if (fn) {
                    fn(processedItem, i);
                }

                result.push(processedItem);
            }
        }
        return result;
    }

    /**
     * Populates an array with the return value from `fn`.
     * @param {Number} count Number of entries to create
     * @param {Function} fn A function that is called `count` times, return value is added to array
     * @param {Number} fn.index Current index in the array
     * @privateparam {Boolean} [oneBased] Add 1 to the index before calling the fn (making it 1 based)
     * @returns {Array} A new populated array
     */
    static populate(count, fn, oneBased = false) {
        const items = [];
        for (let i = 0; i < count; i++) {
            items.push(fn(i + (oneBased ? 1 : 0)));
        }
        return items;
    }

    /**
     * Pushes `item` on to the `array` if not already included
     * @param {Array}  array Array to push to
     * @param {...Object} items Item(s) to push if not already included
     */
    static include(array, ...items) {
        for (const item of items) {
            if (!array.includes(item)) {
                array.push(item);
            }
        }
    }

    /**
     * Returns a new array with the unique items from the supplied array.
     * @param {Array} array Input array
     * @returns {Array} New array with unique items
     */
    static unique(array) {
        return [...new Set(array)];
    }

    // Kept for future reference : Wanted to create an indexer on Stores.
    static allowNegative(array) {
        // From https://github.com/sindresorhus/negative-array
        return new Proxy(array, {
            get(target, name, receiver) {
                if (typeof name !== 'string') {
                    return Reflect.get(target, name, receiver);
                }

                const index = Number(name);

                if (Number.isNaN(index)) {
                    return Reflect.get(target, name, receiver);
                }

                return target[index < 0 ? target.length + index : index];
            },
            set(target, name, value, receiver) {
                if (typeof name !== 'string') {
                    return Reflect.set(target, name, value, receiver);
                }

                const index = Number(name);

                if (Number.isNaN(index)) {
                    return Reflect.set(target, name, value, receiver);
                }

                target[index < 0 ? target.length + index : index] = value;

                return true;
            }
        });
    }

    static delta(a, b, useRelativeNaming = false) {
        // Nicer syntax but about 40% slower (an extra iteration)
        // const
        //     onlyInA = a.filter(item => !b.includes(item)),
        //     onlyInB = b.filter(item => !a.includes(item)),
        //     inBoth  = a.filter(item => b.includes(item));

        // Quick bailout for nonexisting target array
        if (!b) {
            return useRelativeNaming
                ? { toAdd : a, toRemove : [], toKeep : [] }
                : { onlyInA : a, onlyInB : [], inBoth : [] };
        }

        const
            onlyInA = [],
            onlyInB = [],
            inBoth  = new Set(),
            bSet    = new Set(b);

        for (let i = 0; i < a.length; i++) {
            const item = a[i];

            if (bSet.has(item)) {
                inBoth.add(item);
            }
            else {
                onlyInA.push(item);
            }
        }

        for (let i = 0; i < b.length; i++) {
            const item = b[i];

            if (!inBoth.has(item)) {
                onlyInB.push(item);
            }
        }

        if (useRelativeNaming) {
            return { toAdd : onlyInA, toRemove : onlyInB, toKeep : inBoth };
        }

        return { onlyInA, onlyInB, inBoth : [...inBoth] };
    }

    /**
     * Returns the passed object wrapped in an array. Special handling of the following cases:
     * * Passing an array returns it as is
     * * Passing a `Set` returns it converted to an Array
     * * Passing `null`/`undefined` returns the passed value
     *
     * ```javascript
     * const records = ArrayHelper.asArray(record);
     *
     * // { id : 1 } -> [{ id : 1 }]
     * // [{ id : 1 }] -> [{ id : 1 }]
     * ```
     *
     * @param {*} arrayOrObject
     * @returns {Array|null}
     * @internal
     */
    static asArray(arrayOrObject) {
        if (arrayOrObject == null) {
            return arrayOrObject;
        }

        if (arrayOrObject instanceof Set) {
            return Array.from(arrayOrObject);
        }

        return Array.isArray(arrayOrObject) ? arrayOrObject : [arrayOrObject];
    }

    /**
     * Identity function that returns its input.
     * @param {*} Any value
     * @returns {*} The input value
     * @internal
     */
    static identity(x) {
        return x;
    }

    /**
     * Transform an array into a key:value dictionary using the specified
     * key and value getters. Does not group values, so only one result will
     * appear in the output for a given key.
     *
     * ```javascript
     * const input = [{
     *     id: '1',
     *     other: 'one'
     * },{
     *     id: '2',
     *     other: 'two'
     * }];
     *
     * keyBy(input, rec => rec.id)
     *
     * // {
     * //    '1': { id: '1', other: 'one' },
     * //    '2': { id: '2', other: 'two' }
     * // }
     * ```
     *
     * @param {Array} array Array from which to build dictionary
     * @param {Function|String} getKey Function to produce the key for a given array entry, or a string property name to read
     * @param {Function} getValue Optional function to transform array elements. Defaults to returning the element itself
     * @returns {Object} A key->value dictionary with keys as returned by `getKey` and values returned by `getValue`
     * @internal
     */
    static keyBy(array, keyGetter, valueGetter = ArrayHelper.identity) {
        const
            getKey = typeof keyGetter === 'string' ? o => o?.[keyGetter] : keyGetter,
            getValue = typeof valueGetter === 'string' ? o => o?.[valueGetter] : valueGetter;
        return array.reduce((dict, next) => {
            dict[getKey(next)] = getValue(next);
            return dict;
        }, {});
    }

    /**
     * Combines provided arrays of by aggregating their element values.
     * For example the below code sums up numeric elements of the arrays:
     *
     * ```javascript
     * ArrayHelper.aggregate(
     *     [
     *         [0,   1,  2, 33]
     *         [10,  1, -1],
     *         [100, 1, -1]
     *     ],
     *     entry => entry || 0, // "|| 0" here to make it work for different array sizes
     *     (aggregated, entry) => aggregated + entry, // aggregate by summing up
     *     () => 0 //initial value is zero
     * );
     *
     * // returns [111, 3, 0, 33] array
     * ```
     *
     * @param {Array[]} arrays Array to combine
     * @param {Function} getEntryValueFn Function that extracts an array entry for aggregating.
     * @param {Function} aggregatorFn A function to execute for each element in the arrays. It's purpose is to
     * aggregate the element value to the corresponding entry of the resulting array.
     * The function's return value becomes the value of the `aggregated` parameter on the next invocation of
     * `aggregatorFn`.
     * The function is called with the following arguments:
     *
     * @param {Object} aggregatorFn.aggregated Resulting array entry value. On the first call
     * `getInitialValueFn` result.
     * @param {Object} aggregatorFn.entry Current entry to aggregate into `aggregated`.
     * @param {Number} aggregatorFn.arrayIndex Index of current array (in the provided `arrays`).
     * @param {Object[]} aggregatorFn.entryIndex Index of the current entry.
     * @param {Object} aggregationContext A shared object providing extra aggregation call context.
     * @param {Function} getInitialValueFn Function that returns an initial value for the combined array entries.
     * @param {Object} [aggregationContext] Optional object that is passed to all of the above functions that can
     * be used for keeping some additional parameters used when aggregating.
     * Out of the box the object will contain `arrays` and `targetArray` properties containing
     * input and resulting arrays respectively.
     */
    static aggregate(arrays, getEntryValueFn, aggregatorFn, getInitialValueFn, aggregationContext = {}) {
        const
            rowLength    = arrays.length,
            columnLength = arrays[0].length,
            result       = [];

        // provide some context by default
        // the resulting array reference and list of array given for aggregating
        aggregationContext.targetArray = result;
        aggregationContext.arrays = arrays;

        for (let colIndex = 0; colIndex < columnLength; colIndex++) {
            aggregationContext.entryIndex = colIndex;

            result.push(getInitialValueFn(colIndex, aggregationContext));
        }

        // iterate provided arrays
        for (let rowIndex = 0; rowIndex < rowLength; rowIndex++) {
            const row = arrays[rowIndex];

            aggregationContext.rowIndex = rowIndex;

            for (let colIndex = 0; colIndex < columnLength; colIndex++) {
                aggregationContext.entryIndex = colIndex;

                const entryValue = getEntryValueFn(row[colIndex], aggregationContext);

                // aggregate them
                result[colIndex] = aggregatorFn(result[colIndex], entryValue, rowIndex, colIndex, aggregationContext);
            }
        }

        return result;
    }

    /**
     * Group an array by keys (either the values in a specified property name, or the results of a string-generating function accepting
     * an array entry as input), returning an Object with those keys, whose values are arrays containing the array entries that
     * produced that key.
     *
     * ```javascript
     * const input = [{
     *     id: 1,
     *     color: 'red'
     * },{
     *     id: 2,
     *     color: 'green'
     * },{
     *     id: 3,
     *     color: 'green'
     * }];
     *
     * groupBy(input, 'color')
     *
     * // {
     * //    'red': [ { id: '1', color: 'red' } ],
     * //    'green': [ { id: '2', color: 'green' }, { id: '3', color: 'green' } ]
     * // }
     *
     * groupBy(input, rec => rec.color?.substr(0, 1))
     *
     * // {
     * //    'r': [ { id: '1', color: 'red' } ],
     * //    'g': [ { id: '2', color: 'green' }, { id: '3', color: 'green' } ]
     * // }
     * ```
     *
     * @param {Object} array Array from which to build dictionary
     * @param {Function|String} getGroupKey Function to produce the key for a given array entry, or a string property name to read
     * @returns {Object} A key->value[] dictionary with keys as returned by `getKey` and arrays of matching items in original order as values
     * @internal
     */
    static groupBy(array, groupKeyGetter) {
        const getKey = typeof groupKeyGetter === 'string' ? o => o?.[groupKeyGetter] : groupKeyGetter;
        return array.reduce((grouped, value) => {
            const key = getKey(value);
            (grouped[key] = grouped[key] || []).push(value);
            return grouped;
        }, {});
    }

    static groupByIndexed(array, getKey) {
        return array.reduce((grouped, value) => {
            const key = getKey(value);
            let existing = grouped.get(key);

            if (existing === undefined) {
                existing = new Set();
                grouped.set(key, existing);
            }

            existing.add(value);

            return grouped;
        }, new Map());
    }
}
