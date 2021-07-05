import { uuid } from './validate.js'

export default function (ajv) {
  ajv.addFormat('uuid', {
    type: 'string',
    errors: true,
    validate: (data) => uuid(data),
  })
}
