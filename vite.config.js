import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
//https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        server: {
            port: env.PORT,
        },
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './src'),
            },
        },
    };
});
