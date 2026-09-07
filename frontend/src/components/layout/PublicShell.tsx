import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const PublicShell: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>© 2026 Government of Maharashtra. All rights reserved. Problem Statement ID: 26134.</p>
      </footer>
    </div>
  );
};
