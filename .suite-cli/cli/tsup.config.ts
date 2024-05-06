import { defineConfig } from "tsup";

export default defineConfig({
    entry: ['./cli.ts'],
    format: ['esm', 'cjs'], // Support both ESM and CJS format.
    dts: true,
    minify: true,
    shims: true, // Inject CJS and ESM shims if needed.
    clean: true,
})