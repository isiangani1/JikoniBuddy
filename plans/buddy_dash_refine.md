# Buddy Dashboard Refinement Plan
**Inspiration:** Uber Driver App, On-demand Workforce Apps

## 1. Action-Oriented Dashboard (Home)
- **Map-Centric View**: Replace the generic landing page feed with a map showing nearby "hot zones" (areas with high seller demand for help).
- **Incoming Job Popups**: Real-time push notifications (via Socket.IO) that present a prominent modal when a job matches. It should instantly display payout, distance to seller, and task type.
- **Prominent Status Toggle**: Make the "Go Online / Go Offline" toggle a massive, unmistakable component centered at the top or bottom of the screen to explicitly control availability.

## 2. Earnings & Performance Transparency
- **Earnings Tracker**: Add a visual progress tracker for daily/weekly earning goals on the main dashboard.
- **Payout Countdown**: Clear indication of when the next payout is scheduled alongside the current wallet balance.
- **Metrics Dashboard**: Easy-to-read stats for Acceptance Rate, Completion Rate, and Average Rating, highlighting to the Buddy how these metrics affect their matching priority.

## 3. Streamlined Onboarding
- **Progress Wizard**: Convert the signup flow into a clear, multi-step wizard with a persistent completion percentage (e.g., "75% to your first job!").
- **Document Uploads**: Built-in camera component to capture ID and face directly in the browser/app without needing external file pickers, reducing drop-off during onboarding.

## 4. Job Execution Flow
- **Active Job Mode**: When a buddy accepts a job, the UI should lock into "Active Mode", hiding distractive navigation links and focusing entirely on:
  - Navigation instructions to the seller.
  - Checklist of tasks (e.g., "Package 5 boxes", "Deliver to Address").
  - A "Complete Job" swipe-slider button (to prevent accidental taps and ensure deliberate completion).
