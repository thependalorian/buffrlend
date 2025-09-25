# BuffrLend Fintech Platform - Terraform Infrastructure
# Digital Ocean deployment with Docker Compose

terraform {
  required_version = ">= 1.0"
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

# Configure the DigitalOcean Provider
provider "digitalocean" {
  token = var.do_token
}

# Create VPC for BuffrLend
resource "digitalocean_vpc" "buffrlend_vpc" {
  name     = "buffrlend-vpc"
  region   = var.region
  ip_range = "10.10.0.0/16"
}

# Create SSH key for droplet access
resource "digitalocean_ssh_key" "buffrlend_ssh" {
  name       = "buffrlend-ssh-key"
  public_key = file(var.ssh_public_key_path)
}

# Create droplet for BuffrLend
resource "digitalocean_droplet" "buffrlend_server" {
  name     = "buffrlend-server"
  image    = "docker-20-04"
  region   = var.region
  size     = var.droplet_size
  vpc_uuid = digitalocean_vpc.buffrlend_vpc.id
  
  ssh_keys = [digitalocean_ssh_key.buffrlend_ssh.id]
  
  user_data = templatefile("${path.module}/cloud-init.yml", {
    domain_name = var.domain_name
    email       = var.email
  })

  tags = ["buffrlend", "fintech", "production"]
}

# Create domain record
resource "digitalocean_domain" "buffrlend_domain" {
  count = var.create_domain ? 1 : 0
  name  = var.domain_name
}

# Create A record for API
resource "digitalocean_record" "buffrlend_api" {
  count  = var.create_domain ? 1 : 0
  domain = digitalocean_domain.buffrlend_domain[0].name
  type   = "A"
  name   = "api"
  value  = digitalocean_droplet.buffrlend_server.ipv4_address
  ttl    = 300
}

# Create A record for Frontend
resource "digitalocean_record" "buffrlend_app" {
  count  = var.create_domain ? 1 : 0
  domain = digitalocean_domain.buffrlend_domain[0].name
  type   = "A"
  name   = "app"
  value  = digitalocean_droplet.buffrlend_server.ipv4_address
  ttl    = 300
}

# Create CNAME record for www
resource "digitalocean_record" "buffrlend_www" {
  count  = var.create_domain ? 1 : 0
  domain = digitalocean_domain.buffrlend_domain[0].name
  type   = "CNAME"
  name   = "www"
  value  = "@"
  ttl    = 300
}

# Create firewall
resource "digitalocean_firewall" "buffrlend_firewall" {
  name = "buffrlend-firewall"
  
  droplet_ids = [digitalocean_droplet.buffrlend_server.id]
  
  # SSH
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }
  
  # HTTP
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }
  
  # HTTPS
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }
  
  # Docker API (restricted)
  inbound_rule {
    protocol         = "tcp"
    port_range       = "2376"
    source_addresses = [var.admin_ip]
  }
  
  # Outbound rules
  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
  
  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
  
  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

# Create load balancer (optional)
resource "digitalocean_loadbalancer" "buffrlend_lb" {
  count  = var.create_load_balancer ? 1 : 0
  name   = "buffrlend-lb"
  region = var.region
  vpc_uuid = digitalocean_vpc.buffrlend_vpc.id
  
  forwarding_rule {
    entry_protocol  = "http"
    entry_port      = 80
    target_protocol = "http"
    target_port     = 80
    tls_passthrough = false
  }
  
  forwarding_rule {
    entry_protocol  = "https"
    entry_port      = 443
    target_protocol = "http"
    target_port     = 80
    tls_passthrough = true
  }
  
  healthcheck {
    protocol               = "http"
    port                   = 80
    path                   = "/health"
    check_interval_seconds = 10
    response_timeout_seconds = 5
    unhealthy_threshold    = 3
    healthy_threshold      = 2
  }
  
  droplet_ids = [digitalocean_droplet.buffrlend_server.id]
}

# Create database (optional)
resource "digitalocean_database_cluster" "buffrlend_db" {
  count      = var.create_database ? 1 : 0
  name       = "buffrlend-db"
  engine     = "pg"
  version    = "15"
  size       = var.db_size
  region     = var.region
  node_count = 1
  vpc_uuid   = digitalocean_vpc.buffrlend_vpc.id
  
  tags = ["buffrlend", "database"]
}

# Create database firewall
resource "digitalocean_database_firewall" "buffrlend_db_firewall" {
  count     = var.create_database ? 1 : 0
  cluster_id = digitalocean_database_cluster.buffrlend_db[0].id
  
  rule {
    type  = "droplet"
    value = digitalocean_droplet.buffrlend_server.id
  }
}

# Create spaces bucket for file storage
resource "digitalocean_spaces_bucket" "buffrlend_storage" {
  count  = var.create_storage ? 1 : 0
  name   = "buffrlend-storage-${random_id.bucket_suffix[0].hex}"
  region = var.storage_region
  
  lifecycle_rule {
    enabled = true
    expiration {
      days = 30
    }
  }
  
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

# Random ID for bucket suffix
resource "random_id" "bucket_suffix" {
  count       = var.create_storage ? 1 : 0
  byte_length = 8
}

# Create monitoring alert
resource "digitalocean_monitor_alert" "buffrlend_cpu" {
  alerts {
    email = [var.email]
  }
  
  window      = "5m"
  type        = "v1/insights/droplet/cpu"
  compare     = "GreaterThan"
  value       = 80
  enabled     = true
  entities    = [digitalocean_droplet.buffrlend_server.id]
  description = "CPU usage is above 80%"
}

resource "digitalocean_monitor_alert" "buffrlend_memory" {
  alerts {
    email = [var.email]
  }
  
  window      = "5m"
  type        = "v1/insights/droplet/memory_utilization_percent"
  compare     = "GreaterThan"
  value       = 80
  enabled     = true
  entities    = [digitalocean_droplet.buffrlend_server.id]
  description = "Memory usage is above 80%"
}
