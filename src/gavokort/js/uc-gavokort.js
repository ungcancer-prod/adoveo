/* ==========================================================================
   UNG CANCER — GÅVOKORT PÅ ADOVEO
   --------------------------------------------------------------------------
   Laddas i gåvokortskampanjerna via Theme → Head Markup (se README).
   Lyft ur kampanj 300 (Minnesgåva) 2026-11-13, där samma kod låg som två
   script i Form-stegets "Custom script for this step".

   Gör tre saker:
   1. Ritar formen #shape-box (oregelbunden kant på .wrapper och .hero-img).
   2. Formulärsteget: arket bredvid formuläret på desktop, som modal på
      mobil, skalat från PDF:ens geometri 794 x 1100 px. Tomma fält och råa
      shortcodes på arket visas i spökskrift.
   3. Hälsningsfältet: textarea med teckentak, räknare och förslag.
   4. Gåvokortssidan /c/...: arkets visningsskala, nedladdningsknappen ut
      ur arket, och renderingsläget när PDF:en skapas.
   5. Stegraden (1 Välj belopp, 2 Skapa, 3 Dela) på landningssidan, i
      formuläret och på tacksidan.
   6. Kortet redan i steg 1: en bild av gåvokortet på landningssidan.
   7. Snöfall i bakgrunden.
   8. Juldekor: snö på kanterna, snöret med rosett på tacksidan och
      gåvokortssidan, tacksidans kort och dela-knappen.

   VANLIGASTE ÄNDRINGEN: texterna. De ligger per kampanj i KAMPANJER nedan.
   Ingen emoji någonstans i den här filen eller i Adoveo.
   ========================================================================== */
