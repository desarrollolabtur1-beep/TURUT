/* ============================================================
   WOHIN — Scripts v3.0 "Andina Premium"
   Lucide SVGs · Staggered Animations · Category Colors · Progress Dots
   ============================================================ */

// ===== LUCIDE SVG HELPERS =====
const LUCIDE = {
  'music-note': `<svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  'flame': `<svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/></svg>`,
  'utensils': `<svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
  'coffee': `<svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/></svg>`,
  'store': `<svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/></svg>`,
  'chevron-right': `<svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
  'timer': `<svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>`,
  'map-pin': `<svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  'search-off': `<svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="m9 9 4 4"/></svg>`,
  // Hero time-based icons
  'sun': `<svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  'sunset': `<svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m16 6-4 4-4-4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>`,
  'moon': `<svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
};

// Event icon mapping (Material name → Lucide key)
const EVENT_ICON_MAP = {
  'music_note': 'music-note',
  'local_fire_department': 'flame',
  'restaurant': 'utensils',
  'coffee': 'coffee',
  'storefront': 'store'
};

// Category color CSS class mapping
const CATEGORY_CLASS = {
  'Aventura': 'category-chip--aventura',
  'Cultura': 'category-chip--cultura',
  'Relax': 'category-chip--relax',
  'Gastronomía': 'category-chip--gastronomía',
  'Coffee': 'category-chip--coffee'
};

// ===== DATA =====
const destinations = [
  {
    id: 1,
    name: "Eco-Refugio",
    category: "Aventura",
    distance: "15km",
    discount: 20,
    desc: "Un escape total. Senderos de selva, puentes colgantes y naturaleza pura. Desconéctate en este refugio ecológico.",
    img: "assets/ecorefugio_1774332450674.png",
    wa: "https://wa.me/573001234567?text=Hola%20quiero%20info%20de%20Eco-Refugio"
  },
  {
    id: 2,
    name: "La Mesa del Café",
    category: "Coffee",
    distance: "8km",
    discount: 15,
    desc: "Experiencia premium de degustación de café de origen. Aprende los secretos de tostión y disfruta una vista increíble.",
    img: "assets/lamesa_1774332464801.png",
    wa: "https://wa.me/573001234567?text=Hola%20quiero%20info%20de%20La%20Mesa%20del%20Café"
  },
  {
    id: 3,
    name: "Los Tunjos",
    category: "Cultura",
    distance: "5km",
    discount: 25,
    desc: "Templo del arte y herencia indígena. Exposiciones en vivo, música tradicional y una atmósfera mágica e histórica.",
    img: "assets/lostunjos_1774332477574.png",
    wa: "https://wa.me/573001234567?text=Hola%20quiero%20info%20de%20Los%20Tunjos"
  },
  {
    id: 4,
    name: "Ruta del Guardián",
    category: "Aventura",
    distance: "12km",
    discount: 10,
    desc: "Senderismo extremo con vistas impresionantes. Reta tus límites subiendo hasta el pico de la montaña guardiana.",
    img: "assets/rutaguardian_1774332493934.png",
    wa: "https://wa.me/573001234567?text=Hola%20quiero%20info%20de%20Ruta%20del%20Guardián"
  },
  {
    id: 5,
    name: "Terraza del Totumo",
    category: "Gastronomía",
    distance: "4km",
    discount: 20,
    desc: "La mejor gastronomía local en un rooftop con vista panorámica a la ciudad. Atardeceres inolvidables y coctelería.",
    img: "assets/terrazatotumo_1774332508536.png",
    wa: "https://wa.me/573001234567?text=Hola%20quiero%20info%20de%20Terraza%20del%20Totumo"
  }
];

const events = [
  { dest: 4, time: "Ahora mismo", name: "Cena a 4 Manos + Coctelería", icon: "restaurant" },
  { dest: 2, time: "Hoy 7:00 PM", name: "Exposición Indígena & Mapping", icon: "storefront" },
  { dest: 1, time: "En curso", name: "Taller de Tostión Especial", icon: "coffee" },
  { dest: 0, time: "Sáb 8:00 AM", name: "Expedición Amanecer en la Selva", icon: "flame" },
  { dest: 3, time: "Mañana 6 AM", name: "Ruta de los Valientes", icon: "music_note" }
];

// ===== DOM =====
const activityList = document.getElementById('activity-list');
const eventList    = document.getElementById('event-list');
const swipeBox     = document.getElementById('swipe-container');
const views        = document.querySelectorAll('.view');
const navBtns      = document.querySelectorAll('.nav-btn');
const overlay      = document.getElementById('landing-overlay');
const btnReject    = document.getElementById('btn-reject');
const btnMatch     = document.getElementById('btn-match');
const progressContainer = document.getElementById('swipe-progress');

