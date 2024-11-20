import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Es.js';

const locale = {

    localeName : 'Es',
    localeDesc : 'Español',
    localeCode : 'es',

    Object : {
        Save : 'Guardar'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorar calendario de recursos'
    },

    InactiveColumn : {
        Inactive : 'Inactiva'
    },

    AddNewColumn : {
        'New Column' : 'Nueva columna'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Comienzo previsto'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Fin previsto'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Duración prevista'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Variación de comienzo'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Variación de fin'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Varianza de duración'
    },

    CalendarColumn : {
        Calendar : 'Calendario'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Adelanto de inicio'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Finalización adelantada'
    },

    LateStartDateColumn : {
        'Late Start' : 'Inicio retrasado'
    },

    LateEndDateColumn : {
        'Late End' : 'Finalización retrasada'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Plazo total'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Fecha de restricción'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Tipo de restricción'
    },

    DeadlineDateColumn : {
        Deadline : 'Plazo límite'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Dependencia no válida'
    },

    DurationColumn : {
        Duration : 'Duración'
    },

    EffortColumn : {
        Effort : 'Trabajo'
    },

    EndDateColumn : {
        Finish : 'Finalizar'
    },

    EventModeColumn : {
        'Event mode' : 'Tipo de evento',
        Manual       : 'Manual',
        Auto         : 'Automático'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Programado manualmente'
    },

    MilestoneColumn : {
        Milestone : 'Objetivo'
    },

    NameColumn : {
        Name : 'Nombre'
    },

    NoteColumn : {
        Note : 'Nota'
    },

    PercentDoneColumn : {
        '% Done' : '% realizado'
    },

    PredecessorColumn : {
        Predecessors : 'Anteriores'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Recursos asignados',
        'more resources'     : 'más recursos'
    },

    RollupColumn : {
        Rollup : 'Aplazamiento al resumen'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Modo de programación'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Dirección de programación',
        inheritedFrom       : 'Heredado de',
        enforcedBy          : 'Impuesto por'
    },

    SequenceColumn : {
        Sequence : 'Secuencia'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Mostrar en la cronología'
    },

    StartDateColumn : {
        Start : 'Inicio'
    },

    SuccessorColumn : {
        Successors : 'Posteriores'
    },

    TaskCopyPaste : {
        copyTask  : 'Copiar',
        cutTask   : 'Cortar',
        pasteTask : 'Pegar'
    },

    WBSColumn : {
        WBS      : 'Estructura de desglose de trabajo',
        renumber : 'Renumerar'
    },

    DependencyField : {
        invalidDependencyFormat : 'Formato de dependencia no válido'
    },

    ProjectLines : {
        'Project Start' : 'Inicio del proyecto',
        'Project End'   : 'Finalización del proyecto'
    },

    TaskTooltip : {
        Start    : 'Inicio',
        End      : 'Finalización',
        Duration : 'Duración',
        Complete : 'Completo'
    },

    AssignmentGrid : {
        Name     : 'Nombre del recurso',
        Units    : 'Unidades',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Editar',
        Indent                 : 'Sangrar',
        Outdent                : 'Alargar',
        'Convert to milestone' : 'Convertir en objetivo',
        Add                    : 'Añadir...',
        'New task'             : 'Nueva tarea',
        'New milestone'        : 'Nuevo objetivo',
        'Task above'           : 'Tarea anterior',
        'Task below'           : 'Tarea siguiente',
        'Delete task'          : 'Eliminar',
        Milestone              : 'Objetivo',
        'Sub-task'             : 'Subtarea',
        Successor              : 'Anterior',
        Predecessor            : 'Posterior',
        changeRejected         : 'El motor de programación ha rechazado los cambios',
        linkTasks              : 'Agregar dependencias',
        unlinkTasks            : 'Eliminar dependencias',
        color                  : 'Color'
    },

    EventSegments : {
        splitTask : 'Dividir tarea'
    },

    Indicators : {
        earlyDates   : 'Inicio/finalización adelantado/a',
        lateDates    : 'Inicio/finalización retrasado/a',
        Start        : 'Inicio',
        End          : 'Finalización',
        deadlineDate : 'Plazo'
    },

    Versions : {
        indented     : 'Endentado',
        outdented    : 'Alargado',
        cut          : 'Cortado',
        pasted       : 'Pegado',
        deletedTasks : 'Tareas eliminadas'
    }
};

export default LocaleHelper.publishLocale(locale);