(function () {
  if (window.__ucGavokort) { return; }       /* lås mot dubbel-init */
  window.__ucGavokort = true;

  /* ---------- TEXTER PER KAMPANJ ---------- */
  /* Nyckeln är kampanjens id i Adoveo. Saknas id:t används STANDARD.
     falt:      spökskrift på arket när en shortcode står kvar tom
                ({receiver_name}, {message}, {sender_name}).
     taggar:    spökskrift för tomt innehåll i blockquote/cite på arket.
     forslag:   knappen som öppnar listan, och förslagen. poet får vara ''.
     forhandsvisa: knapptexten bredvid ögat på mobil. */
  var STANDARD = {
    falt: {
      receiver_name: 'Namnet på den du hedrar',
      message: 'Hälsning',
      sender_name: 'Ditt eller era namn'
    },
    taggar: {
      BLOCKQUOTE: 'Din hälsning',
      CITE: 'Ditt eller era namn'
    },
    forslagKnapp: 'Saknar du ord? Läs fem förslag',
    forslag: [
      { text: 'Bortom alla begrepp om rätt och fel finns en äng. Jag möter dig där.', poet: 'Rumi' },
      { text: 'Nog finns det mål och mening med vår färd, men det är vägen, som är mödan värd.', poet: 'Karin Boye' },
      { text: 'Det är något bortom bergen, bortom blommorna och sången, det är något bakom stjärnor, bakom heta hjärtat mitt.', poet: 'Dan Andersson' },
      { text: 'När du är sorgsen, se då åter in i ditt hjärta, och du skall se att du i sanning gråter för det som var din glädje.', poet: 'Kahlil Gibran' },
      { text: 'Man ser bara rätt med hjärtat. Det viktigaste är osynligt för ögonen.', poet: 'Antoine de Saint-Exupéry' }
    ],
    forhandsvisa: 'Se minnesbladet',
    jul: false,              /* juldekor: snö på kanterna, etikett, ljuslåga, snöre (CSS sektion 15) */
    delaKnapp: null,         /* dela-knapp på gåvokortssidan, t.ex. { text: 'Dela gåvokortet', kopierat: 'Länken är kopierad' } */
    sno: false,              /* snöfall i bakgrunden */
    kortvisning: null,       /* kortet redan i steg 1, t.ex. { text: 'Rad vid kortet' }. null = inget */
    steg: null,              /* stegraden, t.ex. ['Välj belopp', 'Skapa', 'Dela']. null = ingen */
    maxHalsning: 300,        /* teckentak. Uppmätt i 300: strax över tappar arket sin luft */
    raknareKvar: 'Ungefär {n} tecken kvar.',
    raknareSlut: 'Hälsningen är så lång den kan bli.'
  };

  var KAMPANJER = {
    /* 300 Minnesgåva. Ligger fortfarande på sina inline-script i Adoveo. */
    '300': {},
    /* 311 En vanlig jul - Gåvokort. Arket är julkortet (CSS sektion 12):
       bara hälsning och avsändare skrivs ut på det. Hälsningsytan är 200px
       hög, därav 240 tecken. forslag är tom tills julcopyn finns (300:s
       dikter är sorgetexter); fyll på med { text: '...', poet: '' }. */
    '311': {
      falt: { receiver_name: '', message: 'Din hälsning', sender_name: 'Ditt namn' },
      taggar: { BLOCKQUOTE: 'Din hälsning', CITE: 'Ditt namn' },
      forslagKnapp: 'Saknar du ord? Läs våra förslag',
      forslag: [],
      forhandsvisa: 'Se gåvokortet',
      steg: ['Välj belopp', 'Skapa', 'Dela'],
      sno: true,
      jul: true,
      delaKnapp: { text: 'Dela gåvokortet', kopierat: 'Länken är kopierad' },
      kortvisning: { text: 'Gåvokortet är ritat av Sandra, medlem i Ung Cancer' },
      maxHalsning: 240
    }
  };

  /* ---------- GRÄNSER ---------- */
  var BRYT = 900;            /* desktop-läge från denna bredd */
  var BREDD = '900px';       /* #wrap-default i formulärsteget på desktop */
  var BLAD_W = 794;          /* arkets bredd, se CSS 11. Höjden 1100 bor i CSS */
  var MAX_NAMN = 80;         /* skydd mot inklistrat skräp, ingen layoutgräns */
  var VARNA = 40;            /* räknaren syns när så här många tecken är kvar */

  /* Formen #shape-box. Samma som i P2P-scriptet. */
  var SHAPES = {
    'shape-box': 'M0.998 0.993L0.748 0.994L0.5 0.992L0.252 1L0.006 0.992L0.003 0.747L0 0.5L0.007 0.252L0.006 0.005L0.252 0.006L0.5 0L0.748 0.009L0.998 0.001L1 0.252L0.993 0.5L0.995 0.748L0.998 0.993Z'
  };

  var T = STANDARD;          /* sätts om i boot() när kampanjens id är känt */

  /* ---------- kampanjens id ---------- */
  /* Adoveo skriver var campaignId = 'Campaign [ungcancer.adoveo.com, ID: 311]'
     i sidan. Annars adressen /start/311/ eller ett dolt #campaign-id. */
  function kampanjId() {
    var m = typeof window.campaignId === 'string' && window.campaignId.match(/ID:\s*(\d+)/);
    if (m) { return m[1]; }
    m = location.pathname.match(/\/start\/(\d+)/);
    if (m) { return m[1]; }
    var el = document.getElementById('campaign-id');
    return el && el.value ? el.value : '';
  }

  function texter(id) {
    var egna = KAMPANJER[id] || {};
    var ut = {};
    Object.keys(STANDARD).forEach(function (k) { ut[k] = STANDARD[k]; });
    Object.keys(egna).forEach(function (k) { ut[k] = egna[k]; });
    return ut;
  }

  /* ---------- 1. formen #shape-box ---------- */
  function shapes() {
    var NS = 'http://www.w3.org/2000/svg';
    var saknas = Object.keys(SHAPES).filter(function (id) { return !document.getElementById(id); });
    if (!saknas.length) { return; }
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.style.pointerEvents = 'none';
    var defs = document.createElementNS(NS, 'defs');
    saknas.forEach(function (id) {
      var cp = document.createElementNS(NS, 'clipPath');
      cp.setAttribute('id', id);
      cp.setAttribute('clipPathUnits', 'objectBoundingBox');
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', SHAPES[id]);
      cp.appendChild(path);
      defs.appendChild(cp);
    });
    svg.appendChild(defs);
    document.body.insertBefore(svg, document.body.firstChild);
  }

  /* ---------- 2. formulärsteget och arket ---------- */
  var RE_TOKEN = /^\s*\{([a-z_]+)\}\s*$/i;
  var RE_LOREM = /lorem ipsum|^\s*lore,\s*ipsum/i;
  var wdOrig = null;

  function findForm() {
    return document.querySelector('.show_swish_reward_form') ||
           document.querySelector('form.swish-form');
  }

  /* body.uc-form-step när formuläret syns. Admins Wrapper Width landar på
     #wrap-default, så bredden skrivs där på desktop. */
  function flagStep() {
    var f = findForm();
    var r = f ? f.getBoundingClientRect() : null;
    var on = !!(r && r.width > 0 && r.height > 0);
    document.body.classList.toggle('uc-form-step', on);

    var wd = document.getElementById('wrap-default');
    if (!wd) { return; }
    if (wdOrig === null) { wdOrig = wd.style.width || ''; }
    if (on && window.innerWidth >= BRYT) {
      wd.style.setProperty('width', BREDD, 'important');
    } else if (wdOrig) {
      wd.style.setProperty('width', wdOrig);
    } else {
      wd.style.removeProperty('width');
    }
  }

  /* Flyttar förhandsvisningen ut ur <form> till syskon under fasen, men
     först när steget är aktivt. Formulärets .wrapper har clip-path, som
     annars klipper mobilens fixed-modal. Adoveo flyttar tillbaka den när
     popupen stängs, därför görs det vid varje tick. */
  function place() {
    if (!document.body.classList.contains('uc-form-step')) { return; }
    var box = document.getElementById('giftcard-preview-container');
    var phase = document.getElementById('phase-swish-form');
    if (!box || !phase) { return; }
    if (box.parentElement !== phase) { phase.appendChild(box); }
  }

  /* Rutans bredd styr skalan. Höjden följer i CSS. */
  function scaleSheet() {
    var box = document.getElementById('giftcard-preview');
    if (!box) { return; }
    var w = box.clientWidth;
    if (!w) { return; }
    box.style.setProperty('--uc-kp', w / BLAD_W);
  }

  /* Tryck på den mörka ytan runt arket stänger popupen (mobil). */
  function backdropClose(e) {
    if (window.innerWidth >= BRYT) { return; }
    var box = document.getElementById('giftcard-preview-container');
    if (!box || e.target !== box) { return; }
    var x = document.getElementById('hide-preview');
    if (x) { x.click(); }
  }

  /* Har givaren själv skrivit texten i något fält? Då är det inte
     plattformens utfyllnadstext, även om det råkar stå "lorem ipsum". */
  function skrivet(text) {
    var t = text.replace(/\s+/g, ' ').trim();
    var falt = document.querySelectorAll('#phase-swish-form input.cc-input, #phase-swish-form textarea');
    for (var i = 0; i !== falt.length; i++) {
      var v = (falt[i].value || '').replace(/\s+/g, ' ').trim();
      if (v && v === t) { return true; }
    }
    return false;
  }

  /* Råa shortcodes och plattformens utfyllnadstext (lorem) på arket blir
     spökskrift. */
  function paint() {
    var box = document.getElementById('giftcard-preview');
    if (!box) { return; }
    var i;
    var stale = box.querySelectorAll('.uc-ghost');
    for (i = 0; i !== stale.length; i++) { stale[i].classList.remove('uc-ghost'); }

    var walk = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, null);
    var node, hits = [];
    while ((node = walk.nextNode())) {
      if (RE_TOKEN.test(node.nodeValue) ||
          (RE_LOREM.test(node.nodeValue) && !skrivet(node.nodeValue))) { hits.push(node); }
    }
    for (i = 0; i !== hits.length; i++) {
      var t = hits[i];
      var host = t.parentNode;
      if (!host || !host.classList) { continue; }
      var m = RE_TOKEN.exec(t.nodeValue);
      var text = m ? T.falt[m[1].toLowerCase()] : T.taggar[host.tagName];
      t.nodeValue = text || '';
      host.classList.add('uc-ghost');
    }
  }

  function tick() { flagStep(); place(); scaleSheet(); }

  function formStep() {
    tick();
    setInterval(tick, 300);
    window.addEventListener('resize', tick);
    window.addEventListener('orientationchange', function () { setTimeout(tick, 120); });

    /* Snabbt på plats igen när popupen öppnas nästa gång. */
    document.addEventListener('click', function () {
      setTimeout(tick, 0);
      setTimeout(tick, 60);
      setTimeout(tick, 200);
    }, true);
    document.addEventListener('click', backdropClose, false);

    var iv = setInterval(function () {
      var box = document.getElementById('giftcard-preview-container');
      if (!box) { return; }
      clearInterval(iv);
      new MutationObserver(function () { paint(); scaleSheet(); })
        .observe(box, { childList: true, subtree: true });
      paint();
      scaleSheet();
    }, 400);

    document.addEventListener('input', paint, true);
  }

  /* ---------- 3. hälsningsfältet ---------- */
  /* Adoveos #message är en input type="text". Att byta ut noden mot en
     textarea bryter arkets liveuppdatering, så inputen ligger kvar dold och
     en egen textarea speglas mot den. Submit och validering rörs aldrig.
     Enter blockeras: inputen sanerar bort radbrytningar, och fältet ska
     visa exakt det som hamnar på arket. */
  var inp = null, ta = null, rakn = null, lista = null, trigger = null;
  var harVisatModal = false;

  function spegla() {
    if (!inp || !ta) { return; }
    inp.value = ta.value.replace(/\s*\n\s*/g, ' ');
    ['input', 'keyup', 'change'].forEach(function (typ) {
      inp.dispatchEvent(new Event(typ, { bubbles: true }));
    });
  }

  function vaxa() {
    if (!ta) { return; }
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  }

  function rakna() {
    if (!ta || !rakn) { return; }
    var kvar = T.maxHalsning - ta.value.length;
    if (kvar > VARNA) {
      rakn.className = 'uc-rakn';
      rakn.textContent = '';
      return;
    }
    rakn.className = 'uc-rakn uc-syns' + (kvar > 0 ? '' : ' uc-slut');
    rakn.textContent = kvar > 0 ? T.raknareKvar.replace('{n}', kvar) : T.raknareSlut;
  }

  function uppdatera() { vaxa(); rakna(); spegla(); }

  function oppna(pa) {
    if (!lista || !trigger) { return; }
    lista.className = pa ? 'uc-forslag-lista uc-oppen' : 'uc-forslag-lista';
    trigger.setAttribute('aria-expanded', pa ? 'true' : 'false');
  }

  /* Bara texten skrivs in, inte poetens namn. På mobil öppnas arket första
     gången, så att man ser hur det blir. */
  function valj(v) {
    ta.value = v.text;
    oppna(false);
    uppdatera();
    ta.focus();
    if (window.innerWidth < BRYT && !harVisatModal) {
      harVisatModal = true;
      var oga = document.getElementById('giftcard-preview-button');
      if (oga) { setTimeout(function () { oga.click(); }, 120); }
    }
  }

  function byggLista(vard) {
    T.forslag.forEach(function (v) {
      var knapp = document.createElement('button');
      knapp.type = 'button';
      knapp.className = 'uc-vers';
      var rad = document.createElement('span');
      rad.className = 'uc-text';
      rad.textContent = v.text;
      knapp.appendChild(rad);
      if (v.poet) {
        var namn = document.createElement('span');
        namn.className = 'uc-poet';
        namn.textContent = v.poet;
        knapp.appendChild(namn);
      }
      knapp.addEventListener('click', function () { valj(v); });
      vard.appendChild(knapp);
    });
  }

  function bygg() {
    inp = document.getElementById('message');
    if (!inp) { return false; }
    if (document.getElementById('uc-halsning')) { return true; }
    var grupp = inp.parentElement;
    if (!grupp) { return false; }

    var namnfalt = document.getElementById('receiver_name');
    if (namnfalt) { namnfalt.setAttribute('maxlength', MAX_NAMN); }

    ta = document.createElement('textarea');
    ta.id = 'uc-halsning';
    ta.className = inp.className;
    ta.rows = 1;
    ta.setAttribute('maxlength', T.maxHalsning);
    ta.setAttribute('autocomplete', 'off');
    ta.placeholder = inp.getAttribute('placeholder') || '';
    ta.value = inp.value || '';

    inp.classList.add('uc-dold');
    inp.setAttribute('tabindex', '-1');
    inp.setAttribute('aria-hidden', 'true');
    grupp.insertBefore(ta, inp);

    var holk = document.createElement('div');
    holk.className = 'uc-holk';

    rakn = document.createElement('div');
    rakn.id = 'uc-rakn';
    rakn.className = 'uc-rakn';
    rakn.setAttribute('aria-live', 'polite');
    holk.appendChild(rakn);

    if (T.forslag && T.forslag.length) {
      var box = document.createElement('div');
      box.className = 'uc-forslag';

      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.id = 'uc-forslag-trigger';
      trigger.className = 'uc-forslag-trigger';
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', 'uc-forslag-lista');
      trigger.appendChild(document.createTextNode(T.forslagKnapp));
      var pil = document.createElement('span');
      pil.className = 'uc-pil';
      trigger.appendChild(pil);

      lista = document.createElement('div');
      lista.id = 'uc-forslag-lista';
      lista.className = 'uc-forslag-lista';
      byggLista(lista);

      box.appendChild(trigger);
      box.appendChild(lista);
      holk.appendChild(box);

      trigger.addEventListener('click', function () {
        oppna(lista.className.indexOf('uc-oppen') === -1);
      });
    }

    grupp.parentNode.insertBefore(holk, grupp.nextSibling);

    ta.addEventListener('input', uppdatera);
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); }
    });
    uppdatera();
    return true;
  }

  function halsning() {
    var forsok = 0;
    var iv = setInterval(function () {
      forsok++;
      if (bygg() || forsok > 60) { clearInterval(iv); }
    }, 300);
    /* Adoveo kan rita om formuläret, då byggs allt på nytt. */
    setInterval(function () {
      if (document.getElementById('message') && !document.getElementById('uc-halsning')) { bygg(); }
    }, 700);
  }

  /* ---------- 4. gåvokortssidan /c/... ---------- */
  /* Låg tidigare i Adoveo som eget script (uc-blad). Flaggan __ucBlad delas
     med det, så ligger det gamla kvar i en kampanj körs bara det ena.
     Arket behåller sin layout på 794 x 1100 px, bara ritningen krymper
     (--uc-k). BLAD_H ska vara samma som --uc-blad-h i CSS 11.4. */
  var BLAD_H = 1100;
  var RESERV = 220;          /* plats för knappen och luft runt arket */

  function onLanding() { return !!document.getElementById('phase-coupon-landing'); }

  function fit() {
    if (!onLanding()) { return false; }
    var k = Math.min(1, (window.innerHeight - RESERV) / BLAD_H);
    if (window.innerWidth < BLAD_W + 40) {
      k = Math.min(k, (window.innerWidth - 32) / BLAD_W);
    }
    k = Math.max(k, 0.2);
    document.documentElement.style.setProperty('--uc-k', k);
    return true;
  }

  /* Knappen flyttas ut ur arket och sätter body.uc-pdf-render vid klick,
     så att bara arket fotograferas (CSS 11.5). */
  function pdfKnapp() {
    var phase = document.getElementById('phase-coupon-landing');
    var btn = document.getElementById('coupon-landing-show-pdf');
    if (!phase || !btn) { return false; }
    if (btn.parentElement !== phase) { phase.appendChild(btn); }
    btn.addEventListener('click', function () {
      document.body.classList.add('uc-pdf-render');
      setTimeout(function () { document.body.classList.remove('uc-pdf-render'); }, 4000);
    }, true);
    return true;
  }

  function blad() {
    if (window.__ucBlad) { return; }
    window.__ucBlad = true;

    /* Skalan först, så tidigt det går: fasen kan ritas efter
       DOMContentLoaded, och ett sent hopp syns på mobil. */
    var tidiga = 0;
    var iv1 = setInterval(function () {
      tidiga++;
      if (fit() || tidiga > 100) { clearInterval(iv1); }
    }, 30);
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', function () { setTimeout(fit, 120); });

    /* Knappen efter window.load, när Adoveo bundit sin klickhanterare. */
    function kick() {
      if (!onLanding()) { return; }
      var forsok = 0;
      var iv2 = setInterval(function () {
        fit();
        forsok++;
        if (pdfKnapp() || forsok > 40) { clearInterval(iv2); }
      }, 300);
    }
    if (document.readyState === 'complete') { setTimeout(kick, 300); }
    else { window.addEventListener('load', function () { setTimeout(kick, 300); }); }
  }

  /* ---------- 5. stegraden ---------- */
  /* Samma element som på P2P-konceptsidorna. Utseendet i CSS sektion 13.
     Steg 1 länkar tillbaka till landningssidan när man står i formuläret. */
  function stegLista(nu) {
    var ol = document.createElement('ol');
    ol.className = 'uc-progress';
    ol.setAttribute('aria-label', 'Stegen till ditt gåvokort');
    T.steg.forEach(function (text, i) {
      var n = i + 1;
      var lage = nu > n ? 'done' : (nu === n ? 'current' : 'next');
      var li = document.createElement('li');
      li.className = 'uc-progress__step uc-progress__step--' + lage;
      if (lage === 'current') { li.setAttribute('aria-current', 'step'); }
      var box = li;
      if (lage === 'done' && n === 1 && nu === 2) {
        box = document.createElement('a');
        box.className = 'uc-progress__link';
        box.href = location.pathname + location.search;
        li.appendChild(box);
      }
      var dot = document.createElement('span');
      dot.className = 'uc-progress__dot';
      if (lage === 'done') {
        var sr = document.createElement('span');
        sr.className = 'uc-sr';
        sr.textContent = 'Klart:';
        dot.appendChild(sr);
      } else {
        dot.textContent = String(n);
      }
      box.appendChild(dot);
      var label = document.createElement('span');
      label.className = 'uc-progress__label';
      label.textContent = text;
      box.appendChild(label);
      ol.appendChild(li);
    });
    return ol;
  }

  /* Var raden står: [fas, elementet den läggs intill, före/efter, steg] */
  var STEG_PLATS = [
    ['phase-swish-products', '.registration-text-above', 'efter', 1],
    ['phase-swish-form', '#page-title-swish-form', 'fore', 2],
    ['phase-swish-result', '.page-title', 'fore', 3]
  ];

  function stegrad() {
    if (!T.steg || !T.steg.length) { return; }
    var satt = function () {
      STEG_PLATS.forEach(function (p) {
        var fas = document.getElementById(p[0]);
        if (!fas || fas.querySelector('.uc-progress')) { return; }
        var vid = fas.querySelector(p[1]);
        if (!vid) { return; }
        var ol = stegLista(p[3]);
        vid.parentNode.insertBefore(ol, p[2] === 'fore' ? vid : vid.nextSibling);
        /* Ytans färg till bocken */
        var yta = ol.closest('.wrapper');
        if (yta) { ol.style.setProperty('--uc-step-bg', getComputedStyle(yta).backgroundColor); }
      });
    };
    satt();
    /* Adoveo kan rita om faserna: sätt tillbaka raden om den försvinner. */
    setInterval(satt, 700);
  }

  /* ---------- 6. kortet redan i steg 1 ---------- */
  /* Visar gåvokortet på landningssidan, innan man valt belopp. Utseendet i
     CSS sektion 12.1. Två exemplar byggs: ett i den röda ytan under
     beloppsknapparna (mobil) och ett bredvid ytan (desktop). CSS visar det
     ena eller det andra. */
  function kortFigur(lage) {
    var fig = document.createElement('figure');
    fig.className = 'uc-kort1 uc-kort1--' + lage;
    var text = document.createElement('figcaption');
    text.className = 'uc-kort1__text';
    text.textContent = T.kortvisning.text || '';
    var ark = document.createElement('div');
    ark.className = 'uc-kort1__ark';
    ark.setAttribute('role', 'img');
    ark.setAttribute('aria-label', 'Gåvokortet, med plats för din hälsning och ditt namn');
    var inre = document.createElement('div');
    inre.className = 'uc-julkort';
    inre.setAttribute('aria-hidden', 'true');
    var bq = document.createElement('blockquote');
    bq.className = 'uc-ghost';
    bq.textContent = T.taggar.BLOCKQUOTE;
    var cite = document.createElement('cite');
    cite.className = 'uc-ghost';
    cite.textContent = T.taggar.CITE;
    inre.appendChild(bq);
    inre.appendChild(cite);
    ark.appendChild(inre);
    /* Mobil: texten ovanför kortet. Desktop: under, så att kortet står på
       samma höjd som arket i steg 2. */
    if (lage === 'mobil') { fig.appendChild(text); fig.appendChild(ark); }
    else { fig.appendChild(ark); fig.appendChild(text); }
    return fig;
  }

  function kortvisning() {
    if (!T.kortvisning) { return; }
    var satt = function () {
      var fas = document.getElementById('phase-swish-products');
      if (!fas) { return; }
      var yta = fas.querySelector('.wrapper');
      if (yta && !fas.querySelector('.uc-kort1--mobil')) {
        var under = yta.querySelector('.swish-below-text');
        if (under) { under.parentNode.insertBefore(kortFigur('mobil'), under); }
      }
      if (yta && !fas.querySelector('.uc-kort1--desktop')) {
        fas.insertBefore(kortFigur('desktop'), yta.nextSibling);
      }
      /* Klassen styr den breda uppställningen och ska bara sitta när steg 1 syns. */
      var syns = getComputedStyle(fas).display !== 'none';
      document.body.classList.toggle('uc-kort1-steg', syns);
    };
    satt();
    setInterval(satt, 300);
    document.addEventListener('click', function () { setTimeout(satt, 0); setTimeout(satt, 60); }, true);
  }

  /* ---------- 7. snöfall ---------- */
  /* Mjuka flingor som faller långsamt bakom innehållet. Tre djup: små,
     svaga och långsamma längst bort, större och tydligare närmast. Allt
     ritas på en canvas (CSS sektion 14). Pausas när fliken inte syns. */
  var SNO = {
    perYta: 26000,      /* en flinga per så här många px2 skärmyta ... */
    max: 90,            /* ... men aldrig fler än så här */
    radie: [1.2, 4.2],  /* minsta och största flinga, px */
    fart: [10, 34],     /* fallhastighet, px per sekund */
    svaj: [6, 22],      /* hur långt en flinga pendlar i sidled, px */
    alfa: [0.25, 0.85], /* svagaste och starkaste flinga */
    vind: 8,            /* långsam gemensam drift i sidled, px per sekund */
    farg: '255, 255, 255'
  };

  function sno() {
    if (!T.sno) { return; }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
    if (document.querySelector('.uc-sno')) { return; }

    var cv = document.createElement('canvas');
    cv.className = 'uc-sno';
    cv.setAttribute('aria-hidden', 'true');
    var ctx = cv.getContext('2d');
    if (!ctx) { return; }
    document.body.insertBefore(cv, document.body.firstChild);
    document.documentElement.classList.add('uc-har-sno');

    /* En mjuk flinga ritas en gång och stämplas sedan ut i olika storlek. */
    var stampel = document.createElement('canvas');
    stampel.width = stampel.height = 64;
    var sc = stampel.getContext('2d');
    var g = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(' + SNO.farg + ', 1)');
    g.addColorStop(0.45, 'rgba(' + SNO.farg + ', 0.75)');
    g.addColorStop(1, 'rgba(' + SNO.farg + ', 0)');
    sc.fillStyle = g;
    sc.fillRect(0, 0, 64, 64);

    var W = 0, H = 0, flingor = [];
    function mellan(par, d) { return par[0] + (par[1] - par[0]) * d; }
    function ny(overst) {
      var d = Math.pow(Math.random(), 1.6);   /* djup 0..1, flest långt bort */
      return {
        x: Math.random() * W,
        y: overst ? -10 : Math.random() * H,
        r: mellan(SNO.radie, d),
        v: mellan(SNO.fart, d) * (0.8 + Math.random() * 0.4),
        svaj: mellan(SNO.svaj, d),
        fas: Math.random() * Math.PI * 2,
        takt: 0.25 + Math.random() * 0.5,
        a: mellan(SNO.alfa, d),
        d: d
      };
    }
    function matt() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var antal = Math.min(SNO.max, Math.round(W * H / SNO.perYta));
      while (flingor.length > antal) { flingor.pop(); }
      while (antal > flingor.length) { flingor.push(ny(false)); }
    }

    var forra = 0, tid = 0, igang = false;
    function rita(nu) {
      if (!igang) { return; }
      var dt = Math.min((nu - forra) / 1000, 0.05);   /* hoppa inte efter en paus */
      forra = nu;
      tid += dt;
      ctx.clearRect(0, 0, W, H);
      var vind = Math.sin(tid * 0.07) * SNO.vind;
      for (var i = 0; i !== flingor.length; i++) {
        var f = flingor[i];
        f.y += f.v * dt;
        f.x += vind * (0.4 + f.d) * dt;
        if (f.y - f.r * 3 > H) { flingor[i] = f = ny(true); }
        if (f.x > W + 30) { f.x = -30; } else if (-30 > f.x) { f.x = W + 30; }
        var x = f.x + Math.sin(tid * f.takt + f.fas) * f.svaj;
        var s = f.r * 3;                               /* stämpeln är mjuk i kanten */
        ctx.globalAlpha = f.a;
        ctx.drawImage(stampel, x - s, f.y - s, s * 2, s * 2);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(rita);
    }
    function start() {
      if (igang || document.hidden) { return; }
      igang = true;
      forra = performance.now();
      requestAnimationFrame(rita);
    }
    function stopp() { igang = false; }

    matt();
    window.addEventListener('resize', matt);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stopp(); } else { start(); }
    });
    start();
  }

  /* ---------- 8. juldekor ---------- */
  /* Utseendet ligger i CSS sektion 15. Här byggs bara det som CSS inte kan
     göra själv. */
  var SVG_NS = 'http://www.w3.org/2000/svg';

  /* Snöret med rosett över kortet. Måtten är arkets (794 x 1100), så
     samma teckning passar kortet i alla storlekar. Linjerna går där bilden
     är tom: till höger om paketen och mellan logotypen och rubriken.
     lage: 'knyt' ritar upp det, 'los' drar tillbaka det. */
  var SNORE = [
    ['l1', 'M700 -6 C694 280 707 720 699 1106'],
    ['l2', 'M-6 180 C250 172 560 186 800 175'],
    ['b1 uc-snore__bage', 'M700 178 C668 120 606 118 612 158 C617 190 668 188 700 178'],
    ['b2 uc-snore__bage', 'M700 178 C732 120 794 118 788 158 C783 190 732 188 700 178'],
    ['s1 uc-snore__bage', 'M700 178 C690 206 676 228 656 246'],
    ['s2 uc-snore__bage', 'M700 178 C712 208 728 228 748 244']
  ];
  function snore(lage) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'uc-snore uc-snore--' + lage);
    svg.setAttribute('viewBox', '0 0 794 1100');
    svg.setAttribute('aria-hidden', 'true');
    SNORE.forEach(function (d) {
      var path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('class', 'uc-snore__' + d[0]);
      path.setAttribute('d', d[1]);
      path.setAttribute('pathLength', '1');
      svg.appendChild(path);
    });
    var knut = document.createElementNS(SVG_NS, 'ellipse');
    knut.setAttribute('class', 'uc-snore__knut');
    knut.setAttribute('cx', '700');
    knut.setAttribute('cy', '178');
    knut.setAttribute('rx', '11');
    knut.setAttribute('ry', '9');
    svg.appendChild(knut);
    return svg;
  }

  /* Snön på ytornas överkant. Ytan har clip-path och gåvokortssidans ark
     overflow: hidden, så drivan ligger i ett eget element i fasen och
     placeras efter ytans läge. Körs om, eftersom ytan byter storlek. */
  var SNOKANT = [
    ['phase-swish-products', '.wrapper'],
    ['phase-swish-form', '.wrapper'],
    ['phase-swish-result', '.wrapper'],
    ['phase-coupon-landing', '#wrapper']
  ];
  function snokanter() {
    SNOKANT.forEach(function (p) {
      var fas = document.getElementById(p[0]);
      if (!fas) { return; }
      var yta = fas.querySelector(p[1]);
      var kant = null;
      for (var i = 0; i !== fas.children.length; i++) {
        if (fas.children[i].className === 'uc-snokant') { kant = fas.children[i]; }
      }
      if (!yta) { return; }
      var r = yta.getBoundingClientRect();
      if (!r.width || !r.height) { if (kant) { kant.style.display = 'none'; } return; }
      if (!kant) {
        kant = document.createElement('div');
        kant.className = 'uc-snokant';
        kant.setAttribute('aria-hidden', 'true');
        fas.appendChild(kant);
      }
      var f = fas.getBoundingClientRect();
      kant.style.display = '';
      kant.style.left = Math.round(r.left - f.left - 3) + 'px';
      kant.style.top = Math.round(r.top - f.top - 11) + 'px';
      kant.style.width = Math.round(r.width + 6) + 'px';
    });
  }

  /* Tacksidan: kortet med givarens hälsning, och snöret som knyts.
     Hälsningen och namnet kommer från End Page-texten i Adoveo, där de
     står i ett dolt element:
       <span class="uc-tack-data" hidden><q>{message}</q><b>{sender_name}</b></span>
     Saknas elementet visas inget kort. */
  function tackKort() {
    var data = document.querySelector('#phase-swish-result .uc-tack-data');
    if (!data || document.querySelector('.uc-kort1--tack')) { return; }
    var q = data.querySelector('q'), b = data.querySelector('b');
    var halsning = q ? q.textContent.trim() : '';
    var namn = b ? b.textContent.trim() : '';
    /* En shortcode som inte fyllts i står kvar som {message} */
    if (halsning.charAt(0) === '{') { halsning = ''; }
    if (namn.charAt(0) === '{') { namn = ''; }

    var fig = document.createElement('figure');
    fig.className = 'uc-kort1 uc-kort1--tack';
    var ark = document.createElement('div');
    ark.className = 'uc-kort1__ark';
    ark.setAttribute('role', 'img');
    ark.setAttribute('aria-label', 'Ditt gåvokort');
    var inre = document.createElement('div');
    inre.className = 'uc-julkort';
    var bq = document.createElement('blockquote');
    bq.textContent = halsning;
    var cite = document.createElement('cite');
    cite.textContent = namn;
    inre.appendChild(bq);
    inre.appendChild(cite);
    ark.appendChild(inre);
    ark.appendChild(snore('knyt'));
    fig.appendChild(ark);

    var fas = document.getElementById('phase-swish-result');
    var rubrik = fas.querySelector('.page-title');
    if (rubrik) { rubrik.parentNode.insertBefore(fig, rubrik.nextSibling); }
    else { data.parentNode.insertBefore(fig, data); }
  }

  /* Gåvokortssidan: snöret ligger knutet över kortet när sidan öppnas och
     löses upp. Elementet tas bort efteråt, så att arket är rent. */
  function losSnore() {
    var ark = document.querySelector('#phase-coupon-landing #wrapper');
    if (!ark || !ark.querySelector('.uc-julkort') || ark.querySelector('.uc-snore')) { return false; }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return true; }
    var svg = snore('los');
    ark.appendChild(svg);
    setTimeout(function () { if (svg.parentNode) { svg.parentNode.removeChild(svg); } }, 3200);
    return true;
  }

  /* Gåvokortssidan: knappen som delar länken till kortet. Telefonens egen
     delningsruta där den finns, annars kopieras länken. */
  function delaKnapp(vantaInte) {
    if (!T.delaKnapp) { return true; }
    var fas = document.getElementById('phase-coupon-landing');
    var pdf = document.getElementById('coupon-landing-show-pdf');
    if (!fas || !pdf) { return false; }
    if (document.getElementById('uc-dela')) { return true; }
    /* Knappen ska stå under nedladdningsknappen, som först ska ha flyttats
       ut ur arket (pdfKnapp). Egen rad: klick i nedladdningsknappens rad
       slår på renderingsläget. */
    if (pdf.parentElement !== fas && !vantaInte) { return false; }
    var knapp = document.createElement('button');
    knapp.type = 'button';
    knapp.id = 'uc-dela';
    knapp.className = 'cc-button btn-primary';
    var text = document.createElement('span');
    text.textContent = T.delaKnapp.text;
    knapp.appendChild(text);
    knapp.addEventListener('click', function () {
      var url = location.origin + location.pathname;
      if (navigator.share) {
        navigator.share({ url: url }).catch(function () {});
        return;
      }
      var klart = function () {
        text.textContent = T.delaKnapp.kopierat;
        setTimeout(function () { text.textContent = T.delaKnapp.text; }, 2500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(klart, function () { window.prompt('', url); });
      } else {
        window.prompt('', url);
      }
    });
    var rad = document.createElement('div');
    rad.className = 'uc-dela-rad';
    rad.appendChild(knapp);
    if (pdf.parentElement === fas) { fas.insertBefore(rad, pdf.nextSibling); }
    else { fas.appendChild(rad); }
    return true;
  }

  function jul() {
    if (!T.jul) { return; }
    var root = document.documentElement;
    root.classList.add('uc-jul');
    /* Ytans färg, till hålet i etiketten */
    var yta = document.querySelector('#phase-swish-products .wrapper, #phase-swish-form .wrapper, #phase-swish-result .wrapper');
    if (yta) { root.style.setProperty('--uc-yta', getComputedStyle(yta).backgroundColor); }

    var varv = function () {
      snokanter();
      tackKort();
    };
    varv();
    setInterval(varv, 300);
    window.addEventListener('resize', snokanter);
    document.addEventListener('click', function () { setTimeout(snokanter, 0); setTimeout(snokanter, 80); }, true);

    /* Gåvokortssidan ritas ibland efter DOMContentLoaded: försök en stund. */
    if (document.body.classList.contains('coupon-landing') || document.getElementById('phase-coupon-landing')) {
      var n = 0, lost = false, delat = false;
      var iv = setInterval(function () {
        n++;
        if (!lost) { lost = losSnore(); }
        if (!delat) { delat = delaKnapp(n > 30); }
        if ((lost && delat) || n > 40) { clearInterval(iv); }
      }, 250);
    }
  }

  /* ---------- start ---------- */
  function boot() {
    T = texter(kampanjId());
    document.documentElement.style.setProperty('--uc-preview-label', JSON.stringify(T.forhandsvisa));
    /* Varje del för sig, så att en krasch inte stoppar resten. */
    [shapes, formStep, halsning, blad, stegrad, kortvisning, sno, jul].forEach(function (fn) {
      try { fn(); } catch (e) { console.error('[uc-gavokort]', fn.name, e); }
    });
    document.documentElement.classList.add('uc-gavokort');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
