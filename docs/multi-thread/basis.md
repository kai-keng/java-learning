# 多线程基础

## 创建线程

### 通过Thread类创建
Java中有`Thread`类，继承该类，并重写`run`方法，然后调用`start`方法即可
```JAVA
public class Demo {
    public static class MyThread extends Thread {
        @Override
        public void run() {
            System.out.println("MyThread");
        }
    }

    public static void main(String[] args) {
        Thread myThread = new MyThread();
        myThread.start();
    }
}
```

### 实现Runnable接口创建
创建一个类实现`Runnable`接口，然后实现`run`方法，将实现类的实例传入`Thread`构造器，构建`Thread`实例，调用`start`方法即可
```JAVA
public class Demo {
    public static class MyThread implements Runnable {
        @Override
        public void run() {
            System.out.println("MyThread");
        }
    }

    public static void main(String[] args) {

        new Thread(new MyThread()).start();

        // Java 8 函数式编程，可以省略MyThread类
        new Thread(() -> {
            System.out.println("Java 8 匿名内部类");
        }).start();
    }
}
```

## 线程使用

### Thread常用方法
* currentThread()：静态方法，返回对当前正在执行的线程对象的引用；
* start()：开始执行线程的方法，java虚拟机会调用线程内的run()方法；
* yield()：yield在英语里有放弃的意思，同样，这里的yield()指的是当前线程愿意让出对当前处理器的占用。这里需要注意的是，就算当前线程调用了yield()方法， 程序在调度的时候，也还有可能继续运行这个线程的；
* sleep()：静态方法，使当前线程睡眠一段时间；
* join()：使当前线程等待另一个线程执行完毕之后再继续执行，内部调用的是Object类的wait方法实现的；

### 利用Callable接口获取线程返回值
Thread和Runnable的run方法都是没有返回值的，当我们需要在某个线程执行任务完成以后返回一个值的时候就不够用了，这个时候可以使用Callable接口。使用Callable接口，配合ExecutorService在任务提交以后会返回一个Future对象，使用该对象的get方法即可获取返回值。

```JAVA
// 自定义Callable
class Task implements Callable<Integer>{

    @Override
    public Integer call() throws Exception {
        // 模拟计算需要一秒
        Thread.sleep(1000);
        return 2;
    }

    public static void main(String args[]){
        // 使用
        ExecutorService executor = Executors.newCachedThreadPool();
        Task task = new Task();
        Future<Integer> result = executor.submit(task);
        // 注意调用get方法会阻塞当前线程，直到得到结果。
        // 所以实际编码中建议使用可以设置超时时间的重载get方法。
        System.out.println(result.get()); 
    }
}
```
> Future 接口有个`public abstract boolean cancel(boolean paramBoolean);` 取消方法。这个取消方法指的是试图取消当前线程的执行，并不一定能取消成功。因为任务可能已完成、已取消、或者一些其它因素不能取消，存在取消失败的可能。boolean类型的返回值是“是否取消成功”的意思。参数paramBoolean表示是否采用中断的方式取消线程执行。

>所以有时候，为了让任务有能够取消的功能，就使用Callable来代替Runnable。如果为了可取消性而使用 Future但又不提供可用的结果，则可以声明 Future<?>形式类型、并返回 null作为底层任务的结果。

### 使用FutureTask
因为Future接口中有很多方法，如果我们都去实现的话未免太过于复杂，所以JDK提供了FutureTask类给我们直接使用。

```JAVA
// 自定义Callable，与上面一样
class Task implements Callable<Integer>{

    @Override
    public Integer call() throws Exception {
        // 模拟计算需要一秒
        Thread.sleep(1000);
        return 2;
    }

    public static void main(String args[]){
        // 使用
        ExecutorService executor = Executors.newCachedThreadPool();
        FutureTask<Integer> futureTask = new FutureTask<>(new Task());
        // 这里的submit方法与上面不一样，没有返回值
        executor.submit(futureTask);
        System.out.println(futureTask.get());
    }
}
```

>在很多高并发的环境下，有可能Callable和FutureTask会创建多次。FutureTask能够在高并发环境下确保任务只执行一次。

### FutureTask状态
```JAVA
/**
  *
  * state可能的状态转变路径如下：
  * NEW -> COMPLETING -> NORMAL
  * NEW -> COMPLETING -> EXCEPTIONAL
  * NEW -> CANCELLED
  * NEW -> INTERRUPTING -> INTERRUPTED
  */
private volatile int state;
private static final int NEW          = 0;
private static final int COMPLETING   = 1;
private static final int NORMAL       = 2;
private static final int EXCEPTIONAL  = 3;
private static final int CANCELLED    = 4;
private static final int INTERRUPTING = 5;
private static final int INTERRUPTED  = 6;
```

