# JDK工具

## 线程池

### 概念
在多线程开发中，我们如果需要新建一个线程来完成我们的任务的话需要3个步骤：
1. 新建线程
2. 线程完成任务
3. 销毁线程

这个流程中，如果我们的并发任务很多，频繁的去新建线程和销毁线程是非常消耗我们的资源和时间的。这个时候就提出了将线程与池相结合，在一个池子里面放一些线程，用的时候从里面取出来，不用的时候放回去，通过保持一定数量的线程来节省我们新建线程和销毁线程的开销，这就是线程池。

### 线程池的优点
1. 复用已经创建的线程，节省创建/销毁线程的开销
2. 控制并发的数量，避免因并发线程数过多导致崩溃（主要原因）
3. 可以对线程进行统一管理

### Java中的线程池
Java中的线程池顶层接口是Executor接口，ThreadPoolExecutor是这个接口的实现类，我们可以通过ThreadPoolExecutor来使用线程池。

### 特殊名词
* 核心线程：线程池中分为核心线程和非核心线程，核心线程是常驻于线程池中，默认即使没有任务也不会被销毁的线程，非核心线程长时间闲置则会被销毁。
* 阻塞队列：线程池中用于保存等待执行的Runnable任务对象的队列。

### ThreadPoolExecutor构造器
ThreadPoolExecutor有4个构造器，分别有5-7个参数，所有的参数如下，

必要参数：
* int corePoolSize：该线程池中核心线程数最大值。
* int maximumPoolSize：该线程池中线程总数最大值 。
* long keepAliveTime：非核心线程闲置超时时长。
* TimeUnit unit：keepAliveTime的单位。
  > 包含如下单位： NANOSECONDS(微毫秒)，MICROSECONDS(微秒)，MILLISECONDS(毫秒)，SECONDS(秒)，MINUTES(分)，HOURS(小时)，DAYS(天)。
* BlockingQueue workQueue：阻塞队列，维护着等待执行的Runnable任务对象。
  > 常用的几个阻塞队列：
  >  * LinkedBlockingQueue：链式阻塞队列，底层数据结构是链表，默认大小是Integer.MAX_VALUE，也可以指定大小。
  >  * ArrayBlockingQueue：数组阻塞队列，底层数据结构是数组，需要指定队列的大小。
  >  * SynchronousQueue：同步队列，内部容量为0，每个put操作必须等待一个take操作，反之亦然。
  >  * DelayQueue：延迟队列，该队列中的元素只有当其指定的延迟时间到了，才能够从队列中获取到该元素 。

非必要参数：
* ThreadFactory threadFactory：创建线程的工厂 ，用于批量创建线程，统一在创建线程时设置一些参数，如是否守护线程、线程的优先级等。如果不指定，会新建一个默认的线程工厂。
* RejectedExecutionHandler handler：拒绝处理策略，线程数量大于最大线程数就会采用拒绝处理策略。
  > 包含如下四种拒绝处理的策略：
  >  * ThreadPoolExecutor.AbortPolicy：默认拒绝处理策略，丢弃任务并抛出RejectedExecutionException异常。
  >  * ThreadPoolExecutor.DiscardPolicy：丢弃新来的任务，但是不抛出异常。
  >  * ThreadPoolExecutor.DiscardOldestPolicy：丢弃队列头部（最旧的）的任务，然后重新尝试执行程序（如果再次失败，重复此过程）。
  >  * ThreadPoolExecutor.CallerRunsPolicy：由调用线程处理该任务。

