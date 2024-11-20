import ProjectModel from './ProjectModel.js';
import ProjectWebSocketHandlerMixin from '../../SchedulerPro/model/mixin/ProjectWebSocketHandlerMixin.js';

export default class WebSocketProjectModel extends ProjectWebSocketHandlerMixin(ProjectModel) {
    static $name = 'WebSocketProjectModel';
}
