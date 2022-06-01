---
title: Changelog
lang: en-US
pagination_prev: null
pagination_next: null
---

## [v0.17.2](https://github.com/pomerium/pomerium/tree/v0.17.2) (2022-04-22)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.17.1...v0.17.2)

### Fixed

- authorize: pass idp id for webauthn url, allow unauthenticated access to static files [\#3284] (@calebdoxsey)
- config: fix DefaultTransport so it is still a \*http.Transport [\#3260] (@calebdoxsey)

### Dependency

- chore\(deps\): bump actions/setup-python from 3.1.0 to 3.1.2 [\#3266]

### Docs

- Add UUID to docs yaml blocks \(\#3251\) [\#3259] (@alexfornuto)

## [v0.17.1](https://github.com/pomerium/pomerium/tree/v0.17.1) (2022-03-30)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.17.0...v0.17.1)

### Security Notice

This release includes a fix to a medium severity [security issue](https://github.com/pomerium/pomerium/security/advisories/GHSA-q98f-2x4p-prjr).

We recommend that all users upgrade.

### Security

- authenticate: fix debug and metrics endpoints [\#3215](https://github.com/pomerium/pomerium/pull/3215) (@backport-actions-token[bot])

### Fixed

- authenticate: fix internal url with webauthn [\#3195](https://github.com/pomerium/pomerium/pull/3195) (@backport-actions-token[bot])
- github: fix missing groups [\#3176](https://github.com/pomerium/pomerium/pull/3176) (@backport-actions-token[bot])

## [v0.17.0](https://github.com/pomerium/pomerium/tree/v0.17.0) (2022-03-04)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.16.4...v0.17.0)

### New

- adds pomerium version to the user info endpoint [\#3093](https://github.com/pomerium/pomerium/pull/3093) (@nhayfield)
- grpc: remove ptypes references [\#3078](https://github.com/pomerium/pomerium/pull/3078) (@calebdoxsey)
- userinfo: add webauthn buttons to user info page [\#3075](https://github.com/pomerium/pomerium/pull/3075) (@calebdoxsey)
- Style update for User Info Endpoint [\#3055](https://github.com/pomerium/pomerium/pull/3055) (@nhayfield)
- session: remove unused session state properties [\#3022](https://github.com/pomerium/pomerium/pull/3022) (@calebdoxsey)
- frontend: react+mui [\#3004](https://github.com/pomerium/pomerium/pull/3004) (@calebdoxsey)
- controlplane: add compression middleware [\#3000](https://github.com/pomerium/pomerium/pull/3000) (@calebdoxsey)
- authenticate: fix expiring user info endpoint [\#2976](https://github.com/pomerium/pomerium/pull/2976) (@calebdoxsey)
- last known metric error [\#2974](https://github.com/pomerium/pomerium/pull/2974) (@wasaga)
- directory: save IDP errors to databroker, put event handling in dedicated package [\#2957](https://github.com/pomerium/pomerium/pull/2957) (@calebdoxsey)
- google: support groups for users outside of the organization [\#2950](https://github.com/pomerium/pomerium/pull/2950) (@calebdoxsey)
- return explicit error when directory sync is disabled [\#2949](https://github.com/pomerium/pomerium/pull/2949) (@wasaga)
- authenticate: add device-enrolled page [\#2892](https://github.com/pomerium/pomerium/pull/2892) (@calebdoxsey)
- remove deprecated ioutil usages [\#2877](https://github.com/pomerium/pomerium/pull/2877) (@cfanbo)

### Fixed

- databroker: use contextual logging for errors, use original record type for encryption [\#3096](https://github.com/pomerium/pomerium/pull/3096) (@calebdoxsey)
- fix link for picture in avatar [\#3066](https://github.com/pomerium/pomerium/pull/3066) (@nhayfield)
- userinfo: fix logout button, add sign out confirm page [\#3058](https://github.com/pomerium/pomerium/pull/3058) (@calebdoxsey)
- config: fix httptest local certificate [\#3056](https://github.com/pomerium/pomerium/pull/3056) (@calebdoxsey)
- proxy: fix error page [\#3020](https://github.com/pomerium/pomerium/pull/3020) (@calebdoxsey)
- deployment: only include pomerium binary [\#3007](https://github.com/pomerium/pomerium/pull/3007) (@travisgroth)
- auth0: support explicit domains in the service account [\#2996](https://github.com/pomerium/pomerium/pull/2996) (@backport-actions-token[bot])
- auth0: support explicit domains in the service account [\#2980](https://github.com/pomerium/pomerium/pull/2980) (@calebdoxsey)
- config: fix TLS config when address and grpc\_address are the same [\#2975](https://github.com/pomerium/pomerium/pull/2975) (@calebdoxsey)
- deployment: enable goreleaser buildx [\#2968](https://github.com/pomerium/pomerium/pull/2968) (@travisgroth)
- config: fix policy matching for regular expressions [\#2966](https://github.com/pomerium/pomerium/pull/2966) (@calebdoxsey)
- fix: frontend html tag mismatch [\#2954](https://github.com/pomerium/pomerium/pull/2954) (@cfanbo)
- devices: shrink credentials by removing unnecessary data [\#2951](https://github.com/pomerium/pomerium/pull/2951) (@calebdoxsey)
- Remove spurious \</ul\> tags [\#2946](https://github.com/pomerium/pomerium/pull/2946) (@sylr)
- authenticate: support webauthn redirects to non-pomerium domains [\#2936](https://github.com/pomerium/pomerium/pull/2936) (@calebdoxsey)
- webauthn: use absolute URL for delete redirect [\#2935](https://github.com/pomerium/pomerium/pull/2935) (@calebdoxsey)
- authenticate: add callback endpoint [\#2931](https://github.com/pomerium/pomerium/pull/2931) (@calebdoxsey)
- devices: treat undefined device types as any [\#2927](https://github.com/pomerium/pomerium/pull/2927) (@calebdoxsey)
- deployment: fix distroless base arch [\#2925](https://github.com/pomerium/pomerium/pull/2925) (@travisgroth)
- handle device states in deny block, fix default device type [\#2919](https://github.com/pomerium/pomerium/pull/2919) (@calebdoxsey)
- envoy: check certificates for must-staple flag and drop them if they are missing the response [\#2909](https://github.com/pomerium/pomerium/pull/2909) (@calebdoxsey)
- integration: fix default port for verify service [\#2895](https://github.com/pomerium/pomerium/pull/2895) (@calebdoxsey)

### Dependency

- chore\(deps\): bump actions/setup-node from 2 to 3 [\#3089](https://github.com/pomerium/pomerium/pull/3089) (@dependabot[bot])
- chore\(deps\): bump actions/setup-python from 2 to 3 [\#3088](https://github.com/pomerium/pomerium/pull/3088) (@dependabot[bot])
- chore\(deps\): bump mikefarah/yq from 4.20.2 to 4.21.1 [\#3087](https://github.com/pomerium/pomerium/pull/3087) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.69.0 to 0.70.0 [\#3086](https://github.com/pomerium/pomerium/pull/3086) (@dependabot[bot])
- chore\(deps\): bump url-parse from 1.5.7 to 1.5.10 [\#3085](https://github.com/pomerium/pomerium/pull/3085) (@dependabot[bot])
- chore\(deps\): bump prismjs from 1.26.0 to 1.27.0 [\#3084](https://github.com/pomerium/pomerium/pull/3084) (@dependabot[bot])
- deps: bump envoy to v1.20.2 [\#3082](https://github.com/pomerium/pomerium/pull/3082) (@travisgroth)
- chore\(deps\): bump mikefarah/yq from 4.20.1 to 4.20.2 [\#3072](https://github.com/pomerium/pomerium/pull/3072) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.68.0 to 0.69.0 [\#3071](https://github.com/pomerium/pomerium/pull/3071) (@dependabot[bot])
- chore\(deps\): bump github.com/golangci/golangci-lint from 1.44.0 to 1.44.2 [\#3070](https://github.com/pomerium/pomerium/pull/3070) (@dependabot[bot])
- chore\(deps\): bump url-parse from 1.5.1 to 1.5.7 [\#3068](https://github.com/pomerium/pomerium/pull/3068) (@dependabot[bot])
- chore\(deps\): bump github.com/gorilla/websocket from 1.4.2 to 1.5.0 [\#3052](https://github.com/pomerium/pomerium/pull/3052) (@dependabot[bot])
- chore\(deps\): bump mikefarah/yq from 4.18.1 to 4.20.1 [\#3051](https://github.com/pomerium/pomerium/pull/3051) (@dependabot[bot])
- chore\(deps\): bump follow-redirects from 1.14.7 to 1.14.8 [\#3043](https://github.com/pomerium/pomerium/pull/3043) (@dependabot[bot])
- chore\(deps\): bump go.uber.org/zap from 1.20.0 to 1.21.0 [\#3041](https://github.com/pomerium/pomerium/pull/3041) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.37.1 to 0.37.2 [\#3040](https://github.com/pomerium/pomerium/pull/3040) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.66.0 to 0.68.0 [\#3033](https://github.com/pomerium/pomerium/pull/3033) (@dependabot[bot])
- deps: increase yarn network timeout [\#3018](https://github.com/pomerium/pomerium/pull/3018) (@travisgroth)
- chore\(deps\): bump github.com/caddyserver/certmagic from 0.15.2 to 0.15.3 [\#3014](https://github.com/pomerium/pomerium/pull/3014) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.36.1 to 0.37.1 [\#3013](https://github.com/pomerium/pomerium/pull/3013) (@dependabot[bot])
- chore\(deps\): bump github.com/shirou/gopsutil/v3 from 3.21.12 to 3.22.1 [\#3012](https://github.com/pomerium/pomerium/pull/3012) (@dependabot[bot])
- chore\(deps\): bump github.com/mholt/acmez from 1.0.1 to 1.0.2 [\#3011](https://github.com/pomerium/pomerium/pull/3011) (@dependabot[bot])
- chore\(deps\): bump mermaid from 8.12.1 to 8.13.10 [\#3010](https://github.com/pomerium/pomerium/pull/3010) (@dependabot[bot])
- chore\(deps\): bump follow-redirects from 1.14.1 to 1.14.7 [\#3009](https://github.com/pomerium/pomerium/pull/3009) (@dependabot[bot])
- chore\(deps\): bump prismjs from 1.24.1 to 1.26.0 [\#3008](https://github.com/pomerium/pomerium/pull/3008) (@dependabot[bot])
- chore\(deps\): bump mikefarah/yq from 4.17.2 to 4.18.1 [\#2989](https://github.com/pomerium/pomerium/pull/2989) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/grpc from 1.43.0 to 1.44.0 [\#2988](https://github.com/pomerium/pomerium/pull/2988) (@dependabot[bot])
- chore\(deps\): bump github.com/golangci/golangci-lint from 1.43.0 to 1.44.0 [\#2987](https://github.com/pomerium/pomerium/pull/2987) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.65.0 to 0.66.0 [\#2986](https://github.com/pomerium/pomerium/pull/2986) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/client\_golang from 1.12.0 to 1.12.1 [\#2985](https://github.com/pomerium/pomerium/pull/2985) (@dependabot[bot])
- chore\(deps\): bump mikefarah/yq from 4.16.2 to 4.17.2 [\#2963](https://github.com/pomerium/pomerium/pull/2963) (@dependabot[bot])
- chore\(deps\): bump github.com/google/go-cmp from 0.5.6 to 0.5.7 [\#2962](https://github.com/pomerium/pomerium/pull/2962) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/client\_golang from 1.11.0 to 1.12.0 [\#2961](https://github.com/pomerium/pomerium/pull/2961) (@dependabot[bot])
- chore\(deps\): bump github.com/openzipkin/zipkin-go from 0.3.0 to 0.4.0 [\#2942](https://github.com/pomerium/pomerium/pull/2942) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.64.0 to 0.65.0 [\#2941](https://github.com/pomerium/pomerium/pull/2941) (@dependabot[bot])
- chore\(deps\): bump github.com/envoyproxy/protoc-gen-validate from 0.6.2 to 0.6.3 [\#2940](https://github.com/pomerium/pomerium/pull/2940) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.36.0 to 0.36.1 [\#2939](https://github.com/pomerium/pomerium/pull/2939) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.63.0 to 0.64.0 [\#2913](https://github.com/pomerium/pomerium/pull/2913) (@dependabot[bot])
- chore\(deps\): bump go.uber.org/zap from 1.19.1 to 1.20.0 [\#2912](https://github.com/pomerium/pomerium/pull/2912) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.35.0 to 0.36.0 [\#2911](https://github.com/pomerium/pomerium/pull/2911) (@dependabot[bot])
- chore\(deps\): bump github.com/go-chi/chi from 1.5.4 to 4.1.2+incompatible [\#2910](https://github.com/pomerium/pomerium/pull/2910) (@dependabot[bot])
- envoy: upgrade to 1.20.1 [\#2902](https://github.com/pomerium/pomerium/pull/2902) (@calebdoxsey)
- chore\(deps\): bump github.com/shirou/gopsutil/v3 from 3.21.11 to 3.21.12 [\#2886](https://github.com/pomerium/pomerium/pull/2886) (@dependabot[bot])
- chore\(deps\): bump github.com/rs/cors from 1.8.0 to 1.8.2 [\#2855](https://github.com/pomerium/pomerium/pull/2855) (@dependabot[bot])
- chore\(deps\): bump github.com/google/go-jsonnet from 0.17.0 to 0.18.0 [\#2854](https://github.com/pomerium/pomerium/pull/2854) (@dependabot[bot])
- chore\(deps\): bump mikefarah/yq from 4.16.1 to 4.16.2 [\#2853](https://github.com/pomerium/pomerium/pull/2853) (@dependabot[bot])

### Deployment

- deployment: remove DST cert workaround from debug image [\#2958](https://github.com/pomerium/pomerium/pull/2958) (@travisgroth)
- deployment: multi-arch master images [\#2896](https://github.com/pomerium/pomerium/pull/2896) (@travisgroth)

### Changed

- config: add idp\_client\_id and idp\_client\_secret to protobuf [\#3060](https://github.com/pomerium/pomerium/pull/3060) (@calebdoxsey)
- Extract email for active directory users that don't have access to exchange [\#3053](https://github.com/pomerium/pomerium/pull/3053) (@JBodkin-Amphora)
- disable blank github issues [\#2898](https://github.com/pomerium/pomerium/pull/2898) (@travisgroth)

## [v0.16.4](https://github.com/pomerium/pomerium/tree/v0.16.4) (2022-02-25)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.16.3...v0.16.4)

### Dependency

- deps: update envoy to v1.19.3 [\#3083](https://github.com/pomerium/pomerium/pull/3083) (@travisgroth)

## [v0.16.3](https://github.com/pomerium/pomerium/tree/v0.16.3) (2022-02-11)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.16.2...v0.16.3)

### Fixed

- deployment: only include pomerium binary [\#3007](https://github.com/pomerium/pomerium/pull/3007) (@travisgroth)
- auth0: support explicit domains in the service account [\#2996](https://github.com/pomerium/pomerium/pull/2996) (@backport-actions-token[bot])

## [v0.16.2](https://github.com/pomerium/pomerium/tree/v0.16.2) (2022-01-25)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.16.1...v0.16.2)

### Fixed

- config: fix policy matching for regular expressions [\#2969](https://github.com/pomerium/pomerium/pull/2969) (@backport-actions-token[bot])

## [v0.16.1](https://github.com/pomerium/pomerium/tree/v0.16.1) (2022-01-19)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.16.0...v0.16.1)

### Fixed

- webauthn: use absolute URL for delete redirect [\#2937](https://github.com/pomerium/pomerium/pull/2937) (@backport-actions-token[bot])
- handle device states in deny block, fix default device type [\#2924](https://github.com/pomerium/pomerium/pull/2924) (@backport-actions-token[bot])
- integration: fix default port for verify service [\#2908](https://github.com/pomerium/pomerium/pull/2908) (@backport-actions-token[bot])

## [v0.16.0](https://github.com/pomerium/pomerium/tree/v0.16.0) (2021-12-22)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.15.8...v0.16.0)

### Breaking

- identity: only assign `access\_type` uri params to google. [\#2782](https://github.com/pomerium/pomerium/pull/2782) (@desimone)
- tls: fallback to self-signed certificate [\#2760](https://github.com/pomerium/pomerium/pull/2760) (@calebdoxsey)
- github: use GraphQL API to reduce number of API calls for directory sync [\#2715](https://github.com/pomerium/pomerium/pull/2715) (@calebdoxsey)

### New

- more idp metrics [\#2842](https://github.com/pomerium/pomerium/pull/2842) (@wasaga)
- devices: add experimental icon [\#2836](https://github.com/pomerium/pomerium/pull/2836) (@calebdoxsey)
- devices: switch "default" device type to two built-in default device types [\#2835](https://github.com/pomerium/pomerium/pull/2835) (@calebdoxsey)
- dashboard: improve display of device credentials, allow deletion [\#2829](https://github.com/pomerium/pomerium/pull/2829) (@calebdoxsey)
- ppl: add support for http\_path and http\_method [\#2813](https://github.com/pomerium/pomerium/pull/2813) (@calebdoxsey)
- config: add internal service URLs [\#2801](https://github.com/pomerium/pomerium/pull/2801) (@calebdoxsey)
- envoy: add hash policy and routing key for hash-based load balancers [\#2791](https://github.com/pomerium/pomerium/pull/2791) (@calebdoxsey)
- authorize: support X-Pomerium-Authorization in addition to Authorization [\#2780](https://github.com/pomerium/pomerium/pull/2780) (@calebdoxsey)
- envoy: treat configuration errors as fatal [\#2777](https://github.com/pomerium/pomerium/pull/2777) (@calebdoxsey)
- envoy: add support for bind\_config bootstrap options [\#2772](https://github.com/pomerium/pomerium/pull/2772) (@calebdoxsey)
- authenticate: redirect / to /.pomerium/ [\#2770](https://github.com/pomerium/pomerium/pull/2770) (@calebdoxsey)
- device: add type id and credential id to enrollment for easier referencing [\#2749](https://github.com/pomerium/pomerium/pull/2749) (@calebdoxsey)
- databroker: add additional log for config source [\#2718](https://github.com/pomerium/pomerium/pull/2718) (@calebdoxsey)
- grpc: remove peer field from logs [\#2712](https://github.com/pomerium/pomerium/pull/2712) (@calebdoxsey)
- desktop client api [\#2711](https://github.com/pomerium/pomerium/pull/2711) (@wasaga)
- telemetry: improve zipkin error logs [\#2710](https://github.com/pomerium/pomerium/pull/2710) (@calebdoxsey)
- authorize: add support for webauthn device policy enforcement [\#2700](https://github.com/pomerium/pomerium/pull/2700) (@calebdoxsey)
- webauthn: update session to support device credentials per type [\#2699](https://github.com/pomerium/pomerium/pull/2699) (@calebdoxsey)
- ppl: add support for additional data [\#2696](https://github.com/pomerium/pomerium/pull/2696) (@calebdoxsey)
- Add additional ACME CA \(autocert\) options [\#2695](https://github.com/pomerium/pomerium/pull/2695) (@hslatman)
- skip configuration updates to the most recent one [\#2690](https://github.com/pomerium/pomerium/pull/2690) (@wasaga)
- authenticate: add support for webauthn [\#2688](https://github.com/pomerium/pomerium/pull/2688) (@calebdoxsey)
- webauthnutil: add helpers for webauthn [\#2686](https://github.com/pomerium/pomerium/pull/2686) (@calebdoxsey)
- devices: add device protobuf types [\#2682](https://github.com/pomerium/pomerium/pull/2682) (@calebdoxsey)
- cryptutil: add SecureToken [\#2681](https://github.com/pomerium/pomerium/pull/2681) (@calebdoxsey)
- config/envoyconfig: better duplicate message [\#2661](https://github.com/pomerium/pomerium/pull/2661) (@desimone)
- pomerium-cli: add support for a custom browser command [\#2617](https://github.com/pomerium/pomerium/pull/2617) (@calebdoxsey)
- ppl: pass contextual information through policy [\#2612](https://github.com/pomerium/pomerium/pull/2612) (@calebdoxsey)
- add description to service accounts [\#2611](https://github.com/pomerium/pomerium/pull/2611) (@nhayfield)
- DOCS: Add copy button to code snippets [\#2597](https://github.com/pomerium/pomerium/pull/2597) (@alexfornuto)
- pomerium-cli: use cache dir instead of config dir [\#2588](https://github.com/pomerium/pomerium/pull/2588) (@calebdoxsey)
- cli: update tcp log output format [\#2586](https://github.com/pomerium/pomerium/pull/2586) (@travisgroth)
- directory: implement exponential backoff for refresh [\#2570](https://github.com/pomerium/pomerium/pull/2570) (@calebdoxsey)
- google: support provider URL [\#2567](https://github.com/pomerium/pomerium/pull/2567) (@calebdoxsey)
- config: remove signature\_key\_algorithm [\#2557](https://github.com/pomerium/pomerium/pull/2557) (@calebdoxsey)
- allow pomerium to start without certs [\#2555](https://github.com/pomerium/pomerium/pull/2555) (@wasaga)
- integration: kubernetes support [\#2536](https://github.com/pomerium/pomerium/pull/2536) (@calebdoxsey)
- integration: nginx [\#2532](https://github.com/pomerium/pomerium/pull/2532) (@calebdoxsey)
- integration: add traefik tests [\#2530](https://github.com/pomerium/pomerium/pull/2530) (@calebdoxsey)
- envoy: remove deprecated access\_log\_path [\#2523](https://github.com/pomerium/pomerium/pull/2523) (@calebdoxsey)
- config: remove headers [\#2522](https://github.com/pomerium/pomerium/pull/2522) (@calebdoxsey)
- integration: add multi test [\#2519](https://github.com/pomerium/pomerium/pull/2519) (@calebdoxsey)
- Remove api from GitLab defaultScope [\#2518](https://github.com/pomerium/pomerium/pull/2518) (@alexfornuto)
- integration: add single-cluster integration tests [\#2516](https://github.com/pomerium/pomerium/pull/2516) (@calebdoxsey)
- integration: remove tests [\#2514](https://github.com/pomerium/pomerium/pull/2514) (@calebdoxsey)
- github: support provider URL [\#2490](https://github.com/pomerium/pomerium/pull/2490) (@calebdoxsey)
- protoutil: add NewAny method for deterministic serialization [\#2462](https://github.com/pomerium/pomerium/pull/2462) (@calebdoxsey)
- fix go get, improve redis test [\#2450](https://github.com/pomerium/pomerium/pull/2450) (@calebdoxsey)
- all: remove unused handler code [\#2439](https://github.com/pomerium/pomerium/pull/2439) (@desimone)

### Security

- identity: fix user refresh [\#2724](https://github.com/pomerium/pomerium/pull/2724) (@calebdoxsey)
- deps: update envoy to 1.19.1 [\#2526](https://github.com/pomerium/pomerium/pull/2526) (@travisgroth)

### Fixed

- config: allow specifying auto codec type in all-in-one mode [\#2846](https://github.com/pomerium/pomerium/pull/2846) (@calebdoxsey)
- dashboard: add confirmation dialog, fix button in firefox [\#2841](https://github.com/pomerium/pomerium/pull/2841) (@calebdoxsey)
- fix: Fixed return description error [\#2825](https://github.com/pomerium/pomerium/pull/2825) (@cfanbo)
- internal/telemetry: fix grpc server metrics [\#2811](https://github.com/pomerium/pomerium/pull/2811) (@travisgroth)
- Fix IdP client metrics [\#2810](https://github.com/pomerium/pomerium/pull/2810) (@travisgroth)
- envoyconfig: fix tls\_downstream\_client\_ca for non-standard ports [\#2802](https://github.com/pomerium/pomerium/pull/2802) (@calebdoxsey)
- config: detect changes to the kubernetes service account token file [\#2767](https://github.com/pomerium/pomerium/pull/2767) (@calebdoxsey)
- deps: update goreleaser [\#2757](https://github.com/pomerium/pomerium/pull/2757) (@travisgroth)

### Documentation

- add docs for ingress regex path [\#2822](https://github.com/pomerium/pomerium/pull/2822) (@wasaga)
- fix typo in docs [\#2819](https://github.com/pomerium/pomerium/pull/2819) (@wasaga)
- DOCS: add Grafana to Guides index [\#2808](https://github.com/pomerium/pomerium/pull/2808) (@alexfornuto)
- DOCS: Fix indentation in API doc [\#2798](https://github.com/pomerium/pomerium/pull/2798) (@alexfornuto)
- DOCS: Create Consolidated Troubleshooting Guide and Replace FAQ [\#2797](https://github.com/pomerium/pomerium/pull/2797) (@alexfornuto)
- docs: update pomerium-cli location [\#2790](https://github.com/pomerium/pomerium/pull/2790) (@travisgroth)
- Document Pomerium Policy Language [\#2789](https://github.com/pomerium/pomerium/pull/2789) (@backport-actions-token[bot])
- Copy edit to changelog entry [\#2786](https://github.com/pomerium/pomerium/pull/2786) (@alexfornuto)
- Document Pomerium Policy Language [\#2784](https://github.com/pomerium/pomerium/pull/2784) (@alexfornuto)
- Remove forward\_auth\_url from Enterprise [\#2779](https://github.com/pomerium/pomerium/pull/2779) (@alexfornuto)
- Docs: Update Kubernetes Dashboard Guide [\#2759](https://github.com/pomerium/pomerium/pull/2759) (@alexfornuto)
- Docs: Update Securing Kubernetes Guide [\#2758](https://github.com/pomerium/pomerium/pull/2758) (@alexfornuto)
- Docs: Add spdy annotation [\#2747](https://github.com/pomerium/pomerium/pull/2747) (@alexfornuto)
- Docs: Update JWT Verification Guide [\#2746](https://github.com/pomerium/pomerium/pull/2746) (@alexfornuto)
- Docs: Add Grafana Integration Guide [\#2742](https://github.com/pomerium/pomerium/pull/2742) (@alexfornuto)
- Docs: Update Traefik Example Headers [\#2732](https://github.com/pomerium/pomerium/pull/2732) (@alexfornuto)
- Docs: Reference gRPC API Docs [\#2717](https://github.com/pomerium/pomerium/pull/2717) (@alexfornuto)
- Minor fix in routes documentation [\#2714](https://github.com/pomerium/pomerium/pull/2714) (@Kerwood)
- Docs: Update Community Page [\#2713](https://github.com/pomerium/pomerium/pull/2713) (@cmo-pomerium)
- Update overview/architecture.md [\#2701](https://github.com/pomerium/pomerium/pull/2701) (@cmo-pomerium)
- Update create TLS command to quote strings. [\#2694](https://github.com/pomerium/pomerium/pull/2694) (@FutureMatt)
- Docs: Correct Claim Example [\#2689](https://github.com/pomerium/pomerium/pull/2689) (@alexfornuto)
- Fix typo in docs [\#2683](https://github.com/pomerium/pomerium/pull/2683) (@nihaals)
- Fixed 'kubtctl' typo on releases page [\#2673](https://github.com/pomerium/pomerium/pull/2673) (@ChaosInTheCRD)
- add service account redirects [\#2664](https://github.com/pomerium/pomerium/pull/2664) (@alexfornuto)
- DOCS: Standardize Relative Links [\#2651](https://github.com/pomerium/pomerium/pull/2651) (@alexfornuto)
- Docs: cross-reference links between concepts and reference [\#2648](https://github.com/pomerium/pomerium/pull/2648) (@alexfornuto)
- adjust sidebarDepths and document Desktop Client releases [\#2645](https://github.com/pomerium/pomerium/pull/2645) (@backport-actions-token[bot])
- typo [\#2644](https://github.com/pomerium/pomerium/pull/2644) (@alexfornuto)
- adjust sidebarDepths and document Desktop Client releases [\#2643](https://github.com/pomerium/pomerium/pull/2643) (@alexfornuto)
- DOCS: CORS preflight in console [\#2642](https://github.com/pomerium/pomerium/pull/2642) (@alexfornuto)
- DOCS: Collapse IDP Header [\#2641](https://github.com/pomerium/pomerium/pull/2641) (@alexfornuto)
- docs: remove extra word / updated docs link [\#2638](https://github.com/pomerium/pomerium/pull/2638) (@cmo-pomerium)
- Docs: Batch Updates [\#2628](https://github.com/pomerium/pomerium/pull/2628) (@alexfornuto)
- Refresh and Update TCP documentation [\#2627](https://github.com/pomerium/pomerium/pull/2627) (@alexfornuto)
- DOC: Copy edits to Okta IdP doc. [\#2623](https://github.com/pomerium/pomerium/pull/2623) (@alexfornuto)
- Docs/batch link fixes [\#2621](https://github.com/pomerium/pomerium/pull/2621) (@alexfornuto)
- Add redirect for installation [\#2618](https://github.com/pomerium/pomerium/pull/2618) (@alexfornuto)
- Add docs team as a code owner of packages.json [\#2605](https://github.com/pomerium/pomerium/pull/2605) (@alexfornuto)
- Update CODEOWNERS [\#2603](https://github.com/pomerium/pomerium/pull/2603) (@alexfornuto)
- DOCS: Update Enterprise Reference Docs [\#2599](https://github.com/pomerium/pomerium/pull/2599) (@alexfornuto)
- Document Enterprise API [\#2595](https://github.com/pomerium/pomerium/pull/2595) (@alexfornuto)
- docs: rename updated icon image [\#2582](https://github.com/pomerium/pomerium/pull/2582) (@travisgroth)
- docs: add updated icon asset [\#2580](https://github.com/pomerium/pomerium/pull/2580) (@travisgroth)
- Document recovery token generation [\#2579](https://github.com/pomerium/pomerium/pull/2579) (@alexfornuto)
- New Topic Page: Original Request Context [\#2569](https://github.com/pomerium/pomerium/pull/2569) (@alexfornuto)
- docs: enterprise console v0.15.2 changelog [\#2564](https://github.com/pomerium/pomerium/pull/2564) (@travisgroth)
- TCP Client Doc [\#2561](https://github.com/pomerium/pomerium/pull/2561) (@alexfornuto)
- Docs: Fix merged PR [\#2546](https://github.com/pomerium/pomerium/pull/2546) (@alexfornuto)
- docs: enterprise v0.15.1 changelog [\#2542](https://github.com/pomerium/pomerium/pull/2542) (@travisgroth)
- Update Ping Identity IdP  [\#2537](https://github.com/pomerium/pomerium/pull/2537) (@alexfornuto)
- update OneLogin IdP doc [\#2533](https://github.com/pomerium/pomerium/pull/2533) (@alexfornuto)
- Update GitLab IdP doc [\#2520](https://github.com/pomerium/pomerium/pull/2520) (@alexfornuto)
- update GitHub IdP doc [\#2503](https://github.com/pomerium/pomerium/pull/2503) (@alexfornuto)
- Update AWS cognito IdP doc [\#2498](https://github.com/pomerium/pomerium/pull/2498) (@alexfornuto)
- Update Azure IdP Doc [\#2497](https://github.com/pomerium/pomerium/pull/2497) (@alexfornuto)
- Auth0 Doc Refresh [\#2494](https://github.com/pomerium/pomerium/pull/2494) (@alexfornuto)
- Update IdP Overview Page [\#2493](https://github.com/pomerium/pomerium/pull/2493) (@alexfornuto)
- Update Okta IdP doc [\#2491](https://github.com/pomerium/pomerium/pull/2491) (@alexfornuto)
- adjust comment blocking [\#2488](https://github.com/pomerium/pomerium/pull/2488) (@alexfornuto)
- document binding service to 443 [\#2487](https://github.com/pomerium/pomerium/pull/2487) (@alexfornuto)
- docs: use generic email [\#2484](https://github.com/pomerium/pomerium/pull/2484) (@alexfornuto)
- Update Docker Quickstart [\#2482](https://github.com/pomerium/pomerium/pull/2482) (@alexfornuto)
- Wrap mkcert command in quotes [\#2481](https://github.com/pomerium/pomerium/pull/2481) (@alexfornuto)
- Updates to Enterprise Quickstart instructions [\#2480](https://github.com/pomerium/pomerium/pull/2480) (@alexfornuto)
- wrap header example values as inline code. [\#2474](https://github.com/pomerium/pomerium/pull/2474) (@alexfornuto)
- docs: clarify  custom request header limitations [\#2471](https://github.com/pomerium/pomerium/pull/2471) (@desimone)
- Update Helm Instructions [\#2467](https://github.com/pomerium/pomerium/pull/2467) (@alexfornuto)
- docs: update enterprise helm instructions to use main repo [\#2463](https://github.com/pomerium/pomerium/pull/2463) (@travisgroth)
- Document tracing sample rate in console [\#2461](https://github.com/pomerium/pomerium/pull/2461) (@alexfornuto)
- Document moving routes [\#2460](https://github.com/pomerium/pomerium/pull/2460) (@alexfornuto)
- Enterprise Upgrade & Changelog Pages [\#2453](https://github.com/pomerium/pomerium/pull/2453) (@alexfornuto)
- docs: update codeowners [\#2451](https://github.com/pomerium/pomerium/pull/2451) (@travisgroth)
- Update binary install doc [\#2447](https://github.com/pomerium/pomerium/pull/2447) (@alexfornuto)
- docs: update branding, concepts [\#2445](https://github.com/pomerium/pomerium/pull/2445) (@desimone)
- specify expected audience in Console config [\#2442](https://github.com/pomerium/pomerium/pull/2442) (@alexfornuto)
- docs: update default version to v0.15 [\#2437](https://github.com/pomerium/pomerium/pull/2437) (@travisgroth)
- docs: update branding [\#2435](https://github.com/pomerium/pomerium/pull/2435) (@desimone)

### Dependency

- chore\(deps\): bump google.golang.org/api from 0.62.0 to 0.63.0 [\#2834](https://github.com/pomerium/pomerium/pull/2834) (@dependabot[bot])
- chore\(deps\): bump github.com/rs/zerolog from 1.26.0 to 1.26.1 [\#2833](https://github.com/pomerium/pomerium/pull/2833) (@dependabot[bot])
- chore\(deps\): bump github.com/spf13/viper from 1.10.0 to 1.10.1 [\#2832](https://github.com/pomerium/pomerium/pull/2832) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/grpc from 1.42.0 to 1.43.0 [\#2831](https://github.com/pomerium/pomerium/pull/2831) (@dependabot[bot])
- chore\(deps\): bump github.com/docker/docker from 20.10.11+incompatible to 20.10.12+incompatible [\#2817](https://github.com/pomerium/pomerium/pull/2817) (@dependabot[bot])
- chore\(deps\): bump github.com/spf13/viper from 1.9.0 to 1.10.0 [\#2816](https://github.com/pomerium/pomerium/pull/2816) (@dependabot[bot])
- dev build support for darwin-arm64 from envoy tip [\#2815](https://github.com/pomerium/pomerium/pull/2815) (@wasaga)
- chore\(deps\): bump github.com/shirou/gopsutil/v3 from 3.21.10 to 3.21.11 [\#2807](https://github.com/pomerium/pomerium/pull/2807) (@dependabot[bot])
- chore\(deps\): bump github.com/mitchellh/mapstructure from 1.4.2 to 1.4.3 [\#2806](https://github.com/pomerium/pomerium/pull/2806) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.60.0 to 0.61.0 [\#2805](https://github.com/pomerium/pomerium/pull/2805) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.34.2 to 0.35.0 [\#2804](https://github.com/pomerium/pomerium/pull/2804) (@dependabot[bot])
- chore\(deps\): bump mikefarah/yq from 4.15.1 to 4.16.1 [\#2803](https://github.com/pomerium/pomerium/pull/2803) (@dependabot[bot])
- chore\(deps\): bump github.com/ory/dockertest/v3 from 3.8.0 to 3.8.1 [\#2785](https://github.com/pomerium/pomerium/pull/2785) (@dependabot[bot])
- chore\(deps\): bump mikefarah/yq from 4.14.2 to 4.15.1 [\#2783](https://github.com/pomerium/pomerium/pull/2783) (@dependabot[bot])
- chore\(deps\): bump github.com/docker/docker from 20.10.10+incompatible to 20.10.11+incompatible [\#2776](https://github.com/pomerium/pomerium/pull/2776) (@dependabot[bot])
- chore\(deps\): bump coverallsapp/github-action from 1.1.2 to 1.1.3 [\#2775](https://github.com/pomerium/pomerium/pull/2775) (@dependabot[bot])
- chore\(deps\): bump mikefarah/yq from 4.6.3 to 4.14.2 [\#2774](https://github.com/pomerium/pomerium/pull/2774) (@dependabot[bot])
- chore\(deps\): bump github.com/caddyserver/certmagic from 0.15.1 to 0.15.2 [\#2769](https://github.com/pomerium/pomerium/pull/2769) (@dependabot[bot])
- chore\(deps\): bump github.com/cenkalti/backoff/v4 from 4.1.1 to 4.1.2 [\#2768](https://github.com/pomerium/pomerium/pull/2768) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.34.1 to 0.34.2 [\#2765](https://github.com/pomerium/pomerium/pull/2765) (@dependabot[bot])
- chore\(deps\): bump github.com/mholt/acmez from 1.0.0 to 1.0.1 [\#2764](https://github.com/pomerium/pomerium/pull/2764) (@dependabot[bot])
- chore\(deps\): bump gopkg.in/auth0.v5 from 5.21.0 to 5.21.1 [\#2763](https://github.com/pomerium/pomerium/pull/2763) (@dependabot[bot])
- chore\(deps\): bump github.com/golangci/golangci-lint from 1.42.1 to 1.43.0 [\#2756](https://github.com/pomerium/pomerium/pull/2756) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.34.0 to 0.34.1 [\#2755](https://github.com/pomerium/pomerium/pull/2755) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/grpc from 1.41.0 to 1.42.0 [\#2754](https://github.com/pomerium/pomerium/pull/2754) (@dependabot[bot])
- chore\(deps\): bump github.com/rs/zerolog from 1.25.0 to 1.26.0 [\#2753](https://github.com/pomerium/pomerium/pull/2753) (@dependabot[bot])
- chore\(deps\): bump gopkg.in/auth0.v5 from 5.20.0 to 5.21.0 [\#2752](https://github.com/pomerium/pomerium/pull/2752) (@dependabot[bot])
- dependencies: vendor base58, remove shortuuid [\#2739](https://github.com/pomerium/pomerium/pull/2739) (@calebdoxsey)
- chore\(deps\): bump google.golang.org/api from 0.58.0 to 0.60.0 [\#2737](https://github.com/pomerium/pomerium/pull/2737) (@dependabot[bot])
- chore\(deps\): bump github.com/shirou/gopsutil/v3 from 3.21.9 to 3.21.10 [\#2736](https://github.com/pomerium/pomerium/pull/2736) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.33.1 to 0.34.0 [\#2735](https://github.com/pomerium/pomerium/pull/2735) (@dependabot[bot])
- chore\(deps\): bump github.com/openzipkin/zipkin-go from 0.2.5 to 0.3.0 [\#2734](https://github.com/pomerium/pomerium/pull/2734) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/common from 0.31.1 to 0.32.1 [\#2706](https://github.com/pomerium/pomerium/pull/2706) (@dependabot[bot])
- chore\(deps\): bump github.com/docker/docker from 20.10.9+incompatible to 20.10.10+incompatible [\#2705](https://github.com/pomerium/pomerium/pull/2705) (@dependabot[bot])
- chore\(deps\): bump gopkg.in/auth0.v5 from 5.19.2 to 5.20.0 [\#2704](https://github.com/pomerium/pomerium/pull/2704) (@dependabot[bot])
- chore\(deps\): bump github.com/envoyproxy/protoc-gen-validate from 0.6.1 to 0.6.2 [\#2703](https://github.com/pomerium/pomerium/pull/2703) (@dependabot[bot])
- chore\(deps\): bump github.com/caddyserver/certmagic from 0.14.5 to 0.15.1 [\#2685](https://github.com/pomerium/pomerium/pull/2685) (@dependabot[bot])
- chore\(deps\): bump github.com/peterbourgon/ff/v3 from 3.1.0 to 3.1.2 [\#2672](https://github.com/pomerium/pomerium/pull/2672) (@dependabot[bot])
- chore\(deps\): bump github.com/shirou/gopsutil/v3 from 3.21.8 to 3.21.9 [\#2671](https://github.com/pomerium/pomerium/pull/2671) (@dependabot[bot])
- chore\(deps\): bump github.com/docker/docker from 20.10.8+incompatible to 20.10.9+incompatible [\#2670](https://github.com/pomerium/pomerium/pull/2670) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.57.0 to 0.58.0 [\#2660](https://github.com/pomerium/pomerium/pull/2660) (@dependabot[bot])
- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.11.3 to 8.11.4 [\#2659](https://github.com/pomerium/pomerium/pull/2659) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.32.1 to 0.33.1 [\#2658](https://github.com/pomerium/pomerium/pull/2658) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/common from 0.31.0 to 0.31.1 [\#2656](https://github.com/pomerium/pomerium/pull/2656) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.32.0 to 0.32.1 [\#2633](https://github.com/pomerium/pomerium/pull/2633) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/grpc from 1.40.0 to 1.41.0 [\#2632](https://github.com/pomerium/pomerium/pull/2632) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/common from 0.30.0 to 0.31.0 [\#2631](https://github.com/pomerium/pomerium/pull/2631) (@dependabot[bot])
- chore\(deps\): bump sigs.k8s.io/yaml from 1.2.0 to 1.3.0 [\#2630](https://github.com/pomerium/pomerium/pull/2630) (@dependabot[bot])
- chore\(deps\): bump github.com/ory/dockertest/v3 from 3.7.0 to 3.8.0 [\#2629](https://github.com/pomerium/pomerium/pull/2629) (@dependabot[bot])
- chore\(deps\): bump github.com/spf13/viper from 1.8.1 to 1.9.0 [\#2616](https://github.com/pomerium/pomerium/pull/2616) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.56.0 to 0.57.0 [\#2615](https://github.com/pomerium/pomerium/pull/2615) (@dependabot[bot])
- chore\(deps\): bump github.com/coreos/go-oidc/v3 from 3.0.0 to 3.1.0 [\#2614](https://github.com/pomerium/pomerium/pull/2614) (@dependabot[bot])
- bump protoc-validate [\#2606](https://github.com/pomerium/pomerium/pull/2606) (@wasaga)
- chore\(deps\): bump go.uber.org/zap from 1.19.0 to 1.19.1 [\#2592](https://github.com/pomerium/pomerium/pull/2592) (@dependabot[bot])
- chore\(deps\): bump github.com/rs/zerolog from 1.24.0 to 1.25.0 [\#2591](https://github.com/pomerium/pomerium/pull/2591) (@dependabot[bot])
- chore\(deps\): bump github.com/shirou/gopsutil/v3 from 3.21.7 to 3.21.8 [\#2577](https://github.com/pomerium/pomerium/pull/2577) (@dependabot[bot])
- chore\(deps\): bump github.com/golangci/golangci-lint from 1.42.0 to 1.42.1 [\#2576](https://github.com/pomerium/pomerium/pull/2576) (@dependabot[bot])
- chore\(deps\): bump github.com/caddyserver/certmagic from 0.14.4 to 0.14.5 [\#2575](https://github.com/pomerium/pomerium/pull/2575) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.54.0 to 0.56.0 [\#2574](https://github.com/pomerium/pomerium/pull/2574) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.31.0 to 0.32.0 [\#2573](https://github.com/pomerium/pomerium/pull/2573) (@dependabot[bot])
- chore\(deps\): bump github.com/fsnotify/fsnotify from 1.5.0 to 1.5.1 [\#2554](https://github.com/pomerium/pomerium/pull/2554) (@dependabot[bot])
- chore\(deps\): bump github.com/caddyserver/certmagic from 0.14.3 to 0.14.4 [\#2553](https://github.com/pomerium/pomerium/pull/2553) (@dependabot[bot])
- chore\(deps\): bump github.com/rs/zerolog from 1.23.0 to 1.24.0 [\#2552](https://github.com/pomerium/pomerium/pull/2552) (@dependabot[bot])
- chore\(deps\): bump github.com/docker/docker from 20.10.7+incompatible to 20.10.8+incompatible [\#2551](https://github.com/pomerium/pomerium/pull/2551) (@dependabot[bot])
- chore\(deps\): bump github.com/caddyserver/certmagic from 0.14.1 to 0.14.3 [\#2550](https://github.com/pomerium/pomerium/pull/2550) (@dependabot[bot])
- chore\(deps\): bump contrib.go.opencensus.io/exporter/prometheus from 0.3.0 to 0.4.0 [\#2549](https://github.com/pomerium/pomerium/pull/2549) (@dependabot[bot])
- chore\(deps\): bump github.com/cespare/xxhash/v2 from 2.1.1 to 2.1.2 [\#2548](https://github.com/pomerium/pomerium/pull/2548) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/procfs from 0.7.2 to 0.7.3 [\#2512](https://github.com/pomerium/pomerium/pull/2512) (@dependabot[bot])
- chore\(deps\): bump github.com/golangci/golangci-lint from 1.41.1 to 1.42.0 [\#2511](https://github.com/pomerium/pomerium/pull/2511) (@dependabot[bot])
- chore\(deps\): bump github.com/fsnotify/fsnotify from 1.4.9 to 1.5.0 [\#2510](https://github.com/pomerium/pomerium/pull/2510) (@dependabot[bot])
- ci: use go 1.17.x [\#2492](https://github.com/pomerium/pomerium/pull/2492) (@desimone)
- chore\(deps\): bump google.golang.org/grpc from 1.39.1 to 1.40.0 [\#2478](https://github.com/pomerium/pomerium/pull/2478) (@dependabot[bot])
- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.11.2 to 8.11.3 [\#2477](https://github.com/pomerium/pomerium/pull/2477) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.52.0 to 0.54.0 [\#2476](https://github.com/pomerium/pomerium/pull/2476) (@dependabot[bot])
- chore\(deps\): bump go.uber.org/zap from 1.18.1 to 1.19.0 [\#2475](https://github.com/pomerium/pomerium/pull/2475) (@dependabot[bot])
- ci: support darwn/arm64 aka m1 for cli [\#2473](https://github.com/pomerium/pomerium/pull/2473) (@desimone)
- chore\(deps\): bump google.golang.org/grpc from 1.39.0 to 1.39.1 [\#2457](https://github.com/pomerium/pomerium/pull/2457) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/procfs from 0.7.1 to 0.7.2 [\#2456](https://github.com/pomerium/pomerium/pull/2456) (@dependabot[bot])
- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.11.1 to 8.11.2 [\#2455](https://github.com/pomerium/pomerium/pull/2455) (@dependabot[bot])
- Hadolint [\#2363](https://github.com/pomerium/pomerium/pull/2363) (@stephengroat)

### Deployment

- deployment: migrate pomerium-cli automation to new repo [\#2771](https://github.com/pomerium/pomerium/pull/2771) (@travisgroth)
- deployment: remove DST\_Root\_CA\_X3 from docker images [\#2677](https://github.com/pomerium/pomerium/pull/2677) (@travisgroth)
- deployment: update goreleaser syntax [\#2524](https://github.com/pomerium/pomerium/pull/2524) (@travisgroth)

### Changed

- move NewGRPCClientConn to public package [\#2826](https://github.com/pomerium/pomerium/pull/2826) (@wasaga)
- rm cli code [\#2824](https://github.com/pomerium/pomerium/pull/2824) (@wasaga)
- ci: remove hadolint [\#2726](https://github.com/pomerium/pomerium/pull/2726) (@travisgroth)
- ci: ignore multiple run commands [\#2566](https://github.com/pomerium/pomerium/pull/2566) (@travisgroth)
- redirect logo to the marketing site [\#2441](https://github.com/pomerium/pomerium/pull/2441) (@alexfornuto)
- ci: use github app for backport credentials [\#2369](https://github.com/pomerium/pomerium/pull/2369) (@travisgroth)

## [v0.15.8](https://github.com/pomerium/pomerium/tree/v0.15.8) (2021-12-17)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.15.7...v0.15.8)

### Fixed

- authorize: fix nginx infinite redirect [\#2812](https://github.com/pomerium/pomerium/pull/2812) (@calebdoxsey)

### Documentation

- DOCS: add Grafana to Guides index [\#2809](https://github.com/pomerium/pomerium/pull/2809) (@backport-actions-token[bot])
- DOCS: Fix indentation in API doc [\#2799](https://github.com/pomerium/pomerium/pull/2799) (@backport-actions-token[bot])
- Docs: Update Kubernetes Dashboard Guide [\#2795](https://github.com/pomerium/pomerium/pull/2795) (@backport-actions-token[bot])
- Docs: Update Securing Kubernetes Guide [\#2792](https://github.com/pomerium/pomerium/pull/2792) (@backport-actions-token[bot])
- Docs: Update JWT Verification Guide [\#2787](https://github.com/pomerium/pomerium/pull/2787) (@backport-actions-token[bot])

### Dependency

- deps: pin release to latest go version [\#2827](https://github.com/pomerium/pomerium/pull/2827) (@travisgroth)

## [v0.15.7](https://github.com/pomerium/pomerium/tree/v0.15.7) (2021-11-15)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.15.6...v0.15.7)

### Fixed

- autocert: remove log [\#2750](https://github.com/pomerium/pomerium/pull/2750) (@backport-actions-token[bot])

### Security

- identity: fix user refresh [\#2725](https://github.com/pomerium/pomerium/pull/2725) (@backport-actions-token[bot])

### Documentation

- Docs: Add Grafana Integration Guide [\#2762](https://github.com/pomerium/pomerium/pull/2762) (@backport-actions-token[bot])
- Docs: Add spdy annotation [\#2751](https://github.com/pomerium/pomerium/pull/2751) (@backport-actions-token[bot])
- Docs: Ingress Controller [\#2745](https://github.com/pomerium/pomerium/pull/2745) (@backport-actions-token[bot])
- Docs: Update Traefik Example Headers [\#2741](https://github.com/pomerium/pomerium/pull/2741) (@backport-actions-token[bot])
- Docs: Update Community Page [\#2731](https://github.com/pomerium/pomerium/pull/2731) (@backport-actions-token[bot])
- Minor fix in routes documentation [\#2721](https://github.com/pomerium/pomerium/pull/2721) (@backport-actions-token[bot])
- Docs: Reference gRPC API Docs [\#2720](https://github.com/pomerium/pomerium/pull/2720) (@backport-actions-token[bot])
- Update overview/architecture.md [\#2707](https://github.com/pomerium/pomerium/pull/2707) (@backport-actions-token[bot])

## [v0.15.6](https://github.com/pomerium/pomerium/tree/v0.15.6) (2021-11-04)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.15.5...v0.15.6)

### Breaking

- github: use GraphQL API to reduce number of API calls for directory sync [\#2715](https://github.com/pomerium/pomerium/pull/2715) (@calebdoxsey)

### New

- databroker: add additional log for config source [\#2718](https://github.com/pomerium/pomerium/pull/2718) (@calebdoxsey)
- grpc: remove peer field from logs [\#2712](https://github.com/pomerium/pomerium/pull/2712) (@calebdoxsey)
- desktop client api [\#2711](https://github.com/pomerium/pomerium/pull/2711) (@wasaga)
- telemetry: improve zipkin error logs [\#2710](https://github.com/pomerium/pomerium/pull/2710) (@calebdoxsey)
- authorize: add support for webauthn device policy enforcement [\#2700](https://github.com/pomerium/pomerium/pull/2700) (@calebdoxsey)
- webauthn: update session to support device credentials per type [\#2699](https://github.com/pomerium/pomerium/pull/2699) (@calebdoxsey)
- ppl: add support for additional data [\#2696](https://github.com/pomerium/pomerium/pull/2696) (@calebdoxsey)
- Add additional ACME CA \(autocert\) options [\#2695](https://github.com/pomerium/pomerium/pull/2695) (@hslatman)
- skip configuration updates to the most recent one [\#2690](https://github.com/pomerium/pomerium/pull/2690) (@wasaga)
- authenticate: add support for webauthn [\#2688](https://github.com/pomerium/pomerium/pull/2688) (@calebdoxsey)
- webauthnutil: add helpers for webauthn [\#2686](https://github.com/pomerium/pomerium/pull/2686) (@calebdoxsey)
- devices: add device protobuf types [\#2682](https://github.com/pomerium/pomerium/pull/2682) (@calebdoxsey)
- cryptutil: add SecureToken [\#2681](https://github.com/pomerium/pomerium/pull/2681) (@calebdoxsey)
- config/envoyconfig: better duplicate message [\#2661](https://github.com/pomerium/pomerium/pull/2661) (@desimone)
- pomerium-cli: add support for a custom browser command [\#2617](https://github.com/pomerium/pomerium/pull/2617) (@calebdoxsey)
- ppl: pass contextual information through policy [\#2612](https://github.com/pomerium/pomerium/pull/2612) (@calebdoxsey)
- add description to service accounts [\#2611](https://github.com/pomerium/pomerium/pull/2611) (@nhayfield)
- DOCS: Add copy button to code snippets [\#2597](https://github.com/pomerium/pomerium/pull/2597) (@alexfornuto)
- pomerium-cli: use cache dir instead of config dir [\#2588](https://github.com/pomerium/pomerium/pull/2588) (@calebdoxsey)
- cli: update tcp log output format [\#2586](https://github.com/pomerium/pomerium/pull/2586) (@travisgroth)
- directory: implement exponential backoff for refresh [\#2570](https://github.com/pomerium/pomerium/pull/2570) (@calebdoxsey)
- google: support provider URL [\#2567](https://github.com/pomerium/pomerium/pull/2567) (@calebdoxsey)
- allow pomerium to start without certs [\#2555](https://github.com/pomerium/pomerium/pull/2555) (@wasaga)
- integration: kubernetes support [\#2536](https://github.com/pomerium/pomerium/pull/2536) (@calebdoxsey)
- integration: nginx [\#2532](https://github.com/pomerium/pomerium/pull/2532) (@calebdoxsey)
- integration: add traefik tests [\#2530](https://github.com/pomerium/pomerium/pull/2530) (@calebdoxsey)
- envoy: remove deprecated access\_log\_path [\#2523](https://github.com/pomerium/pomerium/pull/2523) (@calebdoxsey)
- config: remove headers [\#2522](https://github.com/pomerium/pomerium/pull/2522) (@calebdoxsey)
- integration: add multi test [\#2519](https://github.com/pomerium/pomerium/pull/2519) (@calebdoxsey)
- Remove api from GitLab defaultScope [\#2518](https://github.com/pomerium/pomerium/pull/2518) (@alexfornuto)
- integration: add single-cluster integration tests [\#2516](https://github.com/pomerium/pomerium/pull/2516) (@calebdoxsey)
- integration: remove tests [\#2514](https://github.com/pomerium/pomerium/pull/2514) (@calebdoxsey)
- github: support provider URL [\#2490](https://github.com/pomerium/pomerium/pull/2490) (@calebdoxsey)
- protoutil: add NewAny method for deterministic serialization [\#2462](https://github.com/pomerium/pomerium/pull/2462) (@calebdoxsey)
- fix go get, improve redis test [\#2450](https://github.com/pomerium/pomerium/pull/2450) (@calebdoxsey)
- all: remove unused handler code [\#2439](https://github.com/pomerium/pomerium/pull/2439) (@desimone)

### Fixed

- deployment: relocate pomerium-cli to /usr/bin [\#2727](https://github.com/pomerium/pomerium/pull/2727) (@travisgroth)
- authenticate: always update user record on login [\#2719](https://github.com/pomerium/pomerium/pull/2719) (@calebdoxsey)
- authenticate: add databroker versions to session cookie [\#2709](https://github.com/pomerium/pomerium/pull/2709) (@calebdoxsey)
- protoc: add xds repo [\#2687](https://github.com/pomerium/pomerium/pull/2687) (@calebdoxsey)
- add host-rewrite options to config.proto [\#2668](https://github.com/pomerium/pomerium/pull/2668) (@wasaga)
- authclient: clone TLS configuration to prevent overriding NextProtos [\#2594](https://github.com/pomerium/pomerium/pull/2594) (@calebdoxsey)
- tcptunnel: force the use of HTTP/1.1 during ALPN [\#2593](https://github.com/pomerium/pomerium/pull/2593) (@calebdoxsey)
- userinfo: format exp, iat and updated\_at [\#2585](https://github.com/pomerium/pomerium/pull/2585) (@calebdoxsey)
- autocert: remove log [\#2584](https://github.com/pomerium/pomerium/pull/2584) (@calebdoxsey)
- authorize: use session.user\_id in headers [\#2571](https://github.com/pomerium/pomerium/pull/2571) (@calebdoxsey)
- ppl: use session.user\_id instead of user.id for user criterion [\#2562](https://github.com/pomerium/pomerium/pull/2562) (@calebdoxsey)
- authorize: fix google cloudrun header audience [\#2558](https://github.com/pomerium/pomerium/pull/2558) (@calebdoxsey)
- authorize: fix X-Pomerium-Claim-Groups [\#2539](https://github.com/pomerium/pomerium/pull/2539) (@calebdoxsey)
- grpc: disable gRPC connection re-use across services [\#2515](https://github.com/pomerium/pomerium/pull/2515) (@calebdoxsey)
- fix forward-auth, logging [\#2509](https://github.com/pomerium/pomerium/pull/2509) (@calebdoxsey)
- grpc: send client traffic through envoy [\#2469](https://github.com/pomerium/pomerium/pull/2469) (@calebdoxsey)
- options: remove refresh\_cooldown, add allow\_spdy to proto [\#2446](https://github.com/pomerium/pomerium/pull/2446) (@calebdoxsey)

### Security

- identity: fix user refresh [\#2724](https://github.com/pomerium/pomerium/pull/2724) (@calebdoxsey)
- deps: update envoy to 1.19.1 [\#2526](https://github.com/pomerium/pomerium/pull/2526) (@travisgroth)

### Documentation

- Docs: Update Traefik Example Headers [\#2732](https://github.com/pomerium/pomerium/pull/2732) (@alexfornuto)
- Docs: Reference gRPC API Docs [\#2717](https://github.com/pomerium/pomerium/pull/2717) (@alexfornuto)
- Minor fix in routes documentation [\#2714](https://github.com/pomerium/pomerium/pull/2714) (@Kerwood)
- Docs: Update Community Page [\#2713](https://github.com/pomerium/pomerium/pull/2713) (@cmo-pomerium)
- Update overview/architecture.md [\#2701](https://github.com/pomerium/pomerium/pull/2701) (@cmo-pomerium)
- Update create TLS command to quote strings. [\#2694](https://github.com/pomerium/pomerium/pull/2694) (@FutureMatt)
- Docs: Correct Claim Example [\#2689](https://github.com/pomerium/pomerium/pull/2689) (@alexfornuto)
- Fix typo in docs [\#2683](https://github.com/pomerium/pomerium/pull/2683) (@nihaals)
- Fixed 'kubtctl' typo on releases page [\#2673](https://github.com/pomerium/pomerium/pull/2673) (@ChaosInTheCRD)
- Docs: Ingress Controller [\#2667](https://github.com/pomerium/pomerium/pull/2667) (@alexfornuto)
- add service account redirects [\#2664](https://github.com/pomerium/pomerium/pull/2664) (@alexfornuto)
- DOCS: Standardize Relative Links [\#2651](https://github.com/pomerium/pomerium/pull/2651) (@alexfornuto)
- Docs: cross-reference links between concepts and reference [\#2648](https://github.com/pomerium/pomerium/pull/2648) (@alexfornuto)
- typo [\#2644](https://github.com/pomerium/pomerium/pull/2644) (@alexfornuto)
- adjust sidebarDepths and document Desktop Client releases [\#2643](https://github.com/pomerium/pomerium/pull/2643) (@alexfornuto)
- DOCS: CORS preflight in console [\#2642](https://github.com/pomerium/pomerium/pull/2642) (@alexfornuto)
- DOCS: Collapse IDP Header [\#2641](https://github.com/pomerium/pomerium/pull/2641) (@alexfornuto)
- docs: remove extra word / updated docs link [\#2638](https://github.com/pomerium/pomerium/pull/2638) (@cmo-pomerium)
- Docs: Batch Updates [\#2628](https://github.com/pomerium/pomerium/pull/2628) (@alexfornuto)
- Refresh and Update TCP documentation [\#2627](https://github.com/pomerium/pomerium/pull/2627) (@alexfornuto)
- DOC: Copy edits to Okta IdP doc. [\#2623](https://github.com/pomerium/pomerium/pull/2623) (@alexfornuto)
- Docs/batch link fixes [\#2621](https://github.com/pomerium/pomerium/pull/2621) (@alexfornuto)
- Add redirect for installation [\#2618](https://github.com/pomerium/pomerium/pull/2618) (@alexfornuto)
- Add docs team as a code owner of packages.json [\#2605](https://github.com/pomerium/pomerium/pull/2605) (@alexfornuto)
- Update CODEOWNERS [\#2603](https://github.com/pomerium/pomerium/pull/2603) (@alexfornuto)
- DOCS: Update Enterprise Reference Docs [\#2599](https://github.com/pomerium/pomerium/pull/2599) (@alexfornuto)
- Document Enterprise API [\#2595](https://github.com/pomerium/pomerium/pull/2595) (@alexfornuto)
- docs: rename updated icon image [\#2582](https://github.com/pomerium/pomerium/pull/2582) (@travisgroth)
- docs: add updated icon asset [\#2580](https://github.com/pomerium/pomerium/pull/2580) (@travisgroth)
- Document recovery token generation [\#2579](https://github.com/pomerium/pomerium/pull/2579) (@alexfornuto)
- New Topic Page: Original Request Context [\#2569](https://github.com/pomerium/pomerium/pull/2569) (@alexfornuto)
- docs: enterprise console v0.15.2 changelog [\#2564](https://github.com/pomerium/pomerium/pull/2564) (@travisgroth)
- TCP Client Doc [\#2561](https://github.com/pomerium/pomerium/pull/2561) (@alexfornuto)
- Docs: Fix merged PR [\#2546](https://github.com/pomerium/pomerium/pull/2546) (@alexfornuto)
- docs: enterprise v0.15.1 changelog [\#2542](https://github.com/pomerium/pomerium/pull/2542) (@travisgroth)
- Update Ping Identity IdP  [\#2537](https://github.com/pomerium/pomerium/pull/2537) (@alexfornuto)
- update OneLogin IdP doc [\#2533](https://github.com/pomerium/pomerium/pull/2533) (@alexfornuto)
- Update GitLab IdP doc [\#2520](https://github.com/pomerium/pomerium/pull/2520) (@alexfornuto)
- update GitHub IdP doc [\#2503](https://github.com/pomerium/pomerium/pull/2503) (@alexfornuto)
- Update AWS cognito IdP doc [\#2498](https://github.com/pomerium/pomerium/pull/2498) (@alexfornuto)
- Update Azure IdP Doc [\#2497](https://github.com/pomerium/pomerium/pull/2497) (@alexfornuto)
- Auth0 Doc Refresh [\#2494](https://github.com/pomerium/pomerium/pull/2494) (@alexfornuto)
- Update IdP Overview Page [\#2493](https://github.com/pomerium/pomerium/pull/2493) (@alexfornuto)
- Update Okta IdP doc [\#2491](https://github.com/pomerium/pomerium/pull/2491) (@alexfornuto)
- adjust comment blocking [\#2488](https://github.com/pomerium/pomerium/pull/2488) (@alexfornuto)
- document binding service to 443 [\#2487](https://github.com/pomerium/pomerium/pull/2487) (@alexfornuto)
- docs: use generic email [\#2484](https://github.com/pomerium/pomerium/pull/2484) (@alexfornuto)
- Update Docker Quickstart [\#2482](https://github.com/pomerium/pomerium/pull/2482) (@alexfornuto)
- Wrap mkcert command in quotes [\#2481](https://github.com/pomerium/pomerium/pull/2481) (@alexfornuto)
- Updates to Enterprise Quickstart instructions [\#2480](https://github.com/pomerium/pomerium/pull/2480) (@alexfornuto)
- wrap header example values as inline code. [\#2474](https://github.com/pomerium/pomerium/pull/2474) (@alexfornuto)
- docs: clarify  custom request header limitations [\#2471](https://github.com/pomerium/pomerium/pull/2471) (@desimone)
- Update Helm Instructions [\#2467](https://github.com/pomerium/pomerium/pull/2467) (@alexfornuto)
- docs: update enterprise helm instructions to use main repo [\#2463](https://github.com/pomerium/pomerium/pull/2463) (@travisgroth)
- Document tracing sample rate in console [\#2461](https://github.com/pomerium/pomerium/pull/2461) (@alexfornuto)
- Document moving routes [\#2460](https://github.com/pomerium/pomerium/pull/2460) (@alexfornuto)
- Enterprise Upgrade & Changelog Pages [\#2453](https://github.com/pomerium/pomerium/pull/2453) (@alexfornuto)
- docs: update codeowners [\#2451](https://github.com/pomerium/pomerium/pull/2451) (@travisgroth)
- Update binary install doc [\#2447](https://github.com/pomerium/pomerium/pull/2447) (@alexfornuto)
- docs: update branding, concepts [\#2445](https://github.com/pomerium/pomerium/pull/2445) (@desimone)
- specify expected audience in Console config [\#2442](https://github.com/pomerium/pomerium/pull/2442) (@alexfornuto)
- docs: update default version to v0.15 [\#2437](https://github.com/pomerium/pomerium/pull/2437) (@travisgroth)
- docs: update branding [\#2435](https://github.com/pomerium/pomerium/pull/2435) (@desimone)

### Dependency

- dependencies: vendor base58, remove shortuuid [\#2739](https://github.com/pomerium/pomerium/pull/2739) (@calebdoxsey)
- chore\(deps\): bump github.com/shirou/gopsutil/v3 from 3.21.9 to 3.21.10 [\#2736](https://github.com/pomerium/pomerium/pull/2736) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.33.1 to 0.34.0 [\#2735](https://github.com/pomerium/pomerium/pull/2735) (@dependabot[bot])
- chore\(deps\): bump github.com/openzipkin/zipkin-go from 0.2.5 to 0.3.0 [\#2734](https://github.com/pomerium/pomerium/pull/2734) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/common from 0.31.1 to 0.32.1 [\#2706](https://github.com/pomerium/pomerium/pull/2706) (@dependabot[bot])
- chore\(deps\): bump github.com/docker/docker from 20.10.9+incompatible to 20.10.10+incompatible [\#2705](https://github.com/pomerium/pomerium/pull/2705) (@dependabot[bot])
- chore\(deps\): bump gopkg.in/auth0.v5 from 5.19.2 to 5.20.0 [\#2704](https://github.com/pomerium/pomerium/pull/2704) (@dependabot[bot])
- chore\(deps\): bump github.com/envoyproxy/protoc-gen-validate from 0.6.1 to 0.6.2 [\#2703](https://github.com/pomerium/pomerium/pull/2703) (@dependabot[bot])
- chore\(deps\): bump github.com/caddyserver/certmagic from 0.14.5 to 0.15.1 [\#2685](https://github.com/pomerium/pomerium/pull/2685) (@dependabot[bot])
- chore\(deps\): bump github.com/peterbourgon/ff/v3 from 3.1.0 to 3.1.2 [\#2672](https://github.com/pomerium/pomerium/pull/2672) (@dependabot[bot])
- chore\(deps\): bump github.com/shirou/gopsutil/v3 from 3.21.8 to 3.21.9 [\#2671](https://github.com/pomerium/pomerium/pull/2671) (@dependabot[bot])
- chore\(deps\): bump github.com/docker/docker from 20.10.8+incompatible to 20.10.9+incompatible [\#2670](https://github.com/pomerium/pomerium/pull/2670) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.57.0 to 0.58.0 [\#2660](https://github.com/pomerium/pomerium/pull/2660) (@dependabot[bot])
- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.11.3 to 8.11.4 [\#2659](https://github.com/pomerium/pomerium/pull/2659) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.32.1 to 0.33.1 [\#2658](https://github.com/pomerium/pomerium/pull/2658) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/common from 0.31.0 to 0.31.1 [\#2656](https://github.com/pomerium/pomerium/pull/2656) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.32.0 to 0.32.1 [\#2633](https://github.com/pomerium/pomerium/pull/2633) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/grpc from 1.40.0 to 1.41.0 [\#2632](https://github.com/pomerium/pomerium/pull/2632) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/common from 0.30.0 to 0.31.0 [\#2631](https://github.com/pomerium/pomerium/pull/2631) (@dependabot[bot])
- chore\(deps\): bump sigs.k8s.io/yaml from 1.2.0 to 1.3.0 [\#2630](https://github.com/pomerium/pomerium/pull/2630) (@dependabot[bot])
- chore\(deps\): bump github.com/ory/dockertest/v3 from 3.7.0 to 3.8.0 [\#2629](https://github.com/pomerium/pomerium/pull/2629) (@dependabot[bot])
- chore\(deps\): bump github.com/spf13/viper from 1.8.1 to 1.9.0 [\#2616](https://github.com/pomerium/pomerium/pull/2616) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.56.0 to 0.57.0 [\#2615](https://github.com/pomerium/pomerium/pull/2615) (@dependabot[bot])
- chore\(deps\): bump github.com/coreos/go-oidc/v3 from 3.0.0 to 3.1.0 [\#2614](https://github.com/pomerium/pomerium/pull/2614) (@dependabot[bot])
- bump protoc-validate [\#2606](https://github.com/pomerium/pomerium/pull/2606) (@wasaga)
- chore\(deps\): bump go.uber.org/zap from 1.19.0 to 1.19.1 [\#2592](https://github.com/pomerium/pomerium/pull/2592) (@dependabot[bot])
- chore\(deps\): bump github.com/rs/zerolog from 1.24.0 to 1.25.0 [\#2591](https://github.com/pomerium/pomerium/pull/2591) (@dependabot[bot])
- chore\(deps\): bump github.com/shirou/gopsutil/v3 from 3.21.7 to 3.21.8 [\#2577](https://github.com/pomerium/pomerium/pull/2577) (@dependabot[bot])
- chore\(deps\): bump github.com/golangci/golangci-lint from 1.42.0 to 1.42.1 [\#2576](https://github.com/pomerium/pomerium/pull/2576) (@dependabot[bot])
- chore\(deps\): bump github.com/caddyserver/certmagic from 0.14.4 to 0.14.5 [\#2575](https://github.com/pomerium/pomerium/pull/2575) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.54.0 to 0.56.0 [\#2574](https://github.com/pomerium/pomerium/pull/2574) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.31.0 to 0.32.0 [\#2573](https://github.com/pomerium/pomerium/pull/2573) (@dependabot[bot])
- chore\(deps\): bump github.com/fsnotify/fsnotify from 1.5.0 to 1.5.1 [\#2554](https://github.com/pomerium/pomerium/pull/2554) (@dependabot[bot])
- chore\(deps\): bump github.com/caddyserver/certmagic from 0.14.3 to 0.14.4 [\#2553](https://github.com/pomerium/pomerium/pull/2553) (@dependabot[bot])
- chore\(deps\): bump github.com/rs/zerolog from 1.23.0 to 1.24.0 [\#2552](https://github.com/pomerium/pomerium/pull/2552) (@dependabot[bot])
- chore\(deps\): bump github.com/docker/docker from 20.10.7+incompatible to 20.10.8+incompatible [\#2551](https://github.com/pomerium/pomerium/pull/2551) (@dependabot[bot])
- chore\(deps\): bump github.com/caddyserver/certmagic from 0.14.1 to 0.14.3 [\#2550](https://github.com/pomerium/pomerium/pull/2550) (@dependabot[bot])
- chore\(deps\): bump contrib.go.opencensus.io/exporter/prometheus from 0.3.0 to 0.4.0 [\#2549](https://github.com/pomerium/pomerium/pull/2549) (@dependabot[bot])
- chore\(deps\): bump github.com/cespare/xxhash/v2 from 2.1.1 to 2.1.2 [\#2548](https://github.com/pomerium/pomerium/pull/2548) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/procfs from 0.7.2 to 0.7.3 [\#2512](https://github.com/pomerium/pomerium/pull/2512) (@dependabot[bot])
- chore\(deps\): bump github.com/golangci/golangci-lint from 1.41.1 to 1.42.0 [\#2511](https://github.com/pomerium/pomerium/pull/2511) (@dependabot[bot])
- chore\(deps\): bump github.com/fsnotify/fsnotify from 1.4.9 to 1.5.0 [\#2510](https://github.com/pomerium/pomerium/pull/2510) (@dependabot[bot])
- ci: use go 1.17.x [\#2492](https://github.com/pomerium/pomerium/pull/2492) (@desimone)
- chore\(deps\): bump google.golang.org/grpc from 1.39.1 to 1.40.0 [\#2478](https://github.com/pomerium/pomerium/pull/2478) (@dependabot[bot])
- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.11.2 to 8.11.3 [\#2477](https://github.com/pomerium/pomerium/pull/2477) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.52.0 to 0.54.0 [\#2476](https://github.com/pomerium/pomerium/pull/2476) (@dependabot[bot])
- chore\(deps\): bump go.uber.org/zap from 1.18.1 to 1.19.0 [\#2475](https://github.com/pomerium/pomerium/pull/2475) (@dependabot[bot])
- ci: support darwn/arm64 aka m1 for cli [\#2473](https://github.com/pomerium/pomerium/pull/2473) (@desimone)
- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.11.1 to 8.11.2 [\#2459](https://github.com/pomerium/pomerium/pull/2459) (@backport-actions-token[bot])
- chore\(deps\): bump google.golang.org/grpc from 1.39.0 to 1.39.1 [\#2457](https://github.com/pomerium/pomerium/pull/2457) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/procfs from 0.7.1 to 0.7.2 [\#2456](https://github.com/pomerium/pomerium/pull/2456) (@dependabot[bot])
- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.11.1 to 8.11.2 [\#2455](https://github.com/pomerium/pomerium/pull/2455) (@dependabot[bot])
- Hadolint [\#2363](https://github.com/pomerium/pomerium/pull/2363) (@stephengroat)

### Deployment

- deployment: remove DST\_Root\_CA\_X3 from docker images [\#2677](https://github.com/pomerium/pomerium/pull/2677) (@travisgroth)
- deployment: update goreleaser syntax [\#2524](https://github.com/pomerium/pomerium/pull/2524) (@travisgroth)

### Changed

- ci: remove hadolint [\#2726](https://github.com/pomerium/pomerium/pull/2726) (@travisgroth)
- ci: ignore multiple run commands [\#2566](https://github.com/pomerium/pomerium/pull/2566) (@travisgroth)
- redirect logo to the marketing site [\#2441](https://github.com/pomerium/pomerium/pull/2441) (@alexfornuto)

## [v0.15.5](https://github.com/pomerium/pomerium/tree/v0.15.5) (2021-10-22)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.15.4...v0.15.5)

### New

- skip configuration updates to the most recent one [\#2692](https://github.com/pomerium/pomerium/pull/2692) (@backport-actions-token[bot])

### Documentation

- Update create TLS command to quote strings. [\#2697](https://github.com/pomerium/pomerium/pull/2697) (@backport-actions-token[bot])
- DOCS: CORS preflight in console [\#2693](https://github.com/pomerium/pomerium/pull/2693) (@backport-actions-token[bot])
- Docs: Correct Claim Example [\#2691](https://github.com/pomerium/pomerium/pull/2691) (@backport-actions-token[bot])
- Fix typo in docs [\#2684](https://github.com/pomerium/pomerium/pull/2684) (@backport-actions-token[bot])

### Deployment

- deployment: remove DST\_Root\_CA\_X3 from docker images [\#2698](https://github.com/pomerium/pomerium/pull/2698) (@travisgroth)

## [v0.15.4](https://github.com/pomerium/pomerium/tree/v0.15.4) (2021-10-14)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.15.3...v0.15.4)

### New

- protoutil: add NewAny method for deterministic serialization [\#2662](https://github.com/pomerium/pomerium/pull/2662) (@backport-actions-token[bot])

### Fixed

- backport: host rewrite [\#2669](https://github.com/pomerium/pomerium/pull/2669) (@wasaga)

### Documentation

- Fixed 'kubtctl' typo on releases page [\#2680](https://github.com/pomerium/pomerium/pull/2680) (@backport-actions-token[bot])
- Refresh and Update TCP documentation [\#2679](https://github.com/pomerium/pomerium/pull/2679) (@backport-actions-token[bot])
- Docs: Ingress Controller [\#2667](https://github.com/pomerium/pomerium/pull/2667) (@alexfornuto)
- add service account redirects [\#2665](https://github.com/pomerium/pomerium/pull/2665) (@backport-actions-token[bot])
- DOCS: Standardize Relative Links \(\#2651\) [\#2654](https://github.com/pomerium/pomerium/pull/2654) (@alexfornuto)
- Docs: cross-reference links between concepts and reference [\#2650](https://github.com/pomerium/pomerium/pull/2650) (@backport-actions-token[bot])
- DOCS: Collapse IDP Header [\#2649](https://github.com/pomerium/pomerium/pull/2649) (@backport-actions-token[bot])
- typo [\#2646](https://github.com/pomerium/pomerium/pull/2646) (@backport-actions-token[bot])
- Docs: Batch Updates [\#2640](https://github.com/pomerium/pomerium/pull/2640) (@backport-actions-token[bot])
- docs: remove extra word / updated docs link [\#2639](https://github.com/pomerium/pomerium/pull/2639) (@backport-actions-token[bot])
- TCP Client Doc [\#2626](https://github.com/pomerium/pomerium/pull/2626) (@backport-actions-token[bot])
- DOC: Copy edits to Okta IdP doc. [\#2625](https://github.com/pomerium/pomerium/pull/2625) (@backport-actions-token[bot])
- DOCS: Update Enterprise Reference Docs [\#2624](https://github.com/pomerium/pomerium/pull/2624) (@backport-actions-token[bot])
- Docs/batch link fixes [\#2622](https://github.com/pomerium/pomerium/pull/2622) (@backport-actions-token[bot])
- Add redirect for installation [\#2620](https://github.com/pomerium/pomerium/pull/2620) (@backport-actions-token[bot])
- Document Enterprise API [\#2619](https://github.com/pomerium/pomerium/pull/2619) (@backport-actions-token[bot])

## [v0.15.3](https://github.com/pomerium/pomerium/tree/v0.15.3) (2021-09-17)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.15.2...v0.15.3)

### New

- cli: update tcp log output format [\#2587](https://github.com/pomerium/pomerium/pull/2587) (@travisgroth)

### Fixed

- backport 2593 and 2594 to 0.15 [\#2598](https://github.com/pomerium/pomerium/pull/2598) (@calebdoxsey)

### Documentation

- Add docs team as a code owner of packages.json [\#2607](https://github.com/pomerium/pomerium/pull/2607) (@backport-actions-token[bot])
- New Topic Page: Original Request Context [\#2602](https://github.com/pomerium/pomerium/pull/2602) (@backport-actions-token[bot])
- Document recovery token generation [\#2601](https://github.com/pomerium/pomerium/pull/2601) (@backport-actions-token[bot])
- DOCS: Add copy button to code snippets [\#2600](https://github.com/pomerium/pomerium/pull/2600) (@backport-actions-token[bot])
- docs: rename updated icon image [\#2583](https://github.com/pomerium/pomerium/pull/2583) (@backport-actions-token[bot])
- docs: add updated icon asset [\#2581](https://github.com/pomerium/pomerium/pull/2581) (@backport-actions-token[bot])

### Changed

- Update CODEOWNERS [\#2604](https://github.com/pomerium/pomerium/pull/2604) (@backport-actions-token[bot])

## [v0.15.2](https://github.com/pomerium/pomerium/tree/v0.15.2) (2021-09-03)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.14.8...v0.15.2)

### New

- allow pomerium to start without certs [\#2556](https://github.com/pomerium/pomerium/pull/2556) (@backport-actions-token[bot])

### Fixed

- authorize: use session.user\_id in headers [\#2572](https://github.com/pomerium/pomerium/pull/2572) (@backport-actions-token[bot])
- ppl: use session.user\_id instead of user.id for user criterion [\#2563](https://github.com/pomerium/pomerium/pull/2563) (@backport-actions-token[bot])
- authorize: fix google cloudrun header audience [\#2560](https://github.com/pomerium/pomerium/pull/2560) (@backport-actions-token[bot])
- authorize: fix X-Pomerium-Claim-Groups [\#2540](https://github.com/pomerium/pomerium/pull/2540) (@backport-actions-token[bot])

### Documentation

- docs: enterprise console v0.15.2 changelog [\#2565](https://github.com/pomerium/pomerium/pull/2565) (@backport-actions-token[bot])
- Docs: Fix merged PR [\#2547](https://github.com/pomerium/pomerium/pull/2547) (@backport-actions-token[bot])
- Update Ping Identity IdP  [\#2545](https://github.com/pomerium/pomerium/pull/2545) (@backport-actions-token[bot])
- update OneLogin IdP doc [\#2544](https://github.com/pomerium/pomerium/pull/2544) (@backport-actions-token[bot])
- docs: enterprise v0.15.1 changelog [\#2543](https://github.com/pomerium/pomerium/pull/2543) (@backport-actions-token[bot])
- Updates to Enterprise Quickstart instructions [\#2531](https://github.com/pomerium/pomerium/pull/2531) (@backport-actions-token[bot])
## [v0.15.0](https://github.com/pomerium/pomerium/tree/v0.15.0) (2021-08-05)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.14.7...v0.15.0)

### Breaking

- config: remove support for ed25519 signing keys [\#2430](https://github.com/pomerium/pomerium/pull/2430) (@calebdoxsey)

### New

- telemetry: add nonce and make explicit ack/nack [\#2434](https://github.com/pomerium/pomerium/pull/2434) (@wasaga)
- authorize: log additional session details [\#2419](https://github.com/pomerium/pomerium/pull/2419) (@calebdoxsey)
- telemetry: try guess hostname or external IP addr for metrics [\#2412](https://github.com/pomerium/pomerium/pull/2412) (@wasaga)
- sessions: add impersonate\_session\_id, remove legacy impersonation [\#2407](https://github.com/pomerium/pomerium/pull/2407) (@calebdoxsey)
- envoyconfig: improvements [\#2402](https://github.com/pomerium/pomerium/pull/2402) (@calebdoxsey)
- config: add support for embedded PPL policy [\#2401](https://github.com/pomerium/pomerium/pull/2401) (@calebdoxsey)
- ppl: remove support for aliases [\#2400](https://github.com/pomerium/pomerium/pull/2400) (@calebdoxsey)
- directory: add logging http client to help with debugging outbound http requests [\#2385](https://github.com/pomerium/pomerium/pull/2385) (@calebdoxsey)
- evaluator: use `cryptutil.Hash` for script spans [\#2384](https://github.com/pomerium/pomerium/pull/2384) (@desimone)
- authorize: add additional tracing for rego evaluation [\#2381](https://github.com/pomerium/pomerium/pull/2381) (@calebdoxsey)
- k8s: add flush-credentials command [\#2379](https://github.com/pomerium/pomerium/pull/2379) (@calebdoxsey)
- urlutil: improve error message for urls with port in path [\#2377](https://github.com/pomerium/pomerium/pull/2377) (@calebdoxsey)
- ci: use revive instead of golint [\#2370](https://github.com/pomerium/pomerium/pull/2370) (@calebdoxsey)
- authorize: remove service account impersonate user id, email and groups [\#2365](https://github.com/pomerium/pomerium/pull/2365) (@calebdoxsey)
- envoyconfig: default zipkin path to / when empty [\#2359](https://github.com/pomerium/pomerium/pull/2359) (@calebdoxsey)
- config: add warning about http URLs [\#2358](https://github.com/pomerium/pomerium/pull/2358) (@calebdoxsey)
- authorize: log service account and impersonation details [\#2354](https://github.com/pomerium/pomerium/pull/2354) (@calebdoxsey)
- tools: add tools.go to pin go run apps [\#2344](https://github.com/pomerium/pomerium/pull/2344) (@calebdoxsey)
- envoyconfig: add bootstrap layered runtime configuration [\#2343](https://github.com/pomerium/pomerium/pull/2343) (@calebdoxsey)
- registry/redis: call publish from within lua function [\#2337](https://github.com/pomerium/pomerium/pull/2337) (@calebdoxsey)

### Fixed

- config: remove grpc server max connection age options [\#2427](https://github.com/pomerium/pomerium/pull/2427) (@calebdoxsey)
- authorize: add sid to JWT claims [\#2420](https://github.com/pomerium/pomerium/pull/2420) (@calebdoxsey)
- disable http/2 for websockets [\#2399](https://github.com/pomerium/pomerium/pull/2399) (@calebdoxsey)
- ci: update gcloud action [\#2393](https://github.com/pomerium/pomerium/pull/2393) (@travisgroth)
- google: remove WithHTTPClient [\#2391](https://github.com/pomerium/pomerium/pull/2391) (@calebdoxsey)
- telemetry: support b3 headers on gRPC server calls [\#2376](https://github.com/pomerium/pomerium/pull/2376) (@calebdoxsey)
- authorize: allow redirects on deny [\#2361](https://github.com/pomerium/pomerium/pull/2361) (@calebdoxsey)
- authorize: decode CheckRequest path for redirect [\#2357](https://github.com/pomerium/pomerium/pull/2357) (@calebdoxsey)
- envoyconfig: only delete cached files, ignore noisy error [\#2356](https://github.com/pomerium/pomerium/pull/2356) (@calebdoxsey)
- envoy: only check for pid with monitor [\#2355](https://github.com/pomerium/pomerium/pull/2355) (@calebdoxsey)
- fix: timeout in protobuf [\#2341](https://github.com/pomerium/pomerium/pull/2341) (@wasaga)
- authorize: support boolean deny results [\#2338](https://github.com/pomerium/pomerium/pull/2338) (@calebdoxsey)

### Security

- envoy: only allow embedding [\#2368](https://github.com/pomerium/pomerium/pull/2368) (@calebdoxsey)

### Documentation

- update v0.15 changelog [\#2436](https://github.com/pomerium/pomerium/pull/2436) (@travisgroth)
- doc updates [\#2433](https://github.com/pomerium/pomerium/pull/2433) (@calebdoxsey)
- Update Console installs to match signing\_key [\#2432](https://github.com/pomerium/pomerium/pull/2432) (@alexfornuto)
- docs/reference: Clarify use of idp\_service\_account [\#2431](https://github.com/pomerium/pomerium/pull/2431) (@the-maldridge)
- docs: clarify device identity, not state via client certs [\#2428](https://github.com/pomerium/pomerium/pull/2428) (@desimone)
- v0.15 release notes [\#2409](https://github.com/pomerium/pomerium/pull/2409) (@travisgroth)
- docs: only secure schemes are supported [\#2408](https://github.com/pomerium/pomerium/pull/2408) (@desimone)
- Installation Docs Restructuring [\#2406](https://github.com/pomerium/pomerium/pull/2406) (@alexfornuto)
- symlink security policy to root of project [\#2396](https://github.com/pomerium/pomerium/pull/2396) (@desimone)
- Enterprise Docs [\#2390](https://github.com/pomerium/pomerium/pull/2390) (@alexfornuto)
- Docs bug fixes [\#2362](https://github.com/pomerium/pomerium/pull/2362) (@alexfornuto)
- Docs sorting [\#2346](https://github.com/pomerium/pomerium/pull/2346) (@alexfornuto)
- Update installation source for mkcert [\#2340](https://github.com/pomerium/pomerium/pull/2340) (@alexfornuto)

### Dependency

- chore\(deps\): bump gopkg.in/auth0.v5 from 5.19.1 to 5.19.2 [\#2422](https://github.com/pomerium/pomerium/pull/2422) (@dependabot[bot])
- chore\(deps\): bump github.com/go-jose/go-jose/v3 from 3.0.0-rc.1 to 3.0.0 [\#2421](https://github.com/pomerium/pomerium/pull/2421) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/common from 0.29.0 to 0.30.0 [\#2417](https://github.com/pomerium/pomerium/pull/2417) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.30.2 to 0.31.0 [\#2416](https://github.com/pomerium/pomerium/pull/2416) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.51.0 to 0.52.0 [\#2415](https://github.com/pomerium/pomerium/pull/2415) (@dependabot[bot])
- chore\(deps\): bump github.com/shirou/gopsutil/v3 from 3.21.6 to 3.21.7 [\#2414](https://github.com/pomerium/pomerium/pull/2414) (@dependabot[bot])
- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.11.0 to 8.11.1 [\#2413](https://github.com/pomerium/pomerium/pull/2413) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/procfs from 0.7.0 to 0.7.1 [\#2395](https://github.com/pomerium/pomerium/pull/2395) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.50.0 to 0.51.0 [\#2394](https://github.com/pomerium/pomerium/pull/2394) (@dependabot[bot])
- chore\(deps\): bump github.com/google/uuid from 1.2.0 to 1.3.0 [\#2374](https://github.com/pomerium/pomerium/pull/2374) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.30.1 to 0.30.2 [\#2373](https://github.com/pomerium/pomerium/pull/2373) (@dependabot[bot])
- ci: convert to FOSSA scan [\#2371](https://github.com/pomerium/pomerium/pull/2371) (@travisgroth)
- chore\(deps\): bump github.com/golangci/golangci-lint from 1.40.1 to 1.41.1 [\#2353](https://github.com/pomerium/pomerium/pull/2353) (@dependabot[bot])
- chore\(deps\): bump github.com/caddyserver/certmagic from 0.14.0 to 0.14.1 [\#2352](https://github.com/pomerium/pomerium/pull/2352) (@dependabot[bot])
- chore\(deps\): bump github.com/rs/cors from 1.7.0 to 1.8.0 [\#2334](https://github.com/pomerium/pomerium/pull/2334) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.49.0 to 0.50.0 [\#2333](https://github.com/pomerium/pomerium/pull/2333) (@dependabot[bot])
- chore\(deps\): upgrade kind action to v1.2.0 [\#2331](https://github.com/pomerium/pomerium/pull/2331) (@travisgroth)
- chore\(deps\): bump github.com/spf13/cobra from 1.1.3 to 1.2.1 [\#2330](https://github.com/pomerium/pomerium/pull/2330) (@dependabot[bot])
- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.10.0 to 8.11.0 [\#2329](https://github.com/pomerium/pomerium/pull/2329) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/procfs from 0.6.0 to 0.7.0 [\#2328](https://github.com/pomerium/pomerium/pull/2328) (@dependabot[bot])
- chore\(deps\): bump github.com/shirou/gopsutil/v3 from 3.21.5 to 3.21.6 [\#2326](https://github.com/pomerium/pomerium/pull/2326) (@dependabot[bot])
- chore\(deps\): bump go.uber.org/zap from 1.17.0 to 1.18.1 [\#2325](https://github.com/pomerium/pomerium/pull/2325) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/grpc from 1.38.0 to 1.39.0 [\#2324](https://github.com/pomerium/pomerium/pull/2324) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.29.4 to 0.30.1 [\#2323](https://github.com/pomerium/pomerium/pull/2323) (@dependabot[bot])

### Changed

- redis: increase timeout on test [\#2425](https://github.com/pomerium/pomerium/pull/2425) (@calebdoxsey)
- build: add envoy files to `make clean` [\#2411](https://github.com/pomerium/pomerium/pull/2411) (@travisgroth)
- envoy: bump to 1.19 [\#2392](https://github.com/pomerium/pomerium/pull/2392) (@travisgroth)
- ci: use github app for backport credentials [\#2369](https://github.com/pomerium/pomerium/pull/2369) (@travisgroth)
- databroker: tests [\#2367](https://github.com/pomerium/pomerium/pull/2367) (@calebdoxsey)
- storage/inmemory: add tests for close behavior [\#2336](https://github.com/pomerium/pomerium/pull/2336) (@calebdoxsey)
- redis: refactor change signal test to be more deterministic [\#2335](https://github.com/pomerium/pomerium/pull/2335) (@calebdoxsey)
## [v0.14.8](https://github.com/pomerium/pomerium/tree/v0.14.8) (2021-08-26)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.15.1...v0.14.8)

### Security

- deps: bump envoy to v0.17.4 [\#2535](https://github.com/pomerium/pomerium/pull/2535) (@travisgroth)

### Documentation

- docs: only secure schemes are supported [\#2410](https://github.com/pomerium/pomerium/pull/2410) (@backport-actions-token[bot])
- Docs bug fixes [\#2364](https://github.com/pomerium/pomerium/pull/2364) (@github-actions[bot])
- Docs backporting [\#2351](https://github.com/pomerium/pomerium/pull/2351) (@alexfornuto)
- docs:  google gcp / workspace instructions [\#2350](https://github.com/pomerium/pomerium/pull/2350) (@github-actions[bot])

### Dependency

- chore\(deps\): upgrade kind action to v1.2.0 \(\#2281\) [\#2366](https://github.com/pomerium/pomerium/pull/2366) (@travisgroth)

### Changed

- ci: update gcloud action [\#2538](https://github.com/pomerium/pomerium/pull/2538) (@backport-actions-token[bot])

## [v0.15.1](https://github.com/pomerium/pomerium/tree/v0.15.1) (2021-08-25)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.15.0...v0.15.1)

### Fixed

- options: remove refresh\_cooldown, add allow\_spdy to proto [\#2448](https://github.com/pomerium/pomerium/pull/2448) (@backport-actions-token[bot])

### Security

- deps: update envoy to 1.19.1 [\#2527](https://github.com/pomerium/pomerium/pull/2527) (@backport-actions-token[bot])

### Documentation

- Update GitLab IdP doc [\#2529](https://github.com/pomerium/pomerium/pull/2529) (@backport-actions-token[bot])
- Remove api from GitLab defaultScope [\#2528](https://github.com/pomerium/pomerium/pull/2528) (@backport-actions-token[bot])
- update GitHub IdP doc [\#2508](https://github.com/pomerium/pomerium/pull/2508) (@backport-actions-token[bot])
- docs: update codeowners [\#2506](https://github.com/pomerium/pomerium/pull/2506) (@backport-actions-token[bot])
- Update Helm Instructions [\#2505](https://github.com/pomerium/pomerium/pull/2505) (@backport-actions-token[bot])
- Update Azure IdP Doc [\#2504](https://github.com/pomerium/pomerium/pull/2504) (@backport-actions-token[bot])
- Update IdP Overview Page [\#2502](https://github.com/pomerium/pomerium/pull/2502) (@backport-actions-token[bot])
- Update AWS cognito IdP doc [\#2501](https://github.com/pomerium/pomerium/pull/2501) (@backport-actions-token[bot])
- Auth0 Doc Refresh [\#2500](https://github.com/pomerium/pomerium/pull/2500) (@backport-actions-token[bot])
- document binding service to 443 [\#2499](https://github.com/pomerium/pomerium/pull/2499) (@backport-actions-token[bot])
- Update Okta IdP doc [\#2495](https://github.com/pomerium/pomerium/pull/2495) (@backport-actions-token[bot])
- adjust comment blocking [\#2489](https://github.com/pomerium/pomerium/pull/2489) (@backport-actions-token[bot])
- Update Docker Quickstart \(\#2482\) [\#2486](https://github.com/pomerium/pomerium/pull/2486) (@alexfornuto)
- docs: use generic email [\#2485](https://github.com/pomerium/pomerium/pull/2485) (@backport-actions-token[bot])
- wrap header example values as inline code. [\#2479](https://github.com/pomerium/pomerium/pull/2479) (@backport-actions-token[bot])
- docs: clarify  custom request header limitations [\#2472](https://github.com/pomerium/pomerium/pull/2472) (@backport-actions-token[bot])
- Document moving routes [\#2466](https://github.com/pomerium/pomerium/pull/2466) (@backport-actions-token[bot])
- Document tracing sample rate in console [\#2465](https://github.com/pomerium/pomerium/pull/2465) (@backport-actions-token[bot])
- docs: update enterprise helm instructions to use main repo [\#2464](https://github.com/pomerium/pomerium/pull/2464) (@backport-actions-token[bot])
- Enterprise Upgrade & Changelog Pages [\#2458](https://github.com/pomerium/pomerium/pull/2458) (@backport-actions-token[bot])
- Update binary install doc [\#2452](https://github.com/pomerium/pomerium/pull/2452) (@backport-actions-token[bot])
- docs: update branding, concepts [\#2449](https://github.com/pomerium/pomerium/pull/2449) (@backport-actions-token[bot])
- specify expected audience in Console config [\#2444](https://github.com/pomerium/pomerium/pull/2444) (@backport-actions-token[bot])
- redirect logo to the marketing site [\#2443](https://github.com/pomerium/pomerium/pull/2443) (@backport-actions-token[bot])
- docs: update branding [\#2440](https://github.com/pomerium/pomerium/pull/2440) (@backport-actions-token[bot])
- docs: update default version to v0.15 [\#2438](https://github.com/pomerium/pomerium/pull/2438) (@backport-actions-token[bot])

### Dependency

- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.11.1 to 8.11.2 [\#2459](https://github.com/pomerium/pomerium/pull/2459) (@backport-actions-token[bot])

### Deployment

- deployment: update goreleaser syntax [\#2525](https://github.com/pomerium/pomerium/pull/2525) (@backport-actions-token[bot])
- ci: support darwn/arm64 aka m1 for cli [\#2521](https://github.com/pomerium/pomerium/pull/2521) (@travisgroth)

## [v0.15.0](https://github.com/pomerium/pomerium/tree/v0.15.0) (2021-08-05)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.14.7...v0.15.0)

### Breaking

- config: remove support for ed25519 signing keys [\#2430](https://github.com/pomerium/pomerium/pull/2430) (@calebdoxsey)

### New

- telemetry: add nonce and make explicit ack/nack [\#2434](https://github.com/pomerium/pomerium/pull/2434) (@wasaga)
- authorize: log additional session details [\#2419](https://github.com/pomerium/pomerium/pull/2419) (@calebdoxsey)
- telemetry: try guess hostname or external IP addr for metrics [\#2412](https://github.com/pomerium/pomerium/pull/2412) (@wasaga)
- sessions: add impersonate\_session\_id, remove legacy impersonation [\#2407](https://github.com/pomerium/pomerium/pull/2407) (@calebdoxsey)
- envoyconfig: improvements [\#2402](https://github.com/pomerium/pomerium/pull/2402) (@calebdoxsey)
- config: add support for embedded PPL policy [\#2401](https://github.com/pomerium/pomerium/pull/2401) (@calebdoxsey)
- ppl: remove support for aliases [\#2400](https://github.com/pomerium/pomerium/pull/2400) (@calebdoxsey)
- directory: add logging http client to help with debugging outbound http requests [\#2385](https://github.com/pomerium/pomerium/pull/2385) (@calebdoxsey)
- evaluator: use `cryptutil.Hash` for script spans [\#2384](https://github.com/pomerium/pomerium/pull/2384) (@desimone)
- authorize: add additional tracing for rego evaluation [\#2381](https://github.com/pomerium/pomerium/pull/2381) (@calebdoxsey)
- k8s: add flush-credentials command [\#2379](https://github.com/pomerium/pomerium/pull/2379) (@calebdoxsey)
- urlutil: improve error message for urls with port in path [\#2377](https://github.com/pomerium/pomerium/pull/2377) (@calebdoxsey)
- ci: use revive instead of golint [\#2370](https://github.com/pomerium/pomerium/pull/2370) (@calebdoxsey)
- authorize: remove service account impersonate user id, email and groups [\#2365](https://github.com/pomerium/pomerium/pull/2365) (@calebdoxsey)
- envoyconfig: default zipkin path to / when empty [\#2359](https://github.com/pomerium/pomerium/pull/2359) (@calebdoxsey)
- config: add warning about http URLs [\#2358](https://github.com/pomerium/pomerium/pull/2358) (@calebdoxsey)
- authorize: log service account and impersonation details [\#2354](https://github.com/pomerium/pomerium/pull/2354) (@calebdoxsey)
- tools: add tools.go to pin go run apps [\#2344](https://github.com/pomerium/pomerium/pull/2344) (@calebdoxsey)
- envoyconfig: add bootstrap layered runtime configuration [\#2343](https://github.com/pomerium/pomerium/pull/2343) (@calebdoxsey)
- registry/redis: call publish from within lua function [\#2337](https://github.com/pomerium/pomerium/pull/2337) (@calebdoxsey)
- proxy: add idle timeout [\#2319](https://github.com/pomerium/pomerium/pull/2319) (@wasaga)
- cli: use proxy from environment [\#2316](https://github.com/pomerium/pomerium/pull/2316) (@tskinn)
- authorize: do not send redirects to gRPC  [\#2314](https://github.com/pomerium/pomerium/pull/2314) (@wasaga)
- certs: reject certs from databroker if they conflict with local [\#2309](https://github.com/pomerium/pomerium/pull/2309) (@wasaga)
- config: add enable\_google\_cloud\_serverless\_authentication to config protobuf [\#2306](https://github.com/pomerium/pomerium/pull/2306) (@calebdoxsey)
- envoy: refactor envoy embedding [\#2296](https://github.com/pomerium/pomerium/pull/2296) (@calebdoxsey)
- envoy: add full version [\#2287](https://github.com/pomerium/pomerium/pull/2287) (@calebdoxsey)
- authorize: handle grpc-web content types like json [\#2268](https://github.com/pomerium/pomerium/pull/2268) (@calebdoxsey)
- xds: retry storing configuration events [\#2266](https://github.com/pomerium/pomerium/pull/2266) (@calebdoxsey)
- envoyconfig: use zipkin tracer [\#2265](https://github.com/pomerium/pomerium/pull/2265) (@calebdoxsey)
- authorize: preserve original context [\#2247](https://github.com/pomerium/pomerium/pull/2247) (@wasaga)
- ppl: add data type, implement string and list matchers [\#2228](https://github.com/pomerium/pomerium/pull/2228) (@calebdoxsey)
- ppl: refactor authorize to evaluate PPL [\#2224](https://github.com/pomerium/pomerium/pull/2224) (@calebdoxsey)
- ppl: convert config policy to ppl [\#2218](https://github.com/pomerium/pomerium/pull/2218) (@calebdoxsey)
- Pomerium Policy Language [\#2202](https://github.com/pomerium/pomerium/pull/2202) (@calebdoxsey)
- telemetry: add hostname tag to metrics [\#2191](https://github.com/pomerium/pomerium/pull/2191) (@wasaga)
- envoy: disable timeouts for kubernetes [\#2189](https://github.com/pomerium/pomerium/pull/2189) (@calebdoxsey)
- registry: implement redis backend [\#2179](https://github.com/pomerium/pomerium/pull/2179) (@calebdoxsey)
- report instance hostname in xds events [\#2175](https://github.com/pomerium/pomerium/pull/2175) (@wasaga)
- databroker: implement leases [\#2172](https://github.com/pomerium/pomerium/pull/2172) (@calebdoxsey)

### Fixed

- config: remove grpc server max connection age options [\#2427](https://github.com/pomerium/pomerium/pull/2427) (@calebdoxsey)
- authorize: add sid to JWT claims [\#2420](https://github.com/pomerium/pomerium/pull/2420) (@calebdoxsey)
- disable http/2 for websockets [\#2399](https://github.com/pomerium/pomerium/pull/2399) (@calebdoxsey)
- ci: update gcloud action [\#2393](https://github.com/pomerium/pomerium/pull/2393) (@travisgroth)
- google: remove WithHTTPClient [\#2391](https://github.com/pomerium/pomerium/pull/2391) (@calebdoxsey)
- telemetry: support b3 headers on gRPC server calls [\#2376](https://github.com/pomerium/pomerium/pull/2376) (@calebdoxsey)
- authorize: allow redirects on deny [\#2361](https://github.com/pomerium/pomerium/pull/2361) (@calebdoxsey)
- authorize: decode CheckRequest path for redirect [\#2357](https://github.com/pomerium/pomerium/pull/2357) (@calebdoxsey)
- envoyconfig: only delete cached files, ignore noisy error [\#2356](https://github.com/pomerium/pomerium/pull/2356) (@calebdoxsey)
- envoy: only check for pid with monitor [\#2355](https://github.com/pomerium/pomerium/pull/2355) (@calebdoxsey)
- fix: timeout in protobuf [\#2341](https://github.com/pomerium/pomerium/pull/2341) (@wasaga)
- authorize: support boolean deny results [\#2338](https://github.com/pomerium/pomerium/pull/2338) (@calebdoxsey)
- ppl: fix not/nor rules [\#2313](https://github.com/pomerium/pomerium/pull/2313) (@calebdoxsey)
- directory/azure: add paging support to user group members call [\#2311](https://github.com/pomerium/pomerium/pull/2311) (@calebdoxsey)
- ocsp: reload on response changes [\#2286](https://github.com/pomerium/pomerium/pull/2286) (@wasaga)
- envoy: fix usage of codec\_type with alpn [\#2277](https://github.com/pomerium/pomerium/pull/2277) (@calebdoxsey)
- databroker: only tag contexts used for UpdateRecords [\#2269](https://github.com/pomerium/pomerium/pull/2269) (@wasaga)
- redis: enforce capacity via ZREVRANGE to avoid race [\#2267](https://github.com/pomerium/pomerium/pull/2267) (@calebdoxsey)
- authorize: only redirect for HTML pages [\#2264](https://github.com/pomerium/pomerium/pull/2264) (@calebdoxsey)
- tracing: support dynamic reloading, more aggressive envoy restart [\#2262](https://github.com/pomerium/pomerium/pull/2262) (@calebdoxsey)
- envoy: always set jwt claim headers even if no value is available [\#2261](https://github.com/pomerium/pomerium/pull/2261) (@calebdoxsey)
- envoy: disable hot-reload for macos [\#2259](https://github.com/pomerium/pomerium/pull/2259) (@calebdoxsey)
- authorize: round timestamp [\#2258](https://github.com/pomerium/pomerium/pull/2258) (@wasaga)
- options: s/shared-key/shared secret [\#2257](https://github.com/pomerium/pomerium/pull/2257) (@desimone)
- config: warn about unrecognized keys  [\#2256](https://github.com/pomerium/pomerium/pull/2256) (@wasaga)
- darwin: use gopsutil v3 to fix arm issue [\#2245](https://github.com/pomerium/pomerium/pull/2245) (@calebdoxsey)
- policy: fix allowed idp claims PPL generation [\#2243](https://github.com/pomerium/pomerium/pull/2243) (@calebdoxsey)
- envoy: exit if envoy exits [\#2240](https://github.com/pomerium/pomerium/pull/2240) (@calebdoxsey)
- envoyconfig: fallback to global custom ca when no policy ca is defined [\#2235](https://github.com/pomerium/pomerium/pull/2235) (@calebdoxsey)
- envoy: add global response headers to local replies [\#2217](https://github.com/pomerium/pomerium/pull/2217) (@calebdoxsey)
- forward auth: don't strip query parameters [\#2216](https://github.com/pomerium/pomerium/pull/2216) (@wasaga)
- PPL: bubble up values, bug fixes [\#2213](https://github.com/pomerium/pomerium/pull/2213) (@calebdoxsey)
- Revert "authenticate,proxy: add same site lax to cookies" [\#2203](https://github.com/pomerium/pomerium/pull/2203) (@desimone)
- authorize: grpc health check [\#2200](https://github.com/pomerium/pomerium/pull/2200) (@wasaga)
- proxy / controplane: use old upstream cipher suite [\#2196](https://github.com/pomerium/pomerium/pull/2196) (@desimone)
- deployment: fix empty version on master builds [\#2193](https://github.com/pomerium/pomerium/pull/2193) (@travisgroth)

### Security

- envoy: only allow embedding [\#2368](https://github.com/pomerium/pomerium/pull/2368) (@calebdoxsey)
- deps: bump envoy to v1.17.3 [\#2198](https://github.com/pomerium/pomerium/pull/2198) (@travisgroth)

### Documentation

- doc updates [\#2433](https://github.com/pomerium/pomerium/pull/2433) (@calebdoxsey)
- Update Console installs to match signing\_key [\#2432](https://github.com/pomerium/pomerium/pull/2432) (@alexfornuto)
- docs/reference: Clarify use of idp\_service\_account [\#2431](https://github.com/pomerium/pomerium/pull/2431) (@the-maldridge)
- docs: clarify device identity, not state via client certs [\#2428](https://github.com/pomerium/pomerium/pull/2428) (@desimone)
- v0.15 release notes [\#2409](https://github.com/pomerium/pomerium/pull/2409) (@travisgroth)
- docs: only secure schemes are supported [\#2408](https://github.com/pomerium/pomerium/pull/2408) (@desimone)
- Installation Docs Restructuring [\#2406](https://github.com/pomerium/pomerium/pull/2406) (@alexfornuto)
- symlink security policy to root of project [\#2396](https://github.com/pomerium/pomerium/pull/2396) (@desimone)
- Enterprise Docs [\#2390](https://github.com/pomerium/pomerium/pull/2390) (@alexfornuto)
- Helm Quickstart Update [\#2380](https://github.com/pomerium/pomerium/pull/2380) (@alexfornuto)
- Docs bug fixes [\#2362](https://github.com/pomerium/pomerium/pull/2362) (@alexfornuto)
- Docs sorting [\#2346](https://github.com/pomerium/pomerium/pull/2346) (@alexfornuto)
- Update installation source for mkcert [\#2340](https://github.com/pomerium/pomerium/pull/2340) (@alexfornuto)
- Update kubernetes-dashboard.md [\#2285](https://github.com/pomerium/pomerium/pull/2285) (@WeeHong)
- Transmission BitTorrent Client Guide [\#2281](https://github.com/pomerium/pomerium/pull/2281) (@alexfornuto)
- docs:  google gcp / workspace instructions [\#2272](https://github.com/pomerium/pomerium/pull/2272) (@desimone)
- docs: update helm values for chart v20.0.0 [\#2242](https://github.com/pomerium/pomerium/pull/2242) (@travisgroth)
- docs: update \_redirects [\#2237](https://github.com/pomerium/pomerium/pull/2237) (@desimone)
- add support for latest version of code-server [\#2229](https://github.com/pomerium/pomerium/pull/2229) (@bpmct)
- fix\(docs\): use correct name for code-server [\#2223](https://github.com/pomerium/pomerium/pull/2223) (@jsjoeio)
- docs: rm broken link [\#2215](https://github.com/pomerium/pomerium/pull/2215) (@alexfornuto)
- docs: Match Tenses [\#2214](https://github.com/pomerium/pomerium/pull/2214) (@alexfornuto)
- Update programmatic-access.md [\#2190](https://github.com/pomerium/pomerium/pull/2190) (@yyolk)
- docs: add v0.14 feature highlights [\#2184](https://github.com/pomerium/pomerium/pull/2184) (@github-actions[bot])
- docs: add v0.14 feature highlights [\#2183](https://github.com/pomerium/pomerium/pull/2183) (@travisgroth)
- docs: update slack link to vanity url [\#2177](https://github.com/pomerium/pomerium/pull/2177) (@travisgroth)

### Dependency

- chore\(deps\): bump gopkg.in/auth0.v5 from 5.19.1 to 5.19.2 [\#2422](https://github.com/pomerium/pomerium/pull/2422) (@dependabot[bot])
- chore\(deps\): bump github.com/go-jose/go-jose/v3 from 3.0.0-rc.1 to 3.0.0 [\#2421](https://github.com/pomerium/pomerium/pull/2421) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/common from 0.29.0 to 0.30.0 [\#2417](https://github.com/pomerium/pomerium/pull/2417) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.30.2 to 0.31.0 [\#2416](https://github.com/pomerium/pomerium/pull/2416) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.51.0 to 0.52.0 [\#2415](https://github.com/pomerium/pomerium/pull/2415) (@dependabot[bot])
- chore\(deps\): bump github.com/shirou/gopsutil/v3 from 3.21.6 to 3.21.7 [\#2414](https://github.com/pomerium/pomerium/pull/2414) (@dependabot[bot])
- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.11.0 to 8.11.1 [\#2413](https://github.com/pomerium/pomerium/pull/2413) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/procfs from 0.7.0 to 0.7.1 [\#2395](https://github.com/pomerium/pomerium/pull/2395) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.50.0 to 0.51.0 [\#2394](https://github.com/pomerium/pomerium/pull/2394) (@dependabot[bot])
- chore\(deps\): bump github.com/google/uuid from 1.2.0 to 1.3.0 [\#2374](https://github.com/pomerium/pomerium/pull/2374) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.30.1 to 0.30.2 [\#2373](https://github.com/pomerium/pomerium/pull/2373) (@dependabot[bot])
- ci: convert to FOSSA scan [\#2371](https://github.com/pomerium/pomerium/pull/2371) (@travisgroth)
- chore\(deps\): bump github.com/golangci/golangci-lint from 1.40.1 to 1.41.1 [\#2353](https://github.com/pomerium/pomerium/pull/2353) (@dependabot[bot])
- chore\(deps\): bump github.com/caddyserver/certmagic from 0.14.0 to 0.14.1 [\#2352](https://github.com/pomerium/pomerium/pull/2352) (@dependabot[bot])
- chore\(deps\): bump github.com/rs/cors from 1.7.0 to 1.8.0 [\#2334](https://github.com/pomerium/pomerium/pull/2334) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.49.0 to 0.50.0 [\#2333](https://github.com/pomerium/pomerium/pull/2333) (@dependabot[bot])
- chore\(deps\): upgrade kind action to v1.2.0 [\#2331](https://github.com/pomerium/pomerium/pull/2331) (@travisgroth)
- chore\(deps\): bump github.com/spf13/cobra from 1.1.3 to 1.2.1 [\#2330](https://github.com/pomerium/pomerium/pull/2330) (@dependabot[bot])
- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.10.0 to 8.11.0 [\#2329](https://github.com/pomerium/pomerium/pull/2329) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/procfs from 0.6.0 to 0.7.0 [\#2328](https://github.com/pomerium/pomerium/pull/2328) (@dependabot[bot])
- chore\(deps\): bump github.com/shirou/gopsutil/v3 from 3.21.5 to 3.21.6 [\#2326](https://github.com/pomerium/pomerium/pull/2326) (@dependabot[bot])
- chore\(deps\): bump go.uber.org/zap from 1.17.0 to 1.18.1 [\#2325](https://github.com/pomerium/pomerium/pull/2325) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/grpc from 1.38.0 to 1.39.0 [\#2324](https://github.com/pomerium/pomerium/pull/2324) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.29.4 to 0.30.1 [\#2323](https://github.com/pomerium/pomerium/pull/2323) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/protobuf from 1.26.0 to 1.27.0 [\#2318](https://github.com/pomerium/pomerium/pull/2318) (@dependabot[bot])
- chore\(deps\): bump github.com/spf13/viper from 1.8.0 to 1.8.1 [\#2317](https://github.com/pomerium/pomerium/pull/2317) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.48.0 to 0.49.0 [\#2315](https://github.com/pomerium/pomerium/pull/2315) (@dependabot[bot])
- chore\(deps\): bump github.com/spf13/viper from 1.7.1 to 1.8.0 [\#2305](https://github.com/pomerium/pomerium/pull/2305) (@dependabot[bot])
- chore\(deps\): bump gopkg.in/auth0.v5 from 5.18.0 to 5.19.1 [\#2304](https://github.com/pomerium/pomerium/pull/2304) (@dependabot[bot])
- chore\(deps\): bump github.com/ory/dockertest/v3 from 3.6.5 to 3.7.0 [\#2303](https://github.com/pomerium/pomerium/pull/2303) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.47.0 to 0.48.0 [\#2295](https://github.com/pomerium/pomerium/pull/2295) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/client\_golang from 1.10.0 to 1.11.0 [\#2294](https://github.com/pomerium/pomerium/pull/2294) (@dependabot[bot])
- chore\(deps\): bump github.com/rs/zerolog from 1.22.0 to 1.23.0 [\#2293](https://github.com/pomerium/pomerium/pull/2293) (@dependabot[bot])
- chore\(deps\): bump gopkg.in/auth0.v5 from 5.17.0 to 5.18.0 [\#2292](https://github.com/pomerium/pomerium/pull/2292) (@dependabot[bot])
- chore\(deps\): bump github.com/caddyserver/certmagic from 0.13.1 to 0.14.0 [\#2291](https://github.com/pomerium/pomerium/pull/2291) (@dependabot[bot])
- chore\(deps\): bump github.com/golang/mock from 1.5.0 to 1.6.0 [\#2290](https://github.com/pomerium/pomerium/pull/2290) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/common from 0.25.0 to 0.29.0 [\#2289](https://github.com/pomerium/pomerium/pull/2289) (@dependabot[bot])
- deps: upgrade to go-jose v3 [\#2284](https://github.com/pomerium/pomerium/pull/2284) (@calebdoxsey)
- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.9.0 to 8.10.0 [\#2276](https://github.com/pomerium/pomerium/pull/2276) (@dependabot[bot])
- chore\(deps\): bump github.com/shirou/gopsutil/v3 from 3.21.4 to 3.21.5 [\#2274](https://github.com/pomerium/pomerium/pull/2274) (@dependabot[bot])
- chore\(deps\): bump gopkg.in/square/go-jose.v2 from 2.5.1 to 2.6.0 [\#2273](https://github.com/pomerium/pomerium/pull/2273) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.28.0 to 0.29.4 [\#2255](https://github.com/pomerium/pomerium/pull/2255) (@dependabot[bot])
- chore\(deps\): bump go.uber.org/zap from 1.16.0 to 1.17.0 [\#2254](https://github.com/pomerium/pomerium/pull/2254) (@dependabot[bot])
- chore\(deps\): bump github.com/google/go-cmp from 0.5.5 to 0.5.6 [\#2253](https://github.com/pomerium/pomerium/pull/2253) (@dependabot[bot])
- chore\(deps\): bump github.com/cenkalti/backoff/v4 from 4.1.0 to 4.1.1 [\#2252](https://github.com/pomerium/pomerium/pull/2252) (@dependabot[bot])
- chore\(deps\): bump github.com/mitchellh/hashstructure/v2 from 2.0.1 to 2.0.2 [\#2251](https://github.com/pomerium/pomerium/pull/2251) (@dependabot[bot])
- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.8.3 to 8.9.0 [\#2249](https://github.com/pomerium/pomerium/pull/2249) (@dependabot[bot])
- darwin: use x86 envoy build for arm64 [\#2246](https://github.com/pomerium/pomerium/pull/2246) (@calebdoxsey)
- chore\(deps\): bump github.com/prometheus/common from 0.24.0 to 0.25.0 [\#2234](https://github.com/pomerium/pomerium/pull/2234) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.46.0 to 0.47.0 [\#2233](https://github.com/pomerium/pomerium/pull/2233) (@dependabot[bot])
- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.8.2 to 8.8.3 [\#2232](https://github.com/pomerium/pomerium/pull/2232) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/grpc from 1.37.1 to 1.38.0 [\#2231](https://github.com/pomerium/pomerium/pull/2231) (@dependabot[bot])
- dependency: update /x/net [\#2227](https://github.com/pomerium/pomerium/pull/2227) (@desimone)
- chore\(deps\): bump github.com/lithammer/shortuuid/v3 from 3.0.6 to 3.0.7 [\#2211](https://github.com/pomerium/pomerium/pull/2211) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/common from 0.23.0 to 0.24.0 [\#2210](https://github.com/pomerium/pomerium/pull/2210) (@dependabot[bot])
- chore\(deps\): bump github.com/rs/zerolog from 1.21.0 to 1.22.0 [\#2209](https://github.com/pomerium/pomerium/pull/2209) (@dependabot[bot])
- chore\(deps\): bump gopkg.in/auth0.v5 from 5.16.0 to 5.17.0 [\#2208](https://github.com/pomerium/pomerium/pull/2208) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/grpc from 1.37.0 to 1.37.1 [\#2207](https://github.com/pomerium/pomerium/pull/2207) (@dependabot[bot])
- chore\(deps\): bump github.com/caddyserver/certmagic from 0.13.0 to 0.13.1 [\#2188](https://github.com/pomerium/pomerium/pull/2188) (@dependabot[bot])
- chore\(deps\): bump gopkg.in/auth0.v5 from 5.15.0 to 5.16.0 [\#2187](https://github.com/pomerium/pomerium/pull/2187) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.45.0 to 0.46.0 [\#2186](https://github.com/pomerium/pomerium/pull/2186) (@dependabot[bot])

### Changed

- redis: increase timeout on test [\#2425](https://github.com/pomerium/pomerium/pull/2425) (@calebdoxsey)
- build: add envoy files to `make clean` [\#2411](https://github.com/pomerium/pomerium/pull/2411) (@travisgroth)
- envoy: bump to 1.19 [\#2392](https://github.com/pomerium/pomerium/pull/2392) (@travisgroth)
- ci: use github app for backport credentials [\#2369](https://github.com/pomerium/pomerium/pull/2369) (@travisgroth)
- databroker: tests [\#2367](https://github.com/pomerium/pomerium/pull/2367) (@calebdoxsey)
- storage/inmemory: add tests for close behavior [\#2336](https://github.com/pomerium/pomerium/pull/2336) (@calebdoxsey)
- redis: refactor change signal test to be more deterministic [\#2335](https://github.com/pomerium/pomerium/pull/2335) (@calebdoxsey)
- internal/envoy: add debugging information if envoy is no longer running [\#2320](https://github.com/pomerium/pomerium/pull/2320) (@travisgroth)
- ci: add coveralls [\#2279](https://github.com/pomerium/pomerium/pull/2279) (@travisgroth)

## [v0.14.7](https://github.com/pomerium/pomerium/tree/v0.14.7) (2021-06-24)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.14.6...v0.14.7)

### Fixed

- directory/azure: add paging support to user group members call [\#2312](https://github.com/pomerium/pomerium/pull/2312) (@github-actions[bot])

## [v0.14.6](https://github.com/pomerium/pomerium/tree/v0.14.6) (2021-06-16)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.14.5...v0.14.6)

### Fixed

- authorize: only redirect for HTML pages \(\#2264\) [\#2298](https://github.com/pomerium/pomerium/pull/2298) (@calebdoxsey)

## [v0.14.5](https://github.com/pomerium/pomerium/tree/v0.14.5) (2021-06-07)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.14.4...v0.14.5)

### Fixed

- envoy: fix usage of codec\_type with alpn [\#2278](https://github.com/pomerium/pomerium/pull/2278) (@github-actions[bot])
- authorize: round JWT claim timestamps [\#2260](https://github.com/pomerium/pomerium/pull/2260) (@wasaga)

### Documentation

- docs: update helm values for chart v20.0.0 [\#2244](https://github.com/pomerium/pomerium/pull/2244) (@github-actions[bot])
- docs: update \_redirects [\#2238](https://github.com/pomerium/pomerium/pull/2238) (@github-actions[bot])

## [v0.14.4](https://github.com/pomerium/pomerium/tree/v0.14.4) (2021-05-24)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.14.3...v0.14.4)

### Fixed

- authorize: add rego functions to custom evaluator [\#2236](https://github.com/pomerium/pomerium/pull/2236) (@calebdoxsey)

## [v0.14.3](https://github.com/pomerium/pomerium/tree/v0.14.3) (2021-05-21)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.14.2...v0.14.3)

### Fixed

- authorize: fix custom rego panic [\#2226](https://github.com/pomerium/pomerium/pull/2226) (@calebdoxsey)

### Changed

- envoy: add global response headers to local replies [\#2225](https://github.com/pomerium/pomerium/pull/2225) (@github-actions[bot])

## [v0.14.2](https://github.com/pomerium/pomerium/tree/v0.14.2) (2021-05-17)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.14.1...v0.14.2)

### Fixed

- Revert "authenticate,proxy: add same site lax to cookies" [\#2204](https://github.com/pomerium/pomerium/pull/2204) (@github-actions[bot])

### Documentation

- Update programmatic-access.md [\#2205](https://github.com/pomerium/pomerium/pull/2205) (@github-actions[bot])

## [v0.14.1](https://github.com/pomerium/pomerium/tree/v0.14.1) (2021-05-13)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.14.0...v0.14.1)

### Fixed

- proxy / controplane: use old upstream cipher suite [\#2197](https://github.com/pomerium/pomerium/pull/2197) (@github-actions[bot])

### Security

- deps: bump envoy to v1.17.3 [\#2199](https://github.com/pomerium/pomerium/pull/2199) (@github-actions[bot])

### Documentation

- docs: update slack link to vanity url [\#2178](https://github.com/pomerium/pomerium/pull/2178) (@github-actions[bot])

## [v0.14.0](https://github.com/pomerium/pomerium/tree/v0.14.0) (2021-05-04)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.14.0-rc2...v0.14.0)

### New

- databroker: store issued at timestamp with session [\#2173](https://github.com/pomerium/pomerium/pull/2173) (@calebdoxsey)
- config: add support for set\_response\_headers in a policy [\#2171](https://github.com/pomerium/pomerium/pull/2171) (@calebdoxsey)
- authenticate,proxy: add same site lax to cookies [\#2159](https://github.com/pomerium/pomerium/pull/2159) (@calebdoxsey)
- xds extended event [\#2158](https://github.com/pomerium/pomerium/pull/2158) (@wasaga)
- config: add client\_crl [\#2157](https://github.com/pomerium/pomerium/pull/2157) (@calebdoxsey)
- config: add support for codec\_type [\#2156](https://github.com/pomerium/pomerium/pull/2156) (@calebdoxsey)
- controlplane: save configuration events to databroker [\#2153](https://github.com/pomerium/pomerium/pull/2153) (@calebdoxsey)
- control plane: add request id to all error pages [\#2149](https://github.com/pomerium/pomerium/pull/2149) (@desimone)
- let pass custom dial opts [\#2144](https://github.com/pomerium/pomerium/pull/2144) (@wasaga)
- envoy: re-implement recommended defaults [\#2123](https://github.com/pomerium/pomerium/pull/2123) (@calebdoxsey)
- Drop tun.cfg.dstHost from jwtCacheKey [\#2115](https://github.com/pomerium/pomerium/pull/2115) (@bl0m1)
- config: remove validate side effects [\#2109](https://github.com/pomerium/pomerium/pull/2109) (@calebdoxsey)
- log context [\#2107](https://github.com/pomerium/pomerium/pull/2107) (@wasaga)
- databroker: add options for maximum capacity [\#2095](https://github.com/pomerium/pomerium/pull/2095) (@calebdoxsey)
- envoyconfig: move most bootstrap config to shared package [\#2088](https://github.com/pomerium/pomerium/pull/2088) (@calebdoxsey)
- envoy: refactor controlplane xds to new envoyconfig package [\#2086](https://github.com/pomerium/pomerium/pull/2086) (@calebdoxsey)
- config: rename headers to set\_response\_headers [\#2081](https://github.com/pomerium/pomerium/pull/2081) (@calebdoxsey)
- crypto: use actual bytes of shared secret, not the base64 encoded representation [\#2075](https://github.com/pomerium/pomerium/pull/2075) (@calebdoxsey)
- cryptutil: use bytes for hmac [\#2067](https://github.com/pomerium/pomerium/pull/2067) (@calebdoxsey)
- cryptutil: always use kek public id, add x509 support [\#2066](https://github.com/pomerium/pomerium/pull/2066) (@calebdoxsey)
- authorize: additional tracing, add benchmark for encryptor [\#2059](https://github.com/pomerium/pomerium/pull/2059) (@calebdoxsey)
- authorize: audit logging [\#2050](https://github.com/pomerium/pomerium/pull/2050) (@calebdoxsey)
- support host:port in metrics\_address [\#2042](https://github.com/pomerium/pomerium/pull/2042) (@wasaga)
- databroker: return server version in Get [\#2039](https://github.com/pomerium/pomerium/pull/2039) (@wasaga)
- authorize: add databroker server and record version to result, force sync via polling [\#2024](https://github.com/pomerium/pomerium/pull/2024) (@calebdoxsey)
- protoutil: add generic transformer [\#2023](https://github.com/pomerium/pomerium/pull/2023) (@calebdoxsey)
- cryptutil: add envelope encryption w/key encryption key and data encryption key [\#2020](https://github.com/pomerium/pomerium/pull/2020) (@calebdoxsey)
- autocert: add metrics for renewal count, total and next expiration [\#2019](https://github.com/pomerium/pomerium/pull/2019) (@calebdoxsey)
- telemetry: add installation id [\#2017](https://github.com/pomerium/pomerium/pull/2017) (@calebdoxsey)
- config: use getters for certificates [\#2001](https://github.com/pomerium/pomerium/pull/2001) (@calebdoxsey)
- config: use getters for authenticate, signout and forward auth urls [\#2000](https://github.com/pomerium/pomerium/pull/2000) (@calebdoxsey)
- xds: use ALPN Auto config for upstream protocol when possible [\#1995](https://github.com/pomerium/pomerium/pull/1995) (@calebdoxsey)
- envoy: upgrade to v1.17.1 [\#1993](https://github.com/pomerium/pomerium/pull/1993) (@calebdoxsey)
- redis: add redis cluster support [\#1992](https://github.com/pomerium/pomerium/pull/1992) (@calebdoxsey)
- redis: add support for redis-sentinel [\#1991](https://github.com/pomerium/pomerium/pull/1991) (@calebdoxsey)
- authorize: set JWT to expire after 5 minutes [\#1980](https://github.com/pomerium/pomerium/pull/1980) (@calebdoxsey)
- identity: infer email from mail claim [\#1977](https://github.com/pomerium/pomerium/pull/1977) (@calebdoxsey)
- ping: identity and directory providers [\#1975](https://github.com/pomerium/pomerium/pull/1975) (@calebdoxsey)
- config: add rewrite\_response\_headers to protobuf [\#1962](https://github.com/pomerium/pomerium/pull/1962) (@calebdoxsey)
- config: add rewrite\_response\_headers option [\#1961](https://github.com/pomerium/pomerium/pull/1961) (@calebdoxsey)
- assets: use embed instead of statik [\#1960](https://github.com/pomerium/pomerium/pull/1960) (@calebdoxsey)
- config: log config source changes [\#1959](https://github.com/pomerium/pomerium/pull/1959) (@calebdoxsey)
- config: multiple endpoints for authorize and databroker [\#1957](https://github.com/pomerium/pomerium/pull/1957) (@calebdoxsey)
- telemetry: add process collector for envoy [\#1948](https://github.com/pomerium/pomerium/pull/1948) (@calebdoxsey)
- use build\_info as liveness gauge metric [\#1940](https://github.com/pomerium/pomerium/pull/1940) (@wasaga)
- metrics: add TLS options [\#1939](https://github.com/pomerium/pomerium/pull/1939) (@calebdoxsey)
- identity: record metric for last refresh [\#1936](https://github.com/pomerium/pomerium/pull/1936) (@calebdoxsey)
- middleware: basic auth equalize lengths of input [\#1934](https://github.com/pomerium/pomerium/pull/1934) (@desimone)
- autocert: remove non-determinism [\#1932](https://github.com/pomerium/pomerium/pull/1932) (@calebdoxsey)
- config: add metrics\_basic\_auth option [\#1917](https://github.com/pomerium/pomerium/pull/1917) (@calebdoxsey)
- envoy: validate binary checksum [\#1908](https://github.com/pomerium/pomerium/pull/1908) (@calebdoxsey)
- config: support map of jwt claim headers [\#1906](https://github.com/pomerium/pomerium/pull/1906) (@calebdoxsey)
- Remove internal/protoutil. [\#1893](https://github.com/pomerium/pomerium/pull/1893) (@yegle)
- databroker: refactor databroker to sync all changes [\#1879](https://github.com/pomerium/pomerium/pull/1879) (@calebdoxsey)
- config: add CertificateFiles to FileWatcherSource list [\#1878](https://github.com/pomerium/pomerium/pull/1878) (@travisgroth)
- config: allow customization of envoy boostrap admin options [\#1872](https://github.com/pomerium/pomerium/pull/1872) (@calebdoxsey)
- proxy: implement pass-through for authenticate backend [\#1870](https://github.com/pomerium/pomerium/pull/1870) (@calebdoxsey)
- authorize: move headers and jwt signing to rego [\#1856](https://github.com/pomerium/pomerium/pull/1856) (@calebdoxsey)

### Fixed

- deployment: update alpine debug image dependencies [\#2154](https://github.com/pomerium/pomerium/pull/2154) (@travisgroth)
- authorize: refactor store locking [\#2151](https://github.com/pomerium/pomerium/pull/2151) (@calebdoxsey)
- databroker: store server version in backend [\#2142](https://github.com/pomerium/pomerium/pull/2142) (@calebdoxsey)
- authorize: audit log had duplicate "message" key [\#2141](https://github.com/pomerium/pomerium/pull/2141) (@desimone)
- httputil: fix SPDY support with reverse proxy [\#2134](https://github.com/pomerium/pomerium/pull/2134) (@calebdoxsey)
- envoyconfig: fix metrics ingress listener name [\#2124](https://github.com/pomerium/pomerium/pull/2124) (@calebdoxsey)
- authorize: fix empty sub policy arrays [\#2119](https://github.com/pomerium/pomerium/pull/2119) (@calebdoxsey)
- authorize: fix unsigned URL [\#2118](https://github.com/pomerium/pomerium/pull/2118) (@calebdoxsey)
- authorize: support arbitrary jwt claims [\#2102](https://github.com/pomerium/pomerium/pull/2102) (@calebdoxsey)
- authorize: support arbitrary jwt claims [\#2106](https://github.com/pomerium/pomerium/pull/2106) (@github-actions[bot])
- xdsmgr: update resource versions on NACK [\#2093](https://github.com/pomerium/pomerium/pull/2093) (@calebdoxsey)
- config: don't change address value on databroker or authorize [\#2092](https://github.com/pomerium/pomerium/pull/2092) (@travisgroth)
- metrics\_address should be optional parameter [\#2087](https://github.com/pomerium/pomerium/pull/2087) (@wasaga)
- propagate changes back from encrypted backend [\#2079](https://github.com/pomerium/pomerium/pull/2079) (@wasaga)
- config: use tls\_custom\_ca from policy when available [\#2077](https://github.com/pomerium/pomerium/pull/2077) (@calebdoxsey)
- databroker: remove unused installation id, close streams when backend is closed [\#2062](https://github.com/pomerium/pomerium/pull/2062) (@calebdoxsey)
- authenticate: fix default sign out url [\#2061](https://github.com/pomerium/pomerium/pull/2061) (@calebdoxsey)
- change require\_proxy\_protocol to use\_proxy\_protocol [\#2043](https://github.com/pomerium/pomerium/pull/2043) (@contrun)
- authorize: bypass data in rego for databroker data [\#2041](https://github.com/pomerium/pomerium/pull/2041) (@calebdoxsey)
- proxy: add nil check for fix-misdirected [\#2040](https://github.com/pomerium/pomerium/pull/2040) (@calebdoxsey)
- config: add headers to config proto [\#1996](https://github.com/pomerium/pomerium/pull/1996) (@calebdoxsey)
- Fix process cpu usage metric [\#1979](https://github.com/pomerium/pomerium/pull/1979) (@wasaga)
- cmd/pomerium: exit 0 for normal shutdown [\#1958](https://github.com/pomerium/pomerium/pull/1958) (@travisgroth)
- proxy: redirect to dashboard for logout [\#1944](https://github.com/pomerium/pomerium/pull/1944) (@calebdoxsey)
- config: fix redirect routes from protobuf [\#1930](https://github.com/pomerium/pomerium/pull/1930) (@travisgroth)
- google: fix default provider URL [\#1928](https://github.com/pomerium/pomerium/pull/1928) (@calebdoxsey)
- fix registry test [\#1911](https://github.com/pomerium/pomerium/pull/1911) (@wasaga)
- ci: pin goreleaser version [\#1900](https://github.com/pomerium/pomerium/pull/1900) (@travisgroth)
- onelogin: fix default scopes for v2 [\#1896](https://github.com/pomerium/pomerium/pull/1896) (@calebdoxsey)
- xds: fix misdirected script [\#1895](https://github.com/pomerium/pomerium/pull/1895) (@calebdoxsey)
- authenticate: validate origin of signout [\#1876](https://github.com/pomerium/pomerium/pull/1876) (@desimone)
- redis: fix deletion versioning [\#1871](https://github.com/pomerium/pomerium/pull/1871) (@calebdoxsey)
- options: header only applies to routes and authN [\#1862](https://github.com/pomerium/pomerium/pull/1862) (@desimone)
- controlplane: add global headers to virtualhost [\#1861](https://github.com/pomerium/pomerium/pull/1861) (@desimone)
- unique envoy cluster ids [\#1858](https://github.com/pomerium/pomerium/pull/1858) (@wasaga)

### Security

- ci: remove codecov [\#2161](https://github.com/pomerium/pomerium/pull/2161) (@travisgroth)
- internal/envoy: always extract envoy [\#2160](https://github.com/pomerium/pomerium/pull/2160) (@travisgroth)
- deps: bump envoy to 1.17.2 [\#2113](https://github.com/pomerium/pomerium/pull/2113) (@travisgroth)
- deps: bump envoy to 1.17.2 [\#2114](https://github.com/pomerium/pomerium/pull/2114) (@github-actions[bot])
- proxy: restrict programmatic URLs to localhost [\#2049](https://github.com/pomerium/pomerium/pull/2049) (@travisgroth)
- authenticate: validate signature on /.pomerium, /.pomerium/sign\_in and /.pomerium/sign\_out [\#2048](https://github.com/pomerium/pomerium/pull/2048) (@travisgroth)

### Documentation

- docs: add inline instructions to generate signing-key [\#2164](https://github.com/pomerium/pomerium/pull/2164) (@desimone)
- docs: add info note to set\_response\_headers [\#2162](https://github.com/pomerium/pomerium/pull/2162) (@calebdoxsey)
- docs: mention alternative bearer token header format [\#2155](https://github.com/pomerium/pomerium/pull/2155) (@travisgroth)
- docs: upgrade notes on `allowed\_users` by ID [\#2133](https://github.com/pomerium/pomerium/pull/2133) (@travisgroth)
- docs: add threat model to security page [\#2097](https://github.com/pomerium/pomerium/pull/2097) (@desimone)
- docs: update community slack link [\#2063](https://github.com/pomerium/pomerium/pull/2063) (@travisgroth)
- Update local-oidc.md [\#1994](https://github.com/pomerium/pomerium/pull/1994) (@dharmendrakariya)
- ping: add documentation [\#1976](https://github.com/pomerium/pomerium/pull/1976) (@calebdoxsey)
- docs: add JWT Verification w/Envoy guide [\#1974](https://github.com/pomerium/pomerium/pull/1974) (@calebdoxsey)
- Update data-storage.md [\#1941](https://github.com/pomerium/pomerium/pull/1941) (@TanguyPatte)
- docs: fix query param name [\#1920](https://github.com/pomerium/pomerium/pull/1920) (@calebdoxsey)
- docs: add breaking sa changes in v0.13 [\#1919](https://github.com/pomerium/pomerium/pull/1919) (@desimone)
- docs: add v0.13 to docs site menu [\#1913](https://github.com/pomerium/pomerium/pull/1913) (@travisgroth)
- docs: update changelog for v0.13.0 [\#1909](https://github.com/pomerium/pomerium/pull/1909) (@desimone)
- docs: update security policy [\#1897](https://github.com/pomerium/pomerium/pull/1897) (@desimone)
- docs: misc upgrade notes and changelog [\#1884](https://github.com/pomerium/pomerium/pull/1884) (@travisgroth)
- docs: add load balancing weight documentation [\#1883](https://github.com/pomerium/pomerium/pull/1883) (@travisgroth)
- docs: additional load balancing documentation [\#1875](https://github.com/pomerium/pomerium/pull/1875) (@travisgroth)

### Dependency

- chore\(deps\): bump github.com/ory/dockertest/v3 from 3.6.3 to 3.6.5 [\#2168](https://github.com/pomerium/pomerium/pull/2168) (@dependabot[bot])
- chore\(deps\): bump github.com/prometheus/common from 0.21.0 to 0.23.0 [\#2167](https://github.com/pomerium/pomerium/pull/2167) (@dependabot[bot])
- chore\(deps\): bump github.com/envoyproxy/protoc-gen-validate from 0.6.0 to 0.6.1 [\#2166](https://github.com/pomerium/pomerium/pull/2166) (@dependabot[bot])
- chore\(deps\): bump github.com/open-policy-agent/opa from 0.27.1 to 0.28.0 [\#2165](https://github.com/pomerium/pomerium/pull/2165) (@dependabot[bot])
- use cached envoy [\#2132](https://github.com/pomerium/pomerium/pull/2132) (@wasaga)
- chore\(deps\): bump github.com/prometheus/common from 0.20.0 to 0.21.0 [\#2130](https://github.com/pomerium/pomerium/pull/2130) (@dependabot[bot])
- chore\(deps\): bump github.com/envoyproxy/protoc-gen-validate from 0.5.1 to 0.6.0 [\#2129](https://github.com/pomerium/pomerium/pull/2129) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.44.0 to 0.45.0 [\#2128](https://github.com/pomerium/pomerium/pull/2128) (@dependabot[bot])
- chore\(deps\): bump github.com/caddyserver/certmagic from 0.12.0 to 0.13.0 [\#2074](https://github.com/pomerium/pomerium/pull/2074) (@dependabot[bot])
- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.8.0 to 8.8.2 [\#2099](https://github.com/pomerium/pomerium/pull/2099) (@dependabot[bot])
- chore\(deps\): bump gopkg.in/auth0.v5 from 5.14.1 to 5.15.0 [\#2098](https://github.com/pomerium/pomerium/pull/2098) (@dependabot[bot])
- do not require project be in GOPATH/src [\#2078](https://github.com/pomerium/pomerium/pull/2078) (@wasaga)
- chore\(deps\): bump google.golang.org/api from 0.43.0 to 0.44.0 [\#2073](https://github.com/pomerium/pomerium/pull/2073) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/grpc from 1.36.1 to 1.37.0 [\#2072](https://github.com/pomerium/pomerium/pull/2072) (@dependabot[bot])
- chore\(deps\): bump gopkg.in/auth0.v5 from 5.13.0 to 5.14.1 [\#2071](https://github.com/pomerium/pomerium/pull/2071) (@dependabot[bot])
- deps: switch from renovate to dependabot [\#2069](https://github.com/pomerium/pomerium/pull/2069) (@travisgroth)
- fix\(deps\): update module github.com/golang/protobuf to v1.5.2 [\#2057](https://github.com/pomerium/pomerium/pull/2057) (@renovate[bot])
- fix\(deps\): update module github.com/envoyproxy/protoc-gen-validate to v0.5.1 [\#2056](https://github.com/pomerium/pomerium/pull/2056) (@renovate[bot])
- fix\(deps\): update google.golang.org/genproto commit hash to 6c239bb [\#2054](https://github.com/pomerium/pomerium/pull/2054) (@renovate[bot])
- fix\(deps\): update golang.org/x/oauth2 commit hash to 2e8d934 [\#2053](https://github.com/pomerium/pomerium/pull/2053) (@renovate[bot])
- fix\(deps\): update golang.org/x/net commit hash to 0fccb6f [\#2052](https://github.com/pomerium/pomerium/pull/2052) (@renovate[bot])
- skip REDIS cluster test if GOOS != linux [\#2045](https://github.com/pomerium/pomerium/pull/2045) (@wasaga)
- fix\(deps\): update module gopkg.in/auth0.v5 to v5.13.0 [\#2037](https://github.com/pomerium/pomerium/pull/2037) (@renovate[bot])
- fix\(deps\): update module google.golang.org/grpc to v1.36.1 [\#2036](https://github.com/pomerium/pomerium/pull/2036) (@renovate[bot])
- fix\(deps\): update module google.golang.org/api to v0.43.0 [\#2035](https://github.com/pomerium/pomerium/pull/2035) (@renovate[bot])
- fix\(deps\): update module github.com/rs/zerolog to v1.21.0 [\#2034](https://github.com/pomerium/pomerium/pull/2034) (@renovate[bot])
- fix\(deps\): update module github.com/prometheus/common to v0.20.0 [\#2033](https://github.com/pomerium/pomerium/pull/2033) (@renovate[bot])
- fix\(deps\): update module github.com/go-redis/redis/v8 to v8.8.0 [\#2032](https://github.com/pomerium/pomerium/pull/2032) (@renovate[bot])
- chore\(deps\): update mikefarah/yq action to v4.6.3 [\#2031](https://github.com/pomerium/pomerium/pull/2031) (@renovate[bot])
- fix\(deps\): update google.golang.org/genproto commit hash to 679c6ae [\#2030](https://github.com/pomerium/pomerium/pull/2030) (@renovate[bot])
- fix\(deps\): update golang.org/x/oauth2 commit hash to 22b0ada [\#2029](https://github.com/pomerium/pomerium/pull/2029) (@renovate[bot])
- fix\(deps\): update golang.org/x/net commit hash to 61e0566 [\#2028](https://github.com/pomerium/pomerium/pull/2028) (@renovate[bot])
- fix\(deps\): update golang.org/x/crypto commit hash to 0c34fe9 [\#2027](https://github.com/pomerium/pomerium/pull/2027) (@renovate[bot])
- deps: bundle all patch upgrades in a single group [\#2016](https://github.com/pomerium/pomerium/pull/2016) (@travisgroth)
- fix\(deps\): update module google.golang.org/protobuf to v1.26.0 [\#2012](https://github.com/pomerium/pomerium/pull/2012) (@renovate[bot])
- fix\(deps\): update module github.com/prometheus/client\_golang to v1.10.0 [\#2011](https://github.com/pomerium/pomerium/pull/2011) (@renovate[bot])
- fix\(deps\): update module github.com/google/btree to v1.0.1 [\#2010](https://github.com/pomerium/pomerium/pull/2010) (@renovate[bot])
- fix\(deps\): update module github.com/golang/protobuf to v1.5.1 [\#2009](https://github.com/pomerium/pomerium/pull/2009) (@renovate[bot])
- fix\(deps\): update module github.com/envoyproxy/protoc-gen-validate to v0.5.0 [\#2008](https://github.com/pomerium/pomerium/pull/2008) (@renovate[bot])
- chore\(deps\): update mikefarah/yq action to v4.6.2 [\#2007](https://github.com/pomerium/pomerium/pull/2007) (@renovate[bot])
- fix\(deps\): update google.golang.org/genproto commit hash to 5f0e893 [\#2006](https://github.com/pomerium/pomerium/pull/2006) (@renovate[bot])
- fix\(deps\): update golang.org/x/net commit hash to d523dce [\#2005](https://github.com/pomerium/pomerium/pull/2005) (@renovate[bot])
- fix\(deps\): update module google.golang.org/api to v0.42.0 [\#1989](https://github.com/pomerium/pomerium/pull/1989) (@renovate[bot])
- fix\(deps\): update module github.com/open-policy-agent/opa to v0.27.1 [\#1988](https://github.com/pomerium/pomerium/pull/1988) (@renovate[bot])
- fix\(deps\): update module github.com/hashicorp/go-multierror to v1.1.1 [\#1987](https://github.com/pomerium/pomerium/pull/1987) (@renovate[bot])
- fix\(deps\): update module contrib.go.opencensus.io/exporter/prometheus to v0.3.0 [\#1986](https://github.com/pomerium/pomerium/pull/1986) (@renovate[bot])
- chore\(deps\): update codecov/codecov-action action to v1.3.1 [\#1985](https://github.com/pomerium/pomerium/pull/1985) (@renovate[bot])
- fix\(deps\): update google.golang.org/genproto commit hash to 8812039 [\#1984](https://github.com/pomerium/pomerium/pull/1984) (@renovate[bot])
- fix\(deps\): update golang.org/x/oauth2 commit hash to cd4f82c [\#1983](https://github.com/pomerium/pomerium/pull/1983) (@renovate[bot])
- fix\(deps\): update golang.org/x/crypto commit hash to 513c2a4 [\#1982](https://github.com/pomerium/pomerium/pull/1982) (@renovate[bot])
- fix\(deps\): update module github.com/prometheus/procfs to v0.6.0 [\#1969](https://github.com/pomerium/pomerium/pull/1969) (@renovate[bot])
- fix\(deps\): update module github.com/google/go-cmp to v0.5.5 [\#1968](https://github.com/pomerium/pomerium/pull/1968) (@renovate[bot])
- fix\(deps\): update module github.com/go-redis/redis/v8 to v8.7.1 [\#1967](https://github.com/pomerium/pomerium/pull/1967) (@renovate[bot])
- fix\(deps\): update google.golang.org/genproto commit hash to 9728d6b [\#1966](https://github.com/pomerium/pomerium/pull/1966) (@renovate[bot])
- fix\(deps\): update github.com/nsf/jsondiff commit hash to 6ea3239 [\#1965](https://github.com/pomerium/pomerium/pull/1965) (@renovate[bot])
- fix\(deps\): update module github.com/go-chi/chi to v5 [\#1956](https://github.com/pomerium/pomerium/pull/1956) (@renovate[bot])
- fix\(deps\): update module google.golang.org/grpc to v1.36.0 [\#1955](https://github.com/pomerium/pomerium/pull/1955) (@renovate[bot])
- fix\(deps\): update module go.opencensus.io to v0.23.0 [\#1954](https://github.com/pomerium/pomerium/pull/1954) (@renovate[bot])
- fix\(deps\): update module github.com/lithammer/shortuuid/v3 to v3.0.6 [\#1953](https://github.com/pomerium/pomerium/pull/1953) (@renovate[bot])
- chore\(deps\): update vuepress monorepo to v1.8.2 [\#1952](https://github.com/pomerium/pomerium/pull/1952) (@renovate[bot])
- chore\(deps\): update mikefarah/yq action to v4.6.1 [\#1951](https://github.com/pomerium/pomerium/pull/1951) (@renovate[bot])
- fix\(deps\): update google.golang.org/genproto commit hash to ab064af [\#1950](https://github.com/pomerium/pomerium/pull/1950) (@renovate[bot])
- fix\(deps\): update golang.org/x/net commit hash to e18ecbb [\#1949](https://github.com/pomerium/pomerium/pull/1949) (@renovate[bot])
- chore\(deps\): update yaml v2 to v3 [\#1927](https://github.com/pomerium/pomerium/pull/1927) (@desimone)
- chore\(deps\): update vuepress monorepo to v1.8.1 [\#1891](https://github.com/pomerium/pomerium/pull/1891) (@renovate[bot])
- chore\(deps\): update module spf13/cobra to v1.1.3 [\#1890](https://github.com/pomerium/pomerium/pull/1890) (@renovate[bot])
- chore\(deps\): update module google.golang.org/api to v0.40.0 [\#1889](https://github.com/pomerium/pomerium/pull/1889) (@renovate[bot])
- chore\(deps\): update mikefarah/yq action to v4.5.1 [\#1888](https://github.com/pomerium/pomerium/pull/1888) (@renovate[bot])
- chore\(deps\): update google.golang.org/genproto commit hash to e7f2df4 [\#1887](https://github.com/pomerium/pomerium/pull/1887) (@renovate[bot])
- chore\(deps\): update golang.org/x/oauth2 commit hash to 6667018 [\#1886](https://github.com/pomerium/pomerium/pull/1886) (@renovate[bot])
- chore\(deps\): update module auth0 to v5 [\#1868](https://github.com/pomerium/pomerium/pull/1868) (@renovate[bot])
- chore\(deps\): update module google.golang.org/api to v0.39.0 [\#1867](https://github.com/pomerium/pomerium/pull/1867) (@renovate[bot])
- chore\(deps\): update module go-redis/redis/v8 to v8.5.0 [\#1866](https://github.com/pomerium/pomerium/pull/1866) (@renovate[bot])
- chore\(deps\): update mikefarah/yq action to v4.5.0 [\#1865](https://github.com/pomerium/pomerium/pull/1865) (@renovate[bot])
- chore\(deps\): update google.golang.org/genproto commit hash to bba0dbe [\#1864](https://github.com/pomerium/pomerium/pull/1864) (@renovate[bot])
- chore\(deps\): update golang.org/x/oauth2 commit hash to 0101308 [\#1863](https://github.com/pomerium/pomerium/pull/1863) (@renovate[bot])

### Deployment

- deployment: update get-envoy script and release hooks [\#2111](https://github.com/pomerium/pomerium/pull/2111) (@travisgroth)
- deployment: Publish OS packages to cloudsmith [\#2105](https://github.com/pomerium/pomerium/pull/2105) (@travisgroth)
- deployment: update get-envoy script and release hooks [\#2112](https://github.com/pomerium/pomerium/pull/2112) (@github-actions[bot])
- deployment: Publish OS packages to cloudsmith [\#2108](https://github.com/pomerium/pomerium/pull/2108) (@github-actions[bot])
- ci: cache build and test binaries [\#1938](https://github.com/pomerium/pomerium/pull/1938) (@desimone)
- ci: go 1.16.x, cached tests [\#1937](https://github.com/pomerium/pomerium/pull/1937) (@desimone)

### Changed

- authorize: remove log [\#2122](https://github.com/pomerium/pomerium/pull/2122) (@calebdoxsey)
- config related metrics [\#2065](https://github.com/pomerium/pomerium/pull/2065) (@wasaga)
- proxy: support re-proxying request through control plane for kubernetes [\#2051](https://github.com/pomerium/pomerium/pull/2051) (@calebdoxsey)
- add default gitlab url [\#2044](https://github.com/pomerium/pomerium/pull/2044) (@contrun)
- Updating Doc for Pomerium-Dex Exercise [\#2018](https://github.com/pomerium/pomerium/pull/2018) (@dharmendrakariya)
- Add `xff\_num\_trusted\_hops` config option [\#2003](https://github.com/pomerium/pomerium/pull/2003) (@ntoofu)
- envoy: restrict permissions on embedded envoy binary [\#1999](https://github.com/pomerium/pomerium/pull/1999) (@calebdoxsey)
- ci: deploy master to integration environments [\#1973](https://github.com/pomerium/pomerium/pull/1973) (@travisgroth)
- oidc: use groups claim from ID token if present [\#1970](https://github.com/pomerium/pomerium/pull/1970) (@bonifaido)
- config: expose viper policy hooks [\#1947](https://github.com/pomerium/pomerium/pull/1947) (@calebdoxsey)
- ci: deploy latest release to test environment [\#1916](https://github.com/pomerium/pomerium/pull/1916) (@travisgroth)
- logs: strip query string [\#1894](https://github.com/pomerium/pomerium/pull/1894) (@calebdoxsey)
- in-memory service registry [\#1892](https://github.com/pomerium/pomerium/pull/1892) (@wasaga)
- controlplane: maybe fix flaky test [\#1873](https://github.com/pomerium/pomerium/pull/1873) (@calebdoxsey)
- remove generated code from code coverage metrics [\#1857](https://github.com/pomerium/pomerium/pull/1857) (@travisgroth)

## [v0.14.0-rc2](https://github.com/pomerium/pomerium/tree/v0.14.0-rc2) (2021-04-29)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.14.0-rc1...v0.14.0-rc2)

### New

- controlplane: save configuration events to databroker [\#2153](https://github.com/pomerium/pomerium/pull/2153) (@calebdoxsey)
- control plane: add request id to all error pages [\#2149](https://github.com/pomerium/pomerium/pull/2149) (@desimone)
- let pass custom dial opts [\#2144](https://github.com/pomerium/pomerium/pull/2144) (@wasaga)
- envoy: re-implement recommended defaults [\#2123](https://github.com/pomerium/pomerium/pull/2123) (@calebdoxsey)
- Drop tun.cfg.dstHost from jwtCacheKey [\#2115](https://github.com/pomerium/pomerium/pull/2115) (@bl0m1)
- config: remove validate side effects [\#2109](https://github.com/pomerium/pomerium/pull/2109) (@calebdoxsey)
- log context [\#2107](https://github.com/pomerium/pomerium/pull/2107) (@wasaga)
- databroker: add options for maximum capacity [\#2095](https://github.com/pomerium/pomerium/pull/2095) (@calebdoxsey)

### Fixed

- deployment: update alpine debug image dependencies [\#2154](https://github.com/pomerium/pomerium/pull/2154) (@travisgroth)
- authorize: refactor store locking [\#2151](https://github.com/pomerium/pomerium/pull/2151) (@calebdoxsey)
- databroker: store server version in backend [\#2142](https://github.com/pomerium/pomerium/pull/2142) (@calebdoxsey)
- authorize: audit log had duplicate "message" key [\#2141](https://github.com/pomerium/pomerium/pull/2141) (@desimone)
- httputil: fix SPDY support with reverse proxy [\#2134](https://github.com/pomerium/pomerium/pull/2134) (@calebdoxsey)
- envoyconfig: fix metrics ingress listener name [\#2124](https://github.com/pomerium/pomerium/pull/2124) (@calebdoxsey)
- authorize: fix empty sub policy arrays [\#2119](https://github.com/pomerium/pomerium/pull/2119) (@calebdoxsey)
- authorize: fix unsigned URL [\#2118](https://github.com/pomerium/pomerium/pull/2118) (@calebdoxsey)
- authorize: support arbitrary jwt claims [\#2102](https://github.com/pomerium/pomerium/pull/2102) (@calebdoxsey)

### Security

- deps: bump envoy to 1.17.2 [\#2113](https://github.com/pomerium/pomerium/pull/2113) (@travisgroth)

### Documentation

- docs: mention alternative bearer token header format [\#2155](https://github.com/pomerium/pomerium/pull/2155) (@travisgroth)
- docs: upgrade notes on `allowed\_users` by ID [\#2133](https://github.com/pomerium/pomerium/pull/2133) (@travisgroth)

### Dependency

- use cached envoy [\#2132](https://github.com/pomerium/pomerium/pull/2132) (@wasaga)
- chore\(deps\): bump github.com/prometheus/common from 0.20.0 to 0.21.0 [\#2130](https://github.com/pomerium/pomerium/pull/2130) (@dependabot[bot])
- chore\(deps\): bump github.com/envoyproxy/protoc-gen-validate from 0.5.1 to 0.6.0 [\#2129](https://github.com/pomerium/pomerium/pull/2129) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/api from 0.44.0 to 0.45.0 [\#2128](https://github.com/pomerium/pomerium/pull/2128) (@dependabot[bot])
- chore\(deps\): bump github.com/caddyserver/certmagic from 0.12.0 to 0.13.0 [\#2074](https://github.com/pomerium/pomerium/pull/2074) (@dependabot[bot])

### Deployment

- deployment: update get-envoy script and release hooks [\#2111](https://github.com/pomerium/pomerium/pull/2111) (@travisgroth)
- deployment: Publish OS packages to cloudsmith [\#2105](https://github.com/pomerium/pomerium/pull/2105) (@travisgroth)

### Changed

- authorize: remove log [\#2122](https://github.com/pomerium/pomerium/pull/2122) (@calebdoxsey)

## [v0.14.0-rc1](https://github.com/pomerium/pomerium/tree/v0.14.0-rc1) (2021-04-22)

[Full Changelog](https://github.com/pomerium/pomerium/compare/v0.13.6...v0.14.0-rc1)

### Breaking

- directory: remove provider from user id [\#2068](https://github.com/pomerium/pomerium/pull/2068) (@calebdoxsey)

### New

- envoyconfig: move most bootstrap config to shared package [\#2088](https://github.com/pomerium/pomerium/pull/2088) (@calebdoxsey)
- envoy: refactor controlplane xds to new envoyconfig package [\#2086](https://github.com/pomerium/pomerium/pull/2086) (@calebdoxsey)
- config: rename headers to set\_response\_headers [\#2081](https://github.com/pomerium/pomerium/pull/2081) (@calebdoxsey)
- crypto: use actual bytes of shared secret, not the base64 encoded representation [\#2075](https://github.com/pomerium/pomerium/pull/2075) (@calebdoxsey)
- cryptutil: use bytes for hmac [\#2067](https://github.com/pomerium/pomerium/pull/2067) (@calebdoxsey)
- cryptutil: always use kek public id, add x509 support [\#2066](https://github.com/pomerium/pomerium/pull/2066) (@calebdoxsey)
- authorize: additional tracing, add benchmark for encryptor [\#2059](https://github.com/pomerium/pomerium/pull/2059) (@calebdoxsey)
- authorize: audit logging [\#2050](https://github.com/pomerium/pomerium/pull/2050) (@calebdoxsey)
- support host:port in metrics\_address [\#2042](https://github.com/pomerium/pomerium/pull/2042) (@wasaga)
- databroker: return server version in Get [\#2039](https://github.com/pomerium/pomerium/pull/2039) (@wasaga)
- authorize: add databroker server and record version to result, force sync via polling [\#2024](https://github.com/pomerium/pomerium/pull/2024) (@calebdoxsey)
- protoutil: add generic transformer [\#2023](https://github.com/pomerium/pomerium/pull/2023) (@calebdoxsey)
- cryptutil: add envelope encryption w/key encryption key and data encryption key [\#2020](https://github.com/pomerium/pomerium/pull/2020) (@calebdoxsey)
- autocert: add metrics for renewal count, total and next expiration [\#2019](https://github.com/pomerium/pomerium/pull/2019) (@calebdoxsey)
- telemetry: add installation id [\#2017](https://github.com/pomerium/pomerium/pull/2017) (@calebdoxsey)
- config: use getters for certificates [\#2001](https://github.com/pomerium/pomerium/pull/2001) (@calebdoxsey)
- config: use getters for authenticate, signout and forward auth urls [\#2000](https://github.com/pomerium/pomerium/pull/2000) (@calebdoxsey)
- xds: use ALPN Auto config for upstream protocol when possible [\#1995](https://github.com/pomerium/pomerium/pull/1995) (@calebdoxsey)
- envoy: upgrade to v1.17.1 [\#1993](https://github.com/pomerium/pomerium/pull/1993) (@calebdoxsey)
- redis: add redis cluster support [\#1992](https://github.com/pomerium/pomerium/pull/1992) (@calebdoxsey)
- redis: add support for redis-sentinel [\#1991](https://github.com/pomerium/pomerium/pull/1991) (@calebdoxsey)
- authorize: set JWT to expire after 5 minutes [\#1980](https://github.com/pomerium/pomerium/pull/1980) (@calebdoxsey)
- identity: infer email from mail claim [\#1977](https://github.com/pomerium/pomerium/pull/1977) (@calebdoxsey)
- ping: identity and directory providers [\#1975](https://github.com/pomerium/pomerium/pull/1975) (@calebdoxsey)
- config: add rewrite\_response\_headers to protobuf [\#1962](https://github.com/pomerium/pomerium/pull/1962) (@calebdoxsey)
- config: add rewrite\_response\_headers option [\#1961](https://github.com/pomerium/pomerium/pull/1961) (@calebdoxsey)
- assets: use embed instead of statik [\#1960](https://github.com/pomerium/pomerium/pull/1960) (@calebdoxsey)
- config: log config source changes [\#1959](https://github.com/pomerium/pomerium/pull/1959) (@calebdoxsey)
- config: multiple endpoints for authorize and databroker [\#1957](https://github.com/pomerium/pomerium/pull/1957) (@calebdoxsey)
- telemetry: add process collector for envoy [\#1948](https://github.com/pomerium/pomerium/pull/1948) (@calebdoxsey)
- use build\_info as liveness gauge metric [\#1940](https://github.com/pomerium/pomerium/pull/1940) (@wasaga)
- metrics: add TLS options [\#1939](https://github.com/pomerium/pomerium/pull/1939) (@calebdoxsey)
- identity: record metric for last refresh [\#1936](https://github.com/pomerium/pomerium/pull/1936) (@calebdoxsey)
- middleware: basic auth equalize lengths of input [\#1934](https://github.com/pomerium/pomerium/pull/1934) (@desimone)
- autocert: remove non-determinism [\#1932](https://github.com/pomerium/pomerium/pull/1932) (@calebdoxsey)
- config: add metrics\_basic\_auth option [\#1917](https://github.com/pomerium/pomerium/pull/1917) (@calebdoxsey)
- envoy: validate binary checksum [\#1908](https://github.com/pomerium/pomerium/pull/1908) (@calebdoxsey)
- config: support map of jwt claim headers [\#1906](https://github.com/pomerium/pomerium/pull/1906) (@calebdoxsey)
- Remove internal/protoutil. [\#1893](https://github.com/pomerium/pomerium/pull/1893) (@yegle)
- databroker: refactor databroker to sync all changes [\#1879](https://github.com/pomerium/pomerium/pull/1879) (@calebdoxsey)
- config: add CertificateFiles to FileWatcherSource list [\#1878](https://github.com/pomerium/pomerium/pull/1878) (@travisgroth)
- config: allow customization of envoy boostrap admin options [\#1872](https://github.com/pomerium/pomerium/pull/1872) (@calebdoxsey)
- proxy: implement pass-through for authenticate backend [\#1870](https://github.com/pomerium/pomerium/pull/1870) (@calebdoxsey)
- authorize: move headers and jwt signing to rego [\#1856](https://github.com/pomerium/pomerium/pull/1856) (@calebdoxsey)

### Fixed

- authorize: support arbitrary jwt claims [\#2106](https://github.com/pomerium/pomerium/pull/2106) (@github-actions[bot])
- xdsmgr: update resource versions on NACK [\#2093](https://github.com/pomerium/pomerium/pull/2093) (@calebdoxsey)
- config: don't change address value on databroker or authorize [\#2092](https://github.com/pomerium/pomerium/pull/2092) (@travisgroth)
- metrics\_address should be optional parameter [\#2087](https://github.com/pomerium/pomerium/pull/2087) (@wasaga)
- propagate changes back from encrypted backend [\#2079](https://github.com/pomerium/pomerium/pull/2079) (@wasaga)
- config: use tls\_custom\_ca from policy when available [\#2077](https://github.com/pomerium/pomerium/pull/2077) (@calebdoxsey)
- databroker: remove unused installation id, close streams when backend is closed [\#2062](https://github.com/pomerium/pomerium/pull/2062) (@calebdoxsey)
- authenticate: fix default sign out url [\#2061](https://github.com/pomerium/pomerium/pull/2061) (@calebdoxsey)
- change require\_proxy\_protocol to use\_proxy\_protocol [\#2043](https://github.com/pomerium/pomerium/pull/2043) (@contrun)
- authorize: bypass data in rego for databroker data [\#2041](https://github.com/pomerium/pomerium/pull/2041) (@calebdoxsey)
- proxy: add nil check for fix-misdirected [\#2040](https://github.com/pomerium/pomerium/pull/2040) (@calebdoxsey)
- config: add headers to config proto [\#1996](https://github.com/pomerium/pomerium/pull/1996) (@calebdoxsey)
- Fix process cpu usage metric [\#1979](https://github.com/pomerium/pomerium/pull/1979) (@wasaga)
- cmd/pomerium: exit 0 for normal shutdown [\#1958](https://github.com/pomerium/pomerium/pull/1958) (@travisgroth)
- proxy: redirect to dashboard for logout [\#1944](https://github.com/pomerium/pomerium/pull/1944) (@calebdoxsey)
- config: fix redirect routes from protobuf [\#1930](https://github.com/pomerium/pomerium/pull/1930) (@travisgroth)
- google: fix default provider URL [\#1928](https://github.com/pomerium/pomerium/pull/1928) (@calebdoxsey)
- fix registry test [\#1911](https://github.com/pomerium/pomerium/pull/1911) (@wasaga)
- ci: pin goreleaser version [\#1900](https://github.com/pomerium/pomerium/pull/1900) (@travisgroth)
- onelogin: fix default scopes for v2 [\#1896](https://github.com/pomerium/pomerium/pull/1896) (@calebdoxsey)
- xds: fix misdirected script [\#1895](https://github.com/pomerium/pomerium/pull/1895) (@calebdoxsey)
- authenticate: validate origin of signout [\#1876](https://github.com/pomerium/pomerium/pull/1876) (@desimone)
- redis: fix deletion versioning [\#1871](https://github.com/pomerium/pomerium/pull/1871) (@calebdoxsey)
- options: header only applies to routes and authN [\#1862](https://github.com/pomerium/pomerium/pull/1862) (@desimone)
- controlplane: add global headers to virtualhost [\#1861](https://github.com/pomerium/pomerium/pull/1861) (@desimone)
- unique envoy cluster ids [\#1858](https://github.com/pomerium/pomerium/pull/1858) (@wasaga)

### Security

- deps: bump envoy to 1.17.2 [\#2114](https://github.com/pomerium/pomerium/pull/2114) (@github-actions[bot])
- proxy: restrict programmatic URLs to localhost [\#2049](https://github.com/pomerium/pomerium/pull/2049) (@travisgroth)
- authenticate: validate signature on /.pomerium, /.pomerium/sign\_in and /.pomerium/sign\_out [\#2048](https://github.com/pomerium/pomerium/pull/2048) (@travisgroth)

### Documentation

- docs: add threat model to security page [\#2097](https://github.com/pomerium/pomerium/pull/2097) (@desimone)
- docs: update community slack link [\#2063](https://github.com/pomerium/pomerium/pull/2063) (@travisgroth)
- Update local-oidc.md [\#1994](https://github.com/pomerium/pomerium/pull/1994) (@dharmendrakariya)
- ping: add documentation [\#1976](https://github.com/pomerium/pomerium/pull/1976) (@calebdoxsey)
- docs: add JWT Verification w/Envoy guide [\#1974](https://github.com/pomerium/pomerium/pull/1974) (@calebdoxsey)
- Update data-storage.md [\#1941](https://github.com/pomerium/pomerium/pull/1941) (@TanguyPatte)
- docs: fix query param name [\#1920](https://github.com/pomerium/pomerium/pull/1920) (@calebdoxsey)
- docs: add breaking sa changes in v0.13 [\#1919](https://github.com/pomerium/pomerium/pull/1919) (@desimone)
- docs: add v0.13 to docs site menu [\#1913](https://github.com/pomerium/pomerium/pull/1913) (@travisgroth)
- docs: update changelog for v0.13.0 [\#1909](https://github.com/pomerium/pomerium/pull/1909) (@desimone)
- docs: update security policy [\#1897](https://github.com/pomerium/pomerium/pull/1897) (@desimone)
- docs: misc upgrade notes and changelog [\#1884](https://github.com/pomerium/pomerium/pull/1884) (@travisgroth)
- docs: add load balancing weight documentation [\#1883](https://github.com/pomerium/pomerium/pull/1883) (@travisgroth)
- docs: additional load balancing documentation [\#1875](https://github.com/pomerium/pomerium/pull/1875) (@travisgroth)

### Dependency

- chore\(deps\): bump github.com/go-redis/redis/v8 from 8.8.0 to 8.8.2 [\#2099](https://github.com/pomerium/pomerium/pull/2099) (@dependabot[bot])
- chore\(deps\): bump gopkg.in/auth0.v5 from 5.14.1 to 5.15.0 [\#2098](https://github.com/pomerium/pomerium/pull/2098) (@dependabot[bot])
- do not require project be in GOPATH/src [\#2078](https://github.com/pomerium/pomerium/pull/2078) (@wasaga)
- chore\(deps\): bump google.golang.org/api from 0.43.0 to 0.44.0 [\#2073](https://github.com/pomerium/pomerium/pull/2073) (@dependabot[bot])
- chore\(deps\): bump google.golang.org/grpc from 1.36.1 to 1.37.0 [\#2072](https://github.com/pomerium/pomerium/pull/2072) (@dependabot[bot])
- chore\(deps\): bump gopkg.in/auth0.v5 from 5.13.0 to 5.14.1 [\#2071](https://github.com/pomerium/pomerium/pull/2071) (@dependabot[bot])
- deps: switch from renovate to dependabot [\#2069](https://github.com/pomerium/pomerium/pull/2069) (@travisgroth)
- fix\(deps\): update module github.com/golang/protobuf to v1.5.2 [\#2057](https://github.com/pomerium/pomerium/pull/2057) (@renovate[bot])
- fix\(deps\): update module github.com/envoyproxy/protoc-gen-validate to v0.5.1 [\#2056](https://github.com/pomerium/pomerium/pull/2056) (@renovate[bot])
- fix\(deps\): update google.golang.org/genproto commit hash to 6c239bb [\#2054](https://github.com/pomerium/pomerium/pull/2054) (@renovate[bot])
- fix\(deps\): update golang.org/x/oauth2 commit hash to 2e8d934 [\#2053](https://github.com/pomerium/pomerium/pull/2053) (@renovate[bot])
- fix\(deps\): update golang.org/x/net commit hash to 0fccb6f [\#2052](https://github.com/pomerium/pomerium/pull/2052) (@renovate[bot])
- skip REDIS cluster test if GOOS != linux [\#2045](https://github.com/pomerium/pomerium/pull/2045) (@wasaga)
- fix\(deps\): update module gopkg.in/auth0.v5 to v5.13.0 [\#2037](https://github.com/pomerium/pomerium/pull/2037) (@renovate[bot])
- fix\(deps\): update module google.golang.org/grpc to v1.36.1 [\#2036](https://github.com/pomerium/pomerium/pull/2036) (@renovate[bot])
- fix\(deps\): update module google.golang.org/api to v0.43.0 [\#2035](https://github.com/pomerium/pomerium/pull/2035) (@renovate[bot])
- fix\(deps\): update module github.com/rs/zerolog to v1.21.0 [\#2034](https://github.com/pomerium/pomerium/pull/2034) (@renovate[bot])
- fix\(deps\): update module github.com/prometheus/common to v0.20.0 [\#2033](https://github.com/pomerium/pomerium/pull/2033) (@renovate[bot])
- fix\(deps\): update module github.com/go-redis/redis/v8 to v8.8.0 [\#2032](https://github.com/pomerium/pomerium/pull/2032) (@renovate[bot])
- chore\(deps\): update mikefarah/yq action to v4.6.3 [\#2031](https://github.com/pomerium/pomerium/pull/2031) (@renovate[bot])
- fix\(deps\): update google.golang.org/genproto commit hash to 679c6ae [\#2030](https://github.com/pomerium/pomerium/pull/2030) (@renovate[bot])
- fix\(deps\): update golang.org/x/oauth2 commit hash to 22b0ada [\#2029](https://github.com/pomerium/pomerium/pull/2029) (@renovate[bot])
- fix\(deps\): update golang.org/x/net commit hash to 61e0566 [\#2028](https://github.com/pomerium/pomerium/pull/2028) (@renovate[bot])
- fix\(deps\): update golang.org/x/crypto commit hash to 0c34fe9 [\#2027](https://github.com/pomerium/pomerium/pull/2027) (@renovate[bot])
- deps: bundle all patch upgrades in a single group [\#2016](https://github.com/pomerium/pomerium/pull/2016) (@travisgroth)
- fix\(deps\): update module google.golang.org/protobuf to v1.26.0 [\#2012](https://github.com/pomerium/pomerium/pull/2012) (@renovate[bot])
- fix\(deps\): update module github.com/prometheus/client\_golang to v1.10.0 [\#2011](https://github.com/pomerium/pomerium/pull/2011) (@renovate[bot])
- fix\(deps\): update module github.com/google/btree to v1.0.1 [\#2010](https://github.com/pomerium/pomerium/pull/2010) (@renovate[bot])
- fix\(deps\): update module github.com/golang/protobuf to v1.5.1 [\#2009](https://github.com/pomerium/pomerium/pull/2009) (@renovate[bot])
- fix\(deps\): update module github.com/envoyproxy/protoc-gen-validate to v0.5.0 [\#2008](https://github.com/pomerium/pomerium/pull/2008) (@renovate[bot])
- chore\(deps\): update mikefarah/yq action to v4.6.2 [\#2007](https://github.com/pomerium/pomerium/pull/2007) (@renovate[bot])
- fix\(deps\): update google.golang.org/genproto commit hash to 5f0e893 [\#2006](https://github.com/pomerium/pomerium/pull/2006) (@renovate[bot])
- fix\(deps\): update golang.org/x/net commit hash to d523dce [\#2005](https://github.com/pomerium/pomerium/pull/2005) (@renovate[bot])
- fix\(deps\): update module google.golang.org/api to v0.42.0 [\#1989](https://github.com/pomerium/pomerium/pull/1989) (@renovate[bot])
- fix\(deps\): update module github.com/open-policy-agent/opa to v0.27.1 [\#1988](https://github.com/pomerium/pomerium/pull/1988) (@renovate[bot])
- fix\(deps\): update module github.com/hashicorp/go-multierror to v1.1.1 [\#1987](https://github.com/pomerium/pomerium/pull/1987) (@renovate[bot])
- fix\(deps\): update module contrib.go.opencensus.io/exporter/prometheus to v0.3.0 [\#1986](https://github.com/pomerium/pomerium/pull/1986) (@renovate[bot])
- chore\(deps\): update codecov/codecov-action action to v1.3.1 [\#1985](https://github.com/pomerium/pomerium/pull/1985) (@renovate[bot])
- fix\(deps\): update google.golang.org/genproto commit hash to 8812039 [\#1984](https://github.com/pomerium/pomerium/pull/1984) (@renovate[bot])
- fix\(deps\): update golang.org/x/oauth2 commit hash to cd4f82c [\#1983](https://github.com/pomerium/pomerium/pull/1983) (@renovate[bot])
- fix\(deps\): update golang.org/x/crypto commit hash to 513c2a4 [\#1982](https://github.com/pomerium/pomerium/pull/1982) (@renovate[bot])
- fix\(deps\): update module github.com/prometheus/procfs to v0.6.0 [\#1969](https://github.com/pomerium/pomerium/pull/1969) (@renovate[bot])
- fix\(deps\): update module github.com/google/go-cmp to v0.5.5 [\#1968](https://github.com/pomerium/pomerium/pull/1968) (@renovate[bot])
- fix\(deps\): update module github.com/go-redis/redis/v8 to v8.7.1 [\#1967](https://github.com/pomerium/pomerium/pull/1967) (@renovate[bot])
- fix\(deps\): update google.golang.org/genproto commit hash to 9728d6b [\#1966](https://github.com/pomerium/pomerium/pull/1966) (@renovate[bot])
- fix\(deps\): update github.com/nsf/jsondiff commit hash to 6ea3239 [\#1965](https://github.com/pomerium/pomerium/pull/1965) (@renovate[bot])
- fix\(deps\): update module github.com/go-chi/chi to v5 [\#1956](https://github.com/pomerium/pomerium/pull/1956) (@renovate[bot])
- fix\(deps\): update module google.golang.org/grpc to v1.36.0 [\#1955](https://github.com/pomerium/pomerium/pull/1955) (@renovate[bot])
- fix\(deps\): update module go.opencensus.io to v0.23.0 [\#1954](https://github.com/pomerium/pomerium/pull/1954) (@renovate[bot])
- fix\(deps\): update module github.com/lithammer/shortuuid/v3 to v3.0.6 [\#1953](https://github.com/pomerium/pomerium/pull/1953) (@renovate[bot])
- chore\(deps\): update vuepress monorepo to v1.8.2 [\#1952](https://github.com/pomerium/pomerium/pull/1952) (@renovate[bot])
- chore\(deps\): update mikefarah/yq action to v4.6.1 [\#1951](https://github.com/pomerium/pomerium/pull/1951) (@renovate[bot])
- fix\(deps\): update google.golang.org/genproto commit hash to ab064af [\#1950](https://github.com/pomerium/pomerium/pull/1950) (@renovate[bot])
- fix\(deps\): update golang.org/x/net commit hash to e18ecbb [\#1949](https://github.com/pomerium/pomerium/pull/1949) (@renovate[bot])
- chore\(deps\): update yaml v2 to v3 [\#1927](https://github.com/pomerium/pomerium/pull/1927) (@desimone)
- chore\(deps\): update vuepress monorepo to v1.8.1 [\#1891](https://github.com/pomerium/pomerium/pull/1891) (@renovate[bot])
- chore\(deps\): update module spf13/cobra to v1.1.3 [\#1890](https://github.com/pomerium/pomerium/pull/1890) (@renovate[bot])
- chore\(deps\): update module google.golang.org/api to v0.40.0 [\#1889](https://github.com/pomerium/pomerium/pull/1889) (@renovate[bot])
- chore\(deps\): update mikefarah/yq action to v4.5.1 [\#1888](https://github.com/pomerium/pomerium/pull/1888) (@renovate[bot])
- chore\(deps\): update google.golang.org/genproto commit hash to e7f2df4 [\#1887](https://github.com/pomerium/pomerium/pull/1887) (@renovate[bot])
- chore\(deps\): update golang.org/x/oauth2 commit hash to 6667018 [\#1886](https://github.com/pomerium/pomerium/pull/1886) (@renovate[bot])
- chore\(deps\): update module auth0 to v5 [\#1868](https://github.com/pomerium/pomerium/pull/1868) (@renovate[bot])
- chore\(deps\): update module google.golang.org/api to v0.39.0 [\#1867](https://github.com/pomerium/pomerium/pull/1867) (@renovate[bot])
- chore\(deps\): update module go-redis/redis/v8 to v8.5.0 [\#1866](https://github.com/pomerium/pomerium/pull/1866) (@renovate[bot])
- chore\(deps\): update mikefarah/yq action to v4.5.0 [\#1865](https://github.com/pomerium/pomerium/pull/1865) (@renovate[bot])
- chore\(deps\): update google.golang.org/genproto commit hash to bba0dbe [\#1864](https://github.com/pomerium/pomerium/pull/1864) (@renovate[bot])
- chore\(deps\): update golang.org/x/oauth2 commit hash to 0101308 [\#1863](https://github.com/pomerium/pomerium/pull/1863) (@renovate[bot])

### Deployment

- deployment: update get-envoy script and release hooks [\#2112](https://github.com/pomerium/pomerium/pull/2112) (@github-actions[bot])
- deployment: Publish OS packages to cloudsmith [\#2108](https://github.com/pomerium/pomerium/pull/2108) (@github-actions[bot])
- ci: cache build and test binaries [\#1938](https://github.com/pomerium/pomerium/pull/1938) (@desimone)
- ci: go 1.16.x, cached tests [\#1937](https://github.com/pomerium/pomerium/pull/1937) (@desimone)

### Changed

- config related metrics [\#2065](https://github.com/pomerium/pomerium/pull/2065) (@wasaga)
- proxy: support re-proxying request through control plane for kubernetes [\#2051](https://github.com/pomerium/pomerium/pull/2051) (@calebdoxsey)
- add default gitlab url [\#2044](https://github.com/pomerium/pomerium/pull/2044) (@contrun)
- Updating Doc for Pomerium-Dex Exercise [\#2018](https://github.com/pomerium/pomerium/pull/2018) (@dharmendrakariya)
- Add `xff\_num\_trusted\_hops` config option [\#2003](https://github.com/pomerium/pomerium/pull/2003) (@ntoofu)
- envoy: restrict permissions on embedded envoy binary [\#1999](https://github.com/pomerium/pomerium/pull/1999) (@calebdoxsey)
- ci: deploy master to integration environments [\#1973](https://github.com/pomerium/pomerium/pull/1973) (@travisgroth)
- oidc: use groups claim from ID token if present [\#1970](https://github.com/pomerium/pomerium/pull/1970) (@bonifaido)
- config: expose viper policy hooks [\#1947](https://github.com/pomerium/pomerium/pull/1947) (@calebdoxsey)
- ci: deploy latest release to test environment [\#1916](https://github.com/pomerium/pomerium/pull/1916) (@travisgroth)
- logs: strip query string [\#1894](https://github.com/pomerium/pomerium/pull/1894) (@calebdoxsey)
- in-memory service registry [\#1892](https://github.com/pomerium/pomerium/pull/1892) (@wasaga)
- controlplane: maybe fix flaky test [\#1873](https://github.com/pomerium/pomerium/pull/1873) (@calebdoxsey)
- remove generated code from code coverage metrics [\#1857](https://github.com/pomerium/pomerium/pull/1857) (@travisgroth)

[certificates documentation]: /docs/topics/certificates
[gh-1]: https://github.com/pomerium/pomerium/issues/1
[gh-10]: https://github.com/pomerium/pomerium/issues/10
[gh-100]: https://github.com/pomerium/pomerium/issues/100
[gh-101]: https://github.com/pomerium/pomerium/issues/101
[gh-102]: https://github.com/pomerium/pomerium/issues/102
[gh-103]: https://github.com/pomerium/pomerium/issues/103
[gh-104]: https://github.com/pomerium/pomerium/issues/104
[gh-105]: https://github.com/pomerium/pomerium/issues/105
[gh-106]: https://github.com/pomerium/pomerium/issues/106
[gh-107]: https://github.com/pomerium/pomerium/issues/107
[gh-108]: https://github.com/pomerium/pomerium/issues/108
[gh-109]: https://github.com/pomerium/pomerium/issues/109
[gh-11]: https://github.com/pomerium/pomerium/issues/11
[gh-110]: https://github.com/pomerium/pomerium/issues/110
[gh-111]: https://github.com/pomerium/pomerium/issues/111
[gh-112]: https://github.com/pomerium/pomerium/issues/112
[gh-113]: https://github.com/pomerium/pomerium/issues/113
[gh-114]: https://github.com/pomerium/pomerium/issues/114
[gh-115]: https://github.com/pomerium/pomerium/issues/115
[gh-116]: https://github.com/pomerium/pomerium/issues/116
[gh-117]: https://github.com/pomerium/pomerium/issues/117
[gh-118]: https://github.com/pomerium/pomerium/issues/118
[gh-119]: https://github.com/pomerium/pomerium/issues/119
[gh-12]: https://github.com/pomerium/pomerium/issues/12
[gh-120]: https://github.com/pomerium/pomerium/issues/120
[gh-121]: https://github.com/pomerium/pomerium/issues/121
[gh-122]: https://github.com/pomerium/pomerium/issues/122
[gh-123]: https://github.com/pomerium/pomerium/issues/123
[gh-124]: https://github.com/pomerium/pomerium/issues/124
[gh-125]: https://github.com/pomerium/pomerium/issues/125
[gh-126]: https://github.com/pomerium/pomerium/issues/126
[gh-127]: https://github.com/pomerium/pomerium/issues/127
[gh-128]: https://github.com/pomerium/pomerium/issues/128
[gh-129]: https://github.com/pomerium/pomerium/issues/129
[gh-13]: https://github.com/pomerium/pomerium/issues/13
[gh-130]: https://github.com/pomerium/pomerium/issues/130
[gh-131]: https://github.com/pomerium/pomerium/issues/131
[gh-132]: https://github.com/pomerium/pomerium/issues/132
[gh-133]: https://github.com/pomerium/pomerium/issues/133
[gh-134]: https://github.com/pomerium/pomerium/issues/134
[gh-135]: https://github.com/pomerium/pomerium/issues/135
[gh-136]: https://github.com/pomerium/pomerium/issues/136
[gh-137]: https://github.com/pomerium/pomerium/issues/137
[gh-138]: https://github.com/pomerium/pomerium/issues/138
[gh-139]: https://github.com/pomerium/pomerium/issues/139
[gh-14]: https://github.com/pomerium/pomerium/issues/14
[gh-140]: https://github.com/pomerium/pomerium/issues/140
[gh-141]: https://github.com/pomerium/pomerium/issues/141
[gh-142]: https://github.com/pomerium/pomerium/issues/142
[gh-143]: https://github.com/pomerium/pomerium/issues/143
[gh-144]: https://github.com/pomerium/pomerium/issues/144
[gh-145]: https://github.com/pomerium/pomerium/issues/145
[gh-146]: https://github.com/pomerium/pomerium/issues/146
[gh-147]: https://github.com/pomerium/pomerium/issues/147
[gh-148]: https://github.com/pomerium/pomerium/issues/148
[gh-149]: https://github.com/pomerium/pomerium/issues/149
[gh-15]: https://github.com/pomerium/pomerium/issues/15
[gh-150]: https://github.com/pomerium/pomerium/issues/150
[gh-151]: https://github.com/pomerium/pomerium/issues/151
[gh-152]: https://github.com/pomerium/pomerium/issues/152
[gh-153]: https://github.com/pomerium/pomerium/issues/153
[gh-154]: https://github.com/pomerium/pomerium/issues/154
[gh-155]: https://github.com/pomerium/pomerium/issues/155
[gh-156]: https://github.com/pomerium/pomerium/issues/156
[gh-157]: https://github.com/pomerium/pomerium/issues/157
[gh-158]: https://github.com/pomerium/pomerium/issues/158
[gh-159]: https://github.com/pomerium/pomerium/issues/159
[gh-16]: https://github.com/pomerium/pomerium/issues/16
[gh-160]: https://github.com/pomerium/pomerium/issues/160
[gh-161]: https://github.com/pomerium/pomerium/issues/161
[gh-162]: https://github.com/pomerium/pomerium/issues/162
[gh-163]: https://github.com/pomerium/pomerium/issues/163
[gh-164]: https://github.com/pomerium/pomerium/issues/164
[gh-165]: https://github.com/pomerium/pomerium/issues/165
[gh-166]: https://github.com/pomerium/pomerium/issues/166
[gh-167]: https://github.com/pomerium/pomerium/issues/167
[gh-168]: https://github.com/pomerium/pomerium/issues/168
[gh-169]: https://github.com/pomerium/pomerium/issues/169
[gh-17]: https://github.com/pomerium/pomerium/issues/17
[gh-170]: https://github.com/pomerium/pomerium/issues/170
[gh-171]: https://github.com/pomerium/pomerium/issues/171
[gh-172]: https://github.com/pomerium/pomerium/issues/172
[gh-173]: https://github.com/pomerium/pomerium/issues/173
[gh-174]: https://github.com/pomerium/pomerium/issues/174
[gh-175]: https://github.com/pomerium/pomerium/issues/175
[gh-176]: https://github.com/pomerium/pomerium/issues/176
[gh-177]: https://github.com/pomerium/pomerium/issues/177
[gh-178]: https://github.com/pomerium/pomerium/issues/178
[gh-179]: https://github.com/pomerium/pomerium/issues/179
[gh-18]: https://github.com/pomerium/pomerium/issues/18
[gh-180]: https://github.com/pomerium/pomerium/issues/180
[gh-181]: https://github.com/pomerium/pomerium/issues/181
[gh-182]: https://github.com/pomerium/pomerium/issues/182
[gh-183]: https://github.com/pomerium/pomerium/issues/183
[gh-184]: https://github.com/pomerium/pomerium/issues/184
[gh-185]: https://github.com/pomerium/pomerium/issues/185
[gh-186]: https://github.com/pomerium/pomerium/issues/186
[gh-187]: https://github.com/pomerium/pomerium/issues/187
[gh-188]: https://github.com/pomerium/pomerium/issues/188
[gh-189]: https://github.com/pomerium/pomerium/issues/189
[gh-19]: https://github.com/pomerium/pomerium/issues/19
[gh-190]: https://github.com/pomerium/pomerium/issues/190
[gh-191]: https://github.com/pomerium/pomerium/issues/191
[gh-192]: https://github.com/pomerium/pomerium/issues/192
[gh-193]: https://github.com/pomerium/pomerium/issues/193
[gh-194]: https://github.com/pomerium/pomerium/issues/194
[gh-195]: https://github.com/pomerium/pomerium/issues/195
[gh-196]: https://github.com/pomerium/pomerium/issues/196
[gh-197]: https://github.com/pomerium/pomerium/issues/197
[gh-198]: https://github.com/pomerium/pomerium/issues/198
[gh-199]: https://github.com/pomerium/pomerium/issues/199
[gh-2]: https://github.com/pomerium/pomerium/issues/2
[gh-20]: https://github.com/pomerium/pomerium/issues/20
[gh-200]: https://github.com/pomerium/pomerium/issues/200
[gh-201]: https://github.com/pomerium/pomerium/issues/201
[gh-202]: https://github.com/pomerium/pomerium/issues/202
[gh-203]: https://github.com/pomerium/pomerium/issues/203
[gh-204]: https://github.com/pomerium/pomerium/issues/204
[gh-205]: https://github.com/pomerium/pomerium/issues/205
[gh-206]: https://github.com/pomerium/pomerium/issues/206
[gh-207]: https://github.com/pomerium/pomerium/issues/207
[gh-208]: https://github.com/pomerium/pomerium/issues/208
[gh-209]: https://github.com/pomerium/pomerium/issues/209
[gh-21]: https://github.com/pomerium/pomerium/issues/21
[gh-210]: https://github.com/pomerium/pomerium/issues/210
[gh-211]: https://github.com/pomerium/pomerium/issues/211
[gh-212]: https://github.com/pomerium/pomerium/issues/212
[gh-213]: https://github.com/pomerium/pomerium/issues/213
[gh-214]: https://github.com/pomerium/pomerium/issues/214
[gh-215]: https://github.com/pomerium/pomerium/issues/215
[gh-216]: https://github.com/pomerium/pomerium/issues/216
[gh-217]: https://github.com/pomerium/pomerium/issues/217
[gh-218]: https://github.com/pomerium/pomerium/issues/218
[gh-219]: https://github.com/pomerium/pomerium/issues/219
[gh-22]: https://github.com/pomerium/pomerium/issues/22
[gh-220]: https://github.com/pomerium/pomerium/issues/220
[gh-221]: https://github.com/pomerium/pomerium/issues/221
[gh-222]: https://github.com/pomerium/pomerium/issues/222
[gh-223]: https://github.com/pomerium/pomerium/issues/223
[gh-224]: https://github.com/pomerium/pomerium/issues/224
[gh-225]: https://github.com/pomerium/pomerium/issues/225
[gh-226]: https://github.com/pomerium/pomerium/issues/226
[gh-227]: https://github.com/pomerium/pomerium/issues/227
[gh-228]: https://github.com/pomerium/pomerium/issues/228
[gh-229]: https://github.com/pomerium/pomerium/issues/229
[gh-23]: https://github.com/pomerium/pomerium/issues/23
[gh-230]: https://github.com/pomerium/pomerium/issues/230
[gh-231]: https://github.com/pomerium/pomerium/issues/231
[gh-232]: https://github.com/pomerium/pomerium/issues/232
[gh-233]: https://github.com/pomerium/pomerium/issues/233
[gh-234]: https://github.com/pomerium/pomerium/issues/234
[gh-235]: https://github.com/pomerium/pomerium/issues/235
[gh-236]: https://github.com/pomerium/pomerium/issues/236
[gh-237]: https://github.com/pomerium/pomerium/issues/237
[gh-238]: https://github.com/pomerium/pomerium/issues/238
[gh-239]: https://github.com/pomerium/pomerium/issues/239
[gh-24]: https://github.com/pomerium/pomerium/issues/24
[gh-240]: https://github.com/pomerium/pomerium/issues/240
[gh-241]: https://github.com/pomerium/pomerium/issues/241
[gh-242]: https://github.com/pomerium/pomerium/issues/242
[gh-243]: https://github.com/pomerium/pomerium/issues/243
[gh-244]: https://github.com/pomerium/pomerium/issues/244
[gh-245]: https://github.com/pomerium/pomerium/issues/245
[gh-246]: https://github.com/pomerium/pomerium/issues/246
[gh-247]: https://github.com/pomerium/pomerium/issues/247
[gh-248]: https://github.com/pomerium/pomerium/issues/248
[gh-249]: https://github.com/pomerium/pomerium/issues/249
[gh-25]: https://github.com/pomerium/pomerium/issues/25
[gh-250]: https://github.com/pomerium/pomerium/issues/250
[gh-251]: https://github.com/pomerium/pomerium/issues/251
[gh-252]: https://github.com/pomerium/pomerium/issues/252
[gh-253]: https://github.com/pomerium/pomerium/issues/253
[gh-254]: https://github.com/pomerium/pomerium/issues/254
[gh-255]: https://github.com/pomerium/pomerium/issues/255
[gh-256]: https://github.com/pomerium/pomerium/issues/256
[gh-257]: https://github.com/pomerium/pomerium/issues/257
[gh-258]: https://github.com/pomerium/pomerium/issues/258
[gh-259]: https://github.com/pomerium/pomerium/issues/259
[gh-26]: https://github.com/pomerium/pomerium/issues/26
[gh-260]: https://github.com/pomerium/pomerium/issues/260
[gh-261]: https://github.com/pomerium/pomerium/issues/261
[gh-262]: https://github.com/pomerium/pomerium/issues/262
[gh-263]: https://github.com/pomerium/pomerium/issues/263
[gh-264]: https://github.com/pomerium/pomerium/issues/264
[gh-265]: https://github.com/pomerium/pomerium/issues/265
[gh-266]: https://github.com/pomerium/pomerium/issues/266
[gh-267]: https://github.com/pomerium/pomerium/issues/267
[gh-268]: https://github.com/pomerium/pomerium/issues/268
[gh-269]: https://github.com/pomerium/pomerium/issues/269
[gh-27]: https://github.com/pomerium/pomerium/issues/27
[gh-270]: https://github.com/pomerium/pomerium/issues/270
[gh-271]: https://github.com/pomerium/pomerium/issues/271
[gh-272]: https://github.com/pomerium/pomerium/issues/272
[gh-273]: https://github.com/pomerium/pomerium/issues/273
[gh-274]: https://github.com/pomerium/pomerium/issues/274
[gh-275]: https://github.com/pomerium/pomerium/issues/275
[gh-276]: https://github.com/pomerium/pomerium/issues/276
[gh-277]: https://github.com/pomerium/pomerium/issues/277
[gh-278]: https://github.com/pomerium/pomerium/issues/278
[gh-279]: https://github.com/pomerium/pomerium/issues/279
[gh-28]: https://github.com/pomerium/pomerium/issues/28
[gh-280]: https://github.com/pomerium/pomerium/issues/280
[gh-281]: https://github.com/pomerium/pomerium/issues/281
[gh-282]: https://github.com/pomerium/pomerium/issues/282
[gh-283]: https://github.com/pomerium/pomerium/issues/283
[gh-284]: https://github.com/pomerium/pomerium/issues/284
[gh-285]: https://github.com/pomerium/pomerium/issues/285
[gh-286]: https://github.com/pomerium/pomerium/issues/286
[gh-287]: https://github.com/pomerium/pomerium/issues/287
[gh-288]: https://github.com/pomerium/pomerium/issues/288
[gh-289]: https://github.com/pomerium/pomerium/issues/289
[gh-29]: https://github.com/pomerium/pomerium/issues/29
[gh-290]: https://github.com/pomerium/pomerium/issues/290
[gh-291]: https://github.com/pomerium/pomerium/issues/291
[gh-292]: https://github.com/pomerium/pomerium/issues/292
[gh-293]: https://github.com/pomerium/pomerium/issues/293
[gh-294]: https://github.com/pomerium/pomerium/issues/294
[gh-295]: https://github.com/pomerium/pomerium/issues/295
[gh-296]: https://github.com/pomerium/pomerium/issues/296
[gh-297]: https://github.com/pomerium/pomerium/issues/297
[gh-298]: https://github.com/pomerium/pomerium/issues/298
[gh-299]: https://github.com/pomerium/pomerium/issues/299
[gh-3]: https://github.com/pomerium/pomerium/issues/3
[gh-30]: https://github.com/pomerium/pomerium/issues/30
[gh-300]: https://github.com/pomerium/pomerium/issues/300
[gh-301]: https://github.com/pomerium/pomerium/issues/301
[gh-302]: https://github.com/pomerium/pomerium/issues/302
[gh-303]: https://github.com/pomerium/pomerium/issues/303
[gh-304]: https://github.com/pomerium/pomerium/issues/304
[gh-305]: https://github.com/pomerium/pomerium/issues/305
[gh-306]: https://github.com/pomerium/pomerium/issues/306
[gh-307]: https://github.com/pomerium/pomerium/issues/307
[gh-308]: https://github.com/pomerium/pomerium/issues/308
[gh-309]: https://github.com/pomerium/pomerium/issues/309
[gh-31]: https://github.com/pomerium/pomerium/issues/31
[gh-310]: https://github.com/pomerium/pomerium/issues/310
[gh-311]: https://github.com/pomerium/pomerium/issues/311
[gh-312]: https://github.com/pomerium/pomerium/issues/312
[gh-313]: https://github.com/pomerium/pomerium/issues/313
[gh-314]: https://github.com/pomerium/pomerium/issues/314
[gh-315]: https://github.com/pomerium/pomerium/issues/315
[gh-316]: https://github.com/pomerium/pomerium/issues/316
[gh-317]: https://github.com/pomerium/pomerium/issues/317
[gh-318]: https://github.com/pomerium/pomerium/issues/318
[gh-319]: https://github.com/pomerium/pomerium/issues/319
[gh-32]: https://github.com/pomerium/pomerium/issues/32
[gh-320]: https://github.com/pomerium/pomerium/issues/320
[gh-321]: https://github.com/pomerium/pomerium/issues/321
[gh-322]: https://github.com/pomerium/pomerium/issues/322
[gh-323]: https://github.com/pomerium/pomerium/issues/323
[gh-324]: https://github.com/pomerium/pomerium/issues/324
[gh-325]: https://github.com/pomerium/pomerium/issues/325
[gh-326]: https://github.com/pomerium/pomerium/issues/326
[gh-327]: https://github.com/pomerium/pomerium/issues/327
[gh-328]: https://github.com/pomerium/pomerium/issues/328
[gh-329]: https://github.com/pomerium/pomerium/issues/329
[gh-33]: https://github.com/pomerium/pomerium/issues/33
[gh-330]: https://github.com/pomerium/pomerium/issues/330
[gh-331]: https://github.com/pomerium/pomerium/issues/331
[gh-332]: https://github.com/pomerium/pomerium/issues/332
[gh-333]: https://github.com/pomerium/pomerium/issues/333
[gh-334]: https://github.com/pomerium/pomerium/issues/334
[gh-335]: https://github.com/pomerium/pomerium/issues/335
[gh-336]: https://github.com/pomerium/pomerium/issues/336
[gh-337]: https://github.com/pomerium/pomerium/issues/337
[gh-338]: https://github.com/pomerium/pomerium/issues/338
[gh-339]: https://github.com/pomerium/pomerium/issues/339
[gh-34]: https://github.com/pomerium/pomerium/issues/34
[gh-340]: https://github.com/pomerium/pomerium/issues/340
[gh-341]: https://github.com/pomerium/pomerium/issues/341
[gh-342]: https://github.com/pomerium/pomerium/issues/342
[gh-343]: https://github.com/pomerium/pomerium/issues/343
[gh-344]: https://github.com/pomerium/pomerium/issues/344
[gh-345]: https://github.com/pomerium/pomerium/issues/345
[gh-346]: https://github.com/pomerium/pomerium/issues/346
[gh-347]: https://github.com/pomerium/pomerium/issues/347
[gh-348]: https://github.com/pomerium/pomerium/issues/348
[gh-349]: https://github.com/pomerium/pomerium/issues/349
[gh-35]: https://github.com/pomerium/pomerium/issues/35
[gh-350]: https://github.com/pomerium/pomerium/issues/350
[gh-351]: https://github.com/pomerium/pomerium/issues/351
[gh-352]: https://github.com/pomerium/pomerium/issues/352
[gh-353]: https://github.com/pomerium/pomerium/issues/353
[gh-354]: https://github.com/pomerium/pomerium/issues/354
[gh-355]: https://github.com/pomerium/pomerium/issues/355
[gh-356]: https://github.com/pomerium/pomerium/issues/356
[gh-357]: https://github.com/pomerium/pomerium/issues/357
[gh-358]: https://github.com/pomerium/pomerium/issues/358
[gh-359]: https://github.com/pomerium/pomerium/issues/359
[gh-36]: https://github.com/pomerium/pomerium/issues/36
[gh-360]: https://github.com/pomerium/pomerium/issues/360
[gh-361]: https://github.com/pomerium/pomerium/issues/361
[gh-362]: https://github.com/pomerium/pomerium/issues/362
[gh-363]: https://github.com/pomerium/pomerium/issues/363
[gh-364]: https://github.com/pomerium/pomerium/issues/364
[gh-365]: https://github.com/pomerium/pomerium/issues/365
[gh-366]: https://github.com/pomerium/pomerium/issues/366
[gh-367]: https://github.com/pomerium/pomerium/issues/367
[gh-368]: https://github.com/pomerium/pomerium/issues/368
[gh-369]: https://github.com/pomerium/pomerium/issues/369
[gh-37]: https://github.com/pomerium/pomerium/issues/37
[gh-370]: https://github.com/pomerium/pomerium/issues/370
[gh-371]: https://github.com/pomerium/pomerium/issues/371
[gh-372]: https://github.com/pomerium/pomerium/issues/372
[gh-373]: https://github.com/pomerium/pomerium/issues/373
[gh-374]: https://github.com/pomerium/pomerium/issues/374
[gh-375]: https://github.com/pomerium/pomerium/issues/375
[gh-376]: https://github.com/pomerium/pomerium/issues/376
[gh-377]: https://github.com/pomerium/pomerium/issues/377
[gh-378]: https://github.com/pomerium/pomerium/issues/378
[gh-379]: https://github.com/pomerium/pomerium/issues/379
[gh-38]: https://github.com/pomerium/pomerium/issues/38
[gh-380]: https://github.com/pomerium/pomerium/issues/380
[gh-381]: https://github.com/pomerium/pomerium/issues/381
[gh-382]: https://github.com/pomerium/pomerium/issues/382
[gh-383]: https://github.com/pomerium/pomerium/issues/383
[gh-384]: https://github.com/pomerium/pomerium/issues/384
[gh-385]: https://github.com/pomerium/pomerium/issues/385
[gh-386]: https://github.com/pomerium/pomerium/issues/386
[gh-387]: https://github.com/pomerium/pomerium/issues/387
[gh-388]: https://github.com/pomerium/pomerium/issues/388
[gh-389]: https://github.com/pomerium/pomerium/issues/389
[gh-39]: https://github.com/pomerium/pomerium/issues/39
[gh-390]: https://github.com/pomerium/pomerium/issues/390
[gh-391]: https://github.com/pomerium/pomerium/issues/391
[gh-392]: https://github.com/pomerium/pomerium/issues/392
[gh-393]: https://github.com/pomerium/pomerium/issues/393
[gh-394]: https://github.com/pomerium/pomerium/issues/394
[gh-395]: https://github.com/pomerium/pomerium/issues/395
[gh-396]: https://github.com/pomerium/pomerium/issues/396
[gh-397]: https://github.com/pomerium/pomerium/issues/397
[gh-398]: https://github.com/pomerium/pomerium/issues/398
[gh-399]: https://github.com/pomerium/pomerium/issues/399
[gh-4]: https://github.com/pomerium/pomerium/issues/4
[gh-40]: https://github.com/pomerium/pomerium/issues/40
[gh-400]: https://github.com/pomerium/pomerium/issues/400
[gh-401]: https://github.com/pomerium/pomerium/issues/401
[gh-402]: https://github.com/pomerium/pomerium/issues/402
[gh-403]: https://github.com/pomerium/pomerium/issues/403
[gh-404]: https://github.com/pomerium/pomerium/issues/404
[gh-405]: https://github.com/pomerium/pomerium/issues/405
[gh-406]: https://github.com/pomerium/pomerium/issues/406
[gh-407]: https://github.com/pomerium/pomerium/issues/407
[gh-408]: https://github.com/pomerium/pomerium/issues/408
[gh-409]: https://github.com/pomerium/pomerium/issues/409
[gh-41]: https://github.com/pomerium/pomerium/issues/41
[gh-410]: https://github.com/pomerium/pomerium/issues/410
[gh-411]: https://github.com/pomerium/pomerium/issues/411
[gh-412]: https://github.com/pomerium/pomerium/issues/412
[gh-413]: https://github.com/pomerium/pomerium/issues/413
[gh-414]: https://github.com/pomerium/pomerium/issues/414
[gh-415]: https://github.com/pomerium/pomerium/issues/415
[gh-416]: https://github.com/pomerium/pomerium/issues/416
[gh-417]: https://github.com/pomerium/pomerium/issues/417
[gh-418]: https://github.com/pomerium/pomerium/issues/418
[gh-419]: https://github.com/pomerium/pomerium/issues/419
[gh-42]: https://github.com/pomerium/pomerium/issues/42
[gh-420]: https://github.com/pomerium/pomerium/issues/420
[gh-421]: https://github.com/pomerium/pomerium/issues/421
[gh-422]: https://github.com/pomerium/pomerium/issues/422
[gh-423]: https://github.com/pomerium/pomerium/issues/423
[gh-424]: https://github.com/pomerium/pomerium/issues/424
[gh-425]: https://github.com/pomerium/pomerium/issues/425
[gh-426]: https://github.com/pomerium/pomerium/issues/426
[gh-427]: https://github.com/pomerium/pomerium/issues/427
[gh-428]: https://github.com/pomerium/pomerium/issues/428
[gh-429]: https://github.com/pomerium/pomerium/issues/429
[gh-43]: https://github.com/pomerium/pomerium/issues/43
[gh-430]: https://github.com/pomerium/pomerium/issues/430
[gh-431]: https://github.com/pomerium/pomerium/issues/431
[gh-432]: https://github.com/pomerium/pomerium/issues/432
[gh-433]: https://github.com/pomerium/pomerium/issues/433
[gh-434]: https://github.com/pomerium/pomerium/issues/434
[gh-435]: https://github.com/pomerium/pomerium/issues/435
[gh-436]: https://github.com/pomerium/pomerium/issues/436
[gh-437]: https://github.com/pomerium/pomerium/issues/437
[gh-438]: https://github.com/pomerium/pomerium/issues/438
[gh-439]: https://github.com/pomerium/pomerium/issues/439
[gh-44]: https://github.com/pomerium/pomerium/issues/44
[gh-440]: https://github.com/pomerium/pomerium/issues/440
[gh-441]: https://github.com/pomerium/pomerium/issues/441
[gh-442]: https://github.com/pomerium/pomerium/issues/442
[gh-443]: https://github.com/pomerium/pomerium/issues/443
[gh-444]: https://github.com/pomerium/pomerium/issues/444
[gh-445]: https://github.com/pomerium/pomerium/issues/445
[gh-446]: https://github.com/pomerium/pomerium/issues/446
[gh-447]: https://github.com/pomerium/pomerium/issues/447
[gh-448]: https://github.com/pomerium/pomerium/issues/448
[gh-449]: https://github.com/pomerium/pomerium/issues/449
[gh-45]: https://github.com/pomerium/pomerium/issues/45
[gh-450]: https://github.com/pomerium/pomerium/issues/450
[gh-451]: https://github.com/pomerium/pomerium/issues/451
[gh-452]: https://github.com/pomerium/pomerium/issues/452
[gh-453]: https://github.com/pomerium/pomerium/issues/453
[gh-454]: https://github.com/pomerium/pomerium/issues/454
[gh-455]: https://github.com/pomerium/pomerium/issues/455
[gh-456]: https://github.com/pomerium/pomerium/issues/456
[gh-457]: https://github.com/pomerium/pomerium/issues/457
[gh-458]: https://github.com/pomerium/pomerium/issues/458
[gh-459]: https://github.com/pomerium/pomerium/issues/459
[gh-46]: https://github.com/pomerium/pomerium/issues/46
[gh-460]: https://github.com/pomerium/pomerium/issues/460
[gh-461]: https://github.com/pomerium/pomerium/issues/461
[gh-462]: https://github.com/pomerium/pomerium/issues/462
[gh-463]: https://github.com/pomerium/pomerium/issues/463
[gh-464]: https://github.com/pomerium/pomerium/issues/464
[gh-465]: https://github.com/pomerium/pomerium/issues/465
[gh-466]: https://github.com/pomerium/pomerium/issues/466
[gh-467]: https://github.com/pomerium/pomerium/issues/467
[gh-468]: https://github.com/pomerium/pomerium/issues/468
[gh-469]: https://github.com/pomerium/pomerium/issues/469
[gh-47]: https://github.com/pomerium/pomerium/issues/47
[gh-470]: https://github.com/pomerium/pomerium/issues/470
[gh-471]: https://github.com/pomerium/pomerium/issues/471
[gh-472]: https://github.com/pomerium/pomerium/issues/472
[gh-473]: https://github.com/pomerium/pomerium/issues/473
[gh-474]: https://github.com/pomerium/pomerium/issues/474
[gh-475]: https://github.com/pomerium/pomerium/issues/475
[gh-476]: https://github.com/pomerium/pomerium/issues/476
[gh-477]: https://github.com/pomerium/pomerium/issues/477
[gh-478]: https://github.com/pomerium/pomerium/issues/478
[gh-479]: https://github.com/pomerium/pomerium/issues/479
[gh-48]: https://github.com/pomerium/pomerium/issues/48
[gh-480]: https://github.com/pomerium/pomerium/issues/480
[gh-481]: https://github.com/pomerium/pomerium/issues/481
[gh-482]: https://github.com/pomerium/pomerium/issues/482
[gh-483]: https://github.com/pomerium/pomerium/issues/483
[gh-484]: https://github.com/pomerium/pomerium/issues/484
[gh-485]: https://github.com/pomerium/pomerium/issues/485
[gh-486]: https://github.com/pomerium/pomerium/issues/486
[gh-487]: https://github.com/pomerium/pomerium/issues/487
[gh-488]: https://github.com/pomerium/pomerium/issues/488
[gh-489]: https://github.com/pomerium/pomerium/issues/489
[gh-49]: https://github.com/pomerium/pomerium/issues/49
[gh-490]: https://github.com/pomerium/pomerium/issues/490
[gh-491]: https://github.com/pomerium/pomerium/issues/491
[gh-492]: https://github.com/pomerium/pomerium/issues/492
[gh-493]: https://github.com/pomerium/pomerium/issues/493
[gh-494]: https://github.com/pomerium/pomerium/issues/494
[gh-495]: https://github.com/pomerium/pomerium/issues/495
[gh-496]: https://github.com/pomerium/pomerium/issues/496
[gh-497]: https://github.com/pomerium/pomerium/issues/497
[gh-498]: https://github.com/pomerium/pomerium/issues/498
[gh-499]: https://github.com/pomerium/pomerium/issues/499
[gh-5]: https://github.com/pomerium/pomerium/issues/5
[gh-50]: https://github.com/pomerium/pomerium/issues/50
[gh-500]: https://github.com/pomerium/pomerium/issues/500
[gh-501]: https://github.com/pomerium/pomerium/issues/501
[gh-502]: https://github.com/pomerium/pomerium/issues/502
[gh-503]: https://github.com/pomerium/pomerium/issues/503
[gh-504]: https://github.com/pomerium/pomerium/issues/504
[gh-505]: https://github.com/pomerium/pomerium/issues/505
[gh-506]: https://github.com/pomerium/pomerium/issues/506
[gh-507]: https://github.com/pomerium/pomerium/issues/507
[gh-508]: https://github.com/pomerium/pomerium/issues/508
[gh-509]: https://github.com/pomerium/pomerium/issues/509
[gh-51]: https://github.com/pomerium/pomerium/issues/51
[gh-510]: https://github.com/pomerium/pomerium/issues/510
[gh-511]: https://github.com/pomerium/pomerium/issues/511
[gh-512]: https://github.com/pomerium/pomerium/issues/512
[gh-513]: https://github.com/pomerium/pomerium/issues/513
[gh-514]: https://github.com/pomerium/pomerium/issues/514
[gh-515]: https://github.com/pomerium/pomerium/issues/515
[gh-516]: https://github.com/pomerium/pomerium/issues/516
[gh-517]: https://github.com/pomerium/pomerium/issues/517
[gh-518]: https://github.com/pomerium/pomerium/issues/518
[gh-519]: https://github.com/pomerium/pomerium/issues/519
[gh-52]: https://github.com/pomerium/pomerium/issues/52
[gh-520]: https://github.com/pomerium/pomerium/issues/520
[gh-521]: https://github.com/pomerium/pomerium/issues/521
[gh-522]: https://github.com/pomerium/pomerium/issues/522
[gh-523]: https://github.com/pomerium/pomerium/issues/523
[gh-524]: https://github.com/pomerium/pomerium/issues/524
[gh-525]: https://github.com/pomerium/pomerium/issues/525
[gh-526]: https://github.com/pomerium/pomerium/issues/526
[gh-527]: https://github.com/pomerium/pomerium/issues/527
[gh-528]: https://github.com/pomerium/pomerium/issues/528
[gh-529]: https://github.com/pomerium/pomerium/issues/529
[gh-53]: https://github.com/pomerium/pomerium/issues/53
[gh-530]: https://github.com/pomerium/pomerium/issues/530
[gh-531]: https://github.com/pomerium/pomerium/issues/531
[gh-532]: https://github.com/pomerium/pomerium/issues/532
[gh-533]: https://github.com/pomerium/pomerium/issues/533
[gh-534]: https://github.com/pomerium/pomerium/issues/534
[gh-535]: https://github.com/pomerium/pomerium/issues/535
[gh-536]: https://github.com/pomerium/pomerium/issues/536
[gh-537]: https://github.com/pomerium/pomerium/issues/537
[gh-538]: https://github.com/pomerium/pomerium/issues/538
[gh-539]: https://github.com/pomerium/pomerium/issues/539
[gh-54]: https://github.com/pomerium/pomerium/issues/54
[gh-540]: https://github.com/pomerium/pomerium/issues/540
[gh-541]: https://github.com/pomerium/pomerium/issues/541
[gh-542]: https://github.com/pomerium/pomerium/issues/542
[gh-543]: https://github.com/pomerium/pomerium/issues/543
[gh-544]: https://github.com/pomerium/pomerium/issues/544
[gh-545]: https://github.com/pomerium/pomerium/issues/545
[gh-546]: https://github.com/pomerium/pomerium/issues/546
[gh-547]: https://github.com/pomerium/pomerium/issues/547
[gh-548]: https://github.com/pomerium/pomerium/issues/548
[gh-549]: https://github.com/pomerium/pomerium/issues/549
[gh-55]: https://github.com/pomerium/pomerium/issues/55
[gh-550]: https://github.com/pomerium/pomerium/issues/550
[gh-551]: https://github.com/pomerium/pomerium/issues/551
[gh-552]: https://github.com/pomerium/pomerium/issues/552
[gh-553]: https://github.com/pomerium/pomerium/issues/553
[gh-554]: https://github.com/pomerium/pomerium/issues/554
[gh-555]: https://github.com/pomerium/pomerium/issues/555
[gh-556]: https://github.com/pomerium/pomerium/issues/556
[gh-557]: https://github.com/pomerium/pomerium/issues/557
[gh-558]: https://github.com/pomerium/pomerium/issues/558
[gh-559]: https://github.com/pomerium/pomerium/issues/559
[gh-56]: https://github.com/pomerium/pomerium/issues/56
[gh-560]: https://github.com/pomerium/pomerium/issues/560
[gh-561]: https://github.com/pomerium/pomerium/issues/561
[gh-562]: https://github.com/pomerium/pomerium/issues/562
[gh-563]: https://github.com/pomerium/pomerium/issues/563
[gh-564]: https://github.com/pomerium/pomerium/issues/564
[gh-565]: https://github.com/pomerium/pomerium/issues/565
[gh-566]: https://github.com/pomerium/pomerium/issues/566
[gh-567]: https://github.com/pomerium/pomerium/issues/567
[gh-568]: https://github.com/pomerium/pomerium/issues/568
[gh-569]: https://github.com/pomerium/pomerium/issues/569
[gh-57]: https://github.com/pomerium/pomerium/issues/57
[gh-570]: https://github.com/pomerium/pomerium/issues/570
[gh-571]: https://github.com/pomerium/pomerium/issues/571
[gh-572]: https://github.com/pomerium/pomerium/issues/572
[gh-573]: https://github.com/pomerium/pomerium/issues/573
[gh-574]: https://github.com/pomerium/pomerium/issues/574
[gh-575]: https://github.com/pomerium/pomerium/issues/575
[gh-576]: https://github.com/pomerium/pomerium/issues/576
[gh-577]: https://github.com/pomerium/pomerium/issues/577
[gh-578]: https://github.com/pomerium/pomerium/issues/578
[gh-579]: https://github.com/pomerium/pomerium/issues/579
[gh-58]: https://github.com/pomerium/pomerium/issues/58
[gh-580]: https://github.com/pomerium/pomerium/issues/580
[gh-581]: https://github.com/pomerium/pomerium/issues/581
[gh-582]: https://github.com/pomerium/pomerium/issues/582
[gh-583]: https://github.com/pomerium/pomerium/issues/583
[gh-584]: https://github.com/pomerium/pomerium/issues/584
[gh-585]: https://github.com/pomerium/pomerium/issues/585
[gh-586]: https://github.com/pomerium/pomerium/issues/586
[gh-587]: https://github.com/pomerium/pomerium/issues/587
[gh-588]: https://github.com/pomerium/pomerium/issues/588
[gh-589]: https://github.com/pomerium/pomerium/issues/589
[gh-59]: https://github.com/pomerium/pomerium/issues/59
[gh-590]: https://github.com/pomerium/pomerium/issues/590
[gh-591]: https://github.com/pomerium/pomerium/issues/591
[gh-592]: https://github.com/pomerium/pomerium/issues/592
[gh-593]: https://github.com/pomerium/pomerium/issues/593
[gh-594]: https://github.com/pomerium/pomerium/issues/594
[gh-595]: https://github.com/pomerium/pomerium/issues/595
[gh-596]: https://github.com/pomerium/pomerium/issues/596
[gh-597]: https://github.com/pomerium/pomerium/issues/597
[gh-598]: https://github.com/pomerium/pomerium/issues/598
[gh-599]: https://github.com/pomerium/pomerium/issues/599
[gh-6]: https://github.com/pomerium/pomerium/issues/6
[gh-60]: https://github.com/pomerium/pomerium/issues/60
[gh-600]: https://github.com/pomerium/pomerium/issues/600
[gh-601]: https://github.com/pomerium/pomerium/issues/601
[gh-602]: https://github.com/pomerium/pomerium/issues/602
[gh-603]: https://github.com/pomerium/pomerium/issues/603
[gh-604]: https://github.com/pomerium/pomerium/issues/604
[gh-605]: https://github.com/pomerium/pomerium/issues/605
[gh-606]: https://github.com/pomerium/pomerium/issues/606
[gh-607]: https://github.com/pomerium/pomerium/issues/607
[gh-608]: https://github.com/pomerium/pomerium/issues/608
[gh-609]: https://github.com/pomerium/pomerium/issues/609
[gh-61]: https://github.com/pomerium/pomerium/issues/61
[gh-610]: https://github.com/pomerium/pomerium/issues/610
[gh-611]: https://github.com/pomerium/pomerium/issues/611
[gh-612]: https://github.com/pomerium/pomerium/issues/612
[gh-613]: https://github.com/pomerium/pomerium/issues/613
[gh-614]: https://github.com/pomerium/pomerium/issues/614
[gh-615]: https://github.com/pomerium/pomerium/issues/615
[gh-616]: https://github.com/pomerium/pomerium/issues/616
[gh-617]: https://github.com/pomerium/pomerium/issues/617
[gh-618]: https://github.com/pomerium/pomerium/issues/618
[gh-619]: https://github.com/pomerium/pomerium/issues/619
[gh-62]: https://github.com/pomerium/pomerium/issues/62
[gh-620]: https://github.com/pomerium/pomerium/issues/620
[gh-621]: https://github.com/pomerium/pomerium/issues/621
[gh-622]: https://github.com/pomerium/pomerium/issues/622
[gh-623]: https://github.com/pomerium/pomerium/issues/623
[gh-624]: https://github.com/pomerium/pomerium/issues/624
[gh-625]: https://github.com/pomerium/pomerium/issues/625
[gh-626]: https://github.com/pomerium/pomerium/issues/626
[gh-627]: https://github.com/pomerium/pomerium/issues/627
[gh-628]: https://github.com/pomerium/pomerium/issues/628
[gh-629]: https://github.com/pomerium/pomerium/issues/629
[gh-63]: https://github.com/pomerium/pomerium/issues/63
[gh-630]: https://github.com/pomerium/pomerium/issues/630
[gh-631]: https://github.com/pomerium/pomerium/issues/631
[gh-632]: https://github.com/pomerium/pomerium/issues/632
[gh-633]: https://github.com/pomerium/pomerium/issues/633
[gh-634]: https://github.com/pomerium/pomerium/issues/634
[gh-635]: https://github.com/pomerium/pomerium/issues/635
[gh-636]: https://github.com/pomerium/pomerium/issues/636
[gh-637]: https://github.com/pomerium/pomerium/issues/637
[gh-638]: https://github.com/pomerium/pomerium/issues/638
[gh-639]: https://github.com/pomerium/pomerium/issues/639
[gh-64]: https://github.com/pomerium/pomerium/issues/64
[gh-640]: https://github.com/pomerium/pomerium/issues/640
[gh-641]: https://github.com/pomerium/pomerium/issues/641
[gh-642]: https://github.com/pomerium/pomerium/issues/642
[gh-643]: https://github.com/pomerium/pomerium/issues/643
[gh-644]: https://github.com/pomerium/pomerium/issues/644
[gh-645]: https://github.com/pomerium/pomerium/issues/645
[gh-646]: https://github.com/pomerium/pomerium/issues/646
[gh-647]: https://github.com/pomerium/pomerium/issues/647
[gh-648]: https://github.com/pomerium/pomerium/issues/648
[gh-649]: https://github.com/pomerium/pomerium/issues/649
[gh-65]: https://github.com/pomerium/pomerium/issues/65
[gh-650]: https://github.com/pomerium/pomerium/issues/650
[gh-651]: https://github.com/pomerium/pomerium/issues/651
[gh-652]: https://github.com/pomerium/pomerium/issues/652
[gh-653]: https://github.com/pomerium/pomerium/issues/653
[gh-654]: https://github.com/pomerium/pomerium/issues/654
[gh-655]: https://github.com/pomerium/pomerium/issues/655
[gh-656]: https://github.com/pomerium/pomerium/issues/656
[gh-657]: https://github.com/pomerium/pomerium/issues/657
[gh-658]: https://github.com/pomerium/pomerium/issues/658
[gh-659]: https://github.com/pomerium/pomerium/issues/659
[gh-66]: https://github.com/pomerium/pomerium/issues/66
[gh-660]: https://github.com/pomerium/pomerium/issues/660
[gh-661]: https://github.com/pomerium/pomerium/issues/661
[gh-662]: https://github.com/pomerium/pomerium/issues/662
[gh-663]: https://github.com/pomerium/pomerium/issues/663
[gh-664]: https://github.com/pomerium/pomerium/issues/664
[gh-665]: https://github.com/pomerium/pomerium/issues/665
[gh-666]: https://github.com/pomerium/pomerium/issues/666
[gh-667]: https://github.com/pomerium/pomerium/issues/667
[gh-668]: https://github.com/pomerium/pomerium/issues/668
[gh-669]: https://github.com/pomerium/pomerium/issues/669
[gh-67]: https://github.com/pomerium/pomerium/issues/67
[gh-670]: https://github.com/pomerium/pomerium/issues/670
[gh-671]: https://github.com/pomerium/pomerium/issues/671
[gh-672]: https://github.com/pomerium/pomerium/issues/672
[gh-673]: https://github.com/pomerium/pomerium/issues/673
[gh-674]: https://github.com/pomerium/pomerium/issues/674
[gh-675]: https://github.com/pomerium/pomerium/issues/675
[gh-676]: https://github.com/pomerium/pomerium/issues/676
[gh-677]: https://github.com/pomerium/pomerium/issues/677
[gh-678]: https://github.com/pomerium/pomerium/issues/678
[gh-679]: https://github.com/pomerium/pomerium/issues/679
[gh-68]: https://github.com/pomerium/pomerium/issues/68
[gh-69]: https://github.com/pomerium/pomerium/issues/69
[gh-7]: https://github.com/pomerium/pomerium/issues/7
[gh-70]: https://github.com/pomerium/pomerium/issues/70
[gh-71]: https://github.com/pomerium/pomerium/issues/71
[gh-72]: https://github.com/pomerium/pomerium/issues/72
[gh-73]: https://github.com/pomerium/pomerium/issues/73
[gh-74]: https://github.com/pomerium/pomerium/issues/74
[gh-75]: https://github.com/pomerium/pomerium/issues/75
[gh-76]: https://github.com/pomerium/pomerium/issues/76
[gh-77]: https://github.com/pomerium/pomerium/issues/77
[gh-78]: https://github.com/pomerium/pomerium/issues/78
[gh-79]: https://github.com/pomerium/pomerium/issues/79
[gh-8]: https://github.com/pomerium/pomerium/issues/8
[gh-80]: https://github.com/pomerium/pomerium/issues/80
[gh-81]: https://github.com/pomerium/pomerium/issues/81
[gh-82]: https://github.com/pomerium/pomerium/issues/82
[gh-83]: https://github.com/pomerium/pomerium/issues/83
[gh-84]: https://github.com/pomerium/pomerium/issues/84
[gh-85]: https://github.com/pomerium/pomerium/issues/85
[gh-86]: https://github.com/pomerium/pomerium/issues/86
[gh-87]: https://github.com/pomerium/pomerium/issues/87
[gh-88]: https://github.com/pomerium/pomerium/issues/88
[gh-89]: https://github.com/pomerium/pomerium/issues/89
[gh-9]: https://github.com/pomerium/pomerium/issues/9
[gh-90]: https://github.com/pomerium/pomerium/issues/90
[gh-91]: https://github.com/pomerium/pomerium/issues/91
[gh-92]: https://github.com/pomerium/pomerium/issues/92
[gh-93]: https://github.com/pomerium/pomerium/issues/93
[gh-94]: https://github.com/pomerium/pomerium/issues/94
[gh-95]: https://github.com/pomerium/pomerium/issues/95
[gh-96]: https://github.com/pomerium/pomerium/issues/96
[gh-97]: https://github.com/pomerium/pomerium/issues/97
[gh-98]: https://github.com/pomerium/pomerium/issues/98
[gh-99]: https://github.com/pomerium/pomerium/issues/99
[synology tutorial]: /docs/guides/synology.md
