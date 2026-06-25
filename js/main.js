/**
 * SOFA Phương Ly | Main JavaScript
 * Three.js hero + showcase, GSAP animations, interactions
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* ===================================================
   CONFIG – chỉnh sửa tại đây hoặc trong config.js
   =================================================== */
const SITE = {
  fanpage:  'https://www.facebook.com/profile.php?id=61574062977384',
  phone:    '[SĐT]',    // TODO: số điện thoại thật
  zalo:     '[SĐT]',    // TODO: Zalo
  address:  '[Địa chỉ showroom]', // TODO: địa chỉ thật
};

/* ===================================================
   DỮ LIỆU SẢN PHẨM
   TODO: thay ảnh picsum bằng ảnh sản phẩm thật
   =================================================== */
const PRODUCTS = {
  'sofa-da': [
    { name: 'Sofa Da Modular DT-SF 001', desc: 'Sofa da be kem module linh hoạt, đệm dày êm ái, phù hợp mọi không gian', img: 'images/sp-1.jpg' },
    { name: 'Sofa Da DT-SF 020',         desc: 'Da bò nâu cognac mềm mịn, đường chỉ may tinh tế, chân kim loại sang trọng', img: 'images/sp-2.jpg' },
    { name: 'Sofa Da DT-SF 025',         desc: 'Da be kem viền nâu đặc trưng, thiết kế hiện đại, nệm cao su non cao cấp', img: 'images/sp-3.jpg' },
    { name: 'Sofa Da Góc L DT-SF 061',   desc: 'Sofa góc L da đen lịch lãm, khung gỗ chắc chắn, phù hợp phòng khách rộng', img: 'images/sp-6.jpg' },
    { name: 'Sofa Da DT-SF 062',         desc: 'Da đen sang trọng, tựa lưng êm, chân inox bền đẹp, dễ vệ sinh', img: 'images/sp-7.jpg' },
  ],
  'sofa-go': [
    { name: 'Sofa Gỗ Nan Dọc DT-SF 047', desc: 'Khung gỗ nan dọc thủ công tinh xảo, đệm nỉ cao cấp, phong cách Á Đông', img: 'images/sp-4.jpg' },
    { name: 'Sofa Gỗ DT-SF 026',         desc: 'Khung gỗ tự nhiên kết hợp vải lanh nâu ấm, tựa lưng ngả êm ái', img: 'images/sp-5.jpg' },
    { name: 'Sofa Gỗ DT-SF 063',         desc: 'Vải nhung xám nâu sang trọng, khung gỗ chắc, thiết kế 3 chỗ rộng rãi', img: 'images/sp-8.jpg' },
    { name: 'Sofa Gỗ Walnut DT-SF 066',  desc: 'Khung gỗ walnut tự nhiên, vải ghi hiện đại, bàn giữa tích hợp tiện lợi', img: 'images/sp-11.jpg' },
    { name: 'Sofa Gỗ DT-SF 052',         desc: 'Nỉ nhung xám mềm mại, khung gỗ sồi vững chắc, dáng dài thư giãn tuyệt vời', img: 'images/sp-14.jpg' },
  ],
  'divan': [
    { name: 'Divan DT-SF 064',   desc: 'Vải nhung xám trắng bo tròn thanh lịch, đệm dày êm ái, thiết kế tối giản', img: 'images/sp-9.jpg' },
    { name: 'Divan DT-SF 065',   desc: 'Vải nhung xanh rêu đậm cá tính, dáng sofa băng rộng, phong cách hiện đại', img: 'images/sp-10.jpg' },
    { name: 'Divan DT-SF 067',   desc: 'Vải be nhạt tinh tế, dáng sofa đôi cân đối, nệm cao su non không xẹp lún', img: 'images/sp-12.jpg' },
    { name: 'Divan Da DT-SF 068', desc: 'Da xanh lá sang trọng độc đáo, chân gỗ tối màu, điểm nhấn hoàn hảo cho phòng khách', img: 'images/sp-13.jpg' },
    { name: 'Divan Da DT-SF 069', desc: 'Da cam cognac ấm áp, dáng sofa 3 chỗ rộng, đường nét vuông vức hiện đại', img: 'images/sp-15.jpg' },
  ],
};

const BADGE = { 'sofa-da': 'Sofa Da', 'sofa-go': 'Sofa Gỗ', 'divan': 'Giường Divan' };

/* ===================================================
   HELPERS
   =================================================== */
const isMobile   = window.innerWidth < 768;
const isReduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ===================================================
   1. LOADER
   =================================================== */
