/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    // These opinionated rules are enabled in stylistic-type-checked above.
    // Feel free to reconfigure them to your own preference.
    "all":"off",
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "no-unused-vars": "off",
    "no-var": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/require-await": "off",
    // "@typescript-eslint/no-misused-promises": [
    //   "error",
    //   {
    //     checksVoidReturn: { attributes: false },
    //   },
    // ],
    "@typescript-eslint/no-explicit-any":"off",
    "@typescript-eslint/no-unsafe-argument":"off",
    "@typescript-eslint/prefer-nullish-coalescing":"off",
    "@typescript-eslint/non-nullable-type-assertion-style":"off",
    "@typescript-eslint/no-unnecessary-type-assertion":"off",
    "@typescript-eslint/no-unsafe-assignment":"off",
    "@typescript-eslint/no-unsafe-member-access":"off"
  },
  overrides:[
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/consistent-type-imports": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off"
        // Add more @typescript-eslint rules as needed
      }
    }
  ]
};

module.exports = config;
