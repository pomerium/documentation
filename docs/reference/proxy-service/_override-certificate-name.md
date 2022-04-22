---
id: override-certificate-name
title: Override Certificate Name
description: |
  Secure service communication can fail if the external certificate does not match the internally routed service hostname/SNI.
keywords:
- reference
- Override Certificate Name
---


# Override Certificate Name
- Environmental Variable: `OVERRIDE_CERTIFICATE_NAME`
- Config File Key: `override_certificate_name`
- Type: `string`
- Optional
- Example: `*.corp.example.com` if wild card or `authenticate.corp.example.com`/`authorize.corp.example.com`

Secure service communication can fail if the external certificate does not match the internally routed service hostname/[SNI](https://en.wikipedia.org/wiki/Server_Name_Indication). This setting allows you to override that value.

