module.exports = {
  $schema: 'https://json.schemastore.org/prettierrc',
  semi: true,
  tabWidth: 2,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'none',
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
  importOrder: [
    '^@/plugins/(.*)$',
    '^@/pages/(.*)$',
    '^@/components/(.*)$',
    '^@/composables/(.*)$',
    '^@/stores/(.*)$',
    '^@/services/(.*)$',
    '^@/utils/(.*)$',
    '^@/constants/(.*)$',
    '^@/types/(.*)$',
    '^@/assets/(.*)$',
    '\\.(css|scss)$' // Styles
  ],
  importOrderCaseInsensitive: true
};
