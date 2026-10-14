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
