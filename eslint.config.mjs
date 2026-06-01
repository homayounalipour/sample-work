import {defineConfig, globalIgnores} from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.idea/**',
      '**/.vscode/**',
      '**/reports/**',
      '**/.yarn/**',
      '**/scripts/**',
      '**/dist/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cjs'],
    rules: {
      'no-unused-vars': 'off',
      'no-duplicate-imports': ['error', {includeExports: true}],
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': 'error',
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'off',
      'no-empty-pattern': 'error',
      '@next/next/no-img-element': 'off',
      '@eslint-react/dom/no-dangerously-set-innerhtml': 'off',
      '@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      'no-undef': 'off',
    },
  },
]);

export default eslintConfig;
