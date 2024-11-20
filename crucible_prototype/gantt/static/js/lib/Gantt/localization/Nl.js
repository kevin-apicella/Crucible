import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Nl.js';

const locale = {

    localeName : 'Nl',
    localeDesc : 'Nederlands',
    localeCode : 'nl',

    Object : {
        Save : 'Bewaar'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Resourcekalender negeren'
    },

    InactiveColumn : {
        Inactive : 'Inactief'
    },

    AddNewColumn : {
        'New Column' : 'Nieuwe kolom'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Begindatum van basislijn'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Einddatum van basislijn'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Duur volgens basislijn'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Afwijking van begindatum'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Afwijking van einddatum'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Afwijking van duur'
    },

    CalendarColumn : {
        Calendar : 'Kalender'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Vroegste startdatum'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Vroegste einddatum'
    },

    LateStartDateColumn : {
        'Late Start' : 'Late startdatum'
    },

    LateEndDateColumn : {
        'Late End' : 'Late einddatum'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Totale marge'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Beperkingsdatum'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Beperkingstype'
    },

    DeadlineDateColumn : {
        Deadline : 'Uiterste datum'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Ongeldige afhankelijkheid'
    },

    DurationColumn : {
        Duration : 'Duur'
    },

    EffortColumn : {
        Effort : 'Inspanning'
    },

    EndDateColumn : {
        Finish : 'Einde'
    },

    EventModeColumn : {
        'Event mode' : 'Mode',
        Manual       : 'Met de hand',
        Auto         : 'Auto'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Handmatig ingepland'
    },

    MilestoneColumn : {
        Milestone : 'Mijlpaalmarkering'
    },

    NameColumn : {
        Name : 'Taak Naam'
    },

    NoteColumn : {
        Note : 'Notitie'
    },

    PercentDoneColumn : {
        '% Done' : '% Gedaan'
    },

    PredecessorColumn : {
        Predecessors : 'Voorafgaande taken'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Toegewezen Resources',
        'more resources'     : 'extra resources'
    },

    RollupColumn : {
        Rollup : 'Oprollen'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Taaktype'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Planningsrichting',
        inheritedFrom       : 'Geërfd van',
        enforcedBy          : 'Opgelegd door'
    },

    SequenceColumn : {
        Sequence : '#'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Toevoegen aan tijdlijn'
    },

    StartDateColumn : {
        Start : 'Begin'
    },

    SuccessorColumn : {
        Successors : 'Opvolgende taken'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopieer',
        cutTask   : 'Knip',
        pasteTask : 'Plak'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Hernummer'
    },

    DependencyField : {
        invalidDependencyFormat : 'Ongeldige afhankelijkheid formaat'
    },

    ProjectLines : {
        'Project Start' : 'Project begin',
        'Project End'   : 'Project einde'
    },

    TaskTooltip : {
        Start    : 'Begin',
        End      : 'Einde',
        Duration : 'Duur',
        Complete : 'Gedaan'
    },

    AssignmentGrid : {
        Name     : 'Resource Naam',
        Units    : 'Eenheden',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Bewerken',
        Indent                 : 'Inspringen',
        Outdent                : 'Uitspringen',
        'Convert to milestone' : 'Converteren naar mijlpaal',
        Add                    : 'Voeg toe...',
        'New task'             : 'Nieuwe taak',
        'New milestone'        : 'Nieuwe mijlpaal',
        'Task above'           : 'Bovenliggende taak',
        'Task below'           : 'Onderliggende Taak',
        'Delete task'          : 'Verwijder',
        Milestone              : 'Mijlpaal',
        'Sub-task'             : 'Subtaak',
        Successor              : 'Voorgaande',
        Predecessor            : 'Voorganger',
        changeRejected         : 'Scheduling engine heeft de wijzigingen afgewezen',
        linkTasks              : 'Dependencies toevoegen',
        unlinkTasks            : 'Dependencies verwijderen',
        color                  : 'Kleur'
    },

    EventSegments : {
        splitTask : 'Taak splitsen'
    },

    Indicators : {
        earlyDates   : 'Vroegste start/eind',
        lateDates    : 'Laatste start/eind',
        Start        : 'Start',
        End          : 'Eind',
        deadlineDate : 'Uiterste datum'
    },

    Versions : {
        indented     : 'Ingesprongen',
        outdented    : 'Uitgesprongen',
        cut          : 'Geknipt',
        pasted       : 'Geplakt',
        deletedTasks : 'Taken zijn verwijderd'
    }
};

export default LocaleHelper.publishLocale(locale);
