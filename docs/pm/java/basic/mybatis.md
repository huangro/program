# MyBatis

## 1. 数据类型
### 1.1 JdbcType类型
BIT、FLOAT、CHAR、TIMESTAMP 、 OTHER 、UNDEFINEDTINYINT 、REAL 、VARCHAR 、BINARY 、BLOB NVARCHAR、SMALLINT 、DOUBLE 、LONGVARCHAR 、VARBINARY 、CLOB、NCHAR、INTEGER、 NUMERIC、DATE 、LONGVARBINARY 、BOOLEAN 、NCLOB、BIGINT 、DECIMAL 、TIME 、NULL、CURSOR

### 1.2 MyBatis中JavaType与JdbcType对应关系
|JavaType|JdbcType|
|--------|--------|
|String|CHAR|
|String|VARCHAR|
|String|LONGVARCHAR|
|java.math.BigDecimal|NUMERIC|
|java.math.BigDecimal|DECIMAL|
|boolean|BIT|
|boolean|BOOLEAN|
|byte|TINYINT|
|short|SMALLINT|
|int|INTEGER|
|long|BIGINT|
|float|REAL|
|double|FLOAT|
|double|DOUBLE|
|byte[]|BINARY|
|byte[]|VARBINARY|
|byte[]|LONGVARBINARY|
|java.sql.Date|DATE|
|java.sql.Time|TIME|
|java.sql.Timestamp|TIMESTAMP|
|Clob|CLOB|
|Blob|BLOB|
|Array|ARRAY|
|mapping of underlying type|DISTINCT|
|Struct|STRUCT|
|Ref|REF|
|java.net.URL|DATALINK|

### 1.3 MyBatis中JavaType与JdbcType对应例子
```xml
<resultMap type="java.util.Map" id="resultjcm">
  <result property="FLD_NUMBER" column="FLD_NUMBER" javaType="double" jdbcType="NUMERIC"/>
  <result property="FLD_VARCHAR" column="FLD_VARCHAR" javaType="string" jdbcType="VARCHAR"/>
  <result property="FLD_DATE" column="FLD_DATE" javaType="java.sql.Date" jdbcType="DATE"/>
  <result property="FLD_INTEGER" column="FLD_INTEGER" javaType="int" jdbcType="INTEGER"/>
  <result property="FLD_DOUBLE" column="FLD_DOUBLE" javaType="double" jdbcType="DOUBLE"/>
  <result property="FLD_LONG" column="FLD_LONG" javaType="long" jdbcType="INTEGER"/>
  <result property="FLD_CHAR" column="FLD_CHAR" javaType="string" jdbcType="CHAR"/>
  <result property="FLD_BLOB" column="FLD_BLOB" javaType="[B" jdbcType="BLOB" />
  <result property="FLD_CLOB" column="FLD_CLOB" javaType="string" jdbcType="CLOB"/>
  <result property="FLD_FLOAT" column="FLD_FLOAT" javaType="float" jdbcType="FLOAT"/> <result property="FLD_TIMESTAMP" column="FLD_TIMESTAMP" javaType="java.sql.Timestamp" jdbcType="TIMESTAMP"/>
</resultMap>
```