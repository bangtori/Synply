import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // tsconfig의 "@/*" → 프로젝트 루트 alias
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    // selector 등 순수 함수 테스트는 DOM이 필요 없다.
    // (컴포넌트 테스트 추가 시 jsdom 환경 + jest-dom setup 도입)
    environment: 'node',
  },
});
