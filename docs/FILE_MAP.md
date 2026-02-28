# 📁 FILE_MAP.md — Hamsat Quran V42.3

> **Last updated:** 2026-02-28  
> **Total files:** 55 | **Total size:** ~5.0MB  
> **Deploy:** Cloudflare Pages → hamsatquran.com  
> **SW Cache:** `hamsat-quran-v42-3`

---

## 🏗️ ROOT FILES

| File | Size | Purpose |
|------|------|---------|
| `index.html` | 329KB | **Single-page app shell.** All pages, modals, UI in one file. ~4700 lines. Contains garmin-stats, misbaha-stats, quick-actions, verse-of-day, all page sections. |
| `sw.js` | 2.9KB | **Service Worker.** Cache-first strategy. Caches all app shell files + data. Separate `AUDIO_CACHE` for recitations from everyayah.com. |
| `manifest.json` | 1.1KB | **PWA manifest.** App name, icons, shortcuts (القرآن, الأذكار), standalone display, RTL, portrait. |
| `_headers` | 161B | **Cloudflare headers.** Cache-Control: no-cache for sw.js and index.html to ensure fresh deploys. |

---

## 📜 JAVASCRIPT (29 files, ~970KB)

### 🔒 GOLDEN FILES (NEVER MODIFY)
| File | Size | Purpose |
|------|------|---------|
| `js/audio.js` | 110KB | **Audio recitation system.** 26 bilingual reciters, streaming from everyayah.com, playback controls, repeat modes, speed control, download. **GOLDEN: 110,587 bytes exactly.** |

### 📖 Core Quran
| File | Size | Obfuscated? | Purpose |
|------|------|-------------|---------|
| `js/quran.js` | 96KB | ✅ | **Quran reader engine.** Surah/mushaf loading, scroll mode, page mode, ayah rendering, bookmark system, reading session tracking. |
| `js/quran-fix.js` | 12.5KB | ❌ | **Offline API interceptor.** Overrides `fetch()` to serve local Quran data when APIs fail. Intercepts alquran.cloud calls. |
| `js/data.js` | 89KB | ✅ | **Surah metadata.** 114 surahs with name, englishName, ayahs, type (مكية/مدنية), number. Used by surah list, search, selectors. |
| `js/data-loader.js` | 10KB | ❌ | **Lazy data loader.** Loads quran-uthmani.json + en-sahih.json on demand instead of upfront. Reduced initial bundle 4.5MB → 1.2MB. |

### 📖 Tafsir (Commentary)
| File | Size | Obfuscated? | Purpose |
|------|------|-------------|---------|
| `js/tafsir.js` | 31KB | ❌ | **Tafsir system.** 11 sources (7 AR + 5 EN), multiple APIs (alquran.cloud, quran-tafseer.com, jsdelivr), modal display with source selector. |
| `js/tafsir-offline.js` | 12.5KB | ❌ | **Offline tafsir data.** Pre-downloaded commentary for offline access. Fallback when APIs fail. |
| `js/tafsir-fix.js` | 6.3KB | ❌ | **Tafsir bugfixes.** Patches for CSP issues, API fallback chains, error handling improvements. |

### 🕌 Worship & Prayer
| File | Size | Obfuscated? | Purpose |
|------|------|-------------|---------|
| `js/worship.js` | 79KB | ✅ | **Worship module.** Duas, digital tasbeeh counter (separate from misbaha), Hijri calendar, dhikr categories. Saves to `hamsatTasbeeh` localStorage. |
| `js/prayer.js` | 14.5KB | ❌ | **Prayer times.** 15 calculation methods, GPS/city selection, live countdown, Hijri date, Aladhan API integration. 61 i18n elements. |
| `js/adhkar.js` | 10KB | ✅ | **Adhkar (remembrance) data & UI.** Categories (morning, evening, sleep, etc.), counter per dhikr, progress tracking. Source: Hisn al-Muslim. |
| `js/ahzab-data.js` | 33KB | ❌ | **Ahzab (Quran portions) data.** Division data for structured reading plans. |

