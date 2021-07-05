// Since importing json is only available through
// --experimental-json-modules flag, we created this file
// to prevent introduction of an experimental feature on node.js
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
export default require('../package.json')
