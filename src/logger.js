import Consola from 'consola'

export default Consola.withDefaults().create({ level: process.env.CI ? 0 : 4 })
