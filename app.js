
// Mini trening app: 1 dzien = 1 ekran (offline). ASCII only.
const DAYS = [
  day(1,"Poniedzialek","Nogi + brzuch",[
    ex("Przysiady","3 x 15","squat",[
      "Stopy na szerokosc barkow",
      "Plecy proste",
      "Biodra w dol",
      "Oddychaj spokojnie"
    ]),
    ex("Sklony w przod","3 x 10","bend",[
      "Nogi proste",
      "Reka do kolan lub lydek",
      "Bez szarpania"
    ]),
    ex("Brzuszki","3 x 12","crunch",[
      "Nogi ugiete",
      "Dlonie przy skroniach",
      "Nie ciagnij glowy"
    ]),
    ex("Plank (deska)","3 x 25 s","plank",[
      "Oparcie na przedramionach",
      "Brzuch napiety",
      "Cialo w jednej linii",
      "Oddychaj"
    ]),
  ]),
  day(2,"Wtorek","Gora + brzuch",[
    ex("Pompki klasyczne","3 x 8-12","pushup",[
      "Rece pod barkami",
      "Cialo sztywne",
      "Schodz klatka do ziemi",
      "Bez wyginania plecow"
    ]),
    ex("Unoszenie rak w bok","3 x 15","raise",[
      "Stoisz prosto",
      "Rece bokiem do wysokosci barkow",
      "Powoli w gore i w dol",
      "Nie machaj"
    ]),
    ex("Brzuszki skosne","3 x 12","oblique",[
      "Skret tulowia",
      "Lokiec do przeciwnego kolana",
      "Spokojny rytm"
    ]),
    ex("Plank (deska)","3 x 30 s","plank",[
      "Brzuch napiety",
      "Cialo w jednej linii",
      "Oddychaj"
    ]),
  ]),
  day(3,"Sroda","Spalanie + brzuch",[
    ex("Pajacyki","3 x 40 s","jack",[
      "Rowny rytm",
      "Oddychaj",
      "Nie skacz za wysoko"
    ]),
    ex("Przysiady","3 x 12","squat",[
      "Plecy proste",
      "Biodra w dol"
    ]),
    ex("Mountain climbers","3 x 25 s","climber",[
      "Pozycja jak do pompki",
      "Kolana na zmiane do klatki",
      "Nie bujaj biodrami"
    ]),
    ex("Brzuszki","3 x 15","crunch",[
      "Nogi ugiete",
      "Nie ciagnij glowy"
    ]),
  ]),
  day(4,"Czwartek","Powtorka poniedzialku",[],1),
  day(5,"Piatek","Powtorka wtorku",[],2),
  day(6,"Sobota","Lekki dzien",[
    ex("Marsz w miejscu","5 min","march",[
      "Kolana lekko wyzej",
      "Lekki oddech"
    ]),
    ex("Sklony","3 x 12","bend",[
      "Bez szarpania",
      "Powoli"
    ]),
    ex("Plank (deska)","3 x 30 s","plank",[
      "Brzuch napiety",
      "Oddychaj"
    ]),
    ex("Rozciaganie","5 min","stretch",[
      "Barki, uda, lydki",
      "Bez bolu"
    ]),
  ]),
  day(7,"Niedziela","Reset",[
    ex("Spacer","15-20 min","walk",[
      "Spokojne tempo",
      "Oddychaj",
      "Najwazniejsze: wyjsc"
    ]),
  ]),
];

function day(id,name,focus,items,repeatOf=null){ return {id,name,focus,items,repeatOf}; }
function ex(name,volume,illu,how){ return {name,volume,illu,how}; }

