# Configuration

Let's discover **Awacs** configurations.

## Environment Variables

| Name | Description | Default Value |
|---|---|---|
| NODE_ENV | Should always be `production` | development |

### API Specific

| Name | Description | Default Value |
|---|---|---|
| PORT | Public API port | 3001 |
| GRPC_PORT | Private API port | 4002 |

### PostgreSQL

| Name | Description | Default Value |
|---|---|---|
| PGHOST | PostgreSQL hostname | 0.0.0.0 |
| PGDATABASE | PostgreSQL database name | tracking |
| PGUSER | PostgreSQL user | postgres |
| PGPASSWORD | PostgreSQL user's password | null |
| PGPORT | PostgreSQL port | 5432 |
