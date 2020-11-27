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
        sidebarDepth: 2,
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
          './spring-boot/14-transactional',
          './spring-boot/15-mybatis-plus',
          './spring-boot/16-dubbo',
        ]
      },
      {
        title: 'Spring Cloud',
        collapsable: true,
        sidebarDepth: 2,
        path: '/spring-cloud/',
      },
      {
        title: 'Spring Security',
        collapsable: true,
        sidebarDepth: 2,
        path: '/spring-security/',
        children: [
          './spring-security/1-login-start',
          './spring-security/2-custom-login',
          './spring-security/3-validate-code',
          './spring-security/4-session',
          './spring-security/5-permission',
        ]
      },
      {
        title: 'MySQL',
        collapsable: true,
        sidebarDepth: 2,
        path: '/mysql/',
        children: [
          './mysql/mysql-index',
          './mysql/datatype',
          './mysql/transaction',
          './mysql/explain',
          './mysql/sql-optimization',
        ]
      },
      {
        title: '集合框架',
        collapsable: true,
        sidebarDepth: 2,
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
        sidebarDepth: 2,
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
        sidebarDepth: 2,
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
        sidebarDepth: 2,
        path: '/design-pattern/',
        children: [
          './design-pattern/singleton',
          './design-pattern/templateMethod',
          './design-pattern/state',
          './design-pattern/builder',
          './design-pattern/prototype',
          './design-pattern/flyweight',
          './design-pattern/proxy',
          './design-pattern/observer',
          './design-pattern/factory',
          './design-pattern/strategy',
          './design-pattern/adapter',
          './design-pattern/command',
          './design-pattern/decorator',
          './design-pattern/facade',
          './design-pattern/bridge',
          './design-pattern/responsibility',
        ]
      },
      {
        title: '网络',
        collapsable: true,
        sidebarDepth: 2,
        path: '/internet/',
      },
      {
        title: '其他',
        collapsable: true,
        sidebarDepth: 2,
        path: '/other/',
        children: [
          './other/java8',
          './other/distributed-lock',
          './other/excel',
          './other/package',
        ]
      },
      // {
      //   title: '阿里Java开发手册',
      //   collapsable: true,
      //   sidebarDepth: 2,
      //   path: '/ali/',
      //   children: [
      //     './ali/programming-protocol',
      //   ]
      // },
      {
        title: '相关资料',
        collapsable: true,
        path: '/materials/',
      }
    ]
  }
}