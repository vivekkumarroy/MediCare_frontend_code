# Implementation Plan: Hospital Management System

## Overview

Incremental build of the HMS React SPA: project scaffold → design system → data layer → public pages → auth → patient dashboard → doctor directory → booking wizard → admin dashboard → responsive/accessibility polish → tests.

## Tasks

- [x] 1. Scaffold project and configure tooling
  - Run `npm create vite@latest` with React + TypeScript template
  - Install dependencies: `react-router-dom`, `@tanstack/react-query`, `framer-motion`, `react-hot-toast`, `lucide-react`, `@heroicons/react`, `clsx`, `tailwind-merge`, `fast-check`, `vitest`, `@testing-library/react`, `@testing-library/user-event`, `jsdom`
  - Configure `tailwind.config.js` with extended colors (`primary`, `success`, `danger`, `dark`), Inter font family, and `darkMode: 'class'`
  - Configure `vite.config.ts` with path aliases (`@/` → `src/`)
  - Configure `vitest.config.ts` with jsdom environment and setup file
  - _Requirements: 8.1, 8.3, 7.3_

- [x] 2. Create data layer: TypeScript interfaces and mock JSON fixtures
  - [x] 2.1 Define TypeScript interfaces in `src/types/index.ts`
    - Write `User`, `Doctor`, `Patient`, `Appointment`, `Prescription`, `AuthState` interfaces as specified in the design
    - _Requirements: 8.4_
  - [x] 2.2 Create mock JSON fixtures in `src/data/`
    - `doctors.json` — 20 doctor records with `availableDays` and `availableSlots`
    - `patients.json` — 50 patient records
    - `appointments.json` — 100 appointment records
    - `prescriptions.json` — sample prescriptions linked to patient IDs
    - _Requirements: 3.3, 3.4, 4.1, 5.5_
  - [x] 2.3 Create async mock fetchers in `src/data/fetchers.ts`
    - Wrap JSON imports in `Promise` with a small simulated delay
    - Export `fetchDoctors`, `fetchPatients`, `fetchAppointments`, `fetchPrescriptions`
    - _Requirements: 7.4_

- [x] 3. Implement utility helpers and design system foundation
  - [x] 3.1 Create `src/lib/cn.ts` — `clsx` + `tailwind-merge` helper
    - _Requirements: 8.1, 8.2_
  - [x] 3.2 Create `src/lib/utils.ts`
    - `formatDate(iso: string): string` — human-readable date
    - `generateTimeSlots(doctor: Doctor, date: string): string[]` — returns available slots for a given doctor/date
    - `filterDoctors(doctors, search, specialty, location)` — returns filtered array
    - `filterPatients(patients, query)` — returns filtered array
    - _Requirements: 4.2, 4.3, 4.4, 5.5, 6.3_

- [x] 4. Build UI component library (`src/components/ui`)
  - [x] 4.1 Implement `Button` component
    - Props: `variant` (primary/secondary/danger), `size`, `loading`, `disabled`, `onClick`
    - Show spinner when `loading` is true; apply correct Tailwind color classes per variant
    - _Requirements: 2.5, 8.1, 8.4_
  - [x] 4.2 Implement `Input` component
    - Props: `label`, `error`, `type`, `value`, `onChange`
    - Render red border and error message below field when `error` is set
    - _Requirements: 2.4, 8.4_
  - [x] 4.3 Implement `Card` component
    - Apply `rounded-xl shadow-lg` wrapper; accept `className` and `children`
    - _Requirements: 8.2, 8.4_
  - [x] 4.4 Implement `Badge` component
    - Props: `variant` (success/danger/warning/default), `label`
    - Map variants to Tailwind color classes
    - _Requirements: 3.3, 8.4_
  - [x] 4.5 Implement `Modal` component
    - Wrap a dialog overlay; props: `open`, `onClose`, `title`, `children`
    - Trap focus when open; close on backdrop click or Escape key
    - _Requirements: 6.5, 8.4_
  - [x] 4.6 Implement `Table` component
    - Props: `columns`, `data`, `onEdit`, `onDelete`
    - Render sortable column headers and action buttons per row
    - _Requirements: 3.3, 6.2, 8.4_

- [x] 5. Build layout components (`src/components/layout`)
  - [x] 5.1 Implement `Header` component
    - Logo, nav links, auth buttons; hamburger icon on mobile (< md breakpoint)
    - _Requirements: 7.1, 7.2_
  - [x] 5.2 Implement `Sidebar` component
    - Vertical nav for dashboard pages; hidden on mobile, replaced by slide-out drawer
    - _Requirements: 3.1, 7.1, 7.2_
  - [x] 5.3 Implement `Layout` component
    - Compose `Header` + optional `Sidebar` + `<main>` content area
    - _Requirements: 7.1_

