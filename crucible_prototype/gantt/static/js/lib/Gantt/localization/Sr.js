import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Sr.js';

const locale = {

    localeName : 'Sr',
    localeDesc : 'Srpski',
    localeCode : 'sr',

    Object : {
        Save : 'Sačuvaj'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignoriši kalendar resursa'
    },

    InactiveColumn : {
        Inactive : 'Neaktivan'
    },

    AddNewColumn : {
        'New Column' : 'Nova kolona'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Originalni datum početka'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Originalni datum završetak'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Originalni trajanje'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Odstupanje od datuma početka'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Odstupanje od datuma završetak'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Varijansa trajanja'
    },

    CalendarColumn : {
        Calendar : 'Kalendar'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Rani početak'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Rani završetak'
    },

    LateStartDateColumn : {
        'Late Start' : 'Kasni početak'
    },

    LateEndDateColumn : {
        'Late End' : 'Kasni završetak'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Ukupno kašnjenje'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Datum ograničenja'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Tip ograničenja'
    },

    DeadlineDateColumn : {
        Deadline : 'Krajnji rok'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Neispravna zavisnost'
    },

    DurationColumn : {
        Duration : 'Trajanje'
    },

    EffortColumn : {
        Effort : 'Trud'
    },

    EndDateColumn : {
        Finish : 'Završetak'
    },

    EventModeColumn : {
        'Event mode' : 'Režim događaja',
        Manual       : 'Ručni',
        Auto         : 'Automatski'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Ručno planirano'
    },

    MilestoneColumn : {
        Milestone : 'Prekretnica'
    },

    NameColumn : {
        Name : 'Ime'
    },

    NoteColumn : {
        Note : 'Napomena'
    },

    PercentDoneColumn : {
        '% Done' : '% dovršeno'
    },

    PredecessorColumn : {
        Predecessors : 'Prethodnici'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Dodeljeni resursi',
        'more resources'     : 'još resursa'
    },

    RollupColumn : {
        Rollup : 'Postignuće'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Režim planiranja'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Смер планирања',
        inheritedFrom       : 'Наслеђено од',
        enforcedBy          : 'Намеће'
    },

    SequenceColumn : {
        Sequence : 'Sekvenca'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Prikaži na vremenskoj liniji'
    },

    StartDateColumn : {
        Start : 'Početak'
    },

    SuccessorColumn : {
        Successors : 'Naslednici'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopiraj',
        cutTask   : 'Iseci',
        pasteTask : 'Nalepi'
    },

    WBSColumn : {
        WBS      : 'Pregled strukture rada',
        renumber : 'Prenumerisanje'
    },

    DependencyField : {
        invalidDependencyFormat : 'Neispravni format zavisnosti'
    },

    ProjectLines : {
        'Project Start' : 'Početak projekta',
        'Project End'   : 'Završetak projekta'
    },

    TaskTooltip : {
        Start    : 'Početak',
        End      : 'Kraj',
        Duration : 'Trajanje',
        Complete : 'Završen'
    },

    AssignmentGrid : {
        Name     : 'Ime resursa',
        Units    : 'Jedinice',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Izmeni',
        Indent                 : 'Uvuci',
        Outdent                : 'Izbaci',
        'Convert to milestone' : 'Pretvori u prekretnicu',
        Add                    : 'Dodaj...',
        'New task'             : 'Novi zadatak',
        'New milestone'        : 'Nova prekretnica',
        'Task above'           : 'Zadatak iznad',
        'Task below'           : 'Zadatak ispod',
        'Delete task'          : 'Obriši',
        Milestone              : 'Prekretnica',
        'Sub-task'             : 'Pod-zadatak',
        Successor              : 'Naslednik',
        Predecessor            : 'Prethodnik',
        changeRejected         : 'Projektni algoritam je odbio promene',
        linkTasks              : 'Dodaj zavisnosti',
        unlinkTasks            : 'Uklonite zavisnosti',
        color                  : 'Boja'
    },

    EventSegments : {
        splitTask : 'Podeli zadatak'
    },

    Indicators : {
        earlyDates   : 'Rani početak/završetak',
        lateDates    : 'Kasni početak/kraj',
        Start        : 'Početak',
        End          : 'Kraj',
        deadlineDate : 'Krajnji rok'
    },

    Versions : {
        indented     : 'Uvučeno',
        outdented    : 'Izvučeno',
        cut          : 'Isečeno',
        pasted       : 'Umetnuto',
        deletedTasks : 'Obrisani zadaci'
    }
};

export default LocaleHelper.publishLocale(locale);
