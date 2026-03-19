import React, {ReactNode} from 'react';

import {ConfigType, getTypeName} from '../types';

type KubernetesConfigureTableProps = {
  name: string;
  type: ConfigType;
  defaultValue?: ReactNode;
};
const KubernetesConfigureTable = ({
  name,
  type,
  defaultValue,
}: KubernetesConfigureTableProps) => {
  const typeName = getTypeName(type);
  return (
    <table>
      <thead>
        <tr>
          <th>
            <strong>
              <a href="/docs/deploy/k8s/reference#spec">Parameter Name</a>
            </strong>
          </th>
          <th>
            <strong>Type</strong>
          </th>
          <th>
            <strong>{defaultValue ? 'Default' : 'Usage'}</strong>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <code>{name}</code>
          </td>
          <td>{typeName}</td>
          <td>{defaultValue ? defaultValue : <em>optional</em>}</td>
        </tr>
      </tbody>
    </table>
  );
};
export default KubernetesConfigureTable;
