---
title: Pomerium-CLI TCP Reference
sidebar_label: TCP Reference
hide_table_of_contents: false
description: Manage your TCP connections from the command line with Pomerium-CLI.
keywords: [tcp, cli, pomerium]
---

# TCP Reference for pomerium-cli

This TCP reference covers `pomerium-cli` commands you can use to manage TCP connections in Pomerium.

## Usage

```shell
pomerium-cli tcp [destination] [flags]
```

## Flags

| Flags | Description | Default Value |
| :-- | :-- | --- |
| <a className="entRef-anchor" id="--alternate-ca-path">#</a><a href='#--alternate-ca-path'>--alternate-ca-path</a> | Path to CA certificate to use for HTTP requests. | string |
| <a className="entRef-anchor" id="--browser-cmd">#</a><a href='#--browser-cmd'>--browser-cmd</a> | Custom browser command to run when opening a URL. | string |
| <a className="entRef-anchor" id="--ca-cert">#</a><a href='#--ca-cert'>--ca-cert</a> | Path to CA certificate to use for HTTP requests. | string |
| <a className="entRef-anchor" id="--client-cert">#</a><a href='#--client-cert'>--client-cert</a> | (optional) PEM-encoded client certificate. | string |
| <a className="entRef-anchor" id=" --client-key">#</a><a href='# --client-key'> --client-key</a> | (optional) PEM-encoded client certificate. | string |
| <a className="entRef-anchor" id=" --disable-tls-verification">#</a><a href='# --disable-tls-verification'>--disable-tls-verification</a> | Disables TLS verification. | none |
| <a className="entRef-anchor" id="--help">#</a><a href='#--help'>-h, --help</a> | Help for tcp. | none |
| <a className="entRef-anchor" id="--listen">#</a><a href='#--listen'>--listen</a> | Local address to start a listener on (default "127.0.0.1:0"). | string |
| <a className="entRef-anchor" id="--pomerium-url">#</a><a href='#--pomerium-url'>--pomerium-url</a> | The URL of the Pomerium server to connect to. | string |
| <a className="entRef-anchor" id="--version">#</a><a href='#--version'>-v, --version</a> | Version for pomerium-cli. | none |
