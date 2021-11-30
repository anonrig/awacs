import Crypto from 'crypto'

export async function validate(body, server_key, signature) {
  if (!Buffer.isBuffer(server_key)) {
    throw new Error('Server key is not a buffer')
  }

  if (typeof body !== 'string') {
    throw new Error(`Sign body is not a string`)
  }

  const prefix = '-----BEGIN PUBLIC KEY-----\n'
  const postfix = '-----END PUBLIC KEY-----'
  return Crypto.verify(
    null,
    Buffer.from(body),
    prefix +
      server_key
        .toString('base64')
        .match(/.{0,64}/g)
        .join('\n') +
      postfix,
    Buffer.isBuffer(signature) ? signature : Buffer.from(signature, 'base64'),
  )
}

export async function sign(body, application_key) {
  if (!Buffer.isBuffer(application_key)) {
    throw new Error('Application key is not a buffer')
  }

  if (typeof body !== 'string') {
    throw new Error(`Sign body is not a string`)
  }

  const encoded = application_key.toString('base64')
  const der = `-----BEGIN PRIVATE KEY-----\n${encoded}\n-----END PRIVATE KEY-----`
  return Crypto.sign(null, Buffer.from(body), der).toString('base64')
}

export async function generateSigningKeys() {
  const { publicKey, privateKey } = Crypto.generateKeyPairSync('ed25519')
  return {
    application_key: privateKey.export({ format: 'der', type: 'pkcs8' }),
    server_key: publicKey.export({ format: 'der', type: 'spki' }),
  }
}
