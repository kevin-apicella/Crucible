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

afterEach(() => {
    jest.resetModules();
});

describe('Map', () => {
    it('should be a built-in class in Locker', async () => {
        // Given
        jest.mock('../runtime.js', () => ({
            isLocker: () => true,
            isLWS: () => false,
        }));

        // When
        const { Map: MaybeMap } = await import('../index.js');

        // Then
        expect(MaybeMap).toBe(Map);
        expect(MaybeMap.constructor).toBe(Map.constructor);
    });

    it('should be polyfilled in LWS', async () => {
        // Given
        jest.mock('c/ffui_utils', () => ({
            isLocker: () => false,
            isLWS: () => true,
        }));

        // When
        const { Map: MaybeMap } = await import('../index.js');
        const { MapPolyfill } = await import('../map.js');

        // Then
        expect(MaybeMap).toBe(MapPolyfill);
        expect(MaybeMap.constructor).toBe(MapPolyfill.constructor);
    });
});

describe('Set', () => {
    it('should be a built-in class in Locker', async () => {
        // Given
        jest.mock('c/ffui_utils', () => ({
            isLocker: () => true,
            isLWS: () => false,
        }));

        // When
        const { Set: MaybeSet } = await import('../index.js');

        // Then
        expect(MaybeSet).toBe(Set);
        expect(MaybeSet.constructor).toBe(Set.constructor);
    });

    it('should be polyfilled in LWS', async () => {
        // Given
        jest.mock('c/ffui_utils', () => ({
            isLocker: () => false,
            isLWS: () => true,
        }));

        // When
        const { Set: MaybeSet } = await import('../index.js');
        const { SetPolyfill } = await import('../set.js');

        // Then
        expect(MaybeSet).toBe(SetPolyfill);
        expect(MaybeSet.constructor).toBe(SetPolyfill.constructor);
    });
});
