/**
 * @note The block below contains polyfills for Node.js globals
 * required for Jest to function when running JSDOM tests.
 * These HAVE to be require's and HAVE to be in this exact
 * order, since "undici" depends on the "TextEncoder" global API.
 */

// Check if we're in a Node.js environment and polyfills are needed
if (typeof globalThis.TextEncoder === 'undefined') {
  const { TextDecoder, TextEncoder } = require('node:util')
  globalThis.TextDecoder = TextDecoder
  globalThis.TextEncoder = TextEncoder
}

if (typeof globalThis.ReadableStream === 'undefined') {
  const { ReadableStream, TransformStream } = require('node:stream/web')
  globalThis.ReadableStream = ReadableStream
  globalThis.TransformStream = TransformStream
}

if (typeof globalThis.setImmediate === 'undefined') {
  const { clearImmediate, setImmediate } = require('node:timers')
  globalThis.setImmediate = setImmediate
  globalThis.clearImmediate = clearImmediate
}

if (typeof globalThis.performance === 'undefined') {
  const { performance } = require('node:perf_hooks')
  globalThis.performance = performance
}

// Mock MessagePort and MessageChannel for Web APIs
if (typeof globalThis.MessagePort === 'undefined') {
  globalThis.MessagePort = class MessagePort {
    postMessage() {}
    start() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
  }
}

if (typeof globalThis.MessageChannel === 'undefined') {
  globalThis.MessageChannel = class MessageChannel {
    constructor() {
      this.port1 = new globalThis.MessagePort()
      this.port2 = new globalThis.MessagePort()
    }
  }
}

if (typeof globalThis.fetch === 'undefined') {
  const { fetch, Headers, Request, Response, FormData } = require('undici')
  globalThis.fetch = fetch
  globalThis.Headers = Headers
  globalThis.Request = Request
  globalThis.Response = Response
  globalThis.FormData = FormData
}
