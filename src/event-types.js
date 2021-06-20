import { v4 } from 'uuid'

export const app_open = {
  $id: 'app_open_event',
  type: 'object',
  tags: ['event_types'],
  title: 'app_open',
  description:
    'App open event. Includes all necessary information regarding the device and user',
  properties: {
    locale: { type: 'string', format: 'locale_code', example: 'en-US' },
    manufacturer: { type: 'string', example: 'Apple' },
    platform: {
      type: 'string',
      enum: ['ios', 'android'],
      example: 'ios',
    },
    type: { type: 'string', example: 'iPad13,1' },
    carrier: { type: 'string', example: 'T-Mobile' },
    os_name: {
      type: 'string',
      example: 'iOS',
      description: 'Changes according to platform and device type',
    },
    os_version: {
      type: 'string',
      format: 'semver',
      example: '14.4.1',
    },
    screen_size: {
      type: 'array',
      items: {
        type: 'integer',
      },
      maxItems: 2,
      minItems: 2,
      example: [2778, 1284],
      description: 'Screen size expected format is [height, width]',
    },
    application_build_number: { type: 'number', min: 1, example: 14 },
    application_version: {
      type: 'string',
      format: 'semver',
      example: '1.0.0',
    },
    library_version: {
      type: 'string',
      format: 'semver',
      example: '0.4.1',
    },
    watch_model: {
      type: 'string',
      example: 'Apple Watch 38mm',
      description: 'Only used by watch applications',
    },
  },
  required: [
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
}

export const app_updated = {
  $id: 'app_updated_event',
  type: 'object',
  tags: ['event_types'],
  title: 'app_updated',
  description: 'App Updated Event',
  properties: {
    new_version: { type: 'string', format: 'semver', example: '1.1.0' },
    old_version: { type: 'string', format: 'semver', example: '1.0.0' },
  },
  required: ['new_version', 'old_version'],
}

export const os_updated = {
  $id: 'os_updated_event',
  type: 'object',
  tags: ['event_types'],
  title: 'os_updated',
  description: 'OS Updated Event',
  properties: {
    new_version: { type: 'string', format: 'semver', example: '14.4.1' },
    old_version: { type: 'string', format: 'semver', example: '14.4.0' },
  },
  required: ['new_version', 'old_version'],
}

export const in_app_purchase = {
  $id: 'in_app_purchase_event',
  type: 'object',
  tags: ['event_types'],
  title: 'in_app_purchase',
  description: 'In App Purchase Event',
  properties: {
    product_name: { type: 'string', example: 'Weekly Package' },
    product_quantity: { type: 'number', min: 1, example: 1 },
    product_price: { type: 'number', min: 0, example: 4.99 },
    product_currency: {
      type: 'string',
      format: 'currency_code',
      example: 'USD',
    },
  },
  required: [
    'product_name',
    'product_quantity',
    'product_price',
    'product_currency',
  ],
}

export const set_client = {
  $id: 'set_client_event',
  type: 'object',
  tags: ['event_types'],
  title: 'set_client',
  description: 'Set Client Properties Event',
  properties: {
    distinct_id: { type: 'string', example: v4() },
    referer: { type: 'string', example: 'Google Ads' },
    push_token: { type: 'string', example: v4() },
    is_opt_out: { type: 'boolean', example: false },
    additional_properties: {
      type: 'object',
      properties: {},
      additionalProperties: true,
      example: {
        firstName: 'Yagiz',
        lastName: 'Nizipli',
      },
      minProperties: 1,
    },
  },
}
