/** © 2025-2026 Hamsat Quran | hamsatquran.com | All Rights Reserved */
// ========================================================
// SETTINGS: Theme, Audio, Repeat, Goals, Data
// Hamsat Quran V16
// ========================================================

// --- Theme ---
function setTheme(theme) {
    document.body.classList.remove('dark-mode', 'sepia-mode');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (theme === 'sepia') {
        document.body.classList.add('sepia-mode');
    }
    
    // Update theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.classList.contains(theme)) {
            btn.classList.add('active');
        }
    });
    
    localStorage.setItem('hamsatAppTheme', theme);
    
    // Sync reader theme with app theme
    syncReaderWithAppTheme(theme);
    
    // Sync all pages immediately
    applyAllSettingsLive();
}

// Sync reader colors when app theme changes
function syncReaderWithAppTheme(appTheme) {
    const container = document.getElementById('ayat-container');
    const bismillah = document.getElementById('bismillah');
    const settingsPanel = document.getElementById('reader-settings-panel');
    
    if (appTheme === 'dark') {
        // Dark app theme → force reader to dark
        if (container) {
            container.style.background = '#1e1e1e';
            container.style.color = '#e0e0e0';
        }
        if (bismillah) {
            bismillah.style.background = '#1e1e1e';
            bismillah.style.color = '#e0e0e0';
        }
        if (settingsPanel) {
            settingsPanel.style.background = '#1e1e1e';
            settingsPanel.style.borderColor = '#333';
        }
        document.querySelectorAll('.ayah, .ayah-arabic').forEach(el => {
            el.style.color = '#e0e0e0';
        });
        document.querySelectorAll('.ayah-number').forEach(el => {
            el.style.background = 'transparent';
            el.style.color = '#E8C547';
        });
        document.querySelectorAll('.mushaf-surah-header').forEach(el => {
            el.style.background = 'rgba(212,175,55,0.1)';
            el.style.color = '#D4AF37';
        });
        document.querySelectorAll('.translation-text').forEach(el => {
            el.style.color = '#bbb';
        });
        // Update reader theme dots
        document.querySelectorAll('.theme-dot').forEach(d => d.style.border = '3px solid #555');
        // Update script choice buttons
        document.querySelectorAll('.script-choice:not(.active-choice)').forEach(b => {
            b.style.background = '#252525';
            b.style.borderColor = '#444';
            b.style.color = '#e0e0e0';
        });
        // Store reader dark state
        localStorage.setItem('hamsatReaderBg', '#1e1e1e');
        localStorage.setItem('hamsatReaderText', '#e0e0e0');
    } else if (appTheme === 'sepia') {
        // Sepia app theme → force reader to warm/paper
        if (container) {
            container.style.background = '#faf6eb';
            container.style.color = '#433422';
        }
        if (bismillah) {
            bismillah.style.background = '#faf6eb';
            bismillah.style.color = '#433422';
        }
        if (settingsPanel) {
            settingsPanel.style.background = '#faf6eb';
            settingsPanel.style.borderColor = '#d4c4a8';
        }
        document.querySelectorAll('.ayah, .ayah-arabic').forEach(el => {
            el.style.color = '#433422';
        });
        document.querySelectorAll('.ayah-number').forEach(el => {
            el.style.background = 'transparent';
            el.style.color = '#8B6914';
        });
        document.querySelectorAll('.mushaf-surah-header').forEach(el => {
            el.style.background = 'rgba(139,105,20,0.1)';
            el.style.color = '#8B6914';
        });
        document.querySelectorAll('.translation-text').forEach(el => {
            el.style.color = '#6b5842';
        });
        document.querySelectorAll('.script-choice:not(.active-choice)').forEach(b => {
            b.style.background = '#efe5d0';
            b.style.borderColor = '#d4c4a8';
            b.style.color = '#433422';
        });
        localStorage.setItem('hamsatReaderBg', '#faf6eb');
        localStorage.setItem('hamsatReaderText', '#433422');
    } else {
        // Light mode → restore to white/default
        if (container) {
            container.style.background = '#ffffff';
            container.style.color = '#1a1a2e';
        }
        if (bismillah) {
            bismillah.style.background = '#ffffff';
            bismillah.style.color = '#1a1a2e';
        }
        if (settingsPanel) {
            settingsPanel.style.background = '#fff';
            settingsPanel.style.borderColor = '';
        }
        document.querySelectorAll('.ayah, .ayah-arabic').forEach(el => {
            el.style.color = '#1a1a2e';
        });
        document.querySelectorAll('.ayah-number').forEach(el => {
            el.style.background = 'transparent';
            el.style.color = 'var(--gold-dark, #B8960C)';
        });
        document.querySelectorAll('.mushaf-surah-header').forEach(el => {
            el.style.background = '';
            el.style.color = '';
        });
        document.querySelectorAll('.translation-text').forEach(el => {
            el.style.color = '';
        });
        document.querySelectorAll('.script-choice:not(.active-choice)').forEach(b => {
            b.style.background = '#fff';
            b.style.borderColor = '#ddd';
            b.style.color = '';
        });
        localStorage.setItem('hamsatReaderBg', '#ffffff');
        localStorage.setItem('hamsatReaderText', '#1a1a2e');
    }
}

