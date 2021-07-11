import test from 'ava'
import { randomUUID } from 'crypto'
import { base64 } from '@socketkit/ajv-base64'
import { uuid } from '@socketkit/ajv-uuid'

test('should validate uuid', (t) => {
  t.truthy(uuid(randomUUID()))
  t.falsy(uuid('hello'))
  t.falsy(uuid([]))
  t.falsy(uuid({ hello: 'world' }))
})

test('should validate base64', (t) => {
  t.truthy(base64(Buffer.from('hello-world').toString('base64')))
  t.falsy(base64('hello-world'))
})
