/* ============================================================
   MERCÚRIO CASA 9 — Utilitários e ícones compartilhados
   ============================================================ */

const ICONS = {
  mercury: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="9" r="6.2" stroke="currentColor" stroke-width="1.3"/>
    <path d="M16 15.2V26.5" stroke="currentColor" stroke-width="1.3"/>
    <path d="M10.5 21H21.5" stroke="currentColor" stroke-width="1.3"/>
    <path d="M10.2 3.2C10.2 5.5 12.3 6.5 16 6.5C19.7 6.5 21.8 5.5 21.8 3.2" stroke="currentColor" stroke-width="1.3"/>
  </svg>`,
  arrowUp: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  arrowLeft: `<svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none"><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7m2 0v13a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 20V7h10z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="2.5" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="12" r="2.5" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="19" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M8.2 10.7l7.6-4.4M8.2 13.3l7.6 4.4" stroke="currentColor" stroke-width="1.5"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none"><path d="M10 14a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1M14 10a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="4.5" width="17" height="15" rx="0.5" stroke="currentColor" stroke-width="1.5"/><circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M5 17l4.5-5 3 3 3-4 4 6" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
  dashboard: `<svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="3.5" width="7.5" height="7.5" stroke="currentColor" stroke-width="1.4"/><rect x="13" y="3.5" width="7.5" height="4.5" stroke="currentColor" stroke-width="1.4"/><rect x="13" y="10" width="7.5" height="10.5" stroke="currentColor" stroke-width="1.4"/><rect x="3.5" y="13" width="7.5" height="7.5" stroke="currentColor" stroke-width="1.4"/></svg>`,
  feather: `<svg viewBox="0 0 24 24" fill="none"><path d="M20.5 3.5c-5 0-12 3-15 11-1 2.5 1 4.5 3.5 3.5C16.5 15 19.5 8.5 20.5 3.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M4 20l6-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  logout: `<svg viewBox="0 0 24 24" fill="none"><path d="M9 21H5.5A1.5 1.5 0 0 1 4 19.5v-15A1.5 1.5 0 0 1 5.5 3H9M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  bold: `<svg viewBox="0 0 24 24" fill="none"><path d="M7 4h6.5a3.5 3.5 0 0 1 0 7H7V4zM7 11h7a3.5 3.5 0 0 1 0 7H7v-7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  italic: `<svg viewBox="0 0 24 24" fill="none"><path d="M11 4h6M7 20h6M14 4L10 20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  quote: `<svg viewBox="0 0 24 24" fill="none"><path d="M4.5 9.5c0-2.5 1.5-4 4-4.5v2.2c-1 .4-1.6 1.1-1.7 2.3H8.5v4.5h-4V9.5zM13.5 9.5c0-2.5 1.5-4 4-4.5v2.2c-1 .4-1.6 1.1-1.7 2.3h1.7v4.5h-4V9.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
  listUl: `<svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="6" r="1.2" fill="currentColor"/><circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="5" cy="18" r="1.2" fill="currentColor"/><path d="M9.5 6h10M9.5 12h10M9.5 18h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  listOl: `<svg viewBox="0 0 24 24" fill="none"><path d="M9.5 6h10M9.5 12h10M9.5 18h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><text x="2.5" y="8" font-size="6" fill="currentColor">1</text><text x="2.5" y="14" font-size="6" fill="currentColor">2</text><text x="2.5" y="20" font-size="6" fill="currentColor">3</text></svg>`,
  divider: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 12h4M10 12h4M16 12h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  headline: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 5v6m0 0v8m0-8h7m0-6v6m0 0v8M17 13l2-1.5v8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  undo: `<svg viewBox="0 0 24 24" fill="none"><path d="M9 7L4 12l5 5M4 12h10a5.5 5.5 0 0 1 0 11h-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  redo: `<svg viewBox="0 0 24 24" fill="none"><path d="M15 7l5 5-5 5M20 12H10A5.5 5.5 0 0 0 10 23h1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  imgFloatLeft: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="8" height="8" stroke="currentColor" stroke-width="1.4"/><path d="M13 6h8M13 10h8M3 16h18M3 19.5h18" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  imgFloatRight: `<svg viewBox="0 0 24 24" fill="none"><rect x="13" y="5" width="8" height="8" stroke="currentColor" stroke-width="1.4"/><path d="M3 6h8M3 10h8M3 16h18M3 19.5h18" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  imgWide: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="10" stroke="currentColor" stroke-width="1.4"/><path d="M7 11l2.5-2.5L12 11l3-4 2 3" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
};

