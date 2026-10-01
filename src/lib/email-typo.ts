// Catches common typos in email domains ("gmail.con", "gmial.com") so the studio can still reply.
// ponytail: fixed list of popular providers; add a domain here if visitors keep getting false hints.
const KNOWN = ['gmail.com', 'yahoo.com', 'yahoo.co.id', 'hotmail.com', 'outlook.com', 'icloud.com', 'live.com', 'ymail.com', 'mail.com', 'email.com'];

// Edit distance where swapping two neighbouring letters counts as one edit.
function distance(a: string, b: string): number {
	const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
	for (let j = 1; j <= b.length; j++) d[0][j] = j;
	for (let i = 1; i <= a.length; i++)
		for (let j = 1; j <= b.length; j++) {
			d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
			if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
		}
	return d[a.length][b.length];
}

/** The corrected address when the domain looks like a typo, otherwise undefined. */
export function suggestEmail(email: string): string | undefined {
	const at = email.lastIndexOf('@');
	if (at < 1) return;
	const domain = email.slice(at + 1).toLowerCase();
	if (!domain || KNOWN.includes(domain)) return;
	const fixed = KNOWN.find((known) => distance(domain, known) === 1) ?? domain.replace(/\.(con|cmo|cpm|vom|xom|comm)$/, '.com');
	return fixed === domain ? undefined : email.slice(0, at + 1) + fixed;
}
