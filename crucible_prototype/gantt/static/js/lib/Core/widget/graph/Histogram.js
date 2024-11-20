import Widget from '../Widget.js';
import StringHelper from '../../helper/StringHelper.js';
import DomSync from '../../helper/DomSync.js';
import Tooltip from '../Tooltip.js';
import Objects from '../../helper/util/Objects.js';

/**
 * @module Core/widget/graph/Histogram
 */
const
    ns = 'http://www.w3.org/2000/svg',
    // Outline series must overlay bars
    typePrio = {
        bar     : 1,
        outline : 2,
        text    : 3
    },
    byOrder = (l, r) => parseInt(l.order, 10) - parseInt(r.order, 10),
    byDatasetOrder = (l, r) => parseInt(l.dataset.order, 10) - parseInt(r.dataset.order, 10),
    getField = s => s.field,
    returnFalse = () => false,
    classesDelimiter = /\s+/;

/**
 * An object representing a series settings.
 *
 * @typedef {Object} HistogramSeries
 * @property {'bar'|'outline'} type The series type specifying how it is rendered, as solid bars or outlines.
 * @property {String} [field] The name of the property to read value from. By default, this matches the series
 * identifier.
 * @property {Boolean} [stretch=false] Provide `true` to stretch the series bars to take the whole vertical space
 * Applicable to `bar` type series only.
 * @property {String} [id] The series identifier. When configuring the series this value is automatically taken from
 * the key name the series is provided. In the example code below, the series `id` will be set to `salary`:
 * ```javascript
 * series : {
 *     salary : {
 *         type : 'bar'
 *     },
 *     ...
 * }
 * ```
 */

/**
 * Displays a simple bar histogram based upon an array of data objects passed in the {@link #config-data} config.
 *
 * @extends Core/widget/Widget
 * @classtype histogram
 */
export default class Histogram extends Widget {
    //region Config

    static type = 'histogram';

    static $name = 'Histogram';

    static get configurable() {
        return {
            /**
             * An array of data objects used to drive the histogram. The property/properties used
             * are defined in the {@link #config-series} option.
             * @config {Object[]}
             * @default
             */
            data : null,

            /**
             * The values to represent in bar form.
             * @config {Number[]}
             */
            values : null,

            /**
             * Object enumerating data series for the histogram.
             * The object keys are treated as series identifiers and values are objects that
             * can contain the following properties:
             *  - `type` A String, either `'bar'` or `'outline'`
             *  - `field` A String, the name of the property to use from the data objects in the {@link #config-data} option.
             * If the value is omitted the series identifier is used as the property name.
             * @config {Object<String, HistogramSeries>}
             */
            series : null,

            /**
             * By default, the bars are scaled based upon the detected max value across all the series.
             * A specific top value to represent the 100% height may be configured.
             * @config {Number}
             */
            topValue : null,

            element : {
                children : [{
                    ns,
                    tag                 : 'svg',
                    reference           : 'svgElement',
                    width               : '100%',
                    height              : '100%',
                    preserveAspectRatio : 'none',
                    children            : [{
                        ns,
                        tag       : 'g',
                        reference : 'scaledSvgGroup'
                    }, {
                        ns,
                        tag       : 'g',
                        reference : 'unscaledSvgGroup'
                    }]
                }]
            },

            /**
             * By default, all bars are rendered, even those with zero height. Configure this as `true`
             * to omit zero height bars.
             * @config {Boolean}
             * @default
             */
            omitZeroHeightBars : false,

            /**
             * By default, the histogram calls {@link #config-getBarText} once per each datum.
             * So the function is supposed to output all the series values the way it needs.
             * Configure this as `false` to call the function for each series value
             * if you need to display the values separately or having different styling.
             * @config {Boolean}
             * @default
             */
            singleTextForAllBars : true,

            monitorResize : true,

            /**
             * A Function which returns a CSS class name to add to a rectangle element.
             * The following parameters are passed:
             * @config {Function}
             * @param {HistogramSeries} series The series being rendered
             * @param {Object} rectConfig The rectangle configuration object
             * @param {Object} datum The datum being rendered
             * @param {Number} index The index of the datum being rendered
             * @returns {String} CSS class name of the rectangle element
             */
            getRectClass(series, rectConfig, datum, index) {
                return '';
            },

            /**
             * A Function which returns a CSS class name to add to a path element
             * built for an `outline` type series.
             * The following parameters are passed:
             * @param {HistogramSeries} series The series being rendered
             * @param {Object[]} data The series data
             * @returns {String} CSS class name of the path element
             * @config {Function}
             */
            getOutlineClass(series, data) {
                return '';
            },

            /**
             * A Function which returns the tooltip text to display when hovering a bar.
             * The following parameters are passed:
             *
             * @config {Function}
             * @param {HistogramSeries} series The series being rendered
             * @param {Object} rectConfig The rectangle configuration object
             * @param {Object} datum The datum being rendered
             * @param {Number} index The index of the datum being rendered
             * @returns {String} Tip for the the bar.
             */
            getBarTip(series, rectConfig, datum, index) {},

            /**
             * A Function which returns the text to render inside a bar.
             * The following parameters are passed:
             * @param {Object} datum The datum being rendered
             * @param {Number} index The index of the datum being rendered
             * @param {HistogramSeries} [series] The series (provided if {@link #config-singleTextForAllBars}
             * is `false`)
             * @returns {String} Text to render in the bar.
             * @config {Function}
             */
            getBarText(datum, index, series) {
                return '';
            },

            getRectConfig : null,

            getBarTextRenderData(renderData, datum, index, series) {
                return renderData;
            },

            getBarTextTip(renderData, datum, index, series) {}
        };
    }

