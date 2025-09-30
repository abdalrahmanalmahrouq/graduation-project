# Use Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install deps first (for caching)
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Run dev server
CMD ["npm", "start"]
