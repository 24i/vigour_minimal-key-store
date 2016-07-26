'use strict'
const http = require('http')
module.exports = function create (port) {
  return http.createServer((req, res) => {
    console.log(req.url)
    res.end('go go go')
  }).listen(port || 80)
}
