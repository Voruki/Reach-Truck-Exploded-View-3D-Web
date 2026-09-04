gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("product-canvas");
const context = canvas.getContext("2d");
const loader = document.getElementById("loader");
const loaderText = document.getElementById("loader-text");

const FRAME_COUNT = 60;
const images = [];
const forkliftTrack = { frame: 0 };

const formatFrame = (index) => String(index + 1).padStart(3, "0");
const getFramePath = (index) => `frames/frame_${formatFrame(index)}.jpg`;

let loadedCount = 0;

function resizeAndRender() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  render();
}

function render() {
  const img = images[Math.round(forkliftTrack.frame)];
  if (!img || !img.complete) return;

  context.clearRect(0, 0, canvas.width, canvas.height);

  const hRatio = canvas.width / img.naturalWidth;
  const vRatio = canvas.height / img.naturalHeight;
  const ratio = Math.min(hRatio, vRatio) * 0.9; 

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
  
  img.onerror = () => console.error(`Missing: ${img.src}`);
  images.push(img);
}

function setupScrollAnimation() {
  gsap.to(forkliftTrack, {
    frame: FRAME_COUNT - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: ".scroll-container",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5, 
    },
    onUpdate: render,
  });
}

// PREMIUM 3D HOVER EFFECTS
function setupMouseInteractions() {
  const tiltElements = document.querySelectorAll(".3d-tilt");

  // Apply base perspective to elements so they can pop in 3D
  gsap.set(tiltElements, { transformPerspective: 1200, transformStyle: "preserve-3d" });

  document.addEventListener("mousemove", (e) => {
    // Calculate normalized mouse coordinates (-1 to 1)
    const xData = (e.clientX / window.innerWidth - 0.5) * 2;
    const yData = (e.clientY / window.innerHeight - 0.5) * 2;

    // Tilt the glass panels based on cursor location
    gsap.to(tiltElements, {
      rotationY: xData * 8,   // Max tilt 8 degrees
      rotationX: -yData * 8, 
      ease: "power2.out",
      duration: 1.2
    });
  });

  // Magnetic button pull effect
  const magneticBtns = document.querySelectorAll(".magnetic-btn");
  magneticBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: "power2.out"
      });
    });
    
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        x: 0, y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)" 
      });
    });
  });
}

window.addEventListener("resize", resizeAndRender);
