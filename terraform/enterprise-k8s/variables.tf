variable "namespace_name" {
  description = "The name of the namespace to create"
  type        = string
  default     = "pomerium-enterprise"
}

variable "image_name" {
  description = "Container image name"
  type        = string
  default     = "pomerium/enterprise/pomerium-console"
}

variable "image_tag" {
  description = "Container image tag"
  type        = string
  default     = "v0.27.1"
}

variable "image_pull_policy" {
  description = "Image pull policy"
  type        = string
  default     = "IfNotPresent"
}

variable "image_pull_secret" {
  description = "Name of the Docker registry secret"
  type        = string
  default     = "pomerium-enterprise-docker-registry"
}

variable "image_registry" {
  description = "Image registry"
  type        = string
  default     = "docker.cloudsmith.io"
}

variable "image_registry_username" {
  description = "Docker registry username"
  type        = string
  default     = "pomerium/enterprise"
}

variable "image_registry_password" {
  description = "Docker registry password"
  type        = string
}

variable "tolerations" {
  description = "List of tolerations for the pods."
  type = list(object({
    key                = optional(string)
    operator           = optional(string, "Equal")
    value              = optional(string)
    effect             = optional(string)
    toleration_seconds = optional(number)
  }))
  default = []
}

variable "audience" {
  description = "List of audiences"
  type        = list(string)
  validation {
    condition     = length(var.audience) >= 1
    error_message = "Audience must be provided"
  }
}

variable "administrators" {
  description = "List of administrators (emails). this should only be used for the console bootstrap."
  type        = list(string)
  default     = []
}

variable "core_namespace_name" {
  description = "The name of the namespace Pomerium Core was deployed to"
  type        = string
  default     = "pomerium-ingress-controller"
}

variable "authenticate_service_url" {
  description = "The URL of the authenticate service"
  type        = string
}

variable "shared_secret_b64" {
  description = "Shared secret between the core and console, Base64 encoded binary data"
  type        = string
  sensitive   = true
}

variable "signing_key_b64" {
  description = "PEM encoded signing key for the console, Base64 encoded"
  type        = string
  sensitive   = true
}

variable "database_url" {
  description = "Postgres database DSN string, may be either URL or key-value format"
  type        = string
}

variable "database_encryption_key_b64" {
  description = "Key used to encrypt database data"
  type        = string
  sensitive   = true
}

variable "license_key" {
  description = "Pomerium license key"
  type        = string
  sensitive   = true
}

variable "secrets_name" {
  description = "Name of the secrets"
  type        = string
  default     = "enterprise"
}


variable "resources_requests" {
  description = "Resource requests for the container"
  type = object({
    cpu               = string
    memory            = string
    ephemeral_storage = string
  })
  default = {
    cpu               = "2"
    memory            = "4Gi"
    ephemeral_storage = "4Gi"
  }
}

variable "resources_limits_cpu" {
  description = "Resource CPU limits for the container"
  type        = string
  default     = "4"
}

variable "resources_limits_memory" {
  description = "Resource RAM limits for the container"
  type        = string
  default     = "10Gi"
}

variable "resources_requests_cpu" {
  description = "Resource CPU requests for the container"
  type        = string
  default     = "2"
}

variable "resources_requests_memory" {
  description = "Resource RAM requests for the container"
  type        = string
  default     = "4Gi"
}

variable "resources_ephemeral_storage" {
  description = "Resource ephemeral storage for the container"
  type        = string
  default     = "4Gi"
}

variable "deployment_replicas" {
  description = "Number of replicas for the Pomerium Enterprise Deployment"
  type        = number
  default     = 1
}

variable "service_account_annotations" {
  description = "Name of the service account"
  type        = map(string)
  default     = {}
}

variable "sidecars" {
  description = "Additional sidecar containers to run in the pod"
  type = list(object({
    name  = string
    image = string
    args  = list(string)
  }))
}
