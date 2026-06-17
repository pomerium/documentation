---
# cSpell:ignore Cloudsmith auditd dbadmin eBPF OpenSSH replayable sshd tsh WORM azblob asciicast
title: Replace Teleport for SSH session recording with Pomerium
sidebar_label: Replace Teleport SSH recording
description: A clientless way to get replayable, identity-aware SSH session evidence without per-host agents, without replacing OpenSSH, and without adopting a whole new infrastructure access platform.
keywords:
  [
    pomerium,
    teleport,
    ssh,
    session recording,
    audit evidence,
    native ssh,
    privileged access,
  ]
lang: en-US
sidebar_class_name: enterprise
---

# Replace Teleport for SSH session recording with Pomerium

If you are running Teleport mostly to record privileged SSH sessions for an auditor, this guide is for you. Pomerium records native SSH through the same identity-aware proxy that already decides who gets access: no `tsh`, no per-host agent, and no replacement for the OpenSSH server you already run. You keep your standard `ssh` workflow; you get replayable, identity-bound evidence in your own object storage.

This is a deliberately narrow claim. Pomerium is not a drop-in replacement for everything Teleport does. The pitch is specific: replace Teleport's SSH session recording, keep what you actually use it for, and drop the parts you do not.

## Is this a fit?

Use this quick test before you invest time:

- **Good fit** - You use Teleport mainly for SSH access and session recording, you want to keep native OpenSSH and standard SSH clients, and you would rather not run an agent on every host. If you already run Pomerium for web and app access, recording closes the SSH evidence gap in a system you already operate.
- **Partial fit** - You use Teleport for SSH plus a few other things. You can move SSH recording to Pomerium and keep Teleport, or another tool, for the rest. Recording is configured per route in Pomerium, so you can start with one sensitive route.
- **Stay where you are, for now** - You depend on Teleport for Kubernetes, databases, Remote Desktop Protocol (RDP), extended Berkeley Packet Filter (eBPF) enhanced recording of commands and file/network events, moderated or observed sessions, or mature multi-party just-in-time approvals. Pomerium does not ship those today. Be honest with yourself about which of these you truly use versus which came bundled.

## How Pomerium records SSH

The model is the same one Pomerium uses for HTTP, applied to SSH:

1. A user connects with a standard SSH client to the Pomerium proxy.
2. Pomerium authenticates them through your identity provider and evaluates your route policy.
3. Pomerium connects to the upstream host with a short-lived certificate signed by its own user CA. The host keeps running stock OpenSSH and only has to trust that CA.
4. On a route with recording enabled, Pomerium captures the interactive terminal stream, chunks it with integrity checksums, and writes it to the object storage you configured.
5. You replay and search recordings in the Pomerium Enterprise Console, and every replay or download is itself an authorized, logged event.

Two things matter for an audit:

- **The evidence is bound to identity, in the same policy that granted access.** The recording, the access decision, and the audit of who replayed or downloaded the recording live in one system, correlated by the same user identity.
- **Recording is per route, not cluster-wide.** Turn it on for a production database route and leave it off for a lab route, in the same policy file.

## What changes when you migrate from Teleport

The shift is from an agent or cluster model to a proxy model:

|  | Teleport (typical) | Pomerium |
| --- | --- | --- |
| On each host | A node agent, or OpenSSH configured for agentless proxy recording | Stock OpenSSH that trusts Pomerium's user CA; no Pomerium agent |
| On each client | `tsh` for full features | Standard `ssh` |
| Where recording is configured | Cluster-wide recording mode | Per route, in your policy |
| Where recordings live | Your S3, GCS, or Azure storage | Your S3, GCS, Azure, or filesystem storage |
| Replay access | Recorded in the audit log | Replay and download are logged events, correlated to the user |

What you give up by moving only SSH recording: Teleport's eBPF enhanced recording, moderated sessions and per-session multi-factor authentication (MFA), mature multi-party approvals, and the breadth of Kubernetes, database, and desktop coverage. If you need those, keep Teleport for them. This guide is about the SSH-recording slice.

## Prerequisites

Before trying the quickstart, make sure you have:

- A working Pomerium deployment that supports [Native SSH Access](/docs/capabilities/native-ssh-access).
- Pomerium Enterprise connected to the data plane that will record SSH sessions. If you are starting from scratch, review the [Enterprise install](/docs/deploy/enterprise/install) docs first.
- A Cloudsmith entitlement for the session-recording extension and Enterprise Console images.
- An identity provider (IdP) configured for the Pomerium deployment.
- An OpenSSH host where you can edit `sshd_config`, install a trusted user CA public key, and restart `sshd`.
- Object storage credentials for S3, GCS, Azure Blob Storage, or a local `file://` path for a non-production test.

## Try it: a self-contained quickstart

The fastest way to see the shape of the migration is to stand up Pomerium in front of an existing OpenSSH server, enable recording on one route, and replay the result in Enterprise Console.

:::enterprise

