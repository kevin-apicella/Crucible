import List from './List.js';
import TemplateHelper from '../helper/TemplateHelper.js';

/**
 * @module Core/widget/ChipView
 */

/**
 * Displays an inline series of Chips which may be navigated to, selected and deleted. You can provide a
 * {@link #config-closeHandler} to decide what should happen when a chip is closed. If not provided, by default the
 * record representing the chip is removed from the store.
 *
 * {@inlineexample Core/widget/ChipView.js}
 *
 * @extends Core/widget/List
 * @classtype chipview
 * @widget
 */
export default class ChipView extends List {
    //region Config

    static $name = 'ChipView';

    static type = 'chipview';

    static configurable = {
        itemCls : 'b-chip',

        /**
         * Configure as `true` to allow multi select and allow clicking and key navigation to select multiple chips.
         * @config {Boolean}
         * @default
         */
        multiSelect : false,

        /**
         * Configure as `true` to display a clickable close icon after the {@link Core.widget.List#config-itemTpl}.
         * When tapped, the configured {@link #config-closeHandler} is called passing the associated record.
         *
         * Chips may also be selected using the `LEFT` and `RIGHT` arrows (And the `Shift` key to do multiple,
         * contiguous selection). Pressing the `DELETE` or `BACKSPACE` key passes the selected records to the
         * {@link #config-closeHandler} (if not provided, the record representing the chip is removed from the store).
         *
         * @config {Boolean}
         * @default
         */
        closable : true,

        /**
         * A template function, which, when passed a record, returns the markup which encapsulates a chip's icon to be
         * placed before the {@link Core.widget.List#config-itemTpl}.
         * @config {Function}
         * @param {Core.data.Model} record The record to provide an icon for
         * @returns {DomConfig|String|null}
         */
        iconTpl : null,

        /**
         * If {@link #config-closable} is `true`, this is the name of a callback function to handle what the "close"
         * action means. If not provided, the record representing the chip is removed from the store.
         *
         * @config {String|Function}
         * @params {Core.data.Model[]} records Records to be closed
         * @params {Object} options Close options
         * @returns {void}
         */
        closeHandler : null
    };

    itemContentTpl(record, i) {
        const me = this;

        return TemplateHelper.tpl`${me.iconTpl ? this.iconTpl(record) : ''}
            ${me.itemTpl(record, i)}
            ${me.closable ? '<div class="b-icon b-close-icon b-icon-clear" data-noselect></div>' : ''}`;
    }

    onInternalKeyDown(event) {
        const
            me             = this,
            { selected }   = me,
            { generation } = selected;

        if (me.closable && selected.count && (event.key === 'Delete' || event.key === 'Backspace')) {
            if (me.closeHandler) {
                me.callback(me.closeHandler, me.owner, [selected.values, { isKeyEvent : true }]);
            }
            else {
                me.store.remove(selected.values);
            }

            // If this keystroke caused a chip deletion, prevent other keydown handlers from firing.
            // Eg: An owning Combo should not now attempt to select the last chip in its ChipView.
            if (selected.generation !== generation) {
                event.stopImmediatePropagation();
            }
        }
        else {
            super.onInternalKeyDown(event);
        }
    }

    updateClosable(closable) {
        this.element.classList[closable ? 'add' : 'remove']('b-chips-closable');
        this.navigator && (this.navigator.disabled = !closable);

        if (!this.isConfiguring) {
            this.refresh();
        }
    }

    onClick(event) {
        const
            me   = this,
            item = event.target.closest(`.${me.itemCls}`);

        if (me.closable && event.target.classList.contains('b-close-icon')) {
            const record = me.store.getAt(parseInt(item.dataset.index));

            if (me.closeHandler) {
                me.callback(me.closeHandler, me.owner, [[record]]);
            }
            else {
                me.store.remove(record);
            }
        }
        else {
            super.onClick(event);
        }
    }
}

// Register this widget type with its Factory
ChipView.initClass();
