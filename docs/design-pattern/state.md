# 行为型-状态模式

## 定义
对有状态的对象，把复杂的“判断逻辑”提取到不同的状态对象中，允许状态对象在其内部状态发生改变时改变其行为。

## 理解
当一个对象拥有多种状态，同时状态会改变对象的行为，不同状态下同一行为结果不同的情况下，就可以使用状态模式。若不使用状态模式的话，则需要用很多的if else去判断，不同的情况再去做不同的操作，这样代码耦合度非常的高，而且当我们需要新增状态的时候，我们还得去改动if else，违反了开闭原则。

## 优点
* 将不同的状态分别写成不同的类，符合单一职责原则。
* 轻耦合，如果新增状态的话只需要新增状态类即可，不违反开闭原则

## 缺点
* 容易多出很多的类
* 实现复杂，如果没有实现好则容易把代码搞得混乱

## 实例
Java中多线程拥有很多不同的状态，线程可以在不同的状态之间转换，且不同的状态都有不同的行为。使用状态模式模拟Java多线程状态类的切换。
![线程状态转换图](../public/images/design-pattern/java-thread-state.gif)

**实现抽象状态类**
```JAVA
abstract class AbstractState {

    protected Context ctx;

    protected String stateName;

    protected AbstractState(Context ctx) {
        this.ctx = ctx;
    }

    protected AbstractState(AbstractState state) {
        this.ctx = state.ctx;
    }

    public void start() {
        System.out.println(ctx.getCtxName() + "状态切换失败---->非法的切换操作");
    };

    public void resume() {
        System.out.println(ctx.getCtxName() + "状态切换失败---->非法的切换操作");
    };

    public void getCpuTime() {
        System.out.println(ctx.getCtxName() + "状态切换失败---->非法的切换操作");
    };

    public void suspend() {
        System.out.println(ctx.getCtxName() + "状态切换失败---->非法的切换操作");
    };

    public void stop() {
        System.out.println(ctx.getCtxName() + "状态切换失败---->非法的切换操作");
    };
}
```

**实现外层状态包装类**
```JAVA
@Getter
@Setter
class Context {

    private AbstractState state;
    private String ctxName;

    public Context(String ctxName) {
        state = new NewState(this);
        this.ctxName = ctxName;
    }

    public void start() {
        state.start();
    };

    public void resume() {
        state.resume();
    };

    public void getCpuTime() {
        state.getCpuTime();
    };

    public void suspend() {
        state.suspend();
    };

    public void stop() {
        state.stop();
    };
}
```

**实现具体的状态类**
```JAVA
class NewState extends AbstractState {

    public NewState(AbstractState state) {
        super(state);
        this.stateName = "新建";
    }

    public NewState(Context ctx) {
        super(ctx);
        this.stateName = "新建";
    }

    @Override
    public void start() {
        this.ctx.setState(new ReadyState(this));
        System.out.println(ctx.getCtxName() + "----新建---->就绪---->状态切换成功");
    }
}


class ReadyState extends AbstractState {

    public ReadyState(AbstractState state) {
        super(state);
        this.stateName = "就绪";
    }

    public ReadyState(Context ctx) {
        super(ctx);
        this.stateName = "就绪";
    }

    @Override
    public void getCpuTime() {
        this.ctx.setState(new RunningState(this));
        System.out.println(ctx.getCtxName() + "----就绪---->运行---->状态切换成功");
    }
}


class RunningState extends AbstractState {

    public RunningState(AbstractState state) {
        super(state);
        this.stateName = "运行";
    }

    public RunningState(Context ctx) {
        super(ctx);
        this.stateName = "运行";
    }

    @Override
    public void suspend() {
        this.ctx.setState(new LockState(this));
        System.out.println(ctx.getCtxName() + "----运行---->阻塞---->状态切换成功");
    }

    @Override
    public void stop() {
        this.ctx.setState(new DeadState(this));
        System.out.println(ctx.getCtxName() + "----运行---->死亡---->状态切换成功");
    }
}


class LockState extends AbstractState {

    public LockState(AbstractState state) {
        super(state);
        this.stateName = "阻塞";
    }

    public LockState(Context ctx) {
        super(ctx);
        this.stateName = "阻塞";
    }

    @Override
    public void resume() {
        this.ctx.setState(new ReadyState(this));
        System.out.println(ctx.getCtxName() + "----阻塞---->就绪---->状态切换成功");
    }
}


class DeadState extends AbstractState {

    public DeadState(AbstractState state) {
        super(state);
        this.stateName = "死亡";
    }

    public DeadState(Context ctx) {
        super(ctx);
        this.stateName = "死亡";
    }
}
```

**测试类**
```JAVA
public void test() {
    Context ctx1 = new Context("线程1");
    Context ctx2 = new Context("线程2");
    System.out.println("模拟Java多线程状态切换---线程1");
    ctx1.start();
    ctx1.getCpuTime();
    ctx1.stop();
    ctx1.start();
    System.out.println("模拟Java多线程状态切换---线程2");
    ctx2.start();
    ctx2.getCpuTime();
    ctx2.suspend();
    ctx2.resume();
    ctx2.stop();
    ctx2.getCpuTime();
    ctx2.stop();
}
```

**测试结果**
```JAVA
模拟Java多线程状态切换---线程1
线程1----新建---->就绪---->状态切换成功
线程1----就绪---->运行---->状态切换成功
线程1----运行---->死亡---->状态切换成功
线程1状态切换失败---->非法的切换操作
模拟Java多线程状态切换---线程2
线程2----新建---->就绪---->状态切换成功
线程2----就绪---->运行---->状态切换成功
线程2----运行---->阻塞---->状态切换成功
线程2----阻塞---->就绪---->状态切换成功
线程2状态切换失败---->非法的切换操作
线程2----就绪---->运行---->状态切换成功
线程2----运行---->死亡---->状态切换成功
```

## 总结
状态模式可以让状态切换变得很简单，用组合的方式拼装包装类与状态，使代码解耦，并且让拓展变得简单，方便新增新的状态。


## END
**作者**: Borg

**创建时间**: 未记录

**最后更新时间**: 2020-07-08 10:15 周三