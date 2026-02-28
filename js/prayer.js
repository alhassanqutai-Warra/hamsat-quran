/**
 * Prayer Times - Hamsat Quran V41.6
 * Full-featured: GPS, calculation methods, live countdown, hijri date, caching
 * API: api.aladhan.com
 */

// === STATE ===
let prayerTimesData = null;
let prayerCountdownInterval = null;
let prayerLocation = null;
let prayerTimeFormat = localStorage.getItem('hamsatTimeFormat') || '24h';
let prayerCalcMethod = parseInt(localStorage.getItem('hamsatCalcMethod')) || 4;

const PRAYER_NAMES = {
    Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر',
    Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء'
};
const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const FARD_PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const CALC_METHODS = {
    4: 'أم القرى - مكة المكرمة', 5: 'الهيئة المصرية العامة للمساحة',
    3: 'رابطة العالم الإسلامي', 2: 'ISNA - أمريكا الشمالية',
    1: 'جامعة كراتشي', 7: 'معهد الجيوفيزياء - طهران',
    8: 'خليج - الكويت', 9: 'الكويت', 10: 'قطر',
    11: 'سنغافورة', 12: 'فرنسا (UOIF)', 13: 'تركيا (Diyanet)',
    14: 'روسيا', 15: 'الإمارات (GAIAE)'
};

// === FORMAT TIME ===
function formatPrayerTime(timeStr) {
    if (!timeStr) return '--:--';
    var clean = timeStr.replace(/\s*\(.*\)/, '').trim();
    if (prayerTimeFormat === '12h') {
        var parts = clean.split(':');
        if (parts.length < 2) return clean;
        var h = parseInt(parts[0]);
        var m = parts[1];
        var ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        if (h === 0) h = 12;
        return h + ':' + m + ' ' + ampm;
    }
    return clean;
}

// === TIME FORMAT TOGGLE ===
function setTimeFormat(fmt) {
    prayerTimeFormat = fmt;
    localStorage.setItem('hamsatTimeFormat', fmt);
    var btn24 = document.getElementById('btn-24h');
    var btn12 = document.getElementById('btn-12h');
    if (btn24 && btn12) {
        if (fmt === '24h') {
            btn24.style.background = 'var(--gold-primary)';
            btn24.style.color = 'var(--navy-dark)';
            btn24.style.borderColor = 'var(--gold-primary)';
            btn12.style.background = 'transparent';
            btn12.style.color = 'var(--text-primary)';
            btn12.style.borderColor = 'rgba(212,175,55,0.3)';
        } else {
            btn12.style.background = 'var(--gold-primary)';
            btn12.style.color = 'var(--navy-dark)';
            btn12.style.borderColor = 'var(--gold-primary)';
            btn24.style.background = 'transparent';
            btn24.style.color = 'var(--text-primary)';
            btn24.style.borderColor = 'rgba(212,175,55,0.3)';
        }
    }
    renderPrayerTimes();
    updateNextPrayer();
}

// === CALCULATION METHOD ===
function changeCalcMethod(method) {
    prayerCalcMethod = parseInt(method);
    localStorage.setItem('hamsatCalcMethod', prayerCalcMethod);
    localStorage.removeItem('hamsatPrayerCache');
    var nameEl = document.getElementById('prayer-method-name');
    if (nameEl) nameEl.textContent = 'طريقة الحساب: ' + (CALC_METHODS[prayerCalcMethod] || 'أم القرى');
    var lat = localStorage.getItem('hamsatPrayerLat');
    var lng = localStorage.getItem('hamsatPrayerLng');
    if (lat && lng) fetchPrayerTimes(parseFloat(lat), parseFloat(lng));
    else requestPrayerLocation();
}

// === INIT ===
function initPrayerTimes() {
    var methodSelect = document.getElementById('prayer-method-select');
    if (methodSelect) methodSelect.value = prayerCalcMethod;

    var cached = localStorage.getItem('hamsatPrayerCache');
    if (cached) {
        try {
            var data = JSON.parse(cached);
            var today = new Date().toDateString();
            if (data.date === today && data.timings && data.method == prayerCalcMethod) {
                prayerTimesData = data.timings;
                prayerLocation = data.location;
                renderPrayerTimes();
                updateNextPrayer();
                startPrayerCountdown();
                updatePrayerLocationBar();
                if (data.hijri) updateHijriDate(data.hijri);
                return;
            }
        } catch (e) { /* ignore */ }
    }
    var lat = localStorage.getItem('hamsatPrayerLat');
    var lng = localStorage.getItem('hamsatPrayerLng');
    if (lat && lng) fetchPrayerTimes(parseFloat(lat), parseFloat(lng));
    else requestPrayerLocation();
}

