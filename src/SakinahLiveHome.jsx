import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Compass, BookOpen, Home, User, Bookmark, Share2, Languages,
  ChevronRight, ChevronLeft, Volume2, ArrowLeft, ArrowRight, Search, Sparkles,
  Play, Pause, Eye, EyeOff, Check, Bell, MapPin, Download, Grid3x3, RefreshCw, Navigation2
} from "lucide-react";

/* ════════════════════════════════════════════════════════════════
   DOMAIN: TOKENS  (design system primitives shared by every module)
════════════════════════════════════════════════════════════════ */
const COLOR = {
  ivory: "#F6F3EC", ink: "#10100F", lapis: "#173B57",
  gold: "#B59A62", goldDeep: "#8E7642", terracotta: "#A44D3C",
};
const EAST_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const nDigits = (s, lang) => (lang === "ar" ? String(s).replace(/[0-9]/g, (d) => EAST_DIGITS[d]) : String(s));
const parseHM = (s) => { const [h, m] = s.split(":").map(Number); return h + m / 60; };
const fmtHM = (h, lang) => {
  const hh = String(Math.floor(h)).padStart(2, "0"), mm = String(Math.round((h % 1) * 60)).padStart(2, "0");
  return nDigits(`${hh}:${mm}`, lang);
};

/* ════════════════════════════════════════════════════════════════
   DOMAIN: PRAYER ENGINE
   Separates calculated data from user preferences from UI state.
   Demo data — Muslim World League angles, standard Asr — until a
   verified astronomical source and device location are connected.
════════════════════════════════════════════════════════════════ */
const CALC_METHODS = ["Muslim World League", "ISNA", "Umm al-Qura", "Egyptian General Authority", "Karachi"];
const HIGH_LAT_RULES = { en: ["None", "Middle of the Night", "Angle-based"], ar: ["بدون", "منتصف الليل", "بحسب الزاوية"] };

const RAW = { fajr: "04:52", sunrise: "06:24", dhuhr: "13:08", asr: "16:47", maghrib: "19:42", isha: "21:05" };
const H = Object.fromEntries(Object.entries(RAW).map(([k, v]) => [k, parseHM(v)]));

const STAGES = [
  { id: "fajr", start: H.fajr, end: H.sunrise, dark: true, from: "#0B0C10", via: "#16283A", to: "#33566E" },
  { id: "morning", start: H.sunrise, end: 11.25, dark: false, from: "#F1E6C9", via: "#F5EFDF", to: "#F6F3EC" },
  { id: "dhuhr", start: 11.25, end: 15.25, dark: false, from: "#FAF8F2", via: "#F4F0E4", to: "#EEE6D1" },
  { id: "asr", start: 15.25, end: H.maghrib, dark: false, from: "#F5EEE0", via: "#EDDCC0", to: "#DFC4A1" },
  { id: "maghrib", start: H.maghrib, end: H.isha + 0.5, dark: true, from: "#D9A776", via: "#6B4438", to: "#1C0F12" },
  { id: "isha", start: H.isha + 0.5, end: H.fajr + 24, dark: true, from: "#100C15", via: "#141A2A", to: "#0B0910" },
];
function getStage(hour) {
  const hh = hour < H.fajr ? hour + 24 : hour;
  return STAGES.find((s) => hh >= s.start && hh < s.end) || STAGES[STAGES.length - 1];
}
const TIMELINE = [
  { id: "fajr", h: H.fajr }, { id: "sunrise", h: H.sunrise }, { id: "dhuhr", h: H.dhuhr },
  { id: "asr", h: H.asr }, { id: "maghrib", h: H.maghrib }, { id: "isha", h: H.isha },
];
const PRAYER_SEQ = [
  { id: "isha", h: H.isha - 24 }, { id: "fajr", h: H.fajr }, { id: "dhuhr", h: H.dhuhr },
  { id: "asr", h: H.asr }, { id: "maghrib", h: H.maghrib }, { id: "isha", h: H.isha }, { id: "fajr", h: H.fajr + 24 },
];
const PRAYER_ONLY = new Set(["fajr", "dhuhr", "asr", "maghrib", "isha"]);
const NAMES = {
  fajr: { en: "Fajr", ar: "الفجر" }, sunrise: { en: "Sunrise", ar: "الشروق" },
  dhuhr: { en: "Dhuhr", ar: "الظهر" }, asr: { en: "Asr", ar: "العصر" },
  maghrib: { en: "Maghrib", ar: "المغرب" }, isha: { en: "Isha", ar: "العشاء" },
};

/* ════════════════════════════════════════════════════════════════
   DOMAIN: QURAN
   Full verified verse text is loaded only for short, universally
   authenticated surahs. Everything else is real, correct metadata
   (surah number / name / verse count) with no fabricated body text —
   selecting one shows an honest "not connected" state.
════════════════════════════════════════════════════════════════ */
const V = (ar, en) => ({ ar, en });
const SURAHS = [
  { id: 1, ar: "الفاتحة", en: "Al-Fātiḥah", count: 7, verses: [
    V("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "In the name of Allah, the Most Compassionate, the Most Merciful."),
    V("الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "All praise belongs to Allah, Lord of all worlds."),
    V("الرَّحْمَٰنِ الرَّحِيمِ", "The Most Compassionate, the Most Merciful."),
    V("مَالِكِ يَوْمِ الدِّينِ", "Master of the Day of Judgment."),
    V("إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", "You alone we worship, and You alone we ask for help."),
    V("اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", "Guide us to the straight path —"),
    V("صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", "the path of those You have blessed, not of those who have earned anger, nor of those who have gone astray."),
  ]},
  { id: 108, ar: "الكوثر", en: "Al-Kawthar", count: 3, verses: [
    V("إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", "Indeed, We have granted you abundance."),
    V("فَصَلِّ لِرَبِّكَ وَانْحَرْ", "So pray to your Lord and sacrifice."),
    V("إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", "Indeed, your enemy is the one cut off."),
  ]},
  { id: 112, ar: "الإخلاص", en: "Al-Ikhlāṣ", count: 4, verses: [
    V("قُلْ هُوَ اللَّهُ أَحَدٌ", "Say, He is Allah, the One."),
    V("اللَّهُ الصَّمَدُ", "Allah, the Eternal Refuge."),
    V("لَمْ يَلِدْ وَلَمْ يُولَدْ", "He neither begets nor is born,"),
    V("وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", "nor is there anything comparable to Him."),
  ]},
  { id: 113, ar: "الفلق", en: "Al-Falaq", count: 5, verses: [
    V("قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", "Say, I seek refuge in the Lord of daybreak,"),
    V("مِن شَرِّ مَا خَلَقَ", "from the evil of what He created,"),
    V("وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", "from the evil of darkness when it settles,"),
    V("وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", "from the evil of those who blow on knots,"),
    V("وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", "and from the evil of an envier when he envies."),
  ]},
  { id: 114, ar: "الناس", en: "An-Nās", count: 6, verses: [
    V("قُلْ أَعُوذُ بِرَبِّ النَّاسِ", "Say, I seek refuge in the Lord of mankind,"),
    V("مَلِكِ النَّاسِ", "the King of mankind,"),
    V("إِلَٰهِ النَّاسِ", "the God of mankind,"),
    V("مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", "from the evil of the retreating whisperer,"),
    V("الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", "who whispers in the hearts of mankind,"),
    V("مِنَ الْجِنَّةِ وَالنَّاسِ", "from among jinn and mankind."),
  ]},
  // Correct real metadata; body text intentionally not loaded — see SourceTag.
  { id: 18, ar: "الكهف", en: "Al-Kahf", count: 110, verses: null },
  { id: 36, ar: "يس", en: "Yā-Sīn", count: 83, verses: null },
  { id: 55, ar: "الرحمن", en: "Ar-Raḥmān", count: 78, verses: null },
  { id: 67, ar: "الملك", en: "Al-Mulk", count: 30, verses: null },
  { id: 2, ar: "البقرة", en: "Al-Baqarah", count: 286, verses: null },
];
const surahById = (id) => SURAHS.find((s) => s.id === id);

const AYAT_AL_KURSI = V(
  "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
  "Allah — there is no god but Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness nor sleep overtakes Him. To Him belongs all that is in the heavens and the earth."
);

/* ════════════════════════════════════════════════════════════════
   DOMAIN: ADHKAR
   Only Qur'anic text (already verified above) is shown as loaded
   content. Prophetic-narration collections are marked as awaiting
   a connected, verified Hadith source rather than reproduced from
   memory — see brief §10/§21.
════════════════════════════════════════════════════════════════ */
const ADHKAR_LOADED = [
  { ar: AYAT_AL_KURSI.ar, en: AYAT_AL_KURSI.en, ref_en: "Qur'an 2:255 · Āyat al-Kursī", ref_ar: "القرآن ٢:٢٥٥ · آية الكرسي" },
  { ar: SURAHS.find(s=>s.id===112).verses.map(v=>v.ar).join(" "), en: "Say: He is Allah, the One — the Eternal Refuge, who neither begets nor is born, nor is there anything comparable to Him.", ref_en: "Qur'an 112 · Al-Ikhlāṣ", ref_ar: "القرآن ١١٢ · الإخلاص" },
  { ar: SURAHS.find(s=>s.id===113).verses.map(v=>v.ar).join(" "), en: "Say: I seek refuge in the Lord of daybreak, from the evil of what He created.", ref_en: "Qur'an 113 · Al-Falaq", ref_ar: "القرآن ١١٣ · الفلق" },
  { ar: SURAHS.find(s=>s.id===114).verses.map(v=>v.ar).join(" "), en: "Say: I seek refuge in the Lord of mankind, from the evil of the whisperer who withdraws.", ref_en: "Qur'an 114 · An-Nās", ref_ar: "القرآن ١١٤ · الناس" },
];
const ADHKAR_CATEGORIES = [
  { id: "morning", en: "Morning", ar: "الصباح", items: ADHKAR_LOADED },
  { id: "evening", en: "Evening", ar: "المساء", items: ADHKAR_LOADED },
  { id: "afterPrayer", en: "After prayer", ar: "بعد الصلاة", items: null },
  { id: "sleep", en: "Sleep", ar: "النوم", items: null },
  { id: "waking", en: "Waking", ar: "الاستيقاظ", items: null },
  { id: "travel", en: "Travel", ar: "السفر", items: null },
];

/* ════════════════════════════════════════════════════════════════
   DOMAIN: DISCOVER
════════════════════════════════════════════════════════════════ */
const DISCOVER_TOPICS = ["adhkar", "dua", "hadith", "seerah"];
const LIFE_TOPICS = ["ramadan", "hajj", "umrah", "zakat", "family"];

/* ════════════════════════════════════════════════════════════════
   DOMAIN: CONTEXT ENGINE + MOMENTS
   A Moment is a temporary contextual composition, not a push
   notification. Sakinah never infers a religious status (fasting,
   traveler ruling, Ramadan dates) from raw signals alone — Travel
   and Ramadan here are states the person explicitly declares, and
   are labeled as such; nothing is guessed from location or the
   calendar without a verified source.
════════════════════════════════════════════════════════════════ */
function primaryMoment({ isFriday, ramadanMode, travelMode }) {
  if (ramadanMode) return "ramadan";
  if (isFriday) return "friday";
  if (travelMode) return "travel";
  return null;
}

/* ════════════════════════════════════════════════════════════════
   DOMAIN: HAJJ / UMRAH COMPANION
   Real, uncontroversial rite sequence and one neutral factual line
   per stage. Detailed fiqh guidance is intentionally not authored
   here — see the Trust Layer note in each stage screen.
════════════════════════════════════════════════════════════════ */
const HAJJ_STAGES = [
  { id: "prep", en: "Preparation", ar: "الاستعداد", d_en: "Arranging travel, health and documentation before departure.", d_ar: "تنظيم السفر والصحة والوثائق قبل الرحيل." },
  { id: "ihram", en: "Iḥrām", ar: "الإحرام", d_en: "Entering the sacred state with intention and the prescribed garments.", d_ar: "الدخول في حالة الإحرام بالنية واللباس المخصوص." },
  { id: "arrival", en: "Arrival", ar: "الوصول", d_en: "Reaching Makkah and beginning the rites.", d_ar: "الوصول إلى مكة وبدء المناسك." },
  { id: "tawaf", en: "Ṭawāf", ar: "الطواف", d_en: "Circling the Kaaba seven times.", d_ar: "الطواف حول الكعبة سبعة أشواط." },
  { id: "sai", en: "Saʿy", ar: "السعي", d_en: "Walking between Ṣafā and Marwah seven times.", d_ar: "السعي بين الصفا والمروة سبعة أشواط." },
  { id: "mina", en: "Minā", ar: "منى", d_en: "Days spent at Minā during the Hajj days.", d_ar: "المكوث في منى أيام الحج." },
  { id: "arafat", en: "ʿArafāt", ar: "عرفة", d_en: "Standing at ʿArafāt, the central rite of Hajj.", d_ar: "الوقوف بعرفة، وهو ركن الحج الأعظم." },
  { id: "muzdalifah", en: "Muzdalifah", ar: "مزدلفة", d_en: "A night stop between ʿArafāt and Minā.", d_ar: "المبيت بمزدلفة بين عرفة ومنى." },
  { id: "jamarat", en: "Jamarāt", ar: "الجمرات", d_en: "The symbolic stoning at Minā.", d_ar: "رمي الجمرات في منى." },
  { id: "completion", en: "Completion", ar: "الإتمام", d_en: "Final rites and leaving the state of Iḥrām.", d_ar: "المناسك الختامية والتحلل من الإحرام." },
];
const UMRAH_STAGES = [
  { id: "prep", en: "Preparation", ar: "الاستعداد", d_en: "Arranging travel and intention before departure.", d_ar: "تنظيم السفر والنية قبل الرحيل." },
  { id: "ihram", en: "Iḥrām", ar: "الإحرام", d_en: "Entering the sacred state with intention and the prescribed garments.", d_ar: "الدخول في حالة الإحرام بالنية واللباس المخصوص." },
  { id: "miqat", en: "Mīqāt", ar: "الميقات", d_en: "The boundary point where Iḥrām begins.", d_ar: "الحدّ الذي يبدأ عنده الإحرام." },
  { id: "tawaf", en: "Ṭawāf", ar: "الطواف", d_en: "Circling the Kaaba seven times.", d_ar: "الطواف حول الكعبة سبعة أشواط." },
  { id: "sai", en: "Saʿy", ar: "السعي", d_en: "Walking between Ṣafā and Marwah seven times.", d_ar: "السعي بين الصفا والمروة سبعة أشواط." },
  { id: "completion", en: "Completion", ar: "الإتمام", d_en: "Final rites and leaving the state of Iḥrām.", d_ar: "المناسك الختامية والتحلل من الإحرام." },
];

/* ════════════════════════════════════════════════════════════════
   DOMAIN: STRINGS  (i18n — Arabic is the primary design language)
════════════════════════════════════════════════════════════════ */
const STRINGS = {
  en: {
    remaining: "remaining", today: "Today", quran: "Qur'an", prayer: "Prayer", discover: "Discover", me: "Me",
    continuing: "Continuing", fatiha: "Al-Fātiḥah",
    friday: "Friday", fridayLine: "It is Sunnah to read Sūrat Al-Kahf today.",
    evening: "Evening remembrance", eveningSub: "A short adhkār for Maghrib",
    night: "Before you sleep", nightSub: "Close the day with remembrance",
    verse: "Verse", juz: "Juz",
    tafsir: "Tafsir", translation: "Translation", related: "Related", memorize: "Memorize",
    save: "Save", saved2: "Saved", share: "Share", listen: "Listen", quranSource: "Qur'an · Al-Fātiḥah",
    sinceFajr: "since Fajr", calcMethod: "Calculation method", aligned: "Aligned",
    dragToAlign: "Turn to align with the Qibla",
    continueReading: "Continue reading", saved: "Saved", downloads: "Downloads", progress: "Qur'an progress",
    preferences: "Preferences", language: "Language", privacy: "Privacy",
    knowledge: "Knowledge", life: "Life",
    adhkar: "Adhkar", dua: "Du'a", hadith: "Hadith", seerah: "Seerah", names99: "Names of Allah",
    ramadan: "Ramadan", hajj: "Hajj", umrah: "Umrah", zakat: "Zakat", family: "Family",
    featuredDesc: "Ninety-nine names, held one at a time.",
    preview: "PREVIEW",
    quranHomeContinue: "Continue reading", surahs: "Surahs", listening: "Listening",
    searchPlaceholder: "Search Qur'an, Discover, Sakinah…",
    notConnected: "Full text not yet connected", notConnectedSub: "This surah's Mushaf source isn't loaded in this preview.",
    ayahOf: "of", needsReview: "Needs review", comfortable: "Comfortable", reveal: "Reveal", hideText: "Hide",
    repeat: "Repeat", memorizeEmpty: "Choose a surah with loaded text to begin.",
    noAudio: "Recitation source not connected — preview only.", speed: "Speed", sleepTimer: "Sleep timer", off: "Off",
    tone1: "Warm", tone2: "Measured", tone3: "Bright",
    afterPrayerLbl: "After prayer", sleepLbl: "Sleep", wakingLbl: "Waking", travelLbl: "Travel",
    itemsAvailable: (n) => `${n} verified item${n === 1 ? "" : "s"}`, awaitingSource: "Awaiting a verified source",
    prayerSettings: "Prayer calculation", asrMethod: "Asr method", standard: "Standard", hanafi: "Hanafi",
    highLatRule: "High-latitude rule", locationMode: "Location", automatic: "Automatic", manual: "Manual",
    useMyLocation: "Use my location", locUnknown: "Not checked yet", locGranted: "Location available",
    locDenied: "Permission denied", locChecking: "Checking…", minuteAdjust: "Minute adjustments",
    accessibility: "Accessibility", quranTextSize: "Qur'an text size", uiTextSize: "Interface text size",
    highContrast: "High contrast", simplifiedMode: "Simplified mode",
    localData: "Local data", account: "Account", accountSub: "Not connected — Sakinah works fully without one.",
    exportData: "Export my data", deleteData: "Delete local data", exported: "Prepared for export.", deleted: "Local data cleared.",
    offlineCore: "Works offline", offlineOnline: "Needs a connection",
    offlineCoreList: "Qur'an text · reading progress · prayer calculation · Qibla · Adhkar",
    offlineOnlineList: "Recitation audio · Tafsir sources · cloud sync",
    notifications: "Notifications",
    notifPrayer: "Prayer", notifContinue: "Qur'an continuation", notifMorning: "Morning adhkār",
    notifEvening: "Evening adhkār", notifFriday: "Friday reminder", notifDownloads: "Downloaded content",
    widgets: "Widgets", widgetPrayer: "Prayer", widgetArc: "Day Light Arc", widgetQuran: "Qur'an",
    conceptPreview: "Concept preview", searchResultsQuran: "Qur'an", searchResultsDiscover: "Discover",
    searchResultsApp: "Sakinah", noResults: "Nothing found.",
    compassMode: "Compass", simulationMode: "Simulation", enableCompass: "Use device compass",
    calibrating: "Calibrating…", qiblaShort: "Qibla",
    ramadanMoment: "Ramadan", ramadanNote: "Declared by you — not detected automatically.",
    suhoorEnds: "Suhoor ends", iftar: "Iftar", fastingDay: "A day of fasting",
    travelMoment: "Travelling", travelNote: "You've marked yourself as travelling.",
    travelToggle: "Travel mode", ramadanToggle: "Ramadan mode (demo)",
    exploreAyah: "Explore this āyah", trustQuran: "QUR'AN", trustTranslation: "TRANSLATION",
    trustTafsir: "TAFSIR", trustRelated: "RELATED VERSES", trustRoot: "ARABIC ROOT",
    sourceNotConnected: "Not yet connected to a verified source.",
    hajj: "Hajj", umrah: "Umrah", stages: "Stages", guidanceNote: "Detailed guidance and Duʿā sources are not yet connected — this shows the guided structure only.",
    family: "Family", familyNote: "Private by default. Nothing here is shared automatically, and no worship activity is ever compared between family members.",
    familyEmpty: "Not connected yet.",
    simpleModeOn: "Simple mode is on", simpleModeNote: "Showing only Prayer, Qur'an and Adhkar.",
    privLocation: "Location", privNotif: "Notifications", privHistory: "Local history", privCloud: "Cloud sync",
    privFamily: "Family data", privAI: "On-device processing", privDownloads: "Downloaded data",
    why: "Why", where: "Where", what: "What", howDelete: "Delete",
    askPlaceholder: "Ask Sakinah — try \"Qibla\" or a surah name",
    appAction: "SAKINAH",
  },
  ar: {
    remaining: "متبقٍ", today: "اليوم", quran: "القرآن", prayer: "الصلاة", discover: "استكشف", me: "أنا",
    continuing: "متابعة", fatiha: "الفاتحة",
    friday: "الجمعة", fridayLine: "من السنّة قراءة سورة الكهف اليوم.",
    evening: "ذكر المساء", eveningSub: "أذكار قصيرة عند المغرب",
    night: "قبل النوم", nightSub: "اختم يومك بالذكر",
    verse: "آية", juz: "الجزء",
    tafsir: "تفسير", translation: "ترجمة", related: "آيات ذات صلة", memorize: "حفظ",
    save: "حفظ", saved2: "محفوظة", share: "مشاركة", listen: "استماع", quranSource: "القرآن الكريم · الفاتحة",
    sinceFajr: "منذ الفجر", calcMethod: "طريقة الحساب", aligned: "محاذٍ",
    dragToAlign: "أدر لمحاذاة القبلة",
    continueReading: "متابعة القراءة", saved: "المحفوظات", downloads: "التنزيلات", progress: "تقدّم القرآن",
    preferences: "التفضيلات", language: "اللغة", privacy: "الخصوصية",
    knowledge: "المعرفة", life: "الحياة",
    adhkar: "الأذكار", dua: "الدعاء", hadith: "الحديث", seerah: "السيرة", names99: "أسماء الله الحسنى",
    ramadan: "رمضان", hajj: "الحج", umrah: "العمرة", zakat: "الزكاة", family: "الأسرة",
    featuredDesc: "تسعة وتسعون اسمًا، اسمًا في كل مرة.",
    preview: "معاينة",
    quranHomeContinue: "متابعة القراءة", surahs: "السور", listening: "الاستماع",
    searchPlaceholder: "ابحث في القرآن، استكشف، سكينة…",
    notConnected: "النص الكامل غير متصل بعد", notConnectedSub: "مصحف هذه السورة غير محمّل في هذه المعاينة.",
    ayahOf: "من", needsReview: "تحتاج مراجعة", comfortable: "مطمئنّة", reveal: "إظهار", hideText: "إخفاء",
    repeat: "تكرار", memorizeEmpty: "اختر سورة محمّلة النص لتبدأ.",
    noAudio: "مصدر التلاوة غير متصل — معاينة فقط.", speed: "السرعة", sleepTimer: "مؤقت النوم", off: "إيقاف",
    tone1: "دافئ", tone2: "متزن", tone3: "مشرق",
    afterPrayerLbl: "بعد الصلاة", sleepLbl: "النوم", wakingLbl: "الاستيقاظ", travelLbl: "السفر",
    itemsAvailable: (n) => `${nDigits(n, "ar")} عناصر موثّقة`, awaitingSource: "بانتظار مصدر موثّق",
    prayerSettings: "حساب أوقات الصلاة", asrMethod: "طريقة العصر", standard: "الجمهور", hanafi: "الحنفي",
    highLatRule: "قاعدة خطوط العرض العليا", locationMode: "الموقع", automatic: "تلقائي", manual: "يدوي",
    useMyLocation: "استخدام موقعي", locUnknown: "لم يُفحص بعد", locGranted: "الموقع متاح",
    locDenied: "تم رفض الإذن", locChecking: "جارٍ الفحص…", minuteAdjust: "تعديلات بالدقائق",
    accessibility: "إمكانية الوصول", quranTextSize: "حجم نص القرآن", uiTextSize: "حجم نص الواجهة",
    highContrast: "تباين عالٍ", simplifiedMode: "الوضع المبسّط",
    localData: "البيانات المحلية", account: "الحساب", accountSub: "غير متصل — سكينة تعمل كاملة بدونه.",
    exportData: "تصدير بياناتي", deleteData: "حذف البيانات المحلية", exported: "جُهّزت للتصدير.", deleted: "تم مسح البيانات المحلية.",
    offlineCore: "يعمل بدون اتصال", offlineOnline: "يحتاج اتصالاً",
    offlineCoreList: "نص القرآن · تقدّم القراءة · حساب الصلاة · القبلة · الأذكار",
    offlineOnlineList: "تلاوة الصوت · مصادر التفسير · المزامنة السحابية",
    notifications: "الإشعارات",
    notifPrayer: "الصلاة", notifContinue: "متابعة القرآن", notifMorning: "أذكار الصباح",
    notifEvening: "أذكار المساء", notifFriday: "تذكير الجمعة", notifDownloads: "المحتوى المنزّل",
    widgets: "الودجت", widgetPrayer: "الصلاة", widgetArc: "قوس الضوء اليومي", widgetQuran: "القرآن",
    conceptPreview: "معاينة مفهوم", searchResultsQuran: "القرآن", searchResultsDiscover: "استكشف",
    searchResultsApp: "سكينة", noResults: "لا نتائج.",
    compassMode: "البوصلة", simulationMode: "محاكاة", enableCompass: "استخدام بوصلة الجهاز",
    calibrating: "جارٍ المعايرة…", qiblaShort: "القبلة",
    ramadanMoment: "رمضان", ramadanNote: "أنت من فعّلته — لا يُكتشف تلقائيًا.",
    suhoorEnds: "ينتهي السحور", iftar: "الإفطار", fastingDay: "يوم صيام",
    travelMoment: "مسافر", travelNote: "لقد فعّلت وضع السفر بنفسك.",
    travelToggle: "وضع السفر", ramadanToggle: "وضع رمضان (تجريبي)",
    exploreAyah: "استكشاف هذه الآية", trustQuran: "القرآن", trustTranslation: "الترجمة",
    trustTafsir: "التفسير", trustRelated: "آيات ذات صلة", trustRoot: "الجذر العربي",
    sourceNotConnected: "غير متصل بمصدر موثّق بعد.",
    hajj: "الحج", umrah: "العمرة", stages: "المراحل", guidanceNote: "الإرشادات التفصيلية ومصادر الدعاء غير متصلة بعد — هذا يعرض الهيكل الإرشادي فقط.",
    family: "الأسرة", familyNote: "خاص افتراضيًا. لا شيء هنا يُشارك تلقائيًا، ولا تُقارن العبادة بين أفراد الأسرة إطلاقًا.",
    familyEmpty: "غير متصل بعد.",
    simpleModeOn: "الوضع المبسّط مفعّل", simpleModeNote: "يعرض فقط الصلاة والقرآن والأذكار.",
    privLocation: "الموقع", privNotif: "الإشعارات", privHistory: "السجل المحلي", privCloud: "المزامنة السحابية",
    privFamily: "بيانات الأسرة", privAI: "المعالجة على الجهاز", privDownloads: "البيانات المنزّلة",
    why: "لماذا", where: "أين", what: "ماذا", howDelete: "حذف",
    askPlaceholder: "اسأل سكينة — جرّب \"القبلة\" أو اسم سورة",
    appAction: "سكينة",
  },
};

/* ════════════════════════════════════════════════════════════════
   GLOBAL STYLE
════════════════════════════════════════════════════════════════ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,340..460&family=Inter:wght@400;500;600&family=Amiri+Quran&family=Aref+Ruqaa:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap');
    .sakinah-root { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; font-variant-numeric: proportional-nums; }
    .sakinah-root[dir="rtl"] { font-family: 'IBM Plex Sans Arabic', sans-serif; }
    .sakinah-root * { box-sizing: border-box; }
    .sakinah-root button { font-family: inherit; }
    .sakinah-root button:focus-visible, .sakinah-root [tabindex]:focus-visible, .sakinah-root input:focus-visible {
      outline: 1.5px solid #B59A62; outline-offset: 3px; border-radius: 3px;
    }
    @media (prefers-reduced-motion: reduce) {
      .sakinah-root * { animation-duration: .001ms !important; transition-duration: .001ms !important; }
    }
    .font-editorial { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
    [dir="rtl"] .font-editorial { font-family: 'Aref Ruqaa', serif; }
    .font-quran { font-family: 'Amiri Quran', serif; }
    .sk-scroll::-webkit-scrollbar { display: none; }
    .sk-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes sk-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    .sk-in { animation: sk-in .7s cubic-bezier(.22,.61,.36,1) both; }
    @keyframes sk-breathe { 0%,100% { opacity: .75; } 50% { opacity: 1; } }
    .sk-breathe { animation: sk-breathe 6s ease-in-out infinite; }
    .sk-rail-enter { animation: sk-rail-in .42s cubic-bezier(.22,.61,.36,1) both; }
    @keyframes sk-rail-in { from { transform: translateY(14px); opacity:.4; } to { transform: translateY(0); opacity:1; } }
    .sk-mono { font-family: 'IBM Plex Sans Arabic', 'Inter', monospace; letter-spacing: .12em; }
    input[type=range].sk-slider { -webkit-appearance: none; height: 2px; background: rgba(16,16,15,0.18); border-radius: 2px; }
    input[type=range].sk-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 13px; height: 13px; border-radius: 50%; background: #B59A62; cursor: pointer; }
    .sk-switch { width: 34px; height: 20px; border-radius: 20px; position: relative; cursor: pointer; transition: background .3s ease; flex-shrink: 0; }
    .sk-switch i { position: absolute; top: 2px; width: 16px; height: 16px; border-radius: 50%; background: #F6F3EC; transition: transform .3s cubic-bezier(.22,.61,.36,1); }
  `}</style>
);

/* small helpers */
const Row = ({ label, sub, onClick, right, big, first, lang }) => (
  <button onClick={onClick} style={{
    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
    background: "none", border: "none", borderTop: first ? "none" : "1px solid rgba(16,16,15,0.08)",
    padding: big ? "16px 0" : "13px 0", cursor: onClick ? "pointer" : "default", textAlign: lang === "ar" ? "right" : "left",
    color: COLOR.ink,
  }}>
    <span>
      <div style={{ fontSize: big ? 15.5 : 14, fontWeight: big ? 600 : 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11.5, opacity: 0.48, marginTop: 3 }}>{sub}</div>}
    </span>
    {right !== undefined ? right : (onClick ? (lang === "ar" ? <ChevronLeft size={15} opacity={0.35} /> : <ChevronRight size={15} opacity={0.35} />) : null)}
  </button>
);
const Switch = ({ on, onChange }) => (
  <div className="sk-switch" onClick={onChange} style={{ background: on ? COLOR.gold : "rgba(16,16,15,0.15)" }}>
    <i style={{ transform: `translateX(${on ? 16 : 2}px)` }} />
  </div>
);
const BackBtn = ({ onClick, lang }) => (
  <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.6, padding: 10, margin: -10 }}>
    {lang === "ar" ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
  </button>
);
const SourceTag = ({ lang, item, muted }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, opacity: muted ? 0.35 : 0.5 }}>
    <span style={{ width: 3.5, height: 3.5, borderRadius: "50%", background: COLOR.gold, display: "inline-block" }} />
    {lang === "ar" ? item.ref_ar : item.ref_en}
  </div>
);

