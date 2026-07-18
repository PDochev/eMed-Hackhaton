import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useGetSocialGroups, useGetSocialChallenges, useGetAccountabilityPartners, getGetSocialGroupsQueryKey, getGetSocialChallengesQueryKey, getGetAccountabilityPartnersQueryKey } from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { Users, Trophy, Target, MapPin, Calendar, Flame } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Social() {
  const { data: groups, isLoading: groupsLoading } = useGetSocialGroups({ query: { queryKey: getGetSocialGroupsQueryKey() } });
  const { data: challenges, isLoading: challengesLoading } = useGetSocialChallenges({ query: { queryKey: getGetSocialChallengesQueryKey() } });
  const { data: partners, isLoading: partnersLoading } = useGetAccountabilityPartners({ query: { queryKey: getGetAccountabilityPartnersQueryKey() } });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AppLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-8">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-white tracking-tight">Social Wellbeing</h1>
          <p className="text-muted-foreground mt-1">Health is a team sport. Connect, compete, and recover together.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Nearby Groups */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Nearby Groups</h2>
            </div>
            <div className="space-y-4">
              {groupsLoading ? (
                Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl bg-white/5" />)
              ) : groups?.map(group => (
                <div key={group.id} className="glass-card rounded-2xl p-5 border border-white/10 hover:border-primary/30 transition-colors group cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <h3 className="font-medium text-white text-lg">{group.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{group.description}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center bg-white/5 px-2 py-1 rounded"><MapPin className="w-3 h-3 mr-1" /> {group.distanceKm}km away</span>
                      <span className="flex items-center bg-white/5 px-2 py-1 rounded"><Users className="w-3 h-3 mr-1" /> {group.memberCount} members</span>
                      <span className="flex items-center bg-white/5 px-2 py-1 rounded"><Calendar className="w-3 h-3 mr-1" /> {new Date(group.nextMeeting).toLocaleDateString(undefined, { weekday: 'short', hour: 'numeric', minute: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Community Challenges */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold">Active Challenges</h2>
            </div>
            <div className="space-y-4">
              {challengesLoading ? (
                Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl bg-white/5" />)
              ) : challenges?.map(challenge => (
                <div key={challenge.id} className="glass-card rounded-2xl p-5 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white">{challenge.title}</h3>
                    <span className="text-xs font-medium text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
                      {challenge.daysRemaining} days left
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white">Your Progress</span>
                      <span className="text-primary font-medium">{challenge.userProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-[#3b82f6] rounded-full" 
                        style={{ width: `${challenge.userProgress}%` }} 
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-right">{challenge.participants} participants</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Accountability Partners */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Target className="w-5 h-5 text-[#3b82f6]" />
              <h2 className="text-lg font-semibold">Accountability Partners</h2>
            </div>
            <div className="space-y-4">
              {partnersLoading ? (
                Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl bg-white/5" />)
              ) : partners?.map(partner => (
                <div key={partner.id} className="glass-card rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-semibold text-white border-2 border-primary/30">
                      {partner.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{partner.name}</h3>
                    <p className="text-xs text-primary mt-0.5">
                      {partner.healthScoreSimilarity}% similarity match
                    </p>
                    <div className="flex gap-1 mt-2">
                      {partner.sharedGoals.map((goal, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground truncate max-w-[80px]">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-500 mb-1" />
                    <span className="text-xs font-bold text-white">{partner.streak}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
