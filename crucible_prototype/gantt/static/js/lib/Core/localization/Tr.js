import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Tr',
    localeDesc : 'Türkçe',
    localeCode : 'tr',

    Object : {
        Yes    : 'Evet',
        No     : 'Hayır',
        Cancel : 'İptal et',
        Ok     : 'Tamam',
        Week   : 'Hafta',
        None   : 'Hiçbiri'
    },

    ColorPicker : {
        noColor : 'Renk yok'
    },

    Combo : {
        noResults          : 'Sonuç bulunamadı',
        recordNotCommitted : 'Kayıt eklenemedi',
        addNewValue        : value => `${value} ekle`
    },

    FilePicker : {
        file : 'Dosya'
    },

    Field : {
        badInput              : 'Geçersiz alan değeri',
        patternMismatch       : 'Değer, belirli bir düzenle eşleşmelidir',
        rangeOverflow         : value => `Değer, şundan küçük veya şuna eşit olmalıdır ${value.max}`,
        rangeUnderflow        : value => `Değer, şundan büyük veya şuna eşit olmalıdır ${value.min}`,
        stepMismatch          : 'Değer adıma uymalı',
        tooLong               : 'Değer daha kısa olmalı',
        tooShort              : 'Değer daha uzun olmalı',
        typeMismatch          : 'Değerin özel bir biçimde olması gerekmektedir',
        valueMissing          : 'Bu değer zorunludur',
        invalidValue          : 'Geçersiz alan değeri',
        minimumValueViolation : 'Minimum değer ihlali',
        maximumValueViolation : 'Maksimum değer ihlali',
        fieldRequired         : 'Bu alan zorunludur',
        validateFilter        : 'Değer listeden seçilmelidir'
    },

    DateField : {
        invalidDate : 'Geçersiz tarih girişi'
    },

    DatePicker : {
        gotoPrevYear  : 'Önceki yıla git',
        gotoPrevMonth : 'Önceki aya git',
        gotoNextMonth : 'Sonraki aya git',
        gotoNextYear  : 'Sonraki yıla git'
    },

    NumberFormat : {
        locale   : 'tr',
        currency : 'TRY'
    },

    DurationField : {
        invalidUnit : 'Geçersiz birim'
    },

    TimeField : {
        invalidTime : 'Geçersiz zaman girişi'
    },

    TimePicker : {
        hour   : 'Saat',
        minute : 'Dakika',
        second : 'Saniye'
    },

    List : {
        loading   : 'Yükleniyor...',
        selectAll : 'Tümünü Seç'
    },

    GridBase : {
        loadMask : 'Yükleniyor...',
        syncMask : 'Değişiklikler eşzamanlanıyor, lütfen bekleyin...'
    },

    PagingToolbar : {
        firstPage         : 'İlk sayfaya git',
        prevPage          : 'Önceki sayfaya git',
        page              : 'Sayfa',
        nextPage          : 'Sonraki sayfaya git',
        lastPage          : 'Son sayfaya git',
        reload            : 'Sayfayı yeniden yükle',
        noRecords         : 'Gösterilecek kayıt bulunamadı',
        pageCountTemplate : data => `nın ${data.lastPage}`,
        summaryTemplate   : data => `Kayıtlar görüntüleniyor ${data.start} - ${data.end} ‘nın ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Daralt',
        Expand   : 'Genişlet'
    },

    Popup : {
        close : 'Açılır pencereyi kapat'
    },

    UndoRedo : {
        Undo           : 'Geri al',
        Redo           : 'Yinele',
        UndoLastAction : 'Son eylemi geri al',
        RedoLastAction : 'Son geri alınan eylemi yinele',
        NoActions      : 'Geri alma kuyruğunda öğe yok'
    },

    FieldFilterPicker : {
        equals                 : 'eşittir',
        doesNotEqual           : 'eşit değildir',
        isEmpty                : 'boş',
        isNotEmpty             : 'boş değil',
        contains               : 'içerir',
        doesNotContain         : 'içermez',
        startsWith             : 'ile başlar',
        endsWith               : 'ile biter',
        isOneOf                : 'onlardan biri',
        isNotOneOf             : 'onlardan biri değil',
        isGreaterThan          : 'büyüktür',
        isLessThan             : 'küçüktür',
        isGreaterThanOrEqualTo : 'büyük ya da eşittir',
        isLessThanOrEqualTo    : 'küçük ya da eşittir',
        isBetween              : 'arasındadır',
        isNotBetween           : 'arasında değildir',
        isBefore               : 'öncedir',
        isAfter                : 'sonradır',
        isToday                : 'bugündür',
        isTomorrow             : 'yarındır',
        isYesterday            : 'dündür',
        isThisWeek             : 'bu haftadır',
        isNextWeek             : 'gelecek haftadır',
        isLastWeek             : 'geçen haftadır',
        isThisMonth            : 'bu aydır',
        isNextMonth            : 'gelecek aydır',
        isLastMonth            : 'geçen aydır',
        isThisYear             : 'bu yıldır',
        isNextYear             : 'gelecek yıldır',
        isLastYear             : 'geçen yıldır',
        isYearToDate           : 'yıl başından günümüze kadardır',
        isTrue                 : 'doğrudur',
        isFalse                : 'yanlıştır',
        selectAProperty        : 'Bir özellik seçin',
        selectAnOperator       : 'Bir işleç seçin',
        caseSensitive          : 'Büyük küçük harf duyarlı',
        and                    : 've',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Bir değer seçin',
        selectOneOrMoreValues  : 'Bir ya da daha fazla değer seçin',
        enterAValue            : 'Bir değer girin',
        enterANumber           : 'Bir sayı girin',
        selectADate            : 'Bir tarih seçin',
        selectATime            : 'Saat seç'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Filtre ekle'
    },

    DateHelper : {
        locale         : 'tr',
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
            { single : 'milisaniye', plural : 'ms', abbrev : 'ms' },
            { single : 'saniye', plural : 'saniye', abbrev : 'sn' },
            { single : 'dakika', plural : 'dakika', abbrev : 'dak.' },
            { single : 'saat', plural : 'saat', abbrev : 'sa' },
            { single : 'gün', plural : 'gün', abbrev : 'gün' },
            { single : 'hafta', plural : 'hafta', abbrev : 'hafta' },
            { single : 'ay', plural : 'ay', abbrev : 'ay' },
            { single : 'mevsim', plural : 'mevsim', abbrev : 'mevsim' },
            { single : 'yıl', plural : 'yıl', abbrev : 'yıl' },
            { single : 'onyıl', plural : 'onyıl', abbrev : 'onyıl' }
        ],
        unitAbbreviations : [
            ['ms'],
            ['sn', 'sn'],
            ['d', 'dak'],
            ['s', 'sa'],
            ['gün'],
            ['hft', 'hafta'],
            ['ay', 'ay'],
            ['mev', 'mevsim'],
            ['y', 'yıl'],
            ['onyıl']
        ],
        parsers : {
            L   : 'DD.MM.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {
            const suffix = { 1 : '-inci' }[number] || '.';
            return number + suffix;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
