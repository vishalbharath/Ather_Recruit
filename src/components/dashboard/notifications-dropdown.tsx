"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell, Calendar, Users, FileCheck, Info, Check, Loader2 } from "lucide-react";
import { getNotificationsAction, markNotificationReadAction, markAllNotificationsReadAction } from "@/app/actions/notifications";
import { toast } from "@/lib/toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications list
  const fetchNotifications = async () => {
    try {
      const res = await getNotificationsAction();
      if (res.success) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount ?? 0);
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 30 seconds for simulated real-time updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  const handleMarkRead = async (e: React.MouseEvent, id: string, link: string | null) => {
    e.stopPropagation();
    try {
      await markNotificationReadAction(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      if (link) {
        window.location.href = link;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to mark notification as read");
    }
  };

  const handleMarkAllRead = async () => {
    setLoading(true);
    try {
      await markAllNotificationsReadAction();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (err: any) {
      toast.error(err.message || "Failed to update notifications");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "INTERVIEW_SCHEDULED":
        return <Calendar className="h-4 w-4 text-blue-400" />;
      case "NEW_APPLICATION":
        return <Users className="h-4 w-4 text-amber-400" />;
      case "FEEDBACK_REQUIRED":
        return <Info className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileCheck className="h-4 w-4 text-green-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button Icon */}
      <button
        onClick={handleToggle}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/40 bg-zinc-900/10 text-muted-foreground hover:text-foreground dark:hover:bg-zinc-800/40 hover:bg-zinc-900/20 transition-colors cursor-pointer"
        aria-label="View notifications dropdown"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-destructive" />
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-card shadow-2xl z-50 overflow-hidden flex flex-col max-h-96"
          >
            {/* Header */}
            <div className="flex h-12 items-center justify-between px-4 border-b border-border/40 bg-zinc-900/5 flex-shrink-0">
              <span className="text-xs font-semibold text-foreground tracking-tight">
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={loading}
                  className="text-[10px] text-primary hover:underline font-medium inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-3 w-3" /> Mark all read
                    </>
                  )}
                </button>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/40">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  You are all caught up! No notifications.
                </div>
              ) : (
                notifications.map((n) => {
                  const isUnread = !n.readAt;
                  return (
                    <div
                      key={n.id}
                      onClick={(e) => handleMarkRead(e, n.id, n.link)}
                      className={cn(
                        "p-4 text-xs flex gap-3 cursor-pointer hover:bg-zinc-900/10 dark:hover:bg-zinc-800/10 transition-colors relative",
                        isUnread && "bg-primary/5 hover:bg-primary/10"
                      )}
                    >
                      {/* Left Icon circle */}
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-950 border border-border/40">
                        {getIcon(n.type)}
                      </div>

                      {/* Text details */}
                      <div className="space-y-1 flex-1 min-w-0 pr-2">
                        <p className="font-semibold text-foreground truncate pr-2">
                          {n.title}
                        </p>
                        <p className="text-muted-foreground leading-relaxed text-[11px] line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-zinc-500 pt-0.5">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Unread circle dot */}
                      {isUnread && (
                        <span className="absolute top-4 right-4 h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
