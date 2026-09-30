// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// TODO: set `site` to the production URL once the domain is decided (enables canonical + og:image).
	devToolbar: { enabled: false },
});
