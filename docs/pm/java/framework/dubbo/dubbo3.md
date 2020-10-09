# Dubbo 3.0前瞻：重塑Spring Cloud服务治理

## 1. 前言
在 Java 微服务生态中，[Spring Cloud](https://spring.io/projects/spring-cloud) 成为了开发人员的首选技术栈，然而随着实践的深入和运用规模的扩大，大家逐渐意识到 Spring Cloud 的局限性。

在服务治理方面，相较于 [Dubbo](https://dubbo.apache.org/) 而言，Spring Cloud 并不成熟。遗憾的是，Dubbo 往往被部分开发者片面地视作服务治理的 RPC 框架，而非微服务基础设施。即使是那些有意将 Spring Cloud 迁移至 Dubbo 的小伙伴，当面对其中迁移和改造的成本时，难免望而却步。

庆幸的是，Dubbo 3.0 的到来将给这一局面带来重要变革，未来 Dubbo Spring Cloud 将无缝对接 Dubbo 3.0 ，作为 [Spring Cloud Alibaba](https://github.com/spring-cloud-incubator/spring-cloud-alibaba) 的最核心组件，完全地拥抱 Spring Cloud 技术栈，不但无缝地整合 Spring Cloud 注册中心，包括[Nacos](https://nacos.io/)、[Eureka](https://github.com/Netflix/eureka)、[Zookeeper](https://zookeeper.apache.org/) 以及[Consul](https://www.consul.io/)，而且完全地兼容[Spring Cloud Open Feign](https://github.com/spring-cloud/spring-cloud-openfeign)以及 @LoadBalanced RestTemplate，本文将讨论 Dubbo Spring Cloud 对 Spring Cloud 技术栈所带来的革命性变化，由于 Spring Cloud 技术栈涵盖的特性众多，因此本文讨论的范围仅限于服务治理部分。

本文作为 Dubbo 3.0 的前瞻，将着重讲解当前版本的 Dubbo Spring Cloud 实现，Dubbo Spring Cloud 得以实现的一个重要基础即是我们前瞻之一提到的应用级服务发现。

应用级服务发现是 Dubbo 3.0 规划中的重要一环，是 Dubbo 与云原生基础设施打通、实现大规模微服务集群的基石。其实 Dubbo 社区早在 2.7.5 版本开始便探索了应用级服务发现，尝试去优化 Dubbo 的服务发现模型，因此 Dubbo Spring Cloud 是基于 Dubbo Spring Boot 2.7.x（从 2.7.0 开始，Dubbo Spring Boot 与 Dubbo 在版本上保持一致）和 Spring Cloud 2.x 开发，而本文也将基于 2.7.x 的这个先期版本展开讲解。

无论开发人员是 Dubbo 用户还是 Spring Cloud 用户，都能轻松地驾驭 Dubbo Spring Cloud，并以接近“零”成本的代价使应用向上迁移。Dubbo Spring Cloud 致力于简化 Cloud Native 开发成本，提高研发效能以及提升应用性能等目的。

## 2. 版本支持
由于 Spring 官方宣布 Spring Cloud Edgware(下文简称为 “E” 版) 将在 2019 年 8 月 1 日后停止维护 13，因此，目前 Dubbo Spring Cloud 发布版本并未对 “E” 版提供支持，仅为 “F” 版 和 “G” 版开发，同时也建议和鼓励 Spring Cloud 用户更新至 “F” 版 或 “G” 版。

同时，Dubbo Spring Cloud 基于 Apache Dubbo Spring Boot 2.7.x 开发（最低 Java 版本为 1.8），提供完整的 Dubbo 注解驱动、外部化配置以及 Production-Ready 的特性，[点击查看详情](https://github.com/apache/dubbo-spring-boot-project)。

以下表格将说明 Dubbo Spring Cloud 版本关系映射关系：

|Spring Cloud|Spring Cloud Alibaba|Spring Boot|Dubbo Spring Boot|
|------------|--------------------|-----------|-----------------|
|Finchley|0.2.2.RELEASE|2.0.x|2.7.1|
|Greenwich|2.2.1.RELEASE|2.1.x|2.7.1|
|Edgware|0.1.2.RELEASE|1.5.x|`:x:` Dubbo Spring Cloud 不支持该版本|

## 3. 功能特性
由于 Dubbo Spring Cloud 构建在原生的 Spring Cloud 之上，其服务治理方面的能力可认为是 Spring Cloud Plus，不仅完全覆盖[Spring Cloud 原生特性](https://cloud.spring.io/spring-cloud-static/Greenwich.RELEASE/single/spring-cloud.html#_features)，而且提供更为稳定和成熟的实现，特性比对如下表所示：

|功能组件|Spring Cloud|Dubbo Spring Cloud|
|------|------------|------------------|
|分布式配置（Distributed configuration）|Git、Zookeeper、Consul、JDBC|Spring Cloud 分布式配置 + Dubbo 配置中心（[Dubbo 2.7 开始支持配置中心，可自定义适配](http://dubbo.apache.org/zh-cn/docs/user/configuration/config-center.html)）|
|服务注册与发现（Service registration and discovery）|Eureka、Zookeeper、Consul|Spring Cloud 原生注册中心（Spring Cloud 原生注册中心，除 Eureka、Zookeeper、Consul 之外，还包括 Spring Cloud Alibaba 中的 Nacos）+[Dubbo 原生注册中心](http://dubbo.apache.org/zh-cn/docs/user/references/registry/introduction.html)|
|负载均衡（Load balancing）|Ribbon（随机、轮询等算法）|Dubbo 内建实现（随机、轮询等算法 + 权重等特性）|
|服务熔断（Circuit Breakers）|Spring Cloud Hystrix	|Spring Cloud Hystrix +[Alibaba Sentinel](https://github.com/alibaba/Sentinel/wiki/%E4%BB%8B%E7%BB%8D) 等（[Sentinel 已被 Spring Cloud 项目纳为 Circuit Breaker 的候选实现](https://spring.io/blog/2019/04/16/introducing-spring-cloud-circuit-breaker)）|
|服务调用（Service-to-service calls）|Open Feign、RestTemplate	|Spring Cloud 服务调用 + Dubbo @Reference|
|链路跟踪（Tracing）|[Spring Cloud Sleuth](https://spring.io/projects/spring-cloud-sleuth) + [Zipkin](https://github.com/apache/incubator-zipkin) |Zipkin、opentracing 等|

## 4. 高亮特性




原文地址：https://my.oschina.net/u/3874284/blog/4665768