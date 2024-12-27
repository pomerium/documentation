import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Getting Started',
    path: '/docs/overview',
    icon: 'help_outline',
    description: <>Learn about Pomerium</>,
  },
  {
    title: 'Install',
    path: '/docs/install',
    icon: 'terminal',
    description: <>Install Pomerium into your infrastructure</>,
  },
  {
    title: 'Connect',
    path: '/docs/identity-providers/',
    icon: 'link',
    description: <>Connect Pomerium to your Identity Provider</>,
  },
  {
    title: 'Integrate',
    path: '/docs/guides/',
    icon: 'account_tree',
    description: <>Use our guides to integrate and secure your services</>,
  },
  {
    title: 'Deploy',
    path: '/docs/guides/',
    icon: 'account_tree',
    description: <>Deploy and scale seamlessly to production</>,
  },
  {
    title: 'Enterprise',
    path: '/docs/deploy/enterprise/about',
    icon: 'space_dashboard',
    description: <>Scale your access management to match your business</>,
  },
];

function Feature({title, description, path, icon}) {
  // cSpell:ignore horiz
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <a href={path}>
          <span className="material-icons">{icon}</span>
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
