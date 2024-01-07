import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
// import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis',
			},
			// Enable esbuild polyfill plugins
			plugins: [
				NodeGlobalsPolyfillPlugin({
					buffer: true,
					process: true,
				}),
				NodeModulesPolyfillPlugin(),
			],
		},
	},
	build: {
		sourcemap: true,
		// rollupOptions: {
		// 	plugins: [
		// 		// Enable rollup polyfills plugin
		// 		// used during production bundling
		// 		rollupNodePolyFill(),
		// 	],
		// },
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			util: 'rollup-plugin-node-polyfills/polyfills/util',
			sys: 'util',
		},
	},
});
