# Portfolio sky preview

Local preview: http://localhost:4173/portfolio-entry-preview.html

The introduction now frames the existing computer and six project folders with three manually selectable official photographs: Cosmic Cliffs, Rho Ophiuchi, and an ISS orbital sunset with illuminated clouds. Full image sources, credits, dimensions and retrieval instructions are in `sky-image-credits.md`.

## Implementation

- `portfolio-sky.js` and `portfolio-sky.css` enhance only the independent entry preview. `.tmp/build-entry-preview.py` includes them with content hashes.
- One photograph loads initially; other photographs load when selected. Successful image loads update the selected button, background and visible credit together. An older pending request cannot override a newer selection.
- A native dialog displays the complete image with its source and scientific context. Three real project links open the existing project dialog above it; closing a project returns to the same selected image. Mobile shows a single project archive entry instead.
- Pointer movement adds a small translation to the image layer; foreground controls stay in place. Coarse pointers and reduced motion disable this effect. No autoplay or sound was added.
- The shared original `scroll-world.html` and project content were not changed in this iteration. No publication or remote update was performed.

## Verification

- Browser checks at 1280 x 720 and 390 x 844: complete image rendering, all three selections, readable foreground, no horizontal overflow, full dialog footer and close control available.
- Desktop image viewer -> gourd museum project -> image viewer preserved the selected image and returned focus to the project button.
- Mobile image viewer -> project archive -> image viewer -> Escape returned focus to the entry control and restored scrolling.
- Reduced motion resulted in `transform: none` and zero transition duration for the image layer.
- Updated orbital sunset source, image dimensions and photographer credit checked in the browser; browser error log was empty in the final verification tab.
- `node --check portfolio-sky.js` passed. Existing `node scripts/check-scroll-world.cjs` passed its catalogue, game, asset and timeline checks.

Screenshots are in `.tmp/sky-review-20260908/`. `home-desktop.png`, `nebula-view-desktop.png`, and `nebula-view-mobile.png` capture the reviewed main layouts.
