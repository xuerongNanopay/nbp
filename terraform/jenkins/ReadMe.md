Login int to instance: 
```
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/xrw_ec2 ubuntu@jenkins.xrw.io
```
Start jenkins
```
cd ~/jenkins_docker && sudo docker compose up -d
```