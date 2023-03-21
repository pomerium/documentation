---
id: certificates
title: Certificates
keywords:
  - reference
  - Certificates
pagination_prev: null
pagination_next: null
---

# Certificates

- Config File Key: `certificates` (not yet settable using environmental variables)
- Config File Key: `certificate` / `certificate_key`
- Config File Key: `certificate_file` / `certificate_key_file`
- Environmental Variable: `CERTIFICATE` / `CERTIFICATE_KEY`
- Environmental Variable: `CERTIFICATE_FILE` / `CERTIFICATE_KEY_FILE`
- Kubernetes: [`certificates`](/docs/kubernetes/reference#spec)
- Type: array of relative file locations `string`
- Type: [base64 encoded](https://en.wikipedia.org/wiki/Base64) `string`
- Type: certificate relative file location `string`
- Required (if insecure not set)

Certificates are the x509 _public-key_ and _private-key_ used to establish secure HTTP and gRPC connections. Any combination of the above can be used together, and are additive. You can also use any of these settings in conjunction with `Autocert` to get OCSP stapling.

Certificates loaded into Pomerium from these config values are used to attempt secure connections between end users and services, between Pomerium services, and to upstream endpoints.

For example, if specifying multiple certificates at once:

```yaml
certificates:
  - cert: '$HOME/.acme.sh/authenticate.example.com_ecc/fullchain.cer'
    key: '$HOME/.acme.sh/authenticate.example.com_ecc/authenticate.example.com.key'
  - cert: '$HOME/.acme.sh/verify.example.com_ecc/fullchain.cer'
    key: '$HOME/.acme.sh/verify.example.com_ecc/verify.example.com.key'
  - cert: '$HOME/.acme.sh/prometheus.example.com_ecc/fullchain.cer'
    key: '$HOME/.acme.sh/prometheus.example.com_ecc/prometheus.example.com.key'
```

Or to set a single certificate and key covering multiple domains and/or a wildcard subdomain:

```yaml
certificate_file: '$HOME/.acme.sh/*.example.com/fullchain.crt'
certificate_key: '$HOME/.acme.sh/*.example.com/*.example.com.key'
```

**Note:** Pomerium will check your system's trust/key store for valid certificates first. If your certificate solution imports into the system store, you don't need to also specify them with these configuration keys.
