import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Ar.js';

const locale = {

    localeName : 'Ar',
    localeDesc : 'اللغة العربية',
    localeCode : 'ar',

    Object : {
        Save : 'حفظ'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'تجاهل تقويم المورد'
    },

    InactiveColumn : {
        Inactive : 'غير نشط'
    },

    AddNewColumn : {
        'New Column' : 'عمود جديد'
    },

    BaselineStartDateColumn : {
        baselineStart : 'تاريخ بدء الأساس'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'تاريخ انتهاء الأساس'
    },

    BaselineDurationColumn : {
        baselineDuration : 'مدة الأساس'
    },

    BaselineStartVarianceColumn : {
        startVariance : ' تباين تاريخ البدء'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'تباين تاريخ الانتهاء'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'تباين المدة'
    },

    CalendarColumn : {
        Calendar : 'التقويم'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'بداية مبكرة'
    },

    EarlyEndDateColumn : {
        'Early End' : 'نهاية مبكرة'
    },

    LateStartDateColumn : {
        'Late Start' : 'بداية متأخرة'
    },

    LateEndDateColumn : {
        'Late End' : 'نهاية متأخرة'
    },

    TotalSlackColumn : {
        'Total Slack' : 'إجمالي فترة الركود'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'تاريخ التقييد'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'نوع التقييد'
    },

    DeadlineDateColumn : {
        Deadline : 'الموعد النهائي'
    },

    DependencyColumn : {
        'Invalid dependency' : 'تبعية غير صالحة'
    },

    DurationColumn : {
        Duration : 'المدة الزمنية'
    },

    EffortColumn : {
        Effort : 'الجهد'
    },

    EndDateColumn : {
        Finish : 'إنهاء'
    },

    EventModeColumn : {
        'Event mode' : 'وضع الحدث',
        Manual       : 'يدوي',
        Auto         : 'آلي'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'تمت جدولته يدويًا'
    },

    MilestoneColumn : {
        Milestone : 'علامة'
    },

    NameColumn : {
        Name : 'اسم'
    },

    NoteColumn : {
        Note : 'ملاحظة'
    },

    PercentDoneColumn : {
        '% Done' : '% تم إنجازه'
    },

    PredecessorColumn : {
        Predecessors : 'السالفة'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'الموارد المخصصة',
        'more resources'     : 'المزيد من الموارد'
    },

    RollupColumn : {
        Rollup : 'التراكم'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'وضع الجدولة'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'اتجاه الجدولة',
        inheritedFrom       : 'موروث من',
        enforcedBy          : 'فُرض بواسطة'
    },

    SequenceColumn : {
        Sequence : 'التسلسل'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'عرض في الجدول الزمني'
    },

    StartDateColumn : {
        Start : 'بدء'
    },

    SuccessorColumn : {
        Successors : 'اللاحقة'
    },

    TaskCopyPaste : {
        copyTask  : 'نسخ',
        cutTask   : 'قص',
        pasteTask : 'لصق'
    },

    WBSColumn : {
        WBS      : ' WBS',
        renumber : 'إعادة ترقيم'
    },

    DependencyField : {
        invalidDependencyFormat : 'تنسيق تبعية غير صالح'
    },

    ProjectLines : {
        'Project Start' : 'بداية المشروع',
        'Project End'   : 'نهاية المشروع'
    },

    TaskTooltip : {
        Start    : 'بدء',
        End      : 'إنهاء',
        Duration : 'المدة الزمنية',
        Complete : 'إكمال'
    },

    AssignmentGrid : {
        Name     : 'اسم المورد',
        Units    : 'وحدات',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'تعديل',
        Indent                 : 'مسافة بادئة',
        Outdent                : 'مسافة نهاية',
        'Convert to milestone' : 'تحويل إلى العلامة',
        Add                    : '...إضافة',
        'New task'             : 'مهمة جديدة',
        'New milestone'        : 'علامة جديدة',
        'Task above'           : 'المهمة السابقة بالأعلى',
        'Task below'           : 'المهمة التالية بالأسفل',
        'Delete task'          : 'حذف',
        Milestone              : 'علامة',
        'Sub-task'             : 'مهمة فرعية',
        Successor              : 'اللاحقة',
        Predecessor            : 'السابق',
        changeRejected         : 'محرك الجدولة رفض التغييرات',
        linkTasks              : 'إضافة التبعيات',
        unlinkTasks            : 'إزالة التبعيات',
        color                  : 'لون'
    },

    EventSegments : {
        splitTask : 'تقسيم المهمة'
    },

    Indicators : {
        earlyDates   : 'بداية/نهاية مبكرة',
        lateDates    : 'بداية/نهاية متأخرة',
        Start        : 'بداية',
        End          : 'نهاية',
        deadlineDate : 'الموعد النهائي'
    },

    Versions : {
        indented     : 'مسافة بادئة',
        outdented    : 'مسافة خارجة',
        cut          : 'قص',
        pasted       : 'تم اللصق',
        deletedTasks : 'المهام المحذوفة'
    }
};

export default LocaleHelper.publishLocale(locale);
