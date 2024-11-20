import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Hr.js';

const locale = {

    localeName : 'Hr',
    localeDesc : 'Hrvatski',
    localeCode : 'hr',

    Object : {
        Save : 'Spremi'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Zanemari kalendar resursa'
    },

    InactiveColumn : {
        Inactive : 'Neaktivno'
    },

    AddNewColumn : {
        'New Column' : 'Novi stupac'
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
        'Total Slack' : 'Ukupni slobodni hod'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Datum ograničenja'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Vrsta ograničenja'
    },

    DeadlineDateColumn : {
        Deadline : 'Rok'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Nevažeća ovisnost'
    },

    DurationColumn : {
        Duration : 'Trajanje'
    },

    EffortColumn : {
        Effort : 'Napor'
    },

    EndDateColumn : {
        Finish : 'Završetak'
    },

    EventModeColumn : {
        'Event mode' : 'Način događaja',
        Manual       : 'Ručno',
        Auto         : 'Automatski'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Ručno zakazano'
    },

    MilestoneColumn : {
        Milestone : 'Kontrolna točka'
    },

    NameColumn : {
        Name : 'Naziv'
    },

    NoteColumn : {
        Note : 'Bilješka'
    },

    PercentDoneColumn : {
        '% Done' : '% dovršeno'
    },

    PredecessorColumn : {
        Predecessors : 'Prethodnici'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Dodijeljeni resursi',
        'more resources'     : 'više resursa'
    },

    RollupColumn : {
        Rollup : 'Smotajte'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Način zakazivanja'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Smjer planiranja',
        inheritedFrom       : 'Naslijeđeno od',
        enforcedBy          : 'Nametnuto od'
    },

    SequenceColumn : {
        Sequence : 'Redoslijed'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Prikaži u stupcu s vremenskim razdobljima'
    },

    StartDateColumn : {
        Start : 'Početak'
    },

    SuccessorColumn : {
        Successors : 'Nasljednici'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopiraj',
        cutTask   : 'Izreži',
        pasteTask : 'Zalijepi'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Ponovno numeriraj'
    },

    DependencyField : {
        invalidDependencyFormat : 'Nevažeći oblik ovisnosti'
    },

    ProjectLines : {
        'Project Start' : 'Početak projekta',
        'Project End'   : 'Završetak projekta'
    },

    TaskTooltip : {
        Start    : 'Početak',
        End      : 'Završetak',
        Duration : 'Trajanje',
        Complete : 'Dovršeno'
    },

    AssignmentGrid : {
        Name     : 'Naziv resursa',
        Units    : 'Jedinice',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Uredi',
        Indent                 : 'Uvuci',
        Outdent                : 'Izvuci',
        'Convert to milestone' : 'Pretvori u kontrolnu točku',
        Add                    : 'Dodaj...',
        'New task'             : 'Novi zadatak',
        'New milestone'        : 'Nova kontrola točka',
        'Task above'           : 'Zadatak iznad',
        'Task below'           : 'Zadatak ispod',
        'Delete task'          : 'Obriši',
        Milestone              : 'Kontrolna točka',
        'Sub-task'             : 'Podzadatak',
        Successor              : 'Nasljednik',
        Predecessor            : 'Prethodnik',
        changeRejected         : 'Mehanizam zakazivanja odbio je promjene',
        linkTasks              : 'Dodaj zavisnosti',
        unlinkTasks            : 'Uklonite zavisnosti',
        color                  : 'Boja'
    },

    EventSegments : {
        splitTask : 'Odvojeni zadatak'
    },

    Indicators : {
        earlyDates   : 'Rani početak/završetak',
        lateDates    : 'Kasni početak/završetak',
        Start        : 'Početak',
        End          : 'Završetak',
        deadlineDate : 'Rok'
    },

    Versions : {
        indented     : 'Uvučeno',
        outdented    : 'Izvučeno',
        cut          : 'Izrezano',
        pasted       : 'Zalijepljeno',
        deletedTasks : 'Obrisani zadaci'
    }
};

export default LocaleHelper.publishLocale(locale);
