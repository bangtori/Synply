import type { Application } from '@/types/application';

// 최근 지원순(지원일 내림차순) 상위 N건. 원본 배열을 변형하지 않는다.
export function getRecentApplications(
  applications: Application[],
  limit = 5,
): Application[] {
  return [...applications]
    .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
    .slice(0, limit);
}