### 📿 Misbaha (Prayer Beads)
| File | Size | Obfuscated? | Purpose |
|------|------|-------------|---------|
| `js/misbaha-realistic.js` | 33.5KB | ❌ | **Realistic misbaha V2.** Canvas-rendered prayer beads, 7 gemstone types, 6 dhikr presets, drag physics, audio/haptic feedback, touch counting. Stats saved to `hamsatMisbaha`. **DO NOT OBFUSCATE.** |
| `js/misbaha-upgrade.js` | 174B | ❌ | **Upgrade stub.** Minimal bridge from old misbaha to new V2 system. **DO NOT OBFUSCATE.** |
| `js/misbaha-stats.js` | 5.7KB | ❌ | **Misbaha statistics display.** Reads from `hamsatMisbaha` + `hamsatTasbeeh`, populates home page stats card (today, total, rounds, week, top dhikr, best day, level). |

### 🎨 UI & Navigation
| File | Size | Obfuscated? | Purpose |
|------|------|-------------|---------|
| `js/ui.js` | 60KB | ✅ | **Main UI controller.** `showPage()`, `openModal()`, `closeModal()`, surah/juz selectors, country selector, settings panels, `updateGarminDashboard()`, `applyAllSettingsLive()`. |
| `js/app.js` | 20KB | ✅ | **App initialization.** DOMContentLoaded setup, splash screen, continue-reading, greeting, daily verse, event listeners. |
| `js/ayah-menu.js` | 48KB | ✅ | **Ayah context menu.** Long-press/tap on ayah → bookmark, share, copy, tafsir, audio play options. |
| `js/settings.js` | 21.5KB | ✅ | **Settings management.** Font size, theme, language, view mode, reciter, playback speed, all localStorage read/write. |
| `js/settings-accordion.js` | 3.4KB | ❌ | **Settings accordion UI.** Collapsible sections in settings page. Click to expand/collapse. |
| `js/feature-status.js` | 1.6KB | ❌ | **Coming Soon overlays.** Adds "قريباً" overlay to unfinished pages: community, halal, marketplace, teachers, kids, progress. |

### 👤 Auth & Social
| File | Size | Obfuscated? | Purpose |
|------|------|-------------|---------|
| `js/auth.js` | 47KB | ✅ | **Authentication.** Firebase auth (email/password, Google), user profile, login/register modals, session management. |
| `js/auth-fix.js` | 7.5KB | ❌ | **Auth bugfixes.** Patches for Firebase initialization, token refresh, error handling edge cases. |
| `js/social.js` | 46KB | ✅ | **Social features.** Community page, user profiles, sharing, blocked/muted accounts. |

### 🔧 Utilities
| File | Size | Obfuscated? | Purpose |
|------|------|-------------|---------|
| `js/helpers.js` | 10KB | ✅ | **Utility functions.** `sanitizeHTML()`, `validateNumber()`, `validatePIN()`, `safeSetItem()`, `safeGetItem()`, `fetchWithRetry()`, `showToast()`, `clearOldCacheData()`. |
| `js/analytics.js` | 14KB | ✅ | **Reading analytics.** Garmin-style dashboard: speed, total ayahs, time, streak, predictions, personal bests. Reads from `hamsatReadingStats`. |
| `js/i18n.js` | 5.8KB | ❌ | **i18n core.** `applyLanguage()`, RTL detection, `data-i18n` attribute processing, language switcher. |
| `js/i18n-settings.js` | 27KB | ❌ | **i18n translation strings.** 24 languages × 47+ keys. Arabic, English, French, Turkish, Urdu, etc. RTL: ar, ur, fa, ps. |
| `js/legal.js` | 15.4KB | ✅ | **Legal pages.** Privacy policy, terms of service, approved sources list, content rendered in modals. |

---

