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
    title: 'Atmosphere',
    desc: '스크롤 기반 인터랙티브 웹 경험 — 브랜드 스토리텔링 구현',
    // ✏️ 실제 URL로 교체
    link: '#',
    thumbClass: 'thumb-website',
    thumbLabel: 'Website',
  },
  {
    id: 2,
    type: 'website',
    title: 'Driftline',
    desc: '브랜드 아이덴티티 웹사이트 — 반응형 레이아웃 및 CSS 애니메이션',
    // ✏️ 실제 URL로 교체
    link: '#',
    thumbClass: 'thumb-website',
    thumbLabel: 'Website',
  },
  {
    id: 3,
    type: 'video',
    title: 'Void Motion',
    desc: '브랜드 모션 그래픽 릴 — After Effects 제작',
    // ✏️ 영상 URL 교체: mp4 직링크 또는 YouTube embed URL
    // YouTube embed 예시: 'https://www.youtube.com/embed/VIDEO_ID'
    videoSrc: '',
    isEmbed: false, // ✏️ YouTube embed 사용 시 true
    thumbClass: 'thumb-video',
    thumbLabel: 'Video',
  },
  {
    id: 4,
    type: 'cardnews',
    title: 'Brand Story',
    desc: '브랜드 스토리 카드뉴스 — SNS 배포용 5매 구성, 망고보드 제작',
    slides: 5, // ✏️ 슬라이드 수 (실제 이미지 연결 전 더미 표시용)
    thumbClass: 'thumb-cardnews',
    thumbLabel: 'Card News',
  },
  {
    id: 5,
    type: 'cardnews',
    title: 'Visual Essay',
    desc: '시각 에세이 카드뉴스 — Illustrator + 망고보드 제작',
    slides: 4,
    thumbClass: 'thumb-cardnews',
    thumbLabel: 'Card News',
  },
  {
    id: 6,
    type: 'poster',
    title: 'Nocturne',
    desc: '공연 포스터 — Illustrator 제작, A2 사이즈',
    thumbClass: 'thumb-poster',
    thumbLabel: 'Poster',
  },
  {
    id: 7,
    type: 'poster',
    title: 'Liminal',
    desc: '전시 기획 포스터 — Photoshop 제작',
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
const $cordLabel    = document.getElementById('cordLabel');
const $projectsGrid = document.getElementById('projectsGrid');
const $filterBtns   = document.querySelectorAll('.filter-btn');
const $modal        = document.getElementById('modal');
const $modalOverlay = document.getElementById('modalOverlay');
const $modalClose   = document.getElementById('modalClose');
const $modalInner   = document.getElementById('modalInner');
const $sections     = document.querySelectorAll('.section');
const $html         = document.documentElement;
const $silFollow    = document.getElementById('silFollow');


/* ══════════════════════════════════════════════════════
   1. THEME TOGGLE (Cord)
══════════════════════════════════════════════════════ */

let inverted = false;

function toggleTheme() {
  inverted = !inverted;

  // 쿨(기본) ↔ 웜+반전 동시 전환
  // 기본: cool 팔레트, 섹션 순서 그대로
  // 반전: warm 팔레트, 섹션 dark/light 순서 뒤집힘
  $html.dataset.theme = inverted ? 'warm' : 'cool';
  $html.toggleAttribute('data-inverted', inverted);

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
  let active = $sections[0];
  $sections.forEach(sec => {
    if (y + window.innerHeight * 0.45 >= sec.offsetTop) active = sec;
  });

  // data-inverted 상태일 때 dark/light 판단을 반전
  const isDark = active.classList.contains('section-dark');
  const effectivelyDark = inverted ? !isDark : isDark;

  $nav.classList.toggle('on-dark',   effectivelyDark);
  $nav.classList.toggle('on-light', !effectivelyDark);
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

    card.innerHTML = `
      <div class="card-thumb ${p.thumbClass}">
        <span class="thumb-label">${p.thumbLabel}</span>
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
  if (p.type === 'website') {
    window.open(p.link, '_blank', 'noopener,noreferrer');
    return;
  }
  openModal(p);
}


/* ── Filter ───────────────────────────────────────── */

function filterCards(filter) {
  document.querySelectorAll('.project-card').forEach(card => {
    const match = filter === 'all' || card.dataset.type === filter;
    card.classList.toggle('hide', !match);
  });
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
    const slides = Array.from({ length: p.slides }, (_, i) => `
      <div class="slider-slide thumb-cardnews">
        <!-- ✏️ 실제 이미지: <img src="..." alt="슬라이드 ${i+1}"> 로 교체 -->
        <span>${i + 1} / ${p.slides}</span>
      </div>`).join('');

    media = `
      <div class="slider-wrap" id="sliderWrap">
        <div class="slider-track" id="sliderTrack">${slides}</div>
      </div>
      <div class="slider-controls">
        <button class="slider-btn" id="sliderPrev" aria-label="이전">&#8592;</button>
        <span class="slider-counter" id="sliderCounter">1 / ${p.slides}</span>
        <button class="slider-btn" id="sliderNext" aria-label="다음">&#8594;</button>
      </div>`;
  }

  if (p.type === 'poster') {
    media = `<div class="modal-poster thumb-poster">
      <!-- ✏️ 실제 이미지: <img src="..." alt="${p.title}" style="width:100%;height:100%;object-fit:cover;"> 로 교체 -->
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
   히어로에서 시작해 스크롤 시 함께 따라오는 고정 실루엣
   ✏️ #silFollow img src에 이미지 경로 입력 시 표시됨
══════════════════════════════════════════════════════ */

(function initSilFollow() {
  if (!$silFollow) return;
  let rafSil;
  function updateSil() {
    const y = window.scrollY;
    // 스크롤 내릴수록 살짝 위로 떠오르는 느낌 (최대 40px)
    const lift = Math.min(y * 0.05, 40);
    $silFollow.style.transform = `translateY(${-lift}px)`;
    rafSil = null;
  }
  window.addEventListener('scroll', () => {
    if (!rafSil) rafSil = requestAnimationFrame(updateSil);
  }, { passive: true });
})();
