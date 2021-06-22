import semver from 'semver'
import * as Clients from '../pg/client.js'
import * as Events from '../pg/event.js'
import * as Sessions from '../pg/session.js'
import pg from '../pg/index.js'

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
          application_id,
          client_id,
          country_id,
          device_locale: fields.locale,
          device_manufacturer: fields.manufacturer,
          device_platform: fields.platform,
          device_type: fields.type,
          device_width: fields.screen_size[0],
          device_height: fields.screen_size[1],
          os_name: fields.os_name,
          os_version: fields.os_version,
          application_build_number: fields.application_build_number,
          application_version: fields.application_version,
          library_version: fields.library_version,
        },
        trx,
      )

      const session = await Sessions.findOrCreate(
        { account_id, client_id, application_id, timestamp: fields.timestamp },
        trx,
      )

      // Log initial app open event
      await Events.create(
        {
          account_id,
          application_id,
          client_id,
          title: 'first_app_open',
          properties: {},
          created_at: fields.timestamp,
          session_started_at: session.started_at,
        },
        trx,
      )

      return {}
    }

    const session = await Sessions.findOrCreate(
      { account_id, client_id, application_id, timestamp: fields.timestamp },
      trx,
    )

    // Create app_open event
    await Events.create(
      {
        account_id,
        application_id,
        client_id,
        title: 'app_open',
        properties: {},
        created_at: fields.timestamp,
        session_started_at: session.started_at,
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
          title: 'os_updated',
          properties: {
            old_version: client.os_version,
            new_version: fields.os_version,
          },
          created_at: fields.timestamp,
          session_started_at: session.started_at,
        },
        trx,
      )
    }

    // Check if app_updated
    if (
      semver.compare(client.application_version, fields.application_version) > 0
    ) {
      $client_dirty = true
      await Events.create(
        {
          account_id,
          application_id,
          client_id,
          title: 'app_updated',
          properties: {
            old_version: client.application_version,
            new_version: fields.application_version,
          },
          created_at: fields.timestamp,
          session_started_at: session.started_at,
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
          client_id,
          country_id,
          application_version: fields.application_version,
          os_version: fields.os_version,
        },
        trx,
      )
    }

    return {}
  })
}