    static properties = {
        refreshSuspended : 0
    };

    //endregion

    //region Init

    construct(config) {
        const me = this;
        super.construct(config);
        me.scheduleRefresh = me.createOnFrame(me.refresh, [], me, true);
        me.refresh();
    }

    set tip(tip) {
        const me = this;

        me.tip?.destroy();

        if (tip) {
            me._tip = Tooltip.new({
                owner             : me,
                forElement        : me.svgElement,
                forSelector       : 'rect',
                internalListeners : {
                    beforeShow : 'up.onBeforeTipShow'
                }
            }, tip);
        }
        else {
            me._tip = null;
        }
    }

    onElementResize() {
        super.onElementResize(...arguments);

        const svgRect = this.svgElement.getBoundingClientRect();

        this.scaledSvgGroup.setAttribute('transform', `scale(${svgRect.width} ${svgRect.height})`);
    }

    onBeforeTipShow({ source : tip }) {
        const index = parseInt(tip.activeTarget.dataset.index);

        tip.html = tip.contentTemplate({
            histogram : this,
            index
        });
    }

    updateSeries(value) {
        const
            me     = this,
            series = me._series = {};

        let
            index = 0,
            barSeriesCount = 0;

        for (const id in value) {
            // Providing
            //
            // "series" : {
            //     "foo" : false
            //     ...
            //
            // disables the "foo" series (that could be defined on a prototype level for example)

            if (value[id] !== false) {
                const data = series[id] = Objects.merge({}, value[id]);

                // default field name is series identifier
                if (!data.field) {
                    data.field = id;
                }

                // default type is "bar"
                if (!data.type) {
                    data.type = 'bar';
                }

                if (!('order' in data)) {
                    data.order = typePrio[data.type] * 10 + index;
                }

                if (!('index' in data)) {
                    data.index = index;
                }

                if (data.type === 'bar') {
                    data.index = barSeriesCount++;
                }

                data.id = id;
                index++;
            }
        }

        // Calculate the top value from all the series
        if (!me.topValue && me._data) {
            me.topValue = me.getDataTopValue(me._data);
        }

        if (!me.refreshSuspended) {
            me.scheduleRefresh();
        }
    }

