// ─────────────────────────────────────────────────────────────
// All motion on the site:
//   1. Smooth scrolling (Lenis)
//   2. Background that drifts as you scroll
//   3. Project cards that tilt and glow under the real mouse
//   4. Reveals: [data-reveal="fade"] fades up;
//      [data-reveal="drag"] is dragged into place by the ghost cursor
// ─────────────────────────────────────────────────────────────
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add('motion-ready');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ── 1. Smooth scroll ──────────────────────────────────────────
if (!reduceMotion) {
  const lenis = new Lenis({ lerp: 0.11 });
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
// There's only one ghost cursor, so drag reveals wait in line.
// If several are waiting (fast scrolling), each one plays faster.
// (Declared before the triggers: items already on screen fire immediately.)
let queue: Promise<void> = Promise.resolve();
let waiting = 0;

const targets = gsap.utils.toArray<HTMLElement>('[data-reveal]');
const cursor = document.querySelector<HTMLElement>('.ghost-cursor');

if (reduceMotion || !cursor) {
  gsap.set(targets, { opacity: 1 });
} else {
  targets.forEach((el) => {
    const mode = el.dataset.reveal;
    const delay = parseFloat(el.dataset.delay ?? '0') || 0;

    if (mode === 'drag') {
      // Start as a faint "ghost" offset from its real position, waiting for the cursor.
      gsap.set(el, { opacity: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => enqueue(() => dragReveal(el, cursor)),
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

function dragReveal(el: HTMLElement, cursor: HTMLElement) {
  // Selection box with corner handles and a Figma-style size label
  const sel = document.createElement('span');
  sel.className = 'sel-box';
  sel.setAttribute('aria-hidden', 'true');
  sel.innerHTML = '<i></i><i></i><i></i><i></i>';
  el.appendChild(sel);
  sel.dataset.size = `${Math.round(el.offsetWidth)} × ${Math.round(el.offsetHeight)}`;

  // Where the component starts (offset) and where the cursor grabs it
  const fromLeft = el.getBoundingClientRect().left > window.innerWidth / 2;
  const dx = (fromLeft ? 1 : -1) * gsap.utils.random(50, 90, 1);
  const dy = gsap.utils.random(26, 44, 1);
  gsap.set(el, { x: dx, y: dy, opacity: 0 });

  const r = el.getBoundingClientRect();
  const grabX = r.left + window.scrollX + Math.min(44, r.width * 0.18);
  const grabY = r.top + window.scrollY + Math.min(30, r.height * 0.25);
  const startX = grabX + (fromLeft ? 140 : -140);
  const startY = grabY + 110;

  const tl = gsap.timeline();
  tl.set(cursor, { x: startX, y: startY, scale: 1, opacity: 0 })
    // the component appears as a faint ghost; the cursor flies in
    .to(el, { opacity: 0.35, duration: 0.3, ease: 'power1.out' }, 0)
    .to(cursor, { opacity: 1, duration: 0.2 }, 0)
    .to(cursor, { x: grabX, y: grabY, duration: 0.55, ease: 'power3.out' }, 0)
    // click: press down, selection box appears
    .to(cursor, { scale: 0.85, duration: 0.1, ease: 'power1.in' })
    .to(sel, { opacity: 1, duration: 0.12 }, '<')
    .to(el, { opacity: 1, duration: 0.18 }, '<')
    // drag into place
    .to(el, { x: 0, y: 0, duration: 0.6, ease: 'power3.inOut' })
    .to(cursor, { x: grabX - dx, y: grabY - dy, duration: 0.6, ease: 'power3.inOut' }, '<')
    // release and leave
    .to(cursor, { scale: 1, duration: 0.12, ease: 'power1.out' })
    .to(sel, { opacity: 0, duration: 0.35 }, '+=0.12')
    .to(cursor, { x: `+=${fromLeft ? 36 : -36}`, y: '+=28', opacity: 0, duration: 0.4, ease: 'power1.in' }, '<')
    .add(() => {
      sel.remove();
      gsap.set(el, { clearProps: 'transform' });
    });

  return tl;
}
