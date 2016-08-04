'use strict'
const http = require('http')
const s = require('vigour-state/s')
const request = require('./request')

module.exports = function create (port, state) {
  if (!state) {
    state = s({})
  }
  return http.createServer((req, res) => {
    try {
      res.setHeader('Content-Type', 'text/plain')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
      res.setHeader('Accept', '*/*')
      if (req.url.indexOf('RESET_STATE_CACHE') !== -1) {
        state.reset()
        res.end('{}')
      } else {
        res.end(request(state, req))
      }
    } catch (err) {
      console.log('error', err)
      res.end(err.message)
    }
  }).listen(port || 80)
}
