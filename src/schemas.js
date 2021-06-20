import { v4 } from 'uuid'

export const Authorization = {
  $id: 'Authorization',
  title: 'Authorization',
  description: 'Authorization using Socketkit key',
  tags: ['Security'],
  type: 'object',
  properties: {
    'x-socketkit-key': {
      type: 'string',
      description: 'Access token',
      example: v4(),
    },
    'x-client-id': {
      type: 'string',
      description: 'Client identifier',
      example: v4(),
    },
    'x-signature': {
      type: 'string',
      description: 'Signed payload of the request body using EDDSA (ed25519)',
      example:
        'L+ObHL8qa75PIarUPKS65RHPLRSqeTFg30aC/V0r8k+G3hJxyXJfcAiFb3XEQRVN31x2tkhyMbYjcguEYpiLDQ==',
    },
  },
  required: ['x-socketkit-key', 'x-client-id', 'x-signature'],
}

export const BadRequestError = {
  $id: 'BadRequestError',
  title: 'Bad Request',
  description: 'Generic bad request response',
  type: 'object',
  properties: {
    error: {
      type: 'string',
      description: 'Error title',
      example: 'Bad Request',
    },
    message: {
      type: 'string',
      description: 'Error description',
      example: 'Event name is wrong',
    },
  },
  required: ['error', 'message'],
}

export const NotFoundError = {
  $id: 'NotFoundError',
  title: 'Not Found',
  description: 'Generic not found response',
  type: 'object',
  properties: {
    error: {
      type: 'string',
      description: 'Error title',
      example: 'Not Found',
    },
    message: {
      type: 'string',
      description: 'Error description',
      example: 'Resource not found',
    },
  },
  required: ['error', 'message'],
}

export const UnauthorizedError = {
  $id: 'UnauthorizedError',
  title: 'Unauthorized',
  description: 'Generic unauthorized response',
  type: 'object',
  properties: {
    error: {
      type: 'string',
      description: 'Error title',
      example: 'Unauthorized',
    },
    message: {
      type: 'string',
      description: 'Error description',
      example: 'Unauthorized request',
    },
  },
  required: ['error', 'message'],
}

export const ExpectationFailedError = {
  $id: 'UnauthorizedError',
  title: 'Unauthorized',
  description: 'Generic expectation failed response',
  type: 'object',
  properties: {
    error: {
      type: 'string',
      description: 'Error title',
      example: 'Expectation failed',
    },
    message: {
      type: 'string',
      description: 'Error description',
      example: 'Expectation failed on request',
    },
  },
  required: ['error', 'message'],
}
