
import { Link } from 'react-router-dom';

export const PublicFooter = () => {
  const buildDate = '2026-09-17';
  
  return (
    <footer className="border-t bg-muted/20 py-8 px-4 md:px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6">
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Government of Maharashtra. All rights reserved.
        </div>
        <nav className="flex flex-wrap gap-4 text-sm">
          <Link to="/accessibility" className="hover:underline">Accessibility Statement</Link>
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/terms" className="hover:underline">Terms</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          <Link to="/sitemap" className="hover:underline">Sitemap</Link>
        </nav>
      </div>
      <div className="max-w-7xl mx-auto mt-4 text-xs text-muted-foreground">
        Last updated: {buildDate}
      </div>
    </footer>
  );
};
