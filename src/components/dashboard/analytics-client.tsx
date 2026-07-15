"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Clock,
  CheckSquare,
  Percent,
  Calendar,
  Layers,
  ArrowUpRight,
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
  LineChart,
  Line,
  Legend,
} from "recharts";
import { AnalyticsData } from "@/lib/analytics-data";
import { cn } from "@/lib/utils";

interface AnalyticsClientProps {
  data: AnalyticsData;
}

const PIE_COLORS = ["#6366f1", "#00f2fe", "#3b82f6", "#10b981", "#f59e0b"];

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export function AnalyticsClient({ data }: AnalyticsClientProps) {
  const {
    applicationsPerMonth,
    hiringFunnel,
    candidateSources,
    departmentHiring,
    offerAcceptance,
    timeToHire,
    interviewSuccess,
    kpis,
  } = data;

  const kpiCards = [
    {
      title: "Avg Time to Hire",
      value: `${kpis.avgTimeToHire} Days`,
      sub: "From application to offer signature",
      icon: Clock,
      color: "text-primary bg-primary/10 border-primary/20",
    },
    {
      title: "Offer Acceptance",
      value: `${kpis.offerAcceptanceRate}%`,
      sub: "Total signed offers vs extended",
      icon: CheckSquare,
      color: "text-accent bg-accent/10 border-accent/20",
    },
    {
      title: "Overall Conversion",
      value: `${kpis.conversionRate}%`,
      sub: "Applicants successfully hired",
      icon: Percent,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Interviews Conducted",
      value: kpis.interviewsConducted,
      sub: "Evaluations recorded in workspace",
      icon: Calendar,
      color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Title bar */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-display">
            Workspace Recruitment Analytics
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Deep-dive audits into sourcing channel conversions, department hires, and hiring velocity.
          </p>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <motion.div variants={itemVariants} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border bg-card p-6 transition-all hover:border-zinc-800 hover:shadow-lg relative overflow-hidden group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${card.color}`}>
                <card.icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {card.value}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {card.sub}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Applications per Month */}
        <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-primary" /> Application Pipeline Volume
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              Monthly candidate registration numbers over time.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={applicationsPerMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
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
                    fontSize: "11px",
                  }}
                />
                <Area type="monotone" dataKey="count" name="Applications" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Hiring Funnel stage drop */}
        <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-accent" /> Funnel Stage Conversion
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              Conversion yields and stage drops from Applied to Hired.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hiringFunnel} barSize={35} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="count" name="Candidates" fill="#00f2fe" fillOpacity={0.85} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Time to Hire Line Chart */}
        <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-blue-500" /> Sourcing Velocity (Time to Hire)
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              Average duration in days to complete a hired onboarding.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeToHire} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(9, 9, 11, 0.9)",
                    borderColor: "rgba(36, 36, 39, 0.8)",
                    color: "#ffffff",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Line type="monotone" dataKey="avgDays" name="Avg Days" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Department Hiring Double Bar Chart */}
        <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-yellow-500" /> Department Breakdown
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              Active open roles versus total hires by department.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentHiring} barGap={4} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="department" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.01)" }}
                  contentStyle={{
                    backgroundColor: "rgba(9, 9, 11, 0.9)",
                    borderColor: "rgba(36, 36, 39, 0.8)",
                    color: "#ffffff",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="hires" name="Hires" fill="#10b981" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                <Bar dataKey="openings" name="Open Openings" fill="#f59e0b" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Candidate Sourcing Channels Pie */}
        <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              Sourcing Channels Conversion
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Ratio breakdown of profile origins.
            </p>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={candidateSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {candidateSources.map((entry, index) => (
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
              <span className="text-xl font-bold text-foreground">Channels</span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">Yield ratio</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] pt-4">
            {candidateSources.map((item, idx) => (
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

        {/* Offer Acceptance Rate Pie Chart */}
        <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              Offer Acceptance Ratios
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Ratio metrics of offers signed vs declined.
            </p>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={offerAcceptance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
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
              <span className="text-2xl font-bold text-green-400">{kpis.offerAcceptanceRate}%</span>
              <span className="text-[8px] text-muted-foreground uppercase tracking-widest font-semibold">
                Acceptance
              </span>
            </div>
          </div>

          <div className="flex justify-around text-[11px] pt-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Accepted ({offerAcceptance[0]?.value})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Declined ({offerAcceptance[1]?.value})</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
