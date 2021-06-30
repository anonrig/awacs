import { v4 } from 'uuid'

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
      example: v4(),
    },
    'x-client-id': {
      type: 'string',
      name: 'client_id',
      description: 'Client identifier',
      example: v4(),
    },
    'x-signature': {
      type: 'string',
      name: 'signed_events',
      description: 'Signed payload of the request body using EDDSA (ed25519)',
      example:
        'L+ObHL8qa75PIarUPKS65RHPLRSqeTFg30aC/V0r8k+G3hJxyXJfcAiFb3XEQRVN31x2tkhyMbYjcguEYpiLDQ==',
    },
  },
  required: ['x-socketkit-key', 'x-client-id', 'x-signature'],
}
