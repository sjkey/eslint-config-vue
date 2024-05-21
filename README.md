# @sjkey/eslint-config-vue

My ESlint configuration, based on [antfu/eslint-config](https://github.com/antfu/eslint-config)

This package is designed for **Nuxt** and **Vue** projects using the new [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new)

It provides a custom ESLint configuration, `@sjkey/eslint-config-vue`, to help you maintain consistent code style and enforce best practices in your projects including:

- TypeScript
- Vue
- Tailwind
- Prettier
- Sorted imports
- Unicorn
- Yaml
- and more ...

## Installation
```shell
# Using pnpm
pnpm i -D @sjkey/eslint-config-vue

# Using npm
npm i -D @sjkey/eslint-config-vue

# Using yarn
yarn add -D @sjkey/eslint-config-vue
```
## Configuration

1. Create a `eslint.config.ts` file in the root directory.
2. Open the `eslint.config.ts` file and add the following code:

   ```javascript
   import sjkeyConfig from '@sjkey/eslint-config-vue'

   export default sjkeyConfig()
   ```

3. Sometimes a **reload** is required in VS Code


## VS Code Support
```shell
// .vscode/settings.json
{
  // Enable ESLint flat config support
  "eslint.experimental.useFlatConfig": true
}
```

## License

This project is licensed under the [MIT License](LICENSE).
