# TDengine简单实用

## 1. 配置数据库
```yml
spring:
  database:
    driver-class-name: com.taosdata.jdbc.TSDBDriver
    url: jdbc:TAOS://127.0.0.1:6020/db?timezone=Asia/Beijing&charset=utf-8
    username: root
    password: taosdata
```

## 2. 配置连接池
```java
@Configuration
@EnableAsync
public class ExecutorConfig {

    @Bean("getExecutor")
    public Executor getExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        //配置核心线程数
        executor.setCorePoolSize(10);
        //配置最大线程数
        executor.setMaxPoolSize(20);
        //配置队列大小
        executor.setQueueCapacity(50);
        //配置线程池中的线程的名称前缀
        executor.setThreadNamePrefix("service-Async-");
        // rejection-policy：当pool已经达到max size的时候，如何处理新任务
        // CALLER_RUNS：不在新线程中执行任务，而是有调用者所在的线程来执行
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        //执行初始化
        executor.initialize();
        return executor;
    }
}
```

## 3. 插入数据库
```java
@Autowired
private JdbcTemplate jdbcTemplate;
// 数据保存线程
private class SaveThread extends Thread {

    private String message;

    public SaveThread(String message) {
        this.message = message;
    }

    public void run() {
        String sql = "insert into log(ts, message) values(now, '" + message + "') ";
        int num = jdbcTemplate.update(sql);
        System.out.println(num + "插入数据：" + sql);
    }
}
```