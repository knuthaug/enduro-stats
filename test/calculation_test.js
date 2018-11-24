const tap = require('tap')
const StageCalculations = require('../import/stage_calculations.js')
const path = require('path')

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

const c = new StageCalculations()

tap.test('calculate time behind rider in front', async t => {

  const result = c.differentials(rows, 1)
  t.equals(result[0].stage1_behindms, 0)
  t.equals(result[1].stage1_behindms, 20300)
  t.equals(result[2].stage1_behindms, 12900)

  const result2 = c.differentials(rows, 2)
  t.equals(result2[0].stage2_behindms, 0)
  t.equals(result2[1].stage2_behindms, 20300)
  t.equals(result2[2].stage1_behindms, 12900)
})

tap.test('calculate time behind leader', async t => {

  const result = c.differentials(rows, 1)
  t.equals(result[0].stage1_behindleaderms, 0)
  t.equals(result[1].stage1_behindleaderms, 20300)
  t.equals(result[2].stage1_behindleaderms, 33200)

  const result2 = c.differentials(rows, 2)
  t.equals(result2[0].stage2_behindleaderms, 0)
  t.equals(result2[1].stage2_behindleaderms, 20300)
  t.equals(result2[2].stage1_behindleaderms, 33200)
})

tap.test('calculate time behind rider in front in percent', async t => {
  const result = c.differentials(rows, 1)
  t.equals(result[0].stage1_behindpercent, 0)
  t.equals(result[1].stage1_behindpercent, 4.504104725981806)

  const result2 = c.differentials(rows, 2)
  t.equals(result2[0].stage2_behindpercent, 0)
  t.equals(result2[1].stage2_behindpercent, 4.504104725981806)

})

tap.test('calculate time behind leader in pecent', async t => {
  const result = c.differentials(rows, 1)
  t.equals(result[1].stage1_behindleaderpercent, 4.504104725981806)
  t.equals(result[2].stage1_behindleaderpercent, 7.366319059241181)

  const result2 = c.differentials(rows, 2)
  t.equals(result2[1].stage2_behindleaderpercent, 4.504104725981806)
  t.equals(result2[2].stage2_behindleaderpercent, 7.366319059241181)

  t.end()
})