> state表示任务的运行状态，初始状态为NEW。运行状态只会在set、setException、cancel方法中终止。COMPLETING、INTERRUPTING是任务完成后的瞬时状态。

## 线程组（ThreadGroup）
Java中线程组被称为ThreadGroup，所有的线程都是属于某个线程组的，不可能独立存在，我们可以通过线程组来对线程进行批量操作控制。如果在创建线程的时候没有指定线程组，默认将加入到父线程的线程组中。
> ThreadGroup管理着它下面的Thread，ThreadGroup是一个标准的向下引用的树状结构，这样设计的原因是防止"上级"线程被"下级"线程引用而无法有效地被GC回收。

## 线程优先级
* Java线程优先级分为1-10级，默认是5;
* Java提供了线程调度器来监视和控制处于**RUNNALBE**状态的线程;
* 我们可以设置线程与线程组的优先级，但是这个优先级只是让高优先级的线程有更大的概率优先执行，具体哪个优先执行，是由操作系统调度算法决定的，所以不能依据优先级做为线程的执行顺序;
* 守护线程优先级较低，若非守护线程全部停止的时候，守护线程全部自动停止;
* 线程默认是非守护线程，可以通过Thread类的`setDaemon(boolean on)`来设置设置;

## 线程状态

### 操作系统的线程状态
* 就绪状态(ready)：线程正在等待使用CPU，经调度程序调用之后可进入running状态;
* 执行状态(running)：线程正在使用CPU;
* 等待状态(waiting): 线程经过等待事件的调用或者正在等待其他资源（如I/O）;

### Java的六种线程状态
* **NEW**：处于NEW状态的线程此时尚未启动。这里的尚未启动指的是还没调用Thread实例的start()方法。start方法不能被多次调用，其中有个threadStatus字段，当第一次调用start以后，状态会改变不为0，若再次调用判断不为0则会抛出异常。

* **RUNNABLE**：表示当前线程正在运行中。处于RUNNABLE状态的线程在Java虚拟机中运行，也有可能在等待其他系统资源（比如I/O）。Java线程的RUNNABLE状态其实是包括了传统操作系统线程的ready和running两个状态的。

* **BLOCKED**：阻塞状态。处于BLOCKED状态的线程正等待锁的释放以进入同步区。

* **WAITING**：等待状态。处于等待状态的线程变成RUNNABLE状态需要其他线程唤醒。调用如下3个方法会使线程进入等待状态：
  1. Object.wait()：使当前线程处于等待状态直到另一个线程唤醒它；
  2. Thread.join()：等待线程执行完毕，底层调用的是Object实例的wait方法；
  3. LockSupport.park()：除非获得调用许可，否则禁用当前线程进行线程调度。

* **TIMED_WAITING**：超时等待状态。线程等待一个具体的时间，时间到后会被自动唤醒。调用如下方法会使线程进入超时等待状态：

  1. Thread.sleep(long millis)：使当前线程睡眠指定时间；
  2. Object.wait(long timeout)：线程休眠指定时间，等待期间可以通过notify()/notifyAll()唤醒；
  3. Thread.join(long millis)：等待当前线程最多执行millis毫秒，如果millis为0，则会一直执行；
  4. LockSupport.parkNanos(long nanos)： 除非获得调用许可，否则禁用当前线程进行线程调度指定时间；
  5. LockSupport.parkUntil(long deadline)：同上，也是禁止线程进行调度指定时间；

* **TERMINATED**：终止状态。此时线程已执行完毕。

## 线程中断
### 场景
在某些情况下，我们在线程启动后发现并不需要它继续执行下去时，需要中断线程。目前在Java里还没有安全直接的方法来停止线程，但是Java提供了线程中断机制来处理需要中断线程的情况。
> 线程中断机制是一种协作机制。需要注意，通过中断操作并不能直接终止一个线程，而是通知需要被中断的线程自行处理。

### 相关方法
* Thread.interrupt()：中断线程。这里的中断线程并不会立即停止线程，而是设置线程的中断状态为true（默认是flase）；
* Thread.interrupted()：测试当前线程是否被中断。线程的中断状态受这个方法的影响，意思是调用一次使线程中断状态设置为true，连续调用两次会使得这个线程的中断状态重新转为false；
* Thread.isInterrupted()：测试当前线程是否被中断。与上面方法不同的是调用这个方法并不会影响线程的中断状态。

> 在线程中断机制里，当其他线程通知需要被中断的线程后，线程中断的状态被设置为true，但是具体被要求中断的线程要怎么处理，完全由被中断线程自己而定，可以在合适的实际处理中断请求，也可以完全不处理继续执行下去。

## 线程通信

### 通信机制
* 锁与同步：Java中可以用对象当作一把锁，使用synchronized对代码块上锁，如果两个线程使用同一把锁，当一个线程占有的时候，另一个线程必须等待锁的释放，抢到锁以后才能执行;
* 等待/通知机制：当我们只使用锁的时候，其他等待锁的线程必须不停的去获取锁，这个过程是非常消耗资源的。而等待/通知机制是利用锁的wait方法来让自己的线程等待并释放当前锁，其他的线程可以调用锁的notify/notifyAll方法来唤醒处于WAITING或TIMED_WAITING状态的线程（线程必须使用同一把锁）。这样线程在等待的时候就不会去检测锁是否被释放了;
> 这里需要注意的是，当有很多的线程的时候，notify方法是随机唤醒一个处于WAITING或TIMED_WAITING状态的线程，并不能确定会唤醒哪一个线程，notifyAll则是直接唤醒所有处于等待的线程。同时当一个线程调用notify/notifyAll方法的时候并不会释放锁，被唤醒的线程还是需要等待持有锁的线程执行完毕或者主动释放锁。
* 信号量：信号量是一个特殊的变量，在同一时间只允许一个线程对其进行访问，且程序对它操作都是原子性的。信号量可以很好地解决当需要沟通的线程超过2个的时候，等待/通知机制不能应付的场景。
* 管道：使用管道多半与I/O流相关。当我们一个线程需要先另一个线程发送一个信息（比如字符串）或者文件等等时，就需要使用管道通信了。

### 通信相关方法

#### join
`join()`方法是当一个线程需要等待另一个线程的执行完毕以后再继续执行的时候使用的。比如当主线程需要获取子线程A执行完毕以后的一些数据，主线程可以调用子线程A的`join()`方法，这样主线程会block住，等待子线程A执行完毕以后再继续执行。

#### sleep
`sleep()`方法可以用来让线程等待一段时间之后再继续执行，它与`wait()`方法有一些区别：
* wait可以指定时间，也可以不指定；而sleep必须指定时间。
* wait释放cpu资源，同时释放锁；sleep释放cpu资源，但是不释放锁，所以易死锁。
* wait必须放在同步块或同步方法中，而sleep可以再任意位置

#### ThreadLocal类
ThreadLocal是一个本地线程副本变量工具类，其实并不属于线程间通信。它为每个线程都创建一个副本，每个线程可以访问自己内部的副本变量。适应于不同线程需要使用自己独立变量的场景，比如数据库连接和session管理，这些场景都是让各自线程自己持有连接，避免各线程共用连接出现安全问题。

##### ThreadLocal内部核心

* 每个Thread线程内部都有一个Map(ThreadLocalMap)。
* Map里面存储线程本地对象（key）和线程的变量副本（value）
* 但是，Thread内部的Map是由ThreadLocal维护的，由ThreadLocal负责向map获取和设置线程的变量值。

##### 如何解决哈希冲突

和HashMap的最大的不同在于，ThreadLocalMap结构非常简单，没有next引用，也就是说ThreadLocalMap中解决Hash冲突的方式并非链表的方式，而是采用线性探测的方式，所谓线性探测，就是根据初始key的hashcode值确定元素在table数组中的位置，如果发现这个位置上已经有其他key值的元素被占用，则利用固定的算法寻找一定步长的下个位置，依次判断，直至找到能够存放的位置。

建议： 每个线程只存一个变量，这样的话所有的线程存放到map中的Key都是相同的ThreadLocal，如果一个线程要保存多个变量，就需要创建多个ThreadLocal，多个ThreadLocal放入Map中时会极大的增加Hash冲突的可能

##### 如何解决内存泄露
因为ThreadLocalMap中Entry的Key是弱引用，如果ThreadLocal在外部没有强引用的话，在下一次GC的时候ThreadLocal就会被回收掉，但是Entry的Value是强引用，并不会被回收掉，如果建立ThreadLocal的线程一直存在，这样Value会一直无法被回收掉，导致内存泄露。解决的办法很简单，就是在我们ThreadLocal使用完成以后记得调用`remove()`方法，移除ThreadLocalMap与Entry之间的引用，这样整个Entry对象就会被回收掉，不会造成内存泄漏。

#### InheritableThreadLocal类
InheritableThreadLocal类与ThreadLocal类稍有不同，Inheritable是继承的意思。它不仅仅是当前线程可以存取副本值，而且它的子线程也可以存取这个副本值。

## 参考资料
1. [深入浅出Java多线程](http://concurrent.redspider.group/)
2. [ThreadLocal-面试必问深度解析](https://www.jianshu.com/p/98b68c97df9b)