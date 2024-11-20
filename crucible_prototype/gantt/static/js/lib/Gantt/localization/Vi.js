import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Vi.js';

const locale = {

    localeName : 'Vi',
    localeDesc : 'Tiếng Việt',
    localeCode : 'vi',

    Object : {
        Save : 'Lưu'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Bỏ qua lịch tài nguyên'
    },

    InactiveColumn : {
        Inactive : 'Không hoạt động '
    },

    AddNewColumn : {
        'New Column' : 'Cột mới'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Ngày bắt đầu cơ bản'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Ngày kết thúc cơ bản'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Thời lượng cơ bản'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Độ lệch ngày bắt đầu cơ bản'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Độ lệch ngày kết thúc cơ bản'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'phương sai thời lượng'
    },

    CalendarColumn : {
        Calendar : 'Lịch'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Khởi đầu sớm'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Kết thúc sớm'
    },

    LateStartDateColumn : {
        'Late Start' : 'Khởi đầu muộn'
    },

    LateEndDateColumn : {
        'Late End' : 'Kết thúc muộn'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Tổng thời gian trì hoãn'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Ngày ràng buộc'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Loại ràng buộc'
    },

    DeadlineDateColumn : {
        Deadline : 'Hạn chót'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Phụ thuộc không hợp lệ'
    },

    DurationColumn : {
        Duration : 'Thời hạn'
    },

    EffortColumn : {
        Effort : 'Cố gắng'
    },

    EndDateColumn : {
        Finish : 'Kết thúc'
    },

    EventModeColumn : {
        'Event mode' : 'Chế độ sự kiện',
        Manual       : 'Thủ công',
        Auto         : 'Tự động'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Lên lịch thủ công'
    },

    MilestoneColumn : {
        Milestone : 'Cột mốc'
    },

    NameColumn : {
        Name : 'Tên'
    },

    NoteColumn : {
        Note : 'Lưu ý'
    },

    PercentDoneColumn : {
        '% Done' : '% đã hoàn thành'
    },

    PredecessorColumn : {
        Predecessors : 'Sự kiện trước'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Tài nguyên được chỉ định',
        'more resources'     : 'thêm tài nguyên'
    },

    RollupColumn : {
        Rollup : 'Báo cáo tóm tắt'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Chế độ lập lịch'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Hướng lập lịch',
        inheritedFrom       : 'Thừa hưởng từ',
        enforcedBy          : 'Bắt buộc bởi'
    },

    SequenceColumn : {
        Sequence : 'Chuỗi'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Hiển thị trong dòng thời gian'
    },

    StartDateColumn : {
        Start : 'Bắt đầu'
    },

    SuccessorColumn : {
        Successors : 'Sự kiện sau'
    },

    TaskCopyPaste : {
        copyTask  : 'Sao chép',
        cutTask   : 'Cắt',
        pasteTask : 'Dán'
    },

    WBSColumn : {
        WBS      : 'Cấu trúc phân chia công việc',
        renumber : 'Đánh số lại'
    },

    DependencyField : {
        invalidDependencyFormat : 'Định dạng phụ thuộc không hợp lệ'
    },

    ProjectLines : {
        'Project Start' : 'Bắt đầu dự án',
        'Project End'   : 'Kế thúc dự án'
    },

    TaskTooltip : {
        Start    : 'Bắt đầu',
        End      : 'Kết thúc',
        Duration : 'Thời hạn',
        Complete : 'Hoàn thành'
    },

    AssignmentGrid : {
        Name     : 'Tên ',
        Units    : 'Đơn vị',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Chỉnh sửa',
        Indent                 : 'Thụt lề vào',
        Outdent                : 'Đưa lề ra',
        'Convert to milestone' : 'Chuyển đổi thành cột mốc',
        Add                    : 'Thêm...',
        'New task'             : 'Nhiệm vụ mới',
        'New milestone'        : 'Cột mốc mới',
        'Task above'           : 'Nhiệm vụ ở trên',
        'Task below'           : 'Nhiệm vụ ở dưới',
        'Delete task'          : 'Xóa nhiệm vụ',
        Milestone              : 'Cột mốc',
        'Sub-task'             : 'Nhiệm vụ phụ',
        Successor              : 'Sự kiện sau',
        Predecessor            : 'Sự kiện trước',
        changeRejected         : 'thay đổi bị từ chối',
        linkTasks              : 'Thêm sự phụ thuộc',
        unlinkTasks            : 'Loại bỏ sự phụ thuộc',
        color                  : 'Màu sắc'
    },

    EventSegments : {
        splitTask : 'Chia nhỏ nhiệm vụ'
    },

    Indicators : {
        earlyDates   : 'Bắt đầu/kết thúc sớm',
        lateDates    : 'Bắt đầu/kết thúc muộn',
        Start        : 'Bắt đầu',
        End          : 'Kết thúc',
        deadlineDate : 'Hạn chót'
    },

    Versions : {
        indented     : 'Thụt vào',
        outdented    : 'Nhô ra',
        cut          : 'Cắt',
        pasted       : 'Đã dán',
        deletedTasks : 'Các nhiệm vụ đã bị xóa'
    }
};

export default LocaleHelper.publishLocale(locale);
