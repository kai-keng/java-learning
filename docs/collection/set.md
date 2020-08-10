# Set
Set 中存储的元素是无序的、不可重复的。主要的实现有： **HashSet**，**LinkedHashSet**，**TreeSet**，**CopyOnWriteArraySet**。

Set 的无序指的并不是完全无序，而是指存储的数据在底层数组中并非按照数组索引的顺序添加，是根据数据的哈希值决定的。

Set 的不可重复性是依靠 HashMap 的 key 不可重复来做到的，且各种 Set 的实现都依托于 Map，所以 Set 不详细介绍，特性可以参照各自对应的 Map。

## Set与Map映射
HashSet -> HashMap

LinkedHashSet -> LinkedHashMap

TreeSet -> TreeMap

## CopyOnWriteArraySet
CopyOnWriteArraySet 与其他 Set 不同，内部是使用 CopyOnWriteArrayList 来实现的，通过在添加的时候判断元素是否存在来避免重复。

具体的介绍请参照 CopyOnWriteArrayList。