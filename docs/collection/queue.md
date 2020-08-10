# Queue
队列是一种支持 FIFO（先进先出） 的数据结构，尾部添加、头部删除，跟我们生活中的排队类似。Queue 接口也继承自 Collection 接口，主要实现有LinkedList、PriorityQueue、BlockingQueue等。


## 队列常用方法
方法名 | 方法描述
-- | -- |
add | 增加一个元索 如果队列已满，则抛出一个IIIegaISlabEepeplian异常
remove | 移除并返回队列头部的元素 如果队列为空，则抛出一个NoSuchElementException异常
element | 返回队列头部的元素 如果队列为空，则抛出一个NoSuchElementException异常
offer | 添加一个元素并返回true 如果队列已满，则返回false
poll | 移除并返问队列头部的元素 如果队列为空，则返回null
peek | 返回队列头部的元素 如果队列为空，则返回null
put | 添加一个元素 如果队列满，则阻塞
take | 移除并返回队列头部的元素 如果队列为空，则阻塞


## 双端队列
普通的队列只可以在队尾添加数据，队头获取数据，但是双端队列两端都可以添加或获取数据，即可以打破先进先出的规则，所以双端队列也可以当做栈使用（后进先出），在 Java 中 实现 Dequeue 接口的均为双端队列。

对应方法：
Queue 方法 | 等效Deque方法
-- | --
add(e) | addLast(e)
offer(e) | offerLast(e)
remove() | removeFirst()
poll() | pollFirst()
element() | getFirst()
peek() | peekFirst()

栈方法 | 等效Deque方法
-- | --
push(e) | addFirst(e)
pop() | removeFirst()
peek() | peekFirst()

## 实现介绍
LinkedList 请参照[LinkedList](https://kai-keng.github.io/java-learning/collection/list.html#linkedlist)

阻塞队列 PriorityQueue、BlockingQueue 请参照[阻塞队列
](https://kai-keng.github.io/java-learning/multi-thread/thread-util.html#%E9%98%BB%E5%A1%9E%E9%98%9F%E5%88%97)


## 参考资料
1. [深入理解Java集合之---Deque](https://www.jianshu.com/p/d78a7c982edb)
2. [Java队列（Queue）了解及使用](https://www.jianshu.com/p/7a86c56c632b)