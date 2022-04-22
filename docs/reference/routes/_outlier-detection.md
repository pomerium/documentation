---
id: outlier-detection
title: Outlier Detection
keywords:
- reference
- Outlier Detection
---


# Outlier Detection
- `yaml`/`json` setting: `outlier_detection`
- Type: `object`
- Optional
- Example: `{ "consecutive_5xx": 12 }`

Outlier detection and ejection is the process of dynamically determining whether some number of hosts in an upstream cluster are performing unlike the others and removing them from the healthy load balancing set.

See Envoy [documentation](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/outlier#arch-overview-outlier-detection) and [API](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/cluster/v3/outlier_detection.proto#envoy-v3-api-msg-config-cluster-v3-outlierdetection) for more details.

