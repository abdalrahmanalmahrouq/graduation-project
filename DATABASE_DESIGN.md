# Medicina Database Design

## Overview
This document outlines the complete database schema for the Medicina healthcare platform, including all required tables, relationships, and constraints.

## Database Tables Summary
**Total Tables Required: 21 tables**

---

## 1. Core User Management Tables

### users
Primary table for all system users (patients, doctors, clinics, labs, admins)
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('patient', 'doctor', 'clinic', 'lab', 'admin') NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### patients
Extended information for patient users
```sql
CREATE TABLE patients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    insurance_company VARCHAR(255),
    insurance_number VARCHAR(100),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    medical_allergies TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### doctors
Extended information for doctor users
```sql
CREATE TABLE doctors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    years_of_experience INT DEFAULT 0,
    consultation_fee DECIMAL(10,2),
    bio TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### clinics
Extended information for clinic users
```sql
CREATE TABLE clinics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    full_address TEXT,
    phone VARCHAR(20),
    working_hours JSON, -- {"monday": {"open": "08:00", "close": "18:00"}, ...}
    services_offered TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### labs
Extended information for lab users
```sql
CREATE TABLE labs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    area VARCHAR(255),
    full_address TEXT,
    phone VARCHAR(20),
    services_offered TEXT,
    accreditation_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 2. Insurance Management Tables

### insurance_companies
Master list of insurance companies
```sql
CREATE TABLE insurance_companies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    contact_info TEXT,
    coverage_details TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### clinic_insurance_companies
Many-to-many relationship between clinics and insurance companies
```sql
CREATE TABLE clinic_insurance_companies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    clinic_id BIGINT NOT NULL,
    insurance_company_id BIGINT NOT NULL,
    coverage_percentage DECIMAL(5,2) DEFAULT 100.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
    FOREIGN KEY (insurance_company_id) REFERENCES insurance_companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_clinic_insurance (clinic_id, insurance_company_id)
);
```

### doctor_clinics
Many-to-many relationship between doctors and clinics (a doctor can work at multiple clinics)
```sql
CREATE TABLE doctor_clinics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    doctor_id BIGINT NOT NULL,
    clinic_id BIGINT NOT NULL,
    is_primary_clinic BOOLEAN DEFAULT FALSE,
    consultation_fee DECIMAL(10,2), -- doctor's fee at this specific clinic
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATE,
    end_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
    UNIQUE KEY unique_doctor_clinic (doctor_id, clinic_id),
    INDEX idx_doctor_clinics (doctor_id),
    INDEX idx_clinic_doctors (clinic_id)
);
```

---

## 3. Appointment Management Tables

### appointments
Core appointments table
```sql
CREATE TABLE appointments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    clinic_id BIGINT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('booked', 'confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'booked',
    notes TEXT,
    cancellation_reason TEXT,
    cancelled_by BIGINT, -- user_id who cancelled
    cancelled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
    FOREIGN KEY (cancelled_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_appointment_datetime (appointment_date, appointment_time),
    INDEX idx_patient_appointments (patient_id),
    INDEX idx_doctor_appointments (doctor_id)
);
```

### doctor_schedules
Doctor availability schedules (now supports multiple clinics per doctor)
```sql
CREATE TABLE doctor_schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    doctor_clinic_id BIGINT NOT NULL, -- references doctor_clinics pivot table
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    appointment_duration INT DEFAULT 30, -- minutes
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_clinic_id) REFERENCES doctor_clinics(id) ON DELETE CASCADE,
    UNIQUE KEY unique_doctor_clinic_schedule (doctor_clinic_id, day_of_week),
    INDEX idx_doctor_clinic_schedules (doctor_clinic_id)
);
```

---

## 4. Medical Records Management Tables

### medical_records
Patient medical records with version control
```sql
CREATE TABLE medical_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    appointment_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    diagnosis TEXT NOT NULL,
    symptoms TEXT,
    treatment_plan TEXT,
    notes TEXT,
    version INT DEFAULT 1,
    is_current_version BOOLEAN DEFAULT TRUE,
    created_by BIGINT NOT NULL, -- doctor who created this version
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_patient_records (patient_id),
    INDEX idx_appointment_records (appointment_id)
);
```

### prescriptions
Prescriptions linked to medical records
```sql
CREATE TABLE prescriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    medical_record_id BIGINT NOT NULL,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE
);
```

### lab_results
Lab test results and reports
```sql
CREATE TABLE lab_results (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    lab_id BIGINT NOT NULL,
    appointment_id BIGINT NULL, -- optional link to appointment
    test_name VARCHAR(255) NOT NULL,
    test_type VARCHAR(100),
    results TEXT NOT NULL,
    file_path VARCHAR(500), -- for PDF/image uploads
    reference_ranges TEXT,
    status ENUM('pending', 'completed', 'reviewed') DEFAULT 'pending',
    test_date DATE NOT NULL,
    version INT DEFAULT 1,
    is_current_version BOOLEAN DEFAULT TRUE,
    created_by BIGINT NOT NULL, -- lab user who created this
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_patient_lab_results (patient_id),
    INDEX idx_lab_results (lab_id)
);
```

---

## 5. Laravel Framework Tables

### password_reset_tokens
Laravel's built-in password reset functionality
```sql
CREATE TABLE password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL
);
```

### personal_access_tokens
Laravel Sanctum API authentication tokens
```sql
CREATE TABLE personal_access_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tokenable (tokenable_type, tokenable_id)
);
```

### failed_jobs
Laravel's queue system failed jobs tracking
```sql
CREATE TABLE failed_jobs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload LONGTEXT NOT NULL,
    exception LONGTEXT NOT NULL,
    failed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 6. Additional Healthcare-Specific Tables

