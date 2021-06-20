SET ROLE tracking;

CREATE TABLE events (
  account_id uuid NOT NULL,
  application_id text NOT NULL,
  client_id text NOT NULL,
  title text NOT NULL,
  properties jsonb NOT NULL DEFAULT '{}',
  session_started_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (account_id, created_at),

  FOREIGN KEY (account_id, application_id, client_id, session_started_at)
    REFERENCES sessions (account_id, application_id, client_id, started_at),

  CONSTRAINT events_session_started_at_check
    CHECK (session_started_at <= created_at)
);

GRANT SELECT, INSERT, DELETE ON events TO "tracking-worker";
