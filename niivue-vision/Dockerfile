# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# # Command to run the application
# CMD ["npm", "run", "preview"]

# Install serve to serve the static files
RUN npm install -g serve

# Command to run the application
CMD ["serve", "-s", "dist"]