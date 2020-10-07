# TDengine快速上手

## 1. 快捷安装
TDengine软件分为服务器、客户端和报警模块三部分，目前2.0版的服务器程序taosd仅能在Linux系统上安装和运行，后续会支持Windows、MAC OS等系统。客户端可以在Windows或Linux上安装和运行。任何OS的应用也可以选择RESTful接口连接服务器taosd。硬件支持X64，后续会支持ARM、龙芯等CPU系统。用户可根据需求选择通过[源码](https://www.taosdata.com/cn/getting-started/#%E9%80%9A%E8%BF%87%E6%BA%90%E7%A0%81%E5%AE%89%E8%A3%85)或者[安装包](https://www.taosdata.com/cn/getting-started/#%E9%80%9A%E8%BF%87%E5%AE%89%E8%A3%85%E5%8C%85%E5%AE%89%E8%A3%85)来安装。

### 1.1 通过源码安装
请参考我们的[TDengine github](https://github.com/taosdata/TDengine)主页下载源码并安装。

### 1.2 通过Docker容器运行
直接运行：
```bash
docker pull tdengine/tdengine
docker run tdengine/tdengine
```
即可。
请参考[TDengine官方Docker镜像的发布、下载和使用](https://www.taosdata.com/blog/2020/05/13/1509.html)

可执行脚本：
```bash
#!/bin/bash

docker run -d -v /Users/Shared/etc/taos:/etc/taos -p 6030:6030 -p 6035:6035 -p 6041:6041 -p 6030-6040:6030-6040/udp tdengine/tdengine:latest
```


### 1.3 通过安装包安装
服务器部分，我们提供三种安装包，您可以根据需要选择。TDengine的安装非常简单，从下载到安装成功仅仅只要几秒钟。
- TDengine-server-2.0.4.0-Linux-x64.rpm (4.2M)
- TDengine-server-2.0.4.0-Linux-x64.deb (2.7M)
- TDengine-server-2.0.4.0-Linux-x64.tar.gz (4.5M)

客户端部分，Linux和Windows安装包如下：
- TDengine-client-2.0.4.0-Linux-x64.tar.gz (3.0M)
- TDengine-client-2.0.4.0-Windows-x64.exe (3.1M)

报警模块的Linux安装包如下（请参考报警模块的使用方法）：
- TDengine-alert-2.0.4.0-Linux-x64.tar.gz (8.1M)

如果想下载最新beta版及之前版本的安装包，请点击[这里](https://www.taosdata.com/cn/all-downloads/)

目前，TDengine只支持在使用systemd做进程服务管理的linux系统上安装。其他linux系统的支持正在开发中。用which命令来检测系统中是否存在systemd:
```bash
which systemd
```

如果系统中不存在systemd命令，请考虑[通过源码安装](https://www.taosdata.com/cn/getting-started/#%E9%80%9A%E8%BF%87%E6%BA%90%E7%A0%81%E5%AE%89%E8%A3%85)TDengine。

具体的安装过程，请参见[TDengine多种安装包的安装和卸载](https://www.taosdata.com/blog/2019/08/09/566.html)。

## 2. 轻松启动
安装成功后，用户可使用systemctl命令来启动TDengine的服务进程。
```bash
systemctl start taosd
```
检查服务是否正常工作。
```bash
systemctl status taosd
```
如果TDengine服务正常工作，那么您可以通过TDengine的命令行程序taos来访问并体验TDengine。
注意：
- systemctl 命令需要 root 权限来运行，如果您非 root 用户，请在命令前添加 sudo
- 为更好的获得产品反馈，改善产品，TDengine会采集基本的使用信息，但您可以修改系统配置文件taos.cfg里的配置参数telemetryReporting, 将其设为0，就可将其关闭。
- TDengine采用FQDN(一般就是hostname)作为节点的ID，为保证正常运行，需要给运行taosd的服务器配置好hostname, 在客户端应用运行的机器配置好DNS服务或hosts文件，保证FQDN能够解析。

## 3. TDengine命令行程序
执行TDengine命令行程序，您只要在Linux终端执行taos即可
```
taos
```

如果TDengine终端链接服务成功，将会打印出欢迎消息和版本信息。如果失败，则会打印错误消息出来（请参考FAQ来解决终端链接服务端失败的问题）。TDengine终端的提示符号如下：
> taos

在TDengine终端中，用户可以通过SQL命令来创建/删除数据库、表等，并进行插入查询操作。在终端中运行的SQL语句需要以分号结束来运行。示例：
```sql
create database db;
use db;
create table t (ts timestamp, cdata int);
insert into t values ('2019-07-15 00:00:00', 10);
insert into t values ('2019-07-15 01:00:00', 20);
select * from t;
          ts          |   speed   |
===================================
 19-07-15 00:00:00.000|         10|
 19-07-15 01:00:00.000|         20|
Query OK, 2 row(s) in set (0.001700s)
```

除执行SQL语句外，系统管理员还可以从TDengine终端检查系统运行状态，添加删除用户账号等。

### 3.1 命令行参数
您可通过配置命令行参数来改变TDengine终端的行为。以下为常用的几个命令行参数：
- -c, --config-dir: 指定配置文件目录，默认为/etc/taos
- -h, --host: 指定服务的IP地址，默认为本地服务
- -s, --commands: 在不进入终端的情况下运行TDengine命令
- -u, -- user: 链接TDengine服务器的用户名，缺省为root
- -p, --password: 链接TDengine服务器的密码，缺省为taosdata
- -?, --help: 打印出所有命令行参数

示例：
```sql
taos -h 192.168.0.1 -s "use db; show tables;"
```

### 3.2 运行SQL命令脚本
TDengine终端可以通过source命令来运行SQL命令脚本.
```sql
taos> source <filename>;
```

### 3.3 Shell小技巧
- 可以使用上下光标键查看已经历史输入的命令
- 修改用户密码。在shell中使用alter user命令
- ctrl+c 中止正在进行中的查询
- 执行RESET QUERY CACHE清空本地缓存的表的schema

注意：如果从不同于taosd运行的机器运行taos, 请注意该机器的DNS或hosts文件的配置，该机器需要能正确解析服务器的hostname, 否则taos无法正常工作。

## 4. TDengine极速体验
启动TDengine的服务，在Linux终端执行taosdemo
```
> taosdemo
```

该命令将在数据库test下面自动创建一张超级表meters，该超级表下有1万张表，表名为"t0" 到"t9999"，每张表有10万条记录，每条记录有 （f1, f2， f3）三个字段，时间戳从`2017-07-14 10:40:00 000` 到`2017-07-14 10:41:39 999`，每张表带有标签areaid和loc, areaid被设置为1到10, loc被设置为"beijing"或者“shanghai"。

执行这条命令大概需要10分钟，最后共插入10亿条记录。执行这条命令大概需要10分钟，最后共插入10亿条记录，需要约2.1G硬盘空间。

在TDengine客户端输入查询命令，体验查询速度。

- 查询超级表下记录总条数：
```sql
select count(*) from test.meters;
```

- 查询10亿条记录的平均值、最大值、最小值等：
```sql
select avg(f1), max(f2), min(f3) from test.meters;
```

- 查询loc="beijing"的记录总条数：
```sql
select count(*) from test.meters where loc="beijing";
```

- 查询areaid=10的所有记录的平均值、最大值、最小值等：
```sql
select avg(f1), max(f2), min(f3) from test.meters where areaid=10;
```

- 对表t10按10s进行平均值、最大值和最小值聚合统计：
```sql
select avg(f1), max(f2), min(f3) from test.t10 interval(10s);
```

*Note:* taosdemo命令本身带有很多选项，配置表的数目、记录条数等等，请执行 taosdemo --help详细列出。您可以设置不同参数进行体验。

原始文档：https://www.taosdata.com/cn/getting-started/




