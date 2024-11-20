import Base from '../../Base.js';
import ArrayHelper from '../../helper/ArrayHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';
import StringHelper from '../../helper/StringHelper.js';

/**
 * @module Core/data/mixin/ModelLink
 */

const
    // Properties set on the proxy instead of on the original
    propertyOverrides = {
        id              : 1,
        stores          : 1,
        parentIndex     : 1,
        parent          : 1,
        previousSibling : 1,
        nextSibling     : 1,
        unfilteredIndex : 1
    },
    proxyConfig = {
        get(target, prop) {
            // Proxy record has some additional meta
            if (prop === 'proxyMeta') {
                return this.proxyMeta;
            }

            // Accessing constructor in functions should lead to original records constructor
            // (for static fns etc.)
            if (prop === 'constructor') {
                return target.constructor;
            }

            // Override setData / set to reroute parentIndex updates
            if (prop === 'setData') {
                return this.setDataOverride;
            }
            if (prop === 'set') {
                return this.setOverride;
            }
            if (prop === 'instanceMeta') {
                return this.instanceMetaOverride;
            }

            // Special properties not shared with the original record
            if (propertyOverrides[prop]) {
                return this.proxyMeta.data[prop];
            }

            // Everything else is scoped to the proxy record
            return Reflect.get(target, prop, this.proxyRecord);
        },

        set(target, prop, value) {
            // Special properties not shared with the original record
            if (propertyOverrides[prop]) {
                this.proxyMeta.data[prop] = value;
            }
            // Everything else is relayed to the original record
            else {
                target[prop] = value;
            }

            return true;
        },

        // The instanceMeta has to be unique for this link instance.
        // On first reference, we create a clone of the original's instanceMeta
        instanceMetaOverride(instanceOrId) {
            const
                { proxyMeta } = this,
                id            = instanceOrId.id || instanceOrId,
                map           = proxyMeta.map || (proxyMeta.map = ObjectHelper.clone(proxyMeta.originalRecord.instanceMeta(id)));

            return map[id] || (map[id] = {});
        },

        // Override setData & set to reroute parentIndex updates
        setDataOverride(toSet, value) {
            if (toSet === 'parentIndex') {
                this.proxyMeta.data.parentIndex = value;
            }
            else {
                this.proxyMeta.originalRecord.setData(toSet, value);
            }
        },
        setOverride(field, value, ...args) {
            if (field === 'parentIndex') {
                this.proxyMeta.data.parentIndex = value;
            }
            else {
                this.proxyMeta.originalRecord.set(field, value, ...args);
            }
        }

    };

/**
 * Mixin that allows creating proxy records linked to an original record. See {@link #function-link} for more
 * information.
 *
 * <div class="note">Note that not all UI features support linked records</div>
 *
 * @mixin
 */
export default Target => class ModelLink extends (Target || Base) {
    static $name = 'ModelLink';

    static isModel = true;

    /**
     * Creates a proxy record (using native Proxy) linked to this record (the original). The proxy records shares most
     * data with the original, except for its `id` (which is always generated), and ordering fields such as
     * `parentIndex` and `parentId` etc.
     *
     * Any change to the proxy record will be reflected on the original, and vice versa. A proxy record is not meant to
     * be persisted, only the original record should be persisted. Thus, proxy records are not added to stores change
     * tracking (added, modified and removed records).
     *
     * Removing the original record removes all proxies.
     *
     * Creating a proxy record allows a Store to seemingly contain the record multiple times, something that is
     * otherwise not possible. It also allows a record to be used in both a tree store and in a flat store.
     *
     * <div class="note">Note that not all UI features support linked records</div>
     *
     * @returns {Proxy} Proxy record linked to the original record
     * @typings {typeof Proxy}
     * @category Misc
     */
    link() {
        // Calling link on a link creates another link of the original record
        if (this.isLinked) {
            return this.$original.link();
        }

        const
            me           = this,
            useConfig    =  {
                ...proxyConfig,
                // Data not shared with the original record
                proxyMeta : {
                    originalRecord : me,
                    data           : {
                        id     : `${me.id}_link_${StringHelper.generateUUID()}`,
                        stores : []
                    }
                }
            },
            proxyRecord = new Proxy(me, useConfig);

        useConfig.proxyRecord = proxyRecord;

        // Original record keeps tracks of all proxies
        (me.meta.linkedRecords || (me.meta.linkedRecords = [])).push(proxyRecord);

        return proxyRecord;
    }

    /**
     * Is this record linked to another record?
     * @member {Boolean}
     * @readonly
     * @category Misc
     */
    get isLinked() {
        return Boolean(this.proxyMeta?.originalRecord);
    }

    /**
     * Are other records linked to this record?
     * @member {Boolean}
     * @readonly
     * @category Misc
     */
    get hasLinks() {
        return Boolean(!this.proxyMeta && this.$links.length);
    }

    // Logic to remove a link shared between removing in a flat store and a tree store
    removeLink(link, records = null, silent = false) {
        // Removing original, also remove linked records
        if (link.hasLinks) {
            for (const linked of link.$links.slice()) {
                // Flat
                if (records) {
                    ArrayHelper.include(records, linked);
                }
                // Tree
                else {
                    linked.remove(silent);
                }
            }
        }
        // Removing linked record, remove from originals link tracking
        else if (link.isLinked) {
            ArrayHelper.remove(link.$original.$links, link);
        }
    }

    // Overrides beforeRemove in Model, to remove all linked records when original record is removed.
    beforeRemove(records) {
        this.removeLink(this, records);
    }

    // Overrides removeChild in TreeNode, to remove the original node and all linked nodes when either a linked or
    // original node is removed.
    removeChild(childRecords, isMove, silent, options) {
        if (!options?.isInserting) {
            childRecords = ArrayHelper.asArray(childRecords);

            for (const child of childRecords) {
                this.removeLink(child, null, silent);
            }
        }

        return super.removeChild(childRecords, isMove, silent, options);
    }

    // Convenience getter for code keying by id that needs to work with both link and original
    get $originalId() {
        return this.$original.id;
    }

    // Convenience getter to retrieve linked records
    get $links() {
        return this.meta.linkedRecords ?? [];
    }
};
