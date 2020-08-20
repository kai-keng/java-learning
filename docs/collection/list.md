# List
List 中存储的元素是有序的，可重复的，List 接口下最常用的实现有2个：**ArrayList** 和 **LinkedList**，线程安全的有 **CopyOnWriteArrayList**，**Vector**。

## ArrayList
ArrayList 是 List 的主要实现类，底层使用 Object 数组存储，所以适用于频繁的查找工作，是线程不安全的。

因为底层使用的是数组结构保存，所以直接插入删除数据的话，会直接添加在末尾，时间复杂度是O(1)，但是如果在指定位置i插入或删除的话，指定位置后的数据都需要往后或往前移动一位，时间复杂度则是O(n-i)。且因为是数组，所以支持通过下标随机访问，查询效率高。

综合起来ArrayList适用于简单直接存储，频繁读取且不存在并发问题的场景。

### 扩容
ArrayList是可变的，但是它底层使用的是数组来保存，那么它是如何做到可变的呢？这就是它帮我们做到的动态扩容了。

Array构造器源码：
```JAVA
/**
  * 默认初始容量大小
  */
private static final int DEFAULT_CAPACITY = 10;


/**
  * 默认空数组对象
  */
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};

/**
  * 默认构造函数，初始值为空列表(无参数构造)
  */
public ArrayList() {
    this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}

/**
  * 带初始容量参数的构造函数。（用户自己指定容量）
  */
public ArrayList(int initialCapacity) {
    if (initialCapacity > 0) {// 如果初始容量大于0
        // 创建initialCapacity大小的数组
        this.elementData = new Object[initialCapacity];
    } else if (initialCapacity == 0) {// 如果初始容量等于0
        // 创建空数组
        this.elementData = EMPTY_ELEMENTDATA;
    } else {// 初始容量小于0，抛出异常
        throw new IllegalArgumentException("Illegal Capacity: " + initialCapacity);
    }
}


/**
* 构造包含指定collection元素的列表，这些元素利用该集合的迭代器按顺序返回
* 如果指定的集合为null，throws NullPointerException。 
*/
  public ArrayList(Collection<? extends E> c) {
    // 将传入的集合转为数组保存
    elementData = c.toArray();
    if ((size = elementData.length) != 0) {// 当传入的元素个数大于0
        // 如果toArray()方法转化后不为Object数组，利用Arrays.copyOf方法转化为Object数组
        if (elementData.getClass() != Object[].class)
            elementData = Arrays.copyOf(elementData, size, Object[].class);
    } else {// 当传入的元素个数不大于0
        // 保存空数组
        this.elementData = EMPTY_ELEMENTDATA;
    }
}
```

从上面的构造器源码可以看出来总共有3个构造器：
* 无参构造器：无参构造器默认初始化内部数组为空数组。
* int类型一参构造器：int构造器可以指定初始化数组的大小。
* Collection类型一参构造器：将传入的集合元素构造一个新的数组。

再来看看 `add` 方法，数组是怎么去扩容的：
```JAVA
/**
  * 将指定的元素追加到此列表的末尾。 
  */
public boolean add(E e) {
    //添加元素之前，先调用ensureCapacityInternal方法
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    //这里看到ArrayList添加元素的实质就相当于为数组赋值
    elementData[size++] = e;
    return true;
}
```
> 注意 ：JDK11 移除了 ensureCapacityInternal() 和 ensureExplicitCapacity() 方法。

可以看到 `add` 方法直接调用了 `ensureCapacityInternal` 方法，然后直接在数组末尾赋值了，那么再来看看 `ensureCapacityInternal` 方法：

```JAVA
//得到最小扩容量
private void ensureCapacityInternal(int minCapacity) {
    // 判断是否等于初始化的空列表
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
          // 获取默认的容量和传入参数中的较大值
        minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity);
    }

    ensureExplicitCapacity(minCapacity);
}
```

`ensureCapacityInternal` 方法中先判断当前列表是否为空，为空则获取传入值与默认列表值中较大的一个，然后继续调用 `ensureExplicitCapacity` 方法：

