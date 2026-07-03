type ClassValue = string | number | false | null | undefined;

// 조건부 클래스 합성. `cn('a', cond && 'b')` 형태로 사용한다.
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
