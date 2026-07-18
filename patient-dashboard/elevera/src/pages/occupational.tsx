import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useGetOccupationalEvents, useAddOccupationalEvent, useGetOccupationalImpact, getGetOccupationalEventsQueryKey, getGetOccupationalImpactQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Flame, Droplets, Wind, ShieldAlert, Info, ArrowUpRight, ArrowDownRight, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function Occupational() {
  const queryClient = useQueryClient();
  const { data: events, isLoading: eventsLoading } = useGetOccupationalEvents({ query: { queryKey: getGetOccupationalEventsQueryKey() } });
  const { data: impact, isLoading: impactLoading } = useGetOccupationalImpact({ query: { queryKey: getGetOccupationalImpactQueryKey() } });
  
  const addEvent = useAddOccupationalEvent();

  const handleSimulate = () => {
    addEvent.mutate(
      { 
        data: {
          eventType: 'Major Fire Response',
          description: 'Multi-alarm structure fire, heavy smoke, extreme heat.',
          smokeExposure: 'High',
          heatExposure: 'Extreme',
          fatigueLevel: 'Severe',
          duration: 180
        }
      },
      {
        onSuccess: () => {
          toast.success('Event logged successfully');
          queryClient.invalidateQueries({ queryKey: getGetOccupationalEventsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetOccupationalImpactQueryKey() });
        },
        onError: () => {
          toast.error('Failed to log event');
        }
      }
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
      case 'severe':
      case 'extreme': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'moderate':
      case 'elevated': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  const getIconForFactor = (name: string) => {
    if (name.includes('Smoke')) return Wind;
    if (name.includes('Heat')) return Flame;
    if (name.includes('Fatigue')) return Clock;
    if (name.includes('Recovery')) return ShieldAlert;
    return Info;
  };

  return (
    <AppLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 max-w-5xl mx-auto">
        <motion.div variants={itemVariants} className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Occupational Intelligence</h1>
            <p className="text-muted-foreground mt-1">Real-time analysis of workplace stress on your body.</p>
          </div>
          <Button 
            onClick={handleSimulate} 
            disabled={addEvent.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full shadow-[0_0_15px_rgba(31,178,166,0.3)] transition-all"
          >
            {addEvent.isPending ? 'Simulating...' : <><Plus className="w-4 h-4 mr-2" /> Simulate Fire Response</>}
          </Button>
        </motion.div>

        {impactLoading ? (
          <Skeleton className="h-32 w-full rounded-2xl bg-white/5" />
        ) : (
          <motion.div variants={itemVariants} className="glass-card rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <ShieldAlert className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex gap-6 items-start">
              <div className="w-1 bg-primary rounded-full h-full min-h-[4rem] shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">AI Analysis</h3>
                <p className="text-lg text-white font-medium leading-relaxed italic">
                  "{impact?.aiExplanation || 'Your body is responding well to recent occupational stressors.'}"
                </p>
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/10">
                  Overall Risk: <span className={`ml-2 ${getRiskColor(impact?.overallRiskLevel || 'Low').split(' ')[0]}`}>{impact?.overallRiskLevel}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Risk Factors</h2>
            <div className="grid gap-3">
              {impactLoading ? (
                Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl bg-white/5" />)
              ) : impact?.factors?.map((factor, i) => {
                const Icon = getIconForFactor(factor.name);
                return (
                  <div key={i} className="glass-card rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRiskColor(factor.level)} border`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{factor.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{factor.level} Risk</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className={`flex items-center gap-1 text-sm font-medium ${factor.direction === 'up' ? 'text-destructive' : 'text-primary'}`}>
                        {factor.direction === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {factor.change}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Today's Logged Events</h2>
            <div className="glass-card rounded-2xl p-6 min-h-[300px]">
              {eventsLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg bg-white/5" />)}
                </div>
              ) : events?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Clock className="w-8 h-8 mb-2 opacity-50" />
                  <p>No events logged today.</p>
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-3 before:-ml-px before:w-0.5 before:bg-white/10">
                  {events?.map((event, i) => (
                    <div key={event.id} className="relative pl-8">
                      <div className="absolute left-0 top-1.5 w-6 h-6 -ml-[11px] rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-white">{event.eventType}</h4>
                          <span className="text-xs text-muted-foreground">{format(parseISO(event.occurredAt), 'HH:mm')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-2 py-1 text-xs rounded bg-white/5 text-white/80">Duration: {event.duration}m</span>
                          <span className="px-2 py-1 text-xs rounded bg-white/5 text-white/80">Heat: {event.heatExposure}</span>
                          <span className="px-2 py-1 text-xs rounded bg-white/5 text-white/80">Smoke: {event.smokeExposure}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