### ThreadPoolExecutor状态
因为ThreadPoolExecutor本身也是由一个调度线程来对整个线程池进行调度管理的，所以线程池自己也有状态。ThreadPoolExecutor类中定义了一个`volatile int`变量`runState`来表示线程池的状态 ，共有5种，分别为：
* RUNNING：线程池创建后处于RUNNING状态。
* SHUTDOWN：调用shutdown()方法后处于SHUTDOWN状态，线程池不能接受新的任务，清除一些空闲worker,会等待阻塞队列的任务完成。
* STOP：调用shutdownNow()方法后处于STOP状态，线程池不能接受新的任务，中断所有线程，阻塞队列中没有被执行的任务全部丢弃。此时，poolsize=0,阻塞队列的size也为0。
* TIDYING：当所有的任务已终止，ctl记录的”任务数量”为0，线程池会变为TIDYING状态。接着会执行terminated()函数。
  > ThreadPoolExecutor中有一个控制状态的属性叫ctl，它是一个AtomicInteger类型的变量。
* TERMINATED：线程池处在TIDYING状态时，执行完terminated()方法之后，就会由 TIDYING -> TERMINATED， 线程池被设置为TERMINATED状态。

### ThreadPoolExecutor处理流程
1. 执行任务时，先判断当前线程池中线程数是否达到了corePoolSize，若小于则创建新的核心线程并添加当前任务至新建的核心线程中。
2. 若线程池中线程数 >= corePoolSize，则不再创建新的核心线程，将任务直接放入任务阻塞队列，等待核心线程执行完任务以后回队列取出新的任务执行（复用）。
3. 当任务阻塞队列满了时，表明当前核心线程数已经不够使用了，则会创建非核心线程来处理任务。
4. 若当前线程总数（核心线程数+非核心线程）达到了maximumPoolSize且任务队列满了，则开始使用拒绝策略处理多余的任务。
> 注意，不管是创建核心线程还是非核心线程，都需要获取到ThreadPoolExecutor的全局锁。

### 4种常见线程池
在`Executors`类中提供了创建4种线程池静态方法，供我们直接调用创建指定的线程池。

* newCachedThreadPool
  ```JAVA
  public static ExecutorService newCachedThreadPool() {
      return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                    60L, TimeUnit.SECONDS,
                                    new SynchronousQueue<Runnable>());
  }
  ```
  1. corePoolSize大小为0，没有核心线程
  2. 线程池最大为Integer.MAX_VALUE
  3. 非核心线程过期时间60s
  4. 使用同步队列存储任务，任务池中只存放一个任务，再放入任务需阻塞

  因为线程会在60s内销毁，所以线程在执行一些短时间任务的时候复用率会比较高，性能较好。且由于没有核心线程且非核心线程60s闲置便会过期，线程池在空闲的时候不会占用很多资源。因为线程池特别大，几乎不会触发拒绝策略。

* newFixedThreadPool
  ```JAVA
  public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                      0L, TimeUnit.MILLISECONDS,
                                      new LinkedBlockingQueue<Runnable>());
  }
  ```
  1. corePoolSize = maximumPoolSize，池中所有的线程都是核心线程
  2. 线程不过期
  3. 使用链式阻塞队列存储任务

  线程池中所有的线程都是核心线程，不会被销毁，任务队列使用链式阻塞队列存储，基本没有上限。所以适合处理长期固定一直有任务需要处理的情况，需要特别注意的是因为线程不会被销毁，比较占用资源。也几乎不会触发拒绝策略，因为任务队列很大。

* newSingleThreadExecutor
  ```JAVA
  public static ExecutorService newSingleThreadExecutor() {
  return new FinalizableDelegatedExecutorService
      (new ThreadPoolExecutor(1, 1,
                              0L, TimeUnit.MILLISECONDS,
                              new LinkedBlockingQueue<Runnable>()));
  }
  ```
  1. corePoolSize = maximumPoolSize = 1, 线程池中只有一个核心线程
  2. 线程不过期
  3. 使用链式阻塞队列存储任务

  线程池只有一个处理任务的核心线程，任务都需要在队列中等待唯一的核心线程处理完毕以后来获取。

