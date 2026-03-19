"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "../../../components/AppShell";
import { CreatorTrendsChart } from "../../../components/Charts";
import { api } from "../../../lib/api";

export default function CreatorDetailsPage() {
  const params = useParams();
  const creatorId = params?.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.creatorAnalytics(creatorId);
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!creatorId) {
      return;
    }

    load();
  }, [creatorId]);

  const handleRefresh = async () => {
    try {
      setError("");
      setRefreshing(true);
      await api.refreshCreatorAnalytics(creatorId);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <AppShell>
      {() => (
        <div className="space-y-6">
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {loading ? <p className="text-slate-600">Loading creator data...</p> : null}

          {data?.creator ? (
            <>
              <section className="card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {data.creator.profile_image_url ? (
                      <img
                        src={data.creator.profile_image_url}
                        alt={data.creator.name}
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-xl bg-slate-200" />
                    )}
                    <div>
                      <h2 className="text-2xl font-bold">{data.creator.name}</h2>
                      <p className="text-sm text-slate-600">
                        {data.creator.platform} - @{data.creator.username}
                      </p>
                    </div>
                  </div>

                  <button type="button" className="btn-primary" onClick={handleRefresh} disabled={refreshing}>
                    {refreshing ? "Refreshing..." : "Refresh Analytics"}
                  </button>
                </div>
              </section>

              {data.analytics ? (
                <>
                  <section className="grid gap-4 md:grid-cols-4">
                    <div className="card">
                      <p className="text-sm text-slate-500">Followers</p>
                      <p className="mt-2 text-2xl font-bold">{Number(data.analytics.followers).toLocaleString()}</p>
                    </div>
                    <div className="card">
                      <p className="text-sm text-slate-500">Engagement Rate</p>
                      <p className="mt-2 text-2xl font-bold">{Number(data.analytics.engagement_rate).toFixed(2)}%</p>
                    </div>
                    <div className="card">
                      <p className="text-sm text-slate-500">Avg Likes</p>
                      <p className="mt-2 text-2xl font-bold">{Number(data.analytics.avg_likes).toLocaleString()}</p>
                    </div>
                    <div className="card">
                      <p className="text-sm text-slate-500">Avg Comments</p>
                      <p className="mt-2 text-2xl font-bold">{Number(data.analytics.avg_comments).toLocaleString()}</p>
                    </div>
                  </section>

                  <section>
                    <CreatorTrendsChart data={data.analytics.historical_data || []} />
                    <p className="mt-2 text-xs text-slate-500">
                      Last updated: {new Date(data.analytics.last_updated).toLocaleString()}
                    </p>
                  </section>
                </>
              ) : (
                <p className="text-slate-600">No analytics found yet.</p>
              )}
            </>
          ) : null}
        </div>
      )}
    </AppShell>
  );
}
