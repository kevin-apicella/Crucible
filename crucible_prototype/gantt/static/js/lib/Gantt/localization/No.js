import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/No.js';

const locale = {

    localeName : 'No',
    localeDesc : 'Norsk',
    localeCode : 'no',

    Object : {
        Save : 'Lagre'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorer ressurskalender'
    },

    InactiveColumn : {
        Inactive : 'Ikke aktiv'
    },

    AddNewColumn : {
        'New Column' : 'Ny kolonne'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Planlagt start'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Planlagt slutt'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Planlagt varighet'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Startavvik'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Sluttavvik'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Varighetsavvik'
    },

    CalendarColumn : {
        Calendar : 'Kalender'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Tidlig start'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Tidlig slutt'
    },

    LateStartDateColumn : {
        'Late Start' : 'Sen start'
    },

    LateEndDateColumn : {
        'Late End' : 'Sen slutt'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Total flyt'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Begrensningsdato'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Begrensningstype'
    },

    DeadlineDateColumn : {
        Deadline : 'Frist'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Ugyldig avhengighet'
    },

    DurationColumn : {
        Duration : 'Varighet'
    },

    EffortColumn : {
        Effort : 'Innsats'
    },

    EndDateColumn : {
        Finish : 'Slutt'
    },

    EventModeColumn : {
        'Event mode' : 'Hendselsesmodus',
        Manual       : 'Manuell',
        Auto         : 'Automatisk'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Planlagt manuelt'
    },

    MilestoneColumn : {
        Milestone : 'Milepæl'
    },

    NameColumn : {
        Name : 'Navn'
    },

    NoteColumn : {
        Note : 'Merknad'
    },

    PercentDoneColumn : {
        '% Done' : '% Ferdig'
    },

    PredecessorColumn : {
        Predecessors : 'Tidligere'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Tildelte ressurser',
        'more resources'     : 'flere ressurser'
    },

    RollupColumn : {
        Rollup : ' Rapporter til oppsummering'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Planleggingsmodus'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Planleggingsretning',
        inheritedFrom       : 'Arvet fra',
        enforcedBy          : 'Påtvunget av'
    },

    SequenceColumn : {
        Sequence : 'Sekvens'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Vis på tidslinje'
    },

    StartDateColumn : {
        Start : 'Start'
    },

    SuccessorColumn : {
        Successors : 'Senere'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopi',
        cutTask   : 'Klipp ut',
        pasteTask : 'Lim'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Omnummerere'
    },

    DependencyField : {
        invalidDependencyFormat : 'Ugyldig avhengighetsformat'
    },

    ProjectLines : {
        'Project Start' : 'Prosjektstart',
        'Project End'   : 'Prosjektslutt'
    },

    TaskTooltip : {
        Start    : 'Start',
        End      : 'Slutt',
        Duration : 'Varighet',
        Complete : 'Fullfør'
    },

    AssignmentGrid : {
        Name     : 'Ressursnavn',
        Units    : 'Enheter',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Redigere',
        Indent                 : 'Innrykk',
        Outdent                : 'Utrykk',
        'Convert to milestone' : 'Konverter til milepæl',
        Add                    : 'Legg til...',
        'New task'             : 'Ny oppgave',
        'New milestone'        : 'Ny milepæl',
        'Task above'           : 'Oppgave ovenfor',
        'Task below'           : 'Oppgave nedenfor',
        'Delete task'          : 'Slett',
        Milestone              : 'Milepæl',
        'Sub-task'             : 'Deloppgave',
        Successor              : 'Senere',
        Predecessor            : 'Tidligere',
        changeRejected         : 'Planleggingsmotoren avviste endringer',
        linkTasks              : 'Legg til avhengigheter',
        unlinkTasks            : 'Fjern avhengigheter',
        color                  : 'Farge'
    },

    EventSegments : {
        splitTask : 'Delt oppgave'
    },

    Indicators : {
        earlyDates   : 'Tidlig start/slutt',
        lateDates    : 'Sen start/slutt',
        Start        : 'Start',
        End          : 'Slutt',
        deadlineDate : 'Frist'
    },

    Versions : {
        indented     : 'Innrykket',
        outdented    : 'Utkantet',
        cut          : 'Klipp ut',
        pasted       : 'Limt inn',
        deletedTasks : 'Slettede oppgaver'
    }
};

export default LocaleHelper.publishLocale(locale);
