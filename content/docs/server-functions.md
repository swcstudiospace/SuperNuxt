---
title: "Server functions"
description: "How useServerFn calls a named Nitro handler."
section: Integrations
order: 7
---

`useServerFn` is SuperNuxt's stand-in for a TanStack Start server function. The client calls a named function. Nitro validates the body and runs the handler.

## Call one

```ts
const briefing = useServerFn<Briefing, { missionId: string }>("briefing");
const result = await briefing.call({ missionId: "kite-4" });
```

The request goes to `/api/__supernuxt/fn/briefing`. Names are lowercase letters, numbers, and hyphens. `assertServerFnName` rejects anything else.

## Add one

Register the function in `server/fns/registry.ts` with a Zod input schema and a handler. The route `server/api/__supernuxt/fn/[name].post.ts` looks the name up, parses the body, and returns the handler result.

Keep handlers free of browser APIs. They run on the server during SSR and when the client calls them later.
