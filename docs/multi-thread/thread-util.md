# jdk工具

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