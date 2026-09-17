/**
 * KASCOTE — Event Countdown Timer
 * File: src/countdown.js
 *
 * Event lifecycle:
 *   upcoming → live countdown  (Days : Hours : Minutes : Seconds)
 *   live     → "Happening Now" pulse badge + CTA
 *   hidden   → removed from DOM after endDate
 */

/* ── State helpers ── */

function getEventState(event) {
  const now   = Date.now();
  const start = new Date(event.startDate).getTime();
  const end   = new Date(event.endDate).getTime();
  if (now < start)            return 'upcoming';
  if (now >= start && now < end) return 'live';
  return 'hidden';
}

function getRemainingTime(targetMs) {
  const diff = targetMs - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const totalSec = Math.floor(diff / 1000);
  const seconds  = totalSec % 60;
  const totalMin = Math.floor(totalSec / 60);
  const minutes  = totalMin % 60;
  const totalHr  = Math.floor(totalMin / 60);
  const hours    = totalHr % 24;
  const days     = Math.floor(totalHr / 24);
  return { days, hours, minutes, seconds, expired: false };
}

function pad(n) { return String(n).padStart(2, '0'); }

/* ── DOM builders ── */

function buildDigitUnit(value, label) {
  const unit     = document.createElement('div');
  unit.className = 'ec-unit';

  const box     = document.createElement('div');
  box.className = 'ec-digit-box';

  const numEl     = document.createElement('span');
  numEl.className = 'ec-digit-number';
  numEl.textContent = value;

  const lblEl     = document.createElement('span');
  lblEl.className = 'ec-digit-label';
  lblEl.textContent = label;

  box.append(numEl, lblEl);
  unit.appendChild(box);
  return { root: unit, numEl, boxEl: box };
}

function buildSep() {
  const s = document.createElement('span');
  s.className   = 'ec-separator';
  s.textContent = ':';
  return s;
}

/**
 * Build Days : Hours : Minutes : Seconds display.
 * Timer ticks every second.
 */
function buildCountdownDisplay(startMs) {
  const root = document.createElement('div');
  root.className = 'event-countdown-display';

  const t = getRemainingTime(startMs);

  const dayU = buildDigitUnit(pad(t.days),    'Days');
  const hrU  = buildDigitUnit(pad(t.hours),   'Hours');
  const minU = buildDigitUnit(pad(t.minutes), 'Mins');
  const secU = buildDigitUnit(pad(t.seconds), 'Secs');

  root.append(
    dayU.root, buildSep(),
    hrU.root,  buildSep(),
    minU.root, buildSep(),
    secU.root
  );

  function tick(boxEl) {
    boxEl.classList.add('ec-tick');
    setTimeout(() => boxEl.classList.remove('ec-tick'), 140);
  }

  let prev = { ...t };

  const id = setInterval(() => {
    const cur = getRemainingTime(startMs);
    if (cur.expired) { clearInterval(id); return; }

    if (cur.seconds !== prev.seconds) { secU.numEl.textContent = pad(cur.seconds); tick(secU.boxEl); }
    if (cur.minutes !== prev.minutes) { minU.numEl.textContent = pad(cur.minutes); tick(minU.boxEl); }
    if (cur.hours   !== prev.hours)   { hrU.numEl.textContent  = pad(cur.hours);   tick(hrU.boxEl);  }
    if (cur.days    !== prev.days)    { dayU.numEl.textContent = pad(cur.days);    tick(dayU.boxEl); }
    prev = cur;
  }, 1000);

  return { root, destroyer: () => clearInterval(id) };
}

/* ── Card builder ── */

