# Medicina Project Setup Guide

This guide will help you set up the Medicina project on your local machine. The project consists of a Laravel backend API and a React frontend application, all containerized with Docker.

## 📋 Prerequisites

Before starting, ensure you have the following installed on your system:

### Required Software
- **Docker** (version 20.10 or higher) ✅ *Your version: 28.3.2*
- **Docker Compose** (version 2.0 or higher) ✅ *Your version: v2.38.2*
- **Git** (for cloning the repository)

### Installing Docker

If you don't have Docker installed, follow the official installation guides:

#### 🐧 Linux
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Or use package manager
sudo apt update
sudo apt install docker.io docker-compose
```

#### 🪟 Windows
1. Download **Docker Desktop for Windows** from: https://docs.docker.com/desktop/install/windows-install/
2. Run the installer and follow the setup wizard
3. Restart your computer if prompted

#### 🍎 macOS
1. Download **Docker Desktop for Mac** from: https://docs.docker.com/desktop/install/mac-install/
2. Drag Docker to your Applications folder
3. Launch Docker Desktop from Applications

#### 📚 Official Documentation
- **Docker Installation Guide**: https://docs.docker.com/get-docker/
- **Docker Compose Installation**: https://docs.docker.com/compose/install/

#### ✅ Verify Installation
After installation, verify Docker is working:
```bash
# Check Docker version
docker --version

# Check Docker Compose version (V2 - newer)
docker compose version

# Check Docker Compose version (V1 - legacy)
docker-compose --version
```

**Note**: Your current versions (Docker 28.3.2 and Compose v2.38.2) are excellent and fully compatible with this project! 🎉

### Optional but Recommended
- **Node.js** (version 18 or higher) - for local frontend development
- **PHP** (version 8.1 or higher) - for local backend development
- **Composer** - for PHP dependency management

## 🚀 Quick Setup (Recommended)

### Step 1: Clone the Repository

Choose one of the following methods:

#### Option 1: HTTPS (Recommended for most users)
```bash
git clone https://github.com/abdalrahmanalmahrouq/graduation-project.git
cd graduation-project
```

#### Option 2: SSH (If you have SSH keys set up)
```bash
git clone git@github.com:abdalrahmanalmahrouq/graduation-project.git
cd graduation-project
```

**Note**: HTTPS is easier for most users as it doesn't require SSH key setup. Use SSH if you prefer not to enter your GitHub credentials.

### Step 2: Configure Environment Variables
```bash
# Navigate to backend directory
cd medicina-backend

# Copy the environment example file
cp .env.example .env

# Edit the .env file to set database configuration
# Change these values in the .env file:
# DB_DATABASE=medicina
# DB_PASSWORD=root
```

### Step 3: Start the Application with Docker
```bash
# Go back to project root
cd ..

# Start all services (backend, frontend, database, phpMyAdmin)
docker compose up --build
```


This command will:
- Build the Docker images for both frontend and backend
- Start MySQL database
- Start Laravel backend API
- Start React frontend
- Start phpMyAdmin for database management

### Step 4: Run Database Migrations
```bash
# After the containers are running, migrate the database
docker compose exec backend php artisan migrate
```

This will create all the necessary database tables for the application.

### Step 5: Access the Application
Once all containers are running, you can access:

- **Frontend (React App)**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **phpMyAdmin**: http://localhost:8080
  - Server: `mysql`
  - Username: `root`
  - Password: `root`

### Step 4: Configure Email Features (Optional)
📧 **Want email verification and password reset features?** 

See the [Email Configuration section](#-email-configuration-optional) below for Mailtrap setup instructions. This is completely optional - the application works perfectly without email configuration.

## 🔧 Detailed Setup Instructions

### Backend Setup (Laravel)

The backend is a Laravel 10 application with the following features:
- **PHP Version**: 8.1+
- **Database**: MySQL 8.0
- **Authentication**: Laravel Sanctum
- **API**: RESTful API endpoints

#### Backend Services:
- User authentication and registration
- Patient management
- Doctor management
- Clinic management

#### Environment Configuration:
The Laravel backend requires a `.env` file with the following database settings:
```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=medicina
DB_USERNAME=root
DB_PASSWORD=root
```

### Frontend Setup (React)

The frontend is a React 19 application with:
- **React Version**: 19.1.0
- **Styling**: Tailwind CSS + Bootstrap 5
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **UI Components**: React Bootstrap

#### Frontend Features:
- Responsive design
- User authentication
- Patient/Doctor/Clinic management interfaces
- Modern UI with animations (AOS)

### Database Setup

The application uses MySQL 8.0 with the following default configuration:
- **Database Name**: `medicina`
- **Username**: `root`
- **Password**: `root`
- **Port**: `3306`



## 🐳 Docker Services

The project includes the following Docker services:

### 1. MySQL Database
- **Image**: mysql:8.0
- **Port**: 3306
- **Volume**: Persistent data storage
- **Network**: app-network

### 2. Backend (Laravel)
- **Build**: Custom Dockerfile
- **Port**: 8000
- **Dependencies**: MySQL
- **Features**: Auto-install dependencies, key generation, config caching

### 3. Frontend (React)
- **Build**: Custom Dockerfile
- **Port**: 3000
- **Dependencies**: Backend
- **Features**: Hot reload, polling for file changes

### 4. phpMyAdmin
- **Image**: phpmyadmin/phpmyadmin
- **Port**: 8080
- **Purpose**: Database management interface

## 🛠️ Development Workflow

### Starting Development
```bash
# Start all services
docker compose up

