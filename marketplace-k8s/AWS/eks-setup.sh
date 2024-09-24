#Create cluster
eksctl create cluster \
--name=marketplace-cluster \
--region=us-east-1 \
--vpc-private-subnets=subnet-02d15b4e6ec96ce5f,subnet-04a7cae8a119bb6db \
--without-nodegroup

#Associate IAM ODIC
eksctl utils associate-iam-oidc-provider \
--region=us-east-1 \
--cluster=marketplace-cluster \
--approve

#AWSS Create EKS Node group with private subnets

eksctl create nodegroup --cluster=marketplace-cluster \
--region=us-east-1 \
--subnet-ids=subnet-02d15b4e6ec96ce5f,subnet-04a7cae8a119bb6db \
--node-type=t3.medium \
--nodes=4 \
--nodes-min=2 \
--nodes-max=4 \
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

# the link below is the guide to install aws load-balancer using helm
#https://docs.aws.amazon.com/eks/latest/userguide/lbc-helm.html

#download the iam_role policy
curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.7.2/docs/install/iam_policy.json

#create the policy using the iam_role
aws iam create-policy \
    --policy-name AWSLoadBalancerControllerIAMPolicy \
    --policy-document file://iam_policy.json

#create the kubernetes service account named as aws-load-balancer-controller in the kube-system namespace
# replace the arn with the arn used in the created policy
eksctl create iamserviceaccount \
  --cluster=marketplace-cluster \
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

# add the charts to your cluster in order to install the aws loadbalancer controller
#helm repo add eks https://aws.github.io/eks-charts
#update repo
#helm repo update 

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=marketplace-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --set region=us-east-1 \
  --set vpcId=vpc-01d9a2e0f5d821079 \
  --set image.repository=602401143452.dkr.ecr.us-east-1.amazonaws.com/amazon/aws-load-balancer-controller \

#unistall loadbalancer
#helm uninstall aws-load-balancer-controller -n kube-system
# eksctl delete iamserviceaccount \
#   --cluster=marketplace-cluster \
#   --namespace=kube-system \
#   --name=aws-load-balancer-controller

# create service account for external dns after creating the needed policy
eksctl create iamserviceaccount \
  --cluster=marketplace-cluster \
  --namespace=production \
  --name=gateway-external-dns \
  --attach-policy-arn=arn:aws:iam::193003523648:policy/AllowExternalDNSUpdates \
  --approve


eksctl create iamserviceaccount \
        --name ebs-csi-controller-sa \
        --namespace kube-system \
        --cluster marketplace-cluster \
        --role-name AmazonEKS_EBS_CSI_DriverRole \
        --role-only \
        --attach-policy-arn arn:aws:iam::193003523648:policy/Amazon_EBS_CSI_Driver \
        --approve
    

    # aws iam attach-role-policy \
    # --role-name eksctl-marketplace-cluster-nodegro-NodeInstanceRole-omczcUWECjr9 \
    # --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess


  # install ebs-csi-driver
helm repo add aws-ebs-csi-driver https://kubernetes-sigs.github.io/aws-ebs-csi-driver
helm repo update

helm upgrade --install aws-ebs-csi-driver \
    --namespace kube-system \
    aws-ebs-csi-driver/aws-ebs-csi-driver



    #install prometheus
kubectl create namespace prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm upgrade -i prometheus prometheus-community/prometheus \
    --namespace prometheus \
    --set alertmanager.persistence.storageClass="gp2" \
    --set server.persistentVolume.storageClass="gp2"  \
    --set prometheus.service.type=NodePort     
            
kubectl get pods -n prometheus


#install grafana
helm install grafana grafana/grafana --namespace grafana   --set persistence.storageClassName="gp2"   --set persistence.size="10Gi"   --set persistence.enabled=true   --set adminPassword="marketplace"   --set service.type=NodePort
