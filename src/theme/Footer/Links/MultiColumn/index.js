/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import LinkItem from "@theme/Footer/LinkItem";
import {FooterNewsletterForm} from '../../../../components/Newsletter';
import Logo from "@site/static/img/logo.svg"

function ColumnLinkItem({ item }) {
  return item.html ? (
    <li
      className="footer__item text--left" // Developer provided the HTML, so assume it's safe.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: item.html,
      }}
    />
  ) : (
    <li key={item.href || item.to} className="footer__item text--left">
      <LinkItem item={item} />
    </li>
  );
}

function Column({ column }) {
  return (
    <div className="col footer__col">
      <ul className="footer__items" style={{listStyleType: "none"}}>
        <li><span className="footer__title text--left">{column.title}</span></li>
        {column.items.map((item, i) => (
          <ColumnLinkItem key={i} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default function FooterLinksMultiColumn({ columns }) {
  return (
    <div className="row footer__links text--left">
      <div className="col footer__col">
        <ul className="footer__items" style={{listStyleType: "none"}}>
          <li><Logo/></li>
          <li style={{display: "inline-block"}}>LinkedIn</li>
          <li style={{display: "inline-block"}}>Twitter</li>
          <li style={{display: "inline-block"}}>GitHub</li>
          <li style={{display: "inline-block"}}>Slack</li>
        </ul>
      </div>
      {columns.map((column, i) => (
        <Column key={i} column={column} />
      ))}
      <FooterNewsletterForm/>
    </div>
  );
}
