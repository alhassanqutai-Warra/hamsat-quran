/* misbaha-stats.js — Populates misbaha/tasbeeh statistics on home page
   Reads from hamsatMisbaha + hamsatTasbeeh localStorage keys
   Uses helper functions exposed by misbaha-realistic.js */

(function() {
    'use strict';

    var DHIKR_LABELS = {
        subhanallah: 'سبحان الله',
        alhamdulillah: 'الحمد لله',
        allahuakbar: 'الله أكبر',
        lailaha: 'لا إله إلا الله',
        astaghfirullah: 'أستغفر الله',
        tasbeeh100: 'تسبيح ١٠٠'
    };

    function getAllStats() {
        var combined = {};
        // From realistic misbaha
        try {
            var m = JSON.parse(localStorage.getItem('hamsatMisbaha') || '{}');
            Object.keys(m).forEach(function(k) {
                combined[k] = {
                    total: (m[k].total || 0),
                    rounds: (m[k].rounds || 0),
                    dates: m[k].dates || {}
                };
            });
        } catch(e) {}
        // From worship.js digital tasbeeh (avoid double-counting)
        try {
            var t = JSON.parse(localStorage.getItem('hamsatTasbeeh') || '{}');
            Object.keys(t).forEach(function(k) {
                if (!combined[k]) {
                    combined[k] = {
                        total: (t[k].total || 0),
                        rounds: (t[k].rounds || 0),
                        dates: t[k].dates || {}
                    };
                }
            });
        } catch(e) {}
        return combined;
    }

    function getTopDhikr(stats) {
        var top = '', max = 0;
        Object.keys(stats).forEach(function(k) {
            if (stats[k].total > max) {
                max = stats[k].total;
                top = k;
            }
        });
        return DHIKR_LABELS[top] || top || '-';
    }

    function getBestDay(stats) {
        var dayTotals = {};
        Object.keys(stats).forEach(function(k) {
            var dates = stats[k].dates || {};
            Object.keys(dates).forEach(function(d) {
                dayTotals[d] = (dayTotals[d] || 0) + dates[d];
            });
        });
        var best = 0;
        Object.keys(dayTotals).forEach(function(d) {
            if (dayTotals[d] > best) best = dayTotals[d];
        });
        return best;
    }

    function getTasbeehLevel(allTimeTotal) {
        if (allTimeTotal >= 100000) return 'حافظ الذكر';
        if (allTimeTotal >= 50000) return 'ذاكر متقدم';
        if (allTimeTotal >= 10000) return 'ذاكر نشط';
        if (allTimeTotal >= 1000) return 'مواظب';
        if (allTimeTotal >= 100) return 'متحمس';
        return 'مبتدئ';
    }

    function formatNumber(n) {
        if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
        if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
        return n.toString();
    }

    function updateMisbahaStats() {
        // Use exposed helpers if available, otherwise compute locally
        var todayTotal = 0, allTimeTotal = 0, allTimeRounds = 0, weekTotal = 0;

        if (typeof window.getMisbahaDailyTotal === 'function') {
            todayTotal = window.getMisbahaDailyTotal();
        }
        if (typeof window.getMisbahaAllTimeTotal === 'function') {
            allTimeTotal = window.getMisbahaAllTimeTotal();
        }
        if (typeof window.getMisbahaAllTimeRounds === 'function') {
            allTimeRounds = window.getMisbahaAllTimeRounds();
        }
        if (typeof window.getMisbahaWeekTotal === 'function') {
            weekTotal = window.getMisbahaWeekTotal();
        }

        // If helpers not loaded yet, compute from localStorage directly
        if (!window.getMisbahaDailyTotal) {
            var stats = getAllStats();
            var today = new Date().toISOString().split('T')[0];
            var now = new Date();
            Object.keys(stats).forEach(function(k) {
                allTimeTotal += stats[k].total || 0;
                allTimeRounds += stats[k].rounds || 0;
                if (stats[k].dates && stats[k].dates[today]) {
                    todayTotal += stats[k].dates[today];
                }
                for (var i = 0; i < 7; i++) {
                    var d = new Date(now);
                    d.setDate(d.getDate() - i);
                    var key = d.toISOString().split('T')[0];
                    if (stats[k].dates && stats[k].dates[key]) {
                        weekTotal += stats[k].dates[key];
                    }
                }
            });
        }

        var allStats = getAllStats();

        // Update DOM
        var el;
        el = document.getElementById('tasbeeh-today');
        if (el) el.textContent = formatNumber(todayTotal);

        el = document.getElementById('tasbeeh-total');
        if (el) el.textContent = formatNumber(allTimeTotal);

        el = document.getElementById('tasbeeh-rounds');
        if (el) el.textContent = formatNumber(allTimeRounds);

        el = document.getElementById('tasbeeh-week');
        if (el) el.textContent = formatNumber(weekTotal);

        el = document.getElementById('tasbeeh-top-dhikr');
        if (el) el.textContent = getTopDhikr(allStats);

        el = document.getElementById('tasbeeh-best-day');
        if (el) el.textContent = formatNumber(getBestDay(allStats));

        el = document.getElementById('tasbeeh-level');
        if (el) el.textContent = getTasbeehLevel(allTimeTotal);
    }

    // Expose globally
    window.updateMisbahaStats = updateMisbahaStats;

    // Auto-update when home page loads
    document.addEventListener('DOMContentLoaded', function() {
        updateMisbahaStats();
    });
})();
