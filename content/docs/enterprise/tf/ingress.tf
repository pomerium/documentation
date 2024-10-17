resource "kubernetes_ingress_v1" "console" {
  metadata {
    name      = "console"
    namespace = local.namespace_name
    annotations = {
      "ingress.pomerium.io/pass_identity_headers" = "true"
      "ingress.pomerium.io/secure_upstream"       = "true"
      # the below need be replaced with the policy referencing specific users
      "ingress.pomerium.io/allow_any_authenticated_user" = "true"
    }
  }

  spec {
    ingress_class_name = "pomerium"

    rule {
      host = "console.${local.domain}"

      http {
        path {
          path      = "/"
          path_type = "Prefix"
          backend {
            service {
              name = "pomerium-console"
              port {
                name = "https"
              }
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_ingress_v1" "console-api" {
  metadata {
    name      = "console-api"
    namespace = local.namespace_name
    annotations = {
      "ingress.pomerium.io/pass_identity_headers"        = "true"
      "ingress.pomerium.io/secure_upstream"              = "true"
      "ingress.pomerium.io/allow_any_authenticated_user" = "true"
    }
  }

  spec {
    ingress_class_name = "pomerium"

    rule {
      host = "console-api.${local.domain}"

      http {
        path {
          path      = "/"
          path_type = "Prefix"
          backend {
            service {
              name = "pomerium-console"
              port {
                name = "grpc"
              }
            }
          }
        }
      }
    }
  }
}
