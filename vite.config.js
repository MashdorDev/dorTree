import react from '@vitejs/plugin-react'
import { transformWithEsbuild } from 'vite'

export default {
    root: 'src/',
    publicDir: '../public/',
    base: './',
    plugins:
    [
        // React support
        react(),

        // .js file support as if it was JSX
        {
            name: 'load+transform-js-files-as-jsx',
            async transform(code, id)
            {
                if (!id.match(/src\/.*\.js$/))
                    return null

                return transformWithEsbuild(code, id, {
                    loader: 'jsx',
                    jsx: 'automatic',
                });
            },
        },
    ],
    server: {
        configureServer: (app) => {
          app.use((req, res, next) => {
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-Content-Type-Options', 'nosniff');
            next();
          });
        },
      },
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: true // Add sourcemap
    },
}