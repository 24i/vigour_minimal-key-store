'use strict'
const test = require('tape')
const create = require('../lib/create')
const http = require('http')

test('server', { timeout: 10e3 }, (t) => {
  const server = create(6000)
  const date = Date.now()
  const progress = 0.5
  const obj = { date, progress }
  const payload = JSON.stringify(obj)
  const objbig = {}
  for (let i = 0; i < 100; i++) {
    objbig['big' + i] = { date: date + i, progress }
  }
  const bigpayload = JSON.stringify(objbig)

  request(`token/1=${payload}`)
    .then((data) => t.same(data, obj, 'returns payload'))

  request('token')
    .then((data) => t.same(data, { 1: obj }, 'returns token keys'))

  request('token/1')
    .then((data) => t.same(data, obj, 'returns video'))

  request('token/1/progress')
    .then((data) => t.same(data, progress, 'returns progress'))

  request('a/b/c/d=100')
    .then((data) => {
      t.same(data, 100, 'returns 100')
      return request('a/b/c/d')
    })
    .then((data) => {
      t.same(data, 100, 'returns 100')
      return request('a/b/c/d=200')
    })
    .then((data) => {
      t.same(data, 200, 'returns 200')
      return request('token/1=null', true)
    })
    .then((data) => {
      t.same(data, '', 'remove video - returns empty string')
      return request(`token=${bigpayload}`)
    })
    .then(() => request('token?limit=2&sort=date'))
    .then((data) => {
      t.same(data, { big99: objbig.big99, big98: objbig.big98 }, 'sort and limit')
      server.close()
      t.end()
    })
})

test('clear server', (t) => {
  const server = create(6000)
  request('field=hello')
    .then(() => request('RESET_STATE_CACHE'))
    .then((data) => {
      t.same(data, {}, 'returns empty object')
      return request('field')
    })
    .then((data) => {
      t.same(data, {}, 'removed field')
      t.end()
      server.close()
    })
})

test('start state', (t) => {
  const server = create(6000, { hello: true })
  request('hello')
    .then((data) => {
      t.same(data, true, 'return field')
      t.end()
      server.close()
    })
})

function request (path, flat) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 6000,
      path: path ? '/' + path : '',
      method: 'GET',
      withCredentials: false
    }, function (res) {
      var str = ''
      res.on('data', (chunk) => {
        str += chunk.toString()
      })
      res.on('end', () => {
        resolve(flat ? str : JSON.parse(str))
      })
    })
    req.end()
  })
}
