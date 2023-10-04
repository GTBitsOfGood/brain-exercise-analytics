module.exports = {
  env: { browser: true, node: true, es6: true },
  parser: "@typescript-eslint/parser",
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "airbnb-base",
    "airbnb-typescript",
    "plugin:prettier/recommended",
  ],
  globals: { Atomics: "readonly", SharedArrayBuffer: "readonly" },
  parserOptions: {
    ecmaFeatures: { tsx: true },
    ecmaVersion: 11,
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/quotes": "off",
    "react/react-in-jsx-scope": "off",
    "import/no-named-as-default": "off",
    "no-underscore-dangle": "off",
    "import/prefer-default-export": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: false,
      },
    ],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
