import events from './events/index.js'

export default (f, _opts, done) => {
  f.register(events, { prefix: 'events' })
  done()
}
