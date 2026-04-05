u# UI Enhancement TODO: Immersive 3D Landing Page

## Phase 1: Foundation & Dependencies
- [x] Update [package.json](file:///home/druid/Documents/Project/jikoni_baddies/package.json) with `three`, `@react-three/fiber`, `@react-three/drei`, and `lenis`.
- [/] Configure `lenis` for smooth scrolling in [layout.tsx](file:///home/druid/Documents/Project/jikoni_baddies/apps/web/app/layout.tsx).
- [/] Set up a base `Scene` component for R3F integration.

## Phase 2: Immersive Hero (3D)
- [ ] Create a low-poly Nairobi-inspired 3D city scene.
- [ ] Implement "lighting up" kitchens and moving rider meshes.
- [ ] Add scroll-zoom and mouse parallax effects using `framer-motion` + R3F.
- [ ] Integrate Glass UI overlay with 10k+ users stats and floating toasts.

## Phase 3: Order Flow Storytelling
- [ ] Design the 3D scroll-triggered sequence:
    - [ ] Customer interaction visualization.
    - [ ] Kitchen processing (vibrant animations).
    - [ ] Buddy Pool activation (dynamic helper meshes appearing).
    - [ ] Delivery transit.
- [ ] Add glass explanation cards that appear alongside scroll steps.

## Phase 4: Feature Deep-Dives
- [ ] **Buddy Pool Interactive**: Demand spike simulation UI.
- [ ] **Seller Dashboard**: Floating 3D dashboard panels with `v-chart` or animated SVGs.
- [ ] **Trust Orbit**: Floating review bubbles in a 3D orbit.

## Phase 5: Conversion & Discovery
- [ ] Refine "Browse by Category" glass cards with expanded hover states and smooth transitions.
- [ ] Ensure "Schedule an Order" widget is perfectly integrated into the 3D scene z-index.

## Phase 6: Performance & Mobile Optimization
- [ ] Implement `Suspense` and `lazy` loading for 3D components.
- [ ] Add Level-of-Detail (LOD) management for the city mesh.
- [ ] Create simplified 2D/Lottie-based fallbacks for mobile viewports.
- [ ] Final visual audit for glassmorphism consistency.
