# Secure Terraform Deployment Guide

This guide explains how to securely deploy BuffrLend using Terraform without exposing secrets in version control.

## 🔒 Security Best Practices

### 1. Secrets Management
- **Never commit secrets** to version control
- Use separate files for sensitive data
- Mark sensitive variables in Terraform
- Use environment variables or secret management systems

### 2. File Structure
```
terraform/
├── main.tf                    # Infrastructure definition
├── variables.tf              # Variable definitions
├── outputs.tf                # Output definitions
├── cloud-init.yml           # Server initialization
├── terraform.tfvars.example # Example configuration
├── secrets.tfvars.example   # Example secrets (DO NOT COMMIT)
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🚀 Secure Deployment Process

### Step 1: Prepare Secrets
```bash
# Copy the secrets template
cp secrets.tfvars.example secrets.tfvars

# Edit with your actual secrets
nano secrets.tfvars
```

### Step 2: Configure Variables
```bash
# Copy the variables template
cp terraform.tfvars.example terraform.tfvars

# Edit with your non-sensitive configuration
nano terraform.tfvars
```

### Step 3: Deploy with Secrets
```bash
# Initialize Terraform
terraform init

# Plan with both files
terraform plan -var-file="terraform.tfvars" -var-file="secrets.tfvars"

# Apply with both files
terraform apply -var-file="terraform.tfvars" -var-file="secrets.tfvars"
```

## 🔐 Secrets Configuration

### Required Secrets in `secrets.tfvars`:
```hcl
# DigitalOcean
do_token = "your_digitalocean_api_token"

# Supabase
supabase_service_key = "your_supabase_service_key"
supabase_anon_key = "your_supabase_anon_key"

# Authentication
jwt_secret = "your_jwt_secret_minimum_32_characters"

# Google OAuth
google_client_id = "your_google_client_id"
google_client_secret = "your_google_client_secret"

# Apache Fineract
fineract_username = "your_fineract_username"
fineract_password = "your_fineract_password"

# Payment Gateway
realpay_merchant_id = "your_realpay_merchant_id"
realpay_api_key = "your_realpay_api_key"
realpay_webhook_secret = "your_realpay_webhook_secret"

# Adume Integration
adumo_api_key = "your_adumo_api_key"
```

## 🛡️ Security Features

### Terraform Security
- **Sensitive Variables**: Marked with `sensitive = true`
- **State Protection**: Terraform state files are gitignored
- **Secret Files**: `secrets.tfvars` is gitignored
- **Variable Validation**: Required variables are validated

### Infrastructure Security
- **VPC Networks**: Isolated network segments
- **Firewall Rules**: Restricted access ports
- **SSL/TLS**: Automatic certificate management
- **SSH Keys**: Secure server access
- **Admin IP**: Restricted Docker API access

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Copy `secrets.tfvars.example` to `secrets.tfvars`
- [ ] Fill in all required secrets in `secrets.tfvars`
- [ ] Copy `terraform.tfvars.example` to `terraform.tfvars`
- [ ] Configure non-sensitive variables
- [ ] Verify SSH key exists at specified path
- [ ] Ensure DigitalOcean API token is valid

### Deployment
- [ ] Run `terraform init`
- [ ] Run `terraform plan` with both var files
- [ ] Review planned changes
- [ ] Run `terraform apply` with both var files
- [ ] Verify infrastructure creation
- [ ] Test connectivity to deployed resources

### Post-Deployment
- [ ] SSH into server and verify application deployment
- [ ] Test API endpoints
- [ ] Verify SSL certificates
- [ ] Check monitoring alerts
- [ ] Update DNS if using custom domain

## 🚨 Security Warnings

### ⚠️ Critical Security Notes

1. **Never commit `secrets.tfvars`** - This file contains sensitive information
2. **Use strong passwords** - Generate secure JWT secrets and API keys
3. **Restrict admin IP** - Set `admin_ip` to your specific IP address
4. **Rotate secrets regularly** - Update API keys and passwords periodically
5. **Monitor access logs** - Review server access and application logs

### 🔍 Security Verification

```bash
# Check that secrets file is not tracked
git status

# Verify sensitive variables are marked
grep -r "sensitive.*true" variables.tf

# Test that secrets are not in git history
git log --oneline --grep="secret"
```

## 🆘 Troubleshooting

### Common Security Issues

1. **Secrets exposed in logs**
   ```bash
   # Check Terraform logs
   terraform plan -var-file="secrets.tfvars" 2>&1 | grep -i secret
   ```

2. **State file contains secrets**
   ```bash
   # Check state file
   terraform show | grep -i secret
   ```

3. **Git tracking secrets**
   ```bash
   # Check git status
   git status
   git ls-files | grep secrets
   ```

## 📚 Additional Resources

- [Terraform Security Best Practices](https://www.terraform.io/docs/cloud/guides/security.html)
- [DigitalOcean Security](https://www.digitalocean.com/community/tutorials/digitalocean-security-best-practices)
- [Secrets Management](https://www.terraform.io/docs/language/values/variables.html#sensitive-values)

## 🔄 Secret Rotation

### Regular Maintenance
1. **Monthly**: Review and rotate API keys
2. **Quarterly**: Update JWT secrets
3. **Annually**: Review and update all secrets
4. **As needed**: Rotate compromised credentials immediately

### Rotation Process
```bash
# Update secrets.tfvars with new values
nano secrets.tfvars

# Apply changes
terraform apply -var-file="terraform.tfvars" -var-file="secrets.tfvars"

# Verify changes
terraform output
```
