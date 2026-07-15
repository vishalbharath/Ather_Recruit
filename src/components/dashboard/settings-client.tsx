"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileSettingsSchema,
  orgSettingsSchema,
  notificationPreferencesSchema,
  ProfileSettingsInput,
  OrgSettingsInput,
  NotificationPreferencesInput,
} from "@/lib/validators/settings";
import {
  updateProfileSettingsAction,
  updateOrganizationSettingsAction,
  updateNotificationSettingsAction,
} from "@/app/actions/settings";
import { toast } from "@/lib/toast";
import {
  User,
  Building2,
  Palette,
  Bell,
  Shield,
  Key,
  CreditCard,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

interface SettingsClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    metadata: any;
  };
  organization: {
    id: string;
    name: string;
  };
  role: string;
}

type TabType = "profile" | "org" | "appearance" | "notifications" | "security";

export function SettingsClient({ user, organization, role }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Forms setup
  const profileForm = useForm<ProfileSettingsInput>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: user.name,
      phone: "",
    },
  });

  const orgForm = useForm<OrgSettingsInput>({
    resolver: zodResolver(orgSettingsSchema),
    defaultValues: {
      name: organization.name,
    },
  });

  const savedPref = user.metadata?.notificationPreferences || {};
  const notifyForm = useForm<NotificationPreferencesInput>({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues: {
      emailDigest: savedPref.emailDigest ?? true,
      interviewReminders: savedPref.interviewReminders ?? true,
      candidateAlerts: savedPref.candidateAlerts ?? true,
    },
  });

  // Submit profile details
  const onProfileSubmit = async (values: ProfileSettingsInput) => {
    setLoading(true);
    try {
      await updateProfileSettingsAction(values);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile settings");
    } finally {
      setLoading(false);
    }
  };

  // Submit organization details
  const onOrgSubmit = async (values: OrgSettingsInput) => {
    setLoading(true);
    try {
      await updateOrganizationSettingsAction(values);
      toast.success("Organization workspace details updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update organization");
    } finally {
      setLoading(false);
    }
  };

  // Submit notifications checkboxes
  const onNotifySubmit = async (values: NotificationPreferencesInput) => {
    setLoading(true);
    try {
      await updateNotificationSettingsAction(values);
      toast.success("Notification preferences updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKey = () => {
    const key = `inf_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(key);
    toast.success("API access token generated successfully");
  };

  const tabs = [
    { id: "profile" as TabType, label: "User Profile", icon: User },
    { id: "org" as TabType, label: "Organization Settings", icon: Building2 },
    { id: "appearance" as TabType, label: "Appearance", icon: Palette },
    { id: "notifications" as TabType, label: "Notifications Preferences", icon: Bell },
    { id: "security" as TabType, label: "Security & API Tokens", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Title bar */}
      <div className="border-b border-border/40 pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
          Workspace Settings
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Manage user profiles, customize organization workspaces, toggle active preferences, and generate API keys.
        </p>
      </div>

      {/* Settings layout grids */}
      <div className="grid gap-6 md:grid-cols-4 items-start">
        {/* Sidebar tabs */}
        <div className="space-y-1.5 md:col-span-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-tight transition-colors cursor-pointer text-left",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-zinc-900/10 dark:hover:bg-zinc-800/10"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form content box */}
        <div className="md:col-span-3 rounded-xl border border-border bg-card p-6 min-h-[400px]">
          {/* PROFILE SETTINGS TAB */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-tight font-display">
                  Profile Details
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Update candidate contact coordinates for evaluation notifications.
                </p>
              </div>

              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      {...profileForm.register("name")}
                      className="w-full h-9 rounded-md border border-border bg-zinc-950 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors"
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-[10px] text-destructive">{profileForm.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full h-9 rounded-md border border-border bg-zinc-950/60 px-3 text-xs text-muted-foreground outline-none cursor-not-allowed"
                    />
                    <p className="text-[9px] text-zinc-500 mt-1">Email updates are handled securely by Clerk Identity.</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border/10">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/95 transition-colors gap-2 cursor-pointer"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />} Save Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ORGANIZATION TAB */}
          {activeTab === "org" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-tight font-display">
                  Organization Settings
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Configure corporate workspaces properties, roles, and upgrade billing parameters.
                </p>
              </div>

              <form onSubmit={orgForm.handleSubmit(onOrgSubmit)} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Company Workspace Name</label>
                  <input
                    type="text"
                    disabled={role === "HIRING_MANAGER"}
                    {...orgForm.register("name")}
                    className="w-full h-9 rounded-md border border-border bg-zinc-950 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors disabled:opacity-60"
                  />
                  {role === "HIRING_MANAGER" && (
                    <p className="text-[9px] text-destructive mt-1">Hiring managers are restricted from editing workspace titles.</p>
                  )}
                  {orgForm.formState.errors.name && (
                    <p className="text-[10px] text-destructive">{orgForm.formState.errors.name.message}</p>
                  )}
                </div>

                <hr className="border-border/40" />

                {/* Billing Summary */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5" /> Billing & Plan Summary
                  </h4>
                  <div className="rounded-xl border border-border bg-zinc-950/20 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground text-xs">Growth Tier (Premium SaaS Plan)</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Billed monthly: $49/month • Active for 8 seats</p>
                    </div>
                    <button
                      type="button"
                      disabled
                      className="inline-flex h-8 items-center justify-center rounded border border-border bg-zinc-900/10 px-3 text-[10px] font-semibold text-muted-foreground cursor-not-allowed"
                    >
                      Manage billing portal
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border/10">
                  <button
                    type="submit"
                    disabled={loading || role === "HIRING_MANAGER"}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/95 transition-colors gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />} Save organization
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-tight font-display">
                  Appearance & Design Systems
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Customize the interface theme controls and dashboard accents.
                </p>
              </div>

              <div className="space-y-6">
                {/* Theme Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Dark / Light Mode toggle
                  </label>
                  <div className="flex items-center rounded-lg border border-border p-4 bg-zinc-950/10 justify-between">
                    <span className="text-xs text-muted-foreground">Select preferred interface setting</span>
                    <ThemeToggle />
                  </div>
                </div>

                <hr className="border-border/40" />

                {/* Accent Color Picker (Visual preset options) */}
                <div className="space-y-3">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Accent brand color
                  </label>
                  <div className="flex gap-3">
                    {["indigo", "violet", "emerald", "amber"].map((color) => (
                      <button
                        key={color}
                        className={cn(
                          "h-8 px-3 rounded text-[10px] font-semibold border capitalize cursor-pointer",
                          color === "indigo"
                            ? "bg-indigo-600 border-indigo-750 text-white"
                            : "bg-zinc-900 border-border text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATION PREFERENCES */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-tight font-display">
                  Notifications Preferences
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Adjust active alerts parameters.
                </p>
              </div>

              <form onSubmit={notifyForm.handleSubmit(onNotifySubmit)} className="space-y-5">
                <div className="space-y-4 rounded-lg border border-border p-4 bg-zinc-950/20">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-semibold text-foreground text-xs">Email summary updates</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Receive weekly dossiers conversions summaries.</p>
                    </div>
                    <input
                      type="checkbox"
                      {...notifyForm.register("emailDigest")}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-opacity-25"
                    />
                  </label>

                  <hr className="border-border/10" />

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-semibold text-foreground text-xs">Interview reminders</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Receive calendar notifications before bookings.</p>
                    </div>
                    <input
                      type="checkbox"
                      {...notifyForm.register("interviewReminders")}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-opacity-25"
                    />
                  </label>

                  <hr className="border-border/10" />

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-semibold text-foreground text-xs">Candidate registers alerts</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Alert me as soon as a new application lands in screening.</p>
                    </div>
                    <input
                      type="checkbox"
                      {...notifyForm.register("candidateAlerts")}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-opacity-25"
                    />
                  </label>
                </div>

                <div className="flex justify-end pt-4 border-t border-border/10">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/95 transition-colors gap-2 cursor-pointer"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />} Save preferences
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECURITY & KEYS TAB */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-tight font-display">
                  Security & API Developer Access
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Generate tokens to query job boards details externally.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Key className="h-3.5 w-3.5" /> Workspace API access keys
                  </h4>

                  <div className="rounded-xl border border-border bg-zinc-950/20 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Tokens allow fetching job opening schemas for custom careers pages.</span>
                      <button
                        onClick={handleGenerateKey}
                        className="inline-flex h-8 items-center justify-center rounded bg-primary px-3 text-[10px] font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer"
                      >
                        Generate key
                      </button>
                    </div>

                    {apiKey && (
                      <div className="p-3 bg-zinc-950 border border-border rounded-lg text-xs space-y-1 font-mono break-all text-green-400">
                        <p className="text-[9px] text-muted-foreground font-sans font-semibold uppercase tracking-wider mb-1">Generated API Secret Key:</p>
                        {apiKey}
                        <p className="text-[9px] text-zinc-500 font-sans mt-2">Make sure to save this secret token. It won't be shown again.</p>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="border-border/40" />

                {/* Active Session details */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Active Workspace Sessions</h4>
                  <div className="text-xs text-muted-foreground space-y-2.5">
                    <div className="flex items-center justify-between border border-border/40 rounded-lg p-3 bg-zinc-950/10">
                      <div>
                        <p className="font-semibold text-foreground">Windows 11 &bull; Chrome Browser</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Active session: Current device</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] text-green-400 font-semibold">
                        <CheckCircle className="h-3 w-3" /> Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
