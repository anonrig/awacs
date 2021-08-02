export const findAll = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    limit: { type: 'number' },
    application_id: { type: 'string' },
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

export const count = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    application_id: { type: 'string' },
  },
  required: ['account_id'],
}

export const findOne = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    application_id: { type: 'string' },
    client_id: { type: 'string', format: 'uuid' },
  },
  required: ['account_id', 'application_id', 'client_id'],
}
