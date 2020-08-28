# Nginx配置文件

## 1. 基本配置
- 主配置文件：/usr/local/nginx/conf/nginx.conf
- 通过`nginx -c`可以指定要读取的配置文件来启动
- Nginx常见的配置文件及作用：

|配置文件|作用|
|:-----:|:--|
|nginx.conf|nginx的基本配置文件|
|mime.types|MIME类型关联的扩展文件|
|fastcgi.conf|与fastcgi相关的配置文件|
|proxy.conf|与proxy相关的配置|
|sites.conf|配置nginx提供的网站，包括虚拟主机|

## 2. nginx.conf
nginx.conf的内容分为以下几段：
- main配置段：全局配置段，其中main配置段中可能包含event配置段。
- event{}：定义event模式工作特性。
- http{}：定义http协议相关配置。

配置指令（以分号结尾），格式如下：
```
derective value1 [value2 ... ...];
```

支持使用变量：
- 内置变量：模块会提供内置变量
- 自定义变量：`set var_name value`

## 3. 用于调试、定位问题的配置参数
注：主配置段
```
daemon {on|off};                            # 是否以守护进程运行进程nginx，调试时应设置为off
master_process {on|off};                    # 是否以master/worker模式来运行nginx，调试时可以设置为off
error_log 位置1 级别2;                       # 配置错误日志（位置与级别有以下选项）
```

## 4. 正常运行必备的配置参数
```
user USERNSME {GROUPNAME};                  # 指定运行worker进程的用户和组；
pid /path/to/pid_file;                      # 指定nginx守护进程的pid文件
worker_rlimit_nofile NUMBER;                # 设置所有worker进程最大可以打开的文件数，默认为1024；
worker_rlimit_core SIZE;                    # 指明所有worker进程所能够使用的总体的最大核心文件大小，保持默认即可
```

## 5. 优化性能的配置参数
```
worker_processse N;                         # 启动N个worker进程，这里的N为了避免上下文切换，通常设置为cpu总核数-1或等于总t核数
worker_cpu_affinity CPUMASK3 [CPUMASK…];    # 将进程绑定到某个CPU中，避免频繁刷新缓存
time_resolution INTERVAL;                   # 计时器解析度。降低此值，可减少gettimeofday()系统调用的次数
worker_priority NUMBER;                     # 指明worker进程的NICE值（优先级）
```

## 6. 事件相关配置
注：event{}段中的配置参数
```
use epoll;                                  # 多路复用I/O中的一种方式，仅用于linux2.6以上内核，大大提升nginx性能
accept_mutex {on|off};                      # master调度用户请求至各worker进程时使用的负载均衡锁，“on”表示能让多个worker轮流地、序列化地去响应新请求
lock_file FILE;                             # accept_nutex用到的互斥锁锁文件路径
use [epoll | rtsig | select | poll];        # 指明使用的事件模型，建议让nginx自行选择
worker_connections #;                       # 每个进程能够接受的最大连接数
multi_accept on;                            # 尽可能多的接受请求
```

## 7. fastcgi相关配置参数
- LNMP：php要启用fpm模型
- 配置示例如下：
```
location ~ \.php$ {
    root html;
    fastcgi_pass 127.0.0.1:9000;            # 定义反向代理
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /scripts$fastcgi_script_name;
    include fastcgi_params;
    # 注：当LNMP架构分台部署，“/scripts”需换成php的目录
}
```

## 8. 常需要调整的参数
```
worker_processes NUMBER                     # 启动NUMBER个worker进程
worker_cpu_affinity CPUMASK3                # 绑定CPU核心数
worker_connections NUMBER                   # 绑定的CPU核心每个最大连接数
worker_priorty NUMBER                       # 调整nice值
```

## 备注
- 原文地址：https://blog.csdn.net/WanJiaBaoBao/article/details/83349622