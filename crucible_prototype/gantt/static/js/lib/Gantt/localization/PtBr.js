import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/PtBr.js';

const locale = {

    localeName : 'PtBr',
    localeDesc : 'Português do Brasil',
    localeCode : 'pt-BR',

    Object : {
        Save : 'Salvar'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorar calendário de recursos'
    },

    InactiveColumn : {
        Inactive : 'Inativo'
    },

    AddNewColumn : {
        'New Column' : 'Nova coluna'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Início do Plano Base'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Conclusão do Plano Base'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Duração do Plano Base'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Desvio de Início'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Desvio de Conclusão'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Variância de duração'
    },

    CalendarColumn : {
        Calendar : 'Calendário'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Fase inicial'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Fim prematuro'
    },

    LateStartDateColumn : {
        'Late Start' : 'Início atrasado'
    },

    LateEndDateColumn : {
        'Late End' : 'Fim atrasado'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Folga total'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Data de restrição'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Tipo de restrição'
    },

    DeadlineDateColumn : {
        Deadline : 'Prazo'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Dependência inválida'
    },

    DurationColumn : {
        Duration : 'Duração'
    },

    EffortColumn : {
        Effort : 'Esforço'
    },

    EndDateColumn : {
        Finish : 'Fim'
    },

    EventModeColumn : {
        'Event mode' : 'Modo de evento',
        Manual       : 'Manual',
        Auto         : 'Automático'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Agendado manualmente'
    },

    MilestoneColumn : {
        Milestone : 'Marco'
    },

    NameColumn : {
        Name : 'Nome'
    },

    NoteColumn : {
        Note : 'Nota'
    },

    PercentDoneColumn : {
        '% Done' : '% concluído'
    },

    PredecessorColumn : {
        Predecessors : 'Anteriores'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Recursos atribuídos',
        'more resources'     : 'mais recursos'
    },

    RollupColumn : {
        Rollup : 'Sumarização'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Modo de agendamento'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Direção de agendamento',
        inheritedFrom       : 'Herdado de',
        enforcedBy          : 'Imposto por'
    },

    SequenceColumn : {
        Sequence : 'Sequência'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Mostrar na linha do tempo'
    },

    StartDateColumn : {
        Start : 'Início'
    },

    SuccessorColumn : {
        Successors : 'Sucessores'
    },

    TaskCopyPaste : {
        copyTask  : 'Copiar',
        cutTask   : 'Cortar',
        pasteTask : 'Colar'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Renumerar'
    },

    DependencyField : {
        invalidDependencyFormat : 'Formato de dependência inválido'
    },

    ProjectLines : {
        'Project Start' : 'Início do projeto',
        'Project End'   : 'Fim do projeto'
    },

    TaskTooltip : {
        Start    : 'Início',
        End      : 'Fim',
        Duration : 'Duração',
        Complete : 'Concluído'
    },

    AssignmentGrid : {
        Name     : 'Nome do recurso',
        Units    : 'Unidades',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Editar',
        Indent                 : 'Avanço',
        Outdent                : 'Diminuir avanço',
        'Convert to milestone' : 'Converter para marco',
        Add                    : 'Adicionar...',
        'New task'             : 'Nova tarefa',
        'New milestone'        : 'Novo marco',
        'Task above'           : 'Tarefa acima',
        'Task below'           : 'Tarefa abaixo',
        'Delete task'          : 'Eliminar',
        Milestone              : 'Marco',
        'Sub-task'             : 'Subtarefa',
        Successor              : 'Sucessor',
        Predecessor            : 'Predecessor',
        changeRejected         : 'O motor de agendamento rejeitou as alterações',
        linkTasks              : 'Adicionar dependências',
        unlinkTasks            : 'Remover dependências',
        color                  : 'Cor'
    },

    EventSegments : {
        splitTask : 'Dividir tarefa'
    },

    Indicators : {
        earlyDates   : 'Início/fim antecipado',
        lateDates    : 'Início/fim atrasado',
        Start        : 'Início',
        End          : 'Fim',
        deadlineDate : 'Prazo'
    },

    Versions : {
        indented     : 'Indentado',
        outdented    : 'Desindentado',
        cut          : 'Cortado',
        pasted       : 'Colado',
        deletedTasks : 'Tarefas excluídas'
    }
};

export default LocaleHelper.publishLocale(locale);
