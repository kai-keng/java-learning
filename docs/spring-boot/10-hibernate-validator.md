# Spring 参数校验实战

## 介绍
在业务代码中，接口参数校验是绕不过去的坎。我们必须对接口输入参数去做一些判断，确认输入参数与我们期望的一致，避免导致我们的代码出现不在我们预期之内的错误。最简单的参数校验即是在拿到参数以后直接简单的做*if else*判断，这样可以完成功能，但是写起来特别的麻烦，而且需要写的代码量非常多，可读性很差，非常不可取。实际运用中，我们可以使用*hibernate-validator*来优雅的做参数校验处理，Spring中*spring-boot-starter-web*已经自带了*hibernate-validator*，如果没有引入*spring-boot-starter-web*的话，也可以单独引入*hibernate-validator*。接下来就详细介绍下如何使用*hibernate-validator*来做参数校验。


## 实现

### 使用校验注解
>在`org.hibernate.validator.constraints`和`javax.validation.constraints`包中提供了很多的注解，这些注解都是可以用来对参数做限制，常见注解如下：

| 验证注解 | 验证的数据类型 | 说明 |
| ------ | ------ | ------ |
| @AssertFalse | Boolean,boolean | 验证注解的元素值是false |
| @AssertTrue | Boolean,boolean | 验证注解的元素值是true |
| @NotNull | 任意类型 | 验证注解的元素值不是null |
| @Null | 任意类型 | 验证注解的元素值是null |
| @Min(value=值) | BigDecimal，BigInteger, byte,short, int, long，等任何Number或CharSequence（存储的是数字）子类型 | 验证注解的元素值大于等于@Min指定的value值 |
| @Max（value=值） | 和@Min要求一样 | 验证注解的元素值小于等于@Max指定的value值 |
| @DecimalMin(value=值) | 和@Min要求一样 | 验证注解的元素值大于等于@DecimalMin指定的value值 |
| @DecimalMax(value=值) | 和@Min要求一样 | 验证注解的元素值小于等于@DecimalMax指定的value值 |
| @Digits(integer=整数位数, fraction=小数位数) | 和@Min要求一样 | 验证注解的元素值的整数位数和小数位数上限 |
| @Size(min=下限, max=上限) | 字符串、Collection、Map、数组等 | 验证注解的元素值的在min和max（包含）指定区间之内，如字符长度、集合大小 |
| @Past | java.util.Date,java.util.Calendar;Joda Time类库的日期类型 | 验证注解的元素值（日期类型）比当前时间早 |
| @Future | 与@Past要求一样 | 验证注解的元素值（日期类型）比当前时间晚 |
| @NotBlank | CharSequence子类型 | 验证注解的元素值不为空（不为null、去除首位空格后长度为0），不同于@NotEmpty，@NotBlank只应用于字符串且在比较时会去除字符串的首位空格 |
| @Length(min=下限, max=上限) | CharSequence子类型 | 验证注解的元素值长度在min和max区间内 |
| @NotEmpty | CharSequence子类型、Collection、Map、数组 | 验证注解的元素值不为null且不为空（字符串长度不为0、集合大小不为0） |
| @Range(min=最小值, max=最大值) | BigDecimal,BigInteger,CharSequence, byte, short, int, long等原子类型和包装类型 | 验证注解的元素值在最小值和最大值之间 |
| @Email(regexp=正则表达式,flag=标志的模式) | CharSequence子类型（如String） | 验证注解的元素值是Email，也可以通过regexp和flag指定自定义的email格式 |
| @Pattern(regexp=正则表达式,flag=标志的模式) | String，任何CharSequence的子类型 | 验证注解的元素值与指定的正则表达式匹配 |
| @Valid | 任何非原子类型 | 指定递归验证关联的对象如用户对象中有个地址对象属性，如果想在验证用户对象时一起验证地址对象的话，在地址对象上加@Valid注解即可级联验证 |

>注解可以直接用来修饰POJO类中的字段或者参数上，如下：
1. 作用于POJO类
```JAVA
public class Student implements Serializable {
    private static final long serialVersionUID = -339516038496531943L;

    @NotBlank(message = "不能为空")
    private String sno;

    @NotBlank(message = "不能为空")
    private String name;

    @NotBlank(message = "不能为空")
    @Length(min = 1, max = 1, message = "长度必须为1")
    private String sex;
}
```
2. 作用于参数
```JAVA
@RequestMapping(value = "/student", method = RequestMethod.GET)
public Student queryStudentBySno(@NotBlank(message = "不为空") String sno) {
    return this.studentService.queryStudentBySno(sno);
}
```
>在添加完注解以后，还需要使用`@Validated`注解开启校验，`@Validated`可以用在类上，开启当前类的参数校验，但不会开启POJO类对象内部的参数校验。也可以用在参数上，单独开启某个参数或对象内的校验，完整写法如下：
1. 作用于类上
```JAVA
@Validated
@RestController
public class TestController {

    @Autowired
    private StudentService studentService;

    @RequestMapping(value = "/student", method = RequestMethod.GET)
    public Student queryStudentBySno(@NotBlank(message = "不为空") String sno) {
        return this.studentService.queryStudentBySno(sno);
    }

    @PostMapping(value = "/student")
    public Student addStudent(@Validated @RequestBody Student student) {
        this.studentService.add(student);

        return this.studentService.queryStudentBySno(student.getSno());
    }
}
```
2. 作用于参数上
```JAVA
@RequestMapping(value = "/student", method = RequestMethod.GET)
public Student queryStudentBySno(@Validated @NotBlank(message = "不为空") String sno) {
    return this.studentService.queryStudentBySno(sno);
}
```

