import crypto from 'crypto'
import dayjs from 'dayjs'
import axios from 'axios'

import logger from './src/logger.js'
import { sign } from './src/signing.js'
import { app_open } from './test/seeds.js'

const authorization_key = process.env.AUTHORIZATION_KEY
const signing_key = process.env.SIGNING_KEY
const baseURL = process.env.BASE_URL ?? 'https://tracking.socketkit.com/v1'

const client = axios.create({
  baseURL,
})

async function generate_events() {
  const client_id = crypto.randomUUID()
  const initial_date = dayjs().subtract(Math.random() * (120 - 1) + 1, 'days')
  const events = [
    { name: 'app_open', timestamp: initial_date.unix() * 1000, ...app_open },
  ]

  return { events, client_id }
}

async function send(payload, { client_id, authorization_key, signing_key }) {
  const stringified = JSON.stringify(payload)
  const signed = await sign(stringified, Buffer.from(signing_key, 'base64'))
  await client.post('/events', payload, {
    headers: {
      'x-socketkit-key': authorization_key,
      'x-client-id': client_id,
      'x-signature': signed,
    },
  })
}

for (let i = 0; i < 10000; i++) {
  const { events, client_id } = await generate_events()
  await send(events, { client_id, authorization_key, signing_key })
  logger.success(`Sent event for the ${i} time`)
}
