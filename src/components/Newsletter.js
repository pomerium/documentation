import React from "react";
import MailchimpSubscribe from "react-mailchimp-subscribe"

const url = "https://pomerium.us19.list-manage.com/subscribe/post?u=76f0996a737c138396687fd6b&amp;id=2f4f70cf07"

const Newsletter = () => (
    <MailchimpSubscribe
        url={url}
        render={({subscribe, status, message}) => (
            <div className="newsletter__wrap">
                <div className="ns-title">Pomerium Newsletter</div>
                <div className="ns-content">Updates on Pomerium and related security news.</div>
                <form onSubmit={formData => subscribe(formData)}>
                    <input
                    className="ns-input"
                    type="email"
                    name="email"
                    aria-label="Email"
                    placeholder="Email"
                    required
                    autoCapitalize="off"
                    autoCorrect="off"
                    />
                    <button type="submit" className="ns-button">
                    Subscribe
                    </button>
                    {status === "sending" && <div style={{ color: "blue" }}>sending...</div>}
                    {status === "error" && <div style={{ color: "red" }} dangerouslySetInnerHTML={{__html: message}}/>}
                    {status === "success" && <div style={{ color: "green" }}>Subscribed !</div>}
                </form>
            </div>
        )}
    />
)

export default Newsletter