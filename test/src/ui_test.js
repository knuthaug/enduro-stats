const tap = require('tap')
const jsdom = require('jsdom')
const jsdomGlobal = require('jsdom-global')()
const ui = require('../../src/js/ui.js')


tap.test('test simple tags', async t => {
  let { h1 } = ui.create();
  t.equals(h1().outerHTML, '<h1></h1>')
  t.equals(h1("test").outerHTML, '<h1>test</h1>')
  t.equals(h1({id: 1}, "test").outerHTML, '<h1 id="1">test</h1>')
  t.end()
})

tap.test('test compound tags', async t => {
  let { h1, div } = ui.create();
  t.equals(div({class: 'foo' }, h1("test")).outerHTML, '<div class="foo"><h1>test</h1></div>')
  t.equals(div({class: ['foo', 'bar'] }, h1("test")).outerHTML, '<div class="foo bar"><h1>test</h1></div>')
  t.end()
})

tap.test('test multiple children', async t => {
  let { h1, div } = ui.create();
  t.equals(div([h1("test"), h1("test2")]).outerHTML, '<div><h1>test</h1><h1>test2</h1></div>')
  t.equals(div("test2").outerHTML, '<div>test2</div>')
  t.equals(div([h1("test"), "test2"]).outerHTML, '<div><h1>test</h1>test2</div>')
  t.equals(div(["test", h1("test2")]).outerHTML, '<div>test<h1>test2</h1></div>')
  t.end()
})


tap.test('test eventlisteners', async t => {
  let { div } = ui.create();
  t.deepEquals(div({'onClick': () => {}}), {})
  t.end()
})

