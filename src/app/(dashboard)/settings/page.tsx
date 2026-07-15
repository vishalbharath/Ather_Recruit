import * as React from "react";
import { getActiveWorkspace } from "@/lib/roles";
import { redirect } from "next/navigation";
import { SettingsClient } from "@/components/dashboard/settings-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Workspace Settings | Aether Recruiter Workspace",
  description: "Configure billing details, set notification checkbox parameters, and view active sessions API keys.",
};

export default async function SettingsPage() {
  const workspace = await getActiveWorkspace();
  if (!workspace) {
    redirect("/sign-in");
  }

  const { user, organization, role } = workspace;

  const userPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    metadata: user.metadata || {},
  };

  const orgPayload = {
    id: organization.id,
    name: organization.name,
  };

  return <SettingsClient user={userPayload} organization={orgPayload} role={role} />;
}
