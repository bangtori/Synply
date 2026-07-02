import type { FileType } from '../constants/file-type.js';

// DB: submission_files row
export type SubmissionFileRow = {
  submission_file_id: string;
  user_id: string;
  display_name: string;
  original_file_name: string;
  file_type: FileType;
  mime_type: string;
  file_size: number;
  uploaded_at: string;
};

// API 반환 : 상세 응답 안에 들어가는 제출 파일
export type ApplicationSubmissionFileResponse = {
  id: string;
  displayName: string;
  fileType: FileType;
  mimeType: string;
  fileSize: number;
  uploadedAt: string;
};
