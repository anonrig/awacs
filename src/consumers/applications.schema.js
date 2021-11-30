export const findAll = {
  properties: {
    account_id: { format: 'uuid', type: 'string' },
  },
  required: ['account_id'],
  type: 'object',
}

export const count = {
  properties: {
    account_id: { format: 'uuid', type: 'string' },
  },
  required: ['account_id'],
  type: 'object',
}

export const findOne = {
  properties: {
    account_id: { format: 'uuid', type: 'string' },
    application_id: { minLength: 3, type: 'string' },
  },
  required: ['account_id', 'application_id'],
  type: 'object',
}

export const create = {
  properties: {
    account_id: { format: 'uuid', type: 'string' },
    application_id: { minLength: 3, type: 'string' },
    session_timeout: { minimum: 30, type: 'number' },
    title: { minLength: 3, type: 'string' },
  },
  required: ['account_id', 'application_id', 'title', 'session_timeout'],
  type: 'object',
}

export const update = {
  properties: {
    account_id: { format: 'uuid', type: 'string' },
    application_id: { minLength: 3, type: 'string' },
    session_timeout: { minimum: 30, type: 'number' },
    title: { minLength: 3, type: 'string' },
  },
  required: ['account_id', 'application_id', 'title', 'session_timeout'],
  type: 'object',
}

export const destroy = {
  properties: {
    account_id: { format: 'uuid', type: 'string' },
    application_id: { minLength: 3, type: 'string' },
  },
  required: ['account_id', 'application_id'],
  type: 'object',
}