- [x] 6. Set up routing, auth context, and appointments context
  - [x] 6.1 Create `AuthContext` in `src/context/AuthContext.tsx`
    - Store `user`, `isAuthenticated`; implement `login` (validates against mock users, sets state) and `logout` (clears state, redirects to `/`)
    - _Requirements: 2.3, 2.6_
  - [x] 6.2 Create `AppointmentsContext` in `src/context/AppointmentsContext.tsx`
    - Store appointment list; implement `addAppointment` and `cancelAppointment`
    - _Requirements: 3.3, 5.4_
  - [x] 6.3 Create `ProtectedRoute` component
    - Redirect unauthenticated users to `/login?redirect=<current-path>`
    - Redirect authenticated users to the correct dashboard based on role
    - _Requirements: 2.3_
  - [x] 6.4 Configure React Router in `src/App.tsx`
    - Define all routes from the routing structure; wrap page components in `React.lazy` + `Suspense` with skeleton fallback
    - Wrap app in `QueryClientProvider`, `AuthContext.Provider`, `AppointmentsContext.Provider`, `<Toaster />`
    - _Requirements: 7.3, 7.4_

- [x] 7. Implement Home page (`src/pages/Home`)
  - [x] 7.1 Build `HeroSection` — full-width banner with headline, subtext, and CTA buttons linking to `/doctors` and `/register`
    - Apply Framer Motion fade-in on mount
    - _Requirements: 1.1, 1.4_
  - [x] 7.2 Build `ServicesSection` — 4-card grid using `Card` component, each with a Lucide icon and description
    - _Requirements: 1.1, 1.3_
  - [x] 7.3 Build `DoctorsCarousel` — horizontal scroll of up to 8 doctor cards fetched via React Query; each card shows name, specialty, and a "Book" link
    - _Requirements: 1.1, 1.2_
  - [x] 7.4 Build `StatsSection` — animated counters for key metrics using Framer Motion
    - _Requirements: 1.1, 1.4_
  - [x] 7.5 Build `Footer` — links, contact info, social icons
    - _Requirements: 1.1_
  - [x] 7.6 Compose `HomePage` from all sections
    - _Requirements: 1.1_

- [x] 8. Implement Auth pages (`src/pages/Auth`)
  - [x] 8.1 Build `LoginPage`
    - Email + password fields + role selector (Patient/Doctor/Admin) using `Input` and `Button` components
    - On submit: validate fields, call `login()` from `AuthContext`, redirect to role dashboard; show inline errors on failure
    - Show loading state on button during submission
    - _Requirements: 2.1, 2.3, 2.4, 2.5_
  - [x] 8.2 Build `RegisterPage`
    - Name + email + password + role selector; validate all fields (email format, password ≥ 8 chars)
    - Show inline errors; show loading state on submit
    - _Requirements: 2.2, 2.4, 2.5_
  - [ ]* 8.3 Write property test for role-based redirect after login
    - **Property 2: Role-based redirect after login**
    - **Validates: Requirements 2.3**
  - [ ]* 8.4 Write property test for form validation blocking invalid submission
    - **Property 3: Form validation blocks invalid submission**
    - **Validates: Requirements 2.4, 5.6**
  - [ ]* 8.5 Write property test for logout clearing auth state
    - **Property 4: Logout clears auth state**
    - **Validates: Requirements 2.6**
  - [ ]* 8.6 Write unit tests for LoginPage and RegisterPage
    - Test form field rendering, inline error display, loading state, successful redirect
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 9. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement Patient Dashboard (`src/pages/PatientDashboard`)
  - [x] 10.1 Build `PatientDashboard` page
    - Compose `Layout` with `Sidebar`; render profile card (name, contact info, role), appointments table via `Table`, prescriptions list, and "Book Appointment" CTA
    - Fetch appointments and prescriptions via React Query; show skeleton while loading
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.4_
  - [x] 10.2 Build `StatsCard` and `AppointmentCard` dashboard components
    - `StatsCard`: icon + label + value + optional trend indicator
    - `AppointmentCard`: doctor name, date, time, status `Badge`, cancel action
    - _Requirements: 3.3_
  - [ ]* 10.3 Write property test for patient dashboard data rendering
    - **Property 5: Patient dashboard displays correct user data**
    - **Validates: Requirements 3.2, 3.3, 3.4**
  - [ ]* 10.4 Write unit tests for PatientDashboard
    - Test profile card fields, appointment table rows, prescription list items, CTA navigation
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 11. Implement Doctor Directory (`src/pages/Doctors`)
  - [x] 11.1 Build `DoctorsPage`
    - Search bar + specialty dropdown + location dropdown; doctor card grid fetched via React Query
    - Wire filters to `filterDoctors` utility; show empty state when no results; show pagination controls when > page size
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [x] 11.2 Build `DoctorCard` component
    - Display name, specialty, location, rating, avatar, and "Book" button
    - Apply hover scale animation
    - _Requirements: 4.1, 7.5_
  - [ ]* 11.3 Write property test for doctor card required fields
    - **Property 1: Doctor card renders required fields**
    - **Validates: Requirements 1.2, 4.1**
  - [ ]* 11.4 Write property test for doctor directory filter correctness
    - **Property 6: Doctor directory filter correctness**
    - **Validates: Requirements 4.2, 4.3, 4.4**
  - [ ]* 11.5 Write unit tests for DoctorsPage
    - Test empty state rendering, pagination controls, filter interactions
    - _Requirements: 4.5, 4.6_

