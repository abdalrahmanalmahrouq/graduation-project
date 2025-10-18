# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files and install deps first (for caching)
COPY package*.json ./
RUN npm ci

# Copy rest of the app
COPY . .

# Build the app for production
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Write nginx configuration (SPA fallback + caching)
RUN printf "server {\n\
    listen 80;\n\
    server_name localhost;\n\
\n\
    root /usr/share/nginx/html;\n\
    index index.html index.htm;\n\
\n\
    gzip on;\n\
    gzip_vary on;\n\
    gzip_min_length 1024;\n\
    gzip_proxied expired no-cache no-store private auth;\n\
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;\n\
\n\
    location / {\n\
        try_files \\$uri /index.html;\n\
    }\n\
\
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {\n\
        expires 1y;\n\
        add_header Cache-Control \"public, immutable\";\n\
    }\n\
\
    add_header X-Frame-Options \"SAMEORIGIN\" always;\n\
    add_header X-XSS-Protection \"1; mode=block\" always;\n\
    add_header X-Content-Type-Options \"nosniff\" always;\n\
    add_header Referrer-Policy \"no-referrer-when-downgrade\" always;\n\
    add_header Content-Security-Policy \"default-src 'self' http: https: data: blob: 'unsafe-inline'\" always;\n\
}\n" > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
