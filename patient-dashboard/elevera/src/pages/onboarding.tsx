import React from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, ArrowRight, UserCircle, Activity, Target, Watch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSaveProfile } from '@workspace/api-client-react';
import { toast } from 'sonner';

const steps = [
  { id: 'personal', title: 'Personal Details', icon: UserCircle },
  { id: 'health', title: 'Health Status', icon: Activity },
  { id: 'goals', title: 'Goals', icon: Target },
  { id: 'wearable', title: 'Connect Wearable', icon: Watch },
];

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  age: z.coerce.number().min(18, 'Must be at least 18'),
  heightCm: z.coerce.number().min(100),
  weightKg: z.coerce.number().min(30),
  occupation: z.string().min(2, 'Occupation is required'),
  conditions: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  goals: z.array(z.string()).default([]),
  lifestyleHabits: z.array(z.string()).default([]),
  wearableConnected: z.boolean().default(false),
  wearableType: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = React.useState(0);
  const saveProfile = useSaveProfile();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: 'Sarah',
      age: 42,
      heightCm: 170,
      weightKg: 68,
      occupation: 'Firefighter',
      conditions: ['Asthma', 'Pre-diabetes'],
      medications: ['Albuterol inhaler'],
      goals: ['Improve recovery time', 'Manage blood sugar', 'Reduce fatigue'],
      lifestyleHabits: ['Irregular sleep schedule', 'High physical exertion'],
      wearableConnected: true,
      wearableType: 'Oura Ring Gen3',
    }
  });

  const onSubmit = (data: FormData) => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
      return;
    }

    saveProfile.mutate({ data }, {
      onSuccess: () => {
        toast.success('Profile created successfully');
        setLocation('/');
      },
      onError: () => {
        toast.error('Failed to create profile');
      }
    });
  };

  const InputField = ({ label, name, type = "text", placeholder }: { label: string, name: keyof FormData, type?: string, placeholder?: string }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/80">{label}</label>
      <input
        type={type}
        {...form.register(name)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
      />
      {form.formState.errors[name] && (
        <p className="text-xs text-destructive mt-1">{form.formState.errors[name]?.message as string}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
      
      <header className="p-8 relative z-10">
        <div className="flex items-center gap-3 text-primary">
          <HeartPulse className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-white">Renova</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-xl">
          <div className="mb-12">
            <div className="flex justify-between items-center relative before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:h-0.5 before:bg-white/10 before:z-0">
              {steps.map((step, idx) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${
                    idx <= currentStep ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(31,178,166,0.4)]' : 'bg-background border-2 border-white/10 text-white/30'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-medium uppercase tracking-wider hidden sm:block ${
                    idx <= currentStep ? 'text-primary' : 'text-white/30'
                  }`}>{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          <motion.div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 backdrop-blur-2xl">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Welcome to Renova</h2>
                      <p className="text-muted-foreground">Let's build your health profile to personalize your experience.</p>
                    </div>
                    <div className="space-y-4">
                      <InputField label="Full Name" name="name" />
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Age" name="age" type="number" />
                        <InputField label="Occupation" name="occupation" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Height (cm)" name="heightCm" type="number" />
                        <InputField label="Weight (kg)" name="weightKg" type="number" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Health Baseline</h2>
                      <p className="text-muted-foreground">Any existing conditions or medications we should know about?</p>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex gap-3 text-sm text-primary/90">
                        <Activity className="w-5 h-5 shrink-0" />
                        <p>For this demo, conditions are pre-populated as Asthma and Pre-diabetes.</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Chronic Conditions</label>
                        <div className="flex flex-wrap gap-2">
                          {form.getValues('conditions').map(c => (
                            <span key={c} className="px-3 py-1.5 rounded-full bg-white/10 text-white text-sm border border-white/10">{c}</span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Current Medications</label>
                        <div className="flex flex-wrap gap-2">
                          {form.getValues('medications').map(m => (
                            <span key={m} className="px-3 py-1.5 rounded-full bg-white/10 text-white text-sm border border-white/10">{m}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Your Objectives</h2>
                      <p className="text-muted-foreground">What do you want to achieve with Renova?</p>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        {form.getValues('goals').map((goal, i) => (
                          <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</div>
                            <span className="text-white">{goal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Connect Devices</h2>
                      <p className="text-muted-foreground">Link your wearable for continuous physiological monitoring.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="p-6 rounded-2xl bg-white/5 border border-primary/30 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50"></div>
                        <Watch className="w-16 h-16 text-primary relative z-10" />
                        <div className="relative z-10">
                          <h3 className="text-lg font-bold text-white">Oura Ring Connected</h3>
                          <p className="text-sm text-muted-foreground mt-1">Syncing HR, HRV, Sleep & Temperature</p>
                        </div>
                        <div className="relative z-10 px-4 py-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider border border-green-500/30">
                          Active
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-6 flex justify-between items-center border-t border-white/10">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                  className={`text-white/70 hover:text-white hover:bg-white/10 ${currentStep === 0 ? 'invisible' : ''}`}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={saveProfile.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-base font-semibold shadow-[0_0_20px_rgba(31,178,166,0.3)] transition-all flex items-center gap-2 group"
                >
                  {saveProfile.isPending ? 'Saving...' : currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
                  {!saveProfile.isPending && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </div>

            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
