Apply Kube Config
```
aws eks update-kubeconfig --region us-east-2 --name ${EKS_CLUSTER_NAME:-nbp-development-eks-cluster}
```

Apply broswer
```
kubectl apply -f=browser.yaml
kubectl delete -f=browser.yaml
```

Ussage:
```
kubectl create namespace ingress-nginx
kubectl apply -f=nginx-ingress.1.9.5.yaml
kubectl get namespace
kubectl get deployments --namespace=nbp
kubectl get services
kubectl get pods
kubectl get pod,svc -n nbp
kubectl get ingress -n nbp
aws route53 list-hosted-zones
aws acm list-certificates --region us-east-1 
```

Set Up Ngix Ingress Controller
```
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
 helm repo update
helm upgrade --install ingress-nginx ingress-nginx \
             --repo https://kubernetes.github.io/ingress-nginx \
             --namespace ingress-nginx --create-namespace
# Check
kubectl get pods -n ingress-nginx
```

Apply Ingress
```
kubectl apply -f=ingress.yaml
```

Trouble
```
kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
```