* newScheduledThreadPool
  ```JAVA
  public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
    return new ScheduledThreadPoolExecutor(corePoolSize);
  }

  public ScheduledThreadPoolExecutor(int corePoolSize) {
      super(corePoolSize, Integer.MAX_VALUE,
            DEFAULT_KEEPALIVE_MILLIS, MILLISECONDS,
            new DelayedWorkQueue());
  }
  ```
  1. 指定长度的corePoolSize
  2. 线程池长度为Integer.MAX_VALUE
  3. 使用延迟阻塞队列存储任务

  该线程池主要的特性是使用延迟阻塞队列存储任务，故可以周期性的定时执行任务队列中的任务。

  > 虽然`Executors`提供了以上4种线程池，但是**阿里巴巴JAVA开发手册**规定了需自己使用`ThreadPoolExecutor`自行创建需要的线程池，这样可以让程序员自行创建出符合要求的线程池，让资源消耗在我们的掌控之中，避免因线程池或任务队列设置成`Integer.MAX_VALUE`后发生一些资源耗尽的情况。

### 使用ThreadPoolExcutor
```JAVA
private static AtomicInteger i = new AtomicInteger(0);

public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 新建一个核心线程数10，最大线程数20的线程池
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
                10, 20, 60L, TimeUnit.SECONDS, new LinkedBlockingQueue<>());

        for (int j = 0; j < executor.getMaximumPoolSize(); j++) {
            // 调用线程池的execute方法，放入任务
            executor.execute(() -> {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                i.addAndGet(1);
            });

            // 调用线程池的submit方法，放入任务
            FutureTask<Integer> task = (FutureTask) executor.submit(() -> {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                return i.addAndGet(1);
            });

            // submit方法不同于execute方法，submit有返回值FutureTask类，调用get方法即可获取线程执行任务的结果
            System.out.println(task.get());
        }
    }
```


## 阻塞队列

为了让我们高效安全“传输”数据，快速搭建高质量的多线程程序，java.util.concurrent包下给我们提供了**BlockingQueue（阻塞队列）**，我们使用它可以很快很方便的实现一个生产者消费者模式，包括Java提供的线程池中也是使用阻塞队列来存储任务的。

### BlockingQueue的操作方法
阻塞队列提供了四组不同的方法用于插入、移除、检查元素：

方法\处理方式 |	抛出异常 | 返回特殊值 |	一直阻塞 | 超时退出
---|---|---|---|---|
插入方法 | add(e)| offer(e) | put(e) | offer(e,time,unit)
移除方法 | remove() |	poll() | take() |	poll(time,unit)
检查方法 | element() | peek() | - | -

* 抛出异常：如果试图的操作无法立即执行，抛异常。当阻塞队列满时候，再往队列里插入元素，会抛出IllegalStateException(“Queue full”)异常。当队列为空时，从队列里获取元素时会抛出NoSuchElementException异常 。
* 返回特殊值：如果试图的操作无法立即执行，返回一个特殊值，通常是true / false。
* 一直阻塞：如果试图的操作无法立即执行，则一直阻塞或者响应中断。
* 超时退出：如果试图的操作无法立即执行，该方法调用将会发生阻塞，直到能够执行，但等待时间不会超过给定值。返回一个特定值以告知该操作是否成功，通常是 true / false。

注意之处：

* 不能往阻塞队列中插入null,会抛出空指针异常。
* 可以访问阻塞队列中的任意元素，调用remove(o)可以将队列之中的特定对象移除，但并不高效，尽量避免使用。

### 5种阻塞队列

* ArrayBlockingQueue：基于数组的有界阻塞队列，具有数组特性，大小可初始化，初始化后不可变，可通过参数选择是否为公平锁，默认为非公平锁。
* LinkedBlockingQueue：基于链表的有界阻塞队列，具有链表特性，大小默认为Integer.MAX_VALUE，可指定大小，队列按照先进先出排序。
* DelayQueue：无界队列，只有设定的延迟时间到了才能从队列中取出数据，注入其中的元素必须实现 java.util.concurrent.Delayed接口。
* PriorityBlockingQueue：基于优先级的无界阻塞队列（优先级的判断通过构造函数传入的Compator对象来决定），内部控制线程同步的锁采用的是公平锁。
* SynchronousQueue：与其他的队列不同，SynchronousQueue内部不直接存储，而是维护一组线程，都在等待着放入元素或取出元素。所以每个put操作必定阻塞，等待下一个take操作，反之一样。

  因其的特殊性，所有有些方法返回值也比较特殊：
  * iterator()：永远返回空，因为里面没有东西。
  * peek()：永远返回null。
  * offer()：往队列中放置一个元素且并不等待，除非碰巧有队列在取出数据，会返回true，否则都是返回false。
  * poll()：从队列中取出一个元素且并不等待，除非碰巧有队列在放置数据，则返回数据，否则都是null。
  * isEmpty()：永远返回true
  * remove()&removeAll()：永远返回false

