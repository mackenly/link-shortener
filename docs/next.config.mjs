import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nextra from 'nextra';

const docsDir = path.dirname(fileURLToPath(import.meta.url));

const withNextra = nextra({
	theme: 'nextra-theme-docs',
	themeConfig: './theme.config.jsx',
});

export default withNextra({
	output: 'export',
	images: {
		unoptimized: true,
	},
	// Keep traces inside docs/ even if a sibling lockfile exists at the repo root.
	outputFileTracingRoot: docsDir,
});
