import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    minify: true,
    sourcemap: false,
    treeshake: false,
  },
  {
    entry: { 'index.umd': 'src/index.ts' },
    format: ['iife'],
    globalName: 'NebbulerElements',
    clean: false,
    minify: true,
    sourcemap: false,
    outExtension: () => ({ js: '.js' }),
  },
])
