# Maven

## 1. 基本方法
- 编译构建指定的模块
```bash
mvn clean install -pl model1,model2 -am -Dmaven.test.skip=true
```