import { CRMLayout } from '@/components/layout/crm-layout';
import { ApplicationQueue } from '@/components/crm/application-queue';
// Icons will be imported when needed

export default function ApplicationsPage() {
  return (
    <CRMLayout>
      <ApplicationQueue />
    </CRMLayout>
  );
}
