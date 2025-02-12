module.exports = {
  env: {
    webextensions: true,
  },
  extends: [
    `preact`,
    `plugin:sonarjs/recommended`,
    `plugin:unicorn/recommended`,
    `plugin:import/errors`,
    `plugin:import/warnings`,
    `plugin:import/typescript`,
    `plugin:react-hooks/recommended`,
    `plugin:@typescript-eslint/recommended`,
  ],
  globals: {
    __PATH_PREFIX__: true,
  },
  parser: `@typescript-eslint/parser`,
  plugins: [
    `@typescript-eslint`,
    `json-format`,
    `disable`,
    `sonarjs`,
    `sort-keys-fix`,
    `import`,
    `react-hooks`,
  ],
  processor: `disable/disable`,
  root: true,
  rules: {
    "@typescript-eslint/no-duplicate-imports": `warn`,
    "@typescript-eslint/no-empty-function": `warn`,
    "@typescript-eslint/no-unused-vars": [
      `warn`,
      { ignoreRestSiblings: true },
    ],
    "comma-dangle": [
      `warn`,
      `always-multiline`,
    ],
    "import/no-named-as-default": `off`,
    "jsx-a11y/accessible-emoji": `off`,
    "no-duplicate-imports": `off`,
    "no-empty-function": `off`,
    "prefer-const": `warn`,
    quotes: [
      `error`,
      `backtick`,
    ],
    "security/detect-non-literal-fs-filename": `off`,
    "security/detect-non-literal-require": `off`,
    "security/detect-object-injection": `off`,
    semi: [
      `warn`,
      `never`,
    ],
    "sonarjs/no-nested-template-literals": `warn`,
    "sort-keys-fix/sort-keys-fix": `warn`,
    "unicorn/consistent-function-scoping": `off`,
    "unicorn/filename-case": [
      `error`,
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
        ignore: [
          `[A-Z]{2,4}`,
          `webextension-polyfill-ts`,
        ],
      },
    ],
    "unicorn/no-array-reduce": `warn`,
    "unicorn/no-await-expression-member": `off`,
    "unicorn/no-null": 0,
    "unicorn/prefer-code-point": `warn`,
    "unicorn/prefer-dom-node-text-content": `off`,
    "unicorn/prefer-logical-operator-over-ternary": `warn`,
    "unicorn/prefer-module": `off`,
    "unicorn/prefer-node-protocol": `off`,
    "unicorn/prevent-abbreviations": [
      `warn`,
      {
        allowList: {
          Props: true,
          eLitigation: true,
          props: true,
        },
      },
    ],
  },
  settings: {
    "import/resolver": {
      node: {
        paths: [`src`],
      },
    },
    node: {
      tryExtensions: [`.tsx`], // append tsx to the list as well
    },
  },
}