// ===== STATE MANAGEMENT =====
let turut_favorites = JSON.parse(localStorage.getItem('turut_favorites')) || [];
let turut_matches = JSON.parse(localStorage.getItem('turut_matches')) || [];
let currentSwipe = parseInt(localStorage.getItem('turut_swipePosition')) || 0;

function saveState() {
  localStorage.setItem('turut_favorites', JSON.stringify(turut_favorites));
  localStorage.setItem('turut_matches', JSON.stringify(turut_matches));
  localStorage.setItem('turut_swipePosition', currentSwipe.toString());
}

let timerInterval = null;
let activeFilter = 'all';

// ===== NAVIGATION (Lucide-compatible) =====
function switchView (viewId) {
  views.forEach(v => v.classList.remove('active'));
  navBtns.forEach(b => b.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  const activeBtn = document.querySelector(`.nav-btn[data-view="${viewId}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

// ===== SKELETON SCREENS =====
function renderSkeletonCards (container, count, type) {
  let html = '';
  for (let i = 0; i < count; i++) {
    if (type === 'dest') {
      html += `
        <div class="skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-lines">
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
          </div>
        </div>`;
    } else {
      html += `
        <div class="skeleton-event">
          <div class="skeleton-icon"></div>
          <div class="skeleton-lines">
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
          </div>
        </div>`;
    }
  }
  container.innerHTML = html;
}

// ===== CONTEXTUAL HEADER (Módulo 0) =====
function renderContextualHeader () {
  const d = new Date();
  const weekday = d.toLocaleDateString('es-CO', { weekday: 'short' }).replace(/\./g, '').toUpperCase();
  const day = d.getDate();
  const month = d.toLocaleDateString('es-CO', { month: 'short' }).replace(/\./g, '').toUpperCase();
  const dateStr = `${weekday} ${day} DE ${month}`;
  document.getElementById('header-date').textContent = dateStr;
}

// ===== RENDER: TOP 5 LIST (with staggered animation) =====
let currentSegment = 'top5'; // 'top5' or 'miruta'

function renderTop5 (filter, isMiRuta = false) {
  let sourceData = destinations;
  if (isMiRuta) {
    const combinedIds = [...new Set([...turut_favorites, ...turut_matches])];
    sourceData = destinations.filter((d, i) => combinedIds.includes(i));
  }
  const filtered = filter && filter !== 'all'
    ? sourceData.filter(d => d.category === filter)
    : sourceData;

  if (filtered.length === 0) {
    activityList.innerHTML = `
      <div style="text-align:center;padding:2rem;color:var(--text-secondary)">
        <div style="opacity:0.3;margin-bottom:0.5rem">${LUCIDE['search-off'] || '⊗'}</div>
        No hay experiencias guardadas.
      </div>`;
    return;
  }
  
  activityList.innerHTML = filtered.map((d, i) => {
    const idx = destinations.indexOf(d);
    const isFav = turut_favorites.includes(idx);
    const favStyle = isFav ? 'color: var(--secondary); text-shadow: 0 0 10px var(--secondary-glow); opacity: 1;' : 'color: white; opacity: 0.5;';
    return `
    <div class="imperdible-card" data-idx="${idx}" style="animation-delay:${i * 80}ms">
      <div class="imperdible-bg-img">
        <img src="${d.img}" alt="${d.name}" loading="lazy" />
        <div class="imperdible-gradient"></div>
      </div>
      <div class="imperdible-bookmark" data-fav="${idx}" style="${favStyle}">
        ⭐
      </div>
      <div class="imperdible-content">
        <div class="imperdible-info">
          <h3>${d.name} <span class="imperdible-rating">★ 4.8</span></h3>
          <p class="imperdible-meta">${d.category} · ${d.distance}</p>
        </div>
        <div class="imperdible-pin">
          ${LUCIDE['map-pin'] || '📍'}
        </div>
      </div>
    </div>`;
  }).join('');

  activityList.querySelectorAll('.imperdible-card').forEach(c => {
    c.addEventListener('click', () => openLanding(+c.dataset.idx));
  });

  activityList.querySelectorAll('.imperdible-bookmark').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = +btn.dataset.fav;
      if (turut_favorites.includes(idx)) {
        turut_favorites = turut_favorites.filter(id => id !== idx);
      } else {
        turut_favorites.push(idx);
      }
      saveState();
      renderTop5(activeFilter, currentSegment === 'miruta');
    });
  });
}

// ===== SEGMENT CONTROL (Top 5 / Mi Ruta) =====
const segmentBtns = document.querySelectorAll('.segment-btn');
const segmentControlContainer = document.querySelector('.segment-control');

segmentBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    segmentBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSegment = btn.dataset.tab;
    // Update bg position
    if (segmentControlContainer) {
      segmentControlContainer.dataset.active = currentSegment;
    }
    // Re-render based on segment and filters
    if (currentSegment === 'miruta') {
      renderTop5(activeFilter, true); 
    } else {
      renderTop5(activeFilter, false);
    }
  });
});


// ===== STYLE FILTER CHIPS =====
const chipContainer = document.getElementById('style-chips');
if (chipContainer) {
  chipContainer.addEventListener('click', (e) => {
    const chip = e.target.closest('.style-chip');
    if (!chip) return;
    chipContainer.querySelectorAll('.style-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    renderTop5(activeFilter);
  });
}

// ===== RENDER: EVENTS with LIVE BADGES + Lucide Icons =====
function getEventStatus (timeStr) {
  const lower = timeStr.toLowerCase();
  if (lower.includes('ahora') || lower.includes('en curso')) return 'now';
  if (lower.includes('hoy')) return 'soon';
  return 'later';
}

function renderEvents () {
  eventList.innerHTML = events.map((ev, i) => {
    const d = destinations[ev.dest];
    const status = getEventStatus(ev.time);
    let badgeHtml = '';
    if (status === 'now') {
      badgeHtml = `<span class="live-badge live-badge--now">Ahora</span>`;
    } else if (status === 'soon') {
      badgeHtml = `<span class="live-badge live-badge--soon">Hoy</span>`;
    }

    const lucideKey = EVENT_ICON_MAP[ev.icon] || 'flame';
    const iconSvg = LUCIDE[lucideKey] || LUCIDE['flame'];

    return `
    <div class="event-card glass-card" data-dest="${ev.dest}" style="animation-delay:${i * 80}ms">
      <div class="event-icon">${iconSvg}</div>
      <div class="event-info">
        <p class="event-meta">${d.name} · ${ev.time}</p>
        <p class="event-name">${ev.name}</p>
      </div>
      ${badgeHtml}
      <button class="event-btn">Ver</button>
    </div>`;
  }).join('');
  eventList.querySelectorAll('.event-card').forEach(c => {
    c.addEventListener('click', () => openLanding(+c.dataset.dest));
  });
}

// ===== RENDER: SWIPE CARD (with category chip + progress dots) =====
function renderSwipeProgress () {
  const filtered = activeFilter && activeFilter !== 'all'
    ? destinations.filter(d => d.category === activeFilter)
    : destinations;

  progressContainer.innerHTML = filtered.map((_, i) =>
    `<span class="swipe-dot${i === currentSwipe ? ' active' : ''}"></span>`
  ).join('');
}

function renderSwipeCard () {
  const filtered = activeFilter && activeFilter !== 'all'
    ? destinations.filter(d => d.category === activeFilter)
    : destinations;

  if (filtered.length === 0) { currentSwipe = 0; return; }
  if (currentSwipe >= filtered.length) currentSwipe = 0;

  const d = filtered[currentSwipe];
  const realIdx = destinations.indexOf(d);
  const catClass = CATEGORY_CLASS[d.category] || '';

  swipeBox.innerHTML = `
    <div class="swipe-card" id="active-card" data-realidx="${realIdx}">
      <img src="${d.img}" alt="${d.name}" />
      <div class="timer-chip glass-card">
        ${LUCIDE['timer']}
        <span id="swipe-timer">04:59</span>
      </div>
      <div class="swipe-card-overlay">
        <span class="category-chip ${catClass}">${d.category}</span>
        <h3 class="card-title font-headline">${d.name}</h3>
        <p class="card-location">
          ${LUCIDE['map-pin']}
          ${d.distance} · Ibagué
        </p>
      </div>
    </div>
  `;
  renderSwipeProgress();
  enableSwipeGesture();
}

// ===== SWIPE MECHANICS =====
function animateOut (dir) {
  const c = document.getElementById('active-card');
  if (!c) return;
  c.style.transition = 'transform 0.5s cubic-bezier(0.175,0.885,0.32,1.275)';
  c.style.transform = `translateX(${dir === 'left' ? '-120%' : '120%'}) rotate(${dir === 'left' ? '-15' : '15'}deg)`;
  setTimeout(() => {
    if (dir === 'right') {
      const idx = +c.dataset.realidx;
      if (!turut_matches.includes(idx)) turut_matches.push(idx);
      openLanding(idx);
    }
    currentSwipe++;
    saveState();
    if (dir !== 'right') {
      // If it was a match, it will open the overlay, so we don't immediately render next card yet
      renderSwipeCard();
    } else {
      // Small trick: Wait for modal to close to render next card, but here we can just pre-render behind
      renderSwipeCard();
    }
  }, 400);
}

function enableSwipeGesture () {
  const card = document.getElementById('active-card');
  if (!card) return;
  let startX = 0, diff = 0;

  card.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  card.addEventListener('touchmove', e => {
    diff = e.touches[0].clientX - startX;
    card.style.transition = 'none';
    card.style.transform = `translateX(${diff}px) rotate(${diff / 20}deg)`;
    card.classList.remove('swipe-hint-left', 'swipe-hint-right');
    if (diff > 40) card.classList.add('swipe-hint-right');
    else if (diff < -40) card.classList.add('swipe-hint-left');
  });

  card.addEventListener('touchend', () => {
    card.classList.remove('swipe-hint-left', 'swipe-hint-right');
    if (Math.abs(diff) > 80) { animateOut(diff < 0 ? 'left' : 'right'); }
    else { card.style.transition = 'transform 0.4s ease'; card.style.transform = ''; }
  });

  // Mouse support for desktop
  let mouseDown = false;
  card.addEventListener('mousedown', e => { mouseDown = true; startX = e.clientX; });
  card.addEventListener('mousemove', e => {
    if (!mouseDown) return;
    diff = e.clientX - startX;
    card.style.transition = 'none';
    card.style.transform = `translateX(${diff}px) rotate(${diff / 20}deg)`;
    card.classList.remove('swipe-hint-left', 'swipe-hint-right');
    if (diff > 40) card.classList.add('swipe-hint-right');
    else if (diff < -40) card.classList.add('swipe-hint-left');
  });
  card.addEventListener('mouseup', () => {
    mouseDown = false;
    card.classList.remove('swipe-hint-left', 'swipe-hint-right');
    if (Math.abs(diff) > 80) { animateOut(diff < 0 ? 'left' : 'right'); }
    else { card.style.transition = 'transform 0.4s ease'; card.style.transform = ''; }
  });
  card.addEventListener('mouseleave', () => {
    if (mouseDown) {
      mouseDown = false;
      card.classList.remove('swipe-hint-left', 'swipe-hint-right');
      card.style.transition = 'transform 0.4s ease';
      card.style.transform = '';
    }
  });
}

btnReject.addEventListener('click', () => animateOut('left'));
btnMatch.addEventListener('click', () => animateOut('right'));

// ===== LANDING OVERLAY =====
function openLanding (idx) {
  const d = destinations[idx];
  document.getElementById('landing-img').src = d.img;
  document.getElementById('landing-cat').textContent = d.category.toUpperCase() + " Y PAISAJE";
  document.getElementById('landing-name').textContent = d.name;
  document.getElementById('landing-desc').textContent = d.desc;
  document.getElementById('landing-discount').textContent = d.discount + '%';
  document.getElementById('landing-wa').href = d.wa;
  overlay.classList.add('active');
  startTimer();
}

document.getElementById('landing-close').addEventListener('click', () => {
  overlay.classList.remove('active');
  clearInterval(timerInterval);
});

document.getElementById('landing-cta').addEventListener('click', () => {
  const btn = document.getElementById('landing-cta');
  btn.textContent = '¡Bono Activado!';
  btn.style.background = 'linear-gradient(135deg, #34D399, #059669)';
  btn.style.color = '#004828';
  btn.style.boxShadow = '0 8px 32px rgba(52,211,153,0.35)';
});

// ===== COUNTDOWN TIMER with URGENCY EFFECT =====
function startTimer () {
  clearInterval(timerInterval);
  let secs = 30 * 60;
  const clock = document.getElementById('timer-clock');
  const widget = document.querySelector('.timer-widget');

  if (widget) widget.classList.remove('timer-urgent');

  function tick () {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    clock.textContent = `${m}:${s}`;

    if (secs <= 300 && widget) {
      widget.classList.add('timer-urgent');
    }

    if (secs <= 0) { clearInterval(timerInterval); clock.textContent = '¡Expiró!'; }
    secs--;
  }
  tick();
  timerInterval = setInterval(tick, 1000);
}

// ===== HERO CTA (Navigate to Descubre) =====
const heroCta = document.getElementById('hero-cta');
if (heroCta) {
  heroCta.addEventListener('click', () => switchView('view-descubre'));
}

// ===== INIT with SKELETON LOADING =====
(function init () {
  // 1. Show skeletons immediately
  renderSkeletonCards(activityList, 5, 'dest');
  renderSkeletonCards(eventList, 4, 'event');

  // 2. Render contextual header immediately
  renderContextualHeader();

  // 3. Simulate data loading delay for skeleton effect
  setTimeout(() => {
    renderTop5(activeFilter);
    renderEvents();
    renderSwipeCard();
  }, 600);
})();
