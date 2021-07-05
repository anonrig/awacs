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
      example: randomUUID(),
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
      example:
        'L+ObHL8qa75PIarUPKS65RHPLRSqeTFg30aC/V0r8k+G3hJxyXJfcAiFb3XEQRVN31x2tkhyMbYjcguEYpiLDQ==',
      format: 'base64',
    },
  },
  required: ['x-socketkit-key', 'x-client-id', 'x-signature'],
}
