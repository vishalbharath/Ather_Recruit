"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  Calendar,
  Send,
  ArrowUpRight,
  Video,
  Clock,
  Activity,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { DashboardData } from "@/lib/dashboard-data";
import Link from "next/link";

interface OverviewClientProps {
  data: DashboardData;
}

const PIE_COLORS = ["#6366f1", "#00f2fe", "#3b82f6", "#10b981"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export function OverviewClient({ data }: OverviewClientProps) {
  const { stats, funnelData, monthlyHiringData, sourceData, upcomingInterviews, recentActivity } = data;

  const cards = [
    {
      title: "Total Candidates",
      value: stats.totalCandidates.value,
      sub: stats.totalCandidates.change,
      icon: Users,
      colorClass: "text-primary bg-primary/10 border-primary/20",
    },
    {
      title: "Active Openings",
      value: stats.openJobs.value,
      sub: stats.openJobs.change,
      icon: Briefcase,
      colorClass: "text-accent bg-accent/10 border-accent/20",
    },
    {
      title: "Offers Extended",
      value: stats.offersSent.value,
      sub: stats.offersSent.change,
      icon: Send,
      colorClass: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Today's Interviews",
      value: stats.todaysInterviews.value,
      sub: stats.todaysInterviews.change,
      icon: Calendar,
      colorClass: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Dynamic Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-display">
            Aether Recruiter Workspace
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time pipeline analytics, schedules, and recruiter coordination parameters.
          </p>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <motion.div variants={itemVariants} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border bg-card p-6 transition-all hover:border-zinc-800 hover:shadow-lg relative overflow-hidden group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${card.colorClass}`}>
                <card.icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {card.value.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {card.sub}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Primary Chart Block */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Hiring Trends Area Chart */}
        <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                Monthly Hiring & Sourcing Velocity
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Compares hired candidates versus newly sourced profiles.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-primary rounded-full" />
                <span className="text-muted-foreground">Sourced</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-accent rounded-full" />
                <span className="text-muted-foreground">Hired</span>
              </div>
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyHiringData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSourced" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(9, 9, 11, 0.9)",
                    borderColor: "rgba(36, 36, 39, 0.8)",
                    color: "#ffffff",
                    borderRadius: "8px",
                    backdropFilter: "blur(12px)",
                    fontSize: "11px",
                  }}
                />
                <Area type="monotone" dataKey="sourced" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSourced)" />
                <Area type="monotone" dataKey="hired" stroke="#00f2fe" strokeWidth={2} fillOpacity={1} fill="url(#colorHired)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Source Channels Pie Chart */}
        <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              Candidate Channels Breakdown
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Volume comparison by application origin.
            </p>
          </div>
          
          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(9, 9, 11, 0.9)",
                    borderColor: "rgba(36, 36, 39, 0.8)",
                    color: "#ffffff",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-foreground">
                {sourceData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                Profiles
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-[11px]">
            {sourceData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                />
                <span className="text-muted-foreground truncate">{item.name}</span>
                <span className="font-semibold text-foreground ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Secondary Chart Block & Timeline Panels */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attrition Funnel Chart */}
        <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card p-6 lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              Recruitment Conversion Funnel
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Candidate volume and attrition drops by pipeline phase.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} barSize={40} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="stage" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  contentStyle={{
                    backgroundColor: "rgba(9, 9, 11, 0.9)",
                    borderColor: "rgba(36, 36, 39, 0.8)",
                    color: "#ffffff",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="count" fill="url(#funnelGradient)" radius={[6, 6, 0, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === funnelData.length - 1 ? "#10b981" : "#6366f1"}
                      fillOpacity={0.8 - (index * 0.1)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Dynamic Activity and Events Widget Panel */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Upcoming Events Box */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
              <Calendar className="h-4 w-4 text-yellow-500" /> Upcoming Interviews
            </h3>
            
            <div className="space-y-4">
              {upcomingInterviews.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No interviews scheduled</p>
              ) : (
                upcomingInterviews.map((int) => (
                  <div key={int.id} className="flex items-start gap-3 border-b border-border/40 pb-3 last:border-0 last:pb-0 text-xs">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded bg-zinc-900 border border-border/40 text-muted-foreground">
                      <Clock className="h-4.5 w-4.5" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{int.candidateName}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{int.jobTitle}</p>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {new Date(int.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {int.videoLink && (
                          <a
                            href={int.videoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary flex items-center gap-0.5 hover:underline"
                          >
                            <Video className="h-3 w-3" /> Meet <ExternalLink className="h-2 w-2" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Audit Activities */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" /> Recent Activity
            </h3>
            
            <div className="space-y-3">
              {recentActivity.map((act) => (
                <div key={act.id} className="text-xs flex items-start gap-2 last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium break-words">{act.details}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {act.user} &bull; {act.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
