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
kubectl get deployments
kubectl get services
kubectl get pods
```