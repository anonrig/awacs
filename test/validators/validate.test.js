import test from 'ava'
import { randomUUID } from 'crypto'
import { uuid, base64 } from '../../src/validators/validate.js'

test('should validate uuid', (t) => {
  t.truthy(uuid(randomUUID()))
  t.falsy(uuid('hello'))
  t.falsy(uuid([]))
  t.falsy(uuid({ hello: 'world' }))
})

test('should validate base64', (t) => {
  t.truthy(base64('hello-world').toString('base64'))
  t.falsy(base64('hello-world'))
})
