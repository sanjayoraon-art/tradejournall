import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        exclude: ['klinecharts'],
    },
    build: {
        minify: 'esbuild',
        rollupOptions: {
            // Mark klinecharts as external — loaded via CDN in index.html
            external: ['klinecharts'],
            output: {
                globals: {
                    klinecharts: 'klinecharts',
                },
                manualChunks: {
                    vendor: ['react', 'react-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
                    icons: ['lucide-react'],
                }
            }
        }
    },
    esbuild: {
        drop: ['console', 'debugger'],
    }
})
