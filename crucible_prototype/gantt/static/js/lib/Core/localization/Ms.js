import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Ms',
    localeDesc : 'Melayu',
    localeCode : 'ms',

    Object : {
        Yes    : 'Ya',
        No     : 'Tidak',
        Cancel : 'Batal',
        Ok     : 'OK',
        Week   : 'Minggu',
        None   : 'Tiada'
    },

    ColorPicker : {
        noColor : 'Tiada warna'
    },

    Combo : {
        noResults          : 'Tiada keputusan',
        recordNotCommitted : 'Rekod tidak boleh ditambah',
        addNewValue        : value => `Tambah ${value}`
    },

    FilePicker : {
        file : 'Fail'
    },

    Field : {
        badInput              : 'Nilai medan tak sah',
        patternMismatch       : 'Nilai harus sepadan dengan corak tertentu',
        rangeOverflow         : value => `Nilai mestilah kurang daripada atau sama dengan ${value.max}`,
        rangeUnderflow        : value => `Nilai mestilah lebih besar daripada atau sama dengan ${value.max}`,
        stepMismatch          : 'Nilai harus sesuai dengan langkah',
        tooLong               : 'Nilai harus lebih pendek',
        tooShort              : 'Nilai harus lebih panjang',
        typeMismatch          : 'Nilai diperlukan dalam format khas',
        valueMissing          : 'Medan ini diperlukan',
        invalidValue          : 'Nilai medan tak sah',
        minimumValueViolation : 'Pelanggaran nilai minimum',
        maximumValueViolation : 'Pelanggaran nilai maksimum',
        fieldRequired         : 'Medan ini diperlukan',
        validateFilter        : 'Nilai mesti dipilih daripada senarai'
    },

    DateField : {
        invalidDate : 'Input tarikh tidak sah'
    },

    DatePicker : {
        gotoPrevYear  : 'Pergi ke tahun sebelumnya',
        gotoPrevMonth : 'Pergi ke bulan sebelumnya',
        gotoNextMonth : 'Pergi ke bulan berikutnya',
        gotoNextYear  : 'Pergi ke tahun berikutnya'
    },

    NumberFormat : {
        locale   : 'ms',
        currency : 'MYR'
    },

    DurationField : {
        invalidUnit : 'Unit tak sah'
    },

    TimeField : {
        invalidTime : 'Input masa tak sah'
    },

    TimePicker : {
        hour   : 'Jam',
        minute : 'Minit',
        second : 'Saat'
    },

    List : {
        loading   : 'Memuatkan...',
        selectAll : 'Pilih Semua'
    },

    GridBase : {
        loadMask : 'Memuatkan...',
        syncMask : 'Menyimpan perubahan, sila tunggu...'
    },

    PagingToolbar : {
        firstPage         : 'Pergi ke halaman pertama',
        prevPage          : 'Pergi ke halaman sebelumnya',
        page              : 'Halaman',
        nextPage          : 'Pergi ke halaman berikutnya',
        lastPage          : 'Pergi ke halaman terakhir',
        reload            : 'Muat semula halaman semasa',
        noRecords         : 'Tiada rekod untuk dipaparkan',
        pageCountTemplate : data => `daripada ${data.lastPage}`,
        summaryTemplate   : data => `Memaparkan rekod ${data.start} - ${data.end} daripada ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Kecil',
        Expand   : 'Kembang'
    },

    Popup : {
        close : 'Tutup Pop Timbul'
    },

    UndoRedo : {
        Undo           : 'Buat Asal',
        Redo           : 'Buat Semula',
        UndoLastAction : 'Buat asal tindakan terakhir',
        RedoLastAction : 'Buat semula tindakan buat asal yang terakhir',
        NoActions      : 'Tiada item dalam baris gilir buat asal'
    },

    FieldFilterPicker : {
        equals                 : 'sama dengan',
        doesNotEqual           : 'tidak sama dengan',
        isEmpty                : 'kosong',
        isNotEmpty             : 'tidak kosong',
        contains               : 'mengandungi',
        doesNotContain         : 'tidak mengandungi',
        startsWith             : 'bermula dengan',
        endsWith               : 'berakhir dengan',
        isOneOf                : 'salah satu daripada',
        isNotOneOf             : 'bukan salah satu daripada',
        isGreaterThan          : 'lebih besar daripada',
        isLessThan             : 'kurang daripada',
        isGreaterThanOrEqualTo : 'lebih besar daripada atau sama dengan',
        isLessThanOrEqualTo    : 'kurang daripada atau sama dengan',
        isBetween              : 'antara',
        isNotBetween           : 'tidak antara',
        isBefore               : 'sebelum',
        isAfter                : 'selepas',
        isToday                : 'hari ini',
        isTomorrow             : 'esok',
        isYesterday            : 'semalam',
        isThisWeek             : 'minggu ini',
        isNextWeek             : 'minggu depan',
        isLastWeek             : 'minggu lepas',
        isThisMonth            : 'bulan ini',
        isNextMonth            : 'bulan depan',
        isLastMonth            : 'bulan lepas',
        isThisYear             : 'tahun ini',
        isNextYear             : 'tahun depan',
        isLastYear             : 'tahun lepas',
        isYearToDate           : 'tahun hingga kini',
        isTrue                 : 'betul',
        isFalse                : 'salah',
        selectAProperty        : 'Pilih properti',
        selectAnOperator       : 'Pilih operator',
        caseSensitive          : 'Sensitif huruf',
        and                    : 'dan',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Pilih nilai',
        selectOneOrMoreValues  : 'Pilih satu atau lebih nilai',
        enterAValue            : 'Masukkan nilai',
        enterANumber           : 'Masukka nombor',
        selectADate            : 'Pilih tarikh',
        selectATime            : 'Pilih masa'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Tambah penapis'
    },

    DateHelper : {
        locale         : 'ms',
        weekStartDay   : 1,
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : 'milisaat', plural : 'ms', abbrev : 'ms' },
            { single : 'saat', plural : 'saat', abbrev : 's' },
            { single : 'minit', plural : 'minit', abbrev : 'min' },
            { single : 'jam', plural : 'jam', abbrev : 'j' },
            { single : 'hari', plural : 'hari', abbrev : 'h' },
            { single : 'minggu', plural : 'minggu', abbrev : 'm' },
            { single : 'bulan', plural : 'bulan', abbrev : 'bul' },
            { single : 'sukutahun', plural : 'sukutahun', abbrev : 'st' },
            { single : 'tahun', plural : 'tahun', abbrev : 'th' },
            { single : 'dekad', plural : 'dekad', abbrev : 'dek' }
        ],
        unitAbbreviations : [
            ['mil'],
            ['s', 'saat'],
            ['m', 'min'],
            ['j', 'jam'],
            ['h'],
            ['m', 'mg'],
            ['b', 'bul', 'bln'],
            ['st', 'suku', 'skt'],
            ['t', 'th'],
            ['dek']
        ],
        parsers : {
            L   : 'DD-MM-YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => 'ke-' + number
    }
};

export default LocaleHelper.publishLocale(locale);
