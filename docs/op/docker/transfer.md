# Docker容器的跨服务器迁移

### 1. 把当前的容器提交为一个镜像
```bash
docker commit 容器名 镜像名
```

### 2. 将镜像存为tar文件
```bash
docker save 镜像名 < 备份文件.tar
```

### 3. 将备份文件复制到目的主机下
使用scp，rsync，ftp等等都可以

### 4. 将备份文件.tar恢复为镜像
```bash
docker load < 备份文件.tar
```

### 5. 根据镜像重新运行容器
```bash
docker run --name='容器名' -镜像名
```

### 6. 运行脚本示例
```bash
#!/bin/bash
 
docker run --name postgresdb -v /Users/Shared/docker/pgdata:/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_PASSWORD=Q1w2e3r4t5 -d postgres
 
docker run -d --name confluence -v /Users/Shared/docker/cfdata:/var/atlassian/confluence/ -v /Users/Shared/docker/cfdata:/var/atlassian/application-data/ -p 8090:8090 --link postgresdb:db --user root:root cptactionhank/atlassian-confluence

```