function buildCard(event) {
  const state = getEventState(event);
  if (state === 'hidden') return null;

  const startMs = new Date(event.startDate).getTime();

  const card = document.createElement('article');
  card.className = 'event-card' + (state === 'ended' ? ' ec-ended' : '');
  card.setAttribute('aria-label', event.title);
  card.id = 'ec-card-' + event.id;

  // Whole-card click → detail page (unless user clicks a link inside)
  card.addEventListener('click', (e) => {
    if (!e.target.closest('a')) {
      window.location.href = 'event-detail.html?id=' + encodeURIComponent(event.id);
    }
  });

  /* ── Media panel ── */
  const media     = document.createElement('div');
  media.className = 'event-card-media';

  const img  = document.createElement('img');
  img.src    = event.image;
  img.alt    = event.title;
  img.loading = 'lazy';
  media.appendChild(img);

  // Category badge
  const catBadge     = document.createElement('span');
  catBadge.className = 'event-category-badge';
  catBadge.textContent = event.category;
  media.appendChild(catBadge);

  // Status badge
  if (state === 'live') {
    const badge = document.createElement('span');
    badge.className = 'event-status-badge ec-badge-live';
    const dot   = document.createElement('span');
    dot.className = 'event-status-dot';
    badge.append(dot, document.createTextNode('Happening Now'));
    media.appendChild(badge);
  }

  card.appendChild(media);

  /* ── Content panel ── */
  const body     = document.createElement('div');
  body.className = 'event-card-body';

  const titleEl     = document.createElement('h3');
  titleEl.className = 'event-card-title';
  titleEl.textContent = event.title;
  body.appendChild(titleEl);

  if (event.tagline) {
    const tg     = document.createElement('p');
    tg.className = 'event-card-tagline';
    tg.textContent = event.tagline;
    body.appendChild(tg);
  }

  if (event.location) {
    const loc     = document.createElement('div');
    loc.className = 'event-card-location';
    loc.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
           stroke="#ff3333" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      ${event.location}`;
    body.appendChild(loc);
  }

  // Countdown or live message
  let countdownDestroyer = null;
  if (state === 'upcoming') {
    const { root: cdRoot, destroyer } = buildCountdownDisplay(startMs);
    body.appendChild(cdRoot);
    countdownDestroyer = destroyer;
  } else if (state === 'live') {
    const msg     = document.createElement('p');
    msg.className = 'ec-live-message';
    msg.textContent = '🎉 This event is happening right now!';
    body.appendChild(msg);
  }

  // Detail page link
  const detailA     = document.createElement('a');
  detailA.href      = 'event-detail.html?id=' + encodeURIComponent(event.id);
  detailA.className = 'event-detail-link';
  detailA.innerHTML = 'View Full Details &rarr;';
  body.appendChild(detailA);

  card.appendChild(body);

  return {
    cardEl: card,
    destroyer: countdownDestroyer || (() => {})
  };
}

/* ── Init ── */

const STATE_ORDER = { upcoming: 0, live: 1, ended: 2 };

async function initCountdownSection() {
  const section = document.getElementById('upcoming-events');
  const track   = document.getElementById('eventsScrollTrack');
  if (!section || !track) return;

  let events = [];
  try {
    const res = await fetch('events.json');
    if (!res.ok) throw new Error('events.json not found');
    events = await res.json();
  } catch (err) {
    console.warn('[countdown.js]', err);
    section.style.display = 'none';
    return;
  }

  const visible = events.filter(e => getEventState(e) !== 'hidden');
  if (!visible.length) { section.style.display = 'none'; return; }

  visible.sort((a, b) => {
    const oa = STATE_ORDER[getEventState(a)] ?? 99;
    const ob = STATE_ORDER[getEventState(b)] ?? 99;
    return oa !== ob ? oa - ob : 0;
  });

  const destroyers = [];
  visible.forEach(ev => {
    const result = buildCard(ev);
    if (!result) return;
    track.appendChild(result.cardEl);
    destroyers.push(result.destroyer);
  });

  // Cleanup on DOM removal (SPA-safe)
  new MutationObserver(() => {
    if (!document.contains(section)) {
      destroyers.forEach(d => d());
    }
  }).observe(document.body, { childList: true });
}

initCountdownSection();
