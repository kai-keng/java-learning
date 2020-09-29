# 使用 poi 导出 Excel 表格
业务中需要将查询的数据使用 Excel 导出，故记录下使用 apache 的 poi 包导出 excel 表格。

## 示例
1. 引入 apache 的 poi 依赖

``` XML
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi</artifactId>
    <version>4.1.2</version>
</dependency>
```

2. 创建导出数据存储实体类
```JAVA
package com.demo.model.export;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;


@Data
@Builder
public class UserExport {

    public static final String FULL_NAME = "com.demo.model.export.UserExport";

    public static final String SHEET_NAME = "User Info";

    private String name;

    private Short age;

    private String sex;
}
```

3. 创建获取 Excel 表格的工具类
``` JAVA
package com.demo.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.hssf.usermodel.*;

import java.lang.reflect.Field;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Slf4j
public class ExcelUtil {

    /**
     * 获取 Excel 表格
     *
     * @param objectName 存储数据的对象全限定名称
     * @param data 存入 Excel 的数据集合
     * @param fieldsMap 存储数据对象中字段名与表头字段名的匹配关系
     * @param sheetName 表格名
     * @return 转换后的表格对象
     */
    public static <T> HSSFWorkbook getWorkBook(
            String objectName, List<T> data, Map<String, String> fieldsMap, String sheetName) {

        // 创建一个 Excel 表格对象
        HSSFWorkbook workbook = new HSSFWorkbook();

        try {
            //创建sheet
            HSSFSheet sheet = workbook.createSheet(sheetName);
            // 创建首行
            HSSFRow headerRow = sheet.createRow(0);

            // 获取所有的表头字段名
            Collection<String> tableHeaders = fieldsMap.values();

            // 循环表头字段，创建首行表头
            int loopCount = 0;
            for (String columnName : tableHeaders) {
                // 创建单元格
                HSSFCell cell = headerRow.createCell(loopCount);
                // 设置单元格值
                cell.setCellValue(columnName);
                loopCount++;
            }

            // 循环数据，转化为表格中的每行数据
            for (int i = 0; i < data.size(); i++) {
                // 创建行
                HSSFRow row = sheet.createRow(i + 1);

                // 通过反射依据全限定名获取存储数据对象的Class对象
                Class<T> cls = (Class<T>) Class.forName(objectName);

                // 使用反射获取对象每列的值并填入表格
                int columnIndex = 0;
                for (String key : fieldsMap.keySet()) {
                    // 获取字段值
                    Field field = cls.getDeclaredField(key);
                    field.setAccessible(true);
                    Object value = field.get(data.get(i));

                    // 创建单元格并填入字段值
                    HSSFCell cell = row.createCell(columnIndex);
                    cell.setCellValue(value.toString());
                    columnIndex++;
                }
            }
        } catch (Exception ex) {
            log.error("Error occurred while getWorkBook", ex);
        }

        return workbook;
    }
}
```

4. 创建字段与表头映射类
```JAVA
package com.demo.common;

import java.util.LinkedHashMap;
import java.util.Map;

public class ExcelExportMap {

    // 使用有序的 LinkedHashMap 保存，确保表格字段顺序与我们定义的顺序一致
    public static final Map<String, String> USER_FIELD_MAP = new LinkedHashMap<String, String>(){{
        put("name", "名称");
        put("age", "年龄");
        put("sex", "性别");
    }};
}
```

5. 导出控制器类，测试导出工具
```JAVA
package com.demo.controller;

import com.demo.model.export.UserExport;
import com.demo.service.UserService;
import com.demo.util.ExcelUtil;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import static com.demo.common.ExcelExportMap.*;


@Api(tags = "导出控制器")
@RequestMapping("/export")
@Controller
@Slf4j
public class ExportController {

    @Autowired
    UserService userService;

    @ApiOperation(value = "导出用户信息", notes = "导出用户信息")
    @GetMapping("/user")
    public void exportUserDetail(HttpServletResponse response) {
        try {
            // 查询导出数据
            List<UserDetailExport> exports = userService.getUsers();

            // 获取输出流
            OutputStream output = getOutputStream(response, UserDetailExport.SHEET_NAME);

            // 构建表格
            HSSFWorkbook workbook = ExcelUtil.getWorkBook(
                    UserDetailExport.FULL_NAME, exports, USER_FIELD_MAP, UserDetailExport.SHEET_NAME);

            // 输出表格流
            workbook.write(output);
            output.close();
        } catch (Exception ex) {
            log.error("Error occurred while export user info", ex);
        }
    }

    private OutputStream getOutputStream(HttpServletResponse response, String tableName) throws IOException {
        OutputStream output = response.getOutputStream();
        response.reset();
        response.setHeader("Content-disposition", "attachment; filename=" + tableName + ".xls");
        response.setContentType("application/msexcel");

        return output;
    }
}
```

## 总结
poi 包使用起来还是很简单的，只需要简单的创建表格、行与列即可，还可以调节每行数据的样式，字体等，我这里并没有需求，所以没有做调整，需要的可以自行做修改。

## 参考资料
1. [java实现导入导出excel数据](https://www.jianshu.com/p/4c6eec65fdc3)
