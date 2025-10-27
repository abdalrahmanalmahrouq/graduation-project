#!/bin/bash

# Simple Docker Management Script

case "$1" in
    "start")
        echo "🚀 Starting development environment..."
        docker compose up -d
        echo "✅ Environment started!"
        echo "Frontend: http://localhost:3000"
        echo "Backend: http://localhost:8000"
        echo "Database: http://localhost:8080"
        ;;
    "stop")
        echo "🛑 Stopping all containers..."
        docker compose down
        echo "✅ All containers stopped!"
        ;;
    "logs")
        echo "📋 Showing frontend logs..."
        docker logs frontend -f
        ;;
    "rebuild")
        echo "🔨 Rebuilding frontend..."
        docker compose build frontend
        docker compose up -d frontend
        echo "✅ Frontend rebuilt!"
        ;;
    *)
        echo "Usage: $0 {start|stop|logs|rebuild}"
        echo ""
        echo "Commands:"
        echo "  start   - Start development environment"
        echo "  stop    - Stop all containers"
        echo "  logs    - Show frontend logs"
        echo "  rebuild - Rebuild frontend container"
        ;;
esac
