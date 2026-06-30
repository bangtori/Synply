// ISO 'YYYY-MM-DD' → 'MM.DD' (리스트/카드 메타용)
export function formatMonthDay(iso: string): string {
  const parts = iso.split('-');
  return `${parts[1]}.${parts[2]}`;
}

// ISO 'YYYY-MM-DD' → 'YYYY.MM.DD' (상세/파일 메타용)
export function formatDot(iso: string): string {
  return iso.split('-').join('.');
}
