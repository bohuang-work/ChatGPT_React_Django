output "public_ip_address" {
  value = azurerm_public_ip.public_ip.ip_address
}

output "public_dns" {
  value = azurerm_public_ip.public_ip.fqdn
}

output "ssh_command" {
  value = "ssh azureuser@${azurerm_public_ip.public_ip.ip_address}"
} 