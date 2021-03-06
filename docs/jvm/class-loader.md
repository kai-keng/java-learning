# 类加载器
类加载器是JVM必不可少的一个部分，它负责将编译好的class文件加载到JVM虚拟机内部运行时数据区的方法区中来，供程序使用。ClassLoader只负责class文件的加载，而是否能够运行则由 Execution Engine 来决定。

## 类加载流程
类加载器加载流程一共有3个步骤，分别是：加载，链接，初始化。其中链接又分为验证，准备，解析三个步骤。

* 加载:
  1. 将class文件加载到内存
  2. 将静态的数据结构转换成方法区中的运行时数据结构
  3. 在堆中生成一个java.lang.Class类对象来代表这个类，作为访问类信息数据的入口

* 链接
  * 验证：确保加载的类符合 JVM 规范和安全，保证被校验类的方法在运行时不会做出危害虚拟机的事件，其实就是一个安全检查。
  * 准备：为static变量在方法区中分配内存空间，设置变量的初始值，例如`static int a = 3`语句，赋初始值为`a = 0`（注意：准备阶段只设置类中的静态变量（方法区中），不包括实例变量（堆内存中），实例变量是对象初始化时赋值的）。
  * 解析：虚拟机将常量池内的符号引用替换为直接引用的过程（符号引用，比如`import java.util.ArrayList`这就算符号引用，直接引用就是指针或者对象地址，注意引用对象一定是在内存进行）。

* 初始化：初始化其实就是一个赋值的操作，它会执行一个类构造器的`<clinit>()`方法。由编译器自动收集类中所有变量的赋值动作，此时准备阶段时的那个`static int a = 3`的例子，在这个时候就正式赋值为3。

## 类何时被初始化
上面介绍了类的加载流程，那么类什么时候才会被初始化呢？就是以下6种情况：

* 创建类的实例，new对象的时候。
* 访问类或者接口的静态变量，或者对类的静态变量赋值
* 调用类的静态方法
* 反射加载类对象`Class.forName(类全路径名)`
* 子类被初始化的时候，作为父类的自己会被先初始化
* JVM启动时标明的启动类

## 多个类加载器的类加载顺序
当有多个类加载器时，每个类只能被一个类加载器初始化一次，不同的类加载器也是有优先级的，有如下加载器：
1. **BootStrap ClassLoader**：负责加载`$JAVA_HOME`中`jre/lib/rt.jar`里所有的class，由C++实现，不是ClassLoader子类。
2. **Extension ClassLoader**：负责加载java平台中扩展功能的一些jar包，包括`$JAVA_HOME`中`jre/lib/*.jar`或`-Djava.ext.dirs`指定目录下的jar包。
3. **App ClassLoader**：负责加载classpath中指定的jar包及目录中class。
4. **Custom ClassLoader**：属于应用程序根据自身需要自定义的ClassLoader，如tomcat、jboss都会根据j2ee规范自行实现ClassLoader。

加载过程中会先检查类是否已经被加载，检查顺序**自底向上**逐层检查，如果发现已加载则不再加载。加载顺序则相反，**自顶向下**。

## 双亲委派机制
双亲委派机制即当我们一个底层类加载器比如Custom ClassLoader收到了加载一个类的请求的时候，并不会自己直接去加载它，而是委派父类加载器App ClassLoader去完成加载，层层往上委派，只有当父类加载器都反馈自己无法完成加载的时候，才会由子类加载器去尝试加载。

这样做可以确保不论用哪个加载器加载类，最终都会委派到最上层的加载器往下层层加载下来，确保不同的类加载器加载的结果一致，避免我们自己的代码影响到了JDK的代码。

## 参考资料
1. [大白话带你认识JVM](https://juejin.im/post/6844904048013869064#heading-2)
2. [别再说自己不会JVM了，看完这篇能和面试官扯上半小时](https://juejin.im/post/6856958647445291021#heading-1)
3. [Java类加载器总结](https://blog.csdn.net/gjanyanlig/article/details/6818655)