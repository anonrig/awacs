# High Availability

## Health check

Under `/health` check we validate the connection to the PostgreSQL instance.

## Process performance

We check for `maxEventLoopDelay`, `maxHeapUsedBytes`, `maxRssBytes` and `maxEventLoopUtilization` to automatically handle `Service Unavailable` http error and to create a highly available application. This feature is available because of [under-pressure](https://github.com/fastify/under-pressure).