const els = {
  dayCard: document.getElementById("dayCard"),
  weightInput: document.getElementById("weightInput"),
  doneInput: document.getElementById("doneInput"),
  notesInput: document.getElementById("notesInput"),
  saveBtn: document.getElementById("saveBtn"),
  resetBtn: document.getElementById("resetBtn"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  todayBtn: document.getElementById("todayBtn"),
  exportBtn: document.getElementById("exportBtn"),
  importInput: document.getElementById("importInput"),
  chips: Array.from(document.querySelectorAll(".chip[data-day]")),
  streakNum: document.getElementById("streakNum"),
  weightToday: document.getElementById("weightToday"),
  lastDone: document.getElementById("lastDone"),
  installBtn: document.getElementById("installBtn"),
  statsBtn: document.getElementById("statsBtn"),
  statsCard: document.getElementById("statsCard"),
  logCard: document.getElementById("logCard"),
  statEntries: document.getElementById("statEntries"),
  statDone: document.getElementById("statDone"),
  statMin: document.getElementById("statMin"),
  statMax: document.getElementById("statMax"),
  chart: document.getElementById("weightChart"),
};

const STORAGE_KEY = "fitness_plan_v2";
let state = loadState();
let currentDayId = computeTodayDayId();

wireUI();
renderDay(currentDayId);
refreshHeader();
refreshStats();

function wireUI(){
  els.chips.forEach(ch=> ch.addEventListener("click", ()=> renderDay(Number(ch.dataset.day)) ));
  els.prevBtn.addEventListener("click", ()=> renderDay(prevDayId(currentDayId)));
  els.nextBtn.addEventListener("click", ()=> renderDay(nextDayId(currentDayId)));
  els.todayBtn.addEventListener("click", ()=> renderDay(computeTodayDayId()));

  els.saveBtn.addEventListener("click", saveToday);
  els.resetBtn.addEventListener("click", ()=>{
    if(!confirm("Na pewno wyczyscic wszystkie dane?")) return;
    state = defaultState();
    saveState();
    renderDay(currentDayId);
    refreshHeader();
    refreshStats();
    toast("Zresetowano.");
  });

  els.exportBtn.addEventListener("click", ()=>{
    const blob = new Blob([JSON.stringify(state,null,2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fitness_plan_backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  els.importInput.addEventListener("change", async (e)=>{
    const file = e.target.files?.[0];
    if(!file) return;
    try{
      const imported = JSON.parse(await file.text());
      if(!imported || !imported.entries) throw new Error("bad");
      state = imported;
      saveState();
      renderDay(currentDayId);
      refreshHeader();
      refreshStats();
      toast("Zaimportowano!");
    }catch{
      alert("Nie udalo sie zaimportowac pliku.");
    }finally{
      e.target.value = "";
    }
  });

  els.statsBtn.addEventListener("click", ()=>{
    const show = els.statsCard.hidden;
    els.statsCard.hidden = !show;
    els.logCard.hidden = show;
    if(show) refreshStats();
  });

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

  if("serviceWorker" in navigator){
    window.addEventListener("load", ()=> navigator.serviceWorker.register("./sw.js"));
  }
}

function saveToday(){
  const date = isoToday();
  const weight = parseWeight(els.weightInput.value);
  const done = !!els.doneInput.checked;
  const notes = (els.notesInput.value || "").trim();
  state.entries[date] = { date, weight, done, notes, dayId: currentDayId };
  saveState();
  toast("Zapisano!");
  refreshHeader();
  refreshStats();
}

function renderDay(id){
  currentDayId = id;
  const d = getDay(id);
  els.chips.forEach(c=> c.classList.toggle("active", Number(c.dataset.day)===id));

  const entry = state.entries[isoToday()] || {};
  els.weightInput.value = entry.weight ?? "";
  els.doneInput.checked = !!entry.done;
  els.notesInput.value = entry.notes ?? "";

  const warmup = `
    <div class="item">
      <div class="item-top"><h3>Rozgrzewka</h3><span class="pill good">3 min</span></div>
      <p>Marsz 1 min • Krazenia ramion 30 s • Krazenia bioder 30 s • Sklony boczne 1 min</p>
    </div>`;

  const items = (d.items.length ? d.items : getDay(d.repeatOf).items)
    .map((it,i)=> itemBlock(it,i+1)).join("");

  const badge = d.repeatOf
    ? `<div class="badge"><span class="dot"></span>Powtorka dnia ${d.repeatOf}</div>`
    : `<div class="badge"><span class="dot"></span>Plan dnia</div>`;

  els.dayCard.innerHTML = `
    <div class="row between wrap gap">
      <div>
        <h2>${d.name} • ${d.focus}</h2>
        <div class="muted small">Godzina: 7:00 • Czas: 15-20 min</div>
      </div>
      ${badge}
    </div>
    ${warmup}
    <div class="list">${items}</div>
  `;
}

function itemBlock(it, nr){
  return `
  <div class="item">
    <div class="item-top">
      <h3>${nr}. ${esc(it.name)}</h3>
      <span class="pill fire">${esc(it.volume)}</span>
    </div>
    ${illustration(it.illu, it.name)}
    <div class="how">
      <div class="muted small"><b>Jak robic:</b></div>
      <p>${it.how.map(x=>"• "+esc(x)).join("<br/>")}</p>
    </div>
  </div>`;
}

// Inline SVG "photos" (schematic).
function illustration(kind, title){
  const svg = ILLU[kind] || ILLU.default;
  return `
    <div class="illu">
      ${svg}
      <div class="illu-cap"><span>Ilustracja</span><span>${esc(title)}</span></div>
    </div>`;
}

const ILLU = {
  default: box("Cwiczenie"),
  squat: box("Przysiad",[stick(90,130,"squat"), arrow(190,70,190,105), label(220,78,"w dol")]),
  bend: box("Sklon",[stick(90,130,"bend"), label(220,78,"plecy proste")]),
  crunch: box("Brzuszek",[mat(), stick(105,140,"crunch"), label(220,78,"bez ciagniecia glowy")]),
  plank: box("Plank",[mat(), stick(90,140,"plank"), label(220,78,"linia ciala")]),
  pushup: box("Pompka",[mat(), stick(90,140,"pushup"), arrow(190,70,190,105), label(220,78,"kontrola")]),
  raise: box("Unoszenie rak",[stick(90,130,"raise"), arc(90,70,40), label(220,78,"do barkow")]),
  oblique: box("Skosny",[mat(), stick(105,140,"oblique"), label(220,78,"skret")]),
  jack: box("Pajacyk",[stick(90,130,"jack"), label(220,78,"rytm")]),
  climber: box("Climber",[mat(), stick(90,140,"climber"), label(220,78,"kolana na zmiane")]),
  march: box("Marsz",[stick(90,130,"march"), label(220,78,"kolana lekko wyzej")]),
  stretch: box("Rozciaganie",[stick(90,130,"stretch"), label(220,78,"bez bolu")]),
  walk: box("Spacer",[stick(90,130,"walk"), label(220,78,"15-20 min")]),
};

function box(title, parts=[]){
  return `<svg viewBox="0 0 360 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(title)}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="rgba(124,58,237,0.35)"/>
        <stop offset="1" stop-color="rgba(6,182,212,0.25)"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="360" height="180" rx="18" fill="url(#g)"/>
    <rect x="12" y="12" width="336" height="156" rx="14" fill="rgba(0,0,0,0.14)" stroke="rgba(255,255,255,0.18)"/>
    <text x="24" y="44" fill="rgba(234,240,255,0.92)" font-size="16" font-family="system-ui" font-weight="800">${esc(title)}</text>
    ${parts.join("\n")}
  </svg>`;
}
function mat(){
  return `<rect x="42" y="140" width="160" height="18" rx="9" fill="rgba(234,240,255,0.18)" stroke="rgba(234,240,255,0.22)"/>`;
}
function stick(x,y,pose){
  const stroke = `stroke="rgba(234,240,255,0.85)" stroke-width="5" stroke-linecap="round"`;
  const head = `<circle cx="${x}" cy="${y-70}" r="10" fill="rgba(234,240,255,0.85)"/>`;
  const L = (x1,y1,x2,y2)=> `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${stroke}/>`;
  const parts = [head];
  const hx=x, hy=y-60, hipx=x, hipy=y-25;

  if(pose==="squat"){
    parts.push(L(hx,hy, hipx+10, hipy));
    parts.push(L(hx,hy+10, hx-25, hy+20));
    parts.push(L(hx,hy+10, hx+25, hy+20));
    parts.push(L(hipx+10, hipy, hipx-10, hipy+25));
    parts.push(L(hipx+10, hipy, hipx+30, hipy+25));
    parts.push(L(hipx-10, hipy+25, hipx-10, hipy+45));
    parts.push(L(hipx+30, hipy+25, hipx+30, hipy+45));
  } else if(pose==="bend"){
    parts.push(L(hx,hy, hipx+35, hipy-10));
    parts.push(L(hx+10,hy+5, hx+35, hy+25));
    parts.push(L(hx+10,hy+5, hx-10, hy+20));
    parts.push(L(hipx+35, hipy-10, hipx+35, hipy+35));
    parts.push(L(hipx+35, hipy-10, hipx+60, hipy+35));
  } else if(pose==="plank" || pose==="pushup" || pose==="climber"){
    const y0 = y-20;
    parts.length = 0;
    parts.push(`<circle cx="${x}" cy="${y0-40}" r="10" fill="rgba(234,240,255,0.85)"/>`);
    parts.push(L(x+10,y0-32, x+70,y0-22));
    parts.push(L(x+70,y0-22, x+140,y0-20));
    parts.push(L(x+55,y0-25, x+35,y0+5));
    parts.push(L(x+35,y0+5, x+15,y0+10));
    if(pose==="climber"){
      parts.push(L(x+120,y0-20, x+95,y0+15));
      parts.push(L(x+140,y0-20, x+150,y0+20));
    } else {
      parts.push(L(x+120,y0-20, x+135,y0+18));
      parts.push(L(x+140,y0-20, x+160,y0+18));
    }
  } else if(pose==="crunch" || pose==="oblique"){
    const basey = y-5;
    parts.length = 0;
    parts.push(`<circle cx="${x}" cy="${basey-55}" r="10" fill="rgba(234,240,255,0.85)"/>`);
    parts.push(L(x+5,basey-47, x+55, basey-30));
    parts.push(L(x+20,basey-45, x+5, basey-30));
    parts.push(L(x+20,basey-45, x+35, basey-25));
    parts.push(L(x+55,basey-30, x+90, basey-10));
    parts.push(L(x+90,basey-10, x+60, basey-10));
    parts.push(L(x+55,basey-30, x+85, basey-25));
    parts.push(L(x+85,basey-25, x+60, basey-10));
    if(pose==="oblique"){
      parts.push(`<path d="M ${x+10} ${basey-35} Q ${x+35} ${basey-55} ${x+60} ${basey-35}" fill="none" stroke="rgba(6,182,212,0.9)" stroke-width="4" stroke-linecap="round"/>`);
    }
  } else if(pose==="raise"){
    parts.push(L(hx,hy, hipx, hipy));
    parts.push(L(hx,hy+10, hx-35, hy-10));
    parts.push(L(hx,hy+10, hx+35, hy-10));
    parts.push(L(hipx, hipy, hipx-15, hipy+45));
    parts.push(L(hipx, hipy, hipx+15, hipy+45));
  } else if(pose==="jack"){
    parts.push(L(hx,hy, hipx, hipy));
    parts.push(L(hx,hy+10, hx-35, hy-25));
    parts.push(L(hx,hy+10, hx+35, hy-25));
    parts.push(L(hipx, hipy, hipx-25, hipy+45));
    parts.push(L(hipx, hipy, hipx+25, hipy+45));
  } else if(pose==="march" || pose==="walk" || pose==="stretch"){
    parts.push(L(hx,hy, hipx, hipy));
    parts.push(L(hx,hy+10, hx-20, hy+25));
    parts.push(L(hx,hy+10, hx+20, hy+25));
    if(pose==="stretch"){
      parts.push(L(hipx, hipy, hipx-25, hipy+45));
      parts.push(L(hipx, hipy, hipx+15, hipy+45));
      parts.push(`<path d="M ${x-10} ${y-90} Q ${x} ${y-110} ${x+10} ${y-90}" fill="none" stroke="rgba(34,197,94,0.9)" stroke-width="4" stroke-linecap="round"/>`);
    } else {
      parts.push(L(hipx, hipy, hipx-10, hipy+45));
      parts.push(L(hipx, hipy, hipx+25, hipy+25));
    }
  } else {
    parts.push(L(hx,hy, hipx, hipy));
    parts.push(L(hx,hy+10, hx-25, hy+20));
    parts.push(L(hx,hy+10, hx+25, hy+20));
    parts.push(L(hipx, hipy, hipx-15, hipy+45));
    parts.push(L(hipx, hipy, hipx+15, hipy+45));
  }
  return parts.join("\n");
}
function arrow(x1,y1,x2,y2){
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(239,68,68,0.9)" stroke-width="4" stroke-linecap="round"/>
    <path d="M ${x2} ${y2} l -6 -10 l 12 0 z" fill="rgba(239,68,68,0.9)"/>`;
}
function label(x,y,t){
  return `<text x="${x}" y="${y}" fill="rgba(234,240,255,0.85)" font-size="12" font-family="system-ui" font-weight="800">${esc(t)}</text>`;
}
function arc(cx,cy,r){
  return `<path d="M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}" fill="none" stroke="rgba(6,182,212,0.9)" stroke-width="4" stroke-linecap="round"/>`;
}

function getDay(id){ return DAYS.find(d=>d.id===id) || DAYS[0]; }
function prevDayId(id){ return id===1?7:id-1; }
function nextDayId(id){ return id===7?1:id+1; }
function computeTodayDayId(){
  const dow = new Date().getDay(); // 0..6
  return ({1:1,2:2,3:3,4:4,5:5,6:6,0:7})[dow];
}
function isoToday(){
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function parseWeight(v){
  if(!v) return null;
  const num = Number(String(v).replace(",",".").trim());
  return Number.isFinite(num) ? num : null;
}
function defaultState(){ return {version:2, createdAt:new Date().toISOString(), entries:{}}; }
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    const s = JSON.parse(raw);
    if(!s.entries) return defaultState();
    return s;
  }catch{ return defaultState(); }
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function esc(s){
  return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}
function toast(msg){
  const t=document.createElement("div");
  t.textContent=msg;
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
  setTimeout(()=>t.remove(),1200);
}

function refreshHeader(){
  const today = isoToday();
  const e = state.entries[today];
  els.weightToday.textContent = (e && typeof e.weight==="number") ? `${e.weight.toFixed(1)} kg` : "-";
  const last = lastDoneDate();
  els.lastDone.textContent = last || "-";
  els.streakNum.textContent = String(streak());
}
function lastDoneDate(){
  const dates = Object.keys(state.entries).sort();
  for(let i=dates.length-1;i>=0;i--){
    if(state.entries[dates[i]]?.done) return dates[i];
  }
  return null;
}
function streak(){
  let s=0; let d=new Date();
  while(true){
    const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    if(state.entries[iso]?.done){ s++; d.setDate(d.getDate()-1); continue; }
    break;
  }
  return s;
}

// stats (simple)
function refreshStats(){
  const entries = Object.values(state.entries);
  els.statEntries.textContent = String(entries.length);
  const done = entries.filter(e=>e.done).length;
  els.statDone.textContent = String(done);
  const weights = entries.map(e=>e.weight).filter(w=>typeof w==="number" && isFinite(w));
  els.statMin.textContent = weights.length ? `${Math.min(...weights).toFixed(1)} kg` : "-";
  els.statMax.textContent = weights.length ? `${Math.max(...weights).toFixed(1)} kg` : "-";
  drawChart(entries);
}
function drawChart(entries){
  const ctx = els.chart.getContext("2d");
  const W = els.chart.width, H = els.chart.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle="rgba(255,255,255,0.03)"; ctx.fillRect(0,0,W,H);

  const pts = entries.filter(e=> typeof e.weight==="number" && isFinite(e.weight))
                     .sort((a,b)=> a.date.localeCompare(b.date))
                     .map(e=> ({x:e.date,y:e.weight}));
  if(pts.length<2){
    ctx.fillStyle="rgba(234,240,255,0.7)";
    ctx.font="18px system-ui";
    ctx.fillText("Dodaj min. 2 wpisy z waga, aby zobaczyc wykres.", 20, 60);
    return;
  }
  const minY=Math.min(...pts.map(p=>p.y));
  const maxY=Math.max(...pts.map(p=>p.y));
  const pad=30;

  ctx.strokeStyle="rgba(234,240,255,0.25)"; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(pad,pad); ctx.lineTo(pad,H-pad); ctx.lineTo(W-pad,H-pad); ctx.stroke();

  const n=pts.length;
  const xStep=(W-2*pad)/(n-1);
  const xy=(p,i)=>{
    const x=pad+xStep*i;
    const y=pad+(H-2*pad)*(1-(p.y-minY)/(maxY-minY||1));
    return {x,y};
  };

  ctx.strokeStyle="rgba(6,182,212,0.85)"; ctx.lineWidth=3;
  ctx.beginPath();
  pts.forEach((p,i)=>{ const {x,y}=xy(p,i); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
  ctx.stroke();

  ctx.fillStyle="rgba(124,58,237,0.95)";
  pts.forEach((p,i)=>{ const {x,y}=xy(p,i); ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fill(); });
}
