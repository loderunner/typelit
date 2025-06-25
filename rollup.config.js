import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

import packageJson from './package.json' with { type: 'json' };

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: packageJson.browser,
        format: 'umd',
        name: 'typelit',
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: [
      typescript({ tsconfig: './tsconfig.json', exclude: ['./**/*.test.ts'] }),
    ],
  },
  {
    input: 'src/index.ts',
    output: { file: packageJson.types, format: 'es' },
    plugins: [dts({ compilerOptions: { removeComments: true } })],
  },
];
