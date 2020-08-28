# 结算云接口文档

## 变更记录
|版本号|日期|编写|摘要|
|:---:|:--:|:---:|:-----|
|1.0.0|2019.07.02|刘振岐|初始版本|
|1.1.0|2019.12.01|刘振岐|增加平台与子商户关系<br/>每个接口增加childrenNumber字段（自然人认证接口除外）|
|1.2.0|2020.05.14|刘振岐|正式环境域名变更,正式环境请求地址变更为新地址|
|1.3.0|2020.06.30|刘振岐|1.修改原信息认证接口为绑定银行卡接口<br/>2.增加支付宝认证接口<br/>3.批量导入任务接口支持支付宝提现<br/>4.增加支付宝绑定相关错误码|
|1.4.0|2020.07.20|刘振岐|导入任务增加异常：<br/>14：导入任务存在敏感词<br/>15：支付金额超过限额<br/>开票增加异常：<br/>16：开票金额超过限额|
|1.5.0|2020.08.21|黄飞龙|更新接口对接数字签名和验签业务逻辑|

## 1. 环境说明
### 1.1 测试环境
https://fat-k8s-tax-crowd-sourcing-application.shui.com.cn

### 1.2 生产环境
https://openapi.51jiesuanyun.com

## 2. 接口规范
### 2.1 数据类型
|序号|类型|说明|备注|
|:--:|:--:|:----|:---|
|1|String|字符串类型|示例：HelloWorld|
|2|Date|日期，格式为`yyyy-MM-dd`|示例：`2020-08-10`|
|3|Datetime|时间，格式为`yyyy-MM-dd hh:mm:ss`|示例：`2020-08-10 12:12:20`|
|4|Number(P, S)|数字类型：P为精度位，S为小数位，如不指定则为整数|示例：3.20|
|5|List|列表集合，列表集合中的参数单独描述|示例：menuList|

### 2.2 报文规范
报文采用Unicode字符集，UTF-8编码，JSON格式。

### 2.3 参数列表
|参数|参数类型|必填|说明|
|:--|:----:|:--:|:--|
|type|String|是|接口类型|
|data|List|是|业务数据|
|sign|List|是|签名信息|
|&nbsp;&nbsp;&nbsp;&nbsp;signature|String|是|签名|
|&nbsp;&nbsp;&nbsp;&nbsp;signDate|String|是|签名日期|

### 2.4 返回数据



## 3. 安全机制
数字签名是网络传输的安全手段之一，经过签名的数据可以有效地防止数据被篡改，能验证数据收发方的身份。结算云平台开放平台使用自定义数字签名规则做接口参数签名。

### 3.1 鉴权认证
结算云开放平台为所有接入客户分配唯一的授权标识和授权密钥，如下：
- client_id: 授权标识，在接口调用是必须作为参数传递。
- secret: 授权密钥，在数字签名和验签时使用。

客户方系统使用client_id和secret，以及接口传递的参数，按照签名算法，生成验签字段，在请求参数中传递给结算云平台做数字签名校验。

### 3.2 签名算法
数字签名包含以下两个步骤：
1. 先对data业务数据的json字符串使用md5加密


