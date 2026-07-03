'use client';

import { useEffect, useState } from 'react';

export type Platform = 'desktop' | 'mobile';

// 기준 폭 768px 미만이면 mobile.
const MOBILE_QUERY = '(max-width: 767px)';

// 첫 렌더에서는 null을 반환해 SSR/CSR 하이드레이션 mismatch를 방지한다.
// useEffect에서 matchMedia를 구독해 확정한다.
export function usePlatform(): Platform | null {
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const update = () => setPlatform(mql.matches ? 'mobile' : 'desktop');

    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return platform;
}
