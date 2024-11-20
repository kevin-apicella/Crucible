import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/De.js';

const locale = {

    localeName : 'De',
    localeDesc : 'Deutsch',
    localeCode : 'de-DE',

    Object : {
        Save : 'Speichern'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ressourcenkalender ignorieren'
    },

    InactiveColumn : {
        Inactive : 'Inaktiv'
    },

    AddNewColumn : {
        'New Column' : 'Neue Spalte'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Geplanter Anfang'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Geplantes Ende'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Geplante Dauer'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Abweichung Anfang'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Abweichung Ende'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Dauerabweichung'
    },

    CalendarColumn : {
        Calendar : 'Kalender'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Früher Anfang'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Frühes Ende'
    },

    LateStartDateColumn : {
        'Late Start' : 'Später Anfang'
    },

    LateEndDateColumn : {
        'Late End' : 'Spätes Ende'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Gesamtes Slack'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Einschränkung Datum'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Einschränkung Typ'
    },

    DeadlineDateColumn : {
        Deadline : 'Stichtag'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Ungültige Abhängigkeit'
    },

    DurationColumn : {
        Duration : 'Dauer'
    },

    EffortColumn : {
        Effort : 'Aufwand'
    },

    EndDateColumn : {
        Finish : 'Ende'
    },

    EventModeColumn : {
        'Event mode' : 'Ereignismodus',
        Manual       : 'Manuell',
        Auto         : 'Auto'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuell geplant'
    },

    MilestoneColumn : {
        Milestone : 'Meilenstein'
    },

    NameColumn : {
        Name : 'Vorgangsname'
    },

    NoteColumn : {
        Note : 'Notizen'
    },

    PercentDoneColumn : {
        '% Done' : '% Abgeschlossen'
    },

    PredecessorColumn : {
        Predecessors : 'Vorgänger'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Zugewiesene Ressourcen',
        'more resources'     : 'mehr Ressourcen'
    },

    RollupColumn : {
        Rollup : 'Rollup'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Planungsmodus'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Planungsrichtung',
        inheritedFrom       : 'Geerbt von',
        enforcedBy          : 'Erzwungen von'
    },

    SequenceColumn : {
        Sequence : 'Sequenz'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'In der Chronik anzeigen'
    },

    StartDateColumn : {
        Start : 'Anfang'
    },

    SuccessorColumn : {
        Successors : 'Nachfolger'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopieren',
        cutTask   : 'Ausschneiden',
        pasteTask : 'Einfügen'
    },

    WBSColumn : {
        WBS      : 'PSP',
        renumber : 'Erneut nummerieren'
    },

    DependencyField : {
        invalidDependencyFormat : 'Ungültiges Abhängigkeitsformat'
    },

    ProjectLines : {
        'Project Start' : 'Projektanfang',
        'Project End'   : 'Projektende'
    },

    TaskTooltip : {
        Start    : 'Anfang',
        End      : 'Ende',
        Duration : 'Dauer',
        Complete : 'Vollständig'
    },

    AssignmentGrid : {
        Name     : 'Ressourcenname',
        Units    : 'Einheiten',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Bearbeiten',
        Indent                 : 'Einrücken',
        Outdent                : 'Ausrücken',
        'Convert to milestone' : 'Zu Meilenstein konvertieren',
        Add                    : 'Hinzufügen...',
        'New task'             : 'Neue Aufgabe',
        'New milestone'        : 'Neuer Meilenstein',
        'Task above'           : 'Aufgabe oben',
        'Task below'           : 'Aufgabe unten',
        'Delete task'          : 'Löschen',
        Milestone              : 'Meilenstein',
        'Sub-task'             : 'Unteraufgabe',
        Successor              : 'Nachfolger',
        Predecessor            : 'Vorgänger ',
        changeRejected         : 'Zeitplanungsmodul lehnte die Änderungen ab',
        linkTasks              : 'Abhängigkeiten hinzufügen',
        unlinkTasks            : 'Abhängigkeiten entfernen',
        color                  : 'Farbe'
    },

    EventSegments : {
        splitTask : 'Aufgabe aufteilen'
    },

    Indicators : {
        earlyDates   : 'Früher Anfang/Ende',
        lateDates    : 'Später Anfang/Ende',
        Start        : 'Anfang',
        End          : 'Ende',
        deadlineDate : 'Deadline'
    },

    Versions : {
        indented     : 'Eingerückt',
        outdented    : 'Ausgestellt',
        cut          : 'Ausgeschnitten',
        pasted       : 'Kopieren',
        deletedTasks : 'Gelöschte Aufgaben'
    }
};

export default LocaleHelper.publishLocale(locale);
