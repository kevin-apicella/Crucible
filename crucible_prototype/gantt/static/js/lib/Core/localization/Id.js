import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Id',
    localeDesc : 'Bahasa Indonesia',
    localeCode : 'id',

    Object : {
        Yes    : 'Ya',
        No     : 'Tidak',
        Cancel : 'Batal',
        Ok     : 'OK',
        Week   : 'Minggu',
        None   : 'Tidak ada'
    },

    ColorPicker : {
        noColor : 'Tidak ada warna'
    },

    Combo : {
        noResults          : 'Tidak ada hasil',
        recordNotCommitted : 'Data tidak dapat ditambahkan',
        addNewValue        : value => `Tambahkan ${value}`
    },

    FilePicker : {
        file : 'File'
    },

    Field : {
        badInput              : 'Nilai bidang tidak valid',
        patternMismatch       : 'Nilai harus cocok dengan pola tertentu',
        rangeOverflow         : value => `Nilai harus kurang dari atau sama dengan ${value.max}`,
        rangeUnderflow        : value => `Nilai harus lebih besar atau sama dengan ${value.min}`,
        stepMismatch          : 'Nilai harus cocok dengan langkah',
        tooLong               : 'Nilai harus lebih singkat',
        tooShort              : 'Nilai harus lebih panjang',
        typeMismatch          : 'Nilai harus dalam format khusus',
        valueMissing          : 'Bidang ini wajib diisi',
        invalidValue          : 'Nilai bidang tidak valid',
        minimumValueViolation : 'Pelanggaran nilai minimum',
        maximumValueViolation : 'Pelanggaran nilai maksimum',
        fieldRequired         : 'Bidang ini wajib diisi',
        validateFilter        : 'Nilai harus dipilih dari daftar'
    },

    DateField : {
        invalidDate : 'Input data tidak valid'
    },

    DatePicker : {
        gotoPrevYear  : 'Buka tahun sebelumnya',
        gotoPrevMonth : 'Buka bulan sebelumnya',
        gotoNextMonth : 'Buka bulan berikutnya',
        gotoNextYear  : 'Buka tahun berikutnya'
    },

    NumberFormat : {
        locale   : 'id',
        currency : 'IDR'
    },

    DurationField : {
        invalidUnit : 'Unit tidak valid'
    },

    TimeField : {
        invalidTime : 'Input waktu tidak valid'
    },

    TimePicker : {
        hour   : 'Jam',
        minute : 'Menit',
        second : 'Detik'
    },

    List : {
        loading   : 'Memuat...',
        selectAll : 'Pilih Semua'
    },

    GridBase : {
        loadMask : 'Memuat...',
        syncMask : 'Menyimpan perubahan, mohon tunggu...'
    },

    PagingToolbar : {
        firstPage         : 'Buka halaman pertama',
        prevPage          : 'Buka halaman sebelumnya',
        page              : 'Halaman',
        nextPage          : 'Buka halaman berikutnya',
        lastPage          : 'Buka halaman terakhir',
        reload            : 'Muat ulang halaman saat ini',
        noRecords         : 'Tidak ada data untuk ditampilkan',
        pageCountTemplate : data => `dari ${data.lastPage}`,
        summaryTemplate   : data => `Menampilkan data ${data.start} - ${data.end} dari ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Ciutkan',
        Expand   : 'Perluas'
    },

    Popup : {
        close : 'Tutup Sembulan'
    },

    UndoRedo : {
        Undo           : 'Urungkan',
        Redo           : 'Ulangi',
        UndoLastAction : 'Urungkan tindakan terakhir',
        RedoLastAction : 'Ulangi tindakan terakhir yang diurungkan',
        NoActions      : 'Tidak ada item dalam antrean yang diurungkan'
    },

    FieldFilterPicker : {
        equals                 : 'sama dengan',
        doesNotEqual           : 'tidak sama dengan',
        isEmpty                : 'kosong',
        isNotEmpty             : 'tidak kosong',
        contains               : 'berisi',
        doesNotContain         : 'tidak berisi',
        startsWith             : 'diawali dengan',
        endsWith               : 'diakhiri dengan',
        isOneOf                : 'salah satu dari',
        isNotOneOf             : 'bukan salah satu dari',
        isGreaterThan          : 'lebih besar dari',
        isLessThan             : 'lebih kecil dari',
        isGreaterThanOrEqualTo : 'lebih besar dari atau sama dengan',
        isLessThanOrEqualTo    : 'lebih kecil dari atau sama dengan',
        isBetween              : 'antara',
        isNotBetween           : 'bukan antara',
        isBefore               : 'adalah sebelum',
        isAfter                : 'adalah setelah',
        isToday                : 'adalah hari ini',
        isTomorrow             : 'adalah besok',
        isYesterday            : 'adalah kemarin',
        isThisWeek             : 'adalah minggu ini',
        isNextWeek             : 'adalah minggu depan',
        isLastWeek             : 'adalah minggu lalu',
        isThisMonth            : 'adalah bulan ini',
        isNextMonth            : 'adalah bulan depan',
        isLastMonth            : 'adalah bulan lalu',
        isThisYear             : 'adalah tahun ini',
        isNextYear             : 'adalah tahun depan',
        isLastYear             : 'adalah tahun lalu',
        isYearToDate           : 'adalah tahun berjalan',
        isTrue                 : 'benar',
        isFalse                : 'salah',
        selectAProperty        : 'Pilih properti',
        selectAnOperator       : 'Pilih operator',
        caseSensitive          : 'Peka huruf besar/kecil',
        and                    : 'dan',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Pilih nilai',
        selectOneOrMoreValues  : 'Pilih satu nilai atau lebih',
        enterAValue            : 'Masukkan nilai',
        enterANumber           : 'Masukkan angka',
        selectADate            : 'Pilih tanggal',
        selectATime            : 'Pilih waktu'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Tambahkan filter'
    },

    DateHelper : {
        locale         : 'id',
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
            { single : 'milidetik', plural : 'md', abbrev : 'md' },
            { single : 'detik', plural : 'detik', abbrev : 'dtk' },
            { single : 'menit', plural : 'menit', abbrev : 'mnt' },
            { single : 'jam', plural : 'jam', abbrev : 'j' },
            { single : 'hari', plural : 'hari', abbrev : 'h' },
            { single : 'minggu', plural : 'minggu', abbrev : 'm' },
            { single : 'bulan', plural : 'bulan', abbrev : 'bln' },
            { single : 'triwulan', plural : 'triwulan', abbrev : 'tw' },
            { single : 'tahun', plural : 'tahun', abbrev : 'thn' },
            { single : 'dekade', plural : 'dekade', abbrev : 'dek' }
        ],
        unitAbbreviations : [
            ['md'],
            ['d', 'dtk'],
            ['m', 'mnt'],
            ['j', 'j'],
            ['h'],
            ['m', 'minggu'],
            ['b', 'bln', 'bulan'],
            ['tw', 'tri', 'triwulan'],
            ['t', 'thn'],
            ['dek']
        ],
        parsers : {
            L   : 'DD/MM/YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number
    }
};

export default LocaleHelper.publishLocale(locale);
