// ---------- content data ----------
  // helmet: swap the SVG path for a real helmet illustration/photo later if you like,
  // or replace the whole .driver-helmet inner with an <img src="helmet-01.png"> per driver.
  const helmetSVG = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 12c-19 0-33 14-33 33 0 8 3 15 8 20l2 10h46l2-10c5-5 8-12 8-20 0-19-14-33-33-33z" stroke="#D74D29" stroke-width="3"/>
    <path d="M17 47h66" stroke="#D74D29" stroke-width="3"/>
    <path d="M34 47c0-12 7-22 16-22s16 10 16 22" stroke="#D74D29" stroke-width="2.5"/>
  </svg>`;

  // fill in real teammates here — 5 driver slots
  const drivers = [
    {num:'01', name:'Junhee Kim', role:'on road', a:'None', b:'iRating', c:'None', d:'Class',
      bio:'모종의 이유로 현재 LMU 하는중 조만간 다시 복귀 예정', track:'Favorite: SEBRING', helmetImg: 'junhee_helmet.png', base:'MOZA R12', pedal:'MOZA CRP2',  instagram:'jxnh_72'},
    {num:'02', name:'Chanwoo Kim', role:'on road', a:'None', b:'iRating', c:'None', d:'Class',
      bio:'돈없어서 G27 사용중, 조만간 아이레이싱 복귀 예정', track:'Favorite: Spa-Francorchamps', helmetImg: 'chanwoo_helmet.png', base:'LOGITECH G27', pedal:'LOGITECH G27', instagram:'cw__0115'},
    {num:'03', name:'Jihoo Park', role:'on road', a:'None', b:'iRating', c:'None', d:'Class',
      bio:'R25 풀토크를 온몸으로 견뎌내는 피들스틱', track:'Favorite: LONG BEACH', helmetImg: 'jihoo_helmet.png', base: 'MOZA R25', pedal: 'MOZA SRP2', instagram:'ji_hoo324'},
    {num:'04', name:'Minsoo Seo', role:'on road', a:'2,009', b:'iRating', c:'A 5.23', d:'Class',
      bio:'차량에 대한 깊은 지식으로 차량 셋업 위주로 담당', track:'Favorite: Interlagos', helmetImg: 'minsoo_helmet.png', base: 'MOZA R9 V2', pedal: 'MOZA CRP2', instagram:'m1nso0.10'},
    {num:'05', name:'Taeyun Lee', role:'on road · team leader', a:'3k', b:'iRating', c:'B 3.9', d:'Class',
      bio:'저랑 사귀실 어여쁜 여성분은 디엠 주십쇼', track:'Favorite: Nürburgring', helmetImg: 'taeyun_helmet.png', base: 'MOZA R5', pedal: 'CRP2', instagram:'t.xyn.09'},
  ];

  document.getElementById('rosterGrid').innerHTML = drivers.map(d=>`
  <div class="driver-card" tabindex="0" role="button" aria-expanded="false">
    <div class="driver-helmet">${d.helmetImg ? `<img src="${d.helmetImg}" alt="${d.name} 헬멧">` : helmetSVG}</div>
    <span class="driver-num">NO. ${d.num}</span>
    <div class="driver-name">${d.name}</div>
    <div class="driver-role">${d.role}</div>
    <div class="driver-detail">
      <p>${d.bio}</p>
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

  // touch/keyboard support: hover works with a mouse, but tablets/phones need a tap toggle
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

  const results = [
    {date:'2026.03.27', event:'Sebring 3H Race', cls:'GT3', driver:'Minsoo Seo, Taeyun Lee', pos:10},
    {date:'2026.03.27', event:'Sebring 3H Qualifying', cls:'GT3', driver:'Minsoo Seo, Taeyun Lee', pos:8},
    {date:'2026.03.22', event:'Nürburgring Endurance Cup 4H Race', cls:'GT3', driver:'Junhee Kim, Minsoo Seo, Taeyun Lee', pos:26},
    {date:'2026.03.22', event:'Nürburgring Endurance Cup 4H Qualifying', cls:'GT3', driver:'Junhee Kim, Minsoo Seo, Taeyun Lee', pos:11},
  ];
  document.getElementById('resultsBody').innerHTML = results.map(r=>`
    <tr>
      <td>${r.date}</td><td>${r.event}</td><td class="class-cell">${r.cls}</td>
      <td>${r.driver}</td><td class="pos ${r.pos===1?'p1':''}">P${r.pos}</td>
    </tr>
  `).join('');

  const news = [
    {date:'2026.07.02', title:'Nürburgring Endurance 6H Race 출전', body:'7월 5일에 Taeyun Lee 선수가 용병 Donggeon Kim과 함께 Nürburgring Endurance 6H Race에 출전합니다.'},
    {date:'2026.03.27', title:'Sebring 3H Race 첫 10위권', body:'Minsoo Seo와 Taeyun Lee가 호흡을 맞춰 처음으로 레이스 10위권으로 완주하였습니다.'},
    {date:'2026.03.22', title:'Nürburgring Endurance Cup 4H 레이스 P26 완주', body:'Nürburgring Endurance Cup 4H 레이스에서 최종 26등으로 안전하게 완주하였습니다.'}
  ];
  document.getElementById('newsGrid').innerHTML = news.map(n=>`
    <div class="news-card">
      <span class="news-date">${n.date}</span>
      <h3>${n.title}</h3>
      <p>${n.body}</p>
      <a class="news-link" href="#">자세히 보기 →</a>
    </div>
  `).join('');

  const trackSVG = `<svg viewBox="0 0 100 100" fill="none" stroke="#D74D29" stroke-width="3"><path d="M10 70 C 20 70 25 50 40 48 C 55 46 58 30 48 22 C 40 16 46 8 58 10 C 74 12 78 32 90 28"/></svg>`;
  const galleryLabels = ['Race Weekend 01','Team Session','Podium','Livery'];
  document.getElementById('galleryGrid').innerHTML = galleryLabels.map(l=>`
    <div class="g-item">${trackSVG}<span class="g-label">${l}</span></div>
  `).join('');

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

  // a slide becomes "active" once it crosses the vertical center of the scroller,
  // which works regardless of whether a slide is shorter or taller than the viewport
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const idx = slides.indexOf(entry.target);
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        dots.forEach(d=>d.classList.remove('active'));
        if(dots[idx]) dots[idx].classList.add('active');
        navLinks.forEach(a=>a.classList.toggle('active', parseInt(a.dataset.jump,10)===idx));
        header.classList.toggle('on-dark', entry.target.dataset.theme==='dark');
        header.classList.toggle('on-light', entry.target.dataset.theme==='light');
      }
    });
  }, {root:scroller, rootMargin:'-50% 0px -50% 0px', threshold:0});
  slides.forEach(s=>io.observe(s));

  // mobile nav toggle -> simple overlay list
  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');
  navToggle.addEventListener('click', ()=>{
    const open = navLinksEl.style.display === 'flex';
    navLinksEl.style.cssText = open ? '' : `
      display:flex;flex-direction:column;position:fixed;top:64px;left:0;right:0;
      background:${header.classList.contains('on-dark')?'rgba(0,0,0,0.96)':'rgba(255,255,255,0.98)'};
      padding:20px 24px;gap:18px;font-size:15px;
    `;
  });

  // set --vh100 fallback for older browsers without dvh support
  function setVH(){document.documentElement.style.setProperty('--vh100', window.innerHeight+'px');}
  if(!CSS.supports('height','100dvh')){ setVH(); window.addEventListener('resize', setVH); }
