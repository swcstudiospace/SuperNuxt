import { readFileSync, writeFileSync } from "node:fs";

const version = JSON.parse(readFileSync("package.json", "utf8")).version;

function bumpJson(path) {
  const source = readFileSync(path, "utf8");
  const next = source.replace(/("version"\s*:\s*")[^"]+(")/, `$1${version}$2`);
  if (next === source) {
    throw new Error(`No version field in ${path}`);
  }
  writeFileSync(path, next);
}

bumpJson("packages/create-supernuxt/package.json");
bumpJson("jsr.json");
bumpJson("packages/create-supernuxt/jsr.json");
bumpJson("deno.json");

const skillPath = "skills/use-supernuxt/SKILL.md";
const skill = readFileSync(skillPath, "utf8").replace(
  /library_version: .*/,
  `library_version: ${version}`,
);
writeFileSync(skillPath, skill);
