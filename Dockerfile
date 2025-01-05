# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json first to utilize Docker cache for npm install
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port the Next.js app will run on
EXPOSE 3000

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package.json and package-lock.json for production dependencies
COPY package*.json ./

# Install only production dependencies (e.g., without dev dependencies)
RUN npm install --only=production --force

# Copy build artifacts from the builder stage
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public

# Expose port for Next.js app
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]