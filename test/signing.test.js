import test from 'ava'
import { v4 } from 'uuid'
import * as Signing from '../src/signing.js'

test('should sign', async (t) => {
  const { server_key, application_key } = await Signing.generateSigningKeys()
  const signed = await Signing.sign('hello-world', application_key)
  t.truthy(signed)
})

test('should validate server_key on sign', async (t) => {
  try {
    await Signing.sign('hello-world', 'not-buffer')
    throw new Error('Should be here')
  } catch (error) {
    t.is(error.message, 'Application key is not a buffer')
  }
})

test('should validate body on sign', async (t) => {
  try {
    await Signing.sign(null, Buffer.from('hello'))
    throw new Error('Should be here')
  } catch (error) {
    t.is(error.message, `Sign body is not a string`)
  }
})

test('should validate', async (t) => {
  const { server_key, application_key } = await Signing.generateSigningKeys()
  const plain = v4()
  const signed = await Signing.sign(plain, application_key)
  const valid = await Signing.validate(plain, server_key, signed)
  t.is(valid, true)
})

test('should validate application_key on validate', async (t) => {
  try {
    await Signing.validate('hello-world', 'not-buffer', 'signed-payload')
    throw new Error('Should be here')
  } catch (error) {
    t.is(error.message, 'Server key is not a buffer')
  }
})

test('should validate body on validate', async (t) => {
  try {
    await Signing.validate(null, Buffer.from('hello'), 'signed-payload')
    throw new Error('Should be here')
  } catch (error) {
    t.is(error.message, `Sign body is not a string`)
  }
})
