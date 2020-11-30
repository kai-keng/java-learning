(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{389:function(t,s,a){t.exports=a.p+"assets/img/2-1.2e5bff49.png"},390:function(t,s,a){t.exports=a.p+"assets/img/2-2.d9c31380.png"},391:function(t,s,a){t.exports=a.p+"assets/img/5-1.dcda1010.png"},392:function(t,s,a){t.exports=a.p+"assets/img/5-2.b32aa8b1.jpg"},393:function(t,s,a){t.exports=a.p+"assets/img/5-3.76e385f3.jpg"},496:function(t,s,a){"use strict";a.r(s);var n=a(42),e=Object(n.a)({},(function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("h1",{attrs:{id:"mysql-实战45讲学习笔记"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#mysql-实战45讲学习笔记"}},[t._v("#")]),t._v(" MySQL 实战45讲学习笔记")]),t._v(" "),n("h2",{attrs:{id:"_1-mysql-架构"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_1-mysql-架构"}},[t._v("#")]),t._v(" 1. MySQL 架构")]),t._v(" "),n("p",[t._v("MySQL 分为两部分：Server 层与存储引擎层。 Server 中含有：连接器、分析器、优化器与执行器，存储引擎层即使用于存储的引擎，其中包含有用于操作数据的接口。")]),t._v(" "),n("ul",[n("li",[n("p",[t._v("连接器：用于连接 MySQL，会校验账号与密码。")])]),t._v(" "),n("li",[n("p",[t._v("分析器：用于做词法分析和语法分析，判断输入的 MySQL 语句是否正确。")])]),t._v(" "),n("li",[n("p",[t._v("优化器：用于优化输入的 SQL 语句，选择优化器认为的最优的执行顺序，查询索引等。")])]),t._v(" "),n("li",[n("p",[t._v("执行器：即真正的去调用存储引擎来查询所需要的数据。")])])]),t._v(" "),n("p",[t._v("查询缓存：在 MySQL 8.0以前带有查询缓存，即以 key、value 的形式存储我们的查询语句与查询结果。但是不被推荐使用，因为只需要更新表内的任意一条数据，都会导致整张表的缓存删除，导致缓存的命中率低下，只适用于极少更新的表中，故不被推荐使用，并且在 MySQL 8.0以后删除了查询缓存的功能。")]),t._v(" "),n("h2",{attrs:{id:"_2-redolog-与-binlog"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-redolog-与-binlog"}},[t._v("#")]),t._v(" 2. redolog 与 binlog")]),t._v(" "),n("h3",{attrs:{id:"binlog"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#binlog"}},[t._v("#")]),t._v(" binlog")]),t._v(" "),n("ul",[n("li",[n("strong",[t._v("介绍")])])]),t._v(" "),n("p",[t._v("binlog 是 MySQL 数据库 Server 层实现的修改日志，记录数据库中原始逻辑操作。")]),t._v(" "),n("ul",[n("li",[n("strong",[t._v("特点")])])]),t._v(" "),n("ol",[n("li",[t._v("MySQL 中所有的引擎都有 binlog，是 MySQL 中的Server层实现的")]),t._v(" "),n("li",[t._v("binlog 没有定长空间，是追加写入的方式，当写满了的时候可以找下一个空间接着写")]),t._v(" "),n("li",[t._v("binlog 是记录逻辑原始逻辑操作，比如 ID = 2 的行修改 c = c + 1")])]),t._v(" "),n("h3",{attrs:{id:"redolog"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#redolog"}},[t._v("#")]),t._v(" redolog")]),t._v(" "),n("ul",[n("li",[n("p",[n("strong",[t._v("介绍")]),t._v("\n在执行器调用存储引擎之后，存储引擎出于效率考虑，并不会立即将数据存入磁盘中，而是先将操作写入 redolog 中，在 redolog 中记录下自己的操作，然后在适当的时间（比如系统空闲时间）将数据写入磁盘。")])]),t._v(" "),n("li",[n("p",[n("strong",[t._v("特点")])])])]),t._v(" "),n("ol",[n("li",[t._v("redolog 只有 InnoDB 才有，是 InnoDB 自己实现的")]),t._v(" "),n("li",[t._v("redolog 是有固定的存储空间的，它有两个指针，分别是 write pos 与 check point， write pos 指针表示当前日志写入到的位置，当指针到末尾以后会回到头部重新开始写入。\n而 check point 则表示清除了 redolog 的位置，将 redolog 的内容写入到磁盘中，check point 与 write pos 之间的位置则表示空闲待写入的空间。当 write pos 追上 check point 的时候会停止写入 redolog，\n先将记录的 redolog 存入到磁盘中，待有空闲空间以后再继续写入 redolog")]),t._v(" "),n("li",[t._v("redolog 记录的是物理操作，比如在某个数据页上，修改了什么数据，更为具体。")]),t._v(" "),n("li",[t._v("因为在写入数据进入物理磁盘之前，会先写入 redolog，所以在我们数据库崩溃异常重启的时候，只需要依照我们的 redolog 上的记录来恢复尚未存入到磁盘中的数据，就可以恢复原库数据，这个行为称为 "),n("strong",[t._v("crash-safe")]),t._v("。")])]),t._v(" "),n("h3",{attrs:{id:"关于-crash-safe-能力"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#关于-crash-safe-能力"}},[t._v("#")]),t._v(" 关于 crash-safe 能力")]),t._v(" "),n("p",[t._v("看完讲解后我提出一个问题，为什么 binlog 没有 crash-safe 能力？它也记录了事务的操作，我们按照 binlog 的记录直接恢复未存储的数据不就好了吗？")]),t._v(" "),n("p",[t._v("查阅一些资料无果之后又仔细多次阅读 MySQL 实战45讲，发现也并没有描述为什么 binlog 不带有 crash-safe 能力，所以在往后继续看两阶段提交的时候，需要在脑中有一个思想，就是 binlog 不带有 carsh-safe\n能力，不然你在看两阶段提交的时候会很纳闷，不能理解为什么。")]),t._v(" "),n("h3",{attrs:{id:"两阶段提交"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#两阶段提交"}},[t._v("#")]),t._v(" 两阶段提交")]),t._v(" "),n("p",[t._v("假设我们要执行一个修改语句："),n("code",[t._v("UPDATE T SET c = c + 1 WHERE ID = 2")])]),t._v(" "),n("p",[t._v("该语句执行的流程图如下：\n"),n("img",{attrs:{src:a(389),alt:"执行流程图"}})]),t._v(" "),n("p",[t._v("图中可以看到，redolog 的写入是分为两阶段的，分别是开始的 prepare 阶段与事务提交后的 commit 阶段。")]),t._v(" "),n("p",[t._v("为什么会需要有这两个阶段呢？")]),t._v(" "),n("p",[t._v("我们可以使用反证法假设没有两阶段提交，单纯的只是分别写入这两个日志：")]),t._v(" "),n("ol",[n("li",[t._v("先写入 redolog 后写入 binlog")])]),t._v(" "),n("p",[t._v("假设在写入了 redolog 的时候，数据库崩溃了，我们需要使用 redolog 恢复原库，这个时候 redolog 记录 c 的值已经被修改成了 1，我们使用 redolog 的 crash-safe 能力恢复以后库的值即为\n1，这个时候 1 即为原库值。但是这个时候 binlog 中还没有写入 c = 1 的操作，如果我们之后使用 binlog 来恢复的话，值就不会等于 1，就与原库值不一致。")]),t._v(" "),n("ol",{attrs:{start:"2"}},[n("li",[t._v("先写入 binlog 后写入 redolog")])]),t._v(" "),n("p",[t._v("假设在写入 binlog 的时候数据库崩溃了，这个时候 binlog 已经记录了 c = 1，但是我们的 redolog 中没有记录下来，使用 crash-safe 恢复库以后，原库值 c = 0，两边又不一致了。")]),t._v(" "),n("p",[t._v("而使用两阶段提交的话，我们就能知道当前日志是否同时写入了 redolog 与 binlog 中，能确保两边恢复的数据都一致了。")]),t._v(" "),n("h2",{attrs:{id:"_3-事务隔离"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_3-事务隔离"}},[t._v("#")]),t._v(" 3. 事务隔离")]),t._v(" "),n("p",[t._v("事务隔离是数据库的一个重要特性，能够避免在并行操作的时候读取到我们意料之外的值情况。同时也能够确保在我们进行一系列操作的时候，当某一个操作失败的时候能够将之前的操作也回滚掉，不在数据库中生效。")]),t._v(" "),n("p",[t._v("数据库操作主要分为"),n("strong",[t._v("读操作")]),t._v("和"),n("strong",[t._v("写操作")]),t._v("。写操作的控制主要是依靠数据库的锁来控制并发下的意外情况，而读操作则依据设置的事务隔离级别不同，会有不同的处理。")]),t._v(" "),n("p",[t._v("事务隔离从读的方面来讲，主要目的是为了解决如下几个问题：")]),t._v(" "),n("p",[t._v("假设有如下数据：\n"),n("code",[t._v("insert into T(c) values(1);")])]),t._v(" "),n("p",[t._v("假设有事务 A、B，事务 A 优先于事务 B 开启。")]),t._v(" "),n("ul",[n("li",[t._v("脏读：读取到其他事务尚未提交的内容。比如在事务 A 中，我修改了 c 的值为2，事务 A 尚未提交，但是事务 B 已经读取到了这个尚未提交的新值。")]),t._v(" "),n("li",[t._v("不可重复读：在另一个事务开启期间，重复读取某一行的值，但是读取到的值前后不一致。比如事务 A 第一次读取 c 的值为1，然后事务 B 修改了 c 的值为2并提交，这个时候事务 A 再次读取 c 的值为2，前后读取到的 c 值不一致，此为不可重复读。")]),t._v(" "),n("li",[t._v("幻读：在事务开启期间重复读取一张表中的数据总行数，前后读取到的行数不一致。比如事务 A 第一次读取到的表 T 的行数为1，然后事务 B 在表 T 中新增了一行并提交，这个时候事务 A 再次读取表行数为2，前后不一致。")])]),t._v(" "),n("blockquote",[n("p",[t._v("幻读和不可重复读的主要区别点在与，不可重复读是指某一行数据，前后重复读取的值不相同，而幻读是读取一张表中的行数，前后不一致。不可重复读针对于行的修改，幻读针对的是对表中行数据的新增与删除操作。")])]),t._v(" "),n("p",[t._v("介绍完事务并发读取的几个问题后，我们再谈下不同的事务隔离级别：")]),t._v(" "),n("ul",[n("li",[t._v("读未提交：一个事务可以读取到另外一个事务尚未提交的修改。无法解决以上任一问题。")]),t._v(" "),n("li",[t._v("读已提交：一个事务只能读取到其他事务已经提交的数据，尚未提交的数据无法读取到。能解决脏读问题。")]),t._v(" "),n("li",[t._v("可重复读：一个事务在事务期间读取某一行的值，前后都保持一致，不会出现前后读取到的数据不一致的问题。能解决脏读，不可重复读。")]),t._v(" "),n("li",[t._v("串行化：所有的事务都是串行执行，没有并发操作，效率低下，但是能解决以上所有问题。")])]),t._v(" "),n("blockquote",[n("p",[t._v("ORACLE 默认为读已提交，MySQL 默认为可重复读。")])]),t._v(" "),n("h3",{attrs:{id:"事务隔离实现原理"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#事务隔离实现原理"}},[t._v("#")]),t._v(" 事务隔离实现原理")]),t._v(" "),n("p",[t._v("事务隔离实现的依靠的是"),n("strong",[t._v("回滚日志")]),t._v("与 "),n("strong",[t._v("Read-View")]),t._v("。")]),t._v(" "),n("p",[t._v("回滚日志记录下了我们的数据值可以从当前值修改回原值的内容，而 Read-View 则是我们数据库中表的快照。")]),t._v(" "),n("p",[t._v("比如当我们的事务隔离级别为"),n("strong",[t._v("可重复读")]),t._v("的时候，我们每开启一个事务都会生成一个 Read-View 的快照，然后在事务执行期间，我们读取的都是这个快照而不是实际的数据库，\n这样就保证了我们的事务期间读取到的值都是一致的，不会出现不可重复读的问题。")]),t._v(" "),n("p",[t._v("而"),n("strong",[t._v("读已提交")]),t._v("则是在每次执行 SQL 语句的时候都会生成一个 Read-View，"),n("strong",[t._v("读未提交")]),t._v("则不会生成 Read-View，所有的操作都是直接作用在表上的。")]),t._v(" "),n("p",[t._v("当我们想要回滚数据的时候，我们依靠"),n("strong",[t._v("回滚日志")]),t._v("与 "),n("strong",[t._v("Read-View")]),t._v("就可以回滚我们的事务。假设我们的事务隔离级别为"),n("strong",[t._v("读已提交")]),t._v("，将表 T 中的 c 值依次修改为 2、3、4，那么这个时候事务则会记录如下的"),n("strong",[t._v("回滚日志")]),t._v("与 "),n("strong",[t._v("Read-View")]),t._v("。")]),t._v(" "),n("p",[n("img",{attrs:{src:a(390),alt:"回滚日志与 Read-View"}})]),t._v(" "),n("p",[t._v("当我们想要回滚事务的时候，需要依次从 Read-View C - B - A 按照回滚日志来回滚。")]),t._v(" "),n("p",[t._v("那么我们的回滚日志总不可能一直保存着吧？什么时候删除呢？")]),t._v(" "),n("p",[t._v("是否删除回滚日志取决于我们是否有比回滚日志更早的 Read-View，当没有更早的 Read-View 的时候就会清理掉回滚日志了。")]),t._v(" "),n("blockquote",[n("p",[t._v("至于何时删除 Read-View，MySQL 实战中没讲，我没也查到，猜测事务结束的时候就会清理掉 Read-View 了，但是为什么不在事务结束的时候直接清除掉回滚日志呢？事务结束了不就不需要回滚日志了吗？")])]),t._v(" "),n("h3",{attrs:{id:"解决长事务"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#解决长事务"}},[t._v("#")]),t._v(" 解决长事务")]),t._v(" "),n("p",[t._v("长事务会一直累积回滚日志，增加库的大小，需要尽量避免长事务的出现。")]),t._v(" "),n("p",[t._v("如何避免长事务呢？ 个人认为需要做到以下几点：")]),t._v(" "),n("ol",[n("li",[t._v("统一项目后端框架，确保我们的框架不会自动运行 set autocommit=0")]),t._v(" "),n("li",[t._v("规范开发行为，如无特殊需求禁止使用长事务")]),t._v(" "),n("li",[t._v("必要的话可以要求开发全部手动控制整个事务的生命周期，从开启事务到提交、回滚事务都手动编写，不使用框架的自动事务提交")]),t._v(" "),n("li",[t._v("CodeReview，检查代码，避免漏提交事务，写错等")]),t._v(" "),n("li",[t._v("定期运行 "),n("code",[t._v("select * from information_schema.innodb_trx where TIME_TO_SEC(timediff(now()，trx_started))>60")]),t._v(" 检查数据库中是否存在长事务")])]),t._v(" "),n("blockquote",[n("p",[t._v("大佬答案")])]),t._v(" "),n("p",[n("strong",[t._v("首先，从应用开发端来看")]),t._v("：")]),t._v(" "),n("ol",[n("li",[n("p",[t._v("确认是否使用了set autocommit=0。这个确认工作可以在测试环境中开展，把MySQL的general_log开起来，然后随便跑一个业务逻辑，通过general_log的日志来确认。一般框架如果会设置这个值，也就会提供参数来控制行为，你的目标就是把它改成1。")])]),t._v(" "),n("li",[n("p",[t._v("确认是否有不必要的只读事务。有些框架会习惯不管什么语句先用begin/commit框起来。我见过有些是业务并没有这个需要，但是也把好几个select语句放到了事务中。这种只读事务可以去掉。")])]),t._v(" "),n("li",[n("p",[t._v("业务连接数据库的时候，根据业务本身的预估，通过SET MAX_EXECUTION_TIME命令，来控制每个语句执行的最长时间，避免单个语句意外执行太长时间。（为什么会意外？在后续的文章中会提到这类案例）")])])]),t._v(" "),n("p",[n("strong",[t._v("其次，从数据库端来看")]),t._v("：")]),t._v(" "),n("ol",[n("li",[n("p",[t._v("监控 information_schema.Innodb_trx表，设置长事务阈值，超过就报警/或者kill；")])]),t._v(" "),n("li",[n("p",[t._v("Percona的pt-kill这个工具不错，推荐使用；")])]),t._v(" "),n("li",[n("p",[t._v("在业务功能测试阶段要求输出所有的general_log，分析日志行为提前发现问题；")])]),t._v(" "),n("li",[n("p",[t._v("如果使用的是MySQL 5.6或者更新版本，把innodb_undo_tablespaces设置成2（或更大的值）。如果真的出现大事务导致回滚段过大，这样设置后清理起来更方便。")])])]),t._v(" "),n("h2",{attrs:{id:"_4-索引"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-索引"}},[t._v("#")]),t._v(" 4. 索引")]),t._v(" "),n("h3",{attrs:{id:"常见索引数据结构"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#常见索引数据结构"}},[t._v("#")]),t._v(" 常见索引数据结构")]),t._v(" "),n("ol",[n("li",[t._v("哈希结构")])]),t._v(" "),n("p",[t._v("采用数据与链表相结合的数据结构，每个数组中存放的是一个链表。将 key 值哈希后得到数组下标值，然后放入数组中的链表中，当发生哈希碰撞时则直接接在链表后面即可。因为数组的特性，所以等值查询访问速度很快，但是如果进行范围查询的话，会需要扫描所有数据，非常慢，所以适合等值查询场景。")]),t._v(" "),n("ol",{attrs:{start:"2"}},[n("li",[t._v("有序数组")])]),t._v(" "),n("p",[t._v("有序数组则是直接使用有序数组来存储数据，不管是等值查询还是范围查询都非常的快，缺点则是如果在数组中间插入新数据的话，需要移动后续的所有数据，插入的代价非常大，不适合频繁插入的场景，只适合存储一些静态的数据场景。")]),t._v(" "),n("ol",{attrs:{start:"3"}},[n("li",[t._v("二叉搜索树")])]),t._v(" "),n("p",[t._v("二叉搜索树是一个二叉平衡树的数据结构。针对于等值查询与范围查询的情况查询效率都是 O(log(N))，性能很高，并且插入也是 O(log(N))，是一种非常优秀的存储结构。但是因为树是分层的，查询的时候是需要一层层从上往下查的，如果使用二叉搜索树的话，当数据量大的时候，树的高度会非常高。")]),t._v(" "),n("p",[t._v("比如一个树高为20的二叉搜索树，存储的行数为 2^19 = 524288，我们如果要搜索最后一行的数据的话，需要加载20个数据块，机械硬盘每次随机读取一个数据块的寻址时间是10 ms 左右，那就是20 * 10，消耗的时间非常多。如果我们替换二叉树为 N 叉树的话，比如 InnoDB 使用的 n 为1200，当树高为4的时候，可以存储的行数为 1200 * 1200 * 1200 = 17亿之多，所以现在很多数据库存储都采用了 N 叉树来存储。")]),t._v(" "),n("h3",{attrs:{id:"innodb-的索引"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#innodb-的索引"}},[t._v("#")]),t._v(" InnoDB 的索引")]),t._v(" "),n("p",[t._v("InnoDB 中常见的索引为"),n("strong",[t._v("主键索引（聚簇索引）"),n("strong",[t._v("与")]),t._v("非主键索引（二级索引）")]),t._v("。主键索引的叶子节点存储的是整行数据，而非主键索引的叶子结点存储的主键索引的 key 值，当我们使用主键索引查询数据的时候，在找到主键索引后，可以直接从叶子节点获取数据，但是如果使用非主键索引查询的时候，则是先查询到主键索引的 key，然后再通过主键索引查询到主键上的行数据。（"),n("a",{attrs:{href:"http://localhost:8080/java-learning/mysql/mysql-index.html#%E4%BB%80%E4%B9%88%E6%98%AFb%E6%A0%91-b-tree-%E4%B8%8Eb-%E6%A0%91-b-tree",target:"_blank",rel:"noopener noreferrer"}},[t._v("B+ 树详细介绍"),n("OutboundLink")],1),t._v("）")]),t._v(" "),n("h3",{attrs:{id:"当我表中有其他唯一字段的时候，我是否需要自增主键"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#当我表中有其他唯一字段的时候，我是否需要自增主键"}},[t._v("#")]),t._v(" 当我表中有其他唯一字段的时候，我是否需要自增主键")]),t._v(" "),n("p",[t._v("从以上介绍可以看到，我们的主键索引存储的是行数据，非主键存储的是主键索引值。所以当你的表数据中存在其他索引的时候，如果使用很长的非自增字段作为索引，在非主键索引的叶子中会需要存储较多的数据，浪费存储空间。而我们日常项目中，大多数情况都会存在非主键索引，所以我们最好还是使用自增主键作为主键，这样其他叶子结点的存储会比较节省空间。")]),t._v(" "),n("h3",{attrs:{id:"关于重建索引"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#关于重建索引"}},[t._v("#")]),t._v(" 关于重建索引")]),t._v(" "),n("p",[t._v("重建索引的作用：索引可能因为删除，或者页分裂等原因，导致数据页有空洞，重建索引的过程会创建一个新的索引，把数据按顺序插入，这样页面的利用率最高，也就是索引更紧凑、更省空间。")]),t._v(" "),n("p",[t._v("留下问题：以下2个重建索引的语句是否正确？")]),t._v(" "),n("blockquote",[n("p",[t._v("重建二级索引")])]),t._v(" "),n("div",{staticClass:"language-SQL extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sql"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("alter")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("table")]),t._v(" T "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("drop")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("index")]),t._v(" k"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("alter")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("table")]),t._v(" T "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("add")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("index")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("k"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),n("blockquote",[n("p",[t._v("重建主键索引")])]),t._v(" "),n("div",{staticClass:"language-SQL extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sql"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("alter")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("table")]),t._v(" T "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("drop")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("primary")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("key")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("alter")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("table")]),t._v(" T "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("add")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("primary")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("key")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("id"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),n("p",[t._v("答案： 重建索引k的做法是合理的，可以达到省空间的目的。但是，重建主键的过程不合理。不论是删除主键还是创建主键，都会将整个表重建。所以连着执行这两个语句的话，第一个语句就白做了。这两个语句，你可以用这个语句代替 ： alter table T engine=InnoDB。在专栏的第12篇文章《为什么表数据删掉一半，表文件大小不变？》中，我会和你分析这条语句的执行流程。")]),t._v(" "),n("h3",{attrs:{id:"索引查询流程介绍"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#索引查询流程介绍"}},[t._v("#")]),t._v(" 索引查询流程介绍")]),t._v(" "),n("blockquote",[n("p",[t._v("表结构")])]),t._v(" "),n("div",{staticClass:"language-SQL extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sql"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("create")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("table")]),t._v(" T "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\nID "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("primary")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("key")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\nk "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("NOT")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("NULL")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("DEFAULT")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" \ns "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("varchar")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("16")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("NOT")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("NULL")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("DEFAULT")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("''")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("index")]),t._v(" k"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("k"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("engine")]),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("InnoDB")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),n("blockquote",[n("p",[t._v("插入数据语句")])]),t._v(" "),n("div",{staticClass:"language-SQL extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sql"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("insert")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("into")]),t._v(" T "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("values")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("100")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'aa'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("200")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'bb'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("300")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'cc'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("500")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("5")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'ee'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("600")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("6")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'ff'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("700")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("7")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'gg'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),n("blockquote",[n("p",[t._v("索引结构示意图\n"),n("img",{attrs:{src:a(391),alt:"索引结构示意图"}})])]),t._v(" "),n("blockquote",[n("p",[t._v("查询语句")])]),t._v(" "),n("div",{staticClass:"language-SQL extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sql"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("select")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" T "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("where")]),t._v(" k "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("between")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("and")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("5")]),t._v("\n")])])]),n("blockquote",[n("p",[t._v("查询流程")])]),t._v(" "),n("ol",[n("li",[t._v("利用二级索引 k，查询索引树，找到 k = 3 的索引，获取到叶子节点上的主键值 300。（查询索引树 k 一次）")]),t._v(" "),n("li",[t._v("利用主键值 300 回表查询主键索引树，查询到 id = 300 的行数据。（回表一次）")]),t._v(" "),n("li",[t._v("k 索引树继续查询下一个数据，找到 k = 5，满足条件，获取到叶子结点上的主键值 500。（查询索引树 k 一次）")]),t._v(" "),n("li",[t._v("利用主键值 500 回表查询主键索引树，查询到 id = 500 的行数据。（回表一次）")]),t._v(" "),n("li",[t._v("k 索引树继续查询下一个数据，找到 k = 6，不满足条件，查询结束。（查询索引树 k 一次）")])]),t._v(" "),n("p",[t._v("以上总共查询 k 索引树 3 次（MySQL 只拿到了 2 行数据，索引它认为扫描行数只是 2），回表 2 次。")]),t._v(" "),n("h3",{attrs:{id:"覆盖索引"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#覆盖索引"}},[t._v("#")]),t._v(" 覆盖索引")]),t._v(" "),n("p",[t._v("索引覆盖指的是查询语句中查询的字段在索引树上都存在，所以不需要回表都能够获取到所有的字段值，因为不需要回表，所以查询效率更高。"),n("a",{attrs:{href:"https://kai-keng.github.io/java-learning/mysql/mysql-index.html#%E7%B4%A2%E5%BC%95%E8%A6%86%E7%9B%96",target:"_blank",rel:"noopener noreferrer"}},[t._v("覆盖索引详情见"),n("OutboundLink")],1)]),t._v(" "),n("h3",{attrs:{id:"最左前缀原则"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#最左前缀原则"}},[t._v("#")]),t._v(" 最左前缀原则")]),t._v(" "),n("p",[t._v("MySQL 在查询的时候遵循最左前缀原则，最左前缀有两个概念：")]),t._v(" "),n("ol",[n("li",[t._v("即当我们建立多字段联合索引的时候，当我们最左侧的索引字段存在于查询语句中时，我们的索引即可生效，比如 (a, b) 索引，查询语句 "),n("code",[t._v("Selet * FROM T WHERE a > 0")]),t._v("。但是当查询语句为 "),n("code",[t._v("Selet * FROM T WHERE b > 0")]),t._v(" 时，索引不生效。")]),t._v(" "),n("li",[t._v("当我们使用 "),n("code",[t._v("LIKE")]),t._v(" 进行模糊查询的时候，若查询内容左侧字符未使用匹配字符而是使用具体的查询内容的话，即可使用索引。比如我们的查询语句为 "),n("code",[t._v("SELECT * FROM T WHERE k LIKE '张%'")]),t._v("，此时可以使用索引，但是若改为 "),n("code",[t._v("SELECT * FROM T WHERE k LIKE '%张%'")]),t._v(" 时不可使用索引。")])]),t._v(" "),n("p",[t._v("依照最左前缀原则，我们创建索引的"),n("strong",[t._v("第一原则是，如果通过调整顺序，可以少维护一个索引，那么这个顺序往往就是需要优先考虑采用的")]),t._v("。若必须要维护两个索引的话，尽量将占用存储空间较小的字段单独建立索引，节省空间，索引占用的空间越小，一个数据页存储的索引越多，所需 IO 操作越少，查询效率越快。")]),t._v(" "),n("p",[n("a",{attrs:{href:"https://kai-keng.github.io/java-learning/mysql/mysql-index.html#%E4%BB%80%E4%B9%88%E6%98%AF%E6%9C%80%E5%B7%A6%E5%89%8D%E7%BC%80%E5%8E%9F%E5%88%99%EF%BC%9F%E4%BB%80%E4%B9%88%E6%98%AF%E6%9C%80%E5%B7%A6%E5%8C%B9%E9%85%8D%E5%8E%9F%E5%88%99",target:"_blank",rel:"noopener noreferrer"}},[t._v("最左前缀详情见"),n("OutboundLink")],1)]),t._v(" "),n("h3",{attrs:{id:"索引下推"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#索引下推"}},[t._v("#")]),t._v(" 索引下推")]),t._v(" "),n("p",[t._v("假设表结构如下：")]),t._v(" "),n("div",{staticClass:"language-SQL extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sql"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("CREATE")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("TABLE")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v("tuser"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v("id"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("11")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("NOT")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("NULL")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v("id_card"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("varchar")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("32")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("DEFAULT")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("NULL")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v("name"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("varchar")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("32")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("DEFAULT")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("NULL")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v("age"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("11")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("DEFAULT")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("NULL")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v("ismale"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("tinyint")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("DEFAULT")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("NULL")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("PRIMARY")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("KEY")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v("id"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("KEY")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v("id_card"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v("id_card"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("KEY")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v("name_age"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v("name"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v("age"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("ENGINE")]),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("InnoDB")]),t._v("\n")])])]),n("p",[t._v("当我们查询：")]),t._v(" "),n("div",{staticClass:"language-SQL extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sql"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("select")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" tuser "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("where")]),t._v(" name "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("like")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'张%'")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("and")]),t._v(" age"),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("10")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("and")]),t._v(" ismale"),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),n("p",[t._v("依照最左前缀原则，可以匹配上 name_age 索引。")]),t._v(" "),n("ul",[n("li",[n("p",[t._v("在 MySQL 5.6 之前，索引会忽略 age 索引，只是查询索引上的 name 是否匹配，然后再一条一条数据回表。\n"),n("img",{attrs:{src:a(392),alt:"回表查询"}})])]),t._v(" "),n("li",[n("p",[t._v("在 MySQL 5.6 之后，索引会同时使用 name 与 age 索引，在二级索引上，当判断 name 索引符合条件但是 age 索引不满足条件的时候，并不会去进行回表查询。\n"),n("img",{attrs:{src:a(393),alt:"不回表查询"}})])])]),t._v(" "),n("h2",{attrs:{id:"_5-全局锁与表锁"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_5-全局锁与表锁"}},[t._v("#")]),t._v(" 5. 全局锁与表锁")]),t._v(" "),n("h3",{attrs:{id:"全局锁"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#全局锁"}},[t._v("#")]),t._v(" 全局锁")]),t._v(" "),n("p",[t._v("全局锁是对整个数据库实例加锁，一般用于逻辑备份数据库。MySQL 提供的加全局锁的命令是 "),n("code",[t._v("Flush tables with read lock (FTWRL)")]),t._v("。")]),t._v(" "),n("p",[t._v("全局锁处理过程风险较大，因为当全局锁加上以后，如下语句会被阻塞："),n("strong",[t._v("数据更新语句（数据的增删改）、数据定义语句（包括建表、修改表结构等）和更新类事务的提交语句")]),t._v("。")]),t._v(" "),n("p",[t._v("导致的主要问题如下：")]),t._v(" "),n("ul",[n("li",[t._v("当在主库加全局锁时，会导致加锁期间所有的写操作都不能执行，业务无法继续。")]),t._v(" "),n("li",[t._v("当在从库加全局锁时，会导致主库同步过来的 binlog 不能被执行，主从数据延迟。")])]),t._v(" "),n("p",[t._v("所以在有事务的存储引擎上，我们一般不会使用全局锁的方式来逻辑备份我们的数据，而是使用可重复读事务的方式来创建一个数据库的视图，在视图上备份我们的数据。这样我们库的读写操作不会停止，不影响业务。")]),t._v(" "),n("blockquote",[n("p",[t._v("为何不使用 "),n("code",[t._v("set global readonly=true")]),t._v(" 的方式使库变为只读，从而备份？")])]),t._v(" "),n("ol",[n("li",[t._v("有些系统中使用数据库是否只读来判断该库为主库还是从库，如果全局修改的话，可能会影响判断。")]),t._v(" "),n("li",[t._v("当我们的客户端备份连接突然异常中断的时候，如果使用 FTWRL 命令，中断以后会自动解锁，让业务恢复正常，但是使用设置只读的方式库依旧会保持只读，继续影响业务。")])]),t._v(" "),n("h3",{attrs:{id:"表级锁"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#表级锁"}},[t._v("#")]),t._v(" 表级锁")]),t._v(" "),n("p",[t._v("表级锁分为两种："),n("strong",[t._v("表锁")]),t._v("与"),n("strong",[t._v("元数据锁（MDL）")]),t._v("。表锁可以使用 "),n("code",[t._v("lock tables … read/write")]),t._v(" 语法来开启，元数据锁不需要主动开启，当我们在操作 MySQL 数据库时会自动开启。")]),t._v(" "),n("blockquote",[n("p",[t._v("表锁")])]),t._v(" "),n("p",[t._v("表锁使用的限制也比较大，比如当我们加表"),n("strong",[t._v("读锁")]),t._v("的时候，其他线程不能对该表进行"),n("strong",[t._v("写操作")]),t._v("，加锁线程本身也只能对表做"),n("strong",[t._v("读操作")]),t._v("而不能进行"),n("strong",[t._v("写操作")]),t._v("，同时也不能访问其他表。当我们给表加"),n("strong",[t._v("读写锁")]),t._v("的时候，当前线程可以对表进行"),n("strong",[t._v("读写操作")]),t._v("，但是其他线程"),n("strong",[t._v("读写操作")]),t._v("都不能做。")]),t._v(" "),n("p",[t._v("在细粒度更低的行锁出现之前，表锁是主要的处理并发的方式。")]),t._v(" "),n("blockquote",[n("p",[t._v("元数据锁（MDL）\n元数据锁是在 MySQL 5.5 版本中引入的，在我们访问表的时候会自动加上锁，用于避免出现当我们在读写表的时候，其他线程对表进行了结构变更，导致数据与表结构不一致的问题（比如删除列）。")])]),t._v(" "),n("p",[t._v("当我们对一张表进行增删改查的时候，MDL 会自动添加上 MDL 读锁，当我们修改表结构的时候会添加上 MDL 写锁。")]),t._v(" "),n("p",[t._v("MDL 读锁：不互斥，加上读锁以后其他线程也可执行增删改查操作，但不可进行表结构修改操作。")]),t._v(" "),n("p",[t._v("MDL 写锁：互斥，加上写锁以后其他线程不能操作表（所以在生产环境添加字段时需要谨慎操作）。")]),t._v(" "),n("blockquote",[n("p",[t._v("生产加字段、修改字段和添加索引操作需要全表扫描，若生产上的大表修改会阻塞很长时间，需慎重。小表也需要慎重。")])])])}),[],!1,null,null,null);s.default=e.exports}}]);