#!/bin/bash
# Validation-only entrypoint for the sealed Jenkins fixture. It does three things the
# published guide does by hand or doesn't need, then hands off to the stock Jenkins
# launcher:
#   1. Trusts the harness CA so Jenkins (Java) can fetch Pomerium's JWKS over TLS.
#   2. Installs the JWT Auth + Configuration-as-Code plugins headlessly.
#   3. Points JCasC at the validation security-realm config.
# Test-only. The reader-facing compose keeps the normal first-run wizard.
set -euo pipefail

CA="/certs/ca.crt"
TRUSTSTORE="/var/jenkins_home/cacerts"

# The certs-init service writes the CA into the shared volume; wait for it so the
# import below never races ahead of cert generation.
for _ in $(seq 1 60); do
  [ -f "$CA" ] && break
  echo "waiting for harness CA at $CA ..."
  sleep 2
done

# Build a writable truststore seeded from the JDK default, then add the harness CA.
SRC_TRUSTSTORE="$(find "${JAVA_HOME:-/opt/java/openjdk}/lib/security" -name cacerts | head -n1)"
cp "$SRC_TRUSTSTORE" "$TRUSTSTORE"
chmod 644 "$TRUSTSTORE"
keytool -importcert -noprompt -trustcacerts \
  -alias pomerium-guides-harness-ca \
  -file "$CA" \
  -keystore "$TRUSTSTORE" \
  -storepass changeit
echo "imported harness CA into $TRUSTSTORE"

# Install the plugins the JWT flow needs (idempotent across restarts).
jenkins-plugin-cli --plugins \
  configuration-as-code \
  jwt-auth

export CASC_JENKINS_CONFIG=/var/jenkins_home/casc/jenkins.casc.yaml
export JAVA_OPTS="${JAVA_OPTS:-} -Djenkins.install.runSetupWizard=false -Djavax.net.ssl.trustStore=${TRUSTSTORE} -Djavax.net.ssl.trustStorePassword=changeit"

exec /usr/local/bin/jenkins.sh
