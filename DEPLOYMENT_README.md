# BuffrLend Fintech Platform - Deployment Guide

A comprehensive deployment guide for the BuffrLend fintech platform with Docker Compose and Caddy reverse proxy support.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Supabase project
- Apache Fineract instance
- Payment gateway credentials (RealPay)
- Email service configuration

### 1. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit with your configuration
nano .env
```

### 2. Deploy with Script (Recommended)
```bash
# Local development deployment
python deploy.py --type local --project localai

# Cloud production deployment
python deploy.py --type cloud
```

### 3. Manual Docker Compose Deployment
```bash
# Local deployment
docker compose -p buffrlend up -d --build

# Cloud deployment with Caddy
docker compose -f docker-compose.yml -f docker-compose.caddy.yml up -d --build
```

## 📋 Environment Configuration

### Required Variables
```env
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
SUPABASE_ANON_KEY=your_anon_key

# Authentication
JWT_SECRET=your_jwt_secret_minimum_32_characters

# Apache Fineract
FINERACT_BASE_URL=https://your-fineract-instance.com
FINERACT_USERNAME=your_username
FINERACT_PASSWORD=your_password

# Payment Gateway
REALPAY_MERCHANT_ID=your_merchant_id
REALPAY_API_KEY=your_api_key
REALPAY_WEBHOOK_SECRET=your_webhook_secret
```

### Optional Variables
```env
# Email Service
EMAIL_PROVIDER=supabase
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Adume Integration
ADUMO_API_URL=https://api.adumo.com
ADUMO_API_KEY=your_api_key

# Security
CORS_ORIGINS=http://localhost:3000,https://app.lend.buffr.ai
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## 🏗️ Architecture

### Services
- **buffrlend-api**: Main API service (Node.js/Express)
- **buffrlend-frontend**: Next.js frontend application
- **buffrlend-worker**: Background job processor
- **caddy**: Reverse proxy with SSL (cloud deployment only)

### Networks
- **buffrlend-network**: Internal Docker network for service communication

### Volumes
- **buffrlend-data**: Persistent data storage
- **caddy_data**: Caddy SSL certificates and configuration
- **caddy_config**: Caddy runtime configuration

## 🔧 Deployment Options

### Local Development
```bash
# Deploy alongside existing AI stack
python deploy.py --type local --project localai

# Access points:
# - API: http://localhost:8001
# - Frontend: http://localhost:8082
# - Health: http://localhost:8001/health
```

### Cloud Production
```bash
# Deploy with integrated Caddy and SSL
python deploy.py --type cloud

# Configure domains in .env:
# API_HOSTNAME=lend.buffr.ai
# FRONTEND_HOSTNAME=lend.buffr.ai
# LETSENCRYPT_EMAIL=admin@mail.buffr.ai
```

## 🔒 Security Features

### Caddy Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000

### API Security
- CORS configuration
- Rate limiting
- JWT authentication
- Request body size limits (10MB)

### SSL/TLS
- Automatic Let's Encrypt certificates
- HTTPS redirect
- HSTS headers

## 📊 Monitoring & Health Checks

### Health Endpoints
```bash
# API health check
curl http://localhost:8001/health

# Frontend health check
curl http://localhost:8082/api/health
```

### Service Monitoring
```bash
# Check service status
docker compose ps

# View service logs
docker compose logs -f buffrlend-api
docker compose logs -f buffrlend-frontend
docker compose logs -f buffrlend-worker

# Check Caddy logs (cloud deployment)
docker compose logs -f caddy
```

## 🔄 Maintenance Operations

### Update Services
```bash
# Rebuild and restart all services
docker compose up -d --build

# Rebuild specific service
docker compose build buffrlend-api
docker compose up -d buffrlend-api
```

### Scale Services
```bash
# Scale worker service
docker compose up -d --scale buffrlend-worker=3
```

### Backup & Restore
```bash
# Backup volumes
docker run --rm -v buffrlend-data:/data -v $(pwd):/backup alpine tar czf /backup/buffrlend-data.tar.gz -C /data .

# Restore volumes
docker run --rm -v buffrlend-data:/data -v $(pwd):/backup alpine tar xzf /backup/buffrlend-data.tar.gz -C /data
```

## 🚨 Troubleshooting

### Common Issues

1. **Services won't start**
   ```bash
   # Check logs
   docker compose logs -f
   
   # Rebuild without cache
   docker compose build --no-cache
   ```

2. **Port conflicts**
   ```bash
   # Check port usage
   netstat -tlnp | grep :8001
   
   # Stop conflicting services
   docker compose down
   ```

3. **Database connection issues**
   ```bash
   # Verify Supabase credentials
   echo $SUPABASE_URL
   echo $SUPABASE_SERVICE_KEY
   ```

4. **SSL certificate issues**
   ```bash
   # Check Caddy logs
   docker compose logs -f caddy
   
   # Restart Caddy
   docker compose restart caddy
   ```

### Performance Optimization

1. **Resource Limits**
   ```yaml
   # Add to docker-compose.yml
   deploy:
     resources:
       limits:
         memory: 512M
         cpus: '0.5'
   ```

2. **Database Connection Pooling**
   ```env
   # Add to .env
   DATABASE_POOL_SIZE=10
   DATABASE_POOL_TIMEOUT=30000
   ```

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Caddy Documentation](https://caddyserver.com/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Apache Fineract Documentation](https://fineract.apache.org/)

## 🆘 Support

For deployment issues:
1. Check service logs: `docker compose logs -f`
2. Verify environment variables: `docker compose config`
3. Test health endpoints: `curl http://localhost:8001/health`
4. Review Caddy configuration: `docker compose exec caddy caddy validate --config /etc/caddy/Caddyfile`
