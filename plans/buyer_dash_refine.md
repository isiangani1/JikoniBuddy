# Buyer Dashboard Refinement Plan
**Inspiration:** Uber Eats, Glovo

## 1. UI/UX & Visual Design
- **Dynamic Categories (Glovo style)**: Implement horizontal scrollable carousels for categories instead of wrapping row grids. Add skeleton loaders for a smoother experience before data loads.
- **Hero Banners**: Add a hero section featuring daily promotions, discounts from local sellers, or "Free Delivery" offers.
- **Micro-animations (Uber Eats style)**: Add smooth hover effects on product cards and category pills. Use glassmorphism for sticky headers and bottom mobile navigations.
- **Mobile-First Navigation**: Replace the desktop-heavy sidebar with a sticky bottom navigation bar for mobile users (Home, Search, Orders, Account), which better reflects a typical B2C food app.

## 2. Personalization & Content
- **"Order It Again" Section**: Surface previous orders at the top of the feed for quick re-ordering.
- **Personalized Recommendations**: "Top picks for you" based on past search history and user preferences.
- **Location Context**: Enhance the delivery location picker—make it a prominent element in the sticky header that triggers a full-screen map modal for precise address selection, replacing the static text input flow.

## 3. Search & Discovery
- **Rich Search Suggestions**: Include product thumbnail images, seller ratings, and estimated delivery times directly in the real-time search dropdown.
- **Advanced Filtering**: Add filters for dietary preferences (Vegan, Halal, etc.), maximum delivery fee, and rating constraints.
- **Quick Add to Cart**: Allow users to add items to their cart directly from the home feed (for highlighted products) without navigating to the seller's dedicated page.

## 4. Checkout & Tracking
- **Persistent Floating Cart**: A floating cart button showing the item count and total price to lower friction during checkout.
- **Real-Time Tracking (Socket.IO)**: Once an order is placed, replace the static order timeline with a live map view showing the rider's location and a real-time ETA countdown.
