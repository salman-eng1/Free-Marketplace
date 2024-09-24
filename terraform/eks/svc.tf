# Kubernetes Provider Configuration
provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.cluster_auth.token
}

# resource "kubernetes_storage_class" "example" {
#   metadata {
#     name = "gp3"
#   }
#   storage_provisioner = "kubernetes.io/aws-ebs" # Fixed attribute nameundefined+
#   reclaim_policy      = "Retain"
#   parameters = {
#     type   = "gp3" # You can use gp3, io1, etc.
#     fsType = "ext4"
#   }
#   volume_binding_mode = "WaitForFirstConsumer"
# }

resource "kubernetes_namespace" "production" {
  metadata {
    name = "production"
  }
  depends_on = [ aws_eks_cluster.marketplace-cluster,aws_eks_node_group.marketplace-node-group ]
}

resource "kubernetes_namespace" "grafana" {
  metadata {
    name = "grafana"
  }
    depends_on = [ aws_eks_cluster.marketplace-cluster ]

}
resource "kubernetes_namespace" "prometheus" {
  metadata {
    name = "prometheus"
  }
    depends_on = [ aws_eks_cluster.marketplace-cluster,aws_eks_node_group.marketplace-node-group ]

}

# IAM Role for AWS Load Balancer Controller
resource "aws_iam_role" "load_balancer_controller_role" {
  name = "AmazonEKSLoadBalancerControllerRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.eks_oidc_provider.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "${replace(data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer, "https://", "")}:sub" = "system:serviceaccount:kube-system:aws-load-balancer-controller"
        }
      }
    }]
  })
  depends_on = [ aws_eks_cluster.marketplace-cluster,aws_iam_openid_connect_provider.eks_oidc_provider ]
}

resource "aws_iam_role" "ebs_csi_driver_role" {
  name = "AmazonEKS_EBS_CSI_DriverRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.eks_oidc_provider.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "${replace(data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer, "https://", "")}:sub" = "system:serviceaccount:kube-system:ebs-csi-controller-sa"
        }
      }
    }]
  })
    depends_on = [ aws_eks_cluster.marketplace-cluster,aws_iam_openid_connect_provider.eks_oidc_provider ]

}


resource "aws_iam_role" "external_dns_role" {
  name = "AmazonEKS_ExternalDNSRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.eks_oidc_provider.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "${replace(data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer, "https://", "")}:sub" = "system:serviceaccount:production:gateway-external-dns"
        }
      }
    }]
  })
    depends_on = [ aws_eks_cluster.marketplace-cluster,aws_iam_openid_connect_provider.eks_oidc_provider ]

}

resource "aws_iam_role" "prometheus_external_dns_role" {
  name = "AmazonEKS_PrometheusExternalDNSRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.eks_oidc_provider.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "${replace(data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer, "https://", "")}:sub" = "system:serviceaccount:prometheus:prometheus-external-dns"
        }
      }
    }]
  })
    depends_on = [ aws_eks_cluster.marketplace-cluster,aws_iam_openid_connect_provider.eks_oidc_provider ]
}



resource "aws_iam_role" "grafana_external_dns_role" {
  name = "AmazonEKS_GrafanaExternalDNSRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.eks_oidc_provider.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "${replace(data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer, "https://", "")}:sub" = "system:serviceaccount:grafana:grafana-external-dns"
        }
      }
    }]
  })
    depends_on = [ aws_eks_cluster.marketplace-cluster,aws_iam_openid_connect_provider.eks_oidc_provider ]
}

# Kubernetes Service Account Creation
resource "kubernetes_service_account" "aws_load_balancer_controller" {
  metadata {
    name      = "aws-load-balancer-controller"
    namespace = "kube-system"
    annotations = {
      "eks.amazonaws.com/role-arn" = aws_iam_role.load_balancer_controller_role.arn
    }
  }
  depends_on = [ aws_iam_role.load_balancer_controller_role ]
}

resource "kubernetes_service_account" "ebs_csi_controller" {
  metadata {
    name      = "ebs-csi-controller-sa"
    namespace = "kube-system"
    annotations = {
      "eks.amazonaws.com/role-arn" = aws_iam_role.ebs_csi_driver_role.arn
    }
  }
    depends_on = [ aws_iam_role.ebs_csi_driver_role ]

}

resource "kubernetes_service_account" "external_dns" {
  metadata {
    name      = "gateway-external-dns"
    namespace = "production"
    annotations = {
      "eks.amazonaws.com/role-arn" = aws_iam_role.external_dns_role.arn
    }
  }
    depends_on=[kubernetes_namespace.production,aws_iam_role.external_dns_role]
}


resource "kubernetes_service_account" "prometheus_external_dns" {
  metadata {
    name      = "prometheus-external-dns"
    namespace = "prometheus"
    annotations = {
      "eks.amazonaws.com/role-arn" = aws_iam_role.external_dns_role.arn
    }
  }
    depends_on=[kubernetes_namespace.prometheus,aws_iam_role.prometheus_external_dns_role]
}

resource "kubernetes_service_account" "grafana_external_dns" {
  metadata {
    name      = "grafana-external-dns"
    namespace = "grafana"
    annotations = {
      "eks.amazonaws.com/role-arn" = aws_iam_role.external_dns_role.arn
    }
  }
    depends_on=[kubernetes_namespace.grafana,aws_iam_role.grafana_external_dns_role]
}

# Attach Policy to the Role
resource "aws_iam_role_policy_attachment" "load_balancer_controller_policy" {
  policy_arn = "arn:aws:iam::503561454536:policy/AWSLoadBalancerControllerIAMPolicy"
  role       = aws_iam_role.load_balancer_controller_role.name
  depends_on = [ aws_iam_role.load_balancer_controller_role ]
}
resource "aws_iam_role_policy_attachment" "ebs_csi_driver_policy" {
  policy_arn = "arn:aws:iam::503561454536:policy/Amazon_EBS_CSI_Driver"
  role       = aws_iam_role.ebs_csi_driver_role.name
  depends_on = [ aws_iam_role.ebs_csi_driver_role ]
}
resource "aws_iam_role_policy_attachment" "AmazonEC2FullAccess" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2FullAccess"
  role       = aws_iam_role.ebs_csi_driver_role.name
  depends_on = [ aws_iam_role.ebs_csi_driver_role ]
}


resource "aws_iam_role_policy_attachment" "external_dns_policy" {
  policy_arn = "arn:aws:iam::503561454536:policy/AllowExternalDNSUpdates"
  role       = aws_iam_role.external_dns_role.name
  depends_on = [ aws_iam_role.external_dns_role ]
}
resource "aws_iam_role_policy_attachment" "prometheus_external_dns_policy" {
  policy_arn = "arn:aws:iam::503561454536:policy/AllowExternalDNSUpdates"
  role       = aws_iam_role.prometheus_external_dns_role.name
    depends_on = [ aws_iam_role.prometheus_external_dns_role ]
}

resource "aws_iam_role_policy_attachment" "grafana_external_dns_policy" {
  policy_arn = "arn:aws:iam::503561454536:policy/AllowExternalDNSUpdates"
  role       = aws_iam_role.grafana_external_dns_role.name
    depends_on = [ aws_iam_role.grafana_external_dns_role ]
}


