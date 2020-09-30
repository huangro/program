# YunQiLink平台

YunQiLink是云栖智造工业物联网数据采集平台。按照部署形式，有两种版本：

- 公有云版本

云栖智造公有云的组成部分，部署在云栖智造的服务器上，具备所有功能。

- 私有云版本

云栖智造企业版的组成部分，部署在企业客户的服务器上，根据需要裁减掉部分功能。

## 嘉顺项目不包含功能

嘉顺项目为私有云版本，是简化版本，裁减掉以下功能：

- appid。不区分各种应用，需要携带appid的地方，均忽略。
- 用户。不区分用户，省略注册，登录等，需要携带用户token的地方，均忽略
- 设备身份识别。不进行设备身份识别，所有设备上传上来数据均为有效数据
- 绑定。不支持绑定，因为没有用户，接口访问的对象是所有设备
- info。不支持绑定信息，因为没有绑定过程，所以暂时没有alias，remark等绑定信息，应用平台暂时自行管理这些


## 名词解释

**domain**: 数采服务器地址，具体项目确定
**pk**: Product Key。产品识别字符串，用来区分设备类型，不通类型产品pk不同，由字母，数字，'_', '-'组成
**did**: Device ID。设备识别符，同一pk下的不同设备did不同，由字母，数字，'_', '-'组成。
**appid**: Application ID。应用识别符，用来区分不同的应用程序，手机APP，微信小程序，其他平台等等，由字母，数字，'_', '-'组成。
**info**: 设备在绑定时，由YunQiLink附加在设备上的信息，如别名，备注，其他附加信息等，设备端并不同步存储info
**status**: 设备的状态，由设备自身上报，用来指示设备的一些状态或配置信息，如转速、开关等，YunQiLink无法修改设备的status


## API列表

Method | URI | 描述
----|---|---
GET | {domain}/devices                   | 获取设备列表
GET | {domain}/device/{pk}/{did}         | 获取指定设备实时值
GET | {domain}/device/{pk}/{did}/history | 获取指定设备历史值
GET | {domain}/device/{pk}/{did}/max     | 获取指定设备最大值
GET | {domain}/device/{pk}/{did}/min     | 获取指定设备最小值
GET | {domain}/device/{pk}/{did}/avg     | 获取指定设备平均值
GET | {domain}/device/{pk}/{did}/diff    | 获取指定设备差值

### 获取设备列表

获取此用户下所有产品的绑定设备列表。如果需要对多个产品有筛选，依据对appid的判断。
如果需要获取指定产品的设备列表，需要使用pk参数。

请求地址及方式

    GET
    {domain}/devices

请求参数

参数|类型|必填|参数类型|描述
----|----|----|--------|----
Application-Id | string  | 是 | header| appid。*嘉顺暂时不实现*
Authorization  | string  | 是 | header| 用户token。*嘉顺暂时不实现*
limit          | integer | 否 | query | 返回的结果条数，默认20
skip           | integer | 否 | query | 表示跳过的条数，间接表示页数，默认0
filter         | object  | 否 | body  | 过滤器设置
filter.exclude | boolean | 否 | body  | include或exclude，默认include
filter.pks     | array   | 否 | body  | 指定pk的设备
filter.dids    | array   | 否 | body  | 指定did的设备
filter.online  | boolean | 否 | body  | 上线离线状态，默认为不关心，显示的true和false表示只关心在线或离线的设备

响应参数

参数|类型|描述
----|----|----
devices                 | array   | 绑定的设备列表
device.did              | string  | 设备ID
device.pk               | string  | 产品Product Key
device.info             | object  | 设备的绑定信息
device.info._alias      | string  | 设备别名
device.info._remark     | string  | 设备备注
device.online           | boolean | 设备是否在线
device.status           | object  | 设备最新一次上报的状态
device.status._reportat | integer | 设备最新一次上报的时间戳
device.status._edge     | string  | 设备最新一次上报所经的边缘设备ID，如果直接上报则为空
device.status.xxxxx     | string  | 设备最新一次上报的其他状态值


- 示例一

获取所有设备的实时数据

请求

