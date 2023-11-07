---
id: get-started
title: Get Started With Pomerium
sidebar_label: 1. Get Started
---

# Get Started With Pomerium

Welcome to **Get Started With Pomerium**! This is your starting point to learning the fundamentals of how Pomerium works so you can use it effectively to secure your own web apps and services.

This tutorial teaches you how to set up Pomerium using [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/). 

In a later tutorial, we will cover how to self-host and run Pomerium in a virtual machine environment. For now, we will work in containerized environments so we can easily configure Pomerium and run it alongside other services, which you can access behind Pomerium.

## Step 1: Create a new project

For the purposes of this guide, we’ll call this project `pomerium_quickstart` (but name it whatever you want).

Your project will contain all the files and configurations you need to run ****Pomerium Core****.

The directory structure will look like this:


- The `config.yaml` file configures Pomerium itself
- The `docker-compose.yaml` runs your Docker containers

We’ll set configure these files together in the next section.

:::info What is **Pomerium Core**?

[Pomerium Core](/docs/deploy/core) is an open-source, identity-aware reverse proxy. The proxy server consists of **four services**:

- The Proxy service — the waiter
- The Authentication service —  the waiter checking users in
- The Authorization service — the waiter checking if users can do that
- The Databroker service — the waiter remembering the user’s current session to offer the best user experience

When you run Core, these services work together to secure your apps and connect your users to them.

:::

### ## Step 2: Set up Pomerium

Create a YAML file called `config.yaml`.

Add the following configuration settings to `config.yaml`:

```yaml title="config.yaml"
authenticate_service_url: https://authenticate.pomerium.app

routes:
  - from: https://verify.localhost.pomerium.io
    to: http://verify:8000
    policy:
      - allow:
          or:
            - email:
                is: user@example.com
```

Update `[user@example.com](mailto:user@example.com)` to use your desired email address – otherwise, the example won’t work! (Unless, of course, your actual email address is `user@example.com`, in which case, carry on.)

:::info **Understanding the configuration file**

- *The Authenticate Service URL**

The `authenticate_service_url` setting provides an externally accessible URL that Pomerium’s **Authentication Service** uses to manage client authentication. It works like this:

1.  You request to access an app protected behind Pomerium

2. The Authentication Service receives the request, and uses the `authenticate_service_url` to redirect you to the **Identity Provider** to sign in

(If it helps to understand *why*, it’s because our waiter Pomerium needs to cross-reference with a list of users to go “Ah, I see you’re on our list. Right this way, please.”)

- **What Identity Provider?**

Pomerium relies on an Identity Provider (IdP) to authenticate users and authorize requests (it’s the list we just mentioned, except the IdP gives you a token badge so Pomerium recognizes you).

You probably noticed this configuration file doesn’t include an Identity Provider – that’s because you’re using Pomerium’s ****Hosted Authentication Service****, which provides a preconfigured identity provider for you.

This way, you can just plug and play. (Don’t worry; we’ll show you how to configure your own identity provider later!)

- **What about the routes?**

We’ll learn more about routes in the next section, but for now, just know that the `from` route is the externally accessible URL that Pomerium will redirect you to after authenticating with your identity provider.

:::

### ## Step 3: Set up Docker Compose

Create a YAML file called `docker-compose.yaml`.

Add the following configuration settings to `docker-compose.yaml`:

```yaml title="docker-compose.yaml"

```
version: "3"
services:
  pomerium:
    image: pomerium/pomerium:latest
    volumes:
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 443:443
  verify:
    image: pomerium/verify:latest
    expose:
      - 8000
```

```

This file includes the Docker images and instructions to run Pomerium and the Verify service in Docker containers.

### ## Step 4: Run Pomerium

Go into your project’s root directory and run the following command:

```yaml

docker compose up

```

Now, go to the [Verify service]([https://verify.localhost.pomerium.io](https://verify.localhost.pomerium.io/)) in your browser.

<!-- ![verify-state.png](Get%20Started%20d5fd53b5a8284d4db3e17c4ade7eca49/verify-state.png) -->

**Two things:**

1. **Why is the URL insecure?**

If you don’t provide certificates to verify the upstream service, Pomerium will generate self-signed certificates for you. Because the certificates are self-signed, your browser will throw a self-signed certificate warning. 

To bypass this warning:

1. Click anywhere in the browser window
2. Enter `thisisunsafe` (no spaces) and hit enter 
3. Repeat step 2 if you’re prompted with the same error

Later, we will cover how to self-host Pomerium using Autocert, which will automate the process of managing certificates for your routes.

1. **Identity verification failed, why?**

To verify your identity, the upstream application requires a JWKS endpoint where it can fetch a public key to verify that Pomerium signed a user’s JWT. But, we haven’t configured Pomerium (or the upstream service) to handle JWTs yet. 

In a later tutorial, you will configure Pomerium and the Verify service to successfully verify a user’s identity. 

## Summary

Great job! If you got this far, then you have everything you need to run Pomerium and continue on with our guided tutorials.

In the next section, we will dive deeper into **Routes** with Pomerium.

### Configuration File State:

By now, your configuration files should look similar to this:

```markdown
authenticate_service_url: https://authenticate.pomerium.app

routes:
  - from: https://verify.localhost.pomerium.io
    to: http://verify:8000
    policy:
      - allow:
          or:
            - email:
                is: <your-email>@example.com
```

Docker Compose:

```markdown
version: "3"
services:
  pomerium:
    image: pomerium/pomerium:latest
    volumes:
      - ./config.yaml:/pomerium/config.yaml:ro
    ports:
      - 443:443
  verify:
    image: pomerium/verify:latest
    expose:
      - 8000
```