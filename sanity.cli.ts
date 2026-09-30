import { defineCliConfig } from 'sanity/cli';
import { SANITY_DATASET, SANITY_PROJECT_ID } from './src/consts';

export default defineCliConfig({
	api: { projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET },
	// Studio is hosted at https://srirona.sanity.studio (`pnpm studio:deploy`).
	studioHost: 'srirona',
});
