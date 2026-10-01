// Two languages: Indonesian at the root (/work), English under /en (/en/work).
export type Lang = 'id' | 'en';

type AstroLike = { currentLocale?: string };

export const langOf = (astro: AstroLike): Lang => (astro.currentLocale === 'en' ? 'en' : 'id');

/** Picks the copy for the page's language: t('Kontak', 'Contact'). */
export const useT = (astro: AstroLike) => {
	const en = langOf(astro) === 'en';
	return (id: string, enText: string) => (en ? enText : id);
};

/** An Indonesian path ('/work', '/#hero') in the given language. */
export const localePath = (path: string, lang: Lang) =>
	lang === 'id' ? path : path === '/' ? '/en' : path.startsWith('/#') ? `/en${path.slice(1)}` : `/en${path}`;

/** The Indonesian path of any page path: '/en/work' → '/work'. */
export const basePath = (pathname: string) => pathname.replace(/^\/en(?=\/|$)/, '') || '/';
