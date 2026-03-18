# Hospital Management System - Design

## Overview

The Hospital Management System (HMS) is a single-page application (SPA) built with React 18 + Vite. It serves three user roles — Patient, Doctor, and Admin — each with a dedicated dashboard, alongside public-facing pages (Home, Doctor Directory, Appointment Booking). All data is mocked client-side using static JSON fixtures managed through React Query.

The application follows a component-driven architecture with a shared design system, role-based routing, and a global auth context. Animations are handled by Framer Motion; notifications by React Hot Toast; icons by Lucide React and Heroicons.

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │                  React SPA (Vite)                │   │
│  │                                                  │   │
│  │  ┌────────────┐   ┌──────────────────────────┐  │   │
│  │  │  Auth      │   │   React Router v6        │  │   │
│  │  │  Context   │   │   (Lazy-loaded routes)   │  │   │
│  │  └────────────┘   └──────────────────────────┘  │   │
│  │                                                  │   │
│  │  ┌────────────────────────────────────────────┐  │   │
│  │  │              Pages                         │  │   │
│  │  │  Home | Login | Register | Dashboard       │  │   │
│  │  │  Patients | Doctors | Appointments         │  │   │
│  │  │  Booking | AdminDashboard                  │  │   │
│  │  └────────────────────────────────────────────┘  │   │
│  │                                                  │   │
│  │  ┌────────────────────────────────────────────┐  │   │
│  │  │           Component Library                │  │   │
│  │  │  UI: Button, Input, Card, Table,           │  │   │
│  │  │      Modal, Badge                          │  │   │
│  │  │  Layout: Header, Sidebar, Layout           │  │   │
│  │  │  Dashboard: StatsCard, AppointmentCard     │  │   │
│  │  └────────────────────────────────────────────┘  │   │
│  │                                                  │   │
│  │  ┌────────────────────────────────────────────┐  │   │
│  │  │           Data Layer                       │  │   │
│  │  │  React Query + Mock JSON fixtures          │  │   │
│  │  │  /data: patients.json, doctors.json,       │  │   │
│  │  │         appointments.json                  │  │   │
│  │  └────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Routing Structure

```
/                        → Home (public)
/login                   → Login (public)
/register                → Register (public)
/doctors                 → Doctor Directory (public)
/dashboard               → Patient Dashboard (protected: patient)
/dashboard/appointments  → Patient Appointments (protected: patient)
/dashboard/prescriptions → Patient Prescriptions (protected: patient)
/booking                 → Appointment Booking (protected: patient)
/admin                   → Admin Dashboard (protected: admin)
/admin/patients          → Patient Management (protected: admin)
```

All routes under `/dashboard` and `/admin` are protected by a `ProtectedRoute` component that checks the auth context. Unauthenticated users are redirected to `/login`.

All page-level components are lazy-loaded via `React.lazy` + `Suspense`.

### State Management

- **Auth state**: React Context (`AuthContext`) — stores current user (id, name, email, role), login/logout actions
- **Appointments state**: React Context (`AppointmentsContext`) — stores appointment list, add/cancel actions
- **Server state**: React Query — wraps mock async fetchers for doctors, patients, appointments; provides loading/error states and caching
- **Local UI state**: `useState` / `useReducer` within components (form state, modal open/close, filter values)

---

## Components and Interfaces

