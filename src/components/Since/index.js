import React from 'react';

import styles from './styles.module.css';

// Inline "Added in vX.Y" badge, registered globally via
// src/theme/MDXComponents.js: ## My feature <Since version="0.33.0" />
export default function Since({version}) {
  if (!version) return null;
  const label = String(version).startsWith('v') ? version : `v${version}`;
  return (
    <span className={styles.since} title={`Added in Pomerium ${label}`}>
      Added in {label}
    </span>
  );
}
