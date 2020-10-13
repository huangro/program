# TAOS SQL
## 1. 简介
本文档说明TAOS SQL支持的语法规则、主要查询功能、支持的SQL查询函数，以及常用技巧等内容。阅读本文档需要读者具有基本的SQL语言的基础。

TAOS SQL是用户对TDengine进行数据写入和查询的主要工具。TAOS SQL为了便于用户快速上手，在一定程度上提供类似于标准SQL类似的风格和模式。严格意义上，TAOS SQL并不是也不试图提供SQL标准的语法。此外，由于TDengine针对的时序性结构化数据不提供修改和更新功能，因此在TAO SQL中不提供数据更新和数据删除的相关功能。

本章节SQL语法遵循如下约定：
- < > 里的内容是用户需要输入的，但不要输入<>本身
- [ ] 表示内容为可选项，但不能输入[]本身
- | 表示多选一，选择其中一个即可，但不能输入|本身
- ... 表示前面的项可重复多个

为更好地说明SQL语法的规则及其特点，本文假设存在一个数据集。以智能电表(meters)为例，假设每个智能电表采集电流、电压、相位三个量。其建模如下：
```
taos> DESCRIBE meters;
             Field              |        Type        |   Length    |    Note    |
=================================================================================
 ts                             | TIMESTAMP          |           8 |            |
 current                        | FLOAT              |           4 |            |
 voltage                        | INT                |           4 |            |
 phase                          | FLOAT              |           4 |            |
 location                       | BINARY             |          64 | TAG        |
 groupid                        | INT                |           4 | TAG        |
```
数据集包含4个智能电表的数据，按照TDengine的建模规则，对应4个子表，其名称分别是 d1001, d1002, d1003, d1004。

## 2. 支持的数据类型
使用TDengine，最重要的是时间戳。创建并插入记录、查询历史记录的时候，均需要指定时间戳。时间戳有如下规则：
- 时间格式为`YYYY-MM-DD HH:mm:ss.MS`, 默认时间分辨率为毫秒。比如：`2017-08-12 18:25:58.128`
- 内部函数now是服务器的当前时间
- 插入记录时，如果时间戳为now，插入数据时使用服务器当前时间
- Epoch Time: 时间戳也可以是一个长整数，表示从`1970-01-01 08:00:00.000`开始的毫秒数
- 时间可以加减，比如 now-2h，表明查询时刻向前推2个小时(最近2小时)。 数字后面的时间单位可以是 a(毫秒)、s(秒)、 m(分)、h(小时)、d(天)、w(周)。 比如`select * from t1 where ts > now-2w and ts <= now-1w`, 表示查询两周前整整一周的数据。 在指定降频操作(down sampling)的时间窗口(interval)时，时间单位还可以使用 n(自然月) 和 y(自然年)。

TDengine缺省的时间戳是毫秒精度，但通过修改配置参数enableMicrosecond就可支持微秒。

在TDengine中，普通表的数据模型中可使用以下10种数据类型。

||类型|Bytes|说明|
|--|--|---|----|
|1|TIMESTAMP|8|时间戳。缺省精度毫秒，可支持微秒。从格林威治时间 `1970-01-01 00:00:00.000 (UTC/GMT)` 开始，计时不能早于该时间。|
|2|INT|4|整型，范围 [-2^31+1, 2^31-1], -2^31用作Null|
|3|BIGINT|8|长整型，范围 [-2^63+1, 2^63-1], -2^63用于NULL|
|4|FLOAT|4|浮点型，有效位数6-7，范围 [-3.4E38, 3.4E38]|
|5|DOUBLE|8|双精度浮点型，有效位数15-16，范围 [-1.7E308, 1.7E308]
|6|BINARY|自定义|用于记录字符串，理论上，最长可以有16374字节，但由于每行数据最多16K字节，实际上限一般小于理论值。 binary仅支持字符串输入，字符串两端使用单引号引用，否则英文全部自动转化为小写。使用时须指定大小，如binary(20)定义了最长为20个字符的字符串，每个字符占1byte的存储空间。如果用户字符串超出20字节将会报错。对于字符串内的单引号，可以用转义字符反斜线加单引号来表示， 即 \’。|
|7|SMALLINT|2|短整型， 范围 [-32767, 32767], -32768用于NULL|
|8|TINYINT|1|单字节整型，范围 [-127, 127], -128用于NULL|
|9|BOOL|1|布尔型，{true, false}|
|10|NCHAR|自定义|用于记录非ASCII字符串，如中文字符。每个nchar字符占用4bytes的存储空间。字符串两端使用单引号引用，字符串内的单引号需用转义字符 \’。nchar使用时须指定字符串大小，类型为nchar(10)的列表示此列的字符串最多存储10个nchar字符，会固定占用40bytes的空间。如用户字符串长度超出声明长度，则将会报错。|

