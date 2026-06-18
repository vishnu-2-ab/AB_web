import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'products.html'),
        careers: resolve(__dirname, 'careers.html'),
        vsmDetails: resolve(__dirname, 'vsm-details.html'),
        nibpDetails: resolve(__dirname, 'nibp-details.html'),
        spo2Details: resolve(__dirname, 'spo2-details.html'),
      },
    },
  },
});
