import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
                    icons: ['lucide-react']
                }
            }
        }
    },
    esbuild: {
        drop: ['console', 'debugger'],
    }
})
