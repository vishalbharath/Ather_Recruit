import * as React from "react";
import { checkAndSyncUser } from "@/lib/auth-sync";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sync = await checkAndSyncUser();
  if (!sync || !sync.dbUser) {
    redirect("/sign-in");
  }

  const { dbUser } = sync;
  const activeOrg = dbUser.memberships[0]?.organization;
  const organizationName = activeOrg ? activeOrg.name : "Personal Workspace";

  const userPayload = {
    name: dbUser.name,
    email: dbUser.email,
    avatarUrl: dbUser.avatarUrl,
  };

  return (
    <DashboardShell user={userPayload} organizationName={organizationName}>
      {children}
    </DashboardShell>
  );
}
