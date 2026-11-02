import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { SANITY_DATASET, SANITY_PROJECT_ID } from './src/consts';
import { schemaTypes } from './studio/schemaTypes';

const SINGLETON = 'siteSettings';

export default defineConfig({
	name: 'srirona',
	title: 'Studio SriRona',
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET,
	plugins: [
		structureTool({
			// "Pengaturan Situs" opens its one document directly instead of a list.
			structure: (S) =>
				S.list()
					.title('Konten')
					.items([
						...S.documentTypeListItems().filter((item) => item.getId() !== SINGLETON),
						S.divider(),
						S.listItem().title('Pengaturan Situs').id(SINGLETON).child(S.document().schemaType(SINGLETON).documentId(SINGLETON)),
					]),
		}),
	],
	schema: {
		types: schemaTypes,
		templates: (templates) => templates.filter(({ schemaType }) => schemaType !== SINGLETON),
	},
	document: {
		actions: (actions, { schemaType }) =>
			schemaType === SINGLETON ? actions.filter(({ action }) => action && !['unpublish', 'delete', 'duplicate'].includes(action)) : actions,
	},
});
