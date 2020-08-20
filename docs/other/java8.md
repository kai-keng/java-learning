# Java8 新特性
Java8 版本发布了许多的新特性，而且是非常实用的新特性，利用好这些新特性能够加快我们的编程效率，让代码更加的美观简洁。

## Lambda
Lambda 表达式可以理解为一种匿名函数的写法，类似 JavaScript 中的箭头函数。分为**参数**、**箭头**与**函数体**3部分，比如这个 Lambda 表达式：

`(a, b) -> { System.out.println(a + b); }`

* **参数**

  表达式中 `(a, b)` 为参数部分，若参数只有一个时可以简写为 `a -> { System.out.println(a); }`，也可不传参数留空括号 `() -> { System.out.println("Test"); }`。

* **箭头**

  即中间的箭头 `->`。

* **函数体**

  函数体指箭头后面的部分 `{ System.out.println(a + b); }`。当函数体内直接返回某个值时 `a -> { return a; }`，可以省略外面的大括号，直接写作 `a -> a`。

### Lambda 表达式注意点
* Lambda 表达式中若引用局部变量，那么该局部变量必须用 final 修饰（若你没有使用 final 修饰，编译器会默认隐式的帮你加上）。

  因为局部变量是存放在栈内存中的，是线程私有的，当线程执行完成以后 GC 就会回收掉。但是 Lambda 表达式会被处理成使用额外的线程去执行，与创建局部变量的线程非同一线程，若拥有变量的线程执行完毕被销毁了，Lambda 表达式将无法获取到该变量。所以 Lambda 表达式中使用的局部变量都是原变量的一个拷贝，为了确保拷贝值与原值一定相同，所以要声明为 final 类型，避免修改。
  ```JAVA
  @Test
  void testLambda() {
      int i = 1;

      // 表达式中的i编译器会报错，要求你创建一个使用fianl修饰的变量
      Thread t = new Thread(() -> { System.out.println(i); });

      // 若去掉改行赋值，编译器不会报错，i变量会被隐式的加上final
      i = 2;

      t.start();
  }
  ```

## 方法引用
方法引用可以看做是一种简化的 Lambda 表达式，当你的 Lambda 表达式只是简单的调用某个方法时，可以使用方法引用代替。比如：

Lambda 写法：`(Integer i) -> i.toString()`

方法引用写法：`Object::toString`

> 注意：此处不写成 `Integer::toString` 或 `i::toString`，编译器会报错。因为 Integer 中有个静态的 toString 方法，也有
实例的 toString 方法，编译器无法确定使用哪个，所以会报错。

方法引用共有三种不同的形式，分别是：

* **类::静态方法**：`Integer::compare`

* **类::非静态方法**：`Object::toString`

* **实例::非静态方法**：`i::equals`

## 函数式接口
函数式接口指的是之定义了一个抽象方法的接口，并使用 `@FunctionalInterface` 标记。比如：

```JAVA
@FunctionalInterface
public interface Comparator<T>{
  int compare(T o1, T o2);
}
```

> 注意：接口中的默认（default）方法并不属于抽象方法，且用于重写超类 Object 类中的方法也不属于抽象方法，比如 equals 方法。

在 JDK 中内置了一些函数式接口供我们直接使用（列举部分），Lambda 表达式则可以灵活运用于函数式接口：

* Predicate：定义了一个 `test()` 的抽象方法，接受泛型 T 对象，并返回一个 boolean。
  ```JAVA
  @Test
  void testLambda() {
      test(t -> t.equals("OK"));
  }

  private void test(Predicate<String> predicate) {
      if (predicate.test("OK")) {
          System.out.println("OK");
      }
  }
  ```

* Consumer：定义了一个 `accept()` 的抽象方法，接受泛型 T 对象，没有返回（void）。
  ```JAVA
  @Test
  void testLambda() {
      test(t -> {
          if (t.equals("OK")) {
              System.out.println("OK");
          }
      });
  }

  private void test(Consumer<String> consumer) {
      consumer.accept("OK");
  }
  ```

* Function：定义了一个 `apply()` 的抽象方法，接受泛型 T 对象，并返回一个泛型 R 的对象。
  ```JAVA
  @Test
  void testLambda() {
      test(t -> t);
  }

  private void test(Function<String, String> function) {
      System.out.println(function.apply("is OK?"));
  }
  ```

