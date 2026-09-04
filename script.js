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
interactives.forEach(el => {
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
const viewport = document.querySelector('.glass-viewport'); // Target the new rounded glass container

const FRAME_COUNT = 60; // Locked to 60 frames
const images = [];
const forkliftTrack = { frame: 0 };

const formatFrame = (index) => String(index + 1).padStart(3, "0");
const getFramePath = (index) => `frames/frame_${formatFrame(index)}.jpg`;

let loadedCount = 0;

// Size the canvas to exactly match the rounded glass container, not the entire window
function resizeAndRender() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = viewport.clientWidth * dpr;
  canvas.height = viewport.clientHeight * dpr;
  render();
}

function render() {
  const img = images[Math.round(forkliftTrack.frame)];
  if (!img || !img.complete) return;

  context.clearRect(0, 0, canvas.width, canvas.height);

  const hRatio = canvas.width / img.naturalWidth;
  const vRatio = canvas.height / img.naturalHeight;
  
  // Math.max perfectly covers the rounded container corners, eliminating the dead square outline
  const ratio = Math.max(hRatio, vRatio); 

  const drawWidth = img.naturalWidth * ratio;
  const drawHeight = img.naturalHeight * ratio;
  const drawX = (canvas.width - drawWidth) / 2;
  const drawY = (canvas.height - drawHeight) / 2;

  context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, drawX, drawY, drawWidth, drawHeight);
}

// Preload 60 frames
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

// --- 4. GSAP SCROLL ANIMATION (THE FIX) ---
function setupScrollAnimation() {
  // Use a GSAP Timeline connected to ScrollTrigger for rock-solid pinning
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      // +=300% forces the user to scroll a good distance, allowing all 60 frames to play without rushing
      end: "+=300%", 
      scrub: 1, // Smooth scrub delay
      pin: true, // Locks the hero container in place until the animation finishes
    }
  });

  tl.to(forkliftTrack, {
    frame: FRAME_COUNT - 1,
    snap: "frame",
    ease: "none",
    onUpdate: render,
  });
}

// --- 5. PREMIUM 3D HOVER EFFECTS ---
function setupMouseInteractions() {
  const tiltElements = document.querySelectorAll(".3d-tilt");
  gsap.set(tiltElements, { transformPerspective: 1200, transformStyle: "preserve-3d" });

  document.addEventListener("mousemove", (e) => {
    const xData = (e.clientX / window.innerWidth - 0.5) * 2;
    const yData = (e.clientY / window.innerHeight - 0.5) * 2;

    gsap.to(tiltElements, {
      rotationY: xData * 4, 
      rotationX: -yData * 4, 
      ease: "power2.out",
      duration: 1.5
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
