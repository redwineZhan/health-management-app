# Health Management App - Production Deployment Configuration

## Deployment Architecture

The Health Management App is designed to be deployed using Docker containers with the following components:

1. **Frontend**: React application served via Nginx
2. **Backend**: Node.js/Express API server
3. **Database**: PostgreSQL for data persistence
4. **Cache**: Redis for session storage and caching
5. **Reverse Proxy**: Nginx for SSL termination and load balancing

## Production Environment Variables (.env)

```env
# Database Configuration
DB_HOST=postgres
DB_USER=health_app_user
DB_PASSWORD=secure_password
DB_NAME=health_management_prod
DB_PORT=5432

# JWT Configuration
JWT_SECRET=super_long_and_secure_jwt_secret_key_for_production
JWT_EXPIRY=7d
JWT_REFRESH_SECRET=super_long_and_secure_refresh_token_secret
JWT_REFRESH_EXPIRY=30d

# Security
SALT_ROUNDS=12

# Server Configuration
NODE_ENV=production
PORT=3000

# External Services
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@healthtrackpro.com

# Third-party APIs
WEATHER_API_KEY=your_weather_api_key
FITNESS_API_KEY=your_fitness_api_key

# Application Settings
APP_URL=https://healthtrackpro.com
FRONTEND_URL=https://healthtrackpro.com
```

## Docker Production Configuration

Create `production.dockerfile`:

```dockerfile
# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci --only=production && cd client && npm ci --only=production

# Copy application code
COPY . .

# Build the frontend
RUN cd client && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy node modules and built files from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/client/node_modules ./client/node_modules
COPY --from=builder /app/client/build ./client/build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/client/package*.json ./client/
COPY --from=builder /app/server.js ./
COPY --from=builder /app/db ./db/
COPY --from=builder /app/middleware ./middleware/
COPY --from=builder /app/controllers ./controllers/
COPY --from=builder /app/routes ./routes/
COPY --from=builder /app/services ./services/
COPY --from=builder /app/utils ./utils/

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
```

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: nginx.Dockerfile
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl:ro
    networks:
      - app-network

  backend:
    build:
      context: .
      dockerfile: production.dockerfile
    expose:
      - "3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - DB_PORT=5432
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    depends_on:
      - postgres
      - redis
    networks:
      - app-network

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data_prod:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - app-network
    restart: unless-stopped

  redis:
    image: redis:alpine
    volumes:
      - redis_data_prod:/data
    ports:
      - "6379:6379"
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data_prod:
  redis_data_prod:
```

Create `nginx.Dockerfile` for frontend:

```dockerfile
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built React app
COPY client/build /usr/share/nginx/html

# Expose port
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

## Kubernetes Deployment (Optional)

For larger deployments, you can use Kubernetes with these manifests:

### deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: health-app-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: health-app-backend
  template:
    metadata:
      labels:
        app: health-app-backend
    spec:
      containers:
      - name: backend
        image: health-app-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: host
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: user
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: health-app-backend-service
spec:
  selector:
    app: health-app-backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

## Deployment Steps

1. **Environment Setup**:
   ```bash
   # Set up environment variables
   export DB_USER=health_app_user
   export DB_PASSWORD=your_secure_password
   export JWT_SECRET=your_super_secret_jwt_key
   export JWT_REFRESH_SECRET=your_super_secret_refresh_key
   ```

2. **Database Migration**:
   ```bash
   # Run database migrations
   docker-compose -f docker-compose.prod.yml run backend npx sequelize-cli db:migrate
   ```

3. **SSL Certificate Setup**:
   ```bash
   # Generate or obtain SSL certificates
   # Place certificates in the ssl directory
   mkdir ssl
   # Add your certificate files: cert.pem and key.pem
   ```

4. **Deploy Application**:
   ```bash
   # Build and deploy
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

5. **Verify Deployment**:
   ```bash
   # Check if all services are running
   docker-compose -f docker-compose.prod.yml ps
   
   # Check logs
   docker-compose -f docker-compose.prod.yml logs -f
   ```

## Backup and Recovery

Regular backups are essential for health data:

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="health_management_prod"

# Create backup
pg_dump -h localhost -U health_app_user -d $DB_NAME > $BACKUP_DIR/health_app_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/health_app_backup_$DATE.sql

# Cleanup old backups (keep last 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

## Monitoring and Logging

Monitor the application with these key metrics:

- API response times
- Error rates
- Database connection pool usage
- Memory and CPU utilization
- Active users
- Health data upload frequency

## Security Best Practices

1. Regular security audits
2. Keep dependencies updated
3. Implement proper input validation
4. Use HTTPS for all communications
5. Regular security patches
6. Access control and authentication
7. Data encryption at rest and in transit
8. Regular penetration testing

## Rollback Plan

In case of issues:
1. Revert to the previous stable version
2. Restore from the latest backup if needed
3. Notify users of any service disruption
4. Document the incident for future prevention

This completes the production deployment configuration for the Health Management App.