import { randomUUID } from 'crypto'

export const Authorization = {
  $id: 'authorization_header',
  description: 'Authorization using Socketkit key',
  properties: {
    'x-client-id': {
      description: 'Client identifier',
      example: randomUUID(),
      name: 'client_id',
      type: 'string',
    },
    'x-signature': {
      description: 'Signed payload of the request body using EDDSA (ed25519)',
      example: Buffer.from(JSON.stringify([{ title: 'Signed payload' }])).toString('base64'),
      format: 'base64',
      name: 'signed_events',
      type: 'string',
    },
    'x-socketkit-key': {
      description: 'Access token',
      example: Buffer.from('my-authorization-key').toString('base64'),
      format: 'base64',
      name: 'authorization_key',
      type: 'string',
    },
  },
  required: ['x-socketkit-key', 'x-client-id', 'x-signature'],
  title: 'Authorization',
  type: 'object',
}
