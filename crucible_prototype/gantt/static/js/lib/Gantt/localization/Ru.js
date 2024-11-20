import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Ru.js';

const locale = {

    localeName : 'Ru',
    localeDesc : 'Русский',
    localeCode : 'ru',

    Object : {
        Save : 'Сохранить'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Не учитывать календарь ресурса'
    },

    InactiveColumn : {
        Inactive : 'Неактивна'
    },

    AddNewColumn : {
        'New Column' : 'Добавить столбец...'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Базовое начало'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Базовое окончание'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Базовая длительность'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Отклонение начала'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Отклонение окончания'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Отклонение длительности'
    },

    CalendarColumn : {
        Calendar : 'Календарь'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Раннее начало'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Раннее окончание'
    },

    LateStartDateColumn : {
        'Late Start' : 'Позднее начало'
    },

    LateEndDateColumn : {
        'Late End' : 'Позднее окончание'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Общий временной резерв'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Дата ограничения'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Тип ограничения'
    },

    DeadlineDateColumn : {
        Deadline : 'Крайний срок'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Неверная зависимость'
    },

    DurationColumn : {
        Duration : 'Длительность'
    },

    EffortColumn : {
        Effort : 'Трудозатраты'
    },

    EndDateColumn : {
        Finish : 'Конец'
    },

    EventModeColumn : {
        'Event mode' : 'Режим расчёта',
        Manual       : 'Ручной',
        Auto         : 'Автоматический'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Ручное планирование'
    },

    MilestoneColumn : {
        Milestone : 'Веха'
    },

    NameColumn : {
        Name : 'Наименование задачи'
    },

    NoteColumn : {
        Note : 'Примечание'
    },

    PercentDoneColumn : {
        '% Done' : '% завершения'
    },

    PredecessorColumn : {
        Predecessors : 'Предшествующие'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Назначенные ресурсы',
        'more resources'     : 'ресурсов'
    },

    RollupColumn : {
        Rollup : 'Сведение'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Режим'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Напрвление планирования',
        inheritedFrom       : 'Унаследовано от',
        enforcedBy          : 'Задано от'
    },

    SequenceColumn : {
        Sequence : '#'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Показать на временной шкале'
    },

    StartDateColumn : {
        Start : 'Начало'
    },

    SuccessorColumn : {
        Successors : 'Последующие'
    },

    TaskCopyPaste : {
        copyTask  : 'Копировать',
        cutTask   : 'Вырезать',
        pasteTask : 'Вставить'
    },

    WBSColumn : {
        WBS      : 'СДР',
        renumber : 'Обновить'
    },

    DependencyField : {
        invalidDependencyFormat : 'Неверный формат зависимости'
    },

    ProjectLines : {
        'Project Start' : 'Начало проекта',
        'Project End'   : 'Окончание проекта'
    },

    TaskTooltip : {
        Start    : 'Начинается',
        End      : 'Заканчивается',
        Duration : 'Длительность',
        Complete : 'Выполнено'
    },

    AssignmentGrid : {
        Name     : 'Имя ресурса',
        Units    : 'Занятость',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Изменить',
        Indent                 : 'Понизить уровень',
        Outdent                : 'Повысить уровень',
        'Convert to milestone' : 'Преобразовать в веху',
        Add                    : 'Добавить...',
        'New task'             : 'Новая задача',
        'New milestone'        : 'Новая веха',
        'Task above'           : 'Задачу выше',
        'Task below'           : 'Задачу ниже',
        'Delete task'          : 'Удалить',
        Milestone              : 'Веху',
        'Sub-task'             : 'Под-задачу',
        Successor              : 'Последующую задачу',
        Predecessor            : 'Предшествующую задачу',
        changeRejected         : 'Изменения отклонены системой',
        linkTasks              : 'Добавить зависимости',
        unlinkTasks            : 'Удалить зависимости',
        color                  : 'Цвет'
    },

    EventSegments : {
        splitTask : 'Прервать задачу'
    },

    Indicators : {
        earlyDates   : 'Раннее начало/окончание',
        lateDates    : 'Позднее начало/окончание',
        Start        : 'Начало',
        End          : 'Конец',
        deadlineDate : 'Крайний срок'
    },

    Versions : {
        indented     : 'Уровень понижен',
        outdented    : 'Уровень повышен',
        cut          : 'Вырезано',
        pasted       : 'Вставлено',
        deletedTasks : 'Удаленные задачи'
    }
};

export default LocaleHelper.publishLocale(locale);
