export function up(knex) {
  return knex.schema.raw(`
    CREATE TABLE applications (
      account_id uuid NOT NULL,
      application_id text NOT NULL,
      title text NOT NULL,
      authorization_key bytea NOT NULL,
      
      application_key bytea NOT NULL,
      server_key bytea NOT NULL,
      
      session_timeout int NOT NULL DEFAULT 30, -- 30 minutes
      is_active bool NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT NOW(),
      updated_at timestamptz NOT NULL DEFAULT NOW(),
    
      PRIMARY KEY (account_id, application_id),
      
      CHECK (session_timeout >= 30)
    );
  `)
}

export function down(knex) {
  return knex.schema.dropTableIfExists('applications')
}
