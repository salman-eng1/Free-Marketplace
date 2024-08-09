#Create cluster
eksctl create cluster \
--name=marketplace \
--region=us-east-1 \
--vpc-private-subnets=subnet-092e76e142f707da9,subnet-0d9637e1d3e42baa2 \
--without-nodegroup

#Associate IAM ODIC
eksctl utils associate-iam-oidc-provider \
--region=us-east-1 \
--cluster=marketplace \
--approve

#AWSS Create EKS Node group with private subnets

eksctl create nodegroup --cluster=marketplace \
--region=us-east-1 \
--subnet-ids=subnet-092e76e142f707da9,subnet-0d9637e1d3e42baa2 \
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

#download the iam_role policy
curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.7.2/docs/install/iam_policy.json

#create the policy using the iam_role
aws iam create-policy \
    --policy-name AWSLoadBalancerControllerIAMPolicy \
    --policy-document file://iam_policy.json

#create the kubernetes service account named as aws-load-balancer-controller in the kube-system namespace
# replace the arn with the arn used in the created policy
eksctl create iamserviceaccount \
  --cluster=marketplace \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --attach-policy-arn=arn:aws:iam::193003523648:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve
#Delete eks cluster
#eksctl delete cluster marketplace --region=us-east-1   //this will delete all cluster resources including worker nodes

#kubectl create -n production
#kubectl apply -f marketplace-secrets/*


# install helm
#sudo snap install helm --classic
#add bitnami repo
#helm repo add bitnami https://charts.bitnami.com/bitnami
#update repo
#helm repo update 

# add the charts to your  in order to install the aws loadbalancer controller
#helm repo add eks https://aws.github.io/eks-charts
#update repo
#helm repo update 

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=marketplace \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --set region=us-east-1 \
  --set vpcId=vpc-05f142f6bf978fcb6 \
  --set image.repository=602401143452.dkr.ecr.us-east-1.amazonaws.com/amazon/aws-load-balancer-controller \
