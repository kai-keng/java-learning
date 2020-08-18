# 事务管理

## 事务介绍
事务的概念介绍可以参照[MySQL事务](https://kai-keng.github.io/java-learning/mysql/transaction.html)。

在日常开发中，我们需要依据我们的业务逻辑，在一些操作失败的时候，对我们的一些事务进行过滚，所以学会事务操作是非常有必要的。


## Spring Boot 中的事务
在Spring Boot 中，当我们引用了 **spring-boot-starter-jdbc** 或 **spring-boot-starter-data-jpa** 的时候会自动帮我们注入事务管理器，我们使用起来非常简单。

```JAVA
// 只需要在需要添加事务的地方加上 Transactional 注解即可开启事务
@Transactional
public int add(Student student) {
    return this.studentDao.add(student);
}
```

如上加上 `Transactional` 事务即被开启，当方法结束的时候会自动提交事务。我们一般在 Service 层添加事务，便于确保多个 DB 操作一起成功或失败。

## 手动开启事务
有时候我们的业务中可能需要根据业务逻辑来手动的控制事务的提交与回滚，这个时候就不能依赖原有的自动提交事务与异常回滚了，我们可以通过以下方式手动控制事务：

```JAVA
@Autowired
DataSourceTransactionManager transactionManager;

@Autowired
TransactionDefinition transactionDefinition;

@Transactional
public void testTransactional() {
    // 开启事务
    TransactionStatus status = transactionManager.getTransaction(transactionDefinition);

    try {
        Student student = Student.builder().sno("010").name("Borg").sex("M").build();
        studentService.add(student);

        // 提交事务
        transactionManager.commit(status);
    } catch (Exception ex) {
        // 回滚事务
        transactionManager.rollback(status);
    }
}
```

## 多数据源事务配置
在配置了多数据源的情况下，我们需要对不同的数据源指定不同的事务管理器。

```JAVA
@Bean(name = "testTransactionManager")
public DataSourceTransactionManager testTransactionManager(@Qualifier("testDataSource")DataSource dataSource) {
    return new DataSourceTransactionManager(dataSource);
}
```

 如上只需在数据源的配置类上加上事务管理器的 Bean 即可，然后在使用的时候指定使用的事务管理器即可。

 ```JAVA
@Transactional(value = "testTransactionManager")
public int add(Student student) {
    return this.studentDao.add(student);
}
 ```

 ## 配置事务隔离级别
 MySQL 事务隔离级别共4种，Spring 中的 `org.springframework.transaction.annotation.Isolation` 枚举提供了5种事务隔离级别设置，分别如下：

 * DEFAULT：默认值，表示使用底层数据库默认的隔离级别，大部分数据库的默认隔离级别都是 **READ_COMMITTED**。

 * READ_UNCOMMITTED（读未提交）：可读取其他未提交的事务数据，无法防止脏读、不可重复读与幻读。

 * READ_COMMITTED（读已提交）：只能读取到其他已提交事务的数据，可以防止脏读。

 * REPEATABLE_READ（可重复读）：确保在一个事务中多次执行同样的数据查询操作结果都一致，可以防止脏读、不可重复读。

 * SERIALIZABLE（串行化）：确保事务串行执行，事务之间完全不会互相干扰，可防止脏读、不可重复读与幻读。

 使用时设置 `Transactional` 的事务级别即可：

 ```JAVA
 @Transactional(isolation = Isolation.DEFAULT)
 ```

 ## 配置事务传播行为
 因为在 JAVA 中可以定义多个事务，且如果方法之间互相调用，就可能存在多个事务重叠的情况，为了决定多个事务重叠的时候如何处理，Spring 中的 `org.springframework.transaction.annotation.Propagation` 枚举提供了如下 7 种事务传播处理方式：

* REQUIRED：如果当前存在事务，则加入该事务；如果当前没有事务，则创建一个新的事务。

* SUPPORTS：如果当前存在事务，则加入该事务；如果当前没有事务，则以非事务的方式继续运行。

* MANDATORY：如果当前存在事务，则加入该事务；如果当前没有事务，则抛出异常。

* REQUIRES_NEW：创建一个新的事务，如果当前存在事务，则把当前事务挂起。

* NOT_SUPPORTED：以非事务方式运行，如果当前存在事务，则把当前事务挂起。

* NEVER：以非事务方式运行，如果当前存在事务，则抛出异常。

* NESTED：如果当前存在事务，则创建一个事务作为当前事务的嵌套事务来运行；如果当前没有事务，则该取值等价于REQUIRED。

 使用时设置 `Transactional` 的传播级别即可：

```JAVA
@Transactional(propagation = Propagation.REQUIRED)
```

## 错误回滚
`Transactional` 默认当捕捉到 `RuntimeException` 与 `Error` 时会自动回滚当前事务，如果需要所有异常发生时都回滚则可以添加 `rollbackFor = Exception.class`，如下：

```JAVA
@Transactional(rollbackFor = Exception.class)
```

> 切记，只有错误向上层抛出的时候才能触发错误回滚。如果你在方法中使用 `try catch` 将异常给捕捉了，并没有继续向上层抛出的话，则不会触发错误回滚。


## 事务超时
我们的事务可以主动设置事务超时时间，如下：

```JAVA
// 设置超时时间5s，单位为秒
@Transactional(timeout = 5)
public void testTransactional() {
    Student student = Student.builder().sno("008").name("Borg").sex("M").build();
    studentService.add(student);
}
```

但是这个事务的超时时间指的并不是在开启事务的方法中执行的超时时长，其超时时间指的是 MyBatis 中的 SQL 执行的时间，如果 SQL 执行时间超过设置的超时时间则会抛出异常并回滚事务，否则方法中执行时间超出超时时间是不会回滚的。

## 在单元测试中的应用
我们在写单元测试的时候，往往希望在测试执行完成以后回滚测试过程中添加、修改或删除的数据，保持原样。这个时候就可以使用 `Transactional` 注解，在测试类上加上 `Transactional` 注解，可以让整个单元测试类中的方法在执行完成以后都回滚事务，如下：

```JAVA
@Transactional
class DemoApplicationTests {
}
```

如果我们只是想要某几个单元测试在执行完成以后回滚，也可以将 `Transactional` 注解单独添加在方法上：

```JAVA
@Test
@Transactional
public void testTransactional() {
}
```

有时候我们可能也不想让所有的测试方法在执行完成以后都执行回滚操作，这时候我们可以在方法上添加 `@Rollback(false)` 注解：

```JAVA
@Transactional
class DemoApplicationTests {
    @Test
    @Rollback(false)
    public void testTransactional() {
    }
}
```

## 参考资料
1. [Spring Boot 2.x基础教程：事务管理入门](https://blog.csdn.net/dyc87112/article/details/107247780)