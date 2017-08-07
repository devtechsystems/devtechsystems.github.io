(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("assets/js/projects/components/DefaultRow.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RadRow = function (_Component) {
  _inherits(RadRow, _Component);

  function RadRow(props) {
    _classCallCheck(this, RadRow);

    var _this = _possibleConstructorReturn(this, (RadRow.__proto__ || Object.getPrototypeOf(RadRow)).call(this, props));

    _this.state = {
      showEllipses: false
    };
    return _this;
  }

  _createClass(RadRow, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var textWidth = this.nameTextElement.getBoundingClientRect().width;
      if (textWidth > this.availableWidthForName() && !this.state.showEllipses) {
        this.setState({ showEllipses: true });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var textWidth = this.nameTextElement.getBoundingClientRect().width;
      if (textWidth > this.availableWidthForName() && !this.state.showEllipses) {
        this.setState({ showEllipses: true });
      } else if (textWidth < this.availableWidthForName() && this.state.showEllipses) {
        this.setState({ showEllipses: false });
      }
    }
  }, {
    key: 'availableWidthForName',
    value: function availableWidthForName() {
      return this.props.chartWidth - 53 - this.spaceForCircle();
    }
  }, {
    key: 'spaceForCircle',
    value: function spaceForCircle() {
      return this.getCircleRadius() * 2 + this.props.circlePaddingRight;
    }
  }, {
    key: 'getFontSize',
    value: function getFontSize() {
      return this.props.rowHeight / 3;
    }
  }, {
    key: 'getCircleRadius',
    value: function getCircleRadius() {
      return this.getFontSize() / 2;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          y = _props.y,
          rowHeight = _props.rowHeight,
          chartWidth = _props.chartWidth,
          datum = _props.datum,
          data = _props.data,
          xScale = _props.xScale;

      var barWidth = void 0;
      var textValueClassNames = (0, _classnames2.default)('rad-row-value-text', { 'rad-row-negative': datum.value < 0 });
      if (datum.value < 0) {
        barWidth = 0;
      } else {
        barWidth = xScale(datum.value);
      }
      var barHeight = rowHeight / 6;
      var fontSize = this.getFontSize();
      var circleRadius = this.getCircleRadius();
      var circleTopAdjustment = 1; // Move the circle slightly down to be flush with text
      var barY = y + rowHeight / 3 + rowHeight / 6;
      var ellipsesXAdjustment = 2; // Move ellipsis slightly right so it has padding
      var ellipses = this.state.showEllipses ? _react2.default.createElement(
        'text',
        {
          className: 'rad-row-name-ellipses',
          x: chartWidth - this.props.spaceForValueText + ellipsesXAdjustment,
          y: y,
          fontSize: fontSize,
          alignmentBaseline: 'hanging'
        },
        _react2.default.createElement(
          'title',
          null,
          datum.name
        ),
        '...'
      ) : '';

      return _react2.default.createElement(
        'g',
        { className: 'rad-row' },
        _react2.default.createElement('circle', {
          cx: 0 + circleRadius,
          cy: y + circleRadius + circleTopAdjustment,
          r: circleRadius
        }),
        _react2.default.createElement(
          'text',
          {
            ref: function ref(textElement) {
              _this2.nameTextElement = textElement;
            },
            className: 'rad-row-name-text',
            x: this.spaceForCircle(),
            y: y,
            fontSize: fontSize,
            alignmentBaseline: 'hanging'
          },
          _react2.default.createElement(
            'title',
            null,
            datum.name
          ),
          datum.name
        ),
        _react2.default.createElement('rect', {
          className: 'rad-row-value-background',
          x: chartWidth - this.props.spaceForValueText,
          y: y,
          width: this.props.spaceForValueText,
          height: rowHeight - barHeight
        }),
        ellipses,
        _react2.default.createElement(
          'text',
          {
            className: textValueClassNames,
            x: chartWidth,
            y: y,
            fontSize: fontSize,
            textAnchor: 'end',
            alignmentBaseline: 'hanging'
          },
          datum.value
        ),
        _react2.default.createElement('rect', {
          className: 'rad-row-background',
          y: barY,
          width: chartWidth,
          height: barHeight
        }),
        _react2.default.createElement('rect', {
          className: 'rad-row-bar',
          y: barY,
          width: barWidth,
          height: barHeight
        })
      );
    }
  }]);

  return RadRow;
}(_react.Component);

exports.default = RadRow;


RadRow.propTypes = {
  y: _propTypes2.default.number,
  chartWidth: _propTypes2.default.number,
  rowHeight: _propTypes2.default.number,
  datum: _propTypes2.default.shape({
    name: _propTypes2.default.string,
    value: _propTypes2.default.number
  }),
  data: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    name: _propTypes2.default.string,
    value: _propTypes2.default.number
  })),
  xScale: _propTypes2.default.func
};

RadRow.defaultProps = {
  circlePaddingRight: 8,
  spaceForValueText: 54
};

});

