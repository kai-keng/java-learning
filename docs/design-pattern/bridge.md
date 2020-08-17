# 结构型-桥接模式

## 定义
将抽象与实现分离，使它们可以独立变化。它是用组合关系代替继承关系来实现，从而降低了抽象和实现这两个可变维度的耦合度。

## 理解
桥接模式即是针对于多个不同维度的情况，将继承关系改为组合关系，便于自由组合，解耦代码。比如车的品牌有很多，大众、丰田，保时捷等等，车的种类也有很多，SUV和普通轿车等。如果使用强硬的继承关系，代码会非常的不灵活，且需要创建很多子类出来，比如大众SUV、大众普通轿车，光大众一种车就创建了2个。如果使用组合的方式，只需要创建一个大众车，然后组合选择不同的轿车类型即可。

## 优点
* 由于抽象与实现分离，所以扩展能力强。
* 其实现细节对客户透明。

## 缺点
桥接模式的引入会增加系统的理解与设计难度，由于聚合关联关系建立在抽象层，要求开发者针对抽象进行设计与编程。

## 实现

1. 添加品牌抽象接口与实现类
```JAVA
interface Brand {

    String start();
}

class Volkswagen implements Brand {

    @Override
    public String start() {
        return "大众";
    }
};

class Toyota implements Brand {

    @Override
    public String start() {
        return "丰田";
    }
}
```

2. 添加车的抽象类与实现类
```JAVA
abstract class Car {

    // 组合品牌抽象
    protected Brand brand;

    public Car(Brand brand) {
        this.brand = brand;
    }

    abstract void start();
}

class SuvCar extends Car {

    public SuvCar(Brand brand) {
        super(brand);
    }

    @Override
    void start() {
        // 桥接到抽象品牌的启动方法
        System.out.println("启动" + this.brand.start() + "SUV汽车");
    }
}

class NormalCar extends Car {

    public NormalCar(Brand brand) {
        super(brand);
    }

    @Override
    void start() {
        // 桥接到抽象品牌的启动方法
        System.out.println("启动" + this.brand.start() + "普通汽车");
    }
}
```

3. 测试类
```JAVA
public void test() {
    Brand volkswagenBrand = new Volkswagen();
    Car volkswagenSuvCar = new SuvCar(volkswagenBrand);
    volkswagenSuvCar.start();

    Brand toyotaBrand = new Toyota();
    Car toyotaSuvCar = new SuvCar(toyotaBrand);
    toyotaSuvCar.start();

    Car toyotaNormalCar = new NormalCar(toyotaBrand);
    toyotaNormalCar.start();
}
```

4. 结果
```
启动大众SUV汽车
启动丰田SUV汽车
启动丰田普通汽车
```

## 总结
桥接模式适用于在多个维度下的组合实现，比如发送消息的场景，不同的消息类型，消息传递方式不同，可以使用桥接模式。又比如 jdbc 中多种驱动，多种数据库，使用桥接模式组合。

桥接模式实现的时候核心在于一个主要实现化抽象类聚合其他维度的抽象接口，必须要掌握这个点，面向抽象开发。

## 参考资料
1. [桥接模式（Bridge模式）详解](http://c.biancheng.net/view/1364.html)
2. [设计模式：桥接模式及代码示例、桥接模式在jdbc中的体现、注意事项](https://blog.csdn.net/weixin_42092787/article/details/108019256)