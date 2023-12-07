---
id: conclusion
title: Putting It All Together
description: This tutorial summarizes all that you've learned with suggestions on what to do next.
keywords: [reverse proxy, pomerium, production]
sidebar_label: 10. Conclusion
sidebar_position: 10
---

# Putting It All Together

You’ve made it! Congratulations on completing our Guided Tutorials series! Let’s quickly run through what you’ve learned:

- You configured Pomerium and several upstream services to run in Docker
- You built routes to these services so Pomerium can proxy the requests
- You built authorization policies using PPL and attached them to your routes, which secures access to these services
- You configured Pomerium to handle JWTs for identity verification using the JWT assertion header — this adds an additional layer of security at the application level
- You built and secured TCP connections to SSH, Redis, and Postgres backend services
- You self-hosted Pomerium using your own domain, and configured your own identity provider for authentication
- You configured Pomerium to run in a VM instance
- You enabled Autocert, which automatically generates certificates for upstream connections between Pomerium and your services

Now, you have a production-ready Pomerium instance. You have everything you need to be able to secure tools like [Grafana](https://www.pomerium.com/docs/guides/grafana), [Jenkins](https://www.pomerium.com/docs/guides/jenkins), [Code-server](https://www.pomerium.com/docs/guides/code-server), and more!

## So, what’s next?

Well, there’s a few things you can do:

- Review our Capabilities section to see what other features are available. Here are a few suggestions:
  - Configure [Single Sign-out](https://www.pomerium.com/docs/capabilities/single-sign-out)
  - Add client-side mTLS, also known as [Downstream mTLS](https://www.pomerium.com/docs/capabilities/mtls-clients)
  - Test out logging in Pomerium with our [Audit Logs](https://www.pomerium.com/docs/capabilities/audit-logs)
  - Explore global and route-level settings on our [Reference](https://www.pomerium.com/docs/reference) page
- Check out our [Guides](https://www.pomerium.com/docs/guides) to learn how to secure other services behind Pomerium
- Read some of our [Blog posts](https://www.pomerium.com/blog/) to see what’s happening in the greater Zero Trust community and at Pomerium

You’re bound to have some questions and feedback along the way. Visit our [Discuss page](https://discuss.pomerium.com/) to ask questions, see what our users are up to, and let us know what you thought of our Guided Tutorials!
