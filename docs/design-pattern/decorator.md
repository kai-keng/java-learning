# 结构型-装饰器模式

## 定义
当我们想要基于老的类需要在原有的功能上加强，但是又不能违反开闭原则时，我们可以使用装饰器模式，将原有老的类包装在新的类内部，给与一些装饰，然后调用新的类，达到加强功能而不改动老的类的目的。

## 优点
* 符合开闭原则
* 组合形式，低耦合
* 动态拓展

## 缺点
* 如果装饰层数过多，会过于复杂，不利于维护


## 实现
```
    interface Car {
        void run();
    }

    interface BalanceCarDecorator extends Car {

    }

    class BalanceCar implements Car {

        @Override
        public void run() {
            System.out.println("Driving");
        }
    }

    class Kart implements BalanceCarDecorator {
        private Car car;

        public Kart(Car car) {
            this.car = car;
            System.out.println("安装油门");
        }

        @Override
        public void run() {
            System.out.println("踩油门");
            car.run();
        }
    }
    
    BalanceCarDecorator car = new Kart(new BalanceCar());
    car.run();
```

原有的平衡车只能站着动，我们想要一辆卡丁车，可以坐着踩油门开，但是我们又不能将原有的车改成卡丁车，这个时候可以使用装饰器模式，将原有的平衡车装饰成卡丁车，在外面套个壳子，然后再调用平衡车的开动之前，可以改造成踩油门开动。

## Java应用
在Java IO包中有很多使用装饰器模式的类
![image](https://img-blog.csdn.net/20140421201934140?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbG1qNjIzNTY1Nzkx/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)