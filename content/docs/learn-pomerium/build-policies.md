---
id: build-policies
title: Build a Simple Policy
description: In lesson 3, you'll learn how to build authorization policies and apply them to your routes.
keywords: [pomerium, authorization policy, access control, secure access, reverse proxy]
sidebar_label: 3. Build Policies
---

# Build a Simple Policy

In this guide, you’ll learn about **Authorization Policies** in Pomerium.

Specifically, we’ll cover:

- What an authorization policy is
- Why you need policies to enforce access control
- How Pomerium Policy Language (PPL) works
- How to build your own policies to protect upstream apps and services

:::note **Before You Start**

Make sure you’ve completed the following tutorials:

- [Get Started](/docs/learn-pomerium/get-started)
- [Build a Simple Route](/docs/learn-pomerium/build-routes)

If you completed these tutorials, you should have:

- A route pointing to Grafana
- A route pointing to the Verify service

Each tutorial builds on the same configuration files. In this tutorial, you’ll build simple policies to secure your services.

:::

## What Is an Authorization Policy?

An **Authorization Policy** defines what resources a user (or group of users) can access within an organization. It’s the logic that tells Pomerium, “this HR employee isn’t authorized to access the engineering staging app.”

From a purely functional point of view, authorization policies seem like a simple concept: They help _manages access_ to apps and services in your organization. But, they can get pretty complicated as your organization scales.

To help you ease into building policies with Pomerium, you should first learn how to build policies in Pomerium with **Pomerium Policy Language** (PPL).

After that, you’ll check out some PPL examples and write your own policies for your routes.

Let’s get started!

### What is Pomerium Policy Language (PPL)?

PPL is a YAML-based notation for creating easy and flexible authorization policies.

PPL allows administrators to express authorization policy in a high-level, declarative language that promotes safe, performant, fine-grained controls.

You can think of it as coded instructions to tell Pomerium how authorization decisions are made for capturing all niche and edge-case scenarios. It’s as flexible as you want it to be!

### ### How does PPL work?

PPL consists of **Rules**, **Actions**, **Logical Operators**, **Criteria**, and **Matchers**.

### #### Rules

A PPL document is either an object or an array of objects. The object represents a rule where the action is the key and the value is an object containing the logical operators.

### #### Actions

Only two actions are supported: `allow` and `deny`. `deny` takes precedence over `allow`. More precisely: a user will have access to a route if **at least one** `allow` rule matches and **no** `deny` rules match.

### #### Logical Operators

A logical operator combines multiple criteria together for the evaluation of a rule.

There are four logical operators:

- `and`
- `or`
- `not`
- `nor`

### #### Criteria

Criteria in PPL are represented as an object where the key is the name and optional sub-path of the criterion, and the value changes depending on which criterion is used.

### #### Matchers

Matchers can be used with logical operators like criteria. PPL offers a variety of matchers, like:

- Certificate Matcher
- Day of Week Matcher
- Date Matcher
- Device Matcher
- String Matcher
- Time of Day Matcher

For an in-depth look at how PPL works, see the [Policy Language](/docs/capabilities/ppl#at-a-glance) page.

### ### Example Policies with PPL

Now that you’ve briefly covered PPL, let’s jump into some simple examples:

**Example 1**: Allow access based on the username

This example instructs Pomerium to only grant a user access if their username is `user1`.

```markdown
# This is a PPL Rule 
policy: # Policy object starts here
   allow: # At least one action
     and:  # Logical operator
        - email: # Criterion
              is: example@domain.com # Value
```

**Example 2**: Allow access based on the domain criterion

This example instructs Pomerium to only grant a user access if their email address matches the **domain** criterion’s value.

The **domain** criterion checks for the domain portion of the user’s email address (the part after `@`). So, if your email were `[bob@gmail.com](mailto:bob@gmail.com)`,  Pomerium would deny you access; if your email were `[bob@example.com](mailto:bob@example.com)`, Pomerium would grant you access.

```yaml

```yaml
policy:
  allow:
    and:
      - domain:
          is: example.com
```

```

**Example 3**: Allow access based on `username` or `domain` criteria

This policy uses the **or** operator, which allows access if either of two conditions is true. In this example, Pomerium will grant access if the email address domain is `example.com` _or_ the username is `user2`.

If neither of these conditions is true, the policy will deny a user access.

```yaml

```yaml
policy:
 allow:
    or:
      - domain:
          is: example.com
      - user:
          is: user2
```

```

Now that we’ve covered some examples, it’s time to attach a policy to a route.

### ### Build Policies for Your Routes

By now, your configuration file should have routes for the Verify service and Grafana. You may have noticed that these routes have the `allow_any_authenticated_user` setting attached to them.

That’s a great setting to test a route with, but we want to secure these routes with policies now.

In your Pomerium configuration file:

- Remove the `allow_any_authenticated_user: true` setting from your Grafana route
- Remove the policy block attached to the Verify service
- Add this policy block below each route (and update the `example.com` domain with your domain):

```yaml

```yaml
policy:
  allow:
    and:
      - domain:
        is: example.com
```

```

Now, access the route.

Pomerium will grant you access to either service if your email address contains the right `domain`.

Great job!

## ## Summary

Now that you’ve built a route and policy to control access, you have the basic building blocks in place to start using Pomerium.

To sum up what you have so far:

- An instance of Pomerium with Docker
- The know-how of how routes and policies work

These are the basics for a reverse proxy, which is intended to act as a public facing representative of the application or service. Everything after is security:

- Who is coming in?
- What are they allowed to do?
- Should Pomerium let it happen?

We start with the first question by setting up ****Identity Verification****.

### Configuration File State

By now, your configuration files should look similar to this:

```markdown
authenticate_service_url: https://authenticate.pomerium.app

routes:
  - from: https://verify.localhost.pomerium.io
    to: http://verify:8000
    policy:
      allow:
        and:
          - domain:
              is: example.com
  - from: https://grafana.localhost.pomerium.io
    to: http://grafana:3000
    policy:
      allow:
        and:
          - domain:
              is: example.com
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
  grafana:
    image: grafana/grafana:latest
    ports:
    - 3000:3000
    volumes:
      - grafana-storage:/var/lib/grafana
volumes:
  grafana-storage:
```
