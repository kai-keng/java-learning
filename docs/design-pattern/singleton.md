# 创建型-单例模式

## 定义
单例模式是用于对某些不需要重复创建，只需要一个对象便足够，并且在某些场景只能有一个对象来确保不同的地方访问到的数据都是相同的时候。比如配置文件的对象，打印日志的对象。在节省内存的同时也能保证不同地方访问的是同一个对象，拿到的是一样的数据。

## 6种实现

### 1. 饿汉式--线程安全
饿汉式是在类加载的时候就提前创建好了对象，当需要使用的时候直接返回开始创建好的对象。
* 优点：实现简单，在类加载的时候就创建好了，因为类加载的机制，避免了多线程创建多个对象的问题
* 缺点：加载的时候就创建了对象，如果没使用则造成内存的浪费
```JAVA
public class Singleton {
    private static Singleton singleton = new Singleton();

    private Singleton() {}

    public Singleton getInstance() {
        return singleton;
    }
}
```

### 2. 懒汉式--线程不安全
懒汉式是在真正使用的时候才去创建对象，如果不使用则不会去创建，节省内存。
* 优点：使用的时候才创建对象，节省内存
* 缺点：线程不安全，多线程的情况下可能会创建多个对象，不能保证单例
```JAVA
public class Singleton {
    private static Singleton singleton = null;

    private Singleton() {}

    public Singleton getInstance() {
        if (singleton == null) {
            singleton = new Singleton();
        }

        return singleton;
    }
}
```

### 3. 懒汉式--线程安全
同上面懒汉式唯一的区别就是在获取对象的方法上加上了同步关键词，确保方法同一时间只能被一个线程访问，避免多线程打破单例
* 优点：除懒汉式的优点以外保证了线程安全
* 缺点：性能太差，其实除了第一次初始化以后，都不需要上锁了，直接return即可
```JAVA
public class Singleton {
    private static Singleton singleton = null;

    private Singleton() {}

    public synchronized Singleton getInstance() {
        if (singleton == null) {
            singleton = new Singleton();
        }

        return singleton;
    }
}
```

### 4. 懒汉式--双重校验锁，线程安全
双重校验锁即是使用同步代码块，加上双重null判断，确保了线程安全
* 优点：相比在方法上添加同步关键词，锁的细粒度降低了，提升了性能，在初始化完了以后会直接返回对象，不会进入同步代码块
* 缺点：写法较为复杂，if判断较多
* 解释：双重校验锁还有一个重要的问题是new操作并不是一个原子性的操作，在解析成指令以后实际上是有三部操作，分别是：
  1. 开辟一块内存空间
  2. 在内存空间创建Singleton对象
  3. 将这块内存空间地址赋值给singleton变量
  
  但是因为JVM与处理器会对代码进行性能优化，可能会对指令重排序，导致并不是1-2-3的顺序执行，而是1-3-2，这样如果一个线程在执行到1-3以后，另一个线程判断singleton不为null并返回了值，这个时候使用singleton对象就会造成程序崩溃报错，解决这个问题只需要在singleton变量定义的时候加上volatile关键词即可，volatile关键词可以禁止指令重排序，确保是按照1-2-3的顺序执行。

```JAVA
public class Singleton {
    private volatile static Singleton singleton = null;

    private Singleton() {}

    public Singleton getInstance() {
        if (singleton == null) {
            synchronized (Singleton.class) {
                if (singleton == null) {
                    singleton = new Singleton();
                }
            }
        }

        return singleton;
    }
}
```

### 5. 懒汉式--静态内部类，线程安全
采用静态内部类的类加载机制来确保了线程安全,类的静态属性只会在第一次加载类的时候初始化，确保在调用外部类的方法的时候才加载静态内部类
* 优点：不需要使用同步代码块即可保证线程安全，同时也做到了懒加载
* 缺点：写法复杂
```JAVA
public class Singleton {
    private static Singleton singleton = null;

    private Singleton() {}

    private static class SingletonHolder {
        private static Singleton singleton = new Singleton();
    }

    public Singleton getInstance() {
        return SingletonHolder.singleton;
    }
}
```

### 6. 懒汉式--枚举，线程安全，最完美
* 优点：写法简单，可读性好，美观，同时直接解决了反序列化问题
* 解释：使用枚举能确保线程安全，因为枚举在第一次使用的时候会被虚拟机初始化，而虚拟机初始化的过程是线程安全的，所以枚举天然就是线程安全的。并且普通的Java类反序列化会破坏单例是因为普通类反序列化会使用到反射，而枚举序列化的时候只是序列化name，反序列化的时候是调用valueOf()方法获取实例，不会使用到反射，所以也不存在反序列化破坏单例的情况。总结下枚举就是最完美的方法，且实现简单
```JAVA
public enum Singleton {
    INSTANCE;

    Singleton() {}
}
```

## 如何应对反序列化破坏单例
反序列化的时候会利用反射直接创建对象，会破坏单例，但是如果在类中加上以下方法，即可避免。因为反序列化的时候在使用反射创建对象之前会判断类中是否有readResolve方法，如果有则调用该方法获取对象，不使用反射创建

```JAVA
private Object readResolve() {
    return singleton;
}
```