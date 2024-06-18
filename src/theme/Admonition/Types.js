import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';
import BusinessIcon from '@mui/icons-material/Business';

import styles from './styles.module.css';

function EnterpriseAdmonition(props) {
  return (
    <div className={styles.enterprise}>
      <div className={styles.enterprise_header}>
        <BusinessIcon />
        <h5>{props.title || 'Pomerium Enterprise'}</h5>
      </div>
      {props.children}
    </div>
  );
}

const AdmonitionTypes = {
  ...DefaultAdmonitionTypes,
  enterprise: EnterpriseAdmonition,
};

export default AdmonitionTypes;
