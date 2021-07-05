import { randomUUID } from 'crypto'

export const Authorization = {
  $id: 'authorization_header',
  title: 'Authorization',
  description: 'Authorization using Socketkit key',
  type: 'object',
  properties: {
    'x-socketkit-key': {
      type: 'string',
      name: 'authorization_key',
      description: 'Access token',
      example: Buffer.from('my-authorization-key').toString('base64'),
      format: 'base64',
    },
    'x-client-id': {
      type: 'string',
      name: 'client_id',
      description: 'Client identifier',
      example: randomUUID(),
    },
    'x-signature': {
      type: 'string',
      name: 'signed_events',
      description: 'Signed payload of the request body using EDDSA (ed25519)',
      example: Buffer.from(
        JSON.stringify([{ title: 'Signed payload' }]),
      ).toString('base64'),
      format: 'base64',
    },
  },
  required: ['x-socketkit-key', 'x-client-id', 'x-signature'],
}
