/* ═══════════════════════════════════════════
   PORTAL SENAC — script.js
   Perfis: coordenador | super admin
═══════════════════════════════════════════ */

// ─── CREDENCIAIS DEMO ───────────────────────
const DEMO_COORD  = { email: 'coord@senac.edu.br',  pass: '123456', nome: 'Ricardo Silva' };
const DEMO_ADMIN  = { email: 'admin@senac.edu.br',   pass: 'admin123' };

// ─── ESTADO DA APP ──────────────────────────
const state = {
  cursos: [],
  coordenadores: [],
  alunos: []
};

// ─── ELEMENTOS ──────────────────────────────
const ls  = document.getElementById('ls');   // login coord
const als = document.getElementById('als');  // login admin
const ps  = document.getElementById('ps');   // painel coord
const aps = document.getElementById('aps');  // painel admin
const fab = document.getElementById('fab');

// ─── NAVEGAÇÃO DE TELAS ─────────────────────
function showScreen(id) {
  [ls, als, ps, aps].forEach(s => s.classList.remove('on'));
  document.getElementById(id).classList.add('on');
}

// ─── LOGIN COORDENADOR ──────────────────────
document.getElementById('lf').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('coord-email').value.trim();
  const pass  = document.getElementById('coord-pass').value;
  const err   = document.getElementById('login-err');

  if (email === DEMO_COORD.email && pass === DEMO_COORD.pass) {
    err.style.display = 'none';
    // set profile display
    document.getElementById('coord-name-display').textContent = DEMO_COORD.nome;
    document.getElementById('coord-av').textContent = initials(DEMO_COORD.nome);
    document.getElementById('wc-coord-name').textContent = 'Olá, ' + DEMO_COORD.nome + '!';
    document.getElementById('wc-coord-av').textContent = initials(DEMO_COORD.nome);
    showScreen('ps');
    fab.style.display = 'flex';
    setV('dv');
    populateCursoSelect();
  } else {
    err.style.display = 'flex';
  }
});

// ─── LOGIN SUPER ADMIN ──────────────────────
document.getElementById('alf').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('admin-email').value.trim();
  const pass  = document.getElementById('admin-pass').value;
  const err   = document.getElementById('admin-err');

  if (email === DEMO_ADMIN.email && pass === DEMO_ADMIN.pass) {
    err.style.display = 'none';
    showScreen('aps');
    fab.style.display = 'flex';
    setAV('adv');
    updateAdminKpis();
  } else {
    err.style.display = 'flex';
  }
});

// ─── LINKS TROCA DE LOGIN ────────────────────
document.getElementById('go-admin-link').addEventListener('click', e => {
  e.preventDefault();
  showScreen('als');
});
document.getElementById('back-coord-link').addEventListener('click', e => {
  e.preventDefault();
  showScreen('ls');
});

// ─── LOGOUT ─────────────────────────────────
document.getElementById('lb').addEventListener('click', () => {
  fab.style.display = 'none';
  showScreen('ls');
});
document.getElementById('alb').addEventListener('click', () => {
  fab.style.display = 'none';
  showScreen('als');
});

// ─── NAVEGAÇÃO COORDENADOR ──────────────────
const views   = [...document.querySelectorAll('#ps .view')];
const sbBtns  = [...document.querySelectorAll('#ps .sb-btn')];
const tabs    = [...document.querySelectorAll('#ps .tt')];

function setV(id) {
  views.forEach(v => v.classList.toggle('on', v.id === id));
  sbBtns.forEach(b => b.classList.toggle('on', b.dataset.v === id));
  tabs.forEach(t => t.classList.toggle('on', t.dataset.v === id));
}

sbBtns.forEach(b => b.addEventListener('click', () => setV(b.dataset.v)));
tabs.forEach(t => t.addEventListener('click', () => setV(t.dataset.v)));

document.getElementById('bnp').addEventListener('click', () => setV('pv'));

