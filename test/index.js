'use strict'
const test = require('tape')
const create = require('../lib/create')
const http = require('http')

test('server', { timeout: 10e3 }, (t) => {
  const server = create(6000)
  const myToken = 'abcdef'
  const date = Date.now()
  const progress = 0.5
  const obj = { date, progress }
  const payload = JSON.stringify(obj)
  request(`/${myToken}/1=${payload}`, (data) => {
    t.same(data, obj, 'returns payload')
  })
  request(`/${myToken}`, (data) => {
    t.same(data, { 1: obj }, 'returns token keys')
  })
  request(`/${myToken}/1`, (data) => {
    t.same(data, obj, 'returns video')
  })
  request(`/${myToken}/1/progress`, (data) => {
    t.same(data, progress, 'returns progress')
  })
  const objbig = {}
  for (let i = 0; i < 100; i++) {
    objbig['big' + i] = { date: date + i, progress }
  }
  const bigpayload = JSON.stringify(objbig)
  request(`/${myToken}=${bigpayload}`, () => {
    request(`/${myToken}?limit=2&sort=date`, (data) => {
      t.same(data, { big99: objbig.big99, big98: objbig.big98 }, 'sort and limit')
      server.close()
      t.end()
    })
  })
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
      if (cb) { cb(JSON.parse(str)) }
    })
  })
  req.end()
}
