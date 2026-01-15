# Step 1: Node base image
FROM node:20-alpine

# Step 2: Set working directory
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install --production

# Step 5: Copy all server files
COPY . .

# Step 6: Expose backend port
EXPOSE 3000

# Step 7: Start backend
CMD ["node", "app.js"]
