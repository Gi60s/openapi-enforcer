;(function () {
  const laptopWidth = 800;
  const palmWidth = 600;

  const footer = document.querySelector('footer.site-footer')
  const header = document.querySelector('header.site-header')
  const screen = document.querySelector('.page-content > .wrapper > .nav-screen')
  const wrapper = document.querySelector('.page-content > .wrapper')

  screen
    .addEventListener('click', function (e) {
      if (wrapper.hasAttribute('show-nav')) {
        wrapper.removeAttribute('show-nav')
      }
    })

  document.querySelector('.menu-icon')
    .addEventListener('click', function (e) {
      e.preventDefault()
      if (wrapper.hasAttribute('show-nav')) {
        wrapper.removeAttribute('show-nav')
      } else {
        wrapper.setAttribute('show-nav', '')
      }
    })

  const topBarHeight = 92
  let lastScroll = 0
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleScroll)

  function handleScroll (e) {
    const winTop = window.scrollY

    const scrollNav = winTop >= topBarHeight && window.innerWidth > laptopWidth
    toggleClass(wrapper, 'scroll-nav', scrollNav)
    toggleClass(footer, 'scroll-nav', scrollNav)

    // if there is enough scroll change in mobile then show or hide to nav bar
    if (window.innerWidth <= laptopWidth && Math.abs(lastScroll - winTop) > 5) {
      toggleClass(header, 'hide-header', winTop > lastScroll && winTop > topBarHeight && !wrapper.hasAttribute('show-nav'))
    }

    lastScroll = winTop
  }

  function toggleClass(el, className, has) {
    const classes = el.className.split(/ +/)
    className.split(/ +/).forEach(function (className) {
      const index = classes.indexOf(className)
      if (index === -1 && has !== false) {
        classes.push(className)
      } else if (index !== -1 && has !== true) {
        classes.splice(index, 1)
      }
    })
    el.className = classes.join(' ')
  }
})()
