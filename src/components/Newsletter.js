import {ArrowForward} from '@mui/icons-material';
import React from 'react';
import MailchimpSubscribe from 'react-mailchimp-subscribe';

const url =
  'https://pomerium.us19.list-manage.com/subscribe/post?u=76f0996a737c138396687fd6b&amp;id=2f4f70cf07';

const CustomFormCommunity = ({status, message, onValidated}) => {
  let email;
  const submit = () =>
    email &&
    email.value.indexOf('@') > -1 &&
    onValidated({
      EMAIL: email.value,
    });

  return (
    <div className="newsletter__wrap">
      <div className="ns-title">Pomerium Newsletter</div>
      <div className="ns-content">
        Updates on Pomerium and related security news.
      </div>
      <input
        className="ns-input"
        ref={(node) => (email = node)}
        type="email"
        name="email"
        aria-label="Email"
        placeholder="Email"
        required
        autoCapitalize="off"
        autoCorrect="off"
      />
      <button type="submit" className="ns-button" onClick={submit}>
        Subscribe
      </button>
      {status === 'sending' && <div style={{color: 'blue'}}>sending...</div>}
      {status === 'error' && (
        <div
          style={{color: 'red'}}
          dangerouslySetInnerHTML={{__html: message}}
        />
      )}
      {status === 'success' && <div style={{color: 'green'}}>Subscribed !</div>}
    </div>
  );
};

const CustomFormFooter = ({status, message, onValidated}) => {
  let email;
  const submit = () =>
    email &&
    email.value.indexOf('@') > -1 &&
    onValidated({
      EMAIL: email.value,
    });

  return (
    <div className="col footer__col">
      <div className="footer__title text--left">Stay Connected</div>
      <div className="footer__item">
        <div style={{position: 'relative'}}>
          <input
            className="border-0 bg-stone/60 pr-12"
            style={{width: '100%', paddingRight: '48px'}}
            ref={(node) => (email = node)}
            type="email"
            name="email"
            aria-label="Email"
            placeholder="Email Address"
            required
            autoCapitalize="off"
            autoCorrect="off"
          />
          <button
            type="submit"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              height: 48,
              border: 'none',
              borderRadius: '25px',
            }}
            className="top-0 right-0 bottom-0 w-12 flex hover:text-purple"
            onClick={submit}>
            <ArrowForward />
          </button>
        </div>
      </div>
      <p className="text-sm text-slate/60">Your email is safe with us</p>
      {status === 'sending' && <div style={{color: 'blue'}}>sending...</div>}
      {status === 'error' && (
        <div
          style={{color: 'red'}}
          dangerouslySetInnerHTML={{__html: message}}
        />
      )}
      {status === 'success' && <div style={{color: 'green'}}>Subscribed !</div>}
    </div>
  );
};

const CommunityNewsletterForm = () => {
  return (
    <MailchimpSubscribe
      url={url}
      render={({subscribe, message, status}) => (
        <CustomFormCommunity
          status={status}
          message={message}
          onValidated={(formData) => subscribe(formData)}
        />
      )}
    />
  );
};

const FooterNewsletterForm = () => (
  <MailchimpSubscribe
    url={url}
    render={({subscribe, message, status}) => (
      <CustomFormFooter
        status={status}
        message={message}
        onValidated={(formData) => subscribe(formData)}
      />
    )}
  />
);

export {CommunityNewsletterForm, FooterNewsletterForm};