```JAVA
//判断是否需要扩容
private void ensureExplicitCapacity(int minCapacity) {
    // 用来保存List被修改次数的变量，不需要管
    modCount++;

    // overflow-conscious code
    if (minCapacity - elementData.length > 0) // 判断当前传入值是否大于列表长度
        // 调用grow方法进行扩容，调用此方法代表已经开始扩容了
        grow(minCapacity);
}
```

`ensureExplicitCapacity` 方法会判断传入的扩容长度是否大于当前列表的长度，如果大于，那就调用 `grow` 方法扩容列表：

```JAVA
/**
  * 要分配的最大数组大小
  */
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

/**
  * ArrayList扩容的核心方法。
  */
private void grow(int minCapacity) {
    // oldCapacity为旧容量
    int oldCapacity = elementData.length;

    // newCapacity为新容量, 新容量的值为旧容量的值+旧容量右移一位的值
    // 将oldCapacity 右移一位，其效果相当于oldCapacity /2，
    // 位运算的速度远远快于整除运算，整句运算式的结果就是将新容量更新为旧容量的1.5倍，
    int newCapacity = oldCapacity + (oldCapacity >> 1);

    // 获取到新容量的值以后，判断新容量是否小于传入的需要的容量，如果小于则使用传入的容量作为新容量
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;

    // 如果新容量大于 MAX_ARRAY_SIZE，调用hugeCapacity方法并将方法返回值设置为新容量
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);

    // 将列表的值复制到一个新容量长度的新列表中
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```
> ">>"（移位运算符）：>>1 右移一位相当于除2，右移n位相当于除以 2 的 n 次方。这里 oldCapacity 右移了1位所以相当于oldCapacity / 2。对于大数据的2进制运算，位移运算符比那些普通运算符的运算要快很多，因为程序仅仅移动一下而已，不去计算，这样提高了效率，节省了资源。

`grow` 方法中则是先将容量扩展到原容量的1.5倍左右（oldCapacity为偶数就是1.5倍，否则是1.5倍左右），若扩展的容量依旧小于所需要的容量，那么直接拓展到所需要的容量，并且判断所需的容量是否大于数组最大容量，如果大于则调用 `hugeCapacity` 方法，将方法返回值作为最终拓展到的容量：

```JAVA
private static int hugeCapacity(int minCapacity) {
    if (minCapacity < 0) // overflow
        throw new OutOfMemoryError();

    return (minCapacity > MAX_ARRAY_SIZE) ?
        Integer.MAX_VALUE :
        MAX_ARRAY_SIZE;
}
```

`hugeCapacity` 方法直接是将传入所需容量与最大数组值做比较，如果大于则返回 `Integer.MAX_VALUE`，否则返回数组最大值 `MAX_ARRAY_SIZE`(Integer.MAX_VALUE - 8)。

至此，整个扩容流程都比较清晰了，我们可以分析下以下代码的扩容流程再来理清楚一次：
```JAVA
List list = new ArrayList<Integer>();
list.add(1);
```

1. 创建一个新的 `ArrayList`，调用空参构造器，初始化为空列表。
2. `list` 添加一个元素，`add` 方法调用`ensureCapacityInternal(size + 1)`方法检查容量，`size + 1 = 0 + 1 = 1`。
3. `ensureCapacityInternal`判断列表为空列表，获取传入值(1)和默认值(10)的较大值10，**10**是这次需要扩容的值，调用`ensureExplicitCapacity`。
4. `ensureExplicitCapacity`中判断**10**大于当前列表的长度(0)，调用`grow`扩容方法，目标10.
5.  `grow`中先获取原列表长度的**1.5**倍左右的值(0)，0小于我们需要扩容的目标值(10)，将目标值作为扩容值，且目标值小于`MAX_ARRAY_SIZE`(Integer.MAX_VALUE - 8)，不调用`hugeCapacity`方法，然后调用`Arrays.copyOf`复制出一个长度为10的空数组。
6. 返回到 `add` 方法中的 `elementData[size++] = e;`，将1插入下标0的位置，并且 size++(1)，返回 true，操作结束。

### ensureCapacity方法
在 `ArrayList` 源码中还有一个`ensureCapacity`方法：

