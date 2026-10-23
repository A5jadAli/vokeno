// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  {
    ignores: ['.expo/*', 'expo-env.d.ts', 'coverage/*', 'dist/*', 'supabase/functions/**'],
  },
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    rules: {
      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Colours come from src/constants/theme.ts, so a palette change is one edit there.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/constants/theme.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/#[0-9a-fA-F]{3,8}\\b|rgba?\\(/]',
          message: 'Use a colour token from @/constants/theme (withAlpha for opacity).',
        },
        {
          selector: 'TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b|rgba?\\(/]',
          message: 'Use a colour token from @/constants/theme (withAlpha for opacity).',
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.{js,cjs,mjs}'],
    rules: {
      'no-console': 'off',
    },
  },
]);
