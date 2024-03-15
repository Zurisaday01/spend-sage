import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const root = resolve(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), nodePolyfills()],

	resolve: {
		alias: {
			'@/components': resolve(root, 'components'),
			'@/features': resolve(root, 'features'),
			'@/ui': resolve(root, 'ui'),
			'@/utils': resolve(root, 'utils'),
			'@/services': resolve(root, 'services'),
			'@/pages': resolve(root, 'pages'),
			util: 'rollup-plugin-node-polyfills/polyfills/util',
		},
	},
});
