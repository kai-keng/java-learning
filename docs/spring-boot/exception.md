# 统一异常处理

## 前言
在日常的业务处理中，我们需要捕捉所有我们业务代码抛出的异常，记录下异常并处理相应的异常。但是如果我们逐一在Controller层去使用`try catch`代码块捕捉的话，则需要写大量的重复代码，不易于维护且增加工作量，代码可读性也会降低，所以我们需要统一集中处理我们的异常。


## 优点
* 全局Catch住异常，防止业务层的异常没有被捕捉到，一直抛到最上层，导致服务出现不可预料的错误返回
* 控制统一的返回结果，减少无用的代码量

## 实现
1. 实现错误码类与返回结果类：规范返回结果
```JAVA
@AllArgsConstructor
@Getter
public enum ResultCode {
    // 错误码格式 A0001，B0001，C0001...
    // 第一位为错误来源标识，A标识来源用户，B标识来源当前系统内，C标识错误来源第三方，大类步长间距100
    // 参照阿里JAVA开发手册标准
    SUCCESS("00000", "请求成功"),
    // A类
    INVALID_PARAM("A0001", "输入参数错误，请重新输入"),
    // B类
    UNKNOWN_ERROR("B0001", "系统未知错误，请联系管理员");
    // C类

    private String code;
    private String message;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Result implements Serializable {

    private String errCode;
    private String errDesc;;
    private String errDetail;
    private Object data;

    public static Result success() {
        return Result.builder().errCode(ResultCode.SUCCESS.getCode()).errDesc(ResultCode.SUCCESS.getMessage()).build();
    }

    public static Result success(Object data) {
        return Result.builder().errCode(ResultCode.SUCCESS.getCode())
                .errDesc(ResultCode.SUCCESS.getMessage()).data(data).build();
    }

    public static Result failure(ResultCode resultCode) {
        return Result.builder().errCode(resultCode.getCode()).errDesc(resultCode.getMessage()).build();
    }

    public static Result failure(ResultCode resultCode, String errDetail) {
        return Result.builder().errCode(resultCode.getCode()).errDesc(resultCode.getMessage()).errDetail(errDetail).build();
    }

    public static Result failure(ResultCode resultCode, Object data) {
        return Result.builder().errCode(resultCode.getCode()).errDesc(resultCode.getMessage()).data(data).build();
    }

    public static Result failure(ResultCode resultCode, String errDetail , Object data) {
        return Result.builder()
                .errCode(resultCode.getCode()).errDesc(resultCode.getMessage()).errDetail(errDetail).data(data).build();
    }
}
```
2. 定义自定义异常类：定义好自定义异常，包装业务相关异常
```JAVA
@Data
@NoArgsConstructor
public class NormalException extends RuntimeException {
    private ResultCode resultCode;

    public NormalException(ResultCode resultCode) {
        super(resultCode.getMessage());
        this.resultCode = resultCode;
    }
}
```
3. 实现全局异常处理类：利用`@RestControllerAdvice`注解，拦截请求，并且使用`@ExceptionHandler`注解捕捉请求中抛出的指定异常
``` JAVA
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public final Result handleRuntimeExceptions(Exception ex, WebRequest request) {

        Result result = null;

        if (ex instanceof NormalException) {
            // 处理自定义日常错误
            NormalException normalException = (NormalException) ex;
            result = Result.failure(normalException.getResultCode());

            // 依据错误打印不同级别日志
            if (!result.getErrCode().startsWith(ERROR_A)) {
                log.warn("System related exception occurred", ex);
            } else {
                log.info("User related exception occurred", ex);
            }
        } else {
            log.error("Unknown exception occurred", ex);
            result = Result.failure(ResultCode.UNKNOWN_ERROR, ex.getMessage());
        }

        return result;
    }

    @ExceptionHandler({MissingServletRequestParameterException.class, MethodArgumentNotValidException.class})
    @ResponseBody
    public final Result handleParameterExceptions(Exception ex, WebRequest request) {
        return Result.failure(ResultCode.INVALID_PARAM, ex.getMessage());
    }
}
```

## 总结
全局异常处理核心是利用Java提供的`@RestControllerAdvice`标记需要扫描的全局异常处理类，然后使用`@ExceptionHandler`标记具体处理异常的方法，`@ExceptionHandler`可以定义需要捕捉的异常，可以定义单个也可以定义多个。