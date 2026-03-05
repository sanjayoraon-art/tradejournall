import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        include: ['klinecharts'],
    },
    build: {
        commonjsOptions: {
            include: [/klinecharts/, /node_modules/],
        },
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
