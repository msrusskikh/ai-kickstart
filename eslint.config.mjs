import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import nextConfig from 'eslint-config-next';

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  ...compat.extends('next/core-web-vitals'),
];
