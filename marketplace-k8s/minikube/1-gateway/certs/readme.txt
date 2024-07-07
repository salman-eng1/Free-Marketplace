#The command below is used to create the certificate passphrase as secret
1- kubectl -n production create secret tls market-gateway-tls --key marketplace.com.key --cert marketplace.com.crt
2- minikube addons configure ingress 
3- add the cert path
4- disable then enable ingress