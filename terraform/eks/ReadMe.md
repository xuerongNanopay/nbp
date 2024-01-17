Initial:
```
terraform apply -var-file="dev.tfvars"
```
Remove:
```
terraform destory -var-file="dev.tfvars"
```
Apply Kube Config
```
aws eks update-kubeconfig --region us-east-2 --name eks
```
Test
```
kubectl run testpod --image=nginx
kubectl get pods --watch
```