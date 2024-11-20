import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Th.js';

const locale = {

    localeName : 'Th',
    localeDesc : 'ไทย',
    localeCode : 'th',

    Object : {
        Save : 'บันทึก'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'เพิกเฉยต่อปฏิทินทรัพยากร'
    },

    InactiveColumn : {
        Inactive : 'ไม่ทำงาน'
    },

    AddNewColumn : {
        'New Column' : 'คอลัมน์ใหม่'
    },

    BaselineStartDateColumn : {
        baselineStart : 'เริ่มต้นเดิม'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'สิ้นสุดเดิม'
    },

    BaselineDurationColumn : {
        baselineDuration : 'ระยะเวลาเดิม'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'ผิดไปจากวันที่เริ่มต้นเดิม'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'ผิดไปจากวันที่สิ้นสุดเดิม'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'ความแปรปรวนของระยะเวลา'
    },

    CalendarColumn : {
        Calendar : 'ปฏิทิน'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'เริ่มต้นเร็ว'
    },

    EarlyEndDateColumn : {
        'Early End' : 'สิ้นสุดเร็ว'
    },

    LateStartDateColumn : {
        'Late Start' : 'เริ่มต้นล่าช้า'
    },

    LateEndDateColumn : {
        'Late End' : 'สิ้นสุดล่าช้า'
    },

    TotalSlackColumn : {
        'Total Slack' : 'เวลาที่เหลือทั้งหมด'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'วันที่ของข้อจำกัด'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'ประเภทของข้อจำกัด'
    },

    DeadlineDateColumn : {
        Deadline : 'กำหนดเวลา'
    },

    DependencyColumn : {
        'Invalid dependency' : 'การอ้างอิงที่ไม่ถูกต้อง'
    },

    DurationColumn : {
        Duration : 'ระยะเวลา'
    },

    EffortColumn : {
        Effort : ' การลงแรง'
    },

    EndDateColumn : {
        Finish : 'เสร็จสิ้น'
    },

    EventModeColumn : {
        'Event mode' : 'โหมดกิจกรรม',
        Manual       : 'กำหนดเอง',
        Auto         : 'อัตโนมัติ'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'จัดกำหนดการด้วยตนเอง'
    },

    MilestoneColumn : {
        Milestone : 'จุดระบุความคืบหน้า'
    },

    NameColumn : {
        Name : 'ชื่อ'
    },

    NoteColumn : {
        Note : 'หมายเหตุ'
    },

    PercentDoneColumn : {
        '% Done' : '% ที่ดำเนินการเสร็จ'
    },

    PredecessorColumn : {
        Predecessors : 'งานลำดับก่อนหน้า'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'ทรัพยากรที่ได้รับการจัดสรร',
        'more resources'     : 'ทรัพยากรเพิ่มเติม'
    },

    RollupColumn : {
        Rollup : 'การแสดงข้อมูลที่หน้าสรุป'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'โหมดการจัดกำหนดการ'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'ทิศทางการกำหนดตารางเวลา',
        inheritedFrom       : 'สืบทอดมาจาก',
        enforcedBy          : 'บังคับใช้โดย'
    },

    SequenceColumn : {
        Sequence : 'จัดลำดับ'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'แสดงในลำดับเวลา'
    },

    StartDateColumn : {
        Start : 'เริ่มต้น'
    },

    SuccessorColumn : {
        Successors : 'งานที่ตามมา'
    },

    TaskCopyPaste : {
        copyTask  : 'คัดลอก',
        cutTask   : 'ตัด',
        pasteTask : 'วาง'
    },

    WBSColumn : {
        WBS      : ' โครงสร้างการแบ่งงาน',
        renumber : 'ระบุหมายเลขใหม่'
    },

    DependencyField : {
        invalidDependencyFormat : 'รูปแบบการอ้างอิงไม่ถูกต้อง'
    },

    ProjectLines : {
        'Project Start' : 'โครงการเริ่มต้น',
        'Project End'   : 'โครงการสิ้นสุด'
    },

    TaskTooltip : {
        Start    : 'เริ่มต้น',
        End      : 'สิ้นสุด',
        Duration : 'ระยะเวลา',
        Complete : 'เสร็จสิ้น'
    },

    AssignmentGrid : {
        Name     : 'ชื่อทรัพยากร',
        Units    : 'หน่วย',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'แก้ไข',
        Indent                 : 'เยื้องเข้า',
        Outdent                : 'ยกเลิกการเยื้องเข้า',
        'Convert to milestone' : 'แปลงเป็นจุดระบุความคืบหน้า',
        Add                    : 'เพิ่ม...',
        'New task'             : 'งานใหม่',
        'New milestone'        : 'จุดระบุความคืบหน้าใหม่',
        'Task above'           : 'งานด้านบน',
        'Task below'           : 'งานด้านล่าง',
        'Delete task'          : 'ลบ',
        Milestone              : 'จุดระบุความคืบหน้า',
        'Sub-task'             : 'งานย่อย',
        Successor              : 'งานที่ตามมา',
        Predecessor            : 'งานลำดับก่อนหน้า',
        changeRejected         : 'เครื่องช่วยจัดกำหนดการปฏิเสธการเปลี่ยนแปลง',
        linkTasks              : 'เพิ่มขึ้นอยู่กับ',
        unlinkTasks            : 'ลบขึ้นอยู่กับ',
        color                  : 'สี'
    },

    EventSegments : {
        splitTask : 'แยกงาน'
    },

    Indicators : {
        earlyDates   : 'การเริ่มต้น/สิ้นสุดเร็ว',
        lateDates    : 'การเริ่มต้น/สิ้นสุดล่าช้า',
        Start        : 'เริ่มต้น',
        End          : 'สิ้นสุด',
        deadlineDate : 'วันที่กำหนดเวลา'
    },

    Versions : {
        indented     : 'ย่อหน้า',
        outdented    : 'ยกเลิกย่อหน้า',
        cut          : 'ตัด',
        pasted       : 'วางแล้ว',
        deletedTasks : 'ลบงานแล้ว'
    }
};

export default LocaleHelper.publishLocale(locale);
