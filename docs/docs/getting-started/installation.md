---
sidebar_position: 1
---

# Installation

Awacs' only dependency is PostgreSQL. Even though our underlying technology enables us to support MySQL, MariaDB, Oracle and MSSQL, currently PostgreSQL is the only supported database system. If you or your client needs others, please open a ticket from our Github.

## Docker

We recommend using Docker to run Awacs. For more configuration and flexibility dive into [configuration](/docs/getting-started/configuration).

```shell
$ docker pull socketkit/awacs:latest
$ docker run --rm -it socketkit/awacs
```

## Docker Compose

Generate a new Docusaurus site using the **classic template**:

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

## Kubernetes

### Helm

Awacs has an official Helm chart. Please refer to the [Helm documentation](/docs/guides/deployment/helm) for more information.
