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

  /* ---------- start ---------- */
  function boot() {
    T = texter(kampanjId());
    document.documentElement.style.setProperty('--uc-preview-label', JSON.stringify(T.forhandsvisa));
    /* Varje del för sig, så att en krasch inte stoppar resten. */
    [shapes, formStep, halsning, blad, stegrad].forEach(function (fn) {
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
