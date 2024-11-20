import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Fi',
    localeDesc : 'Suomi',
    localeCode : 'fi',

    Object : {
        Yes    : 'Kyllä',
        No     : 'Ei',
        Cancel : 'Peruuta',
        Ok     : 'OK',
        Week   : 'Viikko',
        None   : 'Ei mitään'
    },

    ColorPicker : {
        noColor : 'Ei väriä'
    },

    Combo : {
        noResults          : 'Ei tuloksia',
        recordNotCommitted : 'Tietuetta ei voitu lisätä',
        addNewValue        : value => `Lisää ${value}`
    },

    FilePicker : {
        file : 'Tiedosto'
    },

    Field : {
        badInput              : 'Virheellinen kentän arvo',
        patternMismatch       : 'Arvon tulee vastata tiettyä mallia',
        rangeOverflow         : value => `Arvon tulee olla pienempi tai yhtä suuri kuin ${value.max}`,
        rangeUnderflow        : value => `Arvon tulee olla suurempi tai yhtä suuri kuin ${value.min}`,
        stepMismatch          : 'Arvon pitäisi sopia vaiheeseen',
        tooLong               : 'Arvon tulee olla lyhyempi',
        tooShort              : 'Arvon tulee olla pidempi',
        typeMismatch          : 'Arvon on oltava tietyssä muodossa',
        valueMissing          : 'Tämä kenttä on pakollinen',
        invalidValue          : 'Virheellinen kentän arvo',
        minimumValueViolation : 'Vähimmäisarvon ylitys',
        maximumValueViolation : 'Enimmäisarvon ylitys',
        fieldRequired         : 'Tämä kenttä on pakollinen',
        validateFilter        : 'Arvo pitää valita listasta'
    },

    DateField : {
        invalidDate : 'Virheellinen päivämäärän syöttö'
    },

    DatePicker : {
        gotoPrevYear  : 'Siirry edelliseen vuoteen',
        gotoPrevMonth : 'Siirry edelliseen kuukauteen',
        gotoNextMonth : 'Siirry seuraavaan kuukauteen',
        gotoNextYear  : 'Siirry seuraavaan vuoteen'
    },

    NumberFormat : {
        locale   : 'fi',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Virheellinen yksikkö'
    },

    TimeField : {
        invalidTime : 'Virheellinen aika'
    },

    TimePicker : {
        hour   : 'Tunti',
        minute : 'Minuutti',
        second : 'Sekunti'
    },

    List : {
        loading   : 'Lataa...',
        selectAll : 'Valitse kaikki'
    },

    GridBase : {
        loadMask : 'Lataa...',
        syncMask : 'Tallentaa muutoksia, odota hetki...'
    },

    PagingToolbar : {
        firstPage         : 'Siirry ensimmäiselle sivulle',
        prevPage          : 'Siirry edelliselle sivulle',
        page              : 'Sivu',
        nextPage          : 'Siirry seuraavalle sivulle',
        lastPage          : 'Siirry viimeiselle sivulle',
        reload            : 'Lataa nykyinen sivu uudelleen',
        noRecords         : 'Ei näytettäviä tietueita',
        pageCountTemplate : data => `/ ${data.lastPage}`,
        summaryTemplate   : data => `Näytetään tietueita ${data.start} - ${data.end} / ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Pienennä',
        Expand   : 'Laajenna'
    },

    Popup : {
        close : 'Sulje ponnahdusikkuna'
    },

    UndoRedo : {
        Undo           : 'Peruuta',
        Redo           : 'Tee uudelleen',
        UndoLastAction : 'Peruuta edellinen toiminto',
        RedoLastAction : 'Viimeisimmän tekemättömän toiminnon palauttaminen',
        NoActions      : 'Peruutusjonossa ei ole kohteita'
    },

    FieldFilterPicker : {
        equals                 : 'on sama',
        doesNotEqual           : 'ei ole sama',
        isEmpty                : 'on tyhjä',
        isNotEmpty             : 'ei ole tyhjä',
        contains               : 'sisältää',
        doesNotContain         : 'ei sisällä',
        startsWith             : 'alkaa',
        endsWith               : 'päättyy',
        isOneOf                : 'on yksi /',
        isNotOneOf             : 'ei ole yksi /',
        isGreaterThan          : 'on suurempi kuin',
        isLessThan             : 'on vähemmän kuin',
        isGreaterThanOrEqualTo : 'on suurempi tai yhtä suuri kuin',
        isLessThanOrEqualTo    : 'on pienempi tai yhtä suuri kuin',
        isBetween              : 'on välillä',
        isNotBetween           : 'ei ole välillä',
        isBefore               : 'on ennen',
        isAfter                : 'on jälkeen',
        isToday                : 'on tänään',
        isTomorrow             : 'on huomenna',
        isYesterday            : 'on eilinen',
        isThisWeek             : 'on tämä viikko',
        isNextWeek             : 'on seuraava viikko',
        isLastWeek             : 'on viimeinen viikko',
        isThisMonth            : 'on tämä kuukausi',
        isNextMonth            : 'on seuraava kuukausi',
        isLastMonth            : 'on edellinen kuukausi',
        isThisYear             : 'on tämä vuosi',
        isNextYear             : 'on seuraava vuosi',
        isLastYear             : 'on edellinen vuosi',
        isYearToDate           : 'on vuosi tähän päivään',
        isTrue                 : 'on tosi',
        isFalse                : 'on väärin',
        selectAProperty        : 'Valitse ominaisuus',
        selectAnOperator       : 'Valitse käyttäjä',
        caseSensitive          : 'Huomioi merkkikoko',
        and                    : 'ja',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Valitse arvo',
        selectOneOrMoreValues  : 'Valitse yksi tai useampi arvo',
        enterAValue            : 'Syötä arvo',
        enterANumber           : 'Syötä numero',
        selectADate            : 'Valitse päivämäärä',
        selectATime            : 'Valitse aika'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Lisää suodatin'
    },

    DateHelper : {
        locale         : 'fi',
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
            { single : 'millisekunti', plural : 'ms', abbrev : 'ms' },
            { single : 'sekunti', plural : 'sekunttia', abbrev : 's' },
            { single : 'minuutti', plural : 'minuuttia', abbrev : 'min' },
            { single : 'tunti', plural : 'tuntia', abbrev : 'h' },
            { single : 'päivä', plural : 'päivää', abbrev : 'p' },
            { single : 'viikko', plural : 'viikkoa', abbrev : 'vko' },
            { single : 'kuukausi', plural : 'kuukautta', abbrev : 'kk' },
            { single : 'kvartaali', plural : 'kvartaalia', abbrev : 'q' },
            { single : 'vuosi', plural : 'vuotta', abbrev : 'v' },
            { single : 'vuosikymmen', plural : 'vuosikymmen', abbrev : 'vuosikymmen' }
        ],
        unitAbbreviations : [
            ['mil'],
            ['s', 'sek'],
            ['min', 'min'],
            ['tunti', 'h'],
            ['d'],
            ['viikko', 'vko'],
            ['kuukausi', 'kuukausi', 'kk'],
            ['kvartaali', 'kvartaali', 'q'],
            ['vuosi', 'v'],
            ['vuosikymmen']
        ],
        parsers : {
            L   : 'D.M.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '.'
    }
};

export default LocaleHelper.publishLocale(locale);
