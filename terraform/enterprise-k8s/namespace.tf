resource "kubernetes_namespace" "pomerium-enterprise" {
  metadata {
    name = var.namespace_name
  }
}
