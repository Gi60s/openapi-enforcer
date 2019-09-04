module.exports = {
  page: {
    layout: 'default',
    toc: true
  },
  site: {
    editSourceUrl: 'https://github.com/byu-oit/openapi-enforcer/tree/master/docs-src',
    title: 'OpenAPI Enforcer',
    description: 'A library that makes it easy to validate and use your OpenAPI documents.',
    url: 'https://byu-oit.github.io/openapi-enforcer',
  },
  template: {
    path: 'default',
    cssFiles: [
      '/css/main.css'
    ],
    cssVars: {
      brandColor: '#2a7ae2',
      brandColorLight: '#85EA2D',
      brandColorDark: '#1D3949'
    },
    favicon: '/favicon.png',
    finePrint: '',
    footerLinks: [
      { title: 'Github', href: 'https://github.com/byu-oit/openapi-enforcer' },
      { title: 'NPM', href: 'https://www.npmjs.com/package/openapi-enforcer' }
    ]
  }
}
