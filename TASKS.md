# Medicina – Healthcare Web Platform

## Project Overview
Build a comprehensive healthcare platform to connect patients, clinics, doctors, and labs in Jordan. The system will simplify appointment booking, medical record access, and communication between different stakeholders.

---

## Requirements Analysis

### User Types & Permissions

**Patient**
- Auth (CRUD)✅
- Book, reschedule, cancel appointments (CRUD)
- View doctors and clinics✅
- Read-only access to medical history & past appointments
- Notifications (appointments, updates, reminders)
- Search & filter clinics/doctors by:
  - Area
  - Supported insurance company

**Clinic**
- Auth (CRUD)✅
- Assign doctors to clinic✅
- Manage doctor schedules (CRUD)
- Manage appointments (CRUD)
- Read clinic-related patient logs and profiles
- Manage collaborated insurance companies (CRUD)
- Dashboard includes:
  - Number of doctors
  - Number of patients
  - Attendance/No-show statistics
  - Blacklisted patients

**Doctor**
- Auth (CRUD)✅
- Access clinic appointments
- Create/Read patient medical records
- Update past medical records with version control
  - New record created per update using same `appointment_id`
  - View full version history of patient visits

**Lab**
- Create entries in patient medical history (lab results, reports)

---

## Database Structure

**Users Table**
- id (primary key)
- name
- email (unique)
- password
- role (enum: patient, doctor, clinic, lab, admin)
- timestamps

**Appointments Table**
- id (primary key)
- patient_id (foreign key to users)
- doctor_id (foreign key to users)
- clinic_id (foreign key to users)
- appointment_date/time
- status (enum: booked, canceled, completed)
- timestamps

**Medical Records Table**
- id (primary key)
- appointment_id (foreign key to appointments)
- doctor_id
- patient_id
- diagnosis / prescription
- versioning (track updates)
- timestamps

**Clinics Table**
- id (primary key)
- name
- area
- supported_insurances (JSON/relations)
- timestamps

**Labs Table**
- id (primary key)
- name
- linked_patients (foreign keys)
- uploaded_results (file path / text)
- timestamps

---

## Relationships
- Patient has many Appointments (one-to-many)
- Doctor has many Appointments (one-to-many)
- Clinic has many Doctors (one-to-many)
- Appointment belongs to Patient, Doctor, and Clinic
- Patient has many Medical Records through Appointments
- Lab adds records linked to Patients

---

## Implementation Steps

**Phase 1: Project Setup**
- Create Laravel backend project & React frontend
- Configure PostgreSQL database
- Set up authentication system

**Phase 2: Database Design**
- Create Users, Appointments, Clinics, Doctors, Labs tables
- Implement foreign keys and versioning support

**Phase 3: Models & Relationships**
- Define relationships in Laravel models (User, Appointment, Clinic, MedicalRecord, Lab)
- Implement role-based access checks

**Phase 4: Authorization & Middleware**
- Create role-based middleware (Patient, Clinic, Doctor, Lab, Admin)
- Protect routes by role
- Validate ownership of appointments and medical records

**Phase 5: Controllers**
- PatientController: Appointment booking & history
- ClinicController: Manage schedules, doctors, and dashboards
- DoctorController: Manage medical records and prescriptions
- LabController: Upload lab results
- AdminController: Manage users and system-wide reports

**Phase 6: Routes Structure**

**Public Routes:**
- GET `/` (homepage – list clinics/doctors)
- Auth routes (login, register)

**Patient Routes:**
- GET `/dashboard`
- CRUD `/appointments`
- View `/medical-history`

**Clinic Routes:**
- GET `/clinic/dashboard`
- CRUD `/clinic/doctors`
- CRUD `/clinic/appointments`

**Doctor Routes:**
- GET `/doctor/dashboard`
- CRUD `/doctor/records`

**Lab Routes:**
- POST `/lab/results` (upload test results)

**Admin Routes:**
- GET `/admin/dashboard`
- Manage all users & insurance companies

---

## Features Implementation

**Appointments Management**
- Booking, cancellation with rules
- Notifications for reminders

**Medical Records**
- Version control (track edits per appointment)
- Prescription support
- Upload patient documents

**Clinic Dashboard**
- Statistics: patient visits, no-show rate, doctor availability
- Manage blacklist

**Lab Features**
- Upload PDF/image lab reports
- Notifications when results are uploaded

---

## Validation Rules

**Appointments**
- Date/time required, must not overlap
- Patient, doctor, clinic must exist

**Medical Records**
- Must be linked to valid appointment_id
- Diagnosis text required

**Users**
- Name: required
- Email: unique, valid format
- Password: min 8 characters
- Role: required, must be one of [patient, doctor, clinic, lab, admin]

---

## Security Considerations
- Passwords hashed (Laravel built-in hashing)
- Input validation to prevent XSS
- CSRF protection on all forms
- Ownership validation before accessing medical data
- Audit logs for sensitive actions

---

## Testing Scenarios

**Role Testing**
- Patient cannot access clinic/doctor dashboards
- Doctor cannot access unrelated patients
- Clinic cannot access non-related patients
- Admin has full access

**CRUD Testing**
- Patients can create, cancel, and view appointments
- Clinics can manage schedules
- Doctors can add/update medical records
- Labs can upload results

**Data Integrity Testing**
- Foreign key constraints enforced
- Versioning system stores updates without overwriting

---

## Additional Suggested Requirements

### General
- Role-based Access Control (RBAC) across all user types
- Audit logs for important actions (add, update, delete)
- Extended notifications for clinics, doctors, labs (not just patients)
- Advanced search (appointments & medical records)

### Patient
- Cancel appointments with specific rules (time limits)
- Rate/review doctors & clinics
- Upload medical documents (lab reports, x-rays)

### Clinic
- Reports & statistics (requested specialties, no-show rates)
- Manage blacklist (block/unblock patients)
- Staff management (receptionists, assistants)

### Doctor
- Add prescriptions (linked to medical records)
- Referral system (to other doctors or labs)

### Lab
- Update/correct test results with version history
- Receive notifications for new test requests
- Attach PDF/images for results

### System Admin
- CRUD on all roles (patients, doctors, clinics, labs)
- Approve/reject registrations (especially clinics, doctors, labs)
- Monitor users, appointments, reports via dashboard
- Manage insurance companies globally
