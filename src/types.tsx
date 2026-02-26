import React, {ReactNode} from 'react';

export type ConfigType = 'String' | 'StringList' | 'StringSet';

export type Product = 'core' | 'enterprise' | 'zero';

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
