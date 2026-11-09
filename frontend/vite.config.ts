import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom)[\\/]/,
              priority: 30,
            },
            {
              name: 'motion-vendor',
              test: /node_modules[\\/]framer-motion[\\/]/,
              priority: 25,
            },
            {
              name: 'supabase-vendor',
              test: /node_modules[\\/]@supabase[\\/]/,
              priority: 20,
            },
            {
              name: 'ui-vendor',
              test: /node_modules[\\/](@radix-ui|lucide-react|class-variance-authority|tailwind-merge)[\\/]/,
              priority: 15,
            },
            {
              name: 'vendor',
              test: /node_modules[\\/]/,
              priority: 10,
              maxSize: 350000,
            },
          ],
        },
      },
    },
  },
})
