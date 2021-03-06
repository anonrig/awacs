# awacs

![Version: 0.2.0](https://img.shields.io/badge/Version-0.2.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 0.5.0](https://img.shields.io/badge/AppVersion-0.6.0-informational?style=flat-square)

A Helm chart for Socketkit Awacs

## Requirements

| Repository | Name | Version |
|------------|------|---------|
| https://charts.bitnami.com/bitnami | postgresql | 10.5.0 |

## Values

| Key                                                | Type   | Default                  | Description                                                              |
|----------------------------------------------------|--------|--------------------------|--------------------------------------------------------------------------|
| affinity                                           | object | `{}`                     |                                                                          |
| application.autoMigrate                            | bool   | `true`                   | default to true to run migration before every deployment                 |
| application.config.NODE_ENV                        | string | `"production"`           |                                                                          |
| application.config.PGDATABASE                      | string | `"awacs"`                |                                                                          |
| application.config.PGHOST                          | string | `"awacs-postgresql"`     |                                                                          |
| application.config.PGPASSWORD                      | string | `"postgres-password"`    |                                                                          |
| application.config.PGUSER                          | string | `"postgres"`             |                                                                          |
| autoscaling.enabled                                | bool   | `false`                  |                                                                          |
| autoscaling.maxReplicas                            | int    | `100`                    |                                                                          |
| autoscaling.minReplicas                            | int    | `1`                      |                                                                          |
| autoscaling.targetCPUUtilizationPercentage         | int    | `80`                     |                                                                          |
| autoscaling.targetMemoryUtilizationPercentage      | int    | `80`                     |                                                                          |
| fullnameOverride                                   | string | `"awacs"`                |                                                                          |
| image.pullPolicy                                   | string | `"Always"`               |                                                                          |
| image.repository                                   | string | `"socketkit/awacs"`      | default docker image                                                     |
| image.tag                                          | string | `"latest"`               |                                                                          |
| imagePullSecrets                                   | list   | `[]`                     |                                                                          |
| ingress.annotations                                | object | `{}`                     |                                                                          |
| ingress.enabled                                    | bool   | `false`                  | default to false to not expose public api, should be true for most cases |
| ingress.hosts[0].host                              | string | `"awacs.socketkit.com"`  |                                                                          |
| ingress.tls                                        | list   | `[]`                     |                                                                          |
| job.annotations                                    | object | `{}`                     |                                                                          |
| job.automountServiceAccountToken                   | bool   | `true`                   |                                                                          |
| nameOverride                                       | string | `"awacs"`                |                                                                          |
| nodeSelector                                       | object | `{}`                     |                                                                          |
| pgchecker.image.pullPolicy                         | string | `"IfNotPresent"`         |                                                                          |
| pgchecker.image.repository                         | string | `"docker.io/busybox"`    |                                                                          |
| pgchecker.image.tag                                | float  | `1.32`                   |                                                                          |
| pgchecker.resources.limits.cpu                     | string | `"10m"`                  |                                                                          |
| pgchecker.resources.limits.memory                  | string | `"16Mi"`                 |                                                                          |
| pgchecker.resources.requests.cpu                   | string | `"10m"`                  |                                                                          |
| pgchecker.resources.requests.memory                | string | `"16Mi"`                 |                                                                          |
| pgchecker.securityContext.allowPrivilegeEscalation | bool   | `false`                  |                                                                          |
| pgchecker.securityContext.runAsGroup               | int    | `1000`                   |                                                                          |
| pgchecker.securityContext.runAsNonRoot             | bool   | `true`                   |                                                                          |
| pgchecker.securityContext.runAsUser                | int    | `1000`                   |                                                                          |
| podAnnotations                                     | object | `{}`                     |                                                                          |
| podSecurityContext.fsGroup                         | int    | `1000`                   |                                                                          |
| postgresql.enabled                                 | bool   | `false`                  | attaches a postgresql instance to deployment                             |
| postgresql.image.registry                          | string | `"docker.io"`            |                                                                          |
| postgresql.image.repository                        | string | `"bitnami/postgresql"`   |                                                                          |
| postgresql.image.tag                               | string | `"13.3.0-debian-10-r33"` |                                                                          |
| postgresql.networkPolicy.enabled                   | bool   | `false`                  |                                                                          |
| postgresql.postgresqlDatabase                      | string | `"awacs"`                |                                                                          |
| postgresql.postgresqlPassword                      | string | `"postgres-password"`    |                                                                          |
| postgresql.postgresqlUsername                      | string | `"postgres"`             |                                                                          |
| replicaCount                                       | int    | `1`                      |                                                                          |
| resources.limits                                   | object | `{}`                     |                                                                          |
| resources.requests                                 | object | `{}`                     |                                                                          |
| securityContext.runAsNonRoot                       | bool   | `true`                   |                                                                          |
| securityContext.runAsUser                          | int    | `1000`                   |                                                                          |
| service.private.port                               | int    | `4001`                   | gRPC port                                                                |
| service.private.type                               | string | `"ClusterIP"`            |                                                                          |
| service.public.port                                | int    | `3002`                   | HTTP port                                                                |
| service.public.type                                | string | `"ClusterIP"`            |                                                                          |
| serviceAccount.annotations                         | object | `{}`                     |                                                                          |
| serviceAccount.create                              | bool   | `true`                   | should create a service account                                          |
| serviceAccount.name                                | string | `"awacs-account"`        |                                                                          |
| tolerations                                        | list   | `[]`                     |                                                                          |

----------------------------------------------
Autogenerated from chart metadata using [helm-docs v1.5.0](https://github.com/norwoodj/helm-docs/releases/v1.5.0)
