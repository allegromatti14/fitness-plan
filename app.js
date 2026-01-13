
/* Phone-friendly training app (no external libs)
   - 1 day = 1 screen
   - localStorage progress (weight, done, notes)
   - export/import JSON
   - simple weight chart (canvas)
*/

const DAYS = [
  { id: 1, key: "pon", name: "Poniedzialek", focus: "Nogi + brzuch", warmup: true,
    items: [
      ex("Przysiady", "3 x 15", ["Stopy na szerokosc barkow", "Plecy proste", "Biodra w dol", "Oddychaj spokojnie"]),
      ex("Sklony w przod", "3 x 10", ["Nogi proste", "Reka do kolan lub lydek", "Bez szarpania"]),
      ex("Brzuszki", "3 x 12", ["Nogi ugiete", "Dlonie przy skroniach", "Nie ciagnij glowy"]),
      ex("Plank (deska)", "3 x 25 s", ["Oparcie na przedramionach", "Brzuch napiety", "Cialo w jednej linii", "Oddychaj"]),
    ]
  },
  { id: 2, key: "wto", name: "Wtorek", focus: "Gora + brzuch", warmup: true,
    items: [
      ex("Pompki klasyczne", "3 x 8-12", ["Rece pod barkami", "Cialo sztywne", "Schodz klatka do ziemi", "Bez wyginania plecow"]),
      ex("Unoszenie rak w bok", "3 x 15", ["Stoisz prosto", "Rece w gore bokiem do barkow", "Powoli w gore i w dol", "Nie machaj"]),
      ex("Brzuszki skosne", "3 x 12", ["Skret tulowia", "Lokiec do przeciwnego kolana", "Spokojny rytm"]),
      ex("Plank (deska)", "3 x 30 s", ["Brzuch napiety", "Cialo w jednej linii", "Oddychaj"]),
    ]
  },
  { id: 3, key: "sro", name: "Sroda", focus: "Spalanie + brzuch", warmup: true,
    items: [
      ex("Pajacyki", "3 x 40 s", ["Rowny rytm", "Oddychaj", "Nie skacz za wysoko"]),
      ex("Przysiady", "3 x 12", ["Plecy proste", "Biodra w dol"]),
      ex("Mountain climbers", "3 x 25 s", ["Pozycja jak do pompki", "Kolana na zmiane do klatki", "Nie bujaj biodrami"]),
      ex("Brzuszki", "3 x 15", ["Nogi ugiete", "Nie ciagnij glowy"]),
    ]
  },
  { id: 4, key: "czw", name: "Czwartek", focus: "Powtorka poniedzialku", warmup: true, repeatOf: 1, items: [] },
  { id: 5, key: "pia", name: "Piatek", focus: "Powtorka wtorku", warmup: true, repeatOf: 2, items: [] },
  { id: 6, key: "sob", name: "Sobota", focus: "Lekki dzien", warmup: false,
    items: [
      ex("Marsz w miejscu", "5 min", ["Kolana lekko wyzej", "Lekki oddech"]),
      ex("Sklony", "3 x 12", ["Bez szarpania", "Powoli"]),
      ex("Plank (deska)", "3 x 30 s", ["Brzuch napiety", "Oddychaj"]),
      ex("Rozciaganie", "5 min", ["Barki, uda, lydki", "Bez bolu"]),
    ]
  },
  { id: 7, key: "nie", name: "Niedziela", focus: "Reset", warmup: false,
    items: [
      ex("Spacer", "15-20 min", ["Spokojne tempo", "Oddychaj", "Najwazniejsze: wyjsc"]),
    ]
  },
];

function ex(name, volume, how){ return { name, volume, how }; }

