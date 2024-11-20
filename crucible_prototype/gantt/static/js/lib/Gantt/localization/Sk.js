import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Sk.js';

const locale = {

    localeName : 'Sk',
    localeDesc : 'Slovenský',
    localeCode : 'sk',

    Object : {
        Save : 'Uložiť'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorovať kalendár zdrojov'
    },

    InactiveColumn : {
        Inactive : 'Neaktívny'
    },

    AddNewColumn : {
        'New Column' : 'Nový stĺpec'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Začatie podľa pôvodného plánu'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Dokončenie podľa pôvodného plánu'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Trvanie podľa pôvodného plánu'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Odchýlka začiatku'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Koncová odchýlka'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Odchýlka trvania'
    },

    CalendarColumn : {
        Calendar : 'Kalendár'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Early Začiatok'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Skorý End'
    },

    LateStartDateColumn : {
        'Late Start' : 'Neskorý začiatok'
    },

    LateEndDateColumn : {
        'Late End' : 'Neskorý koniec'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Celkový Slack'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Dátum obmedzenia'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Typ obmedzenia'
    },

    DeadlineDateColumn : {
        Deadline : 'Termín odovzdania'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Neplatná súvislosť'
    },

    DurationColumn : {
        Duration : 'Trvanie'
    },

    EffortColumn : {
        Effort : 'Úsilie'
    },

    EndDateColumn : {
        Finish : 'Ukončiť'
    },

    EventModeColumn : {
        'Event mode' : 'Režim udalosti',
        Manual       : 'Manuálny',
        Auto         : 'Automatický'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuálne naplánované'
    },

    MilestoneColumn : {
        Milestone : 'Míľnik'
    },

    NameColumn : {
        Name : 'Názov'
    },

    NoteColumn : {
        Note : 'Poznámka'
    },

    PercentDoneColumn : {
        '% Done' : '% Hotové'
    },

    PredecessorColumn : {
        Predecessors : 'Predecessors'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Pridelené zdroje',
        'more resources'     : 'viac zdrojov'
    },

    RollupColumn : {
        Rollup : 'Akumulácia'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Plánovací režim'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Smer plánovania',
        inheritedFrom       : 'Zdedené od',
        enforcedBy          : 'Vynútené od'
    },

    SequenceColumn : {
        Sequence : 'Poradie'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Zobraziť na časovej osi'
    },

    StartDateColumn : {
        Start : 'Začiatok'
    },

    SuccessorColumn : {
        Successors : 'Následníci'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopírovať',
        cutTask   : 'Orezať',
        pasteTask : 'Vložiť'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Prečíslovať'
    },

    DependencyField : {
        invalidDependencyFormat : 'Neplatný formát súvislosti'
    },

    ProjectLines : {
        'Project Start' : 'Začiatok projektu',
        'Project End'   : 'Koniec projektu'
    },

    TaskTooltip : {
        Start    : 'Začiatok',
        End      : 'Koniec',
        Duration : 'Trvanie',
        Complete : 'Dokončiť'
    },

    AssignmentGrid : {
        Name     : 'Názov zdroja',
        Units    : 'Jednotky',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Upraviť',
        Indent                 : 'Zarážka',
        Outdent                : 'Odsek',
        'Convert to milestone' : 'Konvertovať na míľnik',
        Add                    : 'Pridať...',
        'New task'             : 'Nová úloha',
        'New milestone'        : 'Nový míľnik',
        'Task above'           : 'Úloha nad',
        'Task below'           : 'Úloha pod',
        'Delete task'          : 'Vymazať',
        Milestone              : 'Míľnik',
        'Sub-task'             : 'Podúloha',
        Successor              : 'Následník',
        Predecessor            : 'Predchodca',
        changeRejected         : 'Systém plánovania odmietol zmeny',
        linkTasks              : 'Pridať závislosti',
        unlinkTasks            : 'Odstrániť závislosti',
        color                  : 'Farba'
    },

    EventSegments : {
        splitTask : 'Rozdeliť úlohu'
    },

    Indicators : {
        earlyDates   : 'Skorý začiatok/koniec',
        lateDates    : 'Neskorý začiatok/koniec',
        Start        : 'Začiatok',
        End          : 'Koniec',
        deadlineDate : 'Termín odovzdania'
    },

    Versions : {
        indented     : 'Odsadené',
        outdented    : 'Predsadené',
        cut          : 'Vystrihnuté',
        pasted       : 'Vložené',
        deletedTasks : 'Odstránené úlohy'
    }
};

export default LocaleHelper.publishLocale(locale);
