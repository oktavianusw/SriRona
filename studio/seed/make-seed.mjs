// Builds studio/seed/works.ndjson from works.json (exported from the Framer site).
// Run:    pnpm seed
// Import: pnpm sanity dataset import studio/seed/works.ndjson production --replace
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const images = resolve(here, '../../src/assets/framer');
const works = JSON.parse(readFileSync(resolve(here, 'works.json'), 'utf8'));

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const months = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
const isoDate = (text) => {
	const [, mon, day, year] = text.match(/^(\w{3}) (\d{1,2}), (\d{4})$/) ?? [];
	if (!mon) throw new Error(`Unrecognised date: ${text}`);
	return `${year}-${String(months[mon]).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};
const asset = (file) => ({ _type: 'image', _sanityAsset: `image@file://${resolve(images, file)}` });

// <strong>/<em>/<a href> HTML → one Portable Text block.
let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36)}`;
const toBlock = (html) => {
	const children = [];
	const markDefs = [];
	const active = [];
	for (const token of html.split(/(<\/?(?:strong|em|a)(?: [^>]*)?>|<br ?\/?>)/)) {
		if (!token) continue;
		const open = token.match(/^<(strong|em|a)(?: href="([^"]*)")?>$/);
		if (open) {
			if (open[1] === 'a') {
				const id = key();
				markDefs.push({ _key: id, _type: 'link', href: open[2] });
				active.push(id);
			} else active.push(open[1]);
		} else if (/^<\/(strong|em|a)>$/.test(token)) active.pop();
		else if (/^<br/.test(token)) children.push({ _type: 'span', _key: key(), text: '\n', marks: [...active] });
		else children.push({ _type: 'span', _key: key(), text: decode(token), marks: [...active] });
	}
	return { _type: 'block', _key: key(), style: 'normal', markDefs, children };
};

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
