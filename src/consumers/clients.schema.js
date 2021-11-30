export const findAll = {
  properties: {
    account_id: { format: 'uuid', type: 'string' },
    application_id: { type: 'string' },
    cursor: {
      properties: {
        created_at: { type: 'string' },
      },
      required: ['created_at'],
      type: 'object',
    },
    limit: { type: 'number' },
  },
  required: ['account_id'],
  type: 'object',
}

export const count = {
  properties: {
    account_id: { format: 'uuid', type: 'string' },
    application_id: { type: 'string' },
  },
  required: ['account_id'],
  type: 'object',
}

export const findOne = {
  properties: {
    account_id: { format: 'uuid', type: 'string' },
    application_id: { type: 'string' },
    client_id: { format: 'uuid', type: 'string' },
  },
  required: ['account_id', 'application_id', 'client_id'],
  type: 'object',
}
