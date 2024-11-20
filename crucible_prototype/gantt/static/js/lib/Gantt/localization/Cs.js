import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Cs.js';

const locale = {

    localeName : 'Cs',
    localeDesc : 'Česky',
    localeCode : 'cs',

    Object : {
        Save : 'Uložit'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorovat zdrojový kalendář'
    },

    InactiveColumn : {
        Inactive : 'Neaktivní'
    },

    AddNewColumn : {
        'New Column' : 'Nov sloupec'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Základní datum zahájení'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Základní datum ukončení'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Základní doba trvání'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Rozptylu začátku'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Rozptylu konce'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Rozptylu trvání'
    },

    CalendarColumn : {
        Calendar : 'Kalendář'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Brzký začátek'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Brzký konec'
    },

    LateStartDateColumn : {
        'Late Start' : 'Pozdní začátek'
    },

    LateEndDateColumn : {
        'Late End' : 'Pozdní konec'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Celkový počet'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Datum překážky'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Typ překážky'
    },

    DeadlineDateColumn : {
        Deadline : 'Termín'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Neplatná závislost'
    },

    DurationColumn : {
        Duration : 'Doba trvání'
    },

    EffortColumn : {
        Effort : 'Úsilí'
    },

    EndDateColumn : {
        Finish : 'Konec'
    },

    EventModeColumn : {
        'Event mode' : 'Režim události',
        Manual       : 'Manuální',
        Auto         : 'Automatický'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuálně naplánováno'
    },

    MilestoneColumn : {
        Milestone : 'Milník'
    },

    NameColumn : {
        Name : 'Název'
    },

    NoteColumn : {
        Note : 'Poznámka'
    },

    PercentDoneColumn : {
        '% Done' : '% hotovo'
    },

    PredecessorColumn : {
        Predecessors : 'Předchůdci'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Přidělené zdroje',
        'more resources'     : 'další zdroje'
    },

    RollupColumn : {
        Rollup : 'Posunout'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Režim plánování'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Směr plánování',
        inheritedFrom       : 'Děděno od',
        enforcedBy          : 'Vynuceno od'
    },

    SequenceColumn : {
        Sequence : 'Sekvence'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Zobrazit na časové ose'
    },

    StartDateColumn : {
        Start : 'Začátek'
    },

    SuccessorColumn : {
        Successors : 'Následovníci'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopírovat',
        cutTask   : 'Vyjmout',
        pasteTask : 'Vložit'
    },

    WBSColumn : {
        WBS      : 'Struktura pracovního rozkladu',
        renumber : 'Přečíslovat'
    },

    DependencyField : {
        invalidDependencyFormat : 'Neplatný format závislosti'
    },

    ProjectLines : {
        'Project Start' : 'Začátek projektu',
        'Project End'   : 'Konec projektu'
    },

    TaskTooltip : {
        Start    : 'Začátek',
        End      : 'Konec',
        Duration : 'Doba trvání',
        Complete : 'Dokončit'
    },

    AssignmentGrid : {
        Name     : 'Název zdroje',
        Units    : 'Jednotky',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Upravit',
        Indent                 : 'Vnitřní',
        Outdent                : 'Vnější',
        'Convert to milestone' : 'Převést na milník',
        Add                    : 'Přidat...',
        'New task'             : 'Nový úkol',
        'New milestone'        : 'Nový milník',
        'Task above'           : 'Úkol výše',
        'Task below'           : 'Úkol níže',
        'Delete task'          : 'Vymazat',
        Milestone              : 'Milník',
        'Sub-task'             : 'Dílčí úkol',
        Successor              : 'Následník',
        Predecessor            : 'Předchůdce',
        changeRejected         : 'Nástroj pro plánování zamítl změny',
        linkTasks              : 'Přidat závislosti',
        unlinkTasks            : 'Odebrat závislosti',
        color                  : 'Barva'
    },

    EventSegments : {
        splitTask : 'Rozdělit úkol'
    },

    Indicators : {
        earlyDates   : 'Brzký začátek/konec',
        lateDates    : 'Pozdní začátek/konec',
        Start        : 'Začátek',
        End          : 'Konec',
        deadlineDate : 'Termín'
    },

    Versions : {
        indented     : 'S odsazením',
        outdented    : 'Vystouplý',
        cut          : 'Vyříznout',
        pasted       : 'Vložený',
        deletedTasks : 'Smazané úkoly'
    }
};

export default LocaleHelper.publishLocale(locale);
