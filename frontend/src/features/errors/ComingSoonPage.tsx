
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export const ComingSoonPage = () => {
  const location = useLocation();
  const pathTitle = location.pathname.split('/').pop() || 'Feature';
  
  return (
    <div className="max-w-md mx-auto mt-20 text-center space-y-6">
      <div className="flex justify-center mb-4">
        <Badge variant="outline">Planned</Badge>
      </div>
      <PageHeader title={`${pathTitle} - Available in a later release`} />
      <p className="text-muted-foreground">This feature is currently under development.</p>
      <Button asChild>
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  );
};
