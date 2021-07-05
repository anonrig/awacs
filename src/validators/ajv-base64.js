import { base64 } from './validate.js'

export default function (ajv) {
  ajv.addFormat('base64', {
    type: 'string',
    errors: true,
    validate: (data) => base64(data),
  })
}
