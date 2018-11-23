const tap = require('tap')
const StageCalculations = require('../import/stage_calculations.js')
const path = require('path')

tap.test('foo', async t => {
  const c = new StageCalculations()

  const rows = [
    {
      id: 1,
      timems: 450700
    },
    {
      id: 2,
      timems: 471000
    },
    {
      id: 3,
      timems: 483900
    },
    {
      id: 4,
      timems: 483900
    },
    {
      id: 5,
      timems: 486100
    }
  ]

  const result = c.timeBehind(rows, 1)
  t.equals(result[0].id, 1)
  t.equals(result[0].stage1_behindms, 0)

  t.equals(result[1].id, 2)
  t.equals(result[1].stage1_behindms, 20300)

  const result2 = c.timeBehind(rows, 2)
  t.equals(result2[0].id, 1)
  t.equals(result2[0].stage2_behindms, 0)

  t.equals(result2[1].id, 2)
  t.equals(result2[1].stage2_behindms, 20300)
  t.end()
})

