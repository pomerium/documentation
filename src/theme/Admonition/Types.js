import React from 'react';
import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';

function EnterpriseAdmonition(props) {
  return (
    <div style={{border: 'solid black', padding: 10}}>
      <h5 style={{color: 'blue', fontSize: 30}}>{props.title}</h5>
      <div>{props.children}</div>
    </div>
  );
}

const AdmonitionTypes = {
  ...DefaultAdmonitionTypes,
  'enterprise': EnterpriseAdmonition,
}

export default AdmonitionTypes;
