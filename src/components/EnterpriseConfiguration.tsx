import React, { PropsWithChildren } from "react";

import { Resource } from "../types";

type EnterpriseConfigurationProps = PropsWithChildren<{
  name: string;
  resource: Resource;
  bootstrap?: boolean;
}>;
const EnterpriseConfiguration = ({
  name,
  resource,
  bootstrap,
  children,
}: EnterpriseConfigurationProps) => {
  const terraformLink = `https://registry.terraform.io/providers/pomerium/pomerium/latest/docs/resources/${resource}#${name}-1`;
  return (
    <>
      {bootstrap && (
        <p>
          The <code>{name}</code> setting is a bootstrap setting and cannot be
          configured in the Console UI. However it can be configured by{" "}
          <a href={terraformLink}>Terraform</a>.
        </p>
      )}
      {children}
      {!bootstrap && (
        <p>
          The <code>{name}</code> setting can also be configured by{" "}
          <a href={terraformLink}>Terraform</a>.
        </p>
      )}
    </>
  );
};
export default EnterpriseConfiguration;
