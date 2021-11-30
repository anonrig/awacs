import { generateKeyPairSync } from 'crypto'

import quibble from 'quibble'

export async function mockPgTransaction(returns = null) {
  await quibble.esm('../src/pg.js', null, {
    transaction: async (cb) => {
      await cb({})
      return returns
    },
  })
}

export async function mockApplicationGetByAuthorization(returns = null) {
  await quibble.esm('../src/pg/application.js', {
    getByAuthorization: () => Promise.resolve(returns),
  })
}

export async function mockSigning(returns = true) {
  await quibble.esm('../src/signing.js', {
    generateSigningKeys: () => {
      const { publicKey, privateKey } = generateKeyPairSync('ed25519')
      return {
        application_key: privateKey.export({ format: 'der', type: 'pkcs8' }),
        server_key: publicKey.export({ format: 'der', type: 'spki' }),
      }
    },
    validate: () => Promise.resolve(returns),
  })
}

export async function mockMiddlewares(access = null, signature = null) {
  await quibble.esm('../src/middlewares.js', {
    validateAccess: () => Promise.resolve(access),
    validateSignature: () => Promise.resolve(signature),
  })
}

export async function mockSessionFindOrCreate(returns = null, deepEqual, t) {
  await quibble.esm('../src/pg/session.js', {
    findOrCreate: (props) => {
      t.deepEqual(props, deepEqual)
      return Promise.resolve(returns)
    },
  })
}

export async function mockEventCreate(returns = null, deepEqual, t) {
  await quibble.esm('../src/pg/event.js', {
    create: (props) => {
      t.deepEqual(props, deepEqual)
      return Promise.resolve(returns)
    },
  })
}

export async function mockClientFindOne(returns = null, deepEqual, t) {
  await quibble.esm('../src/pg/client.js', {
    findOne: (props) => {
      t.deepEqual(props, deepEqual)
      return Promise.resolve(returns)
    },
  })
}

export async function mockCustomEventHandler(returns = null) {
  await quibble.esm('../src/handlers/custom.js', {
    handleCustom: () => Promise.resolve(returns),
  })
}
