// https://github.com/SolarNetwork/sn-test-utils-js Version 0.1.1-dev.0. Copyright 2017 Matt Magoffin.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('solarnetwork-api-core')) :
	typeof define === 'function' && define.amd ? define(['exports', 'solarnetwork-api-core'], factory) :
	(factory((global.sn = global.sn || {}),global.sn));
}(this, (function (exports,solarnetworkApiCore) { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * An extension of `AuthorizationV2Builder` to help with testing.
 */

var TestAuthorizationV2Builder = function (_AuthorizationV2Build) {
    inherits(TestAuthorizationV2Builder, _AuthorizationV2Build);

    function TestAuthorizationV2Builder() {
        classCallCheck(this, TestAuthorizationV2Builder);
        return possibleConstructorReturn(this, (TestAuthorizationV2Builder.__proto__ || Object.getPrototypeOf(TestAuthorizationV2Builder)).apply(this, arguments));
    }

    createClass(TestAuthorizationV2Builder, [{
        key: 'date',


        /**
         * Set the authorization request date.
         *
         * @inheritdoc
         * @override
         */
        value: function date(val) {
            return get(TestAuthorizationV2Builder.prototype.__proto__ || Object.getPrototypeOf(TestAuthorizationV2Builder.prototype), 'date', this).call(this, this.fixedDate || val);
        }
    }, {
        key: 'fixedDate',


        /**
         * Set the fixed authorization request date.
         *
         * <p>This date will be used even when the `date()` function is called.
         * 
         * @type {Date} the fixed date to use
         */
        get: function get$$1() {
            return this._fixedDate;
        },
        set: function set$$1(val) {
            var d = val instanceof Date ? val : new Date();
            this._fixedDate = d;
            get(TestAuthorizationV2Builder.prototype.__proto__ || Object.getPrototypeOf(TestAuthorizationV2Builder.prototype), 'date', this).call(this, d);
        }
    }, {
        key: 'signingKeyValid',
        get: function get$$1() {
            return this.signingKey ? true : false;
        }
    }]);
    return TestAuthorizationV2Builder;
}(solarnetworkApiCore.AuthorizationV2Builder);

function mock(XMLHttpRequest) {

    var request = function request(url) {
        var xhr = new XMLHttpRequest();
        var headers = new Map();
        var events = new Map();
        var self = {};

        /** @type {function} */
        var response;

        "onload" in xhr ? xhr.onload = xhr.onerror = xhr.ontimeout = respond : xhr.onreadystatechange = function (o) {
            xhr.readyState > 3 && respond(o);
        };

        function callEvent(name, arg) {
            var fns = events.get(name);
            if (fns) {
                fns.forEach(function (fn) {
                    fn.call(self, arg);
                });
            }
        }

        function hasResponse(xhr) {
            var type = xhr.responseType;
            return type && type !== "text" ? xhr.response // null on error
            : xhr.responseText; // "" on error
        }

        function respond(o) {
            var status = xhr.status,
                result;
            if (!status && hasResponse(xhr) || status >= 200 && status < 300 || status === 304) {
                result = xhr;
                if (response) {
                    try {
                        result = response.call(self, xhr);
                    } catch (e) {
                        event.call("error", request, e);
                        return;
                    }
                } else {
                    result = xhr;
                }
                callEvent("load", result);
            } else {
                callEvent("error", o);
            }
        }

        self.on = function (name, cb) {
            var handlers = events.get(name);
            if (!handlers) {
                handlers = [];
                events.set(name, handlers);
            }
            handlers.push(cb);
            return self;
        };

        self.header = function (name, value) {
            name = (name + "").toLowerCase();
            if (value === undefined) return headers.get(name);
            if (value == null) headers.remove(name);else headers.set(name, value + "");
            return self;
        };

        self.mimeType = function (type) {
            headers.set('Accept', type);
            return self;
        };

        self.response = function (r) {
            response = r;
            return self;
        };

        self.get = function (data, callback) {
            return self.send("GET", data, callback);
        };

        self.post = function (data, callback) {
            return self.send("POST", data, callback);
        };

        self.send = function (method, data, cb) {
            xhr.open(method, url);
            headers.forEach(function (v, k) {
                xhr.setRequestHeader(k, v);
            });
            if (cb) {
                self.on("error", cb).on("load", function (xhr) {
                    return cb(null, xhr);
                });
            }
            callEvent('beforesend', xhr);
            xhr.send(data);
            return self;
        };

        return self;
    };

    var type = function type(defaultMimeType, response) {
        return function (url, callback) {
            var r = request(url).mimeType(defaultMimeType).response(response);
            if (callback != null) {
                return r.get(callback);
            }
            return r;
        };
    };

    var json = type("application/json", function (xhr) {
        return JSON.parse(xhr.responseText);
    });

    return {
        request: request,
        json: json
    };
}

exports.TestAuthorizationV2Builder = TestAuthorizationV2Builder;
exports.testRequest = mock;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=solarnetwork-test-utils.js.map
