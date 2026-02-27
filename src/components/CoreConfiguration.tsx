import React, { PropsWithChildren, ReactNode } from "react";

import { ConfigType, Resource, getTypeName } from "../types";
import CoreConfigureTable from "./CoreConfigureTable";

type CoreConfigurationProps = PropsWithChildren<{
  name: string;
  resource: Resource;
  type: ConfigType;
  defaultValue?: ReactNode;
}>;
const CoreConfiguration = ({
  name,
  resource,
  type,
  defaultValue,
  children,
}: CoreConfigurationProps) => {
  const terraformLink = `https://registry.terraform.io/providers/pomerium/pomerium/latest/docs/resources/${resource}#${name}-1`;
  return (
    <>
      <CoreConfigureTable name={name} type={type} defaultValue={defaultValue} />

      {children}

      <p>
        The <code>{name}</code> setting can also be configured by{" "}
        <a href={terraformLink}>Terraform</a>.
      </p>
    </>
  );
};
export default CoreConfiguration;
