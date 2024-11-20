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

import { MapPolyfill } from "../map.js";

describe("MapPolyfill", () => {
    it("should be constructable without arguments", () => {
        // Given
        // When
        const instance = new MapPolyfill();

        // Then
        expect(instance.size).toBe(0);
    });

    it("should be constructable with an iterable", () => {
        // Given
        const iterable = [
            ["key1", "value1"],
            ["key2", "value2"],
        ];

        // When
        const instance = new MapPolyfill(iterable);

        // Then
        expect(instance.size).toBe(iterable.length);

        for (let [key, value] of iterable) {
            expect(instance.get(key)).toBe(value);
        }
    });

    it("should allow writing and reading data of arbitrary type keyed by an arbitrary type value", () => {
        // Given
        const key1 = false;
        const key2 = true;
        const key3 = 42;
        const key4 = "key4";
        const key5 = ["key5"];
        const key6 = { key: "key6" };
        const key7 = Symbol("key7");
        const key8 = () => "key8";

        const value1 = false;
        const value2 = true;
        const value3 = 42;
        const value4 = "value4";
        const value5 = ["value5"];
        const value6 = { value: "value6" };
        const value7 = Symbol("value7");
        const value8 = () => "value8";

        // When
        const instance = new MapPolyfill();

        instance.set(key1, value1);
        instance.set(key2, value2);
        instance.set(key3, value3);
        instance.set(key4, value4);
        instance.set(key5, value5);
        instance.set(key6, value6);
        instance.set(key7, value7);
        instance.set(key8, value8);

        // Then
        expect(instance.size).toBe(8);

        expect(instance.has(undefined)).toBeFalsy();
        expect(instance.has(null)).toBeFalsy();
        expect(instance.has(0)).toBeFalsy();
        expect(instance.has("")).toBeFalsy();
        expect(instance.has([])).toBeFalsy();
        expect(instance.has({})).toBeFalsy();
        expect(instance.has(() => {})).toBeFalsy();
        expect(instance.has(Symbol())).toBeFalsy();

        expect(instance.has(key1)).toBeTruthy();
        expect(instance.has(key2)).toBeTruthy();
        expect(instance.has(key3)).toBeTruthy();
        expect(instance.has(key4)).toBeTruthy();
        expect(instance.has(key5)).toBeTruthy();
        expect(instance.has(key6)).toBeTruthy();
        expect(instance.has(key7)).toBeTruthy();
        expect(instance.has(key8)).toBeTruthy();

        expect(instance.get(key1)).toBe(value1);
        expect(instance.get(key2)).toBe(value2);
        expect(instance.get(key3)).toBe(value3);
        expect(instance.get(key4)).toBe(value4);
        expect(instance.get(key5)).toBe(value5);
        expect(instance.get(key6)).toBe(value6);
        expect(instance.get(key7)).toBe(value7);
        expect(instance.get(key8)).toBe(value8);
    });

    it("should allow deleting items with a given key", () => {
        // Given
        const instance = new MapPolyfill([
            ["a", "A"],
            ["b", "B"],
            ["c", "C"],
        ]);

        // Then
        expect(instance.size).toBe(3);

        expect(instance.get("a")).toBe("A");
        expect(instance.get("b")).toBe("B");
        expect(instance.get("c")).toBe("C");

        // When
        const result1 = instance.delete("b");

        // Then
        expect(result1).toBeTruthy();
        expect(instance.size).toBe(2);

        expect(instance.get("a")).toBe("A");
        expect(instance.get("b")).toBeUndefined();
        expect(instance.get("c")).toBe("C");

        // When
        const result2 = instance.delete("b");

        // Then
        expect(result2).toBeFalsy();
        expect(instance.size).toBe(2);
    });

    it("should allow removing all items", () => {
        // Given
        const instance = new MapPolyfill([
            ["a", "A"],
            ["b", "B"],
            ["c", "C"],
        ]);

        // Then
        expect(instance.size).toBe(3);

        expect(instance.get("a")).toBe("A");
        expect(instance.get("b")).toBe("B");
        expect(instance.get("c")).toBe("C");

        // When
        instance.clear();

        // Then
        expect(instance.size).toBe(0);

        expect(instance.get("a")).toBeUndefined();
        expect(instance.get("b")).toBeUndefined();
        expect(instance.get("c")).toBeUndefined();
    });

    it("should be iterable", () => {
        // Given
        const iterable = [
            ["a", "A"],
            ["b", "B"],
            ["c", "C"],
        ];

        // When
        const instance = new MapPolyfill(iterable);

        // Then
        expect(instance[Symbol.iterator]).toBeDefined();

        // eslint-disable-next-line guard-for-in
        for (let [key, value] in instance) {
            const ki = iterable.find(([k]) => k === key);
            const vi = iterable.find(([, v]) => v === value);

            expect(ki).toBeDefined();
            expect(vi).toBeDefined();
        }
    });

    it("should implement the keys() method returning an iterable with map keys", () => {
        // Given
        const iterable = [
            ["a", "A"],
            ["b", "B"],
            ["c", "C"],
        ];

        // When
        const instance = new MapPolyfill(iterable);

        // Then
        // eslint-disable-next-line guard-for-in
        for (let key in instance.keys()) {
            const [, value] = iterable.find(([k]) => k === key);

            expect(value).toBeDefined();
            expect(instance.get(key)).toBe(value);
        }
    });

    it("should implement the values() method returning an iterable with map values", () => {
        // Given
        const iterable = [
            ["a", "A"],
            ["b", "B"],
            ["c", "C"],
        ];

        // When
        const instance = new MapPolyfill(iterable);

        // Then
        // eslint-disable-next-line guard-for-in
        for (let value in instance.values()) {
            const [key] = iterable.find(([v]) => v === value);

            expect(key).toBeDefined();
            expect(instance.get(key)).toBe(value);
        }
    });

    it("should implement the entries() method returning an iterable with map entries", () => {
        // Given
        const iterable = [
            ["a", "A"],
            ["b", "B"],
            ["c", "C"],
        ];

        // When
        const instance = new MapPolyfill(iterable);

        // Then
        // eslint-disable-next-line guard-for-in
        for (let [key, value] in instance.entries()) {
            const ki = iterable.find(([k]) => k === key);
            const vi = iterable.find(([, v]) => v === value);

            expect(ki).toBeDefined();
            expect(vi).toBeDefined();
        }
    });

    it("should implement the forEach() method", () => {
        // Given
        const iterable = [
            ["a", "A"],
            ["b", "B"],
            ["c", "C"],
        ];

        // When
        const instance = new MapPolyfill(iterable);

        // Then
        instance.forEach((value, key, m) => {
            const ki = iterable.find(([k]) => k === key);
            const vi = iterable.find(([, v]) => v === value);

            expect(m).toBe(instance);
            expect(ki).toBeDefined();
            expect(vi).toBeDefined();
        });
    });

    it("should implement the static groupBy() method", () => {
        // Given
        const inventory = [
            { name: "asparagus", type: "vegetables", quantity: 9 },
            { name: "bananas", type: "fruit", quantity: 5 },
            { name: "goat", type: "meat", quantity: 23 },
            { name: "cherries", type: "fruit", quantity: 12 },
            { name: "fish", type: "meat", quantity: 22 },
        ];

        const restock = { restock: true };
        const sufficient = { restock: false };

        const getGroupKey = ({ quantity }) => {
            return quantity < 6 ? restock : sufficient;
        };

        // When
        const result = MapPolyfill.groupBy(inventory, getGroupKey);

        // Then
        expect(result.size).toBe(2);

        expect(result.get(restock)).toEqual([inventory[1]]);

        expect(result.get(sufficient)).toEqual([
            inventory[0],
            inventory[2],
            inventory[3],
            inventory[4],
        ]);
    });
});
