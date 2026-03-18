import React, {ReactNode} from 'react';

export type ConfigType = 'String' | 'StringList' | 'StringSet';

export type Product = 'core' | 'enterprise' | 'zero';

export type Resource =
  | 'cluster'
  | 'external_data_source'
  | 'key_pair'
  | 'namespace'
  | 'namespace_permission'
  | 'policy'
  | 'route'
  | 'service_account'
  | 'settings';

export function getTypeName(type: ConfigType): ReactNode {
  switch (type) {
    case 'String':
      return <code>string</code>;
    case 'StringList':
      return (
        <>
          Array of <code>string</code>
        </>
      );
    case 'StringSet':
      return (
        <>
          Set of <code>string</code>
        </>
      );
  }
}