// --- App Language ---
function setAppLanguage(lang) {
    applyLanguage(lang, true);
}

// Toast notification

// --- Font & View ---
function setFontSize(size) {
    document.documentElement.style.setProperty('--font-size-ayah', size + 'px');
    
    document.querySelectorAll('.font-size-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.size === String(size)) {
            btn.classList.add('active');
        }
    });
    
    localStorage.setItem('hamsatAppFontSize', size);
    
    // Sync all pages immediately
    applyAllSettingsLive();
}

// Set view mode in settings
function setViewMode(mode) {
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
    
    localStorage.setItem('hamsatAppViewMode', mode);
    
    // Sync all pages immediately
    applyAllSettingsLive();
}

// --- Quran Script ---
// ========== QURAN SCRIPT SETTINGS ==========
function setQuranScript(script) {
    const scriptMap = {
        'uthmani': 'quran-uthmani',
        'imlaei': 'quran-simple',
        'indopak': 'quran-indopak',
        'nastaliq': 'quran-indopak'
    };
    
    const fontMap = {
        'uthmani': 'Amiri',
        'imlaei': 'Noto Naskh Arabic',
        'indopak': 'Lateef',
        'nastaliq': 'Noto Nastaliq Urdu'
    };
    
    quranEdition = scriptMap[script] || 'quran-uthmani';
    quranFont = fontMap[script] || 'Amiri';
    
    localStorage.setItem('hamsatQuranEdition', quranEdition);
    localStorage.setItem('hamsatQuranFont', quranFont);
    localStorage.setItem('hamsatQuranScript', script);
    
    showToast('تم تغيير نوع الخط ✓');
    
    // Reload current surah if open
    if (currentSurahNumber && currentReadingMode === 'scroll') {
        loadSurahForScroll(currentSurahNumber);
    } else if (currentMushafPage && currentReadingMode === 'page') {
        loadMushafPage(currentMushafPage);
    }
    
    // Sync all pages immediately
    applyAllSettingsLive();
}

// --- Toggle Settings ---
// ========== TOGGLE SETTINGS (Tajweed, Waqf, etc.) ==========
function toggleSetting(settingName) {
    const toggle = document.getElementById(`toggle-${settingName}`);
    if (!toggle) return;
    
    const isActive = toggle.classList.contains('active');
    
    if (isActive) {
        toggle.classList.remove('active');
        localStorage.setItem(`hamsat_${settingName}`, 'false');
    } else {
        toggle.classList.add('active');
        localStorage.setItem(`hamsat_${settingName}`, 'true');
    }
    
    // Apply setting with feedback
    applySetting(settingName, !isActive);
    
    // Sync all pages immediately
    applyAllSettingsLive();
}

