const bundleMapJs = require("../bundlemap-js.json");
const bundleMapCss = require("../bundlemap-css.json");

function replaceJs(fileName) {
  const jsEntry = bundleMapJs[fileName.replace(/.js$/, "")];

  if (jsEntry) {
    return jsEntry.js;
  }

  return fileName;
}

function replaceCss(fileName) {
  const cssEntry = bundleMapCss[fileName];

  return cssEntry || fileName;
}

function hashedAssets(fileName) {
  if (fileName.includes(".js")) {
    return replaceJs(fileName);
  }

  if (fileName.includes(".css")) {
    return replaceCss(fileName);
  }

  return fileName;
}

/* global arguments */
const compare = (left, operator, right, options) => {
  if (arguments.length < 3) {
    throw new Error('Handlebars Helper "compare" needs 3 parameters');
  }

  if (options === undefined) {
    options = right;
    right = operator;
    operator = "===";
  }

  /*eslint-disable */
  var operators = {
    "%": (l, r) => {
      return l % r;
    },
    "==": (l, r) => {
      return l == r;
    },
    "===": (l, r) => {
      return l === r;
    },
    "!=": (l, r) => {
      return l != r;
    },
    "!==": (l, r) => {
      return l !== r;
    },
    "<": (l, r) => {
      return l < r;
    },
    ">": (l, r) => {
      return l > r;
    },
    "<=": (l, r) => {
      return l <= r;
    },
    ">=": (l, r) => {
      return l >= r;
    },
    "&&": (l, r) => {
      return l && r;
    },
    typeof: (l, r) => {
      return typeof l == r;
    },
    startsWith: (l, r) => {
      return l.startsWith(r);
    },
    matches: (l, r) => {
      return new RegExp(r).test(l);
    },
  };
  /* eslint-enable */

  if (!operators[operator]) {
    throw new Error(
      `Handlebars Helper "compare" doesn't know the operator ${operator}`
    );
  }

  const result = operators[operator](left, right);
  if (result) {
    return options.fn(this);
  }
  return options.inverse(this);
};

function propFor(num, key) {
  return `stage${num}_${key}`;
}

function toJson(arg) {
  return JSON.stringify(arg);
}

function formatPercent(arg) {
  return arg.toFixed(1);
}

function isDNF(obj, stage) {
  return obj[`stage${stage}_time`] === "DNF";
}

function isDNS(obj, stage) {
  return obj[`stage${stage}_time`] === "DNS";
}

function isDSQ(obj, stage) {
  return obj[`stage${stage}_time`] === "DSQ";
}

function isError(obj, stage) {
  return obj[`stage${stage}_time`] === "ERROR";
}

function cat(one, two) {
  return `${one}${two}`;
}

function isOK(obj, stage) {
  return (
    obj[`stage${stage}_time`] !== "DNF" &&
    obj[`stage${stage}_time`] !== "DSQ" &&
    obj[`stage${stage}_time`] !== "DNS" &&
    obj[`stage${stage}_time`] !== "ERROR" &&
    typeof obj[`stage${stage}_time`] !== "undefined"
  );
}

function inc(value) {
  return parseInt(value, 10) + 1;
}

function title(status) {
  if (status === "DNS") {
    return "Rytteren startet ikke rittet";
  }

  if (status === "DNF") {
    return "Rytteren fullførte ikke rittet";
  }

  if (status === "DSQ") {
    return "Rytteren ble diskvalifisert";
  }

  return "";
}

function anchor(str) {
  return str.replace(/ /g, "-");
}

module.exports = {
  anchor,
  title,
  hashedAssets,
  compare,
  propFor,
  toJson,
  formatPercent,
  isDNS,
  isDNF,
  isDSQ,
  isError,
  isOK,
  cat,
  inc,
};
