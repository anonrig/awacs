export const uuid_regex =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i

export const not_base64_regex = /[^A-Z0-9+\/=]/i

export function uuid(id) {
  return typeof id === 'string' && uuid_regex.test(id)
}

export function base64(text) {
  if (typeof text !== 'string') return false
  else if (text.length % 4 !== 0 || not_base64_regex.test(text)) return false

  const padding = text.indexOf('=')

  return (
    padding === -1 ||
    padding == text.length - 1 ||
    (padding === text.length - 2 && text.charAt(text.length - 1) === '=')
  )
}
