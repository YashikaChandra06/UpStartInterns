# Explore India — Travel Guide Landing Page

## Overview
**Explore India** is a responsive, modern single-page travel guide web application built for **UpStartInterns**. It showcases diverse travel destinations across India, ranging from the majestic Himalayas to the serene beaches of Goa and historic monuments like the Taj Mahal.

---

## What Was Done

1. **Semantic HTML5 Structure (`index.html`)**:
   - **Navigation Bar (`<header>`, `<nav>`)**: Brand logo ("Explore India") and smooth-scrolling navigational links (`Home`, `Places`, `About`).
   - **Hero Section (`<main>`, `<section class="hero">`)**: Engaging heading with fluid typography, introductory copy, call-to-action (CTA) button, and featured imagery.
   - **Destinations Grid (`<section class="destinations">`)**: Interactive card grid (`<article class="card">`) showcasing Himachal Pradesh, Goa, and Agra with high-resolution imagery and descriptive content.
   - **About Section (`<section class="about">`)**: Clean narrative block emphasizing experiential travel and cultural exploration.
   - **Footer (`<footer>`)**: Clean branding and copyright section.

2. **CSS Design System & Responsiveness**:
   - Built with Vanilla CSS including layout resets, smooth scrolling (`scroll-behavior: smooth`), and modern styling.
   - **Layout Modules**: CSS Grid for destination cards (3-column desktop layout dynamically breaking into 2-column tablet and 1-column mobile layouts) and 2-column hero section.
   - **Media Queries**: Custom breakpoints (`@media`) targeted for 800px (tablets), 600px (mobile devices), and 375px (small screen mobile devices) to guarantee full responsiveness.

---

## Key Decisions Made

1. **Embedded vs. External CSS**:
   - **Decision**: Embedded complete visual styles directly within the `<head>` of `index.html` alongside a lightweight `index.css` helper.
   - **Rationale**: Ensures zero render-blocking external network requests for stylesheets, allowing instant page load and standalone portability.

2. **Fluid Typography & Micro-Animations**:
   - **Decision**: Applied CSS `clamp(2.2rem, 5vw, 4rem)` for hero titles, combined with subtle hover transitions (`:hover`) on navigation links and buttons.
   - **Rationale**: Delivers smooth visual scaling across viewport sizes without requiring excessive font-size media query overrides.

3. **Color Palette & Visual Theme**:
   - **Decision**: Selected a warm terracotta accent color (`#d35400`) paired with crisp white card containers (`#ffffff`) and soft neutral backgrounds (`#f7f7f7`).
   - **Rationale**: Reflects traditional Indian spice and architectural tones while maintaining a sleek, modern visual aesthetic.

4. **Optimized Asset Delivery**:
   - **Decision**: Implemented dynamic Unsplash CDN imagery with explicit optimization parameters (`auto=format&fit=crop&w=800&q=80`).
   - **Rationale**: Keeps network payload lightweight while guaranteeing responsive image sharpness and high aesthetic visual quality across screen densities.

---

## How to Run
Open `index.html` directly in any web browser or serve it using a local development server:

```bash
# Using Python builtin HTTP server
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.