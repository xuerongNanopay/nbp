create nbp database:
```
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/xrw_ec2 ubuntu@nbp.xrw.io 'sudo docker exec -i mysql_8 sh -c "exec mysql -u root -p123456 -e \"create database nbp\""'
```
restore nbp database:
```
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/xrw_ec2 ubuntu@nbp.xrw.io 'sudo docker exec -i mysql_8 sh -c "exec mysql -u root -p123456 nbp < /tmp/nbp.sql"'
```
build compose
```
sudo docker compose -f=/home/ubuntu/nbp/docker/nbp-ec2-compose/docker-compose.yaml build
```
```
sudo docker compose -f=/home/ubuntu/nbp/docker/nbp-ec2-compose/docker-compose-db.yaml build
```
down compose
```
sudo docker compose -f=/home/ubuntu/nbp/docker/nbp-ec2-compose/docker-compose.yaml down
```
up compose
```
sudo docker compose -f=/home/ubuntu/nbp/docker/nbp-ec2-compose/docker-compose.yaml up
```
```
sudo docker compose -f=/home/ubuntu/nbp/docker/nbp-ec2-compose/docker-compose-db.yaml up
```