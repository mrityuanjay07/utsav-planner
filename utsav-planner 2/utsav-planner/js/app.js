$('#prios').innerHTML = PRIOS.map(p => `<button type="button" class="chip" data-p="${esc(p)}" aria-pressed="false">${esc(p)}</button>`).join('');

$('#types').addEventListener('click', e => {
  const b = e.target.closest('.type'); if (!b) return;
  if (S.example) { S = Object.assign(S, exFor(b.dataset.t), {checks: {}, spent: {}, vstat: {}}); }
  else { readForm(); S.type = b.dataset.t; }
  fillForm(); save(); render();
});
$('#prios').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  const p = b.dataset.p, i = S.prios.indexOf(p);
  if (i >= 0) S.prios.splice(i, 1); else S.prios.push(p);
  save(); render();
});
$('#brief').addEventListener('submit', e => {
  e.preventDefault(); readForm(); S.example = false; S.tab = 'overview'; save(); validate(); render();
  $('#tabs').scrollIntoView({behavior: 'smooth', block: 'start'});
});
$('#f-budget').addEventListener('input', words2);
let clearArmed = 0;
$('#resetBtn').addEventListener('click', () => {
  const btn = $('#resetBtn');
  if (!clearArmed) {
    btn.textContent = 'Tap again to clear';
    clearArmed = setTimeout(() => { clearArmed = 0; btn.textContent = 'Clear everything'; }, 4000);
    return;
  }
  clearTimeout(clearArmed); clearArmed = 0; btn.textContent = 'Clear everything';
  S = Object.assign(S, {name: '', city: '', date: '', guests: 0, budget: 0, venue: 'none', program: '', problem: '', prios: [], checks: {}, custom: {}, spent: {}, vstat: {}, example: false, tab: 'overview'});
  lastAnswer = ''; fillForm(); save(); validate(); render(); toast('Cleared. Start with your event date.');
});
$('#themeBtn').addEventListener('click', () => {
  const r = document.documentElement;
  const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  r.dataset.theme = dark ? 'light' : 'dark';
});
$('#tabs').addEventListener('click', e => {
  const b = e.target.closest('[data-tab]'); if (!b) return;
  S.tab = b.dataset.tab; save(); render();
});
$('#view').addEventListener('click', e => {
  const t = e.target;
  if (t.closest('[data-go]')) { S.tab = t.closest('[data-go]').dataset.go; save(); render(); $('#tabs').scrollIntoView({behavior: 'smooth', block: 'start'}); return; }
  if (t.id === 'askBtn') { ask(); return; }
  if (t.id === 'stopBtn') { if (ctl) ctl.abort(); return; }
  if (t.id === 'copyPrompt') {
    const txt = buildPrompt($('#askExtra') ? $('#askExtra').value.trim() : '');
    const note = $('#askNote');
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => { note.textContent = 'Brief copied. Paste it into a Claude chat.'; }).catch(() => {
      const o = $('#askOut'); o.hidden = false; o.textContent = txt; note.textContent = 'Select the text above and copy it.';
    });
    return;
  }
  if (t.id === 'addTask') {
    const inp = $('#newTask'), v = inp.value.trim(); if (!v) return;
    (S.custom[S.type] = S.custom[S.type] || []).push(v); save(); render(); return;
  }
});
$('#view').addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.k) { S.checks[t.dataset.k] = t.checked; save(); render(); }
  else if (t.classList.contains('spent')) { S.spent[t.dataset.c] = +t.value || 0; save(); render(); }
  else if (t.classList.contains('vstat')) { S.vstat[t.dataset.c] = t.value; save(); render(); }
});
$('#view').addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.id === 'newTask') { e.preventDefault(); $('#addTask').click(); }
});

fillForm(); render();

/* ---- Friendly features: live updates, worry chips, checks, plan export ---- */
const WORRIES = ['Budget is too tight', 'Guest list disagreement', 'Not enough time', 'Family opinions differ', 'Worried about vendors', 'Weather risk', 'Need volunteers and permissions'];
const WORRY_TEXT = {
  'Budget is too tight': 'I think the budget is too small and I need to cut cost.',
  'Guest list disagreement': 'The guest list is causing disagreement.',
  'Not enough time': 'I have very little time and need to book quickly.',
  'Family opinions differ': 'Family members have different opinions and keep changing decisions.',
  'Worried about vendors': 'I am worried about trusting vendors and paying advances.',
  'Weather risk': 'I am worried about rain or heat on the day.',
  'Need volunteers and permissions': 'I need volunteers and permissions and sponsors are slow.'
};
$('#worries').innerHTML = WORRIES.map(w => `<button type="button" class="chip" data-w="${esc(w)}" aria-pressed="false">${esc(w)}</button>`).join('');
$('#worries').addEventListener('click', e => {
  const b = e.target.closest('[data-w]'); if (!b) return;
  const box = $('#f-problem'), add = WORRY_TEXT[b.dataset.w];
  if (!box.value.includes(add)) box.value = (box.value.trim() + ' ' + add).trim();
  box.dispatchEvent(new Event('input', {bubbles: true}));
});

