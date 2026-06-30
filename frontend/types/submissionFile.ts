export type SubmissionFile = {
  id: string;
  fileName: string;
  /** 업로드일 ISO 'YYYY-MM-DD' */
  uploadedAt: string;
  /** 표시용 용량 라벨 (예: '1.2MB'). 실제 API는 sizeBytes를 내려준다. */
  sizeLabel: string;
  /** 연결된 지원 요약 라벨 (예: '토스 외 2건'). 미연결이면 null */
  linkedLabel: string | null;
  /** 연결된 지원 건이 있는지 여부 */
  linked: boolean;
  /** 삭제 가능 여부 (연결된 파일은 삭제 차단) */
  deletable: boolean;
};
