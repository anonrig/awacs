export const GenericError = {
  $id: 'generic_error',
  title: 'Generic Error',
  description: 'Generic error response',
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
