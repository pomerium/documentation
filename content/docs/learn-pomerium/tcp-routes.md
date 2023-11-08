---
id: tcp-routes
title: Build TCP Routes
description: In this lesson, you'll secure TCP connections to SSH, Postgres, and Redis services with Pomerium. 
keywords: [tcp, connection, ssh, postgres, redis, reverse proxy, certificates, pomerium]
sidebar_label: 7. TCP Routes
---
# Build TCP Routes

Now that you’ve built several routes, it’s time to configure a few more services to see how Pomerium proxies TCP connections.

Specifically,  we’ll create the following services and route users to them with TCP connections:

- SSH
- PostgreSQL
- Redis

:::note **Before You Start**

Make sure you’ve completed the following tutorials:

- [**Get Started**](/docs/learn-pomerium/get-started)
- [**Build a Simple Route**](/docs/learn-pomerium/build-routes)
- [**Build a Simple Policy**](/docs/learn-pomerium/build-policies)
- [**Identity Verification with JWTs**](/docs/learn-pomerium/jwt-verification)
- [**Build Advanced Policies**](/docs/learn-pomerium/advanced-policies)
- [**Build Advanced Routes**](/docs/learn-pomerium/advanced-routes)

Each tutorial builds on the same configuration files. In this tutorial, you’ll build routes to several services and proxy TCP connections to these services with Pomerium CLI.

:::

## Background

When replacing a traditional VPN, there are often non-HTTP based applications you still need to reach. Pomerium can provide the same type of protection to these services with [Pomerium CLI](/docs/deploy/clients/pomerium-cli), a client-side application to proxy TCP connections.

In this tutorial, you’ll secure several backend services behind Pomerium and access these services by connecting to them with a TCP route.

Pomerium’s CLI client comes with a `tcp` command that you can use to secure these connections.

## Before you start

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

completion  Generate the autocompletion script for the specified shell

help        Help about any command

k8s         commands for the kubernetes credential plugin

tcp         creates a TCP tunnel through Pomerium

version     version

Flags:

-h, --help      help for pomerium-cli

-v, --version   version for pomerium-cli

Use "pomerium-cli [command] --help" for more information about a command.
```

If you see this output, success!

### Configure Locally Trusted Certificates

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

#### Update Pomerium Configuration

In your Pomerium configuration file, add the `certificates` key:

```yaml title="config.yaml"
certificates:
  - cert: /pomerium/cert.pem
    key: /pomerium/key.pem
```

#### Mount Wildcard Certificates

In your Docker Compose file, bind mount your wildcard certificates as a volume in the Pomerium service:

```yaml
version: "3"
services:
  pomerium:
    image: pomerium/pomerium:latest
    volumes:
    # Mount your wildcard certificates:
      - ./_wildcard.localhost.pomerium.io-key.pem:/pomerium/key.pem:ro
      - ./_wildcard.localhost.pomerium.io.pem:/pomerium/cert.pem:ro
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 443:443
```

### Add TCP Connections

#### Add Services to Docker Compose

Next, add your services in Docker Compose:

```yaml title="docker-compose.yaml"
pgsql:
      image: postgres
      restart: always
      environment:
        - POSTGRES_PASSWORD=postgres
        - POSTGRES_USER=postgres
        - POSTGRES_DB=postgres
      expose:
        - 5432
  redis:
    image: redis:latest
    expose:
      - 6379
  ssh:
    image: linuxserver/openssh-server:latest
    expose:
      - 2222
    environment:
      PASSWORD_ACCESS: "true"
      USER_PASSWORD: password
      USER_NAME: user
```

#### Configure TCP Routes

Add the routes to these services in your Pomerium configuration file using the `tcp` syntax:

```yaml title="config.yaml"
- from: tcp+https://pgsql.localhost.pomerium.io:5432
    to: tcp://pgsql:5432
    policy:
      - allow:
          or:
            - domain:
                is: example.com
  - from: tcp+https://redis.localhost.pomerium.io:6379
    to: tcp://redis:6379
    policy:
      - allow:
          or:
            - domain:
                is: example.com
  - from: tcp+https://ssh.localhost.pomerium.io:22
    to: tcp://ssh:2222
    policy:
      - allow:
          or:
            - domain:
                is: example.com
```

Add the Databroker configuration keys to set up Postgres as the back-end Databroker service:

```yaml title="config.yaml"
databroker_storage_type: postgres
databroker_storage_connection_string: postgresql://postgres:postgres@pgsql:5432
```

### Connect With Pomerium CLI

Now, use Pomerium CLI’s `tcp` command to connect the services and routes we defined in the previous steps.

#### Connect to Postgres Databroker Service

First, let’s connect to our Postgres Databroker service using the `tcp` command:

```shell-session
$ pomerium-cli tcp pgsql.localhost.pomerium.io:5432 --listen localhost:5432

2023/10/03 12:22:08 listening on 127.0.0.1:5432
```

After password authentication (in your Docker Compose file, `postgres` is the configured password for the `postgres` user and database), connect and list the schemas:

```shell-session
$  psql -h localhost -W -U postgres -c '\dn'
Password:
       List of schemas
   Name   |       Owner
----------+-------------------
 pomerium | postgres
 public   | pg_database_owner
(2 rows)
```

Kill the TCP connection.

#### Connect to Redis

Connect to Redis:

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

#### Connect to SSH

To configure your SSH client to use Pomerium's TCP support for SSH routes, create an `ssh_config` file in your root directory and add the following entry:

```sh title="ssh_config"
Host *.localhost.pomerium.io
  ProxyCommand pomerium-cli tcp --listen - %h:%p
```

Start an SSH proxy in the background:

```shell-session
$ pomerium-cli tcp ssh.localhost.pomerium.io:22 --listen :2222

2023/10/03 12:29:17 listening on 127.0.0.1:2222
```

Initiate the SSH connection (the username and password credentials are included in your Docker Compose file):

```shell-session
# USER_NAME: user USER_PASSWORD: password
$ ssh user@ssh.localhost.pomerium.io -p 2222
user@ssh.localhost.pomerium.io's password:
Welcome to OpenSSH Server

4e737e02c43f:~$
```

And just like that, you’re done! You now have a TCP connection proxied over HTTPS!

## Summary

In this tutorial, you secured TCP connections to Redis, SSH, and Postgres services. To secure the connection, you used the `pomerium-cli` `tcp` command. 

At this point, we’ve done all we can do with a hosted Pomerium instance in a Dockerized environment. You now know all the necessary basics for running Pomerium itself, so let’s take it out of Docker and into the wild!

In the next tutorial, we will turn to Google Cloud Platform (GCP) to spin up a Virtual Machine instance, register a domain using Cloud Domains, and wire it up with Cloud DNS. This way, you can self-host your own domain and Pomerium.