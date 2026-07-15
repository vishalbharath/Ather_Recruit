import * as React from "react";
import { getDashboardData } from "@/lib/dashboard-data";
import { OverviewClient } from "@/components/dashboard/overview-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Recruitment Overview | Aether Recruiter Workspace",
  description: "Monitor candidate hiring pipelines, recent applications activity, and upcoming interviewer sync events.",
};

export default async function OverviewPage() {
  const data = await getDashboardData();

  return <OverviewClient data={data} />;
}
