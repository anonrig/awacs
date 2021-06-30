export function up(knex) {
  return knex.schema.raw(`
    CREATE TYPE device_platforms AS ENUM ('android', 'ios');

    CREATE TABLE clients (
      account_id uuid NOT NULL,
      application_id text NOT NULL,
      client_id text NOT NULL,
      distinct_id text, -- User generated identifier for client

      country_id text NOT NULL, -- US
      
      device_locale text NOT NULL, -- en_US
      device_manufacturer text NOT NULL, -- Apple
      device_platform device_platforms NOT NULL, -- ios
      device_type text NOT NULL,  -- iPad13,1
      device_height int NOT NULL,
      device_width int NOT NULL,
      
      device_carrier text, -- T-Mobile
      
      os_name text NOT NULL, -- iOS
      os_version text NOT NULL, -- 14.4.1
      
      watch_model text, -- Apple Watch 44m

      application_build_number int NOT NULL, -- 1
      application_version text NOT NULL, -- 1.0.0
      library_version text NOT NULL, -- 0.1.0

      push_token text,
      is_push_token_valid boolean NOT NULL DEFAULT false,

      is_opt_out boolean NOT NULL DEFAULT false,
      additional_properties jsonb NOT NULL default '{}',

      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),

      PRIMARY KEY (account_id, application_id, client_id),
      
      FOREIGN KEY (account_id, application_id)
        REFERENCES applications,
        
      UNIQUE (account_id, application_id, distinct_id),

      CONSTRAINT client_push_token_validity
        CHECK (push_token IS NOT NULL OR NOT is_push_token_valid),
        
      CONSTRAINT opt_out_validity
        CHECK (NOT is_opt_out OR additional_properties != '{}'),
        
      CHECK (country_id ~ '\\A[a-z]{2}\\Z')
    );
`)
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('clients')
  await knex.schema.raw('DROP TYPE IF EXISTS device_platforms;')
}