**注意：**
长度为Integer.MAX_VALUE的LinkedBlockingQueue、DelayQueue与PriorityBlockingQueue时，因其是无界队列，所以生产者不会阻塞，只有消费者才会阻塞。我们需要注意的是在使用的时候消费者消费的速度必须大于生产者生产的速度，不然长期下去因为队列是无界的，所有的堆内存空间最终会被耗尽。

### 阻塞队列流程
**put的流程：**
1. 所有执行put操作的线程竞争lock锁，拿到了lock锁的线程进入下一步，没有拿到lock锁的线程自旋竞争锁。
2. 判断阻塞队列是否满了，如果满了，则调用await方法阻塞这个线程，并标记为notFull（生产者）线程，同时释放lock锁,等待被消费者线程唤醒。
3. 如果没有满，则调用enqueue方法将元素put进阻塞队列。注意这一步的线程还有一种情况是第二步中阻塞的线程被唤醒且又拿到了lock锁的线程。
4. 唤醒一个标记为notEmpty（消费者）的线程。


**take的流程：**

1. 所有执行take操作的线程竞争lock锁，拿到了lock锁的线程进入下一步，没有拿到lock锁的线程自旋竞争锁。
2. 判断阻塞队列是否为空，如果是空，则调用await方法阻塞这个线程，并标记为notEmpty（消费者）线程，同时释放lock锁,等待被生产者线程唤醒。
3. 如果没有空，则调用dequeue方法。注意这一步的线程还有一种情况是第二步中阻塞的线程被唤醒且又拿到了lock锁的线程。
4. 唤醒一个标记为notFull（生产者）的线程。

**注意：**
1. put和take操作都需要先获取锁，没有获取到锁的线程会被挡在第一道大门之外自旋拿锁，直到获取到锁。
2. 就算拿到锁了之后，也不一定会顺利进行put/take操作，需要判断队列是否可用（是否满/空），如果不可用，则会被阻塞，并释放锁。
3. 在第2点被阻塞的线程会被唤醒，但是在唤醒之后，依然需要拿到锁才能继续往下执行，否则，自旋拿锁，拿到锁了再while判断队列是否可用（这也是为什么不用if判断，而使用while判断的原因）。


### 测试代码
```JAVA
@Test
void testBlockingQueue() throws InterruptedException {
    ExecutorService executor1 = Executors.newFixedThreadPool(20);
    LinkedBlockingQueue blockingQueue = new LinkedBlockingQueue();

    for (int i = 0; i < 20; i++) {
        int finalI = i;
        executor1.execute(() -> {
            try {
                blockingQueue.put(finalI);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
    }

    do {
        Object o = blockingQueue.take();
        System.out.println(o);
    } while (!blockingQueue.isEmpty());
}
```

## 锁接口和类
在日常高并发开发中，synchronized关键词有许多的不足之处，为了弥补这些不足之处，jdk在java.util.concurrent（简称juc）下的locks包下提供了几个关于锁的接口和类，这几个接口和类可以解决synchronized不能解决的问题。

### synchronized不足之处
* 如果临界区是只读操作，其实可以多线程一起执行，但使用synchronized的话，同一时间只能有一个线程执行。
* synchronized无法知道线程有没有成功获取到锁
* 使用synchronized，如果临界区因为IO或者sleep方法等原因阻塞了，而当前线程又没有释放锁，就会导致所有线程等待。

