# BuffrLend Terraform Outputs

output "droplet_ip" {
  description = "IP address of the BuffrLend server"
  value       = digitalocean_droplet.buffrlend_server.ipv4_address
}

output "droplet_id" {
  description = "ID of the BuffrLend server"
  value       = digitalocean_droplet.buffrlend_server.id
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = digitalocean_vpc.buffrlend_vpc.id
}

output "api_url" {
  description = "API URL"
  value       = var.create_domain ? "https://api.${var.domain_name}" : "http://${digitalocean_droplet.buffrlend_server.ipv4_address}:8001"
}

output "app_url" {
  description = "Frontend URL"
  value       = var.create_domain ? "https://app.${var.domain_name}" : "http://${digitalocean_droplet.buffrlend_server.ipv4_address}:8082"
}

output "load_balancer_ip" {
  description = "Load balancer IP (if created)"
  value       = var.create_load_balancer ? digitalocean_loadbalancer.buffrlend_lb[0].ip : null
}

output "database_connection_string" {
  description = "Database connection string (if created)"
  value       = var.create_database ? digitalocean_database_cluster.buffrlend_db[0].uri : null
  sensitive   = true
}

output "storage_bucket_name" {
  description = "Spaces bucket name (if created)"
  value       = var.create_storage ? digitalocean_spaces_bucket.buffrlend_storage[0].name : null
}

output "storage_bucket_url" {
  description = "Spaces bucket URL (if created)"
  value       = var.create_storage ? "https://${digitalocean_spaces_bucket.buffrlend_storage[0].name}.${var.storage_region}.digitaloceanspaces.com" : null
}

output "ssh_connection" {
  description = "SSH connection command"
  value       = "ssh root@${digitalocean_droplet.buffrlend_server.ipv4_address}"
}

output "deployment_commands" {
  description = "Commands to deploy BuffrLend"
  value = {
    ssh_connect = "ssh root@${digitalocean_droplet.buffrlend_server.ipv4_address}"
    clone_repo  = "git clone https://github.com/your-org/buffrlend-starter.git"
    deploy_app  = "cd buffrlend-starter && python deploy.py --type cloud"
  }
}
