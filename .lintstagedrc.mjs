export default {
  '*': 'prettier --ignore-unknown --write',
  '**/*.{js,jsx,ts,tsx}': 'pnpm lint:fix',
  '**/*.{ts,tsx}': () => 'pnpm type-check',
};
