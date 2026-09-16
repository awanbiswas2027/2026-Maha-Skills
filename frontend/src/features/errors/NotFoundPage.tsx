
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/button';

export const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto mt-20 text-center space-y-6">
      <PageHeader title="404 - Page Not Found" />
      <p className="text-muted-foreground">The page you are looking for doesn't exist or has been moved.</p>
      <Button asChild>
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  );
};
