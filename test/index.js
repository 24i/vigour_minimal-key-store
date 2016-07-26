'use strict'
const test = require('tape')
const create = require('../lib/create')
const http = require('http')

test('server', (t) => {
  const server = create(6000)
  request((data) => {
    console.log(data)
    server.close()
    t.end()
  })
})

function request (cb, path, payload) {
  const req = http.request({
    hostname: 'localhost',
    port: 6000,
    method: 'GET',
    withCredentials: false
  }, function (res) {
    var str = ''
    res.on('data', (chunk) => {
      str += chunk.toString()
    })
    res.on('end', () => {
      cb(str)
    })
  })
  req.end()
}