function applySetting(settingName, enabled) {
    // Toast labels for all toggle settings
    const labels = {
        'tajweed': ['ألوان التجويد: مفعّلة ✓', 'ألوان التجويد: معطّلة'],
        'waqf': ['علامات الوقف: مفعلة ✓', 'علامات الوقف: معطلة'],
        'autoplay': ['التشغيل التلقائي: مفعل ✓', 'التشغيل التلقائي: معطل'],
        'continuousPlay': ['التشغيل المتواصل: مفعل ✓', 'التشغيل المتواصل: معطل'],
        'download': ['التحميل التلقائي: مفعل ✓', 'التحميل التلقائي: معطل'],
        'prayer': ['تنبيهات الصلاة: مفعلة ✓', 'تنبيهات الصلاة: معطلة'],
        'adhkar': ['تذكير الأذكار: مفعل ✓', 'تذكير الأذكار: معطل'],
        'daily': ['التذكير اليومي: مفعل ✓', 'التذكير اليومي: معطل'],
        'surah-alert': ['تنبيه إتمام السورة: مفعل ✓', 'تنبيه إتمام السورة: معطل'],
        'juz-alert': ['تنبيه إتمام الجزء: مفعل ✓', 'تنبيه إتمام الجزء: معطل'],
        'time-estimate': ['تقدير الوقت: مفعل ✓', 'تقدير الوقت: معطل'],
        'streak-alert': ['تنبيه المواظبة: مفعل ✓', 'تنبيه المواظبة: معطل'],
        'goal-alert': ['تنبيه الهدف: مفعل ✓', 'تنبيه الهدف: معطل'],
        'achievement-alert': ['تنبيه الإنجاز: مفعل ✓', 'تنبيه الإنجاز: معطل'],
        'voice-share': ['مشاركة التسجيلات: مفعلة ✓', 'مشاركة التسجيلات: معطلة'],
        'progress-share': ['مشاركة التقدم: مفعلة ✓', 'مشاركة التقدم: معطلة'],
        'external-share': ['المشاركة الخارجية: مفعلة ✓', 'المشاركة الخارجية: معطلة'],
        'auto-save-recording': ['حفظ تلقائي: مفعل ✓', 'حفظ تلقائي: معطل'],
        'countdown-sound': ['صوت العد التنازلي: مفعل ✓', 'صوت العد التنازلي: معطل'],
        'show-text-recording': ['عرض النص: مفعل ✓', 'عرض النص: معطل'],
        'notif-like': ['إشعارات الإعجاب: مفعلة ✓', 'إشعارات الإعجاب: معطلة'],
        'notif-comment': ['إشعارات التعليقات: مفعلة ✓', 'إشعارات التعليقات: معطلة'],
        'notif-follower': ['إشعارات المتابعين: مفعلة ✓', 'إشعارات المتابعين: معطلة'],
        'notif-mention': ['إشعارات الإشارات: مفعلة ✓', 'إشعارات الإشارات: معطلة'],
        'notif-message': ['إشعارات الرسائل: مفعلة ✓', 'إشعارات الرسائل: معطلة'],
        'notif-khatma': ['إشعارات الختمة: مفعلة ✓', 'إشعارات الختمة: معطلة'],
        'notif-competition': ['إشعارات المسابقات: مفعلة ✓', 'إشعارات المسابقات: معطلة'],
        'group-invites': ['دعوات المجموعات: مفعلة ✓', 'دعوات المجموعات: معطلة'],
        'sync': ['المزامنة التلقائية: مفعلة ✓', 'المزامنة التلقائية: معطلة'],
        'delivery-only': ['التوصيل فقط: مفعل ✓', 'التوصيل فقط: معطل'],
        'e-invoice': ['الفاتورة الإلكترونية: مفعلة ✓', 'الفاتورة الإلكترونية: معطلة'],
        'offer-notif': ['إشعارات العروض: مفعلة ✓', 'إشعارات العروض: معطلة'],
        'family-compete': ['التنافس العائلي: مفعل ✓', 'التنافس العائلي: معطل'],
        'leaderboard': ['لوحة المتصدرين: مفعلة ✓', 'لوحة المتصدرين: معطلة'],
        'rewards': ['المكافآت: مفعلة ✓', 'المكافآت: معطلة'],
    };

    // Special handling for tajweed colors
    if (settingName === 'tajweed') {
        if (typeof toggleTajweedColors === 'function') toggleTajweedColors(enabled);
        const rdrCheck = document.getElementById('rdr-toggle-tajweed');
        if (rdrCheck) rdrCheck.checked = enabled;
    }
    
    // Special handling for waqf marks
    if (settingName === 'waqf') {
        if (typeof toggleWaqfMarks === 'function') toggleWaqfMarks(enabled);
        const rdrCheck = document.getElementById('rdr-toggle-waqf');
        if (rdrCheck) rdrCheck.checked = enabled;
    }

    // Special handling for translation (needs live reload)
    if (settingName === 'translation') {
        showTranslation = enabled;
        localStorage.setItem('hamsatShowTranslation', enabled ? 'true' : 'false');
        const transCheckbox = document.getElementById('translation-checkbox');
        if (transCheckbox) transCheckbox.checked = enabled;
        if (currentSurahNumber && currentReadingMode === 'scroll') {
            if (enabled) {
                loadSurahWithTranslation(currentSurahNumber);
            } else {
                loadSurahForScroll(currentSurahNumber);
            }
        }
    }

    // Show toast for all settings
    const label = labels[settingName];
    if (label) {
        showToast(enabled ? label[0] : label[1]);
    } else {
        showToast(enabled ? 'تم التفعيل ✓' : 'تم الإيقاف');
    }
}

