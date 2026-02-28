/** © 2025-2026 Hamsat Quran | hamsatquran.com | All Rights Reserved */
// ========================================================
// INTERNATIONALIZATION: Language System
// Hamsat Quran V16
// ========================================================

// --- Language State ---
let currentLang = localStorage.getItem('hamsatAppLanguage') || 'ar';

// Apply language without toast (for page load)

// --- applyLanguage() ---
function applyLanguage(lang, showNotification = true) {
    currentLang = lang;
    localStorage.setItem('hamsatAppLanguage', lang);
    
    const t = translations[lang] || translations.ar;
    const isRTL = ['ar', 'ur', 'fa', 'ps'].includes(lang);
    
    // Set document direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });
    
    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });
    
    // Translate optgroup labels
    document.querySelectorAll('[data-i18n-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-label');
        if (t[key]) {
            el.label = t[key];
        }
    });
    
    // Update bottom nav
    const navLabels = [t.home, t.quran, t.worship, t.community, t.more];
    document.querySelectorAll('.bottom-nav-item').forEach((item, i) => {
        const span = item.querySelector('span:last-child');
        if (span && navLabels[i]) span.textContent = navLabels[i];
    });
    
    // Update greeting
    const greetingTitle = document.querySelector('.info-banner h3');
    const greetingDesc = document.querySelector('.info-banner p');
    if (greetingTitle) greetingTitle.textContent = t.greeting;
    if (greetingDesc) greetingDesc.textContent = t.greetingDesc;
    
    // Update continue reading
    const continueTitle = document.querySelector('.continue-reading-title');
    if (continueTitle) continueTitle.textContent = t.continueReading;
    
    // Update stats labels
    const statLabels = document.querySelectorAll('.stat-mini-label');
    if (statLabels[0]) statLabels[0].textContent = t.khatmat;
    if (statLabels[1]) statLabels[1].textContent = t.consecutiveDays;
    if (statLabels[2]) statLabels[2].textContent = t.pagesToday;
    
    // Update daily goal
    const dailyGoalTitle = document.querySelector('.daily-goal-title');
    if (dailyGoalTitle) dailyGoalTitle.innerHTML = `🎯 ${t.dailyGoal}`;
    
    // Update Garmin stats header
    const garminHeader = document.querySelector('.garmin-stats-header span:first-child');
    if (garminHeader) garminHeader.textContent = `📊 ${t.readingStats}`;
    
    // Update search placeholder
    const searchInput = document.getElementById('surah-search');
    if (searchInput) searchInput.placeholder = `🔍 ${t.search}...`;
    
    // Update page titles
    const pageTitles = {
        'quran-page-title': t.surahList,
        'adhkar-page-title': t.adhkar,
        'halal-page-title': t.halalGuide,
        'settings-page-title': t.settingsTitle
    };
    Object.entries(pageTitles).forEach(([id, text]) => {
        const el = document.getElementById(id);
        if (el && text) el.textContent = text;
    });
    
    // Update Adhkar cards
    const adhkarTitles = document.querySelectorAll('.adhkar-card-title');
    const adhkarLabels = [t.morningAdhkar, t.eveningAdhkar, t.sleepAdhkar, t.prayerAdhkar];
    adhkarTitles.forEach((el, i) => {
        if (adhkarLabels[i]) el.textContent = adhkarLabels[i];
    });
    
    // Update language toggle button in header
    if (typeof updateLangToggleBtn === 'function') {
        updateLangToggleBtn(lang);
    }

    // Show notification only if requested
    // Apply settings translations (from i18n-settings.js)
    if (typeof applySettingsTranslations === 'function') {
        applySettingsTranslations(lang);
    }

    // Show notification only if requested
    if (showNotification) {
        const confirmMsg = {
            ar: 'تم تغيير اللغة ✓', en: 'Language changed ✓', ur: 'زبان تبدیل ہوگئی ✓',
            fa: 'زبان تغییر کرد ✓', tr: 'Dil değiştirildi ✓', id: 'Bahasa diubah ✓', 
            fr: 'Langue changée ✓', de: 'Sprache geändert ✓', es: 'Idioma cambiado ✓',
            ms: 'Bahasa ditukar ✓', bn: 'ভাষা পরিবর্তন হয়েছে ✓', hi: 'भाषा बदल गई ✓',
            ru: 'Язык изменён ✓', zh: '语言已更改 ✓', ja: '言語が変更されました ✓'
        };
        showToast(confirmMsg[lang] || confirmMsg.en);
    }
}

// Set language with notification


// --- Quick language toggle (header button) ---
function toggleLanguage() {
    const current = localStorage.getItem('hamsatAppLanguage') || 'ar';
    const newLang = current === 'ar' ? 'en' : 'ar';
    
    // Update dropdown if visible
    const sel = document.getElementById('select-app-language');
    if (sel) sel.value = newLang;
    
    // Apply
    applyLanguage(newLang, true);
    
    // Update button text
    updateLangToggleBtn(newLang);
}

function updateLangToggleBtn(lang) {
    const btn = document.getElementById('lang-toggle-btn');
    if (btn) btn.textContent = lang === 'ar' ? 'EN' : 'ع';
}

// Set initial button state on load
window.addEventListener('DOMContentLoaded', function() {
    updateLangToggleBtn(localStorage.getItem('hamsatAppLanguage') || 'ar');
});