    getDataTopValue(data, series) {
        const fields   = Object.values(series || this.series).map(getField);

        let result = 0, datum;

        for (let i = 0, { length } = data; i < length; i++) {
            datum = data[i];
            for (let j = 0, { length } = fields; j < length; j++) {
                result = Math.max(result, datum[fields[j]]);
            }
        }

        return result;
    }

    updateData(data) {
        const me = this;

        me._data = data;

        // Calculate the top value from all the series
        if (!me.topValue && me._data && me._series) {
            me.topValue = me.getDataTopValue(data);
        }

        if (!me.refreshSuspended) {
            me.scheduleRefresh();
        }
    }

    updateTopValue(value) {
        const me = this;

        me._topValue = value;

        // Calculate the top value from all the series
        if (!value && me._data) {
            me._topValue = me.getDataTopValue(me._data);
        }

        if (!me.refreshSuspended) {
            me.scheduleRefresh();
        }
    }

    // Must exist from the start because configuration setters call it.
    // Once configured, will be replaced with a function which schedules a refresh for the next animation frame.
    scheduleRefresh() {

    }

    suspendRefresh() {
        this.refreshSuspended++;
    }

    resumeRefresh() {
        if (this.refreshSuspended) {
            this.refreshSuspended--;
        }
    }

    refresh(params) {
        const
            me             = this,
            {
                series,
                _tip,
                topValue,
                singleTextForAllBars
            }              = me,
            // extra arguments to pass through
            extraArgs = params?.args || [],
            histogramElements = [],
            textElements = [];

        // bail out if there is no series provided
        if (!series) {
            return;
        }

        for (const data of Object.values(series).sort(byOrder)) {
            const elConfig = me[`draw${StringHelper.capitalize(data.type)}`](data, ...extraArgs);

            if (Array.isArray(elConfig)) {
                histogramElements.push.apply(histogramElements, elConfig);
            }
            else {
                histogramElements.push(elConfig);
            }

            // if it's told we should have separate texts for bars
            if (!singleTextForAllBars && data.type === 'bar') {
                textElements.push(...me.drawText(data, ...extraArgs));
            }
        }

        // sort again since user could change order in a hook
        histogramElements.sort(byDatasetOrder);

        if (singleTextForAllBars) {
            textElements.push(...me.drawText(null, ...extraArgs));
        }
        else {
            textElements.sort(byDatasetOrder);
        }

        DomSync.sync({
            domConfig : {
                width               : '100%',
                height              : '100%',
                preserveAspectRatio : 'none',
                dataset             : {
                    topValue
                },
                children : [
                    {
                        ns,
                        tag       : 'g',
                        reference : 'scaledSvgGroup',
                        children  : histogramElements
                    },
                    {
                        ns,
                        tag       : 'g',
                        reference : 'unscaledSvgGroup',
                        children  : textElements
                    }
                ]
            },
            configEquality : returnFalse,
            targetElement  : me.svgElement
        });

        if (_tip && _tip.isVisible) {
            me.onBeforeTipShow({ source : _tip });
        }
    }

