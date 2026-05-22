import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    minify: true,
    sourcemap: false,
    treeshake: true,
  },
  {
    entry: ['src/react/index.tsx'],
    format: ['esm', 'cjs'],
    dts: true,
    external: ['react'],
    outDir: 'dist/react',
    minify: true,
    sourcemap: false,
    treeshake: true,
  },
])