### 锁的分类

#### 可重入锁和非可重入锁
可重入锁是指支持线程对资源多次加锁，非可重入锁则不允许多次加锁。

synchronized关键字就是使用的重入锁。比如说，你在一个synchronized实例方法里面调用另一个本实例的synchronized实例方法，它可以重新进入这个锁，不会出现任何异常。

#### 公平锁与非公平锁
公平锁是指依据先入先出的原则，先请求锁的线程一定会先获取到锁，而非公平锁则随机派锁，不会按照先入先出的原则安排。

一般情况下，非公平锁能提升一定的效率。但是非公平锁可能会发生线程饥饿（有一些线程长时间得不到锁）的情况。所以要根据实际的需求来选择非公平锁和公平锁。

#### 读写锁和排它锁
排他锁是指同一时间只允许一个线程访问资源，排斥其他的线程，而读写锁可以再同一时刻允许多个读线程访问。

### juc下的锁接口和类

#### 抽象类AQS/AQLS/AOS
AQS是之前介绍过的抽象队列同步器，它其中使用了一个int类型的变量来表示资源，有时候我们的业务需求资源的数量超出了int的范围，所以在JDK 1.6 中，多了一个AQLS（AbstractQueuedLongSynchronizer）。它的代码跟AQS几乎一样，只是把资源的类型变成了long类型。

AQS和AQLS都继承了一个类叫AOS（AbstractOwnableSynchronizer）。这个类也是在JDK 1.6 中出现的。这个类只有几行简单的代码，它是用于表示锁与持有者之间的关系（独占模式）。

