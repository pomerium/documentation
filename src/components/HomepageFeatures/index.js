import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';


const FeatureList = [
  {
    title: 'Pomerium Core',
    path: '/docs/overview',
    icon: 'terminal',
    description: (
      <>
        Documentation for open-source Pomerium.
      </>
    ),
  },
  {
    title: 'Pomerium Enterprise',
    path: '/docs/enterprise',
    icon: 'space_dashboard',
    description: (
      <>
        Install and configure Pomerium Enterprise
      </>
    ),
  },
  {
    title: 'Desktop and CLI Clients',
    path: '/docs/tcp/',
    icon: 'enhanced_encryption',
    description: (
      <>
        Extend Pomerium to protect any and every TCP connection.
      </>
    ),
  },
];

function Feature({title, description, path, icon}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <a href={path}>
        <span class="material-icons">{icon}</span>
        </a>
      </div>
      <div className="text--center padding-horiz--md">
        <a href={path}>
          <h3>{title}</h3>
        </a>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
