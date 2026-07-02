export const FILE_TYPE = {
  RESUME: 'RESUME',
  PORTFOLIO: 'PORTFOLIO',
  COVER_LETTER: 'COVER_LETTER',
  OTHER: 'OTHER',
} as const;

export const FILE_TYPE_VALUES = Object.values(FILE_TYPE);

export type FileType = (typeof FILE_TYPE_VALUES)[number];
