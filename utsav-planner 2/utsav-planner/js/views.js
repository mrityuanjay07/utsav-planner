const TABS = [['overview', 'Solutions'], ['budget', 'Budget'], ['timeline', 'Timeline'], ['vendors', 'Vendors'], ['checklist', 'Checklist'], ['ideas', 'Ideas'], ['ask', 'Ask Claude']];
const needData = '<section class="panel"><h2>Add your details first</h2><p class="empty">Enter the event date, guests and total budget above, then press Update my plan.</p></section>';

function vOverview(C) {
  const F = findings(C);
  const stat = (b, s) => `<div class="stat"><b>${esc(b)}</b><span>${esc(s)}</span></div>`;
  const stats = [
    C.days != null ? stat(C.days >= 0 ? C.days + ' days' : 'Past', 'until the event') : '',
    C.budget ? stat(inr(C.budget), words(C.budget) ? 'total budget, ' + words(C.budget) : 'total budget') : '',
    C.perGuest ? stat(inr(C.perGuest), 'per guest') : '',
    C.guests ? stat(String(C.guests), 'guests expected') : ''
  ].join('');
  const list = F.length ? F.map(f => `<div class="finding ${f.l}"><h3>${esc(f.t)}</h3><p>${esc(f.b)}</p></div>`).join('') : '<p class="empty">Add your date, guests, budget and what is worrying you to get advice.</p>';
  return `<section class="panel"><h2>${esc(S.name || TYPES[S.type].label)}${S.city ? ', ' + esc(S.city) : ''}</h2>
    <div class="stats">${stats}</div></section>
    <section class="panel advice" style="margin-top:20px"><h2>Best solution for your situation</h2>${list}
    <div class="row"><button class="btn pop" type="button" data-go="ask">Get a tailored plan from Claude</button></div></section>`;
}

function vBudget(C) {
  if (!C.budget) return needData;
  const bar = C.cats.map((c, i) => `<i style="width:${c.pct}%;background:${c.id === 'buffer' ? 'var(--pop)' : `color-mix(in srgb,var(--accent) ${Math.max(30, 100 - i * 9)}%,var(--bg))`}" title="${esc(c.name)}"></i>`).join('');
  const spent = C.cats.reduce((a, c) => a + c.spent, 0);
  const rows = C.cats.map(c => {
    const st = !c.spent ? '' : c.spent > c.amt ? '<span class="tag bad">Over plan</span>' : '<span class="tag good">Within plan</span>';
    return `<div class="cat"><div><b>${esc(c.name)}</b> <span class="hint">${Math.round(c.pct)}%</span> ${st}
      ${c.id === 'buffer' ? '' : `<div class="row" style="margin-top:6px"><label class="hint" for="sp-${c.id}">Spent or quoted</label><input id="sp-${c.id}" class="spent" data-c="${c.id}" type="number" min="0" step="1000" inputmode="numeric" value="${c.spent || ''}" placeholder="0" style="max-width:130px;padding:6px 8px"></div>`}</div>
      <div class="track"><i style="width:${Math.min(100, c.pct * 2.5)}%"></i></div><div class="amt">${inr(c.amt)}</div></div>`;
  }).join('');
  return `<section class="panel"><h2>Budget split</h2>
    <p class="hint">Based on typical ${TYPES[S.type].label.toLowerCase()} spending${S.prios.length ? ', shifted toward your priorities' : ''}. Enter quotes as they arrive to see where you stand.</p>
    <div class="bar" aria-hidden="true">${bar}</div>
    <div class="stats"><div class="stat"><b>${inr(C.budget)}</b><span>total budget</span></div><div class="stat"><b>${inr(spent)}</b><span>spent or quoted</span></div><div class="stat"><b>${inr(C.budget - spent)}</b><span>left to allocate</span></div></div>
    <div>${rows}</div></section>`;
}

function vTimeline(C) {
  if (!C.ev) return needData;
  const T = C.T;
  const items = T.steps.map(([w, t, b]) => ({w, t, b, d: new Date(C.ev.getTime() - w * 7 * 864e5)}));
  const next = items.find(i => i.d >= TODAY);
  const li = items.map(i => {
    const late = i.d < TODAY && C.days >= 0 && i.w > 0;
    const done = i.d < TODAY && C.days < 0;
    const lab = i.w > 0 ? i.w + (i.w === 1 ? ' week' : ' weeks') + ' before' : i.w === 0 ? 'Event day' : 'After';
    const tag = late ? '<span class="tag warn">Do now</span>' : (next === i ? '<span class="tag">Next</span>' : '');
    return `<li class="${done ? 'past' : next === i ? 'now' : ''}"><div class="when"><b>${fmt(i.d)}</b>${lab}</div><div><h3>${esc(i.t)} ${tag}</h3><p class="hint" style="font-size:14px">${esc(i.b)}</p></div></li>`;
  }).join('');
  const lateCount = items.filter(i => i.d < TODAY && C.days >= 0 && i.w > 0).length;
  return `<section class="panel"><h2>Timeline to ${esc(fmt(C.ev))}</h2>
    ${lateCount ? `<p class="hint">${lateCount} early milestone${lateCount > 1 ? 's are' : ' is'} already behind. Combine them into your first week instead of working through them one by one.</p>` : ''}
    <ol class="tl">${li}</ol></section>`;
}

