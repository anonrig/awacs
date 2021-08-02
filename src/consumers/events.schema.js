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
    start_date: { type: 'string', format: 'date' },
    end_date: { type: 'string', format: 'date' },
  },
  required: ['account_id'],
}

export const count = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    application_id: { type: 'string' },
    client_id: { type: 'string', format: 'uuid' },
    start_date: { type: 'string', format: 'date' },
    end_date: { type: 'string', format: 'date' },
  },
  required: ['account_id'],
}
