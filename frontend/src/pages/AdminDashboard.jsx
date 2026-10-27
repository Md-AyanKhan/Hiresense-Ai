import { ShieldAlert, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "../api/client.js";
import ChartPanel from "../components/ChartPanel.jsx";
import { BarChart } from "../components/Charts.jsx";
import EmptyState from "../components/EmptyState.jsx";
import GlassCard from "../components/GlassCard.jsx";
import MetricCard from "../components/MetricCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDate } from "../utils/formatters.js";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([adminApi.stats(), adminApi.users()])
      .then(([statsResponse, usersResponse]) => {
        setStats(statsResponse.data);
        setUsers(usersResponse.data);
      })
      .catch(() => {});
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <>
        <PageHeader eyebrow="Admin" title="Admin Dashboard" description="Admin access is reserved for the configured developer account." />
        <EmptyState title="Admin role required" description="Sign up or login with the configured admin email to view platform analytics." />
      </>
    );
  }

  const activityMap = Object.fromEntries((stats?.recent_activity || []).map((item) => [item.date.slice(5), item.analyses]));

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Usage & User Analytics"
        description="View users, analysis volume, average scores, and recent activity."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Users" value={stats?.total_users || 0} detail="Registered accounts" icon={UsersRound} tone="mint" />
        <MetricCard label="Analyses" value={stats?.total_analyses || 0} detail="Reports generated" icon={ShieldAlert} tone="coral" />
        <MetricCard label="Avg ATS" value={stats?.average_ats_score || 0} detail="Across all reports" tone="amber" />
        <MetricCard label="Avg Match" value={`${stats?.average_match_percentage || 0}%`} detail="Resume to JD" tone="sky" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <ChartPanel title="Recent Activity" subtitle="Analyses generated over the last seven days">
          <BarChart dataMap={activityMap} />
        </ChartPanel>
        <GlassCard>
          <h2 className="text-xl font-bold">Users</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-white/40">
                <tr>
                  <th className="py-3">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Analyses</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((item) => (
                  <tr key={item.id} className="text-white/70">
                    <td className="py-3 font-semibold text-white">{item.full_name}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td>{item.analysis_count}</td>
                    <td>{formatDate(item.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
