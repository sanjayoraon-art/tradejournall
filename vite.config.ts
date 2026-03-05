import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // Point directly to the ESM build of klinecharts to avoid Rollup resolution issues
            'klinecharts': path.resolve('./node_modules/klinecharts/dist/index.esm.js'),
        },
    },
    optimizeDeps: {
        include: ['klinecharts'],
    },
    build: {
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
                    icons: ['lucide-react'],
                    chart: ['klinecharts'],
                }
            }
        }
    },
    esbuild: {
        drop: ['console', 'debugger'],
    }
})