#### 接口Lock/ReadWriteLock/Condition，类LockSupport
* Lock：Lock接口里面有一些获取锁和释放锁的方法声明。
* ReadWriteLock：ReadWriteLock里面只有两个方法，分别返回“读锁”和“写锁”。
* Condition：Condition接口提供了类似Object监视器（对象的await、notify）的方法，通过与Lock配合来实现等待/通知模式，通过Lock的`newCondition`方法可以获取一个Condition。
* LockSupport：LockSupport也实现了等待/通知模式，可以用`park`、`unpark`方法来阻塞/唤醒线程。
  > LockSupport的原理是每个线程都有一个许可(permit)，permit只有两个值1和0，默认是0。
  > 1. 当调用unpark(thread)方法，就会将thread线程的许可permit设置成1(注意多次调用unpark方法，不会累加，permit值还是1)。
  >
  > 2. 当调用park()方法，如果当前线程的permit是1，那么将permit设置为0，并立即返回。如果当前线程的permit是0，那么当前线程就会阻塞，直到别的线程将当前线程的permit设置为1时，park方法会被唤醒，然后会将permit再次设置为0，并返回。
  >
  > 注意：因为permit默认是0，所以一开始调用park()方法，线程必定会被阻塞。调用unpark(thread)方法后，会自动唤醒thread线程，即park方法立即返回。

  Object监视器、Condition与LockSupport的对比：
  对比项 | Object监视器 | Condition | LockSupport
  -- | -- | -- | -- |
  前置条件 | 获取对象的锁 | 调用Lock.lock获取锁，调用Lock.newCondition获取Condition对象 | 无
  调用方式 | 直接调用，比如object.notify() | 直接调用，比如condition.await() | 直接调用，比如lockSupport.park()
  等待队列的个数 | 一个 | 多个 | 无
  当前线程释放锁进入等待状态 | 支持 | 支持 | 支持
  当前线程释放锁进入等待状态，在等待状态中不中断 | 不支持 | 支持 | 不支持
  当前线程释放锁并进入超时等待状态 | 支持 | 支持 | 支持
  当前线程释放锁并进入等待状态直到将来的某个时间 | 不支持 | 支持 | 支持
  唤醒等待队列中的一个线程 | 支持 | 支持 | 支持
  唤醒等待队列中的全部线程 | 支持 | 支持 | 不支持
  在加锁之前唤醒线程 | 不支持 | 不支持 | 支持


  **Condition：** Condition和Object的wait/notify基本相似。其中，Condition的await方法对应的是Object的wait方法，而Condition的signal/signalAll方法则对应Object的notify/notifyAll()。但Condition类似于Object的等待/通知机制的加强版。我们来看看主要的方法：
  方法名称 | 描述
  -- | -- | 
  await() | 当前线程进入等待状态直到被通知（signal）或者中断；当前线程进入运行状态并从await()方法返回的场景包括：（1）其他线程调用相同Condition对象的signal/signalAll方法，并且当前线程被唤醒；（2）其他线程调用interrupt方法中断当前线程；
  awaitUninterruptibly() | 当前线程进入等待状态直到被通知，在此过程中对中断信号不敏感，不支持中断当前线程
  awaitNanos(long) | 当前线程进入等待状态，直到被通知、中断或者超时。如果返回值小于等于0，可以认定就是超时了
  awaitUntil(Date) | 当前线程进入等待状态，直到被通知、中断或者超时。如果没到指定时间被通知，则返回true，否则返回false
  signal() | 唤醒一个等待在Condition上的线程，被唤醒的线程在方法返回前必须获得与Condition对象关联的锁
  signalAll() | 唤醒所有等待在Condition上的线程，能够从await()等方法返回的线程必须先获得与Condition对象关联的锁

  **LockSupport：** LockSupport与Object监视器/Condition稍微有些不一样，阻塞的方法都差不多，但是在唤醒方面，Object监视器/Condition是随机唤醒一个线程或者唤醒所有，但是LockSupport的unpark方法必须传入指定的线程并唤醒指定的线程，且因为LockSupport实现的原理，LockSupport还能够先唤醒后面阻塞的操作。主要方法如下：
  方法名称 | 描述
  -- | -- | 
  park() | 阻塞当前线程，如果调用unpark方法或者当前线程被中断，就能从park()方法中返回
  park(Object blocker) | 功能同上方法，入参增加一个Object对象，用来记录导致线程阻塞的阻塞对象，方便进行问题排查
  parkNanos(long nanos) | 阻塞当前线程，最长不超过nanos纳秒，增加了超时返回的特性
  parkNanos(Object blocker, long nanos) | 功能同上方法，入参增加一个Object对象，用来记录导致线程阻塞的阻塞对象，方便进行问题排查
  parkUntil(long deadline) | 阻塞当前线程，直到deadline，deadline是一个绝对时间，表示某个时间的毫秒格式
  parkUntil(Object blocker, long deadline) | 功能同上方法，入参增加一个Object对象，用来记录导致线程阻塞的阻塞对象，方便进行问题排查
  unpark(Thread thread) | 唤醒处于阻塞状态的指定线程

#### ReentrantLock
ReentrantLock是JDK提供的Lock接口的默认实现，是一个支持公平锁与非公平锁的可重入排他锁。内部有个继承自AQS的内部同步器Sync，依据Sync又分别实现了NonfairSync和FairSync，所以支持公平和非公平锁，在构造方法中传入参数可选择且不可修改。两个同步器都调用了AOS的`setExclusiveOwnerThread`方法，所以是独占的排它锁。

#### ReentrantReadWriteLock
ReentrantReadWriteLock是JDK提供的ReadWriteLock接口的默认实现，是一个支持公平和非公平锁的可重入读写锁。内部结构与ReentrantLock相似，区别在于额外实现了两个实现Lock接口的读写锁类。

ReentrantLock有个弊端，就是会造成写饥饿，在进行写操作的时候其他的读写操作都会被阻塞，无法进行。

#### StampedLock
StampedLock没有实现Lock接口和ReadWriteLock接口，但是也实现了读写锁的功能，是一个可重入的读写锁。它的性能比ReentrantReadWriteLock更高，且不会发生写饥饿现象。因为它的核心思想是如果在读的时候发生了写操作，那么用会重新读取值的方式而不是阻塞写操作，类似于CAS自旋，这样StampedLock非常适合于读多写少的情况。

