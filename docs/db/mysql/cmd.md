# MySQL常用命令

## 1. 表操作
### 1.1 修改unique key
```sql
alter table table_name drop index `unk_name`;
alter table table_name add unique key `new_uk_name` (`col1`, `col2`);
```

### 1.2 添加key
```sql
alter table table_name add key `new_key_ref` (`col1`, `col2`);
```

## 2. 权限
### 2.1 创建用户
```sql
create user 'username'@'host' identified by 'password';
```
说明：
- username：你将创建的用户名。
- host：指定该用户在哪台主机上可以登录，如果本地用户可以是localhost，如果想让该用户可以从任意远程主机登录，可以使用通配符`%`。
- password：该用户的登录密码,密码可以为空,如果为空则该用户可以不需要密码登陆服务器。

例子：
```sql
create user 'dog'@'localhost' identified by '123456';
create user 'pig'@'192.168.1.101' identified by '123456';
create user 'pig'@'%' identified by '123456';
create user 'pig'@'%' identified by '';
create user 'pig'@'%';
```

### 2.2 为用户授权
首先，为用户创建一个数据库（monitor）
```sql
create database monitor;
```
然后，授权用户（ups）拥有monitor数据库的所有权限
```sql
grant all on monitor.* to 'ups'@'%' identified by 'password';
```
刷新系统权限表
```sql
flush privilages;
```

- 权限1, 权限2, …权限n代表select, insert, update, delete, create, drop, index, alter, grant, references, reload, shutdown, process, file等14个权限。
- 当权限1, 权限2, …权限n被all privileges或者all代替，表示赋予用户全部权限。
- 当数据库名称.表名称被*.*代替，表示赋予用户操作服务器上所有数据库所有表的权限。
- 用户地址可以是localhost，也可以是ip地址、机器名字、域名。也可以用’%’表示从任何地址连接。
- ‘连接口令’不能为空，否则创建失败。

例如：
```sql
grant select,insert,update,delete,create,drop on monitor.user to 'ups'@'192.168.1.101' identified by '123456';
```
给来自192.168.1.101的用户ups分配可对数据库monitor的user表进行select, insert, update, delete, create, drop等操作的权限，并设定口令为123456。

### 2.3 撤销用户权限
```sql
revoke privilege on monitor.user from 'ups'@'192.168.1.101';
```
说明：privilege同授权部分。

例子：
```sql
revoke select on *.* from 'ups'@'%';
```

