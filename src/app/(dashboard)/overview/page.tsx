import * as React from "react";
import { getDashboardData } from "@/lib/dashboard-data";
import { OverviewClient } from "@/components/dashboard/overview-client";

// Set page to dynamic rendering to guarantee live updates from database
export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const data = await getDashboardData();

  return <OverviewClient data={data} />;
}
