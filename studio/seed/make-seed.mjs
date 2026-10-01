// Builds studio/seed/works.ndjson from works.json (exported from the Framer site).
// Run:    pnpm seed
// Import: pnpm sanity dataset import studio/seed/works.ndjson production --replace
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decode, key, toBlock } from './blocks.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const images = resolve(here, '../../src/assets/framer');
const works = JSON.parse(readFileSync(resolve(here, 'works.json'), 'utf8'));

const months = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
const isoDate = (text) => {
	const [, mon, day, year] = text.match(/^(\w{3}) (\d{1,2}), (\d{4})$/) ?? [];
	if (!mon) throw new Error(`Unrecognised date: ${text}`);
	return `${year}-${String(months[mon]).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};
const asset = (file) => ({ _type: 'image', _sanityAsset: `image@file://${resolve(images, file)}` });

const docs = works.map((w, index) => ({
	_id: `work-${w.slug}`,
	_type: 'work',
	title: w.title.trim(),
	slug: { _type: 'slug', current: w.slug },
	order: index + 1,
	cover: asset(w.cover),
	...(w.summary ? { summary: decode(w.summary) } : {}),
	author: w.author,
	date: isoDate(w.date),
	...(w.livePreview ? { livePreview: w.livePreview } : {}),
	// The first block is the template's fixed "Overview" heading, not content.
	body: w.detailBlocks.slice(1).map((b) => toBlock(b.html)),
	gallery: w.gallery.map((file) => ({ _key: key(), ...asset(file) })),
}));

writeFileSync(resolve(here, 'works.ndjson'), docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`Wrote ${docs.length} works → studio/seed/works.ndjson`);
