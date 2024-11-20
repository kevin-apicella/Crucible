import Rectangle from '../../../../Core/helper/util/Rectangle.js';
import DomHelper from '../../../../Core/helper/DomHelper.js';
import DomSync from '../../../../Core/helper/DomSync.js';

// This value is actually defined in CSS for the Gantt as a height for wrap element when baseline is active. Ideally
// we should link it to the style
const BASELINE_RATIO = 0.4;

/**
 * This mixin overrides event elements handling in similar scheduler mixin. Uses correct element class names and
 * resolves elements in gantt-way.
 * @private
 */
export default base => class GanttExporterMixin extends base {
    async prepareComponent(config) {
        await super.prepareComponent(config);

        const
            me             = this,
            // Clear cloned gantt element from task elements
            fgCanvasEl     = me.element.querySelector('.b-sch-foreground-canvas');

        DomHelper.removeEachSelector(fgCanvasEl, '.b-gantt-task-wrap');
        DomHelper.removeEachSelector(fgCanvasEl, '.b-released');
    }

    collectEvents(rows, config) {
        const
            me         = this,
            addedRows  = rows.length,
            { client } = config,
            normalRows = me.exportMeta.subGrids.normal.rows;

        rows.forEach((row, index) => {
            const
                rowConfig = normalRows[normalRows.length - addedRows + index],
                event     = client.store.getAt(row.dataIndex),
                eventsMap = rowConfig[3];

            if (event.isScheduled) {
                const el = client.getElementFromTaskRecord(event, false);

                if (el && !eventsMap.has(event.id)) {
                    eventsMap.set(event.id, [el.outerHTML, Rectangle.from(el.firstChild, el.offsetParent)]);
                }
            }
        });
    }

    renderEvents(config, rows) {
        const
            me              = this,
            { client }      = config,
            renderBaselines = client.hasActiveFeature('baselines'),
            normalRows      = me.exportMeta.subGrids.normal.rows;

        // Unlike Scheduler Gantt calculates elements and boxes for dependencies from the index of the record in the
        // store. Upside is that it allows to correctly estimate position of the task which is outside of the view.
        // Downside is that we will have to either move every single element or the entire canvas up by the difference
        // between first row we rendered and estimated vertical position
        const offset = me.exportMeta.topRowOffset = rows[0].top - rows[0].dataIndex * rows[0].offsetHeight;

        rows.forEach((row, index) => {
            const
                rowConfig  = normalRows[index],
                eventsMap  = rowConfig[3],
                record     = client.store.getAt(row.dataIndex),
                renderData = client.currentOrientation.getTaskRenderData(row, record),
                { taskId } = renderData;

            renderData.top += offset;

            // If task
            if (renderData.isTask) {
                const
                    taskDOMConfig   = client.currentOrientation.getTaskDOMConfig(renderData),
                    targetElement   = document.createElement('div'),
                    { isMilestone } = record,
                    hasBaselines    = record.baselines.count;

                DomSync.sync({
                    targetElement,
                    domConfig : taskDOMConfig
                });

                let { left, top, width, height } = renderData;

                // for milestone, we need to adjust left coordinate by half height(width)
                if (isMilestone) {
                    left = left - height / 2;
                    width = height;
                }

                eventsMap.set(taskId, [
                    targetElement.outerHTML,
                    new Rectangle(left, top, width, height * (renderBaselines && hasBaselines ? BASELINE_RATIO : 1)), []
                ]);
            }

            if (renderData.extraConfigs.length) {
                const
                    targetElement = document.createElement('div'),
                    extrasArray   = [];

                for (const domConfig of renderData.extraConfigs) {
                    DomSync.sync({
                        targetElement,
                        domConfig
                    });

                    extrasArray.push(targetElement.outerHTML);
                }

                if (!eventsMap.has(taskId)) {
                    eventsMap.set(taskId, ['', null, []]);
                }

                eventsMap.get(taskId)[2] = extrasArray;
            }
        });
    }

    getEventBox(event) {
        if (!event) {
            return;
        }

        let result = this.exportMeta.eventsBoxes.get(String(event.id));

        // If task is not rendered we need to estimate its position
        if (!result) {
            const
                { client }     = this.exportMeta,
                startX         = client.getCoordinateFromDate(event.startDate),
                endX           = client.getCoordinateFromDate(event.endDate),
                { rows }       = this.exportMeta.subGrids.normal,
                [
                    firstRowHTML,
                    firstRowTop,
                    height
                ]              = rows[0],
                [, lastRowTop] = rows[rows.length - 1],
                // take data index from html
                firstRowIndex  = parseInt(firstRowHTML.match(/data-index="(\d+)?"/)[1]),
                taskIndex      = client.taskStore.indexOf(event),
                // Push estimated box one extra row to avoid dependency line making turns at the page bottom
                estimatedY     = taskIndex < firstRowIndex ? firstRowTop - height * 2 : lastRowTop + height * 2;

            result = new Rectangle(startX, estimatedY, endX - startX, height);
        }

        return result;
    }
};
