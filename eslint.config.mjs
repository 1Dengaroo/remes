import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import tailwindCanonicalClasses from 'eslint-plugin-tailwind-canonical-classes';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tailwindCanonicalClasses.configs['flat/recommended'],
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'tailwind-canonical-classes/tailwind-canonical-classes': [
        'warn',
        { cssPath: './styles/globals.css' }
      ]
    }
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts'])
]);

export default eslintConfig;
