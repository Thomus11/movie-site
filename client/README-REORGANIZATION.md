# Project Reorganization Documentation

## Overview
The project has been reorganized to improve code maintainability and create a more intuitive structure.

## New Structure

```
src/
  ├── assets/           # Static assets like images and icons
  ├── components/        # Reusable UI components
  │   ├── auth/         # Authentication related components
  │   ├── common/       # Common UI elements (buttons, cards, etc.)
  │   ├── movie/        # Movie-related components
  │   └── ui/           # UI components like carousel, footer
  ├── contexts/         # Context providers
  ├── layouts/          # Layout components
  ├── pages/            # Page components
  │   ├── admin/        # Admin-related pages
  │   ├── home/         # Home page and related components
  │   ├── user/         # User-related pages
  │   └── NotFound.jsx  # 404 page
  ├── App.jsx           # Main App component
  ├── index.css         # Global styles
  └── main.jsx          # Entry point
```

## Changes Made

### Files Moved

1. **Components**:
   - `AuthModal.jsx` → `src/components/auth/AuthModal.jsx`
   - `Carousel.jsx` → `src/components/ui/MovieCarousel.jsx`
   - `Footer.jsx` → `src/components/ui/Footer.jsx`
   - `Navbar.jsx` → `src/components/ui/Navbar.jsx`
   - `AvailableNow.jsx` → `src/components/movie/AvailableMovies.jsx`
   - `ComingSoon.jsx` → `src/components/movie/ComingSoonMovies.jsx`

2. **Pages**:
   - `Home.jsx` → `src/pages/home/HomePage.jsx`
   - `AdminDashboard.jsx` → `src/pages/admin/AdminDashboard.jsx`
   - `AdminAuthPage.jsx` → `src/pages/admin/AdminAuthPage.jsx`
   - `UserDashboard.jsx` → `src/pages/user/UserDashboard.jsx`
   - `NotFound.jsx` → `src/pages/NotFound.jsx`

### Import Paths
All import paths have been updated to reflect the new file locations.

## Benefits of the New Structure

1. **Improved Organization**: Clear separation between pages, components, and other code
2. **Better Maintainability**: Easier to find and update related files
3. **Scalability**: Structure supports adding new features without cluttering directories
