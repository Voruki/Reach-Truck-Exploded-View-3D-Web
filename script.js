gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("product-canvas");
const context = canvas.getContext("2d");
const loader = document.getElementById("loader");
const loaderText = document.getElementById("loader-text");

const FRAME_COUNT = 60;
const images = [];
const forkliftTrack = { frame: 0 };

// Pad numbers (e.g. 1 -> "001")
const formatFrame = (index) => String(index + 1).padStart(3, "0");

// CHANGED TO .jpg HERE:
const getFramePath = (index) => `frames/frame_${formatFrame(index)}.jpg`;

let loadedCount = 0;

// Handle High-DPI screens and contain-fit rendering
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

  // Responsive 'contain' calculation
  const hRatio = canvas.width / img.naturalWidth;
  const vRatio = canvas.height / img.naturalHeight;
  const ratio = Math.min(hRatio, vRatio) * 0.9;

  const drawWidth = img.naturalWidth * ratio;
  const drawHeight = img.naturalHeight * ratio;
  const drawX = (canvas.width - drawWidth) / 2;
  const drawY = (canvas.height - drawHeight) / 2;

  context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, drawX, drawY, drawWidth, drawHeight);
}

// Preload all 60 frames before enabling scroll
for (let i = 0; i < FRAME_COUNT; i++) {
  const img = new Image();
  img.src = getFramePath(i);

  img.onload = () => {
    loadedCount++;
    const progress = Math.round((loadedCount / FRAME_COUNT) * 100);
    loaderText.innerText = `Loading Mechanical Assets: ${progress}%`;

    if (loadedCount === FRAME_COUNT) {
      loader.classList.add("loaded");
      resizeAndRender();
      setupScrollAnimation();
    }
  };

  img.onerror = () => {
    console.error(`Missing file: ${img.src}`);
  };

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

window.addEventListener("resize", resizeAndRender);
