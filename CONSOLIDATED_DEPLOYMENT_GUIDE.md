# 🚀 BuffrLend Complete Deployment Guide

**Date**: January 30, 2025  
**Target Domain**: `lend.buffr.ai`  
**Status**: ✅ **READY FOR DEPLOYMENT**

---

## 📋 **Quick Start Deployment**

### Prerequisites
- Supabase project set up
- Environment variables configured
- Node.js 18+ installed
- Vercel account (for Vercel deployment)
- Docker and Docker Compose (for containerized deployment)

---

## 🛠️ **Step 1: Database Schema Setup**

**Apply the loan system schema to your Supabase database:**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the schema from `lib/supabase/loan-schema.sql`
4. Paste and execute the SQL

**Or use the automated script:**
```bash
node scripts/apply-loan-schema.js
```

### Database Schema Overview
- **Tables Created**: 50+ comprehensive tables
- **Core Loan Tables**: `loan_applications`, `partner_companies`, `payments`, `kyc_documents`
- **CRM Tables**: `contacts`, `deals`, `teams`, `projects`, `tasks`
- **Security Features**: Row Level Security (RLS) enabled, user data isolation, role-based access control
- **Sample Data**: 7 partner companies pre-loaded, ready for immediate testing

---

## 🔧 **Step 2: Environment Variables**

### Required Variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

# Redis/Upstash Configuration
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Google Services
GOOGLE_DRIVE_CLIENT_ID=your_google_drive_client_id
GOOGLE_DRIVE_CLIENT_SECRET=your_google_drive_client_secret
GOOGLE_DRIVE_REDIRECT_URI=your_google_drive_redirect_uri

# Email Services
SENDGRID_API_KEY=your_sendgrid_api_key
RESEND_API_KEY=your_resend_api_key

# WhatsApp/Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

# JWT Configuration
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here_make_it_long_and_secure
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here_make_it_long_and_secure

# Application Configuration
NEXT_PUBLIC_APP_URL=https://lend.buffr.ai
NODE_ENV=production
```

### Optional Variables (based on features used):
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Email Configuration
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@mail.buffr.ai
FROM_NAME=BuffrLend

# Google Drive Configuration
GOOGLE_DRIVE_CLIENT_ID=your_google_drive_client_id
GOOGLE_DRIVE_CLIENT_SECRET=your_google_drive_client_secret

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

---

## 🚀 **Step 3: Development Server**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## ☁️ **Step 4: Vercel Deployment**

### Option A: Vercel CLI

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

4. **Configure Custom Domain**
   - Go to Vercel Dashboard → Settings → Domains
   - Add domain: `lend.buffr.ai`
   - Configure DNS CNAME record: `lend` → `cname.vercel-dns.com`

5. **Set Environment Variables in Vercel Dashboard**
   - Add all required environment variables from Step 2

### Option B: Vercel Dashboard

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Vercel will auto-detect Next.js

2. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from Step 2

3. **Deploy**
   - Push to main branch triggers automatic deployment
   - Or manually deploy from dashboard

---

## 🐳 **Step 5: Docker Deployment**

### Option 1: Docker Compose (Recommended)

1. **Build and Deploy**
```bash
# Using the deployment script
./scripts/deploy.sh docker-compose

# Or manually
docker-compose up -d
```

2. **Check Status**
```bash
docker-compose ps
docker-compose logs -f buffrlend-app
```

3. **Access Application**
- Application: http://localhost:3000
- Health Check: http://localhost:3000/api/health

### Option 2: Docker Build & Run

1. **Build Image**
```bash
./scripts/deploy.sh docker
# Or manually: docker build -t buffrlend-app .
```

2. **Run Container**
```bash
./scripts/deploy.sh docker-run
# Or manually:
docker run -d \
  --name buffrlend-app \
  -p 3000:3000 \
  --env-file .env.local \
  buffrlend-app
```

### Docker Production Setup

For production with Nginx reverse proxy:

```bash
# Deploy with Nginx
docker-compose --profile production up -d
```

This will:
- Run the app on port 3000
- Nginx on ports 80/443
- SSL termination (configure SSL certificates)
- Rate limiting and security headers

---

## 🔍 **Step 6: Verify Deployment**

### Health Check
```bash
# Docker
curl http://localhost:3000/api/health

# Vercel
curl https://lend.buffr.ai/api/health
```

### Service Tests
```bash
# Test Google Drive service
curl "http://localhost:3000/api/test-services?service=google-drive&action=test-connection"

