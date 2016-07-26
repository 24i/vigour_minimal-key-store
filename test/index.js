'use strict'
const test = require('tape')
const create = require('../lib/create')
const http = require('http')

test('server', (t) => {
  const server = create(6000)

  const myToken = 'abcdef'
  const video = 'hello_mp4'
  const date = Date.now()
  const progress = 0.5
  const payload = JSON.stringify({ date, progress })

  request(`/${myToken}/${video}=${payload}`, (data) => {
    console.log(data)
  })

  request(`/${myToken}`, (data) => {
    console.log(data)
  })

  request(`/${myToken}/${video}`, (data) => {
    console.log(data)
  })

  setTimeout(() => {
    server.close()
  }, 2e3)
})

function request (path, cb) {
  const req = http.request({
    hostname: 'localhost',
    port: 6000,
    path: path || '',
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
