# Docker

We release our Docker images on [hub.docker.com](https://hub.docker.com/r/socketkit/awacs).

## Standalone

```shell
$ docker pull socketkit/awacs:latest
$ docker run --rm -it socketkit/awacs
```

## Docker Compose

```yaml title="docker-compose.yaml"
version: '3.9'

services:
  awacs:
    image: socketkit/awacs
    restart: always
    environment:
      NODE_ENV: 'production'
      PGDATABASE: 'awacs'
      PGUSER: 'awacs-worker'
      PGPASSWORD: 'MYSUPERSECRETKEY'
      PGHOST: 'postgresql'
    ports:
      - "3002:3002"
      - "4001:4001"
    depends_on:
      - postgresql

  postgresql:
    image: postgres
    restart: always
    environment:
      POSTGRES_DB: awacs
      POSTGRES_USER: awacs-worker
      POSTGRES_PASSWORD: MYSUPERSECRETKEY
    volumes:
      - ./postgresql/data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
```
