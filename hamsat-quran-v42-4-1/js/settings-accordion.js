/** Settings Accordion — Hamsat Quran V41.4 */
(function() {
    'use strict';
    var done = false;
    
    function initAccordion() {
        if (done) return;
        var sections = document.querySelectorAll('#page-settings .settings-section');
        if (!sections.length) return;
        done = true;
        
        sections.forEach(function(section) {
            var title = section.querySelector('.settings-title');
            if (!title) return;
            
            var content = document.createElement('div');
            content.className = 'settings-content';
            content.style.maxHeight = '0';
            content.style.overflow = 'hidden';
            content.style.transition = 'max-height 0.4s ease-out';
            
            var items = [];
            var sibling = title.nextElementSibling;
            while (sibling) {
                items.push(sibling);
                sibling = sibling.nextElementSibling;
            }
            items.forEach(function(item) { content.appendChild(item); });
            section.appendChild(content);
            
            var arrow = document.createElement('span');
            arrow.className = 'settings-title-arrow';
            arrow.textContent = '▼';
            arrow.style.cssText = 'font-size:12px;transition:transform 0.3s;color:var(--text-muted,#888);margin-inline-start:auto;padding-inline-start:10px;';
            title.appendChild(arrow);
            
            title.style.cursor = 'pointer';
            title.style.display = 'flex';
            title.style.alignItems = 'center';
            title.style.userSelect = 'none';
            
            title.addEventListener('click', function() {
                var isOpen = section.classList.contains('open');
                
                sections.forEach(function(s) {
                    s.classList.remove('open');
                    var c = s.querySelector('.settings-content');
                    var a = s.querySelector('.settings-title-arrow');
                    if (c) c.style.maxHeight = '0';
                    if (a) a.style.transform = 'rotate(0deg)';
                });
                
                if (!isOpen) {
                    section.classList.add('open');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    arrow.style.transform = 'rotate(180deg)';
                }
            });
        });
        
        // Open first section by default
        var first = sections[0];
        if (first) {
            first.classList.add('open');
            var c = first.querySelector('.settings-content');
            var a = first.querySelector('.settings-title-arrow');
            if (c) c.style.maxHeight = c.scrollHeight + 'px';
            if (a) a.style.transform = 'rotate(180deg)';
        }
    }
    
    document.addEventListener('DOMContentLoaded', initAccordion);
    
    // Re-init only when settings page becomes active (attributes only, no subtree)
    document.addEventListener('DOMContentLoaded', function() {
        var sp = document.getElementById('page-settings');
        if (sp) {
            new MutationObserver(function() {
                if (sp.classList.contains('active') && !done) {
                    initAccordion();
                }
            }).observe(sp, { attributes: true, attributeFilter: ['class'] });
        }
    });
})();
