# Docker Setup for CareMind AI

## Building the Docker Images

### Backend Docker

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.10-slim as builder
WORKDIR /tmp
COPY backend/requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.10-slim
WORKDIR /app

# Copy Python dependencies from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy application
COPY backend/ .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/api/health')"

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Docker

Create `frontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
ARG VITE_API_URL=http://api.caremind.com
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

## Docker Compose Setup

Create `docker-compose.yml` in the root directory:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - "8000:8000"
    environment:
      - TF_CPP_MIN_LOG_LEVEL=2
      - CORS_ORIGINS=http://localhost:3000,http://localhost:5173
    volumes:
      - ./backend:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s

  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
      args:
        VITE_API_URL: http://localhost:8000
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:8000
```

## Quick Commands

### Development

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production

```bash
# Build for production
docker-compose -f docker-compose.yml build --build-arg VITE_API_URL=https://api.caremind.com

# Run with production settings
docker run -p 8000:8000 \
  -e CORS_ORIGINS=https://app.caremind.com \
  -e TF_CPP_MIN_LOG_LEVEL=2 \
  caremind-api:latest
```

## Kubernetes Deployment (Optional)

### Backend Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: caremind-api
  labels:
    app: caremind-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: caremind-api
  template:
    metadata:
      labels:
        app: caremind-api
    spec:
      containers:
      - name: api
        image: caremind-api:latest
        ports:
        - containerPort: 8000
        env:
        - name: CORS_ORIGINS
          value: https://app.caremind.com
        - name: TF_CPP_MIN_LOG_LEVEL
          value: "2"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/ping
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: caremind-api-service
spec:
  selector:
    app: caremind-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer
```

### Frontend Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: caremind-dashboard
  labels:
    app: caremind-dashboard
spec:
  replicas: 2
  selector:
    matchLabels:
      app: caremind-dashboard
  template:
    metadata:
      labels:
        app: caremind-dashboard
    spec:
      containers:
      - name: dashboard
        image: caremind-dashboard:latest
        ports:
        - containerPort: 3000
        env:
        - name: VITE_API_URL
          value: https://api.caremind.com
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: caremind-dashboard-service
spec:
  selector:
    app: caremind-dashboard
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

## Deployment to Cloud

### AWS ECS

```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ECR_URL>
docker build -t caremind-api:latest backend/
docker tag caremind-api:latest <ECR_URL>/caremind-api:latest
docker push <ECR_URL>/caremind-api:latest

# Create ECS task definition and service (via AWS Console or CLI)
```

### Google Cloud Run

```bash
# Build and deploy backend
gcloud run deploy caremind-api \
  --source backend/ \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars CORS_ORIGINS=https://app.caremind.com

# Build and deploy frontend
gcloud run deploy caremind-dashboard \
  --source frontend/ \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars VITE_API_URL=https://caremind-api-xxx.run.app
```

### Heroku

```bash
# Deploy backend
cd backend
heroku create caremind-api
heroku container:push web
heroku container:release web

# Deploy frontend
cd ../frontend
heroku create caremind-dashboard
heroku buildpacks:add buildpack:static
echo "{ \"root\": \"dist\" }" > static.json
git push heroku main
```

## Performance Optimization

### Backend
- Enable Redis caching for predictions
- Use model quantization for faster inference
- Implement request batching
- Add horizontal scaling with load balancer

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading for routes
- Cache API responses with React Query

## Monitoring & Logging

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Monitor container stats
docker stats

# Use APM tools
# - DataDog
# - New Relic
# - Elastic APM
```

---

For more information, see the main `PRODUCTION_INTEGRATION.md`.
