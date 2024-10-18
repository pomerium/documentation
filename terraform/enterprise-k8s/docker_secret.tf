resource "kubernetes_secret" "docker_registry" {
  metadata {
    name      = var.image_pull_secret
    namespace = var.namespace_name
  }

  type = "kubernetes.io/dockerconfigjson"

  data = {
    ".dockerconfigjson" = jsonencode({
      auths = {
        "${var.image_registry}" = {
          username = var.image_registry_username
          password = var.image_registry_password
          auth     = base64encode("${var.image_registry_username}:${var.image_registry_password}")
        }
      }
    })
  }
}
