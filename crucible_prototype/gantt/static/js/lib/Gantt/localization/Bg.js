import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Bg.js';

const locale = {

    localeName : 'Bg',
    localeDesc : 'Български',
    localeCode : 'bg',

    Object : {
        Save : 'Запис'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Игнориране на ресурсния календар'
    },

    InactiveColumn : {
        Inactive : 'Неактивен'
    },

    AddNewColumn : {
        'New Column' : 'Нова колона'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Baseline Start'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Baseline End'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Baseline Duration'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Start Variance'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'End Variance'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Отклонение на продължителността'
    },

    CalendarColumn : {
        Calendar : 'Календар'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Ранен старт'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Ранен край'
    },

    LateStartDateColumn : {
        'Late Start' : 'Късен старт'
    },

    LateEndDateColumn : {
        'Late End' : 'Късен край'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Пълно бездействие'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Дата на ограничението'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Тип ограничение'
    },

    DeadlineDateColumn : {
        Deadline : 'Краен срок'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Невалидна зависимост'
    },

    DurationColumn : {
        Duration : 'Продължителност'
    },

    EffortColumn : {
        Effort : 'Усилие'
    },

    EndDateColumn : {
        Finish : 'Край'
    },

    EventModeColumn : {
        'Event mode' : 'Режим на събитие',
        Manual       : 'Ръчно',
        Auto         : 'Автоматично'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Ръчно планирано'
    },

    MilestoneColumn : {
        Milestone : 'Ключово събитие'
    },

    NameColumn : {
        Name : 'Име'
    },

    NoteColumn : {
        Note : 'Забележка'
    },

    PercentDoneColumn : {
        '% Done' : '% готови'
    },

    PredecessorColumn : {
        Predecessors : 'Предшественици'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Присвоени ресурси',
        'more resources'     : 'повече ресурси'
    },

    RollupColumn : {
        Rollup : 'Сводка'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Режим на планиране'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Посока на графика',
        inheritedFrom       : 'Наследени от',
        enforcedBy          : 'Наложени от'
    },

    SequenceColumn : {
        Sequence : 'Последователност'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Показване в хронологията'
    },

    StartDateColumn : {
        Start : 'Начало'
    },

    SuccessorColumn : {
        Successors : 'Приемници'
    },

    TaskCopyPaste : {
        copyTask  : 'Копирай',
        cutTask   : 'Изрежи',
        pasteTask : 'Постави'
    },

    WBSColumn : {
        WBS      : 'Структура на разпределение на работата',
        renumber : 'Преномериране'
    },

    DependencyField : {
        invalidDependencyFormat : 'Невалиден формат на зависимост'
    },

    ProjectLines : {
        'Project Start' : 'Начало на проект',
        'Project End'   : 'Край на проект'
    },

    TaskTooltip : {
        Start    : 'Старт',
        End      : 'Край',
        Duration : 'Продължителност',
        Complete : 'Приключи'
    },

    AssignmentGrid : {
        Name     : 'Име на ресурс',
        Units    : 'Единици',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Редактиране',
        Indent                 : 'Увеличаване на ниво',
        Outdent                : 'Намаляване на ниво',
        'Convert to milestone' : 'Преобразуване в етап',
        Add                    : 'Добавяне...',
        'New task'             : 'Нова задача',
        'New milestone'        : 'Ново ключово събитие',
        'Task above'           : 'Задача по-горе',
        'Task below'           : 'Задача по-долу',
        'Delete task'          : 'Изтриване',
        Milestone              : 'Етап',
        'Sub-task'             : 'Подзадача',
        Successor              : 'Приемник',
        Predecessor            : 'Предшественик',
        changeRejected         : 'Механизмът за планиране отхвърли промените',
        linkTasks              : 'Добавяне на зависимости',
        unlinkTasks            : 'Премахване на зависимости',
        color                  : 'цвят'
    },

    EventSegments : {
        splitTask : 'Разделяне на задача'
    },

    Indicators : {
        earlyDates   : 'Ранно начало/край',
        lateDates    : 'Късно начало/край',
        Start        : 'Старт',
        End          : 'Край',
        deadlineDate : 'Краен срок'
    },

    Versions : {
        indented     : 'С отстъп',
        outdented    : 'Без отстъп',
        cut          : 'Изрязване',
        pasted       : 'Вмъкнато',
        deletedTasks : 'Изтрити задачи'
    }
};

export default LocaleHelper.publishLocale(locale);
