import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AvatarUploader from "./AvatarUploader";
import GalleryUploader from "./GalleryUploader";
import VideoUploader from "./VideoUploader";

import {
  addGirl,
  getGirlById,
  updateGirl,
} from "../../services/girlService";

export default function GirlForm({ mode = "add" }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // =========================
  // FORM STATE
  // =========================

  const [form, setForm] = useState({
    code: "",
    name: "",
    age: "",
    height: "",
    weight: "",
    cup: "",
    area: "",
    location: "",

    price: "",
    telegram_start: "",

    whatsapp: "",
    telegram: "",
    wechat: "",

    image: "",
    images: [],
    videos: [],

    has_video: false,

    is_new: true,
    is_vip: true,
    is_verified: true,
    status: true,

    date: new Date().toISOString().split("T")[0],
  });

  // =========================
  // LOAD DATA WHEN EDIT
  // =========================

  useEffect(() => {
    if (isEdit && id) {
      loadGirl();
    }
  }, [id, isEdit]);

  async function loadGirl() {
    try {
      setLoading(true);

      const girl = await getGirlById(id);

      if (!girl) {
        alert("Không tìm thấy dữ liệu.");
        navigate("/admin/girls");
        return;
      }

      setForm({
        code: girl.code || "",
        name: girl.name || "",

        age: girl.age ?? "",
        height: girl.height ?? "",
        weight: girl.weight ?? "",

        cup: girl.cup || "",

        area: girl.area || "",
        location: girl.location || "",

        price: girl.price || "",
        telegram_start: girl.telegram_start || "",

        whatsapp: girl.whatsapp || "",
        telegram: girl.telegram || "",
        wechat: girl.wechat || "",

        image: girl.image || "",

        images: Array.isArray(girl.images)
          ? girl.images
          : [],

        videos: Array.isArray(girl.videos)
          ? girl.videos
          : [],

        has_video:
          Array.isArray(girl.videos) &&
          girl.videos.length > 0,

        is_new:
          girl.is_new === null ||
          girl.is_new === undefined
            ? true
            : Boolean(girl.is_new),

        is_vip:
          girl.is_vip === null ||
          girl.is_vip === undefined
            ? true
            : Boolean(girl.is_vip),

        is_verified:
          girl.is_verified === null ||
          girl.is_verified === undefined
            ? true
            : Boolean(girl.is_verified),

        status:
          girl.status === null ||
          girl.status === undefined
            ? true
            : Boolean(girl.status),

        date:
          girl.date ||
          new Date().toISOString().split("T")[0],
      });
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
  // INPUT CHANGE
  // =========================

  function handleChange(e) {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  // =========================
  // SAVE
  // =========================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.code.trim()) {
      alert("Vui lòng nhập Code.");
      return;
    }

    if (!form.name.trim()) {
      alert("Vui lòng nhập Name.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        code: form.code.trim(),
        name: form.name.trim(),

        age:
          form.age === ""
            ? null
            : Number(form.age),

        height:
          form.height === ""
            ? null
            : Number(form.height),

        weight:
          form.weight === ""
            ? null
            : Number(form.weight),

        cup: form.cup,

        area: form.area,
        location: form.location,

        price: form.price,

        telegram_start:
          form.telegram_start?.trim() || null,

        whatsapp:
          form.whatsapp?.trim() || null,

        telegram:
          form.telegram?.trim() || null,

        wechat:
          form.wechat?.trim() || null,

        image:
          form.image || null,

        images:
          Array.isArray(form.images)
            ? form.images
            : [],

        videos:
          Array.isArray(form.videos)
            ? form.videos
            : [],

        has_video:
          Array.isArray(form.videos) &&
          form.videos.length > 0,

        // BADGES
        is_new: Boolean(form.is_new),
        is_vip: Boolean(form.is_vip),
        is_verified: Boolean(form.is_verified),

        // PROFILE STATUS
        status: Boolean(form.status),

        date:
          form.date || null,
      };

      if (isEdit) {
        await updateGirl(id, payload);

        alert("Cập nhật thành công.");
      } else {
        await addGirl(payload);

        alert("Thêm thành công.");
      }

      navigate("/admin/girls");
    } catch (err) {
      console.error(err);

      alert(
        err.message ||
          "Không thể lưu dữ liệu."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="py-16 text-center text-zinc-400">
        Loading...
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ================= MAIN IMAGE ================= */}

      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <AvatarUploader
          value={form.image}
          onChange={(url) =>
            setForm((prev) => ({
              ...prev,
              image: url,
            }))
          }
        />
      </section>

      {/* ================= GALLERY ================= */}

      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <GalleryUploader
          value={form.images}
          onChange={(images) =>
            setForm((prev) => ({
              ...prev,
              images,
            }))
          }
        />
      </section>

      {/* ================= VIDEOS ================= */}

      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <VideoUploader
          value={form.videos}
          onChange={(videos) =>
            setForm((prev) => ({
              ...prev,

              videos,

              has_video:
                Array.isArray(videos) &&
                videos.length > 0,
            }))
          }
        />
      </section>

      {/* ================= BASIC INFORMATION ================= */}

      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">

        <h2 className="mb-5 text-xl font-semibold">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Code"
            required
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-yellow-500"
          />

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-yellow-500"
          />

          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Age"
            min="0"
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-yellow-500"
          />

          <input
            type="number"
            name="height"
            value={form.height}
            onChange={handleChange}
            placeholder="Height (cm)"
            min="0"
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-yellow-500"
          />

          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            placeholder="Weight (kg)"
            min="0"
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-yellow-500"
          />

          <input
            name="cup"
            value={form.cup}
            onChange={handleChange}
            placeholder="Cup"
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-yellow-500"
          />

          <select
            name="area"
            value={form.area}
            onChange={handleChange}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-yellow-500"
          >
            <option value="">
              Select Area
            </option>

            <option value="Central">
              Central
            </option>

            <option value="East">
              East
            </option>

            <option value="West">
              West
            </option>

            <option value="North">
              North
            </option>

            <option value="North-East">
              North-East
            </option>

          </select>

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-yellow-500"
          />

        </div>

      </section>

      {/* ================= BOOKING INFORMATION ================= */}

      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">

        <h2 className="mb-5 text-xl font-semibold">
          Booking Information
        </h2>

        <div className="space-y-4">

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-yellow-500"
          />

          <input
            name="telegram_start"
            value={form.telegram_start}
            onChange={handleChange}
            placeholder="Telegram Start"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-yellow-500"
          />

          <input
            type="date"
            name="date"
            value={form.date || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-yellow-500"
          />

        </div>

      </section>

      {/* ================= CONTACT ================= */}

      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">

        <h2 className="mb-2 text-xl font-semibold">
          Contact Information
        </h2>

        <p className="mb-5 text-sm text-zinc-500">
          Contact information displayed on the profile.
        </p>

        <div className="space-y-4">

          <input
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="WhatsApp - Example: 6591234567"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-emerald-500"
          />

          <input
            name="telegram"
            value={form.telegram}
            onChange={handleChange}
            placeholder="Telegram - @username or https://t.me/username"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-sky-500"
          />

          <input
            name="wechat"
            value={form.wechat}
            onChange={handleChange}
            placeholder="WeChat ID"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-green-500"
          />

        </div>

      </section>

      {/* ================= STATUS / BADGES ================= */}

      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">

        <h2 className="mb-2 text-xl font-semibold">
          Status & Badges
        </h2>

        <p className="mb-5 text-sm text-zinc-500">
          Control which badges are displayed on this profile.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">

          {/* NEW */}

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-red-500">

            <input
              type="checkbox"
              name="is_new"
              checked={form.is_new}
              onChange={handleChange}
              className="h-4 w-4"
            />

            <div>
              <p className="font-semibold text-white">
                New
              </p>

              <p className="text-xs text-zinc-500">
                Show NEW
              </p>
            </div>

          </label>

          {/* VIP */}

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-yellow-500">

            <input
              type="checkbox"
              name="is_vip"
              checked={form.is_vip}
              onChange={handleChange}
              className="h-4 w-4"
            />

            <div>
              <p className="font-semibold text-white">
                VIP
              </p>

              <p className="text-xs text-zinc-500">
                Show VIP
              </p>
            </div>

          </label>

          {/* VERIFIED */}

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-emerald-500">

            <input
              type="checkbox"
              name="is_verified"
              checked={form.is_verified}
              onChange={handleChange}
              className="h-4 w-4"
            />

            <div>
              <p className="font-semibold text-white">
                Verified
              </p>

              <p className="text-xs text-zinc-500">
                Show Verified
              </p>
            </div>

          </label>

          {/* VIDEO */}

          <label className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">

            <input
              type="checkbox"
              checked={
                Array.isArray(form.videos) &&
                form.videos.length > 0
              }
              readOnly
              className="h-4 w-4"
            />

            <div>
              <p className="font-semibold text-white">
                Video
              </p>

              <p className="text-xs text-zinc-500">
                Auto detected
              </p>
            </div>

          </label>

          {/* ACTIVE */}

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-blue-500">

            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
              className="h-4 w-4"
            />

            <div>
              <p className="font-semibold text-white">
                Active
              </p>

              <p className="text-xs text-zinc-500">
                Profile active
              </p>
            </div>

          </label>

        </div>

      </section>

      {/* ================= SAVE ================= */}

      <div className="flex justify-end">

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-yellow-500 px-8 py-3 font-bold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : isEdit
              ? "Update Girl"
              : "Add Girl"}
        </button>

      </div>

    </form>
  );
}