function vVendors(C) {
  if (!C.budget) return needData;
  const rows = C.cats.filter(c => c.id !== 'buffer').map(c => {
    const st = S.vstat[c.id] || 'todo';
    const late = c.bookBy && c.bookBy < TODAY && st !== 'booked' && C.days >= 0;
    return `<div class="vendor"><div class="row" style="justify-content:space-between"><h3>${esc(c.name)}</h3><span class="num">${inr(c.amt)}</span></div>
      <div class="row"><span class="tag ${late ? 'bad' : ''}">${late ? 'Book now' : c.bookBy ? 'Book by ' + fmt(c.bookBy) : 'Book close to the date'}</span>
      <label class="hint" for="vs-${c.id}">Status</label>
      <select id="vs-${c.id}" class="vstat" data-c="${c.id}" style="width:auto"><option value="todo"${st === 'todo' ? ' selected' : ''}>Not started</option><option value="short"${st === 'short' ? ' selected' : ''}>Shortlisted</option><option value="booked"${st === 'booked' ? ' selected' : ''}>Booked</option></select></div>
      <p class="lab" style="margin-top:4px">Ask every vendor</p><ul>${c.qs.map(q => `<li>${esc(q)}</li>`).join('')}</ul></div>`;
  }).join('');
  return `<section class="panel"><h2>Vendors to book</h2><p class="hint">Amounts follow your budget split. Get at least three quotes and compare what each includes.</p><div>${rows}</div></section>`;
}

function vChecklist() {
  const T = TYPES[S.type];
  const custom = S.custom[S.type] || [];
  let total = 0, done = 0;
  const item = (id, text) => { total++; const on = !!S.checks[id]; if (on) done++; return `<label><input type="checkbox" data-k="${esc(id)}"${on ? ' checked' : ''}><span>${esc(text)}</span></label>`; };
  const groups = T.checks.map(([g, arr], gi) => `<h3>${esc(g)}</h3>${arr.map((t, ii) => item(S.type + ':' + gi + ':' + ii, t)).join('')}`).join('');
  const mine = `<h3>Your own tasks</h3>${custom.map((t, i) => item(S.type + ':c:' + i, t)).join('')}`;
  const pct = total ? Math.round(done / total * 100) : 0;
  return `<section class="panel"><h2>Checklist</h2>
    <div class="prog"><div class="bar"><i style="width:${pct}%;background:var(--accent)"></i></div><span class="num">${done}/${total}</span></div>
    <div class="chk">${groups}${mine}</div>
    <div class="row"><label class="hint" for="newTask">Add a task</label><input id="newTask" type="text" placeholder="Book the band for the baraat" style="flex:1;min-width:180px"><button class="btn" type="button" id="addTask">Add</button></div></section>`;
}

function vIdeas(C) {
  const hay = [S.program, S.problem, S.city, S.prios.join(' ')].join(' ').toLowerCase();
  const scored = IDEAS.filter(x => x.t.includes(S.type)).map((x, i) => {
    let s = x.kw.filter(k => hay.includes(k)).length;
    if (C.tier === 'tight' && x.kw.some(k => k === 'budget' || k === 'low cost')) s += 1;
    return {x, s, i};
  }).sort((a, b) => b.s - a.s || a.i - b.i).slice(0, 6);
  const cards = scored.map(({x, s}) => `<div class="idea">${s ? '<span class="tag good" style="align-self:flex-start">Matches your brief</span>' : ''}<h3>${esc(x.title)}</h3><p>${esc(x.body)}</p></div>`).join('');
  return `<section class="panel"><h2>Ideas for you</h2><p class="hint">Chosen from your programme, priorities and budget level. Edit the brief to change them.</p><div class="ideas">${cards}</div></section>`;
}

function buildPrompt(extra) {
  const C = compute(), T = C.T;
  const lines = [
    `Event type: ${T.label}`, `Name: ${S.name || 'not given'}`, `City: ${S.city || 'not given'}`,
    `Date: ${C.ev ? fmt(C.ev) + ' (' + C.days + ' days from today)' : 'not given'}`,
    `Guests: ${C.guests || 'not given'}`, `Total budget: ${C.budget ? inr(C.budget) : 'not given'}${C.perGuest ? ' (' + inr(C.perGuest) + ' per guest)' : ''}`,
    `Venue status: ${S.venue}`, `Priorities: ${S.prios.join(', ') || 'none stated'}`,
    `Programme: ${S.program || 'not given'}`, `Problem or worry: ${S.problem || 'not given'}`
  ];
  if (extra) lines.push(`Extra question: ${extra}`);
  return `You are an experienced event planner in India helping one person plan a ${T.label.toLowerCase()}. Write from their point of view, in plain language, using rupees.\n\n${lines.join('\n')}\n\nFormat: Start with the direct answer to their problem in 2 to 3 sentences. Then give (1) a budget decision with specific rupee numbers, (2) what to do in the next 7 days as a short numbered list, (3) one risk they have not mentioned, (4) two ideas that fit their programme. No tables, under 400 words. State any assumption you make.`;
}

