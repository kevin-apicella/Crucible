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

import { SetPolyfill } from '../set.js';

describe('SetPolyfill', () => {
    it('should be constructable without arguments', () => {
        // Given
        // When
        const instance = new SetPolyfill();

        // Then
        expect(instance.size).toBe(0);
    });

    it('should be constructable with an iterable', () => {
        // Given
        const iterable = [
            ['key1', 'value1'],
            ['key2', 'value2'],
        ];

        // When
        const instance = new SetPolyfill(iterable);

        // Then
        expect(instance.size).toBe(iterable.length);

        for (let entry of iterable) {
            expect(instance.has(entry)).toBeTruthy();
        }
    });

    it('should support storing values of arbitrary type', () => {
        // Given
        const value1 = false;
        const value2 = true;
        const value3 = 42;
        const value4 = 'value4';
        const value5 = ['value5'];
        const value6 = { value: 'value6' };
        const value7 = Symbol('value7');
        const value8 = () => 'value8';

        // When
        const instance = new SetPolyfill();

        instance.add(value1);
        instance.add(value2);
        instance.add(value3);
        instance.add(value4);
        instance.add(value5);
        instance.add(value6);
        instance.add(value7);
        instance.add(value8);

        // Then
        expect(instance.size).toBe(8);

        expect(instance.has(undefined)).toBeFalsy();
        expect(instance.has(null)).toBeFalsy();
        expect(instance.has(0)).toBeFalsy();
        expect(instance.has('')).toBeFalsy();
        expect(instance.has([])).toBeFalsy();
        expect(instance.has({})).toBeFalsy();
        expect(instance.has(() => {})).toBeFalsy();
        expect(instance.has(Symbol())).toBeFalsy();

        expect(instance.has(value1)).toBeTruthy();
        expect(instance.has(value2)).toBeTruthy();
        expect(instance.has(value3)).toBeTruthy();
        expect(instance.has(value4)).toBeTruthy();
        expect(instance.has(value5)).toBeTruthy();
        expect(instance.has(value6)).toBeTruthy();
        expect(instance.has(value7)).toBeTruthy();
        expect(instance.has(value8)).toBeTruthy();
    });

    it('should store unique values only', () => {
        // Given
        const value1 = 'value1';
        const value2 = ['value2'];
        const value3 = { value: 'value3' };
        const value4 = Symbol('value4');
        const value5 = () => 'value5';

        const iterable = [
            value1,
            value1,
            value2,
            value2,
            value3,
            value3,
            value4,
            value4,
            value5,
            value5,
        ];

        // When
        const instance = new SetPolyfill(iterable);

        // Then
        expect(instance.size).toBe(5);

        expect(instance.has(value1)).toBeTruthy();
        expect(instance.has(value2)).toBeTruthy();
        expect(instance.has(value3)).toBeTruthy();
        expect(instance.has(value4)).toBeTruthy();
        expect(instance.has(value5)).toBeTruthy();
    });

    it('should support removing individual values', () => {
        // Given
        const instance = new SetPolyfill(['a', 'b', 'c']);

        // Then
        expect(instance.size).toBe(3);

        expect(instance.has('a')).toBeTruthy();
        expect(instance.has('b')).toBeTruthy();
        expect(instance.has('c')).toBeTruthy();

        // When
        const result1 = instance.delete('b');

        // Then
        expect(result1).toBeTruthy();
        expect(instance.size).toBe(2);

        expect(instance.has('a')).toBeTruthy();
        expect(instance.has('b')).toBeFalsy();
        expect(instance.has('c')).toBeTruthy();

        // When
        const result2 = instance.delete('b');

        // Then
        expect(result2).toBeFalsy();
        expect(instance.size).toBe(2);

        expect(instance.has('a')).toBeTruthy();
        expect(instance.has('b')).toBeFalsy();
        expect(instance.has('c')).toBeTruthy();
    });

    it('should support removing all values at once', () => {
        // Given
        const instance = new SetPolyfill(['a', 'b', 'c']);

        // Then
        expect(instance.size).toBe(3);

        expect(instance.has('a')).toBeTruthy();
        expect(instance.has('b')).toBeTruthy();
        expect(instance.has('c')).toBeTruthy();

        // When
        instance.clear();

        // Then
        expect(instance.size).toBe(0);

        expect(instance.has('a')).toBeFalsy();
        expect(instance.has('b')).toBeFalsy();
        expect(instance.has('c')).toBeFalsy();
    });

    it('should be iterable', () => {
        // Given
        const iterable = ['a', 'b', 'c'];

        // When
        const instance = new SetPolyfill(iterable);

        // Then
        expect(instance[Symbol.iterator]).toBeDefined();

        // eslint-disable-next-line guard-for-in
        for (let value in instance) {
            const vi = iterable.find((v) => v === value);

            expect(vi).toBeDefined();
        }
    });

    it('should implement the keys() method returning an iterable with set values', () => {
        // Given
        const iterable = [
            ['a', 'A'],
            ['b', 'B'],
            ['c', 'C'],
        ];

        // When
        const instance = new SetPolyfill(iterable);

        // Then
        // eslint-disable-next-line guard-for-in
        for (let value in instance.keys()) {
            const vi = iterable.find((v) => v === value);

            expect(value).toBeDefined();
            expect(instance.has(vi)).toBeTruthy();
        }
    });

    it('should implement the values() method returning an iterable with set values', () => {
        // Given
        const iterable = [
            ['a', 'A'],
            ['b', 'B'],
            ['c', 'C'],
        ];

        // When
        const instance = new SetPolyfill(iterable);

        // Then
        // eslint-disable-next-line guard-for-in
        for (let value in instance.values()) {
            const vi = iterable.find((v) => v === value);

            expect(value).toBeDefined();
            expect(instance.has(vi)).toBeTruthy();
        }
    });

    it('should implement the entries() method returning an iterable with set entries', () => {
        // Given
        const iterable = ['a', 'b', 'c'];

        // When
        const instance = new SetPolyfill(iterable);

        // Then
        // eslint-disable-next-line guard-for-in
        for (let [key, value] in instance.entries()) {
            const ki = iterable.find((k) => k === key);
            const vi = iterable.find((v) => v === value);

            expect(ki).toBeDefined();
            expect(vi).toBeDefined();

            expect(key === value).toBeTruthy();
        }
    });

    it('should implement the forEach() method', () => {
        // Given
        const iterable = ['a', 'b', 'c'];

        // When
        const instance = new SetPolyfill(iterable);

        // Then
        instance.forEach((value, key, s) => {
            const ki = iterable.find((k) => k === key);
            const vi = iterable.find((v) => v === value);

            expect(s).toBe(instance);
            expect(ki).toBeDefined();
            expect(vi).toBeDefined();

            expect(key === value).toBeTruthy();
        });
    });
});