// --- Audio Settings ---
// ========== AUDIO SETTINGS ==========
let currentReciter = localStorage.getItem('hamsatReciter') || 'ar.alafasy';
let playbackSpeed = parseFloat(localStorage.getItem('hamsatPlaybackSpeed')) || 1;

function setReciter(reciterId) {
    currentReciter = reciterId;
    localStorage.setItem('hamsatReciter', reciterId);
    
    // Update audio engine
    if (typeof audioEngine !== 'undefined' && typeof RECITER_MAP !== 'undefined') {
        audioEngine.currentReciter = reciterId;
        if (audioEngine.playing) {
            playAyah(audioEngine.currentSurah, audioEngine.currentAyah, audioEngine.autoAdvance);
        }
    }
    
    const reciterNames = {
        'ar.alafasy': 'مشاري العفاسي',
        'ar.abdurrahmaansudais': 'عبدالرحمن السديس',
        'ar.saudalshuraim': 'سعود الشريم',
        'ar.maaboralhazmy': 'ماهر المعيقلي',
        'ar.husary': 'محمود خليل الحصري',
        'ar.minshawi': 'محمد صديق المنشاوي',
        'ar.abdulbasit': 'عبدالباسط عبدالصمد'
    };
    
    showToast(`القارئ: ${reciterNames[reciterId] || reciterId} ✓`);
    applyAllSettingsLive();
    if (typeof highlightActiveReciter === 'function') highlightActiveReciter();
}

function setPlaybackSpeed(speed) {
    playbackSpeed = parseFloat(speed);
    localStorage.setItem('hamsatPlaybackSpeed', speed);
    
    // Update audio engine
    if (typeof audioEngine !== 'undefined') {
        audioEngine.playbackRate = playbackSpeed;
        if (audioEngine.audio) audioEngine.audio.playbackRate = playbackSpeed;
    }
    
    // Update all speed UI
    document.querySelectorAll('.mp-speed-btn, .audio-speed-pill').forEach(btn => {
        btn.classList.toggle('active', parseFloat(btn.textContent) === playbackSpeed);
    });
    
    showToast(`سرعة الصوت: ${speed}x ✓`);
    applyAllSettingsLive();
}

// --- Repeat Mode ---
// ========== REPEAT MODE SETTINGS ==========
let repeatMode = localStorage.getItem('hamsatRepeatMode') || 'none';

