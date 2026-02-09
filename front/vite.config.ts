import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), devtoolsJson()],
	resolve: {
		alias: {
			'lrc-kit': 'lrc-kit/src/lrc-kit.ts',
		},
	},
});
