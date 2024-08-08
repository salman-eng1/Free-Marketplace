#Create cluster
eksctl create cluster \
--name=marketplace \
--region=us-east-1 \
--vpc-private-subnets=subnet-094c46154d142189b,subnet-00ee0862b620fd1a4 \
--without-nodegroup

#Associate IAM ODIC
eksctl utils associate-iam-oidc-provider \
--region=us-east-1 \
--cluster=marketplace \
--approve

#AWSS Create EKS Node group with private subnets

eksctl create nodegroup --cluster=marketplace \
--region=us-east-1 \
--subnet-ids=subnet-094c46154d142189b,subnet-00ee0862b620fd1a4 \
--node-type=t2.micro \
--nodes=4 \
--nodes-min=4 \
--nodes-max=6 \
--node-volume-size=20 \
--ssh-access=true \
--ssh-public-key=marketplace \
--managed \
--asg-access \
--external-dns-access=true \
--full-ecr-access \
--appmesh-access \
--alb-ingress-access \
--node-private-networking


#Delete eks cluster
#eksctl delete cluster marketplace --region=us-east-1   //this will delete all cluster resources including worker nodes

#kubectl create -n production
#kubectl apply -f marketplace-secrets/*
