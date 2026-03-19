import React, {PropsWithChildren} from 'react';

import {Resource} from '../types';

type EnterpriseConfigurationProps = PropsWithChildren<{
  name: string;
  resource: Resource;
  via?: ('terraform' | 'ui')[];
}>;
const EnterpriseConfiguration = ({
  name,
  resource,
  via,
  children,
}: EnterpriseConfigurationProps) => {
  via = via || ['terraform', 'ui'];
  const terraformLink = `https://registry.terraform.io/providers/pomerium/pomerium/latest/docs/resources/${resource}#${name}-1`;
  return (
    <>
      {!via.includes('ui') && (
        <p>
          The <code>{name}</code> setting is a bootstrap setting and cannot be
          configured in the Console UI.{' '}
          {via.includes('terraform') && (
            <>
              However it can be configured by{' '}
              <a href={terraformLink}>Terraform</a>.
            </>
          )}
        </p>
      )}
      {children}
      {via.includes('ui') && via.includes('terraform') && (
        <p>
          The <code>{name}</code> setting can also be configured by{' '}
          <a href={terraformLink}>Terraform</a>.
        </p>
      )}
    </>
  );
};
export default EnterpriseConfiguration;