const Util = {
  formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T12:00:00');
    if (isNaN(d)) return dateStr;
    const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
  },

  formatDateShort(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T12:00:00');
    if (isNaN(d)) return dateStr;
    const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
    return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  },

  romanize(num) {
    const map = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    let result = '';
    for (const [v, s] of map) {
      while (num >= v) { result += s; num -= v; }
    }
    return result;
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  },

  toast(message, iconKey) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.innerHTML = `${ICONS[iconKey] || ICONS.check}<span></span>`;
    el.querySelector('span').textContent = message;
    el.classList.add('is-visible');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('is-visible'), 2600);
  },

  injectGlyph(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.innerHTML = ICONS.mercury;
    });
  },

  requireAuth() {
    if (!DB.isAuthenticated()) {
      window.location.href = 'admin-login.html';
      return false;
    }
    return true;
  },

  setupToTop() {
    const btn = document.querySelector('.to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 480) btn.classList.add('is-visible');
      else btn.classList.remove('is-visible');
    });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  buildToTopButton() {
    const btn = document.createElement('button');
    btn.className = 'to-top';
    btn.setAttribute('aria-label', 'Voltar ao topo');
    btn.innerHTML = ICONS.arrowUp;
    document.body.appendChild(btn);
    this.setupToTop();
  },

  buildToc(activeSlug) {
    const trigger = document.createElement('div');
    trigger.className = 'toc-trigger';

    const toc = document.createElement('nav');
    toc.className = 'toc';
    toc.setAttribute('aria-label', 'Sumário de textos publicados');

    const posts = DB.getPublishedPosts();

    toc.innerHTML = `
      <div class="toc__tab"><span>Sumário</span></div>
      <div class="toc__head">
        <h2>Sumário</h2>
        <p>Todos os textos, por ordem de publicação</p>
      </div>
      <ul class="toc__list">
        ${posts.length === 0
          ? `<li class="toc__empty">Nenhum texto publicado ainda.</li>`
          : posts.map(p => `
            <li class="toc__item">
              <a href="texto.html?slug=${encodeURIComponent(p.slug)}" ${p.slug === activeSlug ? 'aria-current="page"' : ''}>
                <span class="toc__item-num">Folha ${Util.romanize(p.folio || 1)}</span>
                <span class="toc__item-title">${Util.escapeHtml(p.title)}</span>
                <span class="toc__item-date">${Util.formatDateShort(p.date)}</span>
              </a>
            </li>
          `).join('')
        }
      </ul>
    `;

    document.body.appendChild(trigger);
    document.body.appendChild(toc);

    const scrim = document.createElement('div');
    scrim.className = 'toc-scrim';
    document.body.appendChild(scrim);

    // Em ecrãs táteis (sem hover real), a aba abre/fecha por toque
    const tab = toc.querySelector('.toc__tab');
    function openToc() {
      toc.classList.add('is-open');
      scrim.classList.add('is-open');
    }
    function closeToc() {
      toc.classList.remove('is-open');
      scrim.classList.remove('is-open');
    }
    tab.addEventListener('click', () => {
      toc.classList.contains('is-open') ? closeToc() : openToc();
    });
    scrim.addEventListener('click', closeToc);
    toc.querySelectorAll('.toc__item a').forEach(a => a.addEventListener('click', closeToc));
  },

  shareUrl() {
    return window.location.href;
  },

  copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return Promise.resolve();
  }
};
