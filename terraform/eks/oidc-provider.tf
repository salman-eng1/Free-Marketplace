data "aws_eks_cluster" "cluster" {
  name = aws_eks_cluster.marketplace-cluster.name
}

data "aws_eks_cluster_auth" "cluster_auth" {
  name = aws_eks_cluster.marketplace-cluster.name
}
resource "aws_iam_openid_connect_provider" "eks_oidc_provider" {
  url             = data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["9e99a48a9960b14926bb7f3b02e22da2b0ab7280"]
}

