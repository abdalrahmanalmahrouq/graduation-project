# Optimized Development Dockerfile for frontend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci --only=production=false && npm cache clean --force

# Copy source code
COPY . .

# Expose port 3000 for development server
EXPOSE 3000

# Start development server with optimized settings
CMD ["npm", "start"]
