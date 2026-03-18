# Hospital Management System - Requirements

## Overview

A complete Hospital Management System frontend built with React 18 + Vite, Tailwind CSS, TypeScript, and supporting libraries. The system provides role-based dashboards for patients, doctors, and administrators, along with public-facing pages for browsing doctors and booking appointments.

---

## Requirement 1

**User Story:** As a visitor, I want to view a public home page, so that I can learn about the hospital's services and doctors before registering.

### Acceptance Criteria

1. WHEN a visitor navigates to the home page THEN the system SHALL display a hero section, a services section with 4 cards, a doctors carousel with up to 8 doctor cards, a statistics section, and a footer
2. WHEN a visitor views the doctors carousel THEN the system SHALL display doctor name, specialty, and a link to book an appointment
3. WHEN a visitor views the services section THEN the system SHALL display 4 service cards with icons and descriptions
4. WHEN the page loads THEN the system SHALL animate sections with fade-in transitions

---

## Requirement 2

**User Story:** As a user, I want to register and log in with a role, so that I can access role-appropriate features of the system.

### Acceptance Criteria

1. WHEN a user visits the login page THEN the system SHALL display a login form with email, password fields, and a role selector (Patient / Doctor / Admin)
2. WHEN a user visits the register page THEN the system SHALL display a registration form with name, email, password fields, and a role selector
3. WHEN a user submits a login form with valid credentials THEN the system SHALL authenticate the user and redirect to the appropriate dashboard
4. WHEN a user submits a form with invalid or missing fields THEN the system SHALL display inline validation errors and prevent submission
5. WHEN a form is being submitted THEN the system SHALL display a loading state on the submit button
6. WHEN a user logs out THEN the system SHALL clear the auth state and redirect to the home page

---

## Requirement 3

**User Story:** As a patient, I want a personal dashboard, so that I can view my appointments, prescriptions, and profile information.

### Acceptance Criteria

1. WHEN a patient logs in THEN the system SHALL display a sidebar navigation with links to profile, appointments, prescriptions, and booking
2. WHEN a patient views their dashboard THEN the system SHALL display a profile card with their name, contact info, and role
3. WH
EN a patient views their appointments THEN the system SHALL display a table of upcoming and past appointments with date, doctor, status, and actions
4. WHEN a patient views their prescriptions THEN the system SHALL display a list of prescriptions with medication name, dosage, and prescribing doctor
5. WHEN a patient clicks the Book Appointment CTA THEN the system SHALL navigate to the appointment booking flow

---

## Requirement 4

**User Story:** As a visitor or patient, I want to browse and search the doctor directory, so that I can find a suitable doctor for my needs.

### Acceptance Criteria

1. WHEN a user visits the doctor directory THEN the system SHALL display a grid of doctor cards with name, specialty, location, and a book button
2. WHEN a user enters a search term THEN the system SHALL filter the displayed doctors to those whose name or specialty matches the search term
3. WHEN a user selects a specialty filter THEN the system SHALL display only doctors matching that specialty
4. WHEN a user selects a location filter THEN the system SHALL display only doctors matching that location
5. WHEN there are more doctors than fit on one page THEN the system SHALL display pagination controls
6. WHEN no doctors match the current filters THEN the system SHALL display an empty state message

---

## Requirement 5

**User Story:** As a patient, I want to book an appointment through a multi-step flow, so that I can schedule a visit with a doctor at a convenient time.

### Acceptance Criteria

1. WHEN a patient starts the booking flow THEN the system SHALL display Step 1 for selecting a doctor
2. WHEN a patient completes Step 1 THEN the system SHALL advance to Step 2 for selecting a date and available time slot
3. WHEN a patient completes Step 2 THEN the system SHALL advance to Step 3 showing a summary of the booking details and a form for additional information
4. WHEN a patient submits the booking in Step 3 THEN the system SHALL display a success modal confirming the appointment
5. WHEN a patient selects a date THEN the system SHALL display only available time slots for that date and doctor
6. WHEN a patient attempts to proceed without completing required fields THEN the system SHALL prevent advancement and display validation errors

---

## Requirement 6

**User Story:** As an administrator, I want a management dashboard, so that I can monitor system statistics and manage patients.

### Acceptance Criteria

1. WHEN an admin logs in THEN the system SHALL display a stats grid showing total patients, doctors, appointments, and revenue
2. WHEN an admin views the patients table THEN the system SHALL display a searchable, filterable list of all patients with name, email, phone, and status
3. WHEN an admin searches the patients table THEN the system SHALL filter rows in real time to match the search query
4. WHEN an admin clicks delete on a patient record THEN the system SHALL remove the patient from the table and show a toast notification
5. WHEN an admin clicks edit on a patient record THEN the system SHALL open a modal or inline form to edit the patient's details
6. WHEN an admin views the dashboard THEN the system SHALL display charts visualizing appointment trends or patient statistics
7. WHEN an admin uses quick action buttons THEN the system SHALL navigate to the relevant management section

---

## Requirement 7

**User Story:** As any user, I want the application to be responsive and accessible, so that I can use it on any device.

### Acceptance Criteria

1. WHEN a user accesses the application on a mobile device THEN the system SHALL display a hamburger menu replacing the desktop sidebar/nav
2. WHEN a user opens the hamburger menu THEN the system SHALL display the full navigation in a slide-out or overlay panel
3. WHEN the application loads THEN the system SHALL use lazy-loaded routes to minimize initial bundle size
4. WHEN content is loading THEN the system SHALL display skeleton loading placeholders instead of blank areas
5. WHEN a user interacts with cards or buttons THEN the system SHALL apply hover scale animations for visual feedback

---

## Requirement 8

**User Story:** As a developer, I want a consistent design system and component library, so that the UI is cohesive and maintainable.

### Acceptance Criteria

1. WHEN any UI element is rendered THEN the system SHALL use the defined color palette (primary: #3b82f6, success: #10b981, danger: #ef4444, dark: #0f172a)
2. WHEN any card or container is rendered THEN the system SHALL apply rounded-xl and shadow-lg styling
3. WHEN the user's OS is set to dark mode THEN the system SHALL render the application in dark mode
4. WHEN reusable components are used THEN the system SHALL source them from /src/components/ui (Button, Input, Card, Table, Modal, Badge)
5. WHEN toast notifications are triggered THEN the system SHALL display them using React Hot Toast
