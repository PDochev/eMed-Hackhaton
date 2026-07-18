import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import Dashboard from './pages/dashboard';
import Occupational from './pages/occupational';
import CarePlan from './pages/care-plan';
import Chat from './pages/chat';
import Social from './pages/social';
import Clinical from './pages/clinical';
import Onboarding from './pages/onboarding';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/occupational" component={Occupational} />
      <Route path="/care-plan" component={CarePlan} />
      <Route path="/chat" component={Chat} />
      <Route path="/social" component={Social} />
      <Route path="/clinical" component={Clinical} />
      <Route path="/onboarding" component={Onboarding} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster theme="dark" className="toaster group" toastOptions={{
          classNames: {
            toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
