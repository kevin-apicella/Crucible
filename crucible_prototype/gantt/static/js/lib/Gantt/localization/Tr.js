import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Tr.js';

const locale = {

    localeName : 'Tr',
    localeDesc : 'Türkçe',
    localeCode : 'tr',

    Object : {
        Save : 'Kaydet'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Kaynak takvimi yoksay'
    },

    InactiveColumn : {
        Inactive : 'Etkin olmayan'
    },

    AddNewColumn : {
        'New Column' : 'Yeni Sütun'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Orijinal Başlangıç'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Orijinal Bitiş'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Orijinal Süre'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Başlangıç varyansı'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Bitiş varyansı'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Süre Varyansı'
    },

    CalendarColumn : {
        Calendar : 'Takvim'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Erken Başlangıç'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Erken Bitiş'
    },

    LateStartDateColumn : {
        'Late Start' : 'Geç Başlangıç'
    },

    LateEndDateColumn : {
        'Late End' : 'Geç Bitiş'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Toplam Erteleme'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Kısıtlama Tarihi'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Kısıtlama Türü'
    },

    DeadlineDateColumn : {
        Deadline : 'Son tarihi'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Geçersiz bağımlılık'
    },

    DurationColumn : {
        Duration : 'Süre'
    },

    EffortColumn : {
        Effort : 'Sarfedilecek efor'
    },

    EndDateColumn : {
        Finish : 'Bitiş tarihi'
    },

    EventModeColumn : {
        'Event mode' : 'Etkinlik modu',
        Manual       : 'Manuel',
        Auto         : 'Otomatik'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuel planlanmış'
    },

    MilestoneColumn : {
        Milestone : 'Kilometre taşı'
    },

    NameColumn : {
        Name : 'Ad'
    },

    NoteColumn : {
        Note : 'Not'
    },

    PercentDoneColumn : {
        '% Done' : '% Tamamlandı'
    },

    PredecessorColumn : {
        Predecessors : 'Öncüller'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Atanmış Kaynaklar',
        'more resources'     : 'daha fazla kaynak'
    },

    RollupColumn : {
        Rollup : 'Toplama'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Planlama Modu'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Planlama yönü',
        inheritedFrom       : 'Miras alınan',
        enforcedBy          : 'Zorunlu olarak'
    },

    SequenceColumn : {
        Sequence : 'Dizi'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Zaman çizelgesinde göster'
    },

    StartDateColumn : {
        Start : 'Başlangıç tarihi'
    },

    SuccessorColumn : {
        Successors : 'Ardıllar'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopyala',
        cutTask   : 'Kes',
        pasteTask : 'Yapıştır'
    },

    WBSColumn : {
        WBS      : 'İKY',
        renumber : 'Yeniden numaralandır'
    },

    DependencyField : {
        invalidDependencyFormat : 'Geçersiz bağımlılık biçimi'
    },

    ProjectLines : {
        'Project Start' : 'Proje başlangıcı',
        'Project End'   : 'Proje bitişi'
    },

    TaskTooltip : {
        Start    : 'Başlangıç',
        End      : 'Bitiş',
        Duration : 'Süre',
        Complete : 'Tamamlandı'
    },

    AssignmentGrid : {
        Name     : 'Kaynak adı',
        Units    : 'Birimler',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Düzenle',
        Indent                 : 'Girintile',
        Outdent                : 'Çıkıntıla',
        'Convert to milestone' : 'Kilometre taşına dönüştür',
        Add                    : 'Ekle...',
        'New task'             : 'Yeni görev',
        'New milestone'        : 'Yeni kilometre taşı',
        'Task above'           : 'Yukarıdaki görev',
        'Task below'           : 'Aşağıdaki görev',
        'Delete task'          : 'Görevi sil',
        Milestone              : 'Kilometre taşı',
        'Sub-task'             : 'Alt görev',
        Successor              : 'Ardıl',
        Predecessor            : 'Öncül',
        changeRejected         : 'Planlama motoru değişiklikleri reddetti',
        linkTasks              : 'Bağımlılıkları ekleyin',
        unlinkTasks            : 'Bağımlılıkları kaldırın',
        color                  : 'Renk'
    },

    EventSegments : {
        splitTask : 'Görevleri böl'
    },

    Indicators : {
        earlyDates   : 'Erken başlangıç/bitiş tarihi',
        lateDates    : 'Geç başlangıç/bitiş tarihi',
        Start        : 'Başlangıç tarihi',
        End          : 'Bitiş tarihi',
        deadlineDate : 'Son gün'
    },

    Versions : {
        indented     : 'Girintili',
        outdented    : 'Çıkıntılı',
        cut          : 'Kes',
        pasted       : 'yapıştırıldı',
        deletedTasks : 'Görevler silindi'
    }
};

export default LocaleHelper.publishLocale(locale);
