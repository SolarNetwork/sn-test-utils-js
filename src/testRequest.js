function mock(XMLHttpRequest) {

    var request = function(url) {
        const xhr = new XMLHttpRequest();
        const headers = new Map();
        const events = new Map();
        const self = {};

        /** @type {function} */
        var response;

        "onload" in xhr
            ? xhr.onload = xhr.onerror = xhr.ontimeout = respond
            : xhr.onreadystatechange = function(o) { xhr.readyState > 3 && respond(o); };


        function callEvent(name, arg) {
            const fns = events.get(name);
            if ( fns ) {
                fns.forEach((fn) => {
                    fn.call(self, arg);
                });
            }
        }
        
        function hasResponse(xhr) {
            var type = xhr.responseType;
            return type && type !== "text"
                ? xhr.response // null on error
                : xhr.responseText; // "" on error
        }
        
        function respond(o) {
            var status = xhr.status, result;
            if (!status && hasResponse(xhr)
                    || status >= 200 && status < 300
                    || status === 304) {
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

        self.on = (name, cb) => {
            let handlers = events.get(name);
            if ( !handlers ) {
                handlers = [];
                events.set(name, handlers);
            }
            handlers.push(cb);
            return self;
        };

        self.header = (name, value) => {
            name = (name + "").toLowerCase();
            if (value === undefined) return headers.get(name);
            if (value == null) headers.remove(name);
            else headers.set(name, value + "");
            return self;
        };

        self.mimeType = (type) => {
            headers.set('Accept', type);
            return self;
        };

        self.response = (r) => {
            response = r;
            return self;
        };

        self.get = (data, callback) => {
            return self.send("GET", data, callback);
        };

        self.post = (data, callback) => {
            return self.send("POST", data, callback);
        };

        self.send = (method, data, cb) => {
            xhr.open(method, url);
            headers.forEach((v, k) => {
                xhr.setRequestHeader(k, v);
            });
            if ( cb ) {
                self.on("error", cb).on("load", (xhr) => cb(null, xhr));
            }
            callEvent('beforesend', xhr);
            xhr.send(data);
            return self;
        };

        return self;
    };

    var type = function(defaultMimeType, response) {
        return function(url, callback) {
            var r = request(url).mimeType(defaultMimeType).response(response);
            if (callback != null) {
                return r.get(callback);
            }
            return r;
        };
    };

    var json = type("application/json", function(xhr) {
        return JSON.parse(xhr.responseText);
    });

    return {
        request: request,
        json: json,
    };
}

export default mock;
