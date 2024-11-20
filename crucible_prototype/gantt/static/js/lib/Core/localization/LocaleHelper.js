/**
 * @module Core/localization/LocaleHelper
 */

/**
 * @typedef {Object} LocaleKeys
 * Object which contains `key: value` localization pairs.
 * Key value may have `String`, `Function`, `LocaleKeys` or `Object` type.
 *
 * Example:
 *
 * ```javascript
 * {
 *     title   : 'Title',
 *     count   : number => `Count is ${number}`,
 *     MyClass : {
 *        foo : 'bar'
 *     }
 * }
 * ```
 *
 * @property {String|Function|LocaleKeys|Object} key localization key
 * @typings {[key: string]}:{string|number|Function|LocaleKeys|object}
 */

/**
 * @typedef {LocaleKeys} Locale
 * Locale configuration object which contains locale properties alongside with localization pairs.
 *
 * Example:
 *
 * ```javascript
 {
 *     localeName : 'En',
 *     localeDesc : 'English (US)',
 *     localeCode : 'en-US',
 *     ... (localization key:value pairs)
 * }
 * ```
 *
 * @property {String} localeName Locale name. For example: "En"
 * @property {String} localeDesc Locale description to be shown in locale picker list. For example: "English (US)"
 * @property {String} localeCode Locale code. Two letter locale code or two letter locale and two letter country code.
 * For example: "en" or 'en_US'
 * @property {String} [localePath] Locale path for asynchronous loading using
 * AjaxHelper {@link Core.helper.AjaxHelper#function-get-static} request
 */

/**
 * @typedef {Object} Locales
 * Object which contains locales. Each object key represents published locale by its `localeName`.
 *
 * Example:
 *
 * ```javascript
 * // This returns English locale.
 * const englishLocale = LocaleHelper.locales.En;
 * ```
 *
 * @property {Locale} key localization object
 * @typings {[key: string]}:{Locale}
 */


const global = typeof self !== 'undefined'
    ? self
    : typeof globalThis !== 'undefined'
        ? globalThis
        : null;

/**
 * Thin class which provides locale management methods.
 * Class doesn't import other API classes and can be used separately for publishing locales before importing product classes.
 *
 * Locale should be published with {@link #function-publishLocale-static} method before it is available for localizing of Bryntum API classes and widgets.
 *
 * Example:
 *
 * ```javascript
 * LocaleHelper.publishLocale({
 *     localeName : 'En',
 *     localeDesc : 'English (US)',
 *     localeCode : 'en-US',
 *     ... (localization key:value pairs)
 * });
 * ```
 *
 * or for asynchronous loading from remote path on applying locale
 *
 * ```javascript
 *LocaleHelper.publishLocale({
 *     localeName : 'En',
 *     localeDesc : 'English (US)',
 *     localeCode : 'en-US',
 *     localePath : 'https://my-server/localization/en.js'
 * });
 * ```
 */
export default class LocaleHelper {

    static skipLocaleIntegrityCheck = false;

    /**
     * Merges all properties of provided locale objects into new locale object.
     * Locales are merged in order they provided and locales which go later replace
     * same properties of previous locales.
     * @param {...Object} locales Locales to merge
     * @returns {Object} Merged locale
     */
    static mergeLocales(...locales) {
        const result = {};

        locales.forEach(locale => {
            Object.keys(locale).forEach(key => {
                if (typeof locale[key] === 'object') {
                    result[key] = { ...result[key], ...locale[key] };
                }
                else {
                    result[key] = locale[key];
                }
            });
        });
        return result;
    }

    /**
     * Removes all properties from `locale` that are present in the provided `toTrim`.
     * @param {Object} locale Locale to process
     * @param {Object} toTrim Object enumerating properties that should be removed.
     * When `false` throws exceptions in such cases.
     */
    static trimLocale(locale, toTrim) {
        const remove = (key, subKey) => {
            if (locale[key]) {
                if (subKey) {
                    if (locale[key][subKey]) {
                        delete locale[key][subKey];
                    }
                }
                else {
                    delete locale[key];
                }
            }
        };

        Object.keys(toTrim).forEach(key => {
            if (Object.keys(toTrim[key]).length > 0) {
                Object.keys(toTrim[key]).forEach(subKey => remove(key, subKey));
            }
            else {
                remove(key);
            }
        });
    }

