import React from 'react';
import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';
import PaidIcon from '@mui/icons-material/Paid';

import './types.css';

function EnterpriseAdmonition(props) {
  return (
    <div className="custom_admonition">
      <div className="custom_admonition_header">
        <span><PaidIcon style={{color: 'rgb(86 83 83)'}}/></span>
        <h5>{props.title}</h5>
      </div>
      <div className="custom_admonition_text">
        <p>{props.children}</p>
      </div>
    </div>
  );
}

const AdmonitionTypes = {
  ...DefaultAdmonitionTypes,
  'enterprise': EnterpriseAdmonition,
}

export default AdmonitionTypes;
