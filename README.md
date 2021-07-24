<h1 align="center"><img src="https://github.com/socketkit/awacs/blob/main/.github/awacs-logo.png?raw=true" alt="Socketkit Awacs - Next-gen behavior analysis server"></h1>

---

[![build status](https://github.com/socketkit/awacs/workflows/Node%20Testing/badge.svg)](https://github.com/socketkit/awacs/actions)
[![coverage status](https://img.shields.io/coveralls/github/socketkit/awacs.svg?style=flat-square)](https://coveralls.io/github/socketkit/awacs)
[![License](https://img.shields.io/github/license/socketkit/awacs.svg?style=flat-square)](https://raw.githubusercontent.com/socketkit/awacs/main/LICENSE)

## Introduction to Awacs

Next-gen behavior analysis server (think Mixpanel, Google Analytics) with built-in encryption supporting HTTP2 and gRPC. Node.js, headless, API-only, horizontally scaleable.

## Installation

We support [Docker](https://awacs.socketkit.com/guides/deployment/docker), [Kubernetes](https://awacs.socketkit.com/guides/deployment/kubernetes), and [Helm](https://awacs.socketkit.com/guides/deployment/helm) out of the box.

## Security

We take security seriously in Awacs. We believe that security & privacy is a human right, and should be done properly.

#### Authorization

Every active application in Awacs has a unique authorization token to tell the server where the information belongs to. This token is sent using the x-socketkit-key HTTP header. It's recommended to have an SSL certificate in between the client and server to make it harder for an attacker to read the application authorization token.

#### Request Signing

It's required that every request sent to Awacs public API should be signed with ed25519 on the client side. This digital signature algorithm enables us that the information did not get manipulated in the transit between client and server. Signed payload is sent through the `x-signature` HTTP header.

## High Availability

We have a solid health check mechanism which allows us to have the perfect horizontally scaleable infrastracture. Additionally, we support [Prometheus](http://prometheus.io) and [OpenTelemetry](https://opentelemetry.io) out of the box.

## SDKs

We have a variety of SDKs for Awacs and additionally support OpenAPI auto-generated SDKs.

- JavaScript: Available on [Github](https://github.com/socketkit/socketkit-js).
- Swift: Available on [Github](https://github.com/socketkit/socketkit-swift) **[WIP]**

## Contributing to Awacs

We welcome every contribution to Awacs with love. Please read our [CONTRIBUTING guide](https://github.com/socketkit/socketkit/blob/main/CONTRIBUTING.md) for more details.