```JAVA
/**
  *  如有必要，增加此 ArrayList 实例的容量，以确保它至少可以容纳由minimum capacity参数指定的元素数。
  *
  * @param   minCapacity   所需的最小容量
  */
public void ensureCapacity(int minCapacity) {
    // 判断当前列表是否等于初始化的空列表，如果相等返回默认长度，不相等返回0
    int minExpand = (elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA)
        // any size if not default element table
        ? 0
        // larger than default for default empty table. It's already
        // supposed to be at default size.
        : DEFAULT_CAPACITY;

    if (minCapacity > minExpand) {
        ensureExplicitCapacity(minCapacity);
    }
}
```

`ensureCapacity` 方法首先判断当前列表是否等于初始化的空列表，如果相等返回默认长度，不相等返回0。然后判断传入参数是否大于上面判断的结果，如果大于则使用传入参数去扩容。这个方法等于是给了我们一个主动给 `ArrayList` 扩容的手段，当我们即将往 `ArrayList` 中存储大量的值的时候，我们可以先主动调用这个方法，将 `ArrayList` 扩容到我们需要的长度，这样可以避免自动扩容的多次判断与扩容消耗，增加性能。


## LinkedList
LinkedList 是一个底层使用双向列表实现的，线程不安全的列表。它与 ArrayList 的主要区别即是因为底层实现不同导致的。

双向链表与数组不同之处在于链表针对于插入或删除操作非常迅速，只需要修改指定元素的直接后继和直接前驱即可，但是链表不支持随机访问，在查询效率上不及 ArrayList。

如果直接插入或删除元素时间复杂度近似 O(1)，但是如果要在指定位置插入或删除的话，因为链表查询效率慢，需要从头遍历，时间复杂度近似为o(n)。

所以相对ArrayList来说，插入和删除并没有什么优势，且因为链表需要存储直接后继和直接前驱，每个元素所消耗的空间都比数组多。

## Vector
Vector 也是一个底层使用数组实现的列表，但是与 ArrayList 不同之处在于它是线程安全的，且在扩容的时候是2倍扩容，而 ArrayList 是1.5倍。

因为性能远远差于 CopyOnWriteArrayList，所以不会使用。

## CopyOnWriteArrayList
CopyOnWrite 机制是一种优化策略，在并发场景下常用的设计思想 -- **写入时复制思想**。

> 写入时复制思想：即当多个线程同时访问同一个数据的时候，需要修改数据的线程不直接修改数据，而是先将数据复制一份，然后对数据副本进行修改。

CopyOnWriteArrayList 即是一个使用**写入时复制思想实现**的线程安全的 List。

它在往列表中添加元素的时候，不会直接操作原列表，而是先将原列表复制一份，然后修改原列表的副本，修改完成以后将原列表的指针改为指向修改以后的副本数据。

这样做的好处在于，我们可以在并发的场景下对容器进行"读操作"而不需要"加锁"，从而达到读写分离的目的。

**优点**：
* 适合用于读多写少的环境，因为读取操作没有任何的锁操作，在并发环境下性能很高。如果我们使用 ArrayList 的话，在并发环境不加锁的情况下，如果一个线程在读取，一个线程在修改，那么读线程在遍历的时候会抛出 `ConcurrentModificationException` 异常。反观 CopyOnWriteArrayList 则因为其在写时修改的是副本，且在写入时加锁保证了安全，不会出现异常。

**缺点**：
* 每次在执行写操作的时候都需要将原列表复制一份，当列表很大的时候非常消耗内存，可能因内存过大会导致频繁的Full GC。
* 因为每次写操作都是在副本上操作，且读操作不会阻塞，会导致读取的数据不是最新的数据，出现数据一致性问题。所以不适合对实时数据一致性要求较高的情况。

## 参考资料
1. [剖析面试最常见问题之 Java 集合框架](https://snailclimb.gitee.io/javaguide/#/docs/java/collection/Java%E9%9B%86%E5%90%88%E6%A1%86%E6%9E%B6%E5%B8%B8%E8%A7%81%E9%9D%A2%E8%AF%95%E9%A2%98?id=_12-collection-%e5%ad%90%e6%8e%a5%e5%8f%a3%e4%b9%8b-list)
2. [通过源码一步一步分析 ArrayList 扩容机制](https://github.com/Snailclimb/JavaGuide/blob/master/docs/java/collection/ArrayList-Grow.md)
3. [CopyOnWrite容器](http://concurrent.redspider.group/article/03/16.html)