const $ = require("jquery");
const buttons = require("bootstrap/js/dist/button.js");
const index = require("bootstrap/js/dist/index.js");
const collapse = require("bootstrap/js/dist/collapse.js");
const util = require("bootstrap/js/dist/util.js");
const tooltip = require("bootstrap/js/dist/tooltip.js");
const feather = require("feather-icons");
const popper = require("popper.js");
require("./influx.js");

window.jQuery = $;
window.$ = $;

document.addEventListener("DOMContentLoaded", function (event) {
  const tables = document.querySelectorAll(".main-table");

  feather.replace();
  setupSearch();
  $('[data-toggle="tooltip"]').tooltip();
});

function setupSearch() {
  const form = document.getElementById("searchForm");
  const search = document.getElementById("searchField");

  form.addEventListener("submit", function (event) {
    const search = document.getElementById("searchField");
    if (search.getAttribute("data-uid")) {
      search.setAttribute("value", search.getAttribute("data-uid"));
    }
  });

  search.addEventListener("keyup", function (event) {
    if (event.code) {
      searchHint(event);
    }
  });

  search.addEventListener("change", function (e) {
    let _value = null;

    const inputValue = search.value;
    const options = document.getElementById("searchList").children;
    let i = options.length;

    while (i--) {
      const option = options[i];

      if (option.value === inputValue) {
        _value = option.getAttribute("data-uid");
        break;
      }
    }

    if (_value === null) {
      return false;
    }

    search.setAttribute("data-uid", _value);
    window.location.replace("/rytter/" + _value);
    e.preventDefault();
  });

  window.searchHintXHR = new XMLHttpRequest();
}

function searchHint(event) {
  // retireve the input element

  const input = event.target;
  const list = document.getElementById("searchList");

  // minimum number of characters before we start to generate suggestions
  const min_characters = 2;

  if (input.value.length < min_characters) {
  } else {
    // abort any pending requests
    window.searchHintXHR.abort();

    window.searchHintXHR.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // We're expecting a json response so we convert it to an object
        const response = JSON.parse(this.responseText);

        // clear any previously loaded options in the datalist
        list.innerHTML = "";

        response.forEach(function (item) {
          // Create a new <option> element.
          const option = document.createElement("option");
          option.setAttribute("data-uid", item.uid);
          // option.value = item.uid
          option.appendChild(document.createTextNode(item.name));
          // attach the option to the datalist element
          list.appendChild(option);
        });
      }
    };

    window.searchHintXHR.open("GET", "/api/search?q=" + input.value, true);
    window.searchHintXHR.send();
  }
}
