import { useState } from "react";

import {
  uploadImage,
  deleteStorageFile,
} from "../../services/girlService";

export default function AvatarUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // =========================
  // UPLOAD IMAGE
  // =========================

  async function handleUpload(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const url = await uploadImage(file);

      onChange(url);
    } catch (err) {
      console.error(err);

      alert(
        err.message ||
          "Upload ảnh thất bại."
      );
    } finally {
      setUploading(false);

      e.target.value = "";
    }
  }

  // =========================
  // DELETE IMAGE
  // =========================

  async function removeImage() {
    if (!value) return;

    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa ảnh này?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteStorageFile(value);

      onChange("");
    } catch (err) {
      console.error(err);

      alert(
        err.message ||
          "Không thể xóa ảnh."
      );
    } finally {
      setDeleting(false);
    }
  }

  // =========================
  // UI
  // =========================

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold">
          Main Image
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Main profile image
        </p>
      </div>

      {value ? (
        <div className="relative w-48 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900">

          <img
            src={value}
            alt="Main"
            className="aspect-[3/4] w-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 bg-black/70 p-2">

            <button
              type="button"
              onClick={removeImage}
              disabled={deleting}
              className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting
                ? "Deleting..."
                : "Delete Image"}
            </button>

          </div>

        </div>
      ) : (
        <label
          className={`flex aspect-[3/4] w-48 flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 text-zinc-400 transition ${
            uploading
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:border-yellow-500 hover:text-yellow-500"
          }`}
        >

          {uploading ? (
            <>
              <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-yellow-500" />

              <span className="text-sm">
                Uploading...
              </span>
            </>
          ) : (
            <>
              <span className="text-4xl">
                +
              </span>

              <span className="mt-2 text-sm">
                Upload Image
              </span>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleUpload}
            className="hidden"
          />

        </label>
      )}
    </div>
  );
}