resource "kubernetes_service" "proxy" {
  metadata {
    name      = "pomerium-console"
    namespace = var.namespace_name
  }

  spec {
    selector = {
      "app.kubernetes.io/name" = "pomerium-console"
    }

    port {
      name        = "https"
      port        = 443
      target_port = "app"
      protocol    = "TCP"
    }

    port {
      name        = "grpc"
      port        = 5443
      target_port = "grpc-api"
      protocol    = "TCP"
    }

    type = "ClusterIP"
  }
}
