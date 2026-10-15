export interface ScaffoldOptions {
  /** Target directory for the new app. */
  dir: string;
  /** Dependency spec written for `supernuxt` (default `^<version>`). */
  framework?: string;
  /** Write into a non-empty directory. */
  force?: boolean;
}

export interface ScaffoldResult {
  target: string;
  files: string[];
}

export declare function scaffold(
  options: ScaffoldOptions,
): Promise<ScaffoldResult>;