### 使用自定义注解
>在包提供的注解无法满足我们需求的时候，我们可以自定义我们自己的注解来做参数校验，主要步骤如下：
1. 定义自定义参数校验注解
```JAVA
/**
 * 默认 message，groups与payload是必须的
 */
@Documented
@Target({ElementType.FIELD, ElementType.PARAMETER}) // 可作用于字段或参数上
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = SexValidator.class) // 指定用于参数校验的校验类
public @interface CheckSex {

    // 验证失败的信息
    String message() default "无效的性别";

    // 验证的分组，可依据分组来判断是否做校验
    Class<?>[] groups() default { };

    Class<? extends Payload>[] payload() default { };
}
```

2. 实现参数校验类
```JAVA
// 需要继承ConstraintValidator接口，并指定注解与校验参数类型
public class SexValidator implements ConstraintValidator<CheckSex, String> {

    private static final List<String> validSex = Arrays.asList("M", "F");

    // 用于处理初始化操作，只会被加载执行一次
    @Override
    public void initialize(CheckSex constraintAnnotation) {
    }

    // 用于校验参数是否有效调用的方法
    @Override
    public boolean isValid(String o, ConstraintValidatorContext constraintValidatorContext) {
        return validSex.contains(o);
    }
}
```
接下来就可以直接使用该注解了


### 使用Group解决同一对象在不同情况下验证要求不同的问题
>在日常业务中，我们经常会碰到同一个对象，在不同的方法中参数校验要求不同的情况，比如某个字段在创建的时候是必须的，但是在更新接口中是非必须的，这个时候我们可以通过注解中的*groups*字段去解决这个问题，如下：

1. 创建指定的group
```JAVA
// 创建分组
public interface Create extends Default {
}
// 更新分组
public interface Update extends Default {
}
```

2. 设置不同条件针对不同的分组，只有在创建的时候才要求必填name和sex字段
```JAVA
public class Student implements Serializable {
    private static final long serialVersionUID = -339516038496531943L;

    @NotBlank(message = "不能为空")
    private String sno;

    @NotBlank(message = "不能为空", groups = {Create.class})
    private String name;

    @NotBlank(message = "不能为空", groups = {Create.class})
    @Length(min = 1, max = 1, message = "长度必须为1")
    @CheckSex(groups = {Create.class})
    private String sex;
}
```

3. 在验证的地方选择分组
```JAVA
@PostMapping(value = "/student")
public Student addStudent(@Validated(Create.class) @RequestBody Student student) {
    this.studentService.add(student);

    return this.studentService.queryStudentBySno(student.getSno());
}

@PutMapping(value = "/student")
public Student updateStudent(@Validated(Update.class) @RequestBody Student student) {
    this.studentService.update(student);

    return this.studentService.queryStudentBySno(student.getSno());
}
```
这样只有在创建的时候才会去验证`@NotBlank`,`@CheckSex`这两个注解，可以很好的应对不同的情况。


### 配合全局异常处理优化返回结果
在参数验证错误的时候，会抛出一些异常，并且返回结果，但是这个返回结果针对于业务来说并不是那么的友好，在业务处理中，我们一般都会规范的我们返回结果，统一样式返回。我们可以配合全局异常管理，全局捕捉参数异常，然后统一返回，详细可以参照上面的文章[统一异常处理](http://kai-keng.github.io/java-learning/spring-boot/1-exception.html#%E5%89%8D%E8%A8%80)

## 总结
参数校验是一个很重要的部分，通过注解的方式可以让我们的参数校验开发变得简单且美观，可读性强、可维护性强。

## 参考资料
* [这么写参数校验(validator)就不会被劝退了~](https://juejin.im/post/5d3fbeb46fb9a06b317b3c48)
* [SpringBoot使用Validation校验参数](https://blog.csdn.net/justry_deng/article/details/86571671)

<!-- ## END
**作者**: Borg

**创建时间**: 2020-07-10 08:57 周五

**最后更新时间**: 2020-07-10 08:57 周五 -->