## 🎨 CSS (15 files, ~160KB)

| File | Size | Purpose |
|------|------|---------|
| `css/reader.css` | 8.5KB | **Quran reader styles.** Ayah display, toolbar, audio panel, font sizing. **GOLDEN: 8,472 bytes exactly.** |
| `css/components.css` | 23KB | **Shared components.** Buttons, cards, modals, garmin-stats-card, garmin-stat-box, badges, tags, inputs. |
| `css/themes.css` | 15.6KB | **Theme system.** Dark mode, light mode, sepia. CSS variables: `--navy-dark:#0D1B2A`, `--gold-primary:#D4AF37`, `--cream:#FFFEF8`. |
| `css/audio.css` | 13.5KB | **Audio page & player.** Reciter cards, playback controls, progress bar, download buttons. |
| `css/settings.css` | 13KB | **Settings page.** Accordion sections, toggles, selects, range inputs, account settings. |
| `css/misbaha.css` | 12.8KB | **Misbaha page.** Canvas container, responsive sizing (breakpoints + clamp), gemstone selector, dhikr buttons, counter display. 452 lines. |
| `css/auth.css` | 12.4KB | **Auth modals.** Login/register forms, social auth buttons, profile display. |
| `css/worship.css` | 11KB | **Worship page.** Duas display, tasbeeh counter, Hijri calendar, adhkar cards. |
| `css/social.css` | 9.2KB | **Social/community page.** User cards, post display, sharing UI. |
| `css/ayah-menu.css` | 6.3KB | **Ayah context menu.** Popup positioning, action buttons, animation. |
| `css/splash.css` | 6.1KB | **Splash screen.** Loading animation, SVG logo display, fade-out transition. |
| `css/main.css` | 6KB | **Base styles.** Reset, body, nav tabs, bottom nav, page sections, global typography. |
| `css/home.css` | 5.7KB | **Home page.** Greeting, verse of day, quick actions grid, continue reading card. |
| `css/responsive.css` | 5.4KB | **Global responsive.** Media queries for tablets, phones, landscape. PWA safe-area-inset. |
| `css/data-loader.css` | 1.9KB | **Loading states.** Skeleton screens, progress indicators for lazy-loaded data. |

---

## 📦 DATA (4 files, ~3.4MB)

| File | Size | Purpose |
|------|------|---------|
| `data/quran-uthmani.json` | 2.3MB | **Full Quran text.** Uthmani script, 114 surahs, 6236 ayahs. Primary offline Quran source. |
| `data/en-sahih.json` | 1.0MB | **English translation.** Sahih International. Default translation for English users. |
| `data/page-mapping.json` | 22.5KB | **Mushaf page mapping.** Maps each ayah to its Madina Mushaf page number (1-604). |
| `data/juz-mapping.json` | 1.1KB | **Juz (part) mapping.** 30 juz boundaries with starting surah/ayah. |

---

## 🖼️ ASSETS (3 files, ~183KB)

| File | Size | Purpose |
|------|------|---------|
| `assets/logo.png` | 86.5KB | **App logo.** 512x512 PNG. Used in manifest, splash screen, PWA icon. |
| `assets/logo-512.png` | 86.5KB | **Logo copy.** Duplicate of logo.png at 512x512 for PWA requirements. |
| `assets/logo.svg` | 9.2KB | **SVG logo.** Vector version for splash screen rendering. Crescent + book design. |

---

## 🔑 LOCALSTORAGE KEYS