function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  const hideLoader = () => {
    loader.classList.add('done');
    document.body.classList.remove('is-loading');
  };

  if (isReduced) { hideLoader(); return; }

  // Đợi fonts + tối thiểu 1.4s
  const minDelay = new Promise(res => setTimeout(res, 1400));
  const fontsReady = document.fonts.ready;

  Promise.all([minDelay, fontsReady]).then(hideLoader);
}

/* ===================================================
   2. SMOOTH SCROLL – Lenis
   =================================================== */
function initLenis() {
  if (isReduced || typeof Lenis === 'undefined') return;

  const lenis = new Lenis({ lerp: 0.07, smoothWheel: true });

  // Tích hợp với GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anchor links cuộn mượt
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    });
  });
}

/* ===================================================
   3. CURSOR
   =================================================== */
function initCursor() {
  if (isMobile || isReduced) return;

  const dot  = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (!dot || !ring) return;

  let mx = -200, my = -200, rx = -200, ry = -200;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function update() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);

  // Enlarge cursor over clickable elements
  document.addEventListener('mouseover', e => {
    if (e.target.matches('a,button,.product-card,.swatch,.tab')) {
      dot.style.width  = '14px';
      dot.style.height = '14px';
      ring.style.width  = '52px';
      ring.style.height = '52px';
      ring.style.borderColor = 'rgba(201,163,91,0.8)';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.matches('a,button,.product-card,.swatch,.tab')) {
      dot.style.width  = '';
      dot.style.height = '';
      ring.style.width  = '';
      ring.style.height = '';
      ring.style.borderColor = '';
    }
  });
}

/* ===================================================
   4. HEADER
   =================================================== */
function initHeader() {
  const header = $('#site-header');
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobile-nav');
  if (!header) return;

  // Thêm class "scrolled" khi cuộn xuống
  ScrollTrigger.create({
    start: 'top -60',
    end: 99999,
    onUpdate: self => {
      header.classList.toggle('scrolled', self.progress > 0);
    },
  });

  // Mobile menu
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('open');
  });

  // Đóng menu khi bấm link
  $$('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileNav?.classList.remove('open');
    });
  });
}

/* ===================================================
   5. HERO – THREE.JS SCENE
   TODO: thay file public/models/sofa.glb bằng model thật
   =================================================== */
let heroSofa     = null;
let sofaMaterials = {};

function buildSofaGeometry(leatherColor = '#8A5A36') {
  const group = new THREE.Group();
  const col = new THREE.Color(leatherColor);

  const leather = new THREE.MeshStandardMaterial({ color: col, roughness: 0.72, metalness: 0.08 });
  const cushion = new THREE.MeshStandardMaterial({ color: col.clone().multiplyScalar(1.12), roughness: 0.85, metalness: 0.0 });
  const wood    = new THREE.MeshStandardMaterial({ color: new THREE.Color('#2E1C0E'), roughness: 0.88, metalness: 0.04 });

  // Lưu materials để đổi màu sau
  sofaMaterials = { leather, cushion };

  const add = (geo, mat, pos, rot) => {
    const m = new THREE.Mesh(geo, mat);
    if (pos) m.position.set(...pos);
    if (rot) m.rotation.set(...rot);
    m.castShadow = true; m.receiveShadow = true;
    group.add(m);
    return m;
  };

  // Đế ghế
  add(new THREE.BoxGeometry(3.4, 0.48, 1.5), leather, [0, 0.24, 0]);
  // Đệm ngồi trái/phải
  add(new THREE.BoxGeometry(1.55, 0.22, 1.34), cushion, [-0.82, 0.61, 0.04]);
  add(new THREE.BoxGeometry(1.55, 0.22, 1.34), cushion, [ 0.82, 0.61, 0.04]);
  // Lưng ghế
  add(new THREE.BoxGeometry(3.4, 1.08, 0.36), leather, [0, 1.02, -0.57]);
  // Đệm lưng
  add(new THREE.BoxGeometry(1.55, 0.94, 0.18), cushion, [-0.82, 1.0, -0.4]);
  add(new THREE.BoxGeometry(1.55, 0.94, 0.18), cushion, [ 0.82, 1.0, -0.4]);
  // Tay ghế trái/phải
  add(new THREE.BoxGeometry(0.36, 0.82, 1.5), leather, [-1.7, 0.62,  0]);
  add(new THREE.BoxGeometry(0.36, 0.82, 1.5), leather, [ 1.7, 0.62,  0]);
  // Mặt tay ghế
  add(new THREE.BoxGeometry(0.36, 0.09, 1.5), cushion, [-1.7, 1.075, 0]);
  add(new THREE.BoxGeometry(0.36, 0.09, 1.5), cushion, [ 1.7, 1.075, 0]);
  // Chân ghế
  const legGeo = new THREE.CylinderGeometry(0.055, 0.04, 0.24, 10);
  [[-1.45, 0.12, 0.6], [1.45, 0.12, 0.6], [-1.45, 0.12, -0.62], [1.45, 0.12, -0.62]].forEach(p => {
    add(legGeo, wood, p);
  });

  group.position.y = 0.12; // đặt trên sàn
  return group;
}

