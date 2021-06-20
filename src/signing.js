import { verify, generateKeyPairSync } from 'crypto'

export async function validate(rawBody, bufferServerKey, signature) {
  const prefix = '-----BEGIN PRIVATE KEY-----\n'
  const postfix = '-----END PRIVATE KEY-----'

  return verify(
    null,
    Buffer.from(rawBody, 'utf-8'),
    prefix +
      bufferServerKey
        .toString('base64')
        .match(/.{0,64}/g)
        .join('\n') +
      postfix,
    Buffer.from(signature, 'base64'),
  )
}

export async function generateSigningKeys() {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519')
  return {
    server_key: publicKey.export({ format: 'der', type: 'spki' }),
    application_key: privateKey.export({ format: 'der', type: 'pkcs8' }),
  }
}
