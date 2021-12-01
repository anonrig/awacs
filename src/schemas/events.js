import { randomUUID } from 'crypto'

export const app_open = {
  $id: 'app_open_event',
  description: 'App open event. Includes all necessary information regarding the device and user',
  properties: {
    application_build_number: { example: 14, type: 'number' },
    application_version: {
      example: '1.0.0',
      format: 'semver',
      type: 'string',
    },
    carrier: { example: 'T-Mobile', type: 'string' },
    library_version: {
      example: '0.4.1',
      format: 'semver',
      type: 'string',
    },
    locale: { example: 'en-US', format: 'locale_code', type: 'string' },
    manufacturer: { example: 'Apple', type: 'string' },
    name: {
      description: 'Name of the event',
      enum: ['app_open'],
      type: 'string',
    },
    os_name: {
      description: 'Changes according to platform and device type',
      example: 'iOS',
      type: 'string',
    },
    os_version: {
      example: '14.4.1',
      format: 'semver',
      type: 'string',
    },
    platform: {
      enum: ['ios', 'android'],
      example: 'ios',
      type: 'string',
    },
    screen_size: {
      description: 'Screen size expected format is [height, width]',
      example: [2778, 1284],
      items: {
        type: 'string',
      },
      maxItems: 2,
      minItems: 2,
      type: 'array',
    },
    timestamp: {
      description: 'ISO timestamp of the event',
      example: `${new Date().toISOString()}`,
      type: 'string',
    },
    type: { example: 'iPad13,1', type: 'string' },
    watch_model: {
      description: 'Only used by watch applications',
      example: 'Apple Watch 38mm',
      type: 'string',
    },
  },
  required: [
    'name',
    'timestamp',
    'locale',
    'platform',
    'manufacturer',
    'type',
    'os_name',
    'os_version',
    'screen_size',
    'application_build_number',
    'application_version',
    'library_version',
  ],
  title: 'app_open',
  type: 'object',
}

export const app_updated = {
  $id: 'app_updated_event',
  description: 'App Updated Event',
  properties: {
    name: {
      description: 'Name of the event',
      enum: ['app_updated'],
      type: 'string',
    },
    new_version: { example: '1.1.0', format: 'semver', type: 'string' },
    old_version: { example: '1.0.0', format: 'semver', type: 'string' },
    timestamp: {
      description: 'ISO timestamp of the event',
      example: `${new Date().toISOString()}`,
      type: 'string',
    },
  },
  required: ['name', 'timestamp', 'new_version', 'old_version'],
  title: 'app_updated',
  type: 'object',
}

export const os_updated = {
  $id: 'os_updated_event',
  description: 'OS Updated Event',
  properties: {
    name: {
      description: 'Name of the event',
      enum: ['os_updated'],
      type: 'string',
    },
    new_version: { example: '14.4.1', format: 'semver', type: 'string' },
    old_version: { example: '14.4.0', format: 'semver', type: 'string' },
    timestamp: {
      description: 'ISO timestamp of the event',
      example: `${new Date().toISOString()}`,
      type: 'string',
    },
  },
  required: ['name', 'timestamp', 'new_version', 'old_version'],
  title: 'os_updated',
  type: 'object',
}

export const in_app_purchase = {
  $id: 'in_app_purchase_event',
  description: 'In App Purchase Event',
  properties: {
    name: {
      description: 'Name of the event',
      enum: ['in_app_purchase'],
      type: 'string',
    },
    product_currency: {
      example: 'USD',
      format: 'currency_code',
      type: 'string',
    },
    product_name: { example: 'Weekly Package', type: 'string' },
    product_price: { example: 4.99, type: 'number' },
    product_quantity: { example: 1, type: 'number' },
    timestamp: {
      description: 'ISO timestamp of the event',
      example: `${new Date().toISOString()}`,
      type: 'string',
    },
  },
  required: [
    'name',
    'timestamp',
    'product_name',
    'product_quantity',
    'product_price',
    'product_currency',
  ],
  title: 'in_app_purchase',
  type: 'object',
}

export const set_client = {
  $id: 'set_client_event',
  description: 'Set Client Properties Event',
  properties: {
    additional_properties: {
      additionalProperties: true,
      example: {
        firstName: 'Yagiz',
        lastName: 'Nizipli',
      },
      minProperties: 1,
      properties: {},
      type: 'object',
    },
    distinct_id: { example: randomUUID(), type: 'string' },
    is_opt_out: { example: false, type: 'boolean' },
    name: {
      description: 'Name of the event',
      enum: ['set_client'],
      type: 'string',
    },
    push_token: { example: randomUUID(), type: 'string' },
    referer: { example: 'Google Ads', type: 'string' },
    timestamp: {
      description: 'ISO timestamp of the event',
      example: `${new Date().toISOString()}`,
      type: 'string',
    },
  },
  required: ['name', 'timestamp'],
  title: 'set_client',
  type: 'object',
}

export const custom = {
  $id: 'custom_event',
  additionalProperties: true,
  properties: {
    name: {
      description: 'Name of the event',
      enum: ['custom'],
      type: 'string',
    },
    timestamp: {
      description: 'ISO timestamp of the event',
      example: `${new Date().toISOString()}`,
      type: 'string',
    },
  },
  required: ['name', 'timestamp'],
  title: 'custom',
  type: 'object',
}
