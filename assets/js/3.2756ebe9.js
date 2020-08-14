(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{323:function(s,t,a){s.exports=a.p+"assets/img/explain-1.b8baabb7.jpg"},324:function(s,t,a){s.exports=a.p+"assets/img/explain-2.b58abf3b.jpg"},379:function(s,t,a){s.exports=a.p+"assets/img/explain-3.bed9eb95.jpg"},380:function(s,t,a){s.exports=a.p+"assets/img/explain-4.845d6eb6.jpg"},381:function(s,t,a){s.exports=a.p+"assets/img/explain-5.52a2a9ac.jpg"},382:function(s,t,a){s.exports=a.p+"assets/img/explain-6.cfd2d0cb.jpg"},383:function(s,t,a){s.exports=a.p+"assets/img/explain-7.1c2eb422.jpg"},384:function(s,t,a){s.exports=a.p+"assets/img/explain-8.ab27ad4a.jpg"},385:function(s,t,a){s.exports=a.p+"assets/img/explain-9.44ce4233.jpg"},386:function(s,t,a){s.exports=a.p+"assets/img/explain-10.c290587f.jpg"},387:function(s,t,a){s.exports=a.p+"assets/img/explain-12.3b700cbe.jpg"},388:function(s,t,a){s.exports=a.p+"assets/img/explain-11.87db3bd8.jpg"},444:function(s,t,a){"use strict";a.r(t);var e=a(42),r=Object(e.a)({},(function(){var s=this,t=s.$createElement,e=s._self._c||t;return e("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[e("h1",{attrs:{id:"explain（执行计划）字段解析"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#explain（执行计划）字段解析"}},[s._v("#")]),s._v(" Explain（执行计划）字段解析")]),s._v(" "),e("p",[s._v("使用EXPLAIN关键字可以模拟优化器执行SQL查询语句，从而知道MySQL是如何处理你的SQL语句的。分析你的查询语句或是表结构的性能瓶颈。")]),s._v(" "),e("p",[s._v("执行计划分析结果中包含有很多字段，各字段代表含义如下：")]),s._v(" "),e("h2",{attrs:{id:"id"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#id"}},[s._v("#")]),s._v(" id")]),s._v(" "),e("p",[s._v("select查询的序列号，包含一组数字，表示查询中执行select子句或操作表的顺序。")]),s._v(" "),e("p",[s._v("如果在语句中没有子查询或关联查询，只有唯一的select，每行都将显示1.否则，内层的select语句一般会顺序编号，对应于其在原始语句中的位置。")]),s._v(" "),e("p",[s._v("id的结果共有3中情况:")]),s._v(" "),e("ul",[e("li",[s._v("id相同，执行顺序由上至下")])]),s._v(" "),e("div",{staticClass:"language-SQL extra-class"},[e("pre",{pre:!0,attrs:{class:"language-sql"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("EXPLAIN")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("SELECT")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("FROM")]),s._v(" report"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("user")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),e("p",[e("img",{attrs:{src:a(323),alt:"explain-1"}})]),s._v(" "),e("ul",[e("li",[s._v("id不同，如果是子查询，id的序号会递增，id值越大优先级越高，越先被执行")])]),s._v(" "),e("div",{staticClass:"language-SQL extra-class"},[e("pre",{pre:!0,attrs:{class:"language-sql"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("EXPLAIN")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("SELECT")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("FROM")]),s._v(" report "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("WHERE")]),s._v(" id "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("SELECT")]),s._v(" id "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("FROM")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("user")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("WHERE")]),s._v(" id "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),e("p",[e("img",{attrs:{src:a(324),alt:"explain-2"}})]),s._v(" "),e("ul",[e("li",[s._v("id相同不同，同时存在，与上面一样，同id从上往下执行，id越大优先级越高")])]),s._v(" "),e("h2",{attrs:{id:"select-type"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#select-type"}},[s._v("#")]),s._v(" select_type")]),s._v(" "),e("p",[s._v("用来表示查询的类型，主要是用于区别普通查询、联合查询、子查询等的复杂查询。所有的值如下：")]),s._v(" "),e("ul",[e("li",[s._v("SIMPLE：简单的 SELECT 查询，查询中"),e("strong",[s._v("不包含子查询或者 UNION")]),s._v("。")]),s._v(" "),e("li",[s._v("PRIMARY：PRIMARY 查询中若包含"),e("strong",[s._v("任何复杂的子部分")]),s._v("，"),e("strong",[s._v("最外层查询")]),s._v("则被标记为 PRIMARY。")]),s._v(" "),e("li",[s._v("SUBQUERY：在 SELECT 或 WHERE 列表中"),e("strong",[s._v("包含了子查询")]),s._v("。")]),s._v(" "),e("li",[s._v("DERIVED：在 "),e("strong",[s._v("FROM 列表中包含的子查询")]),s._v("被标记为 DERIVED（衍生），MySQL 会递归执行这些子查询，把结果放在临时表中。")]),s._v(" "),e("li",[s._v("UNION：若第二个 SELECT 出现在 UNION 之后，则被标记为 UNION。若 UNION 包含在 FROM 子句的子查询中，外层 SELECT 将被标记为 DERIVED。")]),s._v(" "),e("li",[s._v("UNION RESULT：从 UNION 表获取结果的 SELECT。")])]),s._v(" "),e("p",[e("img",{attrs:{src:a(324),alt:"explain-2"}})]),s._v(" "),e("h2",{attrs:{id:"table"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#table"}},[s._v("#")]),s._v(" table")]),s._v(" "),e("p",[s._v("指的是当前执行引用哪个表。")]),s._v(" "),e("p",[e("img",{attrs:{src:a(323),alt:"explain-1"}})]),s._v(" "),e("h2",{attrs:{id:"type"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#type"}},[s._v("#")]),s._v(" type")]),s._v(" "),e("p",[s._v("type所显示的是查询使用了哪种类型，type包含的类型包括如下几种：")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("system：表只有一行记录，这是const类型的特列，平时不会出现，可忽略不计。")])]),s._v(" "),e("li",[e("p",[s._v("const：表示只通过一次索引便找到了数据，常出现与主键或唯一索引与常量值比较的场景，此时性能最佳。")])])]),s._v(" "),e("div",{staticClass:"language-SQL extra-class"},[e("pre",{pre:!0,attrs:{class:"language-sql"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("EXPLAIN")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("SELECT")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("FROM")]),s._v(" report "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("WHERE")]),s._v(" id "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),e("p",[e("img",{attrs:{src:a(379),alt:"explain-3"}})]),s._v(" "),e("ul",[e("li",[s._v("eq_ref：唯一性索引扫描，对于每个索引键，表中只有一条记录匹配。常见于主键或非空唯一索引，比如两张表使用主键连表时，就是 eq_ref。")])]),s._v(" "),e("div",{staticClass:"language-SQL extra-class"},[e("pre",{pre:!0,attrs:{class:"language-sql"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("EXPLAIN")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("SELECT")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("FROM")]),s._v(" report "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("as")]),s._v(" r"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("user")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("as")]),s._v(" u "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("WHERE")]),s._v(" r"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("id "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" u"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("id"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),e("p",[e("img",{attrs:{src:a(380),alt:"explain-4"}})]),s._v(" "),e("ul",[e("li",[s._v("ref：非唯一性索引扫描，即刚好与 eq_ref 相反，使用非主键和唯一索引匹配指定值的时候，使用的就是 ref。")])]),s._v(" "),e("div",{staticClass:"language-SQL extra-class"},[e("pre",{pre:!0,attrs:{class:"language-sql"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("-- type_name为非唯一索引")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("EXPLAIN")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("SELECT")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("FROM")]),s._v(" report "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("as")]),s._v(" r "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("WHERE")]),s._v(" r"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("type_name "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v("'测试数据'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),e("p",[e("img",{attrs:{src:a(381),alt:"explain-5"}})]),s._v(" "),e("ul",[e("li",[e("p",[s._v("ref_or_null：与 ref 类似，附加了对 NULL 值列的查询。")])]),s._v(" "),e("li",[e("p",[s._v("index_merge：索引合并，当我们查询条件使用了多个索引字段进行 OR，AND 操作的时候会进行索引合并，将索引各自的结果值进行合并。")])])]),s._v(" "),e("div",{staticClass:"language-SQL extra-class"},[e("pre",{pre:!0,attrs:{class:"language-sql"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("EXPLAIN")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("SELECT")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("FROM")]),s._v(" report "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("as")]),s._v(" r "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("WHERE")]),s._v(" r"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("id "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("OR")]),s._v(" r"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("ext_id "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"1"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),e("p",[e("img",{attrs:{src:a(382),alt:"explain-6"}})]),s._v(" "),e("ul",[e("li",[s._v("range：范围索引扫描，检索指定范围的索引。一般出现于条件语句中有 between，<，>，in 等查询的时候，性能优于全索引扫描。")])]),s._v(" "),e("div",{staticClass:"language-SQL extra-class"},[e("pre",{pre:!0,attrs:{class:"language-sql"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("EXPLAIN")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("SELECT")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("FROM")]),s._v(" report "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("as")]),s._v(" r "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("WHERE")]),s._v(" r"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("id "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),e("p",[e("img",{attrs:{src:a(383),alt:"explain-7"}})]),s._v(" "),e("ul",[e("li",[s._v("index：全索引扫描，遍历所有索引，相比于全表扫描较好，但是也算是性能比较差的级别了，常见于无条件查询"),e("a",{attrs:{href:"https://kai-keng.github.io/java-learning/mysql/mysql-index.html#%E7%B4%A2%E5%BC%95%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF%EF%BC%88%E9%87%8D%E7%82%B9%EF%BC%89",target:"_blank",rel:"noopener noreferrer"}},[s._v("覆盖索引"),e("OutboundLink")],1),s._v("的情况。")])]),s._v(" "),e("div",{staticClass:"language-SQL extra-class"},[e("pre",{pre:!0,attrs:{class:"language-sql"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("EXPLAIN")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("SELECT")]),s._v(" id "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("FROM")]),s._v(" report "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("as")]),s._v(" r"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),e("p",[e("img",{attrs:{src:a(384),alt:"explain-8"}})]),s._v(" "),e("ul",[e("li",[s._v("all：全表扫描，最差的情况，会扫描整张表，查询效率很低。")])]),s._v(" "),e("div",{staticClass:"language-SQL extra-class"},[e("pre",{pre:!0,attrs:{class:"language-sql"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("EXPLAIN")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("SELECT")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("FROM")]),s._v(" report "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("as")]),s._v(" r "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("WHERE")]),s._v(" r"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("type_id "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v("'1'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),e("p",[e("img",{attrs:{src:a(385),alt:"explain-9"}})]),s._v(" "),e("blockquote",[e("p",[s._v("注意，阿里巴巴JAVA开发手册中规定，我们书写的 SQL 至少要达到 range 级别，要求是 ref 级别。")])]),s._v(" "),e("h2",{attrs:{id:"possible-keys-与-key"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#possible-keys-与-key"}},[s._v("#")]),s._v(" possible_keys 与 key")]),s._v(" "),e("p",[s._v("possible_keys 表示哪些索引可以应用到此次查询中用于优化，key 表示 MySQL 实际使用的索引。若执行计划 key 为非空则表示使用了索引，反之表示未使用到索引。")]),s._v(" "),e("div",{staticClass:"language-SQL extra-class"},[e("pre",{pre:!0,attrs:{class:"language-sql"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("EXPLAIN")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("SELECT")]),s._v(" id "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("FROM")]),s._v(" report "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("as")]),s._v(" r "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("WHERE")]),s._v(" r"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("id "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),e("p",[e("img",{attrs:{src:a(386),alt:"explain-10"}})]),s._v(" "),e("p",[s._v("上图中 possible_keys 为 "),e("code",[s._v("PRIMARY,idx_create_time")]),s._v("，key 为 "),e("code",[s._v("PRIMARY")]),s._v("。表示可以使用的索引有"),e("strong",[s._v("主键索引和 idx_create_time 索引")]),s._v("，实际使用的是"),e("strong",[s._v("主键索引")]),s._v("。")]),s._v(" "),e("h2",{attrs:{id:"key-len"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#key-len"}},[s._v("#")]),s._v(" key_len")]),s._v(" "),e("p",[s._v("表示索引中使用的字节数，可通过该列计算查询中使用的索引的长度，长度越长查询精度越高，"),e("strong",[s._v("但是在不损失精确性的情况下，长度越短越好")]),s._v("（涉及 B+树原理，长度越短能减低树的深度，减少 io 次数，提高性能）。key_len 显示的值为索引字段的最大可能长度，并非实际使用长度，即 key_len 是根据表定义计算而得，不是通过表内检索出的。")]),s._v(" "),e("h2",{attrs:{id:"ref"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#ref"}},[s._v("#")]),s._v(" ref")]),s._v(" "),e("p",[s._v("显示索引的那一列被使用了，如果可能的话，最好是一个常数。哪些列或常量被用于查找索引列上的值。")]),s._v(" "),e("h2",{attrs:{id:"rows"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#rows"}},[s._v("#")]),s._v(" rows")]),s._v(" "),e("p",[s._v("根据表统计信息及索引选用情况，大致估算出找到所需的记录所需要读取的行数，也就是说，用的越少越好。")]),s._v(" "),e("h2",{attrs:{id:"extra"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#extra"}},[s._v("#")]),s._v(" Extra")]),s._v(" "),e("p",[s._v("Extra 列主要用于显示额外的信息，常见信息及其含义如下：")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("Using where: 表示 MySQL 服务器在存储引擎收到记录后使用了 where 条件进行过滤。")])]),s._v(" "),e("li",[e("p",[s._v("Using filesort：表示MySQL不会按照表内索引顺序读取，会使用外部索引排序。在MySQL中无法利用索引完成的排序操作被称为"),e("strong",[s._v("文件排序")]),s._v("。")])]),s._v(" "),e("li",[e("p",[s._v("Using temporary：表示使用了临时表保存中间结果。MySQL在对查询结果排序或分组是使用了临时表，常见于 "),e("code",[s._v("ORDER BY")]),s._v(" 与 "),e("code",[s._v("GROUP BY")]),s._v("。")])]),s._v(" "),e("li",[e("p",[s._v("Using index：表示查询中使用了"),e("a",{attrs:{href:"https://kai-keng.github.io/java-learning/mysql/mysql-index.html#%E7%B4%A2%E5%BC%95%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF%EF%BC%88%E9%87%8D%E7%82%B9%EF%BC%89",target:"_blank",rel:"noopener noreferrer"}},[s._v("覆盖索引"),e("OutboundLink")],1),s._v("，避免了回表查询。但是有时会与 "),e("code",[s._v("Using where")]),s._v(" 同时出现，表示非直接查询"),e("a",{attrs:{href:"https://kai-keng.github.io/java-learning/mysql/mysql-index.html#%E7%B4%A2%E5%BC%95%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF%EF%BC%88%E9%87%8D%E7%82%B9%EF%BC%89",target:"_blank",rel:"noopener noreferrer"}},[s._v("覆盖索引"),e("OutboundLink")],1),s._v("数据，并且索引被用来执行索引值的查找。通俗来讲就是只有 "),e("code",[s._v("Using index")]),s._v(" 的时候表示只是简单查询"),e("a",{attrs:{href:"https://kai-keng.github.io/java-learning/mysql/mysql-index.html#%E7%B4%A2%E5%BC%95%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF%EF%BC%88%E9%87%8D%E7%82%B9%EF%BC%89",target:"_blank",rel:"noopener noreferrer"}},[s._v("覆盖索引"),e("OutboundLink")],1),s._v("，同时出现则表示还使用了索引作为查询项查询过滤。")]),s._v(" "),e("div",{staticClass:"language-SQL extra-class"},[e("pre",{pre:!0,attrs:{class:"language-sql"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("EXPLAIN")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("SELECT")]),s._v(" ext_id "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("FROM")]),s._v(" report "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("as")]),s._v(" r "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("WHERE")]),s._v("  ext_id "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!=")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v("'4028e5f661e121980161ef964e7d106e'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),e("p",[e("img",{attrs:{src:a(387),alt:"explain-12"}})])]),s._v(" "),e("li",[e("p",[s._v("Using index condition：MySQL5.6 版本后新加入的，表示先对索引值进行了过滤，过滤后会找到所有的数据行（回表），如果同时有 "),e("code",[s._v("Using where")]),s._v("，则会在找到数据行以后再使用 where 过滤。")]),s._v(" "),e("div",{staticClass:"language-SQL extra-class"},[e("pre",{pre:!0,attrs:{class:"language-sql"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("EXPLAIN")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("SELECT")]),s._v(" ext_id "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("FROM")]),s._v(" report "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("as")]),s._v(" r "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("WHERE")]),s._v("  ext_id "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!=")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v("'4028e5f661e121980161ef964e7d106e'")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("AND")]),s._v(" author_id "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!=")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"1"')]),s._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),e("p",[e("img",{attrs:{src:a(388),alt:"explain-11"}})])]),s._v(" "),e("li",[e("p",[s._v("Using join buffer：表明表连接的时候使用了连接缓存。")])]),s._v(" "),e("li",[e("p",[s._v("impossible where：表明 where 查询的值总是 false，无法用来查询到确切数据。")])])]),s._v(" "),e("h2",{attrs:{id:"参考资料"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#参考资料"}},[s._v("#")]),s._v(" 参考资料")]),s._v(" "),e("ol",[e("li",[e("a",{attrs:{href:"https://www.php.cn/mysql-tutorials-454417.html",target:"_blank",rel:"noopener noreferrer"}},[s._v("MySQL中explain用法和结果分析（详解）"),e("OutboundLink")],1)]),s._v(" "),e("li",[e("a",{attrs:{href:"https://juejin.im/post/6844904135964229646#heading-1",target:"_blank",rel:"noopener noreferrer"}},[s._v("没内鬼，来点干货！SQL优化和诊断"),e("OutboundLink")],1)])])])}),[],!1,null,null,null);t.default=r.exports}}]);