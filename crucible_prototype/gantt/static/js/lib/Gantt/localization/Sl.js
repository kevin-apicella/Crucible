import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Sl.js';

const locale = {

    localeName : 'Sl',
    localeDesc : 'Slovensko',
    localeCode : 'sl',

    Object : {
        Save : 'Shrani'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignoriraj koledar virov'
    },

    InactiveColumn : {
        Inactive : 'Neaktiven'
    },

    AddNewColumn : {
        'New Column' : 'Nov stolpec'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Začetni datum po osnovnem načrtu'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Zaključek po osnovnem načrtu'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Trajanje po osnovnem načrta'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Odmik od začetka'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Odmik zaključka'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Odmik trajanja'
    },

    CalendarColumn : {
        Calendar : 'Koledar'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Zgodnji začetek'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Zgodnji konec'
    },

    LateStartDateColumn : {
        'Late Start' : 'Pozni začetek'
    },

    LateEndDateColumn : {
        'Late End' : 'Pozni konec'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Kompletno mrtvilo'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Datum omejitve'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Vrsta omejitve'
    },

    DeadlineDateColumn : {
        Deadline : 'Rok'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Neveljavna odvisnost'
    },

    DurationColumn : {
        Duration : 'Trajanje'
    },

    EffortColumn : {
        Effort : 'Trud'
    },

    EndDateColumn : {
        Finish : 'Končaj'
    },

    EventModeColumn : {
        'Event mode' : 'Način dogodka',
        Manual       : 'Ročni',
        Auto         : 'Samodejni'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Ročno razporejeno'
    },

    MilestoneColumn : {
        Milestone : 'Mejnik'
    },

    NameColumn : {
        Name : 'Ime'
    },

    NoteColumn : {
        Note : 'Opomba'
    },

    PercentDoneColumn : {
        '% Done' : '% dokončano'
    },

    PredecessorColumn : {
        Predecessors : 'Predhodniki'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Dodeljeni viri',
        'more resources'     : 'več virov'
    },

    RollupColumn : {
        Rollup : 'Akumulacija'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Način razporejanja'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Smer razporejanja',
        inheritedFrom       : 'Podedovani od',
        enforcedBy          : 'Prisiljeni od'
    },

    SequenceColumn : {
        Sequence : 'Zaporedje'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Pokaži na časovnici'
    },

    StartDateColumn : {
        Start : 'Začetek'
    },

    SuccessorColumn : {
        Successors : 'Nasledniki'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopiraj',
        cutTask   : 'Izreži',
        pasteTask : 'Prilepi'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Preštevilči'
    },

    DependencyField : {
        invalidDependencyFormat : 'Neveljavna oblika odvisnosti'
    },

    ProjectLines : {
        'Project Start' : 'Začetek projekta',
        'Project End'   : 'Konec projekta'
    },

    TaskTooltip : {
        Start    : 'Začetek',
        End      : 'Konec',
        Duration : 'Trajanje',
        Complete : 'Dokončano'
    },

    AssignmentGrid : {
        Name     : 'Ime vira',
        Units    : 'Enote',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Uredi',
        Indent                 : 'Zamik',
        Outdent                : 'Odmik',
        'Convert to milestone' : 'Pretvori v mejnik',
        Add                    : 'Dodaj ...',
        'New task'             : 'Novo opravilo',
        'New milestone'        : 'Nov mejnik',
        'Task above'           : 'Opravilo zgoraj',
        'Task below'           : 'Opravilo spodaj',
        'Delete task'          : 'Izbriši',
        Milestone              : 'Mejnik',
        'Sub-task'             : 'Podopravilo',
        Successor              : 'Naslednik',
        Predecessor            : 'Predhodnik',
        changeRejected         : 'Mehanizem za razporejanje je zavrnil spremembe',
        linkTasks              : 'Dodaj odvisnosti',
        unlinkTasks            : 'Odstrani odvisnosti',
        color                  : 'Barva'
    },

    EventSegments : {
        splitTask : 'Razdeli nalogo'
    },

    Indicators : {
        earlyDates   : 'Zgodnji začetek/konec',
        lateDates    : 'Pozni začetek/konec',
        Start        : 'Začetek',
        End          : 'Konec',
        deadlineDate : 'Rok'
    },

    Versions : {
        indented     : 'Zamaknjeno',
        outdented    : 'Primaknjeno',
        cut          : 'Rezi',
        pasted       : 'Prilepljeno',
        deletedTasks : 'Izbrisana opravila'
    }
};

export default LocaleHelper.publishLocale(locale);
