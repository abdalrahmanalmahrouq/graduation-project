# Medicina Project: Migration Guide (Docker ↔ Native Ubuntu)

**Date:** November 2024
**OS:** Ubuntu Linux
**Status:** Hybrid Setup (Currently running Native/Local)

---

## 1. Current Status: Native Ubuntu Setup
We have moved from a pure Docker containerized environment to running directly on the Ubuntu OS ("Native" mode). This allows for faster performance and easier local development.

### 🛠️ System Prerequisites & Installation Commands
Run these commands to set up the environment on a fresh Ubuntu machine.

#### Phase 1: Install PHP 8.2 (The Engine)
We use the "Ondřej Surý" repository, which is the gold standard for PHP on Ubuntu.
```bash
# Add Repository
sudo apt update
sudo apt install software-properties-common -y
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

# Install PHP and Extensions
sudo apt install php8.2 php8.2-cli php8.2-common php8.2-mysql php8.2-zip php8.2-gd php8.2-mbstring php8.2-curl php8.2-xml php8.2-bcmath -y

# Verify:
php -v

# Phase 2: Install MySQL (The Database)

# 1-Install Server:
sudo apt install mysql-server -y

# 2-Start & Enable (So it runs on boot):
sudo systemctl start mysql
sudo systemctl enable mysql

# 3-Create Your Admin User: (Since standard root on Ubuntu is locked, we make a new user for you).
Run this to enter the database shell:
sudo mysql

# Then paste these SQL commands one by one:
# CREATE USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost';
CREATE DATABASE medicina;
FLUSH PRIVILEGES;
EXIT;


#### Phase 3: Install Composer (The Manager)
# Download and Install:
curl -sS https://getcomposer.org/installer | php

# Move to Global Path: (This lets you type composer from any folder)
sudo mv composer.phar /usr/local/bin/composer

# Verify 
composer -v


#### Phase 4: Install Node.js & NPM (The Frontend)
# Add Node 20 Repository:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install 
sudo apt install -y nodejs

# Verify
node -v
npm -v

#### Phase 5: Install TablePlus (Optional but Recommended)
# Add Key
wget -qO - https://deb.tableplus.com/apt.tableplus.com.gpg.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/tableplus.gpg > /dev/null
# Add Repo
sudo add-apt-repository "deb [arch=amd64] https://deb.tableplus.com/debian/22 tableplus main" -y
# Install
sudo apt update
sudo apt install tableplus -y




⚙️ Project Configuration Changes
A. Backend (/backend/.env)
The .env file has been modified to support a "Hybrid" toggle.

Docker Config: Commented out (#).

Local Config: Active.

Credentials:
Host: 127.0.0.1
User: admin
Password: password

B. Frontend (/frontend/package.json)
The API Proxy has been updated to point to localhost.

Current Value: "proxy": "http://127.0.0.1:8000"
    instead of "proxy": "http://backend:8000"

C. Permissions
Ownership of project files was reclaimed from Docker (Root) to the local user:

Bash
sudo chown -R $USER:$USER .
sudo chmod -R 775 storage bootstrap/cache
php artisan config:clear
php artisan cache:clear

🚀 How to Run "Native" (Current Mode)
Step 1: Ensure MySQL is Running
Bash
# sudo systemctl start mysql
Step 2: Start Backend
Bash
# cd backend
# php artisan serve
# Server runs at: http://127.0.0.1:8000

Step 3: Start Frontend
Bash
# cd frontend
# npm start
# App runs at: http://localhost:3000


###############################################################################################



🔄 How to Switch Back to Docker
If you need to switch back to the Docker container setup, follow these exact steps to avoid port conflicts.

1. Stop Local Services (CRITICAL)
You must free up ports 8000, 3000, and 3306 or Docker will crash.

Bash

# Stop Terminals (Ctrl+C)
# Stop Local MySQL Service

sudo systemctl stop mysql

2. Update Backend Config
Open backend/.env and swap the comments:

Ini, TOML

# --- DOCKER MODE (Uncomment these) ---
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root

# --- LOCAL MODE (Comment these out) ---
# DB_HOST=127.0.0.1
# DB_USERNAME=admin

3. Update Frontend Config
Open frontend/package.json and change the proxy:
JSON
"proxy": "http://backend:8000",

4. Launch Docker
Bash
docker compose up
⚠️ Troubleshooting
"Permission Denied" Errors: If you switch back and forth often, Docker might re-lock your files as root. Run this in your project root to fix it:
Bash
sudo chown -R $USER:$USER .
"Name Resolution Failed" (phpMyAdmin error): This usually means your Docker MySQL container crashed because you forgot to run sudo systemctl stop mysql before starting Docker.