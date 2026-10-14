# Install

SuperNuxt needs Node.js 22.21 or newer.

```bash
npm install
npm run dev
```

The studio listens on port 47821.

Register the module in a Nuxt 4 config:

```ts
export default defineNuxtConfig({
  modules: ["supernuxt"],
});
```

In this repository the module is local:

```ts
export default defineNuxtConfig({
  modules: ["./modules/supernuxt"],
});
```
