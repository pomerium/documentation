/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Link from "@docusaurus/Link";
import isInternalUrl from "@docusaurus/isInternalUrl";
import useBaseUrl from "@docusaurus/useBaseUrl";
import React from "react";

import IconExternalLink from "@theme/Icon/ExternalLink";

export default function FooterLinkItem({ item }) {
  const { to, href, label, prependBaseUrlToHref, ...props } = item;
  const toUrl = useBaseUrl(to);
  const normalizedHref = useBaseUrl(href, {
    forcePrependBaseUrl: true,
  });
  return (
    <Link
      className="footer__link-item"
      {...(href
        ? {
            href: prependBaseUrlToHref ? normalizedHref : href,
          }
        : {
            to: toUrl,
          })}
      {...props}
    >
      {label}
      {href && !isInternalUrl(href) && <IconExternalLink />}
    </Link>
  );
}
