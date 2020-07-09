# 行为型-模板方法模式

## 定义
定义了一个算法的骨架，而将一些步骤延迟到子类中，模版方法使得子类可以在不改变算法结构的情况下，重新定义算法的步骤。

## 理解
将一个大的行为中的一些既定相同的步骤统一在父类中定义好，不同的部分在父类中定义抽象方法，交由子类自己去做不同的实现。

## 示例
比如上班这件事情，上下班都需要打卡，上班打卡是个既定流程，然后中间是工作，每个人工作都不同，下又需要打卡，这样就可以应用模板方法模式，制定一个套路。即上下班打卡这个套路，然后交给每个人自己去决定自己工作干什么。

1. 定义抽象父类，Work类
```JAVA
static abstract class Work {

    private String name;

    public Work(String name) {
        this.name = name;
    }

    public void startWorkDay() {
        morningSignIn();
        doWork();
        afternoonSignIn();
    }

    public void morningSignIn() {
        System.out.println(this.name + "上班打卡");
    }

    public abstract void doWork();

    public void afternoonSignIn() {
        System.out.println(this.name + "下班打卡");
    }
}
```

2. 定义不同的子类
```JAVA
static class ProgramEmployeeWork extends Work{

    public ProgramEmployeeWork(String name) {
        super(name);
    }

    @Override
    public void doWork() {
        System.out.println(super.name + "拼命码代码");
    }
}

static class HREmployeeWork extends Work{

    public HREmployeeWork(String name) {
        super(name);
    }

    @Override
    public void doWork() {
        System.out.println(super.name + "拼命招人");
    }
}
```

3. 创建子类实例，开始一天工作
```
public static void main(String[] args) {
    Work programWork = new ProgramEmployeeWork("小张");
    programWork.startWorkDay();
    Work hrWork = new HREmployeeWork("小王");
    hrWork.startWorkDay();
}
```

输出：
```
小张上班打卡
小张拼命码代码
小张下班打卡
小王上班打卡
小王拼命招人
小王下班打卡
```

>模板方法模式中还可以设置钩子，用于应对不同的情况。比如我想记录程序员上下班打卡时间，来发放餐饮补助，但是人事就不需要，实现如下：

1. 在父类Work中添加钩子方法
```JAVA
public boolean isPrintSignTime() {
    return false;
}
```

2. 在原有方法嵌入钩子
```JAVA
public void morningSignIn() {
    if (isPrintSignTime()) {
        System.out.print(LocalDateTime.now().toString() + "--->");
    }
    System.out.println(this.name + "上班打卡");
}

public void afternoonSignIn() {
    if (isPrintSignTime()) {
        System.out.print(LocalDateTime.now().toString() + "--->");
    }
    System.out.println(this.name + "下班打卡");
}
```

3. 程序员子类重写钩子
```JAVA
@Override
public boolean isPrintSignTime() {
    return true;
}
```

输出：
```
2020-07-01T16:39:22.976242--->小张上班打卡
小张拼命码代码
2020-07-01T16:39:22.977156--->小张下班打卡
小王上班打卡
小王拼命招人
小王下班打卡
```

## 总结
在我们代码中，如果有需要定义既定流程，让不同实现都按照流程走的时候，则可以使用模板方法模式。比如做爬虫的时候，爬取不同的网站都需要不同的规则，处理结果也不一样，但是大致的流程都相同。定义规则，爬取数据，处理数据，这个时候可以定义模板方法，确认爬虫流程，不同网站爬取都依照这个父类模板来实现自己，保证流程相同，让代码更加简洁，清晰易读。


## END
**作者**: Borg

**创建时间**: 未记录

**最后更新时间**: 2020-07-08 10:15 周三