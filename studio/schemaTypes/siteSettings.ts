import { defineField, defineType } from 'sanity';

// Single document (fixed id "siteSettings", see sanity.config.ts). Empty fields fall back to the values in src/consts.ts.
export const siteSettings = defineType({
	name: 'siteSettings',
	title: 'Pengaturan Situs',
	type: 'document',
	fields: [
		defineField({
			name: 'linkedin',
			title: 'Link LinkedIn',
			description: 'Tampil di footer semua halaman. Kosongkan untuk memakai link bawaan.',
			type: 'url',
			validation: (rule) => rule.uri({ scheme: ['https'] }),
		}),
		defineField({
			name: 'instagram',
			title: 'Link Instagram',
			description: 'Tampil di footer semua halaman. Kosongkan untuk memakai link bawaan.',
			type: 'url',
			validation: (rule) => rule.uri({ scheme: ['https'] }),
		}),
	],
	preview: { prepare: () => ({ title: 'Pengaturan Situs' }) },
});
