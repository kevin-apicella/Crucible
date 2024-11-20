import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Fi.js';

const locale = {

    localeName : 'Fi',
    localeDesc : 'Suomi',
    localeCode : 'fi',

    Object : {
        Save : 'Tallenna'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ohita resurssikalenteri'
    },

    InactiveColumn : {
        Inactive : ' Ei aktiivinen'
    },

    AddNewColumn : {
        'New Column' : 'Uusi sarake'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Perusaikataulun alkamispäivä'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Perusaikataulun päättymispäivä'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Perusaikataulun kesto'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Alkamisen varianssi'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Päättymisen varianssi'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Keston poikkeama'
    },

    CalendarColumn : {
        Calendar : 'Kalenteri'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Early Aloitus'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Aikainen End'
    },

    LateStartDateColumn : {
        'Late Start' : 'Myöhäinen aloitus'
    },

    LateEndDateColumn : {
        'Late End' : 'Myöhäinen loppu'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Yhteensä Slack'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Rajoituspäivä'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Rajoitustyyppi'
    },

    DeadlineDateColumn : {
        Deadline : 'Määräaika'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Virheellinen riippuvuus'
    },

    DurationColumn : {
        Duration : 'Kesto'
    },

    EffortColumn : {
        Effort : 'Vaivaa'
    },

    EndDateColumn : {
        Finish : 'Lopetus'
    },

    EventModeColumn : {
        'Event mode' : 'Tapahtumatila',
        Manual       : 'Manuaalinen',
        Auto         : 'Automaattinen'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuaalisesti aikataulutettu'
    },

    MilestoneColumn : {
        Milestone : 'Virstanpylväs'
    },

    NameColumn : {
        Name : 'Nimi'
    },

    NoteColumn : {
        Note : 'Huomautus'
    },

    PercentDoneColumn : {
        '% Done' : '% Suoritettu'
    },

    PredecessorColumn : {
        Predecessors : 'Predecessors'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Määritetyt resurssit',
        'more resources'     : 'lisää resursseja'
    },

    RollupColumn : {
        Rollup : 'Rollup'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Aikataulutustila'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Ajoituksen suunta',
        inheritedFrom       : 'Peritty',
        enforcedBy          : 'Pakotettu'
    },

    SequenceColumn : {
        Sequence : 'Sekvenssi'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Näytä aikajanalla'
    },

    StartDateColumn : {
        Start : 'Aloitus'
    },

    SuccessorColumn : {
        Successors : 'Seuraajat'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopioi',
        cutTask   : 'Leikkaa',
        pasteTask : 'Liitä'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Numeroi uudelleen'
    },

    DependencyField : {
        invalidDependencyFormat : 'Virheellinen riippuvuusmuoto'
    },

    ProjectLines : {
        'Project Start' : 'Projektin aloitus',
        'Project End'   : 'Projektin lopetus'
    },

    TaskTooltip : {
        Start    : 'Aloitus',
        End      : 'Lopetus',
        Duration : 'Kesto',
        Complete : 'Täydennä'
    },

    AssignmentGrid : {
        Name     : 'Resurssin nimi',
        Units    : 'Yksiköt',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Muokkaa',
        Indent                 : 'Sisennä',
        Outdent                : 'Ulonna',
        'Convert to milestone' : 'Muunna virstanpylvääksi',
        Add                    : 'Lisää...',
        'New task'             : 'Uusi tehtävä',
        'New milestone'        : 'Uusi virstanpylväs',
        'Task above'           : 'Tehtävä yläpuolella',
        'Task below'           : 'Tehtävä alapuolella',
        'Delete task'          : 'Poista',
        Milestone              : 'Virstanpylväs',
        'Sub-task'             : 'Alatehtävä',
        Successor              : 'Seuraaja',
        Predecessor            : 'Edeltäjä',
        changeRejected         : 'Scheduling engine hylkäsi muutokset',
        linkTasks              : 'Lisää riippuvuuksia',
        unlinkTasks            : 'Poista riippuvuuksia',
        color                  : 'Väri'
    },

    EventSegments : {
        splitTask : 'Jaa tehtävä osiin'
    },

    Indicators : {
        earlyDates   : 'Aikainen aloitus/lopetus',
        lateDates    : 'Myöhäinen aloitus/lopetus',
        Start        : 'Aloitus',
        End          : 'Lopetus',
        deadlineDate : 'Määräaika'
    },

    Versions : {
        indented     : 'Sisennetty',
        outdented    : 'Ulonnettu',
        cut          : 'Leikattu',
        pasted       : 'Liitetty',
        deletedTasks : 'Poistetut tehtävät'
    }
};

export default LocaleHelper.publishLocale(locale);
