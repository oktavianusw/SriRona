import { createClient } from '@sanity/client';
import { SANITY_DATASET, SANITY_PROJECT_ID } from '../consts';
import type { Lang } from '../i18n';
import { blocksToHtml } from '../lib/portable';

export interface Img {
	src: string;
	width: number;
	height: number;
	alt: string;
}

export interface Work {
	slug: string;
	title: string;
	summary?: string;
	author: string;
	/** Display form, e.g. "Dec 1, 2019". */
	date: string;
	livePreview?: string;
	cover: Img;
	/** Overview paragraphs as HTML (strong, em, links). */
	paragraphs: string[];
	/** English versions from the CMS; empty when not translated yet. */
	summaryEn?: string;
	paragraphsEn: string[];
	gallery: Img[];
}

// useCdn is off so a build triggered by a publish never reads stale content.
const client = createClient({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET, apiVersion: '2025-01-01', useCdn: false });

const image = `{ "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt }`;
const query = `*[_type == "work" && defined(slug.current) && defined(cover.asset)] | order(order asc, _createdAt asc) {
	"slug": slug.current, title, summary, summaryEn, author, date, livePreview,
	"cover": cover${image}, body, bodyEn, "gallery": gallery[defined(asset)]${image}
}`;

const formatDate = (iso: string) =>
	new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const img = (raw: { src: string; width: number; height: number; alt?: string }): Img => ({ ...raw, alt: raw.alt ?? '' });

async function fetchWorks(): Promise<Work[]> {
	const rows = await client.fetch<any[]>(query);
	return rows.map((w) => ({
		slug: w.slug,
		title: w.title.trim(),
		summary: w.summary?.trim() || undefined,
		author: w.author,
		date: formatDate(w.date),
		livePreview: w.livePreview || undefined,
		cover: img(w.cover),
		paragraphs: blocksToHtml(w.body),
		summaryEn: w.summaryEn?.trim() || undefined,
		paragraphsEn: blocksToHtml(w.bodyEn),
		gallery: (w.gallery ?? []).map(img),
	}));
}

// One request per build; in dev every page load re-reads, so edits show up on refresh.
let cached: Promise<Work[]> | undefined;
export const getWorks = () => (import.meta.env.PROD ? (cached ??= fetchWorks()) : fetchWorks());

/** The work's text in the page language; English falls back to Indonesian until it is translated in the CMS. */
export const inLang = (work: Work, lang: Lang): Work =>
	lang === 'en'
		? { ...work, summary: work.summaryEn ?? work.summary, paragraphs: work.paragraphsEn.length ? work.paragraphsEn : work.paragraphs }
		: work;

/** "Explore more": the first two works other than this one. */
export const moreWorks = (works: Work[], slug: string) => works.filter((w) => w.slug !== slug).slice(0, 2);
