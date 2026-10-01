export const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

// <strong>/<em>/<a href> HTML → one Portable Text block.
let keyCounter = 0;
export const key = () => `k${(keyCounter++).toString(36)}`;
export const toBlock = (html) => {
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
