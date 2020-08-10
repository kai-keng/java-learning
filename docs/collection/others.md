# 其他相关知识

## Collections 工具类
JDK 中提供了 Collections 工具类，其中有很多实用的方法，下面介绍下：

### 排序相关
```JAVA
void reverse(List list)// 反转
void shuffle(List list)// 随机排序
void sort(List list)// 按自然排序的升序排序
void sort(List list, Comparator c)// 定制排序，由Comparator控制排序逻辑
void swap(List list, int i , int j)// 交换两个索引位置的元素
void rotate(List list, int distance)// 旋转。当distance为正数时，将list后distance个元素整体移到前面。当distance为负数时，将 list的前distance个元素整体移到后面
```

### 查找替换相关
```JAVA
int binarySearch(List list, Object key)// 对List进行二分查找，返回索引，注意List必须是有序的
int max(Collection coll)// 根据元素的自然顺序，返回最大的元素。 类比int min(Collection coll)
int max(Collection coll, Comparator c)//根 据定制排序，返回最大元素，排序规则由Comparatator类控制。类比int min(Collection coll, Comparator c)
void fill(List list, Object obj)// 用指定的元素代替指定list中的所有元素。
int frequency(Collection c, Object o)// 统计元素出现次数
int indexOfSubList(List list, List target)// 统计target在list中第一次出现的索引，找不到则返回-1，类比int lastIndexOfSubList(List source, list target).
boolean replaceAll(List list, Object oldVal, Object newVal)// 用新元素替换旧元素
```

## fail-fast（快速失败）与 fail-safe（安全失败）

### fail-fast
**fail-fast** 是Java中避免在遍历集合的时候，集合内容被修改导致遍历结果不准确的一种安全策略。比如在多线程的情况下，一个线程在遍历集合，另一个线程在添加/删除集合元素，那么遍历的时候会抛出 `ConcurrentModificationException`。

原理是在集合中有个变量值 `modCount`，每当集合添加/删除元素的时候这个变量的值都会改变，而且每次遍历元素的时候都会调用 `checkForComodification` 方法校验 `modCount` 与变量 `expectedModCount` 是否相等，若不相等则抛出 `ConcurrentModificationException`。

```JAVA
final void checkForComodification() {
    if (modCount != expectedModCount)
        throw new ConcurrentModificationException();
}
```

但是使用Iterator（迭代器）的方式在遍历的时候删除元素是不会抛出 `ConcurrentModificationException` 异常的，因为这种方式会在修改 `modCount` 的同时修改 `expectedModCount`，所以在比较的时候值还是相等的。

### fail-safe
**fail-safe** 是指的遍历的并不是原集合容器，而且将原有的容器复制一份，然后对复制的副本进行遍历，这样即使原容器进行了修改操作也不会影响复制的副本，juc包下的容器都是基于 fail-safe 的，可以放心使用。

## 快速创建List
在日常开发中，经常会需要依据指定元素创建 List，如果按照 `new ArrayList<>()` 的写法再一个一个添加的话会非常麻烦，所以记录下一些快速创建 List 的方法：

* 使用 `Collections.addAll()` 方法，还是需要手动 `new ArrayList<>()`。
  ```JAVA
  ArrayList<Integer> list = new ArrayList<>();
  Collections.addAll(list, 1, 2, 3);
  ```

* 使用 Arrays.asList(...args) 直接返回一个 List，这种方式需要注意的是返回的 List 是 Arrays 的一个内部类，并没有实现集合的修改方法，只是转换了下接口，底层数据依旧是数组，如果这个时候对返回的数组进行修改操作，那么会抛出 `UnsupportedOperationException`。
  ```JAVA
  List<Integer> list = Arrays.asList(1, 2, 3);
  ```

* 使用 Guava 工具包下的 `Lists.newArrayList(...args)` 方法。
  ```JAVA
    List<Integer> list =  Lists.newArrayList(1, 2, 3);
  ```

* Java9中可以直接使用自带的List类。
  ```JAVA
  List<Integer> list =  List.of(1, 2, 3);
  ```

## 参考资料
1. [剖析面试最常见问题之 Java 集合框架](https://snailclimb.gitee.io/javaguide/#/docs/java/collection/Java%E9%9B%86%E5%90%88%E6%A1%86%E6%9E%B6%E5%B8%B8%E8%A7%81%E9%9D%A2%E8%AF%95%E9%A2%98?id=_12-collection-%e5%ad%90%e6%8e%a5%e5%8f%a3%e4%b9%8b-list)