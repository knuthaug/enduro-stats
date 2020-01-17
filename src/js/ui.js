function create() {

  function isEvent(k) {
    return k.startsWith("on")
  }

  function eventName(k) {
    return k.substr(2).toLowerCase()
  }
  function isString(s) {
    return typeof s === "string"
  }

  function attrs(el, props) {
    for (let [key, val] of Object.entries(props)) {
      if (isEvent(key)) {
        el.addEventListener(eventName(key), val)
      } else if (key === "class") {
        const classes = Array.isArray(val) ? val : [val]
        el.classList.add(...classes)
      } else {
        el.setAttribute(key, val)
      }
    }
    return el
  }

  return new Proxy(
    {},
    {
      get(_, tag) {
        return function createElement(props = {}, children = []) {
          if (Array.isArray(props)) {
            children = props
            props = {}
          }
          if (isString(props)) {
            children = [props]
            props = {}
          }
          if (!Array.isArray(children)) {
            children = [children]
          }
          const el = attrs(document.createElement(tag), props)
          children.forEach(function(i) {
            if (isString(i)) {
              el.textContent = i
            } else {
              el.appendChild(i)
            }
          })
          return el
        }
      }
    }
  )
}

module.exports = {
  create
}
