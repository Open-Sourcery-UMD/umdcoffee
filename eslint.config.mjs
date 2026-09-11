import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,mjs,ts,tsx}'],

    extends: [
      compat.extends('eslint:recommended'),
      tseslint.configs.recommended,
      compat.extends('plugin:prettier/recommended'),
    ],

    plugins: {
      'react-hooks': reactHooks,
    },

    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
]);