// ─── NAVEGAÇÃO SUPER ADMIN ──────────────────
const aviews  = [...document.querySelectorAll('#aps .aview')];
const asBtns  = [...document.querySelectorAll('#aps .a-btn')];
const atabs   = [...document.querySelectorAll('#aps .a-tab')];

function setAV(id) {
  aviews.forEach(v => v.classList.toggle('on', v.id === id));
  asBtns.forEach(b => b.classList.toggle('on', b.dataset.av === id));
  atabs.forEach(t => t.classList.toggle('on', t.dataset.av === id));
  if (id === 'coordv') renderCoordChecks();
}

asBtns.forEach(b => b.addEventListener('click', () => setAV(b.dataset.av)));
atabs.forEach(t => t.addEventListener('click', () => setAV(t.dataset.av)));

// ─── CHART TOGGLES ──────────────────────────
document.querySelectorAll('.tg').forEach(b => {
  b.addEventListener('click', function () {
    this.closest('.tgg').querySelectorAll('.tg').forEach(x => x.classList.remove('on'));
    this.classList.add('on');
  });
});

/* ═══════════════════════════════════════════
   CRUD — CURSOS
═══════════════════════════════════════════ */
document.getElementById('btn-salvar-curso').addEventListener('click', () => {
  const nome = document.getElementById('cs-nome').value.trim();
  const cod  = document.getElementById('cs-cod').value.trim();
  const desc = document.getElementById('cs-desc').value.trim();
  const carga= document.getElementById('cs-carga').value.trim();
  const dur  = document.getElementById('cs-dur').value.trim();
  const err  = document.getElementById('cs-err');

  if (!nome) { err.style.display = 'block'; return; }
  err.style.display = 'none';

  state.cursos.push({ id: uid(), nome, cod: cod || '—', desc, carga: carga || '—', dur: dur || '—' });
  renderCursos();
  updateAdminKpis();
  populateCursoSelect();
  // clear
  ['cs-nome','cs-cod','cs-desc','cs-carga','cs-dur'].forEach(id => document.getElementById(id).value = '');
  showToast('Curso cadastrado com sucesso!');
});

function renderCursos() {
  const tbody = document.getElementById('tbody-cursos');
  document.getElementById('count-cursos').textContent = state.cursos.length;
  if (!state.cursos.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="a-empty-row">Nenhum curso cadastrado ainda.</td></tr>';
    return;
  }
  tbody.innerHTML = state.cursos.map(c => `
    <tr>
      <td><span class="a-tag" style="background:rgba(192,132,252,.15);color:#c084fc;border:1px solid rgba(192,132,252,.25)">${c.cod}</span></td>
      <td><strong style="color:#e6edf3">${c.nome}</strong>${c.desc ? `<br><small style="color:rgba(255,255,255,.3)">${c.desc}</small>` : ''}</td>
      <td style="color:rgba(255,255,255,.5)">${c.carga}h</td>
      <td style="color:rgba(255,255,255,.5)">${c.dur} sem.</td>
      <td><button class="del-btn" onclick="deleteCurso('${c.id}')">Remover</button></td>
    </tr>`).join('');
}

function deleteCurso(id) {
  if (!confirm('Remover este curso?')) return;
  state.cursos = state.cursos.filter(c => c.id !== id);
  renderCursos();
  updateAdminKpis();
  populateCursoSelect();
}

/* ═══════════════════════════════════════════
   CRUD — COORDENADORES
═══════════════════════════════════════════ */
function renderCoordChecks() {
  const wrap = document.getElementById('co-cursos-checks');
  if (!state.cursos.length) {
    wrap.innerHTML = '<p style="font-size:12px;color:rgba(255,255,255,.3);padding:8px 0">Cadastre cursos primeiro para vincular.</p>';
    return;
  }
  wrap.innerHTML = state.cursos.map(c => `
    <label class="chk-item" style="color:rgba(255,255,255,.65)">
      <input type="checkbox" value="${c.id}" name="co-curso">
      ${c.nome} <span style="color:rgba(255,255,255,.3);font-size:11px">(${c.cod})</span>
    </label>`).join('');
}

