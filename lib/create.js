'use strict'
const http = require('http')
const store = {}
const merge = require('lodash.merge')
const url = require('url')

module.exports = function create (port) {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.setHeader('Accept', '*/*')
    if (req.url.indexOf('BABELSTIRREDSMURXMURF') !== -1) {
      for (let i in store) {
        delete store[i]
      }
      res.end('cleared it!')
    } else {
      try {
        var path = url.parse(decodeURI(req.url)).path.split('/')
        var opts = {}
        var params
        path.shift()
        var select = store
        for (let i in path) {
          let payload
          if (i == path.length - 1) { //eslint-disable-line
            var x = path[i].split('?')
            path[i] = x[0]
            params = x[1]
            var s = path[i].split('=')
            path[i] = s[0]
            payload = s[1]
            if (payload) {
              try {
                payload = JSON.parse(payload)
              } catch (err) {
                console.log('no json')
              }
            }
          }
          if (select[path[i]]) {
            select = select[path[i]]
            if (typeof select !== 'object' && i != path.length - 1) {  //eslint-disable-line
              select = select[path[i]] = {}
            }
            if (payload) {
              if (typeof select === 'object' && typeof payload === 'object') {
                merge(select, payload)
              } else {
                select = select[path[i]] = payload
              }
            }
          } else {
            select = select[path[i]] = payload || {}
          }
        }
        if (params) {
          var p = params.split('&')
          for (var i in p) {
            var ss = p[i].split('=')
            opts[ss[0]] = ss[1]
          }
        }
        if (select) {
          if (opts.limit || opts.sort) {
            var keys = Object.keys(select)
            if (opts.sort) {
              keys.sort((a, b) => {
                a = select[a]
                b = select[b]
                a = a ? a[opts.sort] || 0 : 0
                b = b ? b[opts.sort] || 0 : 0
                return a > b ? -1 : b > a ? 1 : 0
              })
            }
            var ret = {}
            for (let i = 0; i < (opts.limit || keys.length); i++) {
              ret[keys[i]] = select[keys[i]]
            }
            res.end(JSON.stringify(ret))
          } else {
            res.end(JSON.stringify(select))
          }
        } else {
          res.end('')
        }
      } catch (err) {
        console.log('error', err)
        res.end(err.message)
      }
    }
  }).listen(port || 80)
}
