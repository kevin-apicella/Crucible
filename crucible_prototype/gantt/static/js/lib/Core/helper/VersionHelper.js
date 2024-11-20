import BrowserHelper from './BrowserHelper.js';
import StringHelper from './StringHelper.js';

/**
 * @module Core/helper/VersionHelper
 */

/**
 * Helper for version handling
 *
 * ```javascript
 * VersionHelper.setVersion('grid', '1.5');
 * if (VersionHelper.getVersion('grid').isNewerThan('1.0')) {
 *   ...
 * }
 * ```
 *
 * @private
 */
export default class VersionHelper {
    /**
     * Set version for specified product
     * @private
     * @param {String} product
     * @param {String} version
     */
    static setVersion(product, version) {
        product = product.toLowerCase();

        VH[product] = {
            version,
            isNewerThan(otherVersion) {
                return VersionHelper.semanticCompareVersion(otherVersion, version, '<');
            },
            isOlderThan(otherVersion) {
                return VersionHelper.semanticCompareVersion(otherVersion, version, '>');
            }
        };

        let bundleFor = '';

        // Var productName is only defined in bundles, it is internal to bundle so not available on window. Used to
        // tell importing combinations of grid/scheduler/gantt bundles apart from loading same bundle twice
        if (typeof productName !== 'undefined') {
            // eslint-disable-next-line no-undef
            bundleFor = productName;
        }

        // Set "global" flag to detect bundle being loaded twice
        const globalKey = `${bundleFor}.${product}${version.replace(/\./g, '-')}`;

        if (BrowserHelper.isBrowserEnv && !globalThis.bryntum.silenceBundleException) {
            if (globalThis.bryntum[globalKey] === true) {
                if (this.isTestEnv) {
                    globalThis.BUNDLE_EXCEPTION = true;
                }
                else {
                    let errorProduct = bundleFor || product;

                    if (errorProduct === 'core') {
                        errorProduct = 'grid';
                    }

                    let capitalized  = StringHelper.capitalize(errorProduct);

                    if (errorProduct === 'schedulerpro') {
                        capitalized = 'SchedulerPro';
                    }

                    throw new Error(
                        `The Bryntum ${capitalized} bundle was loaded multiple times by the application.\n\n` +
                        `Common reasons you are getting this error includes:\n\n` +
                        `* Imports point to different types of the bundle (e.g. *.module.js and *.umd.js)\n` +
                        `* Imports point to both sources and bundle\n` +
                        `* Imports do not use the shortest relative path, JS treats them as different files\n` +
                        `* Cache busters differ between imports, JS treats ${errorProduct}.module.js?1 and ${errorProduct}.module.js?2 as different files\n` +
                        `* Imports missing file type, verify they all end in .js\n\n` +
                        `See https://bryntum.com/products/${errorProduct}/docs/guide/${capitalized}/gettingstarted/es6bundle#troubleshooting for more information\n\n`
                    );
                }
            }
            else {
                globalThis.bryntum[globalKey] = true;
            }
        }
    }

    /**
     * Get (previously set) version for specified product
     * @private
     * @param {String} product
     */
    static getVersion(product) {
        product = product.toLowerCase();

        if (!VH[product]) {
            throw new Error('No version specified! Please check that you import VersionHelper correctly into the class from where you call `deprecate` function.');
        }

        return VH[product].version;
    }

    /**
     * Checks the version1 against the passed version2 using the comparison operator.
     * Supports `rc`, `beta`, `alpha` release states. Eg. `1.2.3-alpha-1`.
     * State which is not listed above means some version below `alpha`.
     * @param {String} version1 The version to test against
     * @param {String} version2 The version to test against
     * @param {String} [comparison] The comparison operator, `<=`, `<`, `=`, `>` or `>=`.
     * @returns {Boolean} `true` if the test passes.
     * @internal
     */
    static semanticCompareVersion(version1, version2, comparison = '=') {
        version1 = version1 || '';
        version2 = version2 || '';
        const
            version1Arr  = version1.split(/[-.]/),
            version2Arr  = version2.split(/[-.]/),
            isLower      = comparison.includes('<'),
            normalizeArr = (arr, maxLength) => {
                const
                    states = ['rc', 'beta', 'alpha'],
                    result = arr.map(v => {
                        if (states.includes(v)) {
                            return -states.indexOf(v) - 2;
                        }
                        const res = Number.parseInt(v);
                        return Number.isNaN(res) ? -states.length : res;
                    });

                while (result.length < maxLength) {
                    result.push(-1);
                }
                return result;
            },
            compareArr   = () => {
                const
                    maxLength = Math.max(version1Arr.length, version2Arr.length),
                    arr1      = normalizeArr(version1Arr, maxLength),
                    arr2      = normalizeArr(version2Arr, maxLength);

                for (let i = 0; i < maxLength; i++) {
                    if (arr1[i] !== arr2[i]) {
                        return isLower ? arr1[i] < arr2[i] : arr1[i] > arr2[i];
                    }
                }
                return true;
            };

        switch (comparison) {
            case '=':
                return version1 === version2;
            case '<=':
            case '>=':
                return (version1 === version2) || compareArr();
            case '<':
            case '>':
                return (version1 !== version2) && compareArr();
        }

        return false;
    }

    /**
     * Checks the passed product against the passed version using the passed test.
     * @param {String} product The name of the product to test the version of
     * @param {String} version The version to test against
     * @param {String} operator The test operator, `<=`, `<`, `=`, `>` or `>=`.
     * @returns {Boolean} `true` if the test passes.
     * @internal
     */
    static checkVersion(product, version, operator) {
        return VersionHelper.semanticCompareVersion(VH.getVersion(product), version, operator);
    }

    /**
     * Based on a comparison of current product version and the passed version this method either outputs a console.warn
     * or throws an error.
     * @param {String} product The name of the product
     * @param {String} invalidAsOfVersion The version where the offending code is invalid (when any compatibility layer
     * is actually removed).
     * @param {String} message Required! A helpful warning message to show to the developer using a deprecated API.
     * @internal
     */
    static deprecate(product, invalidAsOfVersion, message) {
        const justWarn = VH.checkVersion(product, invalidAsOfVersion, '<');



        if (justWarn) {


            // During the grace period (until the next major release following the deprecated code), just show a console warning
            console.warn(`Deprecation warning: You are using a deprecated API which will change in v${invalidAsOfVersion}. ${message}`);
        }
        else {
            throw new Error(`Deprecated API use. ${message}`);
        }
    }

    /**
     * Returns truthy value if environment is in testing mode
     * @returns {Boolean}
     * @internal
     **/
    static get isTestEnv() {
        const isTestEnv = Boolean(globalThis.bryntum?.isTestEnv);
        try {
            return isTestEnv || Boolean(globalThis.parent?.bryntum?.isTestEnv);
        }
        catch (e) {
            // Accessing parent may cause CORS violation
            return isTestEnv;
        }
    }

    static get isDebug() {
        let result = false;

        return result;
    }
}

const VH = VersionHelper;



if (BrowserHelper.isBrowserEnv) {
    if (VH.isTestEnv) {
        BrowserHelper._isHoverableDevice = true;
    }

    globalThis.bryntum = Object.assign(globalThis.bryntum || {}, {
        getVersion   : VH.getVersion.bind(VH),
        checkVersion : VH.checkVersion.bind(VH),
        deprecate    : VH.deprecate.bind(VH),
        license      : 'b7c31139-24dc-11ef-b0ff-d094663d5c88'
    });
}
