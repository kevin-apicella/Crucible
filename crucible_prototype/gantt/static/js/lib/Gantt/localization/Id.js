import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Id.js';

const locale = {

    localeName : 'Id',
    localeDesc : 'Bahasa Indonesia',
    localeCode : 'id',

    Object : {
        Save : 'Simpan'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Mengabaikan kalender resource'
    },

    InactiveColumn : {
        Inactive : 'Tidak aktif'
    },

    AddNewColumn : {
        'New Column' : 'Kolom baru'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Awal asli'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Akhir asli'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Durasi asli'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Awal penyimpangan'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Akhir penyimpangan'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Durasi penyimpangan'
    },

    CalendarColumn : {
        Calendar : 'Kalender'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Mulai Lebih Awal'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Akhiri Lebih Awal'
    },

    LateStartDateColumn : {
        'Late Start' : 'Mulai Lebih Akhir'
    },

    LateEndDateColumn : {
        'Late End' : 'Selesao Lebih Akhir'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Kelelahan total'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Tanggal Batasan'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Jenis Batasan'
    },

    DeadlineDateColumn : {
        Deadline : 'Tenggat Waktu'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Dependensi tidak valid'
    },

    DurationColumn : {
        Duration : 'Durasi'
    },

    EffortColumn : {
        Effort : 'Upaya'
    },

    EndDateColumn : {
        Finish : 'Selesaikan'
    },

    EventModeColumn : {
        'Event mode' : 'Mode acara',
        Manual       : 'Manual',
        Auto         : 'Otomatis'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Dijadwalkan secara manual'
    },

    MilestoneColumn : {
        Milestone : 'Tonggak pencapaian'
    },

    NameColumn : {
        Name : 'Nama'
    },

    NoteColumn : {
        Note : 'Catatan'
    },

    PercentDoneColumn : {
        '% Done' : '% Selesai'
    },

    PredecessorColumn : {
        Predecessors : 'Pendahulu'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Sumber daya yang ditugaskan',
        'more resources'     : 'sumber daya lainnya'
    },

    RollupColumn : {
        Rollup : 'Penggabungan'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Mode Penjadwalan'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Arah Penjadwalan',
        inheritedFrom       : 'Diwarisi dari',
        enforcedBy          : 'Dipaksakan oleh'
    },

    SequenceColumn : {
        Sequence : 'Urutan'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Tampilkan di linimasa'
    },

    StartDateColumn : {
        Start : 'Mulai'
    },

    SuccessorColumn : {
        Successors : 'Penerus'
    },

    TaskCopyPaste : {
        copyTask  : 'Salin',
        cutTask   : 'Potong',
        pasteTask : 'Tempel'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Menomori ulang'
    },

    DependencyField : {
        invalidDependencyFormat : 'Format dependensi tidak valid'
    },

    ProjectLines : {
        'Project Start' : 'Proyek dimulai',
        'Project End'   : 'Proyek berakhir'
    },

    TaskTooltip : {
        Start    : 'Mulai',
        End      : 'Berakhir',
        Duration : 'Durasi',
        Complete : 'Selesai'
    },

    AssignmentGrid : {
        Name     : 'Nama sumber daya',
        Units    : 'Unit',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Sunting',
        Indent                 : 'Indentasi',
        Outdent                : 'Outdentasi',
        'Convert to milestone' : 'Ubah ke Tonggak pencapaian',
        Add                    : 'Tambahkan...',
        'New task'             : 'Tugas baru',
        'New milestone'        : 'Tonggak pencapaian baru',
        'Task above'           : 'Tugas di atas',
        'Task below'           : 'Tugas di bawah',
        'Delete task'          : 'Hapus',
        Milestone              : 'Tonggak pencapaian',
        'Sub-task'             : 'Sub tugas',
        Successor              : 'Penerus',
        Predecessor            : 'Pendahulu',
        changeRejected         : 'Mesin penjadwalan menolak perubahan',
        linkTasks              : 'Tambahkan dependensi',
        unlinkTasks            : 'Hapus dependensi',
        color                  : 'Warna'
    },

    EventSegments : {
        splitTask : 'Bagi tugas'
    },

    Indicators : {
        earlyDates   : 'Dimulai/diakhiri lebih awal',
        lateDates    : 'Dimulai/diakhiri lebih akhir',
        Start        : 'Mulai',
        End          : 'Berakhir',
        deadlineDate : 'Tenggat Waktu'
    },

    Versions : {
        indented     : 'Indentasi',
        outdented    : 'Outdentasi',
        cut          : 'Memotong',
        pasted       : 'Menyalin',
        deletedTasks : 'Menghapus tugas'
    }
};

export default LocaleHelper.publishLocale(locale);
