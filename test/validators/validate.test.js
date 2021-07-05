import test from 'ava'
import { randomUUID } from 'crypto'
import { uuid } from '../../src/validators/validate.js'

test('should validate uuid', (t) => {
  t.truthy(uuid(randomUUID()))
  t.falsy(uuid('hello'))
  t.falsy(uuid([]))
  t.falsy(uuid({ hello: 'world' }))
})
