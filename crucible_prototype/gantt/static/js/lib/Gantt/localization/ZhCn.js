import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/ZhCn.js';

const locale = {

    localeName : 'ZhCn',
    localeDesc : '中文（中国）',
    localeCode : 'zh-CN',

    Object : {
        Save : '保存'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : '忽略资源日历'
    },

    InactiveColumn : {
        Inactive : '无效'
    },

    AddNewColumn : {
        'New Column' : '新栏'
    },

    BaselineStartDateColumn : {
        baselineStart : '比较基准开始时间'
    },

    BaselineEndDateColumn : {
        baselineEnd : '比较基准完成时间'
    },

    BaselineDurationColumn : {
        baselineDuration : '比较基准工期'
    },

    BaselineStartVarianceColumn : {
        startVariance : '开始时间差异'
    },

    BaselineEndVarianceColumn : {
        endVariance : '完成时间差异'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : '工期差异'
    },

    CalendarColumn : {
        Calendar : '日历'
    },

    EarlyStartDateColumn : {
        'Early Start' : '提前开始'
    },

    EarlyEndDateColumn : {
        'Early End' : '提前结束'
    },

    LateStartDateColumn : {
        'Late Start' : '延迟开始'
    },

    LateEndDateColumn : {
        'Late End' : '延迟结束'
    },

    TotalSlackColumn : {
        'Total Slack' : '总浮动时间'
    },

    ConstraintDateColumn : {
        'Constraint Date' : '限制日期'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : '限制类型'
    },

    DeadlineDateColumn : {
        Deadline : '截止日期'
    },

    DependencyColumn : {
        'Invalid dependency' : '依附关系无效'
    },

    DurationColumn : {
        Duration : '持续时间'
    },

    EffortColumn : {
        Effort : ' 努力'
    },

    EndDateColumn : {
        Finish : '完成'
    },

    EventModeColumn : {
        'Event mode' : '事件模式',
        Manual       : '手动',
        Auto         : '自动'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : '手动排程'
    },

    MilestoneColumn : {
        Milestone : '里程碑'
    },

    NameColumn : {
        Name : '名称'
    },

    NoteColumn : {
        Note : '备注'
    },

    PercentDoneColumn : {
        '% Done' : '%已完成'
    },

    PredecessorColumn : {
        Predecessors : '前导'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : '分配资源',
        'more resources'     : '更多资源'
    },

    RollupColumn : {
        Rollup : '卷起'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : '排程模式'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : '调度方向',
        inheritedFrom       : '继承自',
        enforcedBy          : '强制执行者'
    },

    SequenceColumn : {
        Sequence : '序列'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : '在时间轴中显示'
    },

    StartDateColumn : {
        Start : '开始'
    },

    SuccessorColumn : {
        Successors : '后继'
    },

    TaskCopyPaste : {
        copyTask  : '复制',
        cutTask   : '剪切',
        pasteTask : '粘贴'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : '重新编号'
    },

    DependencyField : {
        invalidDependencyFormat : '依附关系格式无效'
    },

    ProjectLines : {
        'Project Start' : '项目开始',
        'Project End'   : '项目结束'
    },

    TaskTooltip : {
        Start    : '开始',
        End      : '结束',
        Duration : '持续时间',
        Complete : '完成'
    },

    AssignmentGrid : {
        Name     : '资源名称',
        Units    : '单位',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : '编辑',
        Indent                 : '缩进',
        Outdent                : '减少缩进',
        'Convert to milestone' : '转换为里程碑',
        Add                    : '添加……',
        'New task'             : '新任务',
        'New milestone'        : '新里程碑',
        'Task above'           : '上述任务',
        'Task below'           : '下方任务',
        'Delete task'          : '删除',
        Milestone              : '里程碑',
        'Sub-task'             : '子任务',
        Successor              : '后继任务',
        Predecessor            : '前导任务',
        changeRejected         : '调度引擎拒绝变更',
        linkTasks              : '添加依赖关系',
        unlinkTasks            : '删除依赖关系',
        color                  : '颜色'
    },

    EventSegments : {
        splitTask : '拆分任务'
    },

    Indicators : {
        earlyDates   : '提前开始/结束',
        lateDates    : '延迟开始/结束',
        Start        : '开始',
        End          : '结束',
        deadlineDate : '截止日期'
    },

    Versions : {
        indented     : '缩进',
        outdented    : '减少缩进',
        cut          : '剪切',
        pasted       : '粘贴',
        deletedTasks : '删除任务'
    }
};

export default LocaleHelper.publishLocale(locale);
