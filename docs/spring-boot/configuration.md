# 配置文件实战

## 前言
在项目中，配置文件是很重要的一部分，主要关键的点在于以下两种配置：
1. 基础配置（即不同环境下都相同的一些配置）
2. 环境配置（即不同环境，配置不同）

我们需要在项目中区分以上两种配置，并在不同的环境能够自动切换成不同的配置，便于开发。此文将说明Spring Boot中如何使用配置，且如何在不同环境下应用不同的配置。

## 默认配置文件
在Spring中，会自动读取约定好的位置上的指定文件名的文件作为配置文件，这些文件即是默认配置文件。

### 默认配置文件类型
默认的配置文件名称为application.yml或application.properties,这两种文件分别采用缩进式写法和全路径写法：

>yaml文件缩进式写法
```YML
spring:
  #Mongo数据库配置
  data:
    mongodb:
      test1:
        uri: mongodb://test1:1234@127.0.0.1:27017/test1
        database: test1
      test2:
        uri: mongodb://test2:1234@127.0.0.1:27017/test2
        database: test2
```

>properties文件全路径写法
```
spring.data.mongodb.test1.uri=mongodb://test1:1234@127.0.0.1:27017/test1
spring.data.mongodb.test1.database=test1
spring.data.mongodb.test2.uri=mongodb://test2:1234@127.0.0.1:27017/test2
spring.data.mongodb.test2.database=test2
```
两种写法都可以，选择一种即可，不过我认为yaml的写法会更加简洁，可读性也更好。

### 默认配置文件优先级
默认配置文件路径可以为以下4种：
1. 当前项目目录下的一个/config子目录
2. 当前项目目录
3. 项目的resources即一个classpath下的/config包
4. 项目的resources即classpath根路径（root）

这些路径的配置文件优先级从上至下越来越低，如果出现重复的配置，则使用高优先级配置文件中的配置，且properties文件的配置优先级高于yml文件。

![配置文件路径图](https://upload-images.jianshu.io/upload_images/13184578-31bb8d4c59d678b6.png?imageMogr2/auto-orient/strip|imageView2/2/w/478/format/webp)


## 自定义配置文件
Spring中当然也允许自定义配置文件，配置文件可以放置于src/main/resources路径下，一般来说我们都需要规范项目目录，所以我也没试放置于其他地方（比如根目录）下的情况。自定义配置文件其实和默认配置文件一致，只是文件名不同而已，不多赘述，具体情况可以实际测试使用。当然在使用方面，自定义配置和默认配置的区别在于使用的时候需要指定路径和文件名，在下一小节[如何使用配置文件](#如何使用配置文件)介绍

## 如何使用配置文件

### 使用默认配置文件
使用配置文件的方式有两种:
>1. 直接在bean容器中使用`@Value`注解
1. 定义`MongoProperties` Bean
```JAVA
@Data
@Component
public class MongoProperties {
	
    @Value("${spring.data.mongodb.test1.uri}")
    private String uri;
    
    @Value("${spring.data.mongodb.test1.database}")
    private String database;
}
```
2. 注入Bean，使用配置
```JAVA
@RestController
public class IndexController {
    @Autowired
    private MongoProperties mongoProperties;
    
    @RequestMapping("/")
    String index() {
        return mongoProperties.getUri() + "——" + mongoProperties.getDatabase();
    }
}
```
>2. 在类上使用`@ConfigurationProperties`注解
1. 定义完整的配置文件Bean类：
```JAVA
@Data
@ConfigurationProperties(prefix="spring.data.mongodb.test1")
public class ConfigBean {
    private String uri;
    private String database;
}
```
2. 除此之外还需在Spring Boot入口类加上注解@EnableConfigurationProperties({ConfigBean.class})来启用该配置：
```JAVA
@SpringBootApplication
@EnableConfigurationProperties({ConfigBean.class})
public class Application {
	
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```
3. 注入Bean，使用配置
```JAVA
@RestController
public class IndexController {
    @Autowired
    private ConfigBean configBean;
    
    @RequestMapping("/")
    String index() {
        return configBean.getUri() + "——" + configBean.getDatabase();
    }
}
```

### 使用自定义配置文件
1. 在src/main/resources路径下新建test.properties：
```YML
test:
  name: KangKang
  age: 25
```
2. 定义Bean：
```JAVA
@Configuration
@ConfigurationProperties(prefix="test")
@PropertySource("classpath:test.properties")
@Component
public class TestConfigBean {
    private String name;
    private int age;
    // get,set略
}
```
注解`@PropertySource("classpath:test.properties")`指明了使用哪个配置文件。要使用该配置Bean，同样也需要在入口类里使用注解`@EnableConfigurationProperties({TestConfigBean.class})`来启用该配置。

## 不同环境如何切换不同配置文件
Spring中默认支持不同环境使用不同配置文件，我们可以以*application-{profile}.yml*的格式命名，建立多个profile配置文件，比如application-dev.yml、application-prod.yml，分别对应测试环境和生产环境，然后我们可以在application.yml文件中定义`spring.profiles.active`配置，这个变量的值等于dev即表示加载application-dev.yml配置文件，通过改变该变配置值来选择不同的环境。
> 实际运用中，我们不可能通过更改application.yml文件中的`spring.profiles.active`配置来更换环境，有另一种做法则是在用java命令运行的时候指定`spring.profiles.active`变量的值来选择配置：*java -jar xxx.jar --spring.profiles.active={profile}*


# 总结
实际运用中，我们可以使用application.yml文件来放置*基础配置*，然后创建不同的profile配置文件来放置不同环境的配置，启动的时候修改`spring.profiles.active`变量来达到不同环境不同配置文件的目的。实际生产中我并没有使用这种方式，因为生产使用的是微服务的方式，使用Rancher平台维护服务，我们通过*configMap*的方式将配置文件在部署的时候写入环境中，不同环境有不同的Rancher平台，可以在不同平台分别写入不同的配置，所以情况不同可以依据情况来灵活改变。

# 参考资料
1. [SpringBoot配置文件——加载顺序](https://www.jianshu.com/p/3c615bd42799)
2. [Spring Boot一些基础配置](https://mrbird.cc/Spring-Boot%20basic%20config.html)