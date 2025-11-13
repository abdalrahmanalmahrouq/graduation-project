# Medicina Healthcare System - Complete A-Z Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Database Design](#database-design)
4. [Authentication & Authorization](#authentication--authorization)
5. [User Registration & Login](#user-registration--login)
6. [Complete Workflows](#complete-workflows)
7. [API Endpoints Reference](#api-endpoints-reference)
8. [Frontend Structure](#frontend-structure)
9. [Key Features by Role](#key-features-by-role)
10. [User Journeys](#user-journeys)

---

## System Overview

**Medicina** is a comprehensive healthcare management platform designed to connect patients, doctors, clinics, labs, and administrators in Jordan. The system facilitates appointment booking, medical record management, lab result sharing, and insurance integration.

### Core Purpose
- **Connect** patients with healthcare providers
- **Streamline** appointment booking and management
- **Manage** medical records with version control
- **Share** lab results securely
- **Integrate** insurance companies
- **Support** multi-clinic doctor workflows

### Technology Stack
- **Backend**: Laravel 10 (PHP 8.1+)
- **Frontend**: React 19 with Tailwind CSS & Bootstrap 5
- **Database**: MySQL 8.0
- **Authentication**: Laravel Sanctum (Token-based API)
- **Deployment**: Docker Compose (4 services)
- **Email**: Optional Mailtrap integration

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Medicina System                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐                     │
│  │   Frontend   │◄────►│   Backend    │                     │
│  │   (React)    │ HTTP │  (Laravel)   │                     │
│  │  Port: 3000  │      │  Port: 8000  │                     │
│  └──────────────┘      └──────┬───────┘                     │
│                               │                              │
│                        ┌──────▼───────┐                      │
│                        │   MySQL DB   │                      │
│                        │  Port: 3306  │                      │
│                        └──────────────┘                      │
│                                                               │
│  ┌──────────────┐                                            │
│  │ phpMyAdmin   │                                            │
│  │  Port: 8080  │                                            │
│  └──────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
```

### Docker Services
1. **MySQL Database** - Stores all application data
2. **Backend (Laravel)** - RESTful API server
3. **Frontend (React)** - User interface
4. **phpMyAdmin** - Database management tool

### Request Flow
```
User → React Frontend → Axios → Laravel API → MySQL Database
                                    ↓
                              Laravel Sanctum (Auth)
                                    ↓
                              Role Middleware
                                    ↓
                              Controller → Model → Response
```

---

## Database Design

### Core Tables

#### 1. **users** (Central Authentication Table)
- **Purpose**: Single table for all user types
- **Key Fields**:
  - `id` (7-char unique string)
  - `email` (unique per role)
  - `password` (hashed)
  - `role` (enum: patient, doctor, clinic, lab, admin)
  - `profile_image` (file path)
  - `soft_deletes` (enabled)

#### 2. **patients** (Patient Profile)
- **Relationships**: `belongsTo User`
- **Key Fields**: full_name, phone_number, date_of_birth, address, insurance_id

#### 3. **doctors** (Doctor Profile)
- **Relationships**: `belongsTo User`, `belongsToMany Clinics`
- **Key Fields**: full_name, specialization, phone_number, bio, consultation_duration

#### 4. **clinics** (Clinic Profile)
- **Relationships**: `belongsTo User`, `belongsToMany Doctors`, `belongsToMany Insurances`
- **Key Fields**: clinic_name, address, phone_number

#### 5. **labs** (Lab Profile)
- **Relationships**: `belongsTo User`
- **Key Fields**: lab_name, address, phone_number

#### 6. **appointments** (Appointment Management)
- **Relationships**: `belongsTo Patient`, `belongsTo Doctor`, `belongsTo Clinic`
- **Key Fields**:
  - `appointment_date`, `starting_time`, `ending_time`
  - `status` (enum: available, booked, completed, cancelled, no_show)
  - `patient_id` (nullable - null when available)

#### 7. **medical_records** (Medical Consultations)
- **Relationships**: `belongsTo Appointment`, `belongsTo Doctor`, `belongsTo Patient`, `belongsTo LabResult`
- **Key Fields**: consultation, prescription, lab_result_id

#### 8. **lab_results** (Lab Test Results)
- **Relationships**: `belongsTo Lab`, `belongsTo Patient`, `belongsTo Appointment`
- **Key Fields**:
  - `status` (enum: pending, approved, rejected)
  - `examination_title`, `notes`, `file_path`
  - `approved_at`, `rejected_at`

#### 9. **insurances** (Insurance Companies)
- **Key Fields**: insurance_id (7-char unique), name
- **Relationships**: `belongsToMany Clinics`, `hasMany Patients`

#### 10. **clinic_doctor** (Pivot Table)
- **Purpose**: Many-to-many relationship between clinics and doctors
- **Key Fields**: clinic_id, doctor_id, weekly_schedule (JSON), soft_deletes

#### 11. **insurances_clinics** (Pivot Table)
- **Purpose**: Many-to-many relationship between clinics and insurance companies
- **Key Fields**: insurance_id, clinic_id, soft_deletes

### Key Relationships

```
User (1) ──< (1) Patient
User (1) ──< (1) Doctor ──< (M) clinic_doctor (M) ──> (1) Clinic
User (1) ──< (1) Clinic ──< (M) insurances_clinics (M) ──> (1) Insurance
User (1) ──< (1) Lab

Appointment (M) ──> (1) Patient
Appointment (M) ──> (1) Doctor
Appointment (M) ──> (1) Clinic
Appointment (1) ──< (1) MedicalRecord
MedicalRecord (1) ──> (0..1) LabResult
LabResult (M) ──> (1) Patient
LabResult (M) ──> (1) Lab
```

---

## Authentication & Authorization

### Authentication System

#### **Laravel Sanctum (Token-based)**
- **Token Duration**: 480 minutes (8 hours)
- **Token Storage**: `personal_access_tokens` table
- **Token Format**: Plain text token returned on login/register

#### **Authentication Flow**
```
1. User submits credentials (email, password, role)
2. Backend validates credentials
3. If valid, creates Sanctum token
4. Token returned to frontend
5. Frontend stores token in localStorage/state
6. Token sent in Authorization header for subsequent requests
```

### Authorization System

#### **Role-Based Access Control (RBAC)**
- **Middleware**: `Role` middleware checks user role
- **Route Protection**: Routes protected by `role:patient`, `role:doctor`, etc.
- **Policy System**: Additional authorization via Laravel Policies (e.g., LabResultPolicy)

#### **Role Middleware Flow**
```
Request → auth:sanctum → Role Middleware → Controller
           ↓                    ↓
    Check if authenticated  Check if role matches
           ↓                    ↓
    Return 401 if not    Return 403 if role mismatch
```

### Admin Authentication
- **Separate Guard**: Uses `auth:admin` guard
- **Access**: Via `localhost:8000/admin` (web routes, not API)
- **Session-based**: Uses Laravel's session authentication
- **Routes**: Defined in `routes/admin.php`

---

## User Registration & Login

### Registration Flow (All Roles)

#### **Step-by-Step Process**

1. **User Fills Registration Form**
   - Role-specific fields (patient, doctor, clinic, lab)
   - Email, password, password confirmation
   - Profile information

2. **Backend Validation**
   - Email uniqueness check (per role)
   - Password strength (min 6 characters)
   - Role-specific field validation
   - Soft-deleted user restoration check

3. **User Creation**
   ```php
   User::create([
       'email' => $email,
       'password' => Hash::make($password),
       'role' => $role
   ]);
   ```

4. **Profile Creation**
   - Patient → Creates `Patient` record
   - Doctor → Creates `Doctor` record
   - Clinic → Creates `Clinic` record
   - Lab → Creates `Lab` record

5. **Email Verification** (Optional)
   - Sends verification email if configured
   - Falls back gracefully if email not configured

6. **Token Generation**
   ```php
   $token = $user->createToken('auth_token', ['*'], now()->addMinutes(480));
   ```

7. **Response**
   - Returns access_token, user data, role
   - Frontend stores token and redirects

### Login Flow

#### **Step-by-Step Process**

1. **User Submits Credentials**
   - Email, password, role

2. **Backend Validation**
   - Checks if user exists with email
   - Checks if user exists with email + role combination
   - Validates password

3. **Role Verification**
   - If email exists but wrong role → Returns available roles in Arabic
   - Example: "يجب تسجيل الدخول من صفحة الطبيب"

4. **Token Generation**
   - Creates new Sanctum token
   - Returns token + user data

5. **Frontend Handling**
   - Stores token
   - Redirects to role-specific dashboard

### Soft Delete & Restoration
- **Feature**: Users can be soft-deleted (deleted_at timestamp)
- **Restoration**: If registering with soft-deleted email, account is restored
- **Use Case**: Allows account recovery without data loss

---

## Complete Workflows

### Workflow 1: Appointment Booking (Patient Journey)

#### **Step 1: Patient Browses Clinics**
- **Route**: `/clinics`
- **API**: `GET /api/doctors/by-specialization/{specialization}`
- **Features**:
  - Filter by specialization (Pediatrics, Cardiology, etc.)
  - Filter by insurance company
  - View doctor profiles

#### **Step 2: Patient Views Doctor Profile**
- **Route**: `/doctor/profile/:id`
- **API**: `GET /api/doctors/profile/{id}`
- **Returns**:
  - Doctor information (name, specialization, bio)
  - Associated clinics
  - Insurance companies accepted by each clinic

#### **Step 3: Patient Selects Clinic & Views Schedule**
- **Route**: `/doctor/appointment/schedule/:id?clinic={clinicId}`
- **API**: `GET /api/appointments/available/{doctor_id}/{clinic_id}`
- **Returns**: Available appointment slots (status='available', patient_id=null)

#### **Step 4: Patient Books Appointment**
- **Frontend**: Patient clicks on available slot
- **API**: `PUT /api/appointments/{appointment_id}`
- **Backend Action**:
  ```php
  $appointment->patient_id = auth()->id();
  $appointment->status = 'booked';
  $appointment->save();
  ```

#### **Step 5: Appointment Confirmed**
- **Status**: Changes from 'available' to 'booked'
- **Patient View**: Appears in "Upcoming Appointments"
- **Doctor View**: Appears in "Booked Appointments" for that clinic

---

### Workflow 2: Medical Record Creation (Doctor Journey)

#### **Step 1: Doctor Views Booked Appointments**
- **Route**: `/doctor/clinics/:clinicId/appointments`
- **API**: `GET /api/appointments/booked/{doctor_id}/{clinic_id}`
- **Returns**: All booked appointments with patient information

#### **Step 2: Appointment Completed**
- **Action**: Doctor clicks "Finish Appointment"
- **API**: `PUT /api/appointments/finish/{appointment_id}`
- **Backend Action**:
  ```php
  $appointment->status = 'completed';
  $appointment->save();
  ```

#### **Step 3: Doctor Creates Medical Record**
- **Route**: `/doctor/appointments/:appointmentId/medical-record`
- **API**: `GET /api/appointment/{appointment_id}/medical-record/create`
- **Returns**:
  - Appointment details
  - Patient information
  - Associated approved lab results (if any)

#### **Step 4: Doctor Fills Medical Record Form**
- **Fields**:
  - Consultation notes (required)
  - Prescription (optional)
  - Associated lab result (optional - dropdown of approved lab results)

#### **Step 5: Medical Record Saved**
- **API**: `POST /api/appointment/{appointment_id}/medical-record`
- **Backend Action**:
  ```php
  MedicalRecord::create([
      'appointment_id' => $appointment_id,
      'doctor_id' => auth()->id(),
      'patient_id' => $appointment->patient_id,
      'consultation' => $request->consultation,
      'prescription' => $request->prescription,
      'lab_result_id' => $request->lab_result_id
  ]);
  ```

#### **Step 6: Patient Views Medical Record**
- **Route**: `/patient/medical-records`
- **API**: `GET /api/patients/medical-records`
- **Returns**: All medical records with:
  - Appointment details
  - Doctor information
  - Clinic information
  - Associated lab results (if any)

---

### Workflow 3: Lab Results (Lab & Patient Journey)

#### **Step 1: Lab Creates Request**
- **Route**: `/lab/results`
- **API**: `POST /api/lab-results/request`
- **Payload**:
  ```json
  {
    "patient_id": "patient_user_id"
  }
  ```
- **Backend Action**:
  ```php
  LabResult::create([
      'lab_id' => auth()->id(),
      'patient_id' => $request->patient_id,
      'status' => 'pending'
  ]);
  ```

#### **Step 2: Patient Receives Notification**
- **Route**: `/patient/notifications`
- **API**: `GET /api/lab-results/notifications`
- **Returns**: All pending lab result requests

#### **Step 3: Patient Approves/Rejects**
- **Action**: Patient clicks approve/reject
- **API**: `PATCH /api/lab-results/{labResult}/respond`
- **Payload**:
  ```json
  {
    "decision": "approved" // or "rejected"
  }
  ```
- **Backend Action**:
  ```php
  $labResult->status = $decision;
  if ($decision === 'approved') {
      $labResult->approved_at = now();
  } else {
      $labResult->rejected_at = now();
  }
  $labResult->save();
  ```

#### **Step 4: Lab Uploads Results** (Only if approved)
- **API**: `POST /api/lab-results/{labResult}/upload`
- **Payload** (multipart/form-data):
  - `examination_title`: String
  - `notes`: Text
  - `file`: PDF/image file
  - `appointment_id`: Optional (links to appointment)
- **Backend Action**:
  ```php
  $path = $request->file('file')->store('lab-results', 'public');
  $labResult->update([
      'examination_title' => $request->examination_title,
      'notes' => $request->notes,
      'file_path' => $path,
      'appointment_id' => $request->appointment_id
  ]);
  ```

#### **Step 5: Patient Views Lab Results**
- **Route**: `/patient/lab-results`
- **API**: `GET /api/patients/lab-results`
- **Returns**: All approved lab results with file download links

#### **Step 6: Doctor Links Lab Result to Medical Record**
- When creating medical record, doctor can select from approved lab results
- Lab result becomes associated with medical record

---

### Workflow 4: Clinic Management

#### **Adding Doctor to Clinic**
1. **Clinic Searches/Adds Doctor**
   - **Route**: `/manage/doctors`
   - **API**: `POST /api/clinics/add-doctor`
   - **Payload**: `{ "doctor_id": "doctor_user_id" }`

2. **Backend Processing**
   ```php
   $clinic->doctors()->attach($doctor_id, [
       'weekly_schedule' => json_encode([...]),
       'created_at' => now(),
       'updated_at' => now()
   ]);
   ```

3. **Soft Delete Support**
   - If doctor was previously removed (soft-deleted), relationship is restored
   - Otherwise, new relationship created

#### **Managing Insurance Companies**
1. **View Clinic Insurances**
   - **Route**: `/clinic/insurances`
   - **API**: `GET /api/clinic/get-insurances`
   - Returns only non-soft-deleted insurances

2. **Add Insurance**
   - **API**: `POST /api/clinic/add-insurances`
   - **Payload**: `{ "insurance_id": "insurance_id" }`
   - Supports restoration if previously soft-deleted

3. **Remove Insurance**
   - **API**: `DELETE /api/clinic/delete-insurances`
   - **Payload**: `{ "insurance_id": "insurance_id" }`
   - Soft deletes the relationship

#### **Clinic Dashboard**
- **Route**: `/clinic/dashboard`
- **API**: `GET /api/clinic/dashboard`
- **Statistics**:
  - Number of doctors
  - Number of patients
  - Number of appointments
  - Number of insurance companies
- **Additional APIs**:
  - `GET /api/clinic/get-five-insurances-companies`
  - `GET /api/clinic/get-five-patients`

---

## API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/register/patient` | Register as patient | No |
| POST | `/api/register/doctor` | Register as doctor | No |
| POST | `/api/register/clinic` | Register as clinic | No |
| POST | `/api/register/lab` | Register as lab | No |
| POST | `/api/login` | Login (all roles) | No |
| POST | `/api/logout` | Logout | Yes |
| POST | `/api/delete-account` | Soft delete account | Yes |
| GET | `/api/profile` | Get user profile | Yes |
| POST | `/api/profile` | Update profile | Yes |
| POST | `/api/change-password` | Change password | Yes |

### Appointment Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/appointments/create` | Create available slot | No | Clinic/Doctor |
| GET | `/api/appointments/available/{doctor_id}/{clinic_id}` | Get available slots | No | - |
| GET | `/api/appointments/booked/{doctor_id}/{clinic_id}` | Get booked appointments | Yes | Doctor |
| GET | `/api/appointments/completed/{doctor_id}/{clinic_id}` | Get completed appointments | Yes | Doctor |
| GET | `/api/appointments/cancelled/{doctor_id}/{clinic_id}` | Get cancelled appointments | Yes | Doctor |
| PUT | `/api/appointments/{appointment_id}` | Book/Update appointment | No | Patient |
| PUT | `/api/appointments/finish/{appointment_id}` | Mark as completed | Yes | Doctor |
| DELETE | `/api/appointments/{appointment_id}` | Delete available slot | No | - |
| DELETE | `/api/appointments/booked/{appointment_id}` | Cancel booked appointment | No | - |
| GET | `/api/appointments/all-appointments/{clinic_id}` | Get all clinic appointments | No | - |

### Medical Record Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/appointment/{appointment_id}/medical-record/create` | Get form data | Yes | Doctor |
| POST | `/api/appointment/{appointment_id}/medical-record` | Create medical record | Yes | Doctor |
| GET | `/api/medical-records` | Get doctor's medical records | Yes | Doctor |
| GET | `/api/medical-records/{record_id}` | Get specific record | Yes | Doctor |
| GET | `/api/patients/medical-records` | Get patient's records | Yes | Patient |

### Lab Result Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/lab-results/notifications` | Get pending requests | Yes | Patient |
| PATCH | `/api/lab-results/{labResult}/respond` | Approve/reject request | Yes | Patient |
| GET | `/api/lab-results/requests` | Get lab requests | Yes | Lab |
| POST | `/api/lab-results/request` | Create request | Yes | Lab |
| POST | `/api/lab-results/{labResult}/upload` | Upload results | Yes | Lab |
| GET | `/api/patients/lab-results` | Get patient lab results | Yes | Patient |

### Doctor Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/doctors/by-specialization/{specialization}` | Get doctors by specialty | No | - |
| GET | `/api/doctors/profile/{id}` | Get doctor profile | No | - |
| GET | `/api/doctors/get-clinics` | Get doctor's clinics | Yes | Doctor |
| POST | `/api/doctors/add-bio` | Add bio | Yes | Doctor |
| GET | `/api/doctors/get-bio` | Get bio | Yes | Doctor |
| POST | `/api/doctors/update-bio` | Update bio | Yes | Doctor |
| GET | `/api/doctors/get-all-patients-appointments-with-medical-record` | Get all appointments | Yes | Doctor |

### Clinic Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/clinics/add-doctor` | Add doctor to clinic | Yes | Clinic |
| GET | `/api/clinics/get-doctors` | Get clinic doctors | Yes | Clinic |
| DELETE | `/api/clinics/delete-doctor-from-clinic` | Remove doctor | Yes | Clinic |
| GET | `/api/clinic/dashboard` | Get dashboard stats | Yes | Clinic |
| GET | `/api/clinic/get-five-insurances-companies` | Get top 5 insurances | Yes | Clinic |
| GET | `/api/clinic/get-five-patients` | Get top 5 patients | Yes | Clinic |

### Insurance Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/insurances` | Get all insurances | No | - |
| GET | `/api/clinic/get-insurances` | Get clinic insurances | Yes | Clinic |
| POST | `/api/clinic/add-insurances` | Add insurance | Yes | Clinic |
| DELETE | `/api/clinic/delete-insurances` | Remove insurance | Yes | Clinic |
| POST | `/api/clinic/restore-insurances` | Restore insurance | Yes | Clinic |

### Patient Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/patients/by-user-id/{user_id}` | Get patient data | Yes | - |
| GET | `/api/patients/lab-results` | Get lab results | Yes | Patient |
| GET | `/api/patients/medical-records` | Get medical records | Yes | Patient |

### Admin Endpoints (Web Routes)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/login` | Admin login page | No |
| POST | `/admin/login` | Admin login | No |
| POST | `/admin/logout` | Admin logout | Yes (admin) |
| GET | `/admin/dashboard` | Admin dashboard | Yes (admin) |
| GET | `/admin/insurances` | List insurances | Yes (admin) |
| GET | `/admin/insurances/create` | Create insurance form | Yes (admin) |
| POST | `/admin/insurances/store` | Store insurance | Yes (admin) |
| GET | `/admin/insurances/{id}/edit` | Edit insurance form | Yes (admin) |
| PUT | `/admin/insurances/{id}` | Update insurance | Yes (admin) |
| DELETE | `/admin/insurances/{id}` | Delete insurance | Yes (admin) |
| GET | `/admin/users` | List all users | Yes (admin) |
| DELETE | `/admin/users/{id}` | Delete user | Yes (admin) |

---

## Frontend Structure

### Routing Architecture

#### **Public Routes**
- `/` - Homepage
- `/about` - About page
- `/contact` - Contact page
- `/clinics` - Browse clinics (guest + patient)
- `/clinics/:directory` - Specialization directory
- `/doctor/profile/:id` - Doctor profile (public)
- `/doctor/appointment/schedule/:id` - Appointment booking

#### **Authentication Routes**
- `/login/patient` - Patient login
- `/register/patient` - Patient registration
- `/login/doctor` - Doctor login
- `/register/doctor` - Doctor registration
- `/login/clinic` - Clinic login
- `/register/clinic` - Clinic registration
- `/login/lab` - Lab login
- `/register/lab` - Lab registration
- `/forgot-password` - Password reset request
- `/reset-password/:token` - Password reset form

#### **Protected Routes by Role**

**Patient Routes:**
- `/patient/upcoming-appointments` - Upcoming appointments
- `/patient/past-appointments` - Past appointments
- `/patient/medical-records` - Medical records
- `/patient/lab-results` - Lab results
- `/patient/notifications` - Lab result notifications
- `/:role/account` - Account settings
- `/:role/change-password` - Change password

**Doctor Routes:**
- `/doctor/clinics` - Associated clinics
- `/doctor/clinics/:clinicId/appointments` - Clinic appointments
- `/doctor/appointments/:appointmentId/medical-record` - Create medical record
- `/doctor/all-appointments` - All appointments across clinics
- `/doctor/bio` - Bio management
- `/:role/account` - Account settings

**Clinic Routes:**
- `/manage/doctors` - Manage doctors
- `/manage/doctor/:doctorId/:clinicId` - Doctor management (schedules)
- `/clinic/appointments` - All clinic appointments
- `/clinic/insurances` - Insurance management
- `/clinic/dashboard` - Dashboard with statistics
- `/:role/account` - Account settings

**Lab Routes:**
- `/lab/results` - Lab result requests
- `/:role/account` - Account settings

### Component Structure

```
src/
├── components/
│   ├── About/              # About page components
│   ├── AuthLayout.jsx      # Authentication layout
│   ├── ChangePassword/     # Password change
│   ├── ClinicAppointments/ # Clinic appointment management
│   ├── ClinicInsuranceManagement/ # Insurance CRUD
│   ├── Clinics/            # Clinic browsing components
│   ├── Dashboard/          # Clinic dashboard
│   ├── DoctorAllAppointments/ # Doctor's all appointments
│   ├── DoctorAppointments/ # Doctor clinic appointments
│   ├── DoctorBio/          # Doctor bio management
│   ├── DoctorClinics/      # Doctor's associated clinics
│   ├── DoctorManagement/   # Clinic managing doctors
│   ├── LabResultRequest/   # Lab result management
│   ├── Loading.jsx        # Loading spinner
│   ├── Login/              # Login components (all roles)
│   ├── MedicalRecord/      # Medical record creation
│   ├── Notifications/      # Patient notifications
│   ├── PatientData/        # Patient data view
│   ├── PatientLabResults/  # Patient lab results view
│   ├── PatientMedicalRecord/ # Patient medical records
│   ├── ProtectedRoute.jsx  # Route protection wrapper
│   ├── Register/           # Registration components (all roles)
│   ├── RoleAccountRoute.jsx # Role-based account route
│   ├── SideBar.jsx          # Sidebar navigation
│   ├── ToolBar.jsx          # Top toolbar
│   ├── TopBanner/          # Homepage banner
│   ├── TopNavigation/      # Navigation bar
│   └── UserAccount/        # Account management
├── pages/                   # Page components
├── router/                  # Routing configuration
├── config/                  # Configuration files
└── assets/                  # Static assets
```

### Protected Route Implementation

```jsx
<ProtectedRoute allowedRoles={["patient"]}>
  <UpComingAppointmentPage />
</ProtectedRoute>
```

**Logic:**
1. Checks if user is authenticated (token exists)
2. Checks if user role matches allowed roles
3. Redirects to `/unauthorized` if access denied
4. Renders component if authorized

---

## Key Features by Role

### Patient Features

#### **Appointment Management**
- Browse clinics by specialization
- Filter by insurance company
- View doctor profiles with clinic associations
- Book available appointments
- View upcoming appointments
- View past appointments
- Cancel appointments (if allowed)

#### **Medical Records**
- View all medical records
- See associated lab results
- View consultation notes
- View prescriptions
- See doctor and clinic information

#### **Lab Results**
- Receive lab result requests (notifications)
- Approve/reject lab result requests
- View approved lab results
- Download lab result files (PDF/images)

#### **Profile Management**
- Update personal information
- Change password
- Upload profile image
- Manage insurance information

### Doctor Features

#### **Clinic Management**
- View associated clinics
- See clinic details and addresses

#### **Appointment Management**
- View appointments by clinic
- See booked appointments with patient info
- Mark appointments as completed
- View all appointments across all clinics
- Filter by clinic or status

#### **Medical Records**
- Create medical records for completed appointments
- Link lab results to medical records
- View all created medical records
- Add consultation notes
- Add prescriptions

#### **Profile Management**
- Add/update bio
- Update specialization
- Set consultation duration
- Update profile information

### Clinic Features

#### **Doctor Management**
- Add doctors to clinic
- Remove doctors (soft delete)
- View all clinic doctors
- Manage doctor schedules
- Create appointment slots for doctors

#### **Appointment Management**
- View all clinic appointments
- Filter by status, doctor, date range
- See appointment details

#### **Insurance Management**
- Add insurance companies
- Remove insurance companies (soft delete)
- Restore removed insurances
- View all accepted insurances

#### **Dashboard**
- View statistics:
  - Number of doctors
  - Number of patients
  - Number of appointments
  - Number of insurance companies
- View top 5 insurance companies
- View top 5 patients

#### **Profile Management**
- Update clinic information
- Change password
- Upload profile image

### Lab Features

#### **Lab Result Management**
- Create lab result requests for patients
- View all requests (pending, approved, rejected)
- Upload lab results (after approval)
- Link results to appointments
- Upload files (PDF/images)

#### **Profile Management**
- Update lab information
- Change password
- Upload profile image

### Admin Features

#### **Insurance Management**
- Create insurance companies
- Update insurance companies
- Delete insurance companies (soft delete)
- View all insurance companies

#### **User Management**
- View all users (patients, doctors, clinics, labs)
- Delete any user account (soft delete)
- View user details

#### **Dashboard**
- System-wide statistics
- User management interface

---

## User Journeys

### Journey 1: Patient Books Appointment

```
1. Patient visits homepage
   ↓
2. Clicks "العيادات" (Clinics)
   ↓
3. Selects specialization (e.g., "Pediatrics")
   ↓
4. Views list of doctors
   ↓
5. Clicks on doctor profile
   ↓
6. Views doctor's clinics and insurance info
   ↓
7. Selects a clinic
   ↓
8. Views available appointment slots
   ↓
9. Selects a time slot
   ↓
10. If not logged in → Redirected to login
    ↓
11. After login → Appointment booked
    ↓
12. Appointment appears in "Upcoming Appointments"
```

### Journey 2: Doctor Completes Appointment & Creates Record

```
1. Doctor logs in
   ↓
2. Navigates to "My Clinics"
   ↓
3. Selects a clinic
   ↓
4. Views "Booked Appointments" tab
   ↓
5. Sees list of patients with appointments
   ↓
6. After consultation, clicks "Finish Appointment"
   ↓
7. Appointment status changes to "completed"
   ↓
8. Doctor clicks "Create Medical Record"
   ↓
9. Views appointment details and available lab results
   ↓
10. Fills consultation notes and prescription
    ↓
11. Optionally links a lab result
    ↓
12. Saves medical record
    ↓
13. Patient can now view the medical record
```

### Journey 3: Lab Shares Results with Patient

```
1. Lab logs in
   ↓
2. Navigates to "Lab Results"
   ↓
3. Creates new request
   ↓
4. Enters patient email/ID
   ↓
5. Request created with status "pending"
   ↓
6. Patient receives notification
   ↓
7. Patient views notification
   ↓
8. Patient approves request
   ↓
9. Status changes to "approved"
   ↓
10. Lab uploads results (title, notes, file)
    ↓
11. Results saved and linked to patient
    ↓
12. Patient can view results
    ↓
13. Doctor can link results to medical records
```

### Journey 4: Clinic Manages Operations

```
1. Clinic logs in
   ↓
2. Views dashboard (statistics)
   ↓
3. Adds a doctor to clinic
   ↓
4. Doctor appears in "Manage Doctors"
   ↓
5. Clinic creates appointment slots for doctor
   ↓
6. Adds insurance companies
   ↓
7. Views all clinic appointments
   ↓
8. Filters by status/doctor/date
   ↓
9. Manages clinic profile
```

---

## Security Features

### Authentication Security
- **Password Hashing**: Bcrypt via Laravel Hash
- **Token Expiration**: 8-hour token lifetime
- **Token Revocation**: Logout deletes all tokens
- **Email Verification**: Optional email verification

### Authorization Security
- **Role-Based Access**: Middleware enforces role checks
- **Policy-Based Authorization**: Additional checks via Laravel Policies
- **Soft Deletes**: Data retention for audit purposes
- **Foreign Key Constraints**: Database-level referential integrity

### Data Security
- **Input Validation**: All inputs validated
- **SQL Injection Protection**: Eloquent ORM prevents SQL injection
- **XSS Protection**: Laravel Blade escaping
- **CSRF Protection**: Token-based CSRF protection
- **File Upload Security**: Validated file types and sizes

---

## Deployment & Configuration

### Docker Setup
- **Services**: MySQL, Backend, Frontend, phpMyAdmin
- **Networks**: All services on `app-network`
- **Volumes**: Persistent database storage
- **Ports**: 
  - Frontend: 3000
  - Backend: 8000
  - MySQL: 3306
  - phpMyAdmin: 8080

### Environment Configuration
- **Database**: MySQL 8.0
- **Backend**: Laravel 10 with PHP 8.1+
- **Frontend**: React 19
- **Email**: Optional Mailtrap integration

### Development Workflow
1. Start services: `docker compose up`
2. Run migrations: `docker compose exec backend php artisan migrate`
3. Seed database: `docker compose exec backend php artisan db:seed`
4. Access frontend: `http://localhost:3000`
5. Access backend API: `http://localhost:8000/api`
6. Access phpMyAdmin: `http://localhost:8080`

---

## Conclusion

The Medicina system is a comprehensive healthcare platform that seamlessly connects patients, doctors, clinics, and labs. The system features:

- **Robust Authentication**: Multi-role authentication with Sanctum
- **Flexible Relationships**: Many-to-many doctor-clinic relationships
- **Complete Workflows**: End-to-end appointment and medical record management
- **Security**: Role-based access control and data protection
- **Scalability**: Docker-based deployment for easy scaling
- **User-Friendly**: Modern React frontend with responsive design

This guide provides a complete understanding of how the system works from A-Z, covering all aspects from database design to user journeys.

