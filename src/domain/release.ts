export interface Release {
  readonly version: string;
  readonly nuxt: string;
}

const exactVersion = /^\d+\.\d+\.\d+$/;

export function readRelease(packageJsonText: string): Release {
  const pkg = JSON.parse(packageJsonText) as {
    version?: string;
    dependencies?: { nuxt?: string };
  };
  if (!pkg.version || !exactVersion.test(pkg.version)) {
    throw new Error("Root package.json version must be an exact semver.");
  }
  if (!pkg.dependencies?.nuxt || !exactVersion.test(pkg.dependencies.nuxt)) {
    throw new Error("dependencies.nuxt must be an exact version.");
  }
  return { version: pkg.version, nuxt: pkg.dependencies.nuxt };
}

export function readScaffolderRelease(packageJsonText: string): Release {
  const pkg = JSON.parse(packageJsonText) as {
    version?: string;
    supernuxt?: { nuxt?: string };
  };
  if (!pkg.version || !exactVersion.test(pkg.version)) {
    throw new Error("create-supernuxt version must be an exact semver.");
  }
  if (!pkg.supernuxt?.nuxt || !exactVersion.test(pkg.supernuxt.nuxt)) {
    throw new Error(
      "create-supernuxt supernuxt.nuxt must be an exact version.",
    );
  }
  return { version: pkg.version, nuxt: pkg.supernuxt.nuxt };
}

export function frameworkRange(version: string): `^${string}` {
  return `^${version}`;
}

export function libraryVersion(markdown: string): string | null {
  const match = markdown.match(/^ {2}library_version:\s*(\S+)\s*$/m);
  return match?.[1] ?? null;
}