源码：
```JAVA
// 用于操作state后获取stamp的值
private static final int LG_READERS = 7;
private static final long RUNIT = 1L;               //0000 0000 0001
private static final long WBIT  = 1L << LG_READERS; //0000 1000 0000
private static final long RBITS = WBIT - 1L;        //0000 0111 1111
private static final long RFULL = RBITS - 1L;       //0000 0111 1110
private static final long ABITS = RBITS | WBIT;     //0000 1111 1111
private static final long SBITS = ~RBITS;           //1111 1000 0000

// 初始化时state的值
private static final long ORIGIN = WBIT << 1;       //0001 0000 0000

// 锁共享变量state
private transient volatile long state;
// 读锁溢出时用来存储多出的读锁
private transient int readerOverflow;
```

StampedLock内部有一个long类型的state变量，用state变量的前7位（LG_READERS）来表示读锁，每获取一个悲观读锁，就加1（RUNIT），每释放一个悲观读锁，就减1。而悲观读锁最多只能装128个（7位限制），很容易溢出，所以用一个int类型的readerOverflow变量来存储溢出的悲观读锁。

写锁用state变量剩下的位来表示，每次获取一个写锁，就加0000 1000 0000（WBIT）。需要注意的是，写锁在释放的时候，并不是减WBIT，而是再加WBIT。这是为了让每次写锁都留下痕迹，解决CAS中的ABA问题，也为乐观锁检查变化validate方法提供基础。

乐观读锁就比较简单了，并没有真正改变state的值，而是在获取锁的时候记录state的写状态，在操作完成后去检查state的写状态部分是否发生变化，上文提到了，每次写锁都会留下痕迹，也是为了这里乐观锁检查变化提供方便。

总的来说，StampedLock的性能是非常优异的，基本上可以取代ReentrantReadWriteLock的作用。

## 通信工具类
JDK提供了一些通信类给我们直接使用，分别有以下几种：
类 | 作用 |
-- | -- |
Semaphore | 限制线程的数量
Exchanger | 两个线程交换数据
CountDownLatch | 线程等待直到计数器减为0时开始工作
CyclicBarrier | 作用跟CountDownLatch类似，但是可以重复使用
Phaser | 增强的CyclicBarrier

Semaphore、CountDownLatch与CyclicBarrier在介绍AQS的时候已经介绍了，可以参照多线程原理中的AQS篇章。

### Exchanger
Exchanger类用于两个线程交换数据。它支持泛型，也就是说你可以在两个线程之间传送任何数据。

示例：
```JAVA
public class ExchangerDemo {
    public static void main(String[] args) throws InterruptedException {
        Exchanger<String> exchanger = new Exchanger<>();

        new Thread(() -> {
            try {
                System.out.println("这是线程A，得到了另一个线程的数据："
                        + exchanger.exchange("这是来自线程A的数据"));
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        System.out.println("这个时候线程A是阻塞的，在等待线程B的数据");
        Thread.sleep(1000);

        new Thread(() -> {
            try {
                System.out.println("这是线程B，得到了另一个线程的数据："
                        + exchanger.exchange("这是来自线程B的数据"));
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
```
结果：
```
这个时候线程A是阻塞的，在等待线程B的数据
这是线程B，得到了另一个线程的数据：这是来自线程A的数据
这是线程A，得到了另一个线程的数据：这是来自线程B的数据
```

当一个线程调用exchange方法后，它是处于阻塞状态的，只有当另一个线程也调用了exchange方法，它才会继续向下执行。它是使用park/unpark来实现等待状态的切换的，但是在使用park/unpark方法之前，使用了CAS检查，估计是为了提高性能。Exchanger只能是两个线程交换数据且可以重复使用。

### Phaser
Phaser比较复杂，可以看做是加强版的CyclicBarrier，它与CyclicBarrier不同的是可以动态的调整等待的线程数。

