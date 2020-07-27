# 创建型-原型模式

## 定义
用一个已经创建的实例作为原型，通过复制该原型对象来创建一个和原型相同或相似的新对象。

## 理解
原型模式比较简单，即通过一个已存在的对象，克隆该对象生成一个全新的对象，我们不需要知道对象创建的细节即可直接创建出对象。简单来说就是对象的拷贝。

## 优点
* 当创建新的对象实例较为复杂时，使用原型模式可以简化对象的创建过程，通过复制一个已有实例可以提高新实例的创建效率。
* 扩展性较好，由于在原型模式中提供了抽象原型类，在客户端可以针对抽象原型类进行编程，而将具体原型类写在配置文件中，增加或减少产品类对原有系统都没有任何影响。
* 原型模式提供了简化的创建结构，工厂方法模式常常需要有一个与产品类等级结构相同的工厂等级结构，而原型模式就不需要这样，原型模式中产品的复制是通过封装在原型类中的克隆方法实现的，无须专门的工厂类来创建产品。
* 可以使用深克隆的方式保存对象的状态，使用原型模式将对象复制一份并将其状态保存起来，以便在需要的时候使用（如恢复到某一历史状态），可辅助实现撤销操作。

## 缺点
* 需要为每一个类配备一个克隆方法，而且该克隆方法位于一个类的内部，当对已有的类进行改造时，需要修改源代码，违背了“开闭原则”
* 在实现深克隆时需要编写较为复杂的代码，而且当对象之间存在多重的嵌套引用时，为了实现深克隆，每一层对象对应的类都必须支持深克隆，实现起来可能会比较麻烦

## 示例
拷贝分为浅拷贝和深拷贝，浅拷贝指的是并不会真的复制出一个真的对象，只是复制一份对象的引用。而深拷贝则是完全复制一个新的对象，两个对象没有关联。

浅拷贝：
```JAVA
@Data
@AllArgsConstructor
@NoArgsConstructor
class Address {

    private String city;
    private String country;
}

@Data
@AllArgsConstructor
// JDK提供了Cloneable接口，只需要实现该接口的clone方法即可实现拷贝
class User implements Cloneable {

    private int id;
    private String name;
    private Address address;

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```
> 该拷贝方法其实也不完全属于是浅拷贝，针对于User对象是深拷贝，但是对于User对象的对象属性则是浅拷贝，比如上面的address属性则只是拷贝对象的引用，如果修改拷贝后对象的属性，原有的对象的address的属性也会被修改。但是数组的拷贝不是拷贝引用。

深拷贝：
```JAVA
@Data
@AllArgsConstructor
@NoArgsConstructor
class Staff {

    private int id;
    private String name;
    private Address address;

    public Staff deepClone() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();

        return objectMapper.readValue(objectMapper.writeValueAsString(this), Staff.class);
    }
}
```
> 上面利用了Jackson的ObjectMapper来进行了对象的深拷贝，其他的序列化工具都具备深拷贝功能包括直接使用流也可以做对象的深拷贝。不过在使用Jackson的深拷贝的时候需要注意的是对象必须具有空参构造函数，不然会报错。

## 总结
对象的拷贝在我们日常有时会遇到，但是我认为与其内置一个clone方法在类内部不如直接使用工具类的拷贝方法直接处理，当然如果你在拷贝的时候有其他额外的处理除外，如果只是简单的拷贝则实用工具类即可。原型模式适合的场景是那些构造比较复杂的对象，而且你新建的对象与原对象的差异不大的情况，使用原型模式可以很快的创建出新的对象并且屏蔽掉对象的创建过程。

## 参考资料
1. [原型模式（原型设计模式）详解](http://c.biancheng.net/view/1343.html)
2. [设计模式：原型模式](https://www.cnblogs.com/xiaoxi/p/7839212.html)