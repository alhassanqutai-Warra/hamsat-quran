/**
 * Tafsir Offline Cache — Hamsat Quran V41.4
 * 
 * Intercepts tafsir API fetches → caches in IndexedDB → serves offline
 * Progressive: caches as user reads, optional bulk download
 */
(function() {
    'use strict';
    
    var DB_NAME = 'hamsat-tafsir-cache';
    var DB_VERSION = 1;
    var STORE_NAME = 'tafsir';
    var db = null;
    
    // Tafsir API domains to intercept
    var TAFSIR_DOMAINS = [
        'cdn.jsdelivr.net/gh/spa5k/tafsir_api',
        'raw.githubusercontent.com/spa5k/tafsir_api',
        'api.quran-tafseer.com',
        'api.quran.com/api/v4',
        'api.spa5k.me'
    ];
    
    // ─── IndexedDB Setup ───
    function openDB() {
        return new Promise(function(resolve, reject) {
            if (db) { resolve(db); return; }
            var req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = function(e) {
                var d = e.target.result;
                if (!d.objectStoreNames.contains(STORE_NAME)) {
                    d.createObjectStore(STORE_NAME);
                }
            };
            req.onsuccess = function(e) { db = e.target.result; resolve(db); };
            req.onerror = function() { resolve(null); };
        });
    }
    
    function cacheGet(key) {
        return new Promise(function(resolve) {
            openDB().then(function(d) {
                if (!d) { resolve(null); return; }
                try {
                    var tx = d.transaction(STORE_NAME, 'readonly');
                    var store = tx.objectStore(STORE_NAME);
                    var req = store.get(key);
                    req.onsuccess = function() { resolve(req.result || null); };
                    req.onerror = function() { resolve(null); };
                } catch(e) { resolve(null); }
            });
        });
    }
    
    function cacheSet(key, value) {
        return new Promise(function(resolve) {
            openDB().then(function(d) {
                if (!d) { resolve(); return; }
                try {
                    var tx = d.transaction(STORE_NAME, 'readwrite');
                    var store = tx.objectStore(STORE_NAME);
                    store.put(value, key);
                    tx.oncomplete = function() { resolve(); };
                    tx.onerror = function() { resolve(); };
                } catch(e) { resolve(); }
            });
        });
    }
    
    // ─── Extract cache key from URL ───
    function getCacheKey(url) {
        // spa5k CDN/raw: .../tafsir/{slug}/{surah}/{ayah}.json
        var m = url.match(/tafsir[_-]?api[^\/]*\/(?:main\/)?tafsir\/([^\/]+)\/(\d+)\/(\d+)/);
        if (m) return m[1] + ':' + m[2] + ':' + m[3];
        
        // spa5k static
        m = url.match(/spa5k\.me[^\/]*\/tafsir\/([^\/]+)\/(\d+)\/(\d+)/);
        if (m) return m[1] + ':' + m[2] + ':' + m[3];
        
        // quran-tafseer.com: /tafseer/{id}/{surah}/{ayah}
        m = url.match(/quran-tafseer\.com\/tafseer\/(\d+)\/(\d+)\/(\d+)/);
        if (m) return 'qt:' + m[1] + ':' + m[2] + ':' + m[3];
        
        // quran.com: /verses/by_key/{surah}:{ayah}?tafsirs={id}
        m = url.match(/quran\.com\/api\/v4\/verses\/by_key\/(\d+):(\d+).*tafsirs=(\d+)/);
        if (m) return 'qc:' + m[3] + ':' + m[1] + ':' + m[2];
        
        return null;
    }
    
    function isTafsirURL(url) {
        for (var i = 0; i < TAFSIR_DOMAINS.length; i++) {
            if (url.indexOf(TAFSIR_DOMAINS[i]) !== -1) return true;
        }
        return false;
    }
    
    // ─── Intercept fetch ───
    var originalFetch = window.fetch;
    
    window.fetch = function(input, init) {
        var url = (typeof input === 'string') ? input : (input && input.url ? input.url : '');
        
        if (!isTafsirURL(url)) {
            return originalFetch.call(window, input, init);
        }
        
        var key = getCacheKey(url);
        if (!key) {
            return originalFetch.call(window, input, init);
        }
        
        // Check cache first
        return cacheGet(key).then(function(cached) {
            if (cached) {
                // Return cached response
                return new Response(cached, {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            // Fetch from network
            return originalFetch.call(window, input, init).then(function(response) {
                if (!response.ok) return response;
                
                // Clone response to cache it
                var clone = response.clone();
                clone.text().then(function(text) {
                    if (text && text.length > 10) {
                        cacheSet(key, text);
                    }
                });
                
                return response;
            }).catch(function(err) {
                // Network failed, no cache - return error
                return new Response('{"error":"offline"}', {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' }
                });
            });
        });
    };
    
    // ─── Bulk Download for Offline ───
    // Downloads Jalalayn (AR) + Jalalayn (EN) for all 114 surahs
    var BULK_SOURCES = [
        { slug: 'ar-tafseer-al-jalalayn', base: 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/ar-tafseer-al-jalalayn' },
        { slug: 'en-al-jalalayn', base: 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/en-al-jalalayn' }
    ];
    
    var SURAH_AYAHS = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
    
    window.downloadTafsirOffline = function(progressCallback) {
        var total = 0;
        BULK_SOURCES.forEach(function() {
            SURAH_AYAHS.forEach(function(count) { total += count; });
        });
        
        var done = 0;
        var failed = 0;
        var cancelled = false;
        
        // Store cancel function
        window._tafsirDownloadCancel = function() { cancelled = true; };
        
        function next(srcIdx, surahIdx, ayahIdx) {
            if (cancelled) {
                if (progressCallback) progressCallback(done, total, failed, 'cancelled');
                return;
            }
            if (srcIdx >= BULK_SOURCES.length) {
                if (progressCallback) progressCallback(done, total, failed, 'done');
                return;
            }
            
            var src = BULK_SOURCES[srcIdx];
            var surah = surahIdx + 1;
            var ayah = ayahIdx + 1;
            var key = src.slug + ':' + surah + ':' + ayah;
            var url = src.base + '/' + surah + '/' + ayah + '.json';
            
            // Check if already cached
            cacheGet(key).then(function(existing) {
                if (existing) {
                    done++;
                    if (progressCallback && done % 50 === 0) progressCallback(done, total, failed, 'progress');
                    advance(srcIdx, surahIdx, ayahIdx);
                    return;
                }
                
                // Download
                originalFetch(url).then(function(r) {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    return r.text();
                }).then(function(text) {
                    if (text && text.length > 5) {
                        return cacheSet(key, text);
                    }
                }).then(function() {
                    done++;
                    if (progressCallback && done % 20 === 0) progressCallback(done, total, failed, 'progress');
                    advance(srcIdx, surahIdx, ayahIdx);
                }).catch(function() {
                    failed++;
                    done++;
                    advance(srcIdx, surahIdx, ayahIdx);
                });
            });
        }
        
        function advance(srcIdx, surahIdx, ayahIdx) {
            var nextAyah = ayahIdx + 1;
            if (nextAyah >= SURAH_AYAHS[surahIdx]) {
                var nextSurah = surahIdx + 1;
                if (nextSurah >= 114) {
                    next(srcIdx + 1, 0, 0);
                } else {
                    next(srcIdx, nextSurah, 0);
                }
            } else {
                // Small delay to not overwhelm
                setTimeout(function() { next(srcIdx, surahIdx, nextAyah); }, 30);
            }
        }
        
        if (progressCallback) progressCallback(0, total, 0, 'start');
        next(0, 0, 0);
    };
    
    // ─── Cache Stats ───
    window.getTafsirCacheStats = function() {
        return new Promise(function(resolve) {
            openDB().then(function(d) {
                if (!d) { resolve({ count: 0 }); return; }
                try {
                    var tx = d.transaction(STORE_NAME, 'readonly');
                    var store = tx.objectStore(STORE_NAME);
                    var req = store.count();
                    req.onsuccess = function() { resolve({ count: req.result }); };
                    req.onerror = function() { resolve({ count: 0 }); };
                } catch(e) { resolve({ count: 0 }); }
            });
        });
    };
    
    window.clearTafsirCache = function() {
        return new Promise(function(resolve) {
            openDB().then(function(d) {
                if (!d) { resolve(); return; }
                try {
                    var tx = d.transaction(STORE_NAME, 'readwrite');
                    tx.objectStore(STORE_NAME).clear();
                    tx.oncomplete = function() { resolve(); };
                } catch(e) { resolve(); }
            });
        });
    };
    
    // Init DB on load
    openDB();
})();

// ─── Download UI Functions ───
window.startTafsirDownload = function() {
    var btn = document.getElementById('tafsir-download-btn');
    var progress = document.getElementById('tafsir-download-progress');
    var area = document.getElementById('tafsir-download-area');
    
    if (area) area.style.display = 'none';
    if (progress) progress.style.display = 'block';
    
    window.downloadTafsirOffline(function(done, total, failed, status) {
        var bar = document.getElementById('tafsir-progress-bar');
        var text = document.getElementById('tafsir-progress-text');
        var pct = Math.round((done / total) * 100);
        
        if (bar) bar.style.width = pct + '%';
        
        if (status === 'done') {
            if (text) text.textContent = '✅ تم تحميل ' + (done - failed) + ' من ' + total + ' تفسير بنجاح!';
            var cancel = document.getElementById('tafsir-cancel-btn');
            if (cancel) cancel.style.display = 'none';
            updateCacheStatus();
            setTimeout(function() {
                if (progress) progress.style.display = 'none';
                if (area) { area.style.display = 'block'; if (btn) btn.textContent = '✅ تم التحميل — اضغط لتحديث'; }
            }, 3000);
        } else if (status === 'cancelled') {
            if (text) text.textContent = '⚠️ تم الإلغاء — تم حفظ ' + done + ' تفسير';
            setTimeout(function() {
                if (progress) progress.style.display = 'none';
                if (area) area.style.display = 'block';
            }, 2000);
        } else {
            if (text) text.textContent = '⏳ جاري التحميل... ' + done + ' / ' + total + ' (' + pct + '%)';
        }
    });
};

window.cancelTafsirDownload = function() {
    if (window._tafsirDownloadCancel) window._tafsirDownloadCancel();
};

function updateCacheStatus() {
    if (window.getTafsirCacheStats) {
        window.getTafsirCacheStats().then(function(stats) {
            var el = document.getElementById('tafsir-cache-status');
            if (el && stats.count > 0) {
                el.textContent = '📦 محفوظ: ' + stats.count + ' تفسير — يعمل بدون إنترنت';
            }
        });
    }
}

// Update status on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateCacheStatus, 1000);
});
