document.addEventListener('DOMContentLoaded', function (event) {
  const exampleTable = document.getElementById('racetable')
  console.log(exampleTable)
  Sortable.initTable(exampleTable)
})
