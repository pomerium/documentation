---
title: Service Accounts
lang: en-US
keywords:
  [
    pomerium,
    service-accounts,
    service accounts,
    pomerium enterprise,
    machine to machine,
    m2m,
  ]
---

## Service Accounts

[Service accounts](/docs/capabilities/service-accounts.md) offer a protected and standardized method of authenticating machine-to-machine communication between services protected by Pomerium.

:::tip

Before you begin, confirm you are in the correct Namespace. A service account can only be used in the Namespace it was created in, including its children Namespaces.

:::

1. From the main menu, select **Service Accounts** under **CONFIGURE**. Click the **+ ADD SERVICE ACCOUNT** button:

   ![The Service Accounts page](./img/service-accounts/console-service-account.png)

1. Service accounts can be unique and exist only for Pomerium, or impersonate directory users from your IdP.

   Give the user a unique ID, or select an existing user to impersonate. Consider referencing the Namespace you're creating it under, for easier reference later. Optionally set an expiration date:

   ![Adding a unique service account](./img/service-accounts/create-service-account.png)

   The user ID set here corresponds to the `User` criteria when editing a policy.

1. After you click **Submit**, the modal presents the JSON web token (**JWT**) for the service account. Temporarily save it somewhere secure, as you will not be able to view it again:

   ![Service Account Added](./img/service-accounts/service-account-jwt.png)

   This JWT must be added to your application configuration to enable direct communication.

1. Edit or create policies to give the service account access to the internal service:

   ![An example policy for a service account](./img/service-accounts/create-policy-1.png)

   ![An example policy for a service account in the policy builder](./img/service-accounts/create-policy-2.png)
