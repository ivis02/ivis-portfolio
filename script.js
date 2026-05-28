/* ══════════════════════════════════════════════════════
   ivis — portfolio script
   ══════════════════════════════════════════════════════ */

'use strict';


/* ── Project Data ──────────────────────────────────────
   ✏️ 이 배열을 수정해서 실제 작업물 데이터를 입력하세요.
   type: 'website' | 'video' | 'cardnews' | 'poster'
───────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1,
    type: 'website',
    title: 'Hotel Nongshim',
    desc: '호텔농심 웹사이트 리뉴얼 — 객실·레스토랑·스파 브랜드 경험 구현',
    link: 'https://ivis02.github.io/hotel-site/index.html',
    img: 'images/web/hotel-nongshim.png',
    detail: '호텔농심의 브랜드 아이덴티티를 디지털 환경에서 재해석한 웹 리뉴얼 프로젝트입니다. 고급스러운 호텔의 분위기를 온라인에서도 온전히 경험할 수 있도록 비주얼과 UX를 전면 재설계했습니다. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    roles: ['UI/UX 디자인', '퍼블리싱 (HTML / CSS / JS)', '반응형 레이아웃', '인터랙션 구현'],
    thumbClass: 'thumb-website',
    thumbLabel: 'Website',
  },
  {
    id: 2,
    type: 'website',
    title: 'Twoem Steel',
    desc: '투엠스틸 기업 웹사이트 — 팀 협업 프로젝트, 반응형 레이아웃',
    link: 'https://shinsoo59.github.io/TwoemSteel/',
    img: 'images/web/TwoemSteel.png',
    detail: '철강 전문 기업 투엠스틸의 공식 웹사이트 구축 팀 프로젝트입니다. 기업 이미지에 맞는 견고하고 신뢰감 있는 디자인을 목표로, 제품 소개 및 회사 정보를 효과적으로 전달하는 구조를 설계했습니다. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    roles: ['UI 디자인', '퍼블리싱 (HTML / CSS)', '팀 협업 · 역할 분담'],
    thumbClass: 'thumb-website',
    thumbLabel: 'Website',
  },
  {
    id: 3,
    type: 'video',
    title: 'Void Motion',
    desc: '브랜드 모션 그래픽 릴 — After Effects 제작',
    // ✏️ 영상 URL 교체: mp4 직링크 또는 YouTube embed URL
    videoSrc: '',
    isEmbed: false,
    thumbClass: 'thumb-video',
    thumbLabel: 'Video',
  },
  {
    id: 4,
    type: 'cardnews',
    title: '연제고분 판타지축제',
    desc: '연제고분 판타지축제 행사 카드뉴스 — 9매 구성, 망고보드 제작',
    img: 'images/cardnews/260408_연제고분판타지축제_카드뉴스_이미소/1.png',
    images: Array.from({length: 9}, (_, i) =>
      `images/cardnews/260408_연제고분판타지축제_카드뉴스_이미소/${i + 1}.png`),
    thumbClass: 'thumb-cardnews',
    thumbLabel: 'Card News',
  },
  {
    id: 5,
    type: 'cardnews',
    title: '주간카드뉴스 4월 3주차',
    desc: '주간 SNS 카드뉴스 — 6매 구성, 망고보드 제작',
    img: 'images/cardnews/주간카드뉴스_4월_3주차_이미소/1.png',
    images: Array.from({length: 6}, (_, i) =>
      `images/cardnews/주간카드뉴스_4월_3주차_이미소/${i + 1}.png`),
    thumbClass: 'thumb-cardnews',
    thumbLabel: 'Card News',
  },
  {
    id: 6,
    type: 'cardnews',
    title: '주간카드뉴스 4월 4주차',
    desc: '주간 SNS 카드뉴스 — 6매 구성, 망고보드 제작',
    img: 'images/cardnews/주간카드뉴스_4월_4주차/1.png',
    images: Array.from({length: 6}, (_, i) =>
      `images/cardnews/주간카드뉴스_4월_4주차/${i + 1}.png`),
    thumbClass: 'thumb-cardnews',
    thumbLabel: 'Card News',
  },
  {
    id: 7,
    type: 'cardnews',
    title: '카드뉴스 5월 1주차',
    desc: '주간 SNS 카드뉴스 — 4매 구성, 망고보드 제작',
    img: 'images/cardnews/카드뉴스_5월_1주차/1.png',
    images: Array.from({length: 4}, (_, i) =>
      `images/cardnews/카드뉴스_5월_1주차/${i + 1}.png`),
    thumbClass: 'thumb-cardnews',
    thumbLabel: 'Card News',
  },
  {
    id: 8,
    type: 'poster',
    title: 'Vaundy Live in Seoul',
    desc: '공연 포스터 — Photoshop 제작',
    img: 'images/poster/0a9ed032bc351415.png',
    thumbClass: 'thumb-poster',
    thumbLabel: 'Poster',
  },
];

const TYPE_KO = {
  website:  '웹사이트',
  video:    '영상',
  cardnews: '카드뉴스',
  poster:   '포스터',
};


/* ── DOM ──────────────────────────────────────────── */

