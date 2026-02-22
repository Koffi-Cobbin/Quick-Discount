# Quick Discounts

## Overview
A React-based discount posting application where users can browse, post, and manage discounts. Built with Create React App, Firebase for backend services (authentication, Firestore database, storage), and Redux for state management.

## Recent Changes
- 2026-02-22: Initial Replit setup - configured port 5000, host 0.0.0.0, deployment as static site

## Project Architecture
- **Framework**: React 18 with Create React App (react-scripts 5.0.1)
- **State Management**: Redux with Redux Thunk
- **Backend**: Firebase (Firestore, Auth, Storage) - config in `src/firebase.js`
- **Routing**: React Router DOM v6
- **Styling**: Bootstrap 5, Styled Components, CSS Modules
- **Payment**: Paystack integration

### Directory Structure
- `src/` - React source code
  - `components/` - UI components (Auth, Cart, Discounts, Home, Layout, etc.)
  - `actions/` - Redux actions
  - `store/` - Context providers (Cart, Wishlist)
  - `reducers/` - Redux reducers
- `public/` - Static assets (images, icons, HTML)

## Running
- Dev server: `npm start` (port 5000)
- Build: `npm run build` (outputs to `build/`)
- Deployment: Static site serving the `build/` directory
