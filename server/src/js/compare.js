const feather = require('feather-icons')

document.addEventListener('DOMContentLoaded', function (event) {
  setupCompareSearch()
})

function setupCompareSearch () {
  var form = document.getElementById('compare-search-form')
  var search = document.getElementById('compare-search-field')

  form.addEventListener('submit', function (event) {
    const search = document.getElementById('compare-search-field')
    if (search.getAttribute('data-uid')) {
      search.setAttribute('value', search.getAttribute('data-uid'))
    }
  })

  search.addEventListener('keyup', function (event) {
    if (event.code) {
      compareSearchHint(event)
    }
  })

  search.addEventListener('change', function (e) {
    let uid
    let name

    let inputValue = search.value
    let options = document.getElementById('compare-search-list').children
    let i = options.length

    while (i--) {
      let option = options[i]

      if (option.value === inputValue) {
        uid = option.getAttribute('data-uid')
        name = option.value
        break
      }
    }

    if (uid === null) {
      return false
    }

    addUser(search.parentNode, uid, name)
    search.value = ''
    const list = document.getElementById('compare-search-list')

    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    e.preventDefault()
  })

  window.compareSearchHintXHR = new XMLHttpRequest()
}

function addUser(form, uid, name) {
  const hidden = document.createElement('input')
  hidden.setAttribute('type', 'hidden')
  hidden.value = uid
  hidden.setAttribute('id', uid)
  form.appendChild(hidden)

  const list = document.getElementById('compare-list')
  const listElement = document.createElement('li')

  const cross = document.createElement('i')
  cross.classList.add('icon')
  cross.innerHTML = feather.icons['x-circle'].toSvg()

  cross.addEventListener('click', (event) => {
    const item = event.target.closest('.list-group-item')
    console.log(item)
    list.removeChild(item)
    //find form item
    const formItem = document.getElementById(`${uid}`)
    form.removeChild(formItem)

    if(list.childNodes.length < 2) {
      document.getElementById('compare').classList.add('hidden')
    }
  })

  listElement.appendChild(cross)
  listElement.setAttribute('data-uid', uid)
  listElement.appendChild(document.createTextNode(name))
  listElement.classList.add('list-group-item-dark', 'list-group-item')
  list.appendChild(listElement)

  if(list.childNodes.length > 1) {
    document.getElementById('compare').classList.remove('hidden')
  } 

}

function compareSearchHint (event) {

  var input = event.target
  var list = document.getElementById('compare-search-list')

  var min_characters = 2

  if (input.value.length < min_characters) {

  } else {
    window.compareSearchHintXHR.abort()

    window.compareSearchHintXHR.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText)

        list.innerHTML = ''

        response.forEach(function (item) {
          var option = document.createElement('option')
          option.setAttribute('data-uid', item.uid)
          option.appendChild(document.createTextNode(item.name))
          list.appendChild(option)
        })
      }
    }

    window.compareSearchHintXHR.open('GET', '/api/search?q=' + input.value, true)
    window.compareSearchHintXHR.send()
  }
}