### doctor_reviews
Patient reviews and ratings for doctors
```sql
CREATE TABLE doctor_reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    doctor_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    appointment_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_patient_appointment_review (patient_id, appointment_id)
);
```

### clinic_reviews
Patient reviews and ratings for clinics
```sql
CREATE TABLE clinic_reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    clinic_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    appointment_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_patient_clinic_review (patient_id, appointment_id)
);
```

---

## 7. System Management Tables

### patient_blacklist
Clinic blacklist management
```sql
CREATE TABLE patient_blacklist (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    clinic_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    reason TEXT NOT NULL,
    blacklisted_by BIGINT NOT NULL, -- user who added to blacklist
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (blacklisted_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_clinic_patient_blacklist (clinic_id, patient_id)
);
```

### notifications
System notifications for all users
```sql
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('appointment', 'reminder', 'lab_result', 'system', 'general') NOT NULL,
    related_id BIGINT NULL, -- ID of related record (appointment, lab_result, etc.)
    related_type VARCHAR(50) NULL, -- Type of related record
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_notifications (user_id),
    INDEX idx_unread_notifications (user_id, is_read)
);
```

### audit_logs
System audit trail for important actions
```sql
CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_audit (user_id),
    INDEX idx_table_audit (table_name, record_id),
    INDEX idx_action_audit (action)
);
```

---

## Key Relationships & Design Changes

### Many-to-Many Relationships:
- **Doctor ↔ Clinic**: A doctor can work at multiple clinics, and a clinic can have multiple doctors
  - Implemented via `doctor_clinics` pivot table
  - Includes additional fields: `is_primary_clinic`, `consultation_fee`, `start_date`, `end_date`
- **Clinic ↔ Insurance Companies**: A clinic can accept multiple insurance companies
  - Implemented via `clinic_insurance_companies` pivot table

### One-to-Many Relationships:
- **Patient → Appointments**: A patient can have many appointments
- **Doctor → Appointments**: A doctor can have many appointments  
- **Clinic → Appointments**: A clinic can host many appointments
- **Appointment → Medical Records**: An appointment can have multiple medical record versions
- **Medical Record → Prescriptions**: A medical record can have multiple prescriptions
- **Patient → Lab Results**: A patient can have many lab results

### Key Changes for Multi-Clinic Doctors:
1. **Removed** `clinic_id` from `doctors` table
2. **Added** `doctor_clinics` pivot table with enhanced fields:
   - `is_primary_clinic`: Mark doctor's main clinic
   - `consultation_fee`: Doctor's fee at each specific clinic
   - `start_date/end_date`: Employment period at each clinic
3. **Updated** `doctor_schedules` to reference `doctor_clinic_id` instead of separate doctor and clinic IDs
4. **Enhanced** appointment booking to work with doctor-clinic combinations

---

## Database Relationships Diagram

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    users    │────│    patients     │    │insurance_companies│
│             │    │                 │    │                 │
│ - id (PK)   │    │ - id (PK)       │    │ - id (PK)       │
│ - name      │    │ - user_id (FK)  │    │ - name          │
│ - email     │    │ - insurance_co  │    │ - contact_info  │
│ - role      │    │ - date_of_birth │    └─────────────────┘
│ - password  │    └─────────────────┘              │
└─────────────┘                                     │
       │                                            │
       ├─────────────────┐                         │
       │                 │                         │
