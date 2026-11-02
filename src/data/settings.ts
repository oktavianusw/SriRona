import { INSTAGRAM_URL, LINKEDIN_URL } from '../consts';
import { client } from './works';

export interface Settings {
	linkedin: string;
	instagram: string;
}

// Fields left empty in "Pengaturan Situs" (or no document yet) fall back to src/consts.ts.
async function fetchSettings(): Promise<Settings> {
	const s = await client.fetch<Partial<Settings> | null>(`*[_id == "siteSettings"][0]{ linkedin, instagram }`);
	return { linkedin: s?.linkedin || LINKEDIN_URL, instagram: s?.instagram || INSTAGRAM_URL };
}

// Same caching as getWorks: once per build, fresh on every page load in dev.
let cached: Promise<Settings> | undefined;
export const getSettings = () => (import.meta.env.PROD ? (cached ??= fetchSettings()) : fetchSettings());