# Test RAG Pipeline service
curl "http://localhost:3000/api/test-services?service=rag-pipeline&action=test-connection"
```

### Manual Testing
1. Register new user account
2. Complete loan application
3. Upload KYC documents
4. Make test payments
5. Verify data persistence

---

## 🔧 **Configuration Details**

### Vercel Configuration

**vercel.json Features:**
- All environment variables configured
- API route optimization
- Security headers
- Redirects for admin routes
- Function timeout settings

**Next.js Configuration:**
- Standalone output for Docker
- Image optimization for Supabase
- CSP headers for security
- Webpack optimizations

### Docker Configuration

**Dockerfile Features:**
- Multi-stage build for optimization
- Node.js 20 Alpine base image
- Standalone Next.js output
- Non-root user for security
- Health check support

**Docker Compose Features:**
- Environment variable injection
- Volume mounting for static files
- Health checks
- Restart policies
- Optional Nginx reverse proxy

---

## 🧪 **Testing Deployment**

### Integration Testing
- Test Supabase connection
- Verify RLS policies
- Test real-time updates
- Validate form submissions

### Performance Testing
- Load testing
- Mobile responsiveness
- Cross-browser compatibility

---

## 📊 **Monitoring**

### Vercel Monitoring
- Built-in analytics dashboard
- Function execution logs
- Performance metrics
- Error tracking

### Docker Monitoring
```bash
# Container logs
docker-compose logs -f

# Resource usage
docker stats

# Health status
docker-compose ps
```

### Recommended Tools
- **Error Tracking:** Sentry
- **Analytics:** Google Analytics
- **Performance:** Vercel Analytics
- **Database:** Supabase Dashboard

### Key Metrics to Monitor
- User registration rate
- Loan application completion rate
- Payment success rate
- System performance metrics

---

## 🔒 **Security Considerations**

### Vercel Security
- Automatic HTTPS
- Security headers configured
- Environment variable encryption
- DDoS protection
- Edge network security

### Docker Security
- Non-root user in container
- Security headers via Nginx
- Rate limiting
- Environment variable protection
- Network isolation

### Security Checklist
- [ ] Environment variables secured
- [ ] RLS policies enabled
- [ ] HTTPS enabled in production
- [ ] Input validation implemented
- [ ] Error messages sanitized
- [ ] Rate limiting configured
- [ ] CORS properly configured

---

## 🚨 **Troubleshooting**

### Common Vercel Issues

**Build failures:**
- Check environment variables are set
- Verify Node.js version compatibility
- Check for missing dependencies

**Function timeouts:**
- Optimize API routes
- Increase timeout in vercel.json
- Use streaming for long operations

**Domain not working:**
- Verify DNS CNAME record is correct
- Wait for DNS propagation (up to 24 hours)
- Check domain status in Vercel Dashboard

### Common Docker Issues

**Container won't start:**
```bash
# Check logs
docker-compose logs buffrlend-app

# Check environment variables
docker-compose config
```

**Port conflicts:**
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Debug Commands
```bash
# Check Vercel CLI status
vercel whoami

# View deployment logs
vercel logs

# Check domain status
vercel domains ls
```

---

## 📈 **Performance Optimization**

### Vercel Optimizations
- Edge functions for global performance
- Automatic image optimization
- CDN for static assets
- Function caching

### Docker Optimizations
- Multi-stage builds reduce image size
- Nginx caching for static assets
- Gzip compression
- Connection pooling

### Frontend Optimizations
- Next.js 15 with Turbopack
- Image optimization enabled
- Code splitting implemented
- Lazy loading for components

### Backend Optimizations
- Supabase connection pooling
- Optimized database queries
- Real-time subscriptions
- Efficient data fetching

---

## 🔄 **CI/CD Integration**

### GitHub Actions Example
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Pre-deployment Checks
1. **Unit Tests**: Must pass with 80%+ coverage
2. **Integration Tests**: All authentication and API tests must pass
3. **E2E Tests**: Critical user journeys must pass
4. **Security Tests**: All security validations must pass
5. **Performance Tests**: Response times must meet benchmarks

---

## 🎯 **Production Checklist**

### Before Deployment
- [ ] All tests passing
- [ ] Database schema applied
- [ ] Environment variables set
- [ ] Security policies reviewed
- [ ] Performance tested
- [ ] Error handling verified

### After Deployment
- [ ] Monitor error logs
- [ ] Check database performance
- [ ] Verify user registration
- [ ] Test payment processing
- [ ] Monitor system metrics

---

## 📞 **Support**

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com/)

### Project Files
- `Dockerfile` - Container configuration
- `docker-compose.yml` - Multi-container setup
- `vercel.json` - Vercel configuration
- `nginx.conf` - Reverse proxy configuration
- `scripts/deploy.sh` - Deployment automation

---

**Ready for Production!** 🚀

The BuffrLend application is fully tested and ready for deployment. Follow this guide to get your loan management system up and running on `lend.buffr.ai`.

**Deployment Target**: `https://lend.buffr.ai`  
**Framework**: Next.js 15 with App Router  
**Platform**: Vercel (recommended) or Docker  
**Status**: Ready for Production