document.getElementById('btn-salvar-coord').addEventListener('click', () => {
  const nome  = document.getElementById('co-nome').value.trim();
  const email = document.getElementById('co-email').value.trim();
  const pass  = document.getElementById('co-pass').value;
  const pass2 = document.getElementById('co-pass2').value;
  const checks= [...document.querySelectorAll('input[name="co-curso"]:checked')];
  const err   = document.getElementById('co-err');

  if (!nome || !email || !pass || !checks.length) {
    err.textContent = 'Preencha todos os campos e vincule ao menos um curso.';
    err.style.display = 'block'; return;
  }
  if (pass !== pass2) {
    err.textContent = 'As senhas não coincidem.';
    err.style.display = 'block'; return;
  }
  err.style.display = 'none';

  const cursosVinc = checks.map(c => {
    const curso = state.cursos.find(cs => cs.id === c.value);
    return curso ? curso.nome : '';
  }).filter(Boolean);

  state.coordenadores.push({ id: uid(), nome, email, pass, cursos: cursosVinc });
  renderCoords();
  updateAdminKpis();
  ['co-nome','co-email','co-pass','co-pass2'].forEach(id => document.getElementById(id).value = '');
  document.querySelectorAll('input[name="co-curso"]').forEach(c => c.checked = false);
  showToast('Coordenador cadastrado com sucesso!');
});

function renderCoords() {
  const tbody = document.getElementById('tbody-coords');
  document.getElementById('count-coords').textContent = state.coordenadores.length;
  if (!state.coordenadores.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="a-empty-row">Nenhum coordenador cadastrado ainda.</td></tr>';
    return;
  }
  tbody.innerHTML = state.coordenadores.map(c => `
    <tr>
      <td><div class="a-uc"><div class="a-uav" style="background:rgba(192,132,252,.15);color:#c084fc">${initials(c.nome)}</div><strong style="color:#e6edf3">${c.nome}</strong></div></td>
      <td style="color:rgba(255,255,255,.4);font-size:12px">${c.email}</td>
      <td>${c.cursos.map(curso => `<span class="a-tag" style="background:rgba(192,132,252,.12);color:#c084fc;border:1px solid rgba(192,132,252,.2);margin-right:3px">${curso}</span>`).join('')}</td>
      <td><button class="del-btn" onclick="deleteCoord('${c.id}')">Remover</button></td>
    </tr>`).join('');
}

function deleteCoord(id) {
  if (!confirm('Remover este coordenador?')) return;
  state.coordenadores = state.coordenadores.filter(c => c.id !== id);
  renderCoords();
  updateAdminKpis();
}

/* ═══════════════════════════════════════════
   CRUD — ALUNOS (coordenador)
═══════════════════════════════════════════ */
function populateCursoSelect() {
  const sel = document.getElementById('al-curso');
  if (!sel) return;
  const val = sel.value;
  sel.innerHTML = '<option value="">Selecione o curso</option>' +
    state.cursos.map(c => `<option value="${c.nome}" ${c.nome === val ? 'selected' : ''}>${c.nome}</option>`).join('');
}

document.getElementById('btn-salvar-aluno').addEventListener('click', () => {
  const nome  = document.getElementById('al-nome').value.trim();
  const email = document.getElementById('al-email').value.trim();
  const ra    = document.getElementById('al-ra').value.trim();
  const curso = document.getElementById('al-curso').value;
  const sem   = document.getElementById('al-sem').value;
  const err   = document.getElementById('al-err');

  if (!nome || !email || !curso) { err.style.display = 'block'; return; }
  err.style.display = 'none';

  state.alunos.push({ id: uid(), nome, email, ra: ra || '—', curso, sem });
  renderAlunos();
  updateAdminKpis();
  // update coord dashboard kpi
  document.getElementById('kpi-alunos').textContent = state.alunos.length;
  document.getElementById('kbar-cursos') && null; // silence
  ['al-nome','al-email','al-ra'].forEach(id => document.getElementById(id).value = '');
  showToast('Aluno cadastrado com sucesso!');
});