Session recording is a Pomerium Enterprise capability. The recording extension and Enterprise Console require a Cloudsmith entitlement. [Request a trial](https://www.pomerium.com/demo) if you need access to the Enterprise images.

:::

The core of the Pomerium config is small:

```yaml title="config.yaml"
ssh_address: ':2222'
ssh_user_ca_key_file: /ssh/pomerium_user_ca_key
ssh_host_key_files:
  - /ssh/pomerium_host_ed25519_key

# Your identity provider.
idp_provider: oidc
idp_provider_url: https://your-idp.example.com
idp_client_id: pomerium
idp_client_secret: REPLACE_ME # replace with your IdP client secret

# Enterprise: load the recording extension into the data plane.
envoy_dynamic_extensions:
  - /extensions/session_recording/session_recording_extension.so

# Recordings go to storage you own.
blob_storage:
  bucket_uri: 's3://my-recordings' # or gs://, azblob://, or file:///recordings
  managed_prefix: 'prod-cluster'

routes:
  - from: ssh://prod-db
    to: ssh://10.0.0.5:22 # your existing OpenSSH host
    policy:
      - allow:
          and:
            - email:
                is: alice@example.com
    session_recording:
      enabled: true
```

To make the upstream host trust Pomerium, add its user CA to `sshd` the same way you would for any SSH CA. There is no Pomerium software on the host:

```bash
# On the upstream host:
sudo install -o root -g root -m 0644 pomerium_user_ca_key.pub /etc/ssh/pomerium_user_ca_key.pub
echo 'TrustedUserCAKeys /etc/ssh/pomerium_user_ca_key.pub' | sudo tee /etc/ssh/sshd_config.d/pomerium-ca.conf
sudo systemctl restart sshd
```

Connect through the proxy. Native SSH uses a `user@route@proxy` form: the first part is the account you want on the upstream host, the middle part is the route's `from` hostname, and the last part is the Pomerium SSH address.

```bash
ssh dbadmin@prod-db@pomerium.example.com -p 2222
# Follow the printed URL to log in with your IdP. On success,
# Pomerium proxies you to dbadmin@10.0.0.5 using a short-lived certificate.
```

Run a few commands, then open Enterprise Console to replay the session and download it as an asciicast for your evidence package. Remove that user's access in your policy and the active session is torn down at the next policy re-evaluation. Pomerium revokes live sessions, not just future logins, and there is no upstream key to rotate.

Check your work at three points:

- The SSH client prints a login URL the first time you connect.
- After authentication, `whoami` on the SSH session returns the upstream account, such as `dbadmin`.
- Enterprise Console shows a recording for the route, and downloading it produces an asciicast JSON file.

For emergency removal, revoke the active Pomerium session in Enterprise Console. Policy changes also apply through Pomerium's re-evaluation path, but do not rely on upstream key rotation as your rollback mechanism because the upstream host only trusts Pomerium's user CA.

## Honest limits to plan around

- **Enterprise and release status.** Recording is a Pomerium Enterprise feature delivered through the session-recording extension and Enterprise Console. Use an extension image that matches your Pomerium build, and do not assume SSH session recording is included in older point releases just because native SSH access is available there.
- **Recording is best-effort, not fail-closed.** If recording cannot start or be written, the SSH session is not blocked; it proceeds unrecorded. Enforcing recording before a session can begin is on the roadmap. Until then, keep recorded routes pointed at upstreams reachable only through Pomerium, and pair with host-side logging where you need a hard guarantee.
- **Terminal output, not keystrokes.** Recording captures the interactive terminal stream: what the operator saw. Input the terminal never echoes, such as a password typed at a silent prompt, is not captured. Pair recording with host-side logging, such as `sudo` I/O logging or `auditd`, where you need command-level attribution.
- **You own the durability story.** Pomerium does not encrypt recordings itself; it writes to the storage you configure. Use bucket-default encryption, object lock or Write Once Read Many (WORM) retention to meet your control requirements.

## Clean up or roll back

To stop using Pomerium for the recorded SSH route:

1. Disable or remove the SSH route in Pomerium.
2. Remove the `TrustedUserCAKeys /etc/ssh/pomerium_user_ca_key.pub` line or file from the upstream host's `sshd_config`.
3. Restart `sshd` so the host stops trusting certificates signed by the Pomerium user CA.
4. Keep or delete existing recordings according to your retention policy. Pomerium will not delete evidence objects from your storage as part of route cleanup.

## Troubleshooting

| Symptom | Likely cause | What to check | Fix |
| --- | --- | --- | --- |
| The SSH session works, but no recording appears | The session-recording extension is not loaded, or its version does not match the Pomerium build | Data-plane startup logs and the configured `envoy_dynamic_extensions` path | Mount the correct extension image, update the file path, and restart Pomerium |
| SSH authentication fails after IdP login | The upstream OpenSSH host does not trust the Pomerium user CA | `TrustedUserCAKeys` in `sshd_config`, file ownership, and whether `sshd` was restarted | Install the CA public key as root, reference it from `sshd_config`, and restart `sshd` |
| Recording workers are not ready or objects do not appear in storage | `blob_storage` is incomplete, storage credentials are missing, or the bucket denies writes | `blob_storage.bucket_uri`, provider credentials in the Pomerium environment, and storage provider access logs | Set a valid bucket URI, grant write access to the recording data plane, and restart |
| The SSH client keeps returning to login | The identity provider client configuration does not match the Pomerium route or callback flow | `idp_provider_url`, client ID, client secret, redirect URLs, and IdP logs | Correct the IdP application settings and retry with a fresh SSH connection |

## Next steps

- [Native SSH Access](/docs/capabilities/native-ssh-access) - prerequisites and configuration for the access layer this builds on.
- [SSH Session Recording](/docs/capabilities/session-recording) - the full config surface, storage options, replay flow, and shared-responsibility model.
- [Talk to us](https://www.pomerium.com/demo) - request a Cloudsmith entitlement and help scoping a migration from Teleport SSH recording.
