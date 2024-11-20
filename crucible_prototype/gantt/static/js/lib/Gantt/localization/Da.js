import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Da.js';

const locale = {

    localeName : 'Da',
    localeDesc : 'Dansk',
    localeCode : 'da',

    Object : {
        Save : 'Gem'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorer ressourcekalender'
    },

    InactiveColumn : {
        Inactive : 'Inaktiv'
    },

    AddNewColumn : {
        'New Column' : 'Tilføj ny kolonne...'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Oprindelig startdato'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Oprindelig slutdato'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Oprindelig varighed'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Startdatoafvigelse'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Slutdatoafvigelse'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Varighedsafvigelse'
    },

    CalendarColumn : {
        Calendar : 'Kalender'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Tidlig start'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Tidlig afslutning'
    },

    LateStartDateColumn : {
        'Late Start' : 'Sen start'
    },

    LateEndDateColumn : {
        'Late End' : 'Sen afslutning'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Samlet buffertid'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Begrænsningsdato'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Begrænsningstype'
    },

    DeadlineDateColumn : {
        Deadline : 'Tidsfrist'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Ugyldig afhængighed, ændringen blev annulleret'
    },

    DurationColumn : {
        Duration : 'Varighed'
    },

    EffortColumn : {
        Effort : 'Indsats'
    },

    EndDateColumn : {
        Finish : 'Færdig'
    },

    EventModeColumn : {
        'Event mode' : 'Begivenhedstilstand',
        Manual       : 'Manuel',
        Auto         : 'Automatisk'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuelt planlagt'
    },

    MilestoneColumn : {
        Milestone : 'Milepæl'
    },

    NameColumn : {
        Name : 'Navn'
    },

    NoteColumn : {
        Note : 'Note'
    },

    PercentDoneColumn : {
        '% Done' : '% færdig'
    },

    PredecessorColumn : {
        Predecessors : 'Forgængere'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Tildelte ressourcer',
        'more resources'     : 'Yderligere ressourcer'
    },

    RollupColumn : {
        Rollup : 'Oprulning'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Planlægningstilstand'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Planlægningsretning',
        inheritedFrom       : 'Arvet fra',
        enforcedBy          : 'Pålagt af'
    },

    SequenceColumn : {
        Sequence : '#'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Vis på tidslinje'
    },

    StartDateColumn : {
        Start : 'Start'
    },

    SuccessorColumn : {
        Successors : 'Efterfølgere'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopi',
        cutTask   : 'klip',
        pasteTask : 'sæt ind'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Omnummer'
    },

    DependencyField : {
        invalidDependencyFormat : 'Ugyldigt afhængighedsformat'
    },

    ProjectLines : {
        'Project Start' : 'Start',
        'Project End'   : 'Slut'
    },

    TaskTooltip : {
        Start    : 'Start',
        End      : 'Afslutning',
        Duration : 'Varighed',
        Complete : 'Færdig'
    },

    AssignmentGrid : {
        Name     : 'Ressourcenavn',
        Units    : 'Enheder',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Redigér',
        Indent                 : 'Ryk ind',
        Outdent                : 'Ryk ud',
        'Convert to milestone' : 'Konvertér til milepæl',
        Add                    : 'Tilføj...',
        'New task'             : 'Ny opgave',
        'New milestone'        : 'Ny milepæl',
        'Task above'           : 'Opgave over',
        'Task below'           : 'Opgave under',
        'Delete task'          : 'Slet',
        Milestone              : 'Milepæl',
        'Sub-task'             : 'Underopgave',
        Successor              : 'Efterfølger',
        Predecessor            : 'Forgænger',
        changeRejected         : 'Ændring afvist',
        linkTasks              : 'Tilføj afhængigheder',
        unlinkTasks            : 'Fjern afhængigheder',
        color                  : 'Farve'
    },

    EventSegments : {
        splitTask : 'Opdelt opgave'
    },

    Indicators : {
        earlyDates   : 'Tidlig start/afslutning',
        lateDates    : 'Sen start/afslutning',
        Start        : 'Start',
        End          : 'Afslutning',
        deadlineDate : 'Frist'
    },

    Versions : {
        indented     : 'indrykket',
        outdented    : 'Overdenen',
        cut          : 'Skære',
        pasted       : 'Indsat',
        deletedTasks : 'Slettede opgaver'
    }
};

export default LocaleHelper.publishLocale(locale);
