

interface PageHeaderProps {
  title: string;
  contextLine?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
}

export const PageHeader = ({ title, contextLine, actions, breadcrumb }: PageHeaderProps) => {
  return (
    <div className="mb-6 space-y-4">
      {breadcrumb && <div className="text-sm text-muted-foreground">{breadcrumb}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {contextLine && <div className="text-sm text-muted-foreground mt-1">{contextLine}</div>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};