function toast(msg) {
  const old = document.querySelector('.toast'); if (old) old.remove();
  const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = msg;
  document.body.appendChild(el); setTimeout(() => el.remove(), 2600);
}

function validate() {
  const m = [], C = compute();
  if (!S.date) m.push('Add the event date so the timeline can count back from it.');
  else if (C.days < 0) m.push('This date has already passed. Pick a future date.');
  if (!S.guests) m.push('Add how many guests you expect.');
  if (!S.budget) m.push('Add your total budget in rupees.');
  if (C.perGuest && C.perGuest < 100) m.push('That is under ₹100 per guest. Check that the budget is the total amount, not per person.');
  $('#formMsg').innerHTML = m.map(x => `<span>${esc(x)}</span>`).join('');
}

let liveT = 0;
$('#brief').addEventListener('input', () => {
  clearTimeout(liveT);
  liveT = setTimeout(() => {
    readForm(); S.example = false; save(); validate();
    if (S.tab !== 'ask') render(); else { $('#exampleNote').hidden = true; }
  }, 350);
});
$('#brief').addEventListener('change', () => { readForm(); validate(); });

function planText() {
  const C = compute(), T = C.T;
  const out = [];
  out.push((S.name || T.label).toUpperCase() + (S.city ? ' - ' + S.city : ''));
  out.push('Plan made with Utsav Planner on ' + fmt(TODAY));
  out.push('');
  out.push('Date: ' + (C.ev ? fmt(C.ev) + ' (' + C.days + ' days to go)' : 'not set'));
  out.push('Guests: ' + (C.guests || 'not set'));
  out.push('Total budget: ' + (C.budget ? inr(C.budget) : 'not set') + (C.perGuest ? ' (' + inr(C.perGuest) + ' per guest)' : ''));
  if (S.program) out.push('Programme: ' + S.program);
  if (S.problem) out.push('Main worry: ' + S.problem);
  out.push('', 'ADVICE');
  findings(C).forEach(f => out.push('- ' + f.t + ': ' + f.b));
  if (C.budget) {
    out.push('', 'BUDGET');
    C.cats.forEach(c => out.push('- ' + c.name + ': ' + inr(c.amt) + ' (' + Math.round(c.pct) + '%)' + (c.spent ? ', spent or quoted ' + inr(c.spent) : '')));
  }
  if (C.ev) {
    out.push('', 'TIMELINE');
    T.steps.forEach(([w, t]) => out.push('- ' + fmt(new Date(C.ev.getTime() - w * 7 * 864e5)) + ': ' + t));
  }
  out.push('', 'CHECKLIST');
  T.checks.forEach(([g, arr], gi) => {
    out.push(g);
    arr.forEach((t, ii) => out.push('  [' + (S.checks[S.type + ':' + gi + ':' + ii] ? 'x' : ' ') + '] ' + t));
  });
  (S.custom[S.type] || []).forEach((t, i) => out.push('  [' + (S.checks[S.type + ':c:' + i] ? 'x' : ' ') + '] ' + t));
  return out.join('\n');
}

$('#copyPlan').addEventListener('click', () => {
  const txt = planText();
  (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast('Plan copied. Paste it into WhatsApp or Notes.'))
    .catch(() => { S.tab = 'ask'; render(); const o = $('#askOut'); o.hidden = false; o.textContent = txt; toast('Select the text to copy it.'); });
});
$('#dlPlan').addEventListener('click', () => {
  try {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([planText()], {type: 'text/plain'}));
    a.download = (S.name || 'event-plan').replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.txt';
    document.body.appendChild(a); a.click(); a.remove(); toast('Plan downloaded.');
  } catch (e) { toast('Download is not available here. Use Copy plan summary.'); }
});
$('#printPlan').addEventListener('click', () => {
  $('#printArea').textContent = planText();
  document.body.classList.add('printing');
  window.addEventListener('afterprint', () => document.body.classList.remove('printing'), {once: true});
  window.print();
});
/* Inside a claude.ai artifact, downloads and printing are blocked, so hide those two buttons */
if (window.claude) { $('#dlPlan').hidden = true; $('#printPlan').hidden = true; }

validate();