```js
GET: {domain}/devices
Content-Type:application/json
Body:none
```

回复

```js
Response-Code: 200
Body:
{
  devices:[
    {
      "did":"rzRe65wvKLlw4R1EV0KLHrYo8bObQzab",
      "pk":"0361d124dabd4996",
      "info":{
        "_alias":"二车间5号",
        "_remark":"TOSHIBA-200数控机床，2005年引进",
      },
      "online":true,
      "status":{
        "_reportat":1601426650,
        "_edge":"JKFKBV2",
        "status":1,
        "count":1000,
        "speed":120.50,
        "workOrder":"broa20201021001"
      }
    },
    ...（从第一个开始，最多20个）
  ]
}
```


- 示例二

获取所有设备的实时数据(分页)

请求

```js
GET: {domain}/devices?skip=15&limit=50
Content-Type:application/json
Body:none
```

回复

同示例一，不过返回从第16个开始，到第65个设备的列表

- 示例三

获取指定设备列表的实时数据

请求

```js
GET: {domain}/devices
Content-Type:application/json
Body:
{
  filter:{
    "dids":[
      "rzRe65wvKLlw4R1EV0KLHrYo8bObQzab",
      "LdMt3aIt4TTkPZDmlDIxYlS1jqMv8p3Q"
    ]
  }
}
```

回复

同示例一，不过只有指定设备的内容

### 获取指定设备实时值

获取指定设备状态。

请求地址及方式

    GET
    {domain}/device/{pk}/{did}

请求参数

参数|类型|必填|参数类型|描述
----|----|----|--------|----
Application-Id | string  | 是 | header| appid。*嘉顺暂时不实现*
Authorization  | string  | 是 | header| 用户token。*嘉顺暂时不实现*
pk             | string  | 是 | path  | 指定设备的pk
did            | string  | 是 | path  | 指定设备的did

响应参数

参数|类型|描述
----|----|----
device                  | array   | 绑定的设备列表
device.did              | string  | 设备ID
device.pk               | string  | 产品Product Key
device.info             | object  | 设备的绑定信息
device.info._alias      | string  | 设备别名
device.info._remark     | string  | 设备备注
device.online           | boolean | 设备是否在线
device.status           | object  | 设备最新一次上报的所有状态值
device.status._reportat | integer | 设备最新一次上报的时间戳
device.status._edge     | string  | 设备最新一次上报所经的边缘设备ID，如果直接上报则为空
device.status.xxxxx     | string  | 设备最新一次上报的其他状态值

- 示例一

获取指定设备的状态

请求

```js
GET: {domain}/device/0361d124dabd4996/rzRe65wvKLlw4R1EV0KLHrYo8bObQzab
Content-Type:application/json
Body:none
```

回复

```js
Response-Code: 200
Body:
{
  device:{
    "did":"rzRe65wvKLlw4R1EV0KLHrYo8bObQzab",
    "pk":"0361d124dabd4996",
    "info":{
      "_alias":"二车间5号",
      "_remark":"TOSHIBA-200数控机床，2005年引进",
    },
    "online":true,
    "status":{
      "_reportat":1601426650,
      "_edge":"JKFKBV2",
      "status":1,
      "count":1000,
      "speed":120.50,
      "workOrder":"broa20201021001"
    }
  }
}
```


### 获取指定设备历史值

获取指定设备状态的历史值。

请求地址及方式

    GET
    {domain}/device/{pk}/{did}/history

请求参数

参数|类型|必填|参数类型|描述
----|----|----|--------|----
Application-Id | string  | 是 | header| appid。*嘉顺暂时不实现*
Authorization  | string  | 是 | header| 用户token。*嘉顺暂时不实现*
pk             | string  | 是 | path  | 指定设备的pk
did            | string  | 是 | path  | 指定设备的did
from           | integer | 否 | query | 从什么时间开始的时间戳，默认0
to             | integer | 否 | query | 到什么时间结束的时间戳，默认当前时间戳
reverse        | boolean | 否 | query | 是否倒序，默认正序，正序为从新到旧，倒序为从旧到新
limit          | integer | 否 | query | 返回的结果条数，默认20
skip           | integer | 否 | query | 表示跳过的条数，间接表示页数，默认0

