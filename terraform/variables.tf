variable "subscription_id" {
  description = "Azure subscription ID"
}

variable "location" {
  description = "Azure region"
  default     = "westeurope"
}

variable "resource_group_name" {
  description = "Name of the resource group"
  default     = "chatgpt-clone-rg"
}

variable "domain_name_label" {
  description = "Domain name label for the public IP"
  default     = "chatgpt-clone-demo"
} 