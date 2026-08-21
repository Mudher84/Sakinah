# Muslim Mirror — Architecture Map

This file is the canonical map of the current application structure.

## Runtime entry

`src/main.jsx`
- Starts React.
- Mounts `SakinahResponsiveShell`.
- Loads global styles.
- Installs visual/runtime helpers.
- Must not contain prayer/location/network fallbacks or feature-routing logic.

## Application shell

`src/SakinahResponsiveShell.jsx`
- Owns the permanent bottom dock.
- Mounts exactly one global feature router: `SakinahAllFeaturesLayer`.
- Mounts the primary dock/page router: `SakinahSevenDock`.

## Global feature router

`src/SakinahAllFeaturesLayer.jsx`
- Canonical router for feature screens opened through the `sakinah:feature` event.
- Owns notes, accounts, profiles, qibla, mosques, zakat, manasik, tasbeeh, prayer guide, alerts, adhan audio, widget, kids, search, Quran intelligence, calendar and other secondary services.
- No second feature-routing layer should duplicate these routes.

## Main dock/page router

`src/SakinahSevenDock.jsx`
- Canonical router for the seven main dock destinations.
- Home / My Day / Discover / Profile flow into `MergedSakinah`.
- Quran opens `QuranCenter`.
- Quran Player opens `LiveQuranAudio`.
- Hadith opens `LiveHadithHub`.
- Adult nasheeds open `AdultNasheeds`.

## Home and legacy primary pages

`src/MergedSakinah.jsx`
- Owns Home, My Day, Discover and Profile state.
- Home mounts `SakinahLiveHome`.

`src/SakinahLiveHome.jsx`
- Current Muslim Mirror home UI.
- Prayer times, next-prayer state, daily ayah and home cards belong here.
- Fixes to the new home must be made here, not through global browser overrides.

## Quran

- `src/QuranCenter.jsx` — Quran hub/reader entry.
- `src/liveAudio.jsx` — Quran audio player.
- `src/quranInsights.jsx` — Quran intelligence tools.
- `src/quranAnalytics.jsx` — Quran analytics.
- `src/QuranTeacherLive.jsx` — Quran learning/teacher UI.
- `src/liveTafsir.jsx` / `src/liveStudy.jsx` — tafsir/study surfaces.

## Hadith and Islamic content

- `src/liveHadith.jsx` — Hadith main hub.
- `src/NineBooksCenter.jsx` — Nine Books center.
- `src/verifiedIslamic.jsx` — verified Islamic datasets/features.
- `src/trustedDaily.jsx` — trusted daily content.
- `src/SeerahStoriesCenter.jsx` — seerah/stories.

## Daily life and worship

- `src/dailySuite.jsx` — daily tools, fasting, Ramadan, khatmah, memorization, Friday, parental controls, privacy lock.
- `src/smartMyDay.jsx` — My Day tools.
- `src/PrayerJournal.jsx` — prayer journal.
- `src/worshipUtilities.jsx` — shared worship utilities.
- `src/QiblaPro.jsx` — qibla.
- `src/NearbyMosquesPro.jsx` — nearby mosques.
- `src/ManasikGuide.jsx` — Hajj/Umrah guide.
- `src/ModernTasbeeh.jsx` — tasbeeh.
- `src/PrayerLearningCenter.jsx` — prayer/wudu learning.

## Personal and device features

- `src/personalNotebooks.jsx` — notes and accounts.
- `src/devotionSuite.jsx` — profiles/devotion components still used by the canonical router.
- `src/nativeDaily.jsx` — alerts/notification UI.
- `src/adhanAudioSettings.jsx` — adhan sound settings.
- `src/WidgetCenter.jsx` — widget UI.
- `src/offlineBackup.jsx` — offline/backup UI.

## Kids

- `src/kidsWorld.jsx` — kids world and quiz.
- `src/KidsQuranStories.jsx` — Quran stories.
- `src/kidsNasheeds.jsx` — kids nasheeds.
- `src/QuranTeacherLive.jsx` — also used for kids Quran learning.

## Search and saved content

- `src/searchLibrary.jsx` — universal search and saved library.
- `src/QuranicDuasCenter.jsx` — Quranic duas.
- `src/SmartAdhkarCenter.jsx` — smart adhkar.

## Styling and visual runtime helpers

Global styles are imported from `src/main.jsx`. Runtime visual helpers such as hero atmosphere, icon polish, waveform and typography installers must remain presentation-only. They must not become alternate routers or override browser APIs.

## Public assets

- `public/audio/adhan/` — real adhan audio files.
- `public/images/adhan/` — adhan imagery.
- `public/data/hadiths/` — hadith data files.
- `public/sw.js` — production service worker.

## Android native shell

`android/`
- Native Android project, manifest, services, workers, receivers and widget implementation.
- Keep Android native code separate from React UI routing.

## Server

`server/`
- `qfApiServer.mjs` and `quranFoundationProxy.mjs` provide server-side API/proxy functionality.

## Routing rule

There are only two routing owners now:

1. `SakinahSevenDock` — seven primary dock destinations.
2. `SakinahAllFeaturesLayer` — secondary/global feature screens.

Do not add another nested routing layer unless it owns a genuinely independent navigation stack.
