import * as React from "react";
import dynamic from "next/dynamic";
import { getAnalyticsData } from "@/lib/analytics-data";
import AnalyticsLoading from "./loading";

export const forceDynamic = "force-dynamic";

export const metadata = {
  title: "Recruitment Analytics | Aether Recruiter Workspace",
  description: "Audits into sourcing channels, interview conversion metrics, and time-to-hire speeds.",
};

// Lazy load the charts client component to defer loading Recharts from initial bundle
const AnalyticsClient = dynamic(
  () => import("@/components/dashboard/analytics-client").then((m) => m.AnalyticsClient),
  {
    loading: () => <AnalyticsLoading />,
  }
);

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return <AnalyticsClient data={data} />;
}
