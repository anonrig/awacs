---
slug: /
---

# Introduction to Awacs

Awacs is a security and privacy focused behavior analysis server (and a microservice) developed by [Socketkit](https://socketkit.com) using the latest technologies possible. Currently, Awacs is using Node 16 with PostgreSQL 13.

## Implementation

Due to its nature, Awacs is divided into 2 different implementations: **Public API** and **Private API**, where through the OpenAPI 3 specification it is easier to auto-generate different SDKs for different platforms really fast, and gRPC microservice enables developers to connect to our private api from any interface they want.

### Public API (OpenAPI 3.0)

Available through OpenAPI 3.0 specification, Public API offers cross platform HTTP service where different clients from different platforms can send events to. You can access OpenAPI from `http://localhost:3000/docs/json` which is available through the Awacs public server.

### Private API (gRPC)

Available through gRPC, Private API provides all the necessary interfaces for your API to query the data stored by Awacs. The aim of the Public API is to reduce the learning curve of Awacs and treat Awacs as a black-box implementation. You can analyze our protocol buffers implementation documentation from [awacs.proto](/proto/awacs.proto)

