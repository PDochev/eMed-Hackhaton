import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useGetCarePlan, useRegenerateCarePlan, useCompleteCarePlanItem, getGetCarePlanQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle2, Circle, Clock, AlertTriangle, Droplet, Apple, Dumbbell, Moon, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function CarePlan() {
  const queryClient = useQueryClient();
  const { data: plan, isLoading } = useGetCarePlan({ query: { queryKey: getGetCarePlanQueryKey() } });
  
  const regenerate = useRegenerateCarePlan();
  const completeItem = useCompleteCarePlanItem();

  const handleRegenerate = () => {
    regenerate.mutate(undefined, {
      onSuccess: () => {
        toast.success('Care plan regenerated based on latest data');
        queryClient.invalidateQueries({ queryKey: getGetCarePlanQueryKey() });
      }
    });
  };

  const handleComplete = (id: number, currentCompleted: boolean) => {
    if (currentCompleted) return; // Assume it's one-way for demo, or handle toggle if API supports it
    completeItem.mutate({ itemId: id }, {
      onSuccess: () => {
        queryClient.setQueryData(getGetCarePlanQueryKey(), (old: any) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((item: any) => 
              item.id === id ? { ...item, completed: true } : item
            )
          };
        });
        toast.success('Marked as complete');
      }
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hydration': return <Droplet className="w-5 h-5 text-blue-400" />;
      case 'nutrition': return <Apple className="w-5 h-5 text-green-400" />;
      case 'exercise': return <Dumbbell className="w-5 h-5 text-orange-400" />;
      case 'sleep': return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'medication': return <Pill className="w-5 h-5 text-pink-400" />;
      default: return <CheckCircle2 className="w-5 h-5 text-primary" />;
    }
  };

  const groupedItems = plan?.items?.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof plan.items>) || {};

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dynamic Care Plan</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              {plan?.isAdjustedForOccupation && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/20 text-primary border border-primary/20">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Adjusted for recent occupational stress
                </span>
              )}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRegenerate}
            disabled={regenerate.isPending}
            className="border-white/10 hover:bg-white/5 text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${regenerate.isPending ? 'animate-spin' : ''}`} />
            Regenerate Plan
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-48 bg-white/5" />
            <Skeleton className="h-32 w-full rounded-xl bg-white/5" />
            <Skeleton className="h-32 w-full rounded-xl bg-white/5" />
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedItems).map(([category, items], groupIndex) => (
              <motion.div 
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  {getCategoryIcon(category)}
                  <h2 className="text-xl font-semibold text-white capitalize">{category}</h2>
                </div>
                
                <div className="grid gap-4">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className={`glass-card rounded-xl p-5 border transition-all duration-300 ${
                        item.completed 
                          ? 'opacity-50 border-white/5' 
                          : item.priority === 'High' 
                            ? 'border-l-4 border-l-destructive border-t-white/10 border-r-white/10 border-b-white/10' 
                            : 'border-white/10'
                      }`}
                    >
                      <div className="flex gap-4 items-start">
                        <button 
                          onClick={() => handleComplete(item.id, item.completed)}
                          className="mt-1 shrink-0 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                        >
                          {item.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                        </button>
                        
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className={`text-lg font-medium ${item.completed ? 'line-through text-muted-foreground' : 'text-white'}`}>
                              {item.title}
                            </h3>
                            <div className="flex gap-2">
                              {item.scheduledTime && (
                                <span className="inline-flex items-center text-xs px-2 py-1 rounded-md bg-white/5 text-muted-foreground">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {item.scheduledTime}
                                </span>
                              )}
                              {item.priority === 'High' && !item.completed && (
                                <span className="inline-flex items-center text-xs px-2 py-1 rounded-md bg-destructive/20 text-destructive border border-destructive/20">
                                  High Priority
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                          
                          {!item.completed && (
                            <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10 flex gap-3 items-start">
                              <InfoIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              <p className="text-xs text-primary/80 leading-relaxed italic">
                                {item.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function InfoIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}
