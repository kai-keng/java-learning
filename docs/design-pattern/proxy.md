# 结构型-代理模式

## 定义
由于某些原因需要给某对象提供一个代理以控制对该对象的访问。这时，访问对象不适合或者不能直接引用目标对象，代理对象作为访问对象和目标对象之间的中介。

## 理解
代理模式是当我们不好直接访问对象，或者想要在访问对象方法的时候在前置或后置做一些操作的时候，我们可以提供一个代理对象，代理对象有和对象一样的方法，我们通过代理对象调用方法，无感知的在方法前后做一些操作。

## 优点
* 代理模式在客户端与目标对象之间起到一个中介作用和保护目标对象的作用；
* 代理对象可以扩展目标对象的功能；
* 代理模式能将客户端与目标对象分离，在一定程度上降低了系统的耦合度；

## 缺点
* 在客户端和目标对象之间增加一个代理对象，会造成请求处理速度变慢；
* 增加了系统的复杂度；

## 静态代理与动态代理
在我们实现代理模式的时候，普通的静态代理需要针对于每一个服务都实现一个代理类。比如我们使用代理模式实现在方法前添加行为日志，我们想在用户相关的操作前添加日志，那么需要为用户服务创建代理类，当我们又想在产品相关的操作前添加日志，还需要为产品服务添加代理类，这样当我们的服务类很多的时候，会多出很多冗余代码。

这个时候就需要用到动态代理了，在Java中，利用反射的原理帮助我们实现了在运行时动态的生成代理对象，不需要我们自己去写代理类。

## 示例

**服务类**：
```JAVA
// 用户服务接口
interface UserService {

    void addUser();
}

// 用户服务实现类
class UserServiceImpl implements UserService {

    @Override
    public void addUser() {
        System.out.println("添加用户");
    }
}
```

**静态代理**：
```JAVA
// 用户服务代理类
class UserServiceProxy implements UserService {

    private UserService userService;

    public UserServiceProxy(UserService userService) {
        if (userService.equals(null)) {
            this.userService = new UserServiceImpl();
        } else {
            this.userService = userService;
        }
    }

    @Override
    public void addUser() {
        before();
        userService.addUser();
        after();
    }

    private void before() {
        System.out.println("前置操作");
    }

    private void after() {
        System.out.println("后置操作");
    }
}

// 测试类
public class ProxyPatternImpl implements Pattern {

    @Override
    public void test() throws CloneNotSupportedException, IOException, ClassNotFoundException {
        UserService userService = new UserServiceProxy(new UserServiceImpl());
        userService.addUser();
    }
}
```

**测试结果**：
```
前置操作
添加用户
后置操作
```

**动态代理**：
```JAVA
class Handler implements InvocationHandler {

    private Object targetObject;

    public Object newProxyInstance(Object targetObject) {
        this.targetObject = targetObject;
        
        return Proxy.newProxyInstance(targetObject.getClass().getClassLoader(),
                targetObject.getClass().getInterfaces(), this);
    }

    private void before() {
        System.out.println("前置操作");
    }

    private void after() {
        System.out.println("后置操作");
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Object result = null;
        before();
        result = method.invoke(targetObject, args);
        after();
        return result;
    }
}

// 测试类
public class ProxyPatternImpl implements Pattern {

    @Override
    public void test() throws CloneNotSupportedException, IOException, ClassNotFoundException {
        Handler handler = new Handler();
        UserService userService = (UserService) handler.newProxyInstance(new UserServiceImpl());
        userService.addUser();
    }
}
```

**测试结果**：
```
前置操作
添加用户
后置操作
```

## 总结
代理模式的应用是非常广泛的，有以下应用场景：
* 远程代理，这种方式通常是为了隐藏目标对象存在于不同地址空间的事实，方便客户端访问。例如，用户申请某些网盘空间时，会在用户的文件系统中建立一个虚拟的硬盘，用户访问虚拟硬盘时实际访问的是网盘空间。
* 虚拟代理，这种方式通常用于要创建的目标对象开销很大时。例如，下载一幅很大的图像需要很长时间，因某种计算比较复杂而短时间无法完成，这时可以先用小比例的虚拟代理替换真实的对象，消除用户对服务器慢的感觉。
* 安全代理，这种方式通常用于控制不同种类客户对真实对象的访问权限。
* 智能指引，主要用于调用目标对象时，代理附加一些额外的处理功能。例如，增加计算真实对象的引用次数的功能，这样当该对象没有被引用时，就可以自动释放它。
* 延迟加载，指为了提高系统的性能，延迟对目标的加载。例如，Hibernate 中就存在属性的延迟加载和关联表的延时加载。
* 切面编程，Java中的Spring AOP

静态代理模式比较简单，只需要创建代理类即可。动态代理在Java应用中的核心在于实现`InvocationHandler`接口，并实现`invoke`方法，然后使用`Proxy.newProxyInstance`创建代理对象来调用方法即可。

## 参考资料
1. [代理模式（代理设计模式）详解](http://c.biancheng.net/view/1359.html)
2. [动态代理](https://www.liaoxuefeng.com/wiki/1252599548343744/1264804593397984)