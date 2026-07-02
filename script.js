// 현재 언어 상태 (기본: 한국어)
let currentLang = 'ko';

const helmetSVG = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 12c-19 0-33 14-33 33 0 8 3 15 8 20l2 10h46l2-10c5-5 8-12 8-20 0-19-14-33-33-33z" stroke="#D74D29" stroke-width="3"/>
  <path d="M17 47h66" stroke="#D74D29" stroke-width="3"/>
  <path d="M34 47c0-12 7-22 16-22s16 10 16 22" stroke="#D74D29" stroke-width="2.5"/>
</svg>`;

// 멤버 데이터 (한국어/영어 분리)
const drivers = [
  {num:'01', name:'Junhee Kim', role:'on road', a:'720S GT3', b:'fav veh', c:'2010', d:'Birth',
    bio_ko:'모종의 이유로 현재 LMU 하는중 조만간 다시 복귀 예정', bio_en:'Currently playing LMU for certain reasons, returning soon.', track:'Favorite: SEBRING', helmetImg: 'junhee_helmet.png', base:'MOZA R12', pedal:'MOZA CRP2',  instagram:'jxnh_72'},
  {num:'02', name:'Chanwoo Kim', role:'on road', a:'M4 GT3', b:'fav veh', c:'2009', d:'Birth',
    bio_ko:'돈없어서 G27 사용중, 조만간 아이레이싱 복귀 예정', bio_en:'Using G27 to save up, returning to iRacing soon.', track:'Favorite: Spa-Francorchamps', helmetImg: 'chanwoo_helmet.png', base:'LOGITECH G27', pedal:'LOGITECH G27', instagram:'cw__0115'},
  {num:'03', name:'Jihoo Park', role:'on road', a:'SF-24', b:'fav veh', c:'2009', d:'Birth',
    bio_ko:'R25 풀토크를 온몸으로 견뎌내는 피들스틱', bio_en:'Enduring the full torque of R25 with his entire body.', track:'Favorite: LONG BEACH', helmetImg: 'jihoo_helmet.png', base: 'MOZA R25', pedal: 'MOZA SRP2', instagram:'ji_hoo324'},
  {num:'04', name:'Minsoo Seo', role:'on road', a:'GR86', b:'fav veh', c:'2010', d:'Birth',
    bio_ko:'차량에 대한 깊은 지식으로 차량 셋업 위주로 담당', bio_en:'Handles car setups with deep mechanical knowledge.', track:'Favorite: Interlagos', helmetImg: 'minsoo_helmet.png', base: 'MOZA R9 V2', pedal: 'MOZA CRP2', instagram:'m1nso0.10'},
  {num:'05', name:'Taeyun Lee', role:'on road · team leader', a:'Por 935', b:'fav veh', c:'B 2009', d:'Birth',
    bio_ko:'저랑 사귀실 어여쁜 여성분은 디엠 주십쇼', bio_en:'Looking for a lovely lady to date, slide into DMs.', track:'Favorite: Nürburgring', helmetImg: 'taeyun_helmet.png', base: 'MOZA R5', pedal: 'MOZA CRP2', instagram:'t.xyn.09'},
];

const results = [
  {date:'2026.03.27', event:'Sebring 3H Race', cls:'GT3', driver:'Minsoo Seo, Taeyun Lee', pos:10},
  {date:'2026.03.27', event:'Sebring 3H Qualifying', cls:'GT3', driver:'Minsoo Seo, Taeyun Lee', pos:8},
  {date:'2026.03.22', event:'Nürburgring Endurance Cup 4H Race', cls:'GT3', driver:'Junhee Kim, Minsoo Seo, Taeyun Lee', pos:26},
  {date:'2026.03.22', event:'Nürburgring Endurance Cup 4H Qualifying', cls:'GT3', driver:'Junhee Kim, Minsoo Seo, Taeyun Lee', pos:11},
];

const news = [
  {date:'2026.07.02', title_ko:'Nürburgring Endurance 6H Race 출전', title_en:'Entering Nürburgring Endurance 6H', body_ko:'7월 5일에 Taeyun Lee 선수가 용병 Donggeon Kim과 함께 Nürburgring Endurance 6H Race에 출전합니다.', body_en:'Taeyun Lee will race in the Nürburgring 6H with Donggeon Kim on July 5th.'},
  {date:'2026.03.27', title_ko:'Sebring 3H Race 첫 10위권', title_en:'Top 10 finish at Sebring 3H', body_ko:'Minsoo Seo와 Taeyun Lee가 호흡을 맞춰 처음으로 레이스 10위권으로 완주하였습니다.', body_en:'Minsoo Seo and Taeyun Lee teamed up to finish in the top 10 for the first time.'},
  {date:'2026.03.22', title_ko:'Nürburgring Endurance Cup 4H 레이스 P26 완주', title_en:'P26 finish at Nürburgring 4H', body_ko:'Nürburgring Endurance Cup 4H 레이스에서 최종 26등으로 안전하게 완주하였습니다.', body_en:'Safely finished P26 overall in the Nürburgring Endurance Cup 4H race.'}
];

// 렌더링 함수들 (언어가 바뀔 때마다 다시 그려줌)
function renderRoster() {
  document.getElementById('rosterGrid').innerHTML = drivers.map(d=>`
    <div class="driver-card" tabindex="0" role="button" aria-expanded="false">
      <div class="driver-helmet">${d.helmetImg ? `<img src="${d.helmetImg}" alt="${d.name} 헬멧">` : helmetSVG}</div>
      <span class="driver-num">NO. ${d.num}</span>
      <div class="driver-name">${d.name}</div>
      <div class="driver-role">${d.role}</div>
      <div class="driver-detail">
        <p>${currentLang === 'ko' ? d.bio_ko : d.bio_en}</p>
        <span class="detail-track">${d.track}</span>
        <div class="driver-equip">
          <div><span>BASE</span><strong>${d.base || '-'}</strong></div>
          <div><span>PEDAL</span><strong>${d.pedal || '-'}</strong></div>
          <div><span>INSTAGRAM</span><strong>${d.instagram ? `@${d.instagram}` : '-'}</strong></div>
        </div>
      </div>
      <div class="driver-stats">
        <div><div class="stat-val">${d.a}</div><div class="stat-label">${d.b}</div></div>
        <div><div class="stat-val">${d.c}</div><div class="stat-label">${d.d}</div></div>
      </div>
    </div>
  `).join('');
  attachRosterEvents(); // 다시 그려진 카드에 클릭/터치 이벤트 재부착
}

function renderResults() {
  document.getElementById('resultsBody').innerHTML = results.map(r=>`
    <tr>
      <td>${r.date}</td><td>${r.event}</td><td class="class-cell">${r.cls}</td>
      <td>${r.driver}</td><td class="pos ${r.pos===1?'p1':''}">P${r.pos}</td>
    </tr>
  `).join('');
}

function renderNews() {
  document.getElementById('newsGrid').innerHTML = news.map(n=>`
    <div class="news-card">
      <span class="news-date">${n.date}</span>
      <h3>${currentLang === 'ko' ? n.title_ko : n.title_en}</h3>
      <p>${currentLang === 'ko' ? n.body_ko : n.body_en}</p>
      <a class="news-link" href="#">${currentLang === 'ko' ? '자세히 보기 →' : 'Read More →'}</a>
    </div>
  `).join('');
}

function renderGallery() {
  const trackSVG = `<svg viewBox="0 0 100 100" fill="none" stroke="#D74D29" stroke-width="3"><path d="M10 70 C 20 70 25 50 40 48 C 55 46 58 30 48 22 C 40 16 46 8 58 10 C 74 12 78 32 90 28"/></svg>`;
  const galleryLabels = ['Race Weekend 01','Team Session','Podium','Livery'];
  document.getElementById('galleryGrid').innerHTML = galleryLabels.map(l=>`
    <div class="g-item">${trackSVG}<span class="g-label">${l}</span></div>
  `).join('');
}

// 모바일 호버/클릭 이벤트
function attachRosterEvents() {
  const driverCards = document.querySelectorAll('.driver-card');
  driverCards.forEach(card=>{
    card.addEventListener('click', ()=>{
      const willExpand = !card.classList.contains('expanded');
      driverCards.forEach(c=>{c.classList.remove('expanded'); c.setAttribute('aria-expanded','false');});
      if(willExpand){ card.classList.add('expanded'); card.setAttribute('aria-expanded','true'); }
    });
    card.addEventListener('keydown', (e)=>{
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); card.click(); }
    });
  });
}

// 언어 변경 토글 이벤트
const langToggleBtn = document.getElementById('langToggle');
langToggleBtn.addEventListener('click', () => {
  currentLang = currentLang === 'ko' ? 'en' : 'ko';
  langToggleBtn.textContent = currentLang === 'ko' ? 'EN' : 'KR';
  
  // HTML 내의 모든 .lang-text 속성 바꾸기
  document.querySelectorAll('.lang-text').forEach(el => {
    el.innerHTML = el.getAttribute(`data-${currentLang}`);
  });
  
  // 데이터가 들어가는 동적 영역 다시 그리기
  renderRoster();
  renderNews();
});

// 초기화
renderRoster();
renderResults();
renderNews();
renderGallery();

// ---------- slide navigation / dot nav ----------
const slides = Array.from(document.querySelectorAll('.slide'));
const scroller = document.getElementById('scroller');
const header = document.getElementById('siteHeader');
const navLinks = document.querySelectorAll('.nav-links a');

const dotNav = document.getElementById('dotNav');
slides.forEach((s,i)=>{
  const b = document.createElement('button');
  b.dataset.jump = i;
  b.innerHTML = `<span class="dot-label">${s.dataset.label}</span>`;
  dotNav.appendChild(b);
});
const dots = Array.from(dotNav.querySelectorAll('button'));

function jumpTo(i){
  slides[i].scrollIntoView({behavior:'smooth', block:'start'});
}
document.querySelectorAll('[data-jump]').forEach(el=>{
  el.addEventListener('click', ()=> jumpTo(parseInt(el.dataset.jump,10)) );
});

const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    const idx = slides.indexOf(entry.target);
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      dots.forEach(d=>d.classList.remove('active'));
      if(dots[idx]) dots[idx].classList.add('active');
      navLinks.forEach(a=>a.classList.toggle('active', parseInt(a.dataset.jump,10)===idx));
      
      const isDark = entry.target.dataset.theme === 'dark';
      header.classList.toggle('on-dark', isDark);
      header.classList.toggle('on-light', !isDark);
      const logoImg = header.querySelector('.nav-logo img');
      if (logoImg) logoImg.src = isDark ? 'logo.png' : 'logo.png';
    }
  });
}, {root:scroller, rootMargin:'-50% 0px -50% 0px', threshold:0});
slides.forEach(s=>io.observe(s));

// mobile nav toggle -> simple overlay list
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');
navToggle.addEventListener('click', ()=>{
  const open = navLinksEl.style.display === 'flex';
  const isHeaderDark = header.classList.contains('on-dark');
  
  navLinksEl.style.cssText = open ? '' : `
    display:flex;flex-direction:column;position:fixed;top:64px;left:0;right:0;
    background:${isHeaderDark ? 'rgba(0,0,0,0.96)' : 'rgba(255,255,255,0.98)'};
    padding:20px 24px;gap:18px;font-size:15px;
  `;
  
  const logoImg = header.querySelector('.nav-logo img');
  if (logoImg && !open) logoImg.src = 'logo.png';
});

function setVH(){document.documentElement.style.setProperty('--vh100', window.innerHeight+'px');}
if(!CSS.supports('height','100dvh')){ setVH(); window.addEventListener('resize', setVH); }
