import { ApplicationsScreen } from './_components/ApplicationsScreen';

// `?empty=first` / `?empty=no-result`는 정적 빈 상태 검수용 프리뷰 훅이다.
// 실제 빈 조건은 데이터/필터링이 붙는 기능 단계에서 발생한다.
export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  const { empty } = await searchParams;
  return <ApplicationsScreen emptyPreview={empty} />;
}
