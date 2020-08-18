# 行为型-责任链模式

## 定义
为了避免请求发送者与多个请求处理者耦合在一起，将所有请求的处理者通过前一对象记住其下一个对象的引用而连成一条链；当有请求发生时，可将请求沿着这条链传递，直到有对象处理它为止。

## 理解
责任链模式即以类似于链表的形式创建一条任务处理链条，任务来时依次从头部往尾部传递，中间的每个节点可以选择是否对任务进行处理或者往后面的节点继续传递。这种以链式的方式让任务处理起来更加的灵活多变，耦合性低且拓展性强。

## 优点
* 降低了对象之间的耦合度。该模式使得一个对象无须知道到底是哪一个对象处理其请求以及链的结构，发送者和接收者也无须拥有对方的明确信息。

* 增强了系统的可扩展性。可以根据需要增加新的请求处理类，满足开闭原则。

* 增强了给对象指派职责的灵活性。当工作流程发生变化，可以动态地改变链内的成员或者调动它们的次序，也可动态地新增或者删除责任。

* 责任链简化了对象之间的连接。每个对象只需保持一个指向其后继者的引用，不需保持其他所有处理者的引用，这避免了使用众多的 if 或者 if···else 语句。

* 责任分担。每个类只需要处理自己该处理的工作，不该处理的传递给下一个对象完成，明确各类的责任范围，符合类的单一职责原则。

## 缺点
* 不能保证每个请求一定被处理。由于一个请求没有明确的接收者，所以不能保证它一定会被处理，该请求可能一直传到链的末端都得不到处理。(摘自参考资料1，个人认为这不是缺点，如果需要避免这种情况可以在末端添加一个未处理请求的责任节点，再依据业务逻辑做出合理的处理。)

* 对比较长的职责链，请求的处理可能涉及多个处理对象，系统性能将受到一定影响。

* 职责链的存在增加了系统的复杂性，如果职责链建立出错则可能出现严重的后果，比如可能会造成循环调用。


## 实现
职责链模式可以有两种处理方式：

1. 只有一个节点可以处理请求，如果请求被处理了，就会结束职责链的调用。
2. 可以有多个节点同时处理请求

具体采用何种方式依据自己的业务逻辑判断即可。

下面模仿流水线生产手机实现职责链模式，采用的是第二种处理方式：

1. 创建手机类
```JAVA
@Getter
@Setter
class Phone {

    private static final String comma = "，";

    private String BackCover;

    private String Motherboard;

    private String MiddleFrame;

    private String Screen;

    public void getPhone() {
        System.out.println("手机安装了 --- " + this.BackCover + comma +
                this.Motherboard + comma + this.MiddleFrame + comma + this.Screen);
    }
}
```

2. 创建抽象责任链处理类
```JAVA
@Getter
abstract class PhoneBuilder {

    private PhoneBuilder next;

    // 设置下一个处理节点
    public PhoneBuilder setNext(PhoneBuilder phoneBuilder) {
        this.next = phoneBuilder;

        return this.next;
    }

    // 完成当前节点组装任务
    abstract public void build(Phone phone);

    // 调用责任链的下一个处理节点
    protected void buildNext(Phone phone) {
        if (this.getNext() != null) {
            this.getNext().build(phone);
        }
    };
}
```

3. 实现具体责任链处理类
```JAVA
// 后盖组装节点
class BackCoverBuilder extends PhoneBuilder {

    @Override
    public void build(Phone phone) {
        System.out.println("安装后盖");
        phone.setBackCover("后盖");

        this.buildNext(phone);
    }
}

// 主板组装节点
class MotherboardBuilder extends PhoneBuilder {

    @Override
    public void build(Phone phone) {
        System.out.println("安装主板");
        phone.setMotherboard("主板");

        this.buildNext(phone);
    }
}

// 中框组装节点
class MiddleFrameBuilder extends PhoneBuilder {

    @Override
    public void build(Phone phone) {
        System.out.println("安装中框");
        phone.setMiddleFrame("中框");

        this.buildNext(phone);
    }
}

// 屏幕组装节点
class ScreenBuilder extends PhoneBuilder {

    @Override
    public void build(Phone phone) {
        System.out.println("安装屏幕");
        phone.setScreen("屏幕");

        this.buildNext(phone);
    }
}
```

4. 测试类
```JAVA
public void test() {
    // 创建责任链起始节点
    PhoneBuilder screenBuilder = new ScreenBuilder();

    // 有序的组装责任链
    screenBuilder.setNext(new MiddleFrameBuilder())
            .setNext(new MotherboardBuilder())
            .setNext(new BackCoverBuilder());

    // 开始启动责任链
    Phone phone = new Phone();
    screenBuilder.build(phone);

    // 获取责任链处理结果
    phone.getPhone();
}
```

5. 测试结果
```
安装屏幕
安装中框
安装主板
安装后盖
手机安装了 --- 后盖，主板，中框，屏幕
```

## 总结
责任链模式比较好理解，即使用链式的调用方式来解耦了复杂的业务逻辑，将不同的业务逻辑分别封装在单独的的处理节点上。具体实现的关键就在于创建抽象的请求处理类与实现具体的责任处理类。

## 参考资料
1. [责任链模式（职责链模式）详解](http://c.biancheng.net/view/1383.html)