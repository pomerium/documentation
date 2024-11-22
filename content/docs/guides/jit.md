---
title: Just-In-Time Access With Pomerium Zero
sidebar_label: Just-In-Time Access
lang: en-US
keywords: [pomerium, jit]
description: Learn how to implement Just-In-Time access with Pomerium Zero.
---

# Just-In-Time Access with Pomerium Zero

In this guide you'll learn how to implement a just-in-time access request/approve workflow using Pomerium Zero.

## What is Just-In-Time Access?

Just-In-Time (JIT) access is an approach to security where access to applications is time-limited and provided only on an as-needed basis. A user requests access to an application and an administrator grants the request for a limited period of time after which the user would have to request access again.

## Implementing Just-In-Time Access with Pomerium PPL

The Pomerium Policy Language (PPL) supports time-limited access via the [`date`](/docs/capabilities/ppl#date-matcher) criterion. When coupled with a `user` or `email` criterion, users can be granted time-limited access:

```yaml
allow:
  and:
    - email:
        is: user@example.com
    - date:
        before: 2150-01-02T16:20:00
```

In this example only `user@example.com` would have access to a route, and only before `2150-01-02T16:20:00`. After `2150-01-02T16:20:00` the user would see a 403 forbidden page.

Such a policy can be manually maintained by an administrator via the Pomerium Zero UI. They might receive an access request via slack or email and grant access by adding criteria to the policy and saving it. Any routes using that policy would then grant access to the user. No further action would be required by the administrator to revoke access later since the `date` criterion does this automatically.

This workflow may be sufficient for a small organization with infrequent access requests. However it can be improved via automation.

## Automating Just-In-Time Access

In addition to a friendly user interface, Pomerium Zero has a publicly-accessible API. By building a custom application utilizing this API we can automate the request/approve workflow.

To demonstrate this we have built a `jit-example` application in Go available at [github.com/pomerium/jit-example](https://github.com/pomerium/jit-example). It runs a basic web server where users can request access and administrators can approve or reject those requests. This is done by updating a policy in Pomerium Zero which can then be attached to one or more routes.

:::info Use Your Own Start Domain

In the below examples we have used the `curious-cat-9999.pomerium.app` starter domain. You should replace this with your own starter domain or use a custom domain.

:::

### Running

The `jit-example` needs the following environment variables:

- `API_USER_TOKEN`: the Pomerium Zero API User Token used to access the Pomerium Zero API (these can be created at [console.pomerium.app/app/management/api-tokens](https://console.pomerium.app/app/management/api-tokens))
- `CLUSTER_ID`: the ID of the cluster where the jit-example policy will be created
- `JWKS_ENDPOINT`: the URL of the Pomerium route sitting in front of the `jit-example` application (for example `https://jit-example.curious-cat-9999.pomerium.app/.well-known/pomerium/jwks.json`)
- `ORGANIZATION_ID`: the ID of your organization
- `PORT`: the port to run the web server on (defaults to `:8000`)

### Routes

The `jit-example` web application has the following endpoints:

- `/`: the index page where users can request access
- `/admin`: the admin page where administrators can approve access requests

Authentication and authorization of the `jit-example` is done by Pomerium itself. It consumes the [Pomerium JWT assertion header](https://www.pomerium.io/reference/#pass-identity-headers) to determine the current user. Two routes need to be setup in Pomerium Zero:

- `jit-example.curious-cat-9999.pomerium.app`
  - **From** should be `https://jit-example.curious-cat-9999.pomerium.app`
  - **To** should point to your instance of `jit-example`
  - _Any Authenticated User_ should be the attached policy
  - in **Headers**, **Pass Identity Headers** needs to be enabled
- `jit-example.curious-cat-9999.pomerium.app/admin`
  - **From** should be `https://jit-example.curious-cat-9999.pomerium.app`
  - **To** should point to your instance of `jit-example`
  - in **Path Matching**, **Prefix** should be set to `/admin`
  - in **Path Rewriting**, **Prefix Rewrite** should be set to `/admin`
  - A policy restricting the users to administrators only should be attached policy
  - in **Headers**, **Pass Identity Headers** needs to be enabled

With this setup any user will have access to [https://jit-example.curious-cat-9999.pomerium.app](https://jit-example.curious-cat-9999.pomerium.app) but only administrators will be able to approve access requests.
