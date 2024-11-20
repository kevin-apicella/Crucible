import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/El.js';

const locale = {

    localeName : 'El',
    localeDesc : 'Ελληνικά',
    localeCode : 'el',

    Object : {
        Save : 'Αποθήκευση'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Παράβλεψη ημερολογίου πόρου'
    },

    InactiveColumn : {
        Inactive : 'Ανενεργή'
    },

    AddNewColumn : {
        'New Column' : 'Νέα Στήλη'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Έναρξη γραμμής βάσης'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Λήξη γραμμής βάσης'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Διάρκεια γραμμής βάσης'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Διακύμανση έναρξης'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Διακύμανση λήξης'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Διακύμανση διάρκειας'
    },

    CalendarColumn : {
        Calendar : 'Ημερολόγιο'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Πρόωρη Έναρξη'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Πρόωρος Τερματισμός'
    },

    LateStartDateColumn : {
        'Late Start' : 'Καθυστερημένη Έναρξη'
    },

    LateEndDateColumn : {
        'Late End' : 'Καθυστερημένος Τερματισμός'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Συνολικός Χρόνος Αδράνειας'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Περιορισμός Ημερομηνίας'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Τύπος Περιορισμού'
    },

    DeadlineDateColumn : {
        Deadline : 'Προθεσμία'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Μη έγκυρη εξάρτηση'
    },

    DurationColumn : {
        Duration : 'Διάρκεια'
    },

    EffortColumn : {
        Effort : 'Effort'
    },

    EndDateColumn : {
        Finish : 'Τέλος'
    },

    EventModeColumn : {
        'Event mode' : 'Λειτουργία συμβάντων',
        Manual       : 'Χειροκίνητη',
        Auto         : 'Αυτόματη'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Χειροκίνητος προγραμματισμός'
    },

    MilestoneColumn : {
        Milestone : 'Ορόσημο'
    },

    NameColumn : {
        Name : 'Όνομα'
    },

    NoteColumn : {
        Note : 'Σημείωση'
    },

    PercentDoneColumn : {
        '% Done' : '% Έτοιμο'
    },

    PredecessorColumn : {
        Predecessors : 'Προκάτοχοι'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Εκχωρηθέντες Πόροι',
        'more resources'     : 'περισσότεροι πόροι'
    },

    RollupColumn : {
        Rollup : 'Rollup'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Λειτουργία προγραμματισμού'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Κατεύθυνση προγραμματισμού',
        inheritedFrom       : 'Κληρονομήθηκε από',
        enforcedBy          : 'Επιβλήθηκε από'
    },

    SequenceColumn : {
        Sequence : 'Ακολουθία'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Εμφάνιση στη γραμμή χρόνου'
    },

    StartDateColumn : {
        Start : 'Έναρξη'
    },

    SuccessorColumn : {
        Successors : 'Διάδοχοι'
    },

    TaskCopyPaste : {
        copyTask  : 'Αντιγραφή',
        cutTask   : 'Αποκοπή',
        pasteTask : 'Επικόλληση'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Επαναρίθμηση'
    },

    DependencyField : {
        invalidDependencyFormat : 'Μη έγκυρη μορφή εξάρτησης'
    },

    ProjectLines : {
        'Project Start' : 'Έναρξη έργου',
        'Project End'   : 'Τερματισμός έργου'
    },

    TaskTooltip : {
        Start    : 'Έναρξη',
        End      : 'Τερματισμός',
        Duration : 'Διάρκεια',
        Complete : 'Ολοκλήρωση'
    },

    AssignmentGrid : {
        Name     : 'Όνομα πόρων',
        Units    : 'Μονάδες',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Επεξεργασία',
        Indent                 : 'Δημιουργία υπό-εργασίας',
        Outdent                : 'Δημιουργία υπέρ-εργασίας',
        'Convert to milestone' : 'Μετατροπή σε ορόσημο',
        Add                    : 'Προσθήκη...',
        'New task'             : 'Νέα εργασία',
        'New milestone'        : 'Νέο ορόσημο',
        'Task above'           : 'Η εργασία ανωτέρω',
        'Task below'           : 'Η εργασία κατωτέρω',
        'Delete task'          : 'Διαγραφή',
        Milestone              : 'Ορόσημο',
        'Sub-task'             : 'Υποεργασία',
        Successor              : 'Διάδοχος',
        Predecessor            : 'Προκάτοχος',
        changeRejected         : 'Η μηχανή προγραμματισμού απέρριψε τις αλλαγές',
        linkTasks              : 'Προσθήκη εξαρτήσεων',
        unlinkTasks            : 'Αφαίρεση εξαρτήσεων',
        color                  : 'Χρώμα '
    },

    EventSegments : {
        splitTask : 'Διαίρεση εργασίας'
    },

    Indicators : {
        earlyDates   : 'Πρόωρη έναρξη/τερματισμός',
        lateDates    : 'Καθυστερημένη έναρξη/τερματισμός',
        Start        : 'Έναρξη',
        End          : 'Τερματισμός',
        deadlineDate : 'Προθεσμία'
    },

    Versions : {
        indented     : 'Με εσοχές',
        outdented    : 'Ξεπερνά τα όρια',
        cut          : 'Aποκόπηκε',
        pasted       : 'Επικολλήθηκε',
        deletedTasks : 'Διαγραμμένες εργασίες'
    }
};

export default LocaleHelper.publishLocale(locale);
