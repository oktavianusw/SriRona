import raw from './works.json';

const images = import.meta.glob<{ default: ImageMetadata }>('../assets/framer/*.{png,jpg,jpeg,webp}', { eager: true });

const decode = (text: string) =>
	text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const image = (file: string) => {
	const found = images[`../assets/framer/${file}`];
	if (!found) throw new Error(`Missing image: ${file}`);
	return found.default;
};

export interface Work {
	slug: string;
	title: string;
	/** May contain <strong>/<em>. */
	summary?: string;
	summaryText?: string;
	author: string;
	date: string;
	livePreview?: string;
	cover: ImageMetadata;
	/** Overview copy: the first block is the section heading. */
	blocks: { heading: boolean; html: string }[];
	gallery: ImageMetadata[];
}

export const works: Work[] = raw.map((w) => ({
	slug: w.slug,
	title: w.title.trim(),
	summary: w.summary ?? undefined,
	summaryText: w.summary && decode(w.summary.replace(/<[^>]+>/g, '')),
	author: w.author,
	date: w.date,
	livePreview: w.livePreview ?? undefined,
	cover: image(w.cover),
	blocks: w.detailBlocks.map((b) => ({ heading: b.style === 'jzbuj3', html: b.html })),
	gallery: w.gallery.map(image),
}));

/** "Explore more": the first two works other than this one. */
export const moreWorks = (slug: string) => works.filter((w) => w.slug !== slug).slice(0, 2);
