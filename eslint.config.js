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
    // Colours, sizes, corners and spacing come from src/constants/theme.ts, so a change is one edit there.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/constants/theme.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          // Whole-string colours only, so lesson text such as "#123" is not flagged.
          selector:
            'Literal[value=/^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba?\\(.*\\))$/]',
          message: 'Use a colour token from @/constants/theme.',
        },
        {
          selector: 'TemplateElement[value.raw=/#[0-9a-fA-F]{6}\\b|rgba?\\(/]',
          message: 'Use a colour token from @/constants/theme.',
        },
        {
          // Sizes, corners and spacing come from FontSize, Radius and space() in the theme.
          selector:
            'Property[key.name=/^(fontSize|lineHeight|borderRadius|border(Top|Bottom)(Left|Right)Radius|(padding|margin)(Top|Bottom|Left|Right|Horizontal|Vertical)?|gap|rowGap|columnGap)$/] > Literal[value>0]',
          message: 'Use FontSize, LineHeight, Radius or space() from @/constants/theme.',
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
