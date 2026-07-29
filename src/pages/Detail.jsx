import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Heart,
  MapPin,
  Play,
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
  Crown,
  MessageCircle,
  Send,
  Copy,
} from "lucide-react";

import { getGirlById } from "../services/girlService";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time) {
  if (!time) return "";

  const [hour, minute] = time.split(":");

  const d = new Date();
  d.setHours(Number(hour));
  d.setMinutes(Number(minute));

  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

  // =====================================================
  // LOAD GIRL FROM SUPABASE
  // =====================================================

  useEffect(() => {
    async function loadGirl() {
      try {
        setLoading(true);
        setError("");

        const data = await getGirlById(id);

        if (!data) {
          setError("Product Not Found");
          return;
        }

        setProduct(data);
        setCurrentImage(0);
      } catch (err) {
        console.error("Load detail error:", err);

        setError(
          err?.message ||
            "Không thể tải thông tin."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadGirl();
    }
  }, [id]);

  // =====================================================
  // IMAGES
  // =====================================================

  const images = useMemo(() => {
    if (!product) return [];

    const list = [];

    if (product.image) {
      list.push(product.image);
    }

    if (Array.isArray(product.images)) {
      product.images.forEach((image) => {
        if (image && !list.includes(image)) {
          list.push(image);
        }
      });
    }

    return list;
  }, [product]);

  // =====================================================
  // VIDEOS
  // =====================================================

  const videos = useMemo(() => {
    if (!product) return [];

    return Array.isArray(product.videos)
      ? product.videos.filter(Boolean)
      : [];
  }, [product]);

  // =====================================================
  // IMAGE NAVIGATION
  // =====================================================

  function nextImage() {
    if (images.length <= 1) return;

    setCurrentImage((prev) =>
      prev === images.length - 1
        ? 0
        : prev + 1
    );
  }

  function prevImage() {
    if (images.length <= 1) return;

    setCurrentImage((prev) =>
      prev === 0
        ? images.length - 1
        : prev - 1
    );
  }

  // =====================================================
  // WHATSAPP
  // =====================================================

  function handleWhatsApp() {
    if (!product?.whatsapp) return;

    const phone = String(
      product.whatsapp
    ).replace(/\D/g, "");

    if (!phone) return;

    window.open(
      `https://wa.me/${phone}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  // =====================================================
  // TELEGRAM
  // =====================================================

  function handleTelegram() {
    if (!product?.telegram) return;

    let telegramUrl = String(
      product.telegram
    ).trim();

    if (telegramUrl.startsWith("@")) {
      telegramUrl = `https://t.me/${telegramUrl.substring(
        1
      )}`;
    } else if (
      !telegramUrl.startsWith("http://") &&
      !telegramUrl.startsWith("https://")
    ) {
      telegramUrl = `https://t.me/${telegramUrl}`;
    }

    window.open(
      telegramUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  // =====================================================
  // WECHAT
  // =====================================================

  async function handleWechat() {
    if (!product?.wechat) return;

    try {
      await navigator.clipboard.writeText(
        String(product.wechat)
      );

      alert(
        `WeChat ID copied: ${product.wechat}`
      );
    } catch (err) {
      console.error(err);

      alert(`WeChat ID: ${product.wechat}`);
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-red-500" />

          <p className="mt-4 text-zinc-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-5 text-white">
        <h1 className="text-2xl font-bold">
          Product Not Found
        </h1>

        <p className="mt-2 text-zinc-500">
          {error}
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 rounded-xl bg-red-500 px-6 py-3 font-bold"
        >
          Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-5 lg:py-8">

        {/* =====================================================
            BACK
        ===================================================== */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="
            mb-6
            flex
            items-center
            gap-2
            rounded-xl
            bg-zinc-900
            px-5
            py-3
            transition
            hover:bg-red-500
          "
        >
          <ArrowLeft size={18} />

          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">

          {/* =====================================================
              LEFT
          ===================================================== */}

          <div>

            {/* MAIN IMAGE */}

            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-zinc-800
                bg-zinc-900
              "
            >

              {images.length > 0 ? (
                <img
                  src={images[currentImage]}
                  alt={product.name || "Profile"}
                  className="
                    h-[520px]
                    w-full
                    object-cover
                    sm:h-[650px]
                    lg:h-[680px]
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-[520px]
                    items-center
                    justify-center
                    text-zinc-500
                    sm:h-[650px]
                  "
                >
                  No Image
                </div>
              )}

              {/* GRADIENT */}

              {images.length > 0 && (
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/60
                    via-transparent
                    to-transparent
                  "
                />
              )}

              {/* PREVIOUS */}

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={prevImage}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-black/60
                    p-3
                    transition
                    hover:bg-red-500
                  "
                >
                  <ChevronLeft />
                </button>
              )}

              {/* NEXT */}

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={nextImage}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-black/60
                    p-3
                    transition
                    hover:bg-red-500
                  "
                >
                  <ChevronRight />
                </button>
              )}

              {/* FAVORITE */}

              <button
                type="button"
                className="
                  absolute
                  right-5
                  top-5
                  rounded-full
                  bg-black/60
                  p-3
                  transition
                  hover:bg-red-500
                "
              >
                <Heart />
              </button>

              {/* NEW */}

              {product.is_new && (
                <div
                  className="
                    absolute
                    bottom-5
                    left-5
                    rounded-full
                    bg-red-500
                    px-4
                    py-2
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  NEW
                </div>
              )}

              {/* VIDEO */}

              {product.has_video &&
                videos.length > 0 && (
                  <div
                    className="
                      absolute
                      bottom-5
                      right-5
                      flex
                      items-center
                      gap-2
                      rounded-full
                      bg-black/75
                      px-4
                      py-2
                      text-sm
                      font-semibold
                    "
                  >
                    <Play
                      size={16}
                      fill="white"
                    />

                    Video
                  </div>
                )}

            </div>

            {/* =====================================================
                THUMBNAILS
            ===================================================== */}

            {images.length > 1 && (
              <div className="mt-5 flex gap-3 overflow-x-auto pb-2">

                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setCurrentImage(index)
                    }
                    className={`
                      shrink-0
                      overflow-hidden
                      rounded-xl
                      border-2
                      transition
                      ${
                        currentImage === index
                          ? "border-red-500"
                          : "border-zinc-700"
                      }
                    `}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-24 w-20 object-cover"
                    />
                  </button>
                ))}

              </div>
            )}

          </div>

          {/* =====================================================
              RIGHT - INFORMATION
          ===================================================== */}

          <div>

            {/* CODE */}

            <p
              className="
                text-sm
                font-bold
                tracking-[6px]
                text-red-500
              "
            >
              {product.code || "-"}
            </p>

            {/* NAME */}

            <h1
              className="
                mt-2
                text-4xl
                font-bold
                sm:text-5xl
              "
            >
              {product.name || "Unknown"}
            </h1>

            {/* LOCATION */}

            <div
              className="
                mt-5
                flex
                items-center
                gap-2
                text-zinc-300
              "
            >
              <MapPin
                className="shrink-0 text-red-500"
                size={18}
              />

              <span>
                {product.area || "-"}

                {product.location
                  ? ` · ${product.location}`
                  : ""}
              </span>
            </div>

            {/* =====================================================
                BADGES
            ===================================================== */}

            <div className="mt-6 flex flex-wrap items-center gap-3">

              {/* RATING */}

              <span
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-yellow-500/20
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-yellow-400
                "
              >
                <Star
                  size={15}
                  fill="currentColor"
                />

                4.9
              </span>

              {/* NEW */}

              {product.is_new && (
                <span
                  className="
                    rounded-full
                    bg-red-500/20
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-red-400
                  "
                >
                  NEW
                </span>
              )}

              {/* VIP */}

              {product.is_vip && (
                <span
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-yellow-500/15
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-yellow-400
                  "
                >
                  <Crown size={15} />

                  VIP
                </span>
              )}

              {/* VERIFIED */}

              {product.is_verified && (
                <span
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-emerald-500/20
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-emerald-400
                  "
                >
                  <ShieldCheck size={15} />

                  Verified
                </span>
              )}

            </div>

            {/* =====================================================
                STATS
            ===================================================== */}

            <div className="mt-8 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-zinc-900 p-5">
                <p className="text-zinc-500">
                  Age
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {product.age ?? "-"}
                </h3>
              </div>

              <div className="rounded-2xl bg-zinc-900 p-5">
                <p className="text-zinc-500">
                  Height
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {product.height ?? "-"} cm
                </h3>
              </div>

              <div className="rounded-2xl bg-zinc-900 p-5">
                <p className="text-zinc-500">
                  Weight
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {product.weight ?? "-"} kg
                </h3>
              </div>

              <div className="rounded-2xl bg-zinc-900 p-5">
                <p className="text-zinc-500">
                  Cup
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {product.cup || "-"}
                </h3>
              </div>

            </div>

            {/* =====================================================
                PRICE
            ===================================================== */}

            <div
              className="
                mt-8
                rounded-3xl
                border
                border-red-900/40
                bg-gradient-to-r
                from-[#8B1E2D]
                to-[#B22234]
                p-6
                shadow-lg
                shadow-red-900/20
              "
            >
              <p className="uppercase tracking-widest text-white/80">
                Starting Price
              </p>

              <h2
                className="
                  mt-3
                  break-words
                  text-4xl
                  font-bold
                  sm:text-5xl
                "
              >
                {product.price || "-"}
              </h2>
              {(product.available_date || product.available_time) && (
                <div className="mt-4 space-y-2 text-white/90">
                  <p className="font-semibold text-white">
                  Available
                </p>

            {product.available_time && (
                <p>🕒 {formatTime(product.available_time)}</p>
              )}

              {product.available_date && (
                <p>📅 {formatDate(product.available_date)}</p>
               )}
            </div>
          )}
            </div>

            {/* =====================================================
                CONTACT
            ===================================================== */}

            {(product.whatsapp ||
              product.telegram ||
              product.wechat) && (
              <div className="mt-8">

                <h3 className="mb-4 text-xl font-bold">
                  Contact
                </h3>

                <div className="grid gap-3 sm:grid-cols-3">

                  {/* WHATSAPP */}

                  {product.whatsapp && (
                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-emerald-500
                        px-4
                        py-3
                        font-bold
                        text-white
                        transition
                        hover:bg-emerald-600
                      "
                    >
                      <MessageCircle size={18} />

                      WhatsApp
                    </button>
                  )}

                  {/* TELEGRAM */}

                  {product.telegram && (
                    <button
                      type="button"
                      onClick={handleTelegram}
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-sky-500
                        px-4
                        py-3
                        font-bold
                        text-white
                        transition
                        hover:bg-sky-600
                      "
                    >
                      <Send size={18} />

                      Telegram
                    </button>
                  )}

                  {/* WECHAT */}

                  {product.wechat && (
                    <button
                      type="button"
                      onClick={handleWechat}
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-green-600
                        px-4
                        py-3
                        font-bold
                        text-white
                        transition
                        hover:bg-green-700
                      "
                    >
                      <Copy size={18} />

                      WeChat
                    </button>
                  )}

                </div>
              </div>
            )}

            {/* =====================================================
                VIDEOS
            ===================================================== */}

            {videos.length > 0 && (
              <div className="mt-10">

                <h3 className="mb-4 text-2xl font-bold text-red-500">
                  Videos
                </h3>

                <div className="space-y-4">

                  {videos.map((video, index) => (
                    <video
                      key={`${video}-${index}`}
                      src={video}
                      controls
                      playsInline
                      preload="metadata"
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-zinc-800
                        bg-black
                      "
                    />
                  ))}

                </div>
              </div>
            )}

            {/* =====================================================
                BOOK NOW
            ===================================================== */}

            {product.telegram_start && (
              <div className="mt-10">

                <a
                  href={`https://t.me/luna_sg_bot?start=${encodeURIComponent(
                    product.telegram_start
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex
                    h-16
                    w-full
                    items-center
                    justify-center
                    rounded-2xl
                    bg-red-500
                    text-xl
                    font-bold
                    text-white
                    shadow-lg
                    shadow-red-500/30
                    transition-all
                    duration-300
                    hover:bg-red-600
                    active:scale-95
                  "
                >
                  📅 Book Now
                </a>

              </div>
            )}

            {/* =====================================================
                SERVICE
            ===================================================== */}

            <div
              className="
                mt-10
                overflow-hidden
                rounded-2xl
                border
                border-zinc-800
                bg-zinc-900
              "
            >

              <div className="border-b border-zinc-800 px-6 py-5">

                <h3 className="text-2xl font-bold text-red-500">
                  Service / 服务
                </h3>

              </div>

              <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">

                {[
                  "Shower together / 鸳鸯浴",
                  "Massage / 按摩",
                  "Frenching / 舌吻",
                  "CBJ / 有套口交",
                  "CCIM / 有套口爆",
                  "Boobs Gliding / 性感胸推",
                  "Lick Nipples / 舔奶头",
                  "Boobs Fuck / 乳交",
                  "Butt Gliding / 性感臀推",
                  "All Natural Boobs / 全天然胸",
                  "Stockings Temptation / 丝袜诱惑",
                  "Uniform Seduction / 制服诱惑",
                  "I am non-smoker / 本人不抽烟",
                  "No Caucasian / 不接洋人",
                ].map((service, index) => (
                  <div
                    key={index}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      bg-zinc-800
                      p-4
                    "
                  >

                    <div
                      className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-red-500
                        text-sm
                        font-bold
                      "
                    >
                      {index + 1}
                    </div>

                    <span>
                      {service}
                    </span>

                  </div>
                ))}

              </div>

            </div>

            {/* =====================================================
                NOTES
            ===================================================== */}

            <div
              className="
                mt-10
                overflow-hidden
                rounded-2xl
                border
                border-zinc-800
                bg-zinc-900
              "
            >

              <div className="border-b border-zinc-800 px-6 py-5">

                <h3 className="text-2xl font-bold text-red-500">
                  Notes / 笔记
                </h3>

              </div>

              <div className="flex flex-wrap gap-4 p-6">

                {/* VERIFIED - điều khiển từ Admin */}

                {product.is_verified && (
                  <span className="rounded-full bg-lime-500 px-5 py-2 font-bold text-black">
                    ✅ Verified
                  </span>
                )}

                <span className="rounded-full bg-blue-500 px-5 py-2 font-bold text-white">
                  ⭐ Real Photos
                </span>

                <span className="rounded-full bg-purple-500 px-5 py-2 font-bold text-white">
                  🚭 Non Smoker
                </span>

                <span className="rounded-full bg-orange-500 px-5 py-2 font-bold text-white">
                  💯 Good Service
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Detail;