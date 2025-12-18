🛠️ Phase 1: Install the Tools

    1. Install PHP (The Engine)
        Download: Go to [windows.php.net/download](https://windows.php.net/download).

        Select: Download the VS16 x64 Thread Safe Zip file.

        Install:
        Extract the Zip file to C:\php.
        Rename php.ini-development to php.ini.
        Open php.ini and remove the ; from the beginning of these lines:
        extension=curl
        extension=fileinfo
        extension=mbstring
        extension=openssl
        extension=pdo_mysql
        Add to Path: Search Windows for "env" -> Environment Variables -> Edit Path -> New -> Add C:\php.
        Verify: Open Git Bash and run:
        ```bash
        php -v
        ```

    2. Install Composer (The Manager)
        Download: Go to [getcomposer.org](https://getcomposer.org) and download Composer-Setup.exe.
        Install: Run the file. It will ask for your PHP path (select C:\php\php.exe).
        Verify: Open Git Bash and run:
        ```bash
        composer -v
        ```

    3. Install MySQL (The Database)
        Download: Go to [dev.mysql.com](https://dev.mysql.com) and download the MySQL Installer (Community).
        Install:
        Run the installer and choose "Server Only".
        Click Next until you reach Accounts and Roles.
        Crucial: Create a Root Password (e.g., password). Write it down!
        Add to Path:
        Search Windows for "env" -> Environment Variables -> Edit Path.
        Add: C:\Program Files\MySQL\MySQL Server 8.0\bin
        Verify: Open Git Bash and run:
        ```bash
        mysql --version
        ```

    4. Install Node.js (The Frontend Engine)
        Download: Go to [nodejs.org](https://nodejs.org) and download the LTS Version (Windows Installer .msi).
        Install: Run the installer and click Next -> Next -> Finish.
        Verify: Open Git Bash and run:
        ```bash
        node -v
        npm -v
        ```

Phase 2: Create the Database
    1- Open Git Bash.
    2- Login to MySQL (use winpty to prevent freezing):
        ```bash
        winpty mysql -u root -p
        ```
    3- Type your root password and press Enter.
    4- Create the database (run these commands in MySQL):
        ```sql
        CREATE DATABASE medicina;
        EXIT;
        ```

⚙️ Phase 3: Setup Backend (Laravel)

    1- Navigate to backend:
        ```bash
        cd backend
        ```

    2- Install dependencies:
        ```bash
        composer install
        ```
    
    3- Configure Environment:
        Open the .env file.
        Change DB_HOST to 127.0.0.1.
        Change DB_PASSWORD to the password you set in Phase 1.
        Clear Config Cache:
        ```bash
        php artisan config:clear
        ```
        Run Migrations:
        ```bash
        php artisan migrate
        ```
        Run seed:
        ```bash
        php artisan db:seed
        ```

🎨 Phase 4: Setup Frontend (React)

    Navigate to frontend:
        ```bash
        cd ../frontend
        ```
    
    Update Proxy:
        Open package.json.
        Change: "proxy": "http://backend:8000"
        To: "proxy": "http://127.0.0.1:8000"

    Install Dependencies:
        ```bash
        npm install --legacy-peer-deps
        ```

Phase 5: Run the Project

    Window 1 (Backend):
        ```bash
        cd backend
        php artisan serve
        ```
        
    Window 2 (Frontend):
        ```bash
        cd frontend
        npm start
        ```