// Fills the English fields (summaryEn, bodyEn) of the existing works from works.en.json.
// Only empty fields are filled, so translations already edited in the Studio are never overwritten.
// Run: pnpm sanity exec studio/seed/patch-en.mjs --with-user-token
import { readFileSync } from 'node:fs';
import { getCliClient } from 'sanity/cli';
import { toBlock } from './blocks.mjs';

const client = getCliClient({ apiVersion: '2025-01-01' });
const works = JSON.parse(readFileSync(new URL('./works.en.json', import.meta.url), 'utf8'));

const tx = client.transaction();
for (const [id, { summary, body }] of Object.entries(works)) {
	tx.patch(id, (p) => p.setIfMissing({ ...(summary ? { summaryEn: summary } : {}), bodyEn: body.map(toBlock) }));
}
const result = await tx.commit();
console.log(`Patched ${result.results.length} works`);
