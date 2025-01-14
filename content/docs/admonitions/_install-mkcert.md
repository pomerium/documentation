---
# cSpell:ignore CAROOT
---

If you haven't, install `mkcert` following these [GitHub instructions](https://github.com/FiloSottile/mkcert#installation).

Create a trusted **root CA** and confirm the presence and names of your local CA files:

```shell-session
$ mkcert -install
The local CA is already installed in the system trust store! 👍
The local CA is already installed in the Firefox and/or Chrome/Chromium trust store! 👍

$ ls "$(mkcert -CAROOT)"
rootCA-key.pem  rootCA.pem
```

The output of `mkcert -install` may vary depending on your operating system.
