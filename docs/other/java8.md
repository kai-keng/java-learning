# Java8 新特性
Java8 版本发布了许多的新特性，而且是非常实用的新特性，利用好这些新特性能够加快我们的编程效率，让代码更加的美观简洁。

## Lambda
Lambda 表达式可以理解为一种匿名函数的写法，类似 JavaScript 中的箭头函数。分为**参数**、**箭头**与**函数体**3部分，比如这个 Lambda 表达式：

`(a, b) -> { System.out.println(a + b); }`

* 参数：表达式中 `(a, b)` 为参数部分，若参数只有一个时可以简写为 `a -> { System.out.println(a); }`，也可不传参数留空括号 `()`。

* 箭头：即中间的箭头 `->`。

* 函数体：函数体指箭头后面的部分 `{ System.out.println(a + b); }`。当函数体内直接返回某个值时 `a -> { return a; }`，可以省略外面的大括号，直接写作 `a -> a`。

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

## 参考资料
1. [这篇最全 Java 8 讲解，有没有之一先看后说！](https://juejin.im/post/6861849472499417096#heading-7)