// === GPS LOCATION ===
function requestPrayerLocation() {
    var locText = document.getElementById('prayer-location-text');
    var refreshBtn = document.getElementById('prayer-refresh-btn');
    if (locText) locText.textContent = '📍 جارٍ تحديد الموقع...';
    if (refreshBtn) { refreshBtn.disabled = true; refreshBtn.textContent = '⏳'; }

    if (!navigator.geolocation) {
        if (locText) locText.textContent = '📍 الموقع غير متاح - استخدام الكويت';
        fetchPrayerTimes(29.3759, 47.9774, 'الكويت (افتراضي)');
        if (refreshBtn) { refreshBtn.disabled = false; refreshBtn.textContent = 'تحديث'; }
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function(pos) {
            var lat = pos.coords.latitude;
            var lng = pos.coords.longitude;
            localStorage.setItem('hamsatPrayerLat', lat);
            localStorage.setItem('hamsatPrayerLng', lng);
            if (refreshBtn) { refreshBtn.disabled = false; refreshBtn.textContent = 'تحديث'; }
            prayerLocation = lat.toFixed(2) + '°, ' + lng.toFixed(2) + '°';
            fetchPrayerTimes(lat, lng);
        },
        function(err) {
            console.warn('Prayer GPS error:', err.message);
            if (locText) locText.textContent = '📍 تعذر تحديد الموقع - استخدام الكويت';
            if (refreshBtn) { refreshBtn.disabled = false; refreshBtn.textContent = 'تحديث'; }
            fetchPrayerTimes(29.3759, 47.9774, 'الكويت (افتراضي)');
        },
        { timeout: 15000, enableHighAccuracy: false, maximumAge: 300000 }
    );
}

// === FETCH PRAYER TIMES ===
async function fetchPrayerTimes(lat, lng, locationName) {
    var locText = document.getElementById('prayer-location-text');
    if (locText && !locationName) locText.textContent = '📍 جارٍ جلب المواقيت...';

    try {
        var now = new Date();
        var url = 'https://api.aladhan.com/v1/timings/' + now.getDate() + '-' + (now.getMonth() + 1) + '-' + now.getFullYear() +
                  '?latitude=' + lat + '&longitude=' + lng + '&method=' + prayerCalcMethod;

        var response = await fetch(url);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        var json = await response.json();

        if (json.code === 200 && json.data) {
            prayerTimesData = json.data.timings;
            var meta = json.data.meta;
            if (locationName) {
                prayerLocation = locationName;
            } else if (meta && meta.timezone) {
                var tz = meta.timezone.split('/');
                prayerLocation = tz[tz.length - 1].replace(/_/g, ' ');
            }
            if (locText) locText.textContent = '📍 ' + (prayerLocation || lat.toFixed(2) + '°, ' + lng.toFixed(2) + '°');

            localStorage.setItem('hamsatPrayerCache', JSON.stringify({
                date: now.toDateString(),
                timings: prayerTimesData,
                location: prayerLocation,
                method: prayerCalcMethod,
                hijri: json.data.date && json.data.date.hijri ? json.data.date.hijri : null
            }));

            renderPrayerTimes();
            updateNextPrayer();
            startPrayerCountdown();
            if (json.data.date && json.data.date.hijri) updateHijriDate(json.data.date.hijri);
            var nameEl = document.getElementById('prayer-method-name');
            var methodName = meta && meta.method && meta.method.name ? meta.method.name : CALC_METHODS[prayerCalcMethod];
            if (nameEl) nameEl.textContent = 'طريقة الحساب: ' + methodName;
        } else {
            throw new Error('API returned error');
        }
    } catch (err) {
        console.error('Prayer fetch error:', err);
        if (locText) locText.textContent = '⚠️ تعذر جلب المواقيت - تحقق من الإنترنت';
        // Fallback: stale cache
        var cached = localStorage.getItem('hamsatPrayerCache');
        if (cached) {
            try {
                var data = JSON.parse(cached);
                if (data.timings) {
                    prayerTimesData = data.timings;
                    prayerLocation = data.location;
                    renderPrayerTimes();
                    updateNextPrayer();
                    startPrayerCountdown();
                    if (locText) locText.textContent = '📍 ' + (prayerLocation || '—') + ' (بيانات مخزنة)';
                }
            } catch (e) { /* ignore */ }
        }
    }
}

// === RENDER ===
function renderPrayerTimes() {
    if (!prayerTimesData) return;
    PRAYER_ORDER.forEach(function(name) {
        var el = document.getElementById('prayer-' + name.toLowerCase());
        if (el && prayerTimesData[name]) el.textContent = formatPrayerTime(prayerTimesData[name]);
    });
}

function updatePrayerLocationBar() {
    var el = document.getElementById('prayer-location-text');
    if (el && prayerLocation) el.textContent = '📍 ' + prayerLocation;
}

