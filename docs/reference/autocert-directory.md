---
id: autocert-directory
title: Autocert Directory
description: |
  Autocert directory is the path which autocert will store x509 certificate data.
keywords:
- reference
- Autocert Directory
---


# Autocert Directory
- Environmental Variable: either `AUTOCERT_DIR`
- Config File Key: `autocert_dir`
- Type: `string` pointing to the path of the directory
- Required if using [Autocert](#autocert) setting
- Default:

  - `/data/autocert` in published Pomerium docker images
  - [$XDG_DATA_HOME](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)
  - `$HOME/.local/share/pomerium`

Autocert directory is the path which autocert will store x509 certificate data.

