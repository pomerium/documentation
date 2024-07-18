---
title: Configuration
description: This page discusses configuration settings for Pomerium Core.
keywords: [core configuration]
sidebar_label: Configuration
---

# Configuration

Pomerium can be configured using a configuration file ([YAML]/[JSON]/[TOML]) or [environmental variables]. In general, environmental variable keys are identical to config file keys but are uppercase. Enterprise users will be able to set these settings in the GUI, or using the API.

Using both [environmental variables] and config file keys is allowed and encouraged (for instance, secret keys are probably best set as environmental variables). However, if duplicate configuration keys are found, environment variables take precedence.

:::tip

Pomerium can hot-reload route configuration details, authorization policy, certificates, and other proxy settings.

:::

See the [reference](/docs/reference) page for a complete list of available options.

## All-In-One vs Split Service mode

When running Pomerium as a single system service or container, all the options on this page can be set in a single `config.yaml` file, or passed to the single instance as environment variables.

When running Pomerium in a distributed environment where there are multiple processes, each handling separate [components](/docs/internals/architecture#component-level), all services can still share a single config file or set of environment variables.

Alternately, you can create individual config files or sets of environment variables for each service. When doing so, each file or set can define which component a process will run as using the [service mode](/docs/reference/service-mode) key.

The table contains all config options for Pomerium Core. You can also browse each key using the index on the left.

[environmental variables]: https://en.wikipedia.org/wiki/Environment_variable
[json]: https://en.wikipedia.org/wiki/JSON
[toml]: https://en.wikipedia.org/wiki/TOML
[yaml]: https://en.wikipedia.org/wiki/YAML