/* ════════════════════════════════════════════════════════════════
   DAY LIGHT ARC — signature system
════════════════════════════════════════════════════════════════ */
function DayArc({ hourNow, lang, compact, onScrub, isDark, prayerTimes = H }) {
  const t = STRINGS[lang];
  const svgRef = useRef(null);
  const arcId = useMemo(() => `sunArc-${Math.random().toString(36).slice(2)}`, []);
  const start = prayerTimes.fajr, end = prayerTimes.isha;
  const span = Math.max(0.01, end - start);
  const progress = Math.max(0, Math.min(1, (hourNow - start) / span));
  const point = (u) => {
    const x = 18 + 304 * u;
    const y = (1 - u) ** 3 * 86 + 3 * (1 - u) ** 2 * u * 10 + 3 * (1 - u) * u ** 2 * 10 + u ** 3 * 86;
    return { x, y };
  };
  const fullPath = "M 18 86 C 95 10 245 10 322 86";
  const completedPath = useMemo(() => {
    if (progress <= 0) return "M 18 86";
    const steps = Math.max(2, Math.ceil(progress * 44));
    return Array.from({ length: steps + 1 }, (_, i) => {
      const p = point((progress * i) / steps);
      return `${i ? "L" : "M"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    }).join(" ");
  }, [progress]);
  const sun = point(progress);
  const events = TIMELINE.map((ev) => ({ ...ev, fraction: Math.max(0, Math.min(1, (ev.h - start) / span)) }));
  const scrub = (clientX) => {
    if (!onScrub || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onScrub(start + fraction * span);
  };
  const nowH = hourNow;
  const sinceFajr = Math.max(0, hourNow - start);
  const sfH = Math.floor(sinceFajr), sfM = Math.round((sinceFajr % 1) * 60);
  const height = compact ? 96 : 110;
  return (
    <div style={{ width: "100%" }}>
      <svg ref={svgRef} viewBox="0 0 340 110" width="100%" height={height} preserveAspectRatio="xMidYMid meet"
        style={{ display: "block", cursor: onScrub ? "ew-resize" : "default", touchAction: "none", overflow: "visible" }}
        onPointerDown={(e) => { if (!onScrub) return; e.currentTarget.setPointerCapture(e.pointerId); scrub(e.clientX); }}
        onPointerMove={(e) => { if (!onScrub || e.buttons !== 1) return; scrub(e.clientX); }}>
        <defs>
          <linearGradient id={`${arcId}-stroke`} x1="18" y1="0" x2="322" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#d9b47c" stopOpacity="0.15" /><stop offset="1" stopColor="#f7e3ba" /></linearGradient>
          <linearGradient id={`${arcId}-fill`} x1="0" y1="10" x2="0" y2="86" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#f0d5a4" stopOpacity="0.18" /><stop offset="1" stopColor="#f0d5a4" stopOpacity="0" /></linearGradient>
          <radialGradient id={`${arcId}-halo`} cx="50%" cy="50%"><stop offset="0" stopColor="#fdf1d6" stopOpacity="0.58" /><stop offset="1" stopColor="#fdf1d6" stopOpacity="0" /></radialGradient>
        </defs>
        <line x1="18" y1="86" x2="322" y2="86" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
        <path d={fullPath} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="1.2" strokeDasharray="1 5" strokeLinecap="round" />
        {progress > 0 && <path d={`${completedPath} L ${sun.x.toFixed(2)} 86 L 18 86 Z`} fill={`url(#${arcId}-fill)`} />}
        {progress > 0 && <path d={completedPath} fill="none" stroke={`url(#${arcId}-stroke)`} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />}
        {events.map((ev) => {
          const p = point(ev.fraction);
          const passed = ev.h <= nowH;
          return passed
            ? <circle key={ev.id} cx={p.x} cy={p.y} r="3.5" fill={isDark ? "#211a18" : "#5b4636"} stroke="#d9b47c" strokeWidth="1.15" />
            : <circle key={ev.id} cx={p.x} cy={p.y} r="2.15" fill="rgba(255,255,255,.32)" />;
        })}
        <circle cx={sun.x} cy={sun.y} r="22" fill={`url(#${arcId}-halo)`} className="sk-breathe" />
        <circle cx={sun.x} cy={sun.y} r="7.5" fill="#fdf1d6" stroke="#fff" strokeWidth="1.5" />
      </svg>
      {!compact && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7, padding: "0 2px" }}>
            {events.filter((ev) => PRAYER_ONLY.has(ev.id)).map((ev) => {
              const passed = ev.h <= nowH;
              const isNext = !passed && !events.some((other) => PRAYER_ONLY.has(other.id) && other.h > nowH && other.h < ev.h);
              return <div key={ev.id} style={{ textAlign: "center", flex: 1, fontSize: 10.5, fontWeight: isNext ? 600 : 500, opacity: passed ? 0.36 : isNext ? 1 : 0.62, color: isNext ? COLOR.gold : "inherit", transition: "opacity .6s ease" }}>{NAMES[ev.id][lang]}</div>;
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 14, fontSize: 11, opacity: 0.42 }}>{nDigits(sfH, lang)}{lang === "ar" ? " س " : "h "}{nDigits(String(sfM).padStart(2, "0"), lang)}{lang === "ar" ? " د " : "m "}{t.sinceFajr}</div>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   NAV DOCK
════════════════════════════════════════════════════════════════ */
function NavDock({ world, go, lang, isDark, nextPrayer, fraction, simple }) {
  const t = STRINGS[lang];
  const fg = isDark ? COLOR.ivory : COLOR.ink;
  if (simple) {
    const simpleItems = [
      { id: "prayer", label: t.prayer, icon: Compass },
      { id: "quran-home", label: t.quran, icon: BookOpen },
      { id: "adhkar-home", label: t.adhkar, icon: Sparkles },
    ];
    const activeSimple = ["prayer"].includes(world) ? "prayer" : ["quran-home","surah-list","reader","memorize","audio"].includes(world) ? "quran-home" : ["adhkar-home","adhkar-cat"].includes(world) ? "adhkar-home" : "";
    return (
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 16, display: "flex", justifyContent: "center", zIndex: 30 }}>
        <div style={{ display: "flex", gap: 6, background: isDark ? "rgba(16,16,15,0.55)" : "rgba(246,243,236,0.75)", backdropFilter: "blur(10px)", borderRadius: 20, padding: "10px" }}>
          {simpleItems.map((it) => {
            const active = activeSimple === it.id;
            return (
              <button key={it.id} onClick={() => go(it.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 22px", border: "none", borderRadius: 14, cursor: "pointer", background: active ? (isDark ? "rgba(255,255,255,0.12)" : "rgba(16,16,15,0.07)") : "none", color: fg }}>
                <it.icon size={22} strokeWidth={1.6} opacity={active ? 1 : 0.55} />
                <span style={{ fontSize: 12, fontWeight: active ? 600 : 500, opacity: active ? 1 : 0.6 }}>{it.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  const top = world === "today" ? "today"
    : ["quran-home", "surah-list", "reader", "memorize", "audio"].includes(world) ? "quran-home"
    : world === "prayer" ? "prayer"
    : ["discover", "adhkar-home", "adhkar-cat"].includes(world) ? "discover"
    : world.startsWith("me") ? "me"
    : "";
  const items = [
    { id: "today", label: t.today, icon: Home },
    { id: "quran-home", label: t.quran, icon: BookOpen },
    { id: "prayer", label: null, icon: null, center: true },
    { id: "discover", label: t.discover, icon: Search },
    { id: "me", label: t.me, icon: User },
  ];
  const r = 15, c = 17, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 16, display: "flex", justifyContent: "center", zIndex: 30, pointerEvents: "none" }}>
      <div style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: 2, background: isDark ? "rgba(16,16,15,0.55)" : "rgba(246,243,236,0.68)", backdropFilter: "blur(10px)", borderTop: `1px solid ${isDark ? "rgba(246,243,236,0.14)" : "rgba(16,16,15,0.09)"}`, borderRadius: 20, padding: "9px 8px" }}>
        {items.map((it) => {
          if (it.center) {
            const active = world === "prayer";
            return (
              <button key="prayer" onClick={() => go("prayer")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, padding: "4px 16px", border: "none", background: "none", cursor: "pointer", color: fg }}>
                <div style={{ position: "relative", width: c * 2, height: c * 2 }}>
                  <svg width={c * 2} height={c * 2} style={{ position: "absolute", inset: 0 }}>
                    <circle cx={c} cy={c} r={r} fill="none" stroke={isDark ? "rgba(246,243,236,0.16)" : "rgba(16,16,15,0.12)"} strokeWidth="1.4" />
                    <circle cx={c} cy={c} r={r} fill="none" stroke={COLOR.gold} strokeWidth="1.4" strokeDasharray={circ} strokeDashoffset={circ * (1 - fraction)} strokeLinecap="round" transform={`rotate(-90 ${c} ${c})`} style={{ transition: "stroke-dashoffset 1s ease" }} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Compass size={14} strokeWidth={1.6} opacity={active ? 1 : 0.75} /></div>
                </div>
                <span style={{ fontSize: 9, fontWeight: active ? 600 : 500, opacity: active ? 1 : 0.68, whiteSpace: "nowrap" }}>{NAMES[nextPrayer.id][lang]} · {nextPrayer.hhmm}</span>
              </button>
            );
          }
          const Icon = it.icon, active = top === it.id;
          return (
            <button key={it.id} onClick={() => go(it.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "9px 15px", border: "none", background: "none", cursor: "pointer", color: fg, opacity: active ? 1 : 0.5 }}>
              <Icon size={16} strokeWidth={1.6} />
              <span style={{ fontSize: 9, fontWeight: active ? 600 : 500, borderBottom: active ? `1.4px solid ${COLOR.gold}` : "1.4px solid transparent", paddingBottom: 2 }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   TODAY
════════════════════════════════════════════════════════════════ */
function TodayScreen({ lang, stage, hourNow, nextPrayer, remH, remM, moment, go, onScrub, lastRead, qiblaDeg, prayerTimes }) {
  const [showTimePreview, setShowTimePreview] = useState(false);
  useEffect(() => {
    if (!showTimePreview) return;
    const close = setTimeout(() => setShowTimePreview(false), 5000);
    return () => clearTimeout(close);
  }, [showTimePreview]);
  const active = [...PRAYER_ONLY].map((id) => ({ id, h: prayerTimes[id] })).filter((x) => x.h <= hourNow).at(-1)?.id || "isha";
  const warmStops = [
    { h: 0, c: ["#14213d", "#101a31", "#0b1121"] },
    { h: prayerTimes.fajr, c: ["#315d86", "#7da8c3", "#d6e0dc"] },
    { h: prayerTimes.sunrise, c: ["#79a7c2", "#d8c6a5", "#edcf9c"] },
    { h: prayerTimes.dhuhr, c: ["#fbf6ea", "#eee1c7", "#dac7a8"] },
    { h: prayerTimes.asr, c: ["#f5e4cc", "#d7aa7c", "#a9785d"] },
    { h: prayerTimes.maghrib, c: ["#df9c77", "#945765", "#4a3148"] },
    { h: prayerTimes.isha, c: ["#24375a", "#172443", "#10172d"] },
    { h: 24, c: ["#14213d", "#101a31", "#0b1121"] },
  ];
  const mixWarm = (from, to, amount) => {
    const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const a = rgb(from), b = rgb(to);
    return `#${a.map((v, i) => Math.round(v + (b[i] - v) * amount).toString(16).padStart(2, "0")).join("")}`;
  };
  const warmSky = (() => {
    const position = Math.max(0, Math.min(23.999, hourNow));
    const index = warmStops.findIndex((stop, i) => i < warmStops.length - 1 && position >= stop.h && position < warmStops[i + 1].h);
    const i = index < 0 ? warmStops.length - 2 : index;
    const first = warmStops[i], second = warmStops[i + 1];
    const ratio = Math.max(0, Math.min(1, (position - first.h) / Math.max(.01, second.h - first.h)));
    return first.c.map((color, n) => mixWarm(color, second.c[n], ratio));
  })();
  const remaining = lang === "ar" ? `متبقي ${nDigits(remH, lang)} ساعات و ${nDigits(remM, lang)} دقيقة` : `${remH}h ${remM}m remaining`;
  const date = new Intl.DateTimeFormat("ar-IQ", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  const verse = SURAHS[0].verses[1];
  return <div dir="rtl" className="sk-warm-home">
    <style>{`
      .sk-warm-home{position:absolute;inset:0;z-index:60;overflow:auto;background:#17100c;padding:14px;display:flex;justify-content:center;font-family:'IBM Plex Sans Arabic',sans-serif;color:#fffaf2}
      .sk-warm-card{width:min(100%,414px);min-height:840px;overflow:hidden;border-radius:0 0 34px 34px;background:linear-gradient(178deg,#e0b183 0%,#c08f68 14%,#7c5443 38%,#4b3229 62%,#2b1d18 100%);box-shadow:0 40px 90px -30px rgba(0,0,0,.8)}
      .sk-preview-toggle{position:absolute;top:16px;inset-inline-end:16px;z-index:2;border:1px solid rgba(255,255,255,.28);border-radius:999px;padding:7px 11px;background:rgba(64,37,25,.16);color:rgba(255,249,238,.9);font:inherit;font-size:10px;cursor:pointer}.sk-warm-preview{margin:16px 16px 0;padding:14px 16px 16px;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.14);border-radius:20px;animation:sk-preview-in .2s ease}.sk-warm-preview-top{display:flex;justify-content:space-between;color:rgba(58,36,24,.78);font-size:11px}.sk-warm-range{width:100%;margin-top:13px;direction:ltr;accent-color:#e2c48c;cursor:ew-resize}@keyframes sk-preview-in{from{opacity:0;transform:translateY(-7px)}to{opacity:1;transform:translateY(0)}}
      .sk-warm-header{display:flex;justify-content:center;align-items:start;padding:18px 18px 0}.sk-warm-brand{text-align:center;padding-top:5px}.sk-warm-brand small{display:block;font-size:9px;letter-spacing:.42em;color:rgba(46,28,18,.62)}.sk-warm-brand h1{margin:4px 0 3px;font-size:43px;line-height:1.15}.sk-warm-brand p{margin:0;font-size:11px;color:rgba(52,32,22,.73)}
      .sk-warm-time{display:flex;flex-direction:column;align-items:center;padding:40px 20px 32px;gap:10px}.sk-warm-pill{padding:5px 14px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(255,255,255,.12);font-size:13px;color:#f6e8d3}.sk-warm-pill i{display:inline-block;width:5px;height:5px;margin-left:8px;border-radius:50%;background:#f0d5a4}.sk-warm-clock{font-size:74px;font-weight:300;line-height:1;letter-spacing:.01em;direction:ltr;font-variant-numeric:tabular-nums}.sk-warm-remaining{font-size:12px;color:rgba(255,246,234,.7)}
      .sk-warm-verse{margin:0 20px;padding:22px 4px 24px;border-top:1px solid rgba(255,255,255,.12);text-align:center}.sk-warm-verse label{font-size:10px;letter-spacing:.22em;color:rgba(255,244,230,.5)}.sk-warm-verse p{font-family:'Amiri Quran','Amiri',serif;font-size:21px;line-height:2;margin:13px auto 5px;max-width:330px}.sk-warm-verse span{font-size:11px;color:rgba(240,213,164,.8)}
      .sk-warm-arc{padding:10px 22px 5px}.sk-warm-prayers{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding:14px 12px 20px;border-top:1px solid rgba(255,255,255,.1);margin:8px 12px 0}.sk-warm-prayer{border:1px solid transparent;border-radius:14px;background:transparent;color:rgba(255,246,234,.58);padding:8px 2px;cursor:pointer}.sk-warm-prayer b{font-size:11px;font-weight:400}.sk-warm-prayer span{display:block;margin-top:8px;color:#fdf6ec;font-size:13px;direction:ltr;font-variant-numeric:tabular-nums}.sk-warm-prayer.active{background:rgba(240,213,164,.14);border-color:rgba(240,213,164,.28);color:#f0d5a4}.sk-warm-prayer.active span{color:#f6dcae;font-weight:500}
    `}</style>
    <main className="sk-warm-card" style={{position:"relative",background:`linear-gradient(178deg,${warmSky[0]} 0%,${warmSky[1]} 42%,${warmSky[2]} 100%)`,transition:"background 1.2s linear"}}>
      <button className="sk-preview-toggle" onClick={() => setShowTimePreview((v) => !v)}>{showTimePreview ? "إخفاء المعاينة" : "معاينة الوقت"}</button>
      {showTimePreview && <div className="sk-warm-preview"><div className="sk-warm-preview-top"><span>معاينة الوقت · {NAMES[active][lang]}</span><button onClick={() => { onScrub(hourNow); setShowTimePreview(false); }} style={{border:0,background:"none",color:"inherit",cursor:"pointer"}}>الآن</button></div><input aria-label="معاينة الوقت" className="sk-warm-range" type="range" min={prayerTimes.fajr} max={prayerTimes.isha} step=".0028" value={Math.min(prayerTimes.isha, Math.max(prayerTimes.fajr, hourNow))} onChange={(e) => { onScrub(Number(e.target.value)); setShowTimePreview(true); }} /></div>}
      <header className="sk-warm-header"><div className="sk-warm-brand"><small>SAKINAH</small><h1>سكينة</h1><p>{date}</p></div></header>
      <section className="sk-warm-time"><div className="sk-warm-pill"><i />{NAMES[active][lang]}</div><div className="sk-warm-clock">{fmtHM(prayerTimes[active], lang)}</div><div className="sk-warm-remaining">{remaining}</div></section>
      <button className="sk-warm-verse" onClick={() => go("reader", { surahId: 1 })} style={{width:"calc(100% - 40px)",background:"none",borderInline:"none",borderBottom:"none",color:"inherit",cursor:"pointer"}}><label>آية اليوم</label><p>{verse.ar}</p><span>سورة الفاتحة · الآية ٢</span></button>
      <div className="sk-warm-arc"><DayArc hourNow={hourNow} lang={lang} onScrub={onScrub} isDark prayerTimes={prayerTimes} /></div>
      <section className="sk-warm-prayers">{[...PRAYER_ONLY].map((id) => <button key={id} className={`sk-warm-prayer ${active === id ? "active" : ""}`} onClick={() => onScrub(prayerTimes[id])}><b>{NAMES[id][lang]}</b><span>{fmtHM(prayerTimes[id], lang)}</span></button>)}</section>
    </main>
  </div>;
}

/* ════════════════════════════════════════════════════════════════
   AYAH ACTION RAIL
════════════════════════════════════════════════════════════════ */
function AyahRail({ ayah, index, lang, onClose, onMemorize, onExplore, bookmarked, onBookmark }) {
  const t = STRINGS[lang];
  const actions = [
    { id: "explore", label: t.tafsir, icon: BookOpen, action: onExplore },
    { id: "listen", label: t.listen, icon: Volume2 },
    { id: "memorize", label: t.memorize, icon: Sparkles, action: onMemorize },
    { id: "save", label: bookmarked ? t.saved2 : t.save, icon: Bookmark, action: onBookmark, active: bookmarked },
    { id: "share", label: t.share, icon: Share2 },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(16,16,15,0.28)" }} />
      <div className="sk-rail-enter" style={{ position: "relative", width: "100%", background: "rgba(246,243,236,0.97)", backdropFilter: "blur(14px)", color: COLOR.ink, borderTop: "1px solid rgba(16,16,15,0.08)", padding: "18px 24px 26px" }}>
        <div style={{ fontSize: 10.5, opacity: 0.45, fontWeight: 600, marginBottom: 10 }}>{t.verse} {nDigits(index + 1, lang)}</div>
        <div className="font-quran" style={{ fontSize: 17, lineHeight: 1.7, direction: "rtl", opacity: 0.85, marginBottom: 18 }}>{ayah.ar}</div>
        <div className="sk-scroll" style={{ display: "flex", gap: 26, overflowX: "auto", paddingBottom: 4 }}>
          {actions.map((a) => (
            <button key={a.id} onClick={a.action || onClose} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, background: "none", border: "none", cursor: "pointer", color: a.active ? COLOR.goldDeep : COLOR.ink, flexShrink: 0 }}>
              <a.icon size={17} strokeWidth={1.5} opacity={a.active ? 1 : 0.8} fill={a.active ? COLOR.goldDeep : "none"} />
              <span style={{ fontSize: 10, fontWeight: 500, opacity: a.active ? 1 : 0.7, whiteSpace: "nowrap" }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   TRUST LAYER — "Explore this āyah"
   Every layer is visually labeled by category so a verified Qur'an
   text is never blurred together with an unconnected/locked layer.
════════════════════════════════════════════════════════════════ */
function ExploreAyah({ ayah, index, lang, onClose }) {
  const t = STRINGS[lang];
  const locked = [t.trustTafsir, t.trustRelated, t.trustRoot];
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 55, display: "flex", alignItems: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(16,16,15,0.34)" }} />
      <div className="sk-rail-enter" style={{ position: "relative", width: "100%", maxHeight: "82%", overflowY: "auto", background: "rgba(246,243,236,0.98)", backdropFilter: "blur(14px)", color: COLOR.ink, borderTop: "1px solid rgba(16,16,15,0.08)", padding: "18px 24px 30px" }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, opacity: 0.6, marginBottom: 16 }}>{t.exploreAyah}</div>

        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", color: COLOR.goldDeep, marginBottom: 6 }}>{t.trustQuran}</div>
        <div className="font-quran" style={{ fontSize: 20, lineHeight: 1.9, direction: "rtl", marginBottom: 16 }}>{ayah.ar}</div>

        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", opacity: 0.4, marginBottom: 6 }}>{t.trustTranslation}</div>
        <div style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.6, marginBottom: 20 }}>{ayah.en}</div>

        {locked.map((label) => (
          <div key={label} style={{ borderTop: "1px solid rgba(16,16,15,0.08)", padding: "14px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", opacity: 0.32 }}>{label}</span>
              <span style={{ fontSize: 10.5, opacity: 0.35 }}>—</span>
            </div>
            <div style={{ fontSize: 11.5, opacity: 0.38, marginTop: 4 }}>{t.sourceNotConnected}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   QURAN — Home / Surah List / Reader / Memorize / Audio
════════════════════════════════════════════════════════════════ */
function QuranHome({ lang, go, lastRead, bookmarks }) {
  const t = STRINGS[lang];
  const s = surahById(lastRead.surahId);
  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 24px 0" }}>
        <BackBtn lang={lang} onClick={() => go("today")} />
        <button onClick={() => go("search")} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.55, padding: 8 }}><Search size={17} strokeWidth={1.7} /></button>
      </div>
      <div className="sk-scroll" style={{ flex: 1, overflowY: "auto", padding: "10px 24px 130px" }}>
        <div onClick={() => go("reader", { surahId: lastRead.surahId })} style={{ cursor: "pointer", marginTop: 12, borderInlineStart: `1.4px solid ${COLOR.gold}`, paddingInlineStart: 14 }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", opacity: 0.5, marginBottom: 6 }}>{t.quranHomeContinue}</div>
          <div className="font-editorial" style={{ fontSize: lang === "ar" ? 24 : 21 }}>{s.ar} · {s.en}</div>
          <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>{t.verse} {nDigits(lastRead.ayah + 1, lang)}</div>
        </div>
        <div style={{ marginTop: 30 }}>
          <Row lang={lang} first big label={t.surahs} onClick={() => go("surah-list")} />
          <Row lang={lang} label={t.saved} sub={`${bookmarks.size}`} onClick={() => go("surah-list")} />
          <Row lang={lang} label={t.listening} onClick={() => go("audio", { surahId: lastRead.surahId })} />
          <Row lang={lang} label={t.memorize} onClick={() => go("memorize")} />
        </div>
      </div>
    </div>
  );
}

function SurahList({ lang, go }) {
  const t = STRINGS[lang];
  const [q, setQ] = useState("");
  const filtered = SURAHS.filter((s) => !q || s.ar.includes(q) || s.en.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "24px 24px 0" }}><BackBtn lang={lang} onClick={() => go("quran-home")} /></div>
      <div style={{ padding: "14px 24px 0" }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.searchPlaceholder}
          style={{ width: "100%", border: "none", borderBottom: "1px solid rgba(16,16,15,0.15)", background: "none", padding: "8px 2px", fontSize: 14, outline: "none", color: COLOR.ink, textAlign: lang === "ar" ? "right" : "left" }} />
      </div>
      <div className="sk-scroll" style={{ flex: 1, overflowY: "auto", padding: "6px 24px 130px" }}>
        {filtered.map((s, i) => (
          <Row key={s.id} lang={lang} first={i === 0}
            label={`${nDigits(s.id, lang)} · ${s.ar}`} sub={`${s.en} · ${nDigits(s.count, lang)} ${t.verse}${s.verses ? "" : "  ·  " + t.notConnected}`}
            onClick={() => go("reader", { surahId: s.id })} />
        ))}
      </div>
    </div>
  );
}

function QuranReader({ lang, surahId, go, lastRead, setLastRead, bookmarks, toggleBookmark, quranScale }) {
  const t = STRINGS[lang];
  const s = surahById(surahId);
  const [openAyah, setOpenAyah] = useState(null);
  const [exploring, setExploring] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);

  useEffect(() => { if (openAyah !== null) setLastRead({ surahId, ayah: openAyah }); }, [openAyah]);

  if (!s.verses) {
    return (
      <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 22px 6px" }}>
          <BackBtn lang={lang} onClick={() => go("surah-list")} />
          <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{s.ar}</div>
          <div style={{ width: 26 }} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
          <div className="font-editorial" style={{ fontSize: lang === "ar" ? 26 : 22, marginBottom: 10 }}>{s.ar}</div>
          <div style={{ fontSize: 13, opacity: 0.5, maxWidth: 260, lineHeight: 1.6 }}>{t.notConnectedSub}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 22px 6px" }}>
        <BackBtn lang={lang} onClick={() => go("quran-home")} />
        <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{s.ar}</div>
        <button onClick={() => setShowTranslation((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: showTranslation ? COLOR.gold : "rgba(16,16,15,0.35)" }}><Languages size={17} strokeWidth={1.6} /></button>
      </div>
      <div className="sk-scroll" style={{ flex: 1, overflowY: "auto", padding: "30px 30px 140px" }}>
        {s.verses.map((ayah, i) => (
          <button key={i} onClick={() => setOpenAyah(i)} style={{
            display: "block", width: "100%", textAlign: "right", background: "none", border: "none", cursor: "pointer",
            marginBottom: 34, padding: 0, color: "inherit",
            opacity: openAyah === null || openAyah === i ? 1 : 0.32, transition: "opacity .6s cubic-bezier(.22,.61,.36,1)",
          }}>
            <div className="font-quran" style={{ fontSize: 26 * (quranScale || 1), lineHeight: 2.3, direction: "rtl" }}>
              {ayah.ar}
              <span style={{ fontSize: 12, opacity: bookmarks.has(`${surahId}:${i}`) ? 1 : 0.4, color: bookmarks.has(`${surahId}:${i}`) ? COLOR.goldDeep : "inherit", margin: "0 8px", verticalAlign: "super", fontFamily: "'Inter', sans-serif" }}>{nDigits(i + 1, lang)}</span>
            </div>
            {showTranslation && <div style={{ fontSize: 12.5, opacity: 0.48, marginTop: 7, lineHeight: 1.65 }}>{ayah.en}</div>}
          </button>
        ))}
        <div style={{ textAlign: "center", marginTop: 10, fontSize: 10.5, opacity: 0.35 }}>{`${lang === "ar" ? "القرآن الكريم" : "Qur'an"} · ${s.ar}`}</div>
      </div>
      {openAyah !== null && !exploring && (
        <AyahRail ayah={s.verses[openAyah]} index={openAyah} lang={lang} onClose={() => setOpenAyah(null)}
          bookmarked={bookmarks.has(`${surahId}:${openAyah}`)} onBookmark={() => toggleBookmark(`${surahId}:${openAyah}`)}
          onMemorize={() => go("memorize", { surahId })} onExplore={() => setExploring(true)} />
      )}
      {openAyah !== null && exploring && (
        <ExploreAyah ayah={s.verses[openAyah]} index={openAyah} lang={lang} onClose={() => { setExploring(false); setOpenAyah(null); }} />
      )}
    </div>
  );
}

function MemorizeScreen({ lang, go, initialSurahId }) {
  const t = STRINGS[lang];
  const loaded = SURAHS.filter((s) => s.verses);
  const [surahId, setSurahId] = useState(initialSurahId && surahById(initialSurahId)?.verses ? initialSurahId : null);
  const [revealed, setRevealed] = useState({});
  const [status, setStatus] = useState({});
  const [reps, setReps] = useState({});
  const s = surahId ? surahById(surahId) : null;

  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 22px 6px" }}>
        <BackBtn lang={lang} onClick={() => (s ? setSurahId(null) : go("quran-home"))} />
        <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{t.memorize}</div>
        <div style={{ width: 26 }} />
      </div>
      <div className="sk-scroll" style={{ flex: 1, overflowY: "auto", padding: "10px 24px 130px" }}>
        {!s ? (
          <>
            <div style={{ fontSize: 12.5, opacity: 0.5, marginTop: 14, marginBottom: 6 }}>{t.memorizeEmpty}</div>
            {loaded.map((sur, i) => <Row key={sur.id} lang={lang} first={i === 0} label={`${sur.ar} · ${sur.en}`} onClick={() => setSurahId(sur.id)} />)}
          </>
        ) : (
          s.verses.map((ayah, i) => {
            const isRevealed = revealed[i] !== false;
            const st = status[i];
            return (
              <div key={i} style={{ padding: "20px 0", borderTop: i === 0 ? "none" : "1px solid rgba(16,16,15,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 10.5, opacity: 0.45 }}>{t.verse} {nDigits(i + 1, lang)}</span>
                  <button onClick={() => setRevealed((r) => ({ ...r, [i]: !isRevealed }))} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, opacity: 0.55, color: "inherit" }}>
                    {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />} {isRevealed ? t.hideText : t.reveal}
                  </button>
                </div>
                <div className="font-quran" style={{ fontSize: 21, lineHeight: 2, direction: "rtl", filter: isRevealed ? "none" : "blur(7px)", transition: "filter .4s ease", userSelect: isRevealed ? "auto" : "none" }}>{ayah.ar}</div>
                <div style={{ display: "flex", gap: 18, marginTop: 12, alignItems: "center" }}>
                  <button onClick={() => setReps((r) => ({ ...r, [i]: (r[i] || 0) + 1 }))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, opacity: 0.55, color: "inherit" }}>{t.repeat} · {nDigits(reps[i] || 0, lang)}</button>
                  <button onClick={() => setStatus((st2) => ({ ...st2, [i]: "comfortable" }))} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 11, opacity: st === "comfortable" ? 1 : 0.4, color: st === "comfortable" ? COLOR.goldDeep : "inherit" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: st === "comfortable" ? COLOR.goldDeep : "none", border: `1px solid ${st === "comfortable" ? COLOR.goldDeep : "currentColor"}` }} />{t.comfortable}
                  </button>
                  <button onClick={() => setStatus((st2) => ({ ...st2, [i]: "review" }))} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 11, opacity: st === "review" ? 1 : 0.4, color: "inherit" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", border: "1px solid currentColor" }} />{t.needsReview}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function AudioScreen({ lang, go, surahId }) {
  const t = STRINGS[lang];
  const s = surahById(surahId) || SURAHS[0];
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [tone, setTone] = useState(0);
  const tones = [t.tone1, t.tone2, t.tone3];
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setProgress((p) => (p >= 1 ? 0 : p + 0.01 * speed)), 200);
    return () => clearInterval(id);
  }, [playing, speed]);

  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "24px 24px 0" }}><BackBtn lang={lang} onClick={() => go("quran-home")} /></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 30px 100px" }}>
        <div style={{ textAlign: "center" }}>
          <div className="font-editorial" style={{ fontSize: lang === "ar" ? 28 : 24, marginBottom: 6 }}>{s.ar}</div>
          <div style={{ fontSize: 12, opacity: 0.45 }}>{s.en}</div>
        </div>
        <div style={{ marginTop: 40 }}>
          <div style={{ height: 2, background: "rgba(16,16,15,0.12)", borderRadius: 2, position: "relative" }}>
            <div style={{ position: "absolute", insetInlineStart: 0, top: 0, bottom: 0, width: `${progress * 100}%`, background: COLOR.gold, borderRadius: 2, transition: "width .2s linear" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
            <button onClick={() => setPlaying((p) => !p)} style={{ width: 56, height: 56, borderRadius: "50%", border: `1px solid rgba(16,16,15,0.15)`, background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: COLOR.ink }}>
              {playing ? <Pause size={20} /> : <Play size={20} style={{ marginInlineStart: lang === "ar" ? 0 : 2 }} />}
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: 18, fontSize: 11, opacity: 0.4 }}>{t.noAudio}</div>
        </div>
        <div style={{ marginTop: 42, display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
          <span style={{ opacity: 0.5 }}>{t.speed}</span>
          <span style={{ display: "flex", gap: 14 }}>
            {[0.75, 1, 1.25, 1.5].map((v) => <button key={v} onClick={() => setSpeed(v)} style={{ background: "none", border: "none", cursor: "pointer", opacity: speed === v ? 1 : 0.4, fontWeight: speed === v ? 600 : 400, color: speed === v ? COLOR.goldDeep : "inherit" }}>{v}×</button>)}
          </span>
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
          <span style={{ opacity: 0.5 }}>{lang === "ar" ? "طابع الصوت" : "Recitation tone"}</span>
          <span style={{ display: "flex", gap: 14 }}>
            {tones.map((tn, i) => <button key={tn} onClick={() => setTone(i)} style={{ background: "none", border: "none", cursor: "pointer", opacity: tone === i ? 1 : 0.4, fontWeight: tone === i ? 600 : 400, color: tone === i ? COLOR.goldDeep : "inherit" }}>{tn}</button>)}
          </span>
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
          <span style={{ opacity: 0.5 }}>{t.sleepTimer}</span><span style={{ opacity: 0.4 }}>{t.off}</span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   QIBLA — compass-ready with graceful simulation fallback
════════════════════════════════════════════════════════════════ */
function QiblaDial({ lang, onDegChange }) {
  const t = STRINGS[lang];
  const QIBLA_BEARING = 136; // demo bearing; real build derives this from device geolocation.
  const [mode, setMode] = useState("simulation"); // 'simulation' | 'calibrating' | 'compass'
  const [heading, setHeading] = useState(0); // device heading in simulation this is user-dragged
  const wasAligned = useRef(false);
  const ref = useRef(null);
  const dragging = useRef(false);
  const size = 230;

  const relative = mode === "compass" ? QIBLA_BEARING - heading : heading;
  const norm = ((relative % 360) + 360) % 360;
  const aligned = norm < 3 || norm > 357;

  useEffect(() => {
    if (aligned && !wasAligned.current) { try { navigator.vibrate && navigator.vibrate(12); } catch (e) {} }
    wasAligned.current = aligned;
  }, [aligned]);
  useEffect(() => { onDegChange && onDegChange(norm); }, [norm]);

  const enableCompass = async () => {
    setMode("calibrating");
    try {
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res !== "granted") { setMode("simulation"); return; }
      }
      let got = false;
      const handler = (e) => {
        const h = e.webkitCompassHeading ?? (e.alpha != null ? 360 - e.alpha : null);
        if (h != null) { got = true; setHeading(h); setMode("compass"); }
      };
      window.addEventListener("deviceorientation", handler, true);
      setTimeout(() => { if (!got) { setMode("simulation"); window.removeEventListener("deviceorientation", handler, true); } }, 2500);
    } catch (e) { setMode("simulation"); }
  };

  const onDown = (e) => { if (mode === "compass") return; dragging.current = true; e.target.setPointerCapture?.(e.pointerId); };
  const onUp = () => { dragging.current = false; };
  const onMove = (e) => {
    if (!dragging.current || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX, clientY = e.clientY ?? e.touches?.[0]?.clientY;
    setHeading((Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI + 90);
  };
  const tone = aligned ? COLOR.goldDeep : COLOR.gold;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0 4px" }}>
      <div ref={ref} onPointerDown={onDown} onPointerUp={onUp} onPointerMove={onMove} onPointerLeave={onUp} style={{ width: size, height: size, position: "relative", touchAction: "none", cursor: mode === "compass" ? "default" : "grab" }}>
        <svg width={size} height={size} viewBox="0 0 230 230">
          <circle cx="115" cy="115" r={aligned ? 104 : 100} fill="none" stroke={aligned ? "rgba(142,118,66,0.35)" : "rgba(16,16,15,0.1)"} strokeWidth="1" style={{ transition: "all .5s cubic-bezier(.22,.61,.36,1)" }} />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * 2 * Math.PI, major = i % 6 === 0, r1 = 100, r2 = major ? 90 : 95;
            return <line key={i} x1={115 + r1 * Math.sin(a)} y1={115 - r1 * Math.cos(a)} x2={115 + r2 * Math.sin(a)} y2={115 - r2 * Math.cos(a)} stroke="rgba(16,16,15,0.15)" strokeWidth={major ? 1.1 : 0.6} />;
          })}
          <g transform={`rotate(${relative} 115 115)`} style={{ transition: dragging.current ? "none" : "transform .5s cubic-bezier(.22,.61,.36,1)" }}>
            <line x1="115" y1="115" x2="115" y2="30" stroke={tone} strokeWidth="1.3" />
            <circle cx="115" cy="26" r="4.5" fill={tone} />
          </g>
          <circle cx="115" cy="115" r="2.5" fill={COLOR.ink} opacity="0.7" />
        </svg>
      </div>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <div style={{ fontSize: 26, fontFamily: lang === "ar" ? "'IBM Plex Sans Arabic', sans-serif" : "'Fraunces', serif", color: aligned ? COLOR.goldDeep : "inherit", transition: "color .5s ease" }}>{nDigits(Math.round(norm), lang)}°</div>
        <div style={{ fontSize: 11.5, opacity: 0.5, marginTop: 3 }}>
          {mode === "calibrating" ? t.calibrating : aligned ? t.aligned : t.dragToAlign}
        </div>
        <div style={{ marginTop: 10 }}>
          {mode === "simulation" && <button onClick={enableCompass} style={{ background: "none", border: "1px dashed rgba(16,16,15,0.25)", borderRadius: 20, padding: "5px 12px", fontSize: 10.5, opacity: 0.5, cursor: "pointer", color: "inherit" }}>{t.enableCompass}</button>}
          {mode === "compass" && <span style={{ fontSize: 10, opacity: 0.4 }}>{t.compassMode}</span>}
        </div>
      </div>
    </div>
  );
}

function PrayerScreen({ lang, hourNow, go, onScrub, onQiblaDeg, prayerTimes }) {
  const t = STRINGS[lang];
  const nowH = hourNow < H.fajr ? hourNow + 24 : hourNow;
  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 22px 0" }}>
        <BackBtn lang={lang} onClick={() => go("today")} />
        <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{t.prayer}</div>
        <div style={{ width: 26 }} />
      </div>
      <div className="sk-scroll" style={{ flex: 1, overflowY: "auto", padding: "8px 24px 130px" }}>
        <div style={{ marginTop: 20 }}><DayArc hourNow={hourNow} lang={lang} onScrub={onScrub} isDark={false} prayerTimes={prayerTimes} /></div>
        <div style={{ marginTop: 26 }}>
          {TIMELINE.filter((ev) => PRAYER_ONLY.has(ev.id)).map((ev) => {
            const evH = ev.h < H.fajr ? ev.h + 24 : ev.h, passed = evH < nowH;
            const isNext = !passed && !TIMELINE.some((e2) => PRAYER_ONLY.has(e2.id) && (e2.h < H.fajr ? e2.h + 24 : e2.h) > nowH && (e2.h < H.fajr ? e2.h + 24 : e2.h) < evH);
            return (
              <div key={ev.id} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: isNext ? "14px 0" : "10px 0", opacity: passed ? 0.35 : isNext ? 1 : 0.68, transition: "opacity .5s ease" }}>
                <span style={{ fontSize: isNext ? 16 : 14, fontWeight: isNext ? 600 : 400, color: isNext ? COLOR.goldDeep : "inherit" }}>{NAMES[ev.id][lang]}</span>
                <span style={{ fontSize: isNext ? 17 : 14, fontFamily: lang === "ar" ? "'IBM Plex Sans Arabic', sans-serif" : "'Fraunces', serif" }}>{fmtHM(ev.h, lang)}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 28, paddingTop: 22, borderTop: "1px solid rgba(16,16,15,0.09)" }}><QiblaDial lang={lang} onDegChange={onQiblaDeg} /></div>
        <Row lang={lang} label={t.prayerSettings} sub="Muslim World League · Standard" onClick={() => go("me-prayer-settings")} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   DISCOVER
════════════════════════════════════════════════════════════════ */
function DiscoverScreen({ lang, go, isFriday }) {
  const t = STRINGS[lang];
  const rows = [
    { id: "adhkar", label: t.adhkar, action: () => go("adhkar-home") },
    { id: "dua", label: t.dua, action: () => go("dua-center") },
    { id: "hadith", label: t.hadith, action: () => go("tafsir-hadith") },
    { id: "seerah", label: t.seerah, action: () => go("archive") },
    { id: "quran-platform", label: lang === "ar" ? "منصة القرآن" : "Quran Platform", action: () => go("quran-platform") },
    { id: "trust", label: lang === "ar" ? "المصادر والثقة" : "Trust & Sources", action: () => go("trust-center") },
  ];
  const life = [
    { l: t.ramadan, action: () => go("fasting") },
    { l: t.hajj, action: () => go("hajj") },
    { l: t.umrah, action: () => go("umrah") },
    { l: t.zakat, action: () => go("calendar-zakat") },
    { l: t.family, action: () => go("family") },
    { l: lang === "ar" ? "المسجد" : "Mosque", action: () => go("mosque") },
    { l: lang === "ar" ? "الأطفال" : "Kids", action: () => go("kids") },
    { l: lang === "ar" ? "الحياة" : "Life", action: () => go("life-center") },
    { l: lang === "ar" ? "تعلم" : "Learn", action: () => go("learning") },
    { l: lang === "ar" ? "سكينة الذكية" : "Intelligence", action: () => go("intelligence") },
    { l: lang === "ar" ? "الأرشيف" : "Archive", action: () => go("archive") },
    { l: lang === "ar" ? "المجتمع" : "Community", action: () => go("community") },
    { l: lang === "ar" ? "السفر والحرمين" : "Travel & Haramain", action: () => go("journey-services") },
    { l: lang === "ar" ? "المال والمعاملات" : "Money", action: () => go("finance") },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 24px 0" }}>
        <BackBtn lang={lang} onClick={() => go("today")} />
        <button onClick={() => go("search")} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.55, padding: 8 }}><Search size={17} strokeWidth={1.7} /></button>
      </div>
      <div className="sk-scroll" style={{ flex: 1, overflowY: "auto", padding: "6px 24px 130px" }}>
        {isFriday ? (
          <div onClick={() => go("reader", { surahId: 18 })} style={{ cursor: "pointer", marginTop: 10 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.08em", opacity: 0.5, marginBottom: 8 }}>{t.friday}</div>
            <div className="font-editorial" style={{ fontSize: lang === "ar" ? 28 : 24, lineHeight: 1.2 }}>{t.fridayLine}</div>
          </div>
        ) : (
          <div style={{ marginTop: 10, cursor: "pointer" }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.08em", opacity: 0.5, marginBottom: 8 }}>{t.knowledge}</div>
            <div className="font-editorial" style={{ fontSize: lang === "ar" ? 30 : 26, lineHeight: 1.2 }}>{t.names99}</div>
            <div style={{ fontSize: 12.5, opacity: 0.5, marginTop: 6, maxWidth: 260 }}>{t.featuredDesc}</div>
          </div>
        )}
        <div style={{ marginTop: 28 }}>
          {rows.map((r, i) => (
            <div key={r.id} onClick={r.action} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: i === 0 ? "16px 0" : "13px 0", borderTop: "1px solid rgba(16,16,15,0.08)", cursor: "pointer" }}>
              <span style={{ fontSize: i === 0 ? 17 : 14, fontWeight: i === 0 ? 600 : 450, opacity: i === 0 ? 1 : 0.82 }}>{r.label}</span>
              {lang === "ar" ? <ChevronLeft size={15} opacity={0.35} /> : <ChevronRight size={15} opacity={0.35} />}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 30 }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.08em", opacity: 0.5, marginBottom: 10 }}>{t.life}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 22px" }}>
            {life.map((it) => <span key={it.l} onClick={it.action} style={{ fontSize: 13.5, opacity: 0.6, borderBottom: "1px solid rgba(16,16,15,0.15)", paddingBottom: 3, cursor: it.action ? "pointer" : "default" }}>{it.l}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdhkarHome({ lang, go }) {
  const t = STRINGS[lang];
  const cats = ADHKAR_CATEGORIES.map((c) => ({
    ...c, label: lang === "ar" ? c.ar : c.en,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "24px 24px 0" }}><BackBtn lang={lang} onClick={() => go("discover")} /></div>
      <div className="sk-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px 24px 130px" }}>
        <div className="font-editorial" style={{ fontSize: lang === "ar" ? 26 : 22, marginBottom: 20 }}>{t.adhkar}</div>
        {cats.map((c, i) => (
          <Row key={c.id} lang={lang} first={i === 0} label={c.label}
            sub={c.items ? t.itemsAvailable(c.items.length) : t.awaitingSource}
            onClick={c.items ? () => go("adhkar-cat", { cat: c.id }) : undefined}
            right={!c.items ? <span style={{ fontSize: 10, opacity: 0.35 }}>—</span> : undefined} />
        ))}
      </div>
    </div>
  );
}

function AdhkarReader({ lang, go, catId }) {
  const t = STRINGS[lang];
  const cat = ADHKAR_CATEGORIES.find((c) => c.id === catId);
  const [i, setI] = useState(0);
  const [favs, setFavs] = useState({});
  const items = cat?.items || [];
  const item = items[i];
  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 22px 6px" }}>
        <BackBtn lang={lang} onClick={() => go("adhkar-home")} />
        <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{lang === "ar" ? cat?.ar : cat?.en}</div>
        <button onClick={() => setFavs((f) => ({ ...f, [i]: !f[i] }))} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: favs[i] ? COLOR.goldDeep : "rgba(16,16,15,0.4)" }}>
          <Bookmark size={17} strokeWidth={1.6} fill={favs[i] ? COLOR.goldDeep : "none"} />
        </button>
      </div>
      {item && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 30px 100px" }}>
          <div className="font-quran" style={{ fontSize: 22, lineHeight: 2, direction: "rtl", textAlign: "center" }}>{item.ar}</div>
          <div style={{ fontSize: 12.5, opacity: 0.5, marginTop: 18, textAlign: "center", lineHeight: 1.6 }}>{item.en}</div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}><SourceTag lang={lang} item={item} /></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 44 }}>
            <button onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} style={{ background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", opacity: i === 0 ? 0.2 : 0.6, color: "inherit" }}>{lang === "ar" ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}</button>
            <span style={{ fontSize: 11, opacity: 0.4, alignSelf: "center" }}>{nDigits(i + 1, lang)} {t.ayahOf} {nDigits(items.length, lang)}</span>
            <button onClick={() => setI((v) => Math.min(items.length - 1, v + 1))} disabled={i === items.length - 1} style={{ background: "none", border: "none", cursor: i === items.length - 1 ? "default" : "pointer", opacity: i === items.length - 1 ? 0.2 : 0.6, color: "inherit" }}>{lang === "ar" ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   UNIVERSAL SEARCH
════════════════════════════════════════════════════════════════ */
/* "Ask Sakinah" — a small, honest keyword→action layer. This is
   pattern matching against real app destinations, not natural-
   language understanding; it always tries an APPLICATION ACTION
   first, before falling back to plain text search (brief §11). */
function parseCommand(raw, lang, t, nextPrayer, qiblaDeg) {
  const q = raw.trim().toLowerCase();
  if (!q) return null;
  const has = (...words) => words.some((w) => q.includes(w));
  if (has("قبلة", "qibla")) return { label: `${t.qiblaShort} · ${nDigits(Math.round(qiblaDeg), lang)}°`, go: "prayer" };
  if (has("مغرب", "maghrib", "صلاة", "prayer", "باقي", "remaining")) return { label: `${NAMES[nextPrayer.id][lang]} · ${fmtHM(nextPrayer.h, lang)}`, go: "prayer" };
  if (has("متابع", "continue", "وين وصلت", "where did i")) return { label: t.continueReading, go: "quran-home" };
  if (has("أذكار المساء", "evening adhk")) return { label: t.evening, go: "adhkar-cat", param: { cat: "evening" } };
  if (has("أذكار الصباح", "morning adhk")) return { label: t.evening, go: "adhkar-cat", param: { cat: "morning" } };
  if (has("حفظ", "memoriz")) return { label: t.memorize, go: "memorize" };
  const surahHit = SURAHS.find((s) => q.includes(s.ar) || q.includes(s.en.toLowerCase()));
  if (surahHit) return { label: `${surahHit.ar} · ${surahHit.en}`, go: "reader", param: { surahId: surahHit.id } };
  return null;
}

function SearchScreen({ lang, go, nextPrayer, qiblaDeg }) {
  const t = STRINGS[lang];
  const [q, setQ] = useState("");
  const appDest = [
    { key: "today", label: t.today, go: "today" }, { key: "quran", label: t.quran, go: "quran-home" },
    { key: "prayer", label: t.prayer, go: "prayer" }, { key: "discover", label: t.discover, go: "discover" },
    { key: "adhkar", label: t.adhkar, go: "adhkar-home" }, { key: "me", label: t.me, go: "me" },
    { key: "adhan", label: lang === "ar" ? "الأذان والمؤذنون" : "Adhan & Muezzins", go: "adhan-center" },
    { key: "trust", label: lang === "ar" ? "المصادر والثقة" : "Trust & Sources", go: "trust-center" },
    { key: "mosque", label: lang === "ar" ? "المسجد" : "Mosque", go: "mosque" },
    { key: "learn", label: lang === "ar" ? "تعلم" : "Learn", go: "learning" },
    { key: "archive", label: lang === "ar" ? "الأرشيف" : "Archive", go: "archive" },
  ];
  const ql = q.trim().toLowerCase();
  const command = parseCommand(q, lang, t, nextPrayer, qiblaDeg);
  const quranHits = ql ? SURAHS.filter((s) => s.ar.includes(q) || s.en.toLowerCase().includes(ql)) : [];
  const discoverHits = ql ? [t.adhkar, t.dua, t.hadith, t.seerah, t.names99, t.ramadan, t.hajj, t.umrah, t.zakat, t.family].filter((l) => l.toLowerCase().includes(ql)) : [];
  const appHits = ql ? appDest.filter((d) => d.label.toLowerCase().includes(ql)) : [];
  const empty = ql && !command && !quranHits.length && !discoverHits.length && !appHits.length;

  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "24px 24px 0" }}><BackBtn lang={lang} onClick={() => go("today")} /></div>
      <div style={{ padding: "14px 24px 0" }}>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.askPlaceholder}
          style={{ width: "100%", border: "none", borderBottom: "1px solid rgba(16,16,15,0.15)", background: "none", padding: "8px 2px", fontSize: 14, outline: "none", color: COLOR.ink, textAlign: lang === "ar" ? "right" : "left" }} />
      </div>
      <div className="sk-scroll" style={{ flex: 1, overflowY: "auto", padding: "10px 24px 130px" }}>
        {empty && <div style={{ fontSize: 13, opacity: 0.4, marginTop: 20 }}>{t.noResults}</div>}
        {command && (
          <button onClick={() => go(command.go, command.param)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, background: "none", border: `1px solid ${COLOR.gold}`, borderRadius: 12, padding: "12px 14px", marginTop: 14, cursor: "pointer", color: COLOR.goldDeep, textAlign: lang === "ar" ? "right" : "left" }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", opacity: 0.6 }}>{t.appAction}</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, flex: 1 }}>{command.label}</span>
          </button>
        )}
        {quranHits.length > 0 && <>
          <div style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.45, marginTop: 16, marginBottom: 6 }}>{t.searchResultsQuran}</div>
          {quranHits.map((s) => <Row key={s.id} lang={lang} label={`${s.ar} · ${s.en}`} onClick={() => go("reader", { surahId: s.id })} />)}
        </>}
        {discoverHits.length > 0 && <>
          <div style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.45, marginTop: 16, marginBottom: 6 }}>{t.searchResultsDiscover}</div>
          {discoverHits.map((l) => <Row key={l} lang={lang} label={l} onClick={() => go("discover")} />)}
        </>}
        {appHits.length > 0 && <>
          <div style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.45, marginTop: 16, marginBottom: 6 }}>{t.searchResultsApp}</div>
          {appHits.map((d) => <Row key={d.key} lang={lang} label={d.label} onClick={() => go(d.go)} />)}
        </>}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ME — personal space + sub-screens
════════════════════════════════════════════════════════════════ */
function MeScreen({ lang, setLang, go, bookmarks, lastRead, travelMode, setTravelMode, ramadanMode, setRamadanMode }) {
  const t = STRINGS[lang];
  const s = surahById(lastRead.surahId);
  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "24px 24px 0" }}><BackBtn lang={lang} onClick={() => go("today")} /></div>
      <div className="sk-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px 24px 130px" }}>
        <Row lang={lang} first big label={t.continueReading} sub={`${s.ar} · ${t.verse} ${nDigits(lastRead.ayah + 1, lang)}`} onClick={() => go("reader", { surahId: lastRead.surahId })} />
        <Row lang={lang} label={t.progress} sub={`${nDigits(bookmarks.size, lang)} ${t.saved.toLowerCase()}`} onClick={() => go("surah-list")} />
        <Row lang={lang} label={t.downloads} onClick={() => go("audio", { surahId: lastRead.surahId })} />
        <Row lang={lang} label={t.family} onClick={() => go("family")} />

        <div style={{ marginTop: 26, paddingTop: 4, fontSize: 10.5, fontWeight: 600, opacity: 0.4, letterSpacing: "0.06em" }}>{t.preferences}</div>
        <Row lang={lang} label={t.prayerSettings} sub="Muslim World League" onClick={() => go("me-prayer-settings")} />
        <Row lang={lang} label={t.language} sub={lang === "ar" ? "العربية" : "English"} onClick={() => setLang(lang === "ar" ? "en" : "ar")} />
        <Row lang={lang} label={t.accessibility} onClick={() => go("me-accessibility")} />
        <Row lang={lang} label={t.notifications} onClick={() => go("me-notifications")} />
        <Row lang={lang} label={t.widgets} onClick={() => go("me-widgets")} />
        <Row lang={lang} label={t.travelToggle} right={<Switch on={travelMode} onChange={() => setTravelMode((v) => !v)} />} />
        <Row lang={lang} label={t.ramadanToggle} sub={t.ramadanNote} right={<Switch on={ramadanMode} onChange={() => setRamadanMode((v) => !v)} />} />

        <div style={{ marginTop: 26, paddingTop: 4, fontSize: 10.5, fontWeight: 600, opacity: 0.4, letterSpacing: "0.06em" }}>{lang === "ar" ? "المنصة" : "PLATFORM"}</div>
        <Row lang={lang} label={lang === "ar" ? "الأذان والمؤذنون" : "Adhan & Muezzins"} onClick={() => go("adhan-center")} />
        <Row lang={lang} label={lang === "ar" ? "دون اتصال والمزامنة" : "Offline & Sync"} onClick={() => go("offline-sync")} />
        <Row lang={lang} label={lang === "ar" ? "التحقق والنزاهة" : "Verification & Integrity"} onClick={() => go("verification")} />
        <Row lang={lang} label={lang === "ar" ? "أجهزة سكينة" : "Sakinah Surfaces"} onClick={() => go("devices")} />
        <Row lang={lang} label={lang === "ar" ? "سكينة عالمياً" : "Sakinah Global"} onClick={() => go("global-product")} />
        <Row lang={lang} label={lang === "ar" ? "الأمن وإدارة المحتوى" : "Security & Content Ops"} onClick={() => go("security-admin")} />
        <Row lang={lang} label={lang === "ar" ? "البدء والانتقال" : "Onboarding & Migration"} onClick={() => go("onboarding")} />

        <div style={{ marginTop: 26, paddingTop: 4, fontSize: 10.5, fontWeight: 600, opacity: 0.4, letterSpacing: "0.06em" }}>{t.privacy}</div>
        <Row lang={lang} label={t.privacy} onClick={() => go("me-privacy")} />
      </div>
    </div>
  );
}

function PrayerSettingsScreen({ lang, go }) {
  const t = STRINGS[lang];
  const [calc, setCalc] = useState(0);
  const [asr, setAsr] = useState("standard");
  const [hlr, setHlr] = useState(0);
  const [locMode, setLocMode] = useState("automatic");
  const [locStatus, setLocStatus] = useState("unknown");
  const [adj, setAdj] = useState({ fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 });

  const useLocation = () => {
    setLocStatus("checking");
    if (!navigator.geolocation) { setLocStatus("denied"); return; }
    navigator.geolocation.getCurrentPosition(() => setLocStatus("granted"), () => setLocStatus("denied"), { timeout: 5000 });
  };
  const locLabel = { unknown: t.locUnknown, checking: t.locChecking, granted: t.locGranted, denied: t.locDenied }[locStatus];

  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 22px 6px" }}>
        <BackBtn lang={lang} onClick={() => go("me")} /><div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{t.prayerSettings}</div><div style={{ width: 26 }} />
      </div>
      <div className="sk-scroll" style={{ flex: 1, overflowY: "auto", padding: "10px 24px 130px" }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.4, marginTop: 14, marginBottom: 4 }}>{t.calcMethod}</div>
        {CALC_METHODS.map((m, i) => <Row key={m} lang={lang} first={i === 0} label={m} right={calc === i ? <Check size={15} color={COLOR.goldDeep} /> : null} onClick={() => setCalc(i)} />)}

        <div style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.4, marginTop: 22, marginBottom: 4 }}>{t.asrMethod}</div>
        <Row lang={lang} first label={t.standard} right={asr === "standard" ? <Check size={15} color={COLOR.goldDeep} /> : null} onClick={() => setAsr("standard")} />
        <Row lang={lang} label={t.hanafi} right={asr === "hanafi" ? <Check size={15} color={COLOR.goldDeep} /> : null} onClick={() => setAsr("hanafi")} />

        <div style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.4, marginTop: 22, marginBottom: 4 }}>{t.highLatRule}</div>
        {HIGH_LAT_RULES[lang].map((r, i) => <Row key={r} lang={lang} first={i === 0} label={r} right={hlr === i ? <Check size={15} color={COLOR.goldDeep} /> : null} onClick={() => setHlr(i)} />)}

        <div style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.4, marginTop: 22, marginBottom: 4 }}>{t.locationMode}</div>
        <Row lang={lang} first label={t.automatic} right={locMode === "automatic" ? <Check size={15} color={COLOR.goldDeep} /> : null} onClick={() => setLocMode("automatic")} />
        <Row lang={lang} label={t.manual} right={locMode === "manual" ? <Check size={15} color={COLOR.goldDeep} /> : null} onClick={() => setLocMode("manual")} />
        <Row lang={lang} label={t.useMyLocation} sub={locLabel} onClick={useLocation} right={<MapPin size={15} opacity={0.4} />} />

        <div style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.4, marginTop: 22, marginBottom: 4 }}>{t.minuteAdjust}</div>
        {Object.keys(adj).map((k, i) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid rgba(16,16,15,0.08)" }}>
            <span style={{ fontSize: 13.5 }}>{NAMES[k][lang]}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button onClick={() => setAdj((a) => ({ ...a, [k]: a[k] - 1 }))} style={{ background: "none", border: "1px solid rgba(16,16,15,0.15)", borderRadius: 6, width: 24, height: 24, cursor: "pointer", color: "inherit" }}>–</button>
              <span style={{ fontSize: 12, width: 20, textAlign: "center" }}>{nDigits(adj[k], lang)}</span>
              <button onClick={() => setAdj((a) => ({ ...a, [k]: a[k] + 1 }))} style={{ background: "none", border: "1px solid rgba(16,16,15,0.15)", borderRadius: 6, width: 24, height: 24, cursor: "pointer", color: "inherit" }}>+</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccessibilityScreen({ lang, go, a11y, setA11y }) {
  const t = STRINGS[lang];
  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 22px 6px" }}>
        <BackBtn lang={lang} onClick={() => go("me")} /><div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{t.accessibility}</div><div style={{ width: 26 }} />
      </div>
      <div className="sk-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px 24px 130px" }}>
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 13, marginBottom: 10 }}>{t.quranTextSize}</div>
          <input className="sk-slider" type="range" min={0.8} max={1.6} step={0.05} value={a11y.quranScale} onChange={(e) => setA11y((s) => ({ ...s, quranScale: parseFloat(e.target.value) }))} style={{ width: "100%" }} />
          <div className="font-quran" style={{ fontSize: 22 * a11y.quranScale, marginTop: 12, direction: "rtl" }}>بِسْمِ اللَّهِ</div>
        </div>
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 13, marginBottom: 10 }}>{t.uiTextSize}</div>
          <input className="sk-slider" type="range" min={0.9} max={1.3} step={0.05} value={a11y.uiScale} onChange={(e) => setA11y((s) => ({ ...s, uiScale: parseFloat(e.target.value) }))} style={{ width: "100%" }} />
        </div>
        <Row lang={lang} first label={t.highContrast} right={<Switch on={a11y.highContrast} onChange={() => setA11y((s) => ({ ...s, highContrast: !s.highContrast }))} />} />
        <Row lang={lang} label={t.simplifiedMode} right={<Switch on={a11y.simplified} onChange={() => setA11y((s) => ({ ...s, simplified: !s.simplified }))} />} />
      </div>
    </div>
  );
}

