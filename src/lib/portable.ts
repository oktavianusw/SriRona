interface Span {
	text: string;
	marks?: string[];
}
interface Block {
	_type: string;
	markDefs?: { _key: string; _type: string; href?: string }[];
	children?: Span[];
}

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const safeHref = (href = '') => (/^(https?:|mailto:)/i.test(href) ? escape(href) : '#');

/** Portable Text paragraphs → one HTML string per paragraph (strong, em, links only). */
export function blocksToHtml(blocks?: Block[] | null): string[] {
	// GROQ returns null (not undefined) for an empty field.
	return (blocks ?? [])
		.filter((block) => block._type === 'block' && block.children?.length)
		.map((block) =>
			block
				.children!.map((span) => {
					let html = escape(span.text).replace(/\n/g, '<br>');
					for (const mark of span.marks ?? []) {
						if (mark === 'strong') html = `<strong>${html}</strong>`;
						else if (mark === 'em') html = `<em>${html}</em>`;
						else {
							const def = block.markDefs?.find((d) => d._key === mark);
							if (def?._type === 'link') html = `<a href="${safeHref(def.href)}">${html}</a>`;
						}
					}
					return html;
				})
				.join(''),
		);
}
