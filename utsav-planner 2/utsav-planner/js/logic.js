const KEY = 'utsav.v1';
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
const words = n => n >= 1e7 ? (+(n / 1e7).toFixed(2)) + ' crore' : n >= 1e5 ? (+(n / 1e5).toFixed(2)) + ' lakh' : '';
const TODAY = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
const iso = d => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 6e4); return z.toISOString().slice(0, 10); };
const plus = n => iso(new Date(TODAY.getTime() + n * 864e5));
const fmt = d => d.toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'});

function exFor(t) {
  if (t === 'birthday') return {type: t, name: "Aarav's 8th birthday", city: 'Pune', date: plus(35), guests: 40, budget: 60000, venue: 'none',
    program: 'Space theme party with games, a treasure hunt and a cake cutting at 5 pm. Parents stay for snacks.',
    problem: 'I have only 5 weeks and I am not sure how much to spend per child.', prios: ['Memorable moments', 'Keep it simple']};
  if (t === 'community') return {type: t, name: 'Society Diwali mela', city: 'Pune', date: plus(60), guests: 300, budget: 90000, venue: 'shortlist',
    program: 'Cultural performances by residents, food stalls, kids zone, a charity collection for a local school.',
    problem: 'We need volunteers and permissions, and sponsors are slow to confirm.', prios: ['Guest comfort', 'Low cost']};
  return {type: 'wedding', name: "Meera and Arjun's wedding", city: 'Pune', date: plus(108), guests: 250, budget: 1500000, venue: 'shortlist',
    program: 'Mehendi and sangeet on day one. Haldi and the wedding on day two. Reception the same evening.',
    problem: 'The two families disagree on the guest count, and I think the budget is too small for 250 guests.', prios: ['Food', 'Guest comfort']};
}

let S = Object.assign({checks: {}, custom: {}, spent: {}, vstat: {}, tab: 'overview', example: true}, exFor('wedding'));
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) {}
let saveT = 0;
function save() { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }, 200); }

function compute() {
  const T = TYPES[S.type];
  const budget = +S.budget || 0, guests = +S.guests || 0;
  const ev = S.date ? new Date(S.date + 'T00:00:00') : null;
  const days = ev ? Math.round((ev - TODAY) / 864e5) : null;
  const weeks = days == null ? null : days / 7;
  const perGuest = budget && guests ? budget / guests : 0;
  const tier = !perGuest ? null : perGuest < T.tier[0] ? 'tight' : perGuest > T.tier[1] ? 'generous' : 'workable';
  const map = {'Food': ['food'], 'Décor': ['decor'], 'Photography': ['photo'], 'Music and fun': ['music', 'fun', 'program'], 'Traditions': ['ritual', 'attire']};
  const boost = new Set();
  S.prios.forEach(p => (map[p] || []).forEach(c => boost.add(c)));
  const cats = T.cats.map(([id, name, pct, lead, qs]) => ({id, name, pct, lead, qs}));
  const hit = cats.filter(c => boost.has(c.id));
  if (hit.length) {
    const add = Math.min(3 * hit.length, 9);
    const pool = cats.filter(c => !boost.has(c.id) && c.id !== 'buffer');
    const sum = pool.reduce((a, c) => a + c.pct, 0);
    hit.forEach(c => { c.pct += add / hit.length; });
    pool.forEach(c => { c.pct -= add * c.pct / sum; });
  }
  cats.forEach(c => {
    c.amt = budget * c.pct / 100;
    c.spent = +S.spent[c.id] || 0;
    c.bookBy = ev && c.lead ? new Date(ev.getTime() - c.lead * 7 * 864e5) : null;
  });
  return {T, budget, guests, ev, days, weeks, perGuest, tier, cats};
}

