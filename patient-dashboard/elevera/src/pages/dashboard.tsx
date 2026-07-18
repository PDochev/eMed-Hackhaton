import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useGetMetrics, useGetMetricsHistory, useGetMetricsSummary, getGetMetricsQueryKey, getGetMetricsHistoryQueryKey, getGetMetricsSummaryQueryKey } from '@workspace/api-client-react';
import { Activity, HeartPulse, Moon, Brain, ShieldAlert, Footprints, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const ScoreRing = ({ score, label, icon: Icon, color, delay }: { score: number, label: string, icon: any, color: string, delay: number }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-center justify-center mb-3">
        <svg width="100" height="100" className="transform -rotate-90 drop-shadow-lg">
          <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
          <motion.circle 
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.2 }}
            cx="50" cy="50" r={radius} 
            stroke={color} 
            strokeWidth="6" 
            fill="transparent" 
            strokeDasharray={circumference}
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(31,178,166,0.6)]"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <Icon className="w-5 h-5 mb-1 opacity-70" style={{ color }} />
          <span className="text-xl font-bold text-white leading-none">{score}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">{label}</span>
    </motion.div>
  );
};

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useGetMetrics({ query: { queryKey: getGetMetricsQueryKey() } });
  const { data: history, isLoading: historyLoading } = useGetMetricsHistory({ query: { queryKey: getGetMetricsHistoryQueryKey() } });
  const { data: summary, isLoading: summaryLoading } = useGetMetricsSummary({ query: { queryKey: getGetMetricsSummaryQueryKey() } });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (metricsLoading || historyLoading || summaryLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48 bg-white/5" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Array(7).fill(0).map((_, i) => <Skeleton key={i} className="h-36 w-full rounded-2xl bg-white/5" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[400px] lg:col-span-2 rounded-2xl bg-white/5" />
            <Skeleton className="h-[400px] rounded-2xl bg-white/5" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Health Dashboard</h1>
          <p className="text-muted-foreground mt-1">Precision insights for peak performance.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <ScoreRing delay={0.1} score={metrics?.healthScore || 0} label="Health Score" icon={Activity} color="hsl(175 70% 41%)" />
          <ScoreRing delay={0.2} score={metrics?.recoveryScore || 0} label="Recovery" icon={HeartPulse} color="hsl(160 60% 50%)" />
          <ScoreRing delay={0.3} score={metrics?.readinessScore || 0} label="Readiness" icon={Zap} color="hsl(217 90% 60%)" />
          <ScoreRing delay={0.4} score={metrics?.sleepQuality || 0} label="Sleep" icon={Moon} color="hsl(250 60% 60%)" />
          <ScoreRing delay={0.5} score={metrics?.mentalWellbeing || 0} label="Mental" icon={Brain} color="hsl(190 80% 50%)" />
          <ScoreRing delay={0.6} score={metrics?.occupationalImpact || 0} label="Impact" icon={ShieldAlert} color="hsl(0 84% 60%)" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div className="text-lg font-bold text-white capitalize">{metrics?.conditionStatus || 'Stable'}</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Condition</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2 glass-card rounded-2xl p-6 glass-glow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-white">7-Day Trajectory</h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-xs text-muted-foreground">Health</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                  <span className="text-xs text-muted-foreground">Recovery</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={Array.isArray(history) ? history : []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(175 70% 41%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(175 70% 41%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRecovery" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(val) => val ? format(parseISO(val), 'MMM d') : ''} 
                    stroke="rgba(255,255,255,0.2)" 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.2)" 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(25, 33, 48, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    labelFormatter={(label) => label ? format(parseISO(label as string), 'MMM d, yyyy') : ''}
                  />
                  <Area type="monotone" dataKey="healthScore" stroke="hsl(175 70% 41%)" strokeWidth={3} fillOpacity={1} fill="url(#colorHealth)" />
                  <Area type="monotone" dataKey="recoveryScore" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRecovery)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white mb-6">Wearable Sync</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                      <HeartPulse className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Resting HR</p>
                      <p className="text-xl font-bold text-white">{metrics?.restingHeartRate} <span className="text-xs font-normal text-muted-foreground">bpm</span></p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">HRV</p>
                      <p className="text-xl font-bold text-white">{metrics?.hrv} <span className="text-xs font-normal text-muted-foreground">ms</span></p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Footprints className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Steps Today</p>
                      <p className="text-xl font-bold text-white">{(metrics?.stepsToday || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {summary?.trend || 'Your health metrics are stable. Keep up the good work.'}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
