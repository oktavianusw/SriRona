// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Change to the custom domain once it is decided (drives canonical URLs and og:image).
	site: 'https://srirona.vercel.app',
	devToolbar: { enabled: false },
	// Indonesian stays at the root; English pages live under /en and reuse the same page files (see src/pages/en).
	i18n: { defaultLocale: 'id', locales: ['id', 'en'], routing: { prefixDefaultLocale: false } },
	// Work images live in Sanity; Astro downloads and optimises them at build time.
	image: { domains: ['cdn.sanity.io'] },
});
