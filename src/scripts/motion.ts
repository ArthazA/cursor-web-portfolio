// ─────────────────────────────────────────────────────────────
// All motion on the site:
//   1. Smooth scrolling (Lenis)
//   2. Background that drifts as you scroll
//   3. Project cards that tilt and glow under the real mouse
//   4. Reveals:
//      [data-reveal="fade"]  quiet fade-up for secondary content
//      [data-reveal="drag"]  the ghost cursor brings it in. Variants:
//         side    pulled in from the nearest screen edge (left/right)
//         bottom  pulled up from the bottom edge
//         expand  a selection box is dragged open and the component appears inside it
//      Pick one with data-variant="left|right|bottom|expand",
//      or leave it out and the page rotates through them.
// ─────────────────────────────────────────────────────────────
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add('motion-ready');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ── 1. Smooth scroll ──────────────────────────────────────────
// lerp: how much of the remaining distance to cover each frame.
// Higher = snappier (1 = no smoothing). 0.2 keeps it smooth without lag.
if (!reduceMotion) {
  const lenis = new Lenis({ lerp: 0.2, wheelMultiplier: 1.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ── 2. Background drift ───────────────────────────────────────
if (!reduceMotion) {
  const grid = document.querySelector<HTMLElement>('[data-parallax-grid]');
  const blobs = document.querySelectorAll<HTMLElement>('[data-parallax]');
  const gridSpeed = parseFloat(grid?.dataset.parallaxGrid ?? '0.12');

  const update = () => {
    const y = window.scrollY;
    if (grid) grid.style.backgroundPosition = `0 ${-y * gridSpeed}px`;
    blobs.forEach((b) => {
      const speed = parseFloat(b.dataset.parallax ?? '0.05');
      b.style.transform = `translate3d(0, ${-y * speed}px, 0)`;
    });
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ── 3. Card tilt + glow (follows the visitor's real mouse) ────
if (canHover && !reduceMotion) {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      card.style.setProperty('--rx', `${(0.5 - py) * 4}deg`);
      card.style.setProperty('--ry', `${(px - 0.5) * 4}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

// ── 4. Reveals ────────────────────────────────────────────────
type Variant = 'left' | 'right' | 'bottom' | 'expand';

// There's only one ghost cursor, so drag reveals wait in line.
// If several are waiting (fast scrolling), each one plays faster.
// (Declared before the triggers: items already on screen fire immediately.)
let queue: Promise<void> = Promise.resolve();
let waiting = 0;
let rotation = 0;
const ROTATION: ('side' | 'expand' | 'bottom')[] = ['side', 'expand', 'bottom'];

const targets = gsap.utils.toArray<HTMLElement>('[data-reveal]');
const cursor = document.querySelector<HTMLElement>('.ghost-cursor');

if (reduceMotion || !cursor) {
  gsap.set(targets, { opacity: 1 });
} else {
  targets.forEach((el) => {
    const mode = el.dataset.reveal;
    const delay = parseFloat(el.dataset.delay ?? '0') || 0;

    if (mode === 'drag') {
      const preferred = el.dataset.variant as Variant | undefined;
      const auto = ROTATION[rotation++ % ROTATION.length];
      gsap.set(el, { opacity: 0 }); // hidden until the cursor's turn; then it appears with no fade
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => enqueue(() => reveal(el, cursor, preferred ?? auto)),
      });
    } else {
      gsap.set(el, { opacity: 0, y: 18 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () =>
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: delay + 0.1,
            ease: 'power2.out',
            clearProps: 'transform',
          }),
      });
    }
  });
}

function enqueue(make: () => gsap.core.Timeline) {
  waiting++;
  queue = queue.then(
    () =>
      new Promise<void>((resolve) => {
        const tl = make();
        tl.timeScale(Math.min(1 + (waiting - 1) * 0.7, 3));
        tl.eventCallback('onComplete', () => {
          waiting--;
          resolve();
        });
      }),
  );
}

// ── Ghost cursor choreography ─────────────────────────────────

const PEEK = 40; // px of the component visible at the screen edge before it's pulled in

function viewport() {
  return {
    sx: window.scrollX,
    sy: window.scrollY,
    vw: document.documentElement.clientWidth,
    vh: window.innerHeight,
  };
}

function makeSelection(el: HTMLElement, parent: HTMLElement = el) {
  const sel = document.createElement('span');
  sel.className = 'sel-box';
  sel.setAttribute('aria-hidden', 'true');
  sel.innerHTML = '<i></i><i></i><i></i><i></i>';
  sel.dataset.size = `${Math.round(el.offsetWidth)} × ${Math.round(el.offsetHeight)}`;
  parent.appendChild(sel);
  return sel;
}

function reveal(el: HTMLElement, cursor: HTMLElement, choice: Variant | 'side' | 'bottom' | 'expand') {
  gsap.set(el, { x: 0, y: 0, clipPath: 'none' });
  const r = el.getBoundingClientRect();
  const { vw } = viewport();

  let variant: Variant;
  if (choice === 'side') variant = r.left + r.width / 2 > vw / 2 ? 'right' : 'left';
  else variant = choice;

  // Very wide components would travel across the whole screen from the side; pull them up instead.
  if ((variant === 'left' || variant === 'right') && !el.dataset.variant && r.width > vw * 0.6) {
    variant = 'bottom';
  }

  return variant === 'expand' ? expandReveal(el, cursor, r) : pullReveal(el, cursor, r, variant);
}

/** Component starts mostly off-screen at an edge; the cursor grabs the visible sliver and pulls it into place. */
function pullReveal(el: HTMLElement, cursor: HTMLElement, r: DOMRect, from: 'left' | 'right' | 'bottom') {
  const { sx, sy, vw, vh } = viewport();
  const sel = makeSelection(el);

  let dx = 0;
  let dy = 0;
  if (from === 'right') dx = vw - PEEK - r.left;
  if (from === 'left') dx = PEEK - r.right;
  if (from === 'bottom') dy = Math.max(vh - PEEK - r.top, 90);

  // Grab point near the edge that's peeking in
  const offX = from === 'right' ? 20 : from === 'left' ? r.width - 20 : Math.min(56, r.width * 0.2);
  const offY = from === 'bottom' ? 14 : Math.min(36, r.height * 0.25);
  const endX = r.left + sx + offX;
  const endY = r.top + sy + offY;
  const grabX = endX + dx;
  const grabY = endY + dy;

  // The cursor enters from outside the same edge
  const enterX = from === 'right' ? sx + vw + 30 : from === 'left' ? sx - 40 : grabX + 60;
  const enterY = from === 'bottom' ? sy + vh + 30 : grabY + 70;

  const tl = gsap.timeline();
  tl.set(el, { x: dx, y: dy, opacity: 1 }) // appears instantly, almost entirely off-screen
    .set(cursor, { x: enterX, y: enterY, scale: 1, opacity: 1 })
    .to(cursor, { x: grabX, y: grabY, duration: 0.45, ease: 'power2.out' })
    // click
    .to(cursor, { scale: 0.85, duration: 0.09, ease: 'power1.in' })
    .set(sel, { opacity: 1 }, '<')
    // drag into place
    .to(el, { x: 0, y: 0, duration: 0.8, ease: 'power3.inOut' })
    .to(cursor, { x: endX, y: endY, duration: 0.8, ease: 'power3.inOut' }, '<')
    // release
    .to(cursor, { scale: 1, duration: 0.1, ease: 'power1.out' })
    .to(sel, { opacity: 0, duration: 0.25 }, '+=0.1')
    .add(() => {
      sel.remove();
      gsap.set(el, { clearProps: 'transform' });
    });

  hoverThenExit(tl, el, cursor, r, endX, endY, from === 'left' ? 'left' : 'right');
  return tl;
}

/** The cursor drags a selection box open from the top-left corner; the component is revealed inside it. */
function expandReveal(el: HTMLElement, cursor: HTMLElement, r: DOMRect) {
  const { sx, sy } = viewport();
  const radius = getComputedStyle(el).borderRadius || '0px';

  const x0 = r.left + sx - 8;
  const y0 = r.top + sy - 8;
  // The box lives on the page (not inside the component) so the clip doesn't hide it
  const sel = makeSelection(el, document.body);
  sel.style.left = `${x0}px`;
  sel.style.top = `${y0}px`;
  const x1 = r.right + sx + 8;
  const y1 = r.bottom + sy + 8;

  const p = { t: 0 };
  const apply = () => {
    const w = (r.width + 16) * p.t;
    const h = (r.height + 16) * p.t;
    // clip the component to the growing box (in its own coordinates)
    const right = Math.max(0, r.width - (w - 8));
    const bottom = Math.max(0, r.height - (h - 8));
    el.style.clipPath = `inset(0px ${right}px ${bottom}px 0px round ${radius})`;
    sel.style.width = `${w}px`;
    sel.style.height = `${h}px`;
    sel.dataset.size = `${Math.round(r.width * p.t)} × ${Math.round(r.height * p.t)}`;
    gsap.set(cursor, { x: x0 + w, y: y0 + h });
  };

  const tl = gsap.timeline();
  tl.add(() => {
    p.t = 0;
    apply();
  })
    .set(el, { opacity: 1 })
    .set(sel, { opacity: 1, width: 0, height: 0 })
    .set(cursor, { x: x0 - 130, y: y0 - 50, scale: 1, opacity: 1 })
    .fromTo(cursor, { x: viewport().sx - 40 }, { x: x0, y: y0, duration: 0.5, ease: 'power2.out' })
    // press at the top-left corner
    .to(cursor, { scale: 0.85, duration: 0.09, ease: 'power1.in' })
    // drag diagonally: the box and the component grow together
    .to(p, { t: 1, duration: 0.85, ease: 'power2.inOut', onUpdate: apply })
    .to(cursor, { scale: 1, duration: 0.1, ease: 'power1.out' })
    .to(sel, { opacity: 0, duration: 0.25 }, '+=0.1')
    .add(() => {
      sel.remove();
      el.style.clipPath = '';
    });

  hoverThenExit(tl, el, cursor, r, x1, y1, 'right');
  return tl;
}

/** If the component is a project card, the cursor glides across it so it lights up; then it leaves. */
function hoverThenExit(
  tl: gsap.core.Timeline,
  el: HTMLElement,
  cursor: HTMLElement,
  r: DOMRect,
  fromX: number,
  fromY: number,
  exitSide: 'left' | 'right',
) {
  const { sx, sy, vw } = viewport();
  const card = el.querySelector<HTMLElement>('.card');
  const pos = { x: fromX, y: fromY };

  if (card) {
    const cx = r.left + sx;
    const cy = r.top + sy;
    const track = () => {
      gsap.set(cursor, { x: pos.x, y: pos.y });
      card.style.setProperty('--mx', `${((pos.x - cx) / r.width) * 100}%`);
      card.style.setProperty('--my', `${((pos.y - cy) / r.height) * 100}%`);
    };
    tl.add(() => {
      pos.x = fromX;
      pos.y = fromY;
      track();
      card.classList.add('ghost-hover');
    })
      .to(pos, { x: cx + r.width * 0.35, y: cy + r.height * 0.45, duration: 0.5, ease: 'sine.inOut', onUpdate: track })
      .to(pos, { x: cx + r.width * 0.68, y: cy + r.height * 0.62, duration: 0.6, ease: 'sine.inOut', onUpdate: track })
      .add(() => card.classList.remove('ghost-hover'), '+=0.2');
  }

  // Leave the way it came: slide off the nearest side
  tl.to(cursor, {
    x: exitSide === 'left' ? sx - 60 : sx + vw + 60,
    y: `+=${40}`,
    duration: 0.5,
    ease: 'power2.in',
  }).set(cursor, { opacity: 0 });
}
