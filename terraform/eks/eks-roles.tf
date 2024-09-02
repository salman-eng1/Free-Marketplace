resource "aws_iam_role" "eks_cluster_role" {
  name = "eks_cluster_role"


  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "eks.amazonaws.com"
        }
      },
    ]
  })

}




resource "aws_iam_role" "eks_worker_node_role" {
  name = "eks_worker_node_role"


  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })

}



resource "aws_iam_policy_attachment" "AmazonEKSClusterPolicy" {
  name       = "eks-cluster-attachment"
  roles      = [aws_iam_role.eks_cluster_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

resource "aws_iam_policy_attachment" "AmazonEKSVPCResourceController" {
  name       = "eks-vpc-resource-controller-attachment"
  roles      = [aws_iam_role.eks_cluster_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
}
resource "aws_iam_policy_attachment" "AmazonEKS_CNI_Policy" {
  name       = "eks-cni-attachment"
  roles      = [aws_iam_role.eks_worker_node_role.name]
  policy_arn = "arn:aws:iam::193003523648:policy/AmazonEKS_CNI_Policy"
}

resource "aws_iam_policy_attachment" "Amazon_EBS_CSI_Policy" {
  name       = "eks-cni-attachment"
  roles      = [aws_iam_role.eks_worker_node_role.name]
  policy_arn = "arn:aws:iam::193003523648:policy/Amazon_EBS_CSI_Driver"
}

resource "aws_iam_policy_attachment" "AmazonEKSWorkerNodePolicy" {
  name       = "eks-worker_node-attachment"
  roles      = [aws_iam_role.eks_worker_node_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

resource "aws_iam_policy_attachment" "AmazonEC2ContainerRegistryReadOnly" {
  name       = "eks-ecr-attachment"
  roles      = [aws_iam_role.eks_worker_node_role.name]
  policy_arn = "arn:aws:iam::193003523648:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy_attachment" "AWSAppMeshFullAccess" {
  policy_arn = "arn:aws:iam::aws:policy/AWSAppMeshFullAccess"
  role       = aws_iam_role.eks_worker_node_role.name
}

resource "aws_iam_role_policy_attachment" "AWSLoadBalancerControllerIAMPolicy" {
  policy_arn = "arn:aws:iam::193003523648:policy/AWSLoadBalancerControllerIAMPolicy"
  role       = aws_iam_role.eks_worker_node_role.name
}
# resource "aws_iam_role_policy_attachment" "AWSLoadBalancerControllerIAMPolicy_load_balancer" {
#   policy_arn = "arn:aws:iam::193003523648:policy/AWSLoadBalancerControllerIAMPolicy"
#   role       = aws_iam_role.aws_load_balancer_controller_role.name
# }
resource "aws_iam_role_policy_attachment" "AllowExternalDNSUpdates" {
  policy_arn = "arn:aws:iam::193003523648:policy/AllowExternalDNSUpdates"
  role       = aws_iam_role.eks_worker_node_role.name
}

resource "aws_iam_role_policy_attachment" "AmazonEC2AutoScalingFullAccess" {
  policy_arn = "arn:aws:iam::193003523648:policy/AmazonEC2AutoScalingFullAccess"
  role       = aws_iam_role.eks_worker_node_role.name
}