# Start in background (detached mode)
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

### Backend Development
```bash
# Access backend container
docker exec -it backend bash

# Run Laravel commands
docker exec -it backend php artisan migrate
docker exec -it backend php artisan db:seed
docker exec -it backend php artisan key:generate
```

### Frontend Development
```bash
# Access frontend container
docker exec -it frontend bash

# Install new packages
docker exec -it frontend npm install package-name

# Build for production
docker exec -it frontend npm run build
```
🎯 Best Practice:
Always use -it for interactive commands because:
It provides the best user experience
Commands work as expected
You get proper terminal formatting
Interactive features work correctly
You can remove -it only for simple, non-interactive commands that just run and exit.

## 📁 Project Structure

```
graduation-project/
├── docker-compose.yml          # Docker services configuration
├── medicina-backend/           # Laravel backend
│   ├── app/                   # Application logic
│   ├── config/                # Configuration files
│   ├── database/              # Migrations and seeders
│   ├── routes/                # API routes
│   └── Dockerfile             # Backend container config
├── medicina-frontend/          # React frontend
│   ├── src/                   # Source code
│   ├── public/                # Static assets
│   └── Dockerfile             # Frontend container config
└── SETUP.md                   # This file
```

## 🔐 Environment Configuration

The application uses the following environment variables (configured in docker-compose.yml):

### Backend Environment
- `DB_HOST=mysql`
- `DB_DATABASE=medicina`
- `DB_USERNAME=root`
- `DB_PASSWORD=root`

### Frontend Environment
- `CHOKIDAR_USEPOLLING=true` (for file watching in Docker)

## 📧 Email Configuration (Optional)

The Medicina application includes email verification and password reset features. To enable these features, you need to configure email settings using Mailtrap for development.

### 🔧 Mailtrap Setup (Optional)

**Note**: Email features are **optional**. The application works perfectly without email configuration - users can register and use all features normally. Email verification and password reset will simply be disabled.

#### Why Use Mailtrap?
- **Safe Testing**: No real emails are sent during development
- **Email Preview**: View and test all email templates
- **Free Tier**: Generous free plan for development
- **Easy Integration**: Simple SMTP configuration

#### Step 1: Create Mailtrap Account
1. Go to [mailtrap.io](https://mailtrap.io)
2. Sign up for a free account
3. Verify your email address

#### Step 2: Get SMTP Credentials
1. Login to your Mailtrap dashboard
2. Go to **Email Testing** → **Inboxes**
3. Click on your default inbox (or create a new one)
4. Go to **SMTP Settings** tab
5. Copy the credentials:
   - **Host**: `sandbox.smtp.mailtrap.io`
   - **Port**: `2525`
   - **Username**: `your_username_here`
   - **Password**: `your_password_here`

#### Step 3: Configure Backend Environment
Add the following to your backend `.env` file:

```bash
# Access the backend container
docker exec -it backend bash

# Edit the .env file
nano .env

# Add these email configuration lines:
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@medicina.com"
MAIL_FROM_NAME="Medicina"
```

#### Step 4: Restart Backend
```bash
# Exit the container
exit

# Restart the backend to apply email configuration
docker restart backend
```

#### Step 5: Test Email Features
Once configured, you can test:
- **User Registration** → Email verification sent to Mailtrap
- **Password Reset** → Reset emails sent to Mailtrap
- **Email Verification** → Verification links work properly

### 📋 Email Features Available

When email is configured, the following features are enabled:

#### ✅ Email Verification
- New users receive verification emails after registration
- Users must verify their email to access certain features
- Verification links redirect to a beautiful success page

#### ✅ Password Reset
- Users can request password reset emails
- Secure reset links with expiration
- Password reset flow with email confirmation

#### ✅ Notifications
- Account-related notifications
- Security alerts and updates
- System notifications

### 🚫 Without Email Configuration

If you choose not to configure email (recommended for quick development):

- ✅ **Registration works normally** - Users can register and login
- ✅ **All features accessible** - No restrictions on app functionality  
- ✅ **Faster development** - No email delays during testing
- ✅ **No external dependencies** - Fully self-contained setup
- ⚠️ **Email verification disabled** - Users are not required to verify emails
- ⚠️ **Password reset unavailable** - Users cannot reset passwords via email

### 🔄 Enabling/Disabling Email Features

You can easily toggle email features:

**To Disable Email (for development):**
```bash
docker exec backend sed -i 's/MAIL_HOST=.*/MAIL_HOST=/' .env
docker exec backend sed -i 's/MAIL_USERNAME=.*/MAIL_USERNAME=/' .env  
docker exec backend sed -i 's/MAIL_PASSWORD=.*/MAIL_PASSWORD=/' .env
docker restart backend
```

**To Enable Email (for production):**
```bash
docker exec backend sed -i 's/MAIL_HOST=/MAIL_HOST=sandbox.smtp.mailtrap.io/' .env
docker exec backend sed -i 's/MAIL_USERNAME=/MAIL_USERNAME=your_username/' .env
docker exec backend sed -i 's/MAIL_PASSWORD=/MAIL_PASSWORD=your_password/' .env
docker restart backend
```

