import eslintPluginAstro from 'eslint-plugin-astro'
import eslintPluginSvelte from 'eslint-plugin-svelte'

export default [
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginSvelte.configs.recommended,
  {
    ignores: ['dist/', '.astro/', 'node_modules/']
  }
]
