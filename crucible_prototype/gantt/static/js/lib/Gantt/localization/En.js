import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/En.js';

const locale = {

    localeName : 'En',
    localeDesc : 'English (US)',
    localeCode : 'en-US',

    Object : {
        Save : 'Save'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignore resource calendar'
    },

    InactiveColumn : {
        Inactive : 'Inactive'
    },

    AddNewColumn : {
        'New Column' : 'New Column'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Baseline Start'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Baseline Finish'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Baseline Duration'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Start Variance'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Finish Variance'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Duration Variance'
    },

    CalendarColumn : {
        Calendar : 'Calendar'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Early Start'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Early End'
    },

    LateStartDateColumn : {
        'Late Start' : 'Late Start'
    },

    LateEndDateColumn : {
        'Late End' : 'Late End'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Total Slack'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Constraint Date'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Constraint Type'
    },

    DeadlineDateColumn : {
        Deadline : 'Deadline'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Invalid dependency'
    },

    DurationColumn : {
        Duration : 'Duration'
    },

    EffortColumn : {
        Effort : 'Effort'
    },

    EndDateColumn : {
        Finish : 'Finish'
    },

    EventModeColumn : {
        'Event mode' : 'Event mode',
        Manual       : 'Manual',
        Auto         : 'Auto'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manually scheduled'
    },

    MilestoneColumn : {
        Milestone : 'Milestone'
    },

    NameColumn : {
        Name : 'Name'
    },

    NoteColumn : {
        Note : 'Note'
    },

    PercentDoneColumn : {
        '% Done' : '% Done'
    },

    PredecessorColumn : {
        Predecessors : 'Predecessors'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Assigned Resources',
        'more resources'     : 'more resources'
    },

    RollupColumn : {
        Rollup : 'Rollup'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Scheduling Mode'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Scheduling direction',
        inheritedFrom       : 'Inherited from',
        enforcedBy          : 'Enforced by'
    },

    SequenceColumn : {
        Sequence : 'Sequence'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Show in timeline'
    },

    StartDateColumn : {
        Start : 'Start'
    },

    SuccessorColumn : {
        Successors : 'Successors'
    },

    TaskCopyPaste : {
        copyTask  : 'Copy',
        cutTask   : 'Cut',
        pasteTask : 'Paste'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Renumber'
    },

    DependencyField : {
        invalidDependencyFormat : 'Invalid dependency format'
    },

    ProjectLines : {
        'Project Start' : 'Project start',
        'Project End'   : 'Project end'
    },

    TaskTooltip : {
        Start    : 'Start',
        End      : 'End',
        Duration : 'Duration',
        Complete : 'Complete'
    },

    AssignmentGrid : {
        Name     : 'Resource name',
        Units    : 'Units',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Edit',
        Indent                 : 'Indent',
        Outdent                : 'Outdent',
        'Convert to milestone' : 'Convert to milestone',
        Add                    : 'Add...',
        'New task'             : 'New task',
        'New milestone'        : 'New milestone',
        'Task above'           : 'Task above',
        'Task below'           : 'Task below',
        'Delete task'          : 'Delete',
        Milestone              : 'Milestone',
        'Sub-task'             : 'Subtask',
        Successor              : 'Successor',
        Predecessor            : 'Predecessor',
        changeRejected         : 'Scheduling engine rejected the changes',
        linkTasks              : 'Add dependencies',
        unlinkTasks            : 'Remove dependencies',
        color                  : 'Color'
    },

    EventSegments : {
        splitTask : 'Split task'
    },

    Indicators : {
        earlyDates   : 'Early start/end',
        lateDates    : 'Late start/end',
        Start        : 'Start',
        End          : 'End',
        deadlineDate : 'Deadline'
    },

    Versions : {
        indented     : 'Indented',
        outdented    : 'Outdented',
        cut          : 'Cut',
        pasted       : 'Pasted',
        deletedTasks : 'Deleted tasks'
    }
};

export default LocaleHelper.publishLocale(locale);
