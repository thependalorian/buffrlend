# BuffrLend Terraform Variables

variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "region" {
  description = "DigitalOcean region"
  type        = string
  default     = "fra1"
}

variable "droplet_size" {
  description = "Size of the droplet"
  type        = string
  default     = "s-2vcpu-4gb"
}

variable "domain_name" {
  description = "Domain name for BuffrLend"
  type        = string
  default     = "lend.buffr.ai"
}

variable "email" {
  description = "Email for SSL certificates and alerts"
  type        = string
}

variable "ssh_public_key_path" {
  description = "Path to SSH public key"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}

variable "admin_ip" {
  description = "Admin IP for restricted access"
  type        = string
  default     = "0.0.0.0/0"
}

variable "create_domain" {
  description = "Whether to create domain records"
  type        = bool
  default     = true
}

variable "create_load_balancer" {
  description = "Whether to create load balancer"
  type        = bool
  default     = false
}

variable "create_database" {
  description = "Whether to create managed database"
  type        = bool
  default     = false
}

variable "create_storage" {
  description = "Whether to create Spaces bucket"
  type        = bool
  default     = true
}

variable "db_size" {
  description = "Size of the database cluster"
  type        = string
  default     = "db-s-1vcpu-1gb"
}

variable "storage_region" {
  description = "Region for Spaces storage"
  type        = string
  default     = "fra1"
}

variable "environment" {
  description = "Environment (dev, staging, production)"
  type        = string
  default     = "production"
}

variable "backup_enabled" {
  description = "Enable automated backups"
  type        = bool
  default     = true
}

variable "monitoring_enabled" {
  description = "Enable monitoring alerts"
  type        = bool
  default     = true
}

# Secrets variables
variable "supabase_url" {
  description = "Supabase project URL"
  type        = string
  default     = "https://xndxotoouiabmodzklcf.supabase.co"
}

variable "supabase_service_key" {
  description = "Supabase service key"
  type        = string
  sensitive   = true
}

variable "supabase_anon_key" {
  description = "Supabase anonymous key"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "google_client_id" {
  description = "Google OAuth client ID"
  type        = string
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google OAuth client secret"
  type        = string
  sensitive   = true
}