function findings(C) {
  const F = [], {T, budget, guests, weeks, days, perGuest, tier, cats} = C;
  const hasDate = days != null;
  const names = a => a.map(c => c.name.toLowerCase()).join(', ');
  if (hasDate) {
    if (days < 0) F.push({l: 'bad', t: 'The event date has passed', b: 'Update the date above to see a live timeline.'});
    else {
      const urgent = cats.filter(c => c.lead > weeks && S.vstat[c.id] !== 'booked').sort((a, b) => b.lead - a.lead);
      if (weeks < T.leadWeeks * 0.5) F.push({l: 'bad', t: `Only ${days} days left, so compress the plan`, b: `A ${T.label.toLowerCase()} normally needs about ${T.leadWeeks} weeks. This week, book in this order: ${names(urgent.slice(0, 4)) || 'venue and caterer'}. Ask each vendor for their earliest open date and take the second-best option over waiting. Spend the first 48 hours fixing guest count and budget so nothing is rebooked later.`});
      else if (weeks < T.leadWeeks) F.push({l: 'warn', t: `${days} days left: tight but workable`, b: `You are inside the usual ${T.leadWeeks}-week window. Book ${names(urgent.slice(0, 3)) || 'the big items'} within 7 days. The Timeline tab shows which milestones are already behind.`});
      else F.push({l: 'good', t: `${days} days left: a comfortable runway`, b: `You have more than the usual ${T.leadWeeks} weeks. Use the early weeks to compare 3 quotes per vendor and negotiate.`});
    }
  }
  if (perGuest) {
    const lo = T.tier[0];
    if (tier === 'tight') {
      const fit = Math.floor(budget / lo / 5) * 5;
      const soft = cats.filter(c => ['decor', 'attire', 'music', 'fun', 'photo', 'promo', 'invite', 'gifts'].includes(c.id));
      const save = soft.reduce((a, c) => a + c.amt, 0) * 0.2;
      F.push({l: 'warn', t: `${inr(perGuest)} per guest is below the usual ${inr(lo)}`, b: `${T.perGuestNote} Two ways to close the gap. Option A: cap the list near ${fit} guests, which fits your budget at ${inr(lo)} per guest. Option B: keep ${guests} guests and trim flexible items (décor, entertainment, photos, printing) by 20 percent, which frees about ${inr(save)}. A mix works best: trim 10 percent of guests and 10 percent of flexible spend.`});
    } else if (tier === 'generous') {
      F.push({l: 'good', t: `${inr(perGuest)} per guest is comfortable`, b: `Put the extra into what you care about${S.prios.length ? ' (' + S.prios.join(', ').toLowerCase() + ')' : ''} and keep the contingency untouched.`});
    } else {
      F.push({l: 'good', t: `${inr(perGuest)} per guest is a workable budget`, b: `It sits in the normal range. ${T.perGuestNote} Hold the contingency and compare quotes before paying any advance.`});
    }
  }
  if (S.venue === 'none' && hasDate && days >= 0) {
    const v = cats.find(c => c.id === 'venue');
    F.push(v && weeks < v.lead
      ? {l: 'bad', t: 'The venue is your first blocker', b: `Venues need about ${v.lead} weeks and you are inside that. Phone 5 options today and ask which dates they can hold before you compare prices. Every other booking depends on this one.`}
      : {l: 'warn', t: 'Book the venue next', b: 'Shortlist 3 venues, visit them at the time of day you will use them, and get the rate, overtime and cancellation terms in writing.'});
  }
  const spent = cats.reduce((a, c) => a + c.spent, 0);
  const over = cats.filter(c => c.amt && c.spent > c.amt);
  if (budget && spent > budget) F.push({l: 'bad', t: `Your quotes are ${inr(spent - budget)} over the total budget`, b: 'Do not pay any more advances until the plan balances. Cut scope in the flexible categories first.'});
  else if (over.length) F.push({l: 'warn', t: `Over plan in ${over.length} ${over.length > 1 ? 'categories' : 'category'}`, b: `${names(over)}: move the difference from categories that are under plan, or reduce scope, before paying advances.`});

  const p = (S.problem || '').toLowerCase();
  const wed = S.type === 'wedding';
  const rules = [
    [/guest|invit|list|headcount|attendee|crowd/, () => ({l: 'warn', t: 'Settle the guest list with a rule, not a debate', b: wed
      ? `Fix one total (${guests || 'a number'}) and split it between the two sides in advance${guests ? ', for example ' + Math.round(guests / 2) + ' each' : ''}. Each side marks a must-invite A-list of about 60 percent of its quota and fills the rest from a B-list as RSVPs come in. Each side owns its own cuts.`
      : `Fix one total (${guests || 'a number'}). Make an A-list of about ${Math.round(guests * 0.6 / 5) * 5 || 'the 60 percent'} must-invite people, then fill the remaining seats from a B-list as RSVPs decline.`})],
    [/budget|afford|expens|cost|cheap|money|small|tight|spend/, () => {
      const food = cats.find(c => c.id === 'food'), venue = cats.find(c => c.id === 'venue');
      const g10 = (food ? food.amt * 0.1 : 0) + (venue ? venue.amt * 0.05 : 0);
      return {l: 'warn', t: 'Cut cost in this order', b: `1) Trim the list by 10 percent, which saves about ${inr(g10)} on food and venue. 2) Rent décor, florals and furniture instead of buying. 3) Shorten or merge one function. 4) Ask for bundled quotes, such as venue with catering or sound with lights. Do not cut the contingency or the safety and logistics lines.`};
    }],
    [/family|parent|argue|disagree|conflict|opinion|in-law|inlaw|elder|relative/, () => ({l: 'warn', t: 'Decide each thing once, in writing', b: 'Hold one 60-minute meeting with an agenda: total budget, guest cap, dates. Write the decisions in a shared note. Name one decision-maker per area (food, décor, rituals, travel) and let that person say the final word within the agreed budget. Reopen a decision only with a new quote or a new fact.'})],
    [/weather|rain|monsoon|heat|outdoor/, () => ({l: 'warn', t: 'Pick your weather plan now', b: 'Choose the indoor or covered fallback, get a quote for a tent or shade, and agree a decision time (for example 24 hours before) with the venue and vendors.'})],
    [/vendor|cancel|advance|deposit|cheat|contract|quote/, () => ({l: 'warn', t: 'Protect your advances', b: 'Pay no more than 25 to 30 percent as an advance. Get a written quote that lists what is included, the date, the timings and the cancellation terms. Pay the balance in stages tied to delivery, and keep every receipt in one folder.'})],
    [/volunteer|safety|permission|police|licen|noc/, () => ({l: 'warn', t: 'Permissions and people come first', b: 'List every permission (society, local police, sound, fire, food) with an owner and a deadline. Give each volunteer one role, one team colour and one named supervisor. Keep a printed contact sheet at the entry desk.'})],
    [/sponsor|donat|fund|collection/, () => ({l: 'warn', t: 'Make the ask easy to say yes to', b: 'Prepare a one-page brief with date, expected attendance, three sponsor levels and what each gets. Ask 10 local businesses in one week. Publish the accounts after the event.'})]
  ];
  let n = 0;
  rules.forEach(([re, fn]) => { if (n < 3 && re.test(p)) { F.push(fn()); n++; } });
  if (!n && p.trim()) F.push({l: 'warn', t: 'Your concern needs a tailored answer', b: 'The Ask Claude tab turns your exact situation into a plan with numbers and a 7-day action list.'});
  return F;
}
