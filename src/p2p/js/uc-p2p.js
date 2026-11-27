/* ==========================================================================
   UNG CANCER — P2P PÅ ADOVEO: header, meny, sök och ankare
   --------------------------------------------------------------------------
   Laddas på alla P2P-sidor via Theme → Head Markup (se README).
   Bygger headern och menypanelen själv, så Campaign Head ska vara tomt.

   VANLIGASTE ÄNDRINGEN: menyn. Ändra listorna under MENY nedan.
   Spara på github.com — sidan uppdateras inom några minuter.
   ========================================================================== */
(function () {
  if (window.ucHeaderInit) return;            /* lås mot dubbel-init */
  window.ucHeaderInit = true;
  /* Mappen scriptet ligger i (GitHub Pages). Bilder i src/assets hamnar där. */
  var SELF = document.currentScript && document.currentScript.src;
  var ASSETS = SELF ? SELF.replace(/[^\/]*$/, '') : 'https://ungcancer-prod.github.io/adoveo/';

  /* ---------- MENY ---------- */
  var BASE = 'https://ungcancer.adoveo.com/start/';
  /* Nivå 1: visas i mitten av headern på desktop och överst i menypanelen.
     Det här är också listan över koncepten: id = kampanjens nummer, och
     bg/ink = konceptets färger på insamlingskorten (textruta och etikett). */
  var MENU_MAIN = [
    { text: 'Födelsedag', id: '295', bg: 'var(--uc-pink)',  ink: 'var(--uc-black)', href: BASE + '295/?location=summary' },
    { text: 'Utmaning',   id: '297', bg: 'var(--uc-green)', ink: 'var(--uc-black)', href: BASE + '297/?location=summary' },
    { text: 'Till minne', id: '298', bg: 'var(--uc-black)', ink: 'var(--uc-cream)', href: BASE + '298/?location=summary' },
    { text: 'Pepp',       id: '299', bg: 'var(--uc-cream)', ink: 'var(--uc-black)', href: BASE + '299/?location=summary' }
  ];
  /* Nivå 2: bara i menypanelen. Ankaret (#...) = rubrikens text, se README */
  var MENU_MORE = [
    { text: 'Så funkar det',     href: BASE + '294/#sa-funkar-det' },
    { text: 'Spridningstips',    href: BASE + '308/#spridningstips' },
    { text: 'Vanliga frågor',    href: BASE + '308/#vanliga-fragor' },
    { text: 'Kontakt',           href: BASE + '308/#kontakt' },
    { text: 'Din integritet',    href: BASE + '308/#din-integritet' },
    { text: 'Till ungcancer.se', href: 'https://ungcancer.se/' }
  ];

  /* ---------- FOOTER ---------- */
  /* Samma innehåll som footern på ungcancer.se, men inverterad (vit yta,
     svart text) och utan land/språkväljaren. Ligger på alla P2P-sidor.
     Ändra texterna här. Logotyperna hämtas från ungcancer.se och färgas
     svarta i CSS (sektion 15). Ikonerna ligger i src/icons/. */
  var FOOTER = {
    columns: [
      { title: 'Om Ung Cancer', lines: [{ text: 'ungcancer.se', href: 'https://ungcancer.se/' }] },
      { title: 'Postadress',   lines: ['Ung Cancer', 'C/o The Works (Hiss A, våning 7)', 'Medborgarplatsen 25', '118 72 Stockholm'] },
      { title: 'Besöksadress', lines: ['Medborgarplatsen 25', '118 72 Stockholm'] },
      { title: 'Kontakt',      lines: [{ text: 'info@ungcancer.se', href: 'mailto:info@ungcancer.se' }] }
    ],
    payoff: 'För att ingen ung vuxen ska möta cancer ensam',
    logos: [
      { src: 'https://ungcancer.se/cdn/shop/files/logo_tryggt_givande.png', alt: 'Tryggt givande, Giva Sverige', w: 91, h: 52 },
      { src: 'https://ungcancer.se/cdn/shop/files/logo_90-konto.png', alt: '90-konto, Svensk Insamlingskontroll', w: 146, h: 36 }
    ],
    orgnr: 'Organisationsnr. 802456-7763',
    social: [   /* icon = filnamnet i src/icons/ och modifieraren i CSS */
      { name: 'Facebook',  icon: 'facebook',  href: 'https://www.facebook.com/ungcancer/' },
      { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/ungcancer/' },
      { name: 'TikTok',    icon: 'tiktok',    href: 'https://www.tiktok.com/@ungcancer' },
      { name: 'YouTube',   icon: 'youtube',   href: 'https://www.youtube.com/user/ungcancer' },
      { name: 'LinkedIn',  icon: 'linkedin',  href: 'https://linkedin.com/company/ung-cancer' }
    ],
    copyright: 'Upphovsrätt ' + new Date().getFullYear() + ' / Ung Cancer'
  };

  /* ---------- Summary-heron ---------- */
  /* Knappen i heron leder till korten där man väljer koncept */
  var HERO_CTA = { text: 'Starta', href: '#valj-koncept' };

  /* ---------- Insamlingssidan (/p/...) ---------- */
  /* Texterna som scriptet lägger till. Rubrik, beskrivning och bild
     kommer från insamlaren; formulärets etiketter från admin. */
  var FUND_TEXT = {
    give: 'Din gåva och hälsning', /* rubriken ovanför formuläret */
    givePepp: 'Din pepp & gåva',   /* rubriken ovanför formuläret på Pepp */
    messagePepp: 'Din pepp',       /* hälsningsfältets etikett på Pepp */
    of: 'av',                      /* "650 kr av 1 000 kr" */
    goal: 'av målet',              /* Utmaning: "av målet 1 000 kr" */
    goalOnly: 'Mål:',              /* 0 kr: bara målet visas, ingen mätare */
    collected: 'insamlat',
    impactPre: 'Tillsammans har vi samlat in',
    impactPost: 'till unga vuxna som möter cancer',
    formSum: 'insamlat till unga vuxna som möter cancer',
    more: 'Läs mer',               /* beskrivningen kortas, se --uc-fund-lines i CSS */
    less: 'Visa mindre'
  };
  /* Hur insamlat visas per koncept (kampanjens id, se MENU_MAIN):
     meter = summa, procent och tjock mätare; small = liten summa och
     tunn mätare; impact = summan till unga vuxna, ingen mätare;
     form = en rad ovanför formuläret. */
  var FUND_SHOW = { '297': 'meter', '295': 'small', '298': 'impact', '299': 'impact' };
  var PEPP_ID = '299';             /* Pepp: "Din pepp & gåva" och hälsningsfältet "Din pepp" */
  /* Insamlingsmålet. Beskrivningsmallen i admin märker ut det så här:
     [mål:{goal}] ({goal} = Adoveos fält Progress Goal). Scriptet läser siffran och tar bort märket. */
  var GOAL_MARK = /\[\s*mål\s*:\s*([\d\s.,]*)\]/i;
  var GOAL_ANY  = /\[\s*mål\s*:[^\]]*\]/gi;   /* även orenderat: [mål:{goal}] i förhandsvisningen */
  /* Levnadsår (Till minne): [år:{custom_field_2}] i beskrivningsmallen,
     visas mellan namnet och beskrivningen. Tomt fält = ingenting. */
  var YEARS_MARK = /\[\s*år\s*:\s*([^\]]*)\]/i;
  var YEARS_ANY  = /\[\s*år\s*:[^\]]*\]/gi;
  /* Skapa-sidan: förvalt insamlingsmål och snabbval (fältet vars etikett
     innehåller "mål"). */
  var GOAL_DEFAULT = 1000;
  var GOAL_CHOICES = [500, 1000, 2500, 5000];
  var GOAL_HINT = 'Ett förslag. Ändra om du vill, ett mål som nås och slås känns bäst.';
  /* Hälsningsväggen: lappens maxbredd (= spaltbredd), luft och
     "huller om buller". Under SMALL px bred vägg används SLOT_SMALL. */
  var WALL = { SLOT: 240, SLOT_SMALL: 160, SMALL: 600, GAP_X: 12, GAP_Y: 16, JIT_X: 8, JIT_Y: 6, TOP: 14,
               COLS_FUND: 3,      /* insamlingssidan, desktop: väggen i vänsterspalten, så många spalter */
               SLOT_SINGLE: 280 };  /* givarens tacksida: en spalt */

  /* ---------- Former (oregelbundna kanter) ---------- */
  /* clip-path-former i objectBoundingBox (0–1 = elementets bredd/höjd).
     Används i CSS som url(#id), t.ex. via --uc-clip eller class="uc-clip".
     Lägg till fler former här om olika element ska ha olika kant. */
  var SHAPES = {
    'shape-box': 'M0.998 0.993L0.748 0.994L0.5 0.992L0.252 1L0.006 0.992L0.003 0.747L0 0.5L0.007 0.252L0.006 0.005L0.252 0.006L0.5 0L0.748 0.009L0.998 0.001L1 0.252L0.993 0.5L0.995 0.748L0.998 0.993Z'
  };

  /* ---------- Inställningar ---------- */
  var SUMMARY_URL = BASE + '294/';
  var SUMMARY_ID  = '294';                     /* sökningen frågar alltid med Summary-kampanjens id */
  var FOLDER_FALLBACK = 'P2P-2026';       /* Adoveo-mappen. Används bara på sidor utan fältet #folder, se folderName() */
  /* Mappnamnet läses från Summary-sidans fält #folder, alltså det som valts i admin.
     Byter mappen namn i Adoveo följer koden med av sig själv. Sidor utan fältet
     (konceptsidorna, /p/) använder namnet som senast setts i sessionen och annars
     FOLDER_FALLBACK. Uppdatera FOLDER_FALLBACK när mappen byter namn. */
  function folderName() {
    var el = document.getElementById('folder');
    var v = el && el.value;
    try {
      if (v) sessionStorage.setItem('uc-folder', v);
      else v = sessionStorage.getItem('uc-folder');
    } catch (e) {}
    return v || FOLDER_FALLBACK;
  }

  /* Äldre kampanjer i mappen, från tiden före koncepten. Deras insamlingar
     räknas till ett koncept: etikett och färg på korten, pengarna på
     konceptkortet och i totalen, och samma design på insamlingssidan.
     OLD_CAMPAIGNS: kampanj -> koncept för hela kampanjen (null = välj per
     insamling i CARD_CONCEPT, koden ur /p/<kod>). HIDE_CARDS: insamlingar
     som inte visas i listorna (finns kvar i Adoveo). Beslut 2026-11-25. */
  var OLD_CAMPAIGNS = {
    '271': '297',                               /* Göteborgsvarvet 2026 -> Utmaning */
    '208': null                                 /* blandade egna insamlingar, se CARD_CONCEPT */
  };
  var CARD_CONCEPT = {
    '3ff11529a': '295',                         /* Natalie Aho, födelsedag */
    'ec96112da': '295',                         /* Erik Stål, "65kr" */
    '206114f03': '297',                         /* Kadir Meral, Göteborgsvarvet */
    '576717f5c': '297',                         /* Louisa Adde, Inverness Half Marathon */
    '3d3e17f60': '297',                         /* Louisa Adde, Inverness Half Marathon */
    'ad1f13e1b': '297',                         /* Johan & Filiph, Vätternrundan */
    '00c81090b': '299',                         /* Monica Rosén */
    'f23a128a2': '299',                         /* Nathalie Alriksson */
    '9f9510919': '299',                         /* Anna Olsheimer, Fuck Sarkom */
    '11e1133db': '299',                         /* Monika */
    'f2971389b': '299'                          /* Vera Mannheimer */
  };
  /* Historiskt insamlat på BetterNow (egen-insamling.ungcancer.se) per
     koncept, en fast botten på konceptkorten och i totalen. Adoveos egna
     belopp läggs ovanpå. Genomgång 2026-11-27 av alla 77 insamlingar
     (1 612 021 kr) efter vad insamlaren gjorde; därtill 174 684 kr i
     gåvor direkt till projektet "Ung Cancers allmänna arbete", lagda på
     Pepp. Summa 1 786 705 kr = BetterNows egen total. Lista per
     insamling: adoveo/betternow-historik.md */
  var HISTORY = {
    '295': 150500,                              /* Födelsedag, 10 insamlingar */
    '297': 596423,                              /* Utmaning, 33 insamlingar */
    '298': 684541,                              /* Till minne, 20 insamlingar */
    '299': 355241                               /* Pepp, 14 insamlingar + direktgåvor 174 684 */
  };
  var HIDE_CARDS = [
    '0b9b1863a', '1e1811149', 'c25910f28',      /* Marika, Martin, Håkan: annat ändamål */
    'b24016774', '438516770',                   /* Pepp: Catch all test, Daniel test (syns inte i admin) */
    '134916773',                                /* Utmaning: Team Test (syns inte i admin) */
    'a7a916772'                                 /* Till minne: Test Testsson (syns inte i admin) */
  ];
  function hiddenCard(code) { return HIDE_CARDS.indexOf(code) !== -1; }
  /* Konceptet för en sida eller ett kort: kampanjens egen, annars via de äldre kampanjerna */
  function conceptIdOf(camp, code) {
    if (byId(camp)) return camp;
    if (code && CARD_CONCEPT[code]) return CARD_CONCEPT[code];
    return OLD_CAMPAIGNS[camp] || null;
  }
  var MAX_HITS    = 6;                         /* kort i sökpanelen, resten via "Visa alla" */

  var root = document.documentElement;
  var STATES = { 'uc-meny': 'uc-nav-open', 'uc-sok': 'uc-search-open' };
  var lastTrigger = null;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function anyOpen() { return root.classList.contains('uc-nav-open') || root.classList.contains('uc-search-open'); }

  function setOpen(id, on, refocus) {
    var panel = document.getElementById(id);
    if (!panel) return;
    if (on) { Object.keys(STATES).forEach(function (k) { root.classList.remove(STATES[k]); }); }
    root.classList.toggle(STATES[id], on);
    document.querySelectorAll('[aria-controls="' + id + '"]').forEach(function (t) {
      t.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    if (on) {
      /* Sök: fokus i fältet. Meny: fokus på panelen, så att ingen fokusram
         hamnar på krysset vid musklick (Tab går vidare till länkarna) */
      var f = panel.querySelector('.uc-search__input') || panel.querySelector('.uc-drawer__panel');
      if (f && !f.matches('input')) f.tabIndex = -1;
      if (f) setTimeout(function () { f.focus(); }, 50);
    } else if (refocus && lastTrigger) {
      lastTrigger.focus();
    }
  }
  function closeAll(refocus) {
    Object.keys(STATES).forEach(function (k) { if (root.classList.contains(STATES[k])) setOpen(k, false, refocus); });
  }

  /* ---------- Header + menypanel ---------- */
  /* Byggs direkt när scriptet körs (överst i body), så headern finns innan
     resten av sidan ritas — inget hopp. Läggs som barn till body. */
  function link(cls, item) {
    var a = el('a', cls, item.text);
    a.href = item.href;
    return a;
  }
  function list(cls, linkCls, items) {
    var ul = el('ul', cls);
    items.forEach(function (it) { var li = el('li'); li.appendChild(link(linkCls, it)); ul.appendChild(li); });
    return ul;
  }
  function icon(mod, controls, label) {
    var li = el('li');
    var a = el('a', 'uc-header__icon uc-header__icon--' + mod);
    a.href = '#' + controls;
    a.setAttribute('role', 'button');
    a.setAttribute('aria-controls', controls);
    a.setAttribute('aria-expanded', 'false');
    a.appendChild(el('span', 'uc-sr', label));
    li.appendChild(a);
    return li;
  }
  function buildHeader() {
    if (document.querySelector('.uc-header')) return;
    var header = el('header', 'uc-header');
    var inner = el('div', 'uc-header__inner');
    var logo = el('a', 'uc-header__logo');
    logo.href = SUMMARY_URL;
    logo.appendChild(el('span', 'uc-sr', 'Ung Cancer'));
    var nav = el('nav', 'uc-header__menu');
    nav.setAttribute('aria-label', 'Huvudmeny');
    nav.appendChild(list('uc-header__list', 'uc-header__link', MENU_MAIN));
    var actions = el('ul', 'uc-header__actions');
    actions.appendChild(icon('menu', 'uc-meny', 'Meny'));
    actions.appendChild(icon('search', 'uc-sok', 'Sök insamling'));
    inner.appendChild(logo); inner.appendChild(nav); inner.appendChild(actions);
    header.appendChild(inner);

    var drawer = el('div', 'uc-drawer');
    drawer.id = 'uc-meny';
    var back = el('a', 'uc-drawer__backdrop'); back.href = '#'; back.tabIndex = -1; back.setAttribute('aria-hidden', 'true');
    var panel = el('div', 'uc-drawer__panel');
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', 'Meny');
    var close = el('a', 'uc-drawer__close'); close.href = '#'; close.setAttribute('role', 'button');
    close.appendChild(el('span', 'uc-sr', 'Stäng meny'));
    var dnav = el('nav');
    dnav.setAttribute('aria-label', 'Meny');
    dnav.appendChild(list('uc-drawer__list', 'uc-drawer__link', MENU_MAIN));
    dnav.appendChild(list('uc-drawer__list uc-drawer__list--sub', 'uc-drawer__link', MENU_MORE));
    panel.appendChild(close); panel.appendChild(dnav);
    drawer.appendChild(back); drawer.appendChild(panel);

    var body = document.body;
    body.insertBefore(drawer, body.firstChild);
    body.insertBefore(header, body.firstChild);
  }
  /* Formerna läggs i en osynlig SVG överst i body. Finns en form redan
     (gammal SVG i Head Markup) används den. Klassen uc-shape på html slår
     på --uc-clip i CSS:en först när formen garanterat finns. */
  function buildShapes() {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = null;
    Object.keys(SHAPES).forEach(function (id) {
      if (document.getElementById(id)) return;
      if (!svg) {
        svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        svg.style.position = 'absolute';
        svg.appendChild(document.createElementNS(NS, 'defs'));
      }
      var cp = document.createElementNS(NS, 'clipPath');
      cp.setAttribute('id', id);
      cp.setAttribute('clipPathUnits', 'objectBoundingBox');
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', SHAPES[id]);
      cp.appendChild(path);
      svg.firstChild.appendChild(cp);
    });
    if (svg) document.body.insertBefore(svg, document.body.firstChild);
    root.classList.add('uc-shape');
  }

  /* Konceptfärgen väljs i Adoveo admin och hamnar som bakgrund på
     wrappern. Här läses den av, och text- och detaljfärger anpassas:
     mörk yta -> krämvit text och ljus platta bakom logotyperna. */
  function conceptColors() {
    var w = document.querySelector('#phase-before-coupon .wrapper, #phase-after-coupon .wrapper, #phase-swish-result .wrapper');
    if (!w) return;
    /* Adoveo har en transition på wrappern: stäng av den medan färgen
       läses, annars kan ett mellanläge läsas av */
    var t = w.style.transition;
    w.style.transition = 'none';
    /* Äldre kampanj (OLD_CAMPAIGNS): konceptets färg i stället för adminens */
    var camp = (document.getElementById('campaign-id') || {}).value;
    var oc = camp && !byId(camp) ? byId(conceptIdOf(camp, p2pCode(location.pathname))) : null;
    if (oc) w.style.setProperty('background-color', oc.bg, 'important');
    var m = getComputedStyle(w).backgroundColor.match(/[\d.]+/g);
    w.style.transition = t;
    if (!m) return;
    var alpha = m.length === 4 ? +m[3] : 1;
    if (alpha === 0) return;                    /* genomskinlig: låt standard gälla */
    var lin = function (c) { c = c / 255; return c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92; };
    var L = 0.2126 * lin(+m[0]) + 0.7152 * lin(+m[1]) + 0.0722 * lin(+m[2]);
    var dark = L !== Math.max(L, 0.18);          /* L under 0.18 = mörk yta */
    root.style.setProperty('--uc-concept-bg', 'rgb(' + m[0] + ',' + m[1] + ',' + m[2] + ')');
    root.style.setProperty('--uc-concept-ink', dark ? 'var(--uc-cream)' : 'var(--uc-black)');
    root.style.setProperty('--uc-concept-logo-bg', dark ? 'var(--uc-cream)' : 'transparent');
    root.classList.toggle('uc-dark', dark);     /* mörk yta (Till minne): knapparna i kontur, CSS 9.0b */
    root.classList.add('uc-skew');               /* färgen är läst: ytan kan ritas med skev kant (CSS 9.0) */
  }

  /* En gammal header i Campaign Head (från tiden före repot) tas bort */
  function removeOldHeaders() {
    var all = document.querySelectorAll('.uc-header');
    for (var i = 1; i !== all.length && all.length; i++) {
      var old = all[i], box = old.parentElement;
      old.remove();
      if (box && box !== document.body && !box.children.length) box.remove();
    }
    var drawers = document.querySelectorAll('#uc-meny');
    for (var j = 1; j !== drawers.length && drawers.length; j++) drawers[j].remove();
  }

  /* ---------- Klick & tangentbord (delegerat) ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a, button') : null;
    if (!a) return;
    var target = a.getAttribute('aria-controls');
    if (target && STATES[target] && document.getElementById(target)) {
      e.preventDefault(); lastTrigger = a; setOpen(target, true); return;
    }
    if (a.matches('.uc-drawer__close, .uc-drawer__backdrop')) { e.preventDefault(); closeAll(true); return; }
    if (a.closest('.uc-drawer') && a.tagName === 'A') closeAll(false);   /* länk i panel: stäng, låt länken gå */
    /* Ankarlänk till den här sidan: scrolla själva, med rätt avstånd */
    if (a.tagName === 'A' && a.hash) {
      var u = new URL(a.href, location.href);
      var t = document.getElementById(decodeURIComponent(u.hash.slice(1)));
      if (t && u.host === location.host && path(u.pathname) === path(location.pathname)) {
        e.preventDefault();
        history.pushState(null, '', u.hash);
        scrollToAnchor(t, true);
      }
    }
  });

  /* ---------- Ankare ---------- */
  /* Avståndet styrs i CSS med scroll-margin-top (standard: --uc-anchor-offset).
     Scrollar man uppåt syns headern, så då läggs dess höjd till. */
  function scrollToAnchor(t, smooth) {
    var bar = document.querySelector('.uc-header');
    if (bar && bar.parentElement !== document.body) bar = bar.parentElement;
    var margin = parseFloat(getComputedStyle(t).scrollMarginTop) || 0;
    var top = t.getBoundingClientRect().top + window.scrollY - margin;
    if (bar && top - window.scrollY !== Math.abs(top - window.scrollY)) top -= bar.offsetHeight;   /* uppåt */
    window.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'auto' });
  }
  /* "Så funkar det" -> "sa-funkar-det" */
  function slug(text) {
    return text.toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/é/g, 'e')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  /* Varje rubrik (h1–h3) i sidans sektioner får ett ankare av sin text, om
     den inte redan har ett id. Skriv id själv i fältet för att styra det. */
  function makeAnchors() {
    document.querySelectorAll('.p2p-main .cc-section :is(h1, h2, h3)').forEach(function (h) {
      if (h.id) return;
      var id = slug(h.textContent);
      if (id && !document.getElementById(id)) h.id = id;
    });
    /* Konceptkorten har ingen rubrik: ankra sektionen (heroknappen går dit) */
    var cards = document.querySelector('.p2p-main .campaignsDisplay .cc-card');
    var cardSec = cards ? cards.closest('.cc-section') : null;
    if (cardSec && !cardSec.id && !document.getElementById('valj-koncept')) cardSec.id = 'valj-koncept';
    /* Listan Pågående insamlingar har ingen rubrik-tagg: ankra sektionen */
    var list = document.querySelector('.fundraisersWrapper');
    var sec = list ? list.closest('.cc-section') : null;
    if (sec && !document.getElementById('pagaende-insamlingar')) sec.id = 'pagaende-insamlingar';
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && anyOpen()) closeAll(true);
  });

  /* ---------- Sök ---------- */
  /* Bara 294 räknas: infosidan (308) är också en Summary med en egen lista */
  /* Adressen med och utan snedstreck på slutet är samma sida
     (/start/294 och /start/294/ visar båda Summary) */
  function path(p) { return String(p).replace(/\/+$/, ''); }
  function onSummary() {
    return path(location.pathname) === '/start/' + SUMMARY_ID && !!document.querySelector('#searchInput');
  }

  function showAll(q) {
    if (onSummary()) {
      var inp = document.querySelector('#searchInput');
      inp.value = q;
      var btn = document.querySelector('#searchBtn');
      if (btn) btn.click();
      closeAll(false);
      var list = document.getElementById('pagaende-insamlingar');
      if (list) scrollToAnchor(list, true);
    } else {
      location.href = SUMMARY_URL + '?sok=' + encodeURIComponent(q) + '#pagaende-insamlingar';
    }
  }

  /* Adoveo blandar ihop svaren om två frågor till /getP2PCards m.fl.
     körs samtidigt (se loadConcepts). Alla våra frågor går därför i
     samma kö, en i taget. */
  var adoveoLine = Promise.resolve();
  function inLine(job) {
    var p = adoveoLine.then(job);
    adoveoLine = p.catch(function () { /* nästa fråga får köra ändå */ });
    return p;
  }

  /* Adoveo minns i sessionen det senaste filtret till /getP2PCards och
     ritar sedan Summary-sidans lista "Pågående insamlingar" efter det.
     En fråga per koncept (t.ex. summan på en Pepp-insamling) gav alltså
     bara Pepp-insamlingar, i fel ordning, när man backade till Summary.
     Varje filtrerad fråga följs därför av en ofiltrerad som återställer
     listan: alla koncept, i den ordning som Sort by i 294-admin anger. */
  function cardsByConcept(camp, single, fol) {
    var get = function (o) {
      return fetch('/getP2PCards?' + new URLSearchParams(o), { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
    };
    return inLine(function () {
      return get({ offset: 0, limit: 1000, campaign_id: camp, single_campaign_id: single, folder: fol })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          return get({ offset: 0, limit: 1, campaign_id: camp, folder: fol })
            .then(function () { return j; }, function () { return j; });
        });
    });
  }

  function fetchHits(q) {
    /* Vänta in konceptfrågorna om de pågår: Adoveo tål inte samtidiga frågor */
    var wait = conceptBusy && conceptMap ? conceptMap : Promise.resolve();
    return wait.then(function () { return searchNow(q); });
  }
  function searchNow(q) {
    var fol = document.querySelector('#folder');
    var body = new URLSearchParams({
      search_name: q,
      campaign_id: SUMMARY_ID,                 /* alltid 294, oavsett sida */
      folder: (fol && fol.value) || folderName()
    });
    return inLine(function () {
      return fetch('/searchP2PCardsData', {
        method: 'POST', body: body, headers: { 'X-Requested-With': 'XMLHttpRequest' }
      }).then(function (r) { return r.json(); });
    }).then(function (j) {
      var doc = new DOMParser().parseFromString((j && j.html) || '', 'text/html');
      return Array.prototype.map.call(doc.querySelectorAll('.cc-card'), function (c) {
        var link = c.querySelector('a');
        var img = c.querySelector('img');
        var sums = c.querySelectorAll('span.cc-title');
        return {
          name: ((c.querySelector('p.cc-title') || {}).textContent || '').trim(),
          img: img ? img.getAttribute('src') : '',
          sum: sums.length ? sums[sums.length - 1].textContent.trim() : '',
          href: link ? link.getAttribute('href').replace(/^http:/, 'https:') : '#'
        };
      });
    });
  }

  function renderHits(box, q, hits) {
    box.textContent = '';
    if (!hits.length) {
      box.appendChild(el('p', 'uc-search__empty', 'Ingen insamling matchar "' + q + '". Prova förnamnet eller kolla stavningen.'));
      return;
    }
    box.appendChild(el('p', 'uc-search__label', 'Alla insamlingar'));
    var grid = el('ul', 'uc-search__grid');
    hits.filter(function (h) { return !hiddenCard(p2pCode(h.href)); }).slice(0, MAX_HITS).forEach(function (h) {
      var li = el('li');
      var a = el('a', 'uc-search__card');
      a.href = h.href;
      var fig = el('span', 'uc-search__img');
      if (h.img) { var im = el('img'); im.src = h.img; im.alt = ''; im.loading = 'lazy'; fig.appendChild(im); }
      a.appendChild(fig);
      a.appendChild(el('span', 'uc-search__name', h.name));
      if (h.sum) a.appendChild(el('span', 'uc-search__sum', h.sum + ' insamlat'));
      li.appendChild(a);
      grid.appendChild(li);
    });
    box.appendChild(grid);
    var all = el('button', 'uc-search__all', 'Visa alla resultat för "' + q + '"');
    all.type = 'button';
    all.addEventListener('click', function () { showAll(q); });
    box.appendChild(all);
  }

  function buildSearch() {
    if (document.getElementById('uc-sok')) return;
    var drawer = el('div', 'uc-drawer uc-drawer--search');
    drawer.id = 'uc-sok';
    var back = el('a', 'uc-drawer__backdrop'); back.href = '#'; back.tabIndex = -1; back.setAttribute('aria-hidden', 'true');
    var panel = el('div', 'uc-drawer__panel');
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', 'Sök insamling');
    var title = el('p', 'uc-search__title', 'Sök');
    var close = el('a', 'uc-drawer__close'); close.href = '#'; close.setAttribute('role', 'button');
    close.appendChild(el('span', 'uc-sr', 'Stäng sök'));
    var form = el('form', 'uc-search__form'); form.setAttribute('role', 'search');
    var label = el('label', 'uc-sr', 'Sök insamling'); label.htmlFor = 'uc-sok-falt';
    var input = el('input', 'uc-search__input');
    input.id = 'uc-sok-falt'; input.type = 'search'; input.autocomplete = 'off';
    input.placeholder = 'Sök på namn eller insamling';
    var submit = el('button', 'uc-search__submit'); submit.type = 'submit';
    submit.appendChild(el('span', 'uc-sr', 'Sök'));
    form.appendChild(label); form.appendChild(input); form.appendChild(submit);
    var results = el('div', 'uc-search__results'); results.setAttribute('aria-live', 'polite');
    panel.appendChild(title); panel.appendChild(close); panel.appendChild(form); panel.appendChild(results);
    drawer.appendChild(back); drawer.appendChild(panel);
    document.body.appendChild(drawer);

    var timer = null, seq = 0;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      var q = input.value.trim();
      if (q.length === 0 || q.length === 1) { results.textContent = ''; return; }
      timer = setTimeout(function () {
        var mine = ++seq;
        fetchHits(q).then(function (hits) { if (mine === seq) renderHits(results, q, hits); })
          .catch(function () { if (mine === seq) { results.textContent = ''; results.appendChild(el('p', 'uc-search__empty', 'Sökningen fungerar inte just nu. Försök igen om en stund.')); } });
      }, 250);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (q) showAll(q);
    });
  }

  /* ---------- Insamlingskorten (Pågående insamlingar) ---------- */
  /* Plattformens kort byggs om till samma uppställning som artikelkorten
     på ungcancer.se: bild överst, textruta under, etikett med konceptet i
     hörnet. Hela kortet är en länk som öppnas i samma fönster. Gäller både
     listan och plattformens sökresultat, även kort som laddas med "Se fler". */
  function p2pCode(href) {
    var m = String(href || '').match(/\/p\/([^\/?#]+)/);
    return m ? m[1] : '';
  }
  /* Vilket koncept hör insamlingen till? Plattformen säger det inte på
     kortet, så listan hämtas en gång per koncept och kopplas på länken.
     VIKTIGT: frågorna måste gå EN I TAGET. Adoveo blandar ihop svaren om
     två frågor körs samtidigt (testat 2026-10-23). Därför hålls också
     klick på "Se fler" och "Sök" kvar tills frågorna är klara, och
     resultatet sparas i 10 minuter så att det inte hämtas vid varje sidbyte. */
  var conceptMap = null, conceptBusy = false, heldClick = null;
  var conceptExtra = {};                        /* koncept-id -> kronor från äldre kampanjer */
  var CONCEPT_CACHE = 'uc-koncept', CONCEPT_TTL = 10 * 60 * 1000;
  function byId(id) {
    return MENU_MAIN.filter(function (c) { return c.id === id; })[0] || null;
  }
  function loadConcepts() {
    if (conceptMap) return conceptMap;
    try {
      var saved = JSON.parse(sessionStorage.getItem(CONCEPT_CACHE) || 'null');
      var age = saved ? Date.now() - saved.t : -1;
      if (saved && age >= 0 && CONCEPT_TTL >= age) {
        var m0 = {};
        Object.keys(saved.m).forEach(function (k) { var c = byId(saved.m[k]); if (c) m0[k] = c; });
        conceptExtra = saved.x || {};
        return (conceptMap = Promise.resolve(m0));
      }
    } catch (e) { /* ingen sessionStorage: hämta */ }
    var camp = (document.querySelector('#campaignId') || {}).value || SUMMARY_ID;
    var fol = (document.querySelector('#folder') || {}).value || folderName();
    var map = {}, ids = {}, extra = {};
    conceptBusy = true;
    /* De äldre kampanjerna: korten kopplas till sitt koncept och beloppen
       läggs till konceptets summa */
    var old = Object.keys(OLD_CAMPAIGNS).map(function (oid) {
      return function () {
        return cardsByConcept(camp, oid, fol).then(function (j) {
          var doc = new DOMParser().parseFromString((j && j.html) || '', 'text/html');
          doc.querySelectorAll('.cc-card').forEach(function (card) {
            var a = card.querySelector('a[href]');
            var k = a ? p2pCode(a.getAttribute('href')) : '';
            var c = k ? byId(conceptIdOf(oid, k)) : null;
            if (!c) return;
            map[k] = c; ids[k] = c.id;
            var sums = card.querySelectorAll('span.cc-title');
            if (sums.length) extra[c.id] = (extra[c.id] || 0) + amountOf(sums[sums.length - 1].textContent);
          });
        }).catch(function () { /* utan svar: korten får ingen etikett */ });
      };
    });
    conceptMap = MENU_MAIN.reduce(function (prev, c) {
      return prev.then(function () {
        return cardsByConcept(camp, c.id, fol)
          .then(function (j) {
            var doc = new DOMParser().parseFromString((j && j.html) || '', 'text/html');
            doc.querySelectorAll('.cc-card a[href]').forEach(function (a) {
              var k = p2pCode(a.getAttribute('href'));
              if (k) { map[k] = c; ids[k] = c.id; }
            });
          })
          .catch(function () { /* ett koncept utan svar: korten får ingen etikett */ });
      });
    }, Promise.resolve()).then(function () {
      return old.reduce(function (prev, f) { return prev.then(f); }, Promise.resolve());
    }).then(function () {
      conceptBusy = false;
      conceptExtra = extra;
      try { sessionStorage.setItem(CONCEPT_CACHE, JSON.stringify({ t: Date.now(), m: ids, x: extra })); } catch (e) { /* ok */ }
      if (heldClick) { var b = heldClick; heldClick = null; b.click(); }
      return map;
    });
    return conceptMap;
  }
  document.addEventListener('click', function (e) {
    if (!conceptBusy) return;
    var b = e.target.closest ? e.target.closest('#viewMoreBtn, #searchBtn') : null;
    if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation(); heldClick = b;
  }, true);
  document.addEventListener('keypress', function (e) {
    if (!conceptBusy || e.key !== 'Enter' || !e.target.matches || !e.target.matches('#searchInput')) return;
    e.preventDefault(); e.stopImmediatePropagation(); heldClick = document.getElementById('searchBtn');
  }, true);
  /* Texten får så många rader som ryms i rutan och slutar med ... */
  function clampText(card) {
    var t = card.querySelector('.uc-fcard__text');
    if (!t) return;
    t.style.removeProperty('-webkit-line-clamp');
    t.style.removeProperty('max-height');
    var lh = parseFloat(getComputedStyle(t).lineHeight) || 24;
    var n = Math.max(1, Math.floor((t.clientHeight + 2) / lh));
    t.style.setProperty('-webkit-line-clamp', String(n));
    t.style.setProperty('max-height', (n * lh) + 'px');   /* annars syns en halv rad under ... */
  }
  /* Räkna om när kortet byter storlek (fönsterbredd, sökresultat som
     visas, typsnitt som laddas). Kortet har fast format, så omräkningen
     ändrar inte kortets storlek och ger ingen loop. */
  var cardResize = window.ResizeObserver
    ? new ResizeObserver(function (entries) { entries.forEach(function (en) { clampText(en.target); }); })
    : null;
  function conceptLabel(card, map) {
    if (!map || card.querySelector('.uc-fcard__label')) return;
    var a = card.querySelector('.uc-fcard__link');
    var c = a ? map[p2pCode(a.getAttribute('href'))] : null;
    if (!c) return;
    card.style.setProperty('--uc-card-bg', c.bg);      /* textrutan och etiketten */
    card.style.setProperty('--uc-card-ink', c.ink);
    card.appendChild(el('span', 'uc-fcard__label', c.text));
  }
  function upgradeCard(card, map) {
    if (card.classList.contains('uc-fcard')) { conceptLabel(card, map); return; }
    var a = card.querySelector('a[href]');
    if (a && hiddenCard(p2pCode(a.getAttribute('href')))) {
      card.style.setProperty('display', 'none', 'important');
      return;
    }
    var title = card.querySelector('p.cc-title');
    if (!a || !title) return;
    var img = card.querySelector('img');
    var txt = card.querySelector('p.cc-txt');
    var sums = card.querySelectorAll('span.cc-title');
    var sum = sums.length ? sums[sums.length - 1].textContent.trim() : '';
    if (/\d/.test(sum)) sum = kr(amountOf(sum));          /* "10000 kr" -> "10 000 kr" */
    var name = title.textContent.trim();

    var link = el('a', 'uc-fcard__link');
    link.href = a.getAttribute('href').replace(/^http:/, 'https:');   /* samma fönster: inget target */
    link.setAttribute('aria-label', name + (sum ? ', ' + sum + ' insamlat' : ''));
    var media = el('div', 'uc-fcard__media');
    if (img) { img.removeAttribute('style'); img.alt = ''; img.loading = 'lazy'; media.appendChild(img); }
    var body = el('div', 'uc-fcard__body');
    body.appendChild(el('h3', 'uc-fcard__title', name));
    if (txt && txt.textContent.trim()) body.appendChild(el('p', 'uc-fcard__text', txt.textContent.trim()));
    if (sum) {
      var s = el('p', 'uc-fcard__sum');
      s.appendChild(el('strong', null, sum));
      s.appendChild(document.createTextNode(' insamlat'));
      body.appendChild(s);
    }
    card.textContent = '';
    card.classList.add('uc-fcard');
    card.appendChild(link); card.appendChild(media); card.appendChild(body);
    conceptLabel(card, map);
    clampText(card);
    if (cardResize) cardResize.observe(card);
  }
  function fundraiserCards() {
    var boxes = document.querySelectorAll('#fundraisersDisplay, #searchDisplay');
    if (!boxes.length) return;
    var map = null, fresh = false;
    var run = function () {
      var unknown = false;
      boxes.forEach(function (b) {
        b.querySelectorAll('.cc-card').forEach(function (c) {
          upgradeCard(c, map);
          var a = c.querySelector('.uc-fcard__link');
          if (map && a && !map[p2pCode(a.getAttribute('href'))]) unknown = true;   /* dolda kort har ingen .uc-fcard__link */
        });
      });
      /* En insamling som startats efter att konceptlistan sparades (10 min)
         saknas i den: hämta om listan en gång, så får kortet sin etikett */
      if (unknown && !fresh) {
        fresh = true;
        try { sessionStorage.removeItem(CONCEPT_CACHE); } catch (e) { /* ok */ }
        conceptMap = null;
        loadConcepts().then(function (m) { map = m; run(); });
      }
    };
    run();
    loadConcepts().then(function (m) { map = m; run(); addOldSums(); });
    var mo = new MutationObserver(run);                  /* "Se fler" och sökresultat */
    boxes.forEach(function (b) { mo.observe(b, { childList: true }); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () {
      document.querySelectorAll('.uc-fcard').forEach(clampText);
    });
  }

  /* ---------- Pågående insamlingar på konceptets startsida ---------- */
  /* Skapa-sidan (/start/295/ osv.) har ingen egen lista. Här byggs en med
     samma kort och rutnät som på Summary, men bara konceptets insamlingar
     och utan sökruta. Ordningen är Summarys (Sort by i 294-admin). Tre i
     taget, som på Summary.
     Inga insamlingar = ingen rubrik. */
  var LIST_TEXT = { title: 'Alla insamlingar', more: 'Se fler' };
  var LIST_STEP = 3;
  function conceptList() {
    var m = location.pathname.match(/\/start\/(\d+)/);
    var c = m ? byId(m[1]) : null;
    if (!c || !document.getElementById('phase-before-coupon') || document.querySelector('.uc-fundlist')) return;
    var mine = {}, cards = [];
    var collect = function (j, oid) {
      var doc = new DOMParser().parseFromString((j && j.html) || '', 'text/html');
      doc.querySelectorAll('.cc-card a[href]').forEach(function (a) {
        var k = p2pCode(a.getAttribute('href'));
        if (!k || hiddenCard(k)) return;
        if (oid && conceptIdOf(oid, k) !== c.id) return;
        mine[k] = true;
      });
    };
    /* Vilka insamlingar hör till konceptet: konceptets egna och de äldre
       kampanjernas som räknas dit. Sedan hela listan ofiltrerad, i
       Summarys ordning, och bara konceptets kort behålls. */
    var olds = Object.keys(OLD_CAMPAIGNS).filter(function (oid) {
      return OLD_CAMPAIGNS[oid] === c.id || OLD_CAMPAIGNS[oid] === null;   /* null: korten väljs ett och ett i collect */
    });
    olds.reduce(function (prev, oid) {
      return prev.then(function () {
        return cardsByConcept(SUMMARY_ID, oid, folderName()).then(function (j) { collect(j, oid); }, function () {});
      });
    }, cardsByConcept(SUMMARY_ID, c.id, folderName()).then(function (j) { collect(j, null); })).then(function () {
      return inLine(function () {
        return fetch('/getP2PCards?' + new URLSearchParams({ offset: 0, limit: 1000, campaign_id: SUMMARY_ID, folder: folderName() }),
          { headers: { 'X-Requested-With': 'XMLHttpRequest' } }).then(function (r) { return r.json(); });
      });
    }).then(function (j) {
      var doc = new DOMParser().parseFromString((j && j.html) || '', 'text/html');
      doc.querySelectorAll('.cc-card').forEach(function (card) {
        var a = card.querySelector('a[href]');
        if (a && mine[p2pCode(a.getAttribute('href'))]) cards.push(card);
      });
      if (!cards.length) return;
      var map = {};
      cards.forEach(function (card) {
        var a = card.querySelector('a[href]');
        var k = a ? p2pCode(a.getAttribute('href')) : '';
        if (k) map[k] = c;
      });
      var sec = el('section', 'uc-fundlist');
      sec.id = 'pagaende-insamlingar';
      sec.appendChild(el('h2', 'uc-fundlist__title', LIST_TEXT.title));
      var grid = el('div', 'uc-fundlist__grid');
      sec.appendChild(grid);
      var more = el('button', 'cc-button cc-btn-third uc-fundlist__more', LIST_TEXT.more);
      more.type = 'button';
      sec.appendChild(more);
      var shown = 0;
      var next = function () {
        cards.slice(shown, shown + LIST_STEP).forEach(function (card) {
          var mine = document.importNode(card, true);
          grid.appendChild(mine);
          upgradeCard(mine, map);               /* efter insättning: texten räknas i rutan */
        });
        shown = Math.min(cards.length, shown + LIST_STEP);
        more.hidden = shown === cards.length;
      };
      more.addEventListener('click', next);
      var foot = document.querySelector('.uc-footer');
      if (foot && foot.parentNode) foot.parentNode.insertBefore(sec, foot);
      else document.body.appendChild(sec);
      next();
    }).catch(function () { /* ingen lista: sidan fungerar ändå */ });
  }

  /* ---------- Summary-heron: hjärtat till vänster, rubriken till höger ---------- */
  /* Första sektionen på Summary (rubrik + ingress från admin) blir en hero
     på rosa yta. Hjärtat (src/assets/hjarta.svg) ritas upp bubbla för
     bubbla; animationen ligger i själva SVG-filen. Bara på 294. */
  function buildHero() {
    if (!onSummary() || document.querySelector('.uc-hero')) return;
    var h1 = document.getElementById('page-title');
    var sec = h1 ? h1.closest('.cc-section') : null;
    if (!sec) return;
    sec.classList.add('uc-hero');
    var art = el('div', 'uc-hero__art');
    var img = el('img');
    img.src = ASSETS + 'hjarta.svg';
    img.alt = '';                               /* dekor: rubriken bär budskapet */
    img.width = 672; img.height = 657;            /* hjarta.svg med luft runt om (se CSS 14.2) */
    art.appendChild(img);
    /* Allt som står i admin-fältet (rubriken och det som följer, oavsett
       taggar: p, blockquote, div ...) samlas i textspalten, i sin ordning.
       Admins avdelare (.divider) lämnas utanför. */
    var text = el('div', 'uc-hero__text');
    var parts = Array.prototype.filter.call(sec.children, function (c) {
      return !c.classList.contains('divider') && !/^(SCRIPT|STYLE|INPUT)$/.test(c.tagName);
    });
    parts.forEach(function (c) { text.appendChild(c); });
    var cta = el('a', 'cc-button uc-hero__cta', HERO_CTA.text);
    cta.href = HERO_CTA.href;
    text.appendChild(cta);
    sec.insertBefore(text, sec.firstChild);
    sec.insertBefore(art, text);
    fitTitle(h1);
  }

  /* ---------- Belopp: samma format överallt ---------- */
  /* Adoveo skriver belopp utan tusentalsavgränsare ("10000 kr"). Här
     läses beloppet ut (heltalsdelen) och skrivs som "10 000 kr". */
  function amountOf(text) {
    var m = String(text || '').replace(/[\s\u00a0\u202f]/g, '').match(/\d+/);
    return m ? parseInt(m[0], 10) : 0;
  }
  function kr(n) {
    return Math.round(n).toLocaleString('sv-SE') + ' kr';
  }
  /* Konceptkorten på Summary får sitt koncepts färg (bg/ink i MENU_MAIN).
     Konceptet avgörs av kortets länk: /start/295/ -> Födelsedag. Kort som
     länkar till något annat behåller den krämvita standardfärgen. */
  function conceptCards() {
    document.querySelectorAll('.p2p-main .campaignsDisplay .cc-card').forEach(function (card) {
      var a = card.querySelector('a[href]');
      var m = a ? a.getAttribute('href').match(/\/start\/(\d+)/) : null;
      var c = m ? byId(m[1]) : null;
      if (!c) return;
      card.style.setProperty('--uc-card-bg', c.bg);
      card.style.setProperty('--uc-card-ink', c.ink);
      card.classList.add('uc-ccard');
    });
  }

  /* Konceptkorten på Summary ({29X total_collected} kr) */
  function formatPrices() {
    document.querySelectorAll('.p2p-main .campaignsDisplay .cc-card').forEach(function (card) {
      var p = card.querySelector('.cc-price');
      if (!p || !/\d/.test(p.textContent) || p.dataset.ucBase) return;
      var a = card.querySelector('a[href]');
      var m = a ? a.getAttribute('href').match(/\/start\/(\d+)/) : null;
      p.dataset.ucBase = String(amountOf(p.textContent));                 /* Adoveos belopp */
      p.dataset.ucHistory = String((m && HISTORY[m[1]]) || 0);            /* BetterNow-botten */
      p.textContent = kr(+p.dataset.ucBase + (+p.dataset.ucHistory));
    });
  }
  /* Pengarna från de äldre kampanjerna (OLD_CAMPAIGNS) läggs på
     konceptkortens belopp, och totalen räknas om */
  function addOldSums() {
    var changed = false;
    document.querySelectorAll('.p2p-main .campaignsDisplay .cc-card').forEach(function (card) {
      var a = card.querySelector('a[href]');
      var m = a ? a.getAttribute('href').match(/\/start\/(\d+)/) : null;
      var p = card.querySelector('.cc-price');
      if (!m || !p || !p.dataset.ucBase) return;
      var sum = (+p.dataset.ucBase) + (+p.dataset.ucHistory || 0) + (conceptExtra[m[1]] || 0);
      if (p.textContent !== kr(sum)) { p.textContent = kr(sum); changed = true; }
    });
    var t = document.querySelector('.uc-total__sum');
    if (!t || !changed) return;
    var total = 0;
    document.querySelectorAll('.p2p-main .campaignsDisplay .cc-price').forEach(function (p) { total += amountOf(p.textContent); });
    t.textContent = kr(total);
  }

  /* ---------- Tillsammans har vi samlat in ---------- */
  /* Summan av alla koncept, under heron. Beloppen tas från konceptkorten
     ({29X total_collected} i admin), så summan följer korten. */
  var TOTAL_TEXT = { before: 'Tillsammans har vi samlat in', after: 'till unga vuxna som möter cancer' };
  function buildTotal() {
    var hero = document.querySelector('.uc-hero');
    var prices = document.querySelectorAll('.p2p-main .campaignsDisplay .cc-price');
    if (!hero || !prices.length || document.querySelector('.uc-total')) return;
    var total = 0;
    prices.forEach(function (p) { total += amountOf(p.textContent); });
    var box = el('div', 'uc-total');
    box.appendChild(el('p', 'uc-total__hand', TOTAL_TEXT.before));
    var sum = el('p', 'uc-total__sum', kr(total));
    box.appendChild(sum);
    box.appendChild(el('p', 'uc-total__hand', TOTAL_TEXT.after));
    /* Mellan konceptkorten och Pågående insamlingar; finns inte listan,
       direkt under heron som förut */
    var list = document.querySelector('.p2p-main .fundraisersWrapper');
    var sec = list ? list.closest('.cc-section') : null;
    if (sec && sec.parentNode === hero.parentNode) hero.parentNode.insertBefore(box, sec);
    else hero.parentNode.insertBefore(box, hero.nextSibling);
  }

  /* ---------- Steg 1–2–3 på konceptens startsida ---------- */
  /* Samma tre steg som "Så funkar det" på Summary. På skapa-sidan är
     Välj klart och Skapa pågår; efter skapad är Dela på tur. Bara det
     pågående steget är i full färg. Välj länkar tillbaka till Summary,
     där man väljer koncept. */
  var STEPS = ['Välj', 'Skapa', 'Dela'];
  function stepList(current) {
    var ol = el('ol', 'uc-progress');
    ol.setAttribute('aria-label', 'Så startar du en insamling');
    STEPS.forEach(function (text, i) {
      var n = i + 1;
      var state = current > n ? 'done' : (current === n ? 'current' : 'next');
      var li = el('li', 'uc-progress__step uc-progress__step--' + state);
      if (state === 'current') li.setAttribute('aria-current', 'step');
      var box = li;
      if (state === 'done' && n === 1) {
        box = el('a', 'uc-progress__link');
        box.href = SUMMARY_URL;
        li.appendChild(box);
      }
      var dot = el('span', 'uc-progress__dot', state === 'done' ? '' : String(n));
      if (state === 'done') dot.appendChild(el('span', 'uc-sr', 'Klart:'));
      box.appendChild(dot);
      box.appendChild(el('span', 'uc-progress__label', text));
      ol.appendChild(li);
    });
    return ol;
  }
  function conceptSteps() {
    [['coupon-heading', 2], ['after-coupon-heading', 3]].forEach(function (p) {
      var h = document.getElementById(p[0]);
      if (!h) return;
      var prev = h.previousElementSibling;
      if (prev && prev.classList.contains('uc-progress')) return;
      h.parentNode.insertBefore(stepList(p[1]), h);
    });
  }

  /* ---------- QR-koden på bekräftelsen ---------- */
  /* När insamlingen är skapad ger Adoveo en QR-kod till den (svaret
     campaign_qr_code), men visar den bara i en ruta bakom en knapp. Här
     ritas den ut direkt under dela-knapparna, med en knapp för att ladda
     ner den. Adoveo lägger in koden i #after-coupon-campaign-qr-img efter
     att formuläret skickats, så bilden bevakas tills den får en adress. */
  function inlineQr() {
    var img = document.getElementById('after-coupon-campaign-qr-img');
    var after = document.getElementById('after-coupon-share-text');
    if (!img || !after) return;
    var show = function () {
      var src = img.getAttribute('src');
      if (!src || document.querySelector('.uc-qr')) return;
      var box = el('div', 'uc-qr');
      box.appendChild(el('p', 'uc-qr__label', 'QR-kod till din insamling'));
      var im = el('img', 'uc-qr__img');
      im.src = src;
      im.alt = 'QR-kod som leder till din insamling';
      box.appendChild(im);
      var dl = el('a', 'cc-button uc-qr__download', 'Ladda ner QR-kod');
      dl.href = src;
      dl.setAttribute('download', 'ung-cancer-insamling-qr.png');
      box.appendChild(dl);
      after.parentNode.insertBefore(box, after.nextSibling);
      root.classList.add('uc-qr-inline');
    };
    show();
    new MutationObserver(show).observe(img, { attributes: true, attributeFilter: ['src'] });
  }

  /* ---------- Skapa-sidan: formulär till vänster, telefon till höger ---------- */
  /* Konceptets startsida (/start/ID/). Plattformen har redan en
     förhandsvisning av insamlingssidan (#giftcard-preview-container, öppnas
     med ögat) och fyller den medan man skriver. På bred skärm flyttas den
     ut ur formuläret och visas hela tiden som en telefon bredvid
     konceptets färgade yta, som i kampanj 300. Under brytpunkten flyttas den tillbaka
     och ögat fungerar som vanligt. */
  var CREATE_MQ = window.matchMedia ? window.matchMedia('(min-width: 1000px)') : null;
  function createLayout() {
    var phase = document.getElementById('phase-before-coupon');
    var box = document.getElementById('giftcard-preview-container');
    var heading = document.getElementById('coupon-heading');
    var wrap = heading ? heading.closest('.wrapper') : null;   /* konceptets färgade yta, bara bakom formuläret */
    if (!phase || !box || !wrap || !CREATE_MQ || document.querySelector('.uc-create__phone')) return;
    var home = box.parentElement, homeNext = box.nextSibling;
    /* Telefonen läggs bredvid ytan (inte i den), som i kampanj 300 */
    var phone = el('div', 'uc-create__phone');
    phone.setAttribute('aria-label', 'Så här blir din insamlingssida');
    wrap.parentNode.insertBefore(phone, wrap.nextSibling);

    var place = function () {
      var wide = CREATE_MQ.matches;
      root.classList.toggle('uc-create-split', wide);
      if (wide && box.parentElement !== phone) phone.appendChild(box);
      if (!wide && box.parentElement !== home) {
        home.insertBefore(box, homeNext && homeNext.parentNode === home ? homeNext : null);
      }
    };
    place();
    if (CREATE_MQ.addEventListener) CREATE_MQ.addEventListener('change', place);
    else if (CREATE_MQ.addListener) CREATE_MQ.addListener(place);
    /* Flyttar plattformen tillbaka rutan (t.ex. när popupen stängs) */
    new MutationObserver(function () {
      if (CREATE_MQ.matches && box.parentElement !== phone) phone.appendChild(box);
    }).observe(phase, { childList: true, subtree: true });

    /* Innan man skrivit något visar plattformen {your_name} och
       {description} rått. De byts mot fältens etiketter i spökskrift.
       Plattformen bygger om texten vid varje tangent, så det görs om
       varje gång texten ändras. */
    var msg = box.querySelector('#coupon-page-message');
    var label = function (id, fallback) {
      var l = document.getElementById(id);
      return (l && l.textContent.trim()) || fallback;
    };
    var GHOST = { your_name: label('name_label', 'Ditt namn'), description: label('custom_field_3_label', 'Din text') };
    /* Levnadsåren ([år:{custom_field_N}] i mallen) fylls inte av plattformen.
       Fältet läses av medan man skriver och visas under namnet, som på
       insamlingssidan. Tomt fält: fältets etikett i spökskrift. */
    var yearsField = null, yearsBox = null;
    var yearsText = function () {
      if (!yearsBox || !yearsField) return;
      var v = String(yearsField.value || '').replace(/\s*[-–—]\s*/g, '\u2013').replace(/\s+/g, ' ').trim();
      yearsBox.textContent = '';
      if (v) yearsBox.textContent = v;
      else yearsBox.appendChild(el('span', 'uc-ghost', label(yearsField.id + '_label', 'Levnadsår')));
    };
    var years = function (node) {
      var m = node.nodeValue.match(/\[\s*år\s*:\s*\{(custom_field_\d+)\}\s*\]/i);
      if (!m) return;
      yearsField = document.getElementById(m[1]);
      if (!yearsField) return;
      if (!yearsField.dataset.ucYears) {
        yearsField.dataset.ucYears = '1';
        yearsField.addEventListener('input', yearsText);
        yearsField.addEventListener('change', yearsText);
      }
      /* Före beskrivningens block (markören står i det), annars där markören stod */
      var host = node.parentNode !== msg ? node.parentNode : node;
      if (yearsBox && yearsBox.parentNode) yearsBox.parentNode.removeChild(yearsBox);
      yearsBox = el('span', 'uc-preview-years');
      host.parentNode.insertBefore(yearsBox, host);
      yearsText();
    };
    var ghost = function () {
      for (var round = 0; round !== 5; round++) {
        var w = document.createTreeWalker(msg, NodeFilter.SHOW_TEXT), t = null, m = null;
        while (w.nextNode()) {
          if (GOAL_ANY.test(w.currentNode.nodeValue)) w.currentNode.nodeValue = w.currentNode.nodeValue.replace(GOAL_ANY, '');
          if (YEARS_ANY.test(w.currentNode.nodeValue)) {
            years(w.currentNode);
            w.currentNode.nodeValue = w.currentNode.nodeValue.replace(YEARS_ANY, '');
          }
          m = w.currentNode.nodeValue.match(/\{(your_name|description)\}/);
          if (m) { t = w.currentNode; break; }
        }
        if (!t) return;
        var rest = t.splitText(m.index);
        rest.nodeValue = rest.nodeValue.slice(m[0].length);
        t.parentNode.insertBefore(el('span', 'uc-ghost', GHOST[m[1]]), rest);
      }
    };
    if (msg) {
      ghost();
      new MutationObserver(ghost).observe(msg, { childList: true, characterData: true, subtree: true });
      previewExtras(msg);
    }

    /* Bilden. Plattformen lägger aldrig in den valda bilden i
       förhandsvisningen, och den bygger om rubriken (med tom bild) varje
       gång något fält ändras. Därför sparas den valda bilden här och läggs
       tillbaka efter varje ombyggnad. Källan är filen man valt (visas
       direkt) och plattformens miniatyr bredvid Välj bild (efter uppladdning). */
    var title = box.querySelector('#coupon-page-title');
    var chosen = '';
    var applyImg = function () {
      var im = title ? title.querySelector('img') : null;
      if (chosen && im && im.getAttribute('src') !== chosen) im.setAttribute('src', chosen);
    };
    var file = document.getElementById('registration_file_upload');
    if (file) file.addEventListener('change', function () {
      uploadLabel(true);
      var f = file.files && file.files[0];
      if (f && /^image\//.test(f.type)) { chosen = URL.createObjectURL(f); applyImg(); }
    });
    var thumb = document.querySelector('#registration_file_upload_div .image-preview');
    if (thumb) new MutationObserver(function () {
      var src = thumb.getAttribute('src') || '';
      if (/^(https?:|data:image|blob:)/.test(src) && src !== location.href) { chosen = src; applyImg(); uploadLabel(true); }
    }).observe(thumb, { attributes: true, attributeFilter: ['src'] });

    /* Ingen bild än: plattformen ger bilden en tom eller trasig adress,
       som visas som en trasig bild. Då visas en platshållare i stället.
       Klassen sätts på html: plattformen skriver om klasserna på rubriken. */
    if (title) {
      var noImg = function () {
        var im = title.querySelector('img');
        var ok = !!im && !!im.getAttribute('src') && im.complete && im.naturalWidth > 0;
        root.classList.toggle('uc-noimg', !ok);
      };
      title.addEventListener('load', noImg, true);       /* load/error bubblar inte: fånga */
      title.addEventListener('error', noImg, true);
      new MutationObserver(function () { applyImg(); noImg(); })
        .observe(title, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
      noImg();
    }
  }

  /* Givarens tacksida: bakgrundsbilden som läggs in i admin hamnar bara i
     Adoveos mobilregel (@media max-width 812px). Samma bild och inställningar
     läggs då på sidan på alla skärmar, före vår standardbild (CSS 9.0). */
  function endBackground() {
    var body = document.body;
    if (!body.classList.contains('swish-landing')) return;
    var found = null;
    var scan = function (rules) {
      Array.prototype.forEach.call(rules || [], function (r) {
        if (found) return;
        if (r.cssRules && !r.selectorText) scan(r.cssRules);
        else if (r.selectorText && /body\.swish-landing/.test(r.selectorText) && /url\(/.test(r.style.backgroundImage)) found = r.style;
      });
    };
    Array.prototype.forEach.call(document.styleSheets, function (sh) {
      try { scan(sh.cssRules); } catch (e) { /* stilmallar från andra domäner går inte att läsa */ }
    });
    if (!found) return;
    ['backgroundImage', 'backgroundRepeat', 'backgroundPosition', 'backgroundSize', 'backgroundAttachment'].forEach(function (k) {
      if (found[k]) body.style[k] = found[k];
    });
    if (!found.backgroundSize) body.style.backgroundSize = 'cover';
  }

  /* Välj bild -> Byt bild när en bild är vald (texten före ikonen) */
  var UPLOAD_TEXT = { choose: 'Välj bild', change: 'Byt bild' };
  function uploadLabel(chosen) {
    var b = document.getElementById('registration-file-upload-button');
    if (!b) return;
    for (var n = b.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3 && n.nodeValue.trim()) {
        n.nodeValue = (chosen ? UPLOAD_TEXT.change : UPLOAD_TEXT.choose) + ' ';
        return;
      }
    }
  }
  /* Bildvalet bevakas även utan förhandsvisning (createLayout körs bara med den) */
  function uploadWatch() {
    var file = document.getElementById('registration_file_upload');
    if (!file || file.dataset.ucWatch) return;
    file.dataset.ucWatch = '1';
    file.addEventListener('change', function () { if (file.files && file.files.length) uploadLabel(true); });
  }

  /* Förhandsvisningen ska likna insamlingssidan: målet ("Mål: X kr", på
     koncept med mätare, se FUND_SHOW) under beskrivningen och "Din gåva"
     ovanför formuläret. */
  function previewExtras(msg) {
    var wrap = msg.parentNode;
    var camp = (location.pathname.match(/\/start\/(\d+)/) || [])[1];
    var show = FUND_SHOW[camp] || 'small';
    var first = wrap.querySelector('.input-group');
    if (first && !wrap.querySelector('.uc-preview-give')) {
      var h2 = el('h2', 'cc-title uc-preview-give', camp === PEPP_ID ? FUND_TEXT.givePepp : FUND_TEXT.give);
      wrap.insertBefore(h2, first);
    }
    if (show !== 'meter' && show !== 'small') return;
    var field = goalField();
    if (!field) return;
    var line = el('p', 'uc-preview-goal');
    msg.parentNode.insertBefore(line, msg.nextSibling);
    var upd = function () {
      var v = parseInt(String(field.value).replace(/\D/g, ''), 10);
      line.textContent = v ? FUND_TEXT.goalOnly + ' ' + kr(v) : '';
      line.hidden = !v;
    };
    field.addEventListener('input', upd);
    field.addEventListener('change', upd);
    upd();
  }
  /* Målfältet på skapa-sidan: det vars etikett innehåller "mål" */
  function goalField() {
    var phase = document.getElementById('phase-before-coupon');
    var field = null;
    if (phase) phase.querySelectorAll('input[id^="custom_field_"], input[name*="goal" i]').forEach(function (i) {
      var g = i.closest('.input-group');
      var l = g && g.querySelector('label');
      if (!field && /mål/i.test((l && l.textContent) || i.placeholder || '')) field = i;
    });
    return field;
  }

  /* Skapa-sidan: insamlingsmålet förifyllt (GOAL_DEFAULT) med snabbval.
     Fältet hittas på etiketten ("mål"), så det spelar ingen roll vilket
     custom field det är. Finns inget sådant fält görs ingenting. */
  function goalDefault() {
    var phase = document.getElementById('phase-before-coupon');
    if (!phase || phase.querySelector('.uc-goal')) return;
    var field = goalField();
    if (!field) return;
    var set = function (v) {
      field.value = v;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
    };
    if (!field.value) set(GOAL_DEFAULT);
    var box = el('div', 'uc-goal');
    box.appendChild(el('p', 'uc-goal__hint', GOAL_HINT));
    var chips = el('div', 'uc-goal__chips');
    var mark = function () {
      Array.prototype.forEach.call(chips.children, function (b) {
        b.classList.toggle('is-on', String(b.dataset.v) === String(field.value));
      });
    };
    GOAL_CHOICES.forEach(function (v) {
      var b = el('button', 'uc-goal__chip', kr(v));
      b.type = 'button';
      b.dataset.v = v;
      b.addEventListener('click', function () { set(v); mark(); });
      chips.appendChild(b);
    });
    box.appendChild(chips);
    field.addEventListener('input', mark);
    var g = field.closest('.input-group') || field;
    g.parentNode.insertBefore(box, g.nextSibling);
    mark();
  }

  /* ---------- Insamlingssidan: rubrik, bild, summa, formulär ---------- */
  /* Varje insamlares sida (/p/<kod>). Plattformen ger en smal spalt:
     bild, titelrad (#page-subtitle: rubriken som text, beskrivningen
     som <span>), formulär och hälsningsvägg. Här byggs rubriken,
     summan, knappen och beskrivningen ihop till ett block (.uc-fund__head)
     och CSS:en lägger sidan i två spalter: blocket till vänster, bild,
     formulär och vägg till höger. Plattformens element ligger kvar där
     de är, så Swish-flödet fungerar som förut. */
  function fundraiserPage() {
    var wrap = document.querySelector('.p2p-transaction-landing #phase-swish-result > .wrapper');
    var sub = document.getElementById('page-subtitle');
    var media = document.getElementById('page-title-swish-form');
    if (!wrap || !sub || !media || wrap.classList.contains('uc-fund')) return;
    var camp = (document.getElementById('campaign-id') || {}).value;
    var cid = conceptIdOf(camp, p2pCode(location.pathname)) || camp;   /* äldre kampanj: konceptets regler */
    var show = FUND_SHOW[cid] || 'small';

    /* Titelraden: texten före <span> är rubriken, <span> beskrivningen */
    var desc = sub.querySelector('span');
    var title = '';
    for (var n = sub.firstChild; n && n !== desc; n = n.nextSibling) {
      if (n.nodeType === 3) title += n.nodeValue;
    }
    title = title.replace(/\s+/g, ' ').trim();
    var goal = desc ? takeGoal(desc) : 0;
    var years = desc ? takeYears(desc) : '';

    /* Vänsterspalten: rubrik, levnadsår, beskrivning, insamlat, vägg */
    var head = el('div', 'uc-fund__head');
    head.appendChild(el('h1', 'uc-fund__title', title));
    if (years) head.appendChild(el('p', 'uc-fund__years', years));
    if (desc && desc.textContent.trim()) {
      var box = el('div', 'uc-fund__desc');
      desc.className = 'uc-fund__desc-text';
      box.appendChild(desc);
      var more = el('button', 'uc-fund__more', FUND_TEXT.more);
      more.type = 'button';
      more.setAttribute('aria-expanded', 'false');
      box.appendChild(more);
      head.appendChild(box);
    }
    var shown = el('div');
    shown.hidden = true;
    if (show !== 'form') head.appendChild(shown);
    var wall = wrap.querySelector(':scope > .leaderboard');
    if (wall) head.appendChild(wall);
    sub.classList.add('uc-fund__source');           /* tom nu: döljs i CSS */
    media.parentNode.insertBefore(head, media.nextSibling);

    /* Högerspalten: Din gåva + formuläret. Plattformens element flyttas
       hit i sin ordning (Swish-instruktionen #showText under rubriken). */
    var side = el('div', 'uc-fund__side');
    var h2 = el('h2', 'uc-fund__give', cid === PEPP_ID ? FUND_TEXT.givePepp : FUND_TEXT.give);
    h2.id = 'din-gava';
    side.appendChild(h2);
    if (show === 'form') side.appendChild(shown);
    ['#showText', '#errorText', '.show_swish_reward_form', '#swish_form_underlay_text'].forEach(function (q) {
      var e = wrap.querySelector(':scope > ' + q);
      if (e) side.appendChild(e);
    });
    head.parentNode.insertBefore(side, head.nextSibling);
    if (cid === PEPP_ID) {
      var msg = document.getElementById('message');
      var lab = msg && msg.parentNode ? msg.parentNode.querySelector('label') : null;
      if (lab) lab.textContent = FUND_TEXT.messagePepp;
    }

    wrap.classList.add('uc-fund');
    root.classList.add('uc-fund-page');

    /* Bilden: ingen = bildytan tas bort; liggande = kant i kant */
    var img = media.querySelector('img');
    var shape = function () {
      var bad = !img || !img.getAttribute('src') || (img.complete && img.naturalWidth === 0);
      wrap.classList.toggle('uc-fund--noimg', bad);
      wrap.classList.toggle('uc-fund--wide', !bad && img.naturalWidth > img.naturalHeight);
    };
    if (img) img.removeAttribute('style');           /* plattformen: 150px rund, inline */
    if (img) { img.alt = ''; img.addEventListener('load', shape); img.addEventListener('error', shape); }
    shape();

    fundDescription(head);
    fundSwishScroll(head);
    fitTitle(head.querySelector('.uc-fund__title'));
    fundSum(function (sum) { fundShown(shown, show, sum, goal); });
  }

  /* Efter Swisha: plattformen byter formuläret mot Swish-instruktionen
     (#showText) utan att scrolla. Står man långt ner hamnar instruktionens
     överkant ovanför skärmen. Då scrollas spalternas överkant fram, under
     headern (samma avstånd som formuläret som följer med). */
  function fundSwishScroll(head) {
    var st = document.getElementById('showText');
    if (!st) return;
    var shown = false;
    new MutationObserver(function () {
      var vis = getComputedStyle(st).display !== 'none';
      if (vis && !shown && window.matchMedia('(min-width: 800px)').matches) {   /* mobil: en spalt, där öppnas Swish-appen */
        setTimeout(function () {
          var gap = parseFloat(getComputedStyle(root).getPropertyValue('--uc-header-h')) || 104;
          var top = head.getBoundingClientRect().top + window.scrollY - gap - 24;
          if (window.scrollY > top) window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }, 50);
      }
      shown = vis;
    }).observe(st, { attributes: true, attributeFilter: ['style', 'class'] });
  }

  /* Målet ur beskrivningen: [mål:1000] läses och tas bort ur texten */
  /* Levnadsåren ur markören [år:...]; markören tas bort ur beskrivningen.
     Bindestreck mellan årtal blir tankstreck: 1987-2024 -> 1987–2024. */
  function takeYears(desc) {
    var years = '';
    var w = document.createTreeWalker(desc, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      var t = w.currentNode, m = t.nodeValue.match(YEARS_MARK);
      if (!m) continue;
      years = m[1].replace(/\s*[-–—]\s*/g, '\u2013').replace(/\s+/g, ' ').trim();
      if (/\{[^}]*\}/.test(years)) years = '';      /* shortcoden orenderad */
      t.nodeValue = t.nodeValue.replace(YEARS_MARK, '').replace(/[ \t]+$/, '');
    }
    return years;
  }

  function takeGoal(desc) {
    var goal = 0;
    var w = document.createTreeWalker(desc, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      var t = w.currentNode, m = t.nodeValue.match(GOAL_MARK);
      if (!m) continue;
      goal = parseInt(m[1].replace(/\D/g, ''), 10) || 0;
      t.nodeValue = t.nodeValue.replace(GOAL_MARK, '').replace(/[ \t]+$/, '');
    }
    return goal;
  }

  /* Insamlat, olika per koncept (FUND_SHOW). Utan mål: bara summan.
     0 kr: ingen summa och ingen tom mätare. Finns ett mål (Utmaning,
     Födelsedag) står bara "Mål: X kr"; annars visas ingenting. */
  function fundShown(box, show, sum, goal) {
    if (sum == null) return;
    if (!sum) {
      if (!goal || show === 'impact' || show === 'form') return;
      box.className = 'uc-fund__goal';
      box.textContent = FUND_TEXT.goalOnly + ' ' + kr(goal);
      box.hidden = false;
      return;
    }
    var pct = goal ? Math.round(sum / goal * 100) : 0;
    var bar = function () {
      var b = el('div', 'uc-fund__bar');
      var f = el('i');
      f.style.width = Math.min(pct, 100) + '%';
      b.appendChild(f);
      return b;
    };
    box.textContent = '';
    if (show === 'impact') {
      box.className = 'uc-fund__impact';
      box.appendChild(el('div', null, FUND_TEXT.impactPre));
      box.appendChild(el('div', 'uc-fund__impact-sum', kr(sum)));
      box.appendChild(el('div', 'uc-fund__impact-hand', FUND_TEXT.impactPost));
    } else if (show === 'form') {
      box.className = 'uc-fund__formsum';
      box.appendChild(el('strong', null, kr(sum)));
      box.appendChild(document.createTextNode(' ' + FUND_TEXT.formSum));
    } else {
      box.className = 'uc-fund__meter' + (show === 'small' ? ' uc-fund__meter--small' : '');
      var row = el('div', 'uc-fund__meter-row');
      row.appendChild(el('span', 'uc-fund__meter-sum', kr(sum)));
      if (goal && show === 'small') row.appendChild(el('span', null, FUND_TEXT.of + ' ' + kr(goal)));
      if (goal && show === 'meter') row.appendChild(el('span', 'uc-fund__meter-pct', pct + ' %'));
      if (!goal) { row.classList.add('uc-fund__meter-row--nogoal'); row.appendChild(el('span', null, FUND_TEXT.collected)); }
      box.appendChild(row);
      if (goal) {
        box.appendChild(bar());
        if (show === 'meter') box.appendChild(el('div', null, FUND_TEXT.goal + ' ' + kr(goal)));
      }
    }
    box.hidden = false;
  }

  /* Rubriken bryter bara mellan ord. Är ett ord längre än raden
     (t.ex. FÖDELSEDAGSINSAMLING på mobil) krymps rubriken tills det ryms. */
  function fitTitle(t) {
    if (!t) return;
    var busy = false;
    var fit = function () {
      if (busy) return;
      busy = true;
      t.style.fontSize = '';
      var size = parseFloat(getComputedStyle(t).fontSize);
      for (var i = 0; i < 30 && size > 24 && t.scrollWidth > t.clientWidth + 1; i++) {
        size = Math.floor(size * 0.94);
        t.style.fontSize = size + 'px';
      }
      busy = false;
    };
    fit();
    window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    var w = t.closest('.wrapper');
    if (w) new MutationObserver(fit).observe(w, { attributes: true, attributeFilter: ['class'] });
  }

  /* Mobil: beskrivningen visar --uc-fund-lines rader (CSS) och en
     Läs mer-knapp. Knappen visas bara om texten faktiskt är längre. */
  function fundDescription(head) {
    var box = head.querySelector('.uc-fund__desc');
    if (!box) return;
    var text = box.querySelector('.uc-fund__desc-text');
    var more = box.querySelector('.uc-fund__more');
    var check = function () {
      if (box.classList.contains('is-open')) return;
      box.classList.remove('is-long');
      box.classList.toggle('is-long', text.scrollHeight - text.clientHeight > 2);
    };
    more.addEventListener('click', function () {
      var open = !box.classList.contains('is-open');
      box.classList.toggle('is-open', open);
      more.textContent = open ? FUND_TEXT.less : FUND_TEXT.more;
      more.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) { check(); box.scrollIntoView({ block: 'nearest' }); }
    });
    check();
    if (window.ResizeObserver) new ResizeObserver(check).observe(text);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(check);
  }

  /* Summan: sidan visar den inte. Den står på insamlingens kort i
     listan för konceptet (samma fråga som etiketterna på Summary). */
  function fundSum(done) {
    var code = p2pCode(location.pathname);
    var camp = (document.getElementById('campaign-id') || {}).value;
    if (!code || !camp) return;
    cardsByConcept(SUMMARY_ID, camp, folderName()).then(function (j) {
      var doc = new DOMParser().parseFromString((j && j.html) || '', 'text/html');
      var hit = null;
      doc.querySelectorAll('.cc-card').forEach(function (c) {
        var a = c.querySelector('a[href]');
        if (a && p2pCode(a.getAttribute('href')) === code) hit = c;
      });
      var sums = hit ? hit.querySelectorAll('span.cc-title') : [];
      if (sums.length) done(amountOf(sums[sums.length - 1].textContent));
    }).catch(function () {});
  }

  /* ---------- Hälsningsväggen (leaderboarden på insamlingssidan) ---------- */
  /* Som minnesväggen i kampanj 289: lappar med tejp, huller om buller i
     spalter (kortaste spalten först). Varje lapp: hälsningen i handstil
     och avsändaren på en egen rad längst ner.
     Plattformens leaderboard.js ritar varje post som div.lead_container
     med avatar + p.leaderboard_info (mallen i admin, med {message} och
     {sender_name} ifyllda). Mallen kan vara den nuvarande
     ("<b>{sender_name}</b> gav <b>{amount} kr</b> <br> <i>{message}</i>")
     eller "<blockquote>{message}</blockquote><cite>{sender_name}</cite>":
     hälsningen tas ur blockquote/i, avsändaren ur cite/första b.
     leaderboard.js tömmer och ritar om listan ibland — då görs allt om. */
  function wallRnd(i, salt) {                     /* samma lapp hamnar likadant varje gång */
    var x = Math.sin((i + 1) * 9301 + salt * 49297) * 233280;
    return x - Math.floor(x);
  }
  function toNote(item) {
    if (item.classList.contains('uc-note')) return;
    var info = item.querySelector('.leaderboard_info');
    var msgEl = info ? info.querySelector('blockquote, i, em') : null;
    var fromEl = info ? info.querySelector('cite, b, strong') : null;
    var msg = msgEl ? msgEl.textContent.trim() : (info && !fromEl ? info.textContent.trim() : '');
    var from = fromEl ? fromEl.textContent.trim() : '';
    item.textContent = '';
    item.removeAttribute('style');                  /* svar från insamlaren har inline-flex */
    item.classList.add('uc-note');
    if (!msg && !from) { item.classList.add('uc-note--empty'); return; }
    var paper = el('figure', 'uc-note__paper');
    if (msg) paper.appendChild(el('blockquote', 'uc-note__msg', msg));
    else item.classList.add('uc-note--nomsg');
    if (from) paper.appendChild(el('figcaption', 'uc-note__from', from));
    item.appendChild(paper);
  }
  function layoutWall(box) {
    var notes = Array.prototype.filter.call(box.children, function (n) {
      return n.classList.contains('uc-note') && !n.classList.contains('uc-note--empty');
    });
    var cw = box.clientWidth;
    if (!notes.length || !cw) { box.style.height = ''; return; }
    /* Insamlingssidan på desktop: väggen ligger i vänsterspalten, spalterna
       fyller bredden från vänster. Annars centrerade spalter. */
    var left = !!box.closest('.uc-fund__head') && window.matchMedia('(min-width: 800px)').matches;
    var single = !!box.closest('.swish-landing');    /* givarens tacksida: en spalt med lappar */
    var slot = single ? Math.min(cw, WALL.SLOT_SINGLE) : WALL.SMALL > cw ? WALL.SLOT_SMALL : WALL.SLOT;
    var cols = single ? 1 : left ? WALL.COLS_FUND : Math.max(1, Math.floor((cw + WALL.GAP_X) / (slot + WALL.GAP_X)));
    if (left) slot = (cw - (cols - 1) * WALL.GAP_X) / cols;
    box.classList.toggle('uc-wall--small', slot < 200);
    box.style.setProperty('--uc-note-max', slot + 'px');
    var blockW = cols * slot + (cols - 1) * WALL.GAP_X;
    var offX = left ? 0 : Math.max(0, (cw - blockW) / 2);
    var colH = [];
    for (var k = 0; k !== cols; k++) colH.push(WALL.TOP);
    notes.forEach(function (n, i) {
      var c = 0;
      for (var j = 1; j !== cols; j++) if (colH[c] > colH[j]) c = j;   /* kortaste spalten */
      var jx = (wallRnd(i, 1) - 0.5) * 2 * WALL.JIT_X;
      var jy = wallRnd(i, 2) * WALL.JIT_Y;
      var x = offX + c * (slot + WALL.GAP_X) + (slot - n.offsetWidth) / 2 + jx;
      n.style.left = Math.round(x) + 'px';
      n.style.top = Math.round(colH[c] + jy) + 'px';
      colH[c] = colH[c] + jy + n.offsetHeight + WALL.GAP_Y;
    });
    box.style.height = Math.round(Math.max.apply(null, colH)) + 'px';
  }
  function greetingWall() {
    var box = document.querySelector('.p2p-transaction-landing .leaderboard-records, .swish-landing .leaderboard-records');
    if (!box) return;
    var t = null;
    var render = function () {
      Array.prototype.forEach.call(box.children, toNote);
      layoutWall(box);
    };
    var later = function (d) { clearTimeout(t); t = setTimeout(render, d); };
    /* Bara childList: lapparnas position är stil-ändringar och triggar
       inte observern, alltså ingen loop */
    new MutationObserver(function () { later(30); }).observe(box, { childList: true });
    if (window.ResizeObserver) new ResizeObserver(function () { later(80); }).observe(box);
    else window.addEventListener('resize', function () { later(120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { later(0); });
    render();
  }

  /* ---------- Footer ---------- */
  /* Byggs efter #wrap-default (plattformens innehåll), direkt i body.
     Campaign footer i Adoveo ska vara tomt. */
  function buildFooter() {
    if (document.querySelector('.uc-footer')) return;
    var f = el('footer', 'uc-footer');
    var cols = el('div', 'uc-footer__cols');
    FOOTER.columns.forEach(function (c) {
      var col = el('div', 'uc-footer__col');
      col.appendChild(el('h2', 'uc-footer__title', c.title));
      var p = el('p', 'uc-footer__text');
      c.lines.forEach(function (line, i) {
        if (i) p.appendChild(el('br'));
        if (line.href) {
          var a = el('a', null, line.text);
          a.href = line.href;
          p.appendChild(a);
        } else {
          p.appendChild(document.createTextNode(line));
        }
      });
      col.appendChild(p);
      cols.appendChild(col);
    });
    f.appendChild(cols);
    f.appendChild(el('p', 'uc-footer__payoff', FOOTER.payoff));
    var logos = el('div', 'uc-footer__logos');
    FOOTER.logos.forEach(function (l) {
      var img = el('img', 'uc-footer__logo');
      img.src = l.src; img.alt = l.alt; img.width = l.w; img.height = l.h;
      img.style.height = l.h + 'px';          /* filerna är dubbelt så stora (skarpa på retina) */
      img.loading = 'lazy';
      logos.appendChild(img);
    });
    f.appendChild(logos);
    var last = el('div', 'uc-footer__last');
    last.appendChild(el('p', 'uc-footer__meta', FOOTER.orgnr));
    var ul = el('ul', 'uc-footer__social');
    FOOTER.social.forEach(function (s) {
      var li = el('li');
      var a = el('a', 'uc-footer__icon uc-footer__icon--' + s.icon);
      a.href = s.href;
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('aria-label', 'Ung Cancer på ' + s.name);
      li.appendChild(a);
      ul.appendChild(li);
    });
    last.appendChild(ul);
    last.appendChild(el('p', 'uc-footer__meta', FOOTER.copyright));
    f.appendChild(last);
    var wrap = document.getElementById('wrap-default');
    if (wrap && wrap.parentNode === document.body) document.body.insertBefore(f, wrap.nextSibling);
    else document.body.appendChild(f);
  }

  /* ---------- Start ---------- */
  function init() {
    removeOldHeaders();
    conceptColors();
    var menu = document.getElementById('uc-meny');
    /* Panelerna flyttas till body: den sticky behållaren får transform vid
       scroll, och fixed inuti en transform hamnar annars fel */
    if (menu && menu.parentNode !== document.body) document.body.appendChild(menu);
    buildSearch();
    var sIcon = document.querySelector('.uc-header__icon--search');
    if (sIcon) sIcon.setAttribute('href', '#uc-sok');

    /* Markera sidan man står på */
    var here = path(location.pathname);
    document.querySelectorAll('.uc-header__link, .uc-drawer__link').forEach(function (a) {
      var u = new URL(a.href, location.href);
      if (u.hash || u.host !== location.host) return;
      if (path(u.pathname) === here) a.setAttribute('aria-current', 'page');
    });

    /* Varje del körs för sig: kraschar en, fungerar resten ändå
       (t.ex. att headern göms vid scroll) */
    [buildFooter, conceptList, buildHero, conceptCards, formatPrices, buildTotal, makeAnchors, fundraiserCards, conceptSteps, inlineQr, createLayout, uploadWatch, endBackground, goalDefault, fundraiserPage, greetingWall].forEach(function (fn) {
      try { fn(); } catch (e) { if (window.console) console.warn('[uc-p2p] ' + fn.name, e); }
    });

    /* Platshållare i plattformens sökfält, samma som i sökpanelen */
    var listSearch = onSummary() ? document.querySelector('#searchInput') : null;
    if (listSearch && !listSearch.placeholder) listSearch.placeholder = 'Sök på namn eller insamling';

    /* ?sok=namn från en annan sida: kör sökningen i listan på Summary */
    var q = new URLSearchParams(location.search).get('sok');
    if (q && onSummary()) setTimeout(function () { showAll(q); }, 300);
    else if (location.hash) {
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) setTimeout(function () { scrollToAnchor(t, false); }, 0);
    }

    /* Göm headern vid scroll nedåt, visa vid scroll uppåt */
    var head = document.querySelector('.uc-header');
    if (!head) return;
    var bar = head.parentElement === document.body ? head : head.parentElement;
    var last = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      var hide = y > last && y > bar.offsetHeight && !anyOpen();
      bar.classList.toggle('uc-header-bar--hidden', hide);
      last = y;
    }, { passive: true });
  }

  if (document.body) { buildShapes(); buildHeader(); }   /* direkt, om scriptet ligger i body */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { buildShapes(); buildHeader(); init(); });
  else { buildShapes(); buildHeader(); init(); }
})();
