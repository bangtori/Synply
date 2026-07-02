// DB: application_memos row
export type ApplicationMemoRow = {
  memo_id: string;
  application_id: string;
  content: string | null;
  updated_at: string;
};

// API 반환: 상세 응답 안에 들어가는 메모
export type ApplicationMemoResponse = {
  content: string | null;
  updatedAt: string;
};
