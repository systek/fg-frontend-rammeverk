export default {
  semi: false,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  overrides: [
    {
      files: ['*.yml', '*.yaml'],
      options: {
        bracketSpacing: false,
        tabWidth: 2,
      },
    },
  ],
}
