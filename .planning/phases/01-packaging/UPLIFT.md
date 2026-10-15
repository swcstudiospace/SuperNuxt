<uplift phase="01-packaging" pass="2">
<ORIGINAL>Please check our SuperNuxt framework and advise how we can make this State-of-the-Art, Best-in-Class, Production-Grade and Enterprise-Ready using the best packages and libraries for Typescript Nuxt? We want to use SuperNuxt to build a marketing website and application behind it so we're checking if there's more we can add into it before we actually create the npm and deno packages</ORIGINAL>
<phase_goal>Make SuperNuxt publishable to npm and JSR with correct boundaries, built artefacts, types, and a staged, provenance-backed release pipeline. No publish without Ove.</phase_goal>
<evidence>
 npm pack --dry-run: supernuxt-0.2.0.tgz, 80 files, 165.3 kB, ships src/*.test.ts, raw .ts exports, no dist/types.
 jsr publish --dry-run (deno 2.6.7): FAIL — `Import "@nuxt/kit" not a dependency and not in import map` (modules/supernuxt/index.ts:6). Deprecated: @tanstack/config@0.22.2 (unsupported), glob@10.5.0, tsconfck@3.1.6.
</evidence>
<got>
 <node id="N1" name="Package boundaries" plan="01-01">
  <cot>1 inventory exports: ".", "./nuxt", "./core", "./cli" all in one tarball</cot>
  <cot>2 classify files: layer (app/server/shared/content), module, core (src/domain), CLI</cot>
  <cot>3 define four workspaces and names</cot>
  <cot>4 git mv preserving history</cot>
  <cot>5 per-package files allow-lists excluding *.test.ts</cot>
  <cot>6 verify layer playground boots via extends</cot>
 </node>
 <node id="N2" name="Dependency weight" plan="01-01">
  <cot>1 list 25 @tanstack runtime deps</cot>
  <cot>2 keep vue-query/vue-store core as deps</cot>
  <cot>3 move rest to optional peerDependencies + peerDependenciesMeta</cot>
  <cot>4 module guards auto-imports with hasNuxtModule/tryResolve</cot>
  <cot>5 measure tarball and install size before/after</cot>
 </node>
 <node id="N3" name="Module build" plan="01-02">
  <cot>1 add @nuxt/module-builder</cot>
  <cot>2 move module to src/module.ts + src/runtime</cot>
  <cot>3 prepack emits dist/module.mjs, types.d.mts</cot>
  <cot>4 exports types-first</cot>
  <cot>5 playground consumes built output</cot>
 </node>
 <node id="N4" name="Core library + types" plan="01-02">
  <cot>1 enable dts in rstack define.lib</cot>
  <cot>2 explicit return types on exported API</cot>
  <cot>3 exports map import/types</cot>
  <cot>4 publint 0 errors</cot>
  <cot>5 attw passes node16/bundler</cot>
 </node>
 <node id="N5" name="JSR/Deno" plan="01-03">
  <cot>1 scope JSR to @supernuxt/core only</cot>
  <cot>2 imports map with npm:/jsr: specifiers (fix @nuxt/kit error)</cot>
  <cot>3 resolve slow-types</cot>
  <cot>4 deno check + deno publish --dry-run green</cot>
  <cot>5 document Deno usage of the layer via npm:supernuxt</cot>
 </node>
 <node id="N6" name="Versioning" plan="01-04">
  <cot>1 init @changesets/cli</cot>
  <cot>2 script syncs version to jsr.json/deno.json</cot>
  <cot>3 replace deprecated @tanstack/config publish</cot>
  <cot>4 CHANGELOG generation per package</cot>
 </node>
 <node id="N7" name="CI + release" plan="01-04">
  <cot>1 matrix Node ^22.22.3 / 24</cot>
  <cot>2 typecheck + build + pack/publish dry-runs</cot>
  <cot>3 release.yml with id-token: write, npm --provenance, jsr OIDC</cot>
  <cot>4 gate release on changeset PR merge</cot>
  <cot>5 stop: no real publish until Ove approves</cot>
 </node>
 <edges>N1→N2→N3; N1→N4; N4→N5; N3,N5→N6→N7</edges>
</got>
<tracking>
 task: SPE-13091 https://linear.app/swcstudio/issue/SPE-13091 | notion https://app.notion.com/p/3fabc1a0c7ae81e2a8c3c8f1123986f0
 01-01 SPE-13092 · 01-02 SPE-13093 · 01-03 SPE-13094 · 01-04 SPE-13095 (see TRACKING.md)
</tracking>
</uplift>
