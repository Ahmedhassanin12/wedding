import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['dist/**', 'public/**', 'node_modules/**'],
    },
    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.{ts,tsx}'],
        rules: {
            semi: ['error', 'always'],
            'no-eval': 'error',
            curly: ['error', 'all'],
            'eqeqeq': ['error', 'always'],
            'no-debugger': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-var': 'error',
            'prefer-const': 'error',
            'no-duplicate-imports': 'error',
            'no-template-curly-in-string': 'error',
            'no-else-return': 'error',
            '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
);
