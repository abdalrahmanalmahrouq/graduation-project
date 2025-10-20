# Development Commands Guide

This guide provides all the essential commands for managing your Medicina project during development.

## 🐳 Docker Commands

### Starting Services

```bash
# Start all services (frontend, backend, database, phpMyAdmin)
docker compose up

# Start services in background (detached mode)
docker compose up -d

# Start specific services only
docker compose up frontend backend
```

### Stopping Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (⚠️ This will delete your database data)
docker compose down -v

# Stop specific services
docker compose stop frontend
```

### Restarting Services

```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart frontend
docker compose restart backend

# Restart and rebuild containers
docker compose up --build
```

## 🔄 Frontend Commands

### Development

```bash
# Start frontend development server (if running locally)
cd medicina-frontend
npm start

# Install dependencies
npm install

# Build for production
npm run build
```

### Docker Frontend Management

```bash
# Restart frontend container
docker compose restart frontend

# View frontend logs
docker compose logs frontend

# Follow frontend logs in real-time
docker compose logs -f frontend

# Execute commands inside frontend container
docker compose exec frontend npm install
docker compose exec frontend npm run build
```

## 🔧 Backend Commands

### Development

```bash
# Start Laravel development server (if running locally)
cd medicina-backend
php artisan serve

# Install PHP dependencies
composer install

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Run database seeders
php artisan db:seed
```

### Docker Backend Management

```bash
# Restart backend container
docker compose restart backend

# View backend logs
docker compose logs backend

# Follow backend logs in real-time
docker compose logs -f backend

# Execute commands inside backend container
docker compose exec backend composer install
docker compose exec backend php artisan migrate
docker compose exec backend php artisan key:generate
```

## 🗄️ Database Commands

### Database Management

```bash
# Access MySQL container
docker compose exec mysql mysql -u root -p

# Run migrations
docker compose exec backend php artisan migrate

# Reset database (⚠️ This will delete all data)
docker compose exec backend php artisan migrate:fresh

# Seed database
docker compose exec backend php artisan db:seed

# Reset and seed database
docker compose exec backend php artisan migrate:fresh --seed
```

### phpMyAdmin Access

-   URL: http://localhost:8080
-   Username: `root`
-   Password: `root`

## 🧹 Cache Management

### Laravel Cache Clearing

```bash
# Clear all caches
docker compose exec backend php artisan cache:clear
docker compose exec backend php artisan config:clear
docker compose exec backend php artisan route:clear
docker compose exec backend php artisan view:clear

# Clear all caches at once
docker compose exec backend php artisan optimize:clear

# Rebuild optimized caches
docker compose exec backend php artisan optimize
```

### Frontend Cache Clearing

```bash
# Clear npm cache
docker compose exec frontend npm cache clean --force

# Remove node_modules and reinstall
docker compose exec frontend rm -rf node_modules
docker compose exec frontend npm install
```

## 🔨 Rebuilding Services

### Complete Rebuild

```bash
# Stop all services
docker compose down

# Remove all containers and images
docker compose down --rmi all

# Rebuild and start all services
docker compose up --build

# Force rebuild without cache
docker compose build --no-cache
docker compose up
```

### Individual Service Rebuild

```bash
# Rebuild specific service
docker compose build frontend
docker compose build backend

# Rebuild and restart specific service
docker compose up --build frontend
```

## 🐛 Debugging Commands

### Container Management

```bash
# List all running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container details
docker inspect frontend

# Access container shell
docker compose exec frontend sh
docker compose exec backend bash
```

### Logs and Monitoring

```bash
# View all logs
docker compose logs

# View logs with timestamps
docker compose logs -t

# View logs for specific time range
docker compose logs --since="2024-01-01T00:00:00" frontend
```

## 🚀 Quick Development Workflow

### Daily Development Start

```bash
# 1. Start all services
docker compose up -d

# 2. Check if everything is running
docker compose ps

# 3. View logs if needed
docker compose logs -f
```

### When You Make Changes

```bash
# For frontend changes (React hot reload should work automatically)
# No restart needed

# For backend changes (Laravel)
docker compose restart backend

# For database changes
docker compose exec backend php artisan migrate
```

### When Things Go Wrong

```bash
# 1. Stop everything
docker compose down

# 2. Clear caches
docker compose exec backend php artisan optimize:clear

# 3. Rebuild and restart
docker compose up --build
```

## 🌐 Service URLs

-   **Frontend**: http://localhost:3000
-   **Backend API**: http://localhost:8000
-   **phpMyAdmin**: http://localhost:8080
-   **MySQL**: localhost:3306

## ⚠️ Important Notes

1. **Database Data**: Your database data is persisted in a Docker volume. Use `docker compose down -v` only if you want to delete all data.

2. **Port Conflicts**: Make sure ports 3000, 8000, 8080, and 3306 are not used by other applications.

3. **Hot Reload**: Frontend changes should automatically reload. Backend changes require container restart.

4. **Environment Variables**: Backend environment variables are configured in the docker compose.yml file.

5. **File Permissions**: If you encounter permission issues, you may need to adjust file ownership:
    ```bash
    sudo chown -R $USER:$USER /home/aboodlinux/projects/graduation-project
    ```

// to give an edit permission  
sudo chown -R aboodlinux:aboodlinux .
sudo chown -R yaqoub:yaqoub .
