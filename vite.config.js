import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));

/**
 * Copy manifest.json into the build output.
 *
 * Icons are NOT copied here: they live in `public/icons`, and Vite already
 * mirrors everything under `public/` into the output directory. The previous
 * config copied them a second time by hand.
 */
function copyExtensionManifest() {
  return {
    name: 'copy-extension-manifest',
    closeBundle() {
      copyFileSync(resolve(rootDir, 'manifest.json'), resolve(rootDir, 'dist', 'manifest.json'));
    },
  };
}

export default defineConfig({
  plugins: [react(), copyExtensionManifest()],
  build: {
    outDir: 'dist',
    // Chrome cannot evaluate source maps for an unpacked extension page and
    // shipping them would leak the full source into the published package.
    sourcemap: false,
    rollupOptions: {
      input: {
        popup: resolve(rootDir, 'popup.html'),
        laboratory: resolve(rootDir, 'index.html'),
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        // KaTeX is large and never changes between releases; splitting it out
        // keeps the app chunk small enough to re-download cheaply on update.
        manualChunks: {
          katex: ['katex'],
          react: ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
});
