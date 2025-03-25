import React, {JSX, useEffect} from 'react';
import Content from '@theme-original/NotFound/Content';
import type ContentType from '@theme/NotFound/Content';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): JSX.Element {
  useEffect(() => {
    if (typeof window !== 'undefined' && window?.gtag) {
      //normal page_view event
      gtag('event', 'page_view', {
        page_title: '404 Not Found',
        page_path: window.location.pathname,
        event_category: 'Errors',
        event_label: '404',
      });

      //custom event that might be easier to work with
      window.gtag('event', 'not_found', {
        page_title: 'Page Not Found',
        page_path: window.location.pathname,
        event_category: 'Errors',
        event_label: '404',
      });
    }
  }, []);
  return (
    <>
      <Content {...props} />
    </>
  );
}