**Tips:** TDengine对SQL语句中的英文字符不区分大小写，自动转化为小写执行。因此用户大小写敏感的字符串及密码，需要使用单引号将字符串引起来。

## 3. 数据库管理
### 3.1 创建数据库
```sql
CREATE DATABASE [IF NOT EXISTS] db_name [KEEP keep];
```
说明：
1. KEEP是该数据库的数据保留多长天数，缺省是3650天(10年)，数据库会自动删除超过时限的数据；
2. 数据库名最大长度为33；
3. 一条SQL 语句的最大长度为65480个字符；
4. 数据库还有更多与存储相关的配置参数，请参见 [系统管理](https://www.taosdata.com/cn/documentation20/administrator/#%E6%9C%8D%E5%8A%A1%E7%AB%AF%E9%85%8D%E7%BD%AE)。

### 3.2 使用数据库
```sql
USE db_name;
```
使用/切换数据库

### 3.3 删除数据库
```sql
DROP DATABASE [IF EXISTS] db_name;
```
删除数据库。所包含的全部数据表将被删除，谨慎使用。

### 3.4 修改数据参数
```sql
ALTER DATABASE db_name COMP 2;
```
COMP参数是指修改数据库文件压缩标志位，取值范围为[0, 2]. 0表示不压缩，1表示一阶段压缩，2表示两阶段压缩。
```sql
ALTER DATABASE db_name REPLICA 2;
```
REPLICA参数是指修改数据库副本数，取值范围[1, 3]。在集群中使用，副本数必须小于dnode的数目。
```sql
ALTER DATABASE db_name KEEP 365;
```
KEEP参数是指修改数据文件保存的天数，缺省值为3650，取值范围[days, 365000]，必须大于或等于days参数值。
```sql
ALTER DATABASE db_name QUORUM 2;
```
QUORUM参数是指数据写入成功所需要的确认数。取值范围[1, 3]。对于异步复制，quorum设为1，具有master角色的虚拟节点自己确认即可。对于同步复制，需要至少大于等于2。原则上，Quorum >=1 并且 Quorum <= replica(副本数)，这个参数在启动一个同步模块实例时需要提供。
```sql
ALTER DATABASE db_name BLOCKS 100;
```
BLOCKS参数是每个VNODE (TSDB) 中有多少cache大小的内存块，因此一个VNODE的用的内存大小粗略为（cache * blocks）。取值范围[3, 1000]。

**Tips:** 以上所有参数修改后都可以用show databases来确认是否修改成功。

### 3.5 显示系统所有数据库
```sql
SHOW DATABASES;
```

## 4. 表管理
### 4.1 创建数据表
```sql
CREATE TABLE [IF NOT EXISTS] tb_name (timestamp_field_name TIMESTAMP, field1_name data_type1 [, field2_name data_type2 ...]);
```
说明：
1. 表的第一个字段必须是TIMESTAMP，并且系统自动将其设为主键； 
2. 表名最大长度为193；
3. 表的每行长度不能超过16k个字符; 
4. 子表名只能由字母、数字和下划线组成，且不能以数字开头；
5. 使用数据类型binary或nchar，需指定其最长的字节数，如binary(20)，表示20字节。

### 4.2 删除数据表
```sql
DROP TABLE [IF EXISTS] tb_name;
```

### 4.3 显示当前数据库下的所有数据表信息
```sql
SHOW TABLES [LIKE tb_name_wildcadr];
```
显示当前数据库下的所有数据表信息。说明：可在like中使用通配符进行名称的匹配。 通配符匹配：
1. `%`(百分号)匹配0到任意个字符；
2. `_`下划线匹配一个字符。

### 4.4 获取表的结构信息
```sql
DESCRIBE tb_name;
```

### 4.5 表增加列
```sql
ALTER TABLE tb_name ADD COLUMN field_name data_type;
```
说明：
1. 列的最大个数为1024，最小个数为2；
2. 列名最大长度为65。


### 4.6 表删除列
```sql
ALTER TABLE tb_name DROP COLUMN field_name;
```
如果表是通过[超级表](https://www.taosdata.com/cn/documentation20/super-table/)创建，更改表结构的操作只能对超级表进行。同时针对超级表的结构更改对所有通过该结构创建的表生效。对于不是通过超级表创建的表，可以直接修改表结构。

## 5. 超级表STable管理
### 5.1 创建超级表
```sql
CREATE TABLE [IF NOT EXISTS] stb_name (timestamp_field_name TIMESTAMP, field1_name data_type1 [, field2_name data_type2 ...]) TAGS (tag1_name tag_type1, tag2_name tag_type2 [, tag3_name tag_type3]);
```
创建STable, 与创建表的SQL语法相似，但需指定TAGS字段的名称和类型。
说明：
1. TAGS 列的数据类型不能是timestamp类型；
2. TAGS 列名不能与其他列名相同；
3. TAGS 列名不能为预留关键字；
4. TAGS 最多允许128个，可以0个，总长度不超过16k个字符。

### 5.2 删除超级表
```sql
DROP TABLE [IF EXISTS] stb_name;
```
删除STable会自动删除通过STable创建的子表。

### 5.3 显示当前数据库下的所有超级表信息
```sql
SHOW STABLES [LIKE tb_name_wildcar];
```
查看数据库内全部STable，及其相关信息，包括STable的名称、创建时间、列数量、标签（TAG）数量、通过该STable建表的数量。

### 5.4 获取超级表的结构信息
```sql
DESCRIBE stb_name;
```

### 5.5 超级表增加列
```sql
ALTER TABLE stb_name ADD COLUMN field_name data_type;
```

### 5.6 超级表删除列
```sql
ALTER TABLE stb_name DROP COLUMN field_name;
```

## 6. 超级表STable中TAG管理
### 6.1 添加标签
```sql
ALTER TABLE stb_name ADD TAG new_tag_name tag_type;
```
为STable增加一个新的标签，并指定新标签的类型。标签总数不能超过128个，总长度不超过16k个字符。

### 6.2 删除标签
```sql
ALTER TABLE stb_name DROP TAG tag_name;
```
删除超级表的一个标签，从超级表删除某个标签后，该超级表下的所有子表也会自动删除该标签。

### 6.3 修改标签名
```sql
ALTER TABLE stb_name CHANGE TAG old_tag_name new_tag_name;
```
修改超级表的标签名，从超级表修改某个标签名后，该超级表下的所有子表也会自动更新该标签名。

### 6.4 修改子表标签值
```sql
ALTER TABLE tb_name SET TAG tag_name=new_tag_value;
```
说明：除了更新标签的值的操作是针对子表进行，其他所有的标签操作（添加标签、删除标签等）均只能作用于STable，不能对单个子表操作。对STable添加标签以后，依托于该STable建立的所有表将自动增加了一个标签，所有新增标签的默认值都是NULL。


## 7. 数据写入
### 7.1 插入一条记录
```sql
INSERT INTO tb_name VALUES (field_value, ...);
```
向表tb_name中插入一条记录。

### 7.2 插入一条记录，数据对应到指定的列
```sql
INSERT INTO tb_name (field1_name, ...) VALUES(field1_value, ...);
```
向表tb_name中插入一条记录，数据对应到指定的列。SQL语句中没有出现的列，数据库将自动填充为NULL。主键（时间戳）不能为NULL。

### 7.3 插入多条记录
```sql
INSERT INTO tb_name VALUES (field1_value1, ...) (field1_value2, ...)...;
```
向表tb_name中插入多条记录。

### 7.4 按指定的列插入多条记录
```sql
INSERT INTO tb_name (field1_name, ...) VALUES(field1_value1, ...) (field1_value2, ...);
```
向表tb_name中按指定的列插入多条记录。

### 7.5 向多个表插入多条记录
```sql
INSERT INTO tb1_name VALUES (field1_value1, ...)(field1_value2, ...)... 
            tb2_name VALUES (field1_value1, ...)(field1_value2, ...)...;
```
同时向表tb1_name和tb2_name中分别插入多条记录。

### 7.6 同时向多个表按列插入多条记录
```sql
INSERT INTO tb1_name (tb1_field1_name, ...) VALUES (field1_value1, ...) (field1_value2, ...)
            tb2_name (tb2_field1_name, ...) VALUES (field1_value1, ...) (field1_value2, ...);
```
同时向表tb1_name和tb2_name中按列分别插入多条记录。
注意：
1. 如果时间戳为0，系统将自动使用服务器当前时间作为该记录的时间戳；
2. 允许插入的最老记录的时间戳，是相对于当前服务器时间，减去配置的keep值（数据保留的天数），允许插入的最新记录的时间戳，是相对于当前服务器时间，加上配置的days值（数据文件存储数据的时间跨度，单位为天）。keep和days都是可以在创建数据库时指定的，缺省值分别是3650天和10天。

**历史记录写入：** 可使用IMPORT或者INSERT命令，IMPORT的语法，功能与INSERT完全一样。

## 8. 数据查询
### 8.1 查询语法
```sql
SELECT select_expr [, select_expr ...]
    FROM {tb_name_list}
    [WHERE where_condition]
    [INTERVAL (interval_val [, interval_offset])]
    [FILL fill_val]
    [SLIDING fill_val]
    [GROUP BY col_list]
    [ORDER BY col_list { DESC | ASC }]    
    [SLIMIT limit_val [, SOFFSET offset_val]]
    [LIMIT limit_val [, OFFSET offset_val]]
    [>> export_file]
```
说明：针对 insert 类型的 SQL 语句，我们采用的流式解析策略，在发现后面的错误之前，前面正确的部分SQL仍会执行。下面的sql中，insert语句是无效的，但是d1001仍会被创建。
```sql
taos> create table meters(ts timestamp, current float, voltage int, phase float) tags(location binary(30), groupId int);
Query OK, 0 row(s) affected (0.008245s)
taos> show stables;
              name              |      created_time       | columns |  tags  |   tables    |
============================================================================================
 meters                         | 2020-08-06 17:50:27.831 |       4 |      2 |           0 |
Query OK, 1 row(s) in set (0.001029s)
taos> show tables;
Query OK, 0 row(s) in set (0.000946s)
taos> insert into d1001 using meters tags('Beijing.Chaoyang', 2);
DB error: invalid SQL: keyword VALUES or FILE required
taos> show tables;
           table_name           |      created_time       | columns |          stable_name           |
======================================================================================================
 d1001                          | 2020-08-06 17:52:02.097 |       4 | meters                         |
Query OK, 1 row(s) in set (0.001091s)
```

### 8.2 SELECT子句
一个选择子句可以是联合查询（UNION）和另一个查询的子查询（SUBQUERY）。

通配符：\
通配符 * 可以用于代指全部列。对于普通表，结果中只有普通列。
```sql
taos> SELECT * FROM d1001;
           ts            |       current        |   voltage   |        phase         |
======================================================================================
 2018-10-03 14:38:05.000 |             10.30000 |         219 |              0.31000 |
 2018-10-03 14:38:15.000 |             12.60000 |         218 |              0.33000 |
 2018-10-03 14:38:16.800 |             12.30000 |         221 |              0.31000 |
Query OK, 3 row(s) in set (0.001165s)
```
在针对超级表，通配符包含 标签列 。
```sql
taos> SELECT * FROM meters;
           ts            |       current        |   voltage   |        phase         |            location            |   groupid   |
=====================================================================================================================================
 2018-10-03 14:38:05.500 |             11.80000 |         221 |              0.28000 | Beijing.Haidian                |           2 |
 2018-10-03 14:38:16.600 |             13.40000 |         223 |              0.29000 | Beijing.Haidian                |           2 |
 2018-10-03 14:38:05.000 |             10.80000 |         223 |              0.29000 | Beijing.Haidian                |           3 |
 2018-10-03 14:38:06.500 |             11.50000 |         221 |              0.35000 | Beijing.Haidian                |           3 |
 2018-10-03 14:38:04.000 |             10.20000 |         220 |              0.23000 | Beijing.Chaoyang               |           3 |
 2018-10-03 14:38:16.650 |             10.30000 |         218 |              0.25000 | Beijing.Chaoyang               |           3 |
 2018-10-03 14:38:05.000 |             10.30000 |         219 |              0.31000 | Beijing.Chaoyang               |           2 |
 2018-10-03 14:38:15.000 |             12.60000 |         218 |              0.33000 | Beijing.Chaoyang               |           2 |
 2018-10-03 14:38:16.800 |             12.30000 |         221 |              0.31000 | Beijing.Chaoyang               |           2 |
Query OK, 9 row(s) in set (0.002022s)
```
通配符支持表名前缀，以下两个SQL语句均为返回全部的列：
```sql
SELECT * FROM d1001;
SELECT d1001.* FROM d1001;
```
在Join查询中，带前缀的`*`和不带前缀`*`返回的结果有差别， `*`返回全部表的所有列数据（不包含标签），带前缀的通配符，则只返回该表的列数据。
```sql
taos> SELECT * FROM d1001, d1003 WHERE d1001.ts=d1003.ts;
           ts            | current |   voltage   |    phase     |           ts            | current |   voltage   |    phase     |
==================================================================================================================================
 2018-10-03 14:38:05.000 | 10.30000|         219 |      0.31000 | 2018-10-03 14:38:05.000 | 10.80000|         223 |      0.29000 |
Query OK, 1 row(s) in set (0.017385s)
taos> SELECT d1001.* FROM d1001,d1003 WHERE d1001.ts = d1003.ts;
           ts            |       current        |   voltage   |        phase         |
======================================================================================
 2018-10-03 14:38:05.000 |             10.30000 |         219 |              0.31000 |
Query OK, 1 row(s) in set (0.020443s)
```
在使用SQL函数来进行查询过程中，部分SQL函数支持通配符操作。其中的区别在于： count(\*)函数只返回一列。first、last、last_row函数则是返回全部列。
```sql
taos> select count(*) from d1001;
       count(*)        |
========================
                     3 |
Query OK, 1 row(s) in set (0.001035s)
taos> select first(*) from d1001;
        first(ts)        |    first(current)    | first(voltage) |     first(phase)     |
=========================================================================================
 2018-10-03 14:38:05.000 |             10.30000 |            219 |              0.31000 |
Query OK, 1 row(s) in set (0.000849s)
```

### 8.3 结果集列名
`SELECT`子句中，如果不指定返回结果集合的列名，结果集列名称默认使用`SELECT`子句中的表达式名称作为列名称。此外，用户可使用AS来重命名返回结果集合中列的名称。例如：
```sql
taos> select ts, ts as primary_key_ts from d1001;
           ts            |     primary_key_ts      |
====================================================
 2018-10-03 14:38:05.000 | 2018-10-03 14:38:05.000 |
 2018-10-03 14:38:15.000 | 2018-10-03 14:38:15.000 |
 2018-10-03 14:38:16.800 | 2018-10-03 14:38:16.800 |
Query OK, 3 row(s) in set (0.001191s)
```
但是针对`first(*)`、`last(*)`、`last_row(*)`不支持针对单列的重命名。

### 8.4 隐式结果列
`Select_exprs`可以是表所属列的列名，也可以是基于列的函数表达式或计算式，数量的上限256个。当用户使用了`interval`或`group by tags`的子句以后，在最后返回结果中会强制返回时间戳列（第一列）和`group by`子句中的标签列。后续的版本中可以支持关闭`group by`子句中隐式列的输出，列输出完全由`select`子句控制。

### 8.5 表（超级表）列表
`FROM`关键字后面可以是若干个表（超级表）列表，也可以是子查询的结果。 如果没有指定用户的当前数据库，可以在表名称之前使用数据库的名称来指定表所属的数据库。例如：`power.d1001` 方式来跨库使用表。
```sql
SELECT * FROM power.d1001;
------------------------------
use power;
SELECT * FROM d1001;
```

### 8.6 特殊功能
部分特殊的查询功能可以不使用`FROM`子句执行。获取当前所在的数据库 `database()`
```sql
taos> SELECT database();
           database()           |
=================================
 power                          |
Query OK, 1 row(s) in set (0.000079s)
```
如果登录的时候没有指定默认数据库，且没有使用`use`命令切换数据，则返回`NULL`。
```sql
taos> SELECT database();
           database()           |
=================================
 NULL                           |
Query OK, 1 row(s) in set (0.000184s)
```
获取服务器和客户端版本号:
```sql
taos> SELECT client_version();
 client_version() |
===================
 2.0.0.0          |
Query OK, 1 row(s) in set (0.000070s)
taos> SELECT server_version();
 server_version() |
===================
 2.0.0.0          |
Query OK, 1 row(s) in set (0.000077s)
```
服务器状态检测语句。如果服务器正常，返回一个数字（例如 1）。如果服务器异常，返回`error code`。该SQL语法能兼容连接池对于TDengine状态的检查及第三方工具对于数据库服务器状态的检查。并可以避免出现使用了错误的心跳检测SQL语句导致的连接池连接丢失的问题。
```sql
taos> SELECT server_status();
 server_status() |
==================
               1 |
Query OK, 1 row(s) in set (0.000074s)
taos> SELECT server_status() as status;
   status    |
==============
           1 |
Query OK, 1 row(s) in set (0.000081s)
```







## 备注
原文地址：https://www.taosdata.com/cn/documentation20/taos-sql/
