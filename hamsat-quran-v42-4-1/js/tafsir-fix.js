/**
 * Tafsir Fix — Jalalayn Direct Fallback
 * Hamsat Quran V41.4
 * 
 * Patches Jalalayn tafsir to use multiple known-good API endpoints
 * Loads AFTER tafsir.js to override/supplement
 */
(function() {
    'use strict';

    // Fix Arabic Jalalayn spa5kSlug if it got mangled by obfuscation
    if (typeof approvedTafsirs !== 'undefined' && approvedTafsirs.jalalayn) {
        approvedTafsirs.jalalayn.spa5kSlug = 'ar-tafsir-al-jalalayn';
        approvedTafsirs.jalalayn.quranTafseerId = 2;
        approvedTafsirs.jalalayn.quranComId = 74;
    }

    // Also fix English Jalalayn
    if (typeof approvedTafsirs !== 'undefined' && approvedTafsirs['en-jalalayn']) {
        approvedTafsirs['en-jalalayn'].spa5kSlug = 'en-al-jalalayn';
        approvedTafsirs['en-jalalayn'].quranComId = 74;
    }

    // Save original loadTafsir
    var _origLoadTafsir = typeof loadTafsir === 'function' ? loadTafsir : null;

    // Jalalayn-specific fallback URLs
    var JALALAYN_APIS = [
        // spa5k CDN (most reliable)
        function(s, a) { return 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/ar-tafsir-al-jalalayn/' + s + '/' + a + '.json'; },
        // quran-tafseer.com (id=2 for jalalayn)
        function(s, a) { return 'https://api.quran-tafseer.com/tafseer/2/' + s + '/' + a; },
        // spa5k static
        function(s, a) { return 'https://api.spa5k.me/tafsir/ar-tafsir-al-jalalayn/' + s + '/' + a; },
        // raw GitHub
        function(s, a) { return 'https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/ar-tafsir-al-jalalayn/' + s + '/' + a + '.json'; },
        // quran.com v4 (resource 74)
        function(s, a) { return 'https://api.quran.com/api/v4/verses/by_key/' + s + ':' + a + '?tafsirs=74&tafsir_fields=text,resource_id'; }
    ];

    var EN_JALALAYN_APIS = [
        function(s, a) { return 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/en-al-jalalayn/' + s + '/' + a + '.json'; },
        function(s, a) { return 'https://api.spa5k.me/tafsir/en-al-jalalayn/' + s + '/' + a; },
        function(s, a) { return 'https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/en-al-jalalayn/' + s + '/' + a + '.json'; },
        function(s, a) { return 'https://api.quran.com/api/v4/verses/by_key/' + s + ':' + a + '?tafsirs=74&tafsir_fields=text,resource_id'; }
    ];

    // Extract text from various API response formats
    function extractText(data) {
        if (!data) return null;
        if (typeof data === 'string' && data.length > 10 && data.charAt(0) !== '<') return data;
        if (data.text && typeof data.text === 'string' && data.text.length > 5) return data.text;
        if (data.tafsir && data.tafsir.text) return data.tafsir.text;
        if (data.tafsirs && data.tafsirs[0] && data.tafsirs[0].text) return data.tafsirs[0].text;
        if (data.verse && data.verse.tafsirs && data.verse.tafsirs[0]) return data.verse.tafsirs[0].text;
        if (data.data && data.data.text) return data.data.text;
        if (data.content && typeof data.content === 'string') return data.content;
        // Try any string property > 50 chars
        for (var k in data) {
            if (data.hasOwnProperty(k) && typeof data[k] === 'string' && data[k].length > 50) return data[k];
        }
        return null;
    }

    async function fetchWithTimeout(url, ms) {
        var ctrl = new AbortController();
        var timer = setTimeout(function() { ctrl.abort(); }, ms || 10000);
        try {
            var res = await fetch(url, { signal: ctrl.signal });
            clearTimeout(timer);
            if (!res.ok) return null;
            var txt = await res.text();
            if (!txt || txt.length < 5) return null;
            try {
                var json = JSON.parse(txt);
                return extractText(json);
            } catch(e) {
                if (txt.length > 15 && txt.charAt(0) !== '<') return txt;
            }
            return null;
        } catch(e) {
            clearTimeout(timer);
            return null;
        }
    }

    // Override loadTafsir for jalalayn sources
    var origLoadTafsir = window.loadTafsir;
    window.loadTafsir = async function(source) {
        if (source !== 'jalalayn' && source !== 'en-jalalayn') {
            // Use original for non-jalalayn
            if (origLoadTafsir) return origLoadTafsir(source);
            return;
        }

        var info = approvedTafsirs[source];
        if (!info) return;

        var surah = currentTafsirSurah;
        var ayah = currentTafsirAyah;
        var cacheKey = source + '_' + surah + '_' + ayah;

        // Check cache first
        if (typeof tafsirCache !== 'undefined' && tafsirCache[cacheKey]) {
            displayTafsirText(tafsirCache[cacheKey], info);
            return;
        }

        // Show loading
        var el = document.getElementById('tafsir-text');
        if (el) {
            var loadMsg = source === 'en-jalalayn' ? 'Loading Al-Jalalayn...' : 'جاري تحميل تفسير الجلالين...';
            el.innerHTML = '<div class="tafsir-loading"><div class="loading-spinner"></div><p>' + loadMsg + '</p></div>';
        }
        // Update source name
        var srcEl = document.getElementById('tafsir-source-name');
        if (srcEl) srcEl.textContent = info.name;
        var authEl = document.getElementById('tafsir-author');
        if (authEl) authEl.textContent = info.fullName + ' (' + info.school + ')';

        var apis = source === 'en-jalalayn' ? EN_JALALAYN_APIS : JALALAYN_APIS;
        var result = null;

        for (var i = 0; i < apis.length; i++) {
            var url = apis[i](surah, ayah);
            console.log('[Tafsir Fix] Trying:', url);
            result = await fetchWithTimeout(url, 10000);
            if (result && result.length > 10) {
                console.log('[Tafsir Fix] ✅ Got Jalalayn from source', i);
                break;
            }
        }

        if (result && result.length > 10) {
            if (typeof tafsirCache !== 'undefined') tafsirCache[cacheKey] = result;
            displayTafsirText(result, info);
        } else {
            console.warn('[Tafsir Fix] ❌ All Jalalayn sources failed');
            displayTafsirError(source, info);
        }
    };

    console.log('📖 Tafsir Fix loaded — Jalalayn patched');
})();