* Supplier：定义了一个 `get()` 的抽象方法，没有传入参数，会返回一个泛型 T 的对象。
  ```JAVA
    @Test
    void testLambda() {
        test(() -> "OK");
    }

    private void test(Supplier<String> supplier) {
        System.out.println(supplier.get());
    }
  ```

* Runnable：定义了一个 `run()` 的抽象方法，没有传入参数也没有返回值，用于传入线程执行 `run()` 的具体实现方法。
  ```JAVA
  @Test
  void testLambda() {
      Thread t = new Thread(() -> { System.out.println("Test"); });

      t.start();
  }
  ```

## Stream（流）
Stream 是 Java8 中非常重要的一个概念，因为在我们日常开发中，集合是使用非常频繁的，但是往往集合的遍历、过滤、排序操作并不是那么的简单，写完可能就是大段的代码。但是 Straam 的出现大大的简化了我们的写法，让代码的可读性提高了很多，先简单看一个流操作：

需求：取出集合中的偶数并倒序排列

```JAVA
// 普通写法
@Test
void test() {
    List<Integer> list = Arrays.asList(1,2,3,4,5,6,7,8,9);
    List<Integer> result = new ArrayList<>();

    for (int i : list) {
        if (i % 2 == 0) {
            result.add(i);
        }
    }

    result.sort(Comparator.comparingInt(i -> -i));

    System.out.println(result.toString());
}
```

```JAVA
// 流写法
@Test
void test() {
    List<Integer> list = Arrays.asList(1,2,3,4,5,6,7,8,9);

    List<Integer> result = list.stream()
        .filter(i -> i % 2 == 0)
        .sorted(Comparator.comparingInt(i -> -i))
        .collect(Collectors.toList());

    System.out.println(result.toString());
}
```

对比上面的普通写法，使用流的链式写法直接一行搞定。

### 流的操作
流的操作可以拆分为3个部分：获取流 -> 中间操作 -> 终端操作。

上面的流操作：

```JAVA
List<Integer> result = list.stream() // 获取流
    .filter(i -> i % 2 == 0) // 中间操作
    .sorted(Comparator.comparingInt(i -> -i)) // 中间操作
    .collect(Collectors.toList()); // 终端操作
```

中间操作是指操作完成以后返回的还是 Stream 流对象，还能继续处理的方法，终端操作是指操作完成以后无返回值或者返回值不为 Stream 的方法。

**中间操作**：
| 操作 | 返回类型 | 操作参数 | 描述 |
| -- | -- | -- | -- |
filter | Stream | Predicate | 过滤操作，过滤掉返回值为 false 的值
map | Stream | Funcation<T, R> | 映射操作，将每项值映射返回为另一个值
sorted | Stream | Comparator | 排序操作
distinct | Stream |  | 去重操作
skip | Stream | long | 跳过指定条数的值
limit | Stream | long | 保留指定数据操作，保留前 n 条数据
flatMap | Stream | Funcation<T, Stream> | 传入对象，转化为流，常用来降低集合或数组嵌套层级

**终端操作**：
| 操作 | 返回类型 | 操作参数 | 描述 |
| -- | -- | -- | -- |
forEach | void | Consumer |  循环操作流
count | long |  | 计数
collect | R | Collector<T, A, R> | 收集器，收集流结果为集合
anyMatch | boolean | Predicate | 判断是否有任意符合条件的元素返回 true，反之 false
noneMatch | boolean | Predicate | 判断所有的元素都不符合条件返回 true，反之 false
allMatch | boolean | Predicate | 判断所有的元素都符合条件返回 true，反之 false
findAny | Optional |  | 返回任意一个元素，串行一般返回第一个，并行则不定
findFirst | Optional |  | 返回第一个元素
reduce | Optional | BinaryOperator | 合并操作，将元素两两进行计算并获取一个返回值，如此累加计算直至最后一项

### 操作详细介绍

#### 获取流
常用的流的创建方式有以下几种：

* Collection.stream：集合接口的默认方法。
  ```JAVA
  List<String> list = new ArrayList<>();
  Stream<String> stream = list.stream();
  ```

* Stream.of()
  ```JAVA
  Stream<String> stream = Stream.of("hello","world");
  ```

* Arrays.stream()
  ```JAVA
  IntStream stream = Arrays.stream(new int[]{1, 2, 3, 4, 5});
  ```

#### 中间操作

**流的起始集合**：

```JAVA
List<Integer> list = Arrays.asList(1,2,3,4,5,6,7,8,9);
```

**filter**：