    /**
     * Normalizes locale object to {@link Locale} type.
     *
     * Supported configs:
     *
     * ```javascript
     * LocaleHelper.normalizeLocale({
     *     localeName : 'En',
     *     localeDesc : 'English (US)',
     *     localeCode : 'en-US',
     *     ... (localization key:value pairs)
     * });
     * ```
     *
     * and for backward compatibility
     *
     * ```javascript
     * LocaleHelper.normalizeLocale('En', {
     *     name : 'En',
     *     desc : 'English (US)',
     *     code : 'en-US',
     *     locale : {
     *         ... (localization key:value pairs)
     *     }
     * });
     * ```
     * @param {String|Object} nameOrConfig String name of locale or locale object
     * @param {Object} [config] Locale object
     * @returns {Locale} Locale object
     * @internal
     */
    static normalizeLocale(nameOrConfig, config) {

        if (!nameOrConfig) {
            throw new Error(`"nameOrConfig" parameter can not be empty`);
        }

        if (typeof nameOrConfig === 'string') {
            if (!config) {
                throw new Error(`"config" parameter can not be empty`);
            }

            if (config.locale) {
                // Matches legacy locale type
                config.name = nameOrConfig || config.name;
            }
            else {
                config.localeName = nameOrConfig;
            }
        }
        else {
            config = nameOrConfig;
        }

        let locale = {};

        if (config.name || config.locale) {
            // Matches legacy locale type
            locale = Object.assign({
                localeName : config.name
            }, config.locale);
            config.desc && (locale.localeDesc = config.desc);
            config.code && (locale.localeCode = config.code);
            config.path && (locale.localePath = config.path);
        }
        else {
            if (!config.localeName) {
                throw new Error(`"config" parameter doesn't have "localeName" property`);
            }
            // Extract locale config from name object
            locale = Object.assign({}, config);
        }

        // Cleanup result
        for (const key of ['name', 'desc', 'code', 'path']) {
            if (locale[key]) {
                delete locale[key];
            }
        }

        if (!locale.localeName) {
            throw new Error(`Locale name can not be empty`);
        }

        return locale;
    }

    /**
     * Get/set currently published locales.
     * Returns an object with locales.
     *
     * Example:
     *
     * ```javascript
     * const englishLocale = LocaleHelper.locales.En;
     * ```
     *
     * `englishLocale` contains {@link Locale} object.
     *
     * @readonly
     * @member {Locales} locales
     * @static
     */
    static get locales() {
        return global.bryntum.locales || {};
    }

    static set locales(locales) {
        global.bryntum.locales = locales;
    }

    /**
     * Get/set current locale name. Defaults to "En"
     * @member {String} localeName
     * @static
     */
    static get localeName() {
        return global.bryntum.locale || 'En';
    }

    static set localeName(localeName) {
        global.bryntum.locale = localeName || LocaleHelper.localeName;
    }

    /**
     * Get current locale config specified by {@link #property-localeName-static}.
     * If no current locale specified, returns default `En` locale or first published locale
     * or empty locale object if no published locales found.
     * @readonly
     * @member {Locales} locale
     * @static
     */
    static get locale() {
        return LocaleHelper.localeName && this.locales[LocaleHelper.localeName] || this.locales.En || Object.values(this.locales)[0] || { localeName : '', localeDesc : '', localeCoode : '' };
    }

    /**
     * Publishes a locale to make it available for applying.
     * Published locales are available in {@link #property-locales-static}.
     *
     * Recommended usage:
     *
     * ```javascript
     * LocaleHelper.publishLocale({
     *     localeName : 'En',
     *     localeDesc : 'English (US)',
     *     localeCode : 'en-US',
     *     ... (localization key:value pairs)
     * });
     * ```
     *
     * for backward compatibility (prior to `5.3.0` version):
     *
     * ```javascript
     * LocaleHelper.publishLocale('En', {
     *     name : 'En',
     *     desc : 'English (US)',
     *     code : 'en-US',
     *     locale : {
     *         ... (localization key:value pairs)
     *     }
     * });
     * ```
     *
     * Publishing a locale will automatically merge it's localization keys with existing locale matching by locale name,
     * replacing existing one with new. To replace existing locale entirely pass `true` to optional `config` parameter.
     *
     * Example:
     *
     * ```javascript
     * LocaleHelper.publishLocale({
     *     localeName : 'En',
     *     localeDesc : 'English (US)',
     *     localeCode : 'en-US',
     *     ... (localization key:value pairs)
     * }, true);
     * ```
     *
     * @param {String|Locale} nameOrConfig String name of locale (for example `En` or `SvSE`) or locale object
     * @param {Locale|Boolean} [config] Locale object.
     * Not used if locale object is passed as first method parameter.
     * Path `true` value and locale object as first method parameter to publish locale without merging with existing one.
     * @returns {Locale} Locale object
     */
    static publishLocale(nameOrConfig, config) {
        const
            { locales }    = global.bryntum,
            locale         = LocaleHelper.normalizeLocale(nameOrConfig, config),
            { localeName } = locale;

        if (!locales[localeName] || config === true) {
            locales[localeName] = locale;
        }
        else {
            locales[localeName] = this.mergeLocales(locales[localeName] || {}, locale || {});
        }



        return locales[localeName];
    }

}

global.bryntum = global.bryntum || {};
global.bryntum.locales = global.bryntum.locales || {};
