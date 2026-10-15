# Security policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 0.2.x   | Yes       |

0.2.0 is the first public release. 0.1.0 was a private pin and is not supported.

## Reporting a vulnerability

Report vulnerabilities privately through GitHub Security Advisories:

<https://github.com/swcstudiospace/SuperNuxt/security/advisories/new>

Please include the SuperNuxt version, the package (`supernuxt` or `create-supernuxt`), and a minimal reproduction. Do not open a public issue for a vulnerability, and do not send exploit details in a pull request.

This repository is the framework source. It does not contain production secrets, credentials, or deployed environment configuration. A `.env` file is gitignored. Do not add keys, tokens, or customer data to an issue or a patch.

SWC Studio Space maintainers will acknowledge a report and follow up on the advisory. Fixes ship in a later 0.2.x or 0.3.0 release and are recorded in `CHANGELOG.md`.

## Module secrets

These names are read by the optional modules. `.env.example` lists them with empty values. Do not commit a filled `.env`, a DSN, a token, a database URL, or an OAuth client secret.

| Name                               | Used by                     | When it is read                                                                                                                                           |
| ---------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SENTRY_DSN`                       | `@sentry/nuxt`              | Build time. Unset means the module is not installed and the SDK is not initialized.                                                                       |
| `SENTRY_AUTH_TOKEN`                | `@sentry/nuxt` source maps  | Build time only. Unset skips source-map upload. It is not a runtime secret and is not put on `runtimeConfig`.                                             |
| `BETTER_AUTH_SECRET`               | `better-auth`               | Request time, and only after `supernuxt.auth` is `true`. It must be at least 32 characters. `AUTH_SECRET` is an alias when `BETTER_AUTH_SECRET` is unset. |
| `DATABASE_URL`                     | drizzle-orm via postgres.js | Request time, and only when auth is enabled and the value is a `postgres://` or `postgresql://` URL. Boot does not open a connection.                     |
| `BETTER_AUTH_GITHUB_CLIENT_ID`     | better-auth GitHub OAuth    | Request time. Ignored unless the matching secret is also set.                                                                                             |
| `BETTER_AUTH_GITHUB_CLIENT_SECRET` | better-auth GitHub OAuth    | Request time. Ignored unless the matching client id is also set.                                                                                          |

`nuxt-security` does not add a secret. Its default setup leaves CSRF and basic auth off.
