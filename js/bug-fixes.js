/**
 * ═══════════════════════════════════════════════════════════════════════
 * BUG FIXES - V42.4.1
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Fixes:
 * 1. Misbaha counter appearing on all pages
 * 2. Navigation icons not highlighting active page
 * 3. Color contrast improvements
 * 
 * Date: 2026-02-28
 * ═══════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // FIX 1: Hide Misbaha Counter on Non-Misbaha Pages
    // ═══════════════════════════════════════════════════════════════════════
    
    function fixMisbahaVisibility() {
        const misbahaCounter = document.getElementById('tasbeeh-counter');
        const misbahaFloating = document.querySelector('.misbaha-floating');
        const misbahaStandalone = document.querySelector('.standalone-misbaha');
        
        // Get current page
        const currentPage = document.querySelector('.page-section.active');
        const currentPageId = currentPage ? currentPage.id : '';
        
        // Only show misbaha elements on misbaha pages
        const isMisbahaPage = currentPageId.includes('misbaha') || 
                             currentPageId.includes('tasbeeh') ||
                             window.location.pathname.includes('misbaha');
        
        // Hide/show based on current page
        if (misbahaCounter) {
            misbahaCounter.style.display = isMisbahaPage ? '' : 'none';
        }
        
        if (misbahaFloating) {
            misbahaFloating.style.display = isMisbahaPage ? '' : 'none';
        }
        
        if (misbahaStandalone) {
            misbahaStandalone.style.display = isMisbahaPage ? '' : 'none';
        }
        
        // Also hide any misbaha overlays
        const misbahaOverlays = document.querySelectorAll('[class*="misbaha"][class*="overlay"], [class*="tasbeeh"][class*="overlay"]');
        misbahaOverlays.forEach(overlay => {
            if (!isMisbahaPage) {
                overlay.style.display = 'none';
            }
        });
        
        console.log('✅ Misbaha visibility fixed. Current page:', currentPageId, 'Show misbaha:', isMisbahaPage);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // FIX 2: Navigation Active State Highlighting
    // ═══════════════════════════════════════════════════════════════════════
    
    function fixNavigationHighlight() {
        // Get all navigation tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        
        // Get current active page
        const activePage = document.querySelector('.page-section.active');
        const activePageId = activePage ? activePage.id : '';
        
        // Remove all active states first
        navTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.style.backgroundColor = '';
            tab.style.color = '';
        });
        
        // Map page IDs to nav tab data-page attributes
        const pageMapping = {
            'page-home': 'home',
            'page-reader': 'read',
            'page-audio': 'audio',
            'page-worship': 'worship',
            'page-misbaha': 'worship', // Misbaha is under worship
            'page-prayer': 'worship', // Prayer is under worship
            'page-community': 'community',
            'page-social': 'community',
            'page-settings': 'more',
            'page-marketplace': 'more'
        };
        
        // Find matching nav tab
        const targetNav = pageMapping[activePageId];
        
        if (targetNav) {
            const activeTab = document.querySelector(`.nav-tab[data-page="${targetNav}"]`);
            if (activeTab) {
                activeTab.classList.add('active');
                // Apply gold highlight
                activeTab.style.backgroundColor = 'rgba(212, 175, 55, 0.15)';
                activeTab.style.color = '#D4AF37';
                activeTab.style.borderTop = '3px solid #D4AF37';
            }
        }
        
        console.log('✅ Navigation highlight fixed. Active page:', activePageId, 'Active nav:', targetNav);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // FIX 3: Color Contrast Improvements
    // ═══════════════════════════════════════════════════════════════════════
    
    function fixColorContrast() {
        // Inject improved color styles
        const style = document.createElement('style');
        style.id = 'bug-fix-colors';
        style.textContent = `
            /* Navigation Icons - Better Contrast */
            .nav-tab {
                color: rgba(255, 255, 255, 0.6) !important;
                transition: all 0.3s ease;
            }
            
            .nav-tab.active {
                color: #D4AF37 !important;
                background-color: rgba(212, 175, 55, 0.15) !important;
                border-top: 3px solid #D4AF37 !important;
            }
            
            .nav-tab:hover {
                color: rgba(255, 255, 255, 0.9) !important;
                background-color: rgba(255, 255, 255, 0.05) !important;
            }
            
            /* Navigation Icons Emoji - Better Visibility */
            .nav-icon {
                filter: brightness(1.2);
                font-size: 20px;
            }
            
            .nav-tab.active .nav-icon {
                filter: brightness(1.5) contrast(1.2);
            }
            
            /* Misbaha Counter - Only show on misbaha page */
            #tasbeeh-counter,
            .misbaha-floating,
            .standalone-misbaha {
                display: none;
            }
            
            body[data-page="misbaha"] #tasbeeh-counter,
            body[data-page="misbaha"] .misbaha-floating,
            body[data-page="misbaha"] .standalone-misbaha {
                display: flex;
            }
            
            /* Reader Page - Better Text Contrast */
            .ayah-text {
                color: #FFFEF8 !important;
                text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            }
            
            .ayah-number {
                color: #D4AF37 !important;
                background: rgba(13, 27, 42, 0.8);
            }
            
            /* Toolbar Icons - Better Visibility */
            .reader-toolbar button,
            .audio-toolbar button {
                color: rgba(255, 255, 255, 0.8) !important;
            }
            
            .reader-toolbar button:hover,
            .audio-toolbar button:hover {
                color: #D4AF37 !important;
                background: rgba(212, 175, 55, 0.15) !important;
            }
            
            /* Stats Cards - Better Contrast */
            .stat-mini-value,
            .garmin-stat-value {
                color: #D4AF37 !important;
                font-weight: 700;
            }
            
            .stat-mini-label,
            .garmin-stat-label {
                color: rgba(255, 255, 255, 0.7) !important;
            }
        `;
        
        // Remove old style if exists
        const oldStyle = document.getElementById('bug-fix-colors');
        if (oldStyle) {
            oldStyle.remove();
        }
        
        document.head.appendChild(style);
        console.log('✅ Color contrast improvements applied');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Apply All Fixes
    // ═══════════════════════════════════════════════════════════════════════
    
    function applyAllFixes() {
        fixMisbahaVisibility();
        fixNavigationHighlight();
        fixColorContrast();
        
        // Set body data-page attribute for CSS targeting
        const activePage = document.querySelector('.page-section.active');
        if (activePage) {
            const pageId = activePage.id.replace('page-', '');
            document.body.setAttribute('data-page', pageId);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Initialize on Page Load
    // ═══════════════════════════════════════════════════════════════════════
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAllFixes);
    } else {
        applyAllFixes();
    }

    // Re-apply fixes when page changes (for SPA navigation)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('page-section') && target.classList.contains('active')) {
                    setTimeout(applyAllFixes, 100);
                }
            }
        });
    });

    // Observe page sections for class changes
    document.addEventListener('DOMContentLoaded', function() {
        const pageSections = document.querySelectorAll('.page-section');
        pageSections.forEach(section => {
            observer.observe(section, { attributes: true, attributeFilter: ['class'] });
        });
    });

    // Also listen for custom page change events
    window.addEventListener('pageChanged', applyAllFixes);
    window.addEventListener('hashchange', applyAllFixes);

    // Export for manual triggering if needed
    window.applyBugFixes = applyAllFixes;

    console.log('🔧 Bug fixes loaded (V42.4.1)');
})();
