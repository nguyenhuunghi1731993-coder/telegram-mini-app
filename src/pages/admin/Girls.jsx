import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getGirls,
  deleteGirl,
  updateGirl,
} from "../../services/girlService";

export default function Girls() {
  const [girls, setGirls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [area, setArea] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    loadGirls();
  }, []);

  // =========================
  // LOAD
  // =========================

  async function loadGirls() {
    try {
      setLoading(true);

      const data = await getGirls();

      setGirls(data || []);
    } catch (err) {
      console.error(err);

      alert(
        err.message ||
          "Không tải được dữ liệu."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // DELETE
  // =========================

  async function handleDelete(girl) {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa "${girl.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(girl.id);

      await deleteGirl(girl.id);

      setGirls((prev) =>
        prev.filter(
          (item) => item.id !== girl.id
        )
      );
    } catch (err) {
      console.error(err);

      alert(
        err.message ||
          "Không thể xóa."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =========================
  // ACTIVE / HIDDEN
  // =========================

  async function toggleStatus(girl) {
    try {
      setUpdatingId(girl.id);

      const newStatus = !girl.status;

      await updateGirl(girl.id, {
        status: newStatus,
      });

      setGirls((prev) =>
        prev.map((item) =>
          item.id === girl.id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);

      alert(
        err.message ||
          "Không thể cập nhật trạng thái."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  // =========================
  // AREA LIST
  // =========================

  const areas = useMemo(() => {
    return [
      ...new Set(
        girls
          .map((girl) => girl.area)
          .filter(Boolean)
      ),
    ];
  }, [girls]);

  // =========================
  // FILTER + SEARCH + SORT
  // =========================

  const filteredGirls = useMemo(() => {
    let result = [...girls];

    const keyword = search
      .trim()
      .toLowerCase();

    if (keyword) {
      result = result.filter((girl) => {
        const content = [
          girl.code,
          girl.name,
          girl.area,
          girl.location,
          girl.price,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return content.includes(keyword);
      });
    }

    if (filter === "active") {
      result = result.filter(
        (girl) => girl.status === true
      );
    }

    if (filter === "hidden") {
      result = result.filter(
        (girl) => girl.status !== true
      );
    }

    if (filter === "new") {
      result = result.filter(
        (girl) => girl.is_new === true
      );
    }

    if (filter === "video") {
      result = result.filter(
        (girl) =>
          girl.has_video === true ||
          (Array.isArray(girl.videos) &&
            girl.videos.length > 0)
      );
    }

    if (area !== "all") {
      result = result.filter(
        (girl) => girl.area === area
      );
    }

    if (sort === "name") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(
          b.name || ""
        )
      );
    }

    if (sort === "code") {
      result.sort((a, b) =>
        (a.code || "").localeCompare(
          b.code || ""
        )
      );
    }

    if (sort === "oldest") {
      result.reverse();
    }

    return result;
  }, [
    girls,
    search,
    filter,
    area,
    sort,
  ]);

  // =========================
  // COUNTS
  // =========================

  const activeCount = girls.filter(
    (girl) => girl.status === true
  ).length;

  const hiddenCount =
    girls.length - activeCount;

  const newCount = girls.filter(
    (girl) => girl.is_new === true
  ).length;

  const videoCount = girls.filter(
    (girl) =>
      girl.has_video === true ||
      (Array.isArray(girl.videos) &&
        girl.videos.length > 0)
  ).length;

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold">
            Girls
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage all profiles
          </p>
        </div>

        <div className="flex gap-3">

          <button
            type="button"
            onClick={loadGirls}
            className="rounded-lg border border-zinc-700 px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900"
          >
            ↻ Refresh
          </button>

          <Link
            to="/admin/girls/add"
            className="rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-black transition hover:bg-yellow-400"
          >
            + Add Girl
          </Link>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">

        <MiniStat
          label="Total"
          value={girls.length}
        />

        <MiniStat
          label="Active"
          value={activeCount}
        />

        <MiniStat
          label="Hidden"
          value={hiddenCount}
        />

        <MiniStat
          label="New"
          value={newCount}
        />

        <MiniStat
          label="Video"
          value={videoCount}
        />

      </div>

      {/* SEARCH */}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_auto_auto]">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search name, code, location..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-yellow-500"
          />

          <select
            value={area}
            onChange={(e) =>
              setArea(e.target.value)
            }
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
          >
            <option value="all">
              All Areas
            </option>

            {areas.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
          >
            <option value="newest">
              Newest
            </option>

            <option value="oldest">
              Oldest
            </option>

            <option value="name">
              Name A-Z
            </option>

            <option value="code">
              Code A-Z
            </option>
          </select>

        </div>

        {/* FILTER BUTTONS */}

        <div className="mt-4 flex flex-wrap gap-2">

          <FilterButton
            active={filter === "all"}
            onClick={() =>
              setFilter("all")
            }
          >
            All
          </FilterButton>

          <FilterButton
            active={filter === "active"}
            onClick={() =>
              setFilter("active")
            }
          >
            Active
          </FilterButton>

          <FilterButton
            active={filter === "hidden"}
            onClick={() =>
              setFilter("hidden")
            }
          >
            Hidden
          </FilterButton>

          <FilterButton
            active={filter === "new"}
            onClick={() =>
              setFilter("new")
            }
          >
            New
          </FilterButton>

          <FilterButton
            active={filter === "video"}
            onClick={() =>
              setFilter("video")
            }
          >
            Video
          </FilterButton>

        </div>

      </div>

      {/* RESULT COUNT */}

      <div className="flex items-center justify-between text-sm text-zinc-500">

        <span>
          Showing {filteredGirls.length} of{" "}
          {girls.length}
        </span>

        {(search ||
          filter !== "all" ||
          area !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setFilter("all");
              setArea("all");
              setSort("newest");
            }}
            className="text-yellow-400"
          >
            Clear filters
          </button>
        )}

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto rounded-xl border border-zinc-800">

        <table className="w-full min-w-[1000px]">

          <thead className="bg-zinc-900">

            <tr>
              <th className="p-4 text-left">
                Profile
              </th>

              <th className="p-4 text-left">
                Code
              </th>

              <th className="p-4 text-left">
                Area
              </th>

              <th className="p-4 text-left">
                Location
              </th>

              <th className="p-4 text-left">
                Price
              </th>

              <th className="p-4 text-left">
                Media
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-right">
                Action
              </th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={8}
                  className="p-12 text-center text-zinc-500"
                >
                  Loading...
                </td>
              </tr>

            ) : filteredGirls.length === 0 ? (

              <tr>
                <td
                  colSpan={8}
                  className="p-12 text-center text-zinc-500"
                >
                  No profiles found.
                </td>
              </tr>

            ) : (

              filteredGirls.map((girl) => (

                <tr
                  key={girl.id}
                  className="border-t border-zinc-800 transition hover:bg-zinc-900/70"
                >

                  {/* PROFILE */}

                  <td className="p-4">

                    <div className="flex items-center gap-3">

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

                      <div>

                        <div className="flex items-center gap-2">

                          <span className="font-semibold">
                            {girl.name ||
                              "Unnamed"}
                          </span>

                          {girl.is_new && (
                            <span className="rounded bg-yellow-500/15 px-2 py-1 text-[10px] font-bold text-yellow-400">
                              NEW
                            </span>
                          )}

                        </div>

                        <p className="mt-1 text-xs text-zinc-500">
                          Age: {girl.age || "-"}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* CODE */}

                  <td className="p-4 font-medium">
                    {girl.code || "-"}
                  </td>

                  {/* AREA */}

                  <td className="p-4 text-zinc-400">
                    {girl.area || "-"}
                  </td>

                  {/* LOCATION */}

                  <td className="p-4 text-zinc-400">
                    {girl.location || "-"}
                  </td>

                  {/* PRICE */}

                  <td className="p-4">
                    {girl.price || "-"}
                  </td>

                  {/* MEDIA */}

                  <td className="p-4">

                    <div className="flex gap-2 text-xs">

                      <span className="rounded bg-zinc-800 px-2 py-1">
                        🖼{" "}
                        {(girl.images?.length ||
                          0) +
                          (girl.image ? 1 : 0)}
                      </span>

                      <span className="rounded bg-zinc-800 px-2 py-1">
                        🎬{" "}
                        {girl.videos?.length ||
                          0}
                      </span>

                    </div>

                  </td>

                  {/* STATUS */}

                  <td className="p-4">

                    <button
                      type="button"
                      disabled={
                        updatingId === girl.id
                      }
                      onClick={() =>
                        toggleStatus(girl)
                      }
                      className={`relative h-7 w-12 rounded-full transition ${
                        girl.status
                          ? "bg-green-500"
                          : "bg-zinc-700"
                      }`}
                    >

                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                          girl.status
                            ? "left-6"
                            : "left-1"
                        }`}
                      />

                    </button>

                    <p
                      className={`mt-1 text-xs ${
                        girl.status
                          ? "text-green-400"
                          : "text-zinc-500"
                      }`}
                    >
                      {updatingId === girl.id
                        ? "Saving..."
                        : girl.status
                          ? "Active"
                          : "Hidden"}
                    </p>

                  </td>

                  {/* ACTION */}

                  <td className="p-4">

                    <div className="flex justify-end gap-2">

                      <Link
                        to={`/detail/${girl.id}`}
                        target="_blank"
                        className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
                      >
                        View
                      </Link>

                      <Link
                        to={`/admin/girls/edit/${girl.id}`}
                        className="rounded-lg bg-yellow-500/10 px-3 py-2 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500 hover:text-black"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        disabled={
                          deletingId === girl.id
                        }
                        onClick={() =>
                          handleDelete(girl)
                        }
                        className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                      >
                        {deletingId === girl.id
                          ? "..."
                          : "Delete"}
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}


// =========================
// MINI STAT
// =========================

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">

      <p className="text-xs text-zinc-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}


// =========================
// FILTER BUTTON
// =========================

function FilterButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-yellow-500 text-black"
          : "bg-zinc-800 text-zinc-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}