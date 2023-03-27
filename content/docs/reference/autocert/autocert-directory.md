---
id: autocert-directory
title: Autocert Directory
description: |
  Autocert directory is the path which autocert will store x509 certificate data.
keywords:
  - reference
  - Autocert Directory
  - s3
  - gcs
pagination_prev: null
pagination_next: null
---

# Autocert Directory

- Environmental Variable: `AUTOCERT_DIR`
- Config File Key: `autocert_dir`
- Type: `string` pointing to the path of the directory, or a URL to an S3 or GCS bucket.
- Optional
- Default:
  - `/data/autocert` in published Pomerium Docker images
  - `/etc/pomerium/` in published Pomerium [os pkgs](https://github.com/pomerium/pomerium/blob/5e3ae59658246bfe3d4cc5d12997c6e19350bf80/ospkg/pomerium.service#L8). 
  - [$XDG_DATA_HOME](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)
  - `$HOME/.local/share/pomerium`

Autocert directory is the path which Autocert will store X.509 certificate data.

## S3 Bucket

An S3 bucket can be used as storage by using a URL like:

```yaml
autocert_dir: s3://your-bucket.s3.us-east-1.amazonaws.com/some/prefix
```

Credentials are sourced from [the environment](https://pkg.go.dev/github.com/aws/aws-sdk-go-v2/config#EnvConfig).

## GCS Bucket

A Google Cloud Storage bucket can be used as storage by using a URL like:

```yaml
autocert_dir: gs://your-bucket/some/prefix
```

Credentials are sourced from [Google Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials).
