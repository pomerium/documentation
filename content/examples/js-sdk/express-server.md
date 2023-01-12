```javascript
const express = require("express");
const { PomeriumVerifier } = require('@pomerium/js-sdk');
const app = express();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; //just for dev

app.get("/tofu", (request, response) => {
  const jwtVerifier = new PomeriumVerifier({});
  jwtVerifier.verifyJwt(request.get('X-Pomerium-Jwt-Assertion')).then(r => response.send(r))
});

app.get("/wrong-audience", (request, response) => {
  const jwtVerifier = new PomeriumVerifier({
    audience: [
      'correct-audience.com'
    ]
  });
  jwtVerifier.verifyJwt(request.get('X-Pomerium-Jwt-Assertion'))
    .then(r => response.send(r))
    .catch(e => response.send(e.message));
});

app.get("/wrong-issuer", (request, response) => {
  const jwtVerifier = new PomeriumVerifier({
    issuer: 'correct-issuer.com'
  });
  jwtVerifier.verifyJwt(request.get('X-Pomerium-Jwt-Assertion'))
    .then(r => response.send(r))
    .catch(e => response.send(e.message));
});

app.get("/expired", (request, response) => {
  const jwtVerifier = new PomeriumVerifier({
    expirationBuffer: -10000
  });
  jwtVerifier.verifyJwt(request.get('X-Pomerium-Jwt-Assertion'))
    .then(r => response.send(r))
    .catch(e => response.send(e.message));
});

app.listen(3010, () => {
  console.log("Listen on the port 3010...");
});
```