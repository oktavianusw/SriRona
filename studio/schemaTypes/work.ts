import { defineArrayMember, defineField, defineType } from 'sanity';

// Paragraphs with bold, italic and links; shared by the Indonesian and English body.
const paragraphs = [
	defineArrayMember({
		type: 'block',
		styles: [{ title: 'Paragraf', value: 'normal' }],
		lists: [],
		marks: {
			decorators: [
				{ title: 'Tebal', value: 'strong' },
				{ title: 'Miring', value: 'em' },
			],
			annotations: [
				{
					name: 'link',
					type: 'object',
					title: 'Link',
					fields: [defineField({ name: 'href', type: 'url', title: 'URL', validation: (rule) => rule.uri({ scheme: ['http', 'https', 'mailto'] }) })],
				},
			],
		},
	}),
];

export const work = defineType({
	name: 'work',
	title: 'Karya',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Judul',
			type: 'string',
			validation: (rule) => rule.required().error('Judul wajib diisi'),
		}),
		defineField({
			name: 'slug',
			title: 'Alamat halaman (slug)',
			description: 'Bagian akhir URL, mis. "laboratory-automation" → /work/laboratory-automation. Klik "Generate" untuk membuatnya dari judul. Jangan diubah setelah tayang, nanti link lama rusak.',
			type: 'slug',
			options: { source: 'title', maxLength: 60 },
			validation: (rule) => rule.required().error('Slug wajib diisi'),
		}),
		defineField({
			name: 'order',
			title: 'Urutan',
			description: 'Angka kecil tampil lebih dulu di halaman Karya (1, 2, 3, …).',
			type: 'number',
			validation: (rule) => rule.required().integer().min(1),
		}),
		defineField({
			name: 'cover',
			title: 'Gambar utama',
			description: 'Dipakai di kartu Karya dan di bagian atas halaman detail. Disarankan lebar minimal 2000px, rasio sekitar 16:10.',
			type: 'image',
			fields: [defineField({ name: 'alt', title: 'Deskripsi gambar (opsional, untuk pembaca layar)', type: 'string' })],
			validation: (rule) => rule.required().error('Gambar utama wajib diisi'),
		}),
		defineField({
			name: 'summary',
			title: 'Ringkasan',
			description: 'Satu atau dua kalimat di bawah judul. Boleh dikosongkan.',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'summaryEn',
			title: 'Ringkasan (English)',
			description: 'Opsional. Tampil di versi bahasa Inggris (/en). Kosong = pakai ringkasan bahasa Indonesia.',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'author',
			title: 'Penulis / tim',
			description: 'Nama yang tampil di label. Kalau lebih dari satu, pisahkan dengan " · ".',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'date',
			title: 'Tanggal',
			type: 'date',
			options: { dateFormat: 'D MMM YYYY' },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'livePreview',
			title: 'Link Live Preview',
			description: 'Kalau diisi, tombol "Live Preview" muncul di halaman detail. Kosongkan untuk menyembunyikan tombolnya.',
			type: 'url',
			validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
		}),
		defineField({
			name: 'body',
			title: 'Isi (Overview)',
			description: 'Paragraf di bawah judul "Overview". Bisa tebal, miring, dan link.',
			type: 'array',
			of: paragraphs,
		}),
		defineField({
			name: 'bodyEn',
			title: 'Isi (Overview, English)',
			description: 'Opsional. Tampil di versi bahasa Inggris (/en). Kosong = pakai isi bahasa Indonesia.',
			type: 'array',
			of: paragraphs,
		}),
		defineField({
			name: 'gallery',
			title: 'Galeri gambar',
			description: 'Gambar-gambar di bawah teks, tampil berurutan dari atas ke bawah. Seret untuk mengubah urutan.',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'image',
					fields: [defineField({ name: 'alt', title: 'Deskripsi gambar (opsional)', type: 'string' })],
				}),
			],
		}),
	],
	orderings: [{ title: 'Urutan tampil', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
	preview: {
		select: { title: 'title', subtitle: 'author', media: 'cover', order: 'order' },
		prepare: ({ title, subtitle, media, order }) => ({ title, subtitle: `${order ?? '?'} · ${subtitle ?? ''}`, media }),
	},
});
