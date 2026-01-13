(function(){
const DAYS=[
  day(1,"Poniedzialek","Nogi + brzuch",[
    ex("Przysiady","3 x 15","images/przysiady.png",["Stopy na szerokosc barkow","Plecy proste","Biodra w dol","Oddychaj spokojnie"]),
    ex("Sklony w przod","3 x 10","images/sklony.png",["Nogi proste","Reka do kolan lub lydek","Bez szarpania"]),
    ex("Brzuszki","3 x 12","images/brzuszki.png",["Nogi ugiete","Dlonie przy skroniach","Nie ciagnij glowy"]),
    ex("Plank (deska)","3 x 25 s","images/plank.png",["Oparcie na przedramionach","Brzuch napiety","Cialo w jednej linii","Oddychaj"]),
  ]),
  day(2,"Wtorek","Gora + brzuch",[
    ex("Pompki klasyczne","3 x 8-12","images/pompki.png",["Rece pod barkami","Cialo sztywne","Schodz klatka do ziemi","Bez wyginania plecow"]),
    ex("Unoszenie rak w bok","3 x 15","images/unoszenie.png",["Stoisz prosto","Rece bokiem do wysokosci barkow","Powoli w gore i w dol","Nie machaj"]),
    ex("Brzuszki skosne","3 x 12","images/skosne.png",["Skret tulowia","Lokiec do przeciwnego kolana","Spokojny rytm"]),
    ex("Plank (deska)","3 x 30 s","images/plank.png",["Brzuch napiety","Cialo w jednej linii","Oddychaj"]),
  ]),
  day(3,"Sroda","Spalanie + brzuch",[
    ex("Pajacyki","3 x 40 s","images/pajacyki.png",["Rowny rytm","Oddychaj","Nie skacz za wysoko"]),
    ex("Przysiady","3 x 12","images/przysiady.png",["Plecy proste","Biodra w dol"]),
    ex("Mountain climbers","3 x 25 s","images/climbers.png",["Pozycja jak do pompki","Kolana na zmiane do klatki","Nie bujaj biodrami"]),
    ex("Brzuszki","3 x 15","images/brzuszki.png",["Nogi ugiete","Nie ciagnij glowy"]),
  ]),
  day(4,"Czwartek","Powtorka poniedzialku",[],1),
  day(5,"Piatek","Powtorka wtorku",[],2),
  day(6,"Sobota","Lekki dzien",[
    ex("Marsz w miejscu","5 min","images/marsz.png",["Kolana lekko wyzej","Lekki oddech"]),
    ex("Sklony","3 x 12","images/sklony.png",["Bez szarpania","Powoli"]),
    ex("Plank (deska)","3 x 30 s","images/plank.png",["Brzuch napiety","Oddychaj"]),
    ex("Rozciaganie","5 min","images/stretch.png",["Barki, uda, lydki","Bez bolu"]),
  ]),
  day(7,"Niedziela","Reset",[
    ex("Spacer","15-20 min","images/spacer.png",["15-20 min","Spokojne tempo","Najwazniejsze: wyjsc"]),
  ]),
];
function day(id,name,focus,items,repeatOf){return{id,name,focus,items,repeatOf:repeatOf||null};}
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
  statsCard:document.getElementById("statsCard"),
  logCard:document.getElementById("logCard"),
  statEntries:document.getElementById("statEntries"),
  statDone:document.getElementById("statDone"),
  statMin:document.getElementById("statMin"),
  statMax:document.getElementById("statMax"),
  chart:document.getElementById("weightChart"),
};
const STORAGE_KEY="fitness_plan_v3_images";
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

  const entry=state.entries[isoToday()]||{};
  els.weightInput.value=entry.weight??"";
  els.doneInput.checked=!!entry.done;
  els.notesInput.value=entry.notes??"";

  const warmup=`
    <div class="item">
      <div class="item-top"><h3>Rozgrzewka</h3><span class="pill good">3 min</span></div>
      <p>Marsz 1 min • Krazenia ramion 30 s • Krazenia bioder 30 s • Sklony boczne 1 min</p>
    </div>`;

  const items=(d.items.length?d.items:getDay(d.repeatOf).items).map((it,i)=>itemBlock(it,i+1)).join("");
  const badge=d.repeatOf?`<div class="badge"><span class="dot"></span>Powtorka dnia ${d.repeatOf}</div>`:`<div class="badge"><span class="dot"></span>Plan dnia</div>`;

  els.dayCard.innerHTML=`
    <div class="row between wrap gap">
      <div>
        <h2>${esc(d.name)} • ${esc(d.focus)}</h2>
        <div class="muted small">Godzina: 7:00 • Czas: 15-20 min</div>
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
function defaultState(){ return {version:3,createdAt:new Date().toISOString(),entries:{}}; }
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