/* global arguments */
module.exports = (left, operator, right, options) => {
  if (arguments.length < 3) {
    throw new Error('Handlebars Helper "compare" needs 2 parameters')
  }

  if (options === undefined) {
    options = right
    right = operator
    operator = '==='
  }

  /*eslint-disable */
  var operators = {
    '%':     (l, r) => {return l % r; },
    '==':     (l, r) => {return l == r; },
    '===':    (l, r) => {return l === r; },
    '!=':     (l, r) => {return l != r; },
    '!==':    (l, r) => {return l !== r; },
    '<':      (l, r) => {return l < r; },
    '>':      (l, r) => {return l > r; },
    '<=':     (l, r) => {return l <= r; },
    '>=':     (l, r) => {return l >= r; },
    '&&':     (l, r) => {return l && r; },
    typeof: (l, r) => {return typeof l == r; }
  };
  /* eslint-enable */

  if (!operators[operator]) {
    throw new Error(`Handlebars Helper "compare" doesn't know the operator ${operator}`)
  }

  const result = operators[operator](left, right)
  if (result) {
    return options.fn(this)
  }
  return options.inverse(this)
}
