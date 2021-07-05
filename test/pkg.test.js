import test from 'ava'
import pkg from '../src/pkg.js'

test('pkg should return valid package information', (t) => {
  t.truthy(pkg.name)
  t.truthy(pkg.version)
})
