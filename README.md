# minimal-key-store
simple object storage and retrieval, uses state

[![Build Status](https://travis-ci.org/vigour-io/minimal-key-store.svg?branch=master)](https://travis-ci.org/vigour-io/minimal-key-store)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/minimal-key-store.svg)](https://badge.fury.io/js/minimal-key-store)
[![Coverage Status](https://coveralls.io/repos/github/vigour-io/minimal-key-store/badge.svg?branch=master)](https://coveralls.io/github/vigour-io/minimal-key-store?branch=master)

```javascript
  const keystore = require('minimal-key-store')
  const s = require('vigour-state/s')
  // default port is 3030
  // default state creates an empty one
  const server = keystore(3030, s({ val 'lulz' })
```
