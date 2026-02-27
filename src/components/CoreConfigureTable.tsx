import React, { ReactNode } from "react";

import { ConfigType, getTypeName } from "../types";

type CoreConfigureTableProps = {
  name: string;
  type: ConfigType;
  defaultValue?: ReactNode;
};
const CoreConfigureTable = ({
  name,
  type,
  defaultValue,
}: CoreConfigureTableProps) => {
  const environmentVariableKey = name.toUpperCase();
  const typeName = getTypeName(type);
  return (
    <table>
      <thead>
        <tr>
          <th>
            <strong>Config File Key</strong>
          </th>
          <th>
            <strong>Environment Variable</strong>
          </th>
          <th>
            <strong>Type</strong>
          </th>
          <th>
            <strong>{defaultValue ? "Default" : "Usage"}</strong>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <code>{name}</code>
          </td>
          <td>
            <code>{environmentVariableKey}</code>
          </td>
          <td>{typeName}</td>
          <td>{defaultValue ? defaultValue : <em>optional</em>}</td>
        </tr>
      </tbody>
    </table>
  );
};
export default CoreConfigureTable;
