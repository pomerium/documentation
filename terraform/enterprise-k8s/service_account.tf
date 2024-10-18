resource "kubernetes_service_account" "console" {
  metadata {
    name        = "pomerium-console"
    namespace   = var.namespace_name
    annotations = var.service_account_annotations
  }
}
