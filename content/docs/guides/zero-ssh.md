---
title: Pomerium Zero Native SSH Configuration Guide
sidebar_label: Zero Native SSH Configuration
lang: en-US
keywords: [pomerium, ssh, zero, native]
description: Learn how to configure native SSH access with Pomerium Zero.
---

# Pomerium Zero Native SSH Configuration Guide

This guide covers how to configure [Native SSH access](https://www.pomerium.com/docs/capabilities/native-ssh-access) in Pomerium Zero using the guided SSH route setup.

## Overview

Pomerium Native SSH capability allows you to provide secure, identity-aware SSH access to your infrastructure without requiring VPNs or bastion hosts. Users authenticate through your identity provider and receive short-lived SSH certificates for secure access.

## Prerequisites

- Pomerium Zero cluster already created and running with [Pomerium 0.30](https://www.pomerium.com/blog/announcing-pomerium-v030) or higher
- SSH client on user machines
- Target SSH servers that you want to provide access to
- Identity provider configured with your Pomerium Zero cluster that supports device codes (custom IdP configuration required \- built-in providers may not support this feature)
- Administrative access to the Pomerium Zero console

## Step 1: Generate SSH Keys

Before configuring SSH routes in Pomerium Zero, you'll need to generate the necessary SSH keys on your local machine or server.

### Generate User Certificate Authority (CA) Key Pair

This key pair will be used by Pomerium to sign SSH certificates:

```shell
ssh-keygen -N "" -f pomerium_user_ca_key -C "Pomerium User CA"
```

This creates:

- `pomerium_user_ca_key` (private key to be pasted into Pomerium Zero console)
- `pomerium_user_ca_key.pub` (public key to distribute to target servers)

### Generate SSH Host Keys

Generate SSH host keys for your Pomerium instance to support different algorithms:

```shell
# ED25519 key (recommended for modern systems)
ssh-keygen -N "" -t ed25519 -f pomerium_ssh_host_ed25519_key

# RSA key (3072 bits, for broader compatibility)
ssh-keygen -N "" -t rsa -f pomerium_ssh_host_rsa_key

# ECDSA key (256 bits, alternative option)
ssh-keygen -N "" -t ecdsa -f pomerium_ssh_host_ecdsa_key
```

## Step 2: Configure Target SSH Servers

On each server you want to provide SSH access to, you'll need to configure SSH to trust certificates signed by your Pomerium User CA.

### Install the User CA Public Key

1. Copy the User CA public key to your target servers:

   Copy the `pomerium_user_ca_key.pub` file to your upstream servers. It can be placed in any root-owned location:

   Recommended locations:
   - `/var/lib/pomerium/pomerium_user_ca_key.pub`
   - `/etc/pomerium/pomerium_user_ca_key.pub`
   - `/etc/ssh/pomerium_user_ca_key.pub`

```shell
# Example: Copy to /var/lib/pomerium directory
sudo mkdir -p /var/lib/pomerium
sudo cp pomerium_user_ca_key.pub /var/lib/pomerium/pomerium_user_ca_key.pub
sudo chown root:root /var/lib/pomerium/pomerium_user_ca_key.pub
sudo chmod 600 /var/lib/pomerium/pomerium_user_ca_key.pub
```

### **Configure SSH Daemon**

Configure SSH daemon to trust the User CA.

- Option 1: Add to sshd_config.d (Recommended):

```shell
echo "TrustedUserCAKeys /var/lib/pomerium/pomerium_user_ca_key.pub" | sudo tee /etc/ssh/sshd_config.d/pomerium-ca.conf
```

- Option 2: Add to main sshd_config: Edit `/etc/ssh/sshd_config` and add:

```
# Trust certificates signed by Pomerium's User CA
TrustedUserCAKeys /var/lib/pomerium/pomerium_user_ca_key.pub

# Enable certificate authentication
PubkeyAuthentication yes
```

**Note:** Using the `sshd_config.d` directory approach is recommended as it keeps your configuration organized and avoids modifying the main SSH configuration file.

**Configuration Loading Order:** For SSH certificate authentication via Pomerium, the configuration file loading order typically doesn't matter. The `TrustedUserCAKeys` directive is straightforward \- SSH either trusts the specified CA key or it doesn't. However, if you have multiple configuration files with conflicting SSH authentication settings, the last loaded value will take precedence.

### **Restart SSH Service**

1. Restart the SSH daemon:

Ubuntu/Debian

```shell
sudo systemctl restart ssh
```

Other Linux distributions

```shell
sudo systemctl restart sshd
```

2. Check service status:

Ubuntu/Debian

```shell
sudo systemctl status ssh
```

Other Linux distributions

```shell
sudo systemctl status sshd
```

## Step 3: Configure SSH in Pomerium Zero Console

### Access the Routes Management

1. Log into your Pomerium Zero console
2. Navigate to _Manage → Routes_
3. You'll see the Routes overview page with options to create new routes

### Create Your First SSH Route

1. Click the _New Route_ button
2. Select _Guided SSH Route_

**Note:** If you choose to create a regular _Custom Route_ instead of the _Guided SSH Route_, you'll need to configure the SSH settings separately in your cluster's global settings. Navigate to _Settings → SSH_ in the sidebar to configure the SSH Address, SSH Host Keys, and SSH User CA Key. The guided SSH route approach is recommended as it walks you through both the global SSH configuration and route setup in one workflow.

### Configure Global SSH Settings (First-Time Setup)

When creating your first SSH route, Pomerium Zero will prompt you to configure global SSH settings that apply to your entire cluster:

#### SSH Address Configuration

- **Field:** SSH Address
- **Value:** Enter the address and port where Pomerium will listen for SSH connections
- **Example:** `0.0.0.0:22` (to listen on all interfaces, port 22\)
- **Note:** Use a different port if port 22 is already in use by another service

#### SSH Host Keys Configuration

- **Field:** SSH Host Keys
- **Content:** Add your SSH host private keys one at a time:
- **Key Format Example:**

```
-----BEGIN OPENSSH PRIVATE KEY-----[key content]-----END OPENSSH PRIVATE KEY-----
```

1. First SSH Host Key:
   - Paste the complete contents of your first SSH host private key (e.g., ED25519 key)
   - Replace the placeholder text "Generated key here" with your actual key content
   - Format should include complete private key with headers and footers

####

2. Additional SSH Host Keys:
   - Click the **\+** button to add another SSH Host Key field
   - Add your second key (e.g., RSA key)
   - Click **\+** again to add the third key (e.g., ECDSA key)
   - Include all three key types for maximum compatibility
   - If you need to remove a key completely, click the trash button beside the key field.

####

#### SSH User CA Key Configuration

- **Field:** SSH User CA Key
- **Content:** Paste the complete contents of your `pomerium_user_ca_key` (private key)
- Replace any placeholder text with your actual User CA private key content
- This key will be used to sign user certificates for authentication
- **Format:** Complete private key including headers and footers

#### Need Help with Key Generation?

The console includes a **"How to generate SSH Keys?"** expandable section. You can also click **"I need help"** if you need additional guidance during setup

Click the _Next_ button to proceed to route configuration

### Configure the SSH Route

After setting up the global SSH settings, you'll configure the SSH route:

1. **Route Name:**
   - Enter a descriptive name for your SSH route, e.g. `ssh test`
   - Example: `ssh test` or `production-server-ssh`
2. **From URL:**
   - **Format:** `ssh://[hostname]`
   - Enter the external hostname users will connect to
   - Example: `ssh://myroute` or `ssh://prod-server`
   - This hostname must resolve to your Pomerium Zero cluster's IP address via DNS
3. **To URL:**
   - **Format:** `ssh://[server-ip-or-address]:[port]`
   - Enter the target server address and port
   - Example: `ssh://0.0.0.0:22` or `ssh://10.0.1.100:22`

#### Connection Information

The console will display the SSH command users need to connect:

- **Example command:** `ssh user@myroute@<pomerium.address>`
- **Note:** `user` is the username that would be checked if required by an applied policy

Click the _Next_ button to proceed to policy configuration

### **Configure Access Policies**

The next step is to secure your SSH route with access policies:

#### **Apply Existing Policies**

12. **Select from existing policies:**
    - Use the **"Select policies..."** dropdown to choose from existing cluster policies you already have configured

#### **Create a New Policy**

13. **Create a new policy** (if needed):
    - **Policy Name:** Enter a descriptive name for the policy
    - **Description:** Add an optional description explaining the policy purpose
    - **Add Allow Block:** Click the green **"Add Allow Block"** button to define who can access this SSH route
    - **Add Deny Block:** Click the red **"Add Deny Block"** button to explicitly deny certain users or conditions

#### **Policy Overrides**

14. **Configure overrides** (optional):
    - **Public Access:** Toggle to allow unauthenticated access (not recommended for SSH)
    - **Any Authenticated User:** Toggle to allow any authenticated user access
    - **CORS Preflight:** Usually not needed for SSH routes

15. **Apply Policy:** Click **"Apply Policy"** to save your policy configuration

16. **Click Next** to complete the SSH route setup

**For Advanced Policy Configuration:** For more complex policy rules and conditions beyond the basic Allow/Deny blocks, refer to the [Pomerium Policy Language (PPL) documentation](https://www.pomerium.com/docs/internals/ppl) which covers advanced policy syntax and examples.

### **SSH Username Control**

By default, authenticated users can SSH as any username on the target server (e.g., `ssh root@myroute` or `ssh ubuntu@myroute`). To restrict which Linux usernames people can use, you can add SSH-specific policies:

**Common SSH Username Policies:**

- `ssh_username` \- Restrict to specific usernames (e.g., `ssh_username = 'ubuntu'` only allows SSH as the ubuntu user)
- `ssh_username_matches_claim` \- Username must match a claim from the OAuth token
- `ssh_username_matches_email` \- Username must match the user's email address

**Example:** To ensure users can only SSH as their own username and not as root or other system accounts, you would configure username restrictions in your policy rules. This prevents scenarios where any authenticated user could potentially `ssh root@yourserver` if root access policies aren't properly configured.

## **Step 4: DNS Configuration (Optional)**

Your Pomerium Zero cluster comes with a built-in `*.pomerium.app` domain that you can use immediately without any DNS configuration. However, you can also configure custom DNS if preferred.

### **Using the Built-in Pomerium.app Domain**

**No configuration needed\!** You can start using SSH access right away with your cluster's provided domain:

- Your cluster automatically provides a domain like `[cluster-name].pomerium.app`
- Use this domain when using an SSH client, e.g. `ssh myuser@myroute@[cluster-name].pomerium.app`
- Users can connect immediately without waiting for DNS propagation

### **Custom DNS (Optional)**

If you prefer to use your own domain name, see documentation for [adding a custom domain in Zero](https://www.pomerium.com/docs/get-started/fundamentals/zero/zero-custom-idp#next-steps-add-a-custom-domain). If you use a custom domain, your ssh command would look like, e.g. `ssh myuser@myroute@ssh.my-custom-domain.com`. Note the `ssh.` in the server name. It can literally be anything, but `ssh.` makes the most sense.

**Benefits of custom DNS:**

- Branded domain names for your organization
- Consistent with existing infrastructure naming
- Professional appearance for end users

## **Step 5: User Connection**

Users can now connect using standard SSH commands with no special client configuration needed:

### **Basic SSH Connection Syntax**

```shell
# Basic connection through Pomerium
ssh myuser@myroute@myserver
```

Where:

- `myuser` \- The username on the target server
- `myroute` \- Your Pomerium route hostname (e.g., the "From URL" you configured)
- `myserver` \- This gets resolved by Pomerium to your target server

### **Connection Examples**

```shell
# Using built-in pomerium.app domain
ssh myuser@myroute@wild-lion-3456.pomerium.app

# Using custom domain
ssh myuser@myroute@ssh.company.com
```

**No special SSH client configuration is required** \- this uses standard SSH syntax where Pomerium handles the routing and authentication automatically.

## **Adding Additional SSH Routes**

After your first SSH route is configured, the global SSH settings are saved. For additional SSH routes, you can still use the guide ssh route, or a custom route.

## **Troubleshooting**

**SSH connection debugging:**

- Use `ssh -vvv` for verbose output to see detailed connection and authentication information
- This will show certificate validation, key exchange, and authentication steps

**Certificate authentication failures:**

- Verify the User CA public key is correctly installed on target servers
- Check that `TrustedUserCAKeys` is properly configured in `/etc/ssh/sshd_config` or `/etc/ssh/sshd_config.d/pomerium-ca.conf`
- Restart the SSH service on target servers after configuration changes
- Use `ssh -vvv` to see if certificates are being presented and validated
- **Enable SSH server debugging:** Set `LogLevel DEBUG3` in `/etc/ssh/sshd_config` and check `journalctl -u sshd` for detailed server-side logs

**Port configuration issues:**

- If using a non-standard port, ensure you're connecting to Pomerium and not the SSH server already running on port 22
- Verify the SSH Address configured in Pomerium Zero matches the port you're connecting to
- Check that your DNS or hostname resolves to Pomerium, not directly to the target server

**"Generated key here" placeholder text:**

- Replace the placeholder text with your actual private key content in the Zero console
- Ensure you're copying the private key files, not the .pub files for the SSH Host Keys and User CA Key fields

**SSH username restrictions not working:**

- Check that SSH username policies are properly configured in your route
- Verify the username you're trying to use matches the policy requirements
- **Important:** The username must exist on the target server \- Pomerium policies control which usernames you can use, but the actual user account must exist on the Linux system you're connecting to
- Review policy logs to see if username validation is failing

**SSH key format errors in Zero console:**

- Ensure private keys include complete headers and footers (`-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`)
- Verify keys were generated without passphrases (using `-N ""` option)
- Check for proper line breaks in key content when pasting

**File permission errors:**

- SSH private key files must have restrictive permissions: `chmod 600 /path/to/private_key`
- SSH will refuse to use private keys that are readable by other users (permissions like 644 or 755\)
- User CA public key files should be `chmod 600` and owned by root on target servers

## **Security Best Practices**

### **SSH-Specific Security**

- **Rotate Keys Regularly:** Update SSH keys periodically for security. Generate new User CA and Host keys, update them in the Pomerium Zero console (Settings → SSH), and redistribute the new User CA public key to target servers. Follow your organization's key rotation policies and procedures.
- **Secure Key Storage:** Store private keys in secure locations with proper file permissions. Limit access to SSH key files and protect them from unauthorized access.
- **Username Restrictions:** Use SSH username policies (`ssh_username`, `ssh_username_matches_claim`, `ssh_username_matches_email`) to prevent users from accessing privileged accounts like root unless explicitly authorized.
- **Target Server Hardening:** Apply standard SSH hardening practices on target servers (disable password authentication, etc.) in addition to Pomerium's certificate-based authentication. **Avoid using fail2ban in combination with Pomerium, since you can accidentally lock out everyone.**

### **General Security**

For comprehensive security best practices covering policies, monitoring, network segmentation, and other general Pomerium security considerations, see the [Pomerium Security Documentation](/docs/internals/security).

## **Next Steps**

- [Set up additional SSH routes](/docs/get-started/fundamentals/zero/zero-build-routes) for other servers
- Configure [advanced policies](/docs/internals/ppl) for granular access control
- Implement monitoring and logging for SSH access
- Review and update security policies regularly
