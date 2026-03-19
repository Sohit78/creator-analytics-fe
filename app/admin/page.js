"use client";

import { useEffect, useState } from "react";
import AppShell from "../../components/AppShell";
import { api } from "../../lib/api";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [creators, setCreators] = useState([]);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [usersRes, creatorsRes, dashboardRes] = await Promise.all([
        api.listUsers(),
        api.listCreators(),
        api.dashboardAnalytics()
      ]);

      setUsers(usersRes.users || []);
      setCreators(creatorsRes.creators || []);
      setTotals(dashboardRes.totals || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const disableUser = async (id) => {
    try {
      await api.disableUser(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AppShell adminOnly>
      {() => (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <p className="text-sm text-slate-600">Platform-wide visibility for users, creators, and analytics totals.</p>
          </div>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {loading ? <p className="text-slate-600">Loading admin data...</p> : null}

          {totals ? (
            <section className="grid gap-4 md:grid-cols-3">
              <div className="card">
                <p className="text-sm text-slate-500">Total Creators</p>
                <p className="mt-2 text-3xl font-bold">{totals.totalCreators}</p>
              </div>
              <div className="card">
                <p className="text-sm text-slate-500">Total Followers</p>
                <p className="mt-2 text-3xl font-bold">{totals.totalFollowers.toLocaleString()}</p>
              </div>
              <div className="card">
                <p className="text-sm text-slate-500">Avg Engagement Rate</p>
                <p className="mt-2 text-3xl font-bold">{totals.averageEngagementRate}%</p>
              </div>
            </section>
          ) : null}

          <section className="card overflow-x-auto">
            <h3 className="text-lg font-semibold">Users</h3>
            <table className="mt-4 min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100">
                    <td className="py-2 pr-4">{user.name}</td>
                    <td className="py-2 pr-4">{user.email}</td>
                    <td className="py-2 pr-4">{user.role}</td>
                    <td className="py-2 pr-4">{user.is_disabled ? "Disabled" : "Active"}</td>
                    <td className="py-2 pr-4">
                      {!user.is_disabled ? (
                        <button type="button" className="btn-secondary px-3 py-1 text-xs" onClick={() => disableUser(user.id)}>
                          Disable
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="card overflow-x-auto">
            <h3 className="text-lg font-semibold">All Creators</h3>
            <table className="mt-4 min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Owner</th>
                  <th className="py-2 pr-4">Platform</th>
                  <th className="py-2 pr-4">Followers</th>
                  <th className="py-2 pr-4">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {creators.map((creator) => (
                  <tr key={creator.id} className="border-b border-slate-100">
                    <td className="py-2 pr-4">{creator.name}</td>
                    <td className="py-2 pr-4">{creator.owner_name || "-"}</td>
                    <td className="py-2 pr-4">{creator.platform}</td>
                    <td className="py-2 pr-4">{creator.followers ? Number(creator.followers).toLocaleString() : "-"}</td>
                    <td className="py-2 pr-4">
                      {creator.engagement_rate ? `${Number(creator.engagement_rate).toFixed(2)}%` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}
    </AppShell>
  );
}
