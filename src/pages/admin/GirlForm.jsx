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
    is_available: false,
    is_busy: false,
    is_available_from: false,
    only_outcall: false,
    only_incall: false,
    code: "",
    name: "",
    age: "",
    height: "",
    weight: "",
    cup: "",
    area: "",
    location: "",

    price: "",
    available_date: "",
    available_time: "",
    availability_status: "available_now",
    status_message: "",
    show_schedule: false,

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
        is_available: girl.is_available ?? false,
        is_busy: girl.is_busy ?? false,
        is_available_from: girl.is_available_from ?? false,
        only_outcall: girl.only_outcall ?? false,
        only_incall: girl.only_incall ?? false,
        code: girl.code || "",
        name: girl.name || "",

        age: girl.age ?? "",
        height: girl.height ?? "",
        weight: girl.weight ?? "",

        show_schedule:
          girl.show_schedule ?? false,

        cup: girl.cup || "",

        area: girl.area || "",
        location: girl.location || "",

        status_message:
          girl.status_message || "",

        price: girl.price || "",
        availability_status:
          girl.availability_status || "available_now",
        available_date: girl.available_date || "",
        available_time: girl.available_time
         ? girl.available_time.substring(0, 5)
        : "",

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
      is_available: form.is_available,
      is_busy: form.is_busy,
      is_available_from: form.is_available_from,
      only_outcall: form.only_outcall,
      only_incall: form.only_incall,  

        code: form.code.trim(),
        name: form.name.trim(),
        show_schedule:
          form.show_schedule,

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
        availability_status:
          form.availability_status,
        status_message:
          form.status_message || null,  
        available_date:
          form.available_date || null,

        available_time:
          form.available_time || null,

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
  const StatusButton = ({
  active,
  color,
  icon,
  children,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl border px-4 py-2 font-medium transition-all duration-200
    ${
      active
        ? `${color} border-transparent text-white`
        : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
    }`}
  >
    <span className="mr-2">{icon}</span>
    {children}
  </button>
);
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

  {/* Price */}
  <div>
    <label className="mb-1 block text-sm text-zinc-400">
      Price
    </label>

    <input
      name="price"
      value={form.price}
      onChange={handleChange}
      placeholder="150"
      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-yellow-500"
    />
  </div>

 {/* Booking Status */}

<div>

<label className="mb-3 block text-sm text-zinc-400">
Booking Status
</label>

<div className="flex flex-wrap gap-3">

<StatusButton
  icon="🟢"
  color="bg-green-600"
  active={form.is_available}
  onClick={() => {
    setForm((prev) => ({
      ...prev,
      is_available: !prev.is_available,
      is_busy: false,

      // Nếu tắt Available thì tắt luôn Available From
      is_available_from: !prev.is_available
        ? prev.is_available_from
        : false,

      show_schedule: !prev.is_available
        ? prev.show_schedule
        : false,
    }));
  }}
>

Available

</StatusButton>

<StatusButton
icon="🔴"
color="bg-red-600"
active={form.is_busy}
onClick={()=>{
setForm(prev=>({

...prev,

is_busy:!prev.is_busy,

is_available:false,

is_available_from:false,

show_schedule: false,
available_date: "",
available_time: "",

}))
}}
>

Busy

</StatusButton>

<StatusButton
icon="🕒"
color="bg-blue-600"
active={form.is_available_from}
onClick={()=>{
setForm(prev=>({

...prev,

is_available_from:!prev.is_available_from,

is_available:true,

is_busy:false,

show_schedule:true

}))
}}
>

Available From

</StatusButton>

<StatusButton
icon="🚗"
color="bg-orange-500"
active={form.only_outcall}
onClick={()=>{
setForm(prev=>({

...prev,

only_outcall: !prev.only_outcall,

only_incall: false,

is_busy: false,

}))
}}
>

Only Outcall

</StatusButton>

<StatusButton
icon="🏠"
color="bg-purple-600"
active={form.only_incall}
onClick={()=>{
setForm(prev=>({

...prev,

only_incall:!prev.only_incall,

only_incall: !prev.only_incall,

only_outcall: false,

is_busy: false,

}))
}}
>

Only Incall

</StatusButton>

</div>


</div>
 <div>

  <label className="mb-1 block text-sm text-zinc-400">
      Custom Status (Optional)
</label>

<input
  name="status_message"
  value={form.status_message}
  onChange={handleChange}
  placeholder="Ví dụ: Last Slot, Holiday..."
  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-yellow-500"
/>

</div>     

  {/* Show Schedule */}
  {!form.is_busy && (

<label className="flex items-center gap-3">
    <input
      type="checkbox"
      name="show_schedule"
      checked={form.show_schedule}
      onChange={handleChange}
    />

    <span className="text-sm text-zinc-300">
      Show Available Date & Time
    </span>
  </label>)}

    {form.show_schedule && (
    <>
      <div>
        <label className="mb-1 block text-sm text-zinc-400">
          Available Date
        </label>

        <input
          type="date"
          name="available_date"
          value={form.available_date || ""}
          onChange={handleChange}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-yellow-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-zinc-400">
          Available Time
        </label>

        <input
          type="time"
          name="available_time"
          value={form.available_time || ""}
          onChange={handleChange}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-yellow-500"
        />
      </div>
    </>
  )}

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