function updateRepeatMode(mode) {
    repeatMode = mode;
    localStorage.setItem('hamsatRepeatMode', mode);
    
    // Show/hide relevant options (settings page)
    const ayahOptions = document.getElementById('repeat-ayah-settings');
    const rangeOptions = document.getElementById('repeat-range-settings');
    const surahOptions = document.getElementById('repeat-surah-settings');
    const juzOptions = document.getElementById('repeat-juz-settings');
    
    if (ayahOptions) ayahOptions.style.display = mode === 'ayah' ? 'block' : 'none';
    if (rangeOptions) rangeOptions.style.display = mode === 'range' ? 'block' : 'none';
    if (surahOptions) surahOptions.style.display = (mode === 'surah' || mode === 'multi-surah') ? 'block' : 'none';
    if (juzOptions) juzOptions.style.display = mode === 'juz' ? 'block' : 'none';
    
    // Show/hide audio page panels
    const audioAyah = document.getElementById('audio-repeat-ayah');
    const audioRange = document.getElementById('audio-repeat-range');
    const audioSurah = document.getElementById('audio-repeat-surah');
    const audioMulti = document.getElementById('audio-repeat-multi-surah');
    const audioJuz = document.getElementById('audio-repeat-juz');
    if (audioAyah) audioAyah.style.display = mode === 'ayah' ? 'block' : 'none';
    if (audioRange) audioRange.style.display = mode === 'range' ? 'block' : 'none';
    if (audioSurah) audioSurah.style.display = mode === 'surah' ? 'block' : 'none';
    if (audioMulti) audioMulti.style.display = mode === 'multi-surah' ? 'block' : 'none';
    if (audioJuz) audioJuz.style.display = mode === 'juz' ? 'block' : 'none';
    
    const modeNames = {
        'none': 'بدون تكرار',
        'ayah': 'تكرار الآية',
        'range': 'تكرار مجموعة آيات',
        'surah': 'تكرار السورة',
        'multi-surah': 'تكرار عدة سور',
        'juz': 'تكرار الجزء'
    };
    
    showToast(`وضع التكرار: ${modeNames[mode]} ✓`);
    
    // Hook into audio engine
    if (typeof onRepeatModeChanged === 'function') onRepeatModeChanged(mode);
}

// --- Goals & Notifications ---
// ========== DAILY GOAL SETTINGS ==========
let dailyGoalPages = parseInt(localStorage.getItem('hamsatDailyGoal')) || 5;

function setDailyGoal(pages) {
    dailyGoalPages = parseInt(pages);
    localStorage.setItem('hamsatDailyGoal', pages);
    showToast(`الهدف اليومي: ${pages} صفحات ✓`);
    updateGarminDashboard();
    
    // Sync all pages immediately
    applyAllSettingsLive();
}

// ========== NOTIFICATIONS SETTINGS ==========
function toggleNotifications(enabled) {
    localStorage.setItem('hamsatNotifications', enabled ? 'true' : 'false');
    
    if (enabled && 'Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showToast('الإشعارات: مفعلة ✓');
            } else {
                showToast('يرجى السماح بالإشعارات من المتصفح');
            }
        });
    } else {
        showToast('الإشعارات: معطلة');
    }
}

// --- Data Management ---
// ========== DATA MANAGEMENT ==========
function exportData() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('hamsat')) {
            data[key] = localStorage.getItem(key);
        }
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hamsat-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('تم تصدير البيانات ✓');
}

function importData(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            Object.keys(data).forEach(key => {
                localStorage.setItem(key, data[key]);
            });
            showToast('تم استيراد البيانات ✓');
            setTimeout(() => location.reload(), 1000);
        } catch (err) {
            showToast('خطأ في قراءة الملف');
        }
    };
    reader.readAsText(file);
}

// Clear all app data
function clearAllData() {
    if (confirm('هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
        // Clear all hamsat localStorage items
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('hamsat')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        alert('تم مسح جميع البيانات بنجاح ✓');
        location.reload();
    }
}

// Load app settings on startup

