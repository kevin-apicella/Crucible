import Wbs from '../../Core/data/Wbs.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';

/**
 * @module Gantt/data/Wbs
 */

/**
 * DEPRECATED. Use Core/data/Wbs instead.
 *
 * @deprecated In favor of Core/data/Wbs.js
 * @extends Core/data/Wbs
 * @typings ignore
 */
export default class GanttWbs extends Wbs {
    constructor() {
        VersionHelper.deprecate('Gantt', '6.0.0', 'Wbs class was moved to /Core/data folder, please update your imports');
        super(...arguments);
    }
}
