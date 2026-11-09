import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

const layerRule = (forbidden, layer) => ({
  files: [`src/${layer}/**`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: forbidden.map((l) => ({
          group: [`@/${l}/*`],
          message: `Слой ${layer} не может импортировать из ${l}`,
        })),
      },
    ],
  },
})

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  layerRule(['app', 'widgets', 'features', 'entities'], 'shared'),
  layerRule(['app', 'widgets', 'features'], 'entities'),
  layerRule(['app', 'widgets'], 'features'),
  layerRule(['app'], 'widgets'),
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'public/mockServiceWorker.js',
  ]),
])

export default eslintConfig
