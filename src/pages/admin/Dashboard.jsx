import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getGirls } from "../../services/girlService";

export default function Dashboard() {
  const [girls, setGirls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const data = await getGirls();

      setGirls(data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Không tải được dữ liệu Dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // STATISTICS
  // =========================

  const stats = useMemo(() => {
    const total = girls.length;

    const active = girls.filter(
      (girl) => girl.status === true
    ).length;

    const newGirls = girls.filter(
      (girl) => girl.is_new === true
    ).length;

    const withVideo = girls.filter(
      (girl) =>
        girl.has_video === true ||
        (Array.isArray(girl.videos) &&
          girl.videos.length > 0)
    ).length;

    const totalImages = girls.reduce(
      (total, girl) => {
        let count = 0;

        if (girl.image) {
          count += 1;
        }

        if (Array.isArray(girl.images)) {
          count += girl.images.length;
        }

        return total + count;
      },
      0
    );

    const totalVideos = girls.reduce(
      (total, girl) => {
        if (!Array.isArray(girl.videos)) {
          return total;
        }

        return total + girl.videos.length;
      },
      0
    );

    return {
      total,
      active,
      newGirls,
      withVideo,
      totalImages,
      totalVideos,
    };
  }, [girls]);

  const recentGirls = girls.slice(0, 5);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-zinc-700 border-t-yellow-500" />

          <p className="text-zinc-500">
            Loading dashboard...
          </p>

        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-zinc-500">
            Overview of your Mini App
          </p>
        </div>

        <div className="flex gap-3">

          <button
            type="button"
            onClick={loadDashboard}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900"
          >
            ↻ Refresh
          </button>

          <Link
            to="/admin/girls/add"
            className="rounded-lg bg-yellow-500 px-5 py-2 font-semibold text-black transition hover:bg-yellow-400"
          >
            + Add Girl
          </Link>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-900 bg-red-950/30 p-4 text-red-400">
          {error}
        </div>
      )}

      {/* MAIN STATS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Girls"
          value={stats.total}
          icon="👤"
        />

        <StatCard
          title="Active"
          value={stats.active}
          icon="●"
          valueClass="text-green-400"
        />

        <StatCard
          title="New"
          value={stats.newGirls}
          icon="✨"
          valueClass="text-yellow-400"
        />

        <StatCard
          title="With Video"
          value={stats.withVideo}
          icon="▶"
          valueClass="text-red-400"
        />

      </div>

      {/* MEDIA STATS */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-zinc-500">
                Total Images
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {stats.totalImages}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-xl">
              🖼️
            </div>

          </div>

        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-zinc-500">
                Total Videos
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {stats.totalVideos}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-xl">
              🎬
            </div>

          </div>

        </div>

      </div>

      {/* RECENT GIRLS */}

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">

        <div className="flex items-center justify-between border-b border-zinc-800 p-6">

          <div>
            <h2 className="text-xl font-bold">
              Recent Girls
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Recently added profiles
            </p>
          </div>

          <Link
            to="/admin/girls"
            className="text-sm font-semibold text-yellow-400 hover:text-yellow-300"
          >
            View All →
          </Link>

        </div>

        {recentGirls.length === 0 ? (

          <div className="p-10 text-center text-zinc-500">
            No data
          </div>

        ) : (

          <div className="divide-y divide-zinc-800">

            {recentGirls.map((girl) => (

              <div
                key={girl.id}
                className="flex items-center gap-4 p-4 transition hover:bg-zinc-800/50"
              >

                {/* IMAGE */}

                {girl.image ? (
                  <img
                    src={girl.image}
                    alt={girl.name}
                    className="h-20 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-16 items-center justify-center rounded-lg bg-zinc-800 text-xs text-zinc-500">
                    No Image
                  </div>
                )}

                {/* INFO */}

                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <h3 className="font-semibold">
                      {girl.name || "Unnamed"}
                    </h3>

                    {girl.is_new && (
                      <span className="rounded-full bg-yellow-500/15 px-2 py-1 text-[10px] font-bold text-yellow-400">
                        NEW
                      </span>
                    )}

                    {girl.has_video && (
                      <span className="rounded-full bg-red-500/15 px-2 py-1 text-[10px] font-bold text-red-400">
                        VIDEO
                      </span>
                    )}

                  </div>

                  <p className="mt-1 text-sm text-zinc-500">
                    {girl.code || "-"}
                    {" • "}
                    {girl.area || "-"}
                    {" • "}
                    {girl.location || "-"}
                  </p>

                  <p className="mt-1 text-sm font-medium text-zinc-300">
                    {girl.price || "-"}
                  </p>

                </div>

                {/* STATUS */}

                <div className="hidden sm:block">

                  {girl.status ? (
                    <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-xs text-zinc-400">
                      Hidden
                    </span>
                  )}

                </div>

                {/* EDIT */}

                <Link
                  to={`/admin/girls/edit/${girl.id}`}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition hover:border-yellow-500 hover:text-yellow-400"
                >
                  Edit
                </Link>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}


// =========================
// STAT CARD
// =========================

function StatCard({
  title,
  value,
  icon,
  valueClass = "",
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-700">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-zinc-400">
            {title}
          </p>

          <h2
            className={`mt-3 text-4xl font-bold ${valueClass}`}
          >
            {value}
          </h2>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-800">
          {icon}
        </div>

      </div>

    </div>
  );
}