function NotificationsScreen({ lang, go }) {
  const t = STRINGS[lang];
  const [n, setN] = useState({ prayer: true, cont: true, morning: false, evening: true, friday: true, downloads: false });
  const rows = [
    { k: "prayer", l: t.notifPrayer }, { k: "cont", l: t.notifContinue }, { k: "morning", l: t.notifMorning },
    { k: "evening", l: t.notifEvening }, { k: "friday", l: t.notifFriday }, { k: "downloads", l: t.notifDownloads },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 22px 6px" }}>
        <BackBtn lang={lang} onClick={() => go("me")} /><div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{t.notifications}</div><div style={{ width: 26 }} />
      </div>
      <div className="sk-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px 24px 130px" }}>
        {rows.map((r, i) => (
          <div key={r.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderTop: i === 0 ? "none" : "1px solid rgba(16,16,15,0.08)" }}>
            <span style={{ fontSize: 14 }}>{r.l}</span>
            <Switch on={n[r.k]} onChange={() => setN((s) => ({ ...s, [r.k]: !s[r.k] }))} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   PRIVACY CENTER — one accordion row per data category:
   why it's needed, where it's processed, what is stored, how to delete it.
════════════════════════════════════════════════════════════════ */
function PrivacyScreen({ lang, go }) {
  const t = STRINGS[lang];
  const [msg, setMsg] = useState("");
  const [openId, setOpenId] = useState(null);
  const items = [
    { id: "location", label: t.privLocation, why: lang === "ar" ? "لحساب اتجاه القبلة ووقت الصلاة بدقة." : "To calculate accurate Qibla direction and prayer times.", where: lang === "ar" ? "على جهازك فقط." : "On your device only.", what: lang === "ar" ? "الإحداثيات الحالية عند الطلب." : "Current coordinates, only when requested." },
    { id: "notif", label: t.privNotif, why: lang === "ar" ? "لتذكيرك بالصلاة والأذكار حسب اختيارك." : "To remind you about prayer and adhkār you've opted into.", where: lang === "ar" ? "على جهازك." : "On your device.", what: lang === "ar" ? "تفضيلات التصنيفات فقط." : "Category preferences only." },
    { id: "history", label: t.privHistory, why: lang === "ar" ? "لمتابعة قراءتك من حيث توقفت." : "To resume your Qur'an reading where you left off.", where: lang === "ar" ? "على جهازك." : "On your device.", what: lang === "ar" ? "موضع القراءة والمحفوظات." : "Reading position and bookmarks." },
    { id: "cloud", label: t.privCloud, why: lang === "ar" ? "غير مفعّلة — سكينة تعمل بالكامل محليًا." : "Not active — Sakinah works fully offline.", where: "—", what: lang === "ar" ? "لا شيء يُرسل حاليًا." : "Nothing is sent at this time." },
    { id: "family", label: t.privFamily, why: t.familyNote, where: lang === "ar" ? "على جهازك." : "On your device.", what: lang === "ar" ? "لا بيانات مشتركة تلقائيًا." : "No data shared automatically." },
    { id: "ai", label: t.privAI, why: lang === "ar" ? "لتنظيم الصفحة الرئيسية حسب الوقت والسياق." : "To organize Today around time and context.", where: lang === "ar" ? "على جهازك، دون إرسال بيانات." : "On your device, no data leaves it.", what: lang === "ar" ? "لا استنتاجات نفسية أو دينية تُبنى من سلوكك." : "No emotional or religious conclusions are drawn from your behaviour." },
    { id: "downloads", label: t.privDownloads, why: lang === "ar" ? "للقراءة والاستماع دون اتصال." : "For offline reading and listening.", where: lang === "ar" ? "على جهازك." : "On your device.", what: lang === "ar" ? "الملفات التي تختار تنزيلها." : "Files you choose to download." },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 22px 6px" }}>
        <BackBtn lang={lang} onClick={() => go("me")} /><div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{t.privacy}</div><div style={{ width: 26 }} />
      </div>
      <div className="sk-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px 24px 130px" }}>
        {items.map((it, i) => (
          <div key={it.id} style={{ borderTop: i === 0 ? "none" : "1px solid rgba(16,16,15,0.08)" }}>
            <button onClick={() => setOpenId(openId === it.id ? null : it.id)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: "13px 0", cursor: "pointer", color: "inherit", textAlign: lang === "ar" ? "right" : "left" }}>
              <span style={{ fontSize: 14 }}>{it.label}</span>
              {lang === "ar" ? <ChevronLeft size={14} opacity={0.35} style={{ transform: openId === it.id ? "rotate(-90deg)" : "none", transition: "transform .3s ease" }} /> : <ChevronRight size={14} opacity={0.35} style={{ transform: openId === it.id ? "rotate(90deg)" : "none", transition: "transform .3s ease" }} />}
            </button>
            {openId === it.id && (
              <div style={{ paddingBottom: 16, fontSize: 11.5, lineHeight: 1.7 }}>
                <div style={{ opacity: 0.55 }}><b style={{ opacity: 0.4 }}>{t.why}:</b> {it.why}</div>
                <div style={{ opacity: 0.55 }}><b style={{ opacity: 0.4 }}>{t.where}:</b> {it.where}</div>
                <div style={{ opacity: 0.55 }}><b style={{ opacity: 0.4 }}>{t.what}:</b> {it.what}</div>
              </div>
            )}
          </div>
        ))}
        <div style={{ marginTop: 20, display: "flex", gap: 20 }}>
          <button onClick={() => setMsg(t.exported)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, opacity: 0.55, color: "inherit" }}>{t.exportData}</button>
          <button onClick={() => setMsg(t.deleted)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, opacity: 0.55, color: "inherit" }}>{t.deleteData}</button>
        </div>
        {msg && <div style={{ fontSize: 11.5, opacity: 0.5, marginTop: 8 }}>{msg}</div>}
        <div style={{ marginTop: 26, fontSize: 10.5, fontWeight: 600, opacity: 0.4 }}>{t.localData}</div>
        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.55 }}><span style={{ color: COLOR.goldDeep, fontWeight: 600 }}>{t.offlineCore}</span> — {t.offlineCoreList}</div>
        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.4 }}><span style={{ fontWeight: 600 }}>{t.offlineOnline}</span> — {t.offlineOnlineList}</div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   HAJJ / UMRAH COMPANION — guided stage journey
