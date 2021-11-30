export const GenericError = {
  $id: 'generic_error',
  description: 'Generic error response',
  properties: {
    error: {
      description: 'Error title',
      example: 'Bad Request',
      type: 'string',
    },
    message: {
      description: 'Error description',
      example: 'Event name is wrong',
      type: 'string',
    },
  },
  required: ['error', 'message'],
  title: 'Generic Error',
  type: 'object',
}
