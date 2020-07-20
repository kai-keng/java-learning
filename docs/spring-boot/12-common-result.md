# 包装通用控制层返回结果

## 介绍
业务上，我们一般会统一我们的Restful接口返回数据格式，包含错误码与数据两部分，便于统一结果展示，确认查询结果是否正常。如果我们在每个控制器方法里面去自己包装查询出的结果，控制成统一返回结果则会非常麻烦，需要有大量的重复代码。我们可以利用与[统一异常处理](http://kai-keng.github.io/java-learning/spring-boot/1-exception.html#%E5%89%8D%E8%A8%80)一样的方式来简化我们的处理，同时我们也结合上自定义的注解，来控制我们的控制器是否需要统一处理结果。

## 实现

1. 定义自定义注解
```JAVA
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.TYPE, ElementType.METHOD })
@Documented
public @interface ResponseResult {}
```

2. 添加请求拦截器，拦截处理`ResponseResult`注解
```JAVA
@Component
public class ResponseResultInterceptor implements HandlerInterceptor {

    // 用于缓存被ResponseResult注解标识的方法
    static Map<String, Boolean> cache = new HashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 请求的方法
        if (handler instanceof HandlerMethod) {
            final HandlerMethod handlerMethod = (HandlerMethod) handler;

            // 判断方法是否已缓存，若缓存则直接添加包装标识
            Boolean cacheResult = cache.get(handlerMethod.toString());
            if (cacheResult != null) {
                if (cacheResult) {
                    request.setAttribute(RESPONSE_RESULT_ANN, true);
                }
            } else {
                // 通过反射拿到方法
                final Class<?> clazz = handlerMethod.getBeanType();
                final Method method = handlerMethod.getMethod();

                if (clazz.isAnnotationPresent(ResponseResult.class)) {
                    // 判断类上是否有ResponseResult注解
                    // 若存在ResponseResult注解，添加进缓存并且设置包装标识至请求
                    cache.put(handlerMethod.toString(), true);
                    request.setAttribute(RESPONSE_RESULT_ANN, true);
                } else if (method.isAnnotationPresent(ResponseResult.class)) {
                    // 判断方法上是否有ResponseResult注解
                    // 若存在ResponseResult注解，添加进缓存并且设置包装标识至请求
                    cache.put(handlerMethod.toString(), true);
                    request.setAttribute(RESPONSE_RESULT_ANN, true);
                } else {
                    cache.put(handlerMethod.toString(), false);
                }
            }
        }

        return true;
    }
}
```

3. 添加响应包装处理类
```JAVA
@RestControllerAdvice
public class ResponseResultHandler implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter methodParameter, Class aClass) {
        // 判断是否有包装标识，并返回结果，如果方法结果为true则执行beforeBodyWrite
        ServletRequestAttributes sra = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = sra.getRequest();
        boolean showResult = request.getAttribute(RESPONSE_RESULT_ANN) == null ? false : true;

        return showResult;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter methodParameter, MediaType mediaType, Class aClass,
                                  ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse) {
        // 包装结果
        if (body instanceof Result) {
            return body;
        }

        return Result.success(body);
    }
}
```

