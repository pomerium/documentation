---
# cSpell:ignore localdomain

title: Glossary
lang: en-US
keywords:
  [
    pomerium,
    identity access proxy,
    beyondcorp,
    zero-trust,
    reverse proxy,
    ztn,
    zta,
    zero trust,
    glossary,
    terms,
    definitions,
  ]
description: A reference glossary of commonly used terms.
---

# Glossary

Pomerium's documentation uses a lot of terminology specific to the networking and security space. This glossary defines common terms readers may be unfamiliar with. If you come across an unfamiliar term not listed in this page, please let us know in our [Discuss support forum][support] and we'll add it.

## General

### Access Token

This general term refers to a string that validates the holder to have a specific set of permissions, issued by an identifying service like an [identity provider]. Most of the access tokens discussed in our docs are [JSON Web Tokens (**JWTs**)][jwt] formatted following the [Oauth 2.0 RFC](https://datatracker.ietf.org/doc/html/rfc6749#section-7.1).

### Context-aware Proxy

A [proxy](https://en.wikipedia.org/wiki/Proxy_server) is an intermediate service between one or more clients or servers. Most of the proxies discussed in our docs are technically [reverse proxies](https://en.wikipedia.org/wiki/Reverse_proxy), sitting between one or more servers and all clients, providing a single point of ingress into a system.

An context-aware proxy can provide contextual access to specific services based on the identity of the client and the state of the device they are using. Using Pomerium, context is provided by the client in the form of a [JWT] issued by the [identity provider], and optionally by the device using a [secure enclave].

### Identity Provider

An identity provider (**IdP**) is used to [authenticate] a user, i.e. confirm their identity. Pomerium uses external IdPs to better integrate into existing environments and to achieve strong separation of services. Pomerium provides [single sign-on] from your IdP to your entire network infrastructure from a single location.

### JavaScript Object Notation

Commonly shortened to **JSON**, [JavaScript object notation](https://en.wikipedia.org/wiki/JSON) is a common format used to represent and share structured sets of data as arrays of key-value pairs.

### JSON Web Key Sets

Usually abbreviate as **JWKS**, this is a [JSON]-formatted set of one or more keys provided by a trusted issuer and used by service to verify [JWTs] provided by a client. Formatting is defined by the [JSON Web Key RFC](https://datatracker.ietf.org/doc/html/rfc7517).

### JSON Web Token

Often referred to as **JWTs**, a JSON web token is a [JSON]-formatted string provided to a user by an [identity provider], which validates the user's identity to subsequent services (such as a [context-aware proxy]). JWTs are formatted according to the [JSON Web Token RFC](https://datatracker.ietf.org/doc/html/rfc7519)

### Namespace

"Namespaces" is an over-saturated term, having different meanings in different contexts. [Pomerium Enterprise][pom-namespace] uses Namespaces to provide separation of access and control to [routes]. Kubernetes uses their [namespaces][k8s-namespace] to isolate groups of resources within a cluster.

### Perimeter

The term "Perimeter" in the context of Pomerium and general networking usually refers to your internal network, and common tools like firewalls used to restrict access to it. [Historically](/docs/concepts/zero-trust#history), most security models used the perimeter as the main layer of protection to a network system. The principles of [zero trust] assume that the perimeter can be (and likely is) compromised, and require security between each connection, including those between internal services.

### Policy

A Policy defines what services behind Pomerium a user is authorized to access based on policy criteria, such as user identity and device identity, and the associated request context.

Policies can be applied to [Routes](/docs/capabilities/routing) directly, or enforced within a [Namespace](/docs/capabilities/namespacing). Policies allow operators to add authorization and access control to a single route or collection of routes.

### Route

Specific to Pomerium, a route is a defined path from outside the network (through a public domain) to an internal service. At a very basic level, a route sends traffic from `external-address.company.com` to `internalService-address.localdomain`; a route is restricted by its associated policies and encrypted by your TLS certificates.

Routes can be defined in the [configuration](/docs/reference/routes) for open-source Pomerium or the [Pomerium Enterprise Console](/docs/deploy/enterprise).

More advanced configurations allow identity header pass-through, path and prefix rewrites, request and response header modification, load balancer services, and other full featured ingress capabilities.

For more information, see the [Routing Capabilities](/docs/capabilities/routing) page.

### Service Account

A service account provides bearer token based authentication for machine-to-machine communication through Pomerium to your protected endpoints. A service account can provide authentication for monitoring services, create API integrations, and other non-human driven scripts or services.

A service account identity can either be based on a user entry in your IdP Directory, or exist as a custom identity managed in a Pomerium Console [Namespace](/docs/capabilities/namespacing).

See the [Service Accounts](/docs/capabilities/service-accounts) capabilities page for more information on how to use service accounts in Pomerium.

### Single Sign-On

Single Sign-On (**SSO**) is the most frequently asked for requirement by enterprise organizations looking to adopt new SaaS applications. SSO enables authentication via an organization’s [identity provider], such as [Google Workspace](/docs/identity-providers/google) or [Okta](/docs/identity-providers/okta), as opposed to users or IT admins managing hundreds, if not thousands, of usernames and passwords.

### Stateless

Another overloaded term in the tech space, we use the term stateless when talking about Pomerium's Proxy, Authenticate, and Authorize [components](/docs/internals/architecture#component-level). They are stateless because they rely on the Databroker component to provide persistent data. This means that the other services can be destroyed, recreated, and scaled horizontally without any data loss.

## Networking

### Custom Resource Definition

A custom resource definition (**CRD**) defines a custom resource that extends the Kubernetes API to provide additional functionality specific to a custom software set. For example, [cert-manager](https://cert-manager.io/) defines certificate issuers [using a CRD](https://github.com/cert-manager/sample-external-issuer/blob/main/config/crd/bases/sample-issuer.example.com_issuers.yaml).

### East-west Traffic

[East-west traffic](https://en.wikipedia.org/wiki/East-west_traffic) refers to network communication between services within an internal network, Kubernetes cluster, private cloud network, etc. This term differentiates this communication from [north-south traffic].

### HTTP Strict Transport Security

Usually shortened to **HSTS**, this is a policy whereby a site secured with [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) provides a response header defining a period of time (usually set to a year or more) during which the browser should only access the server over TLS, and only when it provides the same certificate. This policy helps mitigate man-in-the-middle (**MiTM**) attacks. We suggest only defining an HSTS policy after a service has been fully configured and tested to avoid issues when switching from development to production certificates.

### North-south Traffic

[North-south traffic](https://en.wikipedia.org/wiki/North-south_traffic) refers to network communication from end users to services within an internal network, Kubernetes cluster, private cloud network, etc. This term differentiates this communication from [east-west traffic].

### Upstream / Downstream

When discussing traffic between end users and services, we use "upstream" to refer to the services and/or service mesh that Pomerium protects & secures. Inversely, "downstream" refers to traffic between Pomerium and end users, or any other party connecting from the Internet.

## Security

### Authentication

Abbreviated as **AuthN**, this refers to the validation of a user's identity. It can also refer to validation of an user's [device](/docs/concepts/device-identity). Access to a protected resource is usually granted only after a client's authentication and [authorization] are validated. This is usually done by verifying the [JWT] provided by the client.

### Authorization

Abbreviated as **AuthZ**, authorization is the process of validating a client's access to a protected resource. This is usually done after a client as been [authenticated], and is determined by comparing the contents of the clients [JWT] against the [policies] present for the [route].

### Least User Privilege

"Least user privilege" is a core concept of the [zero trust] model. It's the practice of only providing a user as much access to protected systems as is required for them to operate in their job's function. This is a risk-mitigation strategy; since compromised user credentials can only be used to access services they are granted access to, users that do not need access to highly sensitive services should not have them.

### Mutual Authentication

Mutual authentication is the security strategy of having both sides of a connection validate the identity of the other. This reduces the possibility of bad actors to impersonate valid communication endpoints. This topic is discussed in detail in [Mutual Authentication: A Component of Zero Trust](/docs/concepts/mutual-auth).

### Secure Enclave

A Secure Enclave is a sub-component or device physically bound to a specific device that can safely store sensitive data used to validate [device identity](/docs/concepts/device-identity).

### Security Keys

Security keys are often used to provide a physical resource to perform multi-factor authentication (**MFA**). Common examples include Yubico's Yubikey and Google's Titan Security Key.

### Trusted Execution Environment

A **TEE** is a physical method of executing cryptographic functions using data that cannot be accessed by the rest of the physical device. This is a core part of [device identity](/docs/concepts/device-identity) validation.

### Zero Trust

Zero trust is a philosophy and/or framework for security models that includes several facets. We go into detail in our [Background](/docs/concepts/zero-trust#zero-trust) page, but briefly: zero-trust assumes that any one method of security is fallible, and defines a set of security principles that work in concert to provide the highest security without over-burdening administrators, end users, or network devices with extraneous overhead.

[authenticate]: #authentication
[authenticated]: #authentication
[authorization]: #authorization
[east-west traffic]: #east-west-traffic
[identity provider]: #identity-provider
[context-aware proxy]: #context-aware-proxy
[json]: #javascript-object-notation
[jwt]: #json-web-token
[jwts]: #json-web-token
[k8s-namespace]: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
[namespace]: #namespace
[north-south traffic]: #north-south-traffic
[policies]: #policy
[pomerium enterprise]: /docs/deploy/enterprise/install
[pom-namespace]: /docs/internals/glossary
[route]: #route
[routes]: #route
[secure enclave]: #secure-enclave
[single sign-on]: #single-sign-on
[support]: https://discuss.pomerium.com/c/support/9
[zero trust]: #zero-trust
