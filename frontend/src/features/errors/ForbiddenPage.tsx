
import { PageHeader } from '../../components/layout/PageHeader';

export const ForbiddenPage = () => {
  return (
    <div className="max-w-md mx-auto mt-20 text-center space-y-6">
      <PageHeader title="403 - Forbidden" />
      <p className="text-muted-foreground">You do not have the required role to access this page.</p>
    </div>
  );
};
