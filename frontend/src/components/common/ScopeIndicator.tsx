
import { useAuthStore } from '../../features/auth/useAuthStore';
import { Lock } from 'lucide-react';

export const ScopeIndicator = () => {
  const { currentPersona } = useAuthStore();
  const districtName = currentPersona.profile.scopes.district_name;

  if (!districtName) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground bg-muted/50 border-b">
      <Lock className="h-4 w-4" />
      <span className="truncate">{districtName}</span>
    </div>
  );
};