    drawBar(series, ...args) {
        const
            me           = this,
            {
                topValue,
                data,
                omitZeroHeightBars,
                barStyle
            }            = me,
            {
                field,
                order,
                stretch
            }            = series,
            { length }   = data,
            defaultWidth = 1 / length,
            children     = [],
            seriesId     = StringHelper.createId(series.id),
            seriesIndex  = series.index,
            forceHeight  = stretch ? 1 : undefined;

        let width;

        for (let index = 0, x = 0, { length } = data; index < length; index++, x += width) {
            const datum = data[index];

            let rectConfig = (datum.rectConfig = {
                ns,
                tag     : 'rect',
                dataset : {}
            });

            const
                value = datum[field],
                // limit height with topValue otherwise the histogram looks fine
                // yet the bar tooltip picks wrong Y-coordinate and there is an empty space between it and the bar
                height = value ? forceHeight || datum.height || (value > topValue ? topValue : value) / topValue : 0,
                y = 1 - height,
                barTip = me.callback('getBarTip', me, [series, rectConfig, datum, index, ...args]);

            // use either provided width or the calculated value
            width = datum.width || defaultWidth;

            if (barStyle) {
                rectConfig.style = barStyle;
            }
            else {
                delete rectConfig.style;
            }

            Object.assign(rectConfig.dataset, {
                index,
                order,
                series : seriesId
            });

            const
                rectClass = {
                    [`b-series-${seriesId}`]          : 1,
                    [`b-series-index-${seriesIndex}`] : 1
                },
                classes = me.callback('getRectClass', me, [series, rectConfig, datum, index, ...args]);

            if (classes) {
                classes.split(classesDelimiter).forEach(cls => rectClass[cls] = 1);
            }

            Object.assign(rectConfig, {
                x,
                y,
                width,
                height,
                class : rectClass
            });

            if (barTip) {
                rectConfig.dataset.btip = barTip;
            }
            else {
                delete rectConfig.dataset.btip;
            }

            if (me.getRectConfig) {
                rectConfig = me.getRectConfig(rectConfig, datum, index, series, ...args);
            }

            if (rectConfig && (rectConfig.height || !omitZeroHeightBars)) {
                children.push(rectConfig);
            }
        }
        return children;
    }

    changeGetRectConfig(fn) {
        return fn ? this.bindCallback(fn) : null;
    }

    drawOutline(series, ...args) {
        const
            me           = this,
            {
                topValue,
                data
            }            = me,
            {
                field,
                order,
                id
            }            = series,
            defaultWidth = 1 / data.length,
            coords       = ['M 0,1'],
            result       = {
                ns,
                tag     : 'path',
                dataset : {
                    order,
                    id
                }
            };

        let
            barWidth,
            command1 = 'M',
            command2 = 'L';

        for (let i = 0, x = 0, { length } = data; i < length; i++) {
            const barHeight = 1 - data[i][field] / topValue;

            // use either provided with or the calculated value
            barWidth = data[i].width || defaultWidth;

            coords.push(`${command1} ${x},${barHeight} ${command2} ${x += barWidth},${barHeight}`);
            command1 = command2 = '';
        }
        // coords.push('1,1');

        result.class = `b-series-${series.id} b-series-index-${series.index} ` +
            me.callback('getOutlineClass', me, [series, data, ...args]);

        result.d = coords.join(' ');

        return result;
    }

    drawText(series, ...args) {
        const
            me                = this,
            { data }          = me,
            defaultWidth      = 1 / data.length,
            defaultY          = '100%',
            unscaledSvgGroups = [];

        for (let index = 0, width, x = 0, { length } = data; index < length; index++, x += width) {
            width = data[index].width || defaultWidth;

            const barText = me.callback('getBarText', me, [data[index], index, series, ...args]);

            if (barText) {

                const renderData = me.callback('getBarTextRenderData', me, [{
                    ns,
                    tag       : 'text',
                    className : 'b-bar-legend',
                    html      : barText,
                    left      : x,
                    width,
                    x         : `${(x + width / 2) * 100}%`,
                    y         : data[index].y !== undefined ? data[index].y : defaultY,
                    dataset   : {
                        index,
                        series
                    }
                }, data[index], index, series, ...args]);

                const barTip = me.callback('getBarTextTip', me, [renderData, data[index], index, series, ...args]);
                if (barTip) {
                    renderData.dataset.btip = barTip;
                }
                else {
                    delete renderData.dataset.btip;
                }

                unscaledSvgGroups.push(renderData);
            }
        }

        return unscaledSvgGroups;
    }

    //endregion
}

Histogram.initClass();
