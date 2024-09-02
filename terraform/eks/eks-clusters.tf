resource "aws_eks_cluster" "marketplace-cluster" {
  name     = "marketplace-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids = [var.subnet_ids[0], var.subnet_ids[1]]
  }

  depends_on = [
    aws_iam_role.eks_cluster_role,
  ]
}


resource "aws_eks_node_group" "marketplace-node-group" {
  cluster_name    = aws_eks_cluster.marketplace-cluster.name
  node_group_name = "marketplace-node-group"
  node_role_arn   = aws_iam_role.eks_worker_node_role.arn
  subnet_ids      = var.subnet_ids

  scaling_config {
    desired_size = 2
    max_size     = 4
    min_size     = 2
  }
  update_config {
    max_unavailable = 1
  }
instance_types = ["t3.medium"]
remote_access {
  ec2_ssh_key="marketplace"
  source_security_group_ids = [var.sg_ids]
}
disk_size = 20
  # Ensure that IAM Role permissions are created before and deleted after EKS Node Group handling.
  # Otherwise, EKS will not be able to properly delete EC2 Instances and Elastic Network Interfaces.
  depends_on = [
    aws_iam_role.eks_worker_node_role
  ]
}

