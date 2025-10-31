FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p tokens

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
