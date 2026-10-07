/* ==========================================================
   script.js — le seul fichier JavaScript du portfolio
   Le site tient dans un seul index.html : chaque « page » est une
   <section> affichée selon l'adresse (#accueil, #ap, #stages,
   #veille, #cv). Le bouton précédent/suivant du navigateur, les
   favoris et les liens partagés fonctionnent donc normalement.
   Lien direct vers une AP : index.html#ap03
   ========================================================== */

document.documentElement.classList.add('js');

/* ---------- Thème ---------- */
const THEME_KEY = 'portfolio-theme';
const themeRoot = document.documentElement;
try {
  if (localStorage.getItem(THEME_KEY) === 'light') themeRoot.setAttribute('data-theme', 'light');
} catch (e) {}

document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');
  const sections = [...document.querySelectorAll('.page')];
  const navLinks = [...document.querySelectorAll('.navlinks a')];
  const cards = [...document.querySelectorAll('.ap-card')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const OUT_MS = reduceMotion ? 0 : 140;

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ---------- Bouton thème clair / sombre ---------- */
  const themeBtn = document.createElement('button');
  themeBtn.type = 'button';
  themeBtn.className = 'theme-toggle';
  const refreshThemeBtn = () => {
    const light = themeRoot.getAttribute('data-theme') === 'light';
    themeBtn.textContent = light ? '☾ Mode sombre' : '☀ Mode clair';
    themeBtn.setAttribute('aria-label', light ? 'Passer en mode sombre' : 'Passer en mode clair');
  };
  themeBtn.addEventListener('click', () => {
    const light = themeRoot.getAttribute('data-theme') === 'light';
    if (light) themeRoot.removeAttribute('data-theme');
    else themeRoot.setAttribute('data-theme', 'light');
    try { localStorage.setItem(THEME_KEY, light ? 'dark' : 'light'); } catch (e) {}
    refreshThemeBtn();
  });
  refreshThemeBtn();
  const logo = document.querySelector('.topbar .logo');
  if (logo) logo.appendChild(themeBtn);

  /* ---------- Année du pied de page ---------- */
  const y = document.getElementById('year-tag');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Cartes AP ---------- */
  const setCard = (card, open, scroll) => {
    cards.forEach(c => {
      c.classList.remove('open');
      c.querySelector('.ap-button').setAttribute('aria-expanded', 'false');
    });
    if (open) {
      card.classList.add('open');
      card.querySelector('.ap-button').setAttribute('aria-expanded', 'true');
      if (scroll) setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
    // #ap03 quand une carte est ouverte, #ap quand tout est fermé (sans créer d'entrée d'historique)
    try { history.replaceState(null, '', open ? '#' + card.id : '#ap'); } catch (e) {}
  };
  cards.forEach(card => {
    const toggle = () => setCard(card, !card.classList.contains('open'), true);
    card.querySelector('.ap-button').addEventListener('click', toggle);
    card.querySelector('.terminal-bar').addEventListener('click', toggle);
  });

  /* ---------- Routeur : adresse -> section ---------- */
  const pageKeys = sections.map(s => s.dataset.page);
  const parseHash = () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (cards.some(c => c.id === h)) return { page: 'ap', card: h };
    if (pageKeys.includes(h)) return { page: h };
    return { page: 'accueil' };
  };

  let current = null;
  let timer = null;

  const reveal = (target, card) => {
    sections.forEach(s => s.classList.toggle('active', s === target));
    const key = target.dataset.page;
    document.title = target.dataset.title;
    navLinks.forEach(a => {
      const on = a.dataset.nav === key;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.classList.remove('page-out');
    main.classList.remove('page-in');
    void main.offsetWidth;            // relance l'animation
    main.classList.add('page-in');
    current = key;
    if (card) setCard(document.getElementById(card), true, true);
  };

  const route = () => {
    const { page, card } = parseHash();
    const target = document.getElementById('p-' + page);

    if (timer) { clearTimeout(timer); timer = null; }   // navigation rapide : on termine tout de suite

    if (page === current) {                              // même page : seule la carte AP peut changer
      if (card) setCard(document.getElementById(card), true, true);
      return;
    }
    if (current === null) { reveal(target, card); return; }   // premier affichage

    main.classList.remove('page-in');
    main.classList.add('page-out');
    timer = setTimeout(() => { timer = null; reveal(target, card); }, OUT_MS);
  };

  window.addEventListener('hashchange', route);
  route();
});