| Key | Writer | Reader | Format |
|-----|--------|--------|--------|
| `hamsatMisbaha` | misbaha-realistic.js | misbaha-stats.js | `{dhikrKey: {total, rounds, dates:{}, sessionCount, sessionRounds, sessionTotal}}` |
| `hamsatTasbeeh` | worship.js | misbaha-stats.js | `{dhikrKey: {total, rounds, dates:{}}}` |
| `hamsatReadingStats` | quran.js | analytics.js | Reading session data (speed, time, ayahs) |
| `hamsatLastSurah` | quran.js | app.js | Last opened surah number |
| `hamsatLastPage` | quran.js | app.js | Last mushaf page number |
| `hamsatKhatmaCount` | quran.js | analytics.js | Complete Quran readings count |
| `hamsatDailyGoal` | settings.js | analytics.js | Daily pages goal |
| `hamsatAppTheme` | settings.js | ui.js | "dark-mode" or "light-mode" |
| `hamsatAppLanguage` | settings.js | i18n.js | Language code (ar, en, fr...) |
| `hamsatReciter` | settings.js | audio.js | Current reciter identifier |
| `hamsatShowTranslation` | settings.js | quran.js | "true"/"false" |
| `hamsatTranslationLang` | settings.js | quran.js | Translation language code |
| `adhkarCounts` | adhkar.js | adhkar.js | `{dhikrId: count}` |

---

## 🌐 EXTERNAL APIs

| API | Used By | Purpose |
|-----|---------|---------|
| `everyayah.com` | audio.js | Audio recitation files (MP3) |
| `api.alquran.cloud` | quran.js, tafsir.js | Quran text, editions, translations |
| `api.quran-tafseer.com` | tafsir.js | Arabic tafsir commentaries |
| `cdn.jsdelivr.net` | tafsir.js | Additional Islamic resources |
| `api.spa5k.me` | tafsir.js | Tafsir data backup API |
| `api.aladhan.com` | prayer.js | Prayer times calculation |
| `Firebase` | auth.js, social.js | Authentication, cloud sync, Firestore |

---

## 🚀 DEPLOYMENT

### **Platform:** Cloudflare Pages
- **URL:** https://hamsatquran.com
- **Auto-deploy:** GitHub push → Live in ~30 seconds
- **Bandwidth:** Unlimited (no caps!)
- **SSL:** Auto-managed by Cloudflare
- **CDN:** Global edge network (190+ cities)
- **Cost:** $0/month (free forever)

### **Deployment Process:**
```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push origin main

# Cloudflare automatically:
# 1. Detects push
# 2. Builds project
# 3. Deploys to edge
# 4. Site live in 30-60 seconds
```

### **Previous Platform:**
- Netlify (paused due to bandwidth limits)
- Migrated to Cloudflare Pages on 2026-02-28

---

## ⚠️ CRITICAL RULES

1. **GOLDEN FILES — NEVER MODIFY:**
   - `js/audio.js` = 110,587 bytes
   - `css/reader.css` = 8,472 bytes

2. **NEVER OBFUSCATE:**
   - `js/audio.js`
   - `js/misbaha-realistic.js`
   - `js/misbaha-upgrade.js`
   - `css/reader.css`

3. **NEVER use MutationObserver with `subtree:true` on main-content** — causes infinite loops.

4. **NEVER call `openTasbeehCounter()` from decrement/reset/setTarget** — use `updateMisbahaUI()`.

5. **Theological constraint:** All content must align with Ahl al-Sunnah wal-Jama'ah (Ash'ari/Maturidi). No Wahhabi/Salafi/Shia sources.

---

## 📊 FILE COUNT SUMMARY

| Category | Count | Size |
|----------|-------|------|
| Root files | 4 | ~333KB |
| JavaScript | 29 | ~970KB |
| CSS | 15 | ~160KB |
| Data | 4 | ~3.4MB |
| Assets | 3 | ~183KB |
| **TOTAL** | **55** | **~5.0MB** |

---

## 📝 CHANGELOG

### V42.3 → Current
- **2026-02-28:** Migrated from Netlify to Cloudflare Pages
  - Reason: Netlify bandwidth limit exceeded (100GB/month)
  - Benefits: Unlimited bandwidth, faster CDN, $0 cost
  - Custom domain configured: hamsatquran.com
  - SSL auto-configured
  - Auto-deployment from GitHub working
