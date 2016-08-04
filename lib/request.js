'use strict'
const url = require('url')

module.exports = function request (state, req) {
  const path = url.parse(decodeURI(req.url)).path.split('/')
  path.shift()
  const parsed = parse(path)
  var target = state
  if (path.length > 0) {
    target = state.get(path, {})
  }
  if ('val' in parsed) {
    target.set(parsed.val)
  }
  var val = filter(target.serialize(), parsed.opts)
  if (val === 'null') { val = '' }
  return val
}

function filter (obj, opts) {
  if (opts.limit || opts.sort) {
    let keys = Object.keys(obj)
    if (opts.sort) {
      keys.sort((a, b) => {
        a = obj[a]
        b = obj[b]
        a = a ? a[opts.sort] || 0 : 0
        b = b ? b[opts.sort] || 0 : 0
        return a > b ? -1 : b > a ? 1 : 0
      })
    }
    let ret = {}
    for (let i = 0; i < (opts.limit || keys.length); i++) {
      ret[keys[i]] = obj[keys[i]]
    }
    return JSON.stringify(ret)
  } else {
    return JSON.stringify(obj)
  }
}

function parse (path) {
  const parsed = { opts: {} }
  const len = path.length - 1
  var end = path[len]
  var query = end.split('?')
  end = path[len] = query[0]
  query = query[1]
  var val = end.split('=')
  end = path[len] = val[0]
  val = val[1]
  if (val) {
    try {
      val = JSON.parse(val)
    } catch (err) {
      console.log('no json')
    }
    parsed.val = val
  }
  if (query) {
    const pairs = query.split('&')
    for (let i in pairs) {
      let pair = pairs[i].split('=')
      parsed.opts[pair[0]] = pair[1]
    }
  }
  return parsed
}