function renderAlunos(filter = '') {
  const tbody = document.getElementById('tbody-alunos');
  document.getElementById('count-alunos').textContent = state.alunos.length;
  const list = filter
    ? state.alunos.filter(a => a.nome.toLowerCase().includes(filter.toLowerCase()) || a.email.toLowerCase().includes(filter))
    : state.alunos;
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-row">${filter ? 'Nenhum resultado encontrado.' : 'Nenhum aluno cadastrado ainda.'}</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(a => `
    <tr>
      <td><div class="sc"><div class="av ab" style="width:28px;height:28px;font-size:9px">${initials(a.nome)}</div><div><strong>${a.nome}</strong>${a.ra !== '—' ? `<br><small style="color:#aab8cc">RA: ${a.ra}</small>` : ''}</div></div></td>
      <td style="font-size:12px;color:#aab8cc">${a.email}</td>
      <td><span class="tag tp">${a.curso}</span></td>
      <td>${a.sem}</td>
      <td><button class="del-btn" onclick="deleteAluno('${a.id}')">Remover</button></td>
    </tr>`).join('');
}

function deleteAluno(id) {
  if (!confirm('Remover este aluno?')) return;
  state.alunos = state.alunos.filter(a => a.id !== id);
  renderAlunos();
  document.getElementById('kpi-alunos').textContent = state.alunos.length;
  updateAdminKpis();
}

// busca de aluno
document.getElementById('search-aluno').addEventListener('input', function () {
  renderAlunos(this.value);
});

/* ═══════════════════════════════════════════
   KPIs ADMIN
═══════════════════════════════════════════ */
function updateAdminKpis() {
  const nc = state.cursos.length;
  const nco = state.coordenadores.length;
  const na = state.alunos.length;
  // dashboard hero stats
  ['kpi-cursos','kpi-cursos-2'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = nc; });
  ['kpi-coords','kpi-coords-2'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = nco; });
  ['kpi-total-alunos','kpi-alunos-2'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = na; });
  // bars
  const cb = document.getElementById('kbar-cursos');
  const cob = document.getElementById('kbar-coords');
  if (cb) cb.style.width = Math.min(nc * 14, 100) + '%';
  if (cob) cob.style.width = Math.min(nco * 14, 100) + '%';
}

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
function uid() { return Math.random().toString(36).slice(2, 9); }

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// Toast notification
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = `
      position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
      background:#0d2d5e;color:#fff;padding:12px 22px;border-radius:10px;
      font-size:13px;font-weight:600;z-index:9999;
      box-shadow:0 4px 20px rgba(10,30,70,.3);
      opacity:0;transition:opacity .3s;pointer-events:none;
      display:flex;align-items:center;gap:8px;white-space:nowrap;
    `;
    document.body.appendChild(t);
  }
  t.innerHTML = `<svg viewBox="0 0 16 16" fill="none" stroke="#5bc88a" stroke-width="2" width="14" height="14"><circle cx="8" cy="8" r="6"/><path d="m5 8 2 2 4-4"/></svg>${msg}`;
  t.style.opacity = '1';
  clearTimeout(t._to);
  t._to = setTimeout(() => { t.style.opacity = '0'; }, 2800);
}

// ─── INIT ────────────────────────────────────
// Adiciona alguns dados demo para deixar a interface menos vazia
(function seedDemo() {
  state.cursos.push(
    { id: uid(), nome: 'Análise e Des. de Sistemas', cod: 'ADS', desc: 'Tecnologia da Informação', carga: '240', dur: '6' },
    { id: uid(), nome: 'Engenharia Civil', cod: 'ENG', desc: 'Engenharia e Construção', carga: '320', dur: '10' }
  );
  renderCursos();
  populateCursoSelect();
  updateAdminKpis();
})();
