const tools = [
  ["Rspack", "Bundler under every Rstack command"],
  ["Rsbuild", "Built this page"],
  ["Rslib", "Builds the SuperNuxt core"],
  ["Rspress", "Docs site"],
  ["Rsdoctor", "Build analysis"],
  ["Rstest", "Tests"],
  ["Rslint", "Lint"],
];

const root = document.createElement("main");
root.style.cssText =
  "font-family: Georgia, serif; padding: 2rem; color: #1c1b16; background: #f4efe4; min-height: 100vh;";
root.innerHTML = `
  <p style="letter-spacing: 0.14em; text-transform: uppercase; font-family: ui-monospace, monospace; font-size: 12px;">Rsbuild console</p>
  <h1 style="font-size: 2.4rem; margin: 0.2rem 0 0.6rem;">Bundled outside Nuxt</h1>
  <p>This document is the Rsbuild output embedded in the SuperNuxt studio. Nuxt serves it as a static file.</p>
  <ul>${tools.map(([name, note]) => `<li><strong>${name}.</strong> ${note}</li>`).join("")}</ul>
`;
document.body.replaceChildren(root);
