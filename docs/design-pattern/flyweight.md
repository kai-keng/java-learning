# 结构型-享元模式

## 定义
运用共享技术来有效地支持大量细粒度对象的复用。它通过共享已经存在的对象来大幅度减少需要创建的对象数量、避免大量相似类的开销，从而提高系统资源的利用率。

## 理解
享元模式类似于数据库连接池，线程池这样的情况，就是缓存一些会被反复使用的对象，在需要的时候直接获取到对象，节省了对象的创建和销毁的开销，提高利用率与效率。

## 优点
* 相同的对象只需要保存一份，减少内存中的对象数量。

## 缺点
* 为了使对象可以共享，需要将一些不能共享的状态外部化，这将增加程序的复杂性。
* 读取享元模式的外部状态会使得运行时间稍微变长。

## 示例
1. 定义享元接口
```JAVA
interface Flyweight {
    public void operation(UnsharedConcreteFlyweight state);
}
```

2. 实现具体享元
```JAVA
class ConcreteFlyweight implements Flyweight {
    private String key;

    ConcreteFlyweight(String key) {
        this.key = key;
        System.out.println("具体享元" + key + "被创建！");
    }

    @Override
    public void operation(UnsharedConcreteFlyweight outState) {
        System.out.print("具体享元" + key + "被调用，");
        System.out.println("非享元信息是:" + outState.getInfo());
    }
}
```

3. 实现非享元类
```JAVA
@Data
@AllArgsConstructor
class UnsharedConcreteFlyweight {
    private String info;
}
```

4. 实现享元工程类
```JAVA
class FlyweightFactory {
    private HashMap<String, Flyweight> flyweights = new HashMap();

    public Flyweight getFlyweight(String key) {
        Flyweight flyweight = (Flyweight) flyweights.get(key);

        if (flyweight != null) {
            System.out.println("具体享元" + key + "已经存在，被成功获取！");
        } else {
            flyweight = new ConcreteFlyweight(key);
            flyweights.put(key, flyweight);
        }

        return flyweight;
    }
}
```

5. 测试方法
```JAVA
public void test() {
    UnsharedConcreteFlyweight ucf1 = new UnsharedConcreteFlyweight("ucf1");
    UnsharedConcreteFlyweight ucf2 = new UnsharedConcreteFlyweight("ucf2");
    FlyweightFactory factory = new FlyweightFactory();
    Flyweight f1 = factory.getFlyweight("f1");
    Flyweight f2 = factory.getFlyweight("f2");

    f1.operation(ucf1);
    f2.operation(ucf2);

    factory.getFlyweight("f1");
    factory.getFlyweight("f2");
}
```

6. 测试结果
```
具体享元f1被创建！
具体享元f2被创建！
具体享元f1被调用，非享元信息是:ucf1
具体享元f2被调用，非享元信息是:ucf2
具体享元f1已经存在，被成功获取！
具体享元f2已经存在，被成功获取！
```

## 总结
享元模式核心在于抽象出公共部分建立享元接口与享元类，将非享元部分抽象出去由外部传入，这样来达到共用享元对象的目的。


## 参考资料
1. [享元模式（详解版）](http://c.biancheng.net/view/1371.html)