响应参数

参数|类型|描述
----|----|----
device               | array   | 绑定的设备列表
device.did           | string  | 设备ID
device.pk            | string  | 产品Product Key
device.info          | object  | 设备的绑定信息
device.info._alias   | string  | 设备别名
device.info._remark  | string  | 设备备注
device.online        | boolean | 设备是否在线
results              | array   | 历史记录
result._reportat     | integer | 单条历史记录的上报时间戳
result._edge         | string  | 单条历史记录的边缘设备ID，如果直接上报则为空
result.xxxxx         | object  | 单条历史记录的其他状态值
  

- 示例一

获取指定设备的状态的历史值

请求

```js
GET: {domain}/device/0361d124dabd4996/rzRe65wvKLlw4R1EV0KLHrYo8bObQzab/history?from=1601410000&to=1601427000
Content-Type:application/json
Body:none
```

回复

```js
Response-Code: 200
Body:
{
  device:{
    "did":"rzRe65wvKLlw4R1EV0KLHrYo8bObQzab",
    "pk":"0361d124dabd4996",
    "info":{
      "_alias":"二车间5号",
      "_remark":"TOSHIBA-200数控机床，2005年引进",
    },
    "online":true
  },
  "results":[
    {
      "_reportat":1601426650,
      "_edge":"JKFKBV2",
      "status":1,
      "count":1000,
      "speed":120.50,
      "workOrder":"broa20201021001"
    },
    ...(按照时间从新到旧排列)
    {
      "_reportat":1601416620,
      "_edge":"JKFKBV2",
      "status":1,
      "count":1000,
      "speed":120.50,
      "workOrder":"broa20201021001"
    }
  ]
}
```



### 获取指定设备最大值/最小值/平均值/差值

获取指定设备状态的最大值/最小值/平均值/差值。

请求地址及方式

    GET
    {domain}/device/{pk}/{did}/max
    {domain}/device/{pk}/{did}/min
    {domain}/device/{pk}/{did}/avg
    {domain}/device/{pk}/{did}/diff

请求参数

参数|类型|必填|参数类型|描述
----|----|----|--------|----
Application-Id | string  | 是 | header| appid。*嘉顺暂时不实现*
Authorization  | string  | 是 | header| 用户token。*嘉顺暂时不实现*
pk             | string  | 是 | path  | 指定设备的pk
did            | string  | 是 | path  | 指定设备的did
from           | integer | 否 | query | 从什么时间开始的时间戳，默认0
to             | integer | 否 | query | 到什么时间结束的时间戳，默认当前时间戳
reverse        | boolean | 否 | query | 是否倒序，默认正序，正序为从新到旧，倒序为从旧到新
limit          | integer | 否 | query | 返回的结果条数，默认20
skip           | integer | 否 | query | 表示跳过的条数，间接表示页数，默认0

响应参数

参数|类型|描述
----|----|----
device               | array   | 绑定的设备列表
device.did           | string  | 设备ID
device.pk            | string  | 产品Product Key
device.info          | object  | 设备的绑定信息
device.info._alias   | string  | 设备别名
device.info._remark  | string  | 设备备注
device.online        | boolean | 设备是否在线
result               | object  | 输出结果
result.xxxxx         | object  | 输出结果的其他状态值（仅限数值型）
  
- 示例一

获取指定设备在指定时间段的状态的平均值

请求

```js
GET: {domain}/device/0361d124dabd4996/rzRe65wvKLlw4R1EV0KLHrYo8bObQzab/avg?from=1601410000&to=1601427000
Content-Type:application/json
Body:none
```

回复

```js
Response-Code: 200
Body:
{
  device:{
    "did":"rzRe65wvKLlw4R1EV0KLHrYo8bObQzab",
    "pk":"0361d124dabd4996",
    "info":{
      "_alias":"二车间5号",
      "_remark":"TOSHIBA-200数控机床，2005年引进",
    },
    "online":true
  },
  "result":{
    "status":1,
    "count":1000,
    "speed":120.50,
  }
}
```

## 数据库
采用TDengine时序数据库
