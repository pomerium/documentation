---
title: Guides
---

# Overview

This section contains applications, and scenario specific guides for Pomerium.

- The [ad-guard](guides/ad-guard) recipe demonstrates how Pomerium can be used to augment web applications that only support simplistic authorization mechanisms like basic-auth with single-sign-on driven access policy.
- The [argo](guides/argo) guide demonstrates how Pomerium can be used to add access control to [Argo](https://argoproj.github.io/projects/argo).
- The [Client-Side mTLS](guides/mtls) guide demonstrates how Pomerium can be used to add mutual authentication to end-user connections using client certificates and a custom certificate authority.
- The [Cloud Run](guides/cloud-run) recipe demonstrates deploying Pomerium to Google Cloud Run as well as using it to Authorize users to protected Cloud Run endpoints.
- Secure [Cockpit](guides/cockpit), a web GUI for Linux server administration, behind a Pomerium route.
- The [code-server](guides/code-server) guide demonstrates how Pomerium can be used to add access control to third-party applications that don't ship with [fine-grained access control](https://github.com/cdr/code-server/issues/905). code-server is a tool to run Visual Studio code as a web application.
- See [Device Admin-Enrollment](guides/admin-enroll-device) to create pre-approved device enrollment links in the Pomerium Enterprise Console.
- See [Device User-Enrollment](guides/enroll-device) to learn how to register a security device (TPM, Yubikey, etc) to access routes requiring a device ID.
- The [GitLab](guides/gitlab) guide covers securing a self-hosted instance of GitLab using Pomerium.
- Our [Grafana](guides/grafana) guide explains how to secure Grafana with Pomerium and integrate user sign-in using our JWT.
- The [JWT Verification](guides/jwt-verification) guide demonstrates how to verify the Pomerium JWT assertion header using Envoy.
- The [Kubernetes Dashboard](guides/kubernetes-dashboard) guide covers how to secure Kubernetes dashboard using Pomerium.
- The [kubernetes](guides/kubernetes) guide covers how to add authentication and authorization to kubernetes dashboard using helm, and letsencrypt certificates. This guide also shows how third party reverse-proxies like nginx/traefik can be used in conjunction with Pomerium using forward-auth.
- The [local OIDC](guides/local-oidc) guide demonstrates how Pomerium can be used with local OIDC server for dev/testing.
- Our [Synology](guides/synology) guide demonstrates how lightweight Pomerium is by installing it on a Synology NAS or similar low-resource product.
- The [TiddlyWiki](guides/tiddlywiki) guide demonstrates how Pomerium can be used to add authentication and authorization to web application using authenticated header.
- The [Transmission](guides/transmission) guide demonstrates how Pomerium can act as an authentication and authorization proxy for your Transmission daemon's RPC interface, which only provides unencrypted HTTP auth out of the box.
- [Upstream mTLS With Pomerium](guides/upstream-mtls) explains how to provide a client certificate (mTLS) from Pomerium to an upstream service.
