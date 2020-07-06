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
          './spring-boot/1-exception',
          './spring-boot/2-configuration',
          './spring-boot/3-mybatis-druid',
          './spring-boot/4-spring-multi-datasource',
          './spring-boot/5-operation-log-aop'
        ]
      },
      {
        title: 'Spring Cloud',
        collapsable: true,
        path: '/spring-cloud/',
        children: [
          'waiting'
        ]
      },
      {
        title: '设计模式',
        collapsable: true,
        path: '/design-pattern/',
        children: [
          './design-pattern/singleton',
          './design-pattern/templateMethod',
          './design-pattern/state'
        ]
      },
      {
        title: '相关资料',
        collapsable: true,
        path: '/materials/',
      }
    ]
  }
}