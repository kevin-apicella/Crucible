import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Hi.js';

const locale = {

    localeName : 'Hi',
    localeDesc : 'हिन्दी',
    localeCode : 'hi',

    Object : {
        Save : 'सहेजें'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'संसाधन कैलेंडर को नजरअंदाज करें'
    },

    InactiveColumn : {
        Inactive : 'निष्क्रिय'
    },

    AddNewColumn : {
        'New Column' : 'नया कॉलम'
    },

    BaselineStartDateColumn : {
        baselineStart : 'मूल शुरुआत'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'मूल अंत'
    },

    BaselineDurationColumn : {
        baselineDuration : 'मूल अवधि'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'भिन्नता प्रारंभ करें'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'अंत भिन्नता'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'अवधि विचरण'
    },

    CalendarColumn : {
        Calendar : 'कैलेन्डर'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'जल्दी शुरुआत'
    },

    EarlyEndDateColumn : {
        'Early End' : 'जल्दी समापन'
    },

    LateStartDateColumn : {
        'Late Start' : 'देर से शुरुआत'
    },

    LateEndDateColumn : {
        'Late End' : 'देर से समापन'
    },

    TotalSlackColumn : {
        'Total Slack' : 'कुल मंदी'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'बाधा तारीख'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'बाधा प्रकार'
    },

    DeadlineDateColumn : {
        Deadline : 'समय सीमा'
    },

    DependencyColumn : {
        'Invalid dependency' : 'अमान्य निर्भरता'
    },

    DurationColumn : {
        Duration : 'अवधि'
    },

    EffortColumn : {
        Effort : 'प्रयास'
    },

    EndDateColumn : {
        Finish : 'समाप्ति'
    },

    EventModeColumn : {
        'Event mode' : 'ईवेंट मोड',
        Manual       : 'मैनुअल',
        Auto         : 'ऑटो'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'मैनुअल रूप से निर्धारित'
    },

    MilestoneColumn : {
        Milestone : 'स्तर'
    },

    NameColumn : {
        Name : 'नाम'
    },

    NoteColumn : {
        Note : 'नोट'
    },

    PercentDoneColumn : {
        '% Done' : '% संपन्न'
    },

    PredecessorColumn : {
        Predecessors : 'पूर्ववर्ती'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'सौंपे गए संसाधन',
        'more resources'     : 'और संसाधन'
    },

    RollupColumn : {
        Rollup : 'रोलअप'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'शेड्यूलिंग मोड'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'अनुसूची दिशा',
        inheritedFrom       : 'वंशानुक्रम से',
        enforcedBy          : 'ज़बरदस्ती से'
    },

    SequenceColumn : {
        Sequence : 'अनुक्रम'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'टाइमलाइन में दिखाएं'
    },

    StartDateColumn : {
        Start : 'शुरु करें'
    },

    SuccessorColumn : {
        Successors : 'उत्तराधिकारी'
    },

    TaskCopyPaste : {
        copyTask  : 'कॉपी करें',
        cutTask   : 'कट करें',
        pasteTask : 'पेस्ट करें'
    },

    WBSColumn : {
        WBS      : 'प्रोजेक्ट ब्रेकडाउन संरचना',
        renumber : 'फिर से नंबर देना'
    },

    DependencyField : {
        invalidDependencyFormat : 'अमान्य निर्भरता फार्मेट'
    },

    ProjectLines : {
        'Project Start' : 'प्रोजेक्ट शुरु',
        'Project End'   : 'प्रोजेक्ट समाप्त'
    },

    TaskTooltip : {
        Start    : 'शुरु करें',
        End      : 'समाप्त करें',
        Duration : 'अवधि',
        Complete : 'पूर्ण'
    },

    AssignmentGrid : {
        Name     : 'संसाधन नंबर',
        Units    : 'इकाइयां',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'संपादित करें',
        Indent                 : 'इंडेंट',
        Outdent                : 'आउटडेंट',
        'Convert to milestone' : 'स्तर में बदलें',
        Add                    : 'जोडें...',
        'New task'             : 'नया टास्क',
        'New milestone'        : 'नया स्तर',
        'Task above'           : 'ऊपर का टास्क',
        'Task below'           : 'नीचे का टास्क',
        'Delete task'          : 'हटाएं',
        Milestone              : 'स्तर',
        'Sub-task'             : 'उप-टास्क',
        Successor              : 'उत्तराधिकारी',
        Predecessor            : 'पूर्वाधिकारी',
        changeRejected         : 'शेड्यूलिंग इंजन ने बदलावों को अस्वीकृत किया',
        linkTasks              : 'डेपेंडेंसीज जोड़ें',
        unlinkTasks            : 'डेपेंडेंसीज हटाएं',
        color                  : 'रंग'
    },

    EventSegments : {
        splitTask : 'टोस्क स्प्लिट करें'
    },

    Indicators : {
        earlyDates   : 'जल्दी शुरु /समाप्त',
        lateDates    : 'देर से शुरु /समाप्त',
        Start        : 'शुरु',
        End          : 'समाप्त',
        deadlineDate : 'समयसीमा'
    },

    Versions : {
        indented     : 'इंडेंट किया',
        outdented    : 'आउटडेंट किया',
        cut          : 'कट करें',
        pasted       : 'पेस्ट करें',
        deletedTasks : 'टास्क हटाएं'
    }
};

export default LocaleHelper.publishLocale(locale);
