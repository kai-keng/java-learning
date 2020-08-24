# 分布式锁
因为在生产环境中，服务都不是单机环境，单个服务都会部署多个然后使用负载均衡进行访问，避免因单节点宕机以后整个服务全部宕机的情况出现。这种在多台机器部署服务的情况下，你如果只是在单个服务中使用同步代码块，是无法确保对同一变量的修改是同步的，这样数据的准确性就会出现问题。比如我们商品扣减库存的操作，如果多个服务同时读取库存，并进行扣减操作，必然会出现扣减出错的情况，导致库存计算不准确。

分布式锁就是为了解决以上问题出现的，它可以让多个服务共用一把锁，来确保数据不会出错。


## 分布式锁应具备条件
* 在分布式系统环境下，一个方法在同一时间只能被一个机器的一个线程执行
* 高可用的获取锁与释放锁
* 高性能的获取锁与释放锁
* 具备可重入特性（可理解为重新进入，由多于一个任务并发使用，而不必担心数据错误）
* 具备锁失效机制，防止死锁
* 具备非阻塞锁特性，即没有获取到锁将直接返回获取锁失败

## 分布式锁实现
* Redis：和 Memcached 的方式类似，利用 Redis 的 setnx 命令。此命令同样是原子性操作，只有在 key 不存在的情况下，才能 set 成功。
* Memcached：利用 Memcached 的 add 命令。此命令是原子性操作，只有在 key 不存在的情况下，才能 add 成功，也就意味着线程得到了锁。
* Zookeeper：利用 Zookeeper 的顺序临时节点，来实现分布式锁和等待队列。Zookeeper 设计的初衷，就是为了实现分布式锁服务的。
* Chubby：Google 公司实现的粗粒度分布式锁服务，底层利用了 Paxos 一致性算法。

## Redis 分布式锁

### Redis 分布式锁面临的问题

* **死锁**

  问题：解锁流程异常，未成功解锁，导致锁一致未被释放，发生死锁

  解决方案：设置锁超时时间，并使用 `finally`

* **B 锁释放了 A锁**

  问题：当线程 A 执行时间过长，导致线程 A 加的 A 锁超时自动释放，线程 B 获取到了锁加锁执行，然后线程 A 先执行完毕，继续去执行解锁逻辑，这个时候会把 B 锁给释放了。

  解决方案：每个线程加锁的时候都设置特定的 value 值，解锁的时候判断锁的 value 是否与自己加锁的 value 值一致，若一致则解锁，反之则不解锁。

* **锁超时过期了，但是业务还在执行**

  问题：当有时候业务执行时间过长的时候，可能锁超时了业务还在执行，这个时候没锁了其他线程可以获取到锁，可能导致业务执行结果不正确。
  
  解决方案：加入看门狗机制，监听业务执行状况，当业务未执行完但是锁到期的话，给锁续期，增加锁的时间，比较好的办法就是使用 `redisson`。

* **主从复制的过程中宕机**

  问题：当使用 redis 集群的时候，我们一般会有主节点和从节点，主节点负责写，从节点负责读。当线程 A 加锁的时候，写入了主节点，主节点会将自身的数据同步到从节点，当复制的过程主节点宕机了的话，会从集群中选取新的节点作为主节点，这个时候线程 B 来加锁的话则可以加锁成功，因为 A 锁并未同步到新的节点。

  解决方案：尚未有好的解决方案，需尽量保持集群稳定性，若实在要解决，考虑方向可以是当所有节点都同步成功了以后才判定加锁成功，未实际研究过，不确定可行性。

* **锁阻塞导致数据库事务超时回滚（验证，不存在该问题）**

  问题：网上有说当锁阻塞时间超过数据库事务超时时间的话，会抛出异常，导致业务执行失败回滚。实测不存在这个问题，数据库注解 `@Transactional(timeout = 5, rollbackFor = Exception.class)`，其中的超时时间指的是 MyBatis 中的 SQL 执行的时间，并不是业务代码执行时间，只要 SQL 执行时间不超时，锁阻塞不会导致超时异常的发生。

### 代码实现

1. 定义锁接口

