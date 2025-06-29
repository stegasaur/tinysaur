FROM node:22.14.0-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22.14.0-alpine

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files from the build stage
COPY --from=build /app/vite.config.js ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/db ./db
COPY --from=build /app/server ./server
COPY --from=build /app/shared ./shared
COPY --from=build /app/src ./src

# Copy server entry point
COPY index.js ./

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