const els = {
  dayCard: document.getElementById("dayCard"),
  logCard: document.getElementById("logCard"),
  statsCard: document.getElementById("statsCard"),
  weightInput: document.getElementById("weightInput"),
  doneInput: document.getElementById("doneInput"),
  notesInput: document.getElementById("notesInput"),
  saveBtn: document.getElementById("saveBtn"),
  resetBtn: document.getElementById("resetBtn"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  todayBtn: document.getElementById("todayBtn"),
  statsBtn: document.getElementById("statsBtn"),
  exportBtn: document.getElementById("exportBtn"),
  importInput: document.getElementById("importInput"),
  chips: Array.from(document.querySelectorAll(".chip[data-day]")),
  streakNum: document.getElementById("streakNum"),
  weightToday: document.getElementById("weightToday"),
  lastDone: document.getElementById("lastDone"),
  statEntries: document.getElementById("statEntries"),
  statDone: document.getElementById("statDone"),
  statMin: document.getElementById("statMin"),
  statMax: document.getElementById("statMax"),
  chart: document.getElementById("weightChart"),
  installBtn: document.getElementById("installBtn"),
};

const STORAGE_KEY = "fitness_plan_v1";
let state = loadState();

let currentDayId = computeTodayDayId();
renderDay(currentDayId);
refreshHeaderStats();
refreshStatsView();

els.chips.forEach(ch => ch.addEventListener("click", () => {
  const id = Number(ch.dataset.day);
  renderDay(id);
}));

els.prevBtn.addEventListener("click", ()=> renderDay(prevDayId(currentDayId)));
els.nextBtn.addEventListener("click", ()=> renderDay(nextDayId(currentDayId)));
els.todayBtn.addEventListener("click", ()=> renderDay(computeTodayDayId()));

els.statsBtn.addEventListener("click", ()=> {
  const show = els.statsCard.hidden;
  els.statsCard.hidden = !show;
  els.logCard.hidden = show; // swap
  if(show) refreshStatsView();
});

els.saveBtn.addEventListener("click", ()=> {
  const date = isoToday();
  const weight = parseWeight(els.weightInput.value);
  const done = !!els.doneInput.checked;
  const notes = (els.notesInput.value || "").trim();
  state.entries[date] = { date, weight, done, notes, dayId: currentDayId };
  saveState();
  toast("Zapisano!");
  refreshHeaderStats();
  refreshStatsView();
});

els.resetBtn.addEventListener("click", ()=> {
  if(!confirm("Na pewno wyczyscic wszystkie dane?")) return;
  state = defaultState();
  saveState();
  renderDay(currentDayId);
  refreshHeaderStats();
  refreshStatsView();
  toast("Zresetowano.");
});

els.exportBtn.addEventListener("click", ()=> {
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "fitness_plan_backup.json";
  a.click();
  URL.revokeObjectURL(a.href);
});

els.importInput.addEventListener("change", async (e)=> {
  const file = e.target.files?.[0];
  if(!file) return;
  const text = await file.text();
  try{
    const imported = JSON.parse(text);
    if(!imported || !imported.entries) throw new Error("bad format");
    state = imported;
    saveState();
    renderDay(currentDayId);
    refreshHeaderStats();
    refreshStatsView();
    toast("Zaimportowano!");
  }catch(err){
    alert("Nie udalo sie zaimportowac pliku.");
  }finally{
    e.target.value = "";
  }
});

function renderDay(id){
  currentDayId = id;
  const day = resolveDay(id);
  els.chips.forEach(c => c.classList.toggle("active", Number(c.dataset.day) === id));

  const date = isoToday();
  const todaysEntry = state.entries[date] || null;
  els.weightInput.value = todaysEntry?.weight ?? "";
  els.doneInput.checked = !!todaysEntry?.done;
  els.notesInput.value = todaysEntry?.notes ?? "";

  const warmup = warmupBlock(day.warmup);

  const itemsHtml = (day.items.length ? day.items : resolveDay(day.repeatOf).items)
    .map((it, idx)=> itemBlock(it, idx+1))
    .join("");

  const repeatNote = day.repeatOf ? `<div class="badge"><span class="dot"></span>Powtorka dnia ${day.repeatOf}</div>` : `<div class="badge"><span class="dot"></span>Plan dnia</div>`;

  els.dayCard.innerHTML = `
    <div class="row between wrap gap">
      <div>
        <h2>${day.name} • ${day.focus}</h2>
        <div class="muted small">Godzina: 7:00 • Czas: 15-20 min</div>
      </div>
      ${repeatNote}
    </div>

    ${warmup}
    <div class="list">${itemsHtml}</div>
  `;
}

function warmupBlock(show){
  if(!show) return `
    <div class="item">
      <div class="item-top">
        <h3>Rozgrzewka</h3><span class="pill alt">opcjonalnie</span>
      </div>
      <p>Jesli czujesz sztywnosc: 3 min (krazenia ramion, bioder, marsz w miejscu, sklony boczne).</p>
    </div>
  `;
  return `
    <div class="item">
      <div class="item-top">
        <h3>Rozgrzewka</h3><span class="pill good">3 min</span>
      </div>
      <p>Marsz 1 min • Krazenia ramion 30 s • Krazenia bioder 30 s • Sklony boczne 1 min</p>
    </div>
  `;
}

function itemBlock(it, nr){
  const pills = `<span class="pill fire">${it.volume}</span>`;
  const how = it.how?.length ? `
    <div class="how">
      <div class="muted small"><b>Jak robic:</b></div>
      <p>${it.how.map(x=>`• ${escapeHtml(x)}`).join("<br/>")}</p>
    </div>` : "";
  return `
    <div class="item">
      <div class="item-top">
        <h3>${nr}. ${escapeHtml(it.name)}</h3>
        ${pills}
      </div>
      ${how}
    </div>
  `;
}

function resolveDay(id){
  return DAYS.find(d => d.id === id) || DAYS[0];
}
function prevDayId(id){ return id === 1 ? 7 : id - 1; }
function nextDayId(id){ return id === 7 ? 1 : id + 1; }

function computeTodayDayId(){
  // JS: Sunday=0 ... Saturday=6
  const d = new Date();
  const dow = d.getDay(); // 0..6
  const map = {1:1,2:2,3:3,4:4,5:5,6:6,0:7}; // Mon..Sun
  return map[dow];
}

function isoToday(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

function parseWeight(v){
  if(!v) return null;
  const cleaned = String(v).replace(",", ".").trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

function defaultState(){
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    entries: {} // keyed by YYYY-MM-DD
  };
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    const s = JSON.parse(raw);
    if(!s.entries) return defaultState();
    return s;
  }catch{
    return defaultState();
  }
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function refreshHeaderStats(){
  const today = isoToday();
  const e = state.entries[today];
  els.weightToday.textContent = e?.weight != null ? `${e.weight.toFixed(1)} kg` : "-";
  const lastDone = getLastDoneDate();
  els.lastDone.textContent = lastDone ? lastDone : "-";
  els.streakNum.textContent = String(calcStreak());
}

function getLastDoneDate(){
  const dates = Object.keys(state.entries).sort();
  for(let i=dates.length-1;i>=0;i--){
    const e = state.entries[dates[i]];
    if(e?.done) return dates[i];
  }
  return null;
}

function calcStreak(){
  // count consecutive days ending today where done=true
  let streak = 0;
  let d = new Date();
  while(true){
    const iso = toIso(d);
    const e = state.entries[iso];
    if(e?.done){
      streak++;
      d = addDays(d, -1);
      continue;
    }
    break;
  }
  return streak;
}

function addDays(date, n){
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function toIso(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

function refreshStatsView(){
  const entries = Object.values(state.entries).sort((a,b)=> a.date.localeCompare(b.date));
  els.statEntries.textContent = String(entries.length);
  const doneCount = entries.filter(e=>e.done).length;
  els.statDone.textContent = String(doneCount);

  const weights = entries.map(e=>e.weight).filter(v=>typeof v === "number" && isFinite(v));
  if(weights.length){
    els.statMin.textContent = `${Math.min(...weights).toFixed(1)} kg`;
    els.statMax.textContent = `${Math.max(...weights).toFixed(1)} kg`;
  } else {
    els.statMin.textContent = "-";
    els.statMax.textContent = "-";
  }

  drawChart(entries);
}

function drawChart(entries){
  const ctx = els.chart.getContext("2d");
  const W = els.chart.width;
  const H = els.chart.height;
  ctx.clearRect(0,0,W,H);

  // background grid
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  ctx.fillRect(0,0,W,H);

  const pts = entries
    .filter(e=> typeof e.weight === "number" && isFinite(e.weight))
    .map(e=> ({ x: e.date, y: e.weight }));

  if(pts.length < 2){
    ctx.fillStyle = "rgba(234,240,255,0.7)";
    ctx.font = "18px system-ui";
    ctx.fillText("Dodaj min. 2 wpisy z waga, aby zobaczyc wykres.", 20, 60);
    return;
  }

  const minY = Math.min(...pts.map(p=>p.y));
  const maxY = Math.max(...pts.map(p=>p.y));
  const pad = 30;

  // axes
  ctx.strokeStyle = "rgba(234,240,255,0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, H-pad);
  ctx.lineTo(W-pad, H-pad);
  ctx.stroke();

  // y labels (3 lines)
  ctx.fillStyle = "rgba(234,240,255,0.6)";
  ctx.font = "12px system-ui";
  for(let i=0;i<=2;i++){
    const t = i/2;
    const yVal = (maxY - (maxY-minY)*t);
    const y = pad + (H-2*pad)*t;
    ctx.fillText(yVal.toFixed(1), 6, y+4);
    ctx.strokeStyle = "rgba(234,240,255,0.10)";
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(W-pad, y);
    ctx.stroke();
  }

  // polyline
  const n = pts.length;
  const xStep = (W-2*pad)/(n-1);
  const toXY = (p, i) => {
    const x = pad + xStep*i;
    const y = pad + (H-2*pad) * (1 - (p.y - minY)/(maxY-minY || 1));
    return {x,y};
  };

  ctx.strokeStyle = "rgba(6,182,212,0.85)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  pts.forEach((p,i)=>{
    const {x,y} = toXY(p,i);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();

  // points
  ctx.fillStyle = "rgba(124,58,237,0.95)";
  pts.forEach((p,i)=>{
    const {x,y} = toXY(p,i);
    ctx.beginPath();
    ctx.arc(x,y,5,0,Math.PI*2);
    ctx.fill();
  });

  // last label
  const last = pts[pts.length-1];
  ctx.fillStyle = "rgba(234,240,255,0.85)";
  ctx.font = "13px system-ui";
  ctx.fillText(`ostatnia: ${last.y.toFixed(1)} kg`, W-190, pad-8);
}

function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function toast(msg){
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.position="fixed";
  t.style.left="50%";
  t.style.bottom="22px";
  t.style.transform="translateX(-50%)";
  t.style.padding="10px 12px";
  t.style.borderRadius="14px";
  t.style.background="rgba(0,0,0,.55)";
  t.style.border="1px solid rgba(255,255,255,.14)";
  t.style.backdropFilter="blur(10px)";
  t.style.zIndex="9999";
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 1200);
}

// PWA install
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  els.installBtn.hidden = false;
});
els.installBtn.addEventListener("click", async ()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  els.installBtn.hidden = true;
});

// Service worker
if("serviceWorker" in navigator){
  window.addEventListener("load", ()=> navigator.serviceWorker.register("./sw.js"));
}
