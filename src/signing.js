import crypto, { randomUUID } from 'crypto'

export async function validate(body, application_key, signature) {
  if (!Buffer.isBuffer(application_key)) {
    throw new Error('Server key is not a buffer')
  }

  if (typeof body !== 'string') {
    throw new Error(`Sign body is not a string`)
  }

  const expected = await sign(body, application_key)

  return expected === signature
}

export async function sign(body, application_key) {
  if (!Buffer.isBuffer(application_key)) {
    throw new Error('Application key is not a buffer')
  }

  if (typeof body !== 'string') {
    throw new Error(`Sign body is not a string`)
  }

  return crypto.createHmac('sha512', application_key.toString()).update(body).digest('base64')
}

export async function generateSigningKeys() {
  return {
    application_key: Buffer.from(btoa(randomUUID())),
  }
}