function buildHeroScene() {
  const canvas = $('#hero-canvas');
  if (!canvas || isReduced) return;

  const w = canvas.clientWidth  || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(w, h, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = !isMobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x15110E);

  // Scene + Fog
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x15110E, 0.07);

  // Camera
  const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 80);
  camera.position.set(0, 1.8, 7);
  camera.lookAt(0, 0.6, 0);

  // Lights
  scene.add(new THREE.AmbientLight(0xfff5e0, 0.35));

  const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.5);
  keyLight.position.set(4, 6, 3);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.setScalar(1024);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far  = 30;
  keyLight.shadow.bias = -0.002;
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0xC9A35B, 3.0, 12);
  fillLight.position.set(-4, 3, 2);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xB07A4A, 2.0, 10);
  rimLight.position.set(2, 1, -4);
  scene.add(rimLight);

  const groundLight = new THREE.PointLight(0x3d2010, 1.5, 8);
  groundLight.position.set(0, -0.5, 0);
  scene.add(groundLight);

  // Sàn bắt bóng
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.ShadowMaterial({ opacity: 0.4 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Sofa
  heroSofa = buildSofaGeometry('#8A5A36');
  scene.add(heroSofa);

  // Hạt bụi sáng lơ lửng
  const particleCount = isMobile ? 200 : 700;
  const pPos  = new Float32Array(particleCount * 3);
  const pSizes = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    pPos[i*3]   = (Math.random() - 0.5) * 16;
    pPos[i*3+1] = Math.random() * 7;
    pPos[i*3+2] = (Math.random() - 0.5) * 10;
    pSizes[i]   = Math.random() * 0.04 + 0.01;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0xD4A855, size: 0.035, transparent: true, opacity: 0.55, sizeAttenuation: true,
  }));
  scene.add(particles);

  // Post-processing – Bloom (chỉ desktop)
  let composer = null;
  if (!isMobile) {
    try {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.65, 0.35, 0.18);
      composer.addPass(bloom);
      composer.addPass(new OutputPass());
    } catch (e) {
      console.warn('Bloom không khởi động được, dùng renderer thông thường:', e);
      composer = null;
    }
  }

  // Mouse parallax
  let mxTarget = 0, myTarget = 0, mxCurrent = 0, myCurrent = 0;
  let autoRotY = 0;

  window.addEventListener('mousemove', e => {
    mxTarget = (e.clientX / window.innerWidth  - 0.5) * 0.55;
    myTarget = (e.clientY / window.innerHeight - 0.5) * 0.18;
  });

  // Render loop
  const clock = new THREE.Clock();
  function heroAnimate() {
    requestAnimationFrame(heroAnimate);
    const t = clock.getElapsedTime();

    // Tự xoay chậm
    autoRotY += 0.004;

    // Lerp mouse
    mxCurrent += (mxTarget - mxCurrent) * 0.04;
    myCurrent += (myTarget - myCurrent) * 0.04;

    heroSofa.rotation.y = autoRotY + mxCurrent;
    heroSofa.rotation.x = myCurrent;

    // Hạt lơ lửng nhẹ
    particles.rotation.y = t * 0.03;
    particles.position.y = Math.sin(t * 0.3) * 0.05;

    // Ánh sáng fill rung động nhẹ
    fillLight.intensity = 3.0 + Math.sin(t * 1.2) * 0.4;

    if (composer) { composer.render(); }
    else          { renderer.render(scene, camera); }
  }
  heroAnimate();

  // Resize
  window.addEventListener('resize', () => {
    const nw = canvas.clientWidth  || window.innerWidth;
    const nh = canvas.clientHeight || window.innerHeight;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh, false);
    composer?.setSize(nw, nh);
  });
}

/* ===================================================
   6. SHOWCASE – Image carousel với drag/swipe
   =================================================== */
function buildShowcaseScene() {
  const carousel  = $('#showcase-carousel');
  const track     = $('#showcase-track');
  const dotsWrap  = $('#showcase-dots');
  const wrap      = $('#showcase-wrap');
  if (!carousel || !track) return;

  const slides = [...track.querySelectorAll('.showcase-slide')];
  const total  = slides.length;
  let current  = 0;
  let autoTimer;

  // Tạo dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'showcase-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ảnh ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap?.appendChild(dot);
  });

  function updateDots() {
    dotsWrap?.querySelectorAll('.showcase-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index, animate = true) {
    current = (index + total) % total;
    track.classList.toggle('dragging', !animate);
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  }

  // Drag / swipe
  let startX = 0, dragDelta = 0, isDragging = false;

  function onDown(e) {
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    isDragging = false;
    dragDelta = 0;
    clearInterval(autoTimer);
    track.classList.add('dragging');
  }

  function onMove(e) {
    if (startX === null) return;
    dragDelta = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
    if (Math.abs(dragDelta) > 4) { isDragging = true; }
    if (isDragging) {
      const base = -current * 100;
      const pct  = (dragDelta / carousel.offsetWidth) * 100;
      track.style.transform = `translateX(calc(${base}% + ${dragDelta}px))`;
      e.preventDefault();
    }
  }

  function onUp() {
    if (!isDragging) { track.classList.remove('dragging'); resetAuto(); return; }
    if (dragDelta < -50)      goTo(current + 1);
    else if (dragDelta > 50)  goTo(current - 1);
    else                      goTo(current);
    track.classList.remove('dragging');
    startX = null; dragDelta = 0; isDragging = false;
  }

  carousel.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove',   onMove);
  window.addEventListener('mouseup',     onUp);
  carousel.addEventListener('touchstart', onDown, { passive: true });
  carousel.addEventListener('touchmove',  onMove, { passive: false });
  carousel.addEventListener('touchend',   onUp);

  // Color swatches → đổi accent border của wrap
  $$('.swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.swatch').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (wrap) wrap.style.borderColor = btn.dataset.hex + '66';
    });
  });

  resetAuto();
}

/* ===================================================
   7. PRODUCTS – Render cards + tabs
   =================================================== */
function renderProducts(tabKey) {
  const grid = $('#product-grid');
  if (!grid) return;

  const items = PRODUCTS[tabKey] || [];
  grid.innerHTML = '';

  items.forEach((item, i) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.innerHTML = `
      <div class="card-img">
        <img src="${item.img}" alt="${item.name}" loading="lazy" class="zoomable">
        <span class="card-badge">${BADGE[tabKey]}</span>
      </div>
      <div class="card-body">
        <h3 class="card-name">${item.name}</h3>
        <p class="card-desc">${item.desc}</p>
        <a href="${SITE.fanpage}" target="_blank" rel="noopener" class="card-cta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Inbox đặt mẫu này
        </a>
      </div>`;
    grid.appendChild(card);

    // Stagger reveal
    gsap.to(card, {
      opacity: 1, y: 0, duration: 0.55, delay: i * 0.08,
      ease: 'power3.out',
    });
  });

  // 3D tilt effect
  initCardTilt();
}

function initProducts() {
  let activeTab = 'sofa-da';
  renderProducts(activeTab);

  $$('.product-tabs .tab').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab === activeTab) return;
      $$('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.tab;
      renderProducts(activeTab);
    });
  });
}

/* ===================================================
   8. CARD 3D TILT
   =================================================== */
function initCardTilt() {
  if (isMobile) return;
  $$('.product-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const cx  = r.width  / 2;
      const cy  = r.height / 2;
      const x   = e.clientX - r.left - cx;
      const y   = e.clientY - r.top  - cy;
      const rotX = (y / cy) * -8;
      const rotY = (x / cx) *  10;
      card.style.transition = 'none';
      card.style.transform  = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(12px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
}

/* ===================================================
   9. ANIMATED COUNTERS
   =================================================== */
function initCounters() {
  $$('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.count);
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.val); },
        });
      },
    });
  });
}

/* ===================================================
   10. GALLERY PARALLAX
   =================================================== */
function initGalleryParallax() {
  if (isReduced) return;
  $$('.gi').forEach(item => {
    const speed = parseFloat(item.dataset.speed || 0.1);
    const img   = item.querySelector('.gi-img img');
    if (!img) return;
    gsap.to(img, {
      yPercent: speed * 80,
      ease: 'none',
      scrollTrigger: {
        trigger: item,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  });
}

/* ===================================================
   11. SCROLL REVEAL ANIMATIONS
   =================================================== */
function initReveal() {
  if (isReduced) {
    $$('[data-reveal]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }

  $$('[data-reveal]').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        once: true,
      },
    });
  });

  // Hero content stagger reveal (sau khi loader xong)
  const heroEls = $$('.hero-eyebrow, .hero-title, .hero-sub, .hero-btns, .scroll-hint');
  if (heroEls.length) {
    gsap.from(heroEls, {
      opacity: 0, y: 40, duration: 0.8,
      stagger: 0.15, ease: 'power3.out',
      delay: 1.6,
    });
  }

  // USP cards stagger
  ScrollTrigger.create({
    trigger: '.usp-grid',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.from('.usp-card', {
        opacity: 0, y: 50, duration: 0.6,
        stagger: 0.12, ease: 'power3.out',
      });
    },
  });

  // Testimonial cards stagger
  ScrollTrigger.create({
    trigger: '.testi-grid',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.from('.testi-card', {
        opacity: 0, y: 40, duration: 0.6,
        stagger: 0.1, ease: 'power3.out',
      });
    },
  });

  // Gallery images reveal
  ScrollTrigger.create({
    trigger: '.gallery-masonry',
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.from('.gi', {
        opacity: 0, scale: 0.95, duration: 0.7,
        stagger: 0.08, ease: 'power2.out',
      });
    },
  });
}

/* ===================================================
   12. MAGNETIC BUTTONS
   =================================================== */
function initMagneticBtns() {
  if (isMobile || isReduced) return;

  $$('.js-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r   = btn.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const dx  = (e.clientX - cx) * 0.28;
      const dy  = (e.clientY - cy) * 0.28;
      gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ===================================================
   13. HEADER PARALLAX SHRINK
   =================================================== */
function initHeaderParallax() {
  if (isReduced) return;
  gsap.to('.header-inner', {
    paddingTop: '0.7rem', paddingBottom: '0.7rem',
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: '+=200',
      scrub: true,
    },
  });
}

/* ===================================================
   14. LIGHTBOX
   =================================================== */
function initLightbox() {
  const lb      = $('#lightbox');
  const lbImg   = $('#lb-img');
  const lbCap   = $('#lb-caption');
  const lbCtr   = $('#lb-counter');
  const btnClose = $('#lb-close');
  const btnPrev  = $('#lb-prev');
  const btnNext  = $('#lb-next');
  if (!lb) return;

  let images = []; // { src, alt }
  let idx = 0;

  function collectImages() {
    images = [];
    // gallery + product card + showcase carousel
    $$('.gi-img img, .card-img img, .showcase-slide img').forEach(img => {
      if (img.src) images.push({ src: img.src, alt: img.alt || '' });
    });
  }

  function open(i) {
    collectImages();
    idx = Math.max(0, Math.min(i, images.length - 1));
    show();
  }

  function show() {
    const item = images[idx];
    lbImg.style.opacity = '0';
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCap.textContent = item.alt;
    lbCtr.textContent = `${idx + 1} / ${images.length}`;
    lbImg.onload = () => { lbImg.style.opacity = '1'; };
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function prev() { idx = (idx - 1 + images.length) % images.length; show(); }
  function next() { idx = (idx + 1) % images.length; show(); }

  lbImg.style.transition = 'opacity 0.2s ease';

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);

  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  // Delegate click – hoạt động cả với ảnh render sau (product cards)
  document.addEventListener('click', e => {
    const img = e.target.closest('.gi-img img, .card-img img, .showcase-slide img');
    if (!img) return;
    collectImages();
    const i = images.findIndex(item => item.src === img.src);
    open(i >= 0 ? i : 0);
  });

  // Thêm class zoomable cho gallery + showcase (product cards thêm trong renderProducts)
  $$('.gi-img img, .showcase-slide img').forEach(img => img.classList.add('zoomable'));
}

/* ===================================================
   15. INIT ALL
   =================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Đăng ký ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  initLoader();
  initHeader();
  initLenis();
  initCursor();
  initMagneticBtns();
  initHeaderParallax();

  initLightbox();

  // Delay nhẹ để loader animation kịp chạy
  setTimeout(() => {
    buildHeroScene();
    buildShowcaseScene();
    initProducts();
    initCounters();
    initGalleryParallax();
    initReveal();
  }, 300);
});
