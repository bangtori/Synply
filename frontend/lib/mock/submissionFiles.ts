import type { SubmissionFile } from '@/types/submissionFile';

// 임시 스캐폴딩 데이터 — 실제 API 도입 시 제거. 값은 디자인 시안과 동일.
export const mockSubmissionFiles: SubmissionFile[] = [
  {
    id: 'file-v3',
    fileName: '이력서 v3.pdf',
    uploadedAt: '2026-05-30',
    sizeLabel: '1.2MB',
    linkedLabel: '토스 외 2건',
    linked: true,
    deletable: false,
  },
  {
    id: 'file-v2',
    fileName: '이력서 v2.pdf',
    uploadedAt: '2026-05-10',
    sizeLabel: '1.1MB',
    linkedLabel: '네이버 외 1건',
    linked: true,
    deletable: false,
  },
  {
    id: 'file-v1',
    fileName: '이력서 v1.pdf',
    uploadedAt: '2026-04-22',
    sizeLabel: '0.9MB',
    linkedLabel: '라인',
    linked: true,
    deletable: false,
  },
  {
    id: 'file-v3-design',
    fileName: '이력서 v3-디자인.pdf',
    uploadedAt: '2026-06-01',
    sizeLabel: '1.3MB',
    linkedLabel: null,
    linked: false,
    deletable: true,
  },
];
