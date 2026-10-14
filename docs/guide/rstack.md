# Rstack

Nuxt serves the studio with its own Vite builder. Rstack owns the rest of the repository:

| Command                | Tool                                    |
| ---------------------- | --------------------------------------- |
| `npm run rstack:build` | Rsbuild console, bundled by Rspack      |
| `npm run lib`          | Rslib build of `src/index.ts`           |
| `npm test`             | Rstest                                  |
| `npm run lint`         | Rslint                                  |
| `npm run format`       | Rstack formatter                        |
| `npm run docs:dev`     | Rspress on port 47823                   |
| `npm run doctor`       | Rsdoctor report for the Rsbuild console |

`rs dev` starts the Rsbuild console on port 47831. `npm run dev` starts the Nuxt studio.
