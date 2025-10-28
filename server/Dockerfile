# Use Node.js 20 LTS
FROM node:20

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# (Optional but clear) Expose Cloud Run's default port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