┌─────────────┐    ┌─────────────┐                 │
│   doctors   │    │   clinics   │                 │
│             │    │             │                 │
│ - id (PK)   │    │ - id (PK)   │                 │
│ - user_id   │────│ - user_id   │                 │
│ - specialty │    │ - name      │                 │
│ - license   │    │ - area      │                 │
└─────────────┘    └─────────────┘                 │
       │                  │                        │
       │                  │                        │
       │                  ▼                        │
       │         ┌──────────────────────┐          │
       │         │clinic_insurance_cos  │          │
       │         │                      │          │
       │         │ - id (PK)           │          │
       │         │ - clinic_id (FK)    │◄─────────┘
       │         │ - insurance_co_id   │
       │         └──────────────────────┘
       │
       │         ┌──────────────────────┐
       │         │   doctor_clinics     │  ← NEW PIVOT TABLE
       │         │                      │
       │         │ - id (PK)           │
       └─────────│ - doctor_id (FK)    │
                 │ - clinic_id (FK)    │◄─────────┐
                 │ - is_primary_clinic │          │
                 │ - consultation_fee  │          │
                 └──────────────────────┘          │
                          │                       │
                          ▼                       │
                 ┌──────────────────────┐          │
                 │  doctor_schedules    │          │
                 │                      │          │
                 │ - id (PK)           │          │
                 │ - doctor_clinic_id  │          │
                 │ - day_of_week       │          │
                 │ - start_time        │          │
                 └──────────────────────┘          │
                                                   │
┌─────────────────┐                               │
│  appointments   │                               │
│                 │                               │
│ - id (PK)       │                               │
│ - patient_id    │──────────────────────┐        │
│ - doctor_id     │                      │        │
│ - clinic_id     │◄─────────────────────┼────────┘
│ - date/time     │                      │
│ - status        │                      ▼
└─────────────────┘              ┌─────────────────┐
       │                         │  lab_results    │
       ▼                         │                 │
┌─────────────────┐              │ - id (PK)       │
│ medical_records │              │ - patient_id    │◄──┐
│                 │              │ - lab_id (FK)   │   │
│ - id (PK)       │              │ - test_name     │   │
│ - appointment_id│              │ - results       │   │
│ - patient_id    │              └─────────────────┘   │
│ - doctor_id     │                                    │
│ - diagnosis     │              ┌─────────────────────┐
│ - version       │              │   labs              │
└─────────────────┘              │                     │
       │                         │ - id (PK)           │
       ▼                         │ - user_id (FK)      │───┘
┌─────────────────┐              │ - name              │
│ prescriptions   │              └─────────────────────┘
│                 │
│ - id (PK)       │
│ - medical_rec_id│
│ - medication    │
│ - dosage        │
│ - frequency     │
└─────────────────┘
```

### Key Changes in the Diagram:
1. **Removed** `clinic_id` from `doctors` table
2. **Added** `doctor_clinics` pivot table showing many-to-many relationship
3. **Updated** `doctor_schedules` to reference `doctor_clinic_id`
4. **Shows** how doctors can now work at multiple clinics
5. **Maintains** all existing relationships while adding flexibility

---

## Key Features Supported

### 1. Role-Based Access Control
- Users table with role enum supports all user types
- Extended tables for each role with specific information

### 2. Appointment Management
- Complete booking system with status tracking
- Doctor schedule management
- Conflict prevention through unique constraints

### 3. Medical Records with Version Control
- Version tracking for medical record updates
- Prescription management linked to records
- Lab results integration

### 4. Insurance Management
- Master insurance companies table
- Many-to-many relationship with clinics
- Coverage percentage tracking

### 5. System Administration
- Patient blacklist management
- Comprehensive notification system
- Complete audit trail for security

### 6. Data Integrity
- Foreign key constraints ensure referential integrity
- Indexes for optimal query performance
- Unique constraints prevent data duplication

---

## Migration Order
When creating these tables, follow this order to respect foreign key dependencies:

### Laravel Framework Tables (can be created first):
1. `password_reset_tokens`
2. `personal_access_tokens`
3. `failed_jobs`

### Core Business Tables:
4. `users`
5. `insurance_companies`
6. `patients`, `clinics`, `labs`
7. `doctors`
8. `clinic_insurance_companies`
9. `doctor_clinics` (many-to-many pivot table)
10. `doctor_schedules`
11. `appointments`
12. `medical_records`
13. `prescriptions`
14. `lab_results`

### System Management Tables:
15. `patient_blacklist`
16. `notifications`
17. `audit_logs`

### Review Tables (depend on appointments):
18. `doctor_reviews`
19. `clinic_reviews`

This design provides a comprehensive foundation for the Medicina healthcare platform with proper normalization, relationships, and scalability considerations.
