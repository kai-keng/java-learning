module.exports = {
  title: 'Spring',
  description: 'Just record my learning process',
  base: '/docs-spring/',
  themeConfig: {
    sidebar: [
      {
        title: 'Spring Boot',
        collapsable: true,
        children: [
          './spring-boot/exception'
        ]
      },
      {
        title: 'Spring Cloud',
        collapsable: true,
        children: [
          'waiting'
        ]
      },
    ]
  }
}