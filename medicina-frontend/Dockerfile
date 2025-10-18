# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files and install deps first (for caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy rest of the app
COPY . .

# Build the app for production
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
