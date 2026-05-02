# Build stage
FROM node:20-alpine as build-stage
WORKDIR /app

# Copy the frontend package.json specifically
COPY frontend/package*.json ./frontend/

# Install dependencies inside the frontend directory
WORKDIR /app/frontend
RUN npm install

# Copy the rest of the frontend source code
COPY frontend/ .

# Allow passing the backend URL at build time
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the production Vite bundle
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage
# Copy the built files from the previous stage
COPY --from=build-stage /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
