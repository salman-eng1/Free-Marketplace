# Data source to get the EKS cluster details
data "aws_eks_cluster" "cluster" {
  name = "marketplace-cluster"  # Reference the cluster name directly as a string
  depends_on = [ aws_eks_cluster.marketplace-cluster ]
}

# Data source to get the authentication information for the EKS cluster
data "aws_eks_cluster_auth" "cluster_auth" {
  name = data.aws_eks_cluster.cluster.name  # Reference the cluster name from the data source
}

# Create the OIDC provider required for service account roles in the EKS cluster
resource "aws_iam_openid_connect_provider" "eks_oidc_provider" {
  url             = data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer  # Use the correct data source reference
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["9e99a48a9960b14926bb7f3b02e22da2b0ab7280"]
}
