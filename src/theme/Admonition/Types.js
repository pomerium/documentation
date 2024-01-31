import React from 'react';
import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';
import BusinessIcon from '@mui/icons-material/Business';
import {useColorMode} from '@docusaurus/theme-common';

// import './types.css';
import styles from './types.module.css';

function EnterpriseAdmonition(props) {
  const {colorMode} = useColorMode();

  return (
    <div className={
      colorMode === 'dark'
        ? styles.custom_admonition_dark_mode
        : styles.custom_admonition_light_mode
      }
      >
      <div className={styles.custom_admonition_header}>
        <span><BusinessIcon style={
          colorMode === 'dark'
            ? {color: '#ECE5FF'}
            : {color: 'rgb(86 83 83)'}
          }/></span>
        <h5 className={
          colorMode === 'dark'
            ? styles.custom_admonition_title_dark_mode
            : styles.custom_admonition_title_light_mode
          }>{props.title}</h5>
      </div>
      <div className={
        colorMode === 'dark'
          ? styles.custom_admonition_text_dark_mode
          : styles.custom_admonition_text
      }>
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
