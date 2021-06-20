export function up(knex) {
  return knex.schema.raw(`
    CREATE TABLE sessions (
      account_id uuid NOT NULL,
      application_id text NOT NULL,
      client_id text NOT NULL,
      started_at timestamptz NOT NULL,
      expired_at timestamptz NOT NULL,
      active_period tstzrange NOT NULL
        GENERATED ALWAYS AS (tstzrange(started_at, expired_at)) STORED,
    
      PRIMARY KEY (account_id, application_id, client_id, started_at),
    
      FOREIGN KEY (account_id, application_id, client_id)
        REFERENCES clients,
    
      EXCLUDE USING GIST (
        account_id WITH =,
        active_period WITH &&,
        application_id WITH =,
        client_id WITH =
      )
    );
 `)
}

export function down(knex) {
  return knex.schema.dropTableIfExists('sessions')
}
