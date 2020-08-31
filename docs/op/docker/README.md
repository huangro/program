# Docker基本使用

## 1. Docker简介
Docker是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的镜像中，然后发布任何流行的Linux或Windows机器上。使用Docker可以更方便地打包、测试以及部署应用程序。

## 2. Docker环境安装
### 2.1 安装yum-utils
```bash
yum install -y yum-utils device-mapper-persistent-data lvm2
```

### 2.2 为yum源添加docker仓库位置
```bash
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

### 2.3 安装docker
```bash
yum install docker-ce
```

### 2.4 启动docker
```bash
systemctl start docker
```

## 3. Docker镜像常用命令
###  3.1 搜索镜像
```bash
docker search java
```

### 3.2 下载镜像
```bash
docker pull java:8
```

### 3.3 查找镜像支持的版本
由于docker search命令只能查找出是否有该镜像，不能找到该镜像支持的版本，所以我们需要通过docker hub来搜索支持的版本。

进入docker hub的官网，地址：https://hub.docker.com/

然后搜索需要的镜像，找到后查找镜像支持的版本，然后进行镜像的下载操作：
```bash
docker pull nginx:1.17.0
```

### 3.4 列出镜像
```bash
docker images
```

### 3.5 删除镜像
#### 3.5.1 指定名称删除镜像
```bash
docker rmi java:8
```

#### 3.5.2 指定名称删除镜像（强制）
```bash
docker rmi -f java:8
```

#### 3.5.3 删除所有没有引用的镜像
```bash
docker rmi `docker images|grep none|awk '{print $3}'`
```

#### 3.5.4 强制删除所有镜像
```bash
docker rmi -f ${docker images}
```

## 4. Docker容器常用命令
### 4.1 新建并启动容器
```bash
docker run -p 80:80 --nane nginx -d nginx:1.17.0
```
- `-d`选项：表示后台运行
- `--name`选项：指定运行后容器的名字为nginx，之后可以通过名字来操作容器
- `-p`选项：指定端口映射，格式为：`hostPort:containerPort`

### 4.2 列出容器
#### 4.2.1 列出运行中的容器
```bash
docker ps
```

#### 4.2.2 列出所有容器
```bash
docker ps -a
```

### 4.3 停止容器
```bash
docker stop $containerName
# 或者
docker stop $containerId
```

### 4.4 强制停止容器
```bash
docker kill $containerName
# 或者
docker kill $containerId
```

### 4.5 启动已停止的容器
```bash
docker start $containerName
# 或者
docker start $containerId
```

### 4.6 进入容器
#### 4.6.1 查出容器的pid
```bash
docker inspect --format "{{.State.Pid}}" $containerName
# 或者
docker inspect --format "{{.State.Pid}}" $containerId
```

#### 4.6.2 根据容器pid进入容器
```bash
nsenter --target "$pid" --mount --uts --ipc --net --pid
```

### 4.7 删除容器
#### 4.7.1 删除指定容器
```bash
docker rm $containerName
# 或者
docker rm $containerId
```

#### 4.7.2 按名称删除容器
```bash
docker rm `docker ps -a|grep 容器名称*|awk '{print $1}'`
```

#### 4.7.3 强制删除所有容器
```bash
docker rm -f ${docker ps -a -q}
```

### 4.8 查看容器的日志
#### 4.8.1 查看当前全部日志
```bash
docker logs $ContainerName(或者$ContainerId)
```

#### 4.8.2 动态查看日志
```bash
docker logs $ContainerName(或者$ContainerId) -f
```

### 4.9 查看容器的IP地址
```bash
docker inspect --format '{{ .NetworkSettings.IPAddress }}' $ContainerName(或者$ContainerId)
```

### 4.10 修改容器的启动方式
```bash
docker container update --restart=always $ContainerName
```

### 4.11 同步宿主机时间到容器
```bash
docker cp /etc/localtime $ContainerName(或者$ContainerId):/etc/
```

### 4.12 指定容器时区
```bash
bash docker run -p 80:80 --name nginx \e TZ="Asia/Shanghai" \d nginx:1.17.0
```

### 4.13 在宿主机查看docker使用cpu、内容、网络、io情况
#### 4.13.1 查看指定容器情况
```bash
docker stats $ContainerName(或者$ContainerId)
```

#### 4.13.2 查看所有容器情况
```bash
docker stats -a
```

### 4.14 查看Docker磁盘使用情况
```bash
docker system df
```

### 4.15 进入Docker容器内部的bash
```bash
docker exec -it $ContainerName /bin/bash
```

### 4.16 Docker创建外部网络
```bash
docker network create -d bridge my-bridge-network
```

## 5. 修改Docker镜像的存放位置
### 5.1 查看Docker镜像的存放位置
```bash
docker info | grep "Docker Root Dir"
```

### 5.2 关闭Docker服务
```bash
systemctl stop docker
```

### 5.3 移动目录到目标路径
```bash
mv /var/lib/docker /mydata/docker
```

### 5.4 建立软链接
```bash
ln -s /mydata/docker /var/lib/docker
```