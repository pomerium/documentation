provider "kubernetes" {}

provider "random" {}

module "pomerium_enterprise" {
  source = "git::https://github.com/pomerium/documentation//terraform/enterprise-k8s?ref=v0.28.0"

  database_url            = locals.database_url
  license_key             = locals.license_key
  image_registry_password = locals.image_registry_password

  administrators = locals.administrators

  audience = [
    "console.${local.domain}",
    "console-api.${local.domain}",
  ]
  database_encryption_key_b64 = random_bytes.database_encryption_key.base64
  authenticate_service_url    = "https://authenticate.${local.domain}"
  shared_secret_b64           = data.kubernetes_secret.core_secrets.binary_data["shared_secret"]
  signing_key_b64             = data.kubernetes_secret.core_secrets.binary_data["signing_key"]
  namespace_name              = local.namespace_name
}

resource "random_bytes" "database_encryption_key" {
  length = 32
}

# certain secrets need be copied from the ingress-controller secrets to the enterprise namespace
data "kubernetes_secret" "core_secrets" {
  metadata {
    name      = "bootstrap"
    namespace = "pomerium-ingress-controller"
  }
  binary_data = {
    // the key is required to be declared so that the value could be referenced 
    shared_secret = ""
    signing_key   = ""
  }
}
