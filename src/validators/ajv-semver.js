import semver from 'semver'

export default function (ajv) {
  ajv.addFormat('semver', {
    type: 'string',
    errors: true,
    // failure to add semver.coerce doesn't transform 1.0 to 1.0.0
    validate: (data) => semver.valid(semver.coerce(data)),
  })
}