require.register("assets/js/projects/components/RowChart.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _DefaultRow = require('./DefaultRow.js');

var _DefaultRow2 = _interopRequireDefault(_DefaultRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RowChart = function (_Component) {
  _inherits(RowChart, _Component);

  function RowChart() {
    _classCallCheck(this, RowChart);

    return _possibleConstructorReturn(this, (RowChart.__proto__ || Object.getPrototypeOf(RowChart)).apply(this, arguments));
  }

  _createClass(RowChart, [{
    key: 'rowHeight',
    value: function rowHeight() {
      if (this.props.rowHeight) return this.props.rowHeight;

      return this.props.height / this.props.data.length;
    }
  }, {
    key: 'svgHeight',
    value: function svgHeight() {
      return this.rowHeight() * this.props.data.length;
    }
  }, {
    key: 'svgWidth',
    value: function svgWidth() {
      var scrollbarWidth = 18;
      if (this.svgHeight() >= this.props.height) return this.props.width - scrollbarWidth;

      return this.props.width;
    }
  }, {
    key: 'xScale',
    value: function xScale() {
      var maxValue = _d2.default.max(this.props.data, function (d) {
        return d.value;
      });
      return _d2.default.scale.linear().domain([0, maxValue]).range([0, this.props.width]);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var rowHeight = this.rowHeight();
      var rows = this.props.data.map(function (d, i) {
        var y = rowHeight * i;
        var Row = _this2.props.row;
        return _react2.default.createElement(Row, {
          key: d.name,
          y: y,
          rowHeight: rowHeight,
          chartWidth: _this2.svgWidth(),
          datum: d,
          data: _this2.props.data,
          xScale: _this2.xScale()
        });
      });

      var containerStyles = {
        width: this.props.width,
        height: this.props.height,
        overflow: 'auto'
      };
      return _react2.default.createElement(
        'div',
        { className: 'row-chart ' + (this.props.className || ''), style: containerStyles },
        _react2.default.createElement(
          'svg',
          { width: this.svgWidth(), height: this.svgHeight() },
          rows
        )
      );
    }
  }]);

  return RowChart;
}(_react.Component);

exports.default = RowChart;


RowChart.propTypes = {
  className: _propTypes2.default.string,
  width: _propTypes2.default.number,
  height: _propTypes2.default.number,
  data: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    name: _propTypes2.default.string,
    value: _propTypes2.default.number
  })),
  row: _propTypes2.default.func,
  rowHeight: _propTypes2.default.number
};

RowChart.defaultProps = {
  row: _DefaultRow2.default
};

});

require.register("assets/js/projects/entry.js", function(exports, require, module) {
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _RowChart = require('./components/RowChart.js');

var _RowChart2 = _interopRequireDefault(_RowChart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var projectsByPracticeArea = [{ name: 'Monitoring and Evaluation', value: 184 }, { name: 'Public Financial Management and Fiscal Sustainability', value: 123 }, { name: 'Knowledge Management and Data Analytics', value: 85 }, { name: 'Education, Gender and Youth', value: 37 }, { name: 'Energy and Environment', value: 12 }, { name: 'Security, Transparency, and Governence', value: 4 }];
var pbpaRowChart = _react2.default.createElement(_RowChart2.default, {
  rowHeight: 40,
  width: 300,
  height: 400,
  data: projectsByPracticeArea
});
document.addEventListener('DOMContentLoaded', function () {
  _reactDom2.default.render(pbpaRowChart, document.getElementById('row-chart-practice-area'));
});

});

require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

'use strict';

/* jshint ignore:start */
(function () {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = window.brunch || {};
  var ar = br['auto-reload'] = br['auto-reload'] || {};
  if (!WebSocket || ar.disabled) return;
  if (window._ar) return;
  window._ar = true;

  var cacheBuster = function cacheBuster(url) {
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;

  var reloaders = {
    page: function page() {
      window.location.reload(true);
    },

    stylesheet: function stylesheet() {
      [].slice.call(document.querySelectorAll('link[rel=stylesheet]')).filter(function (link) {
        var val = link.getAttribute('data-autoreload');
        return link.href && val != 'false';
      }).forEach(function (link) {
        link.href = cacheBuster(link.href);
      });

      // Hack to force page repaint after 25ms.
      if (forceRepaint) setTimeout(function () {
        document.body.offsetHeight;
      }, 25);
    },

    javascript: function javascript() {
      var scripts = [].slice.call(document.querySelectorAll('script'));
      var textScripts = scripts.map(function (script) {
        return script.text;
      }).filter(function (text) {
        return text.length > 0;
      });
      var srcScripts = scripts.filter(function (script) {
        return script.src;
      });

      var loaded = 0;
      var all = srcScripts.length;
      var onLoad = function onLoad() {
        loaded = loaded + 1;
        if (loaded === all) {
          textScripts.forEach(function (script) {
            eval(script);
          });
        }
      };

      srcScripts.forEach(function (script) {
        var src = script.src;
        script.remove();
        var newScript = document.createElement('script');
        newScript.src = cacheBuster(src);
        newScript.async = true;
        newScript.onload = onLoad;
        document.head.appendChild(newScript);
      });
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function connect() {
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function (event) {
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function () {
      if (connection.readyState) connection.close();
    };
    connection.onclose = function () {
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();
/* jshint ignore:end */

;
//# sourceMappingURL=projects-bundle.js.map