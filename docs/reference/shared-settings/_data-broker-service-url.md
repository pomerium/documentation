---
id: data-broker-service-url
title: Data Broker Service URL
keywords:
- reference
- Data Broker Service URL
---


# Data Broker Service URL
- Environmental Variable: `DATABROKER_SERVICE_URL` or `DATABROKER_SERVICE_URLS`
- Config File Key: `databroker_service_url` or `databroker_service_urls`
- Type: `URL`
- Example: `https://databroker.corp.example.com`
- Default: in all-in-one mode, `http://localhost:5443`

The data broker service URL points to a data broker which is responsible for storing associated authorization context (e.g. sessions, users and user groups). Multiple URLs can be specified with `databroker_service_urls`.

