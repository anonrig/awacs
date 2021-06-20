import { validate } from 'uuid'

export default function (ajv) {
  ajv.addFormat('uuid', {
    type: 'string',
    errors: true,
    validate: (data) => validate(data),
  })
}
