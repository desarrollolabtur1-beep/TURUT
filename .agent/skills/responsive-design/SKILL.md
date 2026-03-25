---
name: responsive-design
description: "Create responsive web designs that work across all devices and screen sizes. Use when building mobile-first interfaces, adapting fixed layouts, or optimizing media per device."
model: sonnet, inherit
---

# Responsive Design Skill

Expertise in building flexible, device-agnostic layouts. Focuses on **mobile-first** development, fluid grids, and adaptive media to ensure a seamless user experience across mobile, tablet, desktop, and ultra-wide screens.

## When to use this skill

1.  **New website/app**: Planning and implementing layout design for combined mobile-desktop use.
2.  **Legacy improvement**: Converting older fixed-width layouts into fluid, modern responsive ones.
3.  **Performance optimization**: Implementing responsive images (`srcset`) and optimizing media per device capacity.
4.  **Multi-screen support**: Ensuring specific optimizations for tablet orientations, touch targets, and large desktop viewports.

## Core Strategies

### 1. Mobile-First Approach
Start designing and coding for the smallest screen first (usually 320px–480px) and use min-width media queries to add complexity for larger screens. 
- **Benefits**: Cleaner code, better performance, and prioritizes core content.

### 2. Flexible Layouts (Flexbox & Grid)
Avoid fixed pixel widths for containers. Use CSS Flexbox for 1D layouts (navbars, item lists) and CSS Grid for 2D page structures (main layouts, galleries).
- Use `fr` units, `minmax()`, and `%` instead of `px`.

### 3. Responsive Breakpoints
Define breakpoints based on the **content**, not specific device models. Common logical breakpoints:
- `< 600px`: Mobile
- `600px - 1024px`: Tablet / Small Laptop
- `> 1024px`: Desktop
- `> 1440px`: Large Screens

### 4. Responsive Media
Ensure images and videos scale without breaking the layout.
- `img { max-width: 100%; height: auto; }`
- Use `<picture>` or `srcset` for serving different image sizes based on device DPR or viewport width.

### 5. Responsive Typography
Use relative units like `rem`, `em`, or viewport units (`vw`, `vh`) for font sizes to allow scaling with the viewport or user settings.
- `fluid typography`: Use `clamp(min, preferred, max)` for smooth scaling across resolutions.

## Process

1.  **Audit/Plan**: Identify the layout shifts needed for different viewports.
2.  **Base CSS**: Write the "mobile" styles first (outside of any media queries).
3.  **Breakpoints**: Add `@media (min-width: ...)` rules to handle layout changes for tablet and desktop.
4.  **Verification**: Test in browser using "Responsive Mode" or "Device Emulation" for all standard sizes.

## Output Format

When providing responsive solutions, include:
1.  **CSS/HTML**: The actual implementation code.
2.  **Breakpoint Logic**: Explanation of why specific breakpoints were chosen.
3.  **Performance Notes**: Tips on optimizing assets for mobile.
