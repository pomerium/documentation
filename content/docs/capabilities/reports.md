---
title: Reports
lang: en-US
keywords: [configuration, options, settings, pomerium, enterprise, reference]
---

## Traffic

View the traffic running through Pomerium. Filter by [Route][route-concept] name, or date range.

![The Traffic page in Pomerium Enterprise](./img/reports/traffic-fullpage.png)

## Runtime

Monitor how many system resources Pomerium is consuming. Filter by date range, service, and instance.

![The Runtime Info page in Pomerium Enterprise](./img/reports/runtime-fullpage.png)

## Sessions

View active Sessions. From here you can revoke sessions, filter by session or user information, or revoke one or multiple sessions. You can also export the data.

![The Sessions page in Pomerium Enterprise](./img/reports/sessions-fullpage.png)

## Events

The events page displays the log output of Envoy as it process changes from Pomerium and applies updates to the underlying services.

![The Events page in Pomerium Enterprise](./img/reports/events-fullpage.png)

The most common updates are to Pomerium Proxy services, which are updated every time a Route or Policy is created or updated.

The value under **Resource ID** will usually match the resource ID of a [Policy][policy-reference], visible in the Policy under **Change History** or in the URL. A value of "Pomerium Restarted" refers to when services are reloaded, usually due to a system update.

## Deployments

From the **Deployment History** page administrators can review changes made to their Pomerium configuration.

The default view shows all changes made through Pomerium Enterprise. Use the **COMPARE** button next to an entry to filter to only changes that affected that resource. Select two versions of that resource, then **DIFF** to see what changed:

![A screenshot showing the diff of a change to a route, adding a policy](./img/reports/deployment-diff.png)

[route-concept]: /docs/concepts/routes
[route-reference]: /docs/capabilities/routing
[namespace-concept]: /docs/concepts/namespacing
[namespace-reference]: /docs/enterprise/reference/configure#namespaces
[service-accounts-concept]: /docs/capabilities/service-accounts.md
[policy-reference]: /docs/concepts/policies
