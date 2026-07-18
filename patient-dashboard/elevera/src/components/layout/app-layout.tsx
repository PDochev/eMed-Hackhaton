import React from 'react';
import { Sidebar } from './sidebar';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isClinical = location === '/clinical';

  return (
    <div className="min-h-screen bg-background text-foreground flex selection:bg-primary/30">
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-40 mix-blend-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
      
      <Sidebar />
      
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <header className="h-20 flex items-center justify-end px-8 border-b border-white/5 sticky top-0 bg-background/40 backdrop-blur-md z-30">
          <div className="flex items-center gap-3 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <Link href="/" className="block">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`rounded-full px-6 transition-all ${!isClinical ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-muted-foreground hover:text-white'}`}
              >
                Personal View
              </Button>
            </Link>
            <Link href="/clinical" className="block">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`rounded-full px-6 transition-all ${isClinical ? 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 hover:text-violet-200' : 'text-muted-foreground hover:text-white'}`}
              >
                Clinical View
              </Button>
            </Link>
          </div>
        </header>
        
        <div className="flex-1 p-8 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
}
