import PrintMixin from '../../../Grid/feature/export/mixin/PrintMixin.js';
import PdfExport from './PdfExport.js';
import GridFeatureManager from '../../../Grid/feature/GridFeatureManager.js';

/**
 * @module Gantt/feature/export/Print
 */

/**
 * Allows printing Gantt contents using browser print dialog.
 *
 * This feature is based on {@link Gantt.feature.export.PdfExport} with only difference that instead of sending
 * request to a backend it renders content to an IFrame element and requests print dialog for it. For more details about
 * preparing HTML for printing, please refer to the {@link Gantt.feature.export.PdfExport} docs.
 *
 * ## Usage
 *
 * ```javascript
 * const gantt = new Gantt({
 *     features : {
 *         print : true
 *     }
 * })
 *
 * // Opens popup allowing to customize print settings
 * gantt.features.print.showPrintDialog();
 *
 * // Simple print
 * gantt.features.print.print({
 *     columns : scheduler.columns.map(c => c.id)
 * });
 * ```
 *
 * This feature is **disabled** by default.
 * For info on enabling it, see {@link Grid/view/mixin/GridFeatures}.
 *
 * @extends Gantt/feature/export/PdfExport
 * @mixes Grid/feature/export/mixin/PrintMixin
 *
 * @demo Gantt/print
 * @classtype print
 * @feature
 *
 * @typings Scheduler.feature.export.Print -> Scheduler.feature.export.SchedulerPrint
 */
export default class Print extends PrintMixin(PdfExport) {
    /**
     * @hideConfigs clientURL, exportServer, fetchOptions, fileFormat, fileName, openAfterExport, openInNewTab, sendAsBinary
     */

    /**
     * @hideFunctions processExportContent, receiveExportContent, showExportDialog
     */

    static $name = 'Print';
}

GridFeatureManager.registerFeature(Print, false, 'Gantt');
