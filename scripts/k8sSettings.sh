#!/bin/bash
wget https://raw.githubusercontent.com/pomerium/ingress-controller/main/config/crd/bases/ingress.pomerium.io_pomerium.yaml -O src/ingress.pomerium.io_pomerium.yaml
sed -i "/---/d" src/ingress.pomerium.io_pomerium.yaml
node  ./scripts/k8sSettingsToJson.js