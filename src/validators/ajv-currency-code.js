import currencies from 'currency-codes'

export default function (ajv) {
  ajv.addFormat('currency_code', {
    type: 'string',
    errors: true,
    validate: (data) => currencies.code(data) !== undefined,
  })
}
