#Create cluster
eksctl create cluster \
--name=marketplace \
--region=us-east-1 \
--vpc-private-subnets=subnet-0f4a5d7dba0ee169f,subnet-0ec2a1b63b1524b6b  \
--without-nodegroup

#Associate IAM ODIC
eksctl utils associate-iam-oidc-provider \
--region=us-east-1 \
--cluster=marketplace \
--approve

#AWSS Create EKS Node group with private subnets

eksctl create nodegroup --cluster=marketplace \
--region=us-east-1 \
--subnet-ids=subnet-0f4a5d7dba0ee169f,subnet-0ec2a1b63b1524b6b \
--node-type=t2.micro \
--nodes=4 \
--nodes-min=4 \
--nodes-max=6 \
--node-volume-size=20 \
--ssh-access=true \
--ssh-public-key=marketplace \ //the path to the ssh key downloaded from amazon
--managed \
--asg-access \
--external-dns-access=true \
--full-ecr-access \
--appmesh-access \
--alb-ingress-access \
--node-private-networking


#Delete eks cluster
#eksctl delete marketplave --region=us-east-1   //this will delete all cluster resources including worker nodes

