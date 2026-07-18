import React from 'react';
import { Link, useLocation } from 'wouter';
import { Activity, ShieldAlert, HeartPulse, MessageSquareText, Users, UserCircle, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetProfile } from '@workspace/api-client-react';

export function Sidebar() {
  const [location] = useLocation();
  const { data: profile } = useGetProfile();
  
  const navItems = [
    { href: '/', label: 'Dashboard', icon: Activity },
    { href: '/occupational', label: 'Occupational Intel', icon: ShieldAlert },
    { href: '/care-plan', label: 'Care Plan', icon: HeartPulse },
    { href: '/chat', label: 'AI Companion', icon: MessageSquareText },
    { href: '/social', label: 'Social Wellbeing', icon: Users },
  ];

  const clinicalItem = { href: '/clinical', label: 'Clinical View', icon: Stethoscope };

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-white/10 bg-background/50 backdrop-blur-xl flex flex-col justify-between z-40">
      <div>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 text-primary hover:opacity-80 transition-opacity">
            <HeartPulse className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight text-white">Renova</span>
          </Link>
        </div>
        
        <nav className="px-4 space-y-1 mt-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="block">
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                location === item.href 
                  ? "bg-primary/20 text-primary border border-primary/20 shadow-[0_0_15px_rgba(31,178,166,0.15)]" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
            </Link>
          ))}
          
          <div className="pt-8 pb-2 px-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clinical View</p>
          </div>

          <Link href={clinicalItem.href} className="block">
            <div className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
              location === clinicalItem.href
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}>
              <clinicalItem.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{clinicalItem.label}</span>
            </div>
          </Link>
        </nav>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <Link href="/onboarding" className="block">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <UserCircle className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.name || 'Emma'}</p>
              <p className="text-xs text-muted-foreground truncate">{profile?.occupation || 'ICU Nurse (Night Shifts)'}</p>
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