Phaser相关名词：
* party：对应一个线程，数量可以通过register或者构造参数传入;
* arrive：对应一个party的状态，初始时是unarrived，当调用arriveAndAwaitAdvance()或者 arriveAndDeregister()进入arrive状态，可以通过getUnarrivedParties()获取当前未到达的数量;
* register：注册一个party，每一阶段必须所有注册的party都到达才能进入下一阶段;
* deRegister：减少一个party。
* phase：阶段，当所有注册的party都arrive之后，将会调用Phaser的onAdvance()方法来判断是否要进入下一阶段，即类似于CyclicBarrier的重新计数，若在onAdvance()中返回true，则不会再阻塞线程。

Phaser终止的两种途径，Phaser维护的线程执行完毕或者onAdvance()返回true 此外Phaser还能维护一个树状的层级关系，构造的时候new Phaser(parentPhaser)，对于Task执行时间短的场景（竞争激烈），也就是说有大量的party, 那可以把每个Phaser的任务量设置较小，多个Phaser共同继承一个父Phaser。

还是游戏的案例。假设我们游戏有三个关卡，但只有第一个关卡有新手教程，需要加载新手教程模块。但后面的第二个关卡和第三个关卡都不需要。我们可以用Phaser来做这个需求。

```JAVA
public class PhaserDemo {
    static class PreTaskThread implements Runnable {

        private String task;
        private Phaser phaser;

        public PreTaskThread(String task, Phaser phaser) {
            this.task = task;
            this.phaser = phaser;
        }

        @Override
        public void run() {
            for (int i = 1; i < 4; i++) {
                try {
                    // 第二次关卡起不加载NPC，跳过
                    if (i >= 2 && "加载新手教程".equals(task)) {
                        continue;
                    }
                    Random random = new Random();
                    Thread.sleep(random.nextInt(1000));
                    System.out.println(String.format("关卡%d，需要加载%d个模块，当前模块【%s】",
                            i, phaser.getRegisteredParties(), task));

                    // 从第二个关卡起，不加载NPC
                    if (i == 1 && "加载新手教程".equals(task)) {
                        System.out.println("下次关卡移除加载【新手教程】模块");
                        phaser.arriveAndDeregister(); // 移除一个模块
                    } else {
                        phaser.arriveAndAwaitAdvance();
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public static void main(String[] args) {
        Phaser phaser = new Phaser(4) {
            @Override
            protected boolean onAdvance(int phase, int registeredParties) {
                System.out.println(String.format("第%d次关卡准备完成", phase + 1));
                return phase == 3 || registeredParties == 0;
            }
        };

        new Thread(new PreTaskThread("加载地图数据", phaser)).start();
        new Thread(new PreTaskThread("加载人物模型", phaser)).start();
        new Thread(new PreTaskThread("加载背景音乐", phaser)).start();
        new Thread(new PreTaskThread("加载新手教程", phaser)).start();
    }
}
```

结果：
```
关卡1，需要加载4个模块，当前模块【加载背景音乐】
关卡1，需要加载4个模块，当前模块【加载新手教程】
下次关卡移除加载【新手教程】模块
关卡1，需要加载3个模块，当前模块【加载地图数据】
关卡1，需要加载3个模块，当前模块【加载人物模型】
第1次关卡准备完成
关卡2，需要加载3个模块，当前模块【加载地图数据】
关卡2，需要加载3个模块，当前模块【加载背景音乐】
关卡2，需要加载3个模块，当前模块【加载人物模型】
第2次关卡准备完成
关卡3，需要加载3个模块，当前模块【加载人物模型】
关卡3，需要加载3个模块，当前模块【加载地图数据】
关卡3，需要加载3个模块，当前模块【加载背景音乐】
第3次关卡准备完成
```

## 参考资料
1. [第三篇：JDK工具篇](http://concurrent.redspider.group/article/03/14.html)
1. [java高并发系列 - 第14天:JUC中的LockSupport工具类，必备技能](https://blog.csdn.net/likun557/article/details/100036289)