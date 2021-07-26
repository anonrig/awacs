export const findAll = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    limit: { type: 'number' },
    application_id: { type: 'string' },
    client_id: { type: 'string', format: 'uuid' },
    cursor: {
      type: 'object',
      properties: {
        created_at: { type: 'string' },
      },
      required: ['created_at'],
    },
  },
  required: ['account_id'],
}
