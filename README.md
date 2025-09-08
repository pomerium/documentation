# Pomerium Documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/37046516-2e94-423f-bc17-453163570fad/deploy-status)](https://app.netlify.com/sites/pomerium-docusaurus/deploys) [![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC_BY--NC_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/) [![Discourse topics](https://img.shields.io/discourse/topics?label=Discuss&server=https%3A%2F%2Fdiscuss.pomerium.com%2F&style=flat-square)](https://discuss.pomerium.com/)

Pomerium's documentation is built using [Docusaurus 2](https://docusaurus.io/). It's published at <https://pomerium.com/docs>

## Contributing

The steps below detail the installation of this site locally for development.

### Installation

```sh
yarn
```

### Pre-commit Setup

This project uses pre-commit hooks to ensure code quality. To set up pre-commit:

1. Install pre-commit:
   ```sh
   pip install pre-commit
   ```
2. Install the git hook scripts:

   ```sh
   pre-commit install
   ```

3. (Optional) Run against all files:
   ```sh
   pre-commit run --all-files
   ```

The pre-commit hooks will now run automatically on each commit, running prettier formatting and spell checking.

### Local Development

```sh
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```sh
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.
