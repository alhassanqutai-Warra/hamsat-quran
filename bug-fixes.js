/**
 * ═══════════════════════════════════════════════════════════════════════
 * BUG FIXES - V42.4.1
 * ═══════════════════════════════════════════════════════════════════════
 * Fixes:
 * 1. Misbaha counter appearing on all pages
 * 2. Navigation icons not highlighting active page
 * 3. Color contrast improvements
 * ═══════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';
    
    console.log('🔧 Loading bug fixes V42.4.1...');

    // ═══════════════════════════════════════════════════════════════════════
    // FIX 1: Hide Misbaha Counter on Non-Misbaha Pages
    // ═══════════════════════════════════════════════════════════════════════
    
    function hideMisbahaCounter() {
        // Find all misbaha-related elements
        const elements = [
            document.getElementById('tasbeeh-counter'),
            document.querySelector('.misbaha-floating'),
            document.querySelector('.standalone-misbaha')
        ];
        
        // Get current active page
        const activePage = document.querySelector('.page-section.active');
        const pageId = activePage ? activePage.id : '';
        
        // Only show on misbaha/worship pages
        const showMisbaha = pageId.includes('misbaha') || 
                           pageId.includes('tasbeeh') || 
                           pageId.includes('worship');
        
        // Hide or show based on current page
        elements.forEach(el => {
            if (el) {
                el.style.display = showMisbaha ? '' : 'none';
            }
        });
        
        // Also hide any floating misbaha overlays
        document.querySelectorAll('[class*="misbaha"], [class*="tasbeeh"]').forEach(el => {
            if (el.style.position === 'fixed' && !showMisbaha) {
                el.style.display = 'none';
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // FIX 2: Highlight Active Navigation Tab
    // ═══════════════════════════════════════════════════════════════════════
    
    function highlightActiveNav() {
        const navTabs = document.querySelectorAll('.nav-tab');
        const activePage = document.querySelector('.page-section.active');
        const pageId = activePage ? activePage.id : '';
        
        // Map page IDs to navigation tabs
        const pageToNav = {
            'page-home': 'home',
            'page-reader': 'read',
            'page-audio': 'audio',
            'page-worship': 'worship',
            'page-misbaha': 'worship',
            'page-prayer': 'worship',
            'page-community': 'community',
            'page-social': 'community',
            'page-settings': 'more',
            'page-marketplace': 'more'
        };
        
        const targetNav = pageToNav[pageId];
        
        // Reset all tabs
        navTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.style.backgroundColor = '';
            tab.style.color = 'rgba(255, 255, 255, 0.6)';
            tab.style.borderTop = '';
        });
        
        // Highlight active tab
        if (targetNav) {
            const activeTab = document.querySelector(`.nav-tab[data-page="${targetNav}"]`);
            if (activeTab) {
                activeTab.classList.add('active');
                activeTab.style.backgroundColor = 'rgba(212, 175, 55, 0.15)';
                activeTab.style.color = '#D4AF37';
                activeTab.style.borderTop = '3px solid #D4AF37';
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Apply All Fixes
    // ═══════════════════════════════════════════════════════════════════════
    
    function applyAllFixes() {
        hideMisbahaCounter();
        highlightActiveNav();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Initialize
    // ═══════════════════════════════════════════════════════════════════════
    
    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAllFixes);
    } else {
        applyAllFixes();
    }

    // Run when pages change (every 500ms check)
    setInterval(applyAllFixes, 500);

    // Also run on any page navigation events
    window.addEventListener('hashchange', applyAllFixes);
    window.addEventListener('popstate', applyAllFixes);

    // Export for manual triggering
    window.applyBugFixes = applyAllFixes;

    console.log('✅ Bug fixes loaded (V42.4.1)');
})();
