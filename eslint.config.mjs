import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import react from 'eslint-plugin-react';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([{
  languageOptions: {
    globals: {
      ...globals.browser,
    },
    parser: babelParser,
    ecmaVersion: 12,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },

  extends: compat.extends('eslint:recommended', 'plugin:react/recommended'),

  plugins: {
    react,
  },

  rules: {
    'react/prop-types': 0,

    'no-unused-vars': ['error', {
      vars: 'all',
      args: 'after-used',
      argsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    }],
  },

  settings: {
    react: {
      version: 'detect',
    },
  },
}]);
