# Use Node.js as the base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Expose port and start the app
EXPOSE 5000
CMD [ "node", "server.js" ]
