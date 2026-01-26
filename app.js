(function(){
const DAYS=[
  day(1,"Poniedzialek","Brzuch / core",{
    "15":[
      ex("Plank (deska)","3 x 30 s","images/plank.png",["Brzuch napiety","Cialo w jednej linii","Oddychaj spokojnie"]),
      ex("Brzuszki","3 x 15","images/brzuszki.png",["Nogi ugiete","Dlonie przy skroniach","Nie ciagnij glowy"]),
      ex("Unoszenie nog lezac","3 x 12","images/legraise.png",["Dol plecow przyklejony","Ruch powoli","Bez machania"]),
    ],
    "30":[
      ex("Kolko treningowe (ab wheel)","4 x 10","images/abwheel.png",["Kolana na macie","Brzuch napiety","Krotki zasieg na start","Nie wyginaj ledzwi"]),
      ex("Unoszenie nog lezac","4 x 15","images/legraise.png",["Dol plecow przyklejony","Powoli w gore i w dol"]),
      ex("Plank (deska)","4 x 45 s","images/plank.png",["Brzuch + posladki napiete","Cialo w jednej linii","Oddychaj"]),
      ex("Brzuszki","3 x 20","images/brzuszki.png",["Kontrola ruchu","Nie ciagnij glowy"]),
    ]
  }),
  day(2,"Wtorek","Brzuch + gora",{
    "15":[
      ex("Pompki klasyczne","3 x 10","images/pompki.png",["Rece pod barkami","Cialo sztywne","Kontrola w dol"]),
      ex("Russian twist (hantel)","3 x 16","images/russian.png",["Lekko odchyl sie","Krec tulowiem","Nie tylko rekami"]),
      ex("Plank bokiem","2 x 30 s / strona","images/sideplank.png",["Biodra wysoko","Cialo w linii","Oddychaj"]),
    ],
    "30":[
      ex("Pompki klasyczne","4 x 15","images/pompki.png",["Rece pod barkami","Cialo sztywne","Pelny ruch"]),
      ex("Russian twist (hantel)","4 x 20","images/russian.png",["Kontrola","Bez szarpania"]),
      ex("Plank bokiem","3 x 30 s / strona","images/sideplank.png",["Biodra wysoko","Nie skrecaj miednicy"]),
      ex("Mountain climbers","3 x 40 s","images/climbers.png",["Pozycja jak do pompki","Kolana na zmiane","Nie bujaj biodrami"]),
    ]
  }),
  day(3,"Sroda","Core HARD",{
    "15":[
      ex("Hollow body hold","3 x 20 s","images/hollow.png",["Unies ramiona i nogi","Nie odrywaj ledzwi","Oddychaj"]),
      ex("Brzuszki skosne","3 x 12","images/skosne.png",["Lokiec do przeciwnego kolana","Spokojny rytm"]),
      ex("Plank (deska)","2 x 45 s","images/plank.png",["Brzuch napiety","Cialo w jednej linii"]),
    ],
    "30":[
      ex("Kolko treningowe (ab wheel)","5 x 8","images/abwheel.png",["Kontrola ruchu","Nie wyginaj ledzwi"]),
      ex("Hollow body hold","4 x 30 s","images/hollow.png",["Brzuch twardy","Oddychaj"]),
      ex("Brzuszki skosne","4 x 16","images/skosne.png",["Kontrola","Bez szarpania"]),
      ex("Plank (deska)","3 x 60 s","images/plank.png",["Brzuch + posladki napiete","Oddychaj"]),
    ]
  }),
  day(4,"Czwartek","Brzuch + cardio",{
    "15":[
      ex("Pajacyki","3 x 30 s","images/pajacyki.png",["Rowny rytm","Oddychaj"]),
      ex("Mountain climbers","3 x 30 s","images/climbers.png",["Nie bujaj biodrami","Tempo rowne"]),
      ex("Plank (deska)","2 x 45 s","images/plank.png",["Brzuch napiety","Cialo w linii"]),
    ],
    "30":[
      ex("Pajacyki","5 x 40 s","images/pajacyki.png",["Rowny rytm","Oddychaj"]),
      ex("Mountain climbers","4 x 40 s","images/climbers.png",["Pozycja jak do pompki","Kolana na zmiane"]),
      ex("Unoszenie nog lezac","4 x 15","images/legraise.png",["Dol plecow przyklejony","Ruch powoli"]),
      ex("Plank (deska)","3 x 45 s","images/plank.png",["Brzuch napiety","Oddychaj"]),
    ]
  }),
  day(5,"Piatek","Sila brzucha",{
    "15":[
      ex("Brzuszki","3 x 20","images/brzuszki.png",["Kontrola ruchu","Nie ciagnij glowy"]),
      ex("Russian twist (hantel)","3 x 16","images/russian.png",["Krec tulowiem","Kontrola"]),
      ex("Hollow body hold","2 x 30 s","images/hollow.png",["Brzuch twardy","Oddychaj"]),
    ],
    "30":[
      ex("Kolko treningowe (ab wheel)","6 x 6","images/abwheel.png",["Krotki zasieg","Kontrola"]),
      ex("Russian twist (ciezej)","4 x 20","images/russian.png",["Kontrola","Bez szarpania"]),
      ex("Hollow body hold","3 x 45 s","images/hollow.png",["Brzuch twardy","Oddychaj"]),
      ex("Brzuszki","3 x 25","images/brzuszki.png",["Kontrola","Nie ciagnij glowy"]),
    ]
  }),
  day(6,"Sobota","Obwod HARD",{
    "15":[
      ex("Obwod x3","Pompki 10 • Brzuszki 15 • Plank 30 s","images/pompki.png",["3 rundy","Minimalne przerwy","Technika > tempo"]),
    ],
    "30":[
      ex("Obwod x4","Pompki 15 • Brzuszki 20 • Plank 40 s • Climbers 30 s","images/climbers.png",["4 rundy","Minimalne przerwy","Oddychaj"]),
    ]
  }),
  day(7,"Niedziela","Core finish",{
    "15":[
      ex("Plank (deska)","3 x 45 s","images/plank.png",["Brzuch napiety","Oddychaj"]),
      ex("Hollow body hold","3 x 20 s","images/hollow.png",["Nie odrywaj ledzwi","Oddychaj"]),
    ],
    "30":[
      ex("Plank (deska)","5 x 60 s","images/plank.png",["Brzuch + posladki napiete","Oddychaj"]),
      ex("Hollow body hold","4 x 30 s","images/hollow.png",["Brzuch twardy","Oddychaj"]),
      ex("Kolko treningowe (ab wheel)","4 x 10","images/abwheel.png",["Kontrola","Krotki zasieg na start"]),
    ]
  }),
];
function day(id,name,focus,itemsByMode){return{id,name,focus,itemsByMode};}
function ex(name,volume,img,how){return{name,volume,img,how};}

const els={
  dayCard:document.getElementById("dayCard"),
  weightInput:document.getElementById("weightInput"),
  doneInput:document.getElementById("doneInput"),
  notesInput:document.getElementById("notesInput"),
  saveBtn:document.getElementById("saveBtn"),
  resetBtn:document.getElementById("resetBtn"),
  prevBtn:document.getElementById("prevBtn"),
  nextBtn:document.getElementById("nextBtn"),
  todayBtn:document.getElementById("todayBtn"),
  exportBtn:document.getElementById("exportBtn"),
  importInput:document.getElementById("importInput"),
  chips:Array.from(document.querySelectorAll(".chip[data-day]")),
  streakNum:document.getElementById("streakNum"),
  weightToday:document.getElementById("weightToday"),
  lastDone:document.getElementById("lastDone"),
  installBtn:document.getElementById("installBtn"),
  statsBtn:document.getElementById("statsBtn"),
  mode15Btn:document.getElementById("mode15Btn"),
  mode30Btn:document.getElementById("mode30Btn"),
  statsCard:document.getElementById("statsCard"),
  logCard:document.getElementById("logCard"),
  statEntries:document.getElementById("statEntries"),
  statDone:document.getElementById("statDone"),
  statMin:document.getElementById("statMin"),
  statMax:document.getElementById("statMax"),
  chart:document.getElementById("weightChart"),
};
const STORAGE_KEY="fitness_plan_v4_15_30_mode";
let state=loadState();
let currentDayId=computeTodayDayId();
wireUI();
renderDay(currentDayId);
refreshHeader();
refreshStats();

function wireUI(){
  els.chips.forEach(ch=>ch.addEventListener("click",()=>renderDay(Number(ch.dataset.day))));
  els.prevBtn.addEventListener("click",()=>renderDay(prevDayId(currentDayId)));
  els.nextBtn.addEventListener("click",()=>renderDay(nextDayId(currentDayId)));
  els.todayBtn.addEventListener("click",()=>renderDay(computeTodayDayId()));

  // mode toggle: 15 min vs 30 min (B)
  function setMode(m){
    state.mode=String(m);
    saveState();
    els.mode15Btn.classList.toggle("active",state.mode==="15");
    els.mode30Btn.classList.toggle("active",state.mode==="30");
    renderDay(currentDayId);
  }
  if(els.mode15Btn) els.mode15Btn.addEventListener("click",()=>setMode("15"));
  if(els.mode30Btn) els.mode30Btn.addEventListener("click",()=>setMode("30"));


  els.saveBtn.addEventListener("click",saveToday);
  els.resetBtn.addEventListener("click",()=>{
    if(!confirm("Na pewno wyczyscic wszystkie dane?")) return;
    state=defaultState(); saveState();
    renderDay(currentDayId); refreshHeader(); refreshStats();
    toast("Zresetowano.");
  });

  els.exportBtn.addEventListener("click",()=>{
    const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="fitness_plan_backup.json";
    a.click(); URL.revokeObjectURL(a.href);
  });

  els.importInput.addEventListener("change",async(e)=>{
    const file=e.target.files&&e.target.files[0];
    if(!file) return;
    try{
      const imported=JSON.parse(await file.text());
      if(!imported||!imported.entries) throw new Error("bad");
      state=imported; saveState();
      renderDay(currentDayId); refreshHeader(); refreshStats();
      toast("Zaimportowano!");
    }catch{ alert("Nie udalo sie zaimportowac pliku."); }
    finally{ e.target.value=""; }
  });

  els.statsBtn.addEventListener("click",()=>{
    const show=els.statsCard.hidden;
    els.statsCard.hidden=!show;
    els.logCard.hidden=show;
    if(show) refreshStats();
  });

  let deferredPrompt=null;
  window.addEventListener("beforeinstallprompt",(e)=>{
    e.preventDefault(); deferredPrompt=e; els.installBtn.hidden=false;
  });
  els.installBtn.addEventListener("click",async()=>{
    if(!deferredPrompt) return;
    deferredPrompt.prompt(); await deferredPrompt.userChoice;
    deferredPrompt=null; els.installBtn.hidden=true;
  });

  if("serviceWorker" in navigator){
    window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js"));
  }
}

function saveToday(){
  const date=isoToday();
  const weight=parseWeight(els.weightInput.value);
  const done=!!els.doneInput.checked;
  const notes=(els.notesInput.value||"").trim();
  state.entries[date]={date,weight,done,notes,dayId:currentDayId};
  saveState(); toast("Zapisano!");
  refreshHeader(); refreshStats();
}

function renderDay(id){
  currentDayId=id;
  const d=getDay(id);
  els.chips.forEach(c=>c.classList.toggle("active",Number(c.dataset.day)===id));

  // mode buttons state
  if(els.mode15Btn) els.mode15Btn.classList.toggle("active",state.mode==="15");
  if(els.mode30Btn) els.mode30Btn.classList.toggle("active",state.mode==="30");

  const entry=state.entries[isoToday()]||{};
  els.weightInput.value=entry.weight??"";
  els.doneInput.checked=!!entry.done;
  els.notesInput.value=entry.notes??"";

  const mode = state.mode==="30" ? "30" : "15";
  const timeLabel = mode==="30" ? "30 min (HARDCORE B)" : "15 min";
  const warmupTime = mode==="30" ? "5 min" : "3 min";
  const warmupText = mode==="30"
    ? "Marsz 2 min • Krazenia ramion 1 min • Krazenia bioder 1 min • Lekki plank 1 min"
    : "Marsz 1 min • Krazenia ramion 30 s • Krazenia bioder 30 s • Sklony boczne 1 min";

  const warmup=`
    <div class="item">
      <div class="item-top"><h3>Rozgrzewka</h3><span class="pill good">${warmupTime}</span></div>
      <p>${warmupText}</p>
    </div>`;

  const items=(d.itemsByMode[mode]||[]).map((it,i)=>itemBlock(it,i+1)).join("");
  const badge = mode==="30"
    ? `<div class="badge"><span class="dot"></span>Tryb: 30 MIN (B)</div>`
    : `<div class="badge"><span class="dot"></span>Tryb: 15 MIN</div>`;

  els.dayCard.innerHTML=`
    <div class="row between wrap gap">
      <div>
        <h2>${esc(d.name)} • ${esc(d.focus)}</h2>
        <div class="muted small">Godzina: 7:00 • Czas: ${timeLabel}</div>
      </div>
      ${badge}
    </div>
    ${warmup}
    <div class="list">${items}</div>
  `;
}

function itemBlock(it,nr){
  return `
  <div class="item">
    <div class="item-top">
      <h3>${nr}. ${esc(it.name)}</h3>
      <span class="pill fire">${esc(it.volume)}</span>
    </div>
    <div class="img">
      <img src="${esc(it.img)}" alt="${esc(it.name)}" loading="lazy" />
      <div class="img-cap"><span>Zdjecie / schemat</span><span>${esc(it.name)}</span></div>
    </div>
    <div class="how">
      <div class="muted small"><b>Jak robic:</b></div>
      <p>${it.how.map(x=>"• "+esc(x)).join("<br/>")}</p>
    </div>
  </div>`;
}

function getDay(id){ return DAYS.find(d=>d.id===id)||DAYS[0]; }
function prevDayId(id){ return id===1?7:id-1; }
function nextDayId(id){ return id===7?1:id+1; }
function computeTodayDayId(){
  const dow=new Date().getDay();
  return ({1:1,2:2,3:3,4:4,5:5,6:6,0:7})[dow];
}
function isoToday(){
  const d=new Date();
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
function parseWeight(v){
  if(!v) return null;
  const num=Number(String(v).replace(",",".").trim());
  return Number.isFinite(num)?num:null;
}
function defaultState(){ return {version:4,createdAt:new Date().toISOString(),mode:"15",entries:{}}; }
function loadState(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    const s=JSON.parse(raw);
    if(!s.entries) return defaultState();
    return s;
  }catch{ return defaultState(); }
}
function saveState(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); }
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
  const today=isoToday();
  const e=state.entries[today];
  els.weightToday.textContent=(e&&typeof e.weight==="number")?e.weight.toFixed(1)+" kg":"-";
  const last=lastDoneDate();
  els.lastDone.textContent=last||"-";
  els.streakNum.textContent=String(streak());
}
function lastDoneDate(){
  const dates=Object.keys(state.entries).sort();
  for(let i=dates.length-1;i>=0;i--){ if(state.entries[dates[i]]&&state.entries[dates[i]].done) return dates[i]; }
  return null;
}
function streak(){
  let s=0; let d=new Date();
  while(true){
    const iso=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
    if(state.entries[iso]&&state.entries[iso].done){ s++; d.setDate(d.getDate()-1); continue; }
    break;
  }
  return s;
}
function refreshStats(){
  const entries=Object.values(state.entries);
  els.statEntries.textContent=String(entries.length);
  els.statDone.textContent=String(entries.filter(e=>e.done).length);
  const weights=entries.map(e=>e.weight).filter(w=>typeof w==="number"&&isFinite(w));
  els.statMin.textContent=weights.length?Math.min(...weights).toFixed(1)+" kg":"-";
  els.statMax.textContent=weights.length?Math.max(...weights).toFixed(1)+" kg":"-";
  drawChart(entries);
}
function drawChart(entries){
  const ctx=els.chart.getContext("2d");
  const W=els.chart.width, H=els.chart.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle="rgba(255,255,255,0.03)"; ctx.fillRect(0,0,W,H);
  const pts=entries.filter(e=>typeof e.weight==="number"&&isFinite(e.weight)).sort((a,b)=>a.date.localeCompare(b.date)).map(e=>({y:e.weight}));
  if(pts.length<2){
    ctx.fillStyle="rgba(234,240,255,0.7)"; ctx.font="18px system-ui";
    ctx.fillText("Dodaj min. 2 wpisy z waga, aby zobaczyc wykres.", 20, 60);
    return;
  }
  const minY=Math.min(...pts.map(p=>p.y));
  const maxY=Math.max(...pts.map(p=>p.y));
  const pad=30, n=pts.length, xStep=(W-2*pad)/(n-1);
  const xy=(p,i)=>({x:pad+xStep*i, y:pad+(H-2*pad)*(1-(p.y-minY)/(maxY-minY||1))});
  ctx.strokeStyle="rgba(6,182,212,0.85)"; ctx.lineWidth=3;
  ctx.beginPath();
  pts.forEach((p,i)=>{ const q=xy(p,i); if(i===0) ctx.moveTo(q.x,q.y); else ctx.lineTo(q.x,q.y); });
  ctx.stroke();
  ctx.fillStyle="rgba(124,58,237,0.95)";
  pts.forEach((p,i)=>{ const q=xy(p,i); ctx.beginPath(); ctx.arc(q.x,q.y,5,0,Math.PI*2); ctx.fill(); });
}
})();