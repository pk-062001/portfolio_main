const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Theme ---------- */

function setTheme(next: 'light' | 'dark') {
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
  window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
}

export function toggleTheme(origin?: { x: number; y: number }) {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  if (!doc.startViewTransition || reducedMotion) return setTheme(next);

  const x = origin?.x ?? innerWidth - 80;
  const y = origin?.y ?? 40;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const transition = doc.startViewTransition(() => setTheme(next));
  transition.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 700, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
    );
  });
}

document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) =>
  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    toggleTheme({ x: e.clientX || rect.left + rect.width / 2, y: e.clientY || rect.top + rect.height / 2 });
  }),
);

/* ---------- Reveal on scroll ([data-split] words are wrapped at build time by Split.astro) ---------- */

const revealTargets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-split]');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  revealTargets.forEach((el) => io.observe(el));
}

/* ---------- Count-up numbers ---------- */

const counters = document.querySelectorAll<HTMLElement>('[data-count]');
const runCounter = (el: HTMLElement) => {
  const target = Number(el.dataset.count);
  if (reducedMotion) return void (el.textContent = String(target));
  const start = performance.now();
  const duration = 1600;
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 4))));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
if (counters.length) {
  const io = new IntersectionObserver((entries) =>
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      runCounter(entry.target as HTMLElement);
      io.unobserve(entry.target);
    }),
  );
  counters.forEach((el) => io.observe(el));
}

/* ---------- Pointer effects (desktop only) ---------- */

if (finePointer && !reducedMotion) {
  document.addEventListener(
    'pointermove',
    (e) => {
      const card = (e.target as Element).closest?.<HTMLElement>('.spotlight');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    },
    { passive: true },
  );

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.28;
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

/* ---------- Smooth scroll (desktop only, loaded lazily) ---------- */

type LenisLike = {
  scrollTo: (target: HTMLElement | number, opts?: { offset?: number; force?: boolean }) => void;
  start: () => void;
  stop: () => void;
};
let lenis: LenisLike | undefined;

if (finePointer && !reducedMotion) {
  import('lenis').then(({ default: Lenis }) => {
    const instance = new Lenis({ duration: 1.1, autoRaf: true });
    window.addEventListener('scroll-lock', () => instance.stop());
    window.addEventListener('scroll-unlock', () => instance.start());
    lenis = instance;
  });
}

export function scrollToHash(hash: string) {
  const target = hash === '#top' ? document.body : document.getElementById(hash.slice(1));
  if (!target) return false;
  if (lenis) {
    lenis.start();
    lenis.scrollTo(hash === '#top' ? 0 : target, { offset: -80, force: true });
  } else {
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }
  history.replaceState(null, '', hash === '#top' ? location.pathname : hash);
  return true;
}

document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const link = (e.target as Element).closest?.<HTMLAnchorElement>('a[href*="#"]');
  if (!link) return;
  const url = new URL(link.href, location.href);
  if (url.pathname !== location.pathname || !url.hash) return;
  if (scrollToHash(url.hash)) e.preventDefault();
});
