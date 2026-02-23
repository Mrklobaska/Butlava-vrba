// Mock príbehy (ukážka)
const MOCK_STORIES = [
  { id: 1, text: "Nie vždy musím byť silný. Dnes mi stačí, že som to napísal." },
  { id: 2, text: "V škole to zvládam, ale doma je ticho hlasnejšie než krik." },
  { id: 3, text: "Chcem byť vypočutý bez rád. Len... nech to niekto prečíta." },
  { id: 4, text: "Kamaráti sú super, ale aj tak sa bojím povedať to nahlas." },
  { id: 5, text: "Nie som slabý, keď plačem. Som človek." },
];

// Pomocné funkcie
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// Inicializácia feedu
function initFeed(containerId="feed"){
  const el = document.getElementById(containerId);
  if(!el) return;

  const stories = shuffle(MOCK_STORIES).map(s => ({...s, len: s.text.length}));
  let index = 0;

  function render(){
    el.innerHTML = "";
    const cur = stories[index];

    const story = document.createElement("div");
    story.className = "story";
    story.innerHTML = `
      <div class="meta">${cur.len} znakov</div>
      <div class="text">${escapeHtml(cur.text)}</div>
      <button class="readmode" type="button" onclick="toggleReadMode()">Režim čítania</button>
    `;
    el.appendChild(story);
  }

  function next(){ if(index < stories.length-1){ index++; render(); } }
  function prev(){ if(index > 0){ index--; render(); } }

  // Scroll (PC)
  let scrollLock = false;
  window.addEventListener("wheel", (e)=>{
    if(scrollLock) return;
    scrollLock = true;
    if(e.deltaY > 0) next(); else if(e.deltaY < 0) prev();
    setTimeout(()=>scrollLock=false, 300);
  }, {passive:true});

  // Swipe (mobile)
  let startY = null;
  document.addEventListener("touchstart", (e)=>{ startY = e.touches[0].clientY; }, {passive:true});
  document.addEventListener("touchmove", (e)=>{
    if(startY===null) return;
    const diff = e.touches[0].clientY - startY;
    if(Math.abs(diff) > 48){
      if(diff < 0) next(); else prev();
      startY = null;
    }
  }, {passive:true});
  document.addEventListener("touchend", ()=>{ startY = null; });

  render();
}

// Režim čítania = väčší text, čisté pozadie
function toggleReadMode(){
  document.documentElement.classList.toggle("reading");
} 

// Jednoduchý Pending zoznam (mock) – v ostrej verzii nahradí backend
function initPendingList(elId = "pending") {
  const el = document.getElementById(elId);
  if (!el) return;
  const pending = [
    "Skúšam to napísať prvýkrát…",
    "Možno to admin schváli, ale už teraz sa cítim lepšie.",
  ];
  el.innerHTML = pending
    .map(t => `<div class="item">„${escapeHtml(t.slice(0, 80))}${t.length>80?'…':''}“ – čaká na schválenie</div>`)
    .join("");
}
// Admin: jednoduché štatistiky – mock hodnoty pre prototyp
function initAdminStats(){
  const els = {
    users: document.getElementById("stat-users"),
    total: document.getElementById("stat-total"),
    approved: document.getElementById("stat-approved"),
    pending: document.getElementById("stat-pending"),
    rejected: document.getElementById("stat-rejected"),
    views: document.getElementById("stat-views"),
    feedback: document.getElementById("stat-feedback"),
    avg: document.getElementById("stat-avg"),
    max: document.getElementById("stat-max"),
    min: document.getElementById("stat-min"),
  };
  if(!els.users) return;

  // Vypočítame dĺžky mock príbehov (z MOCK_STORIES)
  const lengths = (Array.isArray(MOCK_STORIES) ? MOCK_STORIES : []).map(s => (s.text||"").length);
  const sum = lengths.reduce((a,b)=>a+b,0);
  const avg = lengths.length ? Math.round(sum/lengths.length) : 0;

  // Mock čísla pre prvú verziu admina (nahradí API)
  els.users.textContent     = "42";
  els.total.textContent     = String(lengths.length || 0);
  els.approved.textContent  = String(Math.max(0, (lengths.length || 0) - 2));
  els.pending.textContent   = "2";
  els.rejected.textContent  = "0";
  els.views.textContent     = "137";
  els.feedback.textContent  = "5";
  els.avg.textContent       = avg + " zn.";
  els.max.textContent       = (lengths.length ? Math.max(...lengths) : 0) + " zn.";
  els.min.textContent       = (lengths.length ? Math.min(...lengths) : 0) + " zn.";
}