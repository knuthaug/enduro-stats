/*
 Highcharts JS v8.0.0 (2019-12-10)

 (c) 2009-2018 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (S, M) { typeof module === 'object' && module.exports ? (M.default = M, module.exports = S.document ? M(S) : M) : typeof define === 'function' && define.amd ? define('highcharts/highcharts', function () { return M(S) }) : (S.Highcharts && S.Highcharts.error(16, !0), S.Highcharts = M(S)) })(typeof window !== 'undefined' ? window : this, function (S) {
  function M (c, e, F, I) { c.hasOwnProperty(e) || (c[e] = I.apply(null, F)) } const J = {}; M(J, 'parts/Globals.js', [], function () {
    const c = typeof S !== 'undefined' ? S : typeof window !== 'undefined' ? window : {}; const e = c.document
    const F = c.navigator && c.navigator.userAgent || ''; const I = e && e.createElementNS && !!e.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect; const G = /(edge|msie|trident)/i.test(F) && !c.opera; const H = F.indexOf('Firefox') !== -1; const v = F.indexOf('Chrome') !== -1; const q = H && parseInt(F.split('Firefox/')[1], 10) < 4; return {
      product: 'Highcharts',
      version: '8.0.0',
      deg2rad: 2 * Math.PI / 360,
      doc: e,
      hasBidiBug: q,
      hasTouch: !!c.TouchEvent,
      isMS: G,
      isWebKit: F.indexOf('AppleWebKit') !== -1,
      isFirefox: H,
      isChrome: v,
      isSafari: !v && F.indexOf('Safari') !== -1,
      isTouchDevice: /(Mobile|Android|Windows Phone)/.test(F),
      SVG_NS: 'http://www.w3.org/2000/svg',
      chartCount: 0,
      seriesTypes: {},
      symbolSizes: {},
      svg: I,
      win: c,
      marginNames: ['plotTop', 'marginRight', 'marginBottom', 'plotLeft'],
      noop: function () {},
      charts: [],
      dateFormats: {}
    }
  }); M(J, 'parts/Utilities.js', [J['parts/Globals.js']], function (c) {
    function e (d, a) { return parseInt(d, a || 10) } function F (d) { return typeof d === 'string' } function I (d) { d = Object.prototype.toString.call(d); return d === '[object Array]' || d === '[object Array Iterator]' } function G (d, a) {
      return !!d && typeof d === 'object' && (!a ||
!I(d))
    } function H (d) { return G(d) && typeof d.nodeType === 'number' } function v (d) { const a = d && d.constructor; return !(!G(d, !0) || H(d) || !a || !a.name || a.name === 'Object') } function q (d) { return typeof d === 'number' && !isNaN(d) && Infinity > d && -Infinity < d } function C (d) { return typeof d !== 'undefined' && d !== null } function B (d, a, b) { let h; F(a) ? C(b) ? d.setAttribute(a, b) : d && d.getAttribute && ((h = d.getAttribute(a)) || a !== 'class' || (h = d.getAttribute(a + 'Name'))) : A(a, function (a, h) { d.setAttribute(h, a) }); return h } function u (d, a) {
      let h; d || (d =
{}); for (h in a)d[h] = a[h]; return d
    } function w () { for (let d = arguments, a = d.length, b = 0; b < a; b++) { const l = d[b]; if (typeof l !== 'undefined' && l !== null) return l } } function m (d, a) { const h = function () {}; h.prototype = new d(); u(h.prototype, a); return h } function r (d, a) { return parseFloat(d.toPrecision(a || 14)) } function D (d, a, b, l) {
      d = +d || 0; a = +a; const h = c.defaultOptions.lang; let k = (d.toString().split('.')[1] || '').split('e')[0].length; const g = d.toString().split('e'); if (a === -1)a = Math.min(k, 20); else if (!q(a))a = 2; else if (a && g[1] && g[1] < 0) {
        var t =
a + +g[1]; t >= 0 ? (g[0] = (+g[0]).toExponential(t).split('e')[0], a = t) : (g[0] = g[0].split('.')[0] || 0, d = a < 20 ? (g[0] * Math.pow(10, g[1])).toFixed(a) : 0, g[1] = 0)
      } const x = (Math.abs(g[1] ? g[0] : d) + Math.pow(10, -Math.max(a, k) - 1)).toFixed(a); k = String(e(x)); t = k.length > 3 ? k.length % 3 : 0; b = w(b, h.decimalPoint); l = w(l, h.thousandsSep); d = (d < 0 ? '-' : '') + (t ? k.substr(0, t) + l : ''); d += k.substr(t).replace(/(\d{3})(?=\d)/g, '$1' + l); a && (d += b + x.slice(-a)); g[1] && +d !== 0 && (d += 'e' + g[1]); return d
    } function A (d, a, b) {
      for (const h in d) {
        Object.hasOwnProperty.call(d,
          h) && a.call(b || d[h], d[h], h, d)
      }
    }c.timers = []; const f = c.charts; const b = c.doc; const a = c.win; c.error = function (d, b, k, l) { const h = q(d); let f = h ? 'Highcharts error #' + d + ': www.highcharts.com/errors/' + d + '/' : d.toString(); const g = function () { if (b) throw Error(f); a.console && console.log(f) }; if (typeof l !== 'undefined') { let t = ''; h && (f += '?'); c.objectEach(l, function (d, a) { t += '\n' + a + ': ' + d; h && (f += encodeURI(a) + '=' + encodeURI(d)) }); f += t }k ? c.fireEvent(k, 'displayError', { code: d, message: f, params: l }, g) : g() }; c.Fx = function (d, a, b) {
      this.options = a; this.elem = d; this.prop =
b
    }; c.Fx.prototype = {
      dSetter: function () { const d = this.paths[0]; const a = this.paths[1]; let b = []; const l = this.now; let f = d.length; if (l === 1)b = this.toD; else if (f === a.length && l < 1) for (;f--;) { const p = parseFloat(d[f]); b[f] = isNaN(p) || a[f - 4] === 'A' || a[f - 5] === 'A' ? a[f] : l * parseFloat('' + (a[f] - p)) + p } else b = a; this.elem.attr('d', b, null, !0) },
      update: function () { const d = this.elem; const a = this.prop; const b = this.now; const l = this.options.step; if (this[a + 'Setter']) this[a + 'Setter'](); else d.attr ? d.element && d.attr(a, b, null, !0) : d.style[a] = b + this.unit; l && l.call(d, b, this) },
      run: function (d,
        b, k) {
        const h = this; const f = h.options; var p = function (d) { return p.stopped ? !1 : h.step(d) }; const g = a.requestAnimationFrame || function (d) { setTimeout(d, 13) }; var t = function () { for (let d = 0; d < c.timers.length; d++)c.timers[d]() || c.timers.splice(d--, 1); c.timers.length && g(t) }; d !== b || this.elem['forceAnimate:' + this.prop]
          ? (this.startTime = +new Date(), this.start = d, this.end = b, this.unit = k, this.now = this.start, this.pos = 0, p.elem = this.elem, p.prop = this.prop, p() && c.timers.push(p) === 1 && g(t))
          : (delete f.curAnim[this.prop], f.complete && Object.keys(f.curAnim).length === 0 &&
f.complete.call(this.elem))
      },
      step: function (d) { const a = +new Date(); const b = this.options; const l = this.elem; const f = b.complete; const p = b.duration; const g = b.curAnim; if (l.attr && !l.element)d = !1; else if (d || a >= p + this.startTime) { this.now = this.end; this.pos = 1; this.update(); let t = g[this.prop] = !0; A(g, function (d) { !0 !== d && (t = !1) }); t && f && f.call(l); d = !1 } else this.pos = b.easing((a - this.startTime) / p), this.now = this.start + (this.end - this.start) * this.pos, this.update(), d = !0; return d },
      initPath: function (d, a, b) {
        function h (d) {
          for (n = d.length; n--;) {
            const a = d[n] ===
'M' || d[n] === 'L'; const b = /[a-zA-Z]/.test(d[n + 3]); a && b && d.splice(n + 1, 0, d[n + 1], d[n + 2], d[n + 1], d[n + 2])
          }
        } function f (d, a) { for (;d.length < r;) { d[0] = a[r - d.length]; let b = d.slice(0, c); [].splice.apply(d, [0, 0].concat(b)); z && (b = d.slice(d.length - c), [].splice.apply(d, [d.length, 0].concat(b)), n--) }d[0] = 'M' } function k (d, a) { for (let b = (r - d.length) / c; b > 0 && b--;)E = d.slice().splice(d.length / N - c, c * N), E[0] = a[r - c - b * c], x && (E[c - 6] = E[c - 2], E[c - 5] = E[c - 1]), [].splice.apply(d, [d.length / N, 0].concat(E)), z && b-- }a = a || ''; const g = d.startX; const t = d.endX
        var x = a.indexOf('C') > -1; var c = x ? 7 : 3; let E; let n; a = a.split(' '); b = b.slice(); var z = d.isArea; var N = z ? 2 : 1; x && (h(a), h(b)); if (g && t) { for (n = 0; n < g.length; n++) if (g[n] === t[0]) { var O = n; break } else if (g[0] === t[t.length - g.length + n]) { O = n; var A = !0; break } else if (g[g.length - 1] === t[t.length - g.length + n]) { O = g.length - n; break } typeof O === 'undefined' && (a = []) } if (a.length && q(O)) { var r = b.length + O * N * c; A ? (f(a, b), k(b, a)) : (f(b, a), k(a, b)) } return [a, b]
      },
      fillSetter: function () { c.Fx.prototype.strokeSetter.apply(this, arguments) },
      strokeSetter: function () {
        this.elem.attr(this.prop,
          c.color(this.start).tweenTo(c.color(this.end), this.pos), null, !0)
      }
    }; c.merge = function () { let d; let a = arguments; let b = {}; var l = function (d, a) { typeof d !== 'object' && (d = {}); A(a, function (b, h) { !G(b, !0) || v(b) || H(b) ? d[h] = a[h] : d[h] = l(d[h] || {}, b) }); return d }; !0 === a[0] && (b = a[1], a = Array.prototype.slice.call(a, 2)); const f = a.length; for (d = 0; d < f; d++)b = l(b, a[d]); return b }; c.clearTimeout = function (d) { C(d) && clearTimeout(d) }; c.css = function (d, a) {
      c.isMS && !c.svg && a && typeof a.opacity !== 'undefined' && (a.filter = 'alpha(opacity=' + 100 * a.opacity +
')'); u(d.style, a)
    }; c.createElement = function (d, a, f, l, y) { d = b.createElement(d); const h = c.css; a && u(d, a); y && h(d, { padding: '0', border: 'none', margin: '0' }); f && h(d, f); l && l.appendChild(d); return d }; c.datePropsToTimestamps = function (d) { A(d, function (a, b) { G(a) && typeof a.getTime === 'function' ? d[b] = a.getTime() : (G(a) || I(a)) && c.datePropsToTimestamps(a) }) }; c.formatSingle = function (d, a, b) {
      let h = /\.([0-9])/; const f = c.defaultOptions.lang; const k = b && b.time || c.time; b = b && b.numberFormatter || D; /f$/.test(d)
        ? (h = (h = d.match(h)) ? h[1] : -1, a !==
null && (a = b(a, h, f.decimalPoint, d.indexOf(',') > -1 ? f.thousandsSep : '')))
        : a = k.dateFormat(d, a); return a
    }; c.format = function (d, a, b) { for (var h = '{', f = !1, k, g, t, x, L = [], E; d;) { h = d.indexOf(h); if (h === -1) break; k = d.slice(0, h); if (f) { k = k.split(':'); g = k.shift().split('.'); x = g.length; E = a; for (t = 0; t < x; t++)E && (E = E[g[t]]); k.length && (E = c.formatSingle(k.join(':'), E, b)); L.push(E) } else L.push(k); d = d.slice(h + 1); h = (f = !f) ? '}' : '{' }L.push(d); return L.join('') }; c.getMagnitude = function (d) { return Math.pow(10, Math.floor(Math.log(d) / Math.LN10)) }
    c.normalizeTickInterval = function (d, a, b, l, f) { let h = d; b = w(b, 1); const g = d / b; a || (a = f ? [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] : [1, 2, 2.5, 5, 10], !1 === l && (b === 1 ? a = a.filter(function (d) { return d % 1 === 0 }) : b <= 0.1 && (a = [1 / b]))); for (l = 0; l < a.length && !(h = a[l], f && h * b >= d || !f && g <= (a[l] + (a[l + 1] || a[l])) / 2); l++);return h = r(h * b, -Math.round(Math.log(0.001) / Math.LN10)) }; c.stableSort = function (d, a) { const b = d.length; let h; let f; for (f = 0; f < b; f++)d[f].safeI = f; d.sort(function (d, b) { h = a(d, b); return h === 0 ? d.safeI - b.safeI : h }); for (f = 0; f < b; f++) delete d[f].safeI }
    c.timeUnits = { millisecond: 1, second: 1E3, minute: 6E4, hour: 36E5, day: 864E5, week: 6048E5, month: 24192E5, year: 314496E5 }; Math.easeInOutSine = function (d) { return -0.5 * (Math.cos(Math.PI * d) - 1) }; c.getStyle = function (d, b, f) {
      if (b === 'width') return b = Math.min(d.offsetWidth, d.scrollWidth), f = d.getBoundingClientRect && d.getBoundingClientRect().width, f < b && f >= b - 1 && (b = Math.floor(f)), Math.max(0, b - c.getStyle(d, 'padding-left') - c.getStyle(d, 'padding-right')); if (b === 'height') {
        return Math.max(0, Math.min(d.offsetHeight, d.scrollHeight) -
c.getStyle(d, 'padding-top') - c.getStyle(d, 'padding-bottom'))
      } a.getComputedStyle || c.error(27, !0); if (d = a.getComputedStyle(d, void 0))d = d.getPropertyValue(b), w(f, b !== 'opacity') && (d = e(d)); return d
    }; c.inArray = function (d, a, b) { return a.indexOf(d, b) }; c.find = Array.prototype.find ? function (d, a) { return d.find(a) } : function (d, a) { let b; const h = d.length; for (b = 0; b < h; b++) if (a(d[b], b)) return d[b] }; c.keys = Object.keys; c.stop = function (d, a) {
      for (let b = c.timers.length; b--;) {
        c.timers[b].elem !== d || a && a !== c.timers[b].prop || (c.timers[b].stopped =
!0)
      }
    }; A({ map: 'map', each: 'forEach', grep: 'filter', reduce: 'reduce', some: 'some' }, function (d, a) { c[a] = function (a) { return Array.prototype[d].apply(a, [].slice.call(arguments, 1)) } }); c.addEvent = function (d, a, b, f) {
      void 0 === f && (f = {}); const h = d.addEventListener || c.addEventListenerPolyfill; const l = typeof d === 'function' && d.prototype ? d.prototype.protoEvents = d.prototype.protoEvents || {} : d.hcEvents = d.hcEvents || {}; c.Point && d instanceof c.Point && d.series && d.series.chart && (d.series.chart.runTrackerClick = !0); h && h.call(d, a, b,
        !1); l[a] || (l[a] = []); l[a].push({ fn: b, order: typeof f.order === 'number' ? f.order : Infinity }); l[a].sort(function (d, a) { return d.order - a.order }); return function () { c.removeEvent(d, a, b) }
    }; c.removeEvent = function (d, a, b) {
      function h (a, b) { const g = d.removeEventListener || c.removeEventListenerPolyfill; g && g.call(d, a, b, !1) } function f (b) { let g; if (d.nodeName) { if (a) { var f = {}; f[a] = !0 } else f = b; A(f, function (d, a) { if (b[a]) for (g = b[a].length; g--;)h(a, b[a][g].fn) }) } } let k; ['protoEvents', 'hcEvents'].forEach(function (g, t) {
        const l = (t =
t ? d : d.prototype) && t[g]; l && (a ? (k = l[a] || [], b ? (l[a] = k.filter(function (a) { return b !== a.fn }), h(a, b)) : (f(l), l[a] = [])) : (f(l), t[g] = {}))
      })
    }; c.fireEvent = function (a, h, f, l) {
      let d; f = f || {}; if (b.createEvent && (a.dispatchEvent || a.fireEvent)) { const k = b.createEvent('Events'); k.initEvent(h, !0, !0); u(k, f); a.dispatchEvent ? a.dispatchEvent(k) : a.fireEvent(h, k) } else {
        f.target || u(f, { preventDefault: function () { f.defaultPrevented = !0 }, target: a, type: h }), (function (b, h) {
          void 0 === b && (b = []); void 0 === h && (h = []); let g = 0; let t = 0; const l = b.length + h.length
          for (d = 0; d < l; d++)!1 === (b[g] ? h[t] ? b[g].order <= h[t].order ? b[g++] : h[t++] : b[g++] : h[t++]).fn.call(a, f) && f.preventDefault()
        }(a.protoEvents && a.protoEvents[h], a.hcEvents && a.hcEvents[h]))
      }l && !f.defaultPrevented && l.call(a, f)
    }; c.animate = function (a, b, f) {
      let d; let h = ''; let k; let g; if (!G(f)) { const t = arguments; f = { duration: t[2], easing: t[3], complete: t[4] } }q(f.duration) || (f.duration = 400); f.easing = typeof f.easing === 'function' ? f.easing : Math[f.easing] || Math.easeInOutSine; f.curAnim = c.merge(b); A(b, function (t, l) {
        c.stop(a, l); g = new c.Fx(a,
          f, l); k = null; l === 'd' ? (g.paths = g.initPath(a, a.d, b.d), g.toD = b.d, d = 0, k = 1) : a.attr ? d = a.attr(l) : (d = parseFloat(c.getStyle(a, l)) || 0, l !== 'opacity' && (h = 'px')); k || (k = t); k && k.match && k.match('px') && (k = k.replace(/px/g, '')); g.run(d, k, h)
      })
    }; c.seriesType = function (a, b, f, l, y) { const d = c.getOptions(); const g = c.seriesTypes; d.plotOptions[a] = c.merge(d.plotOptions[b], f); g[a] = m(g[b] || function () {}, l); g[a].prototype.type = a; y && (g[a].prototype.pointClass = m(c.Point, y)); return g[a] }; c.uniqueKey = (function () {
      const a = Math.random().toString(36).substring(2,
        9); let b = 0; return function () { return 'highcharts-' + a + '-' + b++ }
    }()); c.isFunction = function (a) { return typeof a === 'function' }; a.jQuery && (a.jQuery.fn.highcharts = function () { const a = [].slice.call(arguments); if (this[0]) return a[0] ? (new (c[F(a[0]) ? a.shift() : 'Chart'])(this[0], a[0], a[1]), this) : f[B(this[0], 'data-highcharts-chart')] }); return {
      animObject: function (a) { return G(a) ? c.merge(a) : { duration: a ? 500 : 0 } },
      arrayMax: function (a) { for (var d = a.length, b = a[0]; d--;)a[d] > b && (b = a[d]); return b },
      arrayMin: function (a) {
        for (var d = a.length,
          b = a[0]; d--;)a[d] < b && (b = a[d]); return b
      },
      attr: B,
      clamp: function (a, b, f) { return a > b ? a < f ? a : f : b },
      correctFloat: r,
      defined: C,
      destroyObjectProperties: function (a, b) { A(a, function (d, h) { d && d !== b && d.destroy && d.destroy(); delete a[h] }) },
      discardElement: function (a) { let d = c.garbageBin; d || (d = c.createElement('div')); a && d.appendChild(a); d.innerHTML = '' },
      erase: function (a, b) { for (let d = a.length; d--;) if (a[d] === b) { a.splice(d, 1); break } },
      extend: u,
      extendClass: m,
      isArray: I,
      isClass: v,
      isDOMElement: H,
      isNumber: q,
      isObject: G,
      isString: F,
      numberFormat: D,
      objectEach: A,
      offset: function (d) { const h = b.documentElement; d = d.parentElement || d.parentNode ? d.getBoundingClientRect() : { top: 0, left: 0 }; return { top: d.top + (a.pageYOffset || h.scrollTop) - (h.clientTop || 0), left: d.left + (a.pageXOffset || h.scrollLeft) - (h.clientLeft || 0) } },
      pad: function (a, b, f) { return Array((b || 2) + 1 - String(a).replace('-', '').length).join(f || '0') + a },
      pick: w,
      pInt: e,
      relativeLength: function (a, b, f) { return /%$/.test(a) ? b * parseFloat(a) / 100 + (f || 0) : parseFloat(a) },
      setAnimation: function (a, b) {
        b.renderer.globalAnimation =
w(a, b.options.chart.animation, !0)
      },
      splat: function (a) { return I(a) ? a : [a] },
      syncTimeout: function (a, b, f) { if (b > 0) return setTimeout(a, b, f); a.call(0, f); return -1 },
      wrap: function (a, b, f) { const d = a[b]; a[b] = function () { let a = Array.prototype.slice.call(arguments); const b = arguments; const g = this; g.proceed = function () { d.apply(g, arguments.length ? arguments : b) }; a.unshift(d); a = f.apply(this, a); g.proceed = null; return a } }
    }
  }); M(J, 'parts/Color.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.isNumber; const I = e.pInt; const G = c.merge
    c.Color = function (e) { if (!(this instanceof c.Color)) return new c.Color(e); this.init(e) }; c.Color.prototype = {
      parsers: [{ regex: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/, parse: function (c) { return [I(c[1]), I(c[2]), I(c[3]), parseFloat(c[4], 10)] } }, { regex: /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/, parse: function (c) { return [I(c[1]), I(c[2]), I(c[3]), 1] } }],
      names: { white: '#ffffff', black: '#000000' },
      init: function (e) {
        let v, q; if ((this.input = e = this.names[e &&
e.toLowerCase
          ? e.toLowerCase()
          : ''] || e) && e.stops) this.stops = e.stops.map(function (e) { return new c.Color(e[1]) }); else { if (e && e.charAt && e.charAt() === '#') { var C = e.length; e = parseInt(e.substr(1), 16); C === 7 ? v = [(e & 16711680) >> 16, (e & 65280) >> 8, e & 255, 1] : C === 4 && (v = [(e & 3840) >> 4 | (e & 3840) >> 8, (e & 240) >> 4 | e & 240, (e & 15) << 4 | e & 15, 1]) } if (!v) for (q = this.parsers.length; q-- && !v;) { const H = this.parsers[q]; (C = H.regex.exec(e)) && (v = H.parse(C)) } } this.rgba = v || []
      },
      get: function (c) {
        const e = this.input; const q = this.rgba; if (this.stops) {
          var C = G(e); C.stops =
[].concat(C.stops); this.stops.forEach(function (e, q) { C.stops[q] = [C.stops[q][0], e.get(c)] })
        } else C = q && F(q[0]) ? c === 'rgb' || !c && q[3] === 1 ? 'rgb(' + q[0] + ',' + q[1] + ',' + q[2] + ')' : c === 'a' ? q[3] : 'rgba(' + q.join(',') + ')' : e; return C
      },
      brighten: function (c) { let e; const q = this.rgba; if (this.stops) this.stops.forEach(function (e) { e.brighten(c) }); else if (F(c) && c !== 0) for (e = 0; e < 3; e++)q[e] += I(255 * c), q[e] < 0 && (q[e] = 0), q[e] > 255 && (q[e] = 255); return this },
      setOpacity: function (c) { this.rgba[3] = c; return this },
      tweenTo: function (c, e) {
        const q = this.rgba
        const v = c.rgba; v.length && q && q.length ? (c = v[3] !== 1 || q[3] !== 1, e = (c ? 'rgba(' : 'rgb(') + Math.round(v[0] + (q[0] - v[0]) * (1 - e)) + ',' + Math.round(v[1] + (q[1] - v[1]) * (1 - e)) + ',' + Math.round(v[2] + (q[2] - v[2]) * (1 - e)) + (c ? ',' + (v[3] + (q[3] - v[3]) * (1 - e)) : '') + ')') : e = c.input || 'none'; return e
      }
    }; c.color = function (e) { return new c.Color(e) }
  }); M(J, 'parts/SvgRenderer.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.animObject; const I = e.attr; const G = e.defined; const H = e.destroyObjectProperties; const v = e.erase; const q = e.extend; const C = e.isArray; const B = e.isNumber
    const u = e.isObject; const w = e.isString; const m = e.objectEach; const r = e.pick; const D = e.pInt; const A = e.splat; const f = c.addEvent; const b = c.animate; const a = c.charts; const d = c.color; const h = c.css; const k = c.createElement; const l = c.deg2rad; const y = c.doc; const p = c.hasTouch; const g = c.isFirefox; const t = c.isMS; const x = c.isWebKit; const L = c.merge; const E = c.noop; const n = c.removeEvent; const z = c.stop; const N = c.svg; const O = c.SVG_NS; const V = c.symbolSizes; const T = c.win; const P = c.SVGElement = function () { return this }; q(P.prototype, {
      opacity: 1,
      SVG_NS: O,
      textProps: 'direction fontSize fontWeight fontFamily fontStyle color lineHeight width textAlign textDecoration textOverflow textOutline cursor'.split(' '),
      init: function (a, b) { this.element = b === 'span' ? k(b) : y.createElementNS(this.SVG_NS, b); this.renderer = a; c.fireEvent(this, 'afterInit') },
      animate: function (a, d, n) { const K = F(r(d, this.renderer.globalAnimation, !0)); r(y.hidden, y.msHidden, y.webkitHidden, !1) && (K.duration = 0); K.duration !== 0 ? (n && (K.complete = n), b(this, a, K)) : (this.attr(a, void 0, n), m(a, function (a, b) { K.step && K.step.call(this, a, { prop: b, pos: 1 }) }, this)); return this },
      complexColor: function (a, b, d) {
        const n = this.renderer; let K; let Q; let g; let z; let f; let h; let t; let l; let R; let x; let k; let N = []; let p; c.fireEvent(this.renderer,
          'complexColor', { args: arguments }, function () {
            a.radialGradient ? Q = 'radialGradient' : a.linearGradient && (Q = 'linearGradient'); Q && (g = a[Q], f = n.gradients, t = a.stops, x = d.radialReference, C(g) && (a[Q] = g = { x1: g[0], y1: g[1], x2: g[2], y2: g[3], gradientUnits: 'userSpaceOnUse' }), Q === 'radialGradient' && x && !G(g.gradientUnits) && (z = g, g = L(g, n.getRadialAttr(x, z), { gradientUnits: 'userSpaceOnUse' })), m(g, function (a, b) { b !== 'id' && N.push(b, a) }), m(t, function (a) { N.push(a) }), N = N.join(','), f[N]
              ? k = f[N].attr('id')
              : (g.id = k = c.uniqueKey(), f[N] = h =
n.createElement(Q).attr(g).add(n.defs), h.radAttr = z, h.stops = [], t.forEach(function (a) { a[1].indexOf('rgba') === 0 ? (K = c.color(a[1]), l = K.get('rgb'), R = K.get('a')) : (l = a[1], R = 1); a = n.createElement('stop').attr({ offset: a[0], 'stop-color': l, 'stop-opacity': R }).add(h); h.stops.push(a) })), p = 'url(' + n.url + '#' + k + ')', d.setAttribute(b, p), d.gradient = N, a.toString = function () { return p })
          })
      },
      applyTextOutline: function (a) {
        const b = this.element; let d; a.indexOf('contrast') !== -1 && (a = a.replace(/contrast/g, this.renderer.getContrast(b.style.fill)))
        a = a.split(' '); const n = a[a.length - 1]; if ((d = a[0]) && d !== 'none' && c.svg) {
          this.fakeTS = !0; a = [].slice.call(b.getElementsByTagName('tspan')); this.ySetter = this.xSetter; d = d.replace(/(^[\d\.]+)(.*?)$/g, function (a, b, d) { return 2 * b + d }); this.removeTextOutline(a); const g = b.firstChild; a.forEach(function (a, K) {
            K === 0 && (a.setAttribute('x', b.getAttribute('x')), K = b.getAttribute('y'), a.setAttribute('y', K || 0), K === null && b.setAttribute('y', 0)); a = a.cloneNode(1); I(a, {
              class: 'highcharts-text-outline',
              fill: n,
              stroke: n,
              'stroke-width': d,
              'stroke-linejoin': 'round'
            }); b.insertBefore(a, g)
          })
        }
      },
      removeTextOutline: function (a) { for (var b = a.length, d; b--;)d = a[b], d.getAttribute('class') === 'highcharts-text-outline' && v(a, this.element.removeChild(d)) },
      symbolCustomAttribs: 'x y width height r start end innerR anchorX anchorY rounded'.split(' '),
      attr: function (a, b, d, n) {
        const g = this.element; let K; let Q = this; let f; let h; const t = this.symbolCustomAttribs; if (typeof a === 'string' && typeof b !== 'undefined') { const l = a; a = {}; a[l] = b } typeof a === 'string'
          ? Q = (this[a + 'Getter'] || this._defaultGetter).call(this,
              a, g)
          : (m(a, function (b, d) { f = !1; n || z(this, d); this.symbolName && c.inArray(d, t) !== -1 && (K || (this.symbolAttr(a), K = !0), f = !0); !this.rotation || d !== 'x' && d !== 'y' || (this.doTransform = !0); f || (h = this[d + 'Setter'] || this._defaultSetter, h.call(this, b, d, g), !this.styledMode && this.shadows && /^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(d) && this.updateShadows(d, b, h)) }, this), this.afterSetters()); d && d.call(this); return Q
      },
      afterSetters: function () { this.doTransform && (this.updateTransform(), this.doTransform = !1) },
      updateShadows: function (a,
        b, d) { for (let n = this.shadows, g = n.length; g--;)d.call(n[g], a === 'height' ? Math.max(b - (n[g].cutHeight || 0), 0) : a === 'd' ? this.d : b, a, n[g]) },
      addClass: function (a, b) { const d = b ? '' : this.attr('class') || ''; a = (a || '').split(/ /g).reduce(function (a, b) { d.indexOf(b) === -1 && a.push(b); return a }, d ? [d] : []).join(' '); a !== d && this.attr('class', a); return this },
      hasClass: function (a) { return (this.attr('class') || '').split(' ').indexOf(a) !== -1 },
      removeClass: function (a) {
        return this.attr('class', (this.attr('class') || '').replace(w(a)
          ? new RegExp(' ?' +
a + ' ?')
          : a, ''))
      },
      symbolAttr: function (a) { const b = this; 'x y r start end width height innerR anchorX anchorY clockwise'.split(' ').forEach(function (d) { b[d] = r(a[d], b[d]) }); b.attr({ d: b.renderer.symbols[b.symbolName](b.x, b.y, b.width, b.height, b) }) },
      clip: function (a) { return this.attr('clip-path', a ? 'url(' + this.renderer.url + '#' + a.id + ')' : 'none') },
      crisp: function (a, b) {
        b = b || a.strokeWidth || 0; const d = Math.round(b) % 2 / 2; a.x = Math.floor(a.x || this.x || 0) + d; a.y = Math.floor(a.y || this.y || 0) + d; a.width = Math.floor((a.width || this.width ||
0) - 2 * d); a.height = Math.floor((a.height || this.height || 0) - 2 * d); G(a.strokeWidth) && (a.strokeWidth = b); return a
      },
      css: function (a) {
        const b = this.styles; const d = {}; const n = this.element; let g = ''; let z = !b; const f = ['textOutline', 'textOverflow', 'width']; a && a.color && (a.fill = a.color); b && m(a, function (a, n) { a !== b[n] && (d[n] = a, z = !0) }); if (z) {
          b && (a = q(b, d)); if (a) if (a.width === null || a.width === 'auto') delete this.textWidth; else if (n.nodeName.toLowerCase() === 'text' && a.width) var Q = this.textWidth = D(a.width); this.styles = a; Q && !N && this.renderer.forExport && delete a.width
          if (n.namespaceURI === this.SVG_NS) { const t = function (a, b) { return '-' + b.toLowerCase() }; m(a, function (a, b) { f.indexOf(b) === -1 && (g += b.replace(/([A-Z])/g, t) + ':' + a + ';') }); g && I(n, 'style', g) } else h(n, a); this.added && (this.element.nodeName === 'text' && this.renderer.buildText(this), a && a.textOutline && this.applyTextOutline(a.textOutline))
        } return this
      },
      getStyle: function (a) { return T.getComputedStyle(this.element || this, '').getPropertyValue(a) },
      strokeWidth: function () {
        if (!this.renderer.styledMode) {
          return this['stroke-width'] ||
0
        } const a = this.getStyle('stroke-width'); let b = 0; if (a.indexOf('px') === a.length - 2)b = D(a); else if (a !== '') { const d = y.createElementNS(O, 'rect'); I(d, { width: a, 'stroke-width': 0 }); this.element.parentNode.appendChild(d); b = d.getBBox().width; d.parentNode.removeChild(d) } return b
      },
      on: function (a, b) {
        const d = this; const n = d.element; p && a === 'click'
          ? (n.ontouchstart = function (a) { d.touchEventFired = Date.now(); a.preventDefault(); b.call(n, a) }, n.onclick = function (a) {
              (T.navigator.userAgent.indexOf('Android') === -1 || Date.now() - (d.touchEventFired ||
0) > 1100) && b.call(n, a)
            })
          : n['on' + a] = b; return this
      },
      setRadialReference: function (a) { const b = this.renderer.gradients[this.element.gradient]; this.element.radialReference = a; b && b.radAttr && b.animate(this.renderer.getRadialAttr(a, b.radAttr)); return this },
      translate: function (a, b) { return this.attr({ translateX: a, translateY: b }) },
      invert: function (a) { this.inverted = a; this.updateTransform(); return this },
      updateTransform: function () {
        let a = this.translateX || 0; let b = this.translateY || 0; const d = this.scaleX; const n = this.scaleY; const g = this.inverted; const z = this.rotation
        const f = this.matrix; const h = this.element; g && (a += this.width, b += this.height); a = ['translate(' + a + ',' + b + ')']; G(f) && a.push('matrix(' + f.join(',') + ')'); g ? a.push('rotate(90) scale(-1,1)') : z && a.push('rotate(' + z + ' ' + r(this.rotationOriginX, h.getAttribute('x'), 0) + ' ' + r(this.rotationOriginY, h.getAttribute('y') || 0) + ')'); (G(d) || G(n)) && a.push('scale(' + r(d, 1) + ' ' + r(n, 1) + ')'); a.length && h.setAttribute('transform', a.join(' '))
      },
      toFront: function () { const a = this.element; a.parentNode.appendChild(a); return this },
      align: function (a, b, d) {
        let n
        const g = {}; let z = this.renderer; let f = z.alignedObjects; let K, h; if (a) { if (this.alignOptions = a, this.alignByTranslate = b, !d || w(d)) this.alignTo = n = d || 'renderer', v(f, this), f.push(this), d = null } else a = this.alignOptions, b = this.alignByTranslate, n = this.alignTo; d = r(d, z[n], z); n = a.align; z = a.verticalAlign; f = (d.x || 0) + (a.x || 0); let t = (d.y || 0) + (a.y || 0); n === 'right' ? K = 1 : n === 'center' && (K = 2); K && (f += (d.width - (a.width || 0)) / K); g[b ? 'translateX' : 'x'] = Math.round(f); z === 'bottom' ? h = 1 : z === 'middle' && (h = 2); h && (t += (d.height - (a.height || 0)) /
h); g[b ? 'translateY' : 'y'] = Math.round(t); this[this.placed ? 'animate' : 'attr'](g); this.placed = !0; this.alignAttr = g; return this
      },
      getBBox: function (a, b) {
        let d; let n = this.renderer; const g = this.element; let z = this.styles; const f = this.textStr; let K; const h = n.cache; const t = n.cacheKeys; const Q = g.namespaceURI === this.SVG_NS; b = r(b, this.rotation, 0); const x = n.styledMode ? g && P.prototype.getStyle.call(g, 'font-size') : z && z.fontSize; if (G(f)) { var c = f.toString(); c.indexOf('<') === -1 && (c = c.replace(/[0-9]/g, '0')); c += ['', b, x, this.textWidth, z && z.textOverflow].join() }c && !a &&
(d = h[c]); if (!d) {
          if (Q || n.forExport) { try { (K = this.fakeTS && function (a) { [].forEach.call(g.querySelectorAll('.highcharts-text-outline'), function (b) { b.style.display = a }) }) && K('none'), d = g.getBBox ? q({}, g.getBBox()) : { width: g.offsetWidth, height: g.offsetHeight }, K && K('') } catch (ca) { '' } if (!d || d.width < 0)d = { width: 0, height: 0 } } else d = this.htmlGetBBox(); n.isSVG && (a = d.width, n = d.height, Q && (d.height = n = { '11px,17': 14, '13px,20': 16 }[z && z.fontSize + ',' + Math.round(n)] || n), b && (z = b * l, d.width = Math.abs(n * Math.sin(z)) + Math.abs(a * Math.cos(z)),
          d.height = Math.abs(n * Math.cos(z)) + Math.abs(a * Math.sin(z)))); if (c && d.height > 0) { for (;t.length > 250;) delete h[t.shift()]; h[c] || t.push(c); h[c] = d }
        } return d
      },
      show: function (a) { return this.attr({ visibility: a ? 'inherit' : 'visible' }) },
      hide: function (a) { a ? this.attr({ y: -9999 }) : this.attr({ visibility: 'hidden' }); return this },
      fadeOut: function (a) { const b = this; b.animate({ opacity: 0 }, { duration: a || 150, complete: function () { b.attr({ y: -9999 }) } }) },
      add: function (a) {
        const b = this.renderer; const d = this.element; a && (this.parentGroup = a); this.parentInverted =
a && a.inverted; typeof this.textStr !== 'undefined' && b.buildText(this); this.added = !0; if (!a || a.handleZ || this.zIndex) var n = this.zIndexSetter(); n || (a ? a.element : b.box).appendChild(d); if (this.onAdd) this.onAdd(); return this
      },
      safeRemoveChild: function (a) { const b = a.parentNode; b && b.removeChild(a) },
      destroy: function () {
        const a = this; let b = a.element || {}; const d = a.renderer; let n = d.isSVG && b.nodeName === 'SPAN' && a.parentGroup; let g = b.ownerSVGElement; const f = a.clipPath; b.onclick = b.onmouseout = b.onmouseover = b.onmousemove = b.point = null; z(a); f && g && ([].forEach.call(g.querySelectorAll('[clip-path],[CLIP-PATH]'),
          function (a) { a.getAttribute('clip-path').indexOf(f.element.id) > -1 && a.removeAttribute('clip-path') }), a.clipPath = f.destroy()); if (a.stops) { for (g = 0; g < a.stops.length; g++)a.stops[g] = a.stops[g].destroy(); a.stops = null }a.safeRemoveChild(b); for (d.styledMode || a.destroyShadows(); n && n.div && n.div.childNodes.length === 0;)b = n.parentGroup, a.safeRemoveChild(n.div), delete n.div, n = b; a.alignTo && v(d.alignedObjects, a); m(a, function (b, d) { a[d] && a[d].parentGroup === a && a[d].destroy && a[d].destroy(); delete a[d] })
      },
      shadow: function (a,
        b, d) {
        const n = []; let g; const z = this.element; if (!a) this.destroyShadows(); else if (!this.shadows) {
          const f = r(a.width, 3); const h = (a.opacity || 0.15) / f; const K = this.parentInverted ? '(-1,-1)' : '(' + r(a.offsetX, 1) + ', ' + r(a.offsetY, 1) + ')'; for (g = 1; g <= f; g++) {
            const t = z.cloneNode(0); const l = 2 * f + 1 - 2 * g; I(t, { stroke: a.color || '#000000', 'stroke-opacity': h * g, 'stroke-width': l, transform: 'translate' + K, fill: 'none' }); t.setAttribute('class', (t.getAttribute('class') || '') + ' highcharts-shadow'); d && (I(t, 'height', Math.max(I(t, 'height') - l, 0)), t.cutHeight = l)
            b ? b.element.appendChild(t) : z.parentNode && z.parentNode.insertBefore(t, z); n.push(t)
          } this.shadows = n
        } return this
      },
      destroyShadows: function () { (this.shadows || []).forEach(function (a) { this.safeRemoveChild(a) }, this); this.shadows = void 0 },
      xGetter: function (a) { this.element.nodeName === 'circle' && (a === 'x' ? a = 'cx' : a === 'y' && (a = 'cy')); return this._defaultGetter(a) },
      _defaultGetter: function (a) { a = r(this[a + 'Value'], this[a], this.element ? this.element.getAttribute(a) : null, 0); /^[\-0-9\.]+$/.test(a) && (a = parseFloat(a)); return a },
      dSetter: function (a, b, d) { a && a.join && (a = a.join(' ')); /(NaN| {2}|^$)/.test(a) && (a = 'M 0 0'); this[b] !== a && (d.setAttribute(b, a), this[b] = a) },
      dashstyleSetter: function (a) {
        let b; let d = this['stroke-width']; d === 'inherit' && (d = 1); if (a = a && a.toLowerCase()) {
          a = a.replace('shortdashdotdot', '3,1,1,1,1,1,').replace('shortdashdot', '3,1,1,1').replace('shortdot', '1,1,').replace('shortdash', '3,1,').replace('longdash', '8,3,').replace(/dot/g, '1,3,').replace('dash', '4,3,').replace(/,$/, '').split(','); for (b = a.length; b--;) {
            a[b] = D(a[b]) *
d
          }a = a.join(',').replace(/NaN/g, 'none'); this.element.setAttribute('stroke-dasharray', a)
        }
      },
      alignSetter: function (a) { const b = { left: 'start', center: 'middle', right: 'end' }; b[a] && (this.alignValue = a, this.element.setAttribute('text-anchor', b[a])) },
      opacitySetter: function (a, b, d) { this[b] = a; d.setAttribute(b, a) },
      titleSetter: function (a) {
        let b = this.element.getElementsByTagName('title')[0]; b || (b = y.createElementNS(this.SVG_NS, 'title'), this.element.appendChild(b)); b.firstChild && b.removeChild(b.firstChild); b.appendChild(y.createTextNode(String(r(a,
          '')).replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>')))
      },
      textSetter: function (a) { a !== this.textStr && (delete this.bBox, delete this.textPxLength, this.textStr = a, this.added && this.renderer.buildText(this)) },
      setTextPath: function (a, b) {
        const d = this.element; const n = { textAnchor: 'text-anchor' }; let g = !1; let z = this.textPathWrapper; let f = !z; b = L(!0, { enabled: !0, attributes: { dy: -5, startOffset: '50%', textAnchor: 'middle' } }, b); const h = b.attributes; if (a && b && b.enabled) {
          z && z.element.parentNode === null
            ? (f = !0, z = z.destroy())
            : z && this.removeTextOutline.call(z.parentGroup,
              [].slice.call(d.getElementsByTagName('tspan'))); this.options && this.options.padding && (h.dx = -this.options.padding); z || (this.textPathWrapper = z = this.renderer.createElement('textPath'), g = !0); const t = z.element; (b = a.element.getAttribute('id')) || a.element.setAttribute('id', b = c.uniqueKey()); if (f) for (a = d.getElementsByTagName('tspan'); a.length;)a[0].setAttribute('y', 0), B(h.dx) && a[0].setAttribute('x', -h.dx), t.appendChild(a[0]); g && z.add({ element: this.text ? this.text.element : d }); t.setAttributeNS('http://www.w3.org/1999/xlink',
            'href', this.renderer.url + '#' + b); G(h.dy) && (t.parentNode.setAttribute('dy', h.dy), delete h.dy); G(h.dx) && (t.parentNode.setAttribute('dx', h.dx), delete h.dx); m(h, function (a, b) { t.setAttribute(n[b] || b, a) }); d.removeAttribute('transform'); this.removeTextOutline.call(z, [].slice.call(d.getElementsByTagName('tspan'))); this.text && !this.renderer.styledMode && this.attr({ fill: 'none', 'stroke-width': 0 }); this.applyTextOutline = this.updateTransform = E
        } else {
          z && (delete this.updateTransform, delete this.applyTextOutline, this.destroyTextPath(d,
            a), this.updateTransform(), this.options.rotation && this.applyTextOutline(this.options.style.textOutline))
        } return this
      },
      destroyTextPath: function (a, b) {
        const d = a.getElementsByTagName('text')[0]; if (d) { if (d.removeAttribute('dx'), d.removeAttribute('dy'), b.element.setAttribute('id', ''), d.getElementsByTagName('textPath').length) { for (a = this.textPathWrapper.element.childNodes; a.length;)d.appendChild(a[0]); d.removeChild(this.textPathWrapper.element) } } else if (a.getAttribute('dx') || a.getAttribute('dy')) {
          a.removeAttribute('dx'),
          a.removeAttribute('dy')
        } this.textPathWrapper = this.textPathWrapper.destroy()
      },
      fillSetter: function (a, b, d) { typeof a === 'string' ? d.setAttribute(b, a) : a && this.complexColor(a, b, d) },
      visibilitySetter: function (a, b, d) { a === 'inherit' ? d.removeAttribute(b) : this[b] !== a && d.setAttribute(b, a); this[b] = a },
      zIndexSetter: function (a, b) {
        let d = this.renderer; let n = this.parentGroup; const g = (n || d).element || d.box; const z = this.element; let f = !1; d = g === d.box; let h = this.added; let t; G(a)
          ? (z.setAttribute('data-z-index', a), a = +a, this[b] === a && (h = !1))
          : G(this[b]) &&
z.removeAttribute('data-z-index'); this[b] = a; if (h) { (a = this.zIndex) && n && (n.handleZ = !0); b = g.childNodes; for (t = b.length - 1; t >= 0 && !f; t--) { n = b[t]; h = n.getAttribute('data-z-index'); const l = !G(h); if (n !== z) if (a < 0 && l && !d && !t)g.insertBefore(z, b[t]), f = !0; else if (D(h) <= a || l && (!G(a) || a >= 0))g.insertBefore(z, b[t + 1] || null), f = !0 }f || (g.insertBefore(z, b[d ? 3 : 0] || null), f = !0) } return f
      },
      _defaultSetter: function (a, b, d) { d.setAttribute(b, a) }
    }); P.prototype.yGetter = P.prototype.xGetter; P.prototype.translateXSetter = P.prototype.translateYSetter =
P.prototype.rotationSetter = P.prototype.verticalAlignSetter = P.prototype.rotationOriginXSetter = P.prototype.rotationOriginYSetter = P.prototype.scaleXSetter = P.prototype.scaleYSetter = P.prototype.matrixSetter = function (a, b) { this[b] = a; this.doTransform = !0 }; P.prototype['stroke-widthSetter'] = P.prototype.strokeSetter = function (a, b, d) {
      this[b] = a; this.stroke && this['stroke-width']
        ? (P.prototype.fillSetter.call(this, this.stroke, 'stroke', d), d.setAttribute('stroke-width', this['stroke-width']), this.hasStroke = !0)
        : b ===
'stroke-width' && a === 0 && this.hasStroke
          ? (d.removeAttribute('stroke'), this.hasStroke = !1)
          : this.renderer.styledMode && this['stroke-width'] && (d.setAttribute('stroke-width', this['stroke-width']), this.hasStroke = !0)
    }; e = c.SVGRenderer = function () { this.init.apply(this, arguments) }; q(e.prototype, {
      Element: P,
      SVG_NS: O,
      init: function (a, b, d, n, z, t, l) {
        const K = this.createElement('svg').attr({ version: '1.1', class: 'highcharts-root' }); l || K.css(this.getStyle(n)); n = K.element; a.appendChild(n); I(a, 'dir', 'ltr'); a.innerHTML.indexOf('xmlns') === -1 &&
I(n, 'xmlns', this.SVG_NS); this.isSVG = !0; this.box = n; this.boxWrapper = K; this.alignedObjects = []; this.url = (g || x) && y.getElementsByTagName('base').length ? T.location.href.split('#')[0].replace(/<[^>]*>/g, '').replace(/([\('\)])/g, '\\$1').replace(/ /g, '%20') : ''; this.createElement('desc').add().element.appendChild(y.createTextNode('Created with Highcharts 8.0.0')); this.defs = this.createElement('defs').add(); this.allowHTML = t; this.forExport = z; this.styledMode = l; this.gradients = {}; this.cache = {}; this.cacheKeys = []; this.imgCount =
0; this.setSize(b, d, !1); let c; g && a.getBoundingClientRect && (b = function () { h(a, { left: 0, top: 0 }); c = a.getBoundingClientRect(); h(a, { left: Math.ceil(c.left) - c.left + 'px', top: Math.ceil(c.top) - c.top + 'px' }) }, b(), this.unSubPixelFix = f(T, 'resize', b))
      },
      definition: function (a) {
        function b (a, n) {
          let g; A(a).forEach(function (a) {
            const z = d.createElement(a.tagName); const f = {}; m(a, function (a, b) { b !== 'tagName' && b !== 'children' && b !== 'textContent' && (f[b] = a) }); z.attr(f); z.add(n || d.defs); a.textContent && z.element.appendChild(y.createTextNode(a.textContent))
            b(a.children || [], z); g = z
          }); return g
        } var d = this; return b(a)
      },
      getStyle: function (a) { return this.style = q({ fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif', fontSize: '12px' }, a) },
      setStyle: function (a) { this.boxWrapper.css(this.getStyle(a)) },
      isHidden: function () { return !this.boxWrapper.getBBox().width },
      destroy: function () {
        const a = this.defs; this.box = null; this.boxWrapper = this.boxWrapper.destroy(); H(this.gradients || {}); this.gradients = null; a && (this.defs = a.destroy()); this.unSubPixelFix &&
this.unSubPixelFix(); return this.alignedObjects = null
      },
      createElement: function (a) { const b = new this.Element(); b.init(this, a); return b },
      draw: E,
      getRadialAttr: function (a, b) { return { cx: a[0] - a[2] / 2 + b.cx * a[2], cy: a[1] - a[2] / 2 + b.cy * a[2], r: b.r * a[2] } },
      truncate: function (a, b, d, n, g, z, f) {
        const h = this; const t = a.rotation; let l; let K = n ? 1 : 0; let x = (d || n).length; let c = x; const k = []; const N = function (a) { b.firstChild && b.removeChild(b.firstChild); a && b.appendChild(y.createTextNode(a)) }; const p = function (z, t) {
          t = t || z; if (typeof k[t] === 'undefined') {
            if (b.getSubStringLength) {
              try {
                k[t] =
g + b.getSubStringLength(0, n ? t + 1 : t)
              } catch (ea) { '' }
            } else h.getSpanWidth && (N(f(d || n, z)), k[t] = g + h.getSpanWidth(a, b))
          } return k[t]
        }; let R; a.rotation = 0; let O = p(b.textContent.length); if (R = g + O > z) { for (;K <= x;)c = Math.ceil((K + x) / 2), n && (l = f(n, c)), O = p(c, l && l.length - 1), K === x ? K = x + 1 : O > z ? x = c - 1 : K = c; x === 0 ? N('') : d && x === d.length - 1 || N(l || f(d || n, c)) }n && n.splice(0, c); a.actualWidth = O; a.rotation = t; return R
      },
      escapes: { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' },
      buildText: function (a) {
        const b = a.element; const d = this; const n = d.forExport
        let g = r(a.textStr, '').toString(); const z = g.indexOf('<') !== -1; const f = b.childNodes; let t; const l = I(b, 'x'); let x = a.styles; const c = a.textWidth; const k = x && x.lineHeight; const p = x && x.textOutline; const L = x && x.textOverflow === 'ellipsis'; const E = x && x.whiteSpace === 'nowrap'; const A = x && x.fontSize; let Q; let e = f.length; x = c && !a.added && this.box; const V = function (a) { let n; d.styledMode || (n = /(px|em)$/.test(a && a.style.fontSize) ? a.style.fontSize : A || d.style.fontSize || 12); return k ? D(k) : d.fontMetrics(n, a.getAttribute('style') ? a : b).h }; const q = function (a, b) {
          m(d.escapes, function (d, n) {
            b && b.indexOf(d) !== -1 ||
(a = a.toString().replace(new RegExp(d, 'g'), n))
          }); return a
        }; const P = function (a, b) { let d = a.indexOf('<'); a = a.substring(d, a.indexOf('>') - d); d = a.indexOf(b + '='); if (d !== -1 && (d = d + b.length + 1, b = a.charAt(d), b === '"' || b === "'")) return a = a.substring(d + 1), a.substring(0, a.indexOf(b)) }; const T = /<br.*?>/g; const u = [g, L, E, k, p, A, c].join(); if (u !== a.textCache) {
          for (a.textCache = u; e--;)b.removeChild(f[e]); z || p || L || c || g.indexOf(' ') !== -1 && (!E || T.test(g))
            ? (x && x.appendChild(b), z
                ? (g = d.styledMode
                    ? g.replace(/<(b|strong)>/g, '<span class="highcharts-strong">').replace(/<(i|em)>/g,
                        '<span class="highcharts-emphasized">')
                    : g.replace(/<(b|strong)>/g, '<span style="font-weight:bold">').replace(/<(i|em)>/g, '<span style="font-style:italic">'), g = g.replace(/<a/g, '<span').replace(/<\/(b|strong|i|em|a)>/g, '</span>').split(T))
                : g = [g], g = g.filter(function (a) { return a !== '' }), g.forEach(function (g, z) {
                let f = 0; let x = 0; g = g.replace(/^\s+|\s+$/g, '').replace(/<span/g, '|||<span').replace(/<\/span>/g, '</span>|||'); const K = g.split('|||'); K.forEach(function (g) {
                  if (g !== '' || K.length === 1) {
                    let k = {}; let p = y.createElementNS(d.SVG_NS,
                      'tspan'); let R; let r; (R = P(g, 'class')) && I(p, 'class', R); if (R = P(g, 'style'))R = R.replace(/(;| |^)color([ :])/, '$1fill$2'), I(p, 'style', R); (r = P(g, 'href')) && !n && (I(p, 'onclick', 'location.href="' + r + '"'), I(p, 'class', 'highcharts-anchor'), d.styledMode || h(p, { cursor: 'pointer' })); g = q(g.replace(/<[a-zA-Z\/](.|\n)*?>/g, '') || ' '); if (g !== ' ') {
                      p.appendChild(y.createTextNode(g)); f ? k.dx = 0 : z && l !== null && (k.x = l); I(p, k); b.appendChild(p); !f && Q && (!N && n && h(p, { display: 'block' }), I(p, 'dy', V(p))); if (c) {
                        const m = g.replace(/([^\^])-/g, '$1- ').split(' ')
                        k = !E && (K.length > 1 || z || m.length > 1); r = 0; const e = V(p); if (L)t = d.truncate(a, p, g, void 0, 0, Math.max(0, c - parseInt(A || 12, 10)), function (a, b) { return a.substring(0, b) + '\u2026' }); else if (k) for (;m.length;)m.length && !E && r > 0 && (p = y.createElementNS(O, 'tspan'), I(p, { dy: e, x: l }), R && I(p, 'style', R), p.appendChild(y.createTextNode(m.join(' ').replace(/- /g, '-'))), b.appendChild(p)), d.truncate(a, p, null, m, r === 0 ? x : 0, c, function (a, b) { return m.slice(0, b).join(' ').replace(/- /g, '-') }), x = a.actualWidth, r++
                      }f++
                    }
                  }
                }); Q = Q || b.childNodes.length
              }),
              L && t && a.attr('title', q(a.textStr, ['&lt;', '&gt;'])), x && x.removeChild(b), p && a.applyTextOutline && a.applyTextOutline(p))
            : b.appendChild(y.createTextNode(q(g)))
        }
      },
      getContrast: function (a) { a = d(a).rgba; a[0] *= 1; a[1] *= 1.2; a[2] *= 0.5; return a[0] + a[1] + a[2] > 459 ? '#000000' : '#FFFFFF' },
      button: function (a, b, d, n, g, z, h, l, x, c) {
        const K = this.label(a, b, d, x, null, null, c, null, 'button'); let k = 0; const N = this.styledMode; K.attr(L({ padding: 8, r: 2 }, g)); if (!N) {
          g = L({
            fill: '#f7f7f7',
            stroke: '#cccccc',
            'stroke-width': 1,
            style: {
              color: '#333333',
              cursor: 'pointer',
              fontWeight: 'normal'
            }
          }, g); var p = g.style; delete g.style; z = L(g, { fill: '#e6e6e6' }, z); var O = z.style; delete z.style; h = L(g, { fill: '#e6ebf5', style: { color: '#000000', fontWeight: 'bold' } }, h); var R = h.style; delete h.style; l = L(g, { style: { color: '#cccccc' } }, l); var E = l.style; delete l.style
        }f(K.element, t ? 'mouseover' : 'mouseenter', function () { k !== 3 && K.setState(1) }); f(K.element, t ? 'mouseout' : 'mouseleave', function () { k !== 3 && K.setState(k) }); K.setState = function (a) {
          a !== 1 && (K.state = k = a); K.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass('highcharts-button-' +
['normal', 'hover', 'pressed', 'disabled'][a || 0]); N || K.attr([g, z, h, l][a || 0]).css([p, O, R, E][a || 0])
        }; N || K.attr(g).css(q({ cursor: 'default' }, p)); return K.on('click', function (a) { k !== 3 && n.call(K, a) })
      },
      crispLine: function (a, b) { a[1] === a[4] && (a[1] = a[4] = Math.round(a[1]) - b % 2 / 2); a[2] === a[5] && (a[2] = a[5] = Math.round(a[2]) + b % 2 / 2); return a },
      path: function (a) { const b = this.styledMode ? {} : { fill: 'none' }; C(a) ? b.d = a : u(a) && q(b, a); return this.createElement('path').attr(b) },
      circle: function (a, b, d) {
        a = u(a)
          ? a
          : typeof a === 'undefined'
            ? {}
            : { x: a, y: b, r: d }; b = this.createElement('circle'); b.xSetter = b.ySetter = function (a, b, d) { d.setAttribute('c' + b, a) }; return b.attr(a)
      },
      arc: function (a, b, d, n, g, z) { u(a) ? (n = a, b = n.y, d = n.r, a = n.x) : n = { innerR: n, start: g, end: z }; a = this.symbol('arc', a, b, d, d, n); a.r = d; return a },
      rect: function (a, b, d, n, g, z) {
        g = u(a) ? a.r : g; const f = this.createElement('rect'); a = u(a) ? a : typeof a === 'undefined' ? {} : { x: a, y: b, width: Math.max(d, 0), height: Math.max(n, 0) }; this.styledMode || (typeof z !== 'undefined' && (a.strokeWidth = z, a = f.crisp(a)), a.fill = 'none'); g &&
(a.r = g); f.rSetter = function (a, b, d) { f.r = a; I(d, { rx: a, ry: a }) }; f.rGetter = function () { return f.r }; return f.attr(a)
      },
      setSize: function (a, b, d) { const n = this.alignedObjects; let g = n.length; this.width = a; this.height = b; for (this.boxWrapper.animate({ width: a, height: b }, { step: function () { this.attr({ viewBox: '0 0 ' + this.attr('width') + ' ' + this.attr('height') }) }, duration: r(d, !0) ? void 0 : 0 }); g--;)n[g].align() },
      g: function (a) { const b = this.createElement('g'); return a ? b.attr({ class: 'highcharts-' + a }) : b },
      image: function (a, b, d, n, g, z) {
        let h =
{ preserveAspectRatio: 'none' }; const t = function (a, b) { a.setAttributeNS ? a.setAttributeNS('http://www.w3.org/1999/xlink', 'href', b) : a.setAttribute('hc-svg-href', b) }; const l = function (b) { t(x.element, a); z.call(x, b) }; arguments.length > 1 && q(h, { x: b, y: d, width: n, height: g }); var x = this.createElement('image').attr(h); z ? (t(x.element, 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='), h = new T.Image(), f(h, 'load', l), h.src = a, h.complete && l({})) : t(x.element, a); return x
      },
      symbol: function (b, d, n, g, z, f) {
        const t = this
        const l = /^url\((.*?)\)$/; const x = l.test(b); const c = !x && (this.symbols[b] ? b : 'circle'); const K = c && this.symbols[c]; const N = G(d) && K && K.call(this.symbols, Math.round(d), Math.round(n), g, z, f); if (K) { var p = this.path(N); t.styledMode || p.attr('fill', 'none'); q(p, { symbolName: c, x: d, y: n, width: g, height: z }); f && q(p, f) } else if (x) {
          const O = b.match(l)[1]; p = this.image(O); p.imgwidth = r(V[O] && V[O].width, f && f.width); p.imgheight = r(V[O] && V[O].height, f && f.height); const R = function () { p.attr({ width: p.width, height: p.height }) }; ['width', 'height'].forEach(function (a) {
            p[a +
'Setter'] = function (a, b) { const d = {}; let n = this['img' + b]; const g = b === 'width' ? 'translateX' : 'translateY'; this[b] = a; G(n) && (f && f.backgroundSize === 'within' && this.width && this.height && (n = Math.round(n * Math.min(this.width / this.imgwidth, this.height / this.imgheight))), this.element && this.element.setAttribute(b, n), this.alignByTranslate || (d[g] = ((this[b] || 0) - n) / 2, this.attr(d))) }
          }); G(d) && p.attr({ x: d, y: n }); p.isImg = !0; G(p.imgwidth) && G(p.imgheight)
            ? R()
            : (p.attr({ width: 0, height: 0 }), k('img', {
                onload: function () {
                  const b = a[t.chartIndex]; this.width ===
0 && (h(this, { position: 'absolute', top: '-999em' }), y.body.appendChild(this)); V[O] = { width: this.width, height: this.height }; p.imgwidth = this.width; p.imgheight = this.height; p.element && R(); this.parentNode && this.parentNode.removeChild(this); t.imgCount--; if (!t.imgCount && b && b.onload)b.onload()
                },
                src: O
              }), this.imgCount++)
        } return p
      },
      symbols: {
        circle: function (a, b, d, n) { return this.arc(a + d / 2, b + n / 2, d / 2, n / 2, { start: 0.5 * Math.PI, end: 2.5 * Math.PI, open: !1 }) },
        square: function (a, b, d, n) {
          return ['M', a, b, 'L', a + d, b, a + d, b + n, a, b +
n, 'Z']
        },
        triangle: function (a, b, d, n) { return ['M', a + d / 2, b, 'L', a + d, b + n, a, b + n, 'Z'] },
        'triangle-down': function (a, b, d, n) { return ['M', a, b, 'L', a + d, b, a + d / 2, b + n, 'Z'] },
        diamond: function (a, b, d, n) { return ['M', a + d / 2, b, 'L', a + d, b + n / 2, a + d / 2, b + n, a, b + n / 2, 'Z'] },
        arc: function (a, b, d, n, g) {
          let z = g.start; let f = g.r || d; const h = g.r || n || d; let t = g.end - 0.001; d = g.innerR; n = r(g.open, Math.abs(g.end - g.start - 2 * Math.PI) < 0.001); const l = Math.cos(z); const x = Math.sin(z); const c = Math.cos(t); t = Math.sin(t); z = r(g.longArc, g.end - z - Math.PI < 0.001 ? 0 : 1); f = ['M', a + f * l, b + h * x, 'A', f, h, 0, z,
            r(g.clockwise, 1), a + f * c, b + h * t]; G(d) && f.push(n ? 'M' : 'L', a + d * c, b + d * t, 'A', d, d, 0, z, G(g.clockwise) ? 1 - g.clockwise : 0, a + d * l, b + d * x); f.push(n ? '' : 'Z'); return f
        },
        callout: function (a, b, d, n, g) {
          const z = Math.min(g && g.r || 0, d, n); const f = z + 6; const h = g && g.anchorX; g = g && g.anchorY; const t = ['M', a + z, b, 'L', a + d - z, b, 'C', a + d, b, a + d, b, a + d, b + z, 'L', a + d, b + n - z, 'C', a + d, b + n, a + d, b + n, a + d - z, b + n, 'L', a + z, b + n, 'C', a, b + n, a, b + n, a, b + n - z, 'L', a, b + z, 'C', a, b, a, b, a + z, b]; h && h > d
            ? g > b + f && g < b + n - f
                ? t.splice(13, 3, 'L', a + d, g - 6, a + d + 6, g, a + d, g + 6, a + d, b + n - z)
                : t.splice(13, 3, 'L', a + d,
                  n / 2, h, g, a + d, n / 2, a + d, b + n - z)
            : h && h < 0 ? g > b + f && g < b + n - f ? t.splice(33, 3, 'L', a, g + 6, a - 6, g, a, g - 6, a, b + z) : t.splice(33, 3, 'L', a, n / 2, h, g, a, n / 2, a, b + z) : g && g > n && h > a + f && h < a + d - f ? t.splice(23, 3, 'L', h + 6, b + n, h, b + n + 6, h - 6, b + n, a + z, b + n) : g && g < 0 && h > a + f && h < a + d - f && t.splice(3, 3, 'L', h - 6, b, h, b - 6, h + 6, b, d - z, b); return t
        }
      },
      clipRect: function (a, b, d, n) { const g = c.uniqueKey() + '-'; const z = this.createElement('clipPath').attr({ id: g }).add(this.defs); a = this.rect(a, b, d, n, 0).add(z); a.id = g; a.clipPath = z; a.count = 0; return a },
      text: function (a, b, d, n) {
        const g = {}; if (n &&
(this.allowHTML || !this.forExport)) return this.html(a, b, d); g.x = Math.round(b || 0); d && (g.y = Math.round(d)); G(a) && (g.text = a); a = this.createElement('text').attr(g); n || (a.xSetter = function (a, b, d) { const n = d.getElementsByTagName('tspan'); const g = d.getAttribute(b); let z; for (z = 0; z < n.length; z++) { const f = n[z]; f.getAttribute(b) === g && f.setAttribute(b, a) }d.setAttribute(b, a) }); return a
      },
      fontMetrics: function (a, b) {
        a = !this.styledMode && /px/.test(a) || !T.getComputedStyle
          ? a || b && b.style && b.style.fontSize || this.style && this.style.fontSize
          : b && P.prototype.getStyle.call(b, 'font-size'); a = /px/.test(a) ? D(a) : 12; b = a < 24 ? a + 3 : Math.round(1.2 * a); return { h: b, b: Math.round(0.8 * b), f: a }
      },
      rotCorr: function (a, b, d) { let n = a; b && d && (n = Math.max(n * Math.cos(b * l), 4)); return { x: -a / 3 * Math.sin(b * l), y: n } },
      label: function (a, b, d, g, z, f, h, t, l) {
        let x = this; const c = x.styledMode; let k = x.g(l !== 'button' && 'label'); let p = k.text = x.text('', 0, 0, h).attr({ zIndex: 1 }); let N; let K; let O = 0; let E = 3; let r = 0; let A; let y; let m; let R; let e; let D = {}; let V; let T; const da = /^url\((.*?)\)$/.test(g); let u = c || da; const v = function () {
          return c
            ? N.strokeWidth() % 2 / 2
            : (V ? parseInt(V, 10) : 0) %
2 / 2
        }; l && k.addClass('highcharts-' + l); let w = function () {
          let a = p.element.style; const b = {}; K = (typeof A === 'undefined' || typeof y === 'undefined' || e) && G(p.textStr) && p.getBBox(); k.width = (A || K.width || 0) + 2 * E + r; k.height = (y || K.height || 0) + 2 * E; T = E + Math.min(x.fontMetrics(a && a.fontSize, p).b, K ? K.height : Infinity); u && (N || (k.box = N = x.symbols[g] || da ? x.symbol(g) : x.rect(), N.addClass((l === 'button' ? '' : 'highcharts-label-box') + (l ? ' highcharts-' + l + '-box' : '')), N.add(k), a = v(), b.x = a, b.y = (t ? -T : 0) + a), b.width = Math.round(k.width), b.height = Math.round(k.height),
          N.attr(q(b, D)), D = {})
        }; let Q = function () { let a = r + E; const b = t ? 0 : T; G(A) && K && (e === 'center' || e === 'right') && (a += { center: 0.5, right: 1 }[e] * (A - K.width)); if (a !== p.x || b !== p.y)p.attr('x', a), p.hasBoxWidthChanged && (K = p.getBBox(!0), w()), typeof b !== 'undefined' && p.attr('y', b); p.x = a; p.y = b }; let U = function (a, b) { N ? N.attr(a, b) : D[a] = b }; k.onAdd = function () { p.add(k); k.attr({ text: a || a === 0 ? a : '', x: b, y: d }); N && G(z) && k.attr({ anchorX: z, anchorY: f }) }; k.widthSetter = function (a) { A = B(a) ? a : null }; k.heightSetter = function (a) { y = a }; k['text-alignSetter'] =
function (a) { e = a }; k.paddingSetter = function (a) { G(a) && a !== E && (E = k.padding = a, Q()) }; k.paddingLeftSetter = function (a) { G(a) && a !== r && (r = a, Q()) }; k.alignSetter = function (a) { a = { left: 0, center: 0.5, right: 1 }[a]; a !== O && (O = a, K && k.attr({ x: m })) }; k.textSetter = function (a) { typeof a !== 'undefined' && p.attr({ text: a }); w(); Q() }; k['stroke-widthSetter'] = function (a, b) { a && (u = !0); V = this['stroke-width'] = a; U(b, a) }; c
          ? k.rSetter = function (a, b) { U(b, a) }
          : k.strokeSetter = k.fillSetter = k.rSetter = function (a, b) {
            b !== 'r' && (b === 'fill' && a && (u = !0), k[b] =
a); U(b, a)
          }; k.anchorXSetter = function (a, b) { z = k.anchorX = a; U(b, Math.round(a) - v() - m) }; k.anchorYSetter = function (a, b) { f = k.anchorY = a; U(b, a - R) }; k.xSetter = function (a) { k.x = a; O && (a -= O * ((A || K.width) + 2 * E), k['forceAnimate:x'] = !0); m = Math.round(a); k.attr('translateX', m) }; k.ySetter = function (a) { R = k.y = Math.round(a); k.attr('translateY', R) }; const C = k.css; h = {
          css: function (a) {
            if (a) {
              const b = {}; a = L(a); k.textProps.forEach(function (d) { typeof a[d] !== 'undefined' && (b[d] = a[d], delete a[d]) }); p.css(b); 'width' in b && w(); 'fontSize' in b &&
(w(), Q())
            } return C.call(k, a)
          },
          getBBox: function () { return { width: K.width + 2 * E, height: K.height + 2 * E, x: K.x - E, y: K.y - E } },
          destroy: function () { n(k.element, 'mouseenter'); n(k.element, 'mouseleave'); p && (p = p.destroy()); N && (N = N.destroy()); P.prototype.destroy.call(k); k = x = w = Q = U = null }
        }; c || (h.shadow = function (a) { a && (w(), N && N.shadow(a)); return k }); return q(k, h)
      }
    }); c.Renderer = e
  }); M(J, 'parts/Html.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.attr; const I = e.defined; const G = e.extend; const H = e.pick; const v = e.pInt; const q = c.createElement
    const C = c.css; const B = c.isFirefox; const u = c.isMS; const w = c.isWebKit; const m = c.SVGElement; e = c.SVGRenderer; const r = c.win; G(m.prototype, {
      htmlCss: function (c) { const r = this.element.tagName === 'SPAN' && c && 'width' in c; const f = H(r && c.width, void 0); if (r) { delete c.width; this.textWidth = f; var b = !0 }c && c.textOverflow === 'ellipsis' && (c.whiteSpace = 'nowrap', c.overflow = 'hidden'); this.styles = G(this.styles, c); C(this.element, c); b && this.htmlUpdateTransform(); return this },
      htmlGetBBox: function () {
        const c = this.element; return {
          x: c.offsetLeft,
          y: c.offsetTop,
          width: c.offsetWidth,
          height: c.offsetHeight
        }
      },
      htmlUpdateTransform: function () {
        if (this.added) {
          const c = this.renderer; const r = this.element; const f = this.translateX || 0; const b = this.translateY || 0; const a = this.x || 0; const d = this.y || 0; const h = this.textAlign || 'left'; const k = { left: 0, center: 0.5, right: 1 }[h]; let l = this.styles; let y = l && l.whiteSpace; C(r, { marginLeft: f, marginTop: b }); !c.styledMode && this.shadows && this.shadows.forEach(function (a) { C(a, { marginLeft: f + 1, marginTop: b + 1 }) }); this.inverted && [].forEach.call(r.childNodes, function (a) { c.invertChild(a, r) }); if (r.tagName === 'SPAN') {
            l = this.rotation
            const p = this.textWidth && v(this.textWidth); const g = [l, h, r.innerHTML, this.textWidth, this.textAlign].join(); let t; (t = p !== this.oldTextWidth) && !(t = p > this.oldTextWidth) && ((t = this.textPxLength) || (C(r, { width: '', whiteSpace: y || 'nowrap' }), t = r.offsetWidth), t = t > p); t && (/[ \-]/.test(r.textContent || r.innerText) || r.style.textOverflow === 'ellipsis') ? (C(r, { width: p + 'px', display: 'block', whiteSpace: y || 'normal' }), this.oldTextWidth = p, this.hasBoxWidthChanged = !0) : this.hasBoxWidthChanged = !1; g !== this.cTT && (y = c.fontMetrics(r.style.fontSize,
              r).b, !I(l) || l === (this.oldRotation || 0) && h === this.oldAlign || this.setSpanRotation(l, k, y), this.getSpanCorrection(!I(l) && this.textPxLength || r.offsetWidth, y, k, l, h)); C(r, { left: a + (this.xCorr || 0) + 'px', top: d + (this.yCorr || 0) + 'px' }); this.cTT = g; this.oldRotation = l; this.oldAlign = h
          }
        } else this.alignOnAdd = !0
      },
      setSpanRotation: function (c, r, f) { const b = {}; const a = this.renderer.getTransformKey(); b[a] = b.transform = 'rotate(' + c + 'deg)'; b[a + (B ? 'Origin' : '-origin')] = b.transformOrigin = 100 * r + '% ' + f + 'px'; C(this.element, b) },
      getSpanCorrection: function (c,
        r, f) { this.xCorr = -c * f; this.yCorr = -r }
    }); G(e.prototype, {
      getTransformKey: function () { return u && !/Edge/.test(r.navigator.userAgent) ? '-ms-transform' : w ? '-webkit-transform' : B ? 'MozTransform' : r.opera ? '-o-transform' : '' },
      html: function (c, r, f) {
        const b = this.createElement('span'); const a = b.element; const d = b.renderer; const h = d.isSVG; const k = function (a, b) { ['opacity', 'visibility'].forEach(function (d) { a[d + 'Setter'] = function (g, f, h) { const t = a.div ? a.div.style : b; m.prototype[d + 'Setter'].call(this, g, f, h); t && (t[f] = g) } }); a.addedSetters = !0 }; b.textSetter =
function (d) { d !== a.innerHTML && (delete this.bBox, delete this.oldTextWidth); this.textStr = d; a.innerHTML = H(d, ''); b.doTransform = !0 }; h && k(b, b.element.style); b.xSetter = b.ySetter = b.alignSetter = b.rotationSetter = function (a, d) { d === 'align' && (d = 'textAlign'); b[d] = a; b.doTransform = !0 }; b.afterSetters = function () { this.doTransform && (this.htmlUpdateTransform(), this.doTransform = !1) }; b.attr({ text: c, x: Math.round(r), y: Math.round(f) }).css({ position: 'absolute' }); d.styledMode || b.css({ fontFamily: this.style.fontFamily, fontSize: this.style.fontSize })
        a.style.whiteSpace = 'nowrap'; b.css = b.htmlCss; h && (b.add = function (f) {
          const h = d.box.parentNode; const l = []; if (this.parentGroup = f) {
            var g = f.div; if (!g) {
              for (;f;)l.push(f), f = f.parentGroup; l.reverse().forEach(function (a) {
                function d (b, d) { a[d] = b; d === 'translateX' ? t.left = b + 'px' : t.top = b + 'px'; a.doTransform = !0 } const f = F(a.element, 'class'); g = a.div = a.div || q('div', f ? { className: f } : void 0, { position: 'absolute', left: (a.translateX || 0) + 'px', top: (a.translateY || 0) + 'px', display: a.display, opacity: a.opacity, pointerEvents: a.styles && a.styles.pointerEvents },
                  g || h); var t = g.style; G(a, { classSetter: (function (a) { return function (b) { this.element.setAttribute('class', b); a.className = b } }(g)), on: function () { l[0].div && b.on.apply({ element: l[0].div }, arguments); return a }, translateXSetter: d, translateYSetter: d }); a.addedSetters || k(a)
              })
            }
          } else g = h; g.appendChild(a); b.added = !0; b.alignOnAdd && b.htmlUpdateTransform(); return b
        }); return b
      }
    })
  }); M(J, 'parts/Time.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.defined; const I = e.extend; const G = e.isObject; const H = e.objectEach; const v =
e.pad; const q = e.pick; const C = e.splat; const B = c.merge; const u = c.timeUnits; const w = c.win; c.Time = function (c) { this.update(c, !1) }; c.Time.prototype = {
      defaultOptions: { Date: void 0, getTimezoneOffset: void 0, timezone: void 0, timezoneOffset: 0, useUTC: !0 },
      update: function (c) {
        const r = q(c && c.useUTC, !0); const m = this; this.options = c = B(!0, this.options || {}, c); this.Date = c.Date || w.Date || Date; this.timezoneOffset = (this.useUTC = r) && c.timezoneOffset; this.getTimezoneOffset = this.timezoneOffsetFunction(); (this.variableTimezone = !(r && !c.getTimezoneOffset && !c.timezone)) ||
this.timezoneOffset
          ? (this.get = function (c, f) { const b = f.getTime(); const a = b - m.getTimezoneOffset(f); f.setTime(a); c = f['getUTC' + c](); f.setTime(b); return c }, this.set = function (c, f, b) { if (c === 'Milliseconds' || c === 'Seconds' || c === 'Minutes' && f.getTimezoneOffset() % 60 === 0)f['set' + c](b); else { let a = m.getTimezoneOffset(f); a = f.getTime() - a; f.setTime(a); f['setUTC' + c](b); c = m.getTimezoneOffset(f); a = f.getTime() + c; f.setTime(a) } })
          : r
            ? (this.get = function (c, f) { return f['getUTC' + c]() }, this.set = function (c, f, b) { return f['setUTC' + c](b) })
            : (this.get = function (c, f) { return f['get' + c]() }, this.set = function (c, f, b) { return f['set' + c](b) })
      },
      makeTime: function (m, r, e, A, f, b) { if (this.useUTC) { var a = this.Date.UTC.apply(0, arguments); const d = this.getTimezoneOffset(a); a += d; const h = this.getTimezoneOffset(a); d !== h ? a += h - d : d - 36E5 !== this.getTimezoneOffset(a - 36E5) || c.isSafari || (a -= 36E5) } else a = (new this.Date(m, r, q(e, 1), q(A, 0), q(f, 0), q(b, 0))).getTime(); return a },
      timezoneOffsetFunction: function () {
        const m = this; const r = this.options; const e = w.moment; if (!this.useUTC) {
          return function (c) {
            return 6E4 *
(new Date(c)).getTimezoneOffset()
          }
        } if (r.timezone) { if (e) return function (c) { return 6E4 * -e.tz(c, r.timezone).utcOffset() }; c.error(25) } return this.useUTC && r.getTimezoneOffset ? function (c) { return 6E4 * r.getTimezoneOffset(c) } : function () { return 6E4 * (m.timezoneOffset || 0) }
      },
      dateFormat: function (m, r, e) {
        if (!F(r) || isNaN(r)) return c.defaultOptions.lang.invalidDate || ''; m = q(m, '%Y-%m-%d %H:%M:%S'); const A = this; let f = new this.Date(r); const b = this.get('Hours', f); const a = this.get('Day', f); const d = this.get('Date', f); const h = this.get('Month', f); const k = this.get('FullYear',
          f); const l = c.defaultOptions.lang; const y = l.weekdays; const p = l.shortWeekdays; f = I({ a: p ? p[a] : y[a].substr(0, 3), A: y[a], d: v(d), e: v(d, 2, ' '), w: a, b: l.shortMonths[h], B: l.months[h], m: v(h + 1), o: h + 1, y: k.toString().substr(2, 2), Y: k, H: v(b), k: b, I: v(b % 12 || 12), l: b % 12 || 12, M: v(A.get('Minutes', f)), p: b < 12 ? 'AM' : 'PM', P: b < 12 ? 'am' : 'pm', S: v(f.getSeconds()), L: v(Math.floor(r % 1E3), 3) }, c.dateFormats); H(f, function (a, b) { for (;m.indexOf('%' + b) !== -1;)m = m.replace('%' + b, typeof a === 'function' ? a.call(A, r) : a) }); return e
          ? m.substr(0, 1).toUpperCase() + m.substr(1)
          : m
      },
      resolveDTLFormat: function (c) { return G(c, !0) ? c : (c = C(c), { main: c[0], from: c[1], to: c[2] }) },
      getTimeTicks: function (c, r, e, A) {
        const f = this; const b = []; const a = {}; let d = new f.Date(r); const h = c.unitRange; const k = c.count || 1; let l; A = q(A, 1); if (F(r)) {
          f.set('Milliseconds', d, h >= u.second ? 0 : k * Math.floor(f.get('Milliseconds', d) / k)); h >= u.second && f.set('Seconds', d, h >= u.minute ? 0 : k * Math.floor(f.get('Seconds', d) / k)); h >= u.minute && f.set('Minutes', d, h >= u.hour ? 0 : k * Math.floor(f.get('Minutes', d) / k)); h >= u.hour && f.set('Hours', d, h >= u.day
            ? 0
            : k * Math.floor(f.get('Hours',
              d) / k)); h >= u.day && f.set('Date', d, h >= u.month ? 1 : Math.max(1, k * Math.floor(f.get('Date', d) / k))); if (h >= u.month) { f.set('Month', d, h >= u.year ? 0 : k * Math.floor(f.get('Month', d) / k)); var y = f.get('FullYear', d) }h >= u.year && f.set('FullYear', d, y - y % k); h === u.week && (y = f.get('Day', d), f.set('Date', d, f.get('Date', d) - y + A + (y < A ? -7 : 0))); y = f.get('FullYear', d); A = f.get('Month', d); const p = f.get('Date', d); const g = f.get('Hours', d); r = d.getTime(); f.variableTimezone && (l = e - r > 4 * u.month || f.getTimezoneOffset(r) !== f.getTimezoneOffset(e)); r = d.getTime()
          for (d = 1; r < e;)b.push(r), r = h === u.year ? f.makeTime(y + d * k, 0) : h === u.month ? f.makeTime(y, A + d * k) : !l || h !== u.day && h !== u.week ? l && h === u.hour && k > 1 ? f.makeTime(y, A, p, g + d * k) : r + h * k : f.makeTime(y, A, p + d * k * (h === u.day ? 1 : 7)), d++; b.push(r); h <= u.hour && b.length < 1E4 && b.forEach(function (b) { b % 18E5 === 0 && f.dateFormat('%H%M%S%L', b) === '000000000' && (a[b] = 'day') })
        }b.info = I(c, { higherRanks: a, totalRange: h * k }); return b
      }
    }
  }); M(J, 'parts/Options.js', [J['parts/Globals.js']], function (c) {
    const e = c.color; const F = c.merge; c.defaultOptions = {
      colors: '#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1'.split(' '),
      symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],
      lang: { loading: 'Loading...', months: 'January February March April May June July August September October November December'.split(' '), shortMonths: 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '), weekdays: 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '), decimalPoint: '.', numericSymbols: 'kMGTPE'.split(''), resetZoom: 'Reset zoom', resetZoomTitle: 'Reset zoom level 1:1', thousandsSep: ' ' },
      global: {},
      time: c.Time.prototype.defaultOptions,
      chart: { styledMode: !1, borderRadius: 0, colorCount: 10, defaultSeriesType: 'line', ignoreHiddenSeries: !0, spacing: [10, 10, 15, 10], resetZoomButton: { theme: { zIndex: 6 }, position: { align: 'right', x: -10, y: 10 } }, width: null, height: null, borderColor: '#335cad', backgroundColor: '#ffffff', plotBorderColor: '#cccccc' },
      title: { text: 'Chart title', align: 'center', margin: 15, widthAdjust: -44 },
      subtitle: { text: '', align: 'center', widthAdjust: -44 },
      caption: { margin: 15, text: '', align: 'left', verticalAlign: 'bottom' },
      plotOptions: {},
      labels: {
        style: {
          position: 'absolute',
          color: '#333333'
        }
      },
      legend: {
        enabled: !0,
        align: 'center',
        alignColumns: !0,
        layout: 'horizontal',
        labelFormatter: function () { return this.name },
        borderColor: '#999999',
        borderRadius: 0,
        navigation: { activeColor: '#003399', inactiveColor: '#cccccc' },
        itemStyle: { color: '#333333', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', textOverflow: 'ellipsis' },
        itemHoverStyle: { color: '#000000' },
        itemHiddenStyle: { color: '#cccccc' },
        shadow: !1,
        itemCheckboxStyle: { position: 'absolute', width: '13px', height: '13px' },
        squareSymbol: !0,
        symbolPadding: 5,
        verticalAlign: 'bottom',
        x: 0,
        y: 0,
        title: { style: { fontWeight: 'bold' } }
      },
      loading: { labelStyle: { fontWeight: 'bold', position: 'relative', top: '45%' }, style: { position: 'absolute', backgroundColor: '#ffffff', opacity: 0.5, textAlign: 'center' } },
      tooltip: {
        enabled: !0,
        animation: c.svg,
        borderRadius: 3,
        dateTimeLabelFormats: { millisecond: '%A, %b %e, %H:%M:%S.%L', second: '%A, %b %e, %H:%M:%S', minute: '%A, %b %e, %H:%M', hour: '%A, %b %e, %H:%M', day: '%A, %b %e, %Y', week: 'Week from %A, %b %e, %Y', month: '%B %Y', year: '%Y' },
        footerFormat: '',
        padding: 8,
        snap: c.isTouchDevice ? 25 : 10,
        headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
        pointFormat: '<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>',
        backgroundColor: e('#f7f7f7').setOpacity(0.85).get(),
        borderWidth: 1,
        shadow: !0,
        style: { color: '#333333', cursor: 'default', fontSize: '12px', pointerEvents: 'none', whiteSpace: 'nowrap' }
      },
      credits: {
        enabled: !0,
        href: 'https://www.highcharts.com?credits',
        position: { align: 'right', x: -10, verticalAlign: 'bottom', y: -5 },
        style: {
          cursor: 'pointer',
          color: '#999999',
          fontSize: '9px'
        },
        text: 'Highcharts.com'
      }
    }; c.setOptions = function (e) { c.defaultOptions = F(!0, c.defaultOptions, e); (e.time || e.global) && c.time.update(F(c.defaultOptions.global, c.defaultOptions.time, e.global, e.time)); return c.defaultOptions }; c.getOptions = function () { return c.defaultOptions }; c.defaultPlotOptions = c.defaultOptions.plotOptions; c.time = new c.Time(F(c.defaultOptions.global, c.defaultOptions.time)); c.dateFormat = function (e, G, H) { return c.time.dateFormat(e, G, H) }; ''
  }); M(J, 'parts/Tick.js',
    [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
      const F = e.clamp; const I = e.correctFloat; const G = e.defined; const H = e.destroyObjectProperties; const v = e.extend; const q = e.isNumber; const C = e.objectEach; const B = e.pick; const u = c.fireEvent; const w = c.merge; const m = c.deg2rad; c.Tick = function (c, e, m, f, b) { this.axis = c; this.pos = e; this.type = m || ''; this.isNewLabel = this.isNew = !0; this.parameters = b || {}; this.tickmarkOffset = this.parameters.tickmarkOffset; this.options = this.parameters.options; m || f || this.addLabel() }; c.Tick.prototype = {
        addLabel: function () {
          const c = this; const e = c.axis
          let m = e.options; const f = e.chart; let b = e.categories; let a = e.names; const d = c.pos; const h = B(c.options && c.options.labels, m.labels); let k = e.tickPositions; const l = d === k[0]; const y = d === k[k.length - 1]; a = this.parameters.category || (b ? B(b[d], a[d], d) : d); let p = c.label; b = (!h.step || h.step === 1) && e.tickInterval === 1; k = k.info; let g, t; if (e.isDatetimeAxis && k) { var x = f.time.resolveDTLFormat(m.dateTimeLabelFormats[!m.grid && k.higherRanks[d] || k.unitName]); var L = x.main }c.isFirst = l; c.isLast = y; c.formatCtx = {
            axis: e,
            chart: f,
            isFirst: l,
            isLast: y,
            dateTimeLabelFormat: L,
            tickPositionInfo: k,
            value: e.isLog ? I(e.lin2log(a)) : a,
            pos: d
          }; m = e.labelFormatter.call(c.formatCtx, this.formatCtx); if (t = x && x.list)c.shortenLabel = function () { for (g = 0; g < t.length; g++) if (p.attr({ text: e.labelFormatter.call(v(c.formatCtx, { dateTimeLabelFormat: t[g] })) }), p.getBBox().width < e.getSlotWidth(c) - 2 * B(h.padding, 5)) return; p.attr({ text: '' }) }; b && e._addedPlotLB && e.isXAxis && c.moveLabel(m, h); G(p) || c.movedLabel
            ? p && p.textStr !== m && !b && (!p.textWidth || h.style && h.style.width || p.styles.width || p.css({ width: null }), p.attr({ text: m }), p.textPxLength =
p.getBBox().width)
            : (c.label = p = c.createLabel({ x: 0, y: 0 }, m, h), c.rotation = 0)
        },
        moveLabel: function (c, e) {
          const r = this; let f = r.label; let b = !1; let a = r.axis; const d = a.reversed; const h = a.chart.inverted; f && f.textStr === c ? (r.movedLabel = f, b = !0, delete r.label) : C(a.ticks, function (a) { b || a.isNew || a === r || !a.label || a.label.textStr !== c || (r.movedLabel = a.label, b = !0, a.labelPos = r.movedLabel.xy, delete a.label) }); if (!b && (r.labelPos || f)) {
            const k = r.labelPos || f.xy; f = h ? k.x : d ? 0 : a.width + a.left; a = h ? d ? a.width + a.left : 0 : k.y; r.movedLabel = r.createLabel({ x: f, y: a },
              c, e); r.movedLabel && r.movedLabel.attr({ opacity: 0 })
          }
        },
        createLabel: function (c, e, m) { const f = this.axis; const b = f.chart; if (c = G(e) && m.enabled ? b.renderer.text(e, c.x, c.y, m.useHTML).add(f.labelGroup) : null)b.styledMode || c.css(w(m.style)), c.textPxLength = c.getBBox().width; return c },
        replaceMovedLabel: function () {
          const c = this.label; const e = this.axis; let m = e.reversed; const f = this.axis.chart.inverted; if (c && !this.isNew) { const b = f ? c.xy.x : m ? e.left : e.width + e.left; m = f ? m ? e.width + e.top : e.top : c.xy.y; c.animate({ x: b, y: m, opacity: 0 }, void 0, c.destroy); delete this.label }e.isDirty =
!0; this.label = this.movedLabel; delete this.movedLabel
        },
        getLabelSize: function () { return this.label ? this.label.getBBox()[this.axis.horiz ? 'height' : 'width'] : 0 },
        handleOverflow: function (c) {
          const e = this.axis; const r = e.options.labels; const f = c.x; let b = e.chart.chartWidth; let a = e.chart.spacing; const d = B(e.labelLeft, Math.min(e.pos, a[3])); a = B(e.labelRight, Math.max(e.isRadial ? 0 : e.pos + e.len, b - a[1])); const h = this.label; const k = this.rotation; const l = { left: 0, center: 0.5, right: 1 }[e.labelAlign || h.attr('align')]; const y = h.getBBox().width; const p = e.getSlotWidth(this); let g = p; let t =
1; let x; const L = {}; if (k || B(r.overflow, 'justify') !== 'justify')k < 0 && f - l * y < d ? x = Math.round(f / Math.cos(k * m) - d) : k > 0 && f + l * y > a && (x = Math.round((b - f) / Math.cos(k * m))); else if (b = f + (1 - l) * y, f - l * y < d ? g = c.x + g * (1 - l) - d : b > a && (g = a - c.x + g * l, t = -1), g = Math.min(p, g), g < p && e.labelAlign === 'center' && (c.x += t * (p - g - l * (p - Math.min(y, g)))), y > g || e.autoRotation && (h.styles || {}).width)x = g; x && (this.shortenLabel ? this.shortenLabel() : (L.width = Math.floor(x), (r.style || {}).textOverflow || (L.textOverflow = 'ellipsis'), h.css(L)))
        },
        getPosition: function (c, e, m,
          f) { const b = this.axis; const a = b.chart; const d = f && a.oldChartHeight || a.chartHeight; c = { x: c ? I(b.translate(e + m, null, null, f) + b.transB) : b.left + b.offset + (b.opposite ? (f && a.oldChartWidth || a.chartWidth) - b.right - b.left : 0), y: c ? d - b.bottom + b.offset - (b.opposite ? b.height : 0) : I(d - b.translate(e + m, null, null, f) - b.transB) }; c.y = F(c.y, -1E5, 1E5); u(this, 'afterGetPosition', { pos: c }); return c },
        getLabelPosition: function (c, e, A, f, b, a, d, h) {
          const k = this.axis; const l = k.transA; const r = k.isLinked && k.linkedParent ? k.linkedParent.reversed : k.reversed; const p = k.staggerLines
          const g = k.tickRotCorr || { x: 0, y: 0 }; let t = b.y; const x = f || k.reserveSpaceDefault ? 0 : -k.labelOffset * (k.labelAlign === 'center' ? 0.5 : 1); const L = {}; G(t) || (t = k.side === 0 ? A.rotation ? -8 : -A.getBBox().height : k.side === 2 ? g.y + 8 : Math.cos(A.rotation * m) * (g.y - A.getBBox(!1, 0).height / 2)); c = c + b.x + x + g.x - (a && f ? a * l * (r ? -1 : 1) : 0); e = e + t - (a && !f ? a * l * (r ? 1 : -1) : 0); p && (A = d / (h || 1) % p, k.opposite && (A = p - A - 1), e += k.labelOffset / p * A); L.x = c; L.y = Math.round(e); u(this, 'afterGetLabelPosition', { pos: L, tickmarkOffset: a, index: d }); return L
        },
        getMarkPath: function (c, e, m, f, b, a) {
          return a.crispLine(['M',
            c, e, 'L', c + (b ? 0 : -m), e + (b ? m : 0)], f)
        },
        renderGridLine: function (c, e, m) {
          const f = this.axis; let b = f.options; let a = this.gridLine; const d = {}; const h = this.pos; const k = this.type; const l = B(this.tickmarkOffset, f.tickmarkOffset); const r = f.chart.renderer; const p = k ? k + 'Grid' : 'grid'; const g = b[p + 'LineWidth']; const t = b[p + 'LineColor']; b = b[p + 'LineDashStyle']; a || (f.chart.styledMode || (d.stroke = t, d['stroke-width'] = g, b && (d.dashstyle = b)), k || (d.zIndex = 1), c && (e = 0), this.gridLine = a = r.path().attr(d).addClass('highcharts-' + (k ? k + '-' : '') + 'grid-line').add(f.gridGroup)); if (a && (m = f.getPlotLinePath({
            value: h +
l,
            lineWidth: a.strokeWidth() * m,
            force: 'pass',
            old: c
          })))a[c || this.isNew ? 'attr' : 'animate']({ d: m, opacity: e })
        },
        renderMark: function (c, e, m) {
          const f = this.axis; let b = f.options; const a = f.chart.renderer; const d = this.type; const h = d ? d + 'Tick' : 'tick'; const k = f.tickSize(h); let l = this.mark; const r = !l; const p = c.x; c = c.y; const g = B(b[h + 'Width'], !d && f.isXAxis ? 1 : 0); b = b[h + 'Color']; k && (f.opposite && (k[0] = -k[0]), r && (this.mark = l = a.path().addClass('highcharts-' + (d ? d + '-' : '') + 'tick').add(f.axisGroup), f.chart.styledMode || l.attr({ stroke: b, 'stroke-width': g })), l[r ? 'attr' : 'animate']({
            d: this.getMarkPath(p,
              c, k[0], l.strokeWidth() * m, f.horiz, a),
            opacity: e
          }))
        },
        renderLabel: function (c, e, m, f) {
          let b = this.axis; const a = b.horiz; const d = b.options; const h = this.label; const k = d.labels; const l = k.step; b = B(this.tickmarkOffset, b.tickmarkOffset); let y = !0; const p = c.x; c = c.y; h && q(p) && (h.xy = c = this.getLabelPosition(p, c, h, a, k, b, f, l), this.isFirst && !this.isLast && !B(d.showFirstLabel, 1) || this.isLast && !this.isFirst && !B(d.showLastLabel, 1) ? y = !1 : !a || k.step || k.rotation || e || m === 0 || this.handleOverflow(c), l && f % l && (y = !1), y && q(c.y)
            ? (c.opacity = m, h[this.isNewLabel ? 'attr' : 'animate'](c),
              this.isNewLabel = !1)
            : (h.attr('y', -9999), this.isNewLabel = !0))
        },
        render: function (e, m, q) { let f = this.axis; const b = f.horiz; let a = this.pos; let d = B(this.tickmarkOffset, f.tickmarkOffset); a = this.getPosition(b, a, d, m); d = a.x; const h = a.y; f = b && d === f.pos + f.len || !b && h === f.pos ? -1 : 1; q = B(q, 1); this.isActive = !0; this.renderGridLine(m, q, f); this.renderMark(a, q, f); this.renderLabel(a, m, q, e); this.isNew = !1; c.fireEvent(this, 'afterRender') },
        destroy: function () { H(this, this.axis) }
      }
    }); M(J, 'parts/Axis.js', [J['parts/Globals.js'], J['parts/Utilities.js']],
    function (c, e) {
      const F = e.animObject; const I = e.arrayMax; const G = e.arrayMin; const H = e.clamp; const v = e.correctFloat; const q = e.defined; const C = e.destroyObjectProperties; const B = e.extend; const u = e.isArray; const w = e.isNumber; const m = e.isString; const r = e.objectEach; const D = e.pick; const A = e.relativeLength; const f = e.splat; const b = e.syncTimeout; const a = c.addEvent; const d = c.color; const h = c.defaultOptions; const k = c.deg2rad; const l = c.fireEvent; const y = c.format; const p = c.getMagnitude; const g = c.merge; const t = c.normalizeTickInterval; const x = c.removeEvent; const L = c.seriesTypes; const E = c.Tick; e = function () { this.init.apply(this, arguments) }; B(e.prototype, {
        defaultOptions: {
          dateTimeLabelFormats: {
            millisecond: {
              main: '%H:%M:%S.%L',
              range: !1
            },
            second: { main: '%H:%M:%S', range: !1 },
            minute: { main: '%H:%M', range: !1 },
            hour: { main: '%H:%M', range: !1 },
            day: { main: '%e. %b' },
            week: { main: '%e. %b' },
            month: { main: "%b '%y" },
            year: { main: '%Y' }
          },
          endOnTick: !1,
          labels: { enabled: !0, indentation: 10, x: 0, style: { color: '#666666', cursor: 'default', fontSize: '11px' } },
          maxPadding: 0.01,
          minorTickLength: 2,
          minorTickPosition: 'outside',
          minPadding: 0.01,
          showEmpty: !0,
          startOfWeek: 1,
          startOnTick: !1,
          tickLength: 10,
          tickPixelInterval: 100,
          tickmarkPlacement: 'between',
          tickPosition: 'outside',
          title: {
            align: 'middle',
            style: { color: '#666666' }
          },
          type: 'linear',
          minorGridLineColor: '#f2f2f2',
          minorGridLineWidth: 1,
          minorTickColor: '#999999',
          lineColor: '#ccd6eb',
          lineWidth: 1,
          gridLineColor: '#e6e6e6',
          tickColor: '#ccd6eb'
        },
        defaultYAxisOptions: {
          endOnTick: !0,
          maxPadding: 0.05,
          minPadding: 0.05,
          tickPixelInterval: 72,
          showLastLabel: !0,
          labels: { x: -8 },
          startOnTick: !0,
          title: { rotation: 270, text: 'Values' },
          stackLabels: {
            allowOverlap: !1,
            enabled: !1,
            crop: !0,
            overflow: 'justify',
            formatter: function () {
              const a = this.axis.chart.numberFormatter; return a(this.total,
                -1)
            },
            style: { color: '#000000', fontSize: '11px', fontWeight: 'bold', textOutline: '1px contrast' }
          },
          gridLineWidth: 1,
          lineWidth: 0
        },
        defaultLeftAxisOptions: { labels: { x: -15 }, title: { rotation: 270 } },
        defaultRightAxisOptions: { labels: { x: 15 }, title: { rotation: 90 } },
        defaultBottomAxisOptions: { labels: { autoRotation: [-45], x: 0 }, margin: 15, title: { rotation: 0 } },
        defaultTopAxisOptions: { labels: { autoRotation: [-45], x: 0 }, margin: 15, title: { rotation: 0 } },
        init: function (b, d) {
          const n = d.isX; const g = this; g.chart = b; g.horiz = b.inverted && !g.isZAxis ? !n : n; g.isXAxis =
n; g.coll = g.coll || (n ? 'xAxis' : 'yAxis'); l(this, 'init', { userOptions: d }); g.opposite = d.opposite; g.side = d.side || (g.horiz ? g.opposite ? 0 : 2 : g.opposite ? 1 : 3); g.setOptions(d); const z = this.options; const h = z.type; g.labelFormatter = z.labels.formatter || g.defaultLabelFormatter; g.userOptions = d; g.minPixelPadding = 0; g.reversed = z.reversed; g.visible = !1 !== z.visible; g.zoomEnabled = !1 !== z.zoomEnabled; g.hasNames = h === 'category' || !0 === z.categories; g.categories = z.categories || g.hasNames; g.names || (g.names = [], g.names.keys = {}); g.plotLinesAndBandsGroups =
{}; g.isLog = h === 'logarithmic'; g.isDatetimeAxis = h === 'datetime'; g.positiveValuesOnly = g.isLog && !g.allowNegativeLog; g.isLinked = q(z.linkedTo); g.ticks = {}; g.labelEdge = []; g.minorTicks = {}; g.plotLinesAndBands = []; g.alternateBands = {}; g.len = 0; g.minRange = g.userMinRange = z.minRange || z.maxZoom; g.range = z.range; g.offset = z.offset || 0; g.stacks = {}; g.oldStacks = {}; g.stacksTouched = 0; g.max = null; g.min = null; g.crosshair = D(z.crosshair, f(b.options.tooltip.crosshairs)[n ? 0 : 1], !1); d = g.options.events; b.axes.indexOf(g) === -1 && (n
            ? b.axes.splice(b.xAxis.length,
                0, g)
            : b.axes.push(g), b[g.coll].push(g)); g.series = g.series || []; b.inverted && !g.isZAxis && n && typeof g.reversed === 'undefined' && (g.reversed = !0); r(d, function (b, d) { c.isFunction(b) && a(g, d, b) }); g.lin2log = z.linearToLogConverter || g.lin2log; g.isLog && (g.val2lin = g.log2lin, g.lin2val = g.lin2log); l(this, 'afterInit')
        },
        setOptions: function (a) {
          this.options = g(this.defaultOptions, this.coll === 'yAxis' && this.defaultYAxisOptions, [this.defaultTopAxisOptions, this.defaultRightAxisOptions, this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side],
            g(h[this.coll], a)); l(this, 'afterSetOptions', { userOptions: a })
        },
        defaultLabelFormatter: function () {
          let a = this.axis; const b = this.value; let d = a.chart.time; const g = a.categories; const f = this.dateTimeLabelFormat; let c = h.lang; const t = c.numericSymbols; c = c.numericSymbolMagnitude || 1E3; let l = t && t.length; const x = a.options.labels.format; a = a.isLog ? Math.abs(b) : a.tickInterval; const k = this.chart; const p = k.numberFormatter; if (x) var e = y(x, this, k); else if (g)e = b; else if (f)e = d.dateFormat(f, b); else if (l && a >= 1E3) {
            for (;l-- && typeof e === 'undefined';) {
              d = Math.pow(c, l + 1), a >= d &&
10 * b % d === 0 && t[l] !== null && b !== 0 && (e = p(b / d, -1) + t[l])
            }
          } typeof e === 'undefined' && (e = Math.abs(b) >= 1E4 ? p(b, -1) : p(b, -1, void 0, '')); return e
        },
        getSeriesExtremes: function () {
          const a = this; const b = a.chart; let d; l(this, 'getSeriesExtremes', null, function () {
            a.hasVisibleSeries = !1; a.dataMin = a.dataMax = a.threshold = null; a.softThreshold = !a.isXAxis; a.buildStacks && a.buildStacks(); a.series.forEach(function (g) {
              if (g.visible || !b.options.chart.ignoreHiddenSeries) {
                let n = g.options; let z = n.threshold; a.hasVisibleSeries = !0; a.positiveValuesOnly && z <=
0 && (z = null); if (a.isXAxis) { if (n = g.xData, n.length) { d = g.getXExtremes(n); var f = d.min; var h = d.max; w(f) || f instanceof Date || (n = n.filter(w), d = g.getXExtremes(n), f = d.min, h = d.max); n.length && (a.dataMin = Math.min(D(a.dataMin, f), f), a.dataMax = Math.max(D(a.dataMax, h), h)) } } else if (g.getExtremes(), h = g.dataMax, f = g.dataMin, q(f) && q(h) && (a.dataMin = Math.min(D(a.dataMin, f), f), a.dataMax = Math.max(D(a.dataMax, h), h)), q(z) && (a.threshold = z), !n.softThreshold || a.positiveValuesOnly)a.softThreshold = !1
              }
            })
          }); l(this, 'afterGetSeriesExtremes')
        },
        translate: function (a, b, d, g, f, h) { const n = this.linkedParent || this; let z = 1; let c = 0; let t = g ? n.oldTransA : n.transA; g = g ? n.oldMin : n.min; const l = n.minPixelPadding; f = (n.isOrdinal || n.isBroken || n.isLog && f) && n.lin2val; t || (t = n.transA); d && (z *= -1, c = n.len); n.reversed && (z *= -1, c -= z * (n.sector || n.len)); b ? (a = (a * z + c - l) / t + g, f && (a = n.lin2val(a))) : (f && (a = n.val2lin(a)), a = w(g) ? z * (a - g) * t + c + z * l + (w(h) ? t * h : 0) : void 0); return a },
        toPixels: function (a, b) { return this.translate(a, !1, !this.horiz, null, !0) + (b ? 0 : this.pos) },
        toValue: function (a, b) {
          return this.translate(a -
(b ? 0 : this.pos), !0, !this.horiz, null, !0)
        },
        getPlotLinePath: function (a) {
          const b = this; const d = b.chart; const g = b.left; const n = b.top; const f = a.old; const h = a.value; let c = a.translatedValue; const t = a.lineWidth; let x = a.force; let k; let p; let e; let E; const m = f && d.oldChartHeight || d.chartHeight; const L = f && d.oldChartWidth || d.chartWidth; let y; const r = b.transB; const q = function (a, b, d) { if (x !== 'pass' && a < b || a > d)x ? a = H(a, b, d) : y = !0; return a }; a = { value: h, lineWidth: t, old: f, force: x, acrossPanes: a.acrossPanes, translatedValue: c }; l(this, 'getPlotLinePath', a, function (a) {
            c = D(c, b.translate(h, null, null, f)); c = H(c, -1E5, 1E5)
            k = e = Math.round(c + r); p = E = Math.round(m - c - r); w(c) ? b.horiz ? (p = n, E = m - b.bottom, k = e = q(k, g, g + b.width)) : (k = g, e = L - b.right, p = E = q(p, n, n + b.height)) : (y = !0, x = !1); a.path = y && !x ? null : d.renderer.crispLine(['M', k, p, 'L', e, E], t || 1)
          }); return a.path
        },
        getLinearTickPositions: function (a, b, d) { const g = v(Math.floor(b / a) * a); d = v(Math.ceil(d / a) * a); const n = []; let f; v(g + a) === g && (f = 20); if (this.single) return [b]; for (b = g; b <= d;) { n.push(b); b = v(b + a, f); if (b === z) break; var z = b } return n },
        getMinorTickInterval: function () {
          const a = this.options; return !0 ===
a.minorTicks
            ? D(a.minorTickInterval, 'auto')
            : !1 === a.minorTicks ? null : a.minorTickInterval
        },
        getMinorTickPositions: function () {
          const a = this; let b = a.options; const d = a.tickPositions; const g = a.minorTickInterval; let f = []; let h = a.pointRangePadding || 0; const c = a.min - h; h = a.max + h; const t = h - c; if (t && t / g < a.len / 3) {
            if (a.isLog) this.paddedTicks.forEach(function (b, d, n) { d && f.push.apply(f, a.getLogTickPositions(g, n[d - 1], n[d], !0)) }); else if (a.isDatetimeAxis && this.getMinorTickInterval() === 'auto')f = f.concat(a.getTimeTicks(a.normalizeTimeTickInterval(g), c, h, b.startOfWeek))
            else for (b = c + (d[0] - c) % g; b <= h && b !== f[0]; b += g)f.push(b)
          } f.length !== 0 && a.trimTicks(f); return f
        },
        adjustForMinRange: function () {
          const a = this.options; let b = this.min; let d = this.max; let g; let f; let h; let c; let t; this.isXAxis && typeof this.minRange === 'undefined' && !this.isLog && (q(a.min) || q(a.max) ? this.minRange = null : (this.series.forEach(function (a) { c = a.xData; for (f = t = a.xIncrement ? 1 : c.length - 1; f > 0; f--) if (h = c[f] - c[f - 1], typeof g === 'undefined' || h < g)g = h }), this.minRange = Math.min(5 * g, this.dataMax - this.dataMin))); if (d - b < this.minRange) {
            const l = this.dataMax -
this.dataMin >= this.minRange; const x = this.minRange; let k = (x - d + b) / 2; k = [b - k, D(a.min, b - k)]; l && (k[2] = this.isLog ? this.log2lin(this.dataMin) : this.dataMin); b = I(k); d = [b + x, D(a.max, b + x)]; l && (d[2] = this.isLog ? this.log2lin(this.dataMax) : this.dataMax); d = G(d); d - b < x && (k[0] = d - x, k[1] = D(a.min, d - x), b = I(k))
          } this.min = b; this.max = d
        },
        getClosest: function () {
          let a; this.categories
            ? a = 1
            : this.series.forEach(function (b) {
              const d = b.closestPointRange; const g = b.visible || !b.chart.options.chart.ignoreHiddenSeries; !b.noSharedTooltip && q(d) && g && (a =
q(a) ? Math.min(a, d) : d)
            }); return a
        },
        nameToX: function (a) { const b = u(this.categories); const d = b ? this.categories : this.names; let g = a.options.x; a.series.requireSorting = !1; q(g) || (g = !1 === this.options.uniqueNames ? a.series.autoIncrement() : b ? d.indexOf(a.name) : D(d.keys[a.name], -1)); if (g === -1) { if (!b) var n = d.length } else n = g; typeof n !== 'undefined' && (this.names[n] = a.name, this.names.keys[a.name] = n); return n },
        updateNames: function () {
          const a = this; const b = this.names; b.length > 0 && (Object.keys(b.keys).forEach(function (a) { delete b.keys[a] }), b.length =
0, this.minRange = this.userMinRange, (this.series || []).forEach(function (b) { b.xIncrement = null; if (!b.points || b.isDirtyData)a.max = Math.max(a.max, b.xData.length - 1), b.processData(), b.generatePoints(); b.data.forEach(function (d, g) { if (d && d.options && typeof d.name !== 'undefined') { const n = a.nameToX(d); typeof n !== 'undefined' && n !== d.x && (d.x = n, b.xData[g] = n) } }) }))
        },
        setAxisTranslation: function (a) {
          const b = this; const d = b.max - b.min; let g = b.axisPointRange || 0; let n = 0; let f = 0; let h = b.linkedParent; const c = !!b.categories; let t = b.transA; const x = b.isXAxis; if (x || c || g) {
            const k =
b.getClosest(); h ? (n = h.minPointOffset, f = h.pointRangePadding) : b.series.forEach(function (a) { const d = c ? 1 : x ? D(a.options.pointRange, k, 0) : b.axisPointRange || 0; const h = a.options.pointPlacement; g = Math.max(g, d); if (!b.single || c)a = L.xrange && a instanceof L.xrange ? !x : x, n = Math.max(n, a && m(h) ? 0 : d / 2), f = Math.max(f, a && h === 'on' ? 0 : d) }); h = b.ordinalSlope && k ? b.ordinalSlope / k : 1; b.minPointOffset = n *= h; b.pointRangePadding = f *= h; b.pointRange = Math.min(g, b.single && c ? 1 : d); x && (b.closestPointRange = k)
          }a && (b.oldTransA = t); b.translationSlope = b.transA =
t = b.staticScale || b.len / (d + f || 1); b.transB = b.horiz ? b.left : b.bottom; b.minPixelPadding = t * n; l(this, 'afterSetAxisTranslation')
        },
        minFromRange: function () { return this.max - this.range },
        setTickInterval: function (a) {
          const b = this; let d = b.chart; const g = b.options; const n = b.isLog; const f = b.isDatetimeAxis; const h = b.isXAxis; const x = b.isLinked; let k = g.maxPadding; let e = g.minPadding; let E = g.tickInterval; const m = g.tickPixelInterval; const L = b.categories; let y = w(b.threshold) ? b.threshold : null; const r = b.softThreshold; f || L || x || this.getTickAmount(); let A = D(b.userMin, g.min); let u = D(b.userMax, g.max)
          if (x) { b.linkedParent = d[b.coll][g.linkedTo]; var C = b.linkedParent.getExtremes(); b.min = D(C.min, C.dataMin); b.max = D(C.max, C.dataMax); g.type !== b.linkedParent.options.type && c.error(11, 1, d) } else { if (!r && q(y)) if (b.dataMin >= y)C = y, e = 0; else if (b.dataMax <= y) { var B = y; k = 0 }b.min = D(A, C, b.dataMin); b.max = D(u, B, b.dataMax) }n && (b.positiveValuesOnly && !a && Math.min(b.min, D(b.dataMin, b.min)) <= 0 && c.error(10, 1, d), b.min = v(b.log2lin(b.min), 16), b.max = v(b.log2lin(b.max), 16)); b.range && q(b.max) && (b.userMin = b.min = A = Math.max(b.dataMin,
            b.minFromRange()), b.userMax = u = b.max, b.range = null); l(b, 'foundExtremes'); b.beforePadding && b.beforePadding(); b.adjustForMinRange(); !(L || b.axisPointRange || b.usePercentage || x) && q(b.min) && q(b.max) && (d = b.max - b.min) && (!q(A) && e && (b.min -= d * e), !q(u) && k && (b.max += d * k)); w(b.userMin) || (w(g.softMin) && g.softMin < b.min && (b.min = A = g.softMin), w(g.floor) && (b.min = Math.max(b.min, g.floor))); w(b.userMax) || (w(g.softMax) && g.softMax > b.max && (b.max = u = g.softMax), w(g.ceiling) && (b.max = Math.min(b.max, g.ceiling))); r && q(b.dataMin) && (y =
y || 0, !q(A) && b.min < y && b.dataMin >= y ? b.min = b.options.minRange ? Math.min(y, b.max - b.minRange) : y : !q(u) && b.max > y && b.dataMax <= y && (b.max = b.options.minRange ? Math.max(y, b.min + b.minRange) : y)); b.tickInterval = b.min === b.max || typeof b.min === 'undefined' || typeof b.max === 'undefined' ? 1 : x && !E && m === b.linkedParent.options.tickPixelInterval ? E = b.linkedParent.tickInterval : D(E, this.tickAmount ? (b.max - b.min) / Math.max(this.tickAmount - 1, 1) : void 0, L ? 1 : (b.max - b.min) * m / Math.max(b.len, m)); h && !a && b.series.forEach(function (a) {
            a.processData(b.min !==
b.oldMin || b.max !== b.oldMax)
          }); b.setAxisTranslation(!0); b.beforeSetTickPositions && b.beforeSetTickPositions(); b.postProcessTickInterval && (b.tickInterval = b.postProcessTickInterval(b.tickInterval)); b.pointRange && !E && (b.tickInterval = Math.max(b.pointRange, b.tickInterval)); a = D(g.minTickInterval, b.isDatetimeAxis && b.closestPointRange); !E && b.tickInterval < a && (b.tickInterval = a); f || n || E || (b.tickInterval = t(b.tickInterval, null, p(b.tickInterval), D(g.allowDecimals, !(b.tickInterval > 0.5 && b.tickInterval < 5 && b.max > 1E3 &&
b.max < 9999)), !!this.tickAmount)); this.tickAmount || (b.tickInterval = b.unsquish()); this.setTickPositions()
        },
        setTickPositions: function () {
          const a = this.options; const b = a.tickPositions; let d = this.getMinorTickInterval(); let g = a.tickPositioner; const f = a.startOnTick; const h = a.endOnTick; this.tickmarkOffset = this.categories && a.tickmarkPlacement === 'between' && this.tickInterval === 1 ? 0.5 : 0; this.minorTickInterval = d === 'auto' && this.tickInterval ? this.tickInterval / 5 : d; this.single = this.min === this.max && q(this.min) && !this.tickAmount && (parseInt(this.min,
            10) === this.min || !1 !== a.allowDecimals); this.tickPositions = d = b && b.slice(); !d && (!this.ordinalPositions && (this.max - this.min) / this.tickInterval > Math.max(2 * this.len, 200)
            ? (d = [this.min, this.max], c.error(19, !1, this.chart))
            : d = this.isDatetimeAxis
              ? this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval, a.units), this.min, this.max, a.startOfWeek, this.ordinalPositions, this.closestPointRange, !0)
              : this.isLog
                ? this.getLogTickPositions(this.tickInterval, this.min, this.max)
                : this.getLinearTickPositions(this.tickInterval,
                  this.min, this.max), d.length > this.len && (d = [d[0], d.pop()], d[0] === d[1] && (d.length = 1)), this.tickPositions = d, g && (g = g.apply(this, [this.min, this.max]))) && (this.tickPositions = d = g); this.paddedTicks = d.slice(0); this.trimTicks(d, f, h); this.isLinked || (this.single && d.length < 2 && !this.categories && (this.min -= 0.5, this.max += 0.5), b || g || this.adjustTickAmount()); l(this, 'afterSetTickPositions')
        },
        trimTicks: function (a, b, d) {
          const g = a[0]; const n = a[a.length - 1]; const f = this.minPointOffset || 0; l(this, 'trimTicks'); if (!this.isLinked) {
            if (b && -Infinity !==
g) this.min = g; else for (;this.min - f > a[0];)a.shift(); if (d) this.max = n; else for (;this.max + f < a[a.length - 1];)a.pop(); a.length === 0 && q(g) && !this.options.tickPositions && a.push((n + g) / 2)
          }
        },
        alignToOthers: function () { const a = {}; let b; const d = this.options; !1 === this.chart.options.chart.alignTicks || !1 === d.alignTicks || !1 === d.startOnTick || !1 === d.endOnTick || this.isLog || this.chart[this.coll].forEach(function (d) { let g = d.options; g = [d.horiz ? g.left : g.top, g.width, g.height, g.pane].join(); d.series.length && (a[g] ? b = !0 : a[g] = 1) }); return b },
        getTickAmount: function () { const a = this.options; let b = a.tickAmount; const d = a.tickPixelInterval; !q(a.tickInterval) && this.len < d && !this.isRadial && !this.isLog && a.startOnTick && a.endOnTick && (b = 2); !b && this.alignToOthers() && (b = Math.ceil(this.len / d) + 1); b < 4 && (this.finalTickAmt = b, b = 5); this.tickAmount = b },
        adjustTickAmount: function () {
          let a = this.options; let b = this.tickInterval; const d = this.tickPositions; const g = this.tickAmount; const f = this.finalTickAmt; const h = d && d.length; const c = D(this.threshold, this.softThreshold ? 0 : null); let t; if (this.hasData()) {
            if (h < g) {
              for (t =
this.min; d.length < g;)d.length % 2 || t === c ? d.push(v(d[d.length - 1] + b)) : d.unshift(v(d[0] - b)); this.transA *= (h - 1) / (g - 1); this.min = a.startOnTick ? d[0] : Math.min(this.min, d[0]); this.max = a.endOnTick ? d[d.length - 1] : Math.max(this.max, d[d.length - 1])
            } else h > g && (this.tickInterval *= 2, this.setTickPositions()); if (q(f)) { for (b = a = d.length; b--;)(f === 3 && b % 2 === 1 || f <= 2 && b > 0 && b < a - 1) && d.splice(b, 1); this.finalTickAmt = void 0 }
          }
        },
        setScale: function () {
          const a = this.series.some(function (a) { return a.isDirtyData || a.isDirty || a.xAxis && a.xAxis.isDirty })
          let b; this.oldMin = this.min; this.oldMax = this.max; this.oldAxisLength = this.len; this.setAxisSize(); (b = this.len !== this.oldAxisLength) || a || this.isLinked || this.forceRedraw || this.userMin !== this.oldUserMin || this.userMax !== this.oldUserMax || this.alignToOthers()
            ? (this.resetStacks && this.resetStacks(), this.forceRedraw = !1, this.getSeriesExtremes(), this.setTickInterval(), this.oldUserMin = this.userMin, this.oldUserMax = this.userMax, this.isDirty || (this.isDirty = b || this.min !== this.oldMin || this.max !== this.oldMax))
            : this.cleanStacks &&
this.cleanStacks(); l(this, 'afterSetScale')
        },
        setExtremes: function (a, b, d, g, f) { const n = this; const h = n.chart; d = D(d, !0); n.series.forEach(function (a) { delete a.kdTree }); f = B(f, { min: a, max: b }); l(n, 'setExtremes', f, function () { n.userMin = a; n.userMax = b; n.eventArgs = f; d && h.redraw(g) }) },
        zoom: function (a, b) {
          const d = this.dataMin; const g = this.dataMax; const n = this.options; const f = Math.min(d, D(n.min, d)); const h = Math.max(g, D(n.max, g)); a = { newMin: a, newMax: b }; l(this, 'zoom', a, function (a) {
            let b = a.newMin; let n = a.newMax; if (b !== this.min || n !== this.max) {
              this.allowZoomOutside ||
(q(d) && (b < f && (b = f), b > h && (b = h)), q(g) && (n < f && (n = f), n > h && (n = h))), this.displayBtn = typeof b !== 'undefined' || typeof n !== 'undefined', this.setExtremes(b, n, !1, void 0, { trigger: 'zoom' })
            } a.zoomed = !0
          }); return a.zoomed
        },
        setAxisSize: function () {
          const a = this.chart; let b = this.options; const d = b.offsets || [0, 0, 0, 0]; const g = this.horiz; const f = this.width = Math.round(A(D(b.width, a.plotWidth - d[3] + d[1]), a.plotWidth)); const h = this.height = Math.round(A(D(b.height, a.plotHeight - d[0] + d[2]), a.plotHeight)); const c = this.top = Math.round(A(D(b.top, a.plotTop + d[0]), a.plotHeight,
            a.plotTop)); b = this.left = Math.round(A(D(b.left, a.plotLeft + d[3]), a.plotWidth, a.plotLeft)); this.bottom = a.chartHeight - h - c; this.right = a.chartWidth - f - b; this.len = Math.max(g ? f : h, 0); this.pos = g ? b : c
        },
        getExtremes: function () { const a = this.isLog; return { min: a ? v(this.lin2log(this.min)) : this.min, max: a ? v(this.lin2log(this.max)) : this.max, dataMin: this.dataMin, dataMax: this.dataMax, userMin: this.userMin, userMax: this.userMax } },
        getThreshold: function (a) {
          let b = this.isLog; const d = b ? this.lin2log(this.min) : this.min; b = b
            ? this.lin2log(this.max)
            : this.max; a === null || -Infinity === a ? a = d : Infinity === a ? a = b : d > a ? a = d : b < a && (a = b); return this.translate(a, 0, 1, 0, 1)
        },
        autoLabelAlign: function (a) { const b = (D(a, 0) - 90 * this.side + 720) % 360; a = { align: 'center' }; l(this, 'autoLabelAlign', a, function (a) { b > 15 && b < 165 ? a.align = 'right' : b > 195 && b < 345 && (a.align = 'left') }); return a.align },
        tickSize: function (a) {
          const b = this.options; let d = b[a + 'Length']; const g = D(b[a + 'Width'], a === 'tick' && this.isXAxis && !this.categories ? 1 : 0); if (g && d) { b[a + 'Position'] === 'inside' && (d = -d); var f = [d, g] }a = { tickSize: f }; l(this,
            'afterTickSize', a); return a.tickSize
        },
        labelMetrics: function () { const a = this.tickPositions && this.tickPositions[0] || 0; return this.chart.renderer.fontMetrics(this.options.labels.style && this.options.labels.style.fontSize, this.ticks[a] && this.ticks[a].label) },
        unsquish: function () {
          const a = this.options.labels; const b = this.horiz; const d = this.tickInterval; let g = d; const f = this.len / (((this.categories ? 1 : 0) + this.max - this.min) / d); let h; const c = a.rotation; const t = this.labelMetrics(); let l; let x = Number.MAX_VALUE; let p; const e = this.max - this.min; const E = function (a) {
            let b = a / (f || 1); b =
b > 1 ? Math.ceil(b) : 1; b * d > e && Infinity !== a && Infinity !== f && e && (b = Math.ceil(e / d)); return v(b * d)
          }; b ? (p = !a.staggerLines && !a.step && (q(c) ? [c] : f < D(a.autoRotationLimit, 80) && a.autoRotation)) && p.forEach(function (a) { if (a === c || a && a >= -90 && a <= 90) { l = E(Math.abs(t.h / Math.sin(k * a))); const b = l + Math.abs(a / 360); b < x && (x = b, h = a, g = l) } }) : a.step || (g = E(t.h)); this.autoRotation = p; this.labelRotation = D(h, c); return g
        },
        getSlotWidth: function (a) {
          const b = this.chart; const d = this.horiz; const g = this.options.labels; const f = Math.max(this.tickPositions.length - (this.categories
            ? 0
            : 1), 1); const n = b.margin[3]; return a && a.slotWidth || d && (g.step || 0) < 2 && !g.rotation && (this.staggerLines || 1) * this.len / f || !d && (g.style && parseInt(g.style.width, 10) || n && n - b.spacing[3] || 0.33 * b.chartWidth)
        },
        renderUnsquish: function () {
          const a = this.chart; const b = a.renderer; const d = this.tickPositions; const g = this.ticks; const f = this.options.labels; const h = f && f.style || {}; const c = this.horiz; const t = this.getSlotWidth(); let l = Math.max(1, Math.round(t - 2 * (f.padding || 5))); const x = {}; const k = this.labelMetrics(); const p = f.style && f.style.textOverflow; let e = 0; m(f.rotation) || (x.rotation = f.rotation ||
0); d.forEach(function (a) { a = g[a]; a.movedLabel && a.replaceMovedLabel(); a && a.label && a.label.textPxLength > e && (e = a.label.textPxLength) }); this.maxLabelLength = e; if (this.autoRotation)e > l && e > k.h ? x.rotation = this.labelRotation : this.labelRotation = 0; else if (t) {
            var E = l; if (!p) {
              var L = 'clip'; for (l = d.length; !c && l--;) {
                let y = d[l]; if (y = g[y].label) {
                  y.styles && y.styles.textOverflow === 'ellipsis' ? y.css({ textOverflow: 'clip' }) : y.textPxLength > t && y.css({ width: t + 'px' }), y.getBBox().height > this.len / d.length - (k.h - k.f) && (y.specificTextOverflow =
'ellipsis')
                }
              }
            }
          }x.rotation && (E = e > 0.5 * a.chartHeight ? 0.33 * a.chartHeight : e, p || (L = 'ellipsis')); if (this.labelAlign = f.align || this.autoLabelAlign(this.labelRotation))x.align = this.labelAlign; d.forEach(function (a) {
            const b = (a = g[a]) && a.label; const d = h.width; const f = {}; b && (b.attr(x), a.shortenLabel ? a.shortenLabel() : E && !d && h.whiteSpace !== 'nowrap' && (E < b.textPxLength || b.element.tagName === 'SPAN') ? (f.width = E, p || (f.textOverflow = b.specificTextOverflow || L), b.css(f)) : b.styles && b.styles.width && !f.width && !d && b.css({ width: null }), delete b.specificTextOverflow,
            a.rotation = x.rotation)
          }, this); this.tickRotCorr = b.rotCorr(k.b, this.labelRotation || 0, this.side !== 0)
        },
        hasData: function () { return this.series.some(function (a) { return a.hasData() }) || this.options.showEmpty && q(this.min) && q(this.max) },
        addTitle: function (a) {
          const b = this.chart.renderer; const d = this.horiz; const f = this.opposite; const h = this.options.title; let n; const c = this.chart.styledMode; this.axisTitle || ((n = h.textAlign) || (n = (d ? { low: 'left', middle: 'center', high: 'right' } : { low: f ? 'right' : 'left', middle: 'center', high: f ? 'left' : 'right' })[h.align]),
          this.axisTitle = b.text(h.text, 0, 0, h.useHTML).attr({ zIndex: 7, rotation: h.rotation || 0, align: n }).addClass('highcharts-axis-title'), c || this.axisTitle.css(g(h.style)), this.axisTitle.add(this.axisGroup), this.axisTitle.isNew = !0); c || h.style.width || this.isRadial || this.axisTitle.css({ width: this.len }); this.axisTitle[a ? 'show' : 'hide'](a)
        },
        generateTick: function (a) { const b = this.ticks; b[a] ? b[a].addLabel() : b[a] = new E(this, a) },
        getOffset: function () {
          const a = this; let b = a.chart; let d = b.renderer; let g = a.options; const f = a.tickPositions; const h = a.ticks
          let c = a.horiz; const t = a.side; const x = b.inverted && !a.isZAxis ? [1, 0, 3, 2][t] : t; let k; let p = 0; let e = 0; const E = g.title; const m = g.labels; let L = 0; const y = b.axisOffset; b = b.clipOffset; const A = [-1, 1, 1, -1][t]; const u = g.className; const v = a.axisParent; const w = a.hasData(); a.showAxis = k = w || D(g.showEmpty, !0); a.staggerLines = a.horiz && m.staggerLines; a.axisGroup || (a.gridGroup = d.g('grid').attr({ zIndex: g.gridZIndex || 1 }).addClass('highcharts-' + this.coll.toLowerCase() + '-grid ' + (u || '')).add(v), a.axisGroup = d.g('axis').attr({ zIndex: g.zIndex || 2 }).addClass('highcharts-' + this.coll.toLowerCase() +
' ' + (u || '')).add(v), a.labelGroup = d.g('axis-labels').attr({ zIndex: m.zIndex || 7 }).addClass('highcharts-' + a.coll.toLowerCase() + '-labels ' + (u || '')).add(v)); w || a.isLinked
            ? (f.forEach(function (b, d) { a.generateTick(b, d) }), a.renderUnsquish(), a.reserveSpaceDefault = t === 0 || t === 2 || { 1: 'left', 3: 'right' }[t] === a.labelAlign, D(m.reserveSpace, a.labelAlign === 'center' ? !0 : null, a.reserveSpaceDefault) && f.forEach(function (a) { L = Math.max(h[a].getLabelSize(), L) }), a.staggerLines && (L *= a.staggerLines), a.labelOffset = L * (a.opposite
                ? -1
                : 1))
            : r(h, function (a, b) { a.destroy(); delete h[b] }); if (E && E.text && !1 !== E.enabled && (a.addTitle(k), k && !1 !== E.reserveSpace)) { a.titleOffset = p = a.axisTitle.getBBox()[c ? 'height' : 'width']; var C = E.offset; e = q(C) ? 0 : D(E.margin, c ? 5 : 10) }a.renderLine(); a.offset = A * D(g.offset, y[t] ? y[t] + (g.margin || 0) : 0); a.tickRotCorr = a.tickRotCorr || { x: 0, y: 0 }; d = t === 0 ? -a.labelMetrics().h : t === 2 ? a.tickRotCorr.y : 0; e = Math.abs(L) + e; L && (e = e - d + A * (c ? D(m.y, a.tickRotCorr.y + 8 * A) : m.x)); a.axisTitleMargin = D(C, e); a.getMaxLabelDimensions && (a.maxLabelDimensions =
a.getMaxLabelDimensions(h, f)); c = this.tickSize('tick'); y[t] = Math.max(y[t], a.axisTitleMargin + p + A * a.offset, e, f && f.length && c ? c[0] + A * a.offset : 0); g = g.offset ? 0 : 2 * Math.floor(a.axisLine.strokeWidth() / 2); b[x] = Math.max(b[x], g); l(this, 'afterGetOffset')
        },
        getLinePath: function (a) {
          const b = this.chart; const d = this.opposite; let g = this.offset; const f = this.horiz; const h = this.left + (d ? this.width : 0) + g; g = b.chartHeight - this.bottom - (d ? this.height : 0) + g; d && (a *= -1); return b.renderer.crispLine(['M', f ? this.left : h, f ? g : this.top, 'L', f
            ? b.chartWidth - this.right
            : h, f ? g : b.chartHeight - this.bottom], a)
        },
        renderLine: function () { this.axisLine || (this.axisLine = this.chart.renderer.path().addClass('highcharts-axis-line').add(this.axisGroup), this.chart.styledMode || this.axisLine.attr({ stroke: this.options.lineColor, 'stroke-width': this.options.lineWidth, zIndex: 7 })) },
        getTitlePosition: function () {
          let a = this.horiz; let b = this.left; const d = this.top; let g = this.len; const f = this.options.title; const h = a ? b : d; const c = this.opposite; const t = this.offset; const x = f.x || 0; const k = f.y || 0; let p = this.axisTitle; const e = this.chart.renderer.fontMetrics(f.style &&
f.style.fontSize, p); p = Math.max(p.getBBox(null, 0).height - e.h - 1, 0); g = { low: h + (a ? 0 : g), middle: h + g / 2, high: h + (a ? g : 0) }[f.align]; b = (a ? d + this.height : b) + (a ? 1 : -1) * (c ? -1 : 1) * this.axisTitleMargin + [-p, p, e.f, -p][this.side]; a = { x: a ? g + x : b + (c ? this.width : 0) + t + x, y: a ? b + k - (c ? this.height : 0) + t : g + k }; l(this, 'afterGetTitlePosition', { titlePosition: a }); return a
        },
        renderMinorTick: function (a) {
          const b = this.chart.hasRendered && w(this.oldMin); const d = this.minorTicks; d[a] || (d[a] = new E(this, a, 'minor')); b && d[a].isNew && d[a].render(null, !0); d[a].render(null,
            !1, 1)
        },
        renderTick: function (a, b) { const d = this.isLinked; const g = this.ticks; const f = this.chart.hasRendered && w(this.oldMin); if (!d || a >= this.min && a <= this.max)g[a] || (g[a] = new E(this, a)), f && g[a].isNew && g[a].render(b, !0, -1), g[a].render(b) },
        render: function () {
          const a = this; const d = a.chart; let g = a.options; const f = a.isLog; const h = a.isLinked; const t = a.tickPositions; const x = a.axisTitle; const k = a.ticks; const p = a.minorTicks; const e = a.alternateBands; const m = g.stackLabels; const L = g.alternateGridColor; const y = a.tickmarkOffset; const q = a.axisLine; const A = a.showAxis; const u = F(d.renderer.globalAnimation); let D; let v; a.labelEdge.length =
0; a.overlap = !1; [k, p, e].forEach(function (a) { r(a, function (a) { a.isActive = !1 }) }); if (a.hasData() || h) {
            a.minorTickInterval && !a.categories && a.getMinorTickPositions().forEach(function (b) { a.renderMinorTick(b) }), t.length && (t.forEach(function (b, d) { a.renderTick(b, d) }), y && (a.min === 0 || a.single) && (k[-1] || (k[-1] = new E(a, -1, null, !0)), k[-1].render(-1))), L && t.forEach(function (b, g) {
              v = typeof t[g + 1] !== 'undefined' ? t[g + 1] + y : a.max - y; g % 2 === 0 && b < a.max && v <= a.max + (d.polar ? -y : y) && (e[b] || (e[b] = new c.PlotLineOrBand(a)), D = b + y, e[b].options =
{ from: f ? a.lin2log(D) : D, to: f ? a.lin2log(v) : v, color: L }, e[b].render(), e[b].isActive = !0)
            }), a._addedPlotLB || ((g.plotLines || []).concat(g.plotBands || []).forEach(function (b) { a.addPlotBandOrLine(b) }), a._addedPlotLB = !0)
          }[k, p, e].forEach(function (a) { let g; const f = []; const h = u.duration; r(a, function (a, b) { a.isActive || (a.render(b, !1, 0), a.isActive = !1, f.push(b)) }); b(function () { for (g = f.length; g--;)a[f[g]] && !a[f[g]].isActive && (a[f[g]].destroy(), delete a[f[g]]) }, a !== e && d.hasRendered && h ? h : 0) }); q && (q[q.isPlaced ? 'animate' : 'attr']({ d: this.getLinePath(q.strokeWidth()) }),
          q.isPlaced = !0, q[A ? 'show' : 'hide'](A)); x && A && (g = a.getTitlePosition(), w(g.y) ? (x[x.isNew ? 'attr' : 'animate'](g), x.isNew = !1) : (x.attr('y', -9999), x.isNew = !0)); m && m.enabled && a.renderStackTotals(); a.isDirty = !1; l(this, 'afterRender')
        },
        redraw: function () { this.visible && (this.render(), this.plotLinesAndBands.forEach(function (a) { a.render() })); this.series.forEach(function (a) { a.isDirty = !0 }) },
        keepProps: 'extKey hcEvents names series userMax userMin'.split(' '),
        destroy: function (a) {
          const b = this; const d = b.stacks; const g = b.plotLinesAndBands
          let f; l(this, 'destroy', { keepEvents: a }); a || x(b); r(d, function (a, b) { C(a); d[b] = null }); [b.ticks, b.minorTicks, b.alternateBands].forEach(function (a) { C(a) }); if (g) for (a = g.length; a--;)g[a].destroy(); 'stackTotalGroup axisLine axisTitle axisGroup gridGroup labelGroup cross scrollbar'.split(' ').forEach(function (a) { b[a] && (b[a] = b[a].destroy()) }); for (f in b.plotLinesAndBandsGroups)b.plotLinesAndBandsGroups[f] = b.plotLinesAndBandsGroups[f].destroy(); r(b, function (a, d) { b.keepProps.indexOf(d) === -1 && delete b[d] })
        },
        drawCrosshair: function (a,
          b) {
          const g = this.crosshair; let f = D(g.snap, !0); let h; let c = this.cross; l(this, 'drawCrosshair', { e: a, point: b }); a || (a = this.cross && this.cross.e); if (this.crosshair && !1 !== (q(b) || !f)) {
            f ? q(b) && (h = D(this.coll !== 'colorAxis' ? b.crosshairPos : null, this.isXAxis ? b.plotX : this.len - b.plotY)) : h = a && (this.horiz ? a.chartX - this.pos : this.len - a.chartY + this.pos); if (q(h)) {
              var t = { value: b && (this.isXAxis ? b.x : D(b.stackY, b.y)), translatedValue: h }; this.chart.polar && B(t, { isCrosshair: !0, chartX: a && a.chartX, chartY: a && a.chartY, point: b }); t = this.getPlotLinePath(t) ||
null
            } if (!q(t)) { this.hideCrosshair(); return }f = this.categories && !this.isRadial; c || (this.cross = c = this.chart.renderer.path().addClass('highcharts-crosshair highcharts-crosshair-' + (f ? 'category ' : 'thin ') + g.className).attr({ zIndex: D(g.zIndex, 2) }).add(), this.chart.styledMode || (c.attr({ stroke: g.color || (f ? d('#ccd6eb').setOpacity(0.25).get() : '#cccccc'), 'stroke-width': D(g.width, 1) }).css({ 'pointer-events': 'none' }), g.dashStyle && c.attr({ dashstyle: g.dashStyle }))); c.show().attr({ d: t }); f && !g.width && c.attr({ 'stroke-width': this.transA })
            this.cross.e = a
          } else this.hideCrosshair(); l(this, 'afterDrawCrosshair', { e: a, point: b })
        },
        hideCrosshair: function () { this.cross && this.cross.hide(); l(this, 'afterHideCrosshair') }
      }); return c.Axis = e
    }); M(J, 'parts/DateTimeAxis.js', [J['parts/Globals.js']], function (c) {
    const e = c.Axis; const F = c.getMagnitude; const I = c.normalizeTickInterval; const G = c.timeUnits; e.prototype.getTimeTicks = function () { return this.chart.time.getTimeTicks.apply(this.chart.time, arguments) }; e.prototype.normalizeTimeTickInterval = function (c, e) {
      const q = e || [['millisecond',
        [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], ['second', [1, 2, 5, 10, 15, 30]], ['minute', [1, 2, 5, 10, 15, 30]], ['hour', [1, 2, 3, 4, 6, 8, 12]], ['day', [1, 2]], ['week', [1, 2]], ['month', [1, 2, 3, 4, 6]], ['year', null]]; e = q[q.length - 1]; let v = G[e[0]]; let B = e[1]; let u; for (u = 0; u < q.length && !(e = q[u], v = G[e[0]], B = e[1], q[u + 1] && c <= (v * B[B.length - 1] + G[q[u + 1][0]]) / 2); u++);v === G.year && c < 5 * v && (B = [1, 2, 5]); c = I(c / v, B, e[0] === 'year' ? Math.max(F(c / v), 1) : 1); return { unitRange: v, count: c, unitName: e[0] }
    }
  }); M(J, 'parts/LogarithmicAxis.js', [J['parts/Globals.js'], J['parts/Utilities.js']],
    function (c, e) {
      const F = e.pick; e = c.Axis; const I = c.getMagnitude; const G = c.normalizeTickInterval; e.prototype.getLogTickPositions = function (c, e, q, C) {
        let v = this.options; let u = this.len; let w = []; C || (this._minorAutoInterval = null); if (c >= 0.5)c = Math.round(c), w = this.getLinearTickPositions(c, e, q); else if (c >= 0.08) {
          u = Math.floor(e); let m, r; for (v = c > 0.3 ? [1, 2, 4] : c > 0.15 ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; u < q + 1 && !r; u++) {
            const D = v.length; for (m = 0; m < D && !r; m++) {
              const A = this.log2lin(this.lin2log(u) * v[m]); A > e && (!C || f <= q) && typeof f !== 'undefined' && w.push(f)
              f > q && (r = !0); var f = A
            }
          }
        } else e = this.lin2log(e), q = this.lin2log(q), c = C ? this.getMinorTickInterval() : v.tickInterval, c = F(c === 'auto' ? null : c, this._minorAutoInterval, v.tickPixelInterval / (C ? 5 : 1) * (q - e) / ((C ? u / this.tickPositions.length : u) || 1)), c = G(c, null, I(c)), w = this.getLinearTickPositions(c, e, q).map(this.log2lin), C || (this._minorAutoInterval = c / 5); C || (this.tickInterval = c); return w
      }; e.prototype.log2lin = function (c) { return Math.log(c) / Math.LN10 }; e.prototype.lin2log = function (c) { return Math.pow(10, c) }
    }); M(J, 'parts/PlotLineOrBand.js',
    [J['parts/Globals.js'], J['parts/Axis.js'], J['parts/Utilities.js']], function (c, e, F) {
      const I = F.arrayMax; const G = F.arrayMin; const H = F.defined; const v = F.destroyObjectProperties; const q = F.erase; const C = F.extend; const B = F.objectEach; const u = F.pick; const w = c.merge; c.PlotLineOrBand = function (c, e) { this.axis = c; e && (this.options = e, this.id = e.id) }; c.PlotLineOrBand.prototype = {
        render: function () {
          c.fireEvent(this, 'render'); const e = this; const r = e.axis; const q = r.horiz; const A = e.options; let f = A.label; let b = e.label; let a = A.to; let d = A.from; let h = A.value; const k = H(d) && H(a); const l = H(h); let y = e.svgElem; const p = !y; let g = []; let t = A.color; const x = u(A.zIndex,
            0); const L = A.events; g = { class: 'highcharts-plot-' + (k ? 'band ' : 'line ') + (A.className || '') }; const E = {}; const n = r.chart.renderer; let z = k ? 'bands' : 'lines'; r.isLog && (d = r.log2lin(d), a = r.log2lin(a), h = r.log2lin(h)); r.chart.styledMode || (l ? (g.stroke = t || '#999999', g['stroke-width'] = u(A.width, 1), A.dashStyle && (g.dashstyle = A.dashStyle)) : k && (g.fill = t || '#e6ebf5', A.borderWidth && (g.stroke = A.borderColor, g['stroke-width'] = A.borderWidth))); E.zIndex = x; z += '-' + x; (t = r.plotLinesAndBandsGroups[z]) || (r.plotLinesAndBandsGroups[z] = t = n.g('plot-' + z).attr(E).add())
          p && (e.svgElem = y = n.path().attr(g).add(t)); if (l)g = r.getPlotLinePath({ value: h, lineWidth: y.strokeWidth(), acrossPanes: A.acrossPanes }); else if (k)g = r.getPlotBandPath(d, a, A); else return; (p || !y.d) && g && g.length ? (y.attr({ d: g }), L && B(L, function (a, b) { y.on(b, function (a) { L[b].apply(e, [a]) }) })) : y && (g ? (y.show(!0), y.animate({ d: g })) : y.d && (y.hide(), b && (e.label = b = b.destroy()))); f && (H(f.text) || H(f.formatter)) && g && g.length && r.width > 0 && r.height > 0 && !g.isFlat
            ? (f = w({
                align: q && k && 'center',
                x: q ? !k && 4 : 10,
                verticalAlign: !q && k && 'middle',
                y: q ? k ? 16 : 10 : k ? 6 : -4,
                rotation: q && !k && 90
              }, f), this.renderLabel(f, g, k, x))
            : b && b.hide(); return e
        },
        renderLabel: function (c, e, q, A) {
          let f = this.label; let b = this.axis.chart.renderer; f || (f = { align: c.textAlign || c.align, rotation: c.rotation, class: 'highcharts-plot-' + (q ? 'band' : 'line') + '-label ' + (c.className || '') }, f.zIndex = A, A = this.getLabelText(c), this.label = f = b.text(A, 0, 0, c.useHTML).attr(f).add(), this.axis.chart.styledMode || f.css(c.style)); b = e.xBounds || [e[1], e[4], q ? e[6] : e[1]]; e = e.yBounds || [e[2], e[5], q ? e[7] : e[2]]; q = G(b)
          A = G(e); f.align(c, !1, { x: q, y: A, width: I(b) - q, height: I(e) - A }); f.show(!0)
        },
        getLabelText: function (c) { return H(c.formatter) ? c.formatter.call(this) : c.text },
        destroy: function () { q(this.axis.plotLinesAndBands, this); delete this.axis; v(this) }
      }; C(e.prototype, {
        getPlotBandPath: function (c, e) {
          const m = this.getPlotLinePath({ value: e, force: !0, acrossPanes: this.options.acrossPanes }); const r = this.getPlotLinePath({ value: c, force: !0, acrossPanes: this.options.acrossPanes }); const f = []; const b = this.horiz; let a = 1; c = c < this.min && e < this.min || c > this.max && e >
this.max; if (r && m) { if (c) { var d = r.toString() === m.toString(); a = 0 } for (c = 0; c < r.length; c += 6)b && m[c + 1] === r[c + 1] ? (m[c + 1] += a, m[c + 4] += a) : b || m[c + 2] !== r[c + 2] || (m[c + 2] += a, m[c + 5] += a), f.push('M', r[c + 1], r[c + 2], 'L', r[c + 4], r[c + 5], m[c + 4], m[c + 5], m[c + 1], m[c + 2], 'z'), f.isFlat = d } return f
        },
        addPlotBand: function (c) { return this.addPlotBandOrLine(c, 'plotBands') },
        addPlotLine: function (c) { return this.addPlotBandOrLine(c, 'plotLines') },
        addPlotBandOrLine: function (e, r) {
          const m = (new c.PlotLineOrBand(this, e)).render(); const q = this.userOptions
          if (m) { if (r) { const f = q[r] || []; f.push(e); q[r] = f } this.plotLinesAndBands.push(m) } return m
        },
        removePlotBandOrLine: function (c) { for (var e = this.plotLinesAndBands, m = this.options, A = this.userOptions, f = e.length; f--;)e[f].id === c && e[f].destroy(); [m.plotLines || [], A.plotLines || [], m.plotBands || [], A.plotBands || []].forEach(function (b) { for (f = b.length; f--;)b[f].id === c && q(b, b[f]) }) },
        removePlotBand: function (c) { this.removePlotBandOrLine(c) },
        removePlotLine: function (c) { this.removePlotBandOrLine(c) }
      })
    }); M(J, 'parts/Tooltip.js',
    [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
      const F = e.clamp; const I = e.defined; const G = e.discardElement; const H = e.extend; const v = e.isNumber; const q = e.isString; const C = e.pick; const B = e.splat; const u = e.syncTimeout; ''; const w = c.doc; const m = c.format; const r = c.merge; const D = c.timeUnits; c.Tooltip = function () { this.init.apply(this, arguments) }; c.Tooltip.prototype = {
        init: function (c, f) {
          this.chart = c; this.options = f; this.crosshairs = []; this.now = { x: 0, y: 0 }; this.isHidden = !0; this.split = f.split && !c.inverted && !c.polar; this.shared = f.shared || this.split; this.outside = C(f.outside,
            !(!c.scrollablePixelsX && !c.scrollablePixelsY))
        },
        cleanSplit: function (c) { this.chart.series.forEach(function (f) { const b = f && f.tt; b && (!b.isActive || c ? f.tt = b.destroy() : b.isActive = !1) }) },
        applyFilter: function () {
          const c = this.chart; c.renderer.definition({
            tagName: 'filter',
            id: 'drop-shadow-' + c.index,
            opacity: 0.5,
            children: [{ tagName: 'feGaussianBlur', in: 'SourceAlpha', stdDeviation: 1 }, { tagName: 'feOffset', dx: 1, dy: 1 }, { tagName: 'feComponentTransfer', children: [{ tagName: 'feFuncA', type: 'linear', slope: 0.3 }] }, {
              tagName: 'feMerge',
              children: [{ tagName: 'feMergeNode' }, { tagName: 'feMergeNode', in: 'SourceGraphic' }]
            }]
          }); c.renderer.definition({ tagName: 'style', textContent: '.highcharts-tooltip-' + c.index + '{filter:url(#drop-shadow-' + c.index + ')}' })
        },
        getLabel: function () {
          const e = this; let f = this.chart.renderer; const b = this.chart.styledMode; const a = this.options; const d = 'tooltip' + (I(a.className) ? ' ' + a.className : ''); let h; if (!this.label) {
            this.outside && (this.container = h = c.doc.createElement('div'), h.className = 'highcharts-tooltip-container', c.css(h, {
              position: 'absolute',
              top: '1px',
              pointerEvents: a.style && a.style.pointerEvents,
              zIndex: 3
            }), c.doc.body.appendChild(h), this.renderer = f = new c.Renderer(h, 0, 0, {}, void 0, void 0, f.styledMode)); this.split ? this.label = f.g(d) : (this.label = f.label('', 0, 0, a.shape || 'callout', null, null, a.useHTML, null, d).attr({ padding: a.padding, r: a.borderRadius }), b || this.label.attr({ fill: a.backgroundColor, 'stroke-width': a.borderWidth }).css(a.style).shadow(a.shadow)); b && (this.applyFilter(), this.label.addClass('highcharts-tooltip-' + this.chart.index)); if (e.outside && !e.split) {
              const k =
{ x: this.label.xSetter, y: this.label.ySetter }; this.label.xSetter = function (a, b) { k[b].call(this.label, e.distance); h.style.left = a + 'px' }; this.label.ySetter = function (a, b) { k[b].call(this.label, e.distance); h.style.top = a + 'px' }
            } this.label.attr({ zIndex: 8 }).add()
          } return this.label
        },
        update: function (c) { this.destroy(); r(!0, this.chart.options.tooltip.userOptions, c); this.init(this.chart, r(!0, this.options, c)) },
        destroy: function () {
          this.label && (this.label = this.label.destroy()); this.split && this.tt && (this.cleanSplit(this.chart,
            !0), this.tt = this.tt.destroy()); this.renderer && (this.renderer = this.renderer.destroy(), G(this.container)); c.clearTimeout(this.hideTimer); c.clearTimeout(this.tooltipTimeout)
        },
        move: function (e, f, b, a) {
          const d = this; const h = d.now; const k = !1 !== d.options.animation && !d.isHidden && (Math.abs(e - h.x) > 1 || Math.abs(f - h.y) > 1); const l = d.followPointer || d.len > 1; H(h, { x: k ? (2 * h.x + e) / 3 : e, y: k ? (h.y + f) / 2 : f, anchorX: l ? void 0 : k ? (2 * h.anchorX + b) / 3 : b, anchorY: l ? void 0 : k ? (h.anchorY + a) / 2 : a }); d.getLabel().attr(h); k && (c.clearTimeout(this.tooltipTimeout), this.tooltipTimeout =
setTimeout(function () { d && d.move(e, f, b, a) }, 32))
        },
        hide: function (e) { const f = this; c.clearTimeout(this.hideTimer); e = C(e, this.options.hideDelay, 500); this.isHidden || (this.hideTimer = u(function () { f.getLabel()[e ? 'fadeOut' : 'hide'](); f.isHidden = !0 }, e)) },
        getAnchor: function (c, f) {
          const b = this.chart; const a = b.pointer; const d = b.inverted; const h = b.plotTop; const k = b.plotLeft; let l = 0; let e = 0; let p; let g; c = B(c); this.followPointer && f
            ? (typeof f.chartX === 'undefined' && (f = a.normalize(f)), c = [f.chartX - b.plotLeft, f.chartY - h])
            : c[0].tooltipPos
              ? c = c[0].tooltipPos
              : (c.forEach(function (a) {
                  p =
a.series.yAxis; g = a.series.xAxis; l += a.plotX + (!d && g ? g.left - k : 0); e += (a.plotLow ? (a.plotLow + a.plotHigh) / 2 : a.plotY) + (!d && p ? p.top - h : 0)
                }), l /= c.length, e /= c.length, c = [d ? b.plotWidth - e : l, this.shared && !d && c.length > 1 && f ? f.chartY - h : d ? b.plotHeight - l : e]); return c.map(Math.round)
        },
        getPosition: function (c, f, b) {
          const a = this.chart; const d = this.distance; const h = {}; const k = a.inverted && b.h || 0; let l; const e = this.outside; const p = e ? w.documentElement.clientWidth - 2 * d : a.chartWidth; const g = e
            ? Math.max(w.body.scrollHeight, w.documentElement.scrollHeight, w.body.offsetHeight,
                w.documentElement.offsetHeight, w.documentElement.clientHeight)
            : a.chartHeight; const t = a.pointer.getChartPosition(); const x = a.containerScaling; const L = function (a) { return x ? a * x.scaleX : a }; const E = function (a) { return x ? a * x.scaleY : a }; const n = function (h) { const n = h === 'x'; return [h, n ? p : g, n ? c : f].concat(e ? [n ? L(c) : E(f), n ? t.left - d + L(b.plotX + a.plotLeft) : t.top - d + E(b.plotY + a.plotTop), 0, n ? p : g] : [n ? c : f, n ? b.plotX + a.plotLeft : b.plotY + a.plotTop, n ? a.plotLeft : a.plotTop, n ? a.plotLeft + a.plotWidth : a.plotTop + a.plotHeight]) }; let z = n('y'); let m = n('x'); const r = !this.followPointer &&
C(b.ttBelow, !a.inverted === !!b.negative); const q = function (a, b, g, f, c, t, n) { const l = a === 'y' ? E(d) : L(d); const x = (g - f) / 2; const e = f < c - d; const p = c + d + f < b; const z = c - l - g + x; c = c + l - x; if (r && p)h[a] = c; else if (!r && e)h[a] = z; else if (e)h[a] = Math.min(n - f, z - k < 0 ? z : z - k); else if (p)h[a] = Math.max(t, c + k + g > b ? c : c + k); else return !1 }; const A = function (a, b, g, f, c) { let t; c < d || c > b - d ? t = !1 : h[a] = c < g / 2 ? 1 : c > b - f / 2 ? b - f - 2 : c - g / 2; return t }; const u = function (a) { const b = z; z = m; m = b; l = a }; var v = function () { !1 !== q.apply(0, z) ? !1 !== A.apply(0, m) || l || (u(!0), v()) : l ? h.x = h.y = 0 : (u(!0), v()) }; (a.inverted || this.len > 1) &&
u(); v(); return h
        },
        defaultFormatter: function (c) { const f = this.points || B(this); let b = [c.tooltipFooterHeaderFormatter(f[0])]; b = b.concat(c.bodyFormatter(f)); b.push(c.tooltipFooterHeaderFormatter(f[0], !0)); return b },
        refresh: function (e, f) {
          let b = this.chart; const a = this.options; let d = e; let h = {}; const k = []; let l = a.formatter || this.defaultFormatter; h = this.shared; const y = b.styledMode; if (a.enabled) {
            c.clearTimeout(this.hideTimer); this.followPointer = B(d)[0].series.tooltipOptions.followPointer; const p = this.getAnchor(d, f); f = p[0]; const g = p[1]; !h ||
d.series && d.series.noSharedTooltip
              ? h = d.getLabelConfig()
              : (b.pointer.applyInactiveState(d), d.forEach(function (a) { a.setState('hover'); k.push(a.getLabelConfig()) }), h = { x: d[0].category, y: d[0].y }, h.points = k, d = d[0]); this.len = k.length; b = l.call(h, this); l = d.series; this.distance = C(l.tooltipOptions.distance, 16); !1 === b
              ? this.hide()
              : (this.split
                  ? this.renderSplit(b, B(e))
                  : (e = this.getLabel(), a.style.width && !y || e.css({ width: this.chart.spacingBox.width }), e.attr({ text: b && b.join ? b.join('') : b }), e.removeClass(/highcharts-color-[\d]+/g).addClass('highcharts-color-' +
C(d.colorIndex, l.colorIndex)), y || e.attr({ stroke: a.borderColor || d.color || l.color || '#666666' }), this.updatePosition({ plotX: f, plotY: g, negative: d.negative, ttBelow: d.ttBelow, h: p[2] || 0 })), this.isHidden && this.label && this.label.attr({ opacity: 1 }).show(), this.isHidden = !1); c.fireEvent(this, 'refresh')
          }
        },
        renderSplit: function (e, f) {
          function b (a, b, d, g, c) { void 0 === c && (c = !0); d ? (b = D ? 0 : I, a = F(a - g / 2, K.left, K.right - g)) : (b -= B, a = c ? a - g - v : a + v, a = F(a, c ? a : K.left, K.right)); return { x: a, y: b } } const a = this; let d = a.chart; let h = a.chart; const k = h.chartWidth
          const l = h.chartHeight; const y = h.plotHeight; const p = h.plotLeft; const g = h.plotTop; const t = h.plotWidth; let x = h.pointer; const L = h.renderer; let E = h.scrollablePixelsX; E = void 0 === E ? 0 : E; let n = h.scrollablePixelsY; const z = void 0 === n ? 0 : n; n = h.scrollingContainer; n = void 0 === n ? { scrollLeft: 0, scrollTop: 0 } : n; const m = n.scrollLeft; const r = n.scrollTop; const u = h.styledMode; var v = a.distance; const w = a.options; const A = a.options.positioner; var K = { left: E ? p : 0, right: E ? p + t - E : k, top: z ? g : 0, bottom: z ? g + y - z : l }; const R = a.getLabel(); var D = !(!d.xAxis[0] || !d.xAxis[0].opposite); var B = g; let G = 0; var I = y - z; q(e) && (e = [!1, e]); e = e.slice(0, f.length +
1).reduce(function (d, c, h) {
            if (!1 !== c && c !== '') {
              h = f[h - 1] || { isHeader: !0, plotX: f[0].plotX, plotY: y, series: {} }; const t = h.isHeader; let n = t ? a : h.series; let l = n.tt; let x = h.isHeader; let e = h.series; let k = 'highcharts-color-' + C(h.colorIndex, e.colorIndex, 'none'); l || (l = { padding: w.padding, r: w.borderRadius }, u || (l.fill = w.backgroundColor, l['stroke-width'] = w.borderWidth), l = L.label(null, null, null, w[x ? 'headerShape' : 'shape'] || 'callout', null, null, w.useHTML).addClass(x ? 'highcharts-tooltip-header ' : 'highcharts-tooltip-box ' + k).attr(l).add(R))
              l.isActive = !0; l.attr({ text: c }); u || l.css(w.style).shadow(w.shadow).attr({ stroke: w.borderColor || h.color || e.color || '#333333' }); c = n.tt = l; x = c.getBBox(); n = x.width + c.strokeWidth(); t && (G = x.height, I += G, D && (B -= G)); e = h.plotX; e = void 0 === e ? 0 : e; k = h.plotY; k = void 0 === k ? 0 : k; let E = h.series; h.isHeader ? (e = p + e - m, k = g + (y - z) / 2) : (l = E.xAxis, E = E.yAxis, e = l.pos + F(e, -v, l.len + v) - m, k = E.pos + F(k, 0, E.len) - r); e = F(e, K.left - v, K.right + v); k = F(k, K.top, K.bottom); x = x.height + 1; l = A ? A.call(a, n, x, h) : b(e, k, t, n); d.push({
                align: A ? 0 : void 0,
                anchorX: e,
                anchorY: k,
                boxWidth: n,
                point: h,
                rank: C(l.rank, t ? 1 : 0),
                size: x,
                target: l.y,
                tt: c,
                x: l.x
              })
            } return d
          }, []); !A && e.some(function (a) { return a.x < 0 }) && (e = e.map(function (a) { const d = b(a.anchorX, a.anchorY, a.point.isHeader, a.boxWidth, !1); return H(a, { target: d.y, x: d.x }) })); a.cleanSplit(); c.distribute(e, I, void 0); e.forEach(function (a) { const b = a.pos; a.tt.attr({ visibility: typeof b === 'undefined' ? 'hidden' : 'inherit', x: a.x, y: b + B, anchorX: a.anchorX, anchorY: a.anchorY }) }); e = a.container; d = a.renderer; a.outside && e && d && (h = R.getBBox(), d.setSize(h.width +
h.x, h.height + h.y, !1), x = x.getChartPosition(), e.style.left = x.left + 'px', e.style.top = x.top + 'px')
        },
        updatePosition: function (e) {
          let f = this.chart; let b = f.pointer; const a = this.getLabel(); let d = e.plotX + f.plotLeft; let h = e.plotY + f.plotTop; b = b.getChartPosition(); e = (this.options.positioner || this.getPosition).call(this, a.width, a.height, e); if (this.outside) {
            const k = (this.options.borderWidth || 0) + 2 * this.distance; this.renderer.setSize(a.width + k, a.height + k, !1); if (f = f.containerScaling) {
              c.css(this.container, {
                transform: 'scale(' + f.scaleX + ', ' +
f.scaleY + ')'
              }), d *= f.scaleX, h *= f.scaleY
            }d += b.left - e.x; h += b.top - e.y
          } this.move(Math.round(e.x), Math.round(e.y || 0), d, h)
        },
        getDateFormat: function (c, f, b, a) {
          const d = this.chart.time; const h = d.dateFormat('%m-%d %H:%M:%S.%L', f); const e = { millisecond: 15, second: 12, minute: 9, hour: 6, day: 3 }; let l = 'millisecond'; for (y in D) { if (c === D.week && +d.dateFormat('%w', f) === b && h.substr(6) === '00:00:00.000') { var y = 'week'; break } if (D[y] > c) { y = l; break } if (e[y] && h.substr(e[y]) !== '01-01 00:00:00.000'.substr(e[y])) break; y !== 'week' && (l = y) } if (y) var p = d.resolveDTLFormat(a[y]).main
          return p
        },
        getXDateFormat: function (c, f, b) { f = f.dateTimeLabelFormats; const a = b && b.closestPointRange; return (a ? this.getDateFormat(a, c.x, b.options.startOfWeek, f) : f.day) || f.year },
        tooltipFooterHeaderFormatter: function (e, f) {
          const b = f ? 'footer' : 'header'; const a = e.series; const d = a.tooltipOptions; let h = d.xDateFormat; const k = a.xAxis; const l = k && k.options.type === 'datetime' && v(e.key); let y = d[b + 'Format']; f = { isFooter: f, labelConfig: e }; c.fireEvent(this, 'headerFormatter', f, function (b) {
            l && !h && (h = this.getXDateFormat(e, d, k)); l && h && (e.point && e.point.tooltipDateKeys ||
['key']).forEach(function (a) { y = y.replace('{point.' + a + '}', '{point.' + a + ':' + h + '}') }); a.chart.styledMode && (y = this.styledModeFormat(y)); b.text = m(y, { point: e, series: a }, this.chart)
          }); return f.text
        },
        bodyFormatter: function (c) { return c.map(function (c) { const b = c.series.tooltipOptions; return (b[(c.point.formatPrefix || 'point') + 'Formatter'] || c.point.tooltipFormatter).call(c.point, b[(c.point.formatPrefix || 'point') + 'Format'] || '') }) },
        styledModeFormat: function (c) {
          return c.replace('style="font-size: 10px"', 'class="highcharts-header"').replace(/style="color:{(point|series)\.color}"/g,
            'class="highcharts-color-{$1.colorIndex}"')
        }
      }
    }); M(J, 'parts/Pointer.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.attr; const I = e.defined; const G = e.extend; const H = e.isNumber; const v = e.isObject; const q = e.objectEach; const C = e.offset; const B = e.pick; const u = e.splat; const w = c.addEvent; const m = c.charts; const r = c.color; const D = c.css; const A = c.find; const f = c.fireEvent; const b = c.Tooltip; c.Pointer = function (a, b) { this.init(a, b) }; c.Pointer.prototype = {
      init: function (a, d) {
        this.options = d; this.chart = a; this.runChartClick = d.chart.events && !!d.chart.events.click; this.pinchDown = []
        this.lastValidTouch = {}; b && (a.tooltip = new b(a, d.tooltip), this.followTouchMove = B(d.tooltip.followTouchMove, !0)); this.setDOMEvents()
      },
      zoomOption: function (a) { let b = this.chart; const c = b.options.chart; let f = c.zoomType || ''; b = b.inverted; /touch/.test(a.type) && (f = B(c.pinchType, f)); this.zoomX = a = /x/.test(f); this.zoomY = f = /y/.test(f); this.zoomHor = a && !b || f && b; this.zoomVert = f && !b || a && b; this.hasZoom = a || f },
      getChartPosition: function () {
        let a = this.chart; a = a.scrollingContainer || a.container; return this.chartPosition || (this.chartPosition =
C(a))
      },
      normalize: function (a, b) { let d = a.touches ? a.touches.length ? a.touches.item(0) : a.changedTouches[0] : a; b || (b = this.getChartPosition()); let c = d.pageX - b.left; b = d.pageY - b.top; if (d = this.chart.containerScaling)c /= d.scaleX, b /= d.scaleY; return G(a, { chartX: Math.round(c), chartY: Math.round(b) }) },
      getCoordinates: function (a) { const b = { xAxis: [], yAxis: [] }; this.chart.axes.forEach(function (d) { b[d.isXAxis ? 'xAxis' : 'yAxis'].push({ axis: d, value: d.toValue(a[d.horiz ? 'chartX' : 'chartY']) }) }); return b },
      findNearestKDPoint: function (a,
        b, c) { let d; a.forEach(function (a) { let f = !(a.noSharedTooltip && b) && a.options.findNearestPointBy.indexOf('y') < 0; a = a.searchPoint(c, f); if ((f = v(a, !0)) && !(f = !v(d, !0))) { f = d.distX - a.distX; const h = d.dist - a.dist; const g = (a.series.group && a.series.group.zIndex) - (d.series.group && d.series.group.zIndex); f = (f !== 0 && b ? f : h !== 0 ? h : g !== 0 ? g : d.series.index > a.series.index ? -1 : 1) > 0 }f && (d = a) }); return d },
      getPointFromEvent: function (a) { a = a.target; for (var b; a && !b;)b = a.point, a = a.parentNode; return b },
      getChartCoordinatesFromPoint: function (a,
        b) { let d = a.series; const c = d.xAxis; d = d.yAxis; const f = B(a.clientX, a.plotX); const e = a.shapeArgs; if (c && d) return b ? { chartX: c.len + c.pos - f, chartY: d.len + d.pos - a.plotY } : { chartX: f + c.pos, chartY: a.plotY + d.pos }; if (e && e.x && e.y) return { chartX: e.x, chartY: e.y } },
      getHoverData: function (a, b, c, f, e, y) {
        let d; const g = []; f = !(!f || !a); let h = b && !b.stickyTracking ? [b] : c.filter(function (a) { return a.visible && !(!e && a.directTouch) && B(a.options.enableMouseTracking, !0) && a.stickyTracking }); b = (d = f || !y ? a : this.findNearestKDPoint(h, e, y)) && d.series; d && (e && !b.noSharedTooltip
          ? (h = c.filter(function (a) { return a.visible && !(!e && a.directTouch) && B(a.options.enableMouseTracking, !0) && !a.noSharedTooltip }), h.forEach(function (a) { let b = A(a.points, function (a) { return a.x === d.x && !a.isNull }); v(b) && (a.chart.isBoosting && (b = a.getPoint(b)), g.push(b)) }))
          : g.push(d)); return { hoverPoint: d, hoverSeries: b, hoverPoints: g }
      },
      runPointActions: function (a, b) {
        const d = this.chart; const f = d.tooltip && d.tooltip.options.enabled ? d.tooltip : void 0; let e = f ? f.shared : !1; let y = b || d.hoverPoint; let p = y && y.series || d.hoverSeries; p = this.getHoverData(y,
          p, d.series, (!a || a.type !== 'touchmove') && (!!b || p && p.directTouch && this.isDirectTouch), e, a); y = p.hoverPoint; const g = p.hoverPoints; b = (p = p.hoverSeries) && p.tooltipOptions.followPointer; e = e && p && !p.noSharedTooltip; if (y && (y !== d.hoverPoint || f && f.isHidden)) {
          (d.hoverPoints || []).forEach(function (a) { g.indexOf(a) === -1 && a.setState() }); if (d.hoverSeries !== p)p.onMouseOver(); this.applyInactiveState(g); (g || []).forEach(function (a) { a.setState('hover') }); d.hoverPoint && d.hoverPoint.firePointEvent('mouseOut'); if (!y.series) return
          y.firePointEvent('mouseOver'); d.hoverPoints = g; d.hoverPoint = y; f && f.refresh(e ? g : y, a)
        } else b && f && !f.isHidden && (y = f.getAnchor([{}], a), f.updatePosition({ plotX: y[0], plotY: y[1] })); this.unDocMouseMove || (this.unDocMouseMove = w(d.container.ownerDocument, 'mousemove', function (a) { const b = m[c.hoverChartIndex]; if (b)b.pointer.onDocumentMouseMove(a) })); d.axes.forEach(function (b) { const d = B(b.crosshair.snap, !0); const f = d ? c.find(g, function (a) { return a.series[b.coll] === b }) : void 0; f || !d ? b.drawCrosshair(a, f) : b.hideCrosshair() })
      },
      applyInactiveState: function (a) { let b = []; let c; (a || []).forEach(function (a) { c = a.series; b.push(c); c.linkedParent && b.push(c.linkedParent); c.linkedSeries && (b = b.concat(c.linkedSeries)); c.navigatorSeries && b.push(c.navigatorSeries) }); this.chart.series.forEach(function (a) { b.indexOf(a) === -1 ? a.setState('inactive', !0) : a.options.inactiveOtherPoints && a.setAllPointsToState('inactive') }) },
      reset: function (a, b) {
        const d = this.chart; const c = d.hoverSeries; const f = d.hoverPoint; const e = d.hoverPoints; const p = d.tooltip; const g = p && p.shared ? e : f; a && g && u(g).forEach(function (b) {
          b.series.isCartesian &&
typeof b.plotX === 'undefined' && (a = !1)
        }); if (a)p && g && u(g).length && (p.refresh(g), p.shared && e ? e.forEach(function (a) { a.setState(a.state, !0); a.series.isCartesian && (a.series.xAxis.crosshair && a.series.xAxis.drawCrosshair(null, a), a.series.yAxis.crosshair && a.series.yAxis.drawCrosshair(null, a)) }) : f && (f.setState(f.state, !0), d.axes.forEach(function (a) { a.crosshair && f.series[a.coll] === a && a.drawCrosshair(null, f) }))); else {
          if (f)f.onMouseOut(); e && e.forEach(function (a) { a.setState() }); if (c)c.onMouseOut(); p && p.hide(b)
          this.unDocMouseMove && (this.unDocMouseMove = this.unDocMouseMove()); d.axes.forEach(function (a) { a.hideCrosshair() }); this.hoverX = d.hoverPoints = d.hoverPoint = null
        }
      },
      scaleGroups: function (a, b) { const d = this.chart; let c; d.series.forEach(function (f) { c = a || f.getPlotBox(); f.xAxis && f.xAxis.zoomEnabled && f.group && (f.group.attr(c), f.markerGroup && (f.markerGroup.attr(c), f.markerGroup.clip(b ? d.clipRect : null)), f.dataLabelsGroup && f.dataLabelsGroup.attr(c)) }); d.clipRect.attr(b || d.clipBox) },
      dragStart: function (a) {
        const b = this.chart
        b.mouseIsDown = a.type; b.cancelClick = !1; b.mouseDownX = this.mouseDownX = a.chartX; b.mouseDownY = this.mouseDownY = a.chartY
      },
      drag: function (a) {
        const b = this.chart; const c = b.options.chart; let f = a.chartX; let e = a.chartY; const m = this.zoomHor; const p = this.zoomVert; const g = b.plotLeft; const t = b.plotTop; const x = b.plotWidth; const L = b.plotHeight; let E = this.selectionMarker; const n = this.mouseDownX; const z = this.mouseDownY; const q = v(c.panning) ? c.panning && c.panning.enabled : c.panning; const u = c.panKey && a[c.panKey + 'Key']; if (!E || !E.touch) {
          if (f < g ? f = g : f > g + x && (f = g + x), e < t ? e = t : e > t + L && (e = t + L), this.hasDragged = Math.sqrt(Math.pow(n -
f, 2) + Math.pow(z - e, 2)), this.hasDragged > 10) { const w = b.isInsidePlot(n - g, z - t); b.hasCartesianSeries && (this.zoomX || this.zoomY) && w && !u && !E && (this.selectionMarker = E = b.renderer.rect(g, t, m ? 1 : x, p ? 1 : L, 0).attr({ class: 'highcharts-selection-marker', zIndex: 7 }).add(), b.styledMode || E.attr({ fill: c.selectionMarkerFill || r('#335cad').setOpacity(0.25).get() })); E && m && (f -= n, E.attr({ width: Math.abs(f), x: (f > 0 ? 0 : f) + n })); E && p && (f = e - z, E.attr({ height: Math.abs(f), y: (f > 0 ? 0 : f) + z })); w && !E && q && b.pan(a, c.panning) }
        }
      },
      drop: function (a) {
        const b =
this; const c = this.chart; const e = this.hasPinched; if (this.selectionMarker) {
          const l = { originalEvent: a, xAxis: [], yAxis: [] }; const m = this.selectionMarker; const p = m.attr ? m.attr('x') : m.x; const g = m.attr ? m.attr('y') : m.y; const t = m.attr ? m.attr('width') : m.width; const x = m.attr ? m.attr('height') : m.height; let L; if (this.hasDragged || e) {
            c.axes.forEach(function (d) {
              if (d.zoomEnabled && I(d.min) && (e || b[{ xAxis: 'zoomX', yAxis: 'zoomY' }[d.coll]])) {
                let c = d.horiz; const f = a.type === 'touchend' ? d.minPixelPadding : 0; const h = d.toValue((c ? p : g) + f); c = d.toValue((c ? p + t : g + x) - f); l[d.coll].push({
                  axis: d,
                  min: Math.min(h,
                    c),
                  max: Math.max(h, c)
                }); L = !0
              }
            }), L && f(c, 'selection', l, function (a) { c.zoom(G(a, e ? { animation: !1 } : null)) })
          }H(c.index) && (this.selectionMarker = this.selectionMarker.destroy()); e && this.scaleGroups()
        }c && H(c.index) && (D(c.container, { cursor: c._cursor }), c.cancelClick = this.hasDragged > 10, c.mouseIsDown = this.hasDragged = this.hasPinched = !1, this.pinchDown = [])
      },
      onContainerMouseDown: function (a) { a = this.normalize(a); a.button !== 2 && (this.zoomOption(a), a.preventDefault && a.preventDefault(), this.dragStart(a)) },
      onDocumentMouseUp: function (a) {
        m[c.hoverChartIndex] &&
m[c.hoverChartIndex].pointer.drop(a)
      },
      onDocumentMouseMove: function (a) { const b = this.chart; const c = this.chartPosition; a = this.normalize(a, c); !c || this.inClass(a.target, 'highcharts-tracker') || b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop) || this.reset() },
      onContainerMouseLeave: function (a) { const b = m[c.hoverChartIndex]; b && (a.relatedTarget || a.toElement) && (b.pointer.reset(), b.pointer.chartPosition = void 0) },
      onContainerMouseMove: function (a) {
        const b = this.chart; I(c.hoverChartIndex) && m[c.hoverChartIndex] && m[c.hoverChartIndex].mouseIsDown ||
(c.hoverChartIndex = b.index); a = this.normalize(a); a.preventDefault || (a.returnValue = !1); b.mouseIsDown === 'mousedown' && this.drag(a); !this.inClass(a.target, 'highcharts-tracker') && !b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop) || b.openMenu || this.runPointActions(a)
      },
      inClass: function (a, b) { for (var d; a;) { if (d = F(a, 'class')) { if (d.indexOf(b) !== -1) return !0; if (d.indexOf('highcharts-container') !== -1) return !1 }a = a.parentNode } },
      onTrackerMouseOut: function (a) {
        const b = this.chart.hoverSeries; a = a.relatedTarget || a.toElement
        this.isDirectTouch = !1; if (!(!b || !a || b.stickyTracking || this.inClass(a, 'highcharts-tooltip') || this.inClass(a, 'highcharts-series-' + b.index) && this.inClass(a, 'highcharts-tracker')))b.onMouseOut()
      },
      onContainerClick: function (a) {
        const b = this.chart; const c = b.hoverPoint; const e = b.plotLeft; const l = b.plotTop; a = this.normalize(a); b.cancelClick || (c && this.inClass(a.target, 'highcharts-tracker')
          ? (f(c.series, 'click', G(a, { point: c })), b.hoverPoint && c.firePointEvent('click', a))
          : (G(a, this.getCoordinates(a)), b.isInsidePlot(a.chartX - e, a.chartY -
l) && f(b, 'click', a)))
      },
      setDOMEvents: function () {
        const a = this; const b = a.chart.container; const f = b.ownerDocument; b.onmousedown = function (b) { a.onContainerMouseDown(b) }; b.onmousemove = function (b) { a.onContainerMouseMove(b) }; b.onclick = function (b) { a.onContainerClick(b) }; this.unbindContainerMouseLeave = w(b, 'mouseleave', a.onContainerMouseLeave); c.unbindDocumentMouseUp || (c.unbindDocumentMouseUp = w(f, 'mouseup', a.onDocumentMouseUp)); c.hasTouch && (w(b, 'touchstart', function (b) { a.onContainerTouchStart(b) }), w(b, 'touchmove', function (b) { a.onContainerTouchMove(b) }),
        c.unbindDocumentTouchEnd || (c.unbindDocumentTouchEnd = w(f, 'touchend', a.onDocumentTouchEnd)))
      },
      destroy: function () { const a = this; a.unDocMouseMove && a.unDocMouseMove(); this.unbindContainerMouseLeave(); c.chartCount || (c.unbindDocumentMouseUp && (c.unbindDocumentMouseUp = c.unbindDocumentMouseUp()), c.unbindDocumentTouchEnd && (c.unbindDocumentTouchEnd = c.unbindDocumentTouchEnd())); clearInterval(a.tooltipTimeout); q(a, function (b, c) { a[c] = null }) }
    }
  }); M(J, 'parts/TouchPointer.js', [J['parts/Globals.js'], J['parts/Utilities.js']],
    function (c, e) {
      const F = e.extend; const I = e.pick; const G = c.charts; const H = c.noop; F(c.Pointer.prototype, {
        pinchTranslate: function (c, e, C, B, u, w) { this.zoomHor && this.pinchTranslateDirection(!0, c, e, C, B, u, w); this.zoomVert && this.pinchTranslateDirection(!1, c, e, C, B, u, w) },
        pinchTranslateDirection: function (c, e, C, B, u, w, m, r) {
          const q = this.chart; const v = c ? 'x' : 'y'; const f = c ? 'X' : 'Y'; const b = 'chart' + f; const a = c ? 'width' : 'height'; const d = q['plot' + (c ? 'Left' : 'Top')]; let h; let k; let l = r || 1; const y = q.inverted; const p = q.bounds[c ? 'h' : 'v']; const g = e.length === 1; const t = e[0][b]; let x = C[0][b]; const L = !g && e[1][b]; let E = !g && C[1][b]; C =
function () { !g && Math.abs(t - L) > 20 && (l = r || Math.abs(x - E) / Math.abs(t - L)); k = (d - x) / l + t; h = q['plot' + (c ? 'Width' : 'Height')] / l }; C(); e = k; if (e < p.min) { e = p.min; var n = !0 } else e + h > p.max && (e = p.max - h, n = !0); n ? (x -= 0.8 * (x - m[v][0]), g || (E -= 0.8 * (E - m[v][1])), C()) : m[v] = [x, E]; y || (w[v] = k - d, w[a] = h); w = y ? 1 / l : l; u[a] = h; u[v] = e; B[y ? c ? 'scaleY' : 'scaleX' : 'scale' + f] = l; B['translate' + f] = w * d + (x - w * t)
        },
        pinch: function (c) {
          const e = this; const v = e.chart; const B = e.pinchDown; const u = c.touches; const w = u.length; const m = e.lastValidTouch; const r = e.hasZoom; let D = e.selectionMarker; const A = {}; const f = w === 1 && (e.inClass(c.target,
            'highcharts-tracker') && v.runTrackerClick || e.runChartClick); const b = {}; w > 1 && (e.initiated = !0); r && e.initiated && !f && c.preventDefault(); [].map.call(u, function (a) { return e.normalize(a) }); c.type === 'touchstart'
            ? ([].forEach.call(u, function (a, b) { B[b] = { chartX: a.chartX, chartY: a.chartY } }), m.x = [B[0].chartX, B[1] && B[1].chartX], m.y = [B[0].chartY, B[1] && B[1].chartY], v.axes.forEach(function (a) {
                if (a.zoomEnabled) {
                  const b = v.bounds[a.horiz ? 'h' : 'v']; const c = a.minPixelPadding; const f = a.toPixels(Math.min(I(a.options.min, a.dataMin), a.dataMin))
                  const e = a.toPixels(Math.max(I(a.options.max, a.dataMax), a.dataMax)); const m = Math.max(f, e); b.min = Math.min(a.pos, Math.min(f, e) - c); b.max = Math.max(a.pos + a.len, m + c)
                }
              }), e.res = !0)
            : e.followTouchMove && w === 1 ? this.runPointActions(e.normalize(c)) : B.length && (D || (e.selectionMarker = D = F({ destroy: H, touch: !0 }, v.plotBox)), e.pinchTranslate(B, u, A, D, b, m), e.hasPinched = r, e.scaleGroups(A, b), e.res && (e.res = !1, this.reset(!1, 0)))
        },
        touch: function (e, q) {
          const v = this.chart; let B; if (v.index !== c.hoverChartIndex) this.onContainerMouseLeave({ relatedTarget: !0 })
          c.hoverChartIndex = v.index; if (e.touches.length === 1) if (e = this.normalize(e), (B = v.isInsidePlot(e.chartX - v.plotLeft, e.chartY - v.plotTop)) && !v.openMenu) { q && this.runPointActions(e); if (e.type === 'touchmove') { q = this.pinchDown; var u = q[0] ? Math.sqrt(Math.pow(q[0].chartX - e.chartX, 2) + Math.pow(q[0].chartY - e.chartY, 2)) >= 4 : !1 }I(u, !0) && this.pinch(e) } else q && this.reset(); else e.touches.length === 2 && this.pinch(e)
        },
        onContainerTouchStart: function (c) { this.zoomOption(c); this.touch(c, !0) },
        onContainerTouchMove: function (c) { this.touch(c) },
        onDocumentTouchEnd: function (e) { G[c.hoverChartIndex] && G[c.hoverChartIndex].pointer.drop(e) }
      })
    }); M(J, 'parts/MSPointer.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.extend; const I = e.objectEach; e = e.wrap; const G = c.addEvent; const H = c.charts; const v = c.css; const q = c.doc; const C = c.noop; const B = c.Pointer; const u = c.removeEvent; const w = c.win; if (!c.hasTouch && (w.PointerEvent || w.MSPointerEvent)) {
      const m = {}; const r = !!w.PointerEvent; const D = function () {
        const c = []; c.item = function (b) { return this[b] }; I(m, function (b) { c.push({ pageX: b.pageX, pageY: b.pageY, target: b.target }) })
        return c
      }; const A = function (f, b, a, d) { f.pointerType !== 'touch' && f.pointerType !== f.MSPOINTER_TYPE_TOUCH || !H[c.hoverChartIndex] || (d(f), d = H[c.hoverChartIndex].pointer, d[b]({ type: a, target: f.currentTarget, preventDefault: C, touches: D() })) }; F(B.prototype, {
        onContainerPointerDown: function (c) { A(c, 'onContainerTouchStart', 'touchstart', function (b) { m[b.pointerId] = { pageX: b.pageX, pageY: b.pageY, target: b.currentTarget } }) },
        onContainerPointerMove: function (c) {
          A(c, 'onContainerTouchMove', 'touchmove', function (b) {
            m[b.pointerId] = {
              pageX: b.pageX,
              pageY: b.pageY
            }; m[b.pointerId].target || (m[b.pointerId].target = b.currentTarget)
          })
        },
        onDocumentPointerUp: function (c) { A(c, 'onDocumentTouchEnd', 'touchend', function (b) { delete m[b.pointerId] }) },
        batchMSEvents: function (c) { c(this.chart.container, r ? 'pointerdown' : 'MSPointerDown', this.onContainerPointerDown); c(this.chart.container, r ? 'pointermove' : 'MSPointerMove', this.onContainerPointerMove); c(q, r ? 'pointerup' : 'MSPointerUp', this.onDocumentPointerUp) }
      }); e(B.prototype, 'init', function (c, b, a) {
        c.call(this, b, a); this.hasZoom &&
v(b.container, { '-ms-touch-action': 'none', 'touch-action': 'none' })
      }); e(B.prototype, 'setDOMEvents', function (c) { c.apply(this); (this.hasZoom || this.followTouchMove) && this.batchMSEvents(G) }); e(B.prototype, 'destroy', function (c) { this.batchMSEvents(u); c.call(this) })
    }
  }); M(J, 'parts/Legend.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.defined; const I = e.discardElement; const G = e.isNumber; const H = e.pick; const v = e.relativeLength; const q = e.setAnimation; const C = e.syncTimeout; e = e.wrap; const B = c.addEvent; const u = c.css; const w = c.fireEvent
    const m = c.isFirefox; const r = c.marginNames; const D = c.merge; const A = c.stableSort; const f = c.win; c.Legend = function (b, a) { this.init(b, a) }; c.Legend.prototype = {
      init: function (b, a) { this.chart = b; this.setOptions(a); a.enabled && (this.render(), B(this.chart, 'endResize', function () { this.legend.positionCheckboxes() }), this.proximate ? this.unchartrender = B(this.chart, 'render', function () { this.legend.proximatePositions(); this.legend.positionItems() }) : this.unchartrender && this.unchartrender()) },
      setOptions: function (b) {
        const a = H(b.padding, 8); this.options = b
        this.chart.styledMode || (this.itemStyle = b.itemStyle, this.itemHiddenStyle = D(this.itemStyle, b.itemHiddenStyle)); this.itemMarginTop = b.itemMarginTop || 0; this.itemMarginBottom = b.itemMarginBottom || 0; this.padding = a; this.initialItemY = a - 5; this.symbolWidth = H(b.symbolWidth, 16); this.pages = []; this.proximate = b.layout === 'proximate' && !this.chart.inverted
      },
      update: function (b, a) { const d = this.chart; this.setOptions(D(!0, this.options, b)); this.destroy(); d.isDirtyLegend = d.isDirtyBox = !0; H(a, !0) && d.redraw(); w(this, 'afterUpdate') },
      colorizeItem: function (b, a) { b.legendGroup[a ? 'removeClass' : 'addClass']('highcharts-legend-item-hidden'); if (!this.chart.styledMode) { let d = this.options; const c = b.legendItem; const f = b.legendLine; const e = b.legendSymbol; const m = this.itemHiddenStyle.color; d = a ? d.itemStyle.color : m; const p = a ? b.color || m : m; const g = b.options && b.options.marker; let t = { fill: p }; c && c.css({ fill: d, color: d }); f && f.attr({ stroke: p }); e && (g && e.isMarker && (t = b.pointAttribs(), a || (t.stroke = t.fill = m)), e.attr(t)) }w(this, 'afterColorizeItem', { item: b, visible: a }) },
      positionItems: function () {
        this.allItems.forEach(this.positionItem,
          this); this.chart.isResizing || this.positionCheckboxes()
      },
      positionItem: function (b) { let a = this.options; const d = a.symbolPadding; a = !a.rtl; let c = b._legendItemPos; const f = c[0]; c = c[1]; const e = b.checkbox; if ((b = b.legendGroup) && b.element)b[F(b.translateY) ? 'animate' : 'attr']({ translateX: a ? f : this.legendWidth - f - 2 * d - 4, translateY: c }); e && (e.x = f, e.y = c) },
      destroyItem: function (b) { const a = b.checkbox; ['legendItem', 'legendLine', 'legendSymbol', 'legendGroup'].forEach(function (a) { b[a] && (b[a] = b[a].destroy()) }); a && I(b.checkbox) },
      destroy: function () {
        function b (a) {
          this[a] &&
(this[a] = this[a].destroy())
        } this.getAllItems().forEach(function (a) { ['legendItem', 'legendGroup'].forEach(b, a) }); 'clipRect up down pager nav box title group'.split(' ').forEach(b, this); this.display = null
      },
      positionCheckboxes: function () {
        const b = this.group && this.group.alignAttr; const a = this.clipHeight || this.legendHeight; const d = this.titleHeight; if (b) {
          const c = b.translateY; this.allItems.forEach(function (f) {
            const e = f.checkbox; if (e) {
              const h = c + d + e.y + (this.scrollOffset || 0) + 3; u(e, {
                left: b.translateX + f.checkboxOffset + e.x - 20 + 'px',
                top: h +
'px',
                display: this.proximate || h > c - 6 && h < c + a - 6 ? '' : 'none'
              })
            }
          }, this)
        }
      },
      renderTitle: function () {
        let b = this.options; const a = this.padding; const d = b.title; let c = 0; d.text && (this.title || (this.title = this.chart.renderer.label(d.text, a - 3, a - 4, null, null, null, b.useHTML, null, 'legend-title').attr({ zIndex: 1 }), this.chart.styledMode || this.title.css(d.style), this.title.add(this.group)), d.width || this.title.css({ width: this.maxLegendWidth + 'px' }), b = this.title.getBBox(), c = b.height, this.offsetWidth = b.width, this.contentGroup.attr({ translateY: c }))
        this.titleHeight = c
      },
      setText: function (b) { const a = this.options; b.legendItem.attr({ text: a.labelFormat ? c.format(a.labelFormat, b, this.chart) : a.labelFormatter.call(b) }) },
      renderItem: function (b) {
        let a = this.chart; const d = a.renderer; const c = this.options; const f = this.symbolWidth; const e = c.symbolPadding; const m = this.itemStyle; const p = this.itemHiddenStyle; let g = c.layout === 'horizontal' ? H(c.itemDistance, 20) : 0; const t = !c.rtl; let x = b.legendItem; const L = !b.series; const E = !L && b.series.drawLegendSymbol ? b.series : b; let n = E.options; n = this.createCheckboxForItem && n && n.showCheckbox; g = f + e +
g + (n ? 20 : 0); const z = c.useHTML; const r = b.options.className; x || (b.legendGroup = d.g('legend-item').addClass('highcharts-' + E.type + '-series highcharts-color-' + b.colorIndex + (r ? ' ' + r : '') + (L ? ' highcharts-series-' + b.index : '')).attr({ zIndex: 1 }).add(this.scrollGroup), b.legendItem = x = d.text('', t ? f + e : -e, this.baseline || 0, z), a.styledMode || x.css(D(b.visible ? m : p)), x.attr({ align: t ? 'left' : 'right', zIndex: 2 }).add(b.legendGroup), this.baseline || (this.fontMetrics = d.fontMetrics(a.styledMode ? 12 : m.fontSize, x), this.baseline = this.fontMetrics.f +
3 + this.itemMarginTop, x.attr('y', this.baseline)), this.symbolHeight = c.symbolHeight || this.fontMetrics.f, E.drawLegendSymbol(this, b), this.setItemEvents && this.setItemEvents(b, x, z)); n && !b.checkbox && this.createCheckboxForItem(b); this.colorizeItem(b, b.visible); !a.styledMode && m.width || x.css({ width: (c.itemWidth || this.widthOption || a.spacingBox.width) - g }); this.setText(b); a = x.getBBox(); b.itemWidth = b.checkboxOffset = c.itemWidth || b.legendItemWidth || a.width + g; this.maxItemWidth = Math.max(this.maxItemWidth, b.itemWidth)
        this.totalItemWidth += b.itemWidth; this.itemHeight = b.itemHeight = Math.round(b.legendItemHeight || a.height || this.symbolHeight)
      },
      layoutItem: function (b) {
        let a = this.options; const d = this.padding; const c = a.layout === 'horizontal'; const f = b.itemHeight; const e = this.itemMarginBottom; const m = this.itemMarginTop; const p = c ? H(a.itemDistance, 20) : 0; const g = this.maxLegendWidth; a = a.alignColumns && this.totalItemWidth > g ? this.maxItemWidth : b.itemWidth; c && this.itemX - d + a > g && (this.itemX = d, this.lastLineHeight && (this.itemY += m + this.lastLineHeight + e), this.lastLineHeight = 0)
        this.lastItemY = m + this.itemY + e; this.lastLineHeight = Math.max(f, this.lastLineHeight); b._legendItemPos = [this.itemX, this.itemY]; c ? this.itemX += a : (this.itemY += m + f + e, this.lastLineHeight = f); this.offsetWidth = this.widthOption || Math.max((c ? this.itemX - d - (b.checkbox ? 0 : p) : a) + d, this.offsetWidth)
      },
      getAllItems: function () {
        let b = []; this.chart.series.forEach(function (a) { const d = a && a.options; a && H(d.showInLegend, F(d.linkedTo) ? !1 : void 0, !0) && (b = b.concat(a.legendItems || (d.legendType === 'point' ? a.data : a))) }); w(this, 'afterGetAllItems',
          { allItems: b }); return b
      },
      getAlignment: function () { const b = this.options; return this.proximate ? b.align.charAt(0) + 'tv' : b.floating ? '' : b.align.charAt(0) + b.verticalAlign.charAt(0) + b.layout.charAt(0) },
      adjustMargins: function (b, a) {
        const d = this.chart; const c = this.options; const f = this.getAlignment(); f && [/(lth|ct|rth)/, /(rtv|rm|rbv)/, /(rbh|cb|lbh)/, /(lbv|lm|ltv)/].forEach(function (e, h) {
          e.test(f) && !F(b[h]) && (d[r[h]] = Math.max(d[r[h]], d.legend[(h + 1) % 2 ? 'legendHeight' : 'legendWidth'] + [1, -1, -1, 1][h] * c[h % 2 ? 'x' : 'y'] + H(c.margin, 12) + a[h] +
(d.titleOffset[h] || 0)))
        })
      },
      proximatePositions: function () {
        const b = this.chart; const a = []; const d = this.options.align === 'left'; this.allItems.forEach(function (f) { let e = d; if (f.yAxis && f.points) { f.xAxis.options.reversed && (e = !e); let h = c.find(e ? f.points : f.points.slice(0).reverse(), function (a) { return G(a.plotY) }); e = this.itemMarginTop + f.legendItem.getBBox().height + this.itemMarginBottom; const m = f.yAxis.top - b.plotTop; f.visible ? (h = h ? h.plotY : f.yAxis.height, h += m - 0.3 * e) : h = m + f.yAxis.height; a.push({ target: h, size: e, item: f }) } }, this); c.distribute(a,
          b.plotHeight); a.forEach(function (a) { a.item._legendItemPos[1] = b.plotTop - b.spacing[0] + a.pos })
      },
      render: function () {
        const b = this.chart; let a = b.renderer; let d = this.group; let c; let f = this.box; const e = this.options; const m = this.padding; this.itemX = m; this.itemY = this.initialItemY; this.lastItemY = this.offsetWidth = 0; this.widthOption = v(e.width, b.spacingBox.width - m); let p = b.spacingBox.width - 2 * m - e.x; ['rm', 'lm'].indexOf(this.getAlignment().substring(0, 2)) > -1 && (p /= 2); this.maxLegendWidth = this.widthOption || p; d || (this.group = d = a.g('legend').attr({ zIndex: 7 }).add(),
        this.contentGroup = a.g().attr({ zIndex: 1 }).add(d), this.scrollGroup = a.g().add(this.contentGroup)); this.renderTitle(); p = this.getAllItems(); A(p, function (a, b) { return (a.options && a.options.legendIndex || 0) - (b.options && b.options.legendIndex || 0) }); e.reversed && p.reverse(); this.allItems = p; this.display = c = !!p.length; this.itemHeight = this.totalItemWidth = this.maxItemWidth = this.lastLineHeight = 0; p.forEach(this.renderItem, this); p.forEach(this.layoutItem, this); p = (this.widthOption || this.offsetWidth) + m; let g = this.lastItemY +
this.lastLineHeight + this.titleHeight; g = this.handleOverflow(g); g += m; f || (this.box = f = a.rect().addClass('highcharts-legend-box').attr({ r: e.borderRadius }).add(d), f.isNew = !0); b.styledMode || f.attr({ stroke: e.borderColor, 'stroke-width': e.borderWidth || 0, fill: e.backgroundColor || 'none' }).shadow(e.shadow); p > 0 && g > 0 && (f[f.isNew ? 'attr' : 'animate'](f.crisp.call({}, { x: 0, y: 0, width: p, height: g }, f.strokeWidth())), f.isNew = !1); f[c ? 'show' : 'hide'](); b.styledMode && d.getStyle('display') === 'none' && (p = g = 0); this.legendWidth = p; this.legendHeight =
g; c && (a = b.spacingBox, f = a.y, /(lth|ct|rth)/.test(this.getAlignment()) && b.titleOffset[0] > 0 ? f += b.titleOffset[0] : /(lbh|cb|rbh)/.test(this.getAlignment()) && b.titleOffset[2] > 0 && (f -= b.titleOffset[2]), f !== a.y && (a = D(a, { y: f })), d.align(D(e, { width: p, height: g, verticalAlign: this.proximate ? 'top' : e.verticalAlign }), !0, a)); this.proximate || this.positionItems(); w(this, 'afterRender')
      },
      handleOverflow: function (b) {
        const a = this; const d = this.chart; const c = d.renderer; const f = this.options; let e = f.y; const m = this.padding; e = d.spacingBox.height + (f.verticalAlign === 'top'
          ? -e
          : e) - m; const p = f.maxHeight; let g; let t = this.clipRect; const x = f.navigation; const L = H(x.animation, !0); const E = x.arrowSize || 12; let n = this.nav; const z = this.pages; let r; const q = this.allItems; const u = function (b) { typeof b === 'number' ? t.attr({ height: b }) : t && (a.clipRect = t.destroy(), a.contentGroup.clip()); a.contentGroup.div && (a.contentGroup.div.style.clip = b ? 'rect(' + m + 'px,9999px,' + (m + b) + 'px,0)' : 'auto') }; const w = function (b) { a[b] = c.circle(0, 0, 1.3 * E).translate(E / 2, E / 2).add(n); d.styledMode || a[b].attr('fill', 'rgba(0,0,0,0.0001)'); return a[b] }; f.layout !== 'horizontal' || f.verticalAlign ===
'middle' || f.floating || (e /= 2); p && (e = Math.min(e, p)); z.length = 0; b > e && !1 !== x.enabled
          ? (this.clipHeight = g = Math.max(e - 20 - this.titleHeight - m, 0), this.currentPage = H(this.currentPage, 1), this.fullHeight = b, q.forEach(function (a, b) { const d = a._legendItemPos[1]; const c = Math.round(a.legendItem.getBBox().height); let f = z.length; if (!f || d - z[f - 1] > g && (r || d) !== z[f - 1])z.push(r || d), f++; a.pageIx = f - 1; r && (q[b - 1].pageIx = f - 1); b === q.length - 1 && d + c - z[f - 1] > g && d !== r && (z.push(d), a.pageIx = f); d !== r && (r = d) }), t || (t = a.clipRect = c.clipRect(0, m, 9999,
              0), a.contentGroup.clip(t)), u(g), n || (this.nav = n = c.g().attr({ zIndex: 1 }).add(this.group), this.up = c.symbol('triangle', 0, 0, E, E).add(n), w('upTracker').on('click', function () { a.scroll(-1, L) }), this.pager = c.text('', 15, 10).addClass('highcharts-legend-navigation'), d.styledMode || this.pager.css(x.style), this.pager.add(n), this.down = c.symbol('triangle-down', 0, 0, E, E).add(n), w('downTracker').on('click', function () { a.scroll(1, L) })), a.scroll(0), b = e)
          : n && (u(), this.nav = n.destroy(), this.scrollGroup.attr({ translateY: 1 }), this.clipHeight =
0); return b
      },
      scroll: function (b, a) {
        const d = this; const f = this.chart; const e = this.pages; const l = e.length; let m = this.currentPage + b; b = this.clipHeight; const p = this.options.navigation; const g = this.pager; const t = this.padding; m > l && (m = l); m > 0 && (typeof a !== 'undefined' && q(a, f), this.nav.attr({ translateX: t, translateY: b + this.padding + 7 + this.titleHeight, visibility: 'visible' }), [this.up, this.upTracker].forEach(function (a) { a.attr({ class: m === 1 ? 'highcharts-legend-nav-inactive' : 'highcharts-legend-nav-active' }) }), g.attr({ text: m + '/' + l }), [this.down, this.downTracker].forEach(function (a) {
          a.attr({
            x: 18 +
this.pager.getBBox().width,
            class: m === l ? 'highcharts-legend-nav-inactive' : 'highcharts-legend-nav-active'
          })
        }, this), f.styledMode || (this.up.attr({ fill: m === 1 ? p.inactiveColor : p.activeColor }), this.upTracker.css({ cursor: m === 1 ? 'default' : 'pointer' }), this.down.attr({ fill: m === l ? p.inactiveColor : p.activeColor }), this.downTracker.css({ cursor: m === l ? 'default' : 'pointer' })), this.scrollOffset = -e[m - 1] + this.initialItemY, this.scrollGroup.animate({ translateY: this.scrollOffset }), this.currentPage = m, this.positionCheckboxes(),
        a = c.animObject(H(a, f.renderer.globalAnimation, !0)), C(function () { w(d, 'afterScroll', { currentPage: m }) }, a.duration || 0))
      }
    }; c.LegendSymbolMixin = {
      drawRectangle: function (b, a) { const d = b.symbolHeight; const c = b.options.squareSymbol; a.legendSymbol = this.chart.renderer.rect(c ? (b.symbolWidth - d) / 2 : 0, b.baseline - d + 1, c ? d : b.symbolWidth, d, H(b.options.symbolRadius, d / 2)).addClass('highcharts-point').attr({ zIndex: 3 }).add(a.legendGroup) },
      drawLineMarker: function (b) {
        let a = this.options; let d = a.marker; const c = b.symbolWidth; const f = b.symbolHeight; const e =
f / 2; const m = this.chart.renderer; const p = this.legendGroup; b = b.baseline - Math.round(0.3 * b.fontMetrics.b); let g = {}; this.chart.styledMode || (g = { 'stroke-width': a.lineWidth || 0 }, a.dashStyle && (g.dashstyle = a.dashStyle)); this.legendLine = m.path(['M', 0, b, 'L', c, b]).addClass('highcharts-graph').attr(g).add(p); d && !1 !== d.enabled && c && (a = Math.min(H(d.radius, e), e), this.symbol.indexOf('url') === 0 && (d = D(d, { width: f, height: f }), a = 0), this.legendSymbol = d = m.symbol(this.symbol, c / 2 - a, b - a, 2 * a, 2 * a, d).addClass('highcharts-point').add(p), d.isMarker =
!0)
      }
    }; (/Trident\/7\.0/.test(f.navigator && f.navigator.userAgent) || m) && e(c.Legend.prototype, 'positionItem', function (b, a) { const d = this; const c = function () { a._legendItemPos && b.call(d, a) }; c(); d.bubbleLegend || setTimeout(c) })
  }); M(J, 'parts/Chart.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.animObject; const I = e.attr; const G = e.defined; const H = e.discardElement; const v = e.erase; const q = e.extend; const C = e.isArray; const B = e.isNumber; const u = e.isObject; const w = e.isString; const m = e.numberFormat; const r = e.objectEach; const D = e.pick; const A = e.pInt; const f = e.relativeLength; const b = e.setAnimation
    const a = e.splat; const d = e.syncTimeout; const h = c.addEvent; const k = c.animate; const l = c.doc; const y = c.Axis; const p = c.createElement; const g = c.defaultOptions; const t = c.charts; const x = c.css; const L = c.find; const E = c.fireEvent; const n = c.Legend; const z = c.marginNames; const N = c.merge; const O = c.Pointer; const V = c.removeEvent; const T = c.seriesTypes; const P = c.win; const Q = c.Chart = function () { this.getArgs.apply(this, arguments) }; c.chart = function (a, b, d) { return new Q(a, b, d) }; q(Q.prototype, {
      callbacks: [],
      getArgs: function () { const a = [].slice.call(arguments); if (w(a[0]) || a[0].nodeName) this.renderTo = a.shift(); this.init(a[0], a[1]) },
      init: function (a,
        b) {
        let d; const f = a.series; const e = a.plotOptions || {}; E(this, 'init', { args: arguments }, function () {
          a.series = null; d = N(g, a); r(d.plotOptions, function (a, b) { u(a) && (a.tooltip = e[b] && N(e[b].tooltip) || void 0) }); d.tooltip.userOptions = a.chart && a.chart.forExport && a.tooltip.userOptions || a.tooltip; d.series = a.series = f; this.userOptions = a; const n = d.chart; const x = n.events; this.margin = []; this.spacing = []; this.bounds = { h: {}, v: {} }; this.labelCollectors = []; this.callback = b; this.isResizing = 0; this.options = d; this.axes = []; this.series = []; this.time = a.time &&
Object.keys(a.time).length
            ? new c.Time(a.time)
            : c.time; this.numberFormatter = n.numberFormatter || m; this.styledMode = n.styledMode; this.hasCartesianSeries = n.showAxes; const l = this; l.index = t.length; t.push(l); c.chartCount++; x && r(x, function (a, b) { c.isFunction(a) && h(l, b, a) }); l.xAxis = []; l.yAxis = []; l.pointCount = l.colorCounter = l.symbolCounter = 0; E(l, 'afterInit'); l.firstRender()
        })
      },
      initSeries: function (a) {
        let b = this.options.chart; b = a.type || b.type || b.defaultSeriesType; const d = T[b]; d || c.error(17, !0, this, { missingModuleFor: b })
        b = new d(); b.init(this, a); return b
      },
      setSeriesData: function () { this.getSeriesOrderByLinks().forEach(function (a) { a.points || a.data || !a.enabledDataSorting || a.setData(a.options.data, !1) }) },
      getSeriesOrderByLinks: function () { return this.series.concat().sort(function (a, b) { return a.linkedSeries.length || b.linkedSeries.length ? b.linkedSeries.length - a.linkedSeries.length : 0 }) },
      orderSeries: function (a) { const b = this.series; for (a = a || 0; a < b.length; a++)b[a] && (b[a].index = a, b[a].name = b[a].getName()) },
      isInsidePlot: function (a, b,
        d) { const g = d ? b : a; a = d ? a : b; return g >= 0 && g <= this.plotWidth && a >= 0 && a <= this.plotHeight },
      redraw: function (a) {
        E(this, 'beforeRedraw'); const d = this.axes; const g = this.series; const c = this.pointer; const f = this.legend; const e = this.userOptions.legend; let h = this.isDirtyLegend; const t = this.hasCartesianSeries; let n = this.isDirtyBox; const x = this.renderer; const l = x.isHidden(); const p = []; this.setResponsive && this.setResponsive(!1); b(a, this); l && this.temporaryDisplay(); this.layOutTitles(); for (a = g.length; a--;) { var k = g[a]; if (k.options.stacking) { var m = !0; if (k.isDirty) { var z = !0; break } } } if (z) {
          for (a =
g.length; a--;)k = g[a], k.options.stacking && (k.isDirty = !0)
        } g.forEach(function (a) { a.isDirty && (a.options.legendType === 'point' ? (a.updateTotals && a.updateTotals(), h = !0) : e && (e.labelFormatter || e.labelFormat) && (h = !0)); a.isDirtyData && E(a, 'updatedData') }); h && f && f.options.enabled && (f.render(), this.isDirtyLegend = !1); m && this.getStacks(); t && d.forEach(function (a) { a.updateNames(); a.setScale() }); this.getMargins(); t && (d.forEach(function (a) { a.isDirty && (n = !0) }), d.forEach(function (a) {
          const b = a.min + ',' + a.max; a.extKey !== b &&
(a.extKey = b, p.push(function () { E(a, 'afterSetExtremes', q(a.eventArgs, a.getExtremes())); delete a.eventArgs })); (n || m) && a.redraw()
        })); n && this.drawChartBox(); E(this, 'predraw'); g.forEach(function (a) { (n || a.isDirty) && a.visible && a.redraw(); a.isDirtyData = !1 }); c && c.reset(!0); x.draw(); E(this, 'redraw'); E(this, 'render'); l && this.temporaryDisplay(!0); p.forEach(function (a) { a.call() })
      },
      get: function (a) {
        function b (b) { return b.id === a || b.options && b.options.id === a } const d = this.series; let g; let c = L(this.axes, b) || L(this.series,
          b); for (g = 0; !c && g < d.length; g++)c = L(d[g].points || [], b); return c
      },
      getAxes: function () { const b = this; let d = this.options; const g = d.xAxis = a(d.xAxis || {}); d = d.yAxis = a(d.yAxis || {}); E(this, 'getAxes'); g.forEach(function (a, b) { a.index = b; a.isX = !0 }); d.forEach(function (a, b) { a.index = b }); g.concat(d).forEach(function (a) { new y(b, a) }); E(this, 'afterGetAxes') },
      getSelectedPoints: function () {
        let a = []; this.series.forEach(function (b) { a = a.concat((b[b.hasGroupedData ? 'points' : 'data'] || []).filter(function (a) { return D(a.selectedStaging, a.selected) })) })
        return a
      },
      getSelectedSeries: function () { return this.series.filter(function (a) { return a.selected }) },
      setTitle: function (a, b, d) { this.applyDescription('title', a); this.applyDescription('subtitle', b); this.applyDescription('caption', void 0); this.layOutTitles(d) },
      applyDescription: function (a, b) {
        const d = this; let g = a === 'title' ? { color: '#333333', fontSize: this.options.isStock ? '16px' : '18px' } : { color: '#666666' }; g = this.options[a] = N(!this.styledMode && { style: g }, this.options[a], b); let c = this[a]; c && b && (this[a] = c = c.destroy())
        g && !c && (c = this.renderer.text(g.text, 0, 0, g.useHTML).attr({ align: g.align, class: 'highcharts-' + a, zIndex: g.zIndex || 4 }).add(), c.update = function (b) { d[{ title: 'setTitle', subtitle: 'setSubtitle', caption: 'setCaption' }[a]](b) }, this.styledMode || c.css(g.style), this[a] = c)
      },
      layOutTitles: function (a) {
        const b = [0, 0, 0]; const d = this.renderer; const g = this.spacingBox; ['title', 'subtitle', 'caption'].forEach(function (a) {
          const c = this[a]; const f = this.options[a]; const e = f.verticalAlign || 'top'; a = a === 'title' ? -3 : e === 'top' ? b[0] + 2 : 0; if (c) {
            if (!this.styledMode) {
              var h =
f.style.fontSize
            } h = d.fontMetrics(h, c).b; c.css({ width: (f.width || g.width + (f.widthAdjust || 0)) + 'px' }); const t = Math.round(c.getBBox(f.useHTML).height); c.align(q({ y: e === 'bottom' ? h : a + h, height: t }, f), !1, 'spacingBox'); f.floating || (e === 'top' ? b[0] = Math.ceil(b[0] + t) : e === 'bottom' && (b[2] = Math.ceil(b[2] + t)))
          }
        }, this); b[0] && (this.options.title.verticalAlign || 'top') === 'top' && (b[0] += this.options.title.margin); b[2] && this.options.caption.verticalAlign === 'bottom' && (b[2] += this.options.caption.margin); const c = !this.titleOffset ||
this.titleOffset.join(',') !== b.join(','); this.titleOffset = b; E(this, 'afterLayOutTitles'); !this.isDirtyBox && c && (this.isDirtyBox = this.isDirtyLegend = c, this.hasRendered && D(a, !0) && this.isDirtyBox && this.redraw())
      },
      getChartSize: function () {
        let a = this.options.chart; const b = a.width; a = a.height; const d = this.renderTo; G(b) || (this.containerWidth = c.getStyle(d, 'width')); G(a) || (this.containerHeight = c.getStyle(d, 'height')); this.chartWidth = Math.max(0, b || this.containerWidth || 600); this.chartHeight = Math.max(0, f(a, this.chartWidth) ||
(this.containerHeight > 1 ? this.containerHeight : 400))
      },
      temporaryDisplay: function (a) {
        let b = this.renderTo; if (a) for (;b && b.style;)b.hcOrigStyle && (c.css(b, b.hcOrigStyle), delete b.hcOrigStyle), b.hcOrigDetached && (l.body.removeChild(b), b.hcOrigDetached = !1), b = b.parentNode; else {
          for (;b && b.style;) {
            l.body.contains(b) || b.parentNode || (b.hcOrigDetached = !0, l.body.appendChild(b)); if (c.getStyle(b, 'display', !1) === 'none' || b.hcOricDetached) {
              b.hcOrigStyle = { display: b.style.display, height: b.style.height, overflow: b.style.overflow },
              a = { display: 'block', overflow: 'hidden' }, b !== this.renderTo && (a.height = 0), c.css(b, a), b.offsetWidth || b.style.setProperty('display', 'block', 'important')
            }b = b.parentNode; if (b === l.body) break
          }
        }
      },
      setClassName: function (a) { this.container.className = 'highcharts-container ' + (a || '') },
      getContainer: function () {
        const a = this.options; const b = a.chart; let d = this.renderTo; const g = c.uniqueKey(); let f; let e; d || (this.renderTo = d = b.renderTo); w(d) && (this.renderTo = d = l.getElementById(d)); d || c.error(13, !0, this); let h = A(I(d, 'data-highcharts-chart'))
        B(h) && t[h] && t[h].hasRendered && t[h].destroy(); I(d, 'data-highcharts-chart', this.index); d.innerHTML = ''; b.skipClone || d.offsetWidth || this.temporaryDisplay(); this.getChartSize(); h = this.chartWidth; const n = this.chartHeight; x(d, { overflow: 'hidden' }); this.styledMode || (f = q({ position: 'relative', overflow: 'hidden', width: h + 'px', height: n + 'px', textAlign: 'left', lineHeight: 'normal', zIndex: 0, '-webkit-tap-highlight-color': 'rgba(0,0,0,0)' }, b.style)); this.container = d = p('div', { id: g }, f, d); this._cursor = d.style.cursor; this.renderer =
new (c[b.renderer] || c.Renderer)(d, h, n, null, b.forExport, a.exporting && a.exporting.allowHTML, this.styledMode); this.setClassName(b.className); if (this.styledMode) for (e in a.defs) this.renderer.definition(a.defs[e]); else this.renderer.setStyle(b.style); this.renderer.chartIndex = this.index; E(this, 'afterGetContainer')
      },
      getMargins: function (a) {
        const b = this.spacing; const d = this.margin; const g = this.titleOffset; this.resetMargins(); g[0] && !G(d[0]) && (this.plotTop = Math.max(this.plotTop, g[0] + b[0])); g[2] && !G(d[2]) && (this.marginBottom =
Math.max(this.marginBottom, g[2] + b[2])); this.legend && this.legend.display && this.legend.adjustMargins(d, b); E(this, 'getMargins'); a || this.getAxisMargins()
      },
      getAxisMargins: function () { const a = this; const b = a.axisOffset = [0, 0, 0, 0]; const d = a.colorAxis; const g = a.margin; const c = function (a) { a.forEach(function (a) { a.visible && a.getOffset() }) }; a.hasCartesianSeries ? c(a.axes) : d && d.length && c(d); z.forEach(function (d, c) { G(g[c]) || (a[d] += b[c]) }); a.setChartSize() },
      reflow: function (a) {
        const b = this; let g = b.options.chart; let f = b.renderTo; const e = G(g.width) && G(g.height)
        const h = g.width || c.getStyle(f, 'width'); g = g.height || c.getStyle(f, 'height'); f = a ? a.target : P; if (!e && !b.isPrinting && h && g && (f === P || f === l)) { if (h !== b.containerWidth || g !== b.containerHeight)c.clearTimeout(b.reflowTimeout), b.reflowTimeout = d(function () { b.container && b.setSize(void 0, void 0, !1) }, a ? 100 : 0); b.containerWidth = h; b.containerHeight = g }
      },
      setReflow: function (a) {
        const b = this; !1 === a || this.unbindReflow
          ? !1 === a && this.unbindReflow && (this.unbindReflow = this.unbindReflow())
          : (this.unbindReflow = h(P, 'resize', function (a) {
              b.options &&
b.reflow(a)
            }), h(this, 'destroy', this.unbindReflow))
      },
      setSize: function (a, g, c) {
        const f = this; const e = f.renderer; f.isResizing += 1; b(c, f); f.oldChartHeight = f.chartHeight; f.oldChartWidth = f.chartWidth; typeof a !== 'undefined' && (f.options.chart.width = a); typeof g !== 'undefined' && (f.options.chart.height = g); f.getChartSize(); if (!f.styledMode) { var h = e.globalAnimation; (h ? k : x)(f.container, { width: f.chartWidth + 'px', height: f.chartHeight + 'px' }, h) }f.setChartSize(!0); e.setSize(f.chartWidth, f.chartHeight, c); f.axes.forEach(function (a) {
          a.isDirty =
!0; a.setScale()
        }); f.isDirtyLegend = !0; f.isDirtyBox = !0; f.layOutTitles(); f.getMargins(); f.redraw(c); f.oldChartHeight = null; E(f, 'resize'); d(function () { f && E(f, 'endResize', null, function () { --f.isResizing }) }, F(h).duration || 0)
      },
      setChartSize: function (a) {
        let b = this.inverted; let d = this.renderer; let g = this.chartWidth; const c = this.chartHeight; const f = this.options.chart; const e = this.spacing; const h = this.clipOffset; let t; let n; let x; let l; this.plotLeft = t = Math.round(this.plotLeft); this.plotTop = n = Math.round(this.plotTop); this.plotWidth = x = Math.max(0, Math.round(g -
t - this.marginRight)); this.plotHeight = l = Math.max(0, Math.round(c - n - this.marginBottom)); this.plotSizeX = b ? l : x; this.plotSizeY = b ? x : l; this.plotBorderWidth = f.plotBorderWidth || 0; this.spacingBox = d.spacingBox = { x: e[3], y: e[0], width: g - e[3] - e[1], height: c - e[0] - e[2] }; this.plotBox = d.plotBox = { x: t, y: n, width: x, height: l }; g = 2 * Math.floor(this.plotBorderWidth / 2); b = Math.ceil(Math.max(g, h[3]) / 2); d = Math.ceil(Math.max(g, h[0]) / 2); this.clipBox = {
          x: b,
          y: d,
          width: Math.floor(this.plotSizeX - Math.max(g, h[1]) / 2 - b),
          height: Math.max(0, Math.floor(this.plotSizeY -
Math.max(g, h[2]) / 2 - d))
        }; a || this.axes.forEach(function (a) { a.setAxisSize(); a.setAxisTranslation() }); E(this, 'afterSetChartSize', { skipAxes: a })
      },
      resetMargins: function () { E(this, 'resetMargins'); const a = this; const b = a.options.chart; ['margin', 'spacing'].forEach(function (d) { const g = b[d]; const c = u(g) ? g : [g, g, g, g]; ['Top', 'Right', 'Bottom', 'Left'].forEach(function (g, f) { a[d][f] = D(b[d + g], c[f]) }) }); z.forEach(function (b, d) { a[b] = D(a.margin[d], a.spacing[d]) }); a.axisOffset = [0, 0, 0, 0]; a.clipOffset = [0, 0, 0, 0] },
      drawChartBox: function () {
        const a =
this.options.chart; const b = this.renderer; const d = this.chartWidth; const g = this.chartHeight; let c = this.chartBackground; let f = this.plotBackground; let e = this.plotBorder; const h = this.styledMode; const t = this.plotBGImage; let n = a.backgroundColor; const x = a.plotBackgroundColor; const l = a.plotBackgroundImage; let p; const k = this.plotLeft; const m = this.plotTop; const z = this.plotWidth; const L = this.plotHeight; const r = this.plotBox; const q = this.clipRect; const y = this.clipBox; let N = 'animate'; c || (this.chartBackground = c = b.rect().addClass('highcharts-background').add(), N = 'attr'); if (h) var u = p = c.strokeWidth(); else {
          u = a.borderWidth ||
0; p = u + (a.shadow ? 8 : 0); n = { fill: n || 'none' }; if (u || c['stroke-width'])n.stroke = a.borderColor, n['stroke-width'] = u; c.attr(n).shadow(a.shadow)
        }c[N]({ x: p / 2, y: p / 2, width: d - p - u % 2, height: g - p - u % 2, r: a.borderRadius }); N = 'animate'; f || (N = 'attr', this.plotBackground = f = b.rect().addClass('highcharts-plot-background').add()); f[N](r); h || (f.attr({ fill: x || 'none' }).shadow(a.plotShadow), l && (t ? (l !== t.attr('href') && t.attr('href', l), t.animate(r)) : this.plotBGImage = b.image(l, k, m, z, L).add())); q
          ? q.animate({ width: y.width, height: y.height })
          : this.clipRect = b.clipRect(y); N = 'animate'; e || (N = 'attr', this.plotBorder = e = b.rect().addClass('highcharts-plot-border').attr({ zIndex: 1 }).add()); h || e.attr({ stroke: a.plotBorderColor, 'stroke-width': a.plotBorderWidth || 0, fill: 'none' }); e[N](e.crisp({ x: k, y: m, width: z, height: L }, -e.strokeWidth())); this.isDirtyBox = !1; E(this, 'afterDrawChartBox')
      },
      propFromSeries: function () {
        const a = this; const b = a.options.chart; let d; const g = a.options.series; let c; let f; ['inverted', 'angular', 'polar'].forEach(function (e) {
          d = T[b.type || b.defaultSeriesType]; f = b[e] ||
d && d.prototype[e]; for (c = g && g.length; !f && c--;)(d = T[g[c].type]) && d.prototype[e] && (f = !0); a[e] = f
        })
      },
      linkSeries: function () { const a = this; const b = a.series; b.forEach(function (a) { a.linkedSeries.length = 0 }); b.forEach(function (b) { let d = b.options.linkedTo; w(d) && (d = d === ':previous' ? a.series[b.index - 1] : a.get(d)) && d.linkedParent !== b && (d.linkedSeries.push(b), b.linkedParent = d, d.enabledDataSorting && b.setDataSortingOptions(), b.visible = D(b.options.visible, d.options.visible, b.visible)) }); E(this, 'afterLinkSeries') },
      renderSeries: function () {
        this.series.forEach(function (a) {
          a.translate()
          a.render()
        })
      },
      renderLabels: function () { const a = this; const b = a.options.labels; b.items && b.items.forEach(function (d) { const g = q(b.style, d.style); const c = A(g.left) + a.plotLeft; const f = A(g.top) + a.plotTop + 12; delete g.left; delete g.top; a.renderer.text(d.html, c, f).attr({ zIndex: 2 }).css(g).add() }) },
      render: function () {
        const a = this.axes; const b = this.colorAxis; const d = this.renderer; let g = this.options; let c = 0; const f = function (a) { a.forEach(function (a) { a.visible && a.render() }) }; this.setTitle(); this.legend = new n(this, g.legend); this.getStacks && this.getStacks(); this.getMargins(!0)
        this.setChartSize(); g = this.plotWidth; a.some(function (a) { if (a.horiz && a.visible && a.options.labels.enabled && a.series.length) return c = 21, !0 }); const e = this.plotHeight = Math.max(this.plotHeight - c, 0); a.forEach(function (a) { a.setScale() }); this.getAxisMargins(); const h = g / this.plotWidth > 1.1; const t = e / this.plotHeight > 1.05; if (h || t)a.forEach(function (a) { (a.horiz && h || !a.horiz && t) && a.setTickInterval(!0) }), this.getMargins(); this.drawChartBox(); this.hasCartesianSeries ? f(a) : b && b.length && f(b); this.seriesGroup || (this.seriesGroup =
d.g('series-group').attr({ zIndex: 3 }).add()); this.renderSeries(); this.renderLabels(); this.addCredits(); this.setResponsive && this.setResponsive(); this.updateContainerScaling(); this.hasRendered = !0
      },
      addCredits: function (a) {
        const b = this; a = N(!0, this.options.credits, a); a.enabled && !this.credits && (this.credits = this.renderer.text(a.text + (this.mapCredits || ''), 0, 0).addClass('highcharts-credits').on('click', function () { a.href && (P.location.href = a.href) }).attr({ align: a.position.align, zIndex: 8 }), b.styledMode || this.credits.css(a.style),
        this.credits.add().align(a.position), this.credits.update = function (a) { b.credits = b.credits.destroy(); b.addCredits(a) })
      },
      updateContainerScaling: function () { let a = this.container; if (a.offsetWidth && a.offsetHeight && a.getBoundingClientRect) { const b = a.getBoundingClientRect(); const d = b.width / a.offsetWidth; a = b.height / a.offsetHeight; d !== 1 || a !== 1 ? this.containerScaling = { scaleX: d, scaleY: a } : delete this.containerScaling } },
      destroy: function () {
        const a = this; const b = a.axes; const d = a.series; const g = a.container; let f; const e = g && g.parentNode; E(a, 'destroy'); a.renderer.forExport
          ? v(t, a)
          : t[a.index] = void 0; c.chartCount--; a.renderTo.removeAttribute('data-highcharts-chart'); V(a); for (f = b.length; f--;)b[f] = b[f].destroy(); this.scroller && this.scroller.destroy && this.scroller.destroy(); for (f = d.length; f--;)d[f] = d[f].destroy(); 'title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer'.split(' ').forEach(function (b) { const d = a[b]; d && d.destroy && (a[b] = d.destroy()) }); g && (g.innerHTML = '', V(g),
        e && H(g)); r(a, function (b, d) { delete a[d] })
      },
      firstRender: function () { const a = this; const b = a.options; if (!a.isReadyToRender || a.isReadyToRender()) { a.getContainer(); a.resetMargins(); a.setChartSize(); a.propFromSeries(); a.getAxes(); (C(b.series) ? b.series : []).forEach(function (b) { a.initSeries(b) }); a.linkSeries(); a.setSeriesData(); E(a, 'beforeRender'); O && (a.pointer = new O(a, b)); a.render(); if (!a.renderer.imgCount && a.onload)a.onload(); a.temporaryDisplay(!0) } },
      onload: function () {
        this.callbacks.concat([this.callback]).forEach(function (a) {
          a &&
typeof this.index !== 'undefined' && a.apply(this, [this])
        }, this); E(this, 'load'); E(this, 'render'); G(this.index) && this.setReflow(this.options.chart.reflow); this.onload = null
      }
    })
  }); M(J, 'parts/ScrollablePlotArea.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.pick; const I = c.addEvent; e = c.Chart; ''; I(e, 'afterSetChartSize', function (e) {
      let G = this.options.chart.scrollablePlotArea; let v = G && G.minWidth; G = G && G.minHeight; if (!this.renderer.forExport) {
        if (v) {
          if (this.scrollablePixelsX = v = Math.max(0, v - this.chartWidth)) {
            this.plotWidth +=
v; this.inverted ? (this.clipBox.height += v, this.plotBox.height += v) : (this.clipBox.width += v, this.plotBox.width += v); var q = { 1: { name: 'right', value: v } }
          }
        } else G && (this.scrollablePixelsY = v = Math.max(0, G - this.chartHeight)) && (this.plotHeight += v, this.inverted ? (this.clipBox.width += v, this.plotBox.width += v) : (this.clipBox.height += v, this.plotBox.height += v), q = { 2: { name: 'bottom', value: v } }); q && !e.skipAxes && this.axes.forEach(function (e) {
          q[e.side]
            ? e.getPlotLinePath = function () {
                const v = q[e.side].name; const u = this[v]; this[v] = u - q[e.side].value
                const w = c.Axis.prototype.getPlotLinePath.apply(this, arguments); this[v] = u; return w
              }
            : (e.setAxisSize(), e.setAxisTranslation())
        })
      }
    }); I(e, 'render', function () { this.scrollablePixelsX || this.scrollablePixelsY ? (this.setUpScrolling && this.setUpScrolling(), this.applyFixed()) : this.fixedDiv && this.applyFixed() }); e.prototype.setUpScrolling = function () {
      const e = { WebkitOverflowScrolling: 'touch', overflowX: 'hidden', overflowY: 'hidden' }; this.scrollablePixelsX && (e.overflowX = 'auto'); this.scrollablePixelsY && (e.overflowY = 'auto')
      this.scrollingContainer = c.createElement('div', { className: 'highcharts-scrolling' }, e, this.renderTo); this.innerContainer = c.createElement('div', { className: 'highcharts-inner-container' }, null, this.scrollingContainer); this.innerContainer.appendChild(this.container); this.setUpScrolling = null
    }; e.prototype.moveFixedElements = function () {
      const c = this.container; const e = this.fixedRenderer; const v = '.highcharts-contextbutton .highcharts-credits .highcharts-legend .highcharts-legend-checkbox .highcharts-navigator-series .highcharts-navigator-xaxis .highcharts-navigator-yaxis .highcharts-navigator .highcharts-reset-zoom .highcharts-scrollbar .highcharts-subtitle .highcharts-title'.split(' ')
      let q; this.scrollablePixelsX && !this.inverted ? q = '.highcharts-yaxis' : this.scrollablePixelsX && this.inverted ? q = '.highcharts-xaxis' : this.scrollablePixelsY && !this.inverted ? q = '.highcharts-xaxis' : this.scrollablePixelsY && this.inverted && (q = '.highcharts-yaxis'); v.push(q, q + '-labels'); v.forEach(function (q) { [].forEach.call(c.querySelectorAll(q), function (c) { (c.namespaceURI === e.SVG_NS ? e.box : e.box.parentNode).appendChild(c); c.style.pointerEvents = 'auto' }) })
    }; e.prototype.applyFixed = function () {
      let e; let H = !this.fixedDiv; let v = this.options.chart.scrollablePlotArea
      H
        ? (this.fixedDiv = c.createElement('div', { className: 'highcharts-fixed' }, { position: 'absolute', overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }, null, !0), this.renderTo.insertBefore(this.fixedDiv, this.renderTo.firstChild), this.renderTo.style.overflow = 'visible', this.fixedRenderer = e = new c.Renderer(this.fixedDiv, this.chartWidth, this.chartHeight), this.scrollableMask = e.path().attr({ fill: this.options.chart.backgroundColor || '#fff', 'fill-opacity': F(v.opacity, 0.85), zIndex: -1 }).addClass('highcharts-scrollable-mask').add(),
          this.moveFixedElements(), I(this, 'afterShowResetZoom', this.moveFixedElements), I(this, 'afterLayOutTitles', this.moveFixedElements))
        : this.fixedRenderer.setSize(this.chartWidth, this.chartHeight); e = this.chartWidth + (this.scrollablePixelsX || 0); let q = this.chartHeight + (this.scrollablePixelsY || 0); c.stop(this.container); this.container.style.width = e + 'px'; this.container.style.height = q + 'px'; this.renderer.boxWrapper.attr({ width: e, height: q, viewBox: [0, 0, e, q].join(' ') }); this.chartBackground.attr({ width: e, height: q })
      this.scrollablePixelsY && (this.scrollingContainer.style.height = this.chartHeight + 'px'); H && (v.scrollPositionX && (this.scrollingContainer.scrollLeft = this.scrollablePixelsX * v.scrollPositionX), v.scrollPositionY && (this.scrollingContainer.scrollTop = this.scrollablePixelsY * v.scrollPositionY)); q = this.axisOffset; H = this.plotTop - q[0] - 1; v = this.plotLeft - q[3] - 1; e = this.plotTop + this.plotHeight + q[2] + 1; q = this.plotLeft + this.plotWidth + q[1] + 1; const C = this.plotLeft + this.plotWidth - (this.scrollablePixelsX || 0); const B = this.plotTop + this.plotHeight -
(this.scrollablePixelsY || 0); H = this.scrollablePixelsX ? ['M', 0, H, 'L', this.plotLeft - 1, H, 'L', this.plotLeft - 1, e, 'L', 0, e, 'Z', 'M', C, H, 'L', this.chartWidth, H, 'L', this.chartWidth, e, 'L', C, e, 'Z'] : this.scrollablePixelsY ? ['M', v, 0, 'L', v, this.plotTop - 1, 'L', q, this.plotTop - 1, 'L', q, 0, 'Z', 'M', v, B, 'L', v, this.chartHeight, 'L', q, this.chartHeight, 'L', q, B, 'Z'] : ['M', 0, 0]; this.redrawTrigger !== 'adjustHeight' && this.scrollableMask.attr({ d: H })
    }
  }); M(J, 'parts/Point.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F =
e.animObject; const I = e.defined; const G = e.erase; const H = e.extend; const v = e.isArray; const q = e.isNumber; const C = e.isObject; const B = e.syncTimeout; const u = e.pick; let w; const m = c.fireEvent; const r = c.format; const D = c.uniqueKey; const A = c.removeEvent; c.Point = w = function () {}; c.Point.prototype = {
      init: function (c, b, a) { this.series = c; this.applyOptions(b, a); this.id = I(this.id) ? this.id : D(); this.resolveColor(); c.chart.pointCount++; m(this, 'afterInit'); return this },
      resolveColor: function () {
        const c = this.series; let b = c.chart.options.chart.colorCount; let a = c.chart.styledMode; a || this.options.color || (this.color =
c.color); c.options.colorByPoint ? (a || (b = c.options.colors || c.chart.options.colors, this.color = this.color || b[c.colorCounter], b = b.length), a = c.colorCounter, c.colorCounter++, c.colorCounter === b && (c.colorCounter = 0)) : a = c.colorIndex; this.colorIndex = u(this.colorIndex, a)
      },
      applyOptions: function (c, b) {
        const a = this.series; const d = a.options.pointValKey || a.pointValKey; c = w.prototype.optionsToObject.call(this, c); H(this, c); this.options = this.options ? H(this.options, c) : c; c.group && delete this.group; c.dataLabels && delete this.dataLabels
        d && (this.y = this[d]); this.formatPrefix = (this.isNull = u(this.isValid && !this.isValid(), this.x === null || !q(this.y))) ? 'null' : 'point'; this.selected && (this.state = 'select'); 'name' in this && typeof b === 'undefined' && a.xAxis && a.xAxis.hasNames && (this.x = a.xAxis.nameToX(this)); typeof this.x === 'undefined' && a && (this.x = typeof b === 'undefined' ? a.autoIncrement(this) : b); return this
      },
      setNestedProperty: function (c, b, a) { a.split('.').reduce(function (a, c, f, e) { a[c] = e.length - 1 === f ? b : C(a[c], !0) ? a[c] : {}; return a[c] }, c); return c },
      optionsToObject: function (f) {
        let b =
{}; let a = this.series; const d = a.options.keys; const e = d || a.pointArrayMap || ['y']; const k = e.length; let l = 0; let m = 0; if (q(f) || f === null)b[e[0]] = f; else if (v(f)) for (!d && f.length > k && (a = typeof f[0], a === 'string' ? b.name = f[0] : a === 'number' && (b.x = f[0]), l++); m < k;)d && typeof f[l] === 'undefined' || (e[m].indexOf('.') > 0 ? c.Point.prototype.setNestedProperty(b, f[l], e[m]) : b[e[m]] = f[l]), l++, m++; else typeof f === 'object' && (b = f, f.dataLabels && (a._hasPointLabels = !0), f.marker && (a._hasPointMarkers = !0)); return b
      },
      getClassName: function () {
        return 'highcharts-point' + (this.selected
          ? ' highcharts-point-select'
          : '') + (this.negative ? ' highcharts-negative' : '') + (this.isNull ? ' highcharts-null-point' : '') + (typeof this.colorIndex !== 'undefined' ? ' highcharts-color-' + this.colorIndex : '') + (this.options.className ? ' ' + this.options.className : '') + (this.zone && this.zone.className ? ' ' + this.zone.className.replace('highcharts-negative', '') : '')
      },
      getZone: function () {
        let c = this.series; const b = c.zones; c = c.zoneAxis || 'y'; let a = 0; let d; for (d = b[a]; this[c] >= d.value;)d = b[++a]; this.nonZonedColor || (this.nonZonedColor = this.color)
        this.color = d && d.color && !this.options.color ? d.color : this.nonZonedColor; return d
      },
      hasNewShapeType: function () { return (this.graphic && (this.graphic.symbolName || this.graphic.element.nodeName)) !== this.shapeType },
      destroy: function () {
        function c () { e && (b.setState(), G(e, b), e.length || (d.hoverPoints = null)); if (b === d.hoverPoint)b.onMouseOut(); if (b.graphic || b.dataLabel || b.dataLabels)A(b), b.destroyElements(); for (l in b)b[l] = null } var b = this; let a = b.series; var d = a.chart; a = a.options.dataSorting; var e = d.hoverPoints; const k = F(b.series.chart.renderer.globalAnimation)
        let l; a && a.enabled ? (this.animateBeforeDestroy(), B(c, k.duration)) : c(); d.pointCount--; b.legendItem && d.legend.destroyItem(b)
      },
      animateBeforeDestroy: function () { const c = this; const b = { x: c.startXPos, opacity: 0 }; let a; const d = c.getGraphicalProps(); d.singular.forEach(function (d) { a = d === 'dataLabel'; c[d] = c[d].animate(a ? { x: c[d].startXPos, y: c[d].startYPos, opacity: 0 } : b) }); d.plural.forEach(function (a) { c[a].forEach(function (a) { a.element && a.animate(H({ x: c.startXPos }, a.startYPos ? { x: a.startXPos, y: a.startYPos } : {})) }) }) },
      destroyElements: function (c) {
        const b =
this; c = b.getGraphicalProps(c); c.singular.forEach(function (a) { b[a] = b[a].destroy() }); c.plural.forEach(function (a) { b[a].forEach(function (a) { a.element && a.destroy() }); delete b[a] })
      },
      getGraphicalProps: function (c) {
        const b = this; const a = []; let d; const f = { singular: [], plural: [] }; c = c || { graphic: 1, dataLabel: 1 }; c.graphic && a.push('graphic', 'shadowGroup'); c.dataLabel && a.push('dataLabel', 'dataLabelUpper', 'connector'); for (d = a.length; d--;) { const e = a[d]; b[e] && f.singular.push(e) }['dataLabel', 'connector'].forEach(function (a) {
          const d = a + 's'; c[a] &&
b[d] && f.plural.push(d)
        }); return f
      },
      getLabelConfig: function () { return { x: this.category, y: this.y, color: this.color, colorIndex: this.colorIndex, key: this.name || this.category, series: this.series, point: this, percentage: this.percentage, total: this.total || this.stackTotal } },
      tooltipFormatter: function (c) {
        const b = this.series; const a = b.tooltipOptions; const d = u(a.valueDecimals, ''); const f = a.valuePrefix || ''; const e = a.valueSuffix || ''; b.chart.styledMode && (c = b.chart.tooltip.styledModeFormat(c)); (b.pointArrayMap || ['y']).forEach(function (a) {
          a = '{point.' +
a; if (f || e)c = c.replace(RegExp(a + '}', 'g'), f + a + '}' + e); c = c.replace(RegExp(a + '}', 'g'), a + ':,.' + d + 'f}')
        }); return r(c, { point: this, series: this.series }, b.chart)
      },
      firePointEvent: function (c, b, a) { const d = this; const f = this.series.options; (f.point.events[c] || d.options && d.options.events && d.options.events[c]) && this.importEvents(); c === 'click' && f.allowPointSelect && (a = function (a) { d.select && d.select(null, a.ctrlKey || a.metaKey || a.shiftKey) }); m(this, c, b, a) },
      visible: !0
    }
  }); M(J, 'parts/Series.js', [J['parts/Globals.js'], J['parts/Utilities.js']],
    function (c, e) {
      const F = e.animObject; const I = e.arrayMax; const G = e.arrayMin; const H = e.clamp; const v = e.correctFloat; const q = e.defined; const C = e.erase; const B = e.extend; const u = e.isArray; const w = e.isNumber; const m = e.isString; const r = e.objectEach; const D = e.pick; const A = e.splat; const f = e.syncTimeout; const b = c.addEvent; const a = c.defaultOptions; const d = c.defaultPlotOptions; const h = c.fireEvent; const k = c.merge; const l = c.removeEvent; const y = c.SVGElement; const p = c.win; c.Series = c.seriesType('line', null, {
        lineWidth: 2,
        allowPointSelect: !1,
        showCheckbox: !1,
        animation: { duration: 1E3 },
        events: {},
        marker: {
          enabledThreshold: 2,
          lineColor: '#ffffff',
          lineWidth: 0,
          radius: 4,
          states: { normal: { animation: !0 }, hover: { animation: { duration: 50 }, enabled: !0, radiusPlus: 2, lineWidthPlus: 1 }, select: { fillColor: '#cccccc', lineColor: '#000000', lineWidth: 2 } }
        },
        point: { events: {} },
        dataLabels: { align: 'center', formatter: function () { const a = this.series.chart.numberFormatter; return this.y === null ? '' : a(this.y, -1) }, padding: 5, style: { fontSize: '11px', fontWeight: 'bold', color: 'contrast', textOutline: '1px contrast' }, verticalAlign: 'bottom', x: 0, y: 0 },
        cropThreshold: 300,
        opacity: 1,
        pointRange: 0,
        softThreshold: !0,
        states: { normal: { animation: !0 }, hover: { animation: { duration: 50 }, lineWidthPlus: 1, marker: {}, halo: { size: 10, opacity: 0.25 } }, select: { animation: { duration: 0 } }, inactive: { animation: { duration: 50 }, opacity: 0.2 } },
        stickyTracking: !0,
        turboThreshold: 1E3,
        findNearestPointBy: 'x'
      }, {
        axisTypes: ['xAxis', 'yAxis'],
        coll: 'series',
        colorCounter: 0,
        cropShoulder: 1,
        directTouch: !1,
        eventsToUnbind: [],
        isCartesian: !0,
        parallelArrays: ['x', 'y'],
        pointClass: c.Point,
        requireSorting: !0,
        sorted: !0,
        init: function (a, d) {
          h(this, 'init', { options: d }); const g = this
          const f = a.series; let e; this.eventOptions = this.eventOptions || {}; g.chart = a; g.options = d = g.setOptions(d); g.linkedSeries = []; g.bindAxes(); B(g, { name: d.name, state: '', visible: !1 !== d.visible, selected: !0 === d.selected }); const t = d.events; r(t, function (a, d) { c.isFunction(a) && g.eventOptions[d] !== a && (c.isFunction(g.eventOptions[d]) && l(g, d, g.eventOptions[d]), g.eventOptions[d] = a, b(g, d, a)) }); if (t && t.click || d.point && d.point.events && d.point.events.click || d.allowPointSelect)a.runTrackerClick = !0; g.getColor(); g.getSymbol(); g.parallelArrays.forEach(function (a) {
            g[a +
'Data'] || (g[a + 'Data'] = [])
          }); g.isCartesian && (a.hasCartesianSeries = !0); f.length && (e = f[f.length - 1]); g._i = D(e && e._i, -1) + 1; a.orderSeries(this.insert(f)); d.dataSorting && d.dataSorting.enabled ? g.setDataSortingOptions() : g.points || g.data || g.setData(d.data, !1); h(this, 'afterInit')
        },
        insert: function (a) { const b = this.options.index; let d; if (w(b)) { for (d = a.length; d--;) if (b >= D(a[d].options.index, a[d]._i)) { a.splice(d + 1, 0, this); break }d === -1 && a.unshift(this); d += 1 } else a.push(this); return D(d, a.length - 1) },
        bindAxes: function () {
          const a =
this; const b = a.options; const d = a.chart; let f; h(this, 'bindAxes', null, function () { (a.axisTypes || []).forEach(function (g) { d[g].forEach(function (d) { f = d.options; if (b[g] === f.index || typeof b[g] !== 'undefined' && b[g] === f.id || typeof b[g] === 'undefined' && f.index === 0)a.insert(d.series), a[g] = d, d.isDirty = !0 }); a[g] || a.optionalAxis === g || c.error(18, !0, d) }) })
        },
        updateParallelArrays: function (a, b) {
          const d = a.series; const c = arguments; const g = w(b)
            ? function (c) { const g = c === 'y' && d.toYData ? d.toYData(a) : a[c]; d[c + 'Data'][b] = g }
            : function (a) {
              Array.prototype[b].apply(d[a +
'Data'], Array.prototype.slice.call(c, 2))
            }; d.parallelArrays.forEach(g)
        },
        hasData: function () { return this.visible && typeof this.dataMax !== 'undefined' && typeof this.dataMin !== 'undefined' || this.visible && this.yData && this.yData.length > 0 },
        autoIncrement: function () {
          let a = this.options; let b = this.xIncrement; let d; const c = a.pointIntervalUnit; const f = this.chart.time; b = D(b, a.pointStart, 0); this.pointInterval = d = D(this.pointInterval, a.pointInterval, 1); c && (a = new f.Date(b), c === 'day'
            ? f.set('Date', a, f.get('Date', a) + d)
            : c === 'month'
              ? f.set('Month',
                  a, f.get('Month', a) + d)
              : c === 'year' && f.set('FullYear', a, f.get('FullYear', a) + d), d = a.getTime() - b); this.xIncrement = b + d; return b
        },
        setDataSortingOptions: function () { const a = this.options; B(this, { requireSorting: !1, sorted: !1, enabledDataSorting: !0, allowDG: !1 }); q(a.pointRange) || (a.pointRange = 1) },
        setOptions: function (b) {
          let d = this.chart; let c = d.options; let g = c.plotOptions; let f = d.userOptions || {}; b = k(b); d = d.styledMode; const e = { plotOptions: g, userOptions: b }; h(this, 'setOptions', e); const l = e.plotOptions[this.type]; const p = f.plotOptions || {}
          this.userOptions = e.userOptions; f = k(l, g.series, f.plotOptions && f.plotOptions[this.type], b); this.tooltipOptions = k(a.tooltip, a.plotOptions.series && a.plotOptions.series.tooltip, a.plotOptions[this.type].tooltip, c.tooltip.userOptions, g.series && g.series.tooltip, g[this.type].tooltip, b.tooltip); this.stickyTracking = D(b.stickyTracking, p[this.type] && p[this.type].stickyTracking, p.series && p.series.stickyTracking, this.tooltipOptions.shared && !this.noSharedTooltip ? !0 : f.stickyTracking); l.marker === null && delete f.marker
          this.zoneAxis = f.zoneAxis; c = this.zones = (f.zones || []).slice(); !f.negativeColor && !f.negativeFillColor || f.zones || (g = { value: f[this.zoneAxis + 'Threshold'] || f.threshold || 0, className: 'highcharts-negative' }, d || (g.color = f.negativeColor, g.fillColor = f.negativeFillColor), c.push(g)); c.length && q(c[c.length - 1].value) && c.push(d ? {} : { color: this.color, fillColor: this.fillColor }); h(this, 'afterSetOptions', { options: f }); return f
        },
        getName: function () { return D(this.options.name, 'Series ' + (this.index + 1)) },
        getCyclic: function (a,
          b, d) { const c = this.chart; const g = this.userOptions; const f = a + 'Index'; const e = a + 'Counter'; const h = d ? d.length : D(c.options.chart[a + 'Count'], c[a + 'Count']); if (!b) { var t = D(g[f], g['_' + f]); q(t) || (c.series.length || (c[e] = 0), g['_' + f] = t = c[e] % h, c[e] += 1); d && (b = d[t]) } typeof t !== 'undefined' && (this[f] = t); this[a] = b },
        getColor: function () { this.chart.styledMode ? this.getCyclic('color') : this.options.colorByPoint ? this.options.color = null : this.getCyclic('color', this.options.color || d[this.type].color, this.chart.options.colors) },
        getSymbol: function () {
          this.getCyclic('symbol',
            this.options.marker.symbol, this.chart.options.symbols)
        },
        findPointIndex: function (a, b) {
          const d = a.id; const g = a.x; const f = this.points; let e; const h = this.options.dataSorting; if (d) var t = this.chart.get(d); else if (this.linkedParent || this.enabledDataSorting) { const l = h && h.matchByName ? 'name' : 'index'; t = c.find(f, function (b) { return !b.touched && b[l] === a[l] }); if (!t) return } if (t) { var p = t && t.index; typeof p !== 'undefined' && (e = !0) } typeof p === 'undefined' && w(g) && (p = this.xData.indexOf(g, b)); p !== -1 && typeof p !== 'undefined' && this.cropped && (p = p >= this.cropStart
            ? p - this.cropStart
            : p); !e && f[p] && f[p].touched && (p = void 0); return p
        },
        drawLegendSymbol: c.LegendSymbolMixin.drawLineMarker,
        updateData: function (a, b) {
          const d = this.options; const c = d.dataSorting; const g = this.points; const f = []; let e; let h; let t; const l = this.requireSorting; const p = a.length === g.length; let m = !0; this.xIncrement = null; a.forEach(function (a, b) {
            const h = q(a) && this.pointClass.prototype.optionsToObject.call({ series: this }, a) || {}; let n = h.x; if (h.id || w(n)) {
              if (n = this.findPointIndex(h, t), n === -1 || typeof n === 'undefined'
                ? f.push(a)
                : g[n] && a !== d.data[n]
                  ? (g[n].update(a,
                      !1, null, !1), g[n].touched = !0, l && (t = n + 1))
                  : g[n] && (g[n].touched = !0), !p || b !== n || c && c.enabled || this.hasDerivedData)e = !0
            } else f.push(a)
          }, this); if (e) for (a = g.length; a--;)(h = g[a]) && !h.touched && h.remove && h.remove(!1, b); else !p || c && c.enabled ? m = !1 : (a.forEach(function (a, b) { g[b].update && a !== g[b].y && g[b].update(a, !1, null, !1) }), f.length = 0); g.forEach(function (a) { a && (a.touched = !1) }); if (!m) return !1; f.forEach(function (a) { this.addPoint(a, !1, null, null, !1) }, this); this.xIncrement === null && this.xData && this.xData.length && (this.xIncrement =
I(this.xData), this.autoIncrement()); return !0
        },
        setData: function (a, b, d, f) {
          const g = this; const e = g.points; const h = e && e.length || 0; let t; const l = g.options; const p = g.chart; const x = l.dataSorting; let k = null; const r = g.xAxis; k = l.turboThreshold; const L = this.xData; const q = this.yData; const y = (t = g.pointArrayMap) && t.length; const v = l.keys; let A = 0; let B = 1; let C; a = a || []; t = a.length; b = D(b, !0); x && x.enabled && (a = this.sortData(a)); !1 !== f && t && h && !g.cropped && !g.hasGroupedData && g.visible && !g.isSeriesBoosting && (C = this.updateData(a, d)); if (!C) {
            g.xIncrement = null; g.colorCounter = 0; this.parallelArrays.forEach(function (a) {
              g[a +
'Data'].length = 0
            }); if (k && t > k) if (k = g.getFirstValidPoint(a), w(k)) for (d = 0; d < t; d++)L[d] = this.autoIncrement(), q[d] = a[d]; else if (u(k)) if (y) for (d = 0; d < t; d++)f = a[d], L[d] = f[0], q[d] = f.slice(1, y + 1); else for (v && (A = v.indexOf('x'), B = v.indexOf('y'), A = A >= 0 ? A : 0, B = B >= 0 ? B : 1), d = 0; d < t; d++)f = a[d], L[d] = f[A], q[d] = f[B]; else c.error(12, !1, p); else for (d = 0; d < t; d++) typeof a[d] !== 'undefined' && (f = { series: g }, g.pointClass.prototype.applyOptions.apply(f, [a[d]]), g.updateParallelArrays(f, d)); q && m(q[0]) && c.error(14, !0, p); g.data = []; g.options.data =
g.userOptions.data = a; for (d = h; d--;)e[d] && e[d].destroy && e[d].destroy(); r && (r.minRange = r.userMinRange); g.isDirty = p.isDirtyBox = !0; g.isDirtyData = !!e; d = !1
          }l.legendType === 'point' && (this.processData(), this.generatePoints()); b && p.redraw(d)
        },
        sortData: function (a) {
          const b = this; const d = b.options.dataSorting.sortKey || 'y'; const c = function (a, b) { return q(b) && a.pointClass.prototype.optionsToObject.call({ series: a }, b) || {} }; a.forEach(function (d, g) { a[g] = c(b, d); a[g].index = g }, this); a.concat().sort(function (a, b) {
            return w(b[d])
              ? b[d] - a[d]
              : -1
          }).forEach(function (a, b) { a.x = b }, this); b.linkedSeries && b.linkedSeries.forEach(function (b) { const d = b.options; const g = d.data; d.dataSorting && d.dataSorting.enabled || !g || (g.forEach(function (d, f) { g[f] = c(b, d); a[f] && (g[f].x = a[f].x, g[f].index = f) }), b.setData(g, !1)) }); return a
        },
        processData: function (a) {
          let b = this.xData; let d = this.yData; let g = b.length; let f = 0; const e = this.xAxis; let h = this.options; let l = h.cropThreshold; const p = this.getExtremesFromAll || h.getExtremesFromAll; const m = this.isCartesian; h = e && e.val2lin; const k = e && e.isLog; let r = this.requireSorting
          if (m && !this.isDirty && !e.isDirty && !this.yAxis.isDirty && !a) return !1; if (e) { a = e.getExtremes(); var q = a.min; var y = a.max } if (m && this.sorted && !p && (!l || g > l || this.forceCrop)) if (b[g - 1] < q || b[0] > y)b = [], d = []; else if (this.yData && (b[0] < q || b[g - 1] > y)) { f = this.cropData(this.xData, this.yData, q, y); b = f.xData; d = f.yData; f = f.start; var u = !0 } for (l = b.length || 1; --l;) if (g = k ? h(b[l]) - h(b[l - 1]) : b[l] - b[l - 1], g > 0 && (typeof w === 'undefined' || g < w)) var w = g; else g < 0 && r && (c.error(15, !1, this.chart), r = !1); this.cropped = u; this.cropStart = f; this.processedXData =
b; this.processedYData = d; this.closestPointRange = this.basePointRange = w
        },
        cropData: function (a, b, d, c, f) { const g = a.length; let e = 0; let h = g; let t; f = D(f, this.cropShoulder); for (t = 0; t < g; t++) if (a[t] >= d) { e = Math.max(0, t - f); break } for (d = t; d < g; d++) if (a[d] > c) { h = d + f; break } return { xData: a.slice(e, h), yData: b.slice(e, h), start: e, end: h } },
        generatePoints: function () {
          let a = this.options; const b = a.data; let d = this.data; let c; const f = this.processedXData; const e = this.processedYData; const l = this.pointClass; const p = f.length; const m = this.cropStart || 0; const k = this.hasGroupedData; a = a.keys; const r = []
          let q; d || k || (d = [], d.length = b.length, d = this.data = d); a && k && (this.options.keys = !1); for (q = 0; q < p; q++) { const y = m + q; if (k) { var u = (new l()).init(this, [f[q]].concat(A(e[q]))); u.dataGroup = this.groupMap[q]; u.dataGroup.options && (u.options = u.dataGroup.options, B(u, u.dataGroup.options), delete u.dataLabels) } else (u = d[y]) || typeof b[y] === 'undefined' || (d[y] = u = (new l()).init(this, b[y], f[q])); u && (u.index = y, r[q] = u) } this.options.keys = a; if (d && (p !== (c = d.length) || k)) {
            for (q = 0; q < c; q++) {
              q !== m || k || (q += p), d[q] && (d[q].destroyElements(), d[q].plotX =
void 0)
            }
          } this.data = d; this.points = r; h(this, 'afterGeneratePoints')
        },
        getXExtremes: function (a) { return { min: G(a), max: I(a) } },
        getExtremes: function (a) {
          const b = this.xAxis; let d = this.yAxis; const c = this.processedXData || this.xData; const g = []; let f = 0; let e = 0; let l = 0; const p = this.requireSorting ? this.cropShoulder : 0; const m = d ? d.positiveValuesOnly : !1; let k; a = a || this.stackedYData || this.processedYData || []; d = a.length; b && (l = b.getExtremes(), e = l.min, l = l.max); for (k = 0; k < d; k++) {
            let r = c[k]; const q = a[k]; let y = (w(q) || u(q)) && (q.length || q > 0 || !m); r = this.getExtremesFromAll ||
this.options.getExtremesFromAll || this.cropped || !b || (c[k + p] || r) >= e && (c[k - p] || r) <= l; if (y && r) if (y = q.length) for (;y--;)w(q[y]) && (g[f++] = q[y]); else g[f++] = q
          } this.dataMin = G(g); this.dataMax = I(g); h(this, 'afterGetExtremes')
        },
        getFirstValidPoint: function (a) { for (var b = null, d = a.length, c = 0; b === null && c < d;)b = a[c], c++; return b },
        translate: function () {
          this.processedXData || this.processData(); this.generatePoints(); const a = this.options; const b = a.stacking; const d = this.xAxis; const c = d.categories; const f = this.enabledDataSorting; const e = this.yAxis; const l = this.points
          const p = l.length; const k = !!this.modifyValue; let m; const r = this.pointPlacementToXValue(); const y = w(r); const A = a.threshold; const B = a.startFromThreshold ? A : 0; let C; const G = this.zoneAxis || 'y'; let I = Number.MAX_VALUE; for (m = 0; m < p; m++) {
            const F = l[m]; const J = F.x; let W = F.y; let M = F.low; const Z = b && e.stacks[(this.negStacks && W < (B ? 0 : A) ? '-' : '') + this.stackKey]; e.positiveValuesOnly && W !== null && W <= 0 && (F.isNull = !0); F.plotX = C = v(H(d.translate(J, 0, 0, 0, 1, r, this.type === 'flags'), -1E5, 1E5)); if (b && this.visible && Z && Z[J]) {
              var S = this.getStackIndicator(S, J, this.index); if (!F.isNull) {
                var Y = Z[J]; var ba =
Y.points[S.key]
              }
            }u(ba) && (M = ba[0], W = ba[1], M === B && S.key === Z[J].base && (M = D(w(A) && A, e.min)), e.positiveValuesOnly && M <= 0 && (M = null), F.total = F.stackTotal = Y.total, F.percentage = Y.total && F.y / Y.total * 100, F.stackY = W, this.irregularWidths || Y.setOffset(this.pointXOffset || 0, this.barW || 0)); F.yBottom = q(M) ? H(e.translate(M, 0, 1, 0, 1), -1E5, 1E5) : null; k && (W = this.modifyValue(W, F)); F.plotY = W = typeof W === 'number' && Infinity !== W ? H(e.translate(W, 0, 1, 0, 1), -1E5, 1E5) : void 0; F.isInside = typeof W !== 'undefined' && W >= 0 && W <= e.len && C >= 0 && C <=
d.len; F.clientX = y ? v(d.translate(J, 0, 0, 0, 1, r)) : C; F.negative = F[G] < (a[G + 'Threshold'] || A || 0); F.category = c && typeof c[F.x] !== 'undefined' ? c[F.x] : F.x; if (!F.isNull && !1 !== F.visible) { typeof ca !== 'undefined' && (I = Math.min(I, Math.abs(C - ca))); var ca = C }F.zone = this.zones.length && F.getZone(); !F.graphic && this.group && f && (F.isNew = !0)
          } this.closestPointRangePx = I; h(this, 'afterTranslate')
        },
        getValidPoints: function (a, b, d) {
          const c = this.chart; return (a || this.points || []).filter(function (a) {
            return b && !c.isInsidePlot(a.plotX, a.plotY,
              c.inverted)
              ? !1
              : !1 !== a.visible && (d || !a.isNull)
          })
        },
        getClipBox: function (a, b) { const d = this.options; const c = this.chart; const g = c.inverted; const f = this.xAxis; const e = f && this.yAxis; a && !1 === d.clip && e ? a = g ? { y: -c.chartWidth + e.len + e.pos, height: c.chartWidth, width: c.chartHeight, x: -c.chartHeight + f.len + f.pos } : { y: -e.pos, height: c.chartHeight, width: c.chartWidth, x: -f.pos } : (a = this.clipBox || c.clipBox, b && (a.width = c.plotSizeX, a.x = 0)); return b ? { width: a.width, x: a.x } : a },
        setClip: function (a) {
          const b = this.chart; const d = this.options; const c = b.renderer; const g = b.inverted; const f =
this.clipBox; const e = this.getClipBox(a); const h = this.sharedClipKey || ['_sharedClip', a && a.duration, a && a.easing, e.height, d.xAxis, d.yAxis].join(); let l = b[h]; let p = b[h + 'm']; l || (a && (e.width = 0, g && (e.x = b.plotSizeX + (!1 !== d.clip ? 0 : b.plotTop)), b[h + 'm'] = p = c.clipRect(g ? b.plotSizeX + 99 : -99, g ? -b.plotLeft : -b.plotTop, 99, g ? b.chartWidth : b.chartHeight)), b[h] = l = c.clipRect(e), l.count = { length: 0 }); a && !l.count[this.index] && (l.count[this.index] = !0, l.count.length += 1); if (!1 !== d.clip || a) {
            this.group.clip(a || f ? l : b.clipRect), this.markerGroup.clip(p),
            this.sharedClipKey = h
          } a || (l.count[this.index] && (delete l.count[this.index], --l.count.length), l.count.length === 0 && h && b[h] && (f || (b[h] = b[h].destroy()), b[h + 'm'] && (b[h + 'm'] = b[h + 'm'].destroy())))
        },
        animate: function (a) { const b = this.chart; const d = F(this.options.animation); if (a) this.setClip(d); else { const c = this.sharedClipKey; a = b[c]; const g = this.getClipBox(d, !0); a && a.animate(g, d); b[c + 'm'] && b[c + 'm'].animate({ width: g.width + 99, x: g.x - (b.inverted ? 0 : 99) }, d); this.animate = null } },
        afterAnimate: function () {
          this.setClip(); h(this, 'afterAnimate')
          this.finishedAnimating = !0
        },
        drawPoints: function () {
          const a = this.points; const b = this.chart; let d; let c; const f = this.options.marker; const e = this[this.specialGroup] || this.markerGroup; const h = this.xAxis; const l = D(f.enabled, !h || h.isRadial ? !0 : null, this.closestPointRangePx >= f.enabledThreshold * f.radius); if (!1 !== f.enabled || this._hasPointMarkers) {
            for (d = 0; d < a.length; d++) {
              const p = a[d]; let m = (c = p.graphic) ? 'animate' : 'attr'; const k = p.marker || {}; const r = !!p.marker; if ((l && typeof k.enabled === 'undefined' || k.enabled) && !p.isNull && !1 !== p.visible) {
                const q = D(k.symbol, this.symbol)
                const y = this.markerAttribs(p, p.selected && 'select'); this.enabledDataSorting && (p.startXPos = h.reversed ? -y.width : h.width); const u = !1 !== p.isInside; c ? c[u ? 'show' : 'hide'](u).animate(y) : u && (y.width > 0 || p.hasImage) && (p.graphic = c = b.renderer.symbol(q, y.x, y.y, y.width, y.height, r ? k : f).add(e), this.enabledDataSorting && b.hasRendered && (c.attr({ x: p.startXPos }), m = 'animate')); c && m === 'animate' && c[u ? 'show' : 'hide'](u).animate(y); if (c && !b.styledMode)c[m](this.pointAttribs(p, p.selected && 'select')); c && c.addClass(p.getClassName(),
                  !0)
              } else c && (p.graphic = c.destroy())
            }
          }
        },
        markerAttribs: function (a, b) { let d = this.options.marker; const c = a.marker || {}; const g = c.symbol || d.symbol; let f = D(c.radius, d.radius); b && (d = d.states[b], b = c.states && c.states[b], f = D(b && b.radius, d && d.radius, f + (d && d.radiusPlus || 0))); a.hasImage = g && g.indexOf('url') === 0; a.hasImage && (f = 0); a = { x: Math.floor(a.plotX) - f, y: a.plotY - f }; f && (a.width = a.height = 2 * f); return a },
        pointAttribs: function (a, b) {
          let d = this.options.marker; let c = a && a.options; const g = c && c.marker || {}; let f = this.color; let e = c && c.color; const h = a && a.color; c =
D(g.lineWidth, d.lineWidth); const l = a && a.zone && a.zone.color; a = 1; f = e || l || h || f; e = g.fillColor || d.fillColor || f; f = g.lineColor || d.lineColor || f; b = b || 'normal'; d = d.states[b]; b = g.states && g.states[b] || {}; c = D(b.lineWidth, d.lineWidth, c + D(b.lineWidthPlus, d.lineWidthPlus, 0)); e = b.fillColor || d.fillColor || e; f = b.lineColor || d.lineColor || f; a = D(b.opacity, d.opacity, a); return { stroke: f, 'stroke-width': c, fill: e, opacity: a }
        },
        destroy: function (a) {
          const b = this; const d = b.chart; const g = /AppleWebKit\/533/.test(p.navigator.userAgent); let f; let e; const l = b.data ||
[]; let k; let m; h(b, 'destroy'); this.removeEvents(a); (b.axisTypes || []).forEach(function (a) { (m = b[a]) && m.series && (C(m.series, b), m.isDirty = m.forceRedraw = !0) }); b.legendItem && b.chart.legend.destroyItem(b); for (e = l.length; e--;)(k = l[e]) && k.destroy && k.destroy(); b.points = null; c.clearTimeout(b.animationTimeout); r(b, function (a, b) { a instanceof y && !a.survive && (f = g && b === 'group' ? 'hide' : 'destroy', a[f]()) }); d.hoverSeries === b && (d.hoverSeries = null); C(d.series, b); d.orderSeries(); r(b, function (d, c) { a && c === 'hcEvents' || delete b[c] })
        },
        getGraphPath: function (a, b, d) {
          const c = this; const f = c.options; let g = f.step; let e; const h = []; const l = []; let p; a = a || c.points; (e = a.reversed) && a.reverse(); (g = { right: 1, center: 2 }[g] || g && 3) && e && (g = 4 - g); a = this.getValidPoints(a, !1, !(f.connectNulls && !b && !d)); a.forEach(function (e, n) {
            const t = e.plotX; const m = e.plotY; const k = a[n - 1]; (e.leftCliff || k && k.rightCliff) && !d && (p = !0); e.isNull && !q(b) && n > 0
              ? p = !f.connectNulls
              : e.isNull && !b
                ? p = !0
                : (n === 0 || p
                    ? n = ['M', e.plotX, e.plotY]
                    : c.getPointSpline
                      ? n = c.getPointSpline(a, e, n)
                      : g
                        ? (n = g === 1
                            ? ['L', k.plotX, m]
                            : g === 2
                              ? ['L', (k.plotX + t) / 2,
                                  k.plotY, 'L', (k.plotX + t) / 2, m]
                              : ['L', t, k.plotY], n.push('L', t, m))
                        : n = ['L', t, m], l.push(e.x), g && (l.push(e.x), g === 2 && l.push(e.x)), h.push.apply(h, n), p = !1)
          }); h.xMap = l; return c.graphPath = h
        },
        drawGraph: function () {
          const a = this; const b = this.options; const d = (this.gappedPath || this.getGraphPath).call(this); const c = this.chart.styledMode; let f = [['graph', 'highcharts-graph']]; c || f[0].push(b.lineColor || this.color || '#cccccc', b.dashStyle); f = a.getZonesGraphs(f); f.forEach(function (f, g) {
            let e = f[0]; let h = a[e]; const l = h ? 'animate' : 'attr'; h
              ? (h.endX = a.preventGraphAnimation
                  ? null
                  : d.xMap, h.animate({ d: d }))
              : d.length && (a[e] = h = a.chart.renderer.path(d).addClass(f[1]).attr({ zIndex: 1 }).add(a.group)); h && !c && (e = { stroke: f[2], 'stroke-width': b.lineWidth, fill: a.fillGraph && a.color || 'none' }, f[3] ? e.dashstyle = f[3] : b.linecap !== 'square' && (e['stroke-linecap'] = e['stroke-linejoin'] = 'round'), h[l](e).shadow(g < 2 && b.shadow)); h && (h.startX = d.xMap, h.isArea = d.isArea)
          })
        },
        getZonesGraphs: function (a) {
          this.zones.forEach(function (b, d) {
            d = ['zone-graph-' + d, 'highcharts-graph highcharts-zone-graph-' + d + ' ' + (b.className ||
'')]; this.chart.styledMode || d.push(b.color || this.color, b.dashStyle || this.options.dashStyle); a.push(d)
          }, this); return a
        },
        applyZones: function () {
          const a = this; const b = this.chart; const d = b.renderer; const c = this.zones; let f; let e; const h = this.clips || []; let l; const p = this.graph; const k = this.area; const m = Math.max(b.chartWidth, b.chartHeight); const r = this[(this.zoneAxis || 'y') + 'Axis']; const q = b.inverted; let y; let u; let w; let v = !1; if (c.length && (p || k) && r && typeof r.min !== 'undefined') {
            const A = r.reversed; const C = r.horiz; p && !this.showLine && p.hide(); k && k.hide(); const B = r.getExtremes(); c.forEach(function (c,
              g) {
              f = A ? C ? b.plotWidth : 0 : C ? 0 : r.toPixels(B.min) || 0; f = H(D(e, f), 0, m); e = H(Math.round(r.toPixels(D(c.value, B.max), !0) || 0), 0, m); v && (f = e = r.toPixels(B.max)); y = Math.abs(f - e); u = Math.min(f, e); w = Math.max(f, e); r.isXAxis ? (l = { x: q ? w : u, y: 0, width: y, height: m }, C || (l.x = b.plotHeight - l.x)) : (l = { x: 0, y: q ? w : u, width: m, height: y }, C && (l.y = b.plotWidth - l.y)); q && d.isVML && (l = r.isXAxis ? { x: 0, y: A ? u : w, height: l.width, width: b.chartWidth } : { x: l.y - b.plotLeft - b.spacingBox.x, y: 0, width: l.height, height: b.chartHeight }); h[g] ? h[g].animate(l) : h[g] = d.clipRect(l)
              p && a['zone-graph-' + g].clip(h[g]); k && a['zone-area-' + g].clip(h[g]); v = c.value > B.max; a.resetZones && e === 0 && (e = void 0)
            }); this.clips = h
          } else a.visible && (p && p.show(!0), k && k.show(!0))
        },
        invertGroups: function (a) {
          function d () { ['group', 'markerGroup'].forEach(function (b) { c[b] && (f.renderer.isVML && c[b].attr({ width: c.yAxis.len, height: c.xAxis.len }), c[b].width = c.yAxis.len, c[b].height = c.xAxis.len, c[b].invert(c.isRadialSeries ? !1 : a)) }) } var c = this; var f = c.chart; c.xAxis && (c.eventsToUnbind.push(b(f, 'resize', d)), d(), c.invertGroups =
d)
        },
        plotGroup: function (a, b, d, c, f) { let g = this[a]; const e = !g; e && (this[a] = g = this.chart.renderer.g().attr({ zIndex: c || 0.1 }).add(f)); g.addClass('highcharts-' + b + ' highcharts-series-' + this.index + ' highcharts-' + this.type + '-series ' + (q(this.colorIndex) ? 'highcharts-color-' + this.colorIndex + ' ' : '') + (this.options.className || '') + (g.hasClass('highcharts-tracker') ? ' highcharts-tracker' : ''), !0); g.attr({ visibility: d })[e ? 'attr' : 'animate'](this.getPlotBox()); return g },
        getPlotBox: function () {
          const a = this.chart; let b = this.xAxis; let d = this.yAxis
          a.inverted && (b = d, d = this.xAxis); return { translateX: b ? b.left : a.plotLeft, translateY: d ? d.top : a.plotTop, scaleX: 1, scaleY: 1 }
        },
        removeEvents: function (a) { a ? this.eventsToUnbind.length && (this.eventsToUnbind.forEach(function (a) { a() }), this.eventsToUnbind.length = 0) : l(this) },
        render: function () {
          const a = this; const b = a.chart; const d = a.options; const c = !!a.animate && b.renderer.isSVG && F(d.animation).duration; const e = a.visible ? 'inherit' : 'hidden'; const l = d.zIndex; const p = a.hasRendered; const k = b.seriesGroup; const m = b.inverted; h(this, 'render'); const r = a.plotGroup('group', 'series',
            e, l, k); a.markerGroup = a.plotGroup('markerGroup', 'markers', e, l, k); c && a.animate(!0); r.inverted = a.isCartesian || a.invertable ? m : !1; a.drawGraph && (a.drawGraph(), a.applyZones()); a.visible && a.drawPoints(); a.drawDataLabels && a.drawDataLabels(); a.redrawPoints && a.redrawPoints(); a.drawTracker && !1 !== a.options.enableMouseTracking && a.drawTracker(); a.invertGroups(m); !1 === d.clip || a.sharedClipKey || p || r.clip(b.clipRect); c && a.animate(); p || (a.animationTimeout = f(function () { a.afterAnimate() }, c || 0)); a.isDirty = !1; a.hasRendered =
!0; h(a, 'afterRender')
        },
        redraw: function () { const a = this.chart; const b = this.isDirty || this.isDirtyData; const d = this.group; const c = this.xAxis; const f = this.yAxis; d && (a.inverted && d.attr({ width: a.plotWidth, height: a.plotHeight }), d.animate({ translateX: D(c && c.left, a.plotLeft), translateY: D(f && f.top, a.plotTop) })); this.translate(); this.render(); b && delete this.kdTree },
        kdAxisArray: ['clientX', 'plotY'],
        searchPoint: function (a, b) {
          const d = this.xAxis; const c = this.yAxis; const f = this.chart.inverted; return this.searchKDTree({
            clientX: f
              ? d.len - a.chartY + d.pos
              : a.chartX -
d.pos,
            plotY: f ? c.len - a.chartX + c.pos : a.chartY - c.pos
          }, b, a)
        },
        buildKDTree: function (a) {
          function b (a, c, f) { let g; if (g = a && a.length) { const e = d.kdAxisArray[c % f]; a.sort(function (a, b) { return a[e] - b[e] }); g = Math.floor(g / 2); return { point: a[g], left: b(a.slice(0, g), c + 1, f), right: b(a.slice(g + 1), c + 1, f) } } } this.buildingKdTree = !0; var d = this; const c = d.options.findNearestPointBy.indexOf('y') > -1 ? 2 : 1; delete d.kdTree; f(function () { d.kdTree = b(d.getValidPoints(null, !d.directTouch), c, c); d.buildingKdTree = !1 }, d.options.kdNow || a && a.type ===
'touchstart'
            ? 0
            : 1)
        },
        searchKDTree: function (a, b, d) {
          function c (a, b, d, l) { const p = b.point; let n = f.kdAxisArray[d % l]; let t = p; let k = q(a[g]) && q(p[g]) ? Math.pow(a[g] - p[g], 2) : null; let m = q(a[e]) && q(p[e]) ? Math.pow(a[e] - p[e], 2) : null; m = (k || 0) + (m || 0); p.dist = q(m) ? Math.sqrt(m) : Number.MAX_VALUE; p.distX = q(k) ? Math.sqrt(k) : Number.MAX_VALUE; n = a[n] - p[n]; m = n < 0 ? 'left' : 'right'; k = n < 0 ? 'right' : 'left'; b[m] && (m = c(a, b[m], d + 1, l), t = m[h] < t[h] ? m : p); b[k] && Math.sqrt(n * n) < t[h] && (a = c(a, b[k], d + 1, l), t = a[h] < t[h] ? a : t); return t } var f = this; var g = this.kdAxisArray[0]
          var e = this.kdAxisArray[1]; var h = b ? 'distX' : 'dist'; b = f.options.findNearestPointBy.indexOf('y') > -1 ? 2 : 1; this.kdTree || this.buildingKdTree || this.buildKDTree(d); if (this.kdTree) return c(a, this.kdTree, b, b)
        },
        pointPlacementToXValue: function () { const a = this.xAxis; let b = this.options.pointPlacement; b === 'between' && (b = a.reversed ? -0.5 : 0.5); w(b) && (b *= D(this.options.pointRange || a.pointRange)); return b }
      }); ''
    }); M(J, 'parts/Stacking.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.correctFloat; const I = e.defined; const G = e.destroyObjectProperties
    const H = e.objectEach; const v = e.pick; e = c.Axis; const q = c.Chart; const C = c.format; const B = c.Series; c.StackItem = function (c, e, m, r, q) { const u = c.chart.inverted; this.axis = c; this.isNegative = m; this.options = e = e || {}; this.x = r; this.total = null; this.points = {}; this.stack = q; this.rightCliff = this.leftCliff = 0; this.alignOptions = { align: e.align || (u ? m ? 'left' : 'right' : 'center'), verticalAlign: e.verticalAlign || (u ? 'middle' : m ? 'bottom' : 'top'), y: e.y, x: e.x }; this.textAlign = e.textAlign || (u ? m ? 'right' : 'left' : 'center') }; c.StackItem.prototype = {
      destroy: function () {
        G(this,
          this.axis)
      },
      render: function (c) { const e = this.axis.chart; const m = this.options; let r = m.format; r = r ? C(r, this, e) : m.formatter.call(this); this.label ? this.label.attr({ text: r, visibility: 'hidden' }) : (this.label = e.renderer.label(r, null, null, m.shape, null, null, m.useHTML, !1, 'stack-labels'), r = { text: r, align: this.textAlign, rotation: m.rotation, padding: v(m.padding, 0), visibility: 'hidden' }, this.label.attr(r), e.styledMode || this.label.css(m.style), this.label.added || this.label.add(c)); this.label.labelrank = e.plotHeight },
      setOffset: function (c,
        e, m, r, q) {
        let u = this.axis; let f = u.chart; r = u.translate(u.usePercentage ? 100 : r || this.total, 0, 0, 0, 1); m = u.translate(m || 0); m = I(r) && Math.abs(r - m); c = v(q, f.xAxis[0].translate(this.x)) + c; u = I(r) && this.getStackBox(f, this, c, r, e, m, u); e = this.label; c = this.isNegative; q = v(this.options.overflow, 'justify') === 'justify'; if (e && u) {
          m = e.getBBox(); const b = f.inverted ? c ? m.width : 0 : m.width / 2; const a = f.inverted ? m.height / 2 : c ? -4 : m.height + 4; this.alignOptions.x = v(this.options.x, 0); e.align(this.alignOptions, null, u); r = e.alignAttr; e.show(); r.y -=
a; q && (r.x -= b, B.prototype.justifyDataLabel.call(this.axis, e, this.alignOptions, r, m, u), r.x += b); r.x = e.alignAttr.x; e.attr({ x: r.x, y: r.y }); v(!q && this.options.crop, !0) && ((f = f.isInsidePlot(e.x + (f.inverted ? 0 : -m.width / 2), e.y) && f.isInsidePlot(e.x + (f.inverted ? c ? -m.width : m.width : m.width / 2), e.y + m.height)) || e.hide())
        }
      },
      getStackBox: function (c, e, m, r, q, v, f) {
        const b = e.axis.reversed; const a = c.inverted; c = f.height + f.pos - (a ? c.plotLeft : c.plotTop); e = e.isNegative && !b || !e.isNegative && b; return {
          x: a ? e ? r : r - v : m,
          y: a ? c - m - q : e ? c - r - v : c - r,
          width: a
            ? v
            : q,
          height: a ? q : v
        }
      }
    }; q.prototype.getStacks = function () { const c = this; const e = c.inverted; c.yAxis.forEach(function (c) { c.stacks && c.hasVisibleSeries && (c.oldStacks = c.stacks) }); c.series.forEach(function (m) { const r = m.xAxis && m.xAxis.options || {}; !m.options.stacking || !0 !== m.visible && !1 !== c.options.chart.ignoreHiddenSeries || (m.stackKey = [m.type, v(m.options.stack, ''), e ? r.top : r.left, e ? r.height : r.width].join()) }) }; e.prototype.buildStacks = function () {
      const e = this.series; const q = v(this.options.reversedStacks, !0); const m = e.length; let r; if (!this.isXAxis) {
        this.usePercentage =
!1; for (r = m; r--;) { const D = e[q ? r : m - r - 1]; D.setStackedPoints() } for (r = 0; r < m; r++)e[r].modifyStacks(); c.fireEvent(this, 'afterBuildStacks')
      }
    }; e.prototype.renderStackTotals = function () { const c = this.chart; const e = c.renderer; const m = this.stacks; let r = this.stackTotalGroup; r || (this.stackTotalGroup = r = e.g('stack-labels').attr({ visibility: 'visible', zIndex: 6 }).add()); r.translate(c.plotLeft, c.plotTop); H(m, function (c) { H(c, function (c) { c.render(r) }) }) }; e.prototype.resetStacks = function () {
      const c = this; const e = c.stacks; c.isXAxis || H(e, function (e) {
        H(e,
          function (m, q) { m.touched < c.stacksTouched ? (m.destroy(), delete e[q]) : (m.total = null, m.cumulative = null) })
      })
    }; e.prototype.cleanStacks = function () { if (!this.isXAxis) { if (this.oldStacks) var c = this.stacks = this.oldStacks; H(c, function (c) { H(c, function (c) { c.cumulative = c.total }) }) } }; B.prototype.setStackedPoints = function () {
      if (this.options.stacking && (!0 === this.visible || !1 === this.chart.options.chart.ignoreHiddenSeries)) {
        const e = this.processedXData; const q = this.processedYData; const m = []; const r = q.length; let D = this.options; const A = D.threshold; const f = v(D.startFromThreshold &&
A, 0); const b = D.stack; D = D.stacking; const a = this.stackKey; const d = '-' + a; const h = this.negStacks; const k = this.yAxis; const l = k.stacks; const y = k.oldStacks; let p; let g; k.stacksTouched += 1; for (g = 0; g < r; g++) {
          const t = e[g]; const x = q[g]; var L = this.getStackIndicator(L, t, this.index); const E = L.key; let n = (p = h && x < (f ? 0 : A)) ? d : a; l[n] || (l[n] = {}); l[n][t] || (y[n] && y[n][t] ? (l[n][t] = y[n][t], l[n][t].total = null) : l[n][t] = new c.StackItem(k, k.options.stackLabels, p, t, b)); n = l[n][t]; x !== null
            ? (n.points[E] = n.points[this.index] = [v(n.cumulative, f)], I(n.cumulative) || (n.base = E), n.touched =
k.stacksTouched, L.index > 0 && !1 === this.singleStacks && (n.points[E][0] = n.points[this.index + ',' + t + ',0'][0]))
            : n.points[E] = n.points[this.index] = null; D === 'percent' ? (p = p ? a : d, h && l[p] && l[p][t] ? (p = l[p][t], n.total = p.total = Math.max(p.total, n.total) + Math.abs(x) || 0) : n.total = F(n.total + (Math.abs(x) || 0))) : n.total = F(n.total + (x || 0)); n.cumulative = v(n.cumulative, f) + (x || 0); x !== null && (n.points[E].push(n.cumulative), m[g] = n.cumulative)
        }D === 'percent' && (k.usePercentage = !0); this.stackedYData = m; k.oldStacks = {}
      }
    }; B.prototype.modifyStacks =
function () { const c = this; const e = c.stackKey; const m = c.yAxis.stacks; const r = c.processedXData; let q; const v = c.options.stacking; c[v + 'Stacker'] && [e, '-' + e].forEach(function (f) { for (var b = r.length, a, d; b--;) if (a = r[b], q = c.getStackIndicator(q, a, c.index, f), d = (a = m[f] && m[f][a]) && a.points[q.key])c[v + 'Stacker'](d, a, b) }) }; B.prototype.percentStacker = function (c, e, m) { e = e.total ? 100 / e.total : 0; c[0] = F(c[0] * e); c[1] = F(c[1] * e); this.stackedYData[m] = c[1] }; B.prototype.getStackIndicator = function (c, e, m, r) {
      !I(c) || c.x !== e || r && c.key !== r ? c = { x: e, index: 0, key: r } : c.index++
      c.key = [m, e, c.index].join(); return c
    }
  }); M(J, 'parts/Dynamics.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.defined; const I = e.erase; const G = e.extend; const H = e.isArray; const v = e.isNumber; const q = e.isObject; const C = e.isString; const B = e.objectEach; const u = e.pick; const w = e.relativeLength; const m = e.setAnimation; const r = e.splat; const D = c.addEvent; const A = c.animate; const f = c.Axis; e = c.Chart; const b = c.createElement; const a = c.css; const d = c.fireEvent; const h = c.merge; const k = c.Point; const l = c.Series; const y = c.seriesTypes; c.cleanRecursively = function (a, b) {
      const d = {}; B(a, function (f, g) {
        if (q(a[g], !0) && !a.nodeType &&
b[g])f = c.cleanRecursively(a[g], b[g]), Object.keys(f).length && (d[g] = f); else if (q(a[g]) || a[g] !== b[g])d[g] = a[g]
      }); return d
    }; G(e.prototype, {
      addSeries: function (a, b, c) { let f; const g = this; a && (b = u(b, !0), d(g, 'addSeries', { options: a }, function () { f = g.initSeries(a); g.isDirtyLegend = !0; g.linkSeries(); f.enabledDataSorting && f.setData(a.data, !1); d(g, 'afterAddSeries', { series: f }); b && g.redraw(c) })); return f },
      addAxis: function (a, b, d, c) { return this.createAxis(b ? 'xAxis' : 'yAxis', { axis: a, redraw: d, animation: c }) },
      addColorAxis: function (a,
        b, d) { return this.createAxis('colorAxis', { axis: a, redraw: b, animation: d }) },
      createAxis: function (a, b) { const d = this.options; const g = a === 'colorAxis'; const e = b.redraw; const l = b.animation; b = h(b.axis, { index: this[a].length, isX: a === 'xAxis' }); const p = g ? new c.ColorAxis(this, b) : new f(this, b); d[a] = r(d[a] || {}); d[a].push(b); g && (this.isDirtyLegend = !0, this.axes.forEach(function (a) { a.series = [] }), this.series.forEach(function (a) { a.bindAxes(); a.isDirtyData = !0 })); u(e, !0) && this.redraw(l); return p },
      showLoading: function (d) {
        const c = this; const f = c.options
        let e = c.loadingDiv; const h = f.loading; const l = function () { e && a(e, { left: c.plotLeft + 'px', top: c.plotTop + 'px', width: c.plotWidth + 'px', height: c.plotHeight + 'px' }) }; e || (c.loadingDiv = e = b('div', { className: 'highcharts-loading highcharts-loading-hidden' }, null, c.container), c.loadingSpan = b('span', { className: 'highcharts-loading-inner' }, null, e), D(c, 'redraw', l)); e.className = 'highcharts-loading'; c.loadingSpan.innerHTML = u(d, f.lang.loading, ''); c.styledMode || (a(e, G(h.style, { zIndex: 10 })), a(c.loadingSpan, h.labelStyle), c.loadingShown || (a(e,
          { opacity: 0, display: '' }), A(e, { opacity: h.style.opacity || 0.5 }, { duration: h.showDuration || 0 }))); c.loadingShown = !0; l()
      },
      hideLoading: function () { const b = this.options; const d = this.loadingDiv; d && (d.className = 'highcharts-loading highcharts-loading-hidden', this.styledMode || A(d, { opacity: 0 }, { duration: b.loading.hideDuration || 100, complete: function () { a(d, { display: 'none' }) } })); this.loadingShown = !1 },
      propsRequireDirtyBox: 'backgroundColor borderColor borderWidth borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow'.split(' '),
      propsRequireReflow: 'margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft'.split(' '),
      propsRequireUpdateSeries: 'chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions time tooltip'.split(' '),
      collectionsWithUpdate: ['xAxis', 'yAxis', 'zAxis', 'series'],
      update: function (a, b, f, e) {
        const g = this; const l = { credits: 'addCredits', title: 'setTitle', subtitle: 'setSubtitle', caption: 'setCaption' }; let p; let k; let m; const t = a.isResponsiveOptions; const q = []; d(g, 'update',
          { options: a }); t || g.setResponsive(!1, !0); a = c.cleanRecursively(a, g.options); h(!0, g.userOptions, a); if (p = a.chart) {
          h(!0, g.options.chart, p); 'className' in p && g.setClassName(p.className); 'reflow' in p && g.setReflow(p.reflow); if ('inverted' in p || 'polar' in p || 'type' in p) { g.propFromSeries(); var x = !0 }'alignTicks' in p && (x = !0); B(p, function (a, b) { g.propsRequireUpdateSeries.indexOf('chart.' + b) !== -1 && (k = !0); g.propsRequireDirtyBox.indexOf(b) !== -1 && (g.isDirtyBox = !0); t || g.propsRequireReflow.indexOf(b) === -1 || (m = !0) }); !g.styledMode &&
'style' in p && g.renderer.setStyle(p.style)
        }!g.styledMode && a.colors && (this.options.colors = a.colors); a.plotOptions && h(!0, this.options.plotOptions, a.plotOptions); a.time && this.time === c.time && (this.time = new c.Time(a.time)); B(a, function (a, b) { if (g[b] && typeof g[b].update === 'function')g[b].update(a, !1); else if (typeof g[l[b]] === 'function')g[l[b]](a); b !== 'chart' && g.propsRequireUpdateSeries.indexOf(b) !== -1 && (k = !0) }); this.collectionsWithUpdate.forEach(function (b) {
          if (a[b]) {
            if (b === 'series') {
              var d = []; g[b].forEach(function (a,
                b) { a.options.isInternal || d.push(u(a.options.index, b)) })
            }r(a[b]).forEach(function (a, c) { (c = F(a.id) && g.get(a.id) || g[b][d ? d[c] : c]) && c.coll === b && (c.update(a, !1), f && (c.touched = !0)); !c && f && g.collectionsWithInit[b] && (g.collectionsWithInit[b][0].apply(g, [a].concat(g.collectionsWithInit[b][1] || []).concat([!1])).touched = !0) }); f && g[b].forEach(function (a) { a.touched || a.options.isInternal ? delete a.touched : q.push(a) })
          }
        }); q.forEach(function (a) { a.remove && a.remove(!1) }); x && g.axes.forEach(function (a) { a.update({}, !1) })
        k && g.getSeriesOrderByLinks().forEach(function (a) { a.chart && a.update({}, !1) }, this); a.loading && h(!0, g.options.loading, a.loading); x = p && p.width; p = p && p.height; C(p) && (p = w(p, x || g.chartWidth)); m || v(x) && x !== g.chartWidth || v(p) && p !== g.chartHeight ? g.setSize(x, p, e) : u(b, !0) && g.redraw(e); d(g, 'afterUpdate', { options: a, redraw: b, animation: e })
      },
      setSubtitle: function (a, b) { this.applyDescription('subtitle', a); this.layOutTitles(b) },
      setCaption: function (a, b) { this.applyDescription('caption', a); this.layOutTitles(b) }
    }); e.prototype.collectionsWithInit =
{ xAxis: [e.prototype.addAxis, [!0]], yAxis: [e.prototype.addAxis, [!1]], series: [e.prototype.addSeries] }; G(k.prototype, {
      update: function (a, b, d, c) {
        function f () {
          g.applyOptions(a); g.y === null && h && (g.graphic = h.destroy()); q(a, !0) && (h && h.element && a && a.marker && typeof a.marker.symbol !== 'undefined' && (g.graphic = h.destroy()), a && a.dataLabels && g.dataLabel && (g.dataLabel = g.dataLabel.destroy()), g.connector && (g.connector = g.connector.destroy())); l = g.index; e.updateParallelArrays(g, l); k.data[l] = q(k.data[l], !0) || q(a, !0)
            ? g.options
            : u(a, k.data[l]); e.isDirty = e.isDirtyData = !0; !e.fixedBox && e.hasCartesianSeries && (p.isDirtyBox = !0); k.legendType === 'point' && (p.isDirtyLegend = !0); b && p.redraw(d)
        } var g = this; var e = g.series; var h = g.graphic; let l; var p = e.chart; var k = e.options; b = u(b, !0); !1 === c ? f() : g.firePointEvent('update', { options: a }, f)
      },
      remove: function (a, b) { this.series.removePoint(this.series.data.indexOf(this), a, b) }
    }); G(l.prototype, {
      addPoint: function (a, b, c, f, e) {
        const g = this.options; const h = this.data; const l = this.chart; let p = this.xAxis; p = p && p.hasNames && p.names; const k = g.data; const m =
this.xData; let t; b = u(b, !0); const r = { series: this }; this.pointClass.prototype.applyOptions.apply(r, [a]); const q = r.x; let x = m.length; if (this.requireSorting && q < m[x - 1]) for (t = !0; x && m[x - 1] > q;)x--; this.updateParallelArrays(r, 'splice', x, 0, 0); this.updateParallelArrays(r, x); p && r.name && (p[q] = r.name); k.splice(x, 0, a); t && (this.data.splice(x, 0, null), this.processData()); g.legendType === 'point' && this.generatePoints(); c && (h[0] && h[0].remove ? h[0].remove(!1) : (h.shift(), this.updateParallelArrays(r, 'shift'), k.shift())); !1 !== e && d(this,
          'addPoint', { point: r }); this.isDirtyData = this.isDirty = !0; b && l.redraw(f)
      },
      removePoint: function (a, b, d) { const c = this; const f = c.data; const g = f[a]; const e = c.points; const h = c.chart; const l = function () { e && e.length === f.length && e.splice(a, 1); f.splice(a, 1); c.options.data.splice(a, 1); c.updateParallelArrays(g || { series: c }, 'splice', a, 1); g && g.destroy(); c.isDirty = !0; c.isDirtyData = !0; b && h.redraw() }; m(d, h); b = u(b, !0); g ? g.firePointEvent('remove', null, l) : l() },
      remove: function (a, b, c, f) {
        function g () {
          e.destroy(f); e.remove = null; h.isDirtyLegend = h.isDirtyBox =
!0; h.linkSeries(); u(a, !0) && h.redraw(b)
        } var e = this; var h = e.chart; !1 !== c ? d(e, 'remove', null, g) : g()
      },
      update: function (a, b) {
        a = c.cleanRecursively(a, this.userOptions); d(this, 'update', { options: a }); const f = this; const g = f.chart; const e = f.userOptions; const l = f.initialType || f.type; let p = a.type || e.type || g.options.chart.type; const k = !(this.hasDerivedData || a.dataGrouping || p && p !== this.type || typeof a.pointStart !== 'undefined' || a.pointInterval || a.pointIntervalUnit || a.keys); let m = y[l].prototype; let r; const q = ['group', 'markerGroup', 'dataLabelsGroup', 'transformGroup']
        let v = ['eventOptions', 'navigatorSeries', 'baseSeries']; const w = f.finishedAnimating && { animation: !1 }; const A = {}; k && (v.push('data', 'isDirtyData', 'points', 'processedXData', 'processedYData', 'xIncrement', '_hasPointMarkers', '_hasPointLabels', 'mapMap', 'mapData', 'minY', 'maxY', 'minX', 'maxX'), !1 !== a.visible && v.push('area', 'graph'), f.parallelArrays.forEach(function (a) { v.push(a + 'Data') }), a.data && (a.dataSorting && G(f.options.dataSorting, a.dataSorting), this.setData(a.data, !1))); a = h(e, w, {
          index: typeof e.index === 'undefined'
            ? f.index
            : e.index,
          pointStart: u(e.pointStart, f.xData[0])
        }, !k && { data: f.options.data }, a); k && a.data && (a.data = f.options.data); v = q.concat(v); v.forEach(function (a) { v[a] = f[a]; delete f[a] }); f.remove(!1, null, !1, !0); for (r in m)f[r] = void 0; y[p || l] ? G(f, y[p || l].prototype) : c.error(17, !0, g, { missingModuleFor: p || l }); v.forEach(function (a) { f[a] = v[a] }); f.init(g, a); if (k && this.points) {
          const D = f.options; !1 === D.visible
            ? (A.graphic = 1, A.dataLabel = 1)
            : f._hasPointLabels || (p = D.marker, m = D.dataLabels, p && (!1 === p.enabled || 'symbol' in p) && (A.graphic =
1), m && !1 === m.enabled && (A.dataLabel = 1)); this.points.forEach(function (a) { a && a.series && (a.resolveColor(), Object.keys(A).length && a.destroyElements(A), !1 === D.showInLegend && a.legendItem && g.legend.destroyItem(a)) }, this)
        }a.zIndex !== e.zIndex && q.forEach(function (b) { f[b] && f[b].attr({ zIndex: a.zIndex }) }); f.initialType = l; g.linkSeries(); d(this, 'afterUpdate'); u(b, !0) && g.redraw(k ? void 0 : !1)
      },
      setName: function (a) { this.name = this.options.name = this.userOptions.name = a; this.chart.isDirtyLegend = !0 }
    }); G(f.prototype, {
      update: function (a,
        b) { const d = this.chart; const c = a && a.events || {}; a = h(this.userOptions, a); d.options[this.coll].indexOf && (d.options[this.coll][d.options[this.coll].indexOf(this.userOptions)] = a); B(d.options[this.coll].events, function (a, b) { typeof c[b] === 'undefined' && (c[b] = void 0) }); this.destroy(!0); this.init(d, G(a, { events: c })); d.isDirtyBox = !0; u(b, !0) && d.redraw() },
      remove: function (a) {
        for (var b = this.chart, d = this.coll, c = this.series, f = c.length; f--;)c[f] && c[f].remove(!1); I(b.axes, this); I(b[d], this); H(b.options[d])
          ? b.options[d].splice(this.options.index,
              1)
          : delete b.options[d]; b[d].forEach(function (a, b) { a.options.index = a.userOptions.index = b }); this.destroy(); b.isDirtyBox = !0; u(a, !0) && b.redraw()
      },
      setTitle: function (a, b) { this.update({ title: a }, b) },
      setCategories: function (a, b) { this.update({ categories: a }, b) }
    })
  }); M(J, 'parts/AreaSeries.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.objectEach; const I = e.pick; const G = c.color; const H = c.Series; e = c.seriesType; e('area', 'line', { softThreshold: !1, threshold: 0 }, {
      singleStacks: !1,
      getStackPoints: function (c) {
        const e =
[]; const v = []; const B = this.xAxis; const u = this.yAxis; const w = u.stacks[this.stackKey]; const m = {}; const r = this.index; const D = u.series; const A = D.length; const f = I(u.options.reversedStacks, !0) ? 1 : -1; let b; c = c || this.points; if (this.options.stacking) {
          for (b = 0; b < c.length; b++)c[b].leftNull = c[b].rightNull = void 0, m[c[b].x] = c[b]; F(w, function (a, b) { a.total !== null && v.push(b) }); v.sort(function (a, b) { return a - b }); const a = D.map(function (a) { return a.visible }); v.forEach(function (d, c) {
            let h = 0; let l; let q; if (m[d] && !m[d].isNull) {
              e.push(m[d]), [-1, 1].forEach(function (e) {
                const g = e === 1
                  ? 'rightNull'
                  : 'leftNull'; let h = 0; const p = w[v[c + e]]; if (p) for (b = r; b >= 0 && b < A;)l = p.points[b], l || (b === r ? m[d][g] = !0 : a[b] && (q = w[d].points[b]) && (h -= q[1] - q[0])), b += f; m[d][e === 1 ? 'rightCliff' : 'leftCliff'] = h
              })
            } else { for (b = r; b >= 0 && b < A;) { if (l = w[d].points[b]) { h = l[1]; break }b += f }h = u.translate(h, 0, 1, 0, 1); e.push({ isNull: !0, plotX: B.translate(d, 0, 0, 0, 1), x: d, plotY: h, yBottom: h }) }
          })
        } return e
      },
      getGraphPath: function (c) {
        let e = H.prototype.getGraphPath; let v = this.options; const B = v.stacking; const u = this.yAxis; let w; const m = []; const r = []; const D = this.index; const A = u.stacks[this.stackKey]; const f = v.threshold
        const b = Math.round(u.getThreshold(v.threshold)); v = I(v.connectNulls, B === 'percent'); const a = function (a, d, e) { let g = c[a]; a = B && A[g.x].points[D]; const l = g[e + 'Null'] || 0; e = g[e + 'Cliff'] || 0; g = !0; if (e || l) { var p = (l ? a[0] : a[1]) + e; var k = a[0] + e; g = !!l } else !B && c[d] && c[d].isNull && (p = k = f); typeof p !== 'undefined' && (r.push({ plotX: h, plotY: p === null ? b : u.getThreshold(p), isNull: g, isCliff: !0 }), m.push({ plotX: h, plotY: k === null ? b : u.getThreshold(k), doCurve: !1 })) }; c = c || this.points; B && (c = this.getStackPoints(c)); for (w = 0; w < c.length; w++) {
          B || (c[w].leftCliff =
c[w].rightCliff = c[w].leftNull = c[w].rightNull = void 0); var d = c[w].isNull; var h = I(c[w].rectPlotX, c[w].plotX); const k = I(c[w].yBottom, b); if (!d || v)v || a(w, w - 1, 'left'), d && !B && v || (r.push(c[w]), m.push({ x: w, plotX: h, plotY: k })), v || a(w, w + 1, 'right')
        }w = e.call(this, r, !0, !0); m.reversed = !0; d = e.call(this, m, !0, !0); d.length && (d[0] = 'L'); d = w.concat(d); e = e.call(this, r, !1, v); d.xMap = w.xMap; this.areaPath = d; return e
      },
      drawGraph: function () {
        this.areaPath = []; H.prototype.drawGraph.apply(this); const c = this; const e = this.areaPath; const C = this.options
        const B = [['area', 'highcharts-area', this.color, C.fillColor]]; this.zones.forEach(function (e, q) { B.push(['zone-area-' + q, 'highcharts-area highcharts-zone-area-' + q + ' ' + e.className, e.color || c.color, e.fillColor || C.fillColor]) }); B.forEach(function (q) {
          const v = q[0]; let m = c[v]; const r = m ? 'animate' : 'attr'; const u = {}; m ? (m.endX = c.preventGraphAnimation ? null : e.xMap, m.animate({ d: e })) : (u.zIndex = 0, m = c[v] = c.chart.renderer.path(e).addClass(q[1]).add(c.group), m.isArea = !0); c.chart.styledMode || (u.fill = I(q[3], G(q[2]).setOpacity(I(C.fillOpacity, 0.75)).get()))
          m[r](u); m.startX = e.xMap; m.shiftUnit = C.step ? 2 : 1
        })
      },
      drawLegendSymbol: c.LegendSymbolMixin.drawRectangle
    }); ''
  }); M(J, 'parts/SplineSeries.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.pick; c = c.seriesType; c('spline', 'line', {}, {
      getPointSpline: function (c, e, H) {
        const v = e.plotX; const q = e.plotY; const C = c[H - 1]; H = c[H + 1]; if (C && !C.isNull && !1 !== C.doCurve && !e.isCliff && H && !H.isNull && !1 !== H.doCurve && !e.isCliff) {
          c = C.plotY; let B = H.plotX; H = H.plotY; let u = 0; var w = (1.5 * v + C.plotX) / 2.5; var m = (1.5 * q + c) / 2.5; B = (1.5 *
v + B) / 2.5; let r = (1.5 * q + H) / 2.5; B !== w && (u = (r - m) * (B - v) / (B - w) + q - r); m += u; r += u; m > c && m > q ? (m = Math.max(c, q), r = 2 * q - m) : m < c && m < q && (m = Math.min(c, q), r = 2 * q - m); r > H && r > q ? (r = Math.max(H, q), m = 2 * q - r) : r < H && r < q && (r = Math.min(H, q), m = 2 * q - r); e.rightContX = B; e.rightContY = r
        }e = ['C', F(C.rightContX, C.plotX), F(C.rightContY, C.plotY), F(w, v), F(m, q), v, q]; C.rightContX = C.rightContY = null; return e
      }
    }); ''
  }); M(J, 'parts/AreaSplineSeries.js', [J['parts/Globals.js']], function (c) {
    const e = c.seriesTypes.area.prototype; const F = c.seriesType; F('areaspline', 'spline',
      c.defaultPlotOptions.area, { getStackPoints: e.getStackPoints, getGraphPath: e.getGraphPath, drawGraph: e.drawGraph, drawLegendSymbol: c.LegendSymbolMixin.drawRectangle }); ''
  }); M(J, 'parts/ColumnSeries.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.animObject; const I = e.clamp; const G = e.defined; const H = e.extend; const v = e.isNumber; const q = e.pick; const C = c.color; const B = c.merge; const u = c.Series; e = c.seriesType; const w = c.svg; e('column', 'line', {
      borderRadius: 0,
      crisp: !0,
      groupPadding: 0.2,
      marker: null,
      pointPadding: 0.1,
      minPointLength: 0,
      cropThreshold: 50,
      pointRange: null,
      states: { hover: { halo: !1, brightness: 0.1 }, select: { color: '#cccccc', borderColor: '#000000' } },
      dataLabels: { align: null, verticalAlign: null, y: null },
      softThreshold: !1,
      startFromThreshold: !0,
      stickyTracking: !1,
      tooltip: { distance: 6 },
      threshold: 0,
      borderColor: '#ffffff'
    }, {
      cropShoulder: 0,
      directTouch: !0,
      trackerGroups: ['group', 'dataLabelsGroup'],
      negStacks: !0,
      init: function () { u.prototype.init.apply(this, arguments); const c = this; const e = c.chart; e.hasRendered && e.series.forEach(function (e) { e.type === c.type && (e.isDirty = !0) }) },
      getColumnMetrics: function () {
        const c = this; let e = c.options; const v = c.xAxis; const u = c.yAxis; let f = v.options.reversedStacks; f = v.reversed && !f || !v.reversed && f; let b; const a = {}; let d = 0; !1 === e.grouping ? d = 1 : c.chart.series.forEach(function (f) { const e = f.yAxis; const g = f.options; if (f.type === c.type && (f.visible || !c.chart.options.chart.ignoreHiddenSeries) && u.len === e.len && u.pos === e.pos) { if (g.stacking) { b = f.stackKey; typeof a[b] === 'undefined' && (a[b] = d++); var h = a[b] } else !1 !== g.grouping && (h = d++); f.columnIndex = h } }); const h = Math.min(Math.abs(v.transA) * (v.ordinalSlope ||
e.pointRange || v.closestPointRange || v.tickInterval || 1), v.len); const k = h * e.groupPadding; const l = (h - 2 * k) / (d || 1); e = Math.min(e.maxPointWidth || v.len, q(e.pointWidth, l * (1 - 2 * e.pointPadding))); c.columnMetrics = { width: e, offset: (l - e) / 2 + (k + ((c.columnIndex || 0) + (f ? 1 : 0)) * l - h / 2) * (f ? -1 : 1) }; return c.columnMetrics
      },
      crispCol: function (c, e, q, v) {
        const f = this.chart; let b = this.borderWidth; let a = -(b % 2 ? 0.5 : 0); b = b % 2 ? 0.5 : 1; f.inverted && f.renderer.isVML && (b += 1); this.options.crisp && (q = Math.round(c + q) + a, c = Math.round(c) + a, q -= c); v = Math.round(e + v) + b; a = Math.abs(e) <= 0.5 &&
v > 0.5; e = Math.round(e) + b; v -= e; a && v && (--e, v += 1); return { x: c, y: e, width: q, height: v }
      },
      translate: function () {
        const c = this; const e = c.chart; const v = c.options; let w = c.dense = c.closestPointRange * c.xAxis.transA < 2; w = c.borderWidth = q(v.borderWidth, w ? 0 : 1); const f = c.yAxis; const b = v.threshold; let a = c.translatedThreshold = f.getThreshold(b); const d = q(v.minPointLength, 5); const h = c.getColumnMetrics(); const k = h.width; let l = c.barW = Math.max(k, 1 + 2 * w); const y = c.pointXOffset = h.offset; const p = c.dataMin; const g = c.dataMax; e.inverted && (a -= 0.5); v.pointPadding && (l = Math.ceil(l)); u.prototype.translate.apply(c)
        c.points.forEach(function (h) {
          const m = q(h.yBottom, a); let t = 999 + Math.abs(m); let r = k; t = I(h.plotY, -t, f.len + t); let n = h.plotX + y; let z = l; let v = Math.min(t, m); let u = Math.max(t, m) - v; if (d && Math.abs(u) < d) { u = d; let w = !f.reversed && !h.negative || f.reversed && h.negative; h.y === b && c.dataMax <= b && f.min < b && p !== g && (w = !w); v = Math.abs(v - a) > d ? m - d : a - (w ? d : 0) }G(h.options.pointWidth) && (r = z = Math.ceil(h.options.pointWidth), n -= Math.round((r - k) / 2)); h.barX = n; h.pointWidth = r; h.tooltipPos = e.inverted
            ? [f.len + f.pos - e.plotLeft - t, c.xAxis.len - n - z / 2, u]
            : [n + z / 2, t + f.pos -
e.plotTop, u]; h.shapeType = c.pointClass.prototype.shapeType || 'rect'; h.shapeArgs = c.crispCol.apply(c, h.isNull ? [n, a, z, 0] : [n, v, z, u])
        })
      },
      getSymbol: c.noop,
      drawLegendSymbol: c.LegendSymbolMixin.drawRectangle,
      drawGraph: function () { this.group[this.dense ? 'addClass' : 'removeClass']('highcharts-dense-data') },
      pointAttribs: function (c, e) {
        const m = this.options; let r = this.pointAttrToOptions || {}; let f = r.stroke || 'borderColor'; const b = r['stroke-width'] || 'borderWidth'; let a = c && c.color || this.color; let d = c && c[f] || m[f] || this.color || a; let h = c && c[b] ||
m[b] || this[b] || 0; r = c && c.options.dashStyle || m.dashStyle; let k = q(c && c.opacity, m.opacity, 1); if (c && this.zones.length) { const l = c.getZone(); a = c.options.color || l && (l.color || c.nonZonedColor) || this.color; l && (d = l.borderColor || d, r = l.dashStyle || r, h = l.borderWidth || h) }e && c && (c = B(m.states[e], c.options.states && c.options.states[e] || {}), e = c.brightness, a = c.color || typeof e !== 'undefined' && C(a).brighten(c.brightness).get() || a, d = c[f] || d, h = c[b] || h, r = c.dashStyle || r, k = q(c.opacity, k)); f = { fill: a, stroke: d, 'stroke-width': h, opacity: k }
        r && (f.dashstyle = r); return f
      },
      drawPoints: function () {
        const c = this; const e = this.chart; const q = c.options; const u = e.renderer; const f = q.animationLimit || 250; let b; c.points.forEach(function (a) {
          let d = a.graphic; let h = !!d; let k = d && e.pointCount < f ? 'animate' : 'attr'; if (v(a.plotY) && a.y !== null) {
            b = a.shapeArgs; d && a.hasNewShapeType() && (d = d.destroy()); c.enabledDataSorting && (a.startXPos = c.xAxis.reversed ? -(b ? b.width : 0) : c.xAxis.width); d || (a.graphic = d = u[a.shapeType](b).add(a.group || c.group)) && c.enabledDataSorting && e.hasRendered && e.pointCount < f && (d.attr({ x: a.startXPos }),
            h = !0, k = 'animate'); if (d && h)d[k](B(b)); if (q.borderRadius)d[k]({ r: q.borderRadius }); e.styledMode || d[k](c.pointAttribs(a, a.selected && 'select')).shadow(!1 !== a.allowShadow && q.shadow, null, q.stacking && !q.borderRadius); d.addClass(a.getClassName(), !0)
          } else d && (a.graphic = d.destroy())
        })
      },
      animate: function (c) {
        const e = this; const m = this.yAxis; const q = e.options; const f = this.chart.inverted; const b = {}; const a = f ? 'translateX' : 'translateY'; if (w) {
          if (c) {
            b.scaleY = 0.001, c = I(m.toPixels(q.threshold), m.pos, m.pos + m.len), f ? b.translateX = c - m.len : b.translateY = c, e.clipBox &&
e.setClip(), e.group.attr(b)
          } else { const d = e.group.attr(a); e.group.animate({ scaleY: 1 }, H(F(e.options.animation), { step: function (c, f) { b[a] = d + f.pos * (m.pos - d); e.group.attr(b) } })); e.animate = null }
        }
      },
      remove: function () { const c = this; const e = c.chart; e.hasRendered && e.series.forEach(function (e) { e.type === c.type && (e.isDirty = !0) }); u.prototype.remove.apply(c, arguments) }
    }); ''
  }); M(J, 'parts/BarSeries.js', [J['parts/Globals.js']], function (c) { c = c.seriesType; c('bar', 'column', null, { inverted: !0 }); '' }); M(J, 'parts/ScatterSeries.js', [J['parts/Globals.js']],
    function (c) {
      const e = c.Series; const F = c.seriesType; F('scatter', 'line', { lineWidth: 0, findNearestPointBy: 'xy', jitter: { x: 0, y: 0 }, marker: { enabled: !0 }, tooltip: { headerFormat: '<span style="color:{point.color}">\u25cf</span> <span style="font-size: 10px"> {series.name}</span><br/>', pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>' } }, {
        sorted: !1,
        requireSorting: !1,
        noSharedTooltip: !0,
        trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
        takeOrdinalPosition: !1,
        drawGraph: function () {
          this.options.lineWidth &&
e.prototype.drawGraph.call(this)
        },
        applyJitter: function () { const c = this; const e = this.options.jitter; const F = this.points.length; e && this.points.forEach(function (v, q) { ['x', 'y'].forEach(function (C, B) { const u = 'plot' + C.toUpperCase(); if (e[C] && !v.isNull) { let w = c[C + 'Axis']; const m = e[C] * w.transA; if (w && !w.isLog) { const r = Math.max(0, v[u] - m); w = Math.min(w.len, v[u] + m); B = 1E4 * Math.sin(q + B * F); v[u] = r + (w - r) * (B - Math.floor(B)); C === 'x' && (v.clientX = v.plotX) } } }) }) }
      }); c.addEvent(e, 'afterTranslate', function () { this.applyJitter && this.applyJitter() })
      ''
    }); M(J, 'mixins/centered-series.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.isNumber; const I = e.pick; const G = e.relativeLength; const H = c.deg2rad; c.CenteredSeriesMixin = {
      getCenter: function () {
        let c = this.options; let e = this.chart; const C = 2 * (c.slicedOffset || 0); const B = e.plotWidth - 2 * C; e = e.plotHeight - 2 * C; let u = c.center; u = [I(u[0], '50%'), I(u[1], '50%'), c.size || '100%', c.innerSize || 0]; const w = Math.min(B, e); let m; for (m = 0; m < 4; ++m) { const r = u[m]; c = m < 2 || m === 2 && /%$/.test(r); u[m] = G(r, [B, e, w, u[2]][m]) + (c ? C : 0) }u[3] > u[2] && (u[3] = u[2])
        return u
      },
      getStartAndEndRadians: function (c, e) { c = F(c) ? c : 0; e = F(e) && e > c && e - c < 360 ? e : c + 360; return { start: H * (c + -90), end: H * (e + -90) } }
    }
  }); M(J, 'parts/PieSeries.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.clamp; const I = e.defined; const G = e.isNumber; const H = e.pick; const v = e.relativeLength; const q = e.setAnimation; const C = c.addEvent; e = c.CenteredSeriesMixin; const B = e.getStartAndEndRadians; const u = c.merge; const w = c.noop; const m = c.Point; const r = c.Series; const D = c.seriesType; const A = c.fireEvent; D('pie', 'line', {
      center: [null, null],
      clip: !1,
      colorByPoint: !0,
      dataLabels: {
        allowOverlap: !0,
        connectorPadding: 5,
        connectorShape: 'fixedOffset',
        crookDistance: '70%',
        distance: 30,
        enabled: !0,
        formatter: function () { return this.point.isNull ? void 0 : this.point.name },
        softConnector: !0,
        x: 0
      },
      fillColor: void 0,
      ignoreHiddenPoint: !0,
      inactiveOtherPoints: !0,
      legendType: 'point',
      marker: null,
      size: null,
      showInLegend: !1,
      slicedOffset: 10,
      stickyTracking: !1,
      tooltip: { followPointer: !0 },
      borderColor: '#ffffff',
      borderWidth: 1,
      lineWidth: void 0,
      states: { hover: { brightness: 0.1 } }
    }, {
      isCartesian: !1,
      requireSorting: !1,
      directTouch: !0,
      noSharedTooltip: !0,
      trackerGroups: ['group', 'dataLabelsGroup'],
      axisTypes: [],
      pointAttribs: c.seriesTypes.column.prototype.pointAttribs,
      animate: function (c) { const b = this; const a = b.points; const d = b.startAngleRad; c || (a.forEach(function (a) { const c = a.graphic; const f = a.shapeArgs; c && f && (c.attr({ r: H(a.startR, b.center && b.center[3] / 2), start: d, end: d }), c.animate({ r: f.r, start: f.start, end: f.end }, b.options.animation)) }), b.animate = null) },
      hasData: function () { return !!this.processedXData.length },
      updateTotals: function () {
        let c; let b = 0; const a = this.points; const d = a.length; const e = this.options.ignoreHiddenPoint
        for (c = 0; c < d; c++) { var k = a[c]; b += e && !k.visible ? 0 : k.isNull ? 0 : k.y } this.total = b; for (c = 0; c < d; c++)k = a[c], k.percentage = b > 0 && (k.visible || !e) ? k.y / b * 100 : 0, k.total = b
      },
      generatePoints: function () { r.prototype.generatePoints.call(this); this.updateTotals() },
      getX: function (c, b, a) { const d = this.center; const f = this.radii ? this.radii[a.index] : d[2] / 2; c = Math.asin(F((c - d[1]) / (f + a.labelDistance), -1, 1)); return d[0] + (b ? -1 : 1) * Math.cos(c) * (f + a.labelDistance) + (a.labelDistance > 0 ? (b ? -1 : 1) * this.options.dataLabels.padding : 0) },
      translate: function (c) {
        this.generatePoints()
        let b = 0; let a = this.options; const d = a.slicedOffset; const f = d + (a.borderWidth || 0); let e = B(a.startAngle, a.endAngle); const l = this.startAngleRad = e.start; e = (this.endAngleRad = e.end) - l; const m = this.points; const p = a.dataLabels.distance; a = a.ignoreHiddenPoint; let g; const t = m.length; c || (this.center = c = this.getCenter()); for (g = 0; g < t; g++) {
          const q = m[g]; let r = l + b * e; if (!a || q.visible)b += q.percentage / 100; let u = l + b * e; q.shapeType = 'arc'; q.shapeArgs = { x: c[0], y: c[1], r: c[2] / 2, innerR: c[3] / 2, start: Math.round(1E3 * r) / 1E3, end: Math.round(1E3 * u) / 1E3 }; q.labelDistance = H(q.options.dataLabels &&
q.options.dataLabels.distance, p); q.labelDistance = v(q.labelDistance, q.shapeArgs.r); this.maxLabelDistance = Math.max(this.maxLabelDistance || 0, q.labelDistance); u = (u + r) / 2; u > 1.5 * Math.PI ? u -= 2 * Math.PI : u < -Math.PI / 2 && (u += 2 * Math.PI); q.slicedTranslation = { translateX: Math.round(Math.cos(u) * d), translateY: Math.round(Math.sin(u) * d) }; const n = Math.cos(u) * c[2] / 2; const z = Math.sin(u) * c[2] / 2; q.tooltipPos = [c[0] + 0.7 * n, c[1] + 0.7 * z]; q.half = u < -Math.PI / 2 || u > Math.PI / 2 ? 1 : 0; q.angle = u; r = Math.min(f, q.labelDistance / 5); q.labelPosition = {
            natural: {
              x: c[0] +
n + Math.cos(u) * q.labelDistance,
              y: c[1] + z + Math.sin(u) * q.labelDistance
            },
            final: {},
            alignment: q.labelDistance < 0 ? 'center' : q.half ? 'right' : 'left',
            connectorPosition: { breakAt: { x: c[0] + n + Math.cos(u) * r, y: c[1] + z + Math.sin(u) * r }, touchingSliceAt: { x: c[0] + n, y: c[1] + z } }
          }
        }A(this, 'afterTranslate')
      },
      drawEmpty: function () {
        const c = this.options; if (this.total === 0) {
          const b = this.center[0]; const a = this.center[1]; this.graph || (this.graph = this.chart.renderer.circle(b, a, 0).addClass('highcharts-graph').add(this.group)); this.graph.animate({
            'stroke-width': c.borderWidth,
            cx: b,
            cy: a,
            r: this.center[2] / 2,
            fill: c.fillColor || 'none',
            stroke: c.color || '#cccccc'
          })
        } else this.graph && (this.graph = this.graph.destroy())
      },
      redrawPoints: function () {
        const c = this; const b = c.chart; const a = b.renderer; let d; let e; let k; let l; const m = c.options.shadow; this.drawEmpty(); !m || c.shadowGroup || b.styledMode || (c.shadowGroup = a.g('shadow').attr({ zIndex: -1 }).add(c.group)); c.points.forEach(function (f) {
          const g = {}; e = f.graphic; if (!f.isNull && e) {
            l = f.shapeArgs; d = f.getTranslate(); if (!b.styledMode) {
              var h = f.shadowGroup; m && !h && (h = f.shadowGroup = a.g('shadow').add(c.shadowGroup))
              h && h.attr(d); k = c.pointAttribs(f, f.selected && 'select')
            }f.delayedRendering ? (e.setRadialReference(c.center).attr(l).attr(d), b.styledMode || e.attr(k).attr({ 'stroke-linejoin': 'round' }).shadow(m, h), f.delayedRendering = !1) : (e.setRadialReference(c.center), b.styledMode || u(!0, g, k), u(!0, g, l, d), e.animate(g)); e.attr({ visibility: f.visible ? 'inherit' : 'hidden' }); e.addClass(f.getClassName())
          } else e && (f.graphic = e.destroy())
        })
      },
      drawPoints: function () {
        const c = this.chart.renderer; this.points.forEach(function (b) {
          b.graphic ||
(b.graphic = c[b.shapeType](b.shapeArgs).add(b.series.group), b.delayedRendering = !0)
        })
      },
      searchPoint: w,
      sortByAngle: function (c, b) { c.sort(function (a, d) { return typeof a.angle !== 'undefined' && (d.angle - a.angle) * b }) },
      drawLegendSymbol: c.LegendSymbolMixin.drawRectangle,
      getCenter: e.getCenter,
      getSymbol: w,
      drawGraph: null
    }, {
      init: function () { m.prototype.init.apply(this, arguments); const c = this; c.name = H(c.name, 'Slice'); const b = function (a) { c.slice(a.type === 'select') }; C(c, 'select', b); C(c, 'unselect', b); return c },
      isValid: function () {
        return G(this.y) &&
this.y >= 0
      },
      setVisible: function (c, b) { const a = this; const d = a.series; const f = d.chart; const e = d.options.ignoreHiddenPoint; b = H(b, e); c !== a.visible && (a.visible = a.options.visible = c = typeof c === 'undefined' ? !a.visible : c, d.options.data[d.data.indexOf(a)] = a.options, ['graphic', 'dataLabel', 'connector', 'shadowGroup'].forEach(function (b) { if (a[b])a[b][c ? 'show' : 'hide'](!0) }), a.legendItem && f.legend.colorizeItem(a, c), c || a.state !== 'hover' || a.setState(''), e && (d.isDirty = !0), b && f.redraw()) },
      slice: function (c, b, a) {
        const d = this.series; q(a, d.chart)
        H(b, !0); this.sliced = this.options.sliced = I(c) ? c : !this.sliced; d.options.data[d.data.indexOf(this)] = this.options; this.graphic.animate(this.getTranslate()); this.shadowGroup && this.shadowGroup.animate(this.getTranslate())
      },
      getTranslate: function () { return this.sliced ? this.slicedTranslation : { translateX: 0, translateY: 0 } },
      haloPath: function (c) { const b = this.shapeArgs; return this.sliced || !this.visible ? [] : this.series.chart.renderer.symbols.arc(b.x, b.y, b.r + c, b.r + c, { innerR: b.r - 1, start: b.start, end: b.end }) },
      connectorShapes: {
        fixedOffset: function (c,
          b, a) { const d = b.breakAt; b = b.touchingSliceAt; return ['M', c.x, c.y].concat(a.softConnector ? ['C', c.x + (c.alignment === 'left' ? -5 : 5), c.y, 2 * d.x - b.x, 2 * d.y - b.y, d.x, d.y] : ['L', d.x, d.y]).concat(['L', b.x, b.y]) },
        straight: function (c, b) { b = b.touchingSliceAt; return ['M', c.x, c.y, 'L', b.x, b.y] },
        crookedLine: function (c, b, a) {
          b = b.touchingSliceAt; let d = this.series; let e = d.center[0]; const f = d.chart.plotWidth; const l = d.chart.plotLeft; d = c.alignment; const m = this.shapeArgs.r; a = v(a.crookDistance, 1); a = d === 'left' ? e + m + (f + l - e - m) * (1 - a) : l + (e - m) * a; e = ['L', a, c.y]
          if (d === 'left' ? a > c.x || a < b.x : a < c.x || a > b.x)e = []; return ['M', c.x, c.y].concat(e).concat(['L', b.x, b.y])
        }
      },
      getConnectorPath: function () { const c = this.labelPosition; const b = this.series.options.dataLabels; let a = b.connectorShape; const d = this.connectorShapes; d[a] && (a = d[a]); return a.call(this, { x: c.final.x, y: c.final.y, alignment: c.alignment }, c.connectorPosition, b) }
    }); ''
  }); M(J, 'parts/DataLabels.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.animObject; const I = e.arrayMax; const G = e.clamp; const H = e.defined; const v = e.extend; const q = e.isArray
    const C = e.objectEach; const B = e.pick; const u = e.relativeLength; const w = e.splat; const m = c.format; const r = c.merge; e = c.noop; const D = c.Series; const A = c.seriesTypes; const f = c.stableSort; c.distribute = function (b, a, d) {
      function e (a, b) { return a.target - b.target } let k; let l = !0; const m = b; let p = []; let g = 0; const t = m.reducedLen || a; for (k = b.length; k--;)g += b[k].size; if (g > t) { f(b, function (a, b) { return (b.rank || 0) - (a.rank || 0) }); for (g = k = 0; g <= t;)g += b[k].size, k++; p = b.splice(k - 1, b.length) }f(b, e); for (b = b.map(function (a) { return { size: a.size, targets: [a.target], align: B(a.align, 0.5) } }); l;) {
        for (k = b.length; k--;) {
          l =
b[k], g = (Math.min.apply(0, l.targets) + Math.max.apply(0, l.targets)) / 2, l.pos = G(g - l.size * l.align, 0, a - l.size)
        }k = b.length; for (l = !1; k--;)k > 0 && b[k - 1].pos + b[k - 1].size > b[k].pos && (b[k - 1].size += b[k].size, b[k - 1].targets = b[k - 1].targets.concat(b[k].targets), b[k - 1].align = 0.5, b[k - 1].pos + b[k - 1].size > a && (b[k - 1].pos = a - b[k - 1].size), b.splice(k, 1), l = !0)
      }m.push.apply(m, p); k = 0; b.some(function (b) {
        let e = 0; if (b.targets.some(function () {
          m[k].pos = b.pos + e; if (Math.abs(m[k].pos - m[k].target) > d) {
            return m.slice(0, k + 1).forEach(function (a) { delete a.pos }),
            m.reducedLen = (m.reducedLen || a) - 0.1 * a, m.reducedLen > 0.1 * a && c.distribute(m, a, d), !0
          } e += m[k].size; k++
        })) return !0
      }); f(m, e)
    }; D.prototype.drawDataLabels = function () {
      function b (a, b) { let d = b.filter; return d ? (b = d.operator, a = a[d.property], d = d.value, b === '>' && a > d || b === '<' && a < d || b === '>=' && a >= d || b === '<=' && a <= d || b === '==' && a == d || b === '===' && a === d ? !0 : !1) : !0 } function a (a, b) {
        let d = []; let c; if (q(a) && !q(b))d = a.map(function (a) { return r(a, b) }); else if (q(b) && !q(a))d = b.map(function (b) { return r(a, b) }); else if (q(a) || q(b)) {
          for (c = Math.max(a.length,
            b.length); c--;)d[c] = r(a[c], b[c])
        } else d = r(a, b); return d
      } const d = this; const e = d.chart; const f = d.options; let l = f.dataLabels; const y = d.points; let p; const g = d.hasRendered || 0; const t = F(f.animation).duration; const x = Math.min(t, 200); const u = !e.renderer.forExport && B(l.defer, x > 0); const v = e.renderer; l = a(a(e.options.plotOptions && e.options.plotOptions.series && e.options.plotOptions.series.dataLabels, e.options.plotOptions && e.options.plotOptions[d.type] && e.options.plotOptions[d.type].dataLabels), l); c.fireEvent(this, 'drawDataLabels'); if (q(l) || l.enabled || d._hasPointLabels) {
        const n =
d.plotGroup('dataLabelsGroup', 'data-labels', u && !g ? 'hidden' : 'inherit', l.zIndex || 6); u && (n.attr({ opacity: +g }), g || setTimeout(function () { const a = d.dataLabelsGroup; a && (d.visible && n.show(!0), a[f.animation ? 'animate' : 'attr']({ opacity: 1 }, { duration: x })) }, t - x)); y.forEach(function (c) {
          p = w(a(l, c.dlOptions || c.options && c.options.dataLabels)); p.forEach(function (a, g) {
            const h = a.enabled && (!c.isNull || c.dataLabelOnNull) && b(c, a); let l = c.dataLabels ? c.dataLabels[g] : c.dataLabel; const p = c.connectors ? c.connectors[g] : c.connector; const k = B(a.distance,
              c.labelDistance); const t = !l; if (h) {
              var q = c.getLabelConfig(); var r = B(a[c.formatPrefix + 'Format'], a.format); q = H(r) ? m(r, q, e) : (a[c.formatPrefix + 'Formatter'] || a.formatter).call(q, a); r = a.style; var y = a.rotation; e.styledMode || (r.color = B(a.color, r.color, d.color, '#000000'), r.color === 'contrast' ? (c.contrastColor = v.getContrast(c.color || d.color), r.color = !H(k) && a.inside || k < 0 || f.stacking ? c.contrastColor : '#000000') : delete c.contrastColor, f.cursor && (r.cursor = f.cursor)); var x = {
                r: a.borderRadius || 0,
                rotation: y,
                padding: a.padding,
                zIndex: 1
              }; e.styledMode || (x.fill = a.backgroundColor, x.stroke = a.borderColor, x['stroke-width'] = a.borderWidth); C(x, function (a, b) { typeof a === 'undefined' && delete x[b] })
            }!l || h && H(q)
              ? h && H(q) && (l ? x.text = q : (c.dataLabels = c.dataLabels || [], l = c.dataLabels[g] = y ? v.text(q, 0, -9999).addClass('highcharts-data-label') : v.label(q, 0, -9999, a.shape, null, null, a.useHTML, null, 'data-label'), g || (c.dataLabel = l), l.addClass(' highcharts-data-label-color-' + c.colorIndex + ' ' + (a.className || '') + (a.useHTML ? ' highcharts-tracker' : ''))), l.options =
a, l.attr(x), e.styledMode || l.css(r).shadow(a.shadow), l.added || l.add(n), a.textPath && !a.useHTML && (l.setTextPath(c.getDataLabelPath && c.getDataLabelPath(l) || c.graphic, a.textPath), c.dataLabelPath && !a.textPath.enabled && (c.dataLabelPath = c.dataLabelPath.destroy())), d.alignDataLabel(c, l, a, null, t))
              : (c.dataLabel = c.dataLabel && c.dataLabel.destroy(), c.dataLabels && (c.dataLabels.length === 1 ? delete c.dataLabels : delete c.dataLabels[g]), g || delete c.dataLabel, p && (c.connector = c.connector.destroy(), c.connectors && (c.connectors.length === 1
                  ? delete c.connectors
                  : delete c.connectors[g])))
          })
        })
      }c.fireEvent(this, 'afterDrawDataLabels')
    }; D.prototype.alignDataLabel = function (b, a, c, e, f) {
      const d = this; const h = this.chart; const p = this.isCartesian && h.inverted; const g = this.enabledDataSorting; let k = B(b.dlBox && b.dlBox.centerX, b.plotX, -9999); const m = B(b.plotY, -9999); const q = a.getBBox(); const r = c.rotation; const n = c.align; const u = h.isInsidePlot(k, Math.round(m), p); let w = B(c.overflow, g ? 'none' : 'justify') === 'justify'; let A = this.visible && (b.series.forceDL || g && !w || u || e && h.isInsidePlot(k, p ? e.x + 1 : e.y + e.height - 1, p)); let C = function (c) {
        g &&
d.xAxis && !w && d.setDataLabelStartPos(b, a, f, u, c)
      }; if (A) {
        const D = h.renderer.fontMetrics(h.styledMode ? void 0 : c.style.fontSize, a).b; e = v({ x: p ? this.yAxis.len - m : k, y: Math.round(p ? this.xAxis.len - k : m), width: 0, height: 0 }, e); v(c, { width: q.width, height: q.height }); r
          ? (w = !1, k = h.renderer.rotCorr(D, r), k = { x: e.x + c.x + e.width / 2 + k.x, y: e.y + c.y + { top: 0, middle: 0.5, bottom: 1 }[c.verticalAlign] * e.height }, C(k), a[f ? 'attr' : 'animate'](k).attr({ align: n }), C = (r + 720) % 360, C = C > 180 && C < 360, n === 'left'
              ? k.y -= C ? q.height : 0
              : n === 'center'
                ? (k.x -= q.width /
2, k.y -= q.height / 2)
                : n === 'right' && (k.x -= q.width, k.y -= C ? 0 : q.height), a.placed = !0, a.alignAttr = k)
          : (C(e), a.align(c, null, e), k = a.alignAttr); w && e.height >= 0 ? this.justifyDataLabel(a, c, k, q, e, f) : B(c.crop, !0) && (A = h.isInsidePlot(k.x, k.y) && h.isInsidePlot(k.x + q.width, k.y + q.height)); if (c.shape && !r)a[f ? 'attr' : 'animate']({ anchorX: p ? h.plotWidth - b.plotY : b.plotX, anchorY: p ? h.plotHeight - b.plotX : b.plotY })
      }f && g && (a.placed = !1); A || g && !w || (a.hide(!0), a.placed = !1)
    }; D.prototype.setDataLabelStartPos = function (b, a, c, e, f) {
      const d = this.chart
      const h = d.inverted; let p = this.xAxis; const g = p.reversed; const k = h ? a.height / 2 : a.width / 2; b = (b = b.pointWidth) ? b / 2 : 0; p = h ? f.x : g ? -k - b : p.width - k + b; f = h ? g ? this.yAxis.height - k + b : -k - b : f.y; a.startXPos = p; a.startYPos = f; e ? a.visibility === 'hidden' && (a.show(), a.attr({ opacity: 0 }).animate({ opacity: 1 })) : a.attr({ opacity: 1 }).animate({ opacity: 0 }, void 0, a.hide); d.hasRendered && (c && a.attr({ x: a.startXPos, y: a.startYPos }), a.placed = !0)
    }; D.prototype.justifyDataLabel = function (b, a, c, e, f, l) {
      const d = this.chart; const h = a.align; const g = a.verticalAlign; const k = b.box
        ? 0
        : b.padding ||
0; let m = c.x + k; if (m < 0) { h === 'right' ? (a.align = 'left', a.inside = !0) : a.x = -m; var q = !0 }m = c.x + e.width - k; m > d.plotWidth && (h === 'left' ? (a.align = 'right', a.inside = !0) : a.x = d.plotWidth - m, q = !0); m = c.y + k; m < 0 && (g === 'bottom' ? (a.verticalAlign = 'top', a.inside = !0) : a.y = -m, q = !0); m = c.y + e.height - k; m > d.plotHeight && (g === 'top' ? (a.verticalAlign = 'bottom', a.inside = !0) : a.y = d.plotHeight - m, q = !0); q && (b.placed = !l, b.align(a, null, f)); return q
    }; A.pie && (A.pie.prototype.dataLabelPositioners = {
      radialDistributionY: function (b) { return b.top + b.distributeBox.pos },
      radialDistributionX: function (b, a, c, e) { return b.getX(c < a.top + 2 || c > a.bottom - 2 ? e : c, a.half, a) },
      justify: function (b, a, c) { return c[0] + (b.half ? -1 : 1) * (a + b.labelDistance) },
      alignToPlotEdges: function (b, a, c, e) { b = b.getBBox().width; return a ? b + e : c - b - e },
      alignToConnectors: function (b, a, c, e) { let d = 0; let f; b.forEach(function (a) { f = a.dataLabel.getBBox().width; f > d && (d = f) }); return a ? d + e : c - d - e }
    }, A.pie.prototype.drawDataLabels = function () {
      const b = this; const a = b.data; let d; const e = b.chart; const f = b.options.dataLabels; const l = f.connectorPadding; let m; const p = e.plotWidth
      const g = e.plotHeight; const q = e.plotLeft; const x = Math.round(e.chartWidth / 3); let u; const v = b.center; const n = v[2] / 2; const z = v[1]; let w; let A; let C; let F; const G = [[], []]; let J; let K; let M; let S; const U = [0, 0, 0, 0]; const X = b.dataLabelPositioners; let aa; b.visible && (f.enabled || b._hasPointLabels) && (a.forEach(function (a) { a.dataLabel && a.visible && a.dataLabel.shortened && (a.dataLabel.attr({ width: 'auto' }).css({ width: 'auto', textOverflow: 'clip' }), a.dataLabel.shortened = !1) }), D.prototype.drawDataLabels.apply(b), a.forEach(function (a) {
        a.dataLabel && (a.visible
          ? (G[a.half].push(a), a.dataLabel._pos = null, !H(f.style.width) &&
!H(a.options.dataLabels && a.options.dataLabels.style && a.options.dataLabels.style.width) && a.dataLabel.getBBox().width > x && (a.dataLabel.css({ width: 0.7 * x }), a.dataLabel.shortened = !0))
          : (a.dataLabel = a.dataLabel.destroy(), a.dataLabels && a.dataLabels.length === 1 && delete a.dataLabels))
      }), G.forEach(function (a, h) {
        const k = a.length; const m = []; let r; if (k) {
          b.sortByAngle(a, h - 0.5); if (b.maxLabelDistance > 0) {
            var t = Math.max(0, z - n - b.maxLabelDistance); const x = Math.min(z + n + b.maxLabelDistance, e.plotHeight); a.forEach(function (a) {
              a.labelDistance > 0 &&
a.dataLabel && (a.top = Math.max(0, z - n - a.labelDistance), a.bottom = Math.min(z + n + a.labelDistance, e.plotHeight), r = a.dataLabel.getBBox().height || 21, a.distributeBox = { target: a.labelPosition.natural.y - a.top + r / 2, size: r, rank: a.y }, m.push(a.distributeBox))
            }); t = x + r - t; c.distribute(m, t, t / 5)
          } for (S = 0; S < k; S++) {
            d = a[S]; C = d.labelPosition; w = d.dataLabel; M = !1 === d.visible ? 'hidden' : 'inherit'; K = t = C.natural.y; m && H(d.distributeBox) && (typeof d.distributeBox.pos === 'undefined' ? M = 'hidden' : (F = d.distributeBox.size, K = X.radialDistributionY(d)))
            delete d.positionIndex; if (f.justify)J = X.justify(d, n, v); else switch (f.alignTo) { case 'connectors':J = X.alignToConnectors(a, h, p, q); break; case 'plotEdges':J = X.alignToPlotEdges(w, h, p, q); break; default:J = X.radialDistributionX(b, d, K, t) }w._attr = { visibility: M, align: C.alignment }; w._pos = { x: J + f.x + ({ left: l, right: -l }[C.alignment] || 0), y: K + f.y - 10 }; C.final.x = J; C.final.y = K; B(f.crop, !0) && (A = w.getBBox().width, t = null, J - A < l && h === 1
              ? (t = Math.round(A - J + l), U[3] = Math.max(t, U[3]))
              : J + A > p - l && h === 0 && (t = Math.round(J + A - p + l), U[1] = Math.max(t,
                U[1])), K - F / 2 < 0 ? U[0] = Math.max(Math.round(-K + F / 2), U[0]) : K + F / 2 > g && (U[2] = Math.max(Math.round(K + F / 2 - g), U[2])), w.sideOverflow = t)
          }
        }
      }), I(U) === 0 || this.verifyDataLabelOverflow(U)) && (this.placeDataLabels(), this.points.forEach(function (a) {
        aa = r(f, a.options.dataLabels); if (m = B(aa.connectorWidth, 1)) {
          let c; u = a.connector; if ((w = a.dataLabel) && w._pos && a.visible && a.labelDistance > 0) {
            M = w._attr.visibility; if (c = !u) {
              a.connector = u = e.renderer.path().addClass('highcharts-data-label-connector  highcharts-color-' + a.colorIndex + (a.className
                ? ' ' + a.className
                : '')).add(b.dataLabelsGroup), e.styledMode || u.attr({ 'stroke-width': m, stroke: aa.connectorColor || a.color || '#666666' })
            }u[c ? 'attr' : 'animate']({ d: a.getConnectorPath() }); u.attr('visibility', M)
          } else u && (a.connector = u.destroy())
        }
      }))
    }, A.pie.prototype.placeDataLabels = function () {
      this.points.forEach(function (b) {
        const a = b.dataLabel; let c; a && b.visible && ((c = a._pos)
          ? (a.sideOverflow && (a._attr.width = Math.max(a.getBBox().width - a.sideOverflow, 0), a.css({
              width: a._attr.width + 'px',
              textOverflow: (this.options.dataLabels.style ||
{}).textOverflow || 'ellipsis'
            }), a.shortened = !0), a.attr(a._attr), a[a.moved ? 'animate' : 'attr'](c), a.moved = !0)
          : a && a.attr({ y: -9999 })); delete b.distributeBox
      }, this)
    }, A.pie.prototype.alignDataLabel = e, A.pie.prototype.verifyDataLabelOverflow = function (b) {
      const a = this.center; const c = this.options; const e = c.center; const f = c.minSize || 80; let l = c.size !== null; if (!l) {
        if (e[0] !== null) var m = Math.max(a[2] - Math.max(b[1], b[3]), f); else m = Math.max(a[2] - b[1] - b[3], f), a[0] += (b[3] - b[1]) / 2; e[1] !== null
          ? m = G(m, f, a[2] - Math.max(b[0], b[2]))
          : (m = G(m, f, a[2] - b[0] -
b[2]), a[1] += (b[0] - b[2]) / 2); m < a[2] ? (a[2] = m, a[3] = Math.min(u(c.innerSize || 0, m), m), this.translate(a), this.drawDataLabels && this.drawDataLabels()) : l = !0
      } return l
    }); A.column && (A.column.prototype.alignDataLabel = function (b, a, c, e, f) {
      const d = this.chart.inverted; const h = b.series; let p = b.dlBox || b.shapeArgs; const g = B(b.below, b.plotY > B(this.translatedThreshold, h.yAxis.len)); const k = B(c.inside, !!this.options.stacking); p && (e = r(p), e.y < 0 && (e.height += e.y, e.y = 0), p = e.y + e.height - h.yAxis.len, p > 0 && (e.height -= p), d && (e = {
        x: h.yAxis.len - e.y - e.height,
        y: h.xAxis.len - e.x - e.width,
        width: e.height,
        height: e.width
      }), k || (d ? (e.x += g ? 0 : e.width, e.width = 0) : (e.y += g ? e.height : 0, e.height = 0))); c.align = B(c.align, !d || k ? 'center' : g ? 'right' : 'left'); c.verticalAlign = B(c.verticalAlign, d || k ? 'middle' : g ? 'top' : 'bottom'); D.prototype.alignDataLabel.call(this, b, a, c, e, f); e && (e.height <= 0 && e.y === this.chart.plotHeight || e.width <= 0 && e.x === 0) && (a.hide(!0), a.placed = !1); c.inside && b.contrastColor && a.css({ color: b.contrastColor })
    })
  }); M(J, 'modules/overlapping-datalabels.src.js', [J['parts/Globals.js'],
    J['parts/Utilities.js']], function (c, e) {
    const F = e.isArray; const I = e.objectEach; const G = e.pick; e = c.Chart; const H = c.addEvent; const v = c.fireEvent; H(e, 'render', function () {
      let c = []; (this.labelCollectors || []).forEach(function (e) { c = c.concat(e()) }); (this.yAxis || []).forEach(function (e) { e.options.stackLabels && !e.options.stackLabels.allowOverlap && I(e.stacks, function (e) { I(e, function (e) { c.push(e.label) }) }) }); (this.series || []).forEach(function (e) {
        const q = e.options.dataLabels; e.visible && (!1 !== q.enabled || e._hasPointLabels) && e.points.forEach(function (e) {
          e.visible &&
(F(e.dataLabels) ? e.dataLabels : e.dataLabel ? [e.dataLabel] : []).forEach(function (q) { const m = q.options; q.labelrank = G(m.labelrank, e.labelrank, e.shapeArgs && e.shapeArgs.height); m.allowOverlap || c.push(q) })
        })
      }); this.hideOverlappingLabels(c)
    }); e.prototype.hideOverlappingLabels = function (c) {
      const e = this; const q = c.length; const u = e.renderer; let w; let m; let r; let D = !1; let A = function (a) {
        const b = a.box ? 0 : a.padding || 0; let c = 0; if (a && (!a.alignAttr || a.placed)) {
          const e = a.alignAttr || { x: a.attr('x'), y: a.attr('y') }; const f = a.parentGroup; a.width || (c = a.getBBox(),
          a.width = c.width, a.height = c.height, c = u.fontMetrics(null, a.element).h); return { x: e.x + (f.translateX || 0) + b, y: e.y + (f.translateY || 0) + b - c, width: a.width - 2 * b, height: a.height - 2 * b }
        }
      }; for (m = 0; m < q; m++) if (w = c[m])w.oldOpacity = w.opacity, w.newOpacity = 1, w.absoluteBox = A(w); c.sort(function (a, b) { return (b.labelrank || 0) - (a.labelrank || 0) }); for (m = 0; m < q; m++) {
        const f = (A = c[m]) && A.absoluteBox; for (w = m + 1; w < q; ++w) {
          const b = (r = c[w]) && r.absoluteBox; !f || !b || A === r || A.newOpacity === 0 || r.newOpacity === 0 || b.x > f.x + f.width || b.x + b.width < f.x || b.y >
f.y + f.height || b.y + b.height < f.y || ((A.labelrank < r.labelrank ? A : r).newOpacity = 0)
        }
      }c.forEach(function (a) { let b; if (a) { const c = a.newOpacity; a.oldOpacity !== c && (a.alignAttr && a.placed ? (c ? a.show(!0) : b = function () { a.hide(!0); a.placed = !1 }, D = !0, a.alignAttr.opacity = c, a[a.isOld ? 'animate' : 'attr'](a.alignAttr, null, b), v(e, 'afterHideOverlappingLabel')) : a.attr({ opacity: c })); a.isOld = !0 } }); D && v(e, 'afterHideAllOverlappingLabels')
    }
  }); M(J, 'parts/Interaction.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F =
e.defined; const I = e.extend; const G = e.isArray; const H = e.isObject; const v = e.objectEach; const q = e.pick; const C = c.addEvent; e = c.Chart; const B = c.createElement; const u = c.css; const w = c.defaultOptions; const m = c.defaultPlotOptions; const r = c.fireEvent; const D = c.hasTouch; const A = c.Legend; const f = c.merge; const b = c.Point; const a = c.Series; const d = c.seriesTypes; const h = c.svg; const k = c.TrackerMixin = {
      drawTrackerPoint: function () {
        const a = this; const b = a.chart; const c = b.pointer; const d = function (a) { const b = c.getPointFromEvent(a); typeof b !== 'undefined' && (c.isDirectTouch = !0, b.onMouseOver(a)) }; let e; a.points.forEach(function (a) {
          e = G(a.dataLabels)
            ? a.dataLabels
            : a.dataLabel ? [a.dataLabel] : []; a.graphic && (a.graphic.element.point = a); e.forEach(function (b) { b.div ? b.div.point = a : b.element.point = a })
        }); a._hasTracking || (a.trackerGroups.forEach(function (e) { if (a[e]) { a[e].addClass('highcharts-tracker').on('mouseover', d).on('mouseout', function (a) { c.onTrackerMouseOut(a) }); if (D)a[e].on('touchstart', d); !b.styledMode && a.options.cursor && a[e].css(u).css({ cursor: a.options.cursor }) } }), a._hasTracking = !0); r(this, 'afterDrawTracker')
      },
      drawTrackerGraph: function () {
        const a = this; const b = a.options
        const c = b.trackByArea; const d = [].concat(c ? a.areaPath : a.graphPath); const e = d.length; const f = a.chart; const k = f.pointer; const m = f.renderer; const n = f.options.tooltip.snap; const q = a.tracker; let u; const v = function () { if (f.hoverSeries !== a)a.onMouseOver() }; const w = 'rgba(192,192,192,' + (h ? 0.0001 : 0.002) + ')'; if (e && !c) for (u = e + 1; u--;)d[u] === 'M' && d.splice(u + 1, 0, d[u + 1] - n, d[u + 2], 'L'), (u && d[u] === 'M' || u === e) && d.splice(u, 0, 'L', d[u - 2] + n, d[u - 1]); q
          ? q.attr({ d: d })
          : a.graph && (a.tracker = m.path(d).attr({ visibility: a.visible ? 'visible' : 'hidden', zIndex: 2 }).addClass(c
            ? 'highcharts-tracker-area'
            : 'highcharts-tracker-line').add(a.group), f.styledMode || a.tracker.attr({ 'stroke-linejoin': 'round', stroke: w, fill: c ? w : 'none', 'stroke-width': a.graph.strokeWidth() + (c ? 0 : 2 * n) }), [a.tracker, a.markerGroup].forEach(function (a) { a.addClass('highcharts-tracker').on('mouseover', v).on('mouseout', function (a) { k.onTrackerMouseOut(a) }); b.cursor && !f.styledMode && a.css({ cursor: b.cursor }); if (D)a.on('touchstart', v) })); r(this, 'afterDrawTracker')
      }
    }; d.column && (d.column.prototype.drawTracker = k.drawTrackerPoint); d.pie && (d.pie.prototype.drawTracker =
k.drawTrackerPoint); d.scatter && (d.scatter.prototype.drawTracker = k.drawTrackerPoint); I(A.prototype, {
      setItemEvents: function (a, c, d) {
        const e = this; const h = e.chart.renderer.boxWrapper; const l = a instanceof b; const p = 'highcharts-legend-' + (l ? 'point' : 'series') + '-active'; const k = e.chart.styledMode; (d ? c : a.legendGroup).on('mouseover', function () { a.visible && e.allItems.forEach(function (b) { a !== b && b.setState('inactive', !l) }); a.setState('hover'); a.visible && h.addClass(p); k || c.css(e.options.itemHoverStyle) }).on('mouseout', function () {
          e.chart.styledMode ||
c.css(f(a.visible ? e.itemStyle : e.itemHiddenStyle)); e.allItems.forEach(function (b) { a !== b && b.setState('', !l) }); h.removeClass(p); a.setState()
        }).on('click', function (b) { const c = function () { a.setVisible && a.setVisible(); e.allItems.forEach(function (b) { a !== b && b.setState(a.visible ? 'inactive' : '', !l) }) }; h.removeClass(p); b = { browserEvent: b }; a.firePointEvent ? a.firePointEvent('legendItemClick', b, c) : r(a, 'legendItemClick', b, c) })
      },
      createCheckboxForItem: function (a) {
        a.checkbox = B('input', {
          type: 'checkbox',
          className: 'highcharts-legend-checkbox',
          checked: a.selected,
          defaultChecked: a.selected
        }, this.options.itemCheckboxStyle, this.chart.container); C(a.checkbox, 'click', function (b) { r(a.series || a, 'checkboxClick', { checked: b.target.checked, item: a }, function () { a.select() }) })
      }
    }); I(e.prototype, {
      showResetZoom: function () {
        function a () { b.zoomOut() } var b = this; const c = w.lang; const d = b.options.chart.resetZoomButton; const e = d.theme; const f = e.states; const h = d.relativeTo === 'chart' || d.relativeTo === 'spaceBox' ? null : 'plotBox'; r(this, 'beforeShowResetZoom', null, function () {
          b.resetZoomButton = b.renderer.button(c.resetZoom,
            null, null, a, e, f && f.hover).attr({ align: d.position.align, title: c.resetZoomTitle }).addClass('highcharts-reset-zoom').add().align(d.position, !1, h)
        }); r(this, 'afterShowResetZoom')
      },
      zoomOut: function () { r(this, 'selection', { resetSelection: !0 }, this.zoom) },
      zoom: function (a) {
        const b = this; let c; const d = b.pointer; let e = !1; const f = b.inverted ? d.mouseDownX : d.mouseDownY; !a || a.resetSelection
          ? (b.axes.forEach(function (a) { c = a.zoom() }), d.initiated = !1)
          : a.xAxis.concat(a.yAxis).forEach(function (a) {
            const g = a.axis; const h = b.inverted ? g.left : g.top; const l = b.inverted
              ? h + g.width
              : h + g.height; const p = g.isXAxis; let k = !1; if (!p && f >= h && f <= l || p || !F(f))k = !0; d[p ? 'zoomX' : 'zoomY'] && k && (c = g.zoom(a.min, a.max), g.displayBtn && (e = !0))
          }); const h = b.resetZoomButton; e && !h ? b.showResetZoom() : !e && H(h) && (b.resetZoomButton = h.destroy()); c && b.redraw(q(b.options.chart.animation, a && a.animation, b.pointCount < 100))
      },
      pan: function (a, b) {
        const c = this; const d = c.hoverPoints; const e = c.options.chart; let f; b = typeof b === 'object' ? b : { enabled: b, type: 'x' }; e && e.panning && (e.panning = b); const h = b.type; r(this, 'pan', { originalEvent: a }, function () {
          d &&
d.forEach(function (a) { a.setState() }); let b = [1]; h === 'xy' ? b = [1, 0] : h === 'y' && (b = [0]); b.forEach(function (b) {
            const d = c[b ? 'xAxis' : 'yAxis'][0]; let e = d.options; let g = d.horiz; const h = a[g ? 'chartX' : 'chartY']; g = g ? 'mouseDownX' : 'mouseDownY'; let l = c[g]; let k = (d.pointRange || 0) / 2; let p = d.reversed && !c.inverted || !d.reversed && c.inverted ? -1 : 1; const m = d.getExtremes(); let n = d.toValue(l - h, !0) + k * p; p = d.toValue(l + d.len - h, !0) - k * p; const q = p < n; l = q ? p : n; n = q ? n : p; p = Math.min(m.dataMin, k ? m.min : d.toValue(d.toPixels(m.min) - d.minPixelPadding)); k = Math.max(m.dataMax, k
              ? m.max
              : d.toValue(d.toPixels(m.max) + d.minPixelPadding)); if (!e.ordinal) { b && (e = p - l, e > 0 && (n += e, l = p), e = n - k, e > 0 && (n = k, l -= e)); if (d.series.length && l !== m.min && n !== m.max && b || d.panningState && l >= d.panningState.startMin && n <= d.panningState.startMax)d.setExtremes(l, n, !1, !1, { trigger: 'pan' }), f = !0; c[g] = h }
          }); f && c.redraw(!1); u(c.container, { cursor: 'move' })
        })
      }
    }); I(b.prototype, {
      select: function (a, b) {
        const c = this; const d = c.series; const e = d.chart; this.selectedStaging = a = q(a, !c.selected); c.firePointEvent(a ? 'select' : 'unselect', { accumulate: b }, function () {
          c.selected =
c.options.selected = a; d.options.data[d.data.indexOf(c)] = c.options; c.setState(a && 'select'); b || e.getSelectedPoints().forEach(function (a) { const b = a.series; a.selected && a !== c && (a.selected = a.options.selected = !1, b.options.data[b.data.indexOf(a)] = a.options, a.setState(e.hoverPoints && b.options.inactiveOtherPoints ? 'inactive' : ''), a.firePointEvent('unselect')) })
        }); delete this.selectedStaging
      },
      onMouseOver: function (a) {
        const b = this.series.chart; const c = b.pointer; a = a ? c.normalize(a) : c.getChartCoordinatesFromPoint(this, b.inverted)
        c.runPointActions(a, this)
      },
      onMouseOut: function () { const a = this.series.chart; this.firePointEvent('mouseOut'); this.series.options.inactiveOtherPoints || (a.hoverPoints || []).forEach(function (a) { a.setState() }); a.hoverPoints = a.hoverPoint = null },
      importEvents: function () { if (!this.hasImportedEvents) { const a = this; const b = f(a.series.options.point, a.options).events; a.events = b; v(b, function (b, d) { c.isFunction(b) && C(a, d, b) }); this.hasImportedEvents = !0 } },
      setState: function (a, b) {
        const c = this.series; let d = this.state; let e = c.options.states[a ||
'normal'] || {}; const f = m[c.type].marker && c.options.marker; const h = f && !1 === f.enabled; const l = f && f.states && f.states[a || 'normal'] || {}; const k = !1 === l.enabled; let u = c.stateMarkerGraphic; const v = this.marker || {}; const y = c.chart; let w = c.halo; let A; const B = f && c.markerAttribs; a = a || ''; if (!(a === this.state && !b || this.selected && a !== 'select' || !1 === e.enabled || a && (k || h && !1 === l.enabled) || a && v.states && v.states[a] && !1 === v.states[a].enabled)) {
          this.state = a; B && (A = c.markerAttribs(this, a)); if (this.graphic) {
            d && this.graphic.removeClass('highcharts-point-' + d); a && this.graphic.addClass('highcharts-point-' +
a); if (!y.styledMode) { const C = c.pointAttribs(this, a); const D = q(y.options.chart.animation, e.animation); c.options.inactiveOtherPoints && ((this.dataLabels || []).forEach(function (a) { a && a.animate({ opacity: C.opacity }, D) }), this.connector && this.connector.animate({ opacity: C.opacity }, D)); this.graphic.animate(C, D) }A && this.graphic.animate(A, q(y.options.chart.animation, l.animation, f.animation)); u && u.hide()
          } else {
            if (a && l) {
              d = v.symbol || c.symbol; u && u.currentSymbol !== d && (u = u.destroy()); if (A) {
                if (u) {
                  u[b ? 'animate' : 'attr']({
                    x: A.x,
                    y: A.y
                  })
                } else d && (c.stateMarkerGraphic = u = y.renderer.symbol(d, A.x, A.y, A.width, A.height).add(c.markerGroup), u.currentSymbol = d)
              } !y.styledMode && u && u.attr(c.pointAttribs(this, a))
            }u && (u[a && this.isInside ? 'show' : 'hide'](), u.element.point = this)
          }a = e.halo; e = (u = this.graphic || u) && u.visibility || 'inherit'; a && a.size && u && e !== 'hidden' && !this.isCluster
            ? (w || (c.halo = w = y.renderer.path().add(u.parentGroup)), w.show()[b ? 'animate' : 'attr']({ d: this.haloPath(a.size) }), w.attr({
                class: 'highcharts-halo highcharts-color-' + q(this.colorIndex,
                  c.colorIndex) + (this.className ? ' ' + this.className : ''),
                visibility: e,
                zIndex: -1
              }), w.point = this, y.styledMode || w.attr(I({ fill: this.color || c.color, 'fill-opacity': a.opacity }, a.attributes)))
            : w && w.point && w.point.haloPath && w.animate({ d: w.point.haloPath(0) }, null, w.hide); r(this, 'afterSetState')
        }
      },
      haloPath: function (a) { return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX) - a, this.plotY - a, 2 * a, 2 * a) }
    }); I(a.prototype, {
      onMouseOver: function () {
        const a = this.chart; const b = a.hoverSeries; if (b && b !== this)b.onMouseOut()
        this.options.events.mouseOver && r(this, 'mouseOver'); this.setState('hover'); a.hoverSeries = this
      },
      onMouseOut: function () { const a = this.options; const b = this.chart; const c = b.tooltip; const d = b.hoverPoint; b.hoverSeries = null; if (d)d.onMouseOut(); this && a.events.mouseOut && r(this, 'mouseOut'); !c || this.stickyTracking || c.shared && !this.noSharedTooltip || c.hide(); b.series.forEach(function (a) { a.setState('', !0) }) },
      setState: function (a, b) {
        const c = this; let d = c.options; const e = c.graph; const f = d.inactiveOtherPoints; let h = d.states; let l = d.lineWidth; let k = d.opacity; const m = q(h[a ||
'normal'] && h[a || 'normal'].animation, c.chart.options.chart.animation); d = 0; a = a || ''; if (c.state !== a && ([c.group, c.markerGroup, c.dataLabelsGroup].forEach(function (b) { b && (c.state && b.removeClass('highcharts-series-' + c.state), a && b.addClass('highcharts-series-' + a)) }), c.state = a, !c.chart.styledMode)) {
          if (h[a] && !1 === h[a].enabled) return; a && (l = h[a].lineWidth || l + (h[a].lineWidthPlus || 0), k = q(h[a].opacity, k)); if (e && !e.dashstyle) {
            for (h = { 'stroke-width': l }, e.animate(h, m); c['zone-graph-' + d];) {
              c['zone-graph-' + d].attr(h), d +=
1
            }
          }f || [c.group, c.markerGroup, c.dataLabelsGroup, c.labelBySeries].forEach(function (a) { a && a.animate({ opacity: k }, m) })
        }b && f && c.points && c.setAllPointsToState(a)
      },
      setAllPointsToState: function (a) { this.points.forEach(function (b) { b.setState && b.setState(a) }) },
      setVisible: function (a, b) {
        const c = this; const d = c.chart; const e = c.legendItem; const f = d.options.chart.ignoreHiddenSeries; const h = c.visible; const k = (c.visible = a = c.options.visible = c.userOptions.visible = typeof a === 'undefined' ? !h : a) ? 'show' : 'hide'; ['group', 'dataLabelsGroup', 'markerGroup',
          'tracker', 'tt'].forEach(function (a) { if (c[a])c[a][k]() }); if (d.hoverSeries === c || (d.hoverPoint && d.hoverPoint.series) === c)c.onMouseOut(); e && d.legend.colorizeItem(c, a); c.isDirty = !0; c.options.stacking && d.series.forEach(function (a) { a.options.stacking && a.visible && (a.isDirty = !0) }); c.linkedSeries.forEach(function (b) { b.setVisible(a, !1) }); f && (d.isDirtyBox = !0); r(c, k); !1 !== b && d.redraw()
      },
      show: function () { this.setVisible(!0) },
      hide: function () { this.setVisible(!1) },
      select: function (a) {
        this.selected = a = this.options.selected =
typeof a === 'undefined' ? !this.selected : a; this.checkbox && (this.checkbox.checked = a); r(this, a ? 'select' : 'unselect')
      },
      drawTracker: k.drawTrackerGraph
    })
  }); M(J, 'parts/Responsive.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.isArray; const I = e.isObject; const G = e.objectEach; const H = e.pick; const v = e.splat; e = c.Chart; e.prototype.setResponsive = function (e, v) {
      const q = this.options.responsive; let u = []; let w = this.currentResponsive; !v && q && q.rules && q.rules.forEach(function (e) {
        typeof e._id === 'undefined' && (e._id = c.uniqueKey())
        this.matchResponsiveRule(e, u)
      }, this); v = c.merge.apply(0, u.map(function (e) { return c.find(q.rules, function (c) { return c._id === e }).chartOptions })); v.isResponsiveOptions = !0; u = u.toString() || void 0; u !== (w && w.ruleIds) && (w && this.update(w.undoOptions, e, !0), u ? (w = this.currentOptions(v), w.isResponsiveOptions = !0, this.currentResponsive = { ruleIds: u, mergedOptions: v, undoOptions: w }, this.update(v, e, !0)) : this.currentResponsive = void 0)
    }; e.prototype.matchResponsiveRule = function (c, e) {
      const q = c.condition; (q.callback || function () {
        return this.chartWidth <=
H(q.maxWidth, Number.MAX_VALUE) && this.chartHeight <= H(q.maxHeight, Number.MAX_VALUE) && this.chartWidth >= H(q.minWidth, 0) && this.chartHeight >= H(q.minHeight, 0)
      }).call(this) && e.push(c._id)
    }; e.prototype.currentOptions = function (c) {
      function e (c, m, r, u) { let w; G(c, function (c, b) { if (!u && q.collectionsWithUpdate.indexOf(b) > -1) for (c = v(c), r[b] = [], w = 0; w < c.length; w++)m[b][w] && (r[b][w] = {}, e(c[w], m[b][w], r[b][w], u + 1)); else I(c) ? (r[b] = F(c) ? [] : {}, e(c, m[b] || {}, r[b], u + 1)) : r[b] = typeof m[b] === 'undefined' ? null : m[b] }) } var q = this
      const u = {}; e(c, this.options, u, 0); return u
    }
  }); M(J, 'masters/highcharts.src.js', [J['parts/Globals.js'], J['parts/Utilities.js']], function (c, e) {
    const F = e.extend; F(c, {
      animObject: e.animObject,
      arrayMax: e.arrayMax,
      arrayMin: e.arrayMin,
      attr: e.attr,
      correctFloat: e.correctFloat,
      defined: e.defined,
      destroyObjectProperties: e.destroyObjectProperties,
      discardElement: e.discardElement,
      erase: e.erase,
      extend: e.extend,
      extendClass: e.extendClass,
      isArray: e.isArray,
      isClass: e.isClass,
      isDOMElement: e.isDOMElement,
      isNumber: e.isNumber,
      isObject: e.isObject,
      isString: e.isString,
      numberFormat: e.numberFormat,
      objectEach: e.objectEach,
      offset: e.offset,
      pad: e.pad,
      pick: e.pick,
      pInt: e.pInt,
      relativeLength: e.relativeLength,
      setAnimation: e.setAnimation,
      splat: e.splat,
      syncTimeout: e.syncTimeout,
      wrap: e.wrap
    }); return c
  }); J['masters/highcharts.src.js']._modules = J; return J['masters/highcharts.src.js']
})
// # sourceMappingURL=highcharts.js.map
