import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  Stethoscope, AlertTriangle, TrendingUp, TrendingDown, Minus,
  Pill, Activity, ClipboardList, CheckCircle2, Zap, Pencil, X, Save,
  FlaskConical, ShieldAlert, ChevronDown, ChevronUp,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';

const fetchSummary   = () => fetch(`${BASE}/api/clinical/summary`).then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); });
const fetchCarePlan  = () => fetch(`${BASE}/api/clinical/care-plan/today`).then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); });

type Priority  = 'urgent' | 'recommended' | 'consider';
type FlagLevel = 'high' | 'medium' | 'low';
type TrendDir  = 'improving' | 'declining' | 'stable';
type Urgency   = 'adjust' | 'review' | 'maintain';

const priorityConfig: Record<Priority, { label: string; color: string; bg: string; border: string }> = {
  urgent:      { label: 'Urgent',      color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30' },
  recommended: { label: 'Recommended', color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30' },
  consider:    { label: 'Consider',    color: 'text-sky-400',    bg: 'bg-sky-500/10',    border: 'border-sky-500/30' },
};

const urgencyConfig: Record<Urgency, { label: string; color: string; bg: string; border: string }> = {
  adjust:   { label: 'Adjust Dose',  color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30' },
  review:   { label: 'Review',       color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30' },
  maintain: { label: 'Maintain',     color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/30' },
};

const flagConfig: Record<FlagLevel, { color: string; bg: string; border: string }> = {
  high:   { color: 'text-red-400',   bg: 'bg-red-500/10',   border: 'border-red-500/30' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  low:    { color: 'text-sky-400',   bg: 'bg-sky-500/10',   border: 'border-sky-500/30' },
};

const riskColor: Record<string, string> = {
  high: 'text-red-400 bg-red-500/10 border-red-500/30',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  low: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
};

const categoryColor: Record<string, string> = {
  medication: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  supplement: 'bg-teal-500/15 text-teal-300 border-teal-500/25',
  nutrition:  'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  exercise:   'bg-amber-500/15 text-amber-300 border-amber-500/25',
  sleep:      'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
};

function TrendIcon({ dir }: { dir: TrendDir }) {
  if (dir === 'improving') return <TrendingUp className="w-4 h-4 text-emerald-400" />;
  if (dir === 'declining') return <TrendingDown className="w-4 h-4 text-red-400" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
}

function AdherenceRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 22, circ = 2 * Math.PI * r, dash = (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="58" height="58" viewBox="0 0 58 58">
        <circle cx="29" cy="29" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle cx="29" cy="29" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 29 29)" />
        <text x="29" y="33" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">{value}%</text>
      </svg>
      <span className="text-xs text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  );
}

interface CarePlanItem {
  id: number;
  planDate: string;
  category: string;
  title: string;
  description: string;
  explanation: string;
  scheduledTime: string | null;
  completed: boolean;
  priority: string;
  isAdjustedForOccupation: boolean;
}

function CarePlanEditor() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery<CarePlanItem[]>({
    queryKey: ['clinical-care-plan-today'],
    queryFn: fetchCarePlan,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<CarePlanItem>>({});
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());

  const mutation = useMutation({
    mutationFn: (vars: { id: number; patch: Partial<CarePlanItem> }) =>
      fetch(`${BASE}/api/clinical/care-plan/${vars.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vars.patch),
      }).then(r => r.json()),
    onSuccess: (updated: CarePlanItem) => {
      qc.setQueryData<CarePlanItem[]>(['clinical-care-plan-today'], old =>
        (old ?? []).map(i => i.id === updated.id ? updated : i)
      );
      setAppliedIds(prev => new Set([...prev, updated.id]));
      setEditingId(null);
    },
  });

  const startEdit = (item: CarePlanItem) => {
    setEditingId(item.id);
    setEditForm({ title: item.title, description: item.description, scheduledTime: item.scheduledTime ?? '', priority: item.priority });
  };

  const saveEdit = (id: number) => mutation.mutate({ id, patch: editForm });
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading care plan…</p>;

  const byCategory = items.reduce<Record<string, CarePlanItem[]>>((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(byCategory).map(([cat, catItems]) => (
        <div key={cat}>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wide ${categoryColor[cat] ?? 'bg-white/5 text-white border-white/10'}`}>
              {cat}
            </span>
          </h4>
          <div className="space-y-2">
            {catItems.map(item => (
              <AnimatePresence key={item.id} mode="wait">
                {editingId === item.id ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/25 space-y-3"
                  >
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                      value={editForm.title ?? ''}
                      onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Item title"
                    />
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                      rows={2}
                      value={editForm.description ?? ''}
                      onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Instructions for patient"
                    />
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Time:</span>
                        <input
                          className="w-28 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-primary/50"
                          value={editForm.scheduledTime ?? ''}
                          onChange={e => setEditForm(f => ({ ...f, scheduledTime: e.target.value }))}
                          placeholder="HH:MM"
                        />
                        <span className="text-xs text-muted-foreground">Priority:</span>
                        <select
                          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none"
                          value={editForm.priority ?? 'normal'}
                          onChange={e => setEditForm(f => ({ ...f, priority: e.target.value }))}
                        >
                          <option value="high">High</option>
                          <option value="normal">Normal</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                      <button onClick={() => saveEdit(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 text-primary border border-primary/30 text-xs font-semibold hover:bg-primary/30 transition-colors">
                        <Save className="w-3.5 h-3.5" /> Save
                      </button>
                      <button onClick={cancelEdit}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-muted-foreground border border-white/10 text-xs hover:bg-white/10 transition-colors">
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      item.completed ? 'bg-white/2 border-white/5 opacity-60' :
                      item.isAdjustedForOccupation || appliedIds.has(item.id) ? 'bg-violet-500/5 border-violet-500/20' :
                      'bg-white/3 border-white/8'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-semibold ${item.completed ? 'line-through text-muted-foreground' : 'text-white'}`}>
                          {item.title}
                        </p>
                        {item.scheduledTime && (
                          <span className="text-xs text-muted-foreground">{item.scheduledTime}</span>
                        )}
                        {(item.isAdjustedForOccupation || appliedIds.has(item.id)) && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20 font-semibold">
                            Doctor Modified
                          </span>
                        )}
                        {item.priority === 'high' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">
                            High Priority
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
                    </div>
                    <button
                      onClick={() => startEdit(item)}
                      className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/8 transition-colors"
                      title="Edit this item"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Clinical() {
  const { data, isLoading, error } = useQuery({ queryKey: ['clinical-summary'], queryFn: fetchSummary });
  const [expandedRec, setExpandedRec] = useState<number | null>(null);
  const [appliedMeds, setAppliedMeds] = useState<Set<number>>(new Set());

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  const chartData = (data?.metricsHistory ?? []).map((m: any) => ({
    date: new Date(m.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
    Health: m.healthScore,
    Recovery: m.recoveryScore,
    HRV: m.hrv,
    Sleep: m.sleepQuality,
    'Occ. Impact': m.occupationalImpact,
  }));

  return (
    <AppLayout>
      <motion.div className="p-8 space-y-6 max-w-screen-xl" variants={container} initial="hidden" animate="show">

        {/* Header */}
        <motion.div variants={item} className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-violet-500/15 border border-violet-500/20">
                <Stethoscope className="w-5 h-5 text-violet-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Clinical View</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/20 text-xs font-semibold text-violet-300">
                Clinician Only
              </span>
            </div>
            <p className="text-muted-foreground text-sm ml-14">
              Patient summary · Occupational risk analysis · Dosage review · Editable care plan
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Last updated</p>
            <p className="text-sm font-medium text-white">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </motion.div>

        {isLoading && <div className="flex items-center justify-center h-64 text-muted-foreground">Loading patient data…</div>}
        {error && <div className="glass-card p-6 border-red-500/30 text-red-400">Failed to load clinical summary.</div>}

        {data && (<>

          {/* Row 1: Patient + Adherence + Metrics */}
          <div className="grid grid-cols-12 gap-4">
            {/* Patient card */}
            <motion.div variants={item} className="col-span-4 glass-card p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xl font-bold text-violet-300">
                  {data.patient.name?.[0]}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">{data.patient.name}</h2>
                  <p className="text-xs text-muted-foreground">{data.patient.age}y · {data.patient.occupation}</p>
                  {data.patient.wearableConnected && (
                    <p className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      {data.patient.wearableType}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Conditions</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.patient.conditions?.map((c: string) => (
                    <span key={c} className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-medium">{c}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Pill className="w-3 h-3" /> Current Medications
                </p>
                <ul className="space-y-1.5">
                  {data.patient.medications?.map((med: string) => (
                    <li key={med} className="flex items-start gap-2 text-xs text-foreground/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      {med}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Adherence */}
            <motion.div variants={item} className="col-span-4 glass-card p-5 flex flex-col justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5" /> Adherence
              </p>
              <div className="flex justify-around">
                <AdherenceRing value={data.adherence.programmeAdherenceRate} label="Programme" color="#1fb2a6" />
                <AdherenceRing value={data.adherence.medicationAdherenceRate} label="Medication" color="#8b5cf6" />
                {data.adherence.todayCarePlanRate !== null && (
                  <AdherenceRing value={data.adherence.todayCarePlanRate} label="Today" color="#f59e0b" />
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Industry avg: 40–60% · Patient: <span className="text-emerald-400 font-semibold">{data.adherence.programmeAdherenceRate}%</span>
              </p>
            </motion.div>

            {/* Current metrics */}
            <motion.div variants={item} className="col-span-4 glass-card p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Current Metrics & 7-Day Trend
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Health Score', value: data.currentMetrics?.healthScore, trendKey: 'healthScore', unit: '' },
                  { label: 'HRV', value: data.currentMetrics?.hrv, trendKey: 'hrv', unit: 'ms' },
                  { label: 'Sleep Quality', value: data.currentMetrics?.sleepQuality, trendKey: 'sleepQuality', unit: '' },
                  { label: 'Occ. Impact', value: data.currentMetrics?.occupationalImpact, trendKey: 'occupationalImpact', unit: '' },
                  { label: 'Recovery', value: data.currentMetrics?.recoveryScore, trendKey: 'recoveryScore', unit: '' },
                  { label: 'Resting HR', value: data.currentMetrics?.restingHeartRate, trendKey: null, unit: 'bpm' },
                ].map(({ label, value, trendKey, unit }) => (
                  <div key={label} className="flex items-center justify-between p-2.5 rounded-lg bg-white/3 border border-white/6">
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-lg font-bold text-white">{value ?? '—'}<span className="text-xs text-muted-foreground ml-0.5">{unit}</span></p>
                    </div>
                    {trendKey && <TrendIcon dir={data.trends[trendKey] as TrendDir} />}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Risk flags */}
          {data.flags.length > 0 && (
            <motion.div variants={item} className="glass-card p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Risk Flags
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {data.flags.map((f: { level: FlagLevel; category: string; message: string }, i: number) => {
                  const cfg = flagConfig[f.level];
                  return (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                      <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${cfg.color}`} />
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-wide ${cfg.color} mb-0.5`}>{f.category}</p>
                        <p className={`text-xs ${cfg.color}`}>{f.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Occupational–PCOS Interaction Matrix */}
          {data.occupationalInteractions?.length > 0 && (
            <motion.div variants={item} className="glass-card p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Occupational–PCOS Interaction Matrix
              </p>
              <div className="space-y-2">
                {data.occupationalInteractions.map((row: any, i: number) => (
                  <div key={i} className="grid grid-cols-12 gap-3 items-start p-3 rounded-lg bg-white/2 border border-white/6">
                    <div className="col-span-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wide ${riskColor[row.riskLevel]}`}>
                        {row.riskLevel}
                      </span>
                      <p className="text-xs font-semibold text-white mt-1 leading-tight">{row.factor}</p>
                    </div>
                    <div className="col-span-6">
                      <p className="text-xs text-muted-foreground leading-relaxed">{row.pcosImpact}</p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-[10px] text-muted-foreground/60 leading-tight">{row.evidence}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Medication Dosage Review */}
          {data.medicationRecommendations?.length > 0 && (
            <motion.div variants={item} className="glass-card p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-violet-400" /> Medication Dosage Review
              </p>
              <div className="space-y-3">
                {data.medicationRecommendations.map((med: any, i: number) => {
                  const cfg = urgencyConfig[med.urgency as Urgency];
                  const applied = appliedMeds.has(i);
                  return (
                    <div key={i} className={`p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-xs font-bold uppercase tracking-wide ${cfg.color} border ${cfg.border} ${cfg.bg} px-2 py-0.5 rounded-full`}>
                              {cfg.label}
                            </span>
                            <span className="text-sm font-semibold text-white">{med.medication}</span>
                            <span className="text-xs text-muted-foreground">Current: {med.currentDose}</span>
                          </div>
                          <p className={`text-sm font-medium ${cfg.color} mb-1.5`}>→ {med.suggestedAdjustment}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{med.rationale}</p>
                        </div>
                        {med.urgency !== 'maintain' && (
                          <button
                            onClick={() => setAppliedMeds(prev => new Set([...prev, i]))}
                            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              applied
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-white/5 text-white border-white/15 hover:bg-white/10'
                            }`}
                          >
                            {applied ? <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Applied</span> : 'Mark Applied'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 14-day trajectory */}
          <motion.div variants={item} className="glass-card p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> 14-Day Health Trajectory — Shift Pattern Visible
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[20, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#e5e7eb' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
                <Line type="monotone" dataKey="Health" stroke="#1fb2a6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Recovery" stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Sleep" stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                <Line type="monotone" dataKey="HRV" stroke="#ec4899" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                <Line type="monotone" dataKey="Occ. Impact" stroke="#ef4444" strokeWidth={1.5} dot={false} strokeDasharray="2 3" />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Night shift clusters clearly visible as periodic dips in HRV, sleep, and health score
            </p>
          </motion.div>

          {/* AI recommendations */}
          <motion.div variants={item} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 rounded-lg bg-violet-500/15 border border-violet-500/20">
                <Zap className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                AI-Generated Care Plan Adjustments
              </p>
              <span className="ml-auto text-xs text-muted-foreground">Not a substitute for clinical judgement</span>
            </div>
            <div className="space-y-2.5">
              {data.recommendations.map((rec: any, i: number) => {
                const cfg = priorityConfig[rec.priority as Priority];
                const open = expandedRec === i;
                return (
                  <div key={i} className={`rounded-xl border ${cfg.bg} ${cfg.border} overflow-hidden`}>
                    <button
                      className="w-full flex items-center gap-3 p-4 text-left"
                      onClick={() => setExpandedRec(open ? null : i)}
                    >
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border shrink-0 ${cfg.color} ${cfg.border} ${cfg.bg}`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-muted-foreground border border-white/10 rounded-full px-2 py-0.5 bg-white/3 shrink-0">
                        {rec.category}
                      </span>
                      <p className={`text-sm font-semibold flex-1 ${cfg.color}`}>{rec.adjustment}</p>
                      {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                    </button>
                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-white/5 pt-3">
                            {rec.rationale}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Doctor-editable Care Plan */}
          <motion.div variants={item} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 rounded-lg bg-teal-500/15 border border-teal-500/20">
                <Pencil className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Edit Today's Care Plan
              </p>
              <span className="ml-auto text-xs text-muted-foreground">
                Click the <Pencil className="w-3 h-3 inline" /> icon on any item to modify — changes are saved immediately
              </span>
            </div>
            <CarePlanEditor />
          </motion.div>

        </>)}
      </motion.div>
    </AppLayout>
  );
}