### Design System (Tailwind Extension)

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
      success: '#10b981',
      danger:  '#ef4444',
      dark:    '#0f172a',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  }
}
```

All cards/containers use `rounded-xl shadow-lg`. Dark mode is enabled via Tailwind's `darkMode: 'class'` strategy, toggled by detecting `prefers-color-scheme` on mount.

### UI Component Library (`/src/components/ui`)

| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `variant`, `size`, `loading`, `disabled`, `onClick` | Primary/secondary/danger variants, spinner on loading |
| `Input` | `label`, `error`, `type`, `value`, `onChange` | Labeled input with inline error display |
| `Card` | `className`, `children` | `rounded-xl shadow-lg` wrapper |
| `Table` | `columns`, `data`, `onEdit`, `onDelete` | Sortable table with action slots |
| `Modal` | `open`, `onClose`, `title`, `children` | Headless UI Dialog wrapper |
| `Badge` | `variant`, `label` | Status badge (success/danger/warning/default) |

### Layout Components (`/src/components/layout`)

- `Header` — top nav bar with logo, nav links, auth buttons; collapses to hamburger on mobile
- `Sidebar` — vertical nav for dashboard pages; hidden on mobile, replaced by drawer
- `Layout` — wraps pages with Header + optional Sidebar + main content area

### Dashboard Components (`/src/components/dashboard`)

- `StatsCard` — icon + label + value + optional trend indicator
- `AppointmentCard` — compact card showing doctor, date, time, status badge

### Page Components (`/src/pages`)

#### Home
- `HeroSection` — full-width banner with CTA buttons
- `ServicesSection` — 4-card grid of hospital services
- `DoctorsCarousel` — horizontal scroll/carousel of up to 8 doctor cards
- `StatsSection` — animated counters for key metrics
- `Footer` — links, contact info, social icons

#### Auth
- `LoginPage` — email + password + role selector form
- `RegisterPage` — name + email + password + role selector form
- Both use `useForm`-style local state with validation

#### Patient Dashboard
- `PatientDashboard` — layout with sidebar, profile card, appointment table, prescriptions list, Book CTA

#### Doctor Directory
- `DoctorsPage` — search bar + specialty/location filters + doctor card grid + pagination

#### Appointment Booking
- `BookingPage` — multi-step wizard:
  - `Step1DoctorSelect` — doctor list/search
  - `Step2DateTime` — calendar date picker + time slot grid
  - `Step3Summary` — booking details form + summary + submit
  - `SuccessModal` — confirmation modal on successful booking

#### Admin Dashboard
- `AdminDashboard` — stats grid + patients table + charts + quick actions

### Custom Hooks (`/src/hooks`)

- `useAuth()` — consumes `AuthContext`; returns `{ user, login, logout, isAuthenticated }`
- `useAppointments()` — consumes `AppointmentsContext`; returns `{ appointments, addAppointment, cancelAppointment }`

### Utilities (`/src/lib`)

- `cn.ts` — `clsx` + `tailwind-merge` helper for conditional class names
- `utils.ts` — date formatting, slot generation, filter helpers

---

## Data Models

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  avatarUrl?: string;
}
```

### Doctor

```typescript
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  bio: string;
  avatarUrl: string;
  rating: number;
  availableDays: string[]; // e.g. ['Monday', 'Wednesday']
  availableSlots: Record<string, string[]>; // date -> time slots
}
```

### Patient

```typescript
interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  status: 'active' | 'inactive';
  registeredAt: string;
}
```

### Appointment

```typescript
interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;       // ISO date string
  time: string;       // e.g. '10:00 AM'
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}
```

### Prescription

```typescript
interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  medication: string;
  dosage: string;
  issuedAt: string;
}
```

