import { startCase } from "lodash";
import React, { ReactNode } from "react";

import Admonition from "@theme/Admonition";

import { ConfigType, Product, getTypeName } from "../types";

type TerraformConfigureTableProperties = {
  name: string;
  resource: "settings" | "route";
  type: ConfigType;
  defaultValue?: ReactNode;
  supportedProducts?: Product[];
};
const TerraformConfigureTable = ({
  name,
  resource,
  type,
  defaultValue,
  supportedProducts,
}: TerraformConfigureTableProperties) => {
  supportedProducts = supportedProducts || ["core", "enterprise", "zero"];
  const typeName = getTypeName(type);
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>
              <strong>
                <a
                  href={`https://registry.terraform.io/providers/pomerium/pomerium/latest/docs/resources/${resource}#${name}-1`}
                >
                  Parameter Name
                </a>
              </strong>
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
            <td>{typeName}</td>
            <td>{defaultValue ? defaultValue : <em>optional</em>}</td>
          </tr>
        </tbody>
      </table>

      {supportedProducts.length !== 3 && (
        <Admonition type="info">
          This setting is only available in{" "}
          {supportedProducts.map((p) => startCase(p)).join(" or ")}.
        </Admonition>
      )}
    </>
  );
};
export default TerraformConfigureTable;
