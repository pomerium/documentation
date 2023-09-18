---
title: Pomerium-CLI TCP Reference
sidebar_label: Reference
hide_table_of_contents: false
description: Manage your TCP connections from the command line with Pomerium-CLI.
keywords: [tcp, cli, pomerium]
---

# TCP reference for pomerium-cli

This TCP reference covers `pomerium-cli` commands you can use to manage TCP connections in Pomerium.

## Usage

```shell
pomerium-cli tcp [destination] [flags]
```

## Flags

| Flags | Description | Type |
| :-- | :-- | --- |
| <a className="entRef-anchor" id="--alternate-ca-path">#</a><a href='#--alternate-ca-path'>--alternate-ca-path</a> | Path to CA certificate to use for HTTP requests. | string |
| <a className="entRef-anchor" id="--browser-cmd">#</a><a href='#--browser-cmd'>--browser-cmd</a> | Custom browser command to run when opening a URL. | string |
| <a className="entRef-anchor" id="--ca-cert">#</a><a href='#--ca-cert'>--ca-cert</a> | Path to CA certificate to use for HTTP requests. | string |
| <a className="entRef-anchor" id="--client-cert">#</a><a href='#--client-cert'>--client-cert</a> | (optional) PEM-encoded client certificate. | string |
| <a className="entRef-anchor" id=" --client-key">#</a><a href='# --client-key'> --client-key</a> | (optional) PEM-encoded client certificate key. | string |
| <a className="entRef-anchor" id="--client-cert-from-store">#</a><a href='#--client-cert-from-store'> --client-cert-from-store</a> | (optional) If provided, pomerium-cli will attempt to use a client certificate from the system trust store (macOS and Windows only), searching for a certificate based on the trusted CA names advertised by Pomerium in the TLS handshake | none |
| <a className="entRef-anchor" id="--client-cert-issuer">#</a><a href='#--client-cert-issuer'> --client-cert-issuer</a> | (optional) When used in combination with --client-cert-from-store, restricts the client certificate search based on a particular attribute of the certificate's [Issuer name](#certificate-name-filters). | string |
| <a className="entRef-anchor" id="--client-cert-subject">#</a><a href='#--client-cert-subject'> --client-cert-subject</a> | (optional) When used in combination with --client-cert-from-store, restricts the client certificate search based on a particular attribute of the certificate's [Subject name](#client-certificate-name-filters). | string |
| <a className="entRef-anchor" id=" --disable-tls-verification">#</a><a href='# --disable-tls-verification'>--disable-tls-verification</a> | Disables TLS verification. | none |
| <a className="entRef-anchor" id="--help">#</a><a href='#--help'>-h, --help</a> | Help for tcp. | none |
| <a className="entRef-anchor" id="--listen">#</a><a href='#--listen'>--listen</a> | Local address to start a listener on (default "127.0.0.1:0"). | string |
| <a className="entRef-anchor" id="--pomerium-url">#</a><a href='#--pomerium-url'>--pomerium-url</a> | The URL of the Pomerium server to connect to. | string |
| <a className="entRef-anchor" id="--version">#</a><a href='#--version'>-v, --version</a> | Version for pomerium-cli. | none |

### Certificate name filters

The certificate name filter syntax is `attribute=value`. A name filter can accept only one name attribute. The value must be an exact match (not a substring match). Make sure to quote name filters as appropriate for your shell.

For example, `--client-cert-issuer "CN=My Trusted CA"` would filter for a certificate directly issued by a CA with the Common Name "My Trusted CA".

Or, `--client-cert-subject "OU=My Department"` would filter for a certificate whose Subject name contains the Organizational Unit Name "My Department".

The supported name attributes are:

- commonName (CN)
- countryName (C)
- localityName (L)
- organizationName (O)
- organizationalUnitName (OU)
- postalCode
- serialNumber
- stateOrProvinceName (ST)
- streetAddress (STREET)

Either the long or short attribute name may be used (e.g. `localityName=New York` or `L=New York`).

Values are case sensitive: `L=new york` will not match the Locality Name "New York".
