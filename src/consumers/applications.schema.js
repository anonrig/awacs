export const findAll = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
  },
  required: ['account_id'],
}

export const count = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
  },
  required: ['account_id'],
}

export const findOne = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    application_id: { type: 'string', minLength: 3 },
  },
  required: ['account_id', 'application_id'],
}

export const create = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    application_id: { type: 'string', minLength: 3 },
    title: { type: 'string', minLength: 3 },
    session_timeout: { type: 'number', minimum: 30 },
  },
  required: ['account_id', 'application_id', 'title', 'session_timeout'],
}

export const update = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    application_id: { type: 'string', minLength: 3 },
    title: { type: 'string', minLength: 3 },
    session_timeout: { type: 'number', minimum: 30 },
  },
  required: ['account_id', 'application_id', 'title', 'session_timeout'],
}

export const destroy = {
  type: 'object',
  properties: {
    account_id: { type: 'string', format: 'uuid' },
    application_id: { type: 'string', minLength: 3 },
  },
  required: ['account_id', 'application_id'],
}
