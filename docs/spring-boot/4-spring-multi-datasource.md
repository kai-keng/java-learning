# Mybatis多数据源配置

## 介绍
多数据源配置是我们在业务开发中很容易碰到的场景，我们一般会将不同的业务类型数据放在不同的库中，比如用户与认证相关数据与普通业务信息数据，这些就可以分别放在不同的库中。当数据处于不同的库的时候，这个时候就需要我们能够配置多数据源，并且同时连接多个数据源，以下内容即是介绍如何配置Mybatis多数据源。

## 实现
接续着我们上篇介绍，对代码进行了一些改造，代码中有一些关于AOP记录用户行为日志的代码不做详细介绍，具体请听下回分解。

1. 修改配置文件：添加新的数据库连接配置，并分别命名
```YAML
spring:
  datasource:
    example:
      type: com.alibaba.druid.pool.DruidDataSource
      driver-class-name: com.mysql.jdbc.Driver
      url: jdbc:mysql://localhost:3306/example
      username: root
      password: 123456
    test:
      type: com.alibaba.druid.pool.DruidDataSource
      driver-class-name: com.mysql.jdbc.Driver
      url: jdbc:mysql://localhost:3306/test
      username: root
      password: 123456
```

2. 添加数据源配置类
添加第一个数据源配置
```JAVA
@Configuration
@MapperScan(basePackages = ExampleDataSourceConfig.PACKAGE, sqlSessionFactoryRef = "exampleSqlSessionFactory")
public class ExampleDataSourceConfig {

    // mysqldao扫描路径
    static final String PACKAGE = "com.example.demo.dao.example";
    //  若使用xml形式，则需要使用以下代码
    //  // mybatis mapper扫描路径
    //  static final String MAPPER_LOCATION = "classpath:mapper/mysql/*.xml";

    @Primary // 配置主数据源，可加可不加，添加以后启动会默认初始化主数据源
    @Bean(name = "exampleDataSource")
    @ConfigurationProperties("spring.datasource.example") // 依据指定配置初始化数据源
    public DataSource exampleDataSource() {
        return DruidDataSourceBuilder.create().build();
    }

    @Primary
    @Bean(name = "exampleTransactionManager")
    public DataSourceTransactionManager exampleTransactionManager(@Qualifier("exampleDataSource")DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Primary
    @Bean(name = "exampleSqlSessionFactory")
    public SqlSessionFactory exampleSqlSessionFactory(@Qualifier("exampleDataSource") DataSource dataSource)
            throws Exception {
        final SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);
        //  //如果不使用xml的方式配置mapper，则可以省去下面这行mapper location的配置。
        //  sessionFactory.setMapperLocations(new PathMatchingResourcePatternResolver()
        //    .getResources(Test1DataSourceConfig.MAPPER_LOCATION));
        return sessionFactory.getObject();
    }
}
```

添加第二个数据源配置
```JAVA
@Configuration
@MapperScan(basePackages = TestDataSourceConfig.PACKAGE, sqlSessionFactoryRef = "testSqlSessionFactory")
public class TestDataSourceConfig {

    // mysqldao扫描路径
    static final String PACKAGE = "com.example.demo.dao.test";
    //  若使用xml形式，则需要使用以下代码
    //  // mybatis mapper扫描路径
    //  static final String MAPPER_LOCATION = "classpath:mapper/mysql/*.xml";

    @Bean(name = "testDataSource")
    @ConfigurationProperties("spring.datasource.test") // 依据指定配置初始化数据源
    public DataSource testDataSource() {
        return DruidDataSourceBuilder.create().build();
    }

    @Bean(name = "testTransactionManager")
    public DataSourceTransactionManager testTransactionManager(@Qualifier("testDataSource")DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean(name = "testSqlSessionFactory")
    public SqlSessionFactory testSqlSessionFactory(@Qualifier("testDataSource") DataSource dataSource)
            throws Exception {
        final SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);
        //  //如果不使用xml的方式配置mapper，则可以省去下面这行mapper location的配置。
        //  sessionFactory.setMapperLocations(new PathMatchingResourcePatternResolver()
        //    .getResources(Test1DataSourceConfig.MAPPER_LOCATION));
        return sessionFactory.getObject();
    }
}
```

3. 在指定路径下实现dao层

第一个数据源mapper路径配置为**com.example.demo.dao.example**，在该路径下实现dao层代码
```JAVA
@Component
@Mapper
public interface StudentDao {

    @Insert("insert into student(sno,sname,ssex) values(#{sno},#{name},#{sex})")
    int add(Student student);

    @Update("update student set sname=#{name},ssex=#{sex} where sno=#{sno}")
    int update(Student student);

    @Delete("delete from student where sno=#{sno}")
    int deleteBysno(String sno);

    @Select("select * from student where sno=#{sno}")
    @Results(id = "student",value= {
            @Result(property = "sno", column = "sno", javaType = String.class),
            @Result(property = "name", column = "sname", javaType = String.class),
            @Result(property = "sex", column = "ssex", javaType = String.class)
    })
    Student queryStudentBySno(String sno);
}
```

第二个数据源mapper路径配置为**com.example.demo.dao.test**，在该路径下实现dao层代码
```JAVA
@Component
@Mapper
public interface SysLogDao {

    @Insert("insert into test.syslog(username,operation,time,method,params,ip,created_time) " +
            "values(#{username},#{operation},#{time},#{method},#{params},#{ip},#{createTime})")
    int add(SysLog sysLog);

    @Select("select * from test.syslog where username=#{username}")
    @Results(id = "sysLog",value= {
            @Result(property = "username", column = "username", javaType = String.class),
            @Result(property = "operation", column = "operation", javaType = String.class),
            @Result(property = "time", column = "time", javaType = Integer.class),
            @Result(property = "method", column = "method", javaType = String.class),
            @Result(property = "params", column = "params", javaType = String.class),
            @Result(property = "ip", column = "ip", javaType = String.class),
            @Result(property = "createTime", column = "created_time", javaType = LocalDateTime.class)
    })
    List<SysLog> querySyslogByUsername(String username);
}
```

4. 在服务层或其他地方使用的地方注入指定dao

```JAVA
@Service("studentService")
public class StudentServiceImpl implements StudentService {

    // 注入主数据源配置的dao层对象
    @Autowired
    private StudentDao studentDao;

    @Override
    public int add(Student student) {
        return this.studentDao.add(student);
    }

    @Override
    public int update(Student student) {
        return this.studentDao.update(student);
    }

    @Override
    public int deleteBysno(String sno) {
        return this.studentDao.deleteBysno(sno);
    }

    @Override
    public Student queryStudentBySno(String sno) {
        return this.studentDao.queryStudentBySno(sno);
    }
}
```
第二个数据源的使用同上，只需要在使用处注入即可


## 总结
配置多数据源还是比较简单的，关键点在于配置类能够正确读取到数据库连接配置，然后正确对不同数据源实现不同的配置类即可。

## END
**Author**: Borg

**Time**: Mon Jul 06 2020 18:41:07 GMT+0800 (中国标准时间)