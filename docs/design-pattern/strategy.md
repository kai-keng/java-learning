# 行为型-策略模式

## 定义
策略模式即将一系列算法分别封装成不同的策略对象，借由中间的上下文对象，来达到通过调用方主动选择特定策略来装载进中间的上下文对象中，并通过调用上下文对象的方法来获取想要的结果。

## 优点
充分利用封装组合的思想，符合开闭原则，开放拓展封闭改动。如果有需要拓展的时候只需要创建新的策略而不需要去改动原有的上下文对象，代码耦合轻，非常容易拓展。

## 缺点
* 对于调用方来说需要了解不同的策略之间的区别，来主动选择不同的策略
* 会有更多的对象
* 只适合扁平的算法结构，每个策略之间都是可以相互替换的，没有层级关系


## 实现
```JAVA
public class ReportApplication {

    public static void main(String[] args) {
        Context context = new Context(new StrategyA());
        context.goHome();
        // SpringApplication.run(ReportApplication.class, args);
    }
}


interface Strategy {
    void goHome();
}

class StrategyA implements Strategy {

    @Override
    public void goHome() {
        System.out.println("坐火车");
    }
}

class StrategyB implements Strategy {

    @Override
    public void goHome() {
        System.out.println("坐汽车");
    }
}

class Context {

    private Strategy strategy;

    public Context(Strategy strategy) {
        this.strategy = strategy;
    }

    public void goHome() {
        this.strategy.goHome();
    }
}
```

## 应用
* 可以使用策略模式对对象进行解耦，具体运行策略可组合选择
* 当if else代码块太多的时候，可以使用策略模式来消除过多的if else