
import { PageHeader } from '../../components/layout/PageHeader';

export const ScopeDeniedPage = () => {
  return (
    <div className="max-w-md mx-auto mt-20 text-center space-y-6">
      <PageHeader title="Scope Denied" />
      <p className="text-muted-foreground">You do not have jurisdiction to view this resource.</p>
    </div>
  );
};
