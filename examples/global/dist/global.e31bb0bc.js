// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../../.config/nvm/10.15.1/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../../.config/nvm/10.15.1/lib/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../../.config/nvm/10.15.1/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"main.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../../.config/nvm/10.15.1/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../../src/Scroll.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import Signal from 'signals';
// import VirtualScroll from './virtualScroll';
var DEFAULTS = {
  easing: 0.5,
  friction: 0.12,
  wheelDeltaMultiplier: 0.36,
  // based on my research this match regular DOM scroll distance pretty well
  maxWheel: 300,
  autoUpdate: true
};

var CustomScroll =
/*#__PURE__*/
function () {
  _createClass(CustomScroll, [{
    key: "enabled",
    set: function set(isEnabled) {
      if (isEnabled) {
        this.dom.style.willChange = 'transform'; // if (this.fakeElement) {
        //   this.fakeElement.style.display = null;
        // }

        if (!this.scrollbar) {
          window.scrollTo(0, this.y);
        }
      } else {
        // if (this.fakeElement) {
        //   this.fakeElement.style.display = 'none';
        // }
        this.dom.style.willChange = null;
      }

      this.isLocked = !isEnabled;
    },
    get: function get() {
      return !this.isLocked;
    }
  }, {
    key: "height",
    set: function set(height) {
      this._height = height; // this.fakeElement && (this.fakeElement.style.height = this._height + 'px');
    },
    get: function get() {
      return this._height;
    }
  }]);

  function CustomScroll(props) {
    var _this = this;

    _classCallCheck(this, CustomScroll);

    this.dom = props && props.dom || null;
    this.scrollbar = props && props.scrollbar || null;
    this.prevent = props && props.prevent || null;
    this.handlers = {};

    this.handlers.onMouseScroll = function (e) {
      return _this.onMouseScroll(e);
    };

    this.y = 0;
    this.target = 0;
    this.percent = 0;
    this.vy = 0;
    this.deltaY = 0;
    console.log('props', props);
    this.easing = props.easing !== undefined ? props.easing : DEFAULTS.easing;
    this.friction = props.friction !== undefined ? props.friction : DEFAULTS.friction;
    this.wheelDeltaMultiplier = props.wheelDeltaMultiplier !== undefined ? props.wheelDeltaMultiplier : DEFAULTS.wheelDeltaMultiplier;
    this.maxWheel = props.maxWheel !== undefined ? props.maxWheel : DEFAULTS.maxWheel;
    this.autoUpdate = props.autoUpdate !== undefined ? props.autoUpdate : DEFAULTS.autoUpdate;
    this.isLocked = false;
    this.firstScroll = (window.scrollY || window.pageYOffset) > 0;
    this.raf;

    var transformProp = function () {
      var testEl = document.createElement('div');

      if (testEl.style.transform == null) {
        var vendors = ['Webkit', 'Moz', 'ms'];

        for (var vendor in vendors) {
          if (testEl.style[vendors[vendor] + 'Transform'] !== undefined) {
            return vendors[vendor] + 'Transform';
          }
        }
      }

      return 'transform';
    }();

    this.transformProp = transformProp; // this.scrolled = new Signal();

    this.resize();
    this.start();
  }

  _createClass(CustomScroll, [{
    key: "start",
    value: function start() {
      this.dom.style.position = 'fixed';
      this.dom.style.willChange = 'transform';
      this.bindEvents(); // if (this.scrollbar) {
      // 	this.scrollbar.scrolled.add(() => this.onScrollbarScrolled());
      // }
      // plug virtual Scroll to get the Y delta
      // const vsCallback = (y) => this.updateTarget(y);
      // this.vs = new VirtualScroll({
      // 	callback: vsCallback
      // });
      // this.vs.bind();
      // this._wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : undefined !== document.onmousewheel ? 'mousewheel' : 'DOMMouseScroll';
      // const passiveEvents = {
      //   passive: this.supportsPassiveEvents()
      // };
      // this.dom.addEventListener(this._wheelEvent, this.handlers.onMouseScroll, passiveEvents);
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;

      console.log('bindEvents');

      this.scrollHandler = function () {
        return _this2.onScroll();
      };

      window.addEventListener('scroll', this.scrollHandler, {
        passive: true
      });
    }
  }, {
    key: "onScroll",
    value: function onScroll() {
      this.target = window.pageYOffset;
    } // main target Y here
    // diferent that physical Y inside RAF

  }, {
    key: "updateTarget",
    value: function updateTarget(evt) {
      var deltaWheelY = 0;

      if (evt.deltaY > 0) {
        deltaWheelY = Math.min(evt.deltaY, this.maxWheel);
      } else {
        deltaWheelY = -Math.min(Math.abs(evt.deltaY), this.maxWheel);
      }

      deltaWheelY = deltaWheelY * this.wheelDeltaMultiplier;
      this.target += deltaWheelY;
      this.target = Math.round(this.target * 10000) / 10000;
      this.applyConstrains(); // if (this.scrollbar) this.updateScrollbarPosition();
    }
  }, {
    key: "update",
    value: function update() {
      var _this3 = this;

      var preventDomUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!this.isLocked) {
        if (this.target !== undefined) {
          this.deltaY = this.target - this.y;

          if (preventDomUpdate) {
            this.vy = 0;
            this.y = this.target;
          } else {
            this.vy += this.deltaY * this.easing;
            this.y += this.vy *= this.friction;
          }
        }
      }

      this.y = (1000 * this.y | 0) / 1000;

      if (!this.preventDomUpdate) {
        if (!(this.oldY === this.y && !preventDomUpdate)) {
          this.updateDom();
        }
      }

      this.percent = this.y / (this.height - this.boundingHeight);
      this.percent = (10000 * this.percent | 0) / 10000;
      this.oldY = this.y; // if (this.scrollbar) {
      // 	this.scrollbar.update();
      // }

      if (this.autoUpdate) this.raf = window.requestAnimationFrame(function () {
        return _this3.update();
      });
    }
  }, {
    key: "updateDom",
    value: function updateDom(additionalTransform) {
      var style = 'translate3d(0px, ' + -this.y + 'px,0)';

      if (additionalTransform) {
        style += ' ' + additionalTransform;
      }

      this.dom.style[this.transformProp] = style;
    }
  }, {
    key: "applyConstrains",
    value: function applyConstrains() {
      var t = this.height - this.boundingHeight;

      if (this.target < 0) {
        this.target = 0;
      } else {
        if (this.target > t) {
          this.target = t;
        }
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this.y = this.target = this.oldY = this.percent = 0;
    }
  }, {
    key: "resize",
    value: function resize(t) {
      this.height = this.dom.getBoundingClientRect().height;
      this.boundingHeight = window.innerHeight; // if (this.scrollbar) this.scrollbar.resize(this.height);

      document.body.style.height = this.height + 'px';
      this.applyConstrains();
      this.update(true);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.raf) {
        window.cancelAnimationFrame(this.raf);
        this.raf = null;
      } // if (this.scrollbar) {
      // 	this.scrollbar.destroy();
      // }
      // this.vs.destroy();
      // this.fakeElement && this.fakeElement.parentNode.removeChild(this.fakeElement);
      // this.dom.removeEventListener(this._wheelEvent, this.handlers.onMouseScroll);

    } // updateScrollbarPosition() {
    // 	if (this.height > this.boundingHeight) {
    // 		this.scrollbar.percent = this.target / (this.height - this.boundingHeight);
    // 	}
    // }
    // onScrollbarScrolled() {
    // 	if (!this.isLocked) {
    // 		this.target = this.scrollbar ? this.scrollbar.percent * (this.height - this.boundingHeight) : window.scrollY || window.pageYOffset;
    // 		let firstScroll = this._firstScroll;
    // 		if (this._firstScroll) {
    // 			this.y = this.oldY = this.target;
    // 			this._firstScroll = false;
    // 			this.update(true);
    // 		} else {
    // 			if (!this.target) {
    // 				this._firstScroll = false;
    // 			}
    // 		}
    // 		// this.scrolled.dispatch(firstScroll);
    // 	}
    // }

  }]);

  return CustomScroll;
}();

var _default = CustomScroll;
exports.default = _default;
module.exports = exports["default"];
},{}],"main.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _main = _interopRequireDefault(require("./main.css"));

var _Scroll = _interopRequireDefault(require("./../../src/Scroll"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import a CSS module
// import Smooth from './../../src/smooth';
var _default = function _default() {
  var scroll = new _Scroll.default({
    dom: document.querySelector('.background')
  }); // scroll.start()
};

exports.default = _default;
module.exports = exports["default"];
},{"./main.css":"main.css","./../../src/Scroll":"../../src/Scroll.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _main = _interopRequireDefault(require("./main.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import another component
(0, _main.default)();
},{"./main.js":"main.js"}],"../../../../.config/nvm/10.15.1/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57729" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../.config/nvm/10.15.1/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/global.e31bb0bc.js.map