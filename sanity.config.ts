import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { SANITY_DATASET, SANITY_PROJECT_ID } from './src/consts';
import { schemaTypes } from './studio/schemaTypes';

export default defineConfig({
	name: 'srirona',
	title: 'Studio SriRona',
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET,
	plugins: [structureTool()],
	schema: { types: schemaTypes },
});
