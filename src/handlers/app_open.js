import semver from 'semver'

import * as Clients from '../pg/client.js'
import * as Events from '../pg/event.js'
import pg from '../pg/index.js'
import * as Sessions from '../pg/session.js'

export async function handleAppOpen(
  _,
  { client_id, application_id, account_id, country_id },
  fields,
) {
  return pg.transaction(async (trx) => {
    let client = await Clients.findOne({
      account_id,
      application_id,
      client_id,
    })
      .forUpdate()
      .transacting(trx)

    if (!client) {
      // Create client
      client = await Clients.create(
        {
          account_id,
          application_build_number: fields.application_build_number,
          application_id,
          application_version: fields.application_version,
          client_id,
          country_id,
          device_height: fields.screen_size[1],
          device_locale: fields.locale,
          device_manufacturer: fields.manufacturer,
          device_platform: fields.platform,
          device_type: fields.type,
          device_width: fields.screen_size[0],
          library_version: fields.library_version,
          os_name: fields.os_name,
          os_version: fields.os_version,
        },
        trx,
      )

      const session = await Sessions.findOrCreate(
        { account_id, application_id, client_id, timestamp: fields.timestamp },
        trx,
      )

      // Log initial app open event
      await Events.create(
        {
          account_id,
          application_id,
          client_id,
          created_at: fields.timestamp,
          properties: {},
          session_started_at: session.started_at,
          title: 'first_app_open',
        },
        trx,
      )

      return {}
    }

    const session = await Sessions.findOrCreate(
      { account_id, application_id, client_id, timestamp: fields.timestamp },
      trx,
    )

    // Create app_open event
    await Events.create(
      {
        account_id,
        application_id,
        client_id,
        created_at: fields.timestamp,
        properties: {},
        session_started_at: session.started_at,
        title: 'app_open',
      },
      trx,
    )

    let $client_dirty = false

    // Check if country changed
    if (client.country_id !== fields.country_id) {
      $client_dirty = true
    }

    // Check if os_updated
    if (semver.compare(client.os_version, fields.os_version) > 0) {
      $client_dirty = true
      await Events.create(
        {
          account_id,
          application_id,
          client_id,
          created_at: fields.timestamp,
          properties: {
            new_version: fields.os_version,
            old_version: client.os_version,
          },
          session_started_at: session.started_at,
          title: 'os_updated',
        },
        trx,
      )
    }

    // Check if app_updated
    if (semver.compare(client.application_version, fields.application_version) > 0) {
      $client_dirty = true
      await Events.create(
        {
          account_id,
          application_id,
          client_id,
          created_at: fields.timestamp,
          properties: {
            new_version: fields.application_version,
            old_version: client.application_version,
          },
          session_started_at: session.started_at,
          title: 'app_updated',
        },
        trx,
      )
    }

    // Update client if needed
    if ($client_dirty) {
      await Clients.update(
        {
          account_id,
          application_id,
          application_version: fields.application_version,
          client_id,
          country_id,
          os_version: fields.os_version,
        },
        trx,
      )
    }

    return {}
  })
}