```JAVA
// 过滤奇数，获取偶数，保留filter方法中返回true的元素
List<Integer> result = list.stream().filter(i -> i % 2 == 0).collect(Collectors.toList());
```

**map**：

```JAVA
// 将所有的值都乘以2，map即对每个元素做一定的处理，并返回新的元素
List<Integer> result = list.stream().map(i -> i * 2).collect(Collectors.toList());
```

**sorted**：

```JAVA
// 倒序排列
List<Integer> result = list.stream().sorted(Comparator.comparingInt(i -> -i)).collect(Collectors.toList());
```

**distinct**：

```JAVA
// 去重操作
List<Integer> result = list.stream().distinct().collect(Collectors.toList());
```

**skip**：

```JAVA
// 跳过（舍弃）前5条数据
List<Integer> result = list.stream().skip(5).collect(Collectors.toList());
```

**limit**：

```JAVA
// 只保留前5条数据，舍弃后4条
List<Integer> result = list.stream().limit(5).collect(Collectors.toList());
```

**flatMap**：

```JAVA
// flatMap稍微复杂点，单独展示个例子
@Test
void testLambda() {
    List<List<Integer>> list = Arrays.asList(Arrays.asList(1,2,3,4,5), Arrays.asList(6,7,8,9));

    List<Integer> result = list.stream().flatMap(Collection::stream).collect(Collectors.toList());

    System.out.println(result.toString());
}
// 执行结果
// [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

#### 终端操作

**流的起始集合**：

```JAVA
List<Integer> list = Arrays.asList(1,2,3,4,5,6,7,8,9);
```

**forEach**：

```JAVA
// 使用forEach循环打印元素
list.stream().forEach(System.out::println);
```

**count**：

```JAVA
// 计数
list.stream().count();
```

**anyMatch**：

```JAVA
// 判断是否有任意一个大于0的元素
list.stream().anyMatch(i -> i > 0);
```

**noneMatch**：

```JAVA
// 判断是否没有一个大于0的元素
list.stream().noneMatch(i -> i > 0);
```

**allMatch**：

```JAVA
// 判断是否所有元素都大于0
list.stream().allMatch(i -> i > 0);
```

**findAny**：

```JAVA
// 任意获取一个元素
list.stream().findAny().get();
```

**findFirst**：

```JAVA
// 任意获取一个元素
list.stream().findFirst().get();
```

> 此处 `findAny()` 与 `findFirst()` 需要注意一个点是如果使用 `get()` 获取元素，当流为空的时候，会抛出 `java.util.NoSuchElementException` 异常，但是使用 `list.stream().findFirst().orElse(null);` 的话，没有元素则会返回 null 值，也可返回你需要的指定值。

**reduce**：

reduce 较为复杂点，共有三个重载方法：

* `T reduce(T identity, BinaryOperator<T> accumulator);`

  该方法传入两个参数，参数 `identity` 表示传入的起始值，参数 `accumulator` 是计算方法，使用两个元素进行计算，初始使用起始值与第一个值计算，然后使用计算结果代替起始值，继续与下一个值计算，最终得到一个结果。

  ```JAVA
  // 使用reduce累加计算，起始0
  Integer i = list.stream().reduce(0, (a, b) -> a + b);
  // 结果
  // 45
  ```

* `Optional<T> reduce(BinaryOperator<T> accumulator);`

  该方法与上一方法的区别在于不需要传入起始值，直接使用第一个元素作为起始值计算，而且返回结果为 `Optional<T>`，与 `findAny` 方法返回值一致，可以使用 `get()` 与 `orElse(T other)` 方法来获取值。

  ```JAVA
  // 使用reduce累加计算，无起始值
  Integer i = list.stream().reduce((a, b) -> a + b).orElse(0);
  // 结果
  // 45
  ```

* `<U> U reduce(U identity, BiFunction<U, ? super T, U> accumulator, BinaryOperator<U> combiner);`

  该方法前两个参数类似第一个重载，分别是起始值和累加器，但是这个方法额外多了第三个参数，第三个参数的作用是当你使用 `parallelStream()` 并发执行 reduce 的时候，第三个参数即是用来将两个不同线程累加的结果合并的。
  
  除了参数的区别以外，这个方法最大的区别在于**返回值不需要与传入累加器的值得类型一致**，即可以传入一个 Integer 类型的数组，然后我返回一个 String 值，这在前两个方法是不被允许的。

  ```JAVA
  // 异步计算reduce方法，计算方法为字符串拼接
  String s = list.parallelStream().reduce("", (a, b) -> a + b, (a, b) -> a + b);
  // 结果
  // "123456789"
  ```

**collect（收集器）**：

收集器是用来将前面的处理结果收集处理为集合的，共有两个重载方法：

* `<R, A> R collect(Collector<? super T, A, R> collector);`

  这个为最常用的收集器方法，可以传入一个 `Collector`，一般即是直接调用 `Collectors` 类中的静态方法。

  ```JAVA
  // 将结果转化为list
  List<Integer> result = list.stream().collect(Collectors.toList());
  ```

  ```JAVA
  // 计数
  Long count = list.stream().collect(Collectors.counting());
  ```

  ```JAVA
  // 求和
  Integer sum = list.stream().collect(Collectors.summingInt(i -> i));
  ```

  `Collectors` 下面还有很多的方法都可以使用，具体情况可以依据自己需求使用。
  

* `<R> R collect(Supplier<R> supplier, BiConsumer<R, ? super T> accumulator, BiConsumer<R, R> combiner);`

  该方法与 `reduce` 方法有些类似，使用不多。

## Optional
Optional 类是一个可以为null的容器对象。使用好 Optional 可以很好的解决空指针异常的问题，避免书写大量的 `if else` 判空操作。在上面介绍的流中，`findAny()` 与 `reduce()` 方法返回的就是 Optional 对象。

### 创建 Optional
创建 Optional 对象的方式有三种：

* `Optional.empty()`

  创建一个空的 Optional 对象，内部未保存对象。

* `Optional.of(T value)`

  依据一个指定的对象来创建 Optional，此方法不接受空值，若传入空值将直接抛出 `NullPointException` 异常。

* `Optional.ofNullable(T value)`

  依据一个指定的对象来创建 Optional，此方法接受空值，传入空值将直接返回一个空的 Optional 对象，即与 `Optional.empty()` 一致。

### 处理 Optional
Optional 中有一些处理的方法，类似于流中的处理方法：

* `Optional<T> filter(Predicate<? super T> predicate)`

  如果 Optional 非空并且满足条件则返回当前 Optional 中的对象，否则返回一个空的 Optional 对象。

* `void ifPresent(Consumer<? super T> action)`

  如果 Optional 非空则执行传入的方法。

* `boolean isPresent()`

  判断当前 Optional 是否为空，为空返回 false，不为空返回 true。

* `boolean isEmpty()`

  与 `isPresent()` 相反，为空返回 true，不为空返回 false。

* `<U> Optional<U> map(Function<? super T, ? extends U> mapper)`

  如果 Optional 非空则执行传入的函数调用并返回一个 Optional 值。

* `<U> Optional<U> flatMap(Function<? super T, ? extends Optional<? extends U>> mapper)`

  该方法与 `map()` 方法的区别在于传入的 `Function` 需要返回一个继承自 `Optional<? extends U>` 类型的返回值，当非空时则执行该 `Function` 并返回。

### 获取 Optional 值
Optional 提供了一些方法来获取其中包含的对象值：

* `T get()`

  返回包含的对象值，如果为空则抛出 `NullPointException` 异常。

* `T orElse(T other)`

  返回包含的对象值，如果为空则返回传入的指定值 other。

* `T orElseGet(Supplier<? extends T> supplier)`

  返回包含的对象值，如果为空则返回传入的 Supplier 接口生成的值。

* `T orElseThrow()`

  返回包含的对象值，如果为空则抛出 `NoSuchElementException` 异常。

* `<X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier) throws X`

  返回包含的对象值，如果为空则抛出传入的 Supplier 接口生成的异常对象。


## 新日期时间
在 Java8 以前，JDK 提供了 Data 和 Calendar 用于处理时间，但是这两个处理时间都有很多的弊端，于是 Java8 吸取了 Joda-Time 库的经验，重新推出了一套时间处理 API，就是 `java.time` 包下的时间类，推荐使用新版本的时间类，下面来介绍下。（时间的概念可以参照廖雪峰老师写的[时间基本概念](https://www.liaoxuefeng.com/wiki/1252599548343744/1298613246361634)）

### 常用时间类
`java.time` 包下有以下常用的类。

#### 本地日期与时间：
  * LocalDate：表示本地日期，只保存日期不保存时间。
  * LocalTime：表示本地时间，只保存时间不保存日期。
  * LocalDateTime：表示本地日期和时间，同时保存日期和时间。

  本地时间类都实现了 Temporal 接口。

  常用通用方法：
  方法名 | 是否静态方法 | 描述
  | -- | -- | -- |
  from | 是 | 依据传入的 Temporal 对象创建对象实例
  now | 是 | 依据系统时钟创建 Temporal 对象
  of | 是 | 由 Temporal 对象的某个部分创建该对象的实例
  parse | 否 | 由字符串创建 Temporal 对象的实例
  atOffset | 否 | 将 Temporal 对象和某个时区偏移相结合
  atZone | 否 | 将 Temporal 对象和某个时区相结合
  format | 否 | 使用某个指定的格式器将 Temporal 对象转换为字符串（ Instant 类不提供该方法）
  get | 否 | 读取 Temporal 对象的某一部分的值
  minus | 否 | 创建 Temporal 对象的一个副本，通过将当前 Temporal 对象的值减去一定的时长创建该副本
  plus | 否 | 创建 Temporal 对象的一个副本，通过将当前 Temporal 对象的值加上一定的时长创建该副本
  with | 否 | 以该 Temporal 对象为模板，对某些状态进行修改创建该对象的副本
  isAfter | 否 | 判断时间是否晚于传入的时间
  isBefore | 否 | 判断时间是否早于传入的时间
  
  ```JAVA
  @Test
  void testTime() {
      // 获取当前本地日期
      LocalDate date = LocalDate.now();
      System.out.println("date ---" + date);

      // 获取当前本地时间
      LocalTime time = LocalTime.now();
      System.out.println("time ---" + time);

      // 通过date和time生成本地日期与时间对象
      LocalDateTime dateTime1 = LocalDateTime.of(date, time);
      System.out.println("dateTime1 ---" + dateTime1);

      // 通过dateTime1生成新的本地日期与时间对象
      LocalDateTime dateTime2 = LocalDateTime.from(dateTime1);
      System.out.println("dateTime2 ---" + dateTime2);

      // 减少一天
      LocalDateTime dateTime3 = dateTime2.minusDays(1);
      System.out.println("dateTime3 after minus ---" + dateTime3);

      // 增加两天
      LocalDateTime dateTime4 = dateTime3.plusDays(2);
      System.out.println("dateTime4 after plus ---" + dateTime4);

      // 通过of创建 2020-07-31 10:10 的时间
      LocalDateTime dateTime5 = LocalDateTime.of(2020, 7, 31, 10, 10);
      System.out.println("dateTime5 ---" + dateTime5);

      // 减少一个月，因6月没有31号，自动调整为30号
      LocalDateTime dateTime6 = dateTime5.minusMonths(1);
      System.out.println("dateTime6 after plus ---" + dateTime6);
  }
  // 结果
  // date ---2020-08-20
  // time ---13:25:14.690414
  // dateTime1 ---2020-08-20T13:25:14.690414
  // dateTime2 ---2020-08-20T13:25:14.690414
  // dateTime3 after minus ---2020-08-19T13:25:14.690414
  // dateTime4 after plus ---2020-08-21T13:25:14.690414
  // dateTime5 ---2020-07-31T10:10
  // dateTime6 after plus ---2020-06-30T10:10
  ```

  > 注意：本地时间类无法与时间戳互相转换，因为本地时间类不带有时区，无法准确转换成时间戳。

#### 带时区的日期和时间：
  * ZonedDateTime：表示带时区的日期和时间。可以简单理解为 `LocalDateTime` 与 `ZoneId` 结合，其他方法与 LocalDateTime 差不多。

  ```JAVA
  @Test
  void testTime() {
      // 默认时区 Asia/Shanghai
      ZonedDateTime zonedDateTime1 = ZonedDateTime.now();
      System.out.println("zonedDateTime1 ---" + zonedDateTime1);

      // 指定时区 America/New_York
      ZonedDateTime zonedDateTime2 = ZonedDateTime.now(ZoneId.of("America/New_York"));
      System.out.println("zonedDateTime2 ---" + zonedDateTime2);
  }
  // 结果
  // zonedDateTime1 ---2020-08-20T14:14:12.202375+08:00[Asia/Shanghai]
  // zonedDateTime2 ---2020-08-20T02:14:12.204008-04:00[America/New_York]
  ```

#### 时刻：
  * Instant：表示高精度时间戳，内部分别保存了以秒为单位的时间戳和更精确的纳秒精度

#### 时区：
  * ZoneId：表示时区。
  * ZoneOffset：UTC 时间偏移量，用于表示与标准 UTC 时间偏移的时差。尽量使用 `ZoneId` 而不是 `ZoneOffset`，因为 `ZoneOffset` 会受到一些因素的影响导致并不是固定不变的，比如美国夏令时就会改变偏移量。

#### 时间间隔：
  * Duration：表示两个时刻之间的时间间隔。
  * Period：表示两个日期之间的天数。

  ```JAVA
  @Test
  void testTime() {
      // 计算两个时间之间差值
      LocalDateTime start = LocalDateTime.of(2020, 7, 31, 10, 10);
      LocalDateTime end = LocalDateTime.now();
      Duration duration = Duration.between(start, end);
      System.out.println("duration ---" + duration);

      // 计算两个本地时间之间的相差天数
      Period period = LocalDate.of(2020, 8, 20).until(LocalDate.of(2020, 10, 31));
      System.out.println("period ---" + period);
  }
  // 结果(ISO 8601格式)
  // duration ---PT483H33M25.947865S  表示 483小时，33分钟，25.947865秒
  // period ---P2M11D  表示 2个月，11天
  ```

#### 日期格式化：
  * DateTimeFormatter：时间格式化器，可以将非标准化字符串时间转化为时间对象或将时间对象转化为指定格式的字符串。
  
  ```JAVA
  @Test
  void testTime() {
      DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
      System.out.println(dtf.format(LocalDateTime.now()));

      LocalDateTime time = LocalDateTime.parse("2020/08/20 15:16:17", dtf);
      System.out.println(time);
  }
  // 结果
  // 2020/08/20 11:14:29
  // 2020-08-20T15:16:17
  ```

### 时间转换

* LocalDateTime <-> ZonedDateTime

  ```JAVA
  @Test
  void testTime() {
      ZoneId zoneId = ZoneId.systemDefault();

      // LocalDateTime 转 ZonedDateTime
      ZonedDateTime zonedDateTime = LocalDateTime.now().atZone(zoneId);

      // ZonedDateTime 转 LocalDateTime
      LocalDateTime localDateTime = zonedDateTime.toLocalDateTime();
  }
  ```

* LocalDateTime <-> Instant

  ```JAVA
  @Test
  void testTime() {
      ZoneId zoneId = ZoneId.systemDefault();
      ZoneOffset offset = ZoneOffset.of("+8");

      // 使用 ZoneOffset 将 LocalDateTime 转 Instant
      // 不推荐这种方式，因为偏移容易出现问题
      Instant instant1 = LocalDateTime.now().toInstant(offset);

      // 使用 ZoneId 将 LocalDateTime 转 Instant
      Instant instant2 = LocalDateTime.now().atZone(zoneId).toInstant();

      // 先将Instant 转 ZonedDateTime 然后转 LocalDateTime
      LocalDateTime localDateTime1 = instant1.atZone(zoneId).toLocalDateTime();

      // 直接使用 ofInstant 方法将 Instant 转 LocalDateTime
      LocalDateTime localDateTime2 = LocalDateTime.ofInstant(instant2, zoneId);
  }
  ```

* Date <-> LocalDateTime

  ```JAVA
  @Test
  void testTime() {
      // 获取系统默认时区
      ZoneId zoneId = ZoneId.systemDefault();

      // LocalDateTime 转 Date
      // 先加上时区，转化为 ZonedDateTime
      ZonedDateTime zonedDateTime = LocalDateTime.now().atZone(zoneId);
      // 转化为时间戳，然后转化为 Date
      Date date = Date.from(zonedDateTime.toInstant());

      System.out.println("date --- " + date);

      // Date 转 LocalDateTime
      // Date 转化成 Instant 时间戳
      Instant instant = date.toInstant();
      // 时间戳转化为本地时间
      LocalDateTime localDateTime = LocalDateTime.ofInstant(instant, zoneId);

      System.out.println("localDateTime --- " + localDateTime);
  }
  // 结果
  // date --- Thu Aug 20 14:42:42 CST 2020
  // localDateTime --- 2020-08-20T14:42:42.207
  ```

## 参考资料
1. [这篇最全 Java 8 讲解，有没有之一先看后说！](https://juejin.im/post/6861849472499417096#heading-7)
2. [日期与时间](https://www.liaoxuefeng.com/wiki/1252599548343744/1255943660631584)