/* =============================================
   REALISTIC MISBAHA V2 — Hamsat Quran V42
   Self-contained misbaha with drag physics
   ============================================= */
(function() {
'use strict';

// =============================================
// GEMSTONE RENDERERS
// =============================================
var GEMS = [
    {
        id: 'black-onyx', name: '\u0639\u0642\u064A\u0642 \u0623\u0633\u0648\u062F',
        bead: function(c, x, y, r, hi) {
            var g = c.createRadialGradient(x-r*.3,y-r*.3,r*.05,x,y,r);
            g.addColorStop(0, hi?'#555':'#333');
            g.addColorStop(.5, hi?'#2a2a2a':'#1a1a1a');
            g.addColorStop(1, '#080808');
            c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle=g; c.fill();
            c.beginPath(); c.arc(x-r*.28,y-r*.28,r*.3,0,Math.PI*2);
            c.fillStyle=hi?'rgba(255,255,255,.35)':'rgba(255,255,255,.14)'; c.fill();
            c.beginPath(); c.arc(x+r*.12,y+r*.18,r*.1,0,Math.PI*2);
            c.fillStyle='rgba(255,255,255,.05)'; c.fill();
        },
        shahid: function(c,x,y,r) {
            var g=c.createRadialGradient(x-r*.2,y-r*.2,r*.05,x,y,r);
            g.addColorStop(0,'#FFF5CC'); g.addColorStop(.4,'#D4AF37'); g.addColorStop(1,'#8B7520');
            c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle=g; c.fill();
            c.beginPath(); c.arc(x-r*.25,y-r*.25,r*.3,0,Math.PI*2);
            c.fillStyle='rgba(255,255,255,.3)'; c.fill();
        },
        str: '#4a4a4a', tassel: '#222', imam: ['#D4AF37','#8B7520'], pv: '#1a1a1a'
    },
    {
        id: 'amber', name: '\u0643\u0647\u0631\u0645\u0627\u0646',
        bead: function(c,x,y,r,hi) {
            var g=c.createRadialGradient(x-r*.3,y-r*.35,r*.05,x,y,r);
            g.addColorStop(0,hi?'#FFE082':'#F0C050');
            g.addColorStop(.3,hi?'#E0A020':'#C88A10');
            g.addColorStop(.7,'#A06800'); g.addColorStop(1,'#704A00');
            c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle=g; c.fill();
            c.beginPath(); c.arc(x+r*.08,y+r*.05,r*.45,0,Math.PI*2);
            c.fillStyle='rgba(255,200,50,.1)'; c.fill();
            c.beginPath(); c.arc(x-r*.25,y-r*.3,r*.25,0,Math.PI*2);
            c.fillStyle=hi?'rgba(255,255,255,.38)':'rgba(255,255,255,.18)'; c.fill();
        },
        shahid: function(c,x,y,r) {
            var g=c.createRadialGradient(x,y,r*.1,x,y,r);
            g.addColorStop(0,'#C8C8C8'); g.addColorStop(.5,'#909090'); g.addColorStop(1,'#505050');
            c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle=g; c.fill();
            c.beginPath(); c.arc(x-r*.25,y-r*.25,r*.3,0,Math.PI*2);
            c.fillStyle='rgba(255,255,255,.22)'; c.fill();
        },
        str: '#8B6914', tassel: '#A06800', imam: ['#E8C547','#A06800'], pv: '#C88A10'
    },
    {
        id: 'turquoise', name: '\u0641\u064A\u0631\u0648\u0632',
        bead: function(c,x,y,r,hi) {
            var g=c.createRadialGradient(x-r*.25,y-r*.25,r*.05,x,y,r);
            g.addColorStop(0,hi?'#7EECD8':'#48C9B0');
            g.addColorStop(.4,hi?'#1ABC9C':'#17A589');
            g.addColorStop(1,'#0E6655');
            c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle=g; c.fill();
            c.save(); c.globalAlpha=.12;
            c.beginPath(); c.moveTo(x-r*.5,y-r*.2);
            c.quadraticCurveTo(x,y-r*.4,x+r*.3,y+r*.1);
            c.strokeStyle='#2C3E50'; c.lineWidth=.7; c.stroke();
            c.beginPath(); c.moveTo(x+r*.2,y-r*.5);
            c.quadraticCurveTo(x+r*.1,y,x-r*.3,y+r*.4); c.stroke();
            c.restore();
            c.beginPath(); c.arc(x-r*.25,y-r*.28,r*.22,0,Math.PI*2);
            c.fillStyle=hi?'rgba(255,255,255,.32)':'rgba(255,255,255,.14)'; c.fill();
        },
        shahid: function(c,x,y,r) {
            var g=c.createRadialGradient(x,y,r*.1,x,y,r);
            g.addColorStop(0,'#FFF5CC'); g.addColorStop(.5,'#D4AF37'); g.addColorStop(1,'#8B7520');
            c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle=g; c.fill();
            c.beginPath(); c.arc(x-r*.25,y-r*.25,r*.3,0,Math.PI*2);
            c.fillStyle='rgba(255,255,255,.28)'; c.fill();
        },
        str: '#0E6655', tassel: '#17A589', imam: ['#D4AF37','#8B7520'], pv: '#1ABC9C'
    },
    {
        id: 'tiger-eye', name: '\u0639\u064A\u0646 \u0627\u0644\u0646\u0645\u0631',
        bead: function(c,x,y,r,hi) {
            var g=c.createRadialGradient(x-r*.2,y-r*.3,r*.05,x,y,r);
            g.addColorStop(0,hi?'#E8B84C':'#C49A2C');
            g.addColorStop(.3,'#A07818'); g.addColorStop(.6,'#6B4E10'); g.addColorStop(1,'#3D2B08');
            c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle=g; c.fill();
            c.save(); c.globalAlpha=.22;
            var sg=c.createLinearGradient(x-r,y-r*.1,x+r,y+r*.1);
            sg.addColorStop(0,'transparent'); sg.addColorStop(.3,'rgba(255,220,100,.5)');
            sg.addColorStop(.5,'rgba(255,240,180,.8)'); sg.addColorStop(.7,'rgba(255,220,100,.5)');
            sg.addColorStop(1,'transparent');
            c.beginPath(); c.arc(x,y,r*.85,0,Math.PI*2); c.fillStyle=sg; c.fill();
            c.restore();
            c.beginPath(); c.arc(x-r*.25,y-r*.28,r*.22,0,Math.PI*2);
            c.fillStyle=hi?'rgba(255,255,255,.28)':'rgba(255,255,255,.1)'; c.fill();
        },
        shahid: function(c,x,y,r) {
            var g=c.createRadialGradient(x,y,r*.1,x,y,r);
            g.addColorStop(0,'#D4AF37'); g.addColorStop(1,'#6B4E10');
            c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle=g; c.fill();
        },
        str: '#5C4610', tassel: '#6B4E10', imam: ['#C49A2C','#5C4610'], pv: '#A07818'
    },
    {
        id: 'lapis', name: '\u0644\u0627\u0632\u0648\u0631\u062F',
        bead: function(c,x,y,r,hi) {
            var g=c.createRadialGradient(x-r*.2,y-r*.25,r*.05,x,y,r);
            g.addColorStop(0,hi?'#4169E1':'#2850A8');
            g.addColorStop(.5,hi?'#1A3A8A':'#122B6E');
            g.addColorStop(1,'#0A1A45');
            c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle=g; c.fill();
            c.save(); c.globalAlpha=.45;
            [[.2,-.3],[-.15,.25],[.35,.1],[-.3,-.15],[.05,.35]].forEach(function(f) {
                c.beginPath(); c.arc(x+f[0]*r,y+f[1]*r,r*.035,0,Math.PI*2);
                c.fillStyle='#D4AF37'; c.fill();
            });
            c.restore();
            c.beginPath(); c.arc(x-r*.25,y-r*.28,r*.24,0,Math.PI*2);
            c.fillStyle=hi?'rgba(255,255,255,.28)':'rgba(255,255,255,.1)'; c.fill();
        },
        shahid: function(c,x,y,r) {
            var g=c.createRadialGradient(x,y,r*.1,x,y,r);
            g.addColorStop(0,'#FFF5CC'); g.addColorStop(.5,'#D4AF37'); g.addColorStop(1,'#8B7520');
            c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle=g; c.fill();
        },
        str: '#1A2A5A', tassel: '#1A3A8A', imam: ['#D4AF37','#8B7520'], pv: '#2850A8'
    },
    {
        id: 'pearl', name: '\u0644\u0624\u0644\u0624',
        bead: function(c,x,y,r,hi) {
            var g=c.createRadialGradient(x-r*.3,y-r*.35,r*.05,x,y,r);
            g.addColorStop(0,'#FFFFFF');
            g.addColorStop(.3,hi?'#F5F0E8':'#E8E0D0');
            g.addColorStop(.7,'#D0C8B8'); g.addColorStop(1,'#A8A090');
            c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle=g; c.fill();
            c.save(); c.globalAlpha=.07;
            var ir=c.createLinearGradient(x-r,y,x+r,y);
            ir.addColorStop(0,'#FFB6C1'); ir.addColorStop(.3,'#E0FFFF');
            ir.addColorStop(.6,'#FFFACD'); ir.addColorStop(1,'#E6E6FA');
            c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle=ir; c.fill();
            c.restore();
            c.beginPath(); c.arc(x-r*.28,y-r*.3,r*.28,0,Math.PI*2);
            c.fillStyle=hi?'rgba(255,255,255,.65)':'rgba(255,255,255,.4)'; c.fill();
        },
        shahid: function(c,x,y,r) {
            var g=c.createRadialGradient(x,y,r*.1,x,y,r);
            g.addColorStop(0,'#FFF5CC'); g.addColorStop(.5,'#D4AF37'); g.addColorStop(1,'#8B7520');
            c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle=g; c.fill();
        },
        str: '#A8A090', tassel: '#D0C8B8', imam: ['#D4AF37','#8B7520'], pv: '#E8E0D0'
    },
    {
        id: 'sandalwood', name: '\u062E\u0634\u0628 \u0635\u0646\u062F\u0644',
        bead: function(c,x,y,r,hi) {
            var g=c.createRadialGradient(x-r*.2,y-r*.3,r*.05,x,y,r);
            g.addColorStop(0,hi?'#D2A66A':'#B8884A');
            g.addColorStop(.5,'#8E6830'); g.addColorStop(1,'#5C4420');
            c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle=g; c.fill();
            c.save(); c.globalAlpha=.1;
            for(var i=-2;i<=2;i++){
                c.beginPath(); c.arc(x+i*r*.15,y,r*.6+i*r*.07,0,Math.PI*2);
                c.strokeStyle='#3D2B08'; c.lineWidth=.5; c.stroke();
            }
            c.restore();
            c.beginPath(); c.arc(x-r*.22,y-r*.25,r*.22,0,Math.PI*2);
            c.fillStyle=hi?'rgba(255,255,255,.18)':'rgba(255,255,255,.07)'; c.fill();
        },
        shahid: function(c,x,y,r) {
            var g=c.createRadialGradient(x,y,r*.1,x,y,r);
            g.addColorStop(0,'#5C4420'); g.addColorStop(1,'#3D2B08');
            c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle=g; c.fill();
            c.beginPath(); c.arc(x,y,r*.85,0,Math.PI*2);
            c.strokeStyle='rgba(192,192,192,.35)'; c.lineWidth=1.2; c.stroke();
        },
        str: '#5C4420', tassel: '#8E6830', imam: ['#B8884A','#5C4420'], pv: '#8E6830'
    }
];

var DHIKRS = {
    subhanallah: { ar:'\u0633\u064F\u0628\u0652\u062D\u064E\u0627\u0646\u064E \u0671\u0644\u0644\u0651\u064E\u0647\u0650', en:'SubhanAllah', n:33 },
    alhamdulillah: { ar:'\u0671\u0644\u0652\u062D\u064E\u0645\u0652\u062F\u064F \u0644\u0650\u0644\u0651\u064E\u0647\u0650', en:'Alhamdulillah', n:33 },
    allahuakbar: { ar:'\u0671\u0644\u0644\u0651\u064E\u0647\u064F \u0623\u064E\u0643\u0652\u0628\u064E\u0631\u064F', en:'Allahu Akbar', n:33 },
    lailaha: { ar:'\u0644\u064E\u0627 \u0625\u0650\u0644\u0670\u0647\u064E \u0625\u0650\u0644\u0651\u064E\u0627 \u0671\u0644\u0644\u0651\u064E\u0647\u064F', en:'La ilaha illAllah', n:99 },
    salawat: { ar:'\u0627\u0644\u0644\u0651\u0647\u064F\u0645\u0651\u064E \u0635\u064E\u0644\u0651\u0650 \u0639\u064E\u0644\u0649\u0670 \u0645\u064F\u062D\u064E\u0645\u0651\u064E\u062F \uFDFA', en:'Allahumma Salli ala Muhammad \uFDFA', n:99 },
    istighfar: { ar:'\u0623\u064E\u0633\u0652\u062A\u064E\u063A\u0652\u0641\u0650\u0631\u064F \u0671\u0644\u0644\u0651\u064E\u0647\u064E', en:'Astaghfirullah', n:33 },
    tasbeeh100: { ar:'\u062A\u0633\u0628\u064A\u062D \u0661\u0660\u0660', en:'Tasbeeh 100', n:100 }
};

// =============================================
// STATE
// =============================================
var S = {
    count: 0, target: 33, total: 33,
    sound: true, gem: 0, dhikr: 'subhanallah',
    rounds: 1, totalCount: 0,
    beadOffsets: [],
    dragOffset: 0
};

// =============================================
// PERSISTENT STATS
// =============================================
var MISBAHA_KEY = 'hamsatMisbaha';

function loadMisbahaStats() {
    try {
        var raw = localStorage.getItem(MISBAHA_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch(e) { return {}; }
}

function saveMisbahaStats() {
    try {
        var stats = loadMisbahaStats();
        var today = new Date().toISOString().split('T')[0];
        var dk = S.dhikr;
        if (!stats[dk]) stats[dk] = { total: 0, rounds: 0, dates: {} };
        if (!stats[dk].dates) stats[dk].dates = {};
        if (!stats[dk].dates[today]) stats[dk].dates[today] = 0;
        stats[dk].total = (stats[dk].total || 0);
        stats[dk].rounds = (stats[dk].rounds || 0);
        // save session state too
        stats[dk].sessionCount = S.count;
        stats[dk].sessionRounds = S.rounds;
        stats[dk].sessionTotal = S.totalCount;
        localStorage.setItem(MISBAHA_KEY, JSON.stringify(stats));
    } catch(e) {}
}

function recordCount() {
    try {
        var stats = loadMisbahaStats();
        var today = new Date().toISOString().split('T')[0];
        var dk = S.dhikr;
        if (!stats[dk]) stats[dk] = { total: 0, rounds: 0, dates: {} };
        if (!stats[dk].dates) stats[dk].dates = {};
        if (!stats[dk].dates[today]) stats[dk].dates[today] = 0;
        stats[dk].total++;
        stats[dk].dates[today]++;
        stats[dk].sessionCount = S.count;
        stats[dk].sessionRounds = S.rounds;
        stats[dk].sessionTotal = S.totalCount;
        localStorage.setItem(MISBAHA_KEY, JSON.stringify(stats));
    } catch(e) {}
}

function recordRound() {
    try {
        var stats = loadMisbahaStats();
        var dk = S.dhikr;
        if (!stats[dk]) stats[dk] = { total: 0, rounds: 0, dates: {} };
        stats[dk].rounds = (stats[dk].rounds || 0) + 1;
        localStorage.setItem(MISBAHA_KEY, JSON.stringify(stats));
    } catch(e) {}
}

function loadSessionState(dhikrKey) {
    try {
        var stats = loadMisbahaStats();
        if (stats[dhikrKey] && stats[dhikrKey].sessionCount > 0) {
            S.count = stats[dhikrKey].sessionCount || 0;
            S.rounds = stats[dhikrKey].sessionRounds || 1;
            S.totalCount = stats[dhikrKey].sessionTotal || 0;
            return true;
        }
    } catch(e) {}
    return false;
}

function getMisbahaDailyTotal() {
    var total = 0;
    var today = new Date().toISOString().split('T')[0];
    // From realistic misbaha
    var stats = loadMisbahaStats();
    Object.keys(stats).forEach(function(k) {
        if (stats[k].dates && stats[k].dates[today]) {
            total += stats[k].dates[today];
        }
    });
    // From worship.js digital tasbeeh
    try {
        var tState = JSON.parse(localStorage.getItem('hamsatTasbeeh') || '{}');
        Object.keys(tState).forEach(function(k) {
            if (tState[k].dates && tState[k].dates[today]) {
                // avoid double-counting keys already in misbaha
                if (!stats[k]) total += tState[k].dates[today];
            }
        });
    } catch(e) {}
    return total;
}

function getMisbahaAllTimeTotal() {
    var total = 0;
    var stats = loadMisbahaStats();
    Object.keys(stats).forEach(function(k) {
        total += (stats[k].total || 0);
    });
    try {
        var tState = JSON.parse(localStorage.getItem('hamsatTasbeeh') || '{}');
        Object.keys(tState).forEach(function(k) {
            if (!stats[k]) total += (tState[k].total || 0);
        });
    } catch(e) {}
    return total;
}

function getMisbahaAllTimeRounds() {
    var total = 0;
    var stats = loadMisbahaStats();
    Object.keys(stats).forEach(function(k) {
        total += (stats[k].rounds || 0);
    });
    return total;
}

function getMisbahaWeekTotal() {
    var total = 0;
    var stats = loadMisbahaStats();
    var now = new Date();
    for (var i = 0; i < 7; i++) {
        var d = new Date(now);
        d.setDate(d.getDate() - i);
        var key = d.toISOString().split('T')[0];
        Object.keys(stats).forEach(function(k) {
            if (stats[k].dates && stats[k].dates[key]) {
                total += stats[k].dates[key];
            }
        });
    }
    // Also from worship.js
    try {
        var tState = JSON.parse(localStorage.getItem('hamsatTasbeeh') || '{}');
        for (var i = 0; i < 7; i++) {
            var d = new Date(now);
            d.setDate(d.getDate() - i);
            var key = d.toISOString().split('T')[0];
            Object.keys(tState).forEach(function(k) {
                if (!stats[k] && tState[k].dates && tState[k].dates[key]) {
                    total += tState[k].dates[key];
                }
            });
        }
    } catch(e) {}
    return total;
}

// expose for stats page
window.getMisbahaDailyTotal = getMisbahaDailyTotal;
window.getMisbahaAllTimeTotal = getMisbahaAllTimeTotal;
window.getMisbahaAllTimeRounds = getMisbahaAllTimeRounds;
window.getMisbahaWeekTotal = getMisbahaWeekTotal;

var cvs, ctx, cNum, cTgt, dpr, W, H;
var ac = null;
var animId = null;
var initialized = false;
var eventsBound = false;

// Stored event handlers for cleanup
var handlers = {};

// =============================================
// INIT — called when page is shown
// =============================================
function initMisbaha() {
    cvs = document.getElementById('mCanvas');
    if (!cvs) return;
    ctx = cvs.getContext('2d');
    cNum = document.getElementById('cNum');
    cTgt = document.getElementById('cTgt');
    dpr = window.devicePixelRatio || 1;

    // restore saved session
    loadSessionState(S.dhikr);
    if (cNum) cNum.textContent = S.count;
    if (cTgt) cTgt.textContent = S.target;
    var cRound = document.getElementById('cRound');
    if (cRound) cRound.textContent = S.rounds;
    updateTotal();

    setupCanvas();
    initBeads();
    buildDhikrChips();
    buildGemPicker();

    if (!eventsBound) {
        bindEvents();
        eventsBound = true;
    }

    // Start animation
    if (animId) cancelAnimationFrame(animId);
    animate();
    initialized = true;
    console.log('\uD83D\uDCFF Realistic Misbaha V2 ready');
}

function setupCanvas() {
    var wrap = cvs.parentElement;
    W = wrap.clientWidth;
    H = wrap.clientHeight;
    cvs.width = W * dpr;
    cvs.height = H * dpr;
    cvs.style.width = W + 'px';
    cvs.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// =============================================
// PATH — elongated oval
// =============================================
function getPathPoint(t) {
    var cx = W / 2;
    var sc = Math.min(W / 380, H / 420);
    var topY = Math.max(30, 45 * sc);
    var botY = H - Math.max(35, 55 * sc);
    var sideW = W * 0.32;
    var x, y;

    if (t < 0.4) {
        var p = t / 0.4;
        x = cx - sideW + Math.sin(p * Math.PI) * 8;
        y = topY + p * (botY - topY);
    } else if (t < 0.6) {
        var p = (t - 0.4) / 0.2;
        var angle = Math.PI + p * Math.PI;
        x = cx + Math.cos(angle) * sideW;
        y = botY + Math.sin(angle) * Math.max(15, 30 * sc);
    } else {
        var p = (t - 0.6) / 0.4;
        x = cx + sideW - Math.sin(p * Math.PI) * 8;
        y = botY - p * (botY - topY);
    }
    return { x: x, y: y };
}

function initBeads() {
    S.beadOffsets = [];
    var gap = 1.0 / (S.total + 2);
    for (var i = 0; i < S.total; i++) {
        S.beadOffsets.push({
            baseT: (i + 1) * gap,
            offset: 0,
            vel: 0
        });
    }
    S.dragOffset = 0;
}

// =============================================
// AUDIO
// =============================================
function initAudio() { if(!ac) ac = new (window.AudioContext||window.webkitAudioContext)(); }

function beadClickSound(intensity) {
    if (!S.sound || !ac) return;
    var t = ac.currentTime;
    var vol = 0.15 + (intensity || 0) * 0.15;

    var o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(1600 + Math.random()*400, t);
    o.frequency.exponentialRampToValueAtTime(400, t+0.03);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t+0.06);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t+0.06);

    var buf = ac.createBuffer(1, ac.sampleRate*0.02, ac.sampleRate);
    var d = buf.getChannelData(0);
    for(var i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/(d.length*.1));
    var ns=ac.createBufferSource(), ng=ac.createGain();
    ns.buffer=buf;
    ng.gain.setValueAtTime(vol*0.5,t); ng.gain.exponentialRampToValueAtTime(0.001,t+0.03);
    ns.connect(ng); ng.connect(ac.destination);
    ns.start(t);
}

function doneSound() {
    if(!S.sound||!ac) return;
    var t=ac.currentTime;
    [523,659,784].forEach(function(f,i){
        var o=ac.createOscillator(),g=ac.createGain();
        o.type='sine'; o.frequency.value=f;
        g.gain.setValueAtTime(0,t+i*.12);
        g.gain.linearRampToValueAtTime(.18,t+i*.12+.04);
        g.gain.exponentialRampToValueAtTime(.001,t+i*.12+.4);
        o.connect(g); g.connect(ac.destination);
        o.start(t+i*.12); o.stop(t+i*.12+.4);
    });
}

// =============================================
// DRAW
// =============================================
function draw() {
    ctx.clearRect(0, 0, W, H);
    var G = GEMS[S.gem];
    var cx = W/2;
    var sc = Math.min(W / 380, H / 420);
    var topY = Math.max(30, 45 * sc);
    var beadR = (S.total <= 33 ? 9 : S.total <= 99 ? 6.5 : 5.5) * Math.max(0.6, sc);
    var shahidR = beadR * 1.4;

    // String path
    ctx.beginPath();
    ctx.strokeStyle = G.str;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    for (var t = 0; t <= 1; t += 0.005) {
        var p = getPathPoint(t);
        if (t === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // String top connections
    var pStart = getPathPoint(0);
    var pEnd = getPathPoint(1);
    ctx.beginPath();
    ctx.moveTo(pStart.x, pStart.y);
    ctx.lineTo(cx, topY);
    ctx.lineTo(pEnd.x, pEnd.y);
    ctx.strokeStyle = G.str;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Beads
    for (var i = 0; i < S.total; i++) {
        var b = S.beadOffsets[i];
        var t = b.baseT + S.dragOffset + b.offset;
        t = t % 1;
        if (t < 0) t += 1;

        var pos = getPathPoint(t);
        var counted = i < S.count;
        var active = i === S.count;

        // Shadow
        ctx.beginPath();
        ctx.arc(pos.x + 1, pos.y + 2, beadR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,.2)';
        ctx.fill();

        var isShahid = (S.total >= 99 && ((i+1) % 33 === 0));
        if (isShahid) {
            G.shahid(ctx, pos.x, pos.y, shahidR);
        } else {
            G.bead(ctx, pos.x, pos.y, beadR, counted || active);
        }

        // Active glow
        if (active && !isShahid) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, beadR + 4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212,175,55,.1)';
            ctx.fill();
        }

        // Hole
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, beadR * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,.25)';
        ctx.fill();
    }

    // Imamah (shahid at top)
    var imR = Math.max(6, 10 * sc);
    var ig = ctx.createRadialGradient(cx-3*sc, topY-3*sc, 1, cx, topY, imR);
    ig.addColorStop(0, G.imam[0]);
    ig.addColorStop(1, G.imam[1]);
    ctx.beginPath();
    ctx.arc(cx, topY, imR, 0, Math.PI * 2);
    ctx.fillStyle = ig;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - 3*sc, topY - 3*sc, 3.5*sc, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,.28)';
    ctx.fill();

    ctx.font = '600 ' + Math.max(7, Math.round(9 * sc)) + 'px Tajawal';
    ctx.fillStyle = 'rgba(255,255,255,.2)';
    ctx.textAlign = 'center';
    ctx.fillText('\u0627\u0644\u0634\u0627\u0647\u062F', cx, topY - 16 * sc);

    // Tassel
    var tasselTop = topY - 12 * sc;
    ctx.strokeStyle = G.str;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, topY);
    ctx.lineTo(cx, tasselTop - 10 * sc);
    ctx.stroke();

    var capG = ctx.createRadialGradient(cx, tasselTop - 14*sc, 1, cx, tasselTop - 14*sc, 5*sc);
    capG.addColorStop(0, G.imam[0]);
    capG.addColorStop(1, G.imam[1]);
    ctx.beginPath();
    ctx.arc(cx, tasselTop - 14*sc, 4*sc, 0, Math.PI * 2);
    ctx.fillStyle = capG;
    ctx.fill();

    ctx.strokeStyle = G.tassel;
    ctx.lineWidth = 1;
    for (var t = -4; t <= 4; t++) {
        ctx.beginPath();
        ctx.moveTo(cx, tasselTop - 18*sc);
        var sw = Math.sin(Date.now() / 1000 + t) * 1.5;
        ctx.quadraticCurveTo(
            cx + t * 2*sc + sw,
            tasselTop - 28*sc,
            cx + t * 2.5*sc + sw,
            tasselTop - 38*sc
        );
        ctx.stroke();
    }

    // Progress bar
    if (S.count > 0) {
        var prog = S.count / S.target;
        var barW = W * 0.5;
        var barY = H - 18;
        ctx.beginPath();
        ctx.moveTo(cx - barW/2, barY);
        ctx.lineTo(cx - barW/2 + barW * prog, barY);
        var pg = ctx.createLinearGradient(cx-barW/2, barY, cx+barW/2, barY);
        pg.addColorStop(0, 'rgba(212,175,55,.1)');
        pg.addColorStop(.5, 'rgba(212,175,55,.35)');
        pg.addColorStop(1, 'rgba(212,175,55,.1)');
        ctx.strokeStyle = pg;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}

// =============================================
// EVENTS
// =============================================
function doTapCount() {
    initAudio();
    if (S.count >= S.target) return;
    S.count++;
    S.totalCount++;
    cNum.textContent = S.count;
    updateTotal();
    recordCount();
    beadClickSound(0.7);
    if (navigator.vibrate) navigator.vibrate(10);
    cNum.classList.add('bump');
    setTimeout(function() { cNum.classList.remove('bump'); }, 100);
    spark();
    if (S.count >= S.target) setTimeout(showDone, 400);
}

function updateTotal() {
    var el = document.getElementById('cTotal');
    if (el) {
        if (S.rounds > 1 || S.totalCount > S.target) {
            el.textContent = '\u0627\u0644\u0645\u062C\u0645\u0648\u0639: ' + S.totalCount;
        } else {
            el.textContent = '';
        }
    }
}

function isControlElement(el) {
    return el && el.closest('.cb, .d-chip, .pk-item, .pk-col, .ctrl-row, .dhikr-row, .picker-row, .misbaha-back, button');
}

function isMisbahaVisible() {
    var page = document.getElementById('page-misbaha');
    return page && page.style.display !== 'none';
}

function bindEvents() {
    var tapStartX = 0;
    var tapStartY = 0;
    var tapMoved = false;
    var touchHandled = false;

    // Touch: detect tap vs scroll
    handlers.touchstart = function(e) {
        var t = e.touches[0];
        tapStartX = t.clientX;
        tapStartY = t.clientY;
        tapMoved = false;
        touchHandled = true;
    };
    handlers.touchmove = function(e) {
        var t = e.touches[0];
        if (Math.abs(t.clientX - tapStartX) > 15 || Math.abs(t.clientY - tapStartY) > 15) {
            tapMoved = true;
        }
    };
    handlers.touchend = function(e) {
        if (!isMisbahaVisible()) return;
        if (!tapMoved) {
            var el = document.elementFromPoint(tapStartX, tapStartY);
            if (!isControlElement(el)) {
                e.preventDefault();
                doTapCount();
            }
        }
        setTimeout(function() { touchHandled = false; }, 300);
    };

    document.addEventListener('touchstart', handlers.touchstart, { passive: true });
    document.addEventListener('touchmove', handlers.touchmove, { passive: true });
    document.addEventListener('touchend', handlers.touchend);

    // Desktop click
    handlers.click = function(e) {
        if (touchHandled) return;
        if (!isMisbahaVisible()) return;
        if (isControlElement(e.target)) return;
        doTapCount();
    };
    document.addEventListener('click', handlers.click);

    // Resize
    handlers.resize = function() { if (cvs && cvs.parentElement) setupCanvas(); };
    window.addEventListener('resize', handlers.resize);

    // Controls
    var bReset = document.getElementById('bReset');
    var bSound = document.getElementById('bSound');
    var bMinus = document.getElementById('bMinus');

    if (bReset) bReset.onclick = function() { initAudio(); doReset(true); };
    if (bSound) bSound.onclick = function() {
        initAudio(); S.sound = !S.sound;
        this.textContent = S.sound ? '\uD83D\uDD0A' : '\uD83D\uDD07';
        this.classList.toggle('on', S.sound);
    };
    if (bMinus) bMinus.onclick = function() {
        if (S.count > 0) {
            S.count--;
            S.totalCount = Math.max(0, S.totalCount - 1);
            cNum.textContent = S.count;
            updateTotal();
        }
    };
}

// Spark particles
function spark() {
    var page = document.getElementById('page-misbaha');
    if (!page) return;
    var p = document.createElement('div');
    p.className = 'misbaha-spark';
    p.style.background = GEMS[S.gem].pv;
    var rect = cvs.getBoundingClientRect();
    p.style.left = (rect.left + W/2 + (Math.random()-.5)*20) + 'px';
    p.style.top = (rect.top + 40) + 'px';
    document.body.appendChild(p);
    var ox=0,oy=0,op=1;
    var vx=(Math.random()-.5)*50, vy=-25-Math.random()*25;
    (function a(){
        ox+=vx*.03; oy+=vy*.03; op-=.035;
        if(op<=0){p.remove();return;}
        p.style.transform='translate('+ox+'px,'+oy+'px)';
        p.style.opacity=op;
        requestAnimationFrame(a);
    })();
}

// Animation loop - visual only, NO counting here
function animate() {
    var page = document.getElementById('page-misbaha');
    if (!page || page.style.display === 'none') {
        animId = null;
        return;
    }
    // Smoothly animate dragOffset toward target (count-based position)
    var gap = 1.0 / (S.total + 2);
    var targetOffset = S.count * gap;
    var diff = targetOffset - S.dragOffset;
    if (Math.abs(diff) > 0.0001) {
        S.dragOffset += diff * 0.15;
    } else {
        S.dragOffset = targetOffset;
    }
    draw();
    animId = requestAnimationFrame(animate);
}

// =============================================
// COMPLETION
// =============================================
function showDone() {
    doneSound();
    if(navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    cNum.classList.add('done-flash');
    var cof = document.querySelector('#page-misbaha .c-of');
    if (cof) cof.classList.add('done-text');
    setTimeout(function() {
        cNum.classList.remove('done-flash');
        if (cof) cof.classList.remove('done-text');
        S.rounds++;
        recordRound();
        var cRound = document.getElementById('cRound');
        if (cRound) cRound.textContent = S.rounds;
        doReset();
        saveMisbahaStats();
    }, 1200);
}

function doReset(fullReset) {
    S.count = 0; S.dragOffset = 0;
    if (cNum) cNum.textContent = '0';
    if (fullReset) {
        S.rounds = 1;
        S.totalCount = 0;
        var cRound = document.getElementById('cRound');
        if (cRound) cRound.textContent = '1';
        var cTotal = document.getElementById('cTotal');
        if (cTotal) cTotal.textContent = '';
    }
}

// =============================================
// BUILD UI
// =============================================
function buildDhikrChips() {
    var dRow = document.getElementById('dRow');
    if (!dRow || dRow.children.length > 0) return;
    Object.keys(DHIKRS).forEach(function(k) {
        var ch = document.createElement('div');
        ch.className = 'd-chip' + (k==='subhanallah'?' active':'');
        ch.textContent = DHIKRS[k].ar.replace(/\uFDFA/g,'').trim();
        ch.onclick = function() {
            dRow.querySelectorAll('.d-chip').forEach(function(c){c.classList.remove('active');});
            this.classList.add('active');
            S.dhikr = k; S.target = DHIKRS[k].n;
            S.total = DHIKRS[k].n;
            if (cTgt) cTgt.textContent = S.target;
            var dName = document.getElementById('dName');
            var dSub = document.getElementById('dSub');
            if (dName) dName.textContent = DHIKRS[k].ar;
            if (dSub) dSub.textContent = DHIKRS[k].en;
            // load saved session or reset
            if (!loadSessionState(k)) {
                doReset(true);
            } else {
                // restore UI from loaded state
                if (cNum) cNum.textContent = S.count;
                if (cTgt) cTgt.textContent = S.target;
                var cRound = document.getElementById('cRound');
                if (cRound) cRound.textContent = S.rounds;
                S.dragOffset = 0;
                updateTotal();
            }
            initBeads();
        };
        dRow.appendChild(ch);
    });
}

function buildGemPicker() {
    var pkRow = document.getElementById('pkRow');
    if (!pkRow || pkRow.children.length > 0) return;
    GEMS.forEach(function(g, idx) {
        var col = document.createElement('div'); col.className = 'pk-col';
        var item = document.createElement('div');
        item.className = 'pk-item' + (idx===0?' active':'');
        var pc = document.createElement('canvas');
        pc.width = 92; pc.height = 92;
        var px = pc.getContext('2d');
        px.fillStyle = '#0D1B2A'; px.fillRect(0,0,92,92);
        for(var i=0; i<6; i++){
            var a = (i/6)*Math.PI*2-Math.PI/2;
            var bx=46+Math.cos(a)*24, by=46+Math.sin(a)*24;
            if(i===3) g.shahid(px,bx,by,7);
            else g.bead(px,bx,by,8,i<3);
        }
        item.appendChild(pc);
        item.onclick = function() {
            pkRow.querySelectorAll('.pk-item').forEach(function(p){p.classList.remove('active');});
            this.classList.add('active');
            S.gem = idx;
        };
        var lbl = document.createElement('div'); lbl.className='pk-lbl'; lbl.textContent=g.name;
        col.appendChild(item); col.appendChild(lbl);
        pkRow.appendChild(col);
    });
}

// =============================================
// GLOBAL API — for app integration
// =============================================
window.MisbahaV2 = {
    init: function() {
        setTimeout(function() {
            initMisbaha();
        }, 100);
    },
    stop: function() {
        if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
        }
    }
};

})();
