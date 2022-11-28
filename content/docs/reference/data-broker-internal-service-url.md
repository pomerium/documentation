---
id: data-broker-internal-service-url
title: Data Broker Internal Service URL
keywords:
  - reference
  - Data Broker Internal Service URL
pagination_prev: null
pagination_next: null
---

# Data Broker Internal Service URL

- Environmental Variable: `DATABROKER_INTERNAL_SERVICE_URL` or `DATABROKER_INTERNAL_SERVICE_URLS`
- Config File Key: `databroker_internal_service_url` or `databroker_internal_service_urls`
- Type: `URL`
- Example: `https://databroker.corp.example.com`
- Default: in all-in-one mode, `http://localhost:5443`

Data Broker Internal URL overrides `databroker_service_url` when determining the TLS certificate for the databroker service to listen with.
