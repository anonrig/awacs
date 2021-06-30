# Kubernetes

We only support Helm deployment at the moment. We'll update this documentation as soon as possible.

## Reference

Refer to the [Helm configuration](https://github.com/socketkit/awacs/tree/main/charts/awacs/templates) to use as a base point for your Kubernetes integration.

## Prometheus

Prometheus metrics are supported by default on our public API.

```yaml title="/metrics"
# HELP process_cpu_user_seconds_total Total user CPU time spent in seconds.
# TYPE process_cpu_user_seconds_total counter
process_cpu_user_seconds_total 0.034094

# HELP process_cpu_system_seconds_total Total system CPU time spent in seconds.
# TYPE process_cpu_system_seconds_total counter
process_cpu_system_seconds_total 0.001786
```
