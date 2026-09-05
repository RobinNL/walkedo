import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const projectRoot = dirname(fileURLToPath(import.meta.url));

/**
 * Flat config, replacing .eslintrc.json.
 *
 * `next lint` no longer exists in Next 16 -- there is no next-lint.js in
 * next/dist/cli at all -- so linting is now a plain `eslint` invocation and the
 * config has to be one ESLint itself understands. eslint-config-next 16 ships
 * flat config arrays from its subpath exports, so the old
 * `{ "extends": "next/core-web-vitals" }` becomes a spread of those.
 *
 * ---------------------------------------------------------------------------
 * PINNED TO ESLINT 9. Do not take ESLint 10 here.
 *
 * eslint-config-next@16.3.4 declares `"eslint": ">=9.0.0"`, which reads as
 * though 10 is fine. It is not. The version of eslint-plugin-react vendored
 * inside @next/eslint-plugin-next still calls `context.getFilename()`, which
 * ESLint 10 removed -- so linting dies with a TypeError on the first file that
 * trips a React rule rather than failing cleanly at config load. The peer range
 * is simply wrong.
 *
 * Revisit when eslint-config-next ships a react plugin that uses
 * `context.filename`.
 * ---------------------------------------------------------------------------
 */
const eslintConfig = [
    {
        ignores: [
            '.next/**',
            'node_modules/**',
            'next-env.d.ts',
            'public/**',
        ],
    },

    ...nextCoreWebVitals,
    ...nextTypeScript,

    {
        settings: {
            next: { rootDir: projectRoot },
        },
    },
];

export default eslintConfig;
