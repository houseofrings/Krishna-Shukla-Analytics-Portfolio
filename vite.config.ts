import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Find the actual casing of the src folder on the filesystem
  const rootDir = process.cwd();
  let srcFolder = 'src';
  if (fs.existsSync(path.resolve(rootDir, 'Src'))) {
    srcFolder = 'Src';
  } else if (fs.existsSync(path.resolve(rootDir, 'SRC'))) {
    srcFolder = 'SRC';
  }

  return {
    plugins: [
      {
        name: 'case-insensitive-src-resolver',
        resolveId(source, importer) {
          if (srcFolder !== 'src') {
            if (source.startsWith('./src/') || source.startsWith('/src/')) {
              const corrected = source.replace('src', srcFolder);
              return this.resolve(corrected, importer, { skipSelf: true });
            }
          }
          return null;
        }
      },
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
