import { useNavigate } from "react-router-dom";

import {
  Heart,
  MapPin,
  Play,
  ShieldCheck,
  Star,
  Crown,
  MessageCircle,
  Send,
  Copy,
} from "lucide-react";

function ProductCard({ product }) {
  const navigate = useNavigate();

  // =====================================================
  // OPEN DETAIL
  // =====================================================

  function openDetail() {
    if (!product?.id) return;

    navigate(`/detail/${product.id}`);
  }

  function handleCardKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDetail();
    }
  }

  // =====================================================
  // WHATSAPP
  // =====================================================

  function handleWhatsApp(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!product?.whatsapp) return;

    const phone = String(product.whatsapp).replace(/\D/g, "");

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

  function handleTelegram(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!product?.telegram) return;

    let telegramUrl = String(product.telegram).trim();

    // @username
    if (telegramUrl.startsWith("@")) {
      telegramUrl = `https://t.me/${telegramUrl.substring(1)}`;
    }

    // username
    if (
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

  async function handleWechat(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!product?.wechat) return;

    const wechatId = String(product.wechat);

    try {
      await navigator.clipboard.writeText(wechatId);

      alert(`WeChat ID copied: ${wechatId}`);
    } catch (error) {
      console.error(error);

      alert(`WeChat ID: ${wechatId}`);
    }
  }

  // =====================================================
  // FAVORITE
  // =====================================================

  function handleFavorite(e) {
    e.preventDefault();
    e.stopPropagation();

    // Favorite sẽ làm sau
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      onClick={openDetail}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex={0}
      className="
        group
        w-full
        cursor-pointer
        overflow-hidden
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/90
        shadow-lg
        outline-none
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-red-500
        hover:shadow-red-500/20
        focus:border-red-500
      "
    >
      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="relative aspect-[4/5] overflow-hidden">

        {product?.image ? (
          <img
            src={product.image}
            alt={product.name || "Profile"}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-zinc-500">
            No Image
          </div>
        )}

        {/* IMAGE GRADIENT */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/70
            via-transparent
            to-transparent
          "
        />

        {/* =====================================================
            ONLINE
        ===================================================== */}

        {product?.status && (
          <div
            className="
              absolute
              left-3
              top-3
              flex
              items-center
              gap-1.5
              rounded-full
              bg-emerald-500/90
              px-2.5
              py-1
              text-xs
              font-semibold
              text-white
            "
          >
            <span className="h-2 w-2 rounded-full bg-white" />

            Online
          </div>
        )}

        {/* =====================================================
            FAVORITE
        ===================================================== */}

        <button
          type="button"
          onClick={handleFavorite}
          aria-label="Favorite"
          className="
            absolute
            right-3
            top-3
            z-10
            rounded-full
            bg-black/60
            p-2.5
            backdrop-blur
            transition
            hover:bg-red-500
          "
        >
          <Heart className="h-5 w-5 text-white" />
        </button>

        {/* =====================================================
            NEW + VIDEO
        ===================================================== */}

        {(product?.is_new || product?.has_video) && (
          <div
            className="
              absolute
              bottom-3
              left-3
              flex
              items-center
              gap-2
            "
          >
            {/* NEW */}

            {product?.is_new && (
              <span
                className="
                  rounded-md
                  bg-red-600
                  px-2.5
                  py-1
                  text-xs
                  font-bold
                  text-white
                "
              >
                NEW
              </span>
            )}

            {/* VIDEO */}

            {product?.has_video && (
              <span
                className="
                  flex
                  items-center
                  gap-1
                  rounded-md
                  bg-black/75
                  px-2.5
                  py-1
                  text-xs
                  font-semibold
                  text-white
                "
              >
                <Play
                  className="h-3 w-3"
                  fill="white"
                />

                VIDEO
              </span>
            )}
          </div>
        )}

      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="p-5 text-center">

        {/* =====================================================
            CODE + NAME + LOCATION
        ===================================================== */}

        <div className="relative">

          {/* CODE */}

          <div
            className="
              text-sm
              font-bold
              uppercase
              tracking-widest
              text-red-500
            "
          >
            {product?.code || "-"}
          </div>

          {/* NAME */}

          <h3
            className="
              mt-1
              text-2xl
              font-bold
              text-white
              transition
              group-hover:text-red-400
            "
          >
            {product?.name || "Unknown"}
          </h3>

          {/* LOCATION */}

          <p className="mt-1 text-base text-zinc-400">
            {product?.location || "-"}
          </p>

          {/* =====================================================
              RATING
          ===================================================== */}

          <div
            className="
              absolute
              right-0
              top-0
              flex
              items-center
              gap-1
              rounded-full
              bg-zinc-800
              px-3
              py-1.5
            "
          >
            <Star
              className="
                h-4
                w-4
                fill-yellow-400
                text-yellow-400
              "
            />

            <span className="text-sm font-semibold text-white">
              4.9
            </span>
          </div>

        </div>

        {/* =====================================================
            AREA
        ===================================================== */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-center
            gap-2
            text-base
            text-zinc-300
          "
        >
          <MapPin className="h-5 w-5 shrink-0 text-red-500" />

          <span>
            {product?.area || "-"}
          </span>
        </div>

        {/* =====================================================
            AGE / HEIGHT / CUP
        ===================================================== */}

        <div
          className="
            mt-3
            flex
            flex-wrap
            items-center
            justify-center
            text-base
            text-zinc-300
          "
        >
          <span>
            {product?.age ?? "-"} Years
          </span>

          <span className="mx-2 text-zinc-600">
            •
          </span>

          <span>
            {product?.height ?? "-"} cm
          </span>

          <span className="mx-2 text-zinc-600">
            •
          </span>

          <span>
            {product?.cup || "-"}
          </span>
        </div>

        {/* =====================================================
            VIP + VERIFIED
            ĐƯỢC ĐIỀU KHIỂN TỪ ADMIN
        ===================================================== */}

        {(product?.is_vip || product?.is_verified) && (
          <div
            className="
              mt-4
              flex
              flex-wrap
              items-center
              justify-center
              gap-2
            "
          >

            {/* VIP */}

            {product?.is_vip && (
              <span
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-yellow-500/15
                  px-3
                  py-1.5
                  text-sm
                  font-semibold
                  text-yellow-400
                "
              >
                <Crown className="h-4 w-4" />

                VIP
              </span>
            )}

            {/* VERIFIED */}

            {product?.is_verified && (
              <span
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-emerald-500/15
                  px-3
                  py-1.5
                  text-sm
                  font-semibold
                  text-emerald-400
                "
              >
                <ShieldCheck className="h-4 w-4" />

                Verified
              </span>
            )}

          </div>
        )}

        {/* =====================================================
            CONTACT
        ===================================================== */}

        {(product?.whatsapp ||
          product?.telegram ||
          product?.wechat) && (
          <div
            className="
              mt-5
              border-t
              border-zinc-800
              pt-4
            "
          >
            <p
              className="
                mb-3
                text-sm
                font-bold
                uppercase
                tracking-wider
                text-zinc-500
              "
            >
              Contact
            </p>

            <div
              className="
                flex
                flex-wrap
                items-center
                justify-center
                gap-2
              "
            >

              {/* =================================================
                  WHATSAPP
              ================================================= */}

              {product?.whatsapp && (
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-emerald-500/30
                    bg-emerald-500/10
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-emerald-400
                    transition
                    hover:bg-emerald-500
                    hover:text-white
                  "
                >
                  <MessageCircle className="h-4 w-4" />

                  WhatsApp
                </button>
              )}

              {/* =================================================
                  TELEGRAM
              ================================================= */}

              {product?.telegram && (
                <button
                  type="button"
                  onClick={handleTelegram}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-sky-500/30
                    bg-sky-500/10
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-sky-400
                    transition
                    hover:bg-sky-500
                    hover:text-white
                  "
                >
                  <Send className="h-4 w-4" />

                  Telegram
                </button>
              )}

              {/* =================================================
                  WECHAT
              ================================================= */}

              {product?.wechat && (
                <button
                  type="button"
                  onClick={handleWechat}
                  title={`WeChat: ${product.wechat}`}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-green-500/30
                    bg-green-500/10
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-green-400
                    transition
                    hover:bg-green-500
                    hover:text-white
                  "
                >
                  <Copy className="h-4 w-4" />

                  WeChat
                </button>
              )}

            </div>
          </div>
        )}

        {/* =====================================================
            PRICE
        ===================================================== */}

        <div
          className="
            mt-5
            border-t
            border-zinc-800
            pt-4
            text-center
          "
        >
          <p
            className="
              break-words
              text-2xl
              font-bold
              text-red-500
            "
          >
            {product?.price || "-"}
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Starting Price
          </p>
        </div>

      </div>
    </div>
  );
}

export default ProductCard;