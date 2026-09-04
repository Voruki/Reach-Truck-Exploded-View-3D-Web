// --- 1. PREMIUM SMOOTH SCROLLING (LENIS) ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync Lenis with GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// --- 2. CUSTOM VISION-OS CURSOR ---
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  follower.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
});

const interactives = document.querySelectorAll('a, .magnetic-btn');
interactives.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
    cursor.style.mixBlendMode = 'difference';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '6px';
    cursor.style.height = '6px';
    cursor.style.mixBlendMode = 'normal';
  });
});

// --- 3. CANVAS SETUP & PRELOADING ---
const canvas = document.getElementById("product-canvas");
const context = canvas.getContext("2d");
const loader = document.getElementById("loader");
const loaderText = document.getElementById("loader-text");
const viewport = document.querySelector('.glass-viewport');
const hudLayer = document.querySelector('.hud-layer');
const ambientBg = document.querySelector('.ambient-bg');

const FRAME_COUNT = 60;
const images = [];
const forkliftTrack = { frame: 0 };

const formatFrame = (index) => String(index + 1).padStart(3, "0");
const getFramePath = (index) => `frames/frame_${formatFrame(index)}.jpg`;

let loadedCount = 0;

function resizeAndRender() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = viewport.clientWidth * dpr;
  canvas.height = viewport.clientHeight * dpr;

  // High-clarity rendering to keep mechanical details sharp
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  render();
}

function render() {
  const img = images[Math.round(forkliftTrack.frame)];
  if (!img || !img.complete) return;

  context.clearRect(0, 0, canvas.width, canvas.height);

  const hRatio = canvas.width / img.naturalWidth;
  const vRatio = canvas.height / img.naturalHeight;
  const ratio = Math.max(hRatio, vRatio);

  const drawWidth = img.naturalWidth * ratio;
  const drawHeight = img.naturalHeight * ratio;
  const drawX = (canvas.width - drawWidth) / 2;
  const drawY = (canvas.height - drawHeight) / 2;

  context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, drawX, drawY, drawWidth, drawHeight);
}

// Preload 60 sequence frames
for (let i = 0; i < FRAME_COUNT; i++) {
  const img = new Image();
  img.src = getFramePath(i);

  img.onload = () => {
    loadedCount++;
    const progress = Math.round((loadedCount / FRAME_COUNT) * 100);
    loaderText.innerText = `Loading Spatial Assets ${progress}%`;

    if (loadedCount === FRAME_COUNT) {
      loader.classList.add("loaded");
      resizeAndRender();
      setupScrollAnimation();
      setupMouseInteractions();
    }
  };

  img.onerror = () => console.error(`Missing frame: ${img.src}`);
  images.push(img);
}

// --- 4. GSAP SCROLL ANIMATION, REACTIVE GRADIENT & FRAME 44 HUD FADE ---
function setupScrollAnimation() {
  gsap.to(forkliftTrack, {
    frame: FRAME_COUNT - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "+=180%",
      scrub: 0.5,
      pin: true,
    },
    onUpdate: () => {
      render();

      const currentFrame = forkliftTrack.frame;
      const progress = currentFrame / (FRAME_COUNT - 1);

      // 1. SCROLL-REACTIVE AMBIENT DRIFT
      if (ambientBg) {
        const driftY = progress * -40;
        const subtleScale = 1 + progress * 0.06;
        ambientBg.style.transform = `translateY(${driftY}px) scale(${subtleScale})`;
      }

      // 2. FRAME 44 HUD TEXT FADE LOGIC
      if (hudLayer) {
        if (currentFrame <= 44) {
          const opacity = 1 - currentFrame / 44;
          hudLayer.style.opacity = opacity;
          hudLayer.style.transform = `translateY(${(currentFrame / 44) * -25}px)`;
          hudLayer.style.pointerEvents = opacity === 0 ? 'none' : 'auto';
        } else {
          hudLayer.style.opacity = 0;
          hudLayer.style.transform = `translateY(-25px)`;
          hudLayer.style.pointerEvents = 'none';
        }
      }
    },
  });
}

// --- 5. VISION-OS 3D HOVER & MAGNETIC BUTTONS ---
function setupMouseInteractions() {
  // Corrected selector from .3d-tilt to .tilt-3d to resolve the DOMException syntax error
  const tiltElements = document.querySelectorAll(".tilt-3d");
  gsap.set(tiltElements, { transformPerspective: 1200, transformStyle: "preserve-3d" });

  document.addEventListener("mousemove", (e) => {
    const xData = (e.clientX / window.innerWidth - 0.5) * 2;
    const yData = (e.clientY / window.innerHeight - 0.5) * 2;

    gsap.to(tiltElements, {
      rotationY: xData * 4,
      rotationX: -yData * 4,
      ease: "power2.out",
      duration: 1.5,
    });
  });

  const magneticBtns = document.querySelectorAll(".magnetic-btn");
  magneticBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
    });
  });
}

window.addEventListener("resize", resizeAndRender);
