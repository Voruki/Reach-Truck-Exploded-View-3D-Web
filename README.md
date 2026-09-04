<div align="center">

# 🚜 3D Reach Truck Kinematic Assembly & Interactive Visualization

[![Live Demo](https://img.shields.io/badge/status-live-success?style=for-the-badge&color=FF5500)](https://reachtruck.vorky.fyi)
[![Built with GSAP](https://img.shields.io/badge/Animation-GSAP-blueviolet?style=for-the-badge&logo=greensock)](https://greensock.com/gsap/)
[![Smooth Scroll](https://img.shields.io/badge/Scroll-Lenis-orange?style=for-the-badge)](https://github.com/darkroomengineering/lenis)

An immersive, high-performance web portfolio showcasing an interactive 3D breakdown and kinematic assembly sequence of an industrial pantograph reach truck.

[**Explore Live Demonstration &rarr;**](https://reachtruck.vorky.fyi)

</div>

---

## ✨ Overview

Bridging industrial intralogistics with modern digital craft, this project translates complex 3D CAD data into a fluid, responsive web narrative. Users can scroll downward to trigger a seamless mechanical disassembly sequence, inspecting the vehicle's internal structure, scissor-reach pantograph mechanism, and structural outriggers.

---

## 🚀 Key Features

* **Frame-by-Frame Canvas Rendering:** Utilizes an optimized sequence of 60 high-fidelity frames rendered dynamically onto an HTML5 Canvas element.
* **Scroll-Driven Choreography:** Powered by **GSAP (GreenSock Animation Platform)** and **ScrollTrigger**, allowing scrub-based mechanical control directly tied to the user's scroll position.
* **Inertial Smooth-Scrolling:** Integrated with **Lenis** to deliver a buttery-smooth scrolling experience across both desktop trackpads and mobile touch devices.
* **VisionOS-Inspired Liquid Glass UI:** Custom CSS backdrop filters, radial light leaks, and dynamic glassmorphism panels designed with high contrast and responsiveness.
* **Mobile Optimized:** Features native touch scrolling allowances, GPU-capped pixel density scaling (`devicePixelRatio`), and a clean stacked layout configuration.

---

## 🛠️ Tech Stack

* **Markup & Style:** HTML5, CSS3 (Custom Glassmorphism, CSS Variables, Responsive Media Queries)
* **Scripting:** Vanilla JavaScript (ES6+)
* **Animation & Motion:** GSAP, ScrollTrigger, Lenis Smooth Scroll
* **Hosting & DNS:** GitHub Pages & Cloudflare

---

## 📂 Project Structure

```text
Forklift-Exploded-View-3D-Web/
├── assets/              # Fonts, icons, and creator profile imagery
├── frames/              # Optimized JPEG frame sequence (frame_001.jpg to frame_060.jpg)
├── CNAME                # Custom domain configuration (reachtruck.vorky.fyi)
├── index.html           # Main markup structure and UI layout
├── script.js            # Canvas rendering loop, scroll triggers, and touch controllers
└── style.css            # Precision liquid glass styling and mobile responsive rules
