import { notFound } from 'next/navigation';

import { mockApplications } from '@/lib/mock/applications';
import { mockSubmissionFiles } from '@/lib/mock/submissionFiles';

import { ApplicationDetailScreen } from './_components/ApplicationDetailScreen';

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = mockApplications.find((item) => item.id === id);
  if (!application) {
    notFound();
  }

  const submissionFile = application.submissionFileId
    ? (mockSubmissionFiles.find(
        (file) => file.id === application.submissionFileId,
      ) ?? null)
    : null;

  return (
    <ApplicationDetailScreen
      application={application}
      submissionFile={submissionFile}
    />
  );
}
