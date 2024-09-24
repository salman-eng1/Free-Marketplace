# Required provider
provider "helm" {
  kubernetes {
    host                   = data.aws_eks_cluster.cluster.endpoint
    cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
    token                  = data.aws_eks_cluster_auth.cluster_auth.token
  }
}

# Helm release for Prometheus
resource "helm_release" "prometheus" {
  name       = "prometheus"
  namespace  = "prometheus"
  chart      = "prometheus"
  repository = "https://prometheus-community.github.io/helm-charts"
  version    = "25.0.0" # Specify the desired version of Prometheus

  set {
    name  = "alertmanager.persistence.enabled"
    value = "true"
  }

  set {
    name  = "alertmanager.persistence.size"
    value = "8Gi"
  }

  set {
    name  = "alertmanager.persistence.storageClass"
    value = "gp2"
  }

  set {
    name  = "server.persistentVolume.storageClass"
    value = "gp2"
  }
  set {
    name  = "prometheus.service.type"
    value = "NodePort"
  }

  values = [<<EOF
serviceAccount:
  create: false
  name: "ebs-csi-controller-sa"
EOF
  ]


  depends_on = [aws_eks_node_group.marketplace-node-group,helm_release.aws_ebs_csi_driver, kubernetes_service_account.ebs_csi_controller, kubernetes_namespace.prometheus]
}

# Helm release for AWS EBS CSI Driver
resource "helm_release" "aws_ebs_csi_driver" {
  name       = "aws-ebs-csi-driver"
  namespace  = "kube-system"
  chart      = "aws-ebs-csi-driver"
  repository = "https://kubernetes-sigs.github.io/aws-ebs-csi-driver"
  version    = "2.10.0" # Specify the desired version of the AWS EBS CSI Driver

  set {
    name  = "controller.serviceAccount.create"
    value = "false"
  }

  set {
    name  = "controller.serviceAccount.name"
    value = "ebs-csi-controller-sa"
  }

  set {
    name  = "controller.serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = aws_iam_role.ebs_csi_driver_role.arn
  }

  depends_on = [aws_eks_node_group.marketplace-node-group,kubernetes_service_account.ebs_csi_controller]
}



resource "helm_release" "aws_load_balancer_controller" {
  name       = "aws-load-balancer-controller"
  namespace  = "kube-system"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  version    = "1.8.2"
  set {
    name  = "clusterName"
    value = "marketplace-cluster"
  }

  set {
    name  = "serviceAccount.create"
    value = "false"
  }

  set {
    name  = "serviceAccount.name"
    value = "aws-load-balancer-controller"
  }

  set {
    name  = "region"
    value = "us-east-1"
  }

  set {
    name  = "vpcId"
    value = var.vpc_id
  }

  set {
    name  = "image.repository"
    value = "602401143452.dkr.ecr.us-east-1.amazonaws.com/amazon/aws-load-balancer-controller"
  }

  depends_on = [aws_eks_node_group.marketplace-node-group,kubernetes_service_account.aws_load_balancer_controller]
}






resource "helm_release" "grafana" {
  name       = "grafana"
  namespace  = "grafana"
  chart      = "grafana"
  repository = "https://grafana.github.io/helm-charts"
  version    = "7.0.0" # Specify the desired version of Prometheus

  
  set {
    name  = "persistence.storageClassName"
    value = "gp2"
  }

  set {
    name  = "prometheus.service.type"
    value = "NodePort"
  }
  set {
    name  = "adminPassword"
    value = "marketplace"
  }

  depends_on = [aws_eks_node_group.marketplace-node-group,helm_release.prometheus, kubernetes_service_account.ebs_csi_controller, kubernetes_namespace.prometheus]
}
