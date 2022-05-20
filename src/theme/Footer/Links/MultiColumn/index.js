/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import LinkItem from "@theme/Footer/LinkItem";
import {FooterNewsletterForm} from '../../../../components/Newsletter';

function ColumnLinkItem({ item }) {
  return item.html ? (
    <li
      className="footer__item text--center" // Developer provided the HTML, so assume it's safe.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: item.html,
      }}
    />
  ) : (
    <li key={item.href || item.to} className="footer__item text--center">
      <LinkItem item={item} />
    </li>
  );
}

function Column({ column }) {
  return (
    <div className="col footer__col">
      <div className="footer__title text--left">{column.title}</div>
      <ul className="footer__items">
        {column.items.map((item, i) => (
          <ColumnLinkItem key={i} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default function FooterLinksMultiColumn({ columns }) {
  return (
    <div className="row footer__links text--center">
      {columns.map((column, i) => (
        <Column key={i} column={column} />
      ))}
      <FooterNewsletterForm/>
    </div>
  );
}
