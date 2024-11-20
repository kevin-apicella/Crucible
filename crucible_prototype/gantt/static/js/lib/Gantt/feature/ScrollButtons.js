import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';

/**
 * @module Gantt/feature/ScrollButtons
 */

/**
 *
 * This feature injects buttons in each row that scrolls the task bar into view. It can optionally show a label along with the
 * button, using the {@link #config-labelRenderer}.
 *
 * ```javascript
 * new Gantt({
 *     appendTo          : 'container',
 *     features : {
 *         scrollButtons : {
 *             labelRenderer({ taskRecord }) {
 *                 return `${taskRecord.wbsCode} ${StringHelper.encodeHtml(taskRecord.name)}`;
 *             }
 *         }
 *     }
 * ```
 *
 * {@inlineexample Gantt/feature/ScrollButtons.js}
 *
 * This feature is **disabled** by default.
 *
 * @extends Core/mixin/InstancePlugin
 * @demo Gantt/scroll-buttons
 * @classtype scrollButtons
 * @feature
 */
export default class ScrollButtons extends InstancePlugin {
    //region Config

    static $name = 'ScrollButtons';

    // Default configuration.
    static configurable = {
        /**
         * The icon to use for the button scrolling into the past
         * @config {String}
         * @default
         */
        backwardIconCls : 'b-icon-previous',

        /**
         The icon to use for the button scrolling into the future
         * @config {String}
         * @default
         */
        forwardIconCls : 'b-icon-next',

        /**
         * A method letting you render a label above the button.
         *
         * {@note}When returning content, be sure to consider how that content should be encoded to avoid XSS
         * (Cross-Site Scripting) attacks. This is especially important when including user-controlled data such as
         * the task's `name`. The function {@link Core.helper.StringHelper#function-encodeHtml-static} as well as
         * {@link Core.helper.StringHelper#function-xss-static} can be helpful in these cases.{/@note}
         *
         * @config {Function} labelRenderer
         * @param {Object} detail An object that contains data about the event being rendered.
         * @param {Gantt.model.TaskModel} detail.taskRecord The task record
         * @returns {String} The text or raw HTML, remember to HTML encode contents
         */
        labelRenderer : null,

        /**
         * A config object describing how the scroll action should be performed.
         * @config {BryntumScrollOptions}
         */
        scrollOptions : { animate : { duration : 600, easing : 'easeTo' }, y : false, edgeOffset : 100 }
    };

    static pluginConfig = {
        chain : [
            'onPaint',
            'onElementClick'
        ]
    };

    //endregion

    doDisable(disable) {
        this.client.refresh();

        super.doDisable(disable);
    }

    onPaint({ firstPaint }) {
        if (firstPaint) {
            const
                { client }         = this,
                { timeAxisColumn } = client;

            this.client.timeAxisSubGrid.scrollable.ion({ scrollend : () => client.refreshColumn(timeAxisColumn) });

            timeAxisColumn.externalRenderer = this.renderer.bind(this);
        }
    }

    renderer({ record, grid }) {
        const
            taskBefore = record.endDate < grid.visibleDateRange.startDate,
            taskAfter  = record.startDate > grid.visibleDateRange.endDate;

        return {
            class    : 'b-scroll-buttons-container',
            children : [{
                class    : 'b-scroll-buttons-content',
                children : [
                    this.labelRenderer ? {
                        tag  : 'label',
                        html : this.labelRenderer?.({ taskRecord : record })
                    } : null,
                    record.isScheduled ? {
                        tag       : 'i',
                        className : {
                            'b-icon'               : 1,
                            'b-scroll-button'      : 1,
                            [this.backwardIconCls] : taskBefore,
                            [this.forwardIconCls]  : taskAfter,
                            'b-task-visible'       : !taskBefore && !taskAfter
                        }
                    } : null
                ]
            }]
        };
    }

    onElementClick({ target }) {
        if (target.matches('.b-scroll-button')) {
            const
                { client } = this,
                record     = client.getRecordFromElement(target);

            client.scrollTaskIntoView(record, Object.assign(this.scrollOptions, { block : target.classList.contains(this.forwardIconCls) ? 'end' : 'start' }));
        }
    }
}

GridFeatureManager.registerFeature(ScrollButtons, false, 'Gantt');
