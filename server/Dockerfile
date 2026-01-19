# Base Node image
FROM node:20-alpine

# Working directory
WORKDIR /usr/src/app

# Copy package.json & package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend source files
COPY . .

# Expose backend port
EXPOSE 3000

# Start backend (use nodemon if dev)
CMD ["node", "app.js"]