const $nav          = document.getElementById('nav');
const $cordPull     = document.getElementById('cordPull');
const $themeCord    = document.getElementById('themeCord');
const $projectsGrid = document.getElementById('projectsGrid');
const $filterBtns   = document.querySelectorAll('.filter-btn');
const $modal        = document.getElementById('modal');
const $modalOverlay = document.getElementById('modalOverlay');
const $modalClose   = document.getElementById('modalClose');
const $modalInner   = document.getElementById('modalInner');
const $sections     = document.querySelectorAll('.section');
const $html         = document.documentElement;
const $silFollow    = document.getElementById('silFollow');

const SIL_IMAGES = [
  'images/human/hero.png',
  'images/human/0cccc30a-5218-4842-9ef0-de531a0a8547.png',
  'images/human/78c5bd83-aa8d-437f-8cdc-d485f1928667.png',
  'images/human/076c2c14-6d92-4e08-9d25-d58bd2f42c23.png',
  'images/human/bd8ecb96-d311-4496-8b0a-0cbcc45b53d8.png',
];
let lastSectionIdx = -1;


/* ══════════════════════════════════════════════════════
   1. THEME TOGGLE (Cord)
══════════════════════════════════════════════════════ */

// localStorage에서 초기 상태 복원 (head 인라인 스크립트가 이미 DOM에 적용했으므로 변수만 맞춤)
let inverted = localStorage.getItem('ivis-theme') === 'warm';

function toggleTheme() {
  inverted = !inverted;

  // 쿨(기본) ↔ 웜+반전 동시 전환
  $html.dataset.theme = inverted ? 'warm' : 'cool';
  $html.toggleAttribute('data-inverted', inverted);
  localStorage.setItem('ivis-theme', inverted ? 'warm' : 'cool');

  $themeCord.classList.remove('pulling');
  void $themeCord.offsetWidth;
  $themeCord.classList.add('pulling');

  onScroll();
}

$cordPull?.addEventListener('click', toggleTheme);


/* ══════════════════════════════════════════════════════
   2. NAVIGATION: scroll state + active section color
══════════════════════════════════════════════════════ */

