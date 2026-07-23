/* ============================================================
   LANGCHAIN AKADÉMIA — aplikačná logika
   ============================================================ */
(function () {
  'use strict';

  const { highlightPython, highlightWithBlanks, escapeHtml } = window.PyHL;
  const COURSE = window.COURSE;
  const LESSON_ORDER = COURSE.sections.flatMap(s => s.lessons);

  /* ----------------------------------------------------------
     STAV + PERZISTENCIA
     ---------------------------------------------------------- */
  const STORE_KEY = 'lc-akademia-v1';

  // Bezpečné úložisko — appka NESMIE spadnúť, ak je localStorage blokovaný
  // alebo plný (Safari private mode, file:// origin, prekročená kvóta).
  let storageOK = true;
  let storageWarned = false;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? (JSON.parse(raw) || {}) : {};
    } catch (e) { storageOK = false; return {}; }
  }

  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
      storageOK = true;
    } catch (e) {
      storageOK = false;
      warnNoStorage();
    }
  }

  // Upozorní (raz), ak sa postup nedá ukladať, a poradí riešenie.
  function warnNoStorage() {
    if (storageWarned) return;
    storageWarned = true;
    setTimeout(() => toast('⚠️',
      'Postup sa v tomto režime nedá uložiť. Spusti appku <b>ikonou „LangChain Akadémia" na ploche</b> — ' +
      'tam sa postup automaticky ukladá. Medzitým si ho môžeš zálohovať cez <b>💾 Exportovať postup</b> v menu.'
    ), 250);
  }

  const state = Object.assign({
    xp: 0, done: [], quiz: {}, ex: {}, badges: [], examBest: 0, examPassed: false, cap: [], proj: [], projReq: {}
  }, loadState());

  // ── Záloha postupu: export do súboru / import zo súboru ──
  function exportProgress() {
    try {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'langchain-akademia-postup.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      toast('💾', 'Postup exportovaný do súboru <b>langchain-akademia-postup.json</b>.');
    } catch (e) {
      toast('⚠️', 'Export sa nepodaril.');
    }
  }

  function importProgress(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result);
        if (!obj || typeof obj !== 'object') throw 0;
        if (typeof obj.xp === 'number') state.xp = obj.xp;
        if (typeof obj.examBest === 'number') state.examBest = obj.examBest;
        if (typeof obj.examPassed === 'boolean') state.examPassed = obj.examPassed;
        ['done', 'badges', 'cap', 'proj'].forEach(k => { if (Array.isArray(obj[k])) state[k] = obj[k]; });
        ['quiz', 'ex', 'projReq'].forEach(k => { if (obj[k] && typeof obj[k] === 'object') state[k] = obj[k]; });
        persist();
        buildSidebar(); updateTopbar(); route();
        confettiBurst(120);
        toast('✅', 'Postup úspešne načítaný zo zálohy!');
      } catch (e) {
        toast('⚠️', 'Súbor sa nepodarilo načítať — nie je to platná záloha postupu.');
      }
    };
    reader.readAsText(file);
  }

  // Pri štarte preventívne zisti, či úložisko vôbec píše.
  function probeStorage() {
    try {
      const k = STORE_KEY + ':probe';
      localStorage.setItem(k, '1');
      localStorage.removeItem(k);
    } catch (e) { storageOK = false; warnNoStorage(); }
  }

  /* ----------------------------------------------------------
     LEVELY + ODZNAKY
     ---------------------------------------------------------- */
  const LEVELS = [
    { xp: 0,    name: 'Nováčik',          icon: '🐣' },
    { xp: 150,  name: 'Učeň promptov',    icon: '📜' },
    { xp: 400,  name: 'Chain Builder',    icon: '⛓️' },
    { xp: 800,  name: 'Tool Master',      icon: '🧰' },
    { xp: 1300, name: 'RAG Architekt',    icon: '📚' },
    { xp: 2000, name: 'Agent Commander',  icon: '🤖' },
    { xp: 2800, name: 'LangChain Guru',   icon: '🦜' },
  ];
  function levelIndex(xp) {
    let i = 0;
    LEVELS.forEach((l, idx) => { if (xp >= l.xp) i = idx; });
    return i;
  }

  const BADGES = [
    { id: 'b_first', icon: '👣', name: 'Prvé kroky', desc: 'Dokonči svoju prvú lekciu.',
      test: () => state.done.length >= 1 },
    { id: 'b_s1', icon: '🧱', name: 'Staviteľ základov', desc: 'Dokonči celú sekciu Základy LangChain.',
      test: () => sectionDone('s1') },
    { id: 'b_s2', icon: '📚', name: 'RAG inžinier', desc: 'Dokonči celú sekciu RAG.',
      test: () => sectionDone('s2') },
    { id: 'b_s3', icon: '💬', name: 'Krotiteľ chatbotov', desc: 'Dokonči celú sekciu ChatBoty.',
      test: () => sectionDone('s3') },
    { id: 'b_s4', icon: '🚀', name: 'Deployment hrdina', desc: 'Dokonči celú sekciu Nasadenie a nástroje.',
      test: () => sectionDone('s4') },
    { id: 'b_half', icon: '🌗', name: 'V polovici cesty', desc: 'Dokonči aspoň 12 lekcií.',
      test: () => state.done.length >= 12 },
    { id: 'b_all', icon: '🎓', name: 'Absolvent', desc: 'Dokonči úplne všetky lekcie v akadémii.',
      test: () => state.done.length >= LESSON_ORDER.length },
    { id: 'b_quiz', icon: '🧠', name: 'Kvízový génius', desc: 'Odpovedz správne na 30 kvízových otázok (na prvý pokus).',
      test: () => Object.values(state.quiz).filter(v => v === 'ok').length >= 30 },
    { id: 'b_ex', icon: '💪', name: 'Praktik', desc: 'Vyrieš 20 cvičení bez zobrazenia riešenia.',
      test: () => Object.values(state.ex).filter(v => v === 'ok').length >= 20 },
    { id: 'b_xp', icon: '⚡', name: 'Zberač XP', desc: 'Nazbieraj 1500 XP.',
      test: () => state.xp >= 1500 },
    { id: 'b_exam', icon: '🏅', name: 'Skúškový majster', desc: 'Záverečný test na 90 % a viac.',
      test: () => state.examBest >= window.EXAM.badgeScore },
    { id: 'b_cap', icon: '🏗️', name: 'Projektový architekt', desc: 'Dokonči všetky kroky záverečného projektu.',
      test: () => state.cap.length >= window.CAPSTONE.steps.length },
    { id: 'b_p5', icon: '🔨', name: 'Prvé projekty', desc: 'Dokonči 5 tréningových projektov.',
      test: () => state.proj.length >= 5 },
    { id: 'b_p15', icon: '🛠️', name: 'Dielňa beží', desc: 'Dokonči 15 tréningových projektov.',
      test: () => state.proj.length >= 15 },
    { id: 'b_p30', icon: '🚢', name: 'Kapitán portfólia', desc: 'Dokonči všetkých 30 tréningových projektov.',
      test: () => state.proj.length >= window.PROJECTS.items.length },
  ];
  function sectionDone(sid) {
    const sec = COURSE.sections.find(s => s.id === sid);
    return sec.lessons.every(l => state.done.includes(l));
  }
  function checkBadges() {
    BADGES.forEach(b => {
      if (!state.badges.includes(b.id) && b.test()) {
        state.badges.push(b.id);
        persist();
        toast(b.icon, `Nový odznak: <b>${b.name}</b>!`);
        confettiBurst(120);
      }
    });
  }

  /* ----------------------------------------------------------
     XP / TOASTY / KONFETY / LEVEL-UP
     ---------------------------------------------------------- */
  function addXP(amount, anchorEl) {
    const before = levelIndex(state.xp);
    state.xp += amount;
    persist();
    updateTopbar();
    const pill = document.getElementById('xpPill');
    pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump');
    // plávajúce +XP
    const float = document.createElement('div');
    float.className = 'xp-float';
    float.textContent = `+${amount} XP`;
    const rect = (anchorEl || pill).getBoundingClientRect();
    float.style.left = (rect.left + rect.width / 2 - 30) + 'px';
    float.style.top = (rect.top - 8) + 'px';
    document.body.appendChild(float);
    setTimeout(() => float.remove(), 1500);

    const after = levelIndex(state.xp);
    if (after > before) showLevelUp(after);
    checkBadges();
  }

  function showLevelUp(idx) {
    const l = LEVELS[idx];
    document.getElementById('levelupEmoji').textContent = l.icon;
    document.getElementById('levelupText').innerHTML =
      `Dosiahol si level <b>${idx + 1} — ${l.name}</b>! Len tak ďalej! 💪`;
    document.getElementById('levelupOverlay').classList.add('show');
    confettiBurst(220);
  }

  function toast(icon, html) {
    const zone = document.getElementById('toastZone');
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span class="toast-ico">${icon}</span><span>${html}</span>`;
    zone.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 450); }, 3400);
  }

  // — konfety —
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let confettiRunning = false;
  function sizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
  sizeCanvas(); addEventListener('resize', sizeCanvas);
  const CONF_COLORS = ['#2383e2', '#448361', '#cb912f', '#d44c47', '#9065b0', '#337ea9'];
  function confettiBurst(n) {
    for (let i = 0; i < n; i++) {
      particles.push({
        x: innerWidth / 2 + (Math.random() - .5) * innerWidth * .5,
        y: innerHeight * .25 + Math.random() * 40,
        vx: (Math.random() - .5) * 11,
        vy: -(Math.random() * 9 + 3),
        g: .22 + Math.random() * .12,
        s: 5 + Math.random() * 6,
        r: Math.random() * Math.PI,
        vr: (Math.random() - .5) * .3,
        c: CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)],
        life: 110 + Math.random() * 50
      });
    }
    if (!confettiRunning) { confettiRunning = true; confettiTick(); }
  }
  function confettiTick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.life > 0 && p.y < innerHeight + 30);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= .99; p.r += p.vr; p.life--;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.globalAlpha = Math.min(1, p.life / 40);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .62);
      ctx.restore();
    });
    if (particles.length) requestAnimationFrame(confettiTick);
    else { confettiRunning = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }

  /* ----------------------------------------------------------
     TOPBAR + SIDEBAR
     ---------------------------------------------------------- */
  function updateTopbar() {
    document.getElementById('xpValue').textContent = state.xp;
    const idx = levelIndex(state.xp);
    document.getElementById('levelChip').innerHTML =
      `${LEVELS[idx].icon} <span class="lvl-num">LVL ${idx + 1}</span> ${LEVELS[idx].name}`;
    const pct = Math.round(state.done.length / LESSON_ORDER.length * 100);
    const circ = 2 * Math.PI * 18;
    const fg = document.getElementById('ringMiniFg');
    fg.style.strokeDasharray = circ;
    fg.style.strokeDashoffset = circ * (1 - pct / 100);
    document.getElementById('ringMiniLabel').textContent = pct + '%';
  }

  function buildSidebar() {
    const nav = document.getElementById('sideNav');
    let html = `<a class="side-home" data-route href="#/dashboard">🏠 <span>Domov / Dashboard</span></a>`;
    COURSE.sections.forEach(sec => {
      const doneCnt = sec.lessons.filter(l => state.done.includes(l)).length;
      html += `
      <div class="side-section" data-sec="${sec.id}">
        <div class="side-section-head" data-action="toggle-section" data-sec="${sec.id}">
          <span class="side-section-icon">${sec.icon}</span>
          <span class="side-section-title">${sec.title}</span>
          <span class="side-section-prog ${doneCnt === sec.lessons.length ? 'full' : ''}">${doneCnt}/${sec.lessons.length}</span>
          <span class="side-caret">▼</span>
        </div>
        <div class="side-lessons">`;
      sec.lessons.forEach(lid => {
        const l = COURSE.lessons[lid];
        const done = state.done.includes(lid);
        html += `
          <a class="side-lesson ${done ? 'done' : ''}" data-route data-lid="${lid}" href="#/lesson/${lid}">
            <span class="side-check">${done ? '✓' : l.num}</span>
            <span class="side-lesson-title">${l.title}</span>
            <span class="side-lesson-dur">${l.duration}</span>
          </a>`;
      });
      html += `</div></div>`;
    });
    html += `
      <div class="side-special">
        <a class="side-lesson" data-route href="#/exam"><span class="side-check">${state.examPassed ? '✓' : '🏁'}</span> Záverečný test</a>
        <a class="side-lesson" data-route href="#/project"><span class="side-check">${state.cap.length >= window.CAPSTONE.steps.length ? '✓' : '🏗️'}</span> Záverečný projekt</a>
        <a class="side-lesson" data-route href="#/practice"><span class="side-check">💼</span> Tréningové projekty <span class="side-lesson-dur">${state.proj.length}/${window.PROJECTS.items.length}</span></a>
        <a class="side-lesson" data-route href="#/cheatsheet"><span class="side-check">📋</span> Ťahák</a>
        <a class="side-lesson" data-route href="#/badges"><span class="side-check">🏆</span> Odznaky <span class="side-lesson-dur">${state.badges.length}/${BADGES.length}</span></a>
        <button class="side-lesson side-btn" data-action="export-progress"><span class="side-check">💾</span> <span class="side-lesson-title">Exportovať postup</span></button>
        <button class="side-lesson side-btn" data-action="import-progress"><span class="side-check">⬆️</span> <span class="side-lesson-title">Importovať postup</span></button>
      </div>`;
    nav.innerHTML = html;
    markActiveSidebar();
  }

  function markActiveSidebar() {
    const hash = location.hash || '#/dashboard';
    document.querySelectorAll('#sideNav a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === hash);
    });
    document.querySelector('.side-home')?.classList.toggle('active', hash === '#/dashboard');
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL
     ---------------------------------------------------------- */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.06 });
  function observeReveals() {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
  }

  /* ----------------------------------------------------------
     PYCHARM SIMULÁTOR
     ---------------------------------------------------------- */
  const PC = {}; // uid -> {files, output, active, terminal, typing}
  let pcUid = 0;

  function fileIcon(name) {
    if (name.endsWith('.py')) return '🐍';
    if (name === '.env') return '🔑';
    if (name === 'Terminal') return '⌨️';
    if (name.endsWith('.txt')) return '📄';
    return '📄';
  }

  function pycharmHTML(block) {
    const uid = 'pc' + (++pcUid);
    const activeIdx = Math.max(0, block.files.findIndex(f => f.active));
    PC[uid] = { files: block.files, output: block.output || '', active: activeIdx, terminal: !!block.terminal, timer: null };
    const f = block.files[activeIdx];
    return `
    <div class="pycharm reveal" id="${uid}">
      <div class="pc-titlebar">
        <div class="pc-dots"><span class="pc-dot r"></span><span class="pc-dot y"></span><span class="pc-dot g"></span></div>
        <div class="pc-title">langchain_kurz – <b>${escapeHtml(f.name)}</b> — ${escapeHtml(block.title || 'PyCharm')}</div>
        <div class="pc-copy"><button class="pc-copy-btn" data-action="pc-copy" data-pc="${uid}">📋 Kopírovať kód</button></div>
      </div>
      <div class="pc-menubar">
        <span>File</span><span>Edit</span><span>View</span><span>Navigate</span><span>Code</span><span>Refactor</span><span>Run</span><span>Tools</span><span>VCS</span><span>Window</span><span>Help</span>
        <div class="pc-run-zone">
          <span class="pc-run-config">⚙ <span class="pc-run-config-name">${escapeHtml(f.name)}</span></span>
          <button class="pc-run-btn pulse-hint" data-action="pc-run" data-pc="${uid}" title="Spustiť (⌃R)"><span class="tri"></span></button>
          <span class="pc-stop-btn"></span>
        </div>
      </div>
      <div class="pc-body">
        <div class="pc-project">
          <div class="pc-project-head">📂 PROJECT</div>
          <div class="pc-tree-item"><span class="ti">📁</span> langchain_kurz</div>
          <div class="pc-tree-item" style="padding-left:24px; opacity:.55"><span class="ti">📁</span> .venv</div>
          ${block.files.map((file, i) => `
            <div class="pc-tree-item ${i === activeIdx ? 'active-file' : ''}" data-action="pc-tab" data-pc="${uid}" data-i="${i}" style="padding-left:24px; cursor:pointer">
              <span class="ti">${fileIcon(file.name)}</span> ${escapeHtml(file.name)}
            </div>`).join('')}
        </div>
        <div class="pc-editor-zone">
          <div class="pc-tabs">
            ${block.files.map((file, i) => `
              <div class="pc-tab ${i === activeIdx ? 'active' : ''}" data-action="pc-tab" data-pc="${uid}" data-i="${i}">
                <span class="tab-ico">${fileIcon(file.name)}</span>${escapeHtml(file.name)}
              </div>`).join('')}
          </div>
          <div class="pc-editor">${editorHTML(f.code)}</div>
        </div>
      </div>
      <div class="pc-console" data-console="${uid}">
        <div class="pc-console-head"><span class="run-ico">${block.terminal ? '⌨️' : '▶'}</span> ${block.terminal ? 'Terminal' : 'Run: ' + escapeHtml(f.name)}</div>
        <div class="pc-console-body"></div>
      </div>
      ${block.note ? `<div class="pc-note">💡 ${block.note}</div>` : ''}
      <div class="pc-statusbar">
        <span>${block.terminal ? 'zsh' : 'Run ⌄'}</span>
        <div class="sb-right"><span>UTF-8</span><span>4 spaces</span><span>Python 3.12 (langchain_kurz)</span></div>
      </div>
    </div>`;
  }

  function editorHTML(code) {
    const lines = code.split('\n').length;
    let gutter = '';
    for (let i = 1; i <= lines; i++) gutter += i + '\n';
    return `<div class="pc-gutter">${gutter}</div><div class="pc-code">${highlightPython(code)}</div>`;
  }

  function pcSwitchTab(uid, i) {
    const pc = PC[uid];
    pc.active = i;
    const root = document.getElementById(uid);
    const f = pc.files[i];
    root.querySelectorAll('.pc-tab').forEach((t, ti) => t.classList.toggle('active', ti === i));
    root.querySelectorAll('.pc-tree-item[data-action]').forEach((t, ti) => t.classList.toggle('active-file', ti === i));
    root.querySelector('.pc-editor').innerHTML = editorHTML(f.code);
    root.querySelector('.pc-run-config-name').textContent = f.name;
    root.querySelector('.pc-title').innerHTML = `langchain_kurz – <b>${escapeHtml(f.name)}</b>`;
  }

  function pcRun(uid) {
    const pc = PC[uid];
    const root = document.getElementById(uid);
    const consoleEl = root.querySelector('.pc-console');
    const body = consoleEl.querySelector('.pc-console-body');
    const runBtn = root.querySelector('.pc-run-btn');
    runBtn.classList.remove('pulse-hint');
    if (pc.timer) { clearInterval(pc.timer); pc.timer = null; }

    consoleEl.classList.add('open');
    body.innerHTML = '';

    // hlavička behu
    if (!pc.terminal) {
      const path = document.createElement('span');
      path.className = 'con-path';
      const fname = pc.files[pc.active].name;
      path.textContent = `/Users/student/PycharmProjects/langchain_kurz/.venv/bin/python ${fname}`;
      body.appendChild(path);
      body.appendChild(document.createTextNode('\n'));
    }
    const out = document.createTextNode('');
    body.appendChild(out);
    const cursor = document.createElement('span');
    cursor.className = 'con-cursor';
    body.appendChild(cursor);

    const text = pc.output;
    let i = 0;
    const finish = () => {
      clearInterval(pc.timer); pc.timer = null;
      out.textContent = text;
      cursor.remove();
      const tail = document.createElement('span');
      if (pc.terminal) {
        tail.className = 'con-dim';
        tail.textContent = '\n\n(.venv) langchain_kurz % ';
      } else {
        tail.className = 'con-ok';
        tail.textContent = '\n\nProcess finished with exit code 0';
      }
      body.appendChild(tail);
      body.scrollTop = body.scrollHeight;
    };
    body.onclick = () => { if (pc.timer) finish(); };
    pc.timer = setInterval(() => {
      const step = 1 + Math.floor(Math.random() * 3);
      i = Math.min(text.length, i + step);
      out.textContent = text.slice(0, i);
      body.scrollTop = body.scrollHeight;
      if (i >= text.length) finish();
    }, 14);
  }

  /* ----------------------------------------------------------
     RENDER BLOKOV TEÓRIE
     ---------------------------------------------------------- */
  const BOX_ICONS = { info: 'ℹ️', warn: '⚠️', tip: '💡', key: '🔑', py: '🐍' };
  const BOX_TITLES = { info: 'Dobré vedieť', warn: 'Pozor', tip: 'Pro tip', key: 'Kľúčová myšlienka', py: 'Python okienko' };

  function blockHTML(b) {
    switch (b.t) {
      case 'h': return `<h2 class="reveal">${b.x}</h2>`;
      case 'p': return `<p class="reveal">${b.x}</p>`;
      case 'ul': return `<ul class="t-list reveal">${b.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
      case 'box': return `
        <div class="box box-${b.kind} reveal">
          <div class="box-ico">${BOX_ICONS[b.kind]}</div>
          <div><div class="box-title">${b.title || BOX_TITLES[b.kind]}</div>
          <div class="box-body">${b.x}</div></div>
        </div>`;
      case 'table': return `
        <table class="t-table reveal">
          <thead><tr>${b.head.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>`;
      case 'flow': return `
        <div class="flow reveal">${b.steps.map((s, i) =>
          `<div class="flow-step">${i ? '<span class="flow-arrow">➜</span>' : ''}<div class="flow-chip">${s}</div></div>`).join('')}
        </div>`;
      case 'compare': return `
        <div class="compare reveal">
          <div class="compare-card a"><h4>${b.a.title}</h4><ul>${b.a.items.map(i => `<li>${i}</li>`).join('')}</ul></div>
          <div class="compare-card b"><h4>${b.b.title}</h4><ul>${b.b.items.map(i => `<li>${i}</li>`).join('')}</ul></div>
        </div>`;
      case 'pycharm': return pycharmHTML(b);
      case 'explain': return explainHTML(b);
      default: return '';
    }
  }

  // Rozbor kódu riadok po riadku — pre menej znalých Pythonu
  function explainHTML(b) {
    return `
    <div class="explain-card reveal">
      <div class="explain-head">🔍 ${b.title || 'Rozbor kódu — riadok po riadku'}</div>
      <div class="explain-sub">Čo presne znamenajú jednotlivé časti kódu vyššie:</div>
      ${b.rows.map(r => `
        <div class="explain-row">
          <code class="explain-code">${highlightPython(r[0])}</code>
          <div class="explain-text">${r[1]}</div>
        </div>`).join('')}
    </div>`;
  }

  // Vloží do lekcie rozbor kódu (CODE_EXPLAIN) a Python okienka (PY_NOTES)
  // za príslušný PyCharm blok — bez zásahu do pôvodných dát lekcie.
  function buildBlocks(l) {
    const ex = (window.CODE_EXPLAIN || {})[l.id];
    const notes = (window.PY_NOTES || {})[l.id] || [];
    if (!ex && !notes.length) return l.blocks;
    const out = [];
    let pcIdx = -1;
    l.blocks.forEach(b => {
      out.push(b);
      if (b.t === 'pycharm') {
        pcIdx++;
        if (ex && ex.pc === pcIdx) out.push({ t: 'explain', title: ex.title, rows: ex.rows });
        notes.filter(n => n.pc === pcIdx).forEach(n => out.push({ t: 'box', kind: 'py', title: n.title, x: n.x }));
      }
    });
    return out;
  }

  /* ----------------------------------------------------------
     KVÍZ
     ---------------------------------------------------------- */
  function quizHTML(lesson) {
    if (!lesson.quiz || !lesson.quiz.length) return '';
    let html = `
    <section class="quiz-zone">
      <div class="zone-head reveal">
        <div class="zh-icon">🧠</div>
        <div><h2>Kvíz — over si pochopenie</h2>
        <p>Správna odpoveď na prvý pokus = <b>+10 XP</b>. Vysvetlenie sa zobrazí po odpovedi.</p></div>
      </div>`;
    lesson.quiz.forEach((q, qi) => {
      const key = `q:${lesson.id}:${qi}`;
      const answered = state.quiz[key];
      html += `
      <div class="quiz-card reveal ${answered === 'ok' ? 'answered-ok' : answered ? 'answered-bad' : ''}" data-quiz="${lesson.id}:${qi}">
        <div class="quiz-q"><span class="q-num">${qi + 1}.</span><span>${q.q}</span></div>
        <div class="quiz-opts">
          ${q.opts.map((o, oi) => {
            let cls = '';
            if (answered) {
              if (oi === q.correct) cls = 'correct';
            }
            return `<button class="quiz-opt ${cls}" data-action="quiz-opt" data-l="${lesson.id}" data-q="${qi}" data-i="${oi}" ${answered ? 'disabled' : ''}>
              <span class="opt-letter">${String.fromCharCode(65 + oi)}</span><span>${o}</span>
            </button>`;
          }).join('')}
        </div>
        <div class="quiz-explain ${answered ? 'show' : ''}"><b>Vysvetlenie:</b> ${q.explain}</div>
      </div>`;
    });
    return html + '</section>';
  }

  function answerQuiz(lid, qi, oi, btn) {
    const key = `q:${lid}:${qi}`;
    if (state.quiz[key]) return;
    const q = COURSE.lessons[lid].quiz[qi];
    const card = btn.closest('.quiz-card');
    const opts = card.querySelectorAll('.quiz-opt');
    opts.forEach(o => o.disabled = true);
    const ok = oi === q.correct;
    opts[q.correct].classList.add('correct');
    if (!ok) btn.classList.add('wrong');
    card.classList.add(ok ? 'answered-ok' : 'answered-bad');
    card.querySelector('.quiz-explain').classList.add('show');
    state.quiz[key] = ok ? 'ok' : 'fail';
    persist();
    if (ok) addXP(10, btn);
    else toast('🤔', 'Nevadí — prečítaj si vysvetlenie a ideš ďalej!');
    checkBadges();
  }

  /* ----------------------------------------------------------
     CVIČENIA
     ---------------------------------------------------------- */
  const EX = {}; // uid -> {lesson, idx, data, order:{pool, answer}}
  let exUid = 0;
  const EX_LABELS = { blanks: '🧩 Doplň kód', order: '🔀 Zoraď', write: '⌨️ Napíš kód' };

  // Zlúči cvičenia lekcie s extra „Napíš kód" sadou (practice1-3.js).
  // Extra cvičenia idú ZA pôvodné (indexy uloženého postupu sa nemenia)
  // a XP + úvod dostávajú podľa poradia: 1-3 ľahké, 4-6 stredné, 7-9 ťažké.
  const EXTRA_INTRO = [
    'Rozcvička — základný vzor, ktorý musíš mať v prstoch.',
    'Stredná obtiažnosť — skombinuj viac krokov dokopy.',
    'Výzva — poskladaj to ako v skutočnom projekte.'
  ];
  function allExercises(lesson) {
    const base = lesson.exercises || [];
    const extra = ((window.EXTRA_WRITE || {})[lesson.id] || []).map((e, i) => ({
      ...e,
      intro: e.intro || EXTRA_INTRO[i < 3 ? 0 : i < 6 ? 1 : 2],
      xp: e.xp || (i < 3 ? 10 : i < 6 ? 15 : 20),
    }));
    return base.concat(extra);
  }

  function exercisesHTML(lesson) {
    lesson = { id: lesson.id, exercises: allExercises(lesson) };
    if (!lesson.exercises || !lesson.exercises.length) return '';
    let html = `
    <section class="ex-zone">
      <div class="zone-head reveal">
        <div class="zh-icon">🏋️</div>
        <div><h2>Praktické cvičenia</h2>
        <p>Vyrieš úlohy ako v PyCharme. Pomôcka je zadarmo. Riešenie si môžeš kedykoľvek pozrieť a úlohu aj tak odovzdať — len za polovičné XP.</p></div>
      </div>`;
    lesson.exercises.forEach((ex, ei) => {
      const uid = 'ex' + (++exUid);
      const key = `e:${lesson.id}:${ei}`;
      let solved = state.ex[key];
      const reg = EX[uid] = { lesson: lesson.id, idx: ei, data: ex, key };
      // Spätná oprava: write cvičenia zamknuté STAROU logikou „Ukázať riešenie"
      // (stav 'revealed') odomkni — riešenie už videl, odovzdanie dá polovičné XP.
      if (ex.t === 'write' && solved === 'revealed') {
        reg.revealed = true;
        solved = null;
      }
      html += `<div class="ex-card reveal ${solved ? 'solved' : ''}" id="${uid}">
        <div class="ex-head">
          <span class="ex-type-badge">${EX_LABELS[ex.t]}</span>
          <h3>${ex.title}</h3>
          <span class="ex-solved-flag">✓ Vyriešené ${solved === 'ok' ? `(+${ex.xp} XP)` : solved === 'ok2' ? `(+${Math.ceil(ex.xp / 2)} XP)` : ''}</span>
        </div>
        <div class="ex-intro">${ex.intro}</div>
        <div class="ex-body">${exBodyHTML(uid, ex, solved)}</div>
      </div>`;
    });
    return html + '</section>';
  }

  function exBodyHTML(uid, ex, solved) {
    if (ex.t === 'blanks') {
      const code = highlightWithBlanks(ex.code, n => {
        const ans = ex.blanks[n][0];
        const size = Math.max(ans.length, 4);
        return `<input class="blank-input ${solved ? 'ok' : ''}" data-uid="${uid}" data-n="${n}" size="${size}"
          value="${solved ? escapeHtml(ans) : ''}" ${solved ? 'disabled' : ''} autocomplete="off" spellcheck="false">`;
      });
      return `
        <div class="blanks-code">${code}</div>
        <div class="ex-actions">
          <button class="btn btn-primary btn-sm" data-action="ex-check-blanks" data-uid="${uid}" ${solved ? 'disabled' : ''}>✓ Skontrolovať</button>
          <button class="btn btn-ghost btn-sm" data-action="ex-hint" data-uid="${uid}">💡 Pomôcka</button>
          <button class="btn btn-ghost btn-sm" data-action="ex-reveal-blanks" data-uid="${uid}" ${solved ? 'disabled' : ''}>👁 Ukázať riešenie</button>
        </div>
        <div class="hint-box" data-hint="${uid}">💡 ${ex.hint || ''}</div>
        <div class="ex-success ${solved ? 'show' : ''}" data-success="${uid}">🎉 Správne! Kód je kompletný.</div>`;
    }
    if (ex.t === 'order') {
      const reg = EX[uid];
      if (!solved) {
        reg.pool = shuffle(ex.items.map((_, i) => i));
        reg.answer = [];
      } else {
        reg.pool = [];
        reg.answer = ex.items.map((_, i) => i);
      }
      return `
        <div class="order-label">Klikaj na položky v správnom poradí:</div>
        <div class="order-pool" data-pool="${uid}">${orderPoolHTML(uid)}</div>
        <div class="order-label">Tvoje poradie:</div>
        <div class="order-answer ${solved ? 'ok' : ''}" data-answer="${uid}">${orderAnswerHTML(uid)}</div>
        <div class="ex-actions">
          <button class="btn btn-primary btn-sm" data-action="ex-check-order" data-uid="${uid}" ${solved ? 'disabled' : ''}>✓ Skontrolovať</button>
          <button class="btn btn-ghost btn-sm" data-action="ex-reset-order" data-uid="${uid}" ${solved ? 'disabled' : ''}>↺ Reset</button>
        </div>
        <div class="ex-success ${solved ? 'show' : ''}" data-success="${uid}">🎉 Presne tak! Poradie je správne.</div>`;
    }
    if (ex.t === 'write') {
      // ✅ Presná špecifikácia: checklist vygenerovaný z kontrolných tokenov —
      // používateľ presne vidí, ČO musí jeho kód obsahovať.
      const chips = (ex.must || [])
        .map(alts => `<code>${escapeHtml(alts[0])}</code>`)
        .join('<span class="wt-sep">·</span>');
      // 🪜 „Ako začať": prvá polovica riešenia (max 3 riadky) ako odrazový mostík
      const riadky = (ex.solution || '').split('\n').filter(l => l.trim().length);
      const kostra = riadky.slice(0, Math.min(3, Math.max(1, Math.floor(riadky.length / 2)))).join('\n');
      return `
        <div class="write-task">
          <div class="wt-label">🎯 Zadanie</div>
          <div class="wt-text">${ex.task}</div>
          <div class="wt-check">
            <span class="wt-check-label">✅ Skontrolovať prejde, keď kód obsahuje:</span>
            <span class="wt-chips">${chips}</span>
          </div>
        </div>
        <div class="write-editor">
          <div class="write-editor-head">🐍 cvicenie.py — napíš svoj kód</div>
          <textarea class="write-area" data-write="${uid}" spellcheck="false">${escapeHtml(ex.starter || '')}</textarea>
        </div>
        <div class="ex-actions">
          <button class="btn btn-primary btn-sm" data-action="ex-check-write" data-uid="${uid}" ${solved ? 'disabled' : ''}>✓ Skontrolovať</button>
          <button class="btn btn-ghost btn-sm" data-action="ex-hint" data-uid="${uid}">💡 Pomôcka</button>
          <button class="btn btn-ghost btn-sm" data-action="ex-hint2" data-uid="${uid}">🪜 Ako začať</button>
          <button class="btn btn-ghost btn-sm" data-action="ex-show-solution" data-uid="${uid}">👁 Ukázať riešenie</button>
        </div>
        <div class="hint-box" data-hint="${uid}"><b>💡 Pomôcka:</b> ${ex.hint || ''}</div>
        <div class="hint-box hint-kostra" data-hint2="${uid}">
          <b>🪜 Začni takto</b> (prvé riadky riešenia — zvyšok doplň podľa zadania a checklistu):
          <pre>${highlightPython(kostra)}</pre>
        </div>
        <div class="write-feedback" data-feedback="${uid}"></div>
        <div class="solution-box" data-solution="${uid}">
          <div class="sol-label">Vzorové riešenie</div>
          <pre>${highlightPython(ex.solution || '')}</pre>
        </div>
        <div class="ex-success ${solved ? 'show' : ''}" data-success="${uid}">🎉 Výborne! Kód obsahuje všetky kľúčové prvky.</div>`;
    }
    return '';
  }

  function orderPoolHTML(uid) {
    const reg = EX[uid];
    if (!reg.pool.length) return `<span class="order-empty-hint">— prázdne —</span>`;
    return reg.pool.map(i =>
      `<button class="order-item" data-action="ex-order-pick" data-uid="${uid}" data-i="${i}">${reg.data.items[i]}</button>`
    ).join('');
  }
  function orderAnswerHTML(uid) {
    const reg = EX[uid];
    if (!reg.answer.length) return `<span class="order-empty-hint">Klikni na položky hore…</span>`;
    return reg.answer.map((i, pos) =>
      `<button class="order-item" data-action="ex-order-unpick" data-uid="${uid}" data-pos="${pos}"><span class="oi-num">${pos + 1}.</span>${reg.data.items[i]}</button>`
    ).join('');
  }
  function refreshOrder(uid) {
    document.querySelector(`[data-pool="${uid}"]`).innerHTML = orderPoolHTML(uid);
    document.querySelector(`[data-answer="${uid}"]`).innerHTML = orderAnswerHTML(uid);
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    // nech nikdy nezačína v správnom poradí
    if (a.length > 2 && a.every((v, i) => v === i)) return shuffle(arr);
    return a;
  }

  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
  function noSpace(s) { return s.replace(/\s+/g, ''); }

  function solveExercise(uid, how, anchor) {
    const reg = EX[uid];
    const stored = state.ex[reg.key];
    // Hotové cvičenie sa nerieši znova — VÝNIMKA: staré write 'revealed'
    // (zamknuté starou logikou) sa smie dodatočne odovzdať.
    if (stored && !(stored === 'revealed' && reg.data.t === 'write' && how === 'ok')) return;
    if (how === 'ok' && reg.revealed) how = 'ok2'; // vyriešené po zobrazení riešenia → polovičné XP
    state.ex[reg.key] = how; // 'ok' | 'ok2' | 'revealed'
    persist();
    const card = document.getElementById(uid);
    card.classList.add('solved');
    card.querySelector('.ex-success')?.classList.add('show');
    const flag = card.querySelector('.ex-solved-flag');
    if (flag && (how === 'ok' || how === 'ok2')) {
      const plneXP = reg.data.xp || 20;
      flag.textContent = `✓ Vyriešené (+${how === 'ok' ? plneXP : Math.ceil(plneXP / 2)} XP)`;
    }
    card.querySelectorAll('[data-action="ex-check-blanks"],[data-action="ex-check-order"],[data-action="ex-check-write"],[data-action="ex-reveal-blanks"],[data-action="ex-reset-order"]').forEach(b => b.disabled = true);
    if (how === 'ok') {
      addXP(reg.data.xp || 20, anchor);
      confettiBurst(46);
    } else if (how === 'ok2') {
      addXP(Math.ceil((reg.data.xp || 20) / 2), anchor);
      confettiBurst(28);
      toast('✅', 'Vyriešené s nahliadnutím do riešenia — polovičné XP. Nabudúce to dáš aj bez neho! 💪');
    } else {
      toast('👁', 'Riešenie zobrazené — XP tentoraz nebude, ale hlavné je pochopiť!');
    }
    checkBadges();
  }

  function checkBlanks(uid, btn) {
    const reg = EX[uid];
    const inputs = [...document.querySelectorAll(`.blank-input[data-uid="${uid}"]`)];
    let allOk = true;
    inputs.forEach(inp => {
      const n = +inp.dataset.n;
      const accepted = reg.data.blanks[n].map(a => norm(a));
      const val = norm(inp.value);
      const ok = accepted.includes(val);
      inp.classList.remove('ok', 'bad');
      void inp.offsetWidth;
      inp.classList.add(ok ? 'ok' : 'bad');
      if (ok) inp.disabled = true; else allOk = false;
    });
    if (allOk) solveExercise(uid, 'ok', btn);
  }

  function revealBlanks(uid) {
    const reg = EX[uid];
    document.querySelectorAll(`.blank-input[data-uid="${uid}"]`).forEach(inp => {
      inp.value = reg.data.blanks[+inp.dataset.n][0];
      inp.classList.remove('bad'); inp.classList.add('ok');
      inp.disabled = true;
    });
    solveExercise(uid, 'revealed');
  }

  function checkOrder(uid, btn) {
    const reg = EX[uid];
    const answerEl = document.querySelector(`[data-answer="${uid}"]`);
    if (reg.answer.length !== reg.data.items.length) {
      answerEl.classList.remove('bad'); void answerEl.offsetWidth; answerEl.classList.add('bad');
      toast('🧩', 'Najprv presuň všetky položky do svojho poradia.');
      return;
    }
    const ok = reg.answer.every((v, i) => v === i);
    answerEl.classList.remove('ok', 'bad'); void answerEl.offsetWidth;
    answerEl.classList.add(ok ? 'ok' : 'bad');
    if (ok) {
      // zamkni položky
      answerEl.querySelectorAll('button').forEach(b => b.disabled = true);
      solveExercise(uid, 'ok', btn);
    } else {
      toast('🔀', 'Poradie ešte nesedí — skús premyslieť tok dát.');
    }
  }

  function checkWrite(uid, btn) {
    const reg = EX[uid];
    const area = document.querySelector(`.write-area[data-write="${uid}"]`);
    const code = area.value;
    const nCode = norm(code), nsCode = noSpace(code);
    const missing = [];
    reg.data.must.forEach(alts => {
      const hit = alts.some(tok => nCode.includes(norm(tok)) || nsCode.includes(noSpace(tok)));
      if (!hit) missing.push(alts[0]);
    });
    const fb = document.querySelector(`[data-feedback="${uid}"]`);
    if (!missing.length) {
      fb.className = 'write-feedback show good';
      fb.innerHTML = '✅ Všetky kľúčové prvky sú na mieste!';
      solveExercise(uid, 'ok', btn);
    } else {
      fb.className = 'write-feedback show miss';
      fb.innerHTML = `🔎 Dobrý začiatok! V kóde mi ešte chýba:<ul>${missing.map(m => `<li><code>${escapeHtml(m)}</code></li>`).join('')}</ul>`;
    }
  }

  /* ----------------------------------------------------------
     VIEW: LEKCIA
     ---------------------------------------------------------- */
  function renderLesson(lid) {
    const l = COURSE.lessons[lid];
    if (!l) return renderDashboard();
    const sec = COURSE.sections.find(s => s.id === l.section);
    const flatIdx = LESSON_ORDER.indexOf(lid);
    const prev = LESSON_ORDER[flatIdx - 1];
    const next = LESSON_ORDER[flatIdx + 1];
    const done = state.done.includes(lid);

    let html = `
      <div class="lesson-top">
        <a href="#/dashboard" data-route style="color:inherit;text-decoration:none">🏠 Dashboard</a>
        <span class="crumb-sep">›</span><span>${sec.icon} ${sec.title}</span>
        <span class="crumb-sep">›</span><span>${typeof l.num === 'string' ? '🐍 Prípravná lekcia ' + l.num : (l.section === 's5' ? '🤖 Bonus · Lekcia ' + l.num : 'Lekcia ' + l.num + '/23')}</span>
        <span style="flex:1"></span>
        <span class="lesson-meta-chip">⏱ ${l.duration}</span>
        <span class="lesson-meta-chip">⚡ +${50 + (l.quiz?.length || 0) * 10 + allExercises(l).reduce((a, e) => a + (e.xp || 20), 0)} XP v hre</span>
      </div>
      <div class="lesson-header">
        <div class="lesson-header-icon">${l.icon}</div>
        <div>
          <h1>${l.num}. ${l.title}</h1>
          <p class="lesson-intro">${l.intro}</p>
        </div>
      </div>
      <div class="goals-card reveal">
        <h3>🎯 Po tejto lekcii budeš vedieť</h3>
        <ul>${l.goals.map(g => `<li>${g}</li>`).join('')}</ul>
      </div>
      <div class="theory">${buildBlocks(l).map(blockHTML).join('')}</div>
      ${quizHTML(l)}
      ${exercisesHTML(l)}
      <div class="lesson-finish reveal">
        ${done
          ? `<div class="done-state">✅ Lekcia dokončená! Skvelá práca.</div>
             ${next ? `<p style="margin-top:10px">Pokračuj ďalej:</p><a class="btn btn-primary" data-route href="#/lesson/${next}">${COURSE.lessons[next].icon} ${COURSE.lessons[next].title} →</a>`
                    : `<p style="margin-top:10px">Bola to posledná lekcia!</p><a class="btn btn-primary" data-route href="#/exam">🏁 Spustiť záverečný test</a>`}`
          : `<h3>Hotovo s teóriou aj cvičeniami?</h3>
             <p>Označ lekciu ako dokončenú a získaj <b>+50 XP</b>.</p>
             <button class="btn btn-primary" data-action="lesson-complete" data-l="${lid}">✓ Dokončiť lekciu (+50 XP)</button>`}
      </div>
      <div class="lesson-nav">
        ${prev ? `<a class="btn btn-ghost" data-route href="#/lesson/${prev}">← <span><span class="nav-title">Predchádzajúca</span>${COURSE.lessons[prev].title}</span></a>` : '<span></span>'}
        ${next ? `<a class="btn btn-ghost" data-route href="#/lesson/${next}" style="margin-left:auto; text-align:right"><span><span class="nav-title">Nasledujúca</span>${COURSE.lessons[next].title}</span> →</a>` : ''}
      </div>`;
    setView(html);
  }

  function completeLesson(lid, btn) {
    if (state.done.includes(lid)) return;
    state.done.push(lid);
    persist();
    addXP(50, btn);
    confettiBurst(150);
    toast('🎉', `Lekcia <b>${COURSE.lessons[lid].title}</b> dokončená!`);
    buildSidebar();
    updateTopbar();
    checkBadges();
    renderLesson(lid);
    // posuň pohľad na finish kartu
    setTimeout(() => document.querySelector('.lesson-finish')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  }

  /* ----------------------------------------------------------
     VIEW: DASHBOARD
     ---------------------------------------------------------- */
  const TYPE_WORDS = ['chatboty s pamäťou 💬', 'RAG aplikácie 📚', 'AI agenty 🤖', 'vektorové vyhľadávanie 🧭', 'aplikácie s ChatGPT ⚡'];
  let typeTimer = null;

  function renderDashboard() {
    const doneCnt = state.done.length;
    const exCnt = Object.values(state.ex).filter(v => v === 'ok' || v === 'ok2').length;
    const lvlIdx = levelIndex(state.xp);
    const nextLvl = LEVELS[lvlIdx + 1];
    const lvlProgress = nextLvl ? Math.round((state.xp - LEVELS[lvlIdx].xp) / (nextLvl.xp - LEVELS[lvlIdx].xp) * 100) : 100;
    const nextLesson = LESSON_ORDER.find(lid => !state.done.includes(lid));

    let html = `
    <div class="hero">
      <div class="hero-badge"><span class="dot"></span> Podľa kurzu Skillmea · 23 kapitol · 2 h 39 min · Marek Kučák</div>
      <h1>LangChain <span class="grad-text">Akadémia</span><br>Inteligentné aplikácie s ChatGPT</h1>
      <div class="hero-type">Nauč sa stavať <span class="typed" id="typeTarget"></span><span class="caret"></span></div>
      <div class="hero-actions">
        ${nextLesson
          ? `<a class="btn btn-primary" data-route href="#/lesson/${nextLesson}">${doneCnt ? '▶ Pokračovať: ' : '🚀 Začať kurz: '}${COURSE.lessons[nextLesson].title}</a>`
          : `<a class="btn btn-primary" data-route href="#/exam">🏁 Záverečný test</a>`}
        <a class="btn btn-ghost" data-route href="#/cheatsheet">📋 Ťahák</a>
        <a class="btn btn-ghost" data-route href="#/project">🏗️ Záverečný projekt</a>
      </div>
      <div class="hero-stats">
        <div class="stat-card"><div class="stat-num" data-count="${doneCnt}">0</div><div class="stat-label">z ${LESSON_ORDER.length} lekcií hotových</div></div>
        <div class="stat-card"><div class="stat-num" data-count="${state.xp}">0</div><div class="stat-label">získaných XP</div></div>
        <div class="stat-card"><div class="stat-num" data-count="${exCnt}">0</div><div class="stat-label">vyriešených cvičení</div></div>
        <div class="stat-card"><div class="stat-num" data-count="${state.badges.length}">0</div><div class="stat-label">odznakov z ${BADGES.length}</div></div>
      </div>
      <div class="level-progress">
        <div class="level-progress-head">
          <span>${LEVELS[lvlIdx].icon} Level ${lvlIdx + 1} — ${LEVELS[lvlIdx].name}</span>
          <span>${nextLvl ? `${state.xp} / ${nextLvl.xp} XP → ${nextLvl.name}` : 'MAX LEVEL 🎉'}</span>
        </div>
        <div class="level-bar"><div class="level-bar-fill" data-width="${lvlProgress}"></div></div>
      </div>
    </div>

    <div class="dash-section-title reveal"><span>🗺️ Mapa kurzu</span><span class="line"></span></div>
    <div class="section-grid">`;

    COURSE.sections.forEach(sec => {
      const dCnt = sec.lessons.filter(lid => state.done.includes(lid)).length;
      const pct = Math.round(dCnt / sec.lessons.length * 100);
      const circ = 2 * Math.PI * 24;
      html += `
      <div class="section-card reveal" style="--card-accent: ${sec.color}">
        <div class="section-card-head">
          <div class="section-card-icon">${sec.icon}</div>
          <div>
            <h3>${sec.title}</h3>
            <div class="section-sub">${sec.subtitle}</div>
          </div>
          <div class="section-card-ring" style="--ring-color:${sec.color}">
            <svg viewBox="0 0 58 58"><circle class="rbg" cx="29" cy="29" r="24"></circle>
            <circle class="rfg" cx="29" cy="29" r="24" data-ring="${circ * (1 - pct / 100)}"></circle></svg>
            <span>${pct}%</span>
          </div>
        </div>
        <div class="section-card-lessons">
          ${sec.lessons.map(lid => {
            const l = COURSE.lessons[lid];
            const d = state.done.includes(lid);
            return `<a class="lesson-chip ${d ? 'done' : ''}" data-route href="#/lesson/${lid}">${d ? '✓' : l.num + '.'} ${l.title.split('—')[0].split(' - ')[0].trim()}</a>`;
          }).join('')}
        </div>
      </div>`;
    });

    html += `</div>
    <div class="dash-section-title reveal"><span>🏆 Veľké výzvy</span><span class="line"></span></div>
    <div class="special-grid">
      <a class="special-card reveal" data-route href="#/exam">
        <div class="sc-icon">🏁</div><h3>Záverečný test</h3>
        <p>${window.EXAM.questions.length} otázok naprieč celým kurzom. Na absolvovanie potrebuješ ${window.EXAM.passScore} %.</p>
        <div class="sc-meta">${state.examBest ? `Najlepší výsledok: ${state.examBest} % ${state.examPassed ? '· ✅ absolvované' : ''}` : 'Zatiaľ neabsolvované →'}</div>
      </a>
      <a class="special-card reveal" data-route href="#/project">
        <div class="sc-icon">🏗️</div><h3>Záverečný projekt</h3>
        <p>Firemný AI asistent: RAG + pamäť + Streamlit + LangSmith. Všetko z kurzu v jednej aplikácii.</p>
        <div class="sc-meta">${state.cap.length}/${window.CAPSTONE.steps.length} krokov hotových →</div>
      </a>
      <a class="special-card reveal" data-route href="#/practice">
        <div class="sc-icon">💼</div><h3>30 tréningových projektov</h3>
        <p>Praktické zadania od prvého chainu po nasadený RAG systém — od ⭐ po ⭐⭐⭐.</p>
        <div class="sc-meta">${state.proj.length}/${window.PROJECTS.items.length} hotových →</div>
      </a>
      <a class="special-card reveal" data-route href="#/badges">
        <div class="sc-icon">🏆</div><h3>Odznaky</h3>
        <p>Zbieraj ocenenia za pokrok, kvízy, cvičenia aj špeciálne výkony.</p>
        <div class="sc-meta">Odomknutých ${state.badges.length} z ${BADGES.length} →</div>
      </a>
    </div>`;
    setView(html);

    // typing efekt
    startTyping();
    // count-up štatistiky
    document.querySelectorAll('.stat-num[data-count]').forEach(el => countUp(el, +el.dataset.count));
    // progress bary a ringy
    requestAnimationFrame(() => {
      document.querySelectorAll('.level-bar-fill[data-width]').forEach(el => { el.style.width = el.dataset.width + '%'; });
      document.querySelectorAll('.rfg[data-ring]').forEach(el => { el.style.strokeDashoffset = el.dataset.ring; });
    });
  }

  function startTyping() {
    clearTimeout(typeTimer);
    const target = document.getElementById('typeTarget');
    if (!target) return;
    let wi = 0, ci = 0, deleting = false;
    function tick() {
      const word = TYPE_WORDS[wi % TYPE_WORDS.length];
      if (!document.getElementById('typeTarget')) return;
      if (!deleting) {
        ci++;
        target.textContent = word.slice(0, ci);
        if (ci >= word.length) { deleting = true; typeTimer = setTimeout(tick, 1900); return; }
        typeTimer = setTimeout(tick, 46 + Math.random() * 50);
      } else {
        ci--;
        target.textContent = word.slice(0, ci);
        if (ci <= 0) { deleting = false; wi++; typeTimer = setTimeout(tick, 350); return; }
        typeTimer = setTimeout(tick, 22);
      }
    }
    tick();
  }

  function countUp(el, target) {
    const dur = 900;
    const t0 = performance.now();
    function frame(t) {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ----------------------------------------------------------
     VIEW: ZÁVEREČNÝ TEST
     ---------------------------------------------------------- */
  let exam = null; // {idx, correct, answered}

  function renderExam() {
    const E = window.EXAM;
    if (!exam) {
      let html = `
      <div class="page-head">
        <h1>🏁 Záverečný test</h1>
        <p class="lead">${E.questions.length} otázok z celého kurzu (lekcie 1–23). Po každej odpovedi sa dozvieš správne riešenie.
        Na absolvovanie potrebuješ <b>${E.passScore} %</b>, na odznak Skúškový majster <b>${E.badgeScore} %</b>.</p>
      </div>
      <div class="special-grid" style="grid-template-columns:1fr 1fr; margin-top:26px">
        <div class="special-card reveal"><div class="sc-icon">📊</div><h3>Tvoj najlepší výsledok</h3>
          <p style="font-size:34px; font-weight:900; color:var(--text); margin-top:8px">${state.examBest ? state.examBest + ' %' : '—'}</p>
          <div class="sc-meta">${state.examPassed ? '✅ Test absolvovaný' : 'Zatiaľ neabsolvované'}</div></div>
        <div class="special-card reveal"><div class="sc-icon">🎁</div><h3>Odmeny</h3>
          <p>Prvé absolvovanie (≥${E.passScore} %): <b>+150 XP</b><br>Zlepšenie výsledku: <b>+1 XP za každé %</b><br>≥${E.badgeScore} %: odznak 🏅</p></div>
      </div>
      <div style="text-align:center; margin-top:36px">
        <button class="btn btn-primary" data-action="exam-start" style="font-size:17px; padding:16px 34px">🚀 Spustiť test</button>
      </div>`;
      setView(html);
      return;
    }

    if (exam.idx >= E.questions.length) return renderExamResult();

    const q = E.questions[exam.idx];
    const pct = Math.round(exam.idx / E.questions.length * 100);
    const html = `
      <div class="page-head"><h1>🏁 Záverečný test</h1></div>
      <div class="exam-progress">
        <div class="exam-progress-bar"><div class="exam-progress-fill" style="width:${pct}%"></div></div>
        <div class="exam-progress-label"><span>Otázka ${exam.idx + 1} / ${E.questions.length}</span><span>Správne: ${exam.correct} ✓</span></div>
      </div>
      <div class="quiz-card" style="animation: viewIn .45s both">
        <div class="quiz-q"><span class="q-num">${exam.idx + 1}.</span><span>${q.q}</span></div>
        <div class="quiz-opts">
          ${q.opts.map((o, oi) => `
            <button class="quiz-opt" data-action="exam-opt" data-i="${oi}">
              <span class="opt-letter">${String.fromCharCode(65 + oi)}</span><span>${o}</span>
            </button>`).join('')}
        </div>
        <div style="margin-top:16px; display:none" class="exam-next-zone">
          <button class="btn btn-primary btn-sm" data-action="exam-next">Ďalšia otázka →</button>
        </div>
      </div>`;
    setView(html, true);
  }

  function examAnswer(oi, btn) {
    if (exam.answered) return;
    exam.answered = true;
    const q = window.EXAM.questions[exam.idx];
    const card = btn.closest('.quiz-card');
    const opts = card.querySelectorAll('.quiz-opt');
    opts.forEach(o => o.disabled = true);
    opts[q.correct].classList.add('correct');
    if (oi === q.correct) exam.correct++;
    else btn.classList.add('wrong');
    card.querySelector('.exam-next-zone').style.display = 'block';
    card.querySelector('[data-action="exam-next"]').focus();
  }

  function renderExamResult() {
    const E = window.EXAM;
    const score = Math.round(exam.correct / E.questions.length * 100);
    const passed = score >= E.passScore;
    // odmeny
    let gained = 0;
    if (passed && !state.examPassed) { gained += 150; state.examPassed = true; }
    if (score > state.examBest) { gained += (score - state.examBest); state.examBest = score; }
    persist();
    buildSidebar();

    const circ = 2 * Math.PI * 80;
    const html = `
      <div class="exam-result">
        <h1 style="font-size:34px; font-weight:900">${passed ? '🎉 Gratulujem!' : '💪 Tesne vedľa!'}</h1>
        <p style="color:var(--text-dim); margin-top:8px">${passed
          ? (score >= E.badgeScore ? 'Majstrovský výkon — test zvládnutý na odznak!' : 'Test si úspešne absolvoval!')
          : `Potrebuješ aspoň ${E.passScore} %. Prejdi si slabšie lekcie a skús to znova — ide ti to!`}</p>
        <div class="score-ring">
          <svg viewBox="0 0 190 190">
            <defs><linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${passed ? '#448361' : '#d44c47'}"/><stop offset="100%" stop-color="${passed ? '#2383e2' : '#cb912f'}"/>
            </linearGradient></defs>
            <circle class="srbg" cx="95" cy="95" r="80"></circle>
            <circle class="srfg" cx="95" cy="95" r="80"></circle>
          </svg>
          <div class="score-val">${score}%</div>
        </div>
        <p style="font-weight:700">${exam.correct} z ${E.questions.length} správne ${gained ? `· <span style="color:var(--cyan)">+${gained} XP</span>` : ''}</p>
        <div style="display:flex; gap:12px; justify-content:center; margin-top:24px; flex-wrap:wrap">
          <button class="btn btn-primary" data-action="exam-restart">↺ Skúsiť znova</button>
          <a class="btn btn-ghost" data-route href="#/dashboard">🏠 Na dashboard</a>
          ${passed ? `<a class="btn btn-success" data-route href="#/project">🏗️ Pokračovať na projekt</a>` : ''}
        </div>
      </div>`;
    setView(html);
    if (gained) setTimeout(() => addXP(gained), 600);
    if (passed) confettiBurst(score >= E.badgeScore ? 260 : 160);
    checkBadges();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const fg = document.querySelector('.srfg');
      if (fg) fg.style.strokeDashoffset = circ * (1 - score / 100);
    }));
    exam = null;
  }

  /* ----------------------------------------------------------
     VIEW: ZÁVEREČNÝ PROJEKT
     ---------------------------------------------------------- */
  const CODE_STORE = {};
  let codeUid = 0;

  function renderProject() {
    const C = window.CAPSTONE;
    const doneCnt = state.cap.length;
    let html = `
      <div class="page-head">
        <h1>🏗️ ${C.title}</h1>
        <p class="lead">${C.intro}</p>
      </div>
      <div class="exam-progress">
        <div class="exam-progress-bar"><div class="exam-progress-fill" style="width:${Math.round(doneCnt / C.steps.length * 100)}%"></div></div>
        <div class="exam-progress-label"><span>${doneCnt} / ${C.steps.length} krokov</span><span>+25 XP za krok</span></div>
      </div>`;
    C.steps.forEach((s, i) => {
      const done = state.cap.includes(i);
      const cid = 'code' + (++codeUid);
      CODE_STORE[cid] = s.code;
      html += `
      <div class="cap-step reveal ${done ? 'done-step' : ''}" data-step="${i}">
        <div class="cap-step-head" data-action="cap-toggle" data-i="${i}">
          <div class="cap-step-num">${done ? '✓' : i + 1}</div>
          <h3>${s.title}</h3>
          <span class="side-caret">▼</span>
        </div>
        <div class="cap-step-body">
          <p>${s.desc}</p>
          <div class="box box-tip" style="margin:14px 0"><div class="box-ico">✅</div><div><div class="box-title">Kritérium hotovosti</div><div class="box-body">${s.check}</div></div></div>
          <div class="solution-box show">
            <div class="sol-label" style="display:flex; align-items:center; gap:10px">Vzorový kód
              <button class="pc-copy-btn" data-action="copy-code" data-code="${cid}" style="margin-left:auto">📋 Kopírovať</button>
            </div>
            <pre>${highlightPython(s.code)}</pre>
          </div>
          <label class="cap-check">
            <input type="checkbox" data-cap="${i}" ${done ? 'checked disabled' : ''}>
            Mám tento krok hotový (+25 XP)
          </label>
        </div>
      </div>`;
    });
    setView(html);
  }

  function capDone(i, checkbox) {
    if (state.cap.includes(i)) return;
    state.cap.push(i);
    persist();
    checkbox.disabled = true;
    const step = document.querySelector(`.cap-step[data-step="${i}"]`);
    step.classList.add('done-step');
    step.querySelector('.cap-step-num').textContent = '✓';
    addXP(25, checkbox);
    if (state.cap.length >= window.CAPSTONE.steps.length) {
      confettiBurst(300);
      toast('🏗️', '<b>Záverečný projekt dokončený!</b> Si pripravený na reálne AI projekty!');
    }
    checkBadges();
    buildSidebar();
  }

  /* ----------------------------------------------------------
     VIEW: TRÉNINGOVÉ PROJEKTY (30 zadaní)
     ---------------------------------------------------------- */
  const DEMOS = {}; // uid -> { text, played, timer }

  function demoHTML(p) {
    if (!p.demo) return '';
    const uid = 'demo_' + p.id;
    DEMOS[uid] = { text: p.demo.text, played: false, timer: null };
    const isB = p.demo.type === 'browser';
    return `
    <div class="order-label" style="margin-top:14px">✨ Ukážka — presne toto postavíš:</div>
    <div class="demo-box" id="${uid}">
      <div class="demo-head">
        <span class="demo-dots"><i></i><i></i><i></i></span>
        ${isB
          ? `<span class="demo-url">🌐 ${escapeHtml(p.demo.title)}</span>`
          : `<span class="demo-title">⌨️ ${escapeHtml(p.demo.title)}</span>`}
        <button class="demo-replay" data-action="demo-play" data-demo="${uid}">▶ Prehrať ukážku</button>
      </div>
      <div class="demo-body" data-action="demo-skip" data-demo="${uid}"><span class="demo-placeholder">▶ Klikni a pozri si, ako sa bude tvoj hotový projekt správať…</span></div>
    </div>`;
  }

  function playDemo(uid) {
    const d = DEMOS[uid];
    const box = document.getElementById(uid);
    if (!d || !box) return;
    const body = box.querySelector('.demo-body');
    const btn = box.querySelector('.demo-replay');

    // klik počas prehrávania = dokonči okamžite
    if (d.timer) {
      clearInterval(d.timer); d.timer = null;
      body.textContent = d.text;
      btn.textContent = '↻ Prehrať znova';
      return;
    }
    d.played = true;
    btn.textContent = '⏸ Píšem…';
    body.innerHTML = '';
    const out = document.createTextNode('');
    body.appendChild(out);
    const cursor = document.createElement('span');
    cursor.className = 'con-cursor';
    body.appendChild(cursor);

    let i = 0;
    d.timer = setInterval(() => {
      i = Math.min(d.text.length, i + 1 + Math.floor(Math.random() * 3));
      out.textContent = d.text.slice(0, i);
      body.scrollTop = body.scrollHeight;
      if (i >= d.text.length) {
        clearInterval(d.timer); d.timer = null;
        cursor.remove();
        btn.textContent = '↻ Prehrať znova';
      }
    }, 13);
  }

  function reqChipHTML(p, done) {
    const total = p.poziadavky.length;
    const checked = done ? total : (state.projReq[p.id] || []).length;
    return `<span class="proj-meta-chip req-chip ${checked === total ? 'full' : ''}" data-reqchip="${p.id}">☑ ${checked}/${total}</span>`;
  }

  function renderPractice() {
    const P = window.PROJECTS;
    const doneCnt = state.proj.length;
    const wip = P.items.filter(p => !state.proj.includes(p.id) && (state.projReq[p.id] || []).length > 0).length;
    const gainedXP = P.items.filter(p => state.proj.includes(p.id)).reduce((a, p) => a + P.xpByTier[p.tier], 0);
    const next = P.items.find(p => !state.proj.includes(p.id));

    let html = `
      <div class="page-head">
        <h1>💼 Tréningové projekty</h1>
        <p class="lead">30 praktických zadaní od najľahších po expertné. Pri každom si najprv <b>prehraj ukážku</b> —
        uvidíš presne, čo staviaš. Potom otvor PyCharm, odškrtávaj si požiadavky a po funkčnom spustení
        si vyzdvihni XP (⭐ +${P.xpByTier[1]} / ⭐⭐ +${P.xpByTier[2]} / ⭐⭐⭐ +${P.xpByTier[3]}).</p>
      </div>

      <div class="proj-stats reveal">
        <div class="proj-stat"><b id="projStatDone">${doneCnt}</b><span>hotových</span></div>
        <div class="proj-stat"><b>${wip}</b><span>rozpracovaných</span></div>
        <div class="proj-stat"><b>${gainedXP}</b><span>XP z projektov</span></div>
        <div class="proj-stat"><b>🔨5 🛠️15 🚢30</b><span>odznaky</span></div>
      </div>
      <div class="exam-progress reveal">
        <div class="exam-progress-bar"><div class="exam-progress-fill" id="projBar" style="width:${Math.round(doneCnt / P.items.length * 100)}%"></div></div>
        <div class="exam-progress-label"><span id="projCount">${doneCnt} / ${P.items.length} projektov hotových</span><span>zoradené od najľahších</span></div>
      </div>

      ${next ? `
      <div class="proj-reco reveal">
        <div class="proj-reco-icon">${next.icon}</div>
        <div class="proj-reco-text">
          <span class="order-label" style="margin:0">🎯 Tvoj ďalší projekt</span>
          <b>${next.num}. ${next.title}</b>
          <span class="proj-reco-meta">${P.tiers[next.tier - 1].stars} · ${next.time}</span>
        </div>
        <button class="btn btn-primary btn-sm" data-action="proj-open" data-id="${next.id}">Otvoriť →</button>
      </div>` : `
      <div class="proj-reco reveal"><div class="proj-reco-icon">🚢</div>
        <div class="proj-reco-text"><b>Všetkých 30 projektov hotových — máš portfólio AI vývojára!</b></div></div>`}

      <div class="proj-filters reveal">
        <button class="proj-filter active" data-action="proj-filter" data-f="all">Všetky</button>
        <button class="proj-filter" data-action="proj-filter" data-f="t1">⭐ Začiatočník</button>
        <button class="proj-filter" data-action="proj-filter" data-f="t2">⭐⭐ Pokročilý</button>
        <button class="proj-filter" data-action="proj-filter" data-f="t3">⭐⭐⭐ Expert</button>
        <button class="proj-filter" data-action="proj-filter" data-f="todo">◯ Nedokončené</button>
        <button class="proj-filter" data-action="proj-filter" data-f="done">✓ Hotové</button>
      </div>`;

    P.tiers.forEach((tier, ti) => {
      const tierNum = ti + 1;
      const items = P.items.filter(p => p.tier === tierNum);
      const tierDone = items.filter(p => state.proj.includes(p.id)).length;
      html += `
      <div data-tier-block="${tierNum}">
      <div class="dash-section-title reveal"><span>${tier.stars} ${tier.name}</span><span class="line"></span><span class="side-section-prog ${tierDone === items.length ? 'full' : ''}">${tierDone}/${items.length}</span></div>
      <p class="proj-tier-desc reveal">${tier.desc}</p>`;

      items.forEach(p => {
        const done = state.proj.includes(p.id);
        const savedReq = state.projReq[p.id] || [];
        html += `
        <div class="cap-step reveal ${done ? 'done-step' : ''}" data-proj-card="${p.id}" data-tier="${p.tier}">
          <div class="cap-step-head" data-action="cap-toggle">
            <div class="cap-step-num">${done ? '✓' : p.num}</div>
            <span class="proj-card-icon">${p.icon}</span>
            <h3>${p.title}</h3>
            <span class="proj-meta-chip proj-stars">${tier.stars}</span>
            <span class="proj-meta-chip">⏱ ${p.time}</span>
            ${reqChipHTML(p, done)}
            <span class="side-caret">▼</span>
          </div>
          <div class="cap-step-body">
            <p>${p.zadanie}</p>
            ${demoHTML(p)}
            <div class="order-label" style="margin-top:16px">📋 Požiadavky — odškrtávaj si postup:</div>
            <div class="req-list">
              ${p.poziadavky.map((r, ri) => {
                const on = done || savedReq.includes(ri);
                return `<label class="req-item ${on ? 'req-on' : ''}">
                  <input type="checkbox" data-req="${p.id}" data-i="${ri}" ${on ? 'checked' : ''} ${done ? 'disabled' : ''}>
                  <span>${r}</span>
                </label>`;
              }).join('')}
            </div>
            <div class="proj-lessons">
              <span class="order-label" style="margin:0 6px 0 0">Použiješ:</span>
              ${p.lessons.map(lid => {
                const l = COURSE.lessons[lid];
                return l ? `<a class="lesson-chip" data-route href="#/lesson/${lid}">${l.icon} Lekcia ${l.num}</a>` : '';
              }).join('')}
            </div>
            <div class="proj-boxes">
              <div class="box box-tip"><div class="box-ico">💡</div><div><div class="box-title">Pomôcka</div><div class="box-body">${p.hint}</div></div></div>
              <div class="box box-key"><div class="box-ico">🚀</div><div><div class="box-title">Bonusová výzva</div><div class="box-body">${p.bonus}</div></div></div>
            </div>
            <label class="cap-check">
              <input type="checkbox" data-proj="${p.id}" ${done ? 'checked disabled' : ''}>
              Projekt mám funkčný a spustený (+${P.xpByTier[tierNum]} XP)
            </label>
          </div>
        </div>`;
      });
      html += `</div>`;
    });
    setView(html);
  }

  function applyProjFilter(f) {
    document.querySelectorAll('.proj-filter').forEach(b => b.classList.toggle('active', b.dataset.f === f));
    document.querySelectorAll('[data-proj-card]').forEach(card => {
      const id = card.dataset.projCard;
      const done = state.proj.includes(id);
      let show = true;
      if (f === 't1' || f === 't2' || f === 't3') show = card.dataset.tier === f[1];
      else if (f === 'done') show = done;
      else if (f === 'todo') show = !done;
      card.style.display = show ? '' : 'none';
    });
    document.querySelectorAll('[data-tier-block]').forEach(block => {
      const any = [...block.querySelectorAll('[data-proj-card]')].some(c => c.style.display !== 'none');
      block.style.display = any ? '' : 'none';
    });
  }

  function toggleReq(cb) {
    const id = cb.dataset.req;
    const i = +cb.dataset.i;
    const p = window.PROJECTS.items.find(x => x.id === id);
    if (!p || state.proj.includes(id)) return;
    let arr = state.projReq[id] || [];
    if (cb.checked) { if (!arr.includes(i)) arr.push(i); }
    else arr = arr.filter(x => x !== i);
    state.projReq[id] = arr;
    persist();
    cb.closest('.req-item').classList.toggle('req-on', cb.checked);
    const chip = document.querySelector(`[data-reqchip="${id}"]`);
    if (chip) {
      chip.textContent = `☑ ${arr.length}/${p.poziadavky.length}`;
      chip.classList.toggle('full', arr.length === p.poziadavky.length);
    }
    if (arr.length === p.poziadavky.length) {
      toast('🎯', `Všetky požiadavky projektu <b>${p.title}</b> splnené — označ ho za hotový!`);
      const main = document.querySelector(`input[data-proj="${id}"]`);
      main?.closest('.cap-check')?.classList.add('cap-check-pulse');
    }
  }

  function projDone(id, checkbox) {
    if (state.proj.includes(id)) return;
    const p = window.PROJECTS.items.find(x => x.id === id);
    if (!p) return;
    state.proj.push(id);
    persist();
    checkbox.disabled = true;
    const card = document.querySelector(`[data-proj-card="${id}"]`);
    if (card) {
      card.classList.add('done-step');
      card.querySelector('.cap-step-num').textContent = '✓';
      card.querySelectorAll('input[data-req]').forEach(r => { r.checked = true; r.disabled = true; r.closest('.req-item').classList.add('req-on'); });
      const chip = card.querySelector('[data-reqchip]');
      if (chip) { chip.textContent = `☑ ${p.poziadavky.length}/${p.poziadavky.length}`; chip.classList.add('full'); }
    }
    addXP(window.PROJECTS.xpByTier[p.tier], checkbox);
    confettiBurst(p.tier === 3 ? 170 : 80);
    toast(p.icon, `Projekt <b>${p.title}</b> hotový! ${p.tier === 3 ? 'Expertná liga! 👑' : ''}`);
    const bar = document.getElementById('projBar');
    const cnt = document.getElementById('projCount');
    const sd = document.getElementById('projStatDone');
    if (bar) bar.style.width = Math.round(state.proj.length / window.PROJECTS.items.length * 100) + '%';
    if (cnt) cnt.textContent = `${state.proj.length} / ${window.PROJECTS.items.length} projektov hotových`;
    if (sd) sd.textContent = state.proj.length;
    checkBadges();
    buildSidebar();
  }

  function openProject(id) {
    const card = document.querySelector(`[data-proj-card="${id}"]`);
    if (!card) return;
    card.classList.add('open');
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const demo = card.querySelector('.demo-box');
    if (demo && DEMOS[demo.id] && !DEMOS[demo.id].played) setTimeout(() => playDemo(demo.id), 450);
  }

  /* ----------------------------------------------------------
     VIEW: ODZNAKY + ŤAHÁK
     ---------------------------------------------------------- */
  function renderBadges() {
    let html = `
      <div class="page-head">
        <h1>🏆 Odznaky</h1>
        <p class="lead">Tvoja zbierka úspechov. Odomknuté: <b>${state.badges.length} / ${BADGES.length}</b>.</p>
      </div>
      <div class="badge-grid">`;
    BADGES.forEach(b => {
      const un = state.badges.includes(b.id);
      html += `
        <div class="badge-card reveal ${un ? 'unlocked' : ''}">
          <div class="badge-emoji">${b.icon}</div>
          <h4>${b.name}</h4>
          <p>${b.desc}</p>
          <div class="badge-state">${un ? '★ Odomknuté' : '🔒 Zamknuté'}</div>
        </div>`;
    });
    setView(html + '</div>');
  }

  function renderCheatsheet() {
    let html = `
      <div class="page-head">
        <h1>📋 Ťahák — LangChain v kocke</h1>
        <p class="lead">Záchytné body ku každej lekcii: <b>kedy čo použiť</b> — a pod tým hotové snippety na kopírovanie.
        Hľadaj čokoľvek (napr. „temperature", „agent", „chunk").</p>
      </div>
      <div class="cheat-search reveal">
        <input type="text" id="cheatFilter" placeholder="🔍 Hľadaj v ťaháku…" autocomplete="off">
      </div>`;

    // ── 1) Kedy čo použiť — rozhodovačky po lekciách ──
    const CH = window.LESSON_CHEATS || {};
    COURSE.sections.forEach(sec => {
      const lekcie = sec.lessons.filter(lid => CH[lid]);
      if (!lekcie.length) return;
      html += `<div data-cheat-block>
        <div class="dash-section-title reveal"><span>${sec.icon} ${sec.title}</span><span class="line"></span></div>`;
      lekcie.forEach(lid => {
        const l = COURSE.lessons[lid];
        html += `
        <div class="cl-card reveal" data-cheat-card>
          <div class="cl-head">
            <span class="cl-ico">${l.icon}</span>
            <h3>Lekcia ${l.num} — ${l.title.split('—')[0].split(' - ')[0].trim()}</h3>
            <a class="lesson-chip" data-route href="#/lesson/${lid}">Otvoriť lekciu →</a>
          </div>
          <div class="cl-rows">
            ${CH[lid].map(r => `
            <div class="cl-row">
              <div class="cl-kedy">${r[0]}</div>
              <div class="cl-pouzi">${r[1]}</div>
            </div>`).join('')}
          </div>
        </div>`;
      });
      html += `</div>`;
    });

    // ── 2) Snippety na kopírovanie ──
    html += `<div data-cheat-block>
      <div class="dash-section-title reveal"><span>⌨️ Snippety na kopírovanie</span><span class="line"></span></div>
      <div class="cheat-grid">`;
    window.CHEATSHEET.forEach(c => {
      const cid = 'code' + (++codeUid);
      CODE_STORE[cid] = c.code;
      html += `
        <div class="cheat-card reveal" data-cheat-card>
          <div class="cheat-card-head"><span class="cc-ico">${c.icon}</span>${c.title}
            <button class="pc-copy-btn" data-action="copy-code" data-code="${cid}" style="margin-left:auto">📋</button>
          </div>
          <pre>${highlightPython(c.code)}</pre>
        </div>`;
    });
    html += `</div></div>`;
    setView(html);

    // fulltextový filter cez karty aj bloky
    const input = document.getElementById('cheatFilter');
    input?.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      document.querySelectorAll('[data-cheat-card]').forEach(card => {
        card.style.display = !q || card.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
      document.querySelectorAll('[data-cheat-block]').forEach(block => {
        const any = [...block.querySelectorAll('[data-cheat-card]')].some(c => c.style.display !== 'none');
        block.style.display = any ? '' : 'none';
      });
    });
  }

  /* ----------------------------------------------------------
     ROUTER + SET VIEW
     ---------------------------------------------------------- */
  function setView(html, instant) {
    const view = document.getElementById('view');
    view.classList.remove('enter');
    view.innerHTML = html;
    void view.offsetWidth;
    view.classList.add('enter');
    if (!instant) window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    observeReveals();
    markActiveSidebar();
  }

  function route() {
    const hash = location.hash || '#/dashboard';
    clearTimeout(typeTimer);
    const parts = hash.replace('#/', '').split('/');
    switch (parts[0]) {
      case 'lesson': renderLesson(parts[1]); break;
      case 'exam': renderExam(); break;
      case 'project': renderProject(); break;
      case 'practice': renderPractice(); break;
      case 'badges': renderBadges(); break;
      case 'cheatsheet': renderCheatsheet(); break;
      default: renderDashboard();
    }
    closeSidebarMobile();
  }

  /* ----------------------------------------------------------
     SIDEBAR MOBILE + FILTER
     ---------------------------------------------------------- */
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  document.getElementById('hamburger').addEventListener('click', () => {
    sidebar.classList.toggle('open');
    backdrop.classList.toggle('show', sidebar.classList.contains('open'));
  });
  backdrop.addEventListener('click', closeSidebarMobile);
  function closeSidebarMobile() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
  }

  document.getElementById('lessonFilter').addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim();
    document.querySelectorAll('#sideNav .side-lesson[data-lid]').forEach(a => {
      const title = a.querySelector('.side-lesson-title').textContent.toLowerCase();
      a.style.display = !q || title.includes(q) ? '' : 'none';
    });
    document.querySelectorAll('#sideNav .side-section').forEach(sec => {
      if (q) sec.classList.remove('collapsed');
    });
  });

  /* ----------------------------------------------------------
     GLOBÁLNA DELEGÁCIA UDALOSTÍ
     ---------------------------------------------------------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const a = t.dataset.action;
    if (a === 'pc-run') pcRun(t.dataset.pc);
    else if (a === 'pc-tab') pcSwitchTab(t.dataset.pc, +t.dataset.i);
    else if (a === 'pc-copy') {
      const pc = PC[t.dataset.pc];
      navigator.clipboard?.writeText(pc.files[pc.active].code).then(() => {
        t.textContent = '✓ Skopírované!';
        setTimeout(() => { t.textContent = '📋 Kopírovať kód'; }, 1600);
      });
    }
    else if (a === 'copy-code') {
      navigator.clipboard?.writeText(CODE_STORE[t.dataset.code] || '').then(() => {
        const orig = t.textContent;
        t.textContent = '✓';
        setTimeout(() => { t.textContent = orig; }, 1400);
      });
    }
    else if (a === 'quiz-opt') answerQuiz(t.dataset.l, +t.dataset.q, +t.dataset.i, t);
    else if (a === 'ex-check-blanks') checkBlanks(t.dataset.uid, t);
    else if (a === 'ex-reveal-blanks') revealBlanks(t.dataset.uid);
    else if (a === 'ex-hint') document.querySelector(`[data-hint="${t.dataset.uid}"]`)?.classList.toggle('show');
    else if (a === 'ex-hint2') document.querySelector(`[data-hint2="${t.dataset.uid}"]`)?.classList.toggle('show');
    else if (a === 'ex-show-solution') {
      const box = document.querySelector(`[data-solution="${t.dataset.uid}"]`);
      box?.classList.toggle('show');
      const reg = EX[t.dataset.uid];
      // Zobrazenie riešenia NEuzamyká odovzdanie — len si ho poznačíme.
      // Cvičenie sa dá stále odovzdať cez ✓ Skontrolovať (za polovičné XP).
      if (reg && !state.ex[reg.key] && box?.classList.contains('show') && !reg.revealed) {
        reg.revealed = true;
        toast('👁', 'Riešenie zobrazené — pokojne si ho prepíš a odovzdaj cez <b>✓ Skontrolovať</b>. Dostaneš polovičné XP.');
      }
    }
    else if (a === 'ex-order-pick') {
      const reg = EX[t.dataset.uid];
      const i = +t.dataset.i;
      reg.pool = reg.pool.filter(x => x !== i);
      reg.answer.push(i);
      refreshOrder(t.dataset.uid);
    }
    else if (a === 'ex-order-unpick') {
      const reg = EX[t.dataset.uid];
      if (state.ex[reg.key]) return;
      const pos = +t.dataset.pos;
      const val = reg.answer.splice(pos, 1)[0];
      reg.pool.push(val);
      reg.pool.sort(() => 0); // poradie poolu nech ostáva stabilné-ish
      refreshOrder(t.dataset.uid);
    }
    else if (a === 'ex-check-order') checkOrder(t.dataset.uid, t);
    else if (a === 'ex-reset-order') {
      const reg = EX[t.dataset.uid];
      reg.pool = shuffle(reg.data.items.map((_, i) => i));
      reg.answer = [];
      const ansEl = document.querySelector(`[data-answer="${t.dataset.uid}"]`);
      ansEl.classList.remove('ok', 'bad');
      refreshOrder(t.dataset.uid);
    }
    else if (a === 'ex-check-write') checkWrite(t.dataset.uid, t);
    else if (a === 'lesson-complete') completeLesson(t.dataset.l, t);
    else if (a === 'exam-start') { exam = { idx: 0, correct: 0, answered: false }; renderExam(); }
    else if (a === 'exam-opt') examAnswer(+t.dataset.i, t);
    else if (a === 'exam-next') { exam.idx++; exam.answered = false; renderExam(); }
    else if (a === 'exam-restart') { exam = { idx: 0, correct: 0, answered: false }; renderExam(); }
    else if (a === 'cap-toggle') {
      const step = t.closest('.cap-step');
      step.classList.toggle('open');
      // pri prvom otvorení projektu automaticky prehraj ukážku
      if (step.classList.contains('open')) {
        const demo = step.querySelector('.demo-box');
        if (demo && DEMOS[demo.id] && !DEMOS[demo.id].played) setTimeout(() => playDemo(demo.id), 350);
      }
    }
    else if (a === 'demo-play') playDemo(t.dataset.demo);
    else if (a === 'demo-skip') {
      const d = DEMOS[t.dataset.demo];
      if (d && d.timer) playDemo(t.dataset.demo);           // počas písania = preskoč
      else if (d && !d.played) playDemo(t.dataset.demo);    // ešte nehrané = spusti
    }
    else if (a === 'proj-filter') applyProjFilter(t.dataset.f);
    else if (a === 'proj-open') openProject(t.dataset.id);
    else if (a === 'toggle-section') {
      t.closest('.side-section').classList.toggle('collapsed');
    }
    else if (a === 'export-progress') exportProgress();
    else if (a === 'import-progress') document.getElementById('importFile').click();
  });

  // checkboxy projektov + import súboru
  document.addEventListener('change', e => {
    const cb = e.target.closest('input[data-cap]');
    if (cb && cb.checked) capDone(+cb.dataset.cap, cb);
    const pj = e.target.closest('input[data-proj]');
    if (pj && pj.checked) projDone(pj.dataset.proj, pj);
    const rq = e.target.closest('input[data-req]');
    if (rq) toggleReq(rq);
    const imp = e.target.closest('#importFile');
    if (imp && imp.files && imp.files[0]) { importProgress(imp.files[0]); imp.value = ''; }
  });

  // Enter v blank inputoch spustí kontrolu
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.classList?.contains('blank-input')) {
      const uid = e.target.dataset.uid;
      checkBlanks(uid, e.target);
    }
    // šípky = navigácia medzi lekciami
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !/INPUT|TEXTAREA/.test(e.target.tagName)) {
      const m = location.hash.match(/#\/lesson\/(l\d+)/);
      if (!m) return;
      const idx = LESSON_ORDER.indexOf(m[1]);
      const next = e.key === 'ArrowRight' ? LESSON_ORDER[idx + 1] : LESSON_ORDER[idx - 1];
      if (next) location.hash = '#/lesson/' + next;
    }
  });

  document.getElementById('levelupClose').addEventListener('click', () => {
    document.getElementById('levelupOverlay').classList.remove('show');
  });

  addEventListener('hashchange', route);

  /* ----------------------------------------------------------
     ŠTART
     ---------------------------------------------------------- */
  buildSidebar();
  updateTopbar();
  route();
  probeStorage();
  if (!state.done.length && !location.hash) {
    setTimeout(() => toast('🦜', 'Vitaj v LangChain Akadémii! Začni prvou lekciou. 🚀'), 900);
  }
})();
