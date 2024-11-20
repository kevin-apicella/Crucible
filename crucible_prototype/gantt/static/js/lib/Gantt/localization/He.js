import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/He.js';

const locale = {

    localeName : 'He',
    localeDesc : 'עִברִית',
    localeCode : 'he',

    Object : {
        Save : 'שמור'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'התעלם מלוח משאבים'
    },

    InactiveColumn : {
        Inactive : 'בלתי-פעיל'
    },

    AddNewColumn : {
        'New Column' : 'עמודה חדשה'
    },

    BaselineStartDateColumn : {
        baselineStart : 'התחלה בסיסית'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'סיום בסיסי'
    },

    BaselineDurationColumn : {
        baselineDuration : 'משך בסיסי'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'סטיית התחלה'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'סטיית סיום'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'שונות משך'
    },

    CalendarColumn : {
        Calendar : 'לוח שנה'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'התחלה מוקדמת'
    },

    EarlyEndDateColumn : {
        'Early End' : 'סיום מוקדם'
    },

    LateStartDateColumn : {
        'Late Start' : 'התחלה מאוחרת'
    },

    LateEndDateColumn : {
        'Late End' : 'סיום מאוחר'
    },

    TotalSlackColumn : {
        'Total Slack' : 'רפיון כולל'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'תאריך אילוץ'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'סוג אילוץ'
    },

    DeadlineDateColumn : {
        Deadline : 'דדליין'
    },

    DependencyColumn : {
        'Invalid dependency' : 'תלות בלתי-חוקית'
    },

    DurationColumn : {
        Duration : 'משך'
    },

    EffortColumn : {
        Effort : ' מאמץ'
    },

    EndDateColumn : {
        Finish : 'סוף'
    },

    EventModeColumn : {
        'Event mode' : 'מצב אירוע',
        Manual       : 'ידני',
        Auto         : 'אוטומטי'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'מתוזמן ידנית'
    },

    MilestoneColumn : {
        Milestone : 'אבן דרך'
    },

    NameColumn : {
        Name : 'שם'
    },

    NoteColumn : {
        Note : 'הערה'
    },

    PercentDoneColumn : {
        '% Done' : '% בוצע'
    },

    PredecessorColumn : {
        Predecessors : 'אירועים קודמים'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'משאבים מוקצים',
        'more resources'     : 'משאבים נוספים'
    },

    RollupColumn : {
        Rollup : 'גלגול'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'מצב תזמון'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'כיוון לוח זמנים',
        inheritedFrom       : 'מורש מ',
        enforcedBy          : 'מוטל בכוח על ידי'
    },

    SequenceColumn : {
        Sequence : 'סדרה'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'הצג ציר זמן'
    },

    StartDateColumn : {
        Start : 'התחל'
    },

    SuccessorColumn : {
        Successors : 'יורשים'
    },

    TaskCopyPaste : {
        copyTask  : 'העתק',
        cutTask   : 'גזור',
        pasteTask : 'הדבק'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'מספור מחדש'
    },

    DependencyField : {
        invalidDependencyFormat : 'פורמט תלות בלתי-חוקי'
    },

    ProjectLines : {
        'Project Start' : 'תחילת פרויקט',
        'Project End'   : 'סוף פרויקט'
    },

    TaskTooltip : {
        Start    : 'התחלה',
        End      : 'סוף',
        Duration : 'משך',
        Complete : 'השלמה'
    },

    AssignmentGrid : {
        Name     : 'שם משאב',
        Units    : 'יחידות',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'ערוך',
        Indent                 : 'הזחה פנימה',
        Outdent                : 'הזחה החוצה',
        'Convert to milestone' : 'המר לאבן דרך',
        Add                    : '...הוסף',
        'New task'             : 'משימה חדשה',
        'New milestone'        : 'אבן דרך חדשה',
        'Task above'           : 'המשימה לעיל',
        'Task below'           : 'המשימה מטה',
        'Delete task'          : 'למחוק',
        Milestone              : 'אבן דרך',
        'Sub-task'             : 'תת-משימה',
        Successor              : 'אירוע יורש',
        Predecessor            : 'אירוע קודם',
        changeRejected         : 'מכונת התזמון דחתה את השינויים',
        linkTasks              : 'הוספת תלות',
        unlinkTasks            : 'הסרת תלות',
        color                  : 'צבע'
    },

    EventSegments : {
        splitTask : 'פצל משימה'
    },

    Indicators : {
        earlyDates   : 'התחלה מוקדמת/סוף מוקדם',
        lateDates    : 'התחלה מאוחרת/סוף מאוחר',
        Start        : 'התחלה',
        End          : 'סוף',
        deadlineDate : 'דדליין'
    },

    Versions : {
        indented     : 'מוזח פנימה',
        outdented    : 'מוזח החוצה',
        cut          : 'נגזר',
        pasted       : 'הודבק',
        deletedTasks : 'משימות שנמחקו'
    }
};

export default LocaleHelper.publishLocale(locale);