function onScroll() {
  const y = window.scrollY;

  // scrolled background
  $nav.classList.toggle('scrolled', y > 60);

  // detect which section is dominant
  if (!$sections.length) return;
  let activeIdx = 0;
  $sections.forEach((sec, i) => {
    if (y + window.innerHeight * 0.45 >= sec.offsetTop) activeIdx = i;
  });
  const active = $sections[activeIdx];

  // data-inverted 상태일 때 dark/light 판단을 반전
  const isDark = active.classList.contains('section-dark');
  const effectivelyDark = inverted ? !isDark : isDark;

  $nav.classList.toggle('on-dark',   effectivelyDark);
  $nav.classList.toggle('on-light', !effectivelyDark);

  // 섹션 전환 시 실루엣 이미지 교체 + 위치/회전 변경
  if (activeIdx !== lastSectionIdx) {
    lastSectionIdx = activeIdx;
    if ($silFollow) $silFollow.dataset.section = activeIdx;
    swapSilImage(activeIdx);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();


/* ══════════════════════════════════════════════════════
   3. MOUSE PARALLAX
   — moves .scene containers subtly with the mouse.
   Each scene has its own offset multiplier so layers
   feel independent.
══════════════════════════════════════════════════════ */

const $scenes = document.querySelectorAll('.scene');
const PARALLAX_STRENGTHS = [10, 15, 12, 8]; // px per scene
let mx = 0, my = 0;
let rafPending = false;

window.addEventListener('mousemove', e => {
  mx = (e.clientX / window.innerWidth  - 0.5) * 2; // -1 → 1
  my = (e.clientY / window.innerHeight - 0.5) * 2;
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(applyParallax);
  }
}, { passive: true });

function applyParallax() {
  rafPending = false;
  $scenes.forEach((scene, i) => {
    const s = PARALLAX_STRENGTHS[i] ?? 10;
    scene.style.transform = `translate(${(mx * s).toFixed(2)}px, ${(my * s).toFixed(2)}px)`;
  });
}


/* ══════════════════════════════════════════════════════
   4. ENTRANCE REVEAL (IntersectionObserver)
══════════════════════════════════════════════════════ */

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ══════════════════════════════════════════════════════
   5. PROJECT CARDS
══════════════════════════════════════════════════════ */

function buildCards() {
  if (!$projectsGrid) return;
  $projectsGrid.innerHTML = '';
  PROJECTS.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.dataset.type = p.type;
    card.style.animationDelay = `${i * 60}ms`;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${p.title} 열기`);

    // 영상/포스터에 아이콘 오버레이
    const iconOverlay = (p.type === 'video')
      ? `<div class="card-thumb-icon">
           <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
             <circle cx="22" cy="22" r="21" stroke="white" stroke-width="1.5" fill="rgba(0,0,0,.3)"/>
             <path d="M18 15l14 7-14 7V15z" fill="white"/>
           </svg>
         </div>`
      : (p.type === 'poster')
      ? `<div class="card-thumb-icon">
           <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
             <circle cx="22" cy="22" r="21" stroke="white" stroke-width="1.5" fill="rgba(0,0,0,.3)"/>
             <path d="M16 16h12v12H16z" stroke="white" stroke-width="1.5" fill="none"/>
             <path d="M20 20h4v4h-4z" fill="white" opacity=".6"/>
           </svg>
         </div>`
      : '';

    const thumbStyle = p.img
      ? ` style="background-image:url('${p.img}');background-size:cover;background-position:top center;"`
      : '';

    card.innerHTML = `
      <div class="card-thumb ${p.thumbClass}"${thumbStyle}>
        ${p.img ? '' : `<span class="thumb-label">${p.thumbLabel}</span>`}
        ${iconOverlay}
      </div>
      <div class="card-body">
        <div class="card-type">${TYPE_KO[p.type]}</div>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-desc">${p.desc}</p>
      </div>`;

    card.addEventListener('click', () => handleCardClick(p));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(p); }
    });

    $projectsGrid.appendChild(card);
  });
}

function handleCardClick(p) {
  openModal(p);
}


/* ── Filter ───────────────────────────────────────── */

function filterCards(filter) {
  const cards = [...document.querySelectorAll('.project-card')];
  const visible = cards.filter(c => filter === 'all' || c.dataset.type === filter);
  const hidden  = cards.filter(c => filter !== 'all' && c.dataset.type !== filter);
  // 이미 보이는 카드는 재배치 시 애니메이션 재실행 방지
  visible.forEach(c => { if (!c.classList.contains('hide')) c.classList.add('no-anim'); });
  // 보이는 카드를 앞으로, 숨길 카드를 뒤로 DOM 재배치
  [...visible, ...hidden].forEach(c => $projectsGrid.appendChild(c));
  visible.forEach(c => c.classList.remove('hide'));
  // 숨겨지는 카드는 no-anim 제거 — 다음에 다시 표시될 때 애니메이션 재생
  hidden.forEach(c => { c.classList.add('hide'); c.classList.remove('no-anim'); });
}

$filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    $filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    filterCards(btn.dataset.filter);
  });
});

if ($projectsGrid) buildCards();


/* ══════════════════════════════════════════════════════
   6. MODAL
══════════════════════════════════════════════════════ */

let sliderIndex = 0;

function openModal(p) {
  if (!$modal || !$modalInner) return;
  $modalInner.innerHTML = buildModalContent(p);
  $modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';

  // init slider if needed
  if (p.type === 'cardnews') {
    sliderIndex = 0;
    updateSlider(0);
  }

  // focus trap: focus close button
  requestAnimationFrame(() => $modalClose.focus());
}

function closeModal() {
  if (!$modal) return;
  $modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
  // stop any playing video
  const vid = $modalInner.querySelector('video');
  if (vid) vid.pause();
}

function buildModalContent(p) {
  let media = '';

  if (p.type === 'website') {
    const heroImg = p.img
      ? `<div class="modal-hero-img" style="background-image:url('${p.img}')"></div>`
      : '';
    const rolesHtml = p.roles?.length
      ? `<div class="modal-section">
           <h3 class="modal-section-label">담당 영역</h3>
           <ul class="modal-roles">
             ${p.roles.map(r => `<li>${r}</li>`).join('')}
           </ul>
         </div>`
      : '';
    const visitBtn = p.link && p.link !== '#'
      ? `<a href="${p.link}" target="_blank" rel="noopener noreferrer" class="modal-visit-btn"><span>사이트 방문 →</span></a>`
      : '';

    return `
      ${heroImg}
      <div class="modal-detail">
        <div class="modal-detail-meta">
          <span class="modal-detail-tag">${TYPE_KO[p.type]}</span>
          ${visitBtn}
        </div>
        <h2 class="modal-detail-title">${p.title}</h2>
        <div class="modal-section">
          <h3 class="modal-section-label">프로젝트 개요</h3>
          <p class="modal-section-body">${p.detail || p.desc}</p>
        </div>
        ${rolesHtml}
      </div>`;
  }

  if (p.type === 'video') {
    if (p.isEmbed && p.videoSrc) {
      // ✏️ YouTube embed
      media = `<iframe class="modal-video" src="${p.videoSrc}" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>`;
    } else if (p.videoSrc) {
      media = `<video class="modal-video" controls autoplay muted playsinline>
        <source src="${p.videoSrc}" type="video/mp4">
        <!-- ✏️ 영상 파일을 지원하지 않는 브라우저 -->
        이 브라우저는 영상 재생을 지원하지 않습니다.
      </video>`;
    } else {
      // ✏️ 영상 URL 미입력 시 플레이스홀더
      media = `<div class="modal-video thumb-video" style="display:flex;align-items:center;justify-content:center;">
        <span style="font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.26);">
          ✏️ videoSrc 입력 필요
        </span>
      </div>`;
    }
  }

  if (p.type === 'cardnews') {
    const count = p.images ? p.images.length : (p.slides || 0);
    const slideItems = p.images
      ? p.images.map((src, i) => `
          <div class="slider-slide slider-slide--img">
            <img src="${src}" alt="슬라이드 ${i + 1}">
          </div>`).join('')
      : Array.from({ length: count }, (_, i) => `
          <div class="slider-slide thumb-cardnews">
            <span>${i + 1} / ${count}</span>
          </div>`).join('');

    media = `
      <div class="slider-wrap" id="sliderWrap">
        <div class="slider-track" id="sliderTrack">${slideItems}</div>
      </div>
      <div class="slider-controls">
        <button class="slider-btn" id="sliderPrev" aria-label="이전">&#8592;</button>
        <span class="slider-counter" id="sliderCounter">1 / ${count}</span>
        <button class="slider-btn" id="sliderNext" aria-label="다음">&#8594;</button>
      </div>`;
  }

  if (p.type === 'poster') {
    media = p.img
      ? `<div class="modal-poster modal-poster--img">
           <img src="${p.img}" alt="${p.title}">
         </div>`
      : `<div class="modal-poster thumb-poster">
           <span>✏️ 포스터 이미지 삽입 위치</span>
         </div>`;
  }

  return `
    ${media}
    <div class="modal-info">
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
    </div>`;
}

/* Slider controls (event delegation) */
$modalInner?.addEventListener('click', e => {
  if (e.target.closest('#sliderPrev')) moveSlider(-1);
  if (e.target.closest('#sliderNext')) moveSlider(+1);
});

function moveSlider(dir) {
  const track   = document.getElementById('sliderTrack');
  const counter = document.getElementById('sliderCounter');
  if (!track) return;
  const total = track.children.length;
  sliderIndex = Math.max(0, Math.min(total - 1, sliderIndex + dir));
  updateSlider(sliderIndex);
}

function updateSlider(idx) {
  const track   = document.getElementById('sliderTrack');
  const counter = document.getElementById('sliderCounter');
  const prev    = document.getElementById('sliderPrev');
  const next    = document.getElementById('sliderNext');
  if (!track) return;
  const total = track.children.length;
  track.style.transform = `translateX(${-idx * 100}%)`;
  if (counter) counter.textContent = `${idx + 1} / ${total}`;
  if (prev) prev.disabled = idx === 0;
  if (next) next.disabled = idx === total - 1;
}

/* Close triggers */
$modalClose?.addEventListener('click', closeModal);
$modalOverlay?.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (!$modal) return;
  if (e.key === 'Escape' && !$modal.hasAttribute('hidden')) closeModal();
  // Keyboard slider navigation
  if ($modal.hasAttribute('hidden')) return;
  if (e.key === 'ArrowLeft')  moveSlider(-1);
  if (e.key === 'ArrowRight') moveSlider(+1);
});


/* ══════════════════════════════════════════════════════
   7. NAV SMOOTH SCROLL (anchor links already handled by
      CSS scroll-behavior: smooth, this enhances it)
══════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════
   8. SCROLL TO TOP
══════════════════════════════════════════════════════ */

document.getElementById('scrollTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ══════════════════════════════════════════════════════
   9. NAV SMOOTH SCROLL
══════════════════════════════════════════════════════ */

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ══════════════════════════════════════════════════════
   10. SCROLL-FOLLOW SILHOUETTE
   섹션이 바뀔 때마다 다른 실루엣 이미지로 교체됨
══════════════════════════════════════════════════════ */

function swapSilImage(idx) {
  const img = $silFollow?.querySelector('.sil-img');
  if (!img) return;
  const next = SIL_IMAGES[idx % SIL_IMAGES.length];
  if (img.getAttribute('src') === next) return;

  // fade out → swap src → CSS가 fade in 처리
  img.style.opacity = '0';
  setTimeout(() => {
    img.src = next;
    img.style.opacity = ''; // CSS rule이 0.38로 fade in
  }, 420);
}

(function initSilFollow() {
  if (!$silFollow) return;
  let rafSil;
  function updateSil() {
    const y = window.scrollY;
    const lift = Math.min(y * 0.05, 40);
    $silFollow.style.transform = `translateY(${-lift}px)`;
    rafSil = null;
  }
  window.addEventListener('scroll', () => {
    if (!rafSil) rafSil = requestAnimationFrame(updateSil);
  }, { passive: true });
})();