════════════════════════════════════════════════════════════════ */
function JourneyScreen({ lang, go, kind }) {
  const t = STRINGS[lang];
  const stages = kind === "hajj" ? HAJJ_STAGES : UMRAH_STAGES;
  const [i, setI] = useState(0);
  const s = stages[i];
  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 22px 6px" }}>
        <BackBtn lang={lang} onClick={() => go("discover")} />
        <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{kind === "hajj" ? t.hajj : t.umrah}</div>
        <div style={{ width: 26 }} />
      </div>
      <div className="sk-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "16px 24px 4px" }}>
        {stages.map((st, idx) => (
          <button key={st.id} onClick={() => setI(idx)} style={{
            flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: "6px 0",
            fontSize: 12.5, fontWeight: idx === i ? 600 : 400, opacity: idx === i ? 1 : idx < i ? 0.4 : 0.55,
            color: idx === i ? COLOR.goldDeep : "inherit", borderBottom: idx === i ? `1.5px solid ${COLOR.gold}` : "1.5px solid transparent",
            marginInlineEnd: 20,
          }}>{lang === "ar" ? st.ar : st.en}</button>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 30px 100px" }}>
        <div className="font-editorial" style={{ fontSize: lang === "ar" ? 30 : 26, textAlign: "center", marginBottom: 14 }}>{lang === "ar" ? s.ar : s.en}</div>
        <div style={{ fontSize: 14, opacity: 0.6, textAlign: "center", lineHeight: 1.7, maxWidth: 300, margin: "0 auto" }}>{lang === "ar" ? s.d_ar : s.d_en}</div>
        <div style={{ fontSize: 11, opacity: 0.35, textAlign: "center", marginTop: 26, lineHeight: 1.6, maxWidth: 280, margin: "26px auto 0" }}>{t.guidanceNote}</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36 }}>
          <button onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} style={{ background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", opacity: i === 0 ? 0.2 : 0.6, color: "inherit" }}>{lang === "ar" ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}</button>
          <span style={{ fontSize: 11, opacity: 0.4, alignSelf: "center" }}>{nDigits(i + 1, lang)} {t.ayahOf} {nDigits(stages.length, lang)}</span>
          <button onClick={() => setI((v) => Math.min(stages.length - 1, v + 1))} disabled={i === stages.length - 1} style={{ background: "none", border: "none", cursor: i === stages.length - 1 ? "default" : "pointer", opacity: i === stages.length - 1 ? 0.2 : 0.6, color: "inherit" }}>{lang === "ar" ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   FAMILY — private by default, nothing fabricated or shared
════════════════════════════════════════════════════════════════ */
function FamilyScreen({ lang, go }) {
  const t = STRINGS[lang];
  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 22px 6px" }}>
        <BackBtn lang={lang} onClick={() => go("me")} /><div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{t.family}</div><div style={{ width: 26 }} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
        <div className="font-editorial" style={{ fontSize: lang === "ar" ? 26 : 22, marginBottom: 12 }}>{t.family}</div>
        <div style={{ fontSize: 13, opacity: 0.55, maxWidth: 260, lineHeight: 1.7 }}>{t.familyNote}</div>
        <div style={{ fontSize: 12, opacity: 0.35, marginTop: 20 }}>{t.familyEmpty}</div>
      </div>
    </div>
  );
}

function WidgetsScreen({ lang, go, stage, nextPrayer, prayerTimes }) {
  const t = STRINGS[lang];
  const isDark = stage.dark;
  const mini = (title, children) => (
    <div style={{ width: 150, flexShrink: 0 }}>
      <div style={{ width: 150, height: 150, borderRadius: 18, background: `linear-gradient(180deg, ${stage.from}, ${stage.to})`, color: isDark ? COLOR.ivory : COLOR.ink, padding: 14, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>{children}</div>
      <div style={{ fontSize: 11, opacity: 0.5, marginTop: 8, textAlign: "center" }}>{title}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 22px 6px" }}>
        <BackBtn lang={lang} onClick={() => go("me")} /><div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{t.widgets}</div><div style={{ width: 26 }} />
      </div>
      <div style={{ padding: "20px 24px", fontSize: 11.5, opacity: 0.42 }}>{t.conceptPreview}</div>
      <div className="sk-scroll" style={{ display: "flex", gap: 16, overflowX: "auto", padding: "0 24px 130px" }}>
        {mini(t.widgetPrayer, <><div style={{ fontSize: 10, opacity: 0.6 }}>{NAMES[nextPrayer.id][lang]}</div><div style={{ fontFamily: "'Fraunces', serif", fontSize: 24 }}>{fmtHM(nextPrayer.h, lang)}</div></>)}
        {mini(t.widgetArc, <DayArc hourNow={13} lang={lang} compact isDark={isDark} prayerTimes={prayerTimes} />)}
        {mini(t.widgetQuran, <><BookOpen size={16} opacity={0.7} /><div style={{ fontSize: 10.5, opacity: 0.7 }}>{t.quranHomeContinue}</div></>)}
      </div>
    </div>
  );
}



/* ════════════════════════════════════════════════════════════════
   SAKINAH EXPANSION REGISTRY — product systems added on top of
   the original Claude prototype. No religious body text is invented;
   source-dependent systems expose honest dependency states.
════════════════════════════════════════════════════════════════ */
const EXPANDED_WORLDS = {
  worship: [
    ["adhan-center", "الأذان والمؤذنون", "Adhan & Muezzins"],
    ["quran-platform", "منصة القرآن", "Quran Platform"],
    ["dua-center", "الدعاء", "Du'a"],
    ["learning", "الطهارة والصلاة", "Wudu & Prayer Learning"],
    ["fasting", "الصيام", "Fasting"],
  ],
  knowledge: [
    ["trust-center", "المصادر والثقة", "Trust & Sources"],
    ["tafsir-hadith", "التفسير والحديث", "Tafsir & Hadith"],
    ["scholar", "وضع طالب العلم", "Scholar Mode"],
    ["archive", "ذاكرة الحضارة", "Sakinah Archive"],
  ],
  life: [
    ["life-center", "الحياة", "Life"],
    ["mosque", "المسجد", "Mosque"],
    ["kids", "سكينة للأطفال", "Sakinah Kids"],
    ["calendar-zakat", "الهجري والزكاة", "Hijri & Zakat"],
    ["sacred", "الوضع الهادئ", "Sacred Mode"],
  ],
  platform: [
    ["intelligence", "سكينة الذكية", "Sakinah Intelligence"],
    ["offline-sync", "دون اتصال والمزامنة", "Offline & Sync"],
    ["verification", "التحقق والنزاهة", "Verification"],
    ["devices", "الساعة والودجت والسيارة", "Watch, Widgets & Car"],
  ],
};

const SOURCE_STATUS = {
  verified: { ar: "موثّق", en: "Verified" },
  local: { ar: "محلي", en: "Local" },
  adapter: { ar: "بانتظار مزود موثوق", en: "Trusted provider required" },
  device: { ar: "يتطلب اختبار جهاز Android", en: "Android device validation required" },
};

const FeatureStatus = ({ lang, status = "adapter" }) => {
  const x = SOURCE_STATUS[status] || SOURCE_STATUS.adapter;
  return <span style={{ fontSize: 9.5, opacity: 0.48, border: "1px solid rgba(16,16,15,.12)", borderRadius: 20, padding: "3px 7px" }}>{x[lang]}</span>;
};

function EditorialHub({ lang, go, titleAr, titleEn, introAr, introEn, sections }) {
  const title = lang === "ar" ? titleAr : titleEn;
  const intro = lang === "ar" ? introAr : introEn;
  return (
    <div style={{ position: "absolute", inset: 0, background: COLOR.ivory, color: COLOR.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "24px 24px 0" }}><BackBtn lang={lang} onClick={() => go("discover")} /></div>
      <div className="sk-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px 24px 130px" }}>
        <div className="font-editorial" style={{ fontSize: lang === "ar" ? 30 : 27, lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontSize: 12.5, opacity: .54, lineHeight: 1.75, marginTop: 10, maxWidth: 330 }}>{intro}</div>
        {sections.map((sec, si) => (
          <div key={sec.id || si} style={{ marginTop: 30 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", opacity: .38, marginBottom: 7 }}>{lang === "ar" ? sec.ar : sec.en}</div>
            {sec.items.map((it, i) => (
              <div key={it.id || i} onClick={it.go ? () => go(it.go, it.param || {}) : undefined} style={{ padding: i === 0 ? "15px 0" : "13px 0", borderTop: "1px solid rgba(16,16,15,.08)", cursor: it.go ? "pointer" : "default" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: i === 0 && sec.featured ? 17 : 14, fontWeight: i === 0 && sec.featured ? 600 : 500 }}>{lang === "ar" ? it.ar : it.en}</div>
                    {it.subAr && <div style={{ fontSize: 11.5, opacity: .45, marginTop: 4, lineHeight: 1.5 }}>{lang === "ar" ? it.subAr : it.subEn}</div>}
                  </div>
                  <FeatureStatus lang={lang} status={it.status || "adapter"} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdhanCenter({ lang, go }) {
  const [prayer, setPrayer] = useState("fajr");
  const [mode, setMode] = useState("full");
  const [previewing, setPreviewing] = useState(false);
  const [selected, setSelected] = useState(0);
  const muezzins = [
    { ar: "تسجيل تجريبي مرخّص مطلوب", en: "Licensed development recording required", originAr: "لا يتم شحن صوت غير مرخّص", originEn: "No unlicensed recording is shipped" },
    { ar: "مؤذن المسجد المختار", en: "My Mosque muezzin", originAr: "يتطلب بيانات مسجد موثّقة", originEn: "Requires verified mosque data" },
  ];
  const prayers = ["fajr","dhuhr","asr","maghrib","isha"];
  return (
    <EditorialHub lang={lang} go={go} titleAr="الأذان والمؤذنون" titleEn="Adhan & Muezzins"
      introAr="محرك مستقل للأذان، إعداد لكل صلاة، معاينة وتنزيل، مع احترام قيود Android والصوت وعدم شحن أي تسجيل بلا حق استخدام."
      introEn="A dedicated Adhan engine with per-prayer settings, preview/download architecture and strict licensing/system-audio boundaries."
      sections={[
        { id:"per-prayer", ar:"لكل صلاة", en:"PER PRAYER", featured:true, items: prayers.map(p => ({ id:p, ar:NAMES[p].ar, en:NAMES[p].en, subAr: prayer===p ? "الصلاة المحددة حالياً" : "اختيار صوت مستقل", subEn: prayer===p ? "Currently selected" : "Independent audio choice", status:"local" })) },
        { id:"muezzins", ar:"المؤذنون", en:"MUEZZINS", items:muezzins.map((m,i)=>({ id:i, ar:m.ar, en:m.en, subAr:m.originAr, subEn:m.originEn, status:i===0?"adapter":"adapter" })) },
        { id:"behaviour", ar:"سلوك الأذان", en:"BEHAVIOUR", items:[
          { ar:"كامل / قصير / إشعار فقط / إيقاف", en:"Full / short / notification / off", status:"device" },
          { ar:"Bluetooth · سماعات · مكالمات · DND", en:"Bluetooth · headset · calls · DND", status:"device" },
          { ar:"إعادة الجدولة بعد إعادة التشغيل", en:"Reschedule after reboot", status:"device" },
        ]},
      ]} />
  );
}

function QuranPlatform({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="منصة القرآن" titleEn="Quran Platform"
    introAr="المصحف يبقى قلب سكينة: قراءة، استماع، حفظ، تجويد، تفاسير، ترجمات، روايات، ملاحظات، بحث عميق واستمرار خاص محلياً."
    introEn="The Qur'an remains Sakinah's core: reading, audio, memorization, Tajweed, Tafsir, translations, readings, notes and private continuity."
    sections={[
      { id:"read", ar:"المصحف", en:"MUSHAF", featured:true, items:[
        { ar:"وضع الصفحة الموثّق", en:"Authoritative Mushaf page mode", subAr:"لا يعاد تركيب الصفحة دون Dataset معتمد", subEn:"Never reconstruct canonical pages without an authoritative dataset", status:"adapter" },
        { ar:"وضع القراءة المرن", en:"Accessible reflow reading", subAr:"تكبير النص مع الحفاظ على الرسم", subEn:"Scalable reading without altering Quran text", status:"local", go:"quran-home" },
        { ar:"الأجزاء والأحزاب والسجدات", en:"Juz · Hizb · Sajdah metadata", status:"adapter" },
      ]},
      { id:"audio", ar:"الاستماع والحفظ", en:"AUDIO & MEMORIZATION", items:[
        { ar:"مكتبة القرّاء", en:"Reciter library", subAr:"المصدر والترخيص والجودة والتنزيل", subEn:"Source, license, quality and offline state", status:"adapter", go:"audio" },
        { ar:"تكرار آية أو نطاق", en:"Ayah/range repetition", status:"local", go:"memorize" },
        { ar:"تسجيل تلاوتي محلياً", en:"Private recitation recording", status:"device" },
        { ar:"وضع الاستماع الهادئ", en:"Sacred Listening", status:"local", go:"audio" },
      ]},
      { id:"deep", ar:"الفهم العميق", en:"DEEP QURAN", items:[
        { ar:"التفسير والمقارنة", en:"Tafsir & comparison", status:"adapter", go:"tafsir-hadith" },
        { ar:"الجذر واللغة العربية القرآنية", en:"Roots & Quranic Arabic", status:"adapter" },
        { ar:"الآيات ذات الصلة والبحث الدلالي", en:"Related verses & semantic search", status:"adapter", go:"intelligence" },
        { ar:"الروايات والقراءات للمختصين", en:"Qira'at / Riwayat for advanced study", status:"adapter", go:"scholar" },
      ]},
    ]} />;
}

function TrustCenter({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="المصادر والثقة" titleEn="Trust & Sources"
    introAr="الثقة جزء من الواجهة. كل نتيجة دينية حساسة تعرف نوعها ومصدرها وإصدارها وحالة مراجعتها، ويمكن لسكينة الامتناع عن العرض عند غياب أساس موثوق."
    introEn="Trust is part of the interface. Every sensitive religious result carries type, provenance, version and review state, with safe abstention when evidence is insufficient."
    sections={[
      { id:"types", ar:"أنواع المحتوى", en:"CONTENT TYPES", featured:true, items:[
        { ar:"القرآن", en:"QURAN", subAr:"نص ثابت لا يولده الذكاء الاصطناعي", subEn:"Immutable text; never AI-generated", status:"verified" },
        { ar:"الحديث", en:"HADITH", subAr:"المجموعة والمرجع والتصنيف ومصدره", subEn:"Collection, reference, grade and grading source", status:"adapter" },
        { ar:"التفسير والفقه", en:"TAFSIR & FIQH", subAr:"المؤلف/المذهب/الجهة والمصدر", subEn:"Author/school/institution and source", status:"adapter" },
        { ar:"شرح مولد بالذكاء", en:"AI EXPLANATION", subAr:"يبقى منفصلاً بصرياً وتقنياً عن المصدر", subEn:"Always separate from original source text", status:"adapter" },
      ]},
      { id:"lifecycle", ar:"دورة المراجعة", en:"REVIEW LIFECYCLE", items:[
        { ar:"مسودة ← بانتظار مراجعة ← مراجع ← موثّق ← متقاعد", en:"Draft → Pending → Reviewed → Verified → Retired", status:"local" },
        { ar:"إصدارات وتوقيع وتحقق سلامة", en:"Versioning, signatures & integrity checks", status:"local", go:"verification" },
        { ar:"سجل تصحيحات شفاف", en:"Transparent correction history", status:"adapter" },
      ]},
      { id:"why", ar:"لماذا؟", en:"WHY?", items:[
        { ar:"لماذا وقت الفجر هكذا؟", en:"Why is Fajr at this time?", subAr:"يعرض الموقع والطريقة والمنطقة الزمنية والتعديل", subEn:"Show location, method, timezone and adjustment", status:"local", go:"me-prayer-settings" },
        { ar:"لماذا هذا الحديث بهذا التصنيف؟", en:"Why is this Hadith graded this way?", status:"adapter" },
        { ar:"لماذا التاريخ الهجري مختلف؟", en:"Why does the Hijri date differ?", status:"adapter", go:"calendar-zakat" },
      ]},
    ]} />;
}

function TafsirHadith({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="التفسير والحديث" titleEn="Tafsir & Hadith"
    introAr="مكتبات منفصلة بمصادر واضحة؛ لا دمج صامت ولا تلخيص يوهم بالإجماع. البحث والمقارنة يحافظان دائماً على هوية المصدر."
    introEn="Separate, provenance-first libraries. No silent blending and no generated consensus; search and comparison always preserve source identity."
    sections={[
      { id:"tafsir", ar:"التفسير", en:"TAFSIR", featured:true, items:[
        { ar:"اختيار تفسير افتراضي", en:"Choose default Tafsir", status:"adapter" },
        { ar:"مقارنة عدة تفاسير", en:"Compare selected Tafsir works", status:"adapter" },
        { ar:"تنزيل تفسير للاستخدام دون اتصال", en:"Offline Tafsir packs", status:"adapter", go:"offline-sync" },
      ]},
      { id:"hadith", ar:"الحديث", en:"HADITH", items:[
        { ar:"بحث بالنص والمرجع والموضوع", en:"Search by text, reference and topic", status:"adapter" },
        { ar:"المجموعة · الكتاب · الباب · الراوي · التصنيف", en:"Collection · book · chapter · narrator · grade", status:"adapter" },
        { ar:"تخريج مساعد للعبارة المتذكرة", en:"Assisted lookup from remembered wording", status:"adapter", go:"intelligence" },
      ]},
    ]} />;
}

function LifeCenter({ lang, go }) {
  const contexts = [
    ["السفر","Travel"],["الزواج","Marriage"],["مولود جديد","New child"],["الوفاة والجنازة","Bereavement"],["المرض","Illness"],["العمل والمال","Work & money"],["الدين والوصية","Debt & will"],["الصدقة والوقف","Charity & waqf"],["الحج","Hajj"],["العمرة","Umrah"],
  ];
  return <EditorialHub lang={lang} go={go} titleAr="الحياة" titleEn="Life"
    introAr="الحياة ليست مقالات. كل سياق يجمع أدوات ومحتوى موثوقاً ومصادر، بدون أن يحوّل الذكاء الاصطناعي الحالة الشخصية إلى فتوى."
    introEn="Life contexts are guided environments, not article folders. Tools and verified knowledge are combined without turning personal situations into AI fatwas."
    sections={[{ id:"contexts", ar:"السياقات", en:"CONTEXTS", featured:true, items:contexts.map(([ar,en])=>({ ar,en,status:"adapter" })) }]} />;
}

function MosqueCenter({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="المسجد" titleEn="Mosque"
    introAr="مسجدي امتداد للحياة اليومية وليس شبكة اجتماعية: الإقامة، الجمعة، الدروس، الحلقات، الأحداث والخدمات من جهة موثّقة، مع QR رسمي مستقبلاً."
    introEn="My Mosque is a trusted local extension, not social media: Iqamah, Friday prayer, lessons, circles, events and facilities from verified mosque sources."
    sections={[
      { id:"my", ar:"مسجدي", en:"MY MOSQUE", featured:true, items:[
        { ar:"وقت الإقامة", en:"Iqamah times", status:"adapter" },
        { ar:"الجمعة والخطبة", en:"Friday prayer & khutbah", status:"adapter" },
        { ar:"الدروس وحلقات القرآن", en:"Lessons & Quran circles", status:"adapter" },
        { ar:"مرافق الوصول والوضوء", en:"Accessibility & wudu facilities", status:"adapter" },
      ]},
      { id:"mode", ar:"وضع المسجد", en:"MOSQUE MODE", items:[
        { ar:"إضاءة أخف وإشعارات أقل", en:"Lower intensity & fewer notifications", status:"local", go:"sacred" },
        { ar:"لا تتبع عبادة ولا ترتيب أشخاص", en:"No worship tracking or rankings", status:"local" },
      ]},
    ]} />;
}

function KidsCenter({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="سكينة للأطفال" titleEn="Sakinah Kids"
    introAr="عالم طفل مستقل يحافظ على هوية سكينة، بلا إعلانات ولا دردشة AI مفتوحة ولا اقتصاد نقاط للعبادة."
    introEn="A dedicated child world retaining Sakinah DNA, with no ads, open-ended AI chat, or worship reward economy."
    sections={[
      { id:"learn", ar:"التعلم", en:"LEARN", featured:true, items:[
        { ar:"القرآن والحفظ", en:"Quran & memorization", status:"adapter" },
        { ar:"قصص الأنبياء بدون تصوير الأنبياء", en:"Prophet stories without depicting Prophets", status:"adapter" },
        { ar:"الصلاة والوضوء", en:"Prayer & Wudu", status:"adapter", go:"learning" },
        { ar:"العربية والأخلاق", en:"Arabic & character", status:"adapter" },
      ]},
      { id:"parent", ar:"للأسرة", en:"PARENT CONTROLS", items:[
        { ar:"ملفات طفل محلية بدون بريد", en:"Local child profiles without email", status:"local" },
        { ar:"تحكم بالمحتوى دون مراقبة العبادة", en:"Content controls without worship surveillance", status:"local" },
      ]},
    ]} />;
}

function LearningCenter({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="تعلم" titleEn="Learn"
    introAr="تعليم الوضوء والصلاة والقراءة والتجويد بمراحل واضحة ومصادر مراجعة، مع وضع مبتدئ ودعم صوتي وإمكانية وصول."
    introEn="Structured Wudu, prayer, Quran reading and Tajweed learning with reviewed sources, beginner mode, audio and accessibility."
    sections={[
      { id:"paths", ar:"المسارات", en:"PATHS", featured:true, items:[
        { ar:"تعلم الوضوء", en:"Learn Wudu", status:"adapter" },
        { ar:"تعلم الصلاة", en:"Learn Prayer", status:"adapter" },
        { ar:"قراءة القرآن", en:"Quran Reading", status:"adapter", go:"quran-platform" },
        { ar:"التجويد", en:"Tajweed", status:"adapter" },
        { ar:"العربية للقرآن", en:"Arabic for Quran", status:"adapter" },
        { ar:"لغة الإشارة ودعم القراءة", en:"Sign-language & reading accessibility", status:"adapter" },
      ]},
    ]} />;
}

function CalendarZakat({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="الهجري والزكاة" titleEn="Hijri & Zakat"
    introAr="التاريخ الهجري لا يُفترض من الذاكرة، والزكاة لا تُختصر إلى رقم غامض. كلاهما يحتاج منهجاً ومصدراً وشرحاً قابلاً للتدقيق."
    introEn="Hijri dates require a configured trusted provider; Zakat calculations require transparent methodology, inputs and source-aware differences."
    sections={[
      { id:"hijri", ar:"التقويم الهجري", en:"HIJRI CALENDAR", featured:true, items:[
        { ar:"مزود تقويم موثوق وإعداد إقليمي", en:"Trusted calendar provider & regional setting", status:"adapter" },
        { ar:"هجري/ميلادي والمناسبات الموثقة", en:"Hijri/Gregorian & verified occasions", status:"adapter" },
        { ar:"الجمعة ورمضان والعيد والحج كـ Moments", en:"Friday, Ramadan, Eid & Hajj as Moments", status:"adapter" },
      ]},
      { id:"zakat", ar:"الزكاة", en:"ZAKAT", items:[
        { ar:"حاسبة شفافة مع النصاب والمنهج", en:"Transparent Nisab/method calculator", status:"adapter" },
        { ar:"نقد وذهب وفضة وأصول أعمال", en:"Cash, gold, silver and business assets", status:"adapter" },
        { ar:"الحالات المعقدة تحال لمصدر/مختص", en:"Complex cases defer to trusted guidance", status:"adapter" },
      ]},
    ]} />;
}

function SacredModeScreen({ lang, go }) {
  const [enabled, setEnabled] = useState(true);
  return <EditorialHub lang={lang} go={go} titleAr="الوضع الهادئ" titleEn="Sacred Mode"
    introAr="عند القراءة أو الذكر أو الاستماع، التطبيق يتراجع: تنقل أقل، حركة أقل، إضاءة أهدأ، ومحتوى العبادة هو البطل."
    introEn="During Quran, Dhikr and focused listening, the app steps away: less navigation, less motion, lower visual intensity and content-first focus."
    sections={[
      { id:"state", ar:"السلوك", en:"BEHAVIOUR", featured:true, items:[
        { ar:"إخفاء العناصر غير الضرورية", en:"Hide non-essential chrome", status:"local" },
        { ar:"تقليل حركة وإضاءة الواجهة", en:"Reduce motion and luminance", status:"local" },
        { ar:"إسكات إشعارات سكينة غير المهمة", en:"Silence non-essential Sakinah notifications", status:"device" },
        { ar:"Digital Mihrab: تركيز اتجاهي هادئ", en:"Digital Mihrab: directional focus", status:"local" },
      ]},
    ]} />;
}

function IntelligenceCenter({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="سكينة الذكية" titleEn="Sakinah Intelligence"
    introAr="ليست دردشة مضافة. الأولوية دائماً: أمر داخل التطبيق ← بيانات محلية موثوقة ← استرجاع مصدر ← شرح AI معلّم بوضوح."
    introEn="Not a bolted-on chatbot. Priority is always app action → trusted local data → sourced retrieval → clearly labelled AI explanation."
    sections={[
      { id:"command", ar:"الأمر الشامل", en:"UNIVERSAL COMMAND", featured:true, items:[
        { ar:"افتح سورة الملك", en:"Open Surah Al-Mulk", status:"local", go:"search" },
        { ar:"كم باقي للمغرب؟", en:"How long until Maghrib?", status:"local", go:"search" },
        { ar:"وين القبلة؟", en:"Where is Qibla?", status:"local", go:"prayer" },
        { ar:"ابحث عن آيات حول الصبر", en:"Find verses about patience", status:"adapter", go:"search" },
      ]},
      { id:"guard", ar:"حواجز الأمان", en:"GUARDRAILS", items:[
        { ar:"لا يتحول إلى مفتي", en:"Never acts as a Mufti", status:"local" },
        { ar:"الامتناع عند ضعف المصدر", en:"Abstain when evidence is insufficient", status:"local" },
        { ar:"كل فقرة AI تربط بمصادرها", en:"Every AI claim maps to supporting sources", status:"adapter", go:"trust-center" },
        { ar:"أوضاع الخصوصية: محلي / سحابة موثوقة / AI off", en:"Privacy modes: local / trusted cloud / AI off", status:"local" },
      ]},
      { id:"voice-lens", ar:"الصوت والعدسة", en:"VOICE & LENS", items:[
        { ar:"أوامر عربية طبيعية", en:"Natural Arabic voice commands", status:"device" },
        { ar:"التعرف على موضع آية من صفحة مصحف", en:"Recognize an Ayah location from a Mushaf page", status:"adapter" },
        { ar:"لا استنباط حكم شرعي من صورة", en:"Never infer a religious ruling from an image", status:"local" },
      ]},
    ]} />;
}

function OfflineSync({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="دون اتصال والمزامنة" titleEn="Offline & Sync"
    introAr="جوهر سكينة يعمل بدون حساب وبدون إنترنت. المزامنة اختيارية ومشفرة، ويمكن مزامنة الموضع فقط بدل رفع تاريخ القراءة كله."
    introEn="Sakinah core works without account or internet. Sync is optional/encrypted and can synchronize only the reading position instead of full history."
    sections={[
      { id:"essential", ar:"الحزمة الأساسية", en:"ESSENTIAL PACK", featured:true, items:[
        { ar:"القرآن الموثق", en:"Verified Quran", status:"adapter" },
        { ar:"حساب الصلاة والقبلة", en:"Prayer & Qibla math", status:"local" },
        { ar:"الأذكار الموثقة", en:"Verified Adhkar", status:"adapter" },
        { ar:"حج وعمرة للطوارئ", en:"Emergency Hajj/Umrah pack", status:"adapter" },
      ]},
      { id:"sync", ar:"البيانات الشخصية", en:"PERSONAL DATA", items:[
        { ar:"موضع القراءة والمحفوظات محلياً", en:"Reading position & bookmarks local-first", status:"local" },
        { ar:"تصدير / حذف / نسخ احتياطي", en:"Export / delete / backup", status:"local", go:"me-privacy" },
        { ar:"مزامنة مشفرة اختيارية", en:"Optional encrypted sync", status:"adapter" },
      ]},
      { id:"recovery", ar:"الاعتمادية", en:"RELIABILITY", items:[
        { ar:"استكمال التنزيل بعد الانقطاع", en:"Download resume/retry", status:"adapter" },
        { ar:"Low-bandwidth / Data Saver", en:"Low-bandwidth / Data Saver", status:"adapter" },
        { ar:"Crash recovery واستعادة الموضع", en:"Crash recovery & state restoration", status:"local" },
      ]},
    ]} />;
}

function VerificationCenter({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="التحقق والنزاهة" titleEn="Verification & Integrity"
    introAr="طبقة أمان للمحتوى الديني والحسابات: إصدارات، checksums، توقيع، rollback، سجل مراجعة، ورفض صامت أقلّ ما يمكن عند الشك."
    introEn="A safety layer for religious datasets and calculations: versions, checksums, signatures, rollback, audit trails and safe failure under uncertainty."
    sections={[
      { id:"integrity", ar:"سلامة البيانات", en:"DATA INTEGRITY", featured:true, items:[
        { ar:"توقيع حزم القرآن والحديث والتفسير", en:"Cryptographic signing for religious packs", status:"adapter" },
        { ar:"كشف التلف والإصدار الخاطئ", en:"Corruption/version mismatch detection", status:"local" },
        { ar:"Rollback لآخر نسخة موثوقة", en:"Rollback to last trusted version", status:"local" },
        { ar:"إيقاف حزمة خارجية متضررة دون تعطيل Core", en:"Remote disable of bad external packs without killing core", status:"adapter" },
      ]},
      { id:"qa", ar:"اختبارات مرجعية", en:"REFERENCE QA", items:[
        { ar:"الصلاة: مناطق زمنية وDST وخطوط عرض عليا", en:"Prayer: timezones, DST, high latitudes", status:"adapter" },
        { ar:"القبلة: bearing وتطبيع الاتجاه والحساس", en:"Qibla: bearing, heading normalization, sensor states", status:"device" },
        { ar:"RTL/LTR وإمكانية الوصول والأجهزة الضعيفة", en:"RTL/LTR, accessibility and low-end devices", status:"device" },
      ]},
    ]} />;
}

function ScholarCenter({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="وضع طالب العلم" titleEn="Scholar Mode"
    introAr="Workspace اختياري للتابلت والمختصين: آية، تفاسير، أحاديث، جذور، ملاحظات ومراجع جنباً إلى جنب دون تعقيد المستخدم العادي."
    introEn="An optional tablet/advanced workspace combining Ayah, Tafsir, Hadith, roots, notes and bibliography without burdening ordinary users."
    sections={[{ id:"tools", ar:"الأدوات", en:"TOOLS", featured:true, items:[
      { ar:"مقارنة التفاسير", en:"Tafsir comparison", status:"adapter", go:"tafsir-hadith" },
      { ar:"ملاحظات وروابط شخصية", en:"Private notes & cross-references", status:"local" },
      { ar:"إسناد ومراجع", en:"Isnad & bibliography", status:"adapter" },
      { ar:"Multi-window وKeyboard shortcuts", en:"Multi-window & keyboard shortcuts", status:"device" },
    ]}]} />;
}

function ArchiveCenter({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="ذاكرة الحضارة" titleEn="Sakinah Archive"
    introAr="السيرة والتاريخ والمخطوطات والعمارة والمدن والعلماء ضمن Timeline وMap ومصادر، لا كـFeed ولا كخيال بصري."
    introEn="Seerah, history, manuscripts, architecture, cities and scholars connected through sourced timelines and maps—not a social feed or invented reconstruction."
    sections={[{ id:"archive", ar:"الأرشيف", en:"ARCHIVE", featured:true, items:[
      { ar:"خط زمني للسيرة", en:"Seerah timeline", status:"adapter" },
      { ar:"أطلس التاريخ الإسلامي", en:"Islamic history atlas", status:"adapter" },
      { ar:"مخطوطات وكتب مرخصة", en:"Licensed manuscripts & books", status:"adapter" },
      { ar:"Time Machine: سياق زماني ومكاني موثق", en:"Time Machine: sourced temporal/spatial context", status:"adapter" },
    ]}]} />;
}

function FastingCenter({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="الصيام" titleEn="Fasting"
    introAr="رمضان وما يختاره المستخدم من صيام آخر، بدون افتراض أنه صائم وبدون حسابات دينية غير موثقة."
    introEn="Ramadan and user-selected fasting contexts without inferring that a person is fasting or inventing religious timing data."
    sections={[{ id:"fast", ar:"السياقات", en:"CONTEXTS", featured:true, items:[
      { ar:"رمضان", en:"Ramadan", status:"adapter" },
      { ar:"الأيام البيض والاثنين والخميس", en:"White days, Monday & Thursday", status:"adapter" },
      { ar:"عرفة وعاشوراء والست من شوال", en:"Arafah, Ashura & six of Shawwal", status:"adapter" },
      { ar:"السحور والإفطار من تقويم موثوق", en:"Suhoor/Iftar from trusted calendar/prayer data", status:"adapter" },
    ]}]} />;
}

function DuaCenter({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="الدعاء" titleEn="Du'a"
    introAr="أدعية القرآن والسنة بالمصدر، بحث حسب المناسبة والمعنى، واستماع وحفظ، مع مساحة منفصلة تماماً للدعاء الشخصي."
    introEn="Quranic and Prophetic Du'a with provenance, occasion/meaning search, audio/saving, and a clearly separate private personal-dua space."
    sections={[
      { id:"source", ar:"المأثور", en:"SOURCED DU'A", featured:true, items:[
        { ar:"أدعية القرآن", en:"Quranic Du'a", status:"adapter" },
        { ar:"الأدعية الصحيحة من السنة", en:"Authenticated Prophetic Du'a", status:"adapter" },
        { ar:"حسب المناسبة والمعنى", en:"By occasion & meaning", status:"adapter" },
      ]},
      { id:"personal", ar:"خاص", en:"PRIVATE", items:[
        { ar:"دعائي الشخصي — محلي ومفصول عن النصوص المأثورة", en:"My personal Du'a — local and visually separate from sourced text", status:"local" },
      ]},
    ]} />;
}



function CommunityCenter({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="المجتمع النافع" titleEn="Beneficial Community"
    introAr="تنسيق منفعة بدون Social Media: ختمات، حلقات، مبادرات مسجد وصدقة وتعليم، بلا Followers أو Likes أو Feed إدماني أو ترتيب عبادة."
    introEn="Coordination without social media: Quran circles, mosque initiatives, charity and learning—with no followers, likes, addictive feed or worship rankings."
    sections={[
      { id:"community", ar:"التعاون", en:"COORDINATION", featured:true, items:[
        { ar:"ختمة جماعية باختيار المشاركين", en:"Optional group Khatmah", status:"adapter" },
        { ar:"حلقة قرآن خاصة ومعلم", en:"Private Quran circle & teacher", status:"adapter" },
        { ar:"مبادرات المسجد", en:"Mosque initiatives", status:"adapter", go:"mosque" },
        { ar:"مشاريع صدقة موثقة", en:"Verified charity initiatives", status:"adapter" },
      ]},
      { id:"guard", ar:"غير موجود عمداً", en:"INTENTIONALLY ABSENT", items:[
        { ar:"لا Followers ولا Like counts", en:"No followers or like counts", status:"local" },
        { ar:"لا Feed خوارزمي", en:"No algorithmic feed", status:"local" },
        { ar:"لا مقارنة عبادة", en:"No worship comparison", status:"local" },
      ]},
    ]} />;
}

function JourneyServices({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="السفر والحرمين" titleEn="Travel & Haramain"
    introAr="خدمات سفر ومكة والمدينة والحج والعمرة تعمل قدر الإمكان Offline، وتستخدم بيانات رسمية/موثوقة للمواقع والخدمات ولا تستنتج الحالة الشرعية من GPS."
    introEn="Travel, Makkah, Madinah, Hajj and Umrah services are offline-minded, use official/verified location data and never infer religious status from GPS."
    sections={[
      { id:"travel", ar:"السفر", en:"TRAVEL", featured:true, items:[
        { ar:"مدن محفوظة ومواقيت متعددة", en:"Saved cities & multi-location prayer times", status:"adapter" },
        { ar:"Flight/Timezone transition awareness", en:"Flight/timezone transition awareness", status:"device" },
        { ar:"حزمة سفر مسبقة التنزيل", en:"Pre-trip offline pack", status:"adapter", go:"offline-sync" },
      ]},
      { id:"haramain", ar:"مكة والمدينة", en:"MAKKAH & MADINAH", items:[
        { ar:"خرائط وخدمات وأبواب من مصادر رسمية", en:"Maps, gates & services from official sources", status:"adapter" },
        { ar:"معلومات ازدحام فقط عند توفر مصدر حي موثوق", en:"Crowd information only from trusted live providers", status:"adapter" },
        { ar:"إرشاد حج وعمرة Offline", en:"Offline Hajj/Umrah guidance", status:"adapter", go:"hajj" },
        { ar:"Lost Mode بمشاركة موقع مؤقتة وصريحة", en:"Lost Mode with explicit temporary location sharing", status:"adapter" },
        { ar:"بطاقة طوارئ اختيارية ومشفرة", en:"Optional encrypted emergency card", status:"local" },
      ]},
      { id:"qibla", ar:"القبلة", en:"QIBLA", items:[
        { ar:"Sensor + Map + bearing رقمي", en:"Sensor + Map + numeric bearing", status:"device", go:"prayer" },
        { ar:"AR اختيارية وليست المصدر الأساسي", en:"Optional AR, never the primary precision source", status:"device" },
      ]},
    ]} />;
}

function FinanceInheritance({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="المال والمعاملات" titleEn="Money & Transactions"
    introAr="معرفة مالية إسلامية موثقة، زكاة وديون ووصية وميراث كأدوات تعليمية شفافة، مع فصل الفتوى والقانون المحلي عن الحساب الآلي."
    introEn="Sourced Islamic finance knowledge with transparent educational tools for Zakat, debt, wills and inheritance, separating automated calculation from fatwa and local law."
    sections={[
      { id:"money", ar:"المال", en:"MONEY", featured:true, items:[
        { ar:"الزكاة والنصاب", en:"Zakat & Nisab", status:"adapter", go:"calendar-zakat" },
        { ar:"الدين والعقود والعمل", en:"Debt, contracts & work", status:"adapter" },
        { ar:"الصدقة والوقف", en:"Charity & Waqf", status:"adapter" },
        { ar:"المعاملات والتمويل كمحتوى تعليمي", en:"Transactions & finance as educational content", status:"adapter" },
      ]},
      { id:"inherit", ar:"الميراث والوصية", en:"INHERITANCE & WILL", items:[
        { ar:"حاسبة تعليمية Rule Engine مدققة فقط", en:"Audited rule-engine educational calculator only", status:"adapter" },
        { ar:"اختلاف المذهب والقانون المحلي ظاهر", en:"School and local-law differences are explicit", status:"adapter" },
        { ar:"الوصية الخاصة مشفرة ولا يدّعي التطبيق صلاحيتها القانونية", en:"Private encrypted will notes without claiming legal validity", status:"local" },
      ]},
    ]} />;
}

function GlobalProduct({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="سكينة عالمياً" titleEn="Sakinah Global"
    introAr="التوسع العالمي لا يعني ترجمة النصوص فقط: لغات واتجاهات ومصادر إقليمية وتقويم وحساب صلاة وحقوق محتوى وأجهزة ضعيفة بدون Forks منفصلة."
    introEn="Global expansion is not mere translation: languages, regional sources, calendars, prayer methods, content rights and low-end devices share one product architecture."
    sections={[
      { id:"localize", ar:"اللغات", en:"LOCALIZATION", featured:true, items:[
        { ar:"العربية أولاً والإنجليزية كاملة", en:"Arabic-first, complete English", status:"local" },
        { ar:"Urdu · Bahasa · Turkish · French وغيرها", en:"Urdu · Bahasa · Turkish · French and more", status:"adapter" },
        { ar:"Transliteration اختياري لغير العربي", en:"Optional transliteration for non-Arabic users", status:"adapter" },
      ]},
      { id:"regions", ar:"الأقاليم", en:"REGIONALIZATION", items:[
        { ar:"حزم العراق/الخليج/إندونيسيا/تركيا بدون Fork", en:"Regional packs without app forks", status:"adapter" },
        { ar:"اختلاف الحساب والتقويم والمصادر محفوظ", en:"Prayer/calendar/source differences preserved", status:"adapter" },
      ]},
      { id:"devices", ar:"الأداء", en:"PERFORMANCE", items:[
        { ar:"أجهزة ضعيفة وLow-storage وLow-bandwidth", en:"Low-end, low-storage and low-bandwidth modes", status:"device" },
        { ar:"بدون اعتماد إجباري على خدمات Google", en:"Avoid mandatory dependence on Google services", status:"adapter" },
      ]},
    ]} />;
}

function SecurityAdmin({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="الأمن وإدارة المحتوى" titleEn="Security & Content Operations"
    introAr="طبقة إنتاج خلفية: أمن، مراجعة دينية، حقوق وتراخيص، CMS، تصحيحات عاجلة، Telemetry لا يجمع العبادة، وشفافية تمويل بلا إعلانات تتبع."
    introEn="Production operations: security, religious review, rights/licensing, CMS, urgent corrections, privacy-safe telemetry and a no-surveillance-ads funding stance."
    sections={[
      { id:"security", ar:"الأمن", en:"SECURITY", featured:true, items:[
        { ar:"تشفير البيانات الحساسة والمفاتيح", en:"Sensitive-data encryption & key management", status:"adapter" },
        { ar:"حماية المزامنة والنسخ الاحتياطي", en:"Protected sync & backups", status:"adapter" },
        { ar:"عدم تسجيل الأسئلة الدينية والموقع في Analytics", en:"No religious-query/location analytics logging", status:"local" },
      ]},
      { id:"cms", ar:"المحتوى", en:"CONTENT OPS", items:[
        { ar:"CMS للقرآن/الحديث/التفسير/المساجد/الصوتيات", en:"CMS for knowledge, mosques and licensed audio", status:"adapter" },
        { ar:"مراجعون وصلاحيات وسجل Audit", en:"Reviewer roles & audit log", status:"adapter" },
        { ar:"تصحيح عاجل مستقل عن إصدار التطبيق", en:"Urgent correction channel independent of app release", status:"adapter" },
        { ar:"إدارة حقوق وترخيص كل خط وصوت وكتاب", en:"Rights/license metadata for every font, audio and book", status:"adapter" },
      ]},
      { id:"business", ar:"المبدأ التجاري", en:"BUSINESS PRINCIPLE", items:[
        { ar:"No Ads by Design", en:"No Ads by Design", status:"local" },
        { ar:"الأساسيات لا تُحبس خلف Dark Patterns", en:"Core worship utilities are not trapped behind dark patterns", status:"local" },
      ]},
    ]} />;
}

function OnboardingCenter({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="البدء والانتقال" titleEn="Onboarding & Migration"
    introAr="أول تشغيل قصير ومحترم: اللغة، المدينة/الموقع، طريقة الصلاة وتفضيلات القرآن، مع إمكانية استخدام التطبيق دون حساب واستيراد بيانات لاحقاً."
    introEn="A short respectful first run: language, city/location, prayer method and Quran preferences, with accountless use and future migration/import."
    sections={[
      { id:"first", ar:"أول تشغيل", en:"FIRST RUN", featured:true, items:[
        { ar:"لغة واتجاه الواجهة", en:"Language & direction", status:"local" },
        { ar:"موقع تلقائي أو مدينة يدوية", en:"Automatic location or manual city", status:"device", go:"me-prayer-settings" },
        { ar:"طريقة الحساب والعصر", en:"Calculation & Asr method", status:"local", go:"me-prayer-settings" },
        { ar:"تفضيلات القرآن والصوت", en:"Quran & audio preferences", status:"local", go:"quran-platform" },
      ]},
      { id:"migration", ar:"الانتقال", en:"MIGRATION", items:[
        { ar:"استيراد Bookmarks/موضع القراءة عندما يتوفر تنسيق قابل للنقل", en:"Import bookmarks/reading position from portable formats", status:"adapter" },
        { ar:"Migration Engine يحفظ البيانات بين الإصدارات", en:"Migration engine preserves data across versions", status:"local" },
      ]},
    ]} />;
}

function DevicesCenter({ lang, go }) {
  return <EditorialHub lang={lang} go={go} titleAr="أجهزة سكينة" titleEn="Sakinah Surfaces"
    introAr="الهاتف ليس النهاية: الساعة والودجت والسيارة والشاشة المنزلية تستخدم نفس اللغة بدون تصغير التطبيق كله."
    introEn="Phone is not the end: watch, widgets, car and ambient home surfaces use the same language without shrinking the whole app."
    sections={[
      { id:"surfaces", ar:"الواجهات", en:"SURFACES", featured:true, items:[
        { ar:"Wear OS: الصلاة · القوس · القبلة · التحكم بالصوت", en:"Wear OS: prayer · arc · Qibla · audio controls", status:"device" },
        { ar:"Widgets: الصلاة · القرآن · الأذكار · رمضان · المسجد", en:"Widgets: prayer · Quran · Adhkar · Ramadan · Mosque", status:"device", go:"me-widgets" },
        { ar:"Car Mode: صوت فقط وتحكم آمن", en:"Car Mode: audio-first, distraction-aware", status:"device" },
        { ar:"Home/Ambient/Public Display", en:"Home/Ambient/Public Display", status:"adapter" },
        { ar:"E-ink وBurn-in protection", en:"E-ink & burn-in protection", status:"device" },
      ]},
    ]} />;
}


/* ════════════════════════════════════════════════════════════════
   ROOT APP — simple router + shared session state
════════════════════════════════════════════════════════════════ */
export default function SakinahApp() {
  const [lang, setLang] = useState("ar");
  const [world, setWorld] = useState("today");
  const [param, setParam] = useState({});
  const [now, setNow] = useState(() => new Date());
  const [preview, setPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [lastRead, setLastRead] = useState({ surahId: 1, ayah: 3 });
  const [qiblaDeg, setQiblaDeg] = useState(0);
  const [a11y, setA11y] = useState({ quranScale: 1, uiScale: 1, highContrast: false, simplified: false });
  const [travelMode, setTravelMode] = useState(false);
  const [ramadanMode, setRamadanMode] = useState(false);
  const prayerTimes = H;

  const go = (w, p = {}) => { setWorld(w); setParam(p); };
  const toggleBookmark = (key) => setBookmarks((b) => { const n = new Set(b); n.has(key) ? n.delete(key) : n.add(key); return n; });

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);

  const hourNow = preview !== null ? preview : now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const isFriday = now.getDay() === 5;
  const stage = getStage(hourNow);
  const isDark = stage.dark;

  const { nextPrayer, remH, remM, fraction } = useMemo(() => {
    const idx = PRAYER_SEQ.findIndex((p) => p.h > hourNow);
    const next = PRAYER_SEQ[idx] ?? PRAYER_SEQ[PRAYER_SEQ.length - 1];
    const prev = PRAYER_SEQ[idx - 1] ?? PRAYER_SEQ[0];
    const h = ((next.h % 24) + 24) % 24;
    const totalMin = Math.max(0, Math.round((next.h - hourNow) * 60));
    const frac = Math.min(1, Math.max(0, (hourNow - prev.h) / (next.h - prev.h)));
    return { nextPrayer: { id: next.id, h }, remH: Math.floor(totalMin / 60), remM: totalMin % 60, fraction: frac };
  }, [hourNow]);

  const bg = a11y.highContrast ? (isDark ? "#000000" : "#FFFFFF") : `linear-gradient(180deg, ${stage.from} 0%, ${stage.via} 55%, ${stage.to} 100%)`;
  const fg = isDark && !a11y.highContrast ? COLOR.ivory : a11y.highContrast ? (isDark ? "#FFFFFF" : "#000000") : COLOR.ink;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const moment = primaryMoment({ isFriday, ramadanMode, travelMode });

  const screens = {
    "today": () => <TodayScreen lang={lang} stage={stage} hourNow={hourNow} nextPrayer={nextPrayer} remH={remH} remM={remM} moment={moment} go={go} onScrub={(h) => setPreview(h)} lastRead={lastRead} qiblaDeg={qiblaDeg} prayerTimes={prayerTimes} />,
    "quran-home": () => <QuranHome lang={lang} go={go} lastRead={lastRead} bookmarks={bookmarks} />,
    "surah-list": () => <SurahList lang={lang} go={go} />,
    "reader": () => <QuranReader lang={lang} surahId={param.surahId || 1} go={go} lastRead={lastRead} setLastRead={setLastRead} bookmarks={bookmarks} toggleBookmark={toggleBookmark} quranScale={a11y.quranScale} />,
    "memorize": () => <MemorizeScreen lang={lang} go={go} initialSurahId={param.surahId} />,
    "audio": () => <AudioScreen lang={lang} go={go} surahId={param.surahId} />,
    "prayer": () => <PrayerScreen lang={lang} hourNow={hourNow} go={go} onScrub={(h) => setPreview(h)} onQiblaDeg={setQiblaDeg} prayerTimes={prayerTimes} />,
    "discover": () => <DiscoverScreen lang={lang} go={go} isFriday={isFriday} />,
    "adhkar-home": () => <AdhkarHome lang={lang} go={go} />,
    "adhkar-cat": () => <AdhkarReader lang={lang} go={go} catId={param.cat} />,
    "search": () => <SearchScreen lang={lang} go={go} nextPrayer={nextPrayer} qiblaDeg={qiblaDeg} />,
    "hajj": () => <JourneyScreen lang={lang} go={go} kind="hajj" />,
    "umrah": () => <JourneyScreen lang={lang} go={go} kind="umrah" />,
    "family": () => <FamilyScreen lang={lang} go={go} />,
    "adhan-center": () => <AdhanCenter lang={lang} go={go} />,
    "quran-platform": () => <QuranPlatform lang={lang} go={go} />,
    "trust-center": () => <TrustCenter lang={lang} go={go} />,
    "tafsir-hadith": () => <TafsirHadith lang={lang} go={go} />,
    "life-center": () => <LifeCenter lang={lang} go={go} />,
    "mosque": () => <MosqueCenter lang={lang} go={go} />,
    "kids": () => <KidsCenter lang={lang} go={go} />,
    "learning": () => <LearningCenter lang={lang} go={go} />,
    "calendar-zakat": () => <CalendarZakat lang={lang} go={go} />,
    "sacred": () => <SacredModeScreen lang={lang} go={go} />,
    "intelligence": () => <IntelligenceCenter lang={lang} go={go} />,
    "offline-sync": () => <OfflineSync lang={lang} go={go} />,
    "verification": () => <VerificationCenter lang={lang} go={go} />,
    "scholar": () => <ScholarCenter lang={lang} go={go} />,
    "archive": () => <ArchiveCenter lang={lang} go={go} />,
    "fasting": () => <FastingCenter lang={lang} go={go} />,
    "dua-center": () => <DuaCenter lang={lang} go={go} />,
    "devices": () => <DevicesCenter lang={lang} go={go} />,
    "community": () => <CommunityCenter lang={lang} go={go} />,
    "journey-services": () => <JourneyServices lang={lang} go={go} />,
    "finance": () => <FinanceInheritance lang={lang} go={go} />,
    "global-product": () => <GlobalProduct lang={lang} go={go} />,
    "security-admin": () => <SecurityAdmin lang={lang} go={go} />,
    "onboarding": () => <OnboardingCenter lang={lang} go={go} />,
    "me": () => <MeScreen lang={lang} setLang={setLang} go={go} bookmarks={bookmarks} lastRead={lastRead} travelMode={travelMode} setTravelMode={setTravelMode} ramadanMode={ramadanMode} setRamadanMode={setRamadanMode} />,
    "me-prayer-settings": () => <PrayerSettingsScreen lang={lang} go={go} />,
    "me-accessibility": () => <AccessibilityScreen lang={lang} go={go} a11y={a11y} setA11y={setA11y} />,
    "me-notifications": () => <NotificationsScreen lang={lang} go={go} />,
    "me-privacy": () => <PrivacyScreen lang={lang} go={go} />,
    "me-widgets": () => <WidgetsScreen lang={lang} go={go} stage={stage} nextPrayer={nextPrayer} prayerTimes={prayerTimes} />,
  };
  const dockDark = world === "today" ? isDark : false;
  const isWarmHome = world === "today";

  return (
    <div className="sakinah-root" dir={dir} lang={lang} style={{
      width: "100%", maxWidth: isWarmHome ? "none" : 430, height: isWarmHome ? "100dvh" : 830, margin: "0 auto", position: "relative", overflow: "hidden",
      borderRadius: isWarmHome ? 0 : 28, boxShadow: isWarmHome ? "none" : "0 30px 80px rgba(0,0,0,0.35)", background: isWarmHome ? "#17100c" : bg,
      transition: "background 1.4s cubic-bezier(.22,.61,.36,1)", color: fg, fontSize: `${a11y.uiScale}em`,
    }}>
      <GlobalStyle />

      {!isWarmHome && <div style={{ position: "absolute", top: 16, insetInlineEnd: 18, zIndex: 40 }}>
        <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em", color: fg, opacity: 0.55, padding: 6 }}>{lang === "ar" ? "EN" : "ع"}</button>
      </div>}
      {!isWarmHome && <div style={{ position: "absolute", top: 16, insetInlineStart: 18, zIndex: 40 }}>
        <button onClick={() => setShowPreview((s) => !s)} className="sk-mono" style={{ background: "none", border: `1px dashed ${isDark ? "rgba(246,243,236,0.3)" : "rgba(16,16,15,0.25)"}`, borderRadius: 4, cursor: "pointer", fontSize: 8.5, fontWeight: 500, color: fg, opacity: 0.42, padding: "3px 7px", textTransform: "uppercase" }}>{STRINGS[lang].preview}</button>
        {showPreview && (
          <div style={{ marginTop: 8, width: 190, background: isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.6)", border: `1px dashed ${isDark ? "rgba(246,243,236,0.25)" : "rgba(16,16,15,0.2)"}`, borderRadius: 6, padding: "8px 10px" }}>
            <div className="sk-mono" style={{ fontSize: 9, opacity: 0.6, marginBottom: 6 }}>{String(Math.floor(preview ?? hourNow)).padStart(2, "0")}:{String(Math.round(((preview ?? hourNow) % 1) * 60)).padStart(2, "0")}</div>
            <input type="range" min={0} max={23.98} step={0.05} value={preview ?? hourNow} onChange={(e) => setPreview(parseFloat(e.target.value))} style={{ width: "100%", accentColor: COLOR.gold }} />
          </div>
        )}
      </div>}

      {(screens[world] || screens["today"])()}

      {!isWarmHome && <NavDock world={world} go={go} lang={lang} isDark={dockDark} nextPrayer={nextPrayer} fraction={fraction} simple={a11y.simplified} />}
    </div>
  );
}
