# High Availability

## Health check

Under `/health` check we validate the connection to the PostgreSQL instance.

## Process performance

We check for `maxEventLoopDelay`, `maxHeapUsedBytes`, `maxRssBytes` and `maxEventLoopUtilization` to automatically handle `Service Unavailable` http error and to create a highly available application. This feature is available because of [under-pressure](https://github.com/fastify/under-pressure).

## Tracing

Awacs supports and echoes requests id's in every request. We use the header `x-request-id` to improve traceability of the microservice. This feature is available because of [rTracer](https://github.com/puzpuzpuz/cls-rtracer).
