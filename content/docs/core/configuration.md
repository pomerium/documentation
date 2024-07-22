---
title: Configuration
description: This page discusses configuration settings for Pomerium Core.
keywords: [core configuration]
sidebar_label: Configuration
---

# Configuration

You can configure Pomerium using either a configuration file or [environmental variables](https://en.wikipedia.org/wiki/Environment_variable). If using a configuration file, the following languages are supported:

- [YAML](https://yaml.org/)
- [JSON](https://www.json.org/json-en.html)
- [TOML](https://toml.io/en/)

Using both environmental variables and configuration file keys is allowed and encouraged (for example, secret keys are probably best set as environmental variables). However, if duplicate configuration keys are found, environment variables take precedence.

:::tip

Pomerium can hot-reload route configuration details, authorization policy, certificates, and other proxy settings.

:::

### Configuration syntax

Both configuration file keys and environment variables are case sensitive. 

Configuration file keys are always lowercase and use dashes (`-`). Environmental variables are identical to configuration file keys, except they are always uppercase and use underscores (`_`). 

See the [Reference](/docs/reference) page for a comprehensive list of Pomerium's configuration settings.

## All In One and Split Service modes

You can configure Pomerium using either All In One mode or Split Service mode. 

### All In One mode

All In One mode means all of Pomerium's configuration settings are set in a single configuration file. You can use All In One mode when running Pomerium: 

- As a single system service or container, or
- In a distributed environment where there are multiple processes that each handle separate [Pomerium services](/docs/internals/architecture#component-level). 

All In One mode is the default configuration mode, and the easiest way to configure Pomerium. 

### Split Service mode

Alternately, you can create individual configuration files (or sets of environment variables) for each Pomerium service. In Split Service mode, each configuration file (or set of environment variables) defines which service a process will run by using the [service mode](/docs/reference/service-mode) key.

:::tip Our recommendation

We recommend All In One mode to configure Pomerium for the following reasons: 

- **Reduce complexity**: All In One mode reduces the complexity of managing configuration. A single configuration file means there is one source of truth.
- **Secure communication**: Pomerium services communicate internally. Splitting up services requires securing these endpoints and configuring DNS records for each service.
- **Scaling**: All In One deployments scale for better performance. All URLs point at the same Pomerium service instance.

:::