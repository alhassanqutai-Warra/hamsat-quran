/** Feature Status — Coming Soon Overlays — Hamsat Quran V41.4 */
(function() {
    'use strict';
    
    var comingSoonPages = ['community', 'halal', 'marketplace', 'teachers', 'kids', 'progress'];
    
    function addOverlays() {
        comingSoonPages.forEach(function(pageId) {
            var page = document.getElementById('page-' + pageId);
            if (!page || page.dataset.csOverlay) return;
            page.dataset.csOverlay = '1';
            
            var children = page.children;
            for (var i = 0; i < children.length; i++) {
                if (!children[i].classList.contains('back-btn')) {
                    children[i].style.display = 'none';
                }
            }
            
            var overlay = document.createElement('div');
            overlay.className = 'coming-soon-overlay';
            overlay.innerHTML = 
                '<div class="cs-icon">🚧</div>' +
                '<div class="cs-title">قريباً إن شاء الله</div>' +
                '<div class="cs-subtitle" style="font-family:Amiri,serif;font-size:18px;line-height:2;margin-bottom:10px;">﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾</div>' +
                '<div class="cs-subtitle">نعمل على هذه الميزة بإذن الله<br>ترقّبوا التحديثات القادمة</div>' +
                '<div class="cs-badge">قريباً إن شاء الله 🔜</div>';
            
            page.appendChild(overlay);
        });
    }
    
    document.addEventListener('DOMContentLoaded', addOverlays);
})();