- [x] 12. Implement Appointment Booking wizard (`src/pages/Booking`)
  - [x] 12.1 Build `Step1DoctorSelect`
    - List/search doctors; selecting one stores choice in wizard state; Next button disabled until selection made
    - _Requirements: 5.1, 5.6_
  - [x] 12.2 Build `Step2DateTime`
    - Calendar date picker; on date select, call `generateTimeSlots` and render available slots as selectable buttons
    - Next button disabled until both date and slot are selected
    - _Requirements: 5.2, 5.5, 5.6_
  - [x] 12.3 Build `Step3Summary`
    - Display booking summary (doctor, date, time); notes textarea; Submit button
    - On submit, call `addAppointment` from context, then show `SuccessModal`
    - _Requirements: 5.3, 5.4_
  - [x] 12.4 Build `SuccessModal`
    - Confirmation modal using `Modal` component; "View Appointments" and "Book Another" actions
    - _Requirements: 5.4_
  - [x] 12.5 Compose `BookingPage` with step state machine
    - Track `currentStep` (1–3) and accumulated wizard data; render correct step component; show step progress indicator
    - _Requirements: 5.1, 5.2, 5.3_
  - [ ]* 12.6 Write property test for booking wizard step advancement
    - **Property 7: Booking wizard advances only on valid input**
    - **Validates: Requirements 5.2, 5.3, 5.6**
  - [ ]* 12.7 Write property test for available time slots matching doctor/date availability
    - **Property 8: Available time slots match doctor/date availability**
    - **Validates: Requirements 5.5**
  - [ ]* 12.8 Write unit tests for BookingFlow
    - Test step transitions, success modal appearance, validation error display
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6_

- [ ] 13. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Implement Admin Dashboard (`src/pages/Admin`)
  - [x] 14.1 Build `AdminDashboard` page
    - Stats grid (total patients, doctors, appointments, revenue) using `StatsCard`; patients `Table` with search input; quick action buttons; charts section
    - Fetch data via React Query; show skeleton while loading
    - _Requirements: 6.1, 6.2, 6.6, 6.7_
  - [x] 14.2 Wire patient table search, edit, and delete actions
    - Search input filters rows in real time via `filterPatients`
    - Delete: remove from local state, show success toast via React Hot Toast; on failure show danger toast
    - Edit: open `Modal` with editable fields; save updates local state; on failure show danger toast
    - _Requirements: 6.3, 6.4, 6.5_
  - [x] 14.3 Add charts using a lightweight charting library (e.g. Recharts)
    - Bar or line chart for appointment trends; pie or donut chart for patient statistics
    - _Requirements: 6.6_
  - [ ]* 14.4 Write property test for patient table search filter correctness
    - **Property 9: Patient table search filter correctness**
    - **Validates: Requirements 6.3**
  - [ ]* 14.5 Write property test for delete removing patient from list
    - **Property 10: Delete removes patient from list**
    - **Validates: Requirements 6.4**
  - [ ]* 14.6 Write property test for quick action navigation correctness
    - **Property 11: Quick action navigation correctness**
    - **Validates: Requirements 6.7**
  - [ ]* 14.7 Write unit tests for AdminDashboard
    - Test stats grid values, table rendering, toast notifications, edit modal open/close
    - _Requirements: 6.1, 6.2, 6.4, 6.5_

- [x] 15. Implement responsive behavior and animations
  - [x] 15.1 Add mobile hamburger menu and slide-out drawer to `Header` and `Sidebar`
    - Toggle drawer open/close; render full nav inside drawer
    - _Requirements: 7.1, 7.2_
  - [x] 15.2 Add Framer Motion hover scale animations to cards and buttons
    - Wrap interactive cards with `motion.div` and `whileHover={{ scale: 1.03 }}`
    - _Requirements: 7.5_
  - [x] 15.3 Implement dark mode detection and toggle
    - On app mount, read `prefers-color-scheme`; apply `dark` class to `<html>`; persist preference in `localStorage`
    - _Requirements: 8.3_
  - [x] 15.4 Add skeleton loading placeholders
    - Create `Skeleton` component (animated pulse); use in React Query loading states for doctor grid, patient table, dashboard stats
    - _Requirements: 7.4_

- [x] 16. Add 404 page and global error boundaries
  - Create `NotFoundPage` with a message and link back to home; register as catch-all route in React Router
  - _Requirements: 7.3_

- [ ] 17. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties (P1–P11 from design)
- Unit tests validate specific examples, edge cases, and error conditions
- All property tests must include the comment tag: `// Feature: hospital-management-system, Property {N}: {property_text}`
- Property tests must run a minimum of 100 iterations each