### AuthState

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: User['role']) => Promise<void>;
  logout: () => void;
}
```

### Mock Data Sizes

| Resource | Count |
|----------|-------|
| Patients | 50 |
| Doctors | 20 |
| Appointments | 100 |

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Doctor card renders required fields

*For any* doctor object in the data set, when a doctor card is rendered (in the carousel or directory grid), the rendered output must contain the doctor's name, specialty, and a link or button to book an appointment.

**Validates: Requirements 1.2, 4.1**

---

### Property 2: Role-based redirect after login

*For any* valid user credential with a given role (patient, doctor, admin), submitting the login form must redirect the user to the dashboard route that corresponds to that role, and the auth context must reflect the authenticated user.

**Validates: Requirements 2.3**

---

### Property 3: Form validation blocks invalid submission

*For any* auth form (login or registration) submitted with one or more empty or malformed fields, the system must not authenticate or register the user, and at least one inline validation error must be visible in the rendered output.

**Validates: Requirements 2.4, 5.6**

---

### Property 4: Logout clears auth state

*For any* authenticated user, calling logout must result in the auth context user being null, isAuthenticated being false, and the current route redirecting to the home page.

**Validates: Requirements 2.6**

---

### Property 5: Patient dashboard displays correct user data

*For any* patient user, the rendered dashboard must display a profile card containing that patient's name, contact info, and role; an appointments table where each row contains date, doctor name, status, and action controls; and a prescriptions list where each item contains medication name, dosage, and prescribing doctor name.

**Validates: Requirements 3.2, 3.3, 3.4**

---

### Property 6: Doctor directory filter correctness

*For any* combination of search term, specialty filter, and location filter applied to the doctor directory, every doctor card displayed must satisfy all active filter criteria simultaneously (name or specialty contains the search term, specialty matches the specialty filter, location matches the location filter). No doctor that fails any active filter criterion may appear in the results.

**Validates: Requirements 4.2, 4.3, 4.4**

---

### Property 7: Booking wizard advances only on valid input

*For any* step in the multi-step booking wizard, the wizard must advance to the next step if and only if all required fields for the current step are completed and valid. If any required field is missing or invalid, the step index must remain unchanged and at least one validation error must be visible.

**Validates: Requirements 5.2, 5.3, 5.6**

---

### Property 8: Available time slots match doctor/date availability

*For any* doctor and any selected date, the time slots rendered in Step 2 of the booking flow must be exactly the set of slots listed as available for that doctor on that date in the data source — no more, no fewer.

**Validates: Requirements 5.5**

---

### Property 9: Patient table search filter correctness

*For any* search query entered in the admin patients table, every row displayed must contain the search query string in at least one of the patient's searchable fields (name, email, phone). No patient row that does not match the query may appear.

**Validates: Requirements 6.3**

---

### Property 10: Delete removes patient from list

*For any* patient record in the admin patients table, after the delete action is confirmed, that patient's id must not appear in any row of the subsequently rendered table, and the table length must decrease by exactly one.

**Validates: Requirements 6.4**

---

### Property 11: Quick action navigation correctness

*For any* quick action button in the admin dashboard, clicking it must result in the router navigating to the route that corresponds to that action's labeled management section.

**Validates: Requirements 6.7**

---

## Error Handling

### Authentication Errors

- Invalid credentials on login → display inline error message below the form, do not redirect
- Network/mock failure during login → display a toast notification with a generic error message
- Accessing a protected route while unauthenticated → redirect to `/login` with a `redirect` query param to return after login

### Form Validation Errors

- Empty required fields → show red border on input + error message below the field
- Invalid email format → show inline error "Please enter a valid email address"
- Password too short (< 8 chars) → show inline error on register form
- Booking step with missing selection → show error banner at top of step, disable Next button

### Data / Mock Errors

- React Query fetch failure (simulated) → show an error state component with a retry button
- Empty data sets (no doctors, no appointments) → show empty state components with descriptive messages and CTAs

### Deletion / Mutation Errors

- Failed delete operation → show a danger toast notification; do not remove the row
- Failed edit/save operation → show a danger toast notification; keep the modal open

### 404 / Unknown Routes

- Any unmatched route → render a simple 404 page with a link back to home

---

## Testing Strategy

### Dual Testing Approach

Both unit tests and property-based tests are required. They are complementary:

- **Unit tests** verify specific examples, integration points, edge cases, and error conditions
- **Property tests** verify universal properties across many generated inputs

### Unit Testing

Framework: **Vitest** + **React Testing Library**

Focus areas:
- Rendering of specific page examples (home page sections present, login form fields present, admin stats grid present)
- Navigation flows (CTA click → correct route, logout → home)
- Loading and skeleton states
- Toast notification triggers
- Dark mode class application
- Empty state rendering when filters return no results (edge case for Requirement 4.6)
- Success modal appearance after booking submission

### Property-Based Testing

Framework: **fast-check** (TypeScript-native, works with Vitest)

Configuration: minimum **100 iterations** per property test.

Each property test must be tagged with a comment in the following format:
`// Feature: hospital-management-system, Property {N}: {property_text}`

Each correctness property must be implemented by a **single** property-based test.

| Property | Test Description | Generator Inputs |
|----------|-----------------|-----------------|
| P1: Doctor card fields | Render DoctorCard with arbitrary Doctor, assert name/specialty/book link present | `fc.record({ id, name, specialty, location, ... })` |
| P2: Role-based redirect | For arbitrary role, login and assert redirect route matches role | `fc.constantFrom('patient', 'doctor', 'admin')` |
| P3: Form validation blocks invalid | For arbitrary invalid form state, assert no auth change and error visible | `fc.record` with empty/malformed fields |
| P4: Logout clears auth | For arbitrary authenticated user, logout and assert auth null | `fc.record({ id, name, email, role })` |
| P5: Patient dashboard data | For arbitrary patient + appointments + prescriptions, assert all fields rendered | `fc.array` of appointments/prescriptions |
| P6: Doctor filter correctness | For arbitrary doctor list + filter combo, assert all results satisfy filters | `fc.array(doctor)` + `fc.string()` filter values |
| P7: Booking wizard progression | For arbitrary step state (valid/invalid), assert step advances iff valid | `fc.record` of booking step state |
| P8: Time slot availability | For arbitrary doctor + date, assert rendered slots === available slots | `fc.record` of doctor with availableSlots |
| P9: Patient search filter | For arbitrary patient list + query, assert all rows match query | `fc.array(patient)` + `fc.string()` |
| P10: Delete removes patient | For arbitrary patient list, delete arbitrary patient, assert removed | `fc.array(patient)` + `fc.nat()` index |
| P11: Quick action navigation | For arbitrary quick action, assert click navigates to correct route | `fc.constantFrom(...actionRoutes)` |

### Test File Organization

```
/src
  __tests__/
    unit/
      HomePage.test.tsx
      LoginPage.test.tsx
      AdminDashboard.test.tsx
      BookingFlow.test.tsx
      EmptyState.test.tsx
    property/
      DoctorCard.property.test.tsx
      Auth.property.test.tsx
      PatientDashboard.property.test.tsx
      DoctorFilter.property.test.tsx
      BookingWizard.property.test.tsx
      AdminPatients.property.test.tsx
```