// === HIJRI DATE ===
function updateHijriDate(hijri) {
    var el = document.getElementById('prayer-hijri-date');
    if (el && hijri) {
        var day = hijri.day;
        var monthAr = hijri.month && hijri.month.ar ? hijri.month.ar : (hijri.month && hijri.month.en ? hijri.month.en : '');
        var year = hijri.year;
        el.textContent = '📅 ' + day + ' ' + monthAr + ' ' + year + ' هـ';
        var holidays = hijri.holidays || [];
        if (holidays.length > 0) el.textContent += ' — ' + holidays.join('، ');
    }
}

// === NEXT PRAYER ===
function getNextPrayer() {
    if (!prayerTimesData) return null;
    var now = new Date();
    var nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    for (var i = 0; i < FARD_PRAYERS.length; i++) {
        var name = FARD_PRAYERS[i];
        var ts = prayerTimesData[name];
        if (!ts) continue;
        var clean = ts.replace(/\s*\(.*\)/, '').trim();
        var p = clean.split(':');
        if (p.length < 2) continue;
        var pSec = parseInt(p[0]) * 3600 + parseInt(p[1]) * 60;
        if (pSec > nowSec) {
            return { name: name, nameAr: PRAYER_NAMES[name], time: clean, secondsLeft: pSec - nowSec };
        }
    }
    // Next is Fajr tomorrow
    var fStr = prayerTimesData.Fajr;
    if (!fStr) return null;
    var fc = fStr.replace(/\s*\(.*\)/, '').trim().split(':');
    var fSec = parseInt(fc[0]) * 3600 + parseInt(fc[1]) * 60;
    return { name: 'Fajr', nameAr: 'الفجر', time: fStr.replace(/\s*\(.*\)/, '').trim(), secondsLeft: (86400 - nowSec) + fSec };
}

function isPrayerPast(name) {
    if (!prayerTimesData || !prayerTimesData[name]) return false;
    var now = new Date();
    var nowMin = now.getHours() * 60 + now.getMinutes();
    var clean = prayerTimesData[name].replace(/\s*\(.*\)/, '').trim();
    var p = clean.split(':');
    return (parseInt(p[0]) * 60 + parseInt(p[1])) <= nowMin;
}

function updateNextPrayer() {
    var next = getNextPrayer();
    if (!next) return;
    var nameEl = document.getElementById('prayer-next-name');
    var timeEl = document.getElementById('prayer-next-time');
    if (nameEl) nameEl.textContent = next.nameAr;
    if (timeEl) timeEl.textContent = formatPrayerTime(next.time);
    updateCountdown(next);

    document.querySelectorAll('.prayer-time-row').forEach(function(row) {
        row.classList.remove('prayer-time-next', 'prayer-time-past');
        var prayer = row.dataset.prayer;
        if (prayer === next.name) row.classList.add('prayer-time-next');
        else if (prayer && isPrayerPast(prayer)) row.classList.add('prayer-time-past');
    });

    var homeNext = document.getElementById('home-next-prayer');
    if (homeNext) homeNext.textContent = next.nameAr + ' - ' + formatPrayerTime(next.time);
    updateHomePrayerTimes();
}

// === COUNTDOWN (live seconds) ===
function updateCountdown(next) {
    if (!next) return;
    var el = document.getElementById('prayer-next-countdown');
    if (!el) return;
    var s = next.secondsLeft;
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    if (h > 0) el.textContent = 'بعد ' + h + ':' + String(m).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
    else el.textContent = 'بعد ' + m + ':' + String(sec).padStart(2,'0');
}

function startPrayerCountdown() {
    if (prayerCountdownInterval) clearInterval(prayerCountdownInterval);
    prayerCountdownInterval = setInterval(function() {
        var next = getNextPrayer();
        if (next) {
            updateCountdown(next);
            if (next.secondsLeft <= 1) setTimeout(function() { updateNextPrayer(); }, 2000);
        }
    }, 1000);
}

// === HOME PAGE PRAYER TIMES ===
function updateHomePrayerTimes() {
    if (!prayerTimesData) return;
    var mapping = { 'الفجر': 'Fajr', 'الظهر': 'Dhuhr', 'العصر': 'Asr', 'المغرب': 'Maghrib', 'العشاء': 'Isha' };
    document.querySelectorAll('.progress-stat').forEach(function(stat) {
        var nameEl = stat.querySelector('.progress-stat-value');
        var labelEl = stat.querySelector('.progress-stat-label');
        if (nameEl && labelEl) {
            var pk = mapping[nameEl.textContent.trim()];
            if (pk && prayerTimesData[pk]) {
                var t = formatPrayerTime(prayerTimesData[pk]);
                var next = getNextPrayer();
                var isNext = next && next.name === pk;
                labelEl.textContent = t + (isPrayerPast(pk) && !isNext ? ' ✅' : isNext ? ' ◀' : '');
                nameEl.style.color = isNext ? 'var(--gold-primary)' : '';
            }
        }
    });
}

// === AUTO INIT ===
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(initPrayerTimes, 800); });
} else {
    setTimeout(initPrayerTimes, 800);
}
