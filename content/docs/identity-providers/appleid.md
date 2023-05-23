---
id: apple
title: Apple
keywords: [apple id, sign in with apple, identity provider, idp]
lang: en-US
description: Integrate single sign-on with Apple and Pomerium.
pagination_prev: null
pagination_next: null
---

# Apple

Integrate Apple as an identity provider with Pomerium using Apple's **Sign in with Apple** authentication service. 

To complete this guide:
- [Install Pomerium](/docs/deploying)
- Enroll in Apple's [Apple Developer Program](https://apps.apple.com/us/app/wwdc/id640199958)

## Set up Apple

In your **Account** dashboard, go to **Certificates, IDs, & Profiles**.

### Configure App ID

Register an **App ID**:
1. Select **Identifiers**
1. Create a new Identifier (**+**) and select **App IDs**
1. For app type, select **App**
1. Enter a **Description**
1. For **Bundle ID**, select **Explicit** and enter a domain (for example, `com.app.test`)
1. Under **Capabilities**, select **Sign In with Apple**

  ![Register an App ID](./img/apple/apple-register-app.png)

### Configure Services ID

Register a **Services ID**:
1. Go back to **Certificates, Identifiers & Profiles**
1. Select **+** and select **Services IDs**
1. Enter a **Description** and **Identifier** (for example, `com.app.test.dev-service`)
1. Register your Services ID

Edit your **Services ID Configuration**:
1. Under the **App ID** dropdown, select **Services IDs**
1. Select your **Services ID**
1. Enable **Sign In with Apple** and select **Configure**

In the **Web Authentication Configuration** window:
1. Select the **Primary App ID**
1. In **Domains and Subdomains**, enter your authenticate service URL (for example, `authenticate.service.url.net`)
1. In **Return URLs**, enter your authenticate service URL and the `/oauth2/callback` path (for example, `https://authenticate.service.url.net/oauth2/callback`)
1. After configuring, select **Continue**

![Add web authentication configuration](./img/apple/apple-web-authn-config.png)

Save your Settings ID configuration. 

### Create a signing key

1. Go back to the **Certificates, Identifiers & Profiles** page
1. From the sidebar, select **Keys**
1. Create a new key
1. Under **Register a New Key**, enter a **Key Name**
1. Select **Sign in with Apple** and **Configure**
1. In **Configure Key**, select the **Primary App ID**

![Register a new key](./img/apple/apple-register-new-key.png)

After successfully creating a signing key, Apple will prompt you to download your key. 

![Download signing key](./img/apple/apple-download-key.png)

Download the key and store it in your project. You will need to pass in the key in order to generate your **Client Secret** (JWT). 

## Set up Pomerium







