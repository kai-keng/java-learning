# SQL 优化

## 分页场景优化
* 延迟关联相关表：我们查询数据时往往可能需要 JOIN 一些关联信息表，但是 JOIN 行为会影响我们的查询效率，特别是在数据量大的分页场景下会非常的明显。如果没有必要的条件过滤与排序限制，我们可以在数据查询出来以后再对少量的数据进行关联查询，这样会快许多。

* 子查询：我们可以利用内部子查询，先查询出主键id，然后再查询对应 id 的详细数据，加快查询效率。
  ```SQL
  SELECT  
    字段  
  FROM  
    table_name  AS  a  
  RIGHT JOIN  (
  SELECT  
    id  
  FROM  
    table_name  
  LIMIT  
    0, 10) AS  b  
  ON  
    a.id  = b.id;
  ```

## 批量插入使用简洁写法
```SQL
# 反例
INSERT into person(name,age) values('A',24)
INSERT into person(name,age) values('B',24)
INSERT into person(name,age) values('C',24)

# 正例
INSERT into person(name,age) values('A',24),('B',24),('C',24);
```

## 模糊查询优化
日常业务开发经常会使用到模糊查询，通常会使用 `%关键词%` 的方式查询，这种查询方式无法应用上索引，依据最左匹配原则，我们需要尽量使用右模糊 `关键词%` ，右模糊可以应用上索引，加快查询效率。若有更复杂的需求，则使用搜索引擎解决。

## 避免在 WHERE 语句中进行函数转换或表达式计算
在表达式中进行计算无法使用上索引而且因为需要计算，查询效率会非常低，所以禁止在语句中计算，需要在业务中事先计算好，可以使用动态SQL。

## 使用 ISNULL 做 NULL 值判断
在 MySQL 中 NULL 与任何值比较返回值都为 NULL 而不是 false 或 true。必须使用 ISNULL 对 NULL 进行判断。

```SQL
NULL <> NULL 的返回结果是 NULL，而不是 false。 
NULL = NULL 的返回结果是 NULL，而不是 true。 
NULL <> 1 的返回结果是 NULL，而不是 true。
```

## 尽量不使用多表查询
业务开发中尽量查询单表不使用表连接，必须使用的话不要超过3张表，且表连接的字段必须类型一致并建立索引。

## 使用 COUNT(*) 不要使用 COUNT(列名) 与 COUNT(1)
我们在统计行数的时候直接使用 `COUNT(*)`，`COUNT(*)` 与 `COUNT(1)` 实际上没有区别，但是 `COUNT(*)` 是 SQL92 定义的标准统计行数的语法。`COUNT(*)` 与 `COUNT(1)` 在不使用 GROUP BY 与 WHERE 的时候，MySQL 都对其做了一些查询优化，但是 `COUNT(列名)` 没有优化，且需要对字段的非 NULL 做判断，效率会更低。

## 避免字段类型不同导致索引失效
我们在查询的时候若保存的 VARCHAR 类型，但是用于与 INT 类型比较的时候，会隐式的将 VARCHER 转换为 INT 类型，导致索引失效。所以我们要保持字段的类型一致，使用同类型值进行查询，避免发生隐式转化让索引失效。