```JAVA
public interface RedisLock {

    // 加锁
    void lock(String key, String value);

    // 解锁
    void unlock(String key, String value);
}
```

2. 锁接口实现
```JAVA
@Service
public class RedisLockImpl implements RedisLock {

    @Autowired
    RedisTemplate<String, String> redisTemplate;

    @Override
    public void lock(String key, String value) {
        // 用加锁结果来判断是否需要继续循环获取锁
        while (!this.innerLock(key, value)) {
          // 此处也可加入 sleep 方法，让未获取成功锁的时候释放资源
        }
    }

    private boolean innerLock(String key, String value) {
        // 使用 lua 脚本，原子性的加锁
        Long success = redisTemplate.execute(new DefaultRedisScript<Long>(
                        // 用 key 判断当前锁是否已经存在
                        "if (redis.call('exists', KEYS[1]) == 0) then " +
                                // 不存在则使用哈希保存数据，value 为 1，用于可重入锁计数
                            "redis.call('hset', KEYS[1], ARGV[2], 1); " +
                            // 设置过期时间
                            "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                            // 设置成功返回0
                            "return 0; " +
                        "end;" +
                        // 判断当前锁是否已经存在
                        "if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then " +
                            // 若存在则让哈希 value 值加1
                            "redis.call('hincrby', KEYS[1], ARGV[2], 1); " +
                            // 重新设置过期时间
                            "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                            // 设置成功返回0
                            "return 0; " +
                        "end; " +
                        // 若不满足以上条件，获取当前锁的过期时间
                        "return redis.call('pttl', KEYS[1]);", Long.class),
                Collections.singletonList(key), "30000", value);

        return Objects.equals(success, 0L);
    }

    @Override
    public void unlock(String key, String value) {
        // 使用 lua 脚本原子性解锁
        redisTemplate.execute(new DefaultRedisScript<Long>(
                // 判断当前锁是否存在，若不存在则返回 null
                "if (redis.call('exists', KEYS[1]) == 0 or redis.call('hexists', KEYS[1], ARGV[2]) == 0) then " +
                        "return nil;" +
                    "end;" +
                // 将当前哈希value值减1，并返回计算后的结果
                "local counter = redis.call('hincrby', KEYS[1], ARGV[2], -1); " +
                // 若结果大于0，则重新设置过期时间，返回0
                "if (counter > 0) then " +
                    "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                    "return 0; " +
                // 若结果不大于0，则删除锁
                "else " +
                    "redis.call('del', KEYS[1]); " +
                    "return 1; " +
                "end;" +
                "return nil;", Long.class),
                Collections.singletonList(key), "30000", value);
    }

}
```

3. 锁使用
```JAVA
void test() {
    // 初始化线程池，固定10个
    ExecutorService pool = new ThreadPoolExecutor(10, 10,
            0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>());

    // 循环自增至1000
    for (int i = 0; i < 1000; i++) {
        pool.execute(() -> {
            // 使用线程 id 做为哈希 key
            String value = String.valueOf(Thread.currentThread().getId());

            try {
                // 加锁
                redisLock.lock(LOCK_KEY, value);

                COUNT++;

                System.out.println("Thread --- " + COUNT);
            } finally {
                // 解锁
                redisLock.unlock(LOCK_KEY, value);
            }
        });
    }
}
// 结果能累加至 1000，若不加锁大概率无法累加至1000
```

> 上面的实现是基于 Redis 的可重入锁，只解决了问题1和2，未加入看门狗机制。Redisson 的看门狗机制即在加锁成功以后新建一个定时任务，定时任务每隔10秒会判断锁是否还存在，若锁存在则重置锁的时间为30秒。
>
> 推荐阅读[参考资料2](https://www.jianshu.com/p/2a90bba8922f)，很好地解析了 Redisson 源码，看完后可以很好地了解 Redisson 是如何实现的。


## 参考资料
1. [部门老大：redis 分布式锁再这么用，我就劝退你](https://juejin.im/post/6844904134764658702#heading-5)
2. [汪~汪~汪~redisson的WatchDog是如何看家护院的？](https://www.jianshu.com/p/2a90bba8922f)