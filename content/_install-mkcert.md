---
# cSpell:ignore CAROOT
---

If you haven't, install `mkcert` following these [GitHub instructions].

Create a trusted **root CA** and confirm the presence and names of your local CA files:

```bash
mkcert -install
The local CA is already installed in the system trust store! 👍
The local CA is already installed in the Firefox and/or Chrome/Chromium trust store! 👍

ls "$(mkcert -CAROOT)"
rootCA-key.pem  rootCA.pem
```

The output of `mkcert -install` may vary depending on your operating system.

[GitHub instructions]: https://github.com/FiloSottile/mkcert#installation
