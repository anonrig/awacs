export const findAll = {
  properties: {
    account_id: { format: 'uuid', type: 'string' },
    application_id: { type: 'string' },
    client_id: { format: 'uuid', type: 'string' },
    cursor: {
      properties: {
        expired_at: { type: 'string' },
      },
      required: ['expired_at'],
      type: 'object',
    },
    end_date: { format: 'date', type: 'string' },
    limit: { type: 'number' },
    start_date: { format: 'date', type: 'string' },
  },
  required: ['account_id'],
  type: 'object',
}

export const count = {
  properties: {
    account_id: { format: 'uuid', type: 'string' },
    application_id: { type: 'string' },
    client_id: { format: 'uuid', type: 'string' },
    end_date: { format: 'date', type: 'string' },
    start_date: { format: 'date', type: 'string' },
  },
  required: ['account_id'],
  type: 'object',
}
