import test from 'ava';
import sinon from 'sinon';

import testRequest from '../src/testRequest';

test.cb('request:send', t => {
    const xhr = sinon.useFakeXMLHttpRequest();
    const tr = testRequest(xhr);
    const requests = [];
    xhr.onCreate = (req) => requests.push(req);

    var req = tr.request('http://localhost/foo')
        .mimeType("application/json")
        .on('load', (xhr) => {
            t.is(xhr.responseText, '{"success":true}');
            t.end();
        }).on('error', (err) => {
            t.fail(err);
            t.end();
        });
    req.send('GET');

    t.is(requests.length, 1);
    requests[0].respond(200, { "Content-Type": "application/json" }, '{"success":true}');
});

test.cb('request:post', t => {
    const xhr = sinon.useFakeXMLHttpRequest();
    const tr = testRequest(xhr);
    const requests = [];
    xhr.onCreate = (req) => requests.push(req);

    var req = tr.request('http://localhost/foo')
        .mimeType("application/json")
        .header('content-type', 'text/foo;charset=utf-8')
        .on('load', (xhr) => {
            t.is(xhr.responseText, '{"success":true}');
            t.end();
        }).on('error', (err) => {
            t.fail(err);
            t.end();
        });
    req.post('foo=bar');

    t.is(requests.length, 1);

    const queueReq = requests[0];
    t.is(queueReq.method, 'POST');
    t.is(queueReq.url, "http://localhost/foo");
    t.is(queueReq.requestBody, 'foo=bar');
    t.deepEqual(queueReq.requestHeaders, {
        'Accept':'application/json',
        'content-type':'text/foo;charset=utf-8',
    });
    queueReq.respond(200, { "Content-Type": "application/json" }, '{"success":true}');
});

test.cb('json:get', t => {
    const xhr = sinon.useFakeXMLHttpRequest();
    const tr = testRequest(xhr);
    const requests = [];
    xhr.onCreate = (req) => requests.push(req);

    var req = tr.json('http://localhost/foo')
        .on('load', (json) => {
            t.deepEqual(json, {success:true});
            t.end();
        }).on('error', (err) => {
            t.fail(err);
            t.end();
        });
    req.get();

    t.is(requests.length, 1);
    requests[0].respond(200, { "Content-Type": "application/json" }, '{"success":true}');
});
