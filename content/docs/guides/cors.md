---
# cSpell:ignore reactjs nextjs

title: Cross-Origin Configuration
lang: en-US
keywords:
  [cors, javascript, cross-origin, spa, reactjs, single-page-app, nextjs, ajax]
description: This guide covers how to configure Pomerium for Cross-Origin setups.
---

Many applications, particularly single-page Javascript applications, use multiple domains for requests. For example an application may be served from `https://app.example.com`, but may make API calls to `https://api.example.com`. This guide covers how to configure Pomerium to work with applications like this.

This guide uses the following components:

1. An authenticated web application that serves the initial HTML + Javascript.
1. An API web application that serves a JSON API.
1. An instance of Pomerium in front of both.

## Configuration

### Pomerium

Create a file `config.yaml`:

```yaml
authenticate_service_url: https://authenticate.localhost.pomerium.io

certificate_file: /pomerium/cert.pem
certificate_key_file: /pomerium/private-key.pem

idp_provider: REPLACE
idp_client_id: REPLACE
idp_client_secret: REPLACE

cookie_secret: V2JBZk0zWGtsL29UcFUvWjVDWWQ2UHExNXJ0b2VhcDI=

routes:
  - from: https://api.localhost.pomerium.io
    to: http://api:8000
    allow_any_authenticated_user: true
    cors_allow_preflight: true
    set_response_headers:
      'Access-Control-Allow-Credentials': 'true'
      'Access-Control-Allow-Origin': 'https://app.localhost.pomerium.io'
      'Access-Control-Allow-Headers': 'X-Pomerium-Authorization'
  - from: https://app.localhost.pomerium.io
    to: http://app:8000
    allow_any_authenticated_user: true
```

### Web Application

The Web application is a simple go HTTP server. Create a file `app.go`:

```go
package main

import (
	"net/http"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir(".")))
	http.ListenAndServe(":8000", nil)
}
```

Create a file `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Example Application</title>
    <script type="module" src="index.mjs"></script>
  </head>
  <body></body>
</html>
```

And a file `index.mjs`:

```javascript
(async () => {
  const result = await fetch('https://api.localhost.pomerium.io', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });
  const json = await result.json();
  console.log('RESULT', json);
})();
```

### API Application

The API application is a simple go HTTP server. Create a file `api.go`:

```go
package main

import (
	"io"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		io.WriteString(w, `{ "message": "HELLO WORLD" }`)
	})
	http.ListenAndServe(":8000", nil)
}
```

### Docker-Compose

Finally create a docker-compose file `docker-compose.yaml`:

```yaml
services:
  pomerium:
    image: pomerium/pomerium:main
    ports:
      - 443:443
    volumes:
      - ./_wildcard.localhost.pomerium.io.pem:/pomerium/cert.pem:ro
      - ./_wildcard.localhost.pomerium.io-key.pem:/pomerium/private-key.pem:ro
      - ./config.yaml:/pomerium/config.yaml:ro

  app:
    image: golang:latest
    command: ['go', 'run', '.']
    environment:
      GO111MODULE: 'off'
    volumes:
      - ./app.go:/go/app.go:ro
      - ./index.html:/go/index.html:ro
      - ./index.mjs:/go/index.mjs:ro

  api:
    image: golang:latest
    command: ['go', 'run', '.']
    environment:
      GO111MODULE: 'off'
    volumes:
      - ./api.go:/go/api.go:ro
```

### Problem

This configuration results in a 401 error when `app.localhost.pomerium.io` is accessed:

> URL: https://api.localhost.pomerium.io/ Status: 401 Unauthorized Source: Network Address: 127.0.0.1:443 Initiator: index.mjs:2

The 401 is because the browser will not send the Pomerium cookie to a different domain.

## Solutions

### Use a Single Domain

Instead of using two domains, a single domain can be used with separate routes based on the path instead of the domain name. For example the routes can be setup as:

```yaml
routes:
  - from: https://app.localhost.pomerium.io
    prefix: /api
    to: http://api:8000
    allow_any_authenticated_user: true
  - from: https://app.localhost.pomerium.io
    to: http://app:8000
    allow_any_authenticated_user: true
```

In this way all requests to `/api` will be sent to the API server, and all other requests will be handled by the web application. Update the javascript to use the new domain:

```javascript
(async () => {
  const result = await fetch(location.origin + '/api', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });
  const json = await result.json();
  console.log('RESULT', json);
})();
```

And the request will succeed.

### Pass the Pomerium Credentials via a Header

Since the browser won't send a cookie to a different domain, you can pass the Pomerium authorization JWT via a header instead.

First allow Javascript to see the cookie with:

```yaml
cookie_http_only: false
```

And update the javascript:

```javascript
(async () => {
  const result = await fetch('https://api.localhost.pomerium.io', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'X-Pomerium-Authorization': document.cookie.substring(
        document.cookie.indexOf('=') + 1,
      ),
    },
  });
  const json = await result.json();
  console.log('RESULT', json);
})();
```

### Share the Cookie

If both domains fall under a shared parent domain (`app.example.com` and `api.example.com` are both under `example.com`), you can change the Pomerium's cookie domain and share the cookie. Update the pomerium configuration:

```yaml
cookie_domain: '.localhost.pomerium.io' # note the starting .
```

And now the cookie will be used for both domains. However the default browser policy for XHR and Fetch requests is to not pass the cookie, so you also need to change the javascript:

```javascript
(async () => {
  const result = await fetch('https://api.localhost.pomerium.io', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    credentials: 'include',
  });
  const json = await result.json();
  console.log('RESULT', json);
})();
```

See [withCredentials](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials) for XMLHttpRequest.
