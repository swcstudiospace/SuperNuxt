/**
 * CSP shipped when `supernuxt.security` is on.
 * Production sources are explicit hosts. `*` and scheme-wide `https:` are rejected.
 * Dev adds the local sockets Vite, Nuxt DevTools, and the TanStack devtools dock need.
 * @nuxt/scripts ships an empty registry, so no third-party script host is allowed.
 */

export const googleFontStyleHost = "https://fonts.googleapis.com";
export const googleFontFileHost = "https://fonts.gstatic.com";

export const devOnlyCspTokens = [
  "'unsafe-eval'",
  "ws:",
  "wss:",
  "http://localhost:*",
  "http://127.0.0.1:*",
  "ws://localhost:*",
  "ws://127.0.0.1:*",
] as const;

const openWildcards = new Set(["*", "https:", "http:", "ws:", "wss:"]);

export type CspTokenList = readonly string[];

export interface ContentSecurityPolicy {
  readonly "base-uri": CspTokenList;
  readonly "default-src": CspTokenList;
  readonly "script-src": CspTokenList;
  readonly "script-src-attr": CspTokenList;
  readonly "style-src": CspTokenList;
  readonly "font-src": CspTokenList;
  readonly "img-src": CspTokenList;
  readonly "connect-src": CspTokenList;
  readonly "frame-src": CspTokenList;
  readonly "frame-ancestors": CspTokenList;
  readonly "form-action": CspTokenList;
  readonly "object-src": CspTokenList;
  readonly "worker-src": CspTokenList;
  readonly "upgrade-insecure-requests": true;
}

/** Exact origin of a Sentry DSN, for `connect-src`. Scheme-wide sources are rejected. */
export function sentryConnectOrigin(
  dsn: string | undefined,
): string | undefined {
  if (!dsn) return undefined;
  try {
    const url = new URL(dsn);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    if (!url.host) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export function contentSecurityPolicy(
  dev: boolean,
  connectOrigin?: string,
): ContentSecurityPolicy {
  const scriptSrc = ["'self'", "'nonce-{{nonce}}'"];
  const styleSrc = ["'self'", "'unsafe-inline'", googleFontStyleHost];
  const connectSrc = ["'self'"];
  if (connectOrigin) connectSrc.push(connectOrigin);
  const frameSrc = ["'self'"];
  if (dev) {
    scriptSrc.push("'unsafe-eval'", "'unsafe-inline'");
    connectSrc.push(
      "ws:",
      "wss:",
      "http://localhost:*",
      "http://127.0.0.1:*",
      "ws://localhost:*",
      "ws://127.0.0.1:*",
    );
    frameSrc.push("http://localhost:*", "http://127.0.0.1:*");
  }
  return {
    "base-uri": ["'none'"],
    "default-src": ["'self'"],
    "script-src": scriptSrc,
    "script-src-attr": ["'none'"],
    "style-src": styleSrc,
    "font-src": ["'self'", googleFontFileHost, "data:"],
    "img-src": ["'self'", "data:", "blob:"],
    "connect-src": connectSrc,
    "frame-src": frameSrc,
    "frame-ancestors": ["'self'"],
    "form-action": ["'self'"],
    "object-src": ["'none'"],
    "worker-src": ["'self'", "blob:"],
    "upgrade-insecure-requests": true,
  };
}

export function assertClosedCsp(
  policy: ContentSecurityPolicy,
  dev: boolean,
): void {
  const allowedDev = new Set<string>(dev ? devOnlyCspTokens : []);
  for (const [directive, value] of Object.entries(policy)) {
    if (value === true) continue;
    for (const token of value) {
      if (openWildcards.has(token) && !allowedDev.has(token)) {
        throw new Error(`CSP ${directive} contains an open source (${token}).`);
      }
      if (token.includes("*") && !allowedDev.has(token)) {
        throw new Error(
          `CSP ${directive} contains a wildcard source (${token}).`,
        );
      }
    }
  }
}

export interface SecurityModuleOptions {
  readonly enabled: boolean;
  readonly strict: false;
  readonly csrf: false;
  readonly basicAuth: false;
  readonly headers: {
    readonly contentSecurityPolicy: ContentSecurityPolicy;
  };
}

/**
 * `enabled: false` is the nuxt-security short-circuit (its setup returns
 * before headers and middleware are registered). `supernuxt.security: false`
 * omits the module entirely; see `resolveModulePlan`.
 */
export function securityModuleOptions(
  dev: boolean,
  enabled: boolean,
  connectOrigin?: string,
): SecurityModuleOptions {
  const headers = {
    contentSecurityPolicy: contentSecurityPolicy(dev, connectOrigin),
  };
  assertClosedCsp(headers.contentSecurityPolicy, dev);
  return {
    enabled,
    strict: false,
    csrf: false,
    basicAuth: false,
    headers,
  };
}