function vAsk() {
  return `<section class="panel"><h2>Ask Claude</h2>
    <p class="hint">Claude reads your whole brief and writes a plan for your exact situation.</p>
    <div class="field"><label for="askExtra">Anything specific you want answered? (optional)</label><textarea id="askExtra" placeholder="Should I book the caterer before the venue?"></textarea></div>
    <div class="row"><button class="btn pop" type="button" id="askBtn">Get my plan</button><button class="btn ghost" type="button" id="stopBtn" hidden>Stop</button><button class="btn ghost" type="button" id="copyPrompt">Copy my brief</button></div>
    <div id="askOut" class="ai-out" hidden></div><p class="hint" id="askNote"></p></section>`;
}

let sampleFn = null, ctl = null, lastAnswer = '';
if (window.claude && window.claude.use) window.claude.use('sample').then(s => { sampleFn = s; }).catch(() => {});

async function askApi(prompt, signal) {
  let res;
  try { res = await fetch('/api/ask', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({prompt}), signal}); }
  catch (e) { if (signal.aborted) throw e; throw {code: 'unavailable'}; }
  if (res.status === 404 || res.status === 405) throw {code: 'unavailable'};
  if (res.status === 429) throw {code: 'rate_limited'};
  if (!res.ok) throw {code: 'failed'};
  const data = await res.json();
  return {text: data.text || ''};
}

async function ask() {
  const out = $('#askOut'), note = $('#askNote'), btn = $('#askBtn'), stop = $('#stopBtn');
  if (!sampleFn) {
    try { sampleFn = window.claude && window.claude.use ? await window.claude.use('sample') : null; } catch (e) {}
  }
  out.hidden = false; out.textContent = 'Thinking...'; note.textContent = '';
  btn.disabled = true; stop.hidden = false;
  ctl = new AbortController();
  try {
    const prompt = buildPrompt($('#askExtra').value.trim());
    const r = sampleFn
      ? await sampleFn(prompt, {onText: ({text}) => { out.textContent = text; }, signal: ctl.signal, modelTier: 'default', cache: false})
      : await askApi(prompt, ctl.signal);
    out.textContent = r.text; lastAnswer = r.text;
  } catch (e) {
    if (e && e.text) out.textContent = e.text; else if (e && e.code === 'unavailable') out.hidden = true;
    note.textContent = e && e.code === 'unavailable' ? 'Live AI answers are not switched on for this site. The Solutions tab still gives advice, and Copy my brief lets you paste your details into a Claude chat.' : e && e.code === 'not_granted' ? 'Permission to ask Claude was declined.' : e && e.code === 'rate_limited' ? 'Too many requests. Wait a minute and try again.' : (ctl.signal.aborted ? 'Stopped.' : 'Claude could not answer just now. Try again in a moment.');
  } finally { btn.disabled = false; stop.hidden = true; }
}

function render() {
  const C = compute();
  $('#tabs').innerHTML = TABS.map(([k, l]) => `<button type="button" role="tab" data-tab="${k}" aria-selected="${S.tab === k}">${l}</button>`).join('');
  const v = {overview: vOverview, budget: vBudget, timeline: vTimeline, vendors: vVendors, checklist: vChecklist, ideas: vIdeas, ask: vAsk}[S.tab] || vOverview;
  $('#view').innerHTML = v(C);
  document.querySelectorAll('#types .type').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.t === S.type)));
  document.querySelectorAll('#prios .chip').forEach(b => b.setAttribute('aria-pressed', String(S.prios.includes(b.dataset.p))));
  $('#exampleNote').hidden = !S.example;
  if (S.tab === 'ask' && lastAnswer) { const o = $('#askOut'); o.hidden = false; o.textContent = lastAnswer; }
}

function fillForm() {
  $('#f-name').value = S.name || ''; $('#f-city').value = S.city || ''; $('#f-date').value = S.date || '';
  $('#f-guests').value = S.guests || ''; $('#f-budget').value = S.budget || ''; $('#f-venue').value = S.venue || 'none';
  $('#f-program').value = S.program || ''; $('#f-problem').value = S.problem || '';
  words2();
}
function words2() { const b = +$('#f-budget').value; $('#budgetWords').textContent = b ? inr(b) + (words(b) ? ' (' + words(b) + ')' : '') : ''; }
function readForm() {
  S.name = $('#f-name').value.trim(); S.city = $('#f-city').value.trim(); S.date = $('#f-date').value;
  S.guests = +$('#f-guests').value || 0; S.budget = +$('#f-budget').value || 0; S.venue = $('#f-venue').value;
  S.program = $('#f-program').value.trim(); S.problem = $('#f-problem').value.trim();
}
