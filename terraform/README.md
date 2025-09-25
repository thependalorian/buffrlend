# BuffrLend Terraform Infrastructure

This directory contains Terraform configurations for deploying BuffrLend fintech platform on DigitalOcean.

## 🚀 Quick Start

### Prerequisites
- Terraform >= 1.0
- DigitalOcean API token
- SSH key pair
- Domain name configured in DigitalOcean

### 1. Configure Variables
```bash
# Copy the example file
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
nano terraform.tfvars
```

### 2. Initialize Terraform
```bash
terraform init
```

### 3. Plan Deployment
```bash
terraform plan
```

### 4. Deploy Infrastructure
```bash
terraform apply
```

### 5. Deploy Application
```bash
# SSH into the server
ssh root@$(terraform output -raw droplet_ip)

# Clone and deploy the application
git clone https://github.com/your-org/buffrlend-starter.git
cd buffrlend-starter
python deploy.py --type cloud
```

## 📋 Configuration

### Required Variables
- `do_token`: DigitalOcean API token
- `email`: Email for SSL certificates and alerts

### Domain Configuration
- **Domain**: `lend.buffr.ai`
- **API**: `https://lend.buffr.ai`
- **Frontend**: `https://app.lend.buffr.ai`

### Supabase Integration
- **URL**: `https://xndxotoouiabmodzklcf.supabase.co`
- **OAuth**: Google OAuth configured

## 🏗️ Infrastructure Components

### Core Resources
- **Droplet**: Docker-enabled Ubuntu server
- **VPC**: Private network for security
- **Firewall**: Configured security rules
- **Domain**: DNS records for API and frontend

### Optional Resources
- **Load Balancer**: For high availability
- **Database**: Managed PostgreSQL cluster
- **Storage**: Spaces bucket for file storage
- **Monitoring**: CPU and memory alerts

## 🔧 Management Commands

### View Outputs
```bash
terraform output
```

### Update Infrastructure
```bash
terraform plan
terraform apply
```

### Destroy Infrastructure
```bash
terraform destroy
```

### SSH Access
```bash
ssh root@$(terraform output -raw droplet_ip)
```

## 🔒 Security Features

### Firewall Rules
- SSH (port 22): Open to all
- HTTP (port 80): Open to all
- HTTPS (port 443): Open to all
- Docker API (port 2376): Restricted to admin IP

### SSL/TLS
- Automatic Let's Encrypt certificates
- HTTPS redirect
- HSTS headers

### Monitoring
- CPU usage alerts (>80%)
- Memory usage alerts (>80%)
- Email notifications

## 📊 Monitoring & Alerts

### Health Checks
- API health endpoint: `/health`
- Frontend health endpoint: `/api/health`
- Load balancer health checks (if enabled)

### Logs
```bash
# View application logs
docker compose logs -f

# View system logs
journalctl -u buffrlend
```

## 🚨 Troubleshooting

### Common Issues

1. **Terraform fails to create resources**
   ```bash
   # Check DigitalOcean API token
   echo $DO_TOKEN
   
   # Verify SSH key exists
   ls -la ~/.ssh/id_rsa.pub
   ```

2. **Domain not resolving**
   ```bash
   # Check DNS propagation
   dig lend.buffr.ai
   nslookup app.lend.buffr.ai
   ```

3. **SSL certificate issues**
   ```bash
   # Check Caddy logs
   docker compose logs -f caddy
   
   # Verify domain configuration
   curl -I https://lend.buffr.ai
   ```

### Debug Commands
```bash
# Check droplet status
terraform show

# View all outputs
terraform output -json

# Test connectivity
curl -f http://$(terraform output -raw droplet_ip)/health
```

## 📚 Additional Resources

- [DigitalOcean Terraform Provider](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs)
- [Terraform Documentation](https://www.terraform.io/docs)
- [BuffrLend Application Deployment](../DEPLOYMENT_README.md)

## 🆘 Support

For infrastructure issues:
1. Check Terraform state: `terraform show`
2. Verify DigitalOcean resources in console
3. Test connectivity: `curl -f http://$(terraform output -raw droplet_ip)/health`
4. Review logs: `docker compose logs -f`
