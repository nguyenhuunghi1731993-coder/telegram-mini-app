import { useState } from "react";

import {
  uploadImage,
  deleteStorageFile,
} from "../../services/girlService";

export default function GalleryUploader({
  value = [],
  onChange,
}) {
  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);

  // =========================
  // UPLOAD IMAGES
  // =========================

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const validFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      alert("Vui lòng chọn file ảnh.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const uploadedUrls = [];

      for (const file of validFiles) {
        const url = await uploadImage(file);

        uploadedUrls.push(url);
      }

      onChange([
        ...value,
        ...uploadedUrls,
      ]);
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

  async function removeImage(index) {
    const imageUrl = value[index];

    if (!imageUrl) return;

    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa ảnh này?"
    );

    if (!confirmed) return;

    try {
      setDeletingIndex(index);

      await deleteStorageFile(imageUrl);

      const newImages = value.filter(
        (_, i) => i !== index
      );

      onChange(newImages);
    } catch (err) {
      console.error(err);

      alert(
        err.message ||
          "Không thể xóa ảnh."
      );
    } finally {
      setDeletingIndex(null);
    }
  }

  // =========================
  // UI
  // =========================

  return (
    <div>

      <div className="mb-5">

        <h2 className="text-xl font-semibold">
          Gallery
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          {value.length} images
        </p>

      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

        {/* EXISTING IMAGES */}

        {value.map((image, index) => (

          <div
            key={`${image}-${index}`}
            className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
          >

            <img
              src={image}
              alt={`Gallery ${index + 1}`}
              className="aspect-[3/4] w-full object-cover"
            />

            {/* NUMBER */}

            <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
              {index + 1}
            </div>

            {/* DELETE */}

            <button
              type="button"
              disabled={deletingIndex === index}
              onClick={() => removeImage(index)}
              className="absolute right-2 top-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-500 disabled:opacity-50"
            >
              {deletingIndex === index
                ? "..."
                : "✕"}
            </button>

          </div>

        ))}

        {/* UPLOAD */}

        <label
          className={`flex aspect-[3/4] flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 text-zinc-500 transition ${
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
                Add Images
              </span>

              <span className="mt-1 text-xs text-zinc-600">
                Multiple files
              </span>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={handleUpload}
            className="hidden"
          />

        </label>

      </div>

    </div>
  );
}