import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Ms.js';

const locale = {

    localeName : 'Ms',
    localeDesc : 'Melayu',
    localeCode : 'ms',

    Object : {
        Save : 'Simpan'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Abai kalendar sumber'
    },

    InactiveColumn : {
        Inactive : 'Tak Aktif'
    },

    AddNewColumn : {
        'New Column' : 'Kolum Baharu'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Permulaan asal'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Penghujung asal'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Tempoh asal'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Varians mulakan'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Tamat Varians'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Varians Tempoh'
    },

    CalendarColumn : {
        Calendar : 'Kalendar'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Mula Awal'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Akhir Awal'
    },

    LateStartDateColumn : {
        'Late Start' : 'Mula Lambat'
    },

    LateEndDateColumn : {
        'Late End' : 'Akhir Lambat'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Keseluruhan Slack'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Tarikh Kekang'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Jenis Kekang'
    },

    DeadlineDateColumn : {
        Deadline : 'Tarikh Akhir'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Kebergantungan tak sah'
    },

    DurationColumn : {
        Duration : 'Tempoh'
    },

    EffortColumn : {
        Effort : 'Usaha'
    },

    EndDateColumn : {
        Finish : 'Habis'
    },

    EventModeColumn : {
        'Event mode' : 'Mod peristiwa',
        Manual       : 'Manual',
        Auto         : 'Auto'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Dijadualkan secara manual'
    },

    MilestoneColumn : {
        Milestone : 'Sorotan'
    },

    NameColumn : {
        Name : 'Nama'
    },

    NoteColumn : {
        Note : 'Nota'
    },

    PercentDoneColumn : {
        '% Done' : '% Selesai'
    },

    PredecessorColumn : {
        Predecessors : 'Pendahulu'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Sumber Diperuntukkan',
        'more resources'     : 'lagi sumber'
    },

    RollupColumn : {
        Rollup : 'Menggulung'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Mod Penjadualan'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Arah Penjadualan',
        inheritedFrom       : 'Diwarisi dari',
        enforcedBy          : 'Dikuatkuasakan oleh'
    },

    SequenceColumn : {
        Sequence : 'Urutan'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Tunjuk dalam garis masa'
    },

    StartDateColumn : {
        Start : 'Mula'
    },

    SuccessorColumn : {
        Successors : 'Pengganti'
    },

    TaskCopyPaste : {
        copyTask  : 'Salin',
        cutTask   : 'Potong',
        pasteTask : 'Tampal'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Nombor semula'
    },

    DependencyField : {
        invalidDependencyFormat : 'Format kebergantungan tak sah'
    },

    ProjectLines : {
        'Project Start' : 'Mula projek',
        'Project End'   : 'Akhir projek'
    },

    TaskTooltip : {
        Start    : 'Mula',
        End      : 'Akhir',
        Duration : 'Tempoh',
        Complete : 'Selesai'
    },

    AssignmentGrid : {
        Name     : 'Nama sumber',
        Units    : 'Unit',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Edit',
        Indent                 : 'Inden',
        Outdent                : 'Outden',
        'Convert to milestone' : 'Tukar kepada sorotan',
        Add                    : 'Tambah...',
        'New task'             : 'Tugas baru',
        'New milestone'        : 'Sorotan baharu',
        'Task above'           : 'Tugas atas',
        'Task below'           : 'Tugas bawah',
        'Delete task'          : 'Hapus',
        Milestone              : 'Sorotan',
        'Sub-task'             : 'Subtugas',
        Successor              : 'Pengganti',
        Predecessor            : 'Pendahulu',
        changeRejected         : 'Enjin penjadualan menolak perubahan',
        linkTasks              : 'Tambahkan kebergantungan',
        unlinkTasks            : 'Buang kebergantungan',
        color                  : 'Warna'
    },

    EventSegments : {
        splitTask : 'Pecah tugas'
    },

    Indicators : {
        earlyDates   : 'Mula/akhir awal',
        lateDates    : 'Mula/akhir lambat',
        Start        : 'Mula',
        End          : 'Akhir',
        deadlineDate : 'Tarikh Akhir'
    },

    Versions : {
        indented     : 'Inden',
        outdented    : 'Luar inden',
        cut          : 'Potong',
        pasted       : 'Tampal',
        deletedTasks : 'Padam tugas'
    }
};

export default LocaleHelper.publishLocale(locale);
