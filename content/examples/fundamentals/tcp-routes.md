---
# cSpell:ignore Dockerized, linuxkit, aarch, gettime, epoll, atomicvar
id: tcp-routes
title: Build TCP Routes
description: In this lesson, you'll secure TCP connections to SSH, Postgres, and Redis services with Pomerium.
keywords:
  [tcp, connection, ssh, postgres, redis, reverse proxy, certificates, pomerium]
sidebar_label: 7. TCP Routes
sidebar_position: 7
---

# Build TCP Routes

Now that you’ve built several routes, it's time to proxy TCP connections with Pomerium.

Specifically,  we’ll create a [Redis](https://redis.io/) service and route users to it with a TCP connection.

:::note **Before You Start**

Make sure you’ve completed the following tutorials:

- [**Get Started**](/examples/fundamentals/get-started)
- [**Build a Simple Route**](/examples/fundamentals/build-routes)
- [**Build a Simple Policy**](/examples/fundamentals/build-policies)
- [**Identity Verification with JWTs**](/examples/fundamentals/jwt-verification)
- [**Build Advanced Policies**](/examples/fundamentals/advanced-policies)
- [**Build Advanced Routes**](/examples/fundamentals/advanced-routes)

Each tutorial builds on the same configuration files. In this tutorial, you’ll build routes to several services and proxy TCP connections to these services with Pomerium CLI.

:::

## Background

When replacing a traditional VPN, there are often non-HTTP based applications you still need to reach. Pomerium can provide the same type of protection to these services with [Pomerium CLI](/docs/deploy/clients/pomerium-cli), a client-side application to proxy TCP connections.

In this tutorial, you’ll secure a backend Redis service behind Pomerium and access it by connecting to it with a TCP route.

Pomerium’s CLI client comes with a `tcp` command that you can use to secure this connection.

## Prerequisites

To complete this tutorial, you need:

- [Pomerium CLI](/docs/deploy/clients/pomerium-cli) to proxy TCP connections between end-users and services behind Pomerium
- [mkcert](https://github.com/FiloSottile/mkcert) to generate a locally trusted Certificate Authority and certificates (for development purposes only)

:::note

For this tutorial, install Pomerium CLI to your system instead of using the Pomerium CLI Docker Image.

:::

### Test Pomerium CLI

Once you’ve installed Pomerium CLI, test the installation by running `pomerium-cli`:

```shell-session
$ pomerium-cli
Usage:
  pomerium-cli [command]

Available Commands:
  completion  Generate the autocompletion script for the specified shell
  help        Help about any command
  k8s         commands for the kubernetes credential plugin
  tcp         creates a TCP tunnel through Pomerium
  version     version

Flags:
  -h, --help      help for pomerium-cli
  -v, --version   version for pomerium-cli

Use "pomerium-cli [command] --help" for more information about a command.
```

If you see this output, success!

### Configure locally-trusted certificates

Next, you will generate locally trusted certificates with `mkcert`.

Install `mkcert`:

```sh
mkcert -install
```

This command will install `mkcert` and generate a `rootCA.pem` file in your system’s trust store.

Generate wildcard certificates:

```sh
`mkcert "*.localhost.pomerium.io"`
```

This command will generate the following certificates in your project’s root directory:

- `_wildcard.localhost.pomerium.io.pem`
- `_wildcard.localhost.pomerium.io-key.pem`

#### Update Pomerium configuration

In your Pomerium configuration file, add the `certificates` key:

```yaml title="config.yaml"
certificates:
  - cert: /pomerium/cert.pem
    key: /pomerium/key.pem
```

#### Mount wildcard certificates

In your Docker Compose file, bind mount your wildcard certificates as a volume in the Pomerium service:

```yaml title="docker-compose.yaml"
version: '3'
services:
  pomerium:
    image: cr.pomerium.com/pomerium/pomerium:latest
    volumes:
      # Mount your wildcard certificates:
      - ./_wildcard.localhost.pomerium.io-key.pem:/pomerium/key.pem:ro
      - ./_wildcard.localhost.pomerium.io.pem:/pomerium/cert.pem:ro
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 443:443
```

### Add TCP connections

#### Add Redis to Docker Compose

Next, add your services in Docker Compose:

```yaml title="docker-compose.yaml"
redis:
  image: redis:latest
  expose:
    - 6379
```

#### Configure a TCP route

Add the Redis route to your service in your Pomerium configuration file using the `tcp` syntax:

```yaml title="config.yaml"
- from: tcp+https://redis.localhost.pomerium.io:6379
  to: tcp://redis:6379
  policy:
    - allow:
        or:
          - domain:
              is: example.com
```

### Connect with Pomerium CLI

Now, use Pomerium CLI’s `tcp` command to connect to the Redis service

```shell-session
$ pomerium-cli tcp redis.localhost.pomerium.io:6379 --listen localhost:6379

2023/10/02 12:20:05 listening on 127.0.0.1:6379
```

Start the Redis client:

```shell-session
$ redis-cli info
# Server
redis_version:7.0.5
redis_git_sha1:00000000
redis_git_dirty:0
redis_build_id:d9291579292e26e3
redis_mode:standalone
os:Linux 6.3.13-linuxkit aarch64
arch_bits:64
monotonic_clock:POSIX clock_gettime
multiplexing_api:epoll
atomicvar_api:c11-builtin
gcc_version:10.2.1
process_id:1
process_supervised:no
run_id:e4c843df14511765f0e6284690be2f10c6b39e28
tcp_port:6379
server_time_usec:1696349965506132
uptime_in_seconds:75
uptime_in_days:0
hz:10
configured_hz:10
lru_clock:1851149
executable:/data/redis-server
config_file:
io_threads_active:0
```

## Summary

In this tutorial, you secured a TCP connection to Redis. To secure the connection, you used the `pomerium-cli` `tcp` command.

At this point, we’ve done all we can do with a hosted Pomerium instance in a Dockerized environment. You now know all the necessary basics for running Pomerium itself, so let’s take it out of Docker and into the wild!

In the next tutorial, we will turn to Google Cloud Platform (GCP) to spin up a Virtual Machine instance, register a domain using Cloud Domains, and wire it up with Cloud DNS. This way, you can self-host your own domain and Pomerium.
