import locales from 'locale-code'

export default function (ajv) {
  ajv.addFormat('locale_code', {
    type: 'string',
    errors: true,
    validate: (data) => locales.validate(data),
  })
}
