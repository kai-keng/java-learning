(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{389:function(_,v,e){_.exports=e.p+"assets/img/2-1.2e5bff49.png"},390:function(_,v,e){_.exports=e.p+"assets/img/2-2.d9c31380.png"},494:function(_,v,e){"use strict";e.r(v);var o=e(42),r=Object(o.a)({},(function(){var _=this,v=_.$createElement,o=_._self._c||v;return o("ContentSlotsDistributor",{attrs:{"slot-key":_.$parent.slotKey}},[o("h1",{attrs:{id:"mysql-实战45讲学习笔记"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#mysql-实战45讲学习笔记"}},[_._v("#")]),_._v(" MySQL 实战45讲学习笔记")]),_._v(" "),o("h2",{attrs:{id:"_1-mysql-架构"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#_1-mysql-架构"}},[_._v("#")]),_._v(" 1. MySQL 架构")]),_._v(" "),o("p",[_._v("MySQL 分为两部分：Server 层与存储引擎层。 Server 中含有：连接器、分析器、优化器与执行器，存储引擎层即使用于存储的引擎，其中包含有用于操作数据的接口。")]),_._v(" "),o("ul",[o("li",[o("p",[_._v("连接器：用于连接 MySQL，会校验账号与密码。")])]),_._v(" "),o("li",[o("p",[_._v("分析器：用于做词法分析和语法分析，判断输入的 MySQL 语句是否正确。")])]),_._v(" "),o("li",[o("p",[_._v("优化器：用于优化输入的 SQL 语句，选择优化器认为的最优的执行顺序，查询索引等。")])]),_._v(" "),o("li",[o("p",[_._v("执行器：即真正的去调用存储引擎来查询所需要的数据。")])])]),_._v(" "),o("p",[_._v("查询缓存：在 MySQL 8.0以前带有查询缓存，即以 key、value 的形式存储我们的查询语句与查询结果。但是不被推荐使用，因为只需要更新表内的任意一条数据，都会导致整张表的缓存删除，导致缓存的命中率低下，只适用于极少更新的表中，故不被推荐使用，并且在 MySQL 8.0以后删除了查询缓存的功能。")]),_._v(" "),o("h2",{attrs:{id:"_2-redolog-与-binlog"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#_2-redolog-与-binlog"}},[_._v("#")]),_._v(" 2. redolog 与 binlog")]),_._v(" "),o("h3",{attrs:{id:"binlog"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#binlog"}},[_._v("#")]),_._v(" binlog")]),_._v(" "),o("ul",[o("li",[o("strong",[_._v("介绍")])])]),_._v(" "),o("p",[_._v("binlog 是 MySQL 数据库 Server 层实现的修改日志，记录数据库中原始逻辑操作。")]),_._v(" "),o("ul",[o("li",[o("strong",[_._v("特点")])])]),_._v(" "),o("ol",[o("li",[_._v("MySQL 中所有的引擎都有 binlog，是 MySQL 中的Server层实现的")]),_._v(" "),o("li",[_._v("binlog 没有定长空间，是追加写入的方式，当写满了的时候可以找下一个空间接着写")]),_._v(" "),o("li",[_._v("binlog 是记录逻辑原始逻辑操作，比如 ID = 2 的行修改 c = c + 1")])]),_._v(" "),o("h3",{attrs:{id:"redolog"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#redolog"}},[_._v("#")]),_._v(" redolog")]),_._v(" "),o("ul",[o("li",[o("p",[o("strong",[_._v("介绍")]),_._v("\n在执行器调用存储引擎之后，存储引擎出于效率考虑，并不会立即将数据存入磁盘中，而是先将操作写入 redolog 中，在 redolog 中记录下自己的操作，然后在适当的时间（比如系统空闲时间）将数据写入磁盘。")])]),_._v(" "),o("li",[o("p",[o("strong",[_._v("特点")])])])]),_._v(" "),o("ol",[o("li",[_._v("redolog 只有 InnoDB 才有，是 InnoDB 自己实现的")]),_._v(" "),o("li",[_._v("redolog 是有固定的存储空间的，它有两个指针，分别是 write pos 与 check point， write pos 指针表示当前日志写入到的位置，当指针到末尾以后会回到头部重新开始写入。\n而 check point 则表示清除了 redolog 的位置，将 redolog 的内容写入到磁盘中，check point 与 write pos 之间的位置则表示空闲待写入的空间。当 write pos 追上 check point 的时候会停止写入 redolog，\n先将记录的 redolog 存入到磁盘中，待有空闲空间以后再继续写入 redolog")]),_._v(" "),o("li",[_._v("redolog 记录的是物理操作，比如在某个数据页上，修改了什么数据，更为具体。")]),_._v(" "),o("li",[_._v("因为在写入数据进入物理磁盘之前，会先写入 redolog，所以在我们数据库崩溃异常重启的时候，只需要依照我们的 redolog 上的记录来恢复尚未存入到磁盘中的数据，就可以恢复原库数据，这个行为称为 "),o("strong",[_._v("crash-safe")]),_._v("。")])]),_._v(" "),o("h3",{attrs:{id:"关于-crash-safe-能力"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#关于-crash-safe-能力"}},[_._v("#")]),_._v(" 关于 crash-safe 能力")]),_._v(" "),o("p",[_._v("看完讲解后我提出一个问题，为什么 binlog 没有 crash-safe 能力？它也记录了事务的操作，我们按照 binlog 的记录直接恢复未存储的数据不就好了吗？")]),_._v(" "),o("p",[_._v("查阅一些资料无果之后又仔细多次阅读 MySQL 实战45讲，发现也并没有描述为什么 binlog 不带有 crash-safe 能力，所以在往后继续看两阶段提交的时候，需要在脑中有一个思想，就是 binlog 不带有 carsh-safe\n能力，不然你在看两阶段提交的时候会很纳闷，不能理解为什么。")]),_._v(" "),o("h3",{attrs:{id:"两阶段提交"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#两阶段提交"}},[_._v("#")]),_._v(" 两阶段提交")]),_._v(" "),o("p",[_._v("假设我们要执行一个修改语句："),o("code",[_._v("UPDATE T SET c = c + 1 WHERE ID = 2")])]),_._v(" "),o("p",[_._v("该语句执行的流程图如下：\n"),o("img",{attrs:{src:e(389),alt:"执行流程图"}})]),_._v(" "),o("p",[_._v("图中可以看到，redolog 的写入是分为两阶段的，分别是开始的 prepare 阶段与事务提交后的 commit 阶段。")]),_._v(" "),o("p",[_._v("为什么会需要有这两个阶段呢？")]),_._v(" "),o("p",[_._v("我们可以使用反证法假设没有两阶段提交，单纯的只是分别写入这两个日志：")]),_._v(" "),o("ol",[o("li",[_._v("先写入 redolog 后写入 binlog")])]),_._v(" "),o("p",[_._v("假设在写入了 redolog 的时候，数据库崩溃了，我们需要使用 redolog 恢复原库，这个时候 redolog 记录 c 的值已经被修改成了 1，我们使用 redolog 的 crash-safe 能力恢复以后库的值即为\n1，这个时候 1 即为原库值。但是这个时候 binlog 中还没有写入 c = 1 的操作，如果我们之后使用 binlog 来恢复的话，值就不会等于 1，就与原库值不一致。")]),_._v(" "),o("ol",{attrs:{start:"2"}},[o("li",[_._v("先写入 binlog 后写入 redolog")])]),_._v(" "),o("p",[_._v("假设在写入 binlog 的时候数据库崩溃了，这个时候 binlog 已经记录了 c = 1，但是我们的 redolog 中没有记录下来，使用 crash-safe 恢复库以后，原库值 c = 0，两边又不一致了。")]),_._v(" "),o("p",[_._v("而使用两阶段提交的话，我们就能知道当前日志是否同时写入了 redolog 与 binlog 中，能确保两边恢复的数据都一致了。")]),_._v(" "),o("h2",{attrs:{id:"_3-事务隔离"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#_3-事务隔离"}},[_._v("#")]),_._v(" 3. 事务隔离")]),_._v(" "),o("p",[_._v("事务隔离是数据库的一个重要特性，能够避免在并行操作的时候读取到我们意料之外的值情况。同时也能够确保在我们进行一系列操作的时候，当某一个操作失败的时候能够将之前的操作也回滚掉，不在数据库中生效。")]),_._v(" "),o("p",[_._v("数据库操作主要分为"),o("strong",[_._v("读操作")]),_._v("和"),o("strong",[_._v("写操作")]),_._v("。写操作的控制主要是依靠数据库的锁来控制并发下的意外情况，而读操作则依据设置的事务隔离级别不同，会有不同的处理。")]),_._v(" "),o("p",[_._v("事务隔离从读的方面来讲，主要目的是为了解决如下几个问题：")]),_._v(" "),o("p",[_._v("假设有如下数据：\n"),o("code",[_._v("insert into T(c) values(1);")])]),_._v(" "),o("p",[_._v("假设有事务 A、B，事务 A 优先于事务 B 开启。")]),_._v(" "),o("ul",[o("li",[_._v("脏读：读取到其他事务尚未提交的内容。比如在事务 A 中，我修改了 c 的值为2，事务 A 尚未提交，但是事务 B 已经读取到了这个尚未提交的新值。")]),_._v(" "),o("li",[_._v("不可重复读：在另一个事务开启期间，重复读取某一行的值，但是读取到的值前后不一致。比如事务 A 第一次读取 c 的值为1，然后事务 B 修改了 c 的值为2并提交，这个时候事务 A 再次读取 c 的值为2，前后读取到的 c 值不一致，此为不可重复读。")]),_._v(" "),o("li",[_._v("幻读：在事务开启期间重复读取一张表中的数据总行数，前后读取到的行数不一致。比如事务 A 第一次读取到的表 T 的行数为1，然后事务 B 在表 T 中新增了一行并提交，这个时候事务 A 再次读取表行数为2，前后不一致。")])]),_._v(" "),o("blockquote",[o("p",[_._v("幻读和不可重复读的主要区别点在与，不可重复读是指某一行数据，前后重复读取的值不相同，而幻读是读取一张表中的行数，前后不一致。不可重复读针对于行的修改，幻读针对的是对表中行数据的新增与删除操作。")])]),_._v(" "),o("p",[_._v("介绍完事务并发读取的几个问题后，我们再谈下不同的事务隔离级别：")]),_._v(" "),o("ul",[o("li",[_._v("读未提交：一个事务可以读取到另外一个事务尚未提交的修改。无法解决以上任一问题。")]),_._v(" "),o("li",[_._v("读已提交：一个事务只能读取到其他事务已经提交的数据，尚未提交的数据无法读取到。能解决脏读问题。")]),_._v(" "),o("li",[_._v("可重复读：一个事务在事务期间读取某一行的值，前后都保持一致，不会出现前后读取到的数据不一致的问题。能解决脏读，不可重复读。")]),_._v(" "),o("li",[_._v("串行化：所有的事务都是串行执行，没有并发操作，效率低下，但是能解决以上所有问题。")])]),_._v(" "),o("blockquote",[o("p",[_._v("ORACLE 默认为读已提交，MySQL 默认为可重复读。")])]),_._v(" "),o("h3",{attrs:{id:"事务隔离实现原理"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#事务隔离实现原理"}},[_._v("#")]),_._v(" 事务隔离实现原理")]),_._v(" "),o("p",[_._v("事务隔离实现的依靠的是"),o("strong",[_._v("回滚日志")]),_._v("与 "),o("strong",[_._v("Read-View")]),_._v("。")]),_._v(" "),o("p",[_._v("回滚日志记录下了我们的数据值可以从当前值修改回原值的内容，而 Read-View 则是我们数据库中表的快照。")]),_._v(" "),o("p",[_._v("比如当我们的事务隔离级别为"),o("strong",[_._v("可重复读")]),_._v("的时候，我们每开启一个事务都会生成一个 Read-View 的快照，然后在事务执行期间，我们读取的都是这个快照而不是实际的数据库，\n这样就保证了我们的事务期间读取到的值都是一致的，不会出现不可重复读的问题。")]),_._v(" "),o("p",[_._v("而"),o("strong",[_._v("读已提交")]),_._v("则是在每次执行 SQL 语句的时候都会生成一个 Read-View，"),o("strong",[_._v("读未提交")]),_._v("则不会生成 Read-View，所有的操作都是直接作用在表上的。")]),_._v(" "),o("p",[_._v("当我们想要回滚数据的时候，我们依靠"),o("strong",[_._v("回滚日志")]),_._v("与 "),o("strong",[_._v("Read-View")]),_._v("就可以回滚我们的事务。假设我们的事务隔离级别为"),o("strong",[_._v("读已提交")]),_._v("，将表 T 中的 c 值依次修改为 2、3、4，那么这个时候事务则会记录如下的"),o("strong",[_._v("回滚日志")]),_._v("与 "),o("strong",[_._v("Read-View")]),_._v("。")]),_._v(" "),o("p",[o("img",{attrs:{src:e(390),alt:"回滚日志与 Read-View"}})]),_._v(" "),o("p",[_._v("当我们想要回滚事务的时候，需要依次从 Read-View C - B - A 按照回滚日志来回滚。")]),_._v(" "),o("p",[_._v("那么我们的回滚日志总不可能一直保存着吧？什么时候删除呢？")]),_._v(" "),o("p",[_._v("是否删除回滚日志取决于我们是否有比回滚日志更早的 Read-View，当没有更早的 Read-View 的时候就会清理掉回滚日志了。")]),_._v(" "),o("blockquote",[o("p",[_._v("至于何时删除 Read-View，MySQL 实战中没讲，我没也查到，猜测事务结束的时候就会清理掉 Read-View 了，但是为什么不在事务结束的时候直接清除掉回滚日志呢？事务结束了不就不需要回滚日志了吗？")])]),_._v(" "),o("h3",{attrs:{id:"解决长事务"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#解决长事务"}},[_._v("#")]),_._v(" 解决长事务")]),_._v(" "),o("p",[_._v("长事务会一直累积回滚日志，增加库的大小，需要尽量避免长事务的出现。")]),_._v(" "),o("p",[_._v("如何避免长事务呢？ 个人认为需要做到以下几点：")]),_._v(" "),o("ol",[o("li",[_._v("统一项目后端框架，确保我们的框架不会自动运行 set autocommit=0")]),_._v(" "),o("li",[_._v("规范开发行为，如无特殊需求禁止使用长事务")]),_._v(" "),o("li",[_._v("必要的话可以要求开发全部手动控制整个事务的生命周期，从开启事务到提交、回滚事务都手动编写，不使用框架的自动事务提交")]),_._v(" "),o("li",[_._v("CodeReview，检查代码，避免漏提交事务，写错等")]),_._v(" "),o("li",[_._v("定期运行 "),o("code",[_._v("select * from information_schema.innodb_trx where TIME_TO_SEC(timediff(now()，trx_started))>60")]),_._v(" 检查数据库中是否存在长事务")])])])}),[],!1,null,null,null);v.default=r.exports}}]);