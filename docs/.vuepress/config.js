module.exports = {
  title: 'Java',
  description: 'Just record my learning process',
  base: '/java-learning/',
  themeConfig: {
    nav: [
      { text: '主站', link: 'https://kai-keng.github.io/', target:'', rel:'' },
    ],
    sidebar: [
      {
        title: 'Spring Boot',
        collapsable: true,
        path: '/spring-boot/',
        children: [
          './spring-boot/0-idea-configuration',
          './spring-boot/1-exception',
          './spring-boot/2-configuration',
          './spring-boot/3-mybatis-druid',
          './spring-boot/4-spring-multi-datasource',
          './spring-boot/5-operation-log-aop',
          './spring-boot/6-redis-cache',
          './spring-boot/10-hibernate-validator',
          './spring-boot/11-mybatis-auto',
          './spring-boot/12-common-result',
          './spring-boot/13-knife4j',
        ]
      },
      {
        title: 'Spring Cloud',
        collapsable: true,
        path: '/spring-cloud/',
      },
      {
        title: 'MySQL',
        collapsable: true,
        path: '/mysql/',
        children: [
          './mysql/mysql-index',
          './mysql/datatype',
          './mysql/transaction',
          './mysql/explain',
        ]
      },
      {
        title: '集合框架',
        collapsable: true,
        path: '/collection/',
        children: [
          './collection/overview',
          './collection/list',
          './collection/set',
          './collection/map',
          './collection/queue',
          './collection/others',
        ]
      },
      {
        title: 'JVM',
        collapsable: true,
        path: '/jvm/',
        children: [
          './jvm/runtime-data-area',
          './jvm/run-java',
          './jvm/class-loader',
          './jvm/gc',
        ]
      },
      {
        title: '多线程',
        collapsable: true,
        path: '/multi-thread/',
        children: [
          './multi-thread/basis',
          './multi-thread/principle',
          './multi-thread/thread-util',
        ]
      },
      {
        title: '设计模式',
        collapsable: true,
        path: '/design-pattern/',
        children: [
          './design-pattern/singleton',
          './design-pattern/templateMethod',
          './design-pattern/state',
          './design-pattern/builder',
          './design-pattern/prototype',
          './design-pattern/flyweight',
          './design-pattern/proxy',
        ]
      },
      {
        title: '网络',
        collapsable: true,
        path: '/internet/',
      },
      {
        title: '相关资料',
        collapsable: true,
        path: '/materials/',
      }
    ]
  }
}