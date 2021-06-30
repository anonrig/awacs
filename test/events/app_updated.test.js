import test from 'ava'
import { ajv } from '../helper.js'
import { app_updated } from '../../src/schemas/events.js'

test('should check for new_version', async (t) => {
  const validate = ajv.compile(app_updated)
  const valid = validate({
    name: 'app_updated',
    timestamp: Date.now(),
    old_version: '1.0.0',
  })
  t.is(valid, false)
  t.is(validate.errors[0].keyword, 'required')
  t.is(validate.errors[0].message, `must have required property 'new_version'`)
})

test('should check for old_version', async (t) => {
  const validate = ajv.compile(app_updated)
  const valid = validate({
    name: 'app_updated',
    timestamp: Date.now(),
    new_version: '1.0.0',
  })
  t.is(valid, false)
  t.is(validate.errors[0].keyword, 'required')
  t.is(validate.errors[0].message, `must have required property 'old_version'`)
})

test('should validate new_version', async (t) => {
  const validate = ajv.compile(app_updated)
  const valid = validate({
    name: 'app_updated',
    timestamp: Date.now(),
    old_version: '1.0.0',
    new_version: 'HELLO',
  })
  t.is(valid, false)
  t.is(validate.errors[0].keyword, 'format')
  t.is(validate.errors[0].message, `must match format "semver"`)
})

test('should validate old_version', async (t) => {
  const validate = ajv.compile(app_updated)
  const valid = validate({
    name: 'app_updated',
    timestamp: Date.now(),
    old_version: 'HELLO',
    new_version: '1.0.0',
  })

  t.is(validate.errors[0].keyword, 'format')
  t.is(validate.errors[0].message, `must match format "semver"`)
})
