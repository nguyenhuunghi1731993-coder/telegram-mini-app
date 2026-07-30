import { useNavigate } from "react-router-dom";

import {
  Heart,
  Eye,
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

  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
  

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

    if (telegramUrl.startsWith("@")) {
      telegramUrl = `https://t.me/${telegramUrl.substring(1)}`;
    }

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
  }

  return (
    <div
      onClick={openDetail}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex={0}
      className="
        group
        w-full
        min-w-0
        cursor-pointer
        overflow-hidden
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900/90
        shadow-md
        outline-none
        transition-all
        duration-300
        sm:rounded-2xl
        sm:shadow-lg
        hover:border-red-500
        focus:border-red-500
      "
    >
      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="relative aspect-[4/5] w-full overflow-hidden">
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
          <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-xs text-zinc-500">
            No Image
          </div>
        )}

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

        {/* ONLINE */}

        {product?.status && (
          <div
            className="
              absolute
              left-1.5
              top-1.5
              flex
              items-center
              gap-1
              rounded-full
              bg-emerald-500/90
              px-1.5
              py-1
              text-[8px]
              font-semibold
              text-white

              sm:left-3
              sm:top-3
              sm:gap-1.5
              sm:px-2.5
              sm:text-xs
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white sm:h-2 sm:w-2" />

            <span>Online</span>
          </div>
        )}

        {/* FAVORITE */}

        <button
          type="button"
          onClick={handleFavorite}
          aria-label="Favorite"
          className="
            absolute
            right-1.5
            top-1.5
            z-10
            rounded-full
            bg-black/60
            p-1.5
            backdrop-blur
            transition
            hover:bg-red-500

            sm:right-3
            sm:top-3
            sm:p-2.5
          "
        >
          <Heart className="h-3.5 w-3.5 text-white sm:h-5 sm:w-5" />
        </button>

        {/* NEW / VIDEO */}

        {(product?.is_new || product?.has_video) && (
          <div
            className="
              absolute
              bottom-1.5
              left-1.5
              flex
              items-center
              gap-1

              sm:bottom-3
              sm:left-3
              sm:gap-2
            "
          >
            {product?.is_new && (
              <span
                className="
                  rounded
                  bg-red-600
                  px-1.5
                  py-0.5
                  text-[8px]
                  font-bold
                  text-white

                  sm:rounded-md
                  sm:px-2.5
                  sm:py-1
                  sm:text-xs
                "
              >
                NEW
              </span>
            )}

            {product?.has_video && (
              <span
                className="
                  flex
                  items-center
                  gap-1
                  rounded
                  bg-black/75
                  px-1.5
                  py-0.5
                  text-[8px]
                  font-semibold
                  text-white

                  sm:rounded-md
                  sm:px-2.5
                  sm:py-1
                  sm:text-xs
                "
              >
                <Play
                  className="h-2.5 w-2.5 sm:h-3 sm:w-3"
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

      <div className="p-2 text-center sm:p-5">
        {/* CODE */}

        <div
          className="
            truncate
            text-[9px]
            font-bold
            uppercase
            tracking-wider
            text-red-500

            sm:text-sm
            sm:tracking-widest
          "
        >
          {product?.code || "-"}
        </div>

        {/* NAME */}

        <h3
          className="
            mt-0.5
            truncate
            text-sm
            font-bold
            text-white
            transition
            group-hover:text-red-400

            sm:mt-1
            sm:text-2xl
          "
        >
          {product?.name || "Unknown"}
        </h3>

        {/* LOCATION */}

        <p
          className="
            mt-0.5
            truncate
            text-[10px]
            text-zinc-400

            sm:mt-1
            sm:text-base
          "
        >
          {product?.location || "-"}
        </p>

        {/* RATING */}

        {/* RATING + VIEW + LIKE + AREA */}

<div
  className="
    mt-2
    flex
    flex-wrap
    items-center
    justify-center
    gap-3

    text-[9px]

    sm:mt-3
    sm:gap-5
    sm:text-sm
  "
>
  {/* Rating */}

  <div className="flex items-center gap-1">
    <Star
      className="
        h-3
        w-3
        fill-yellow-400
        text-yellow-400

        sm:h-4
        sm:w-4
      "
    />

    <span className="font-semibold text-white">
      4.9
    </span>
  </div>

  {/* Views */}

  <div className="flex items-center gap-1 text-zinc-400">
    <Eye
      className="
        h-3
        w-3

        sm:h-4
        sm:w-4
      "
    />

    <span>2.4K</span>
  </div>

  {/* Likes */}

  <div className="flex items-center gap-1 text-red-400">
    <Heart
      className="
        h-3
        w-3
        fill-current

        sm:h-4
        sm:w-4
      "
    />

    <span>186</span>
  </div>

  {/* Area */}

  <div className="flex items-center gap-1 text-zinc-300">
    <MapPin
      className="
        h-3
        w-3
        text-red-500

        sm:h-4
        sm:w-4
      "
    />

    <span>{product?.area || "-"}</span>
  </div>
</div>

        {/* AGE / HEIGHT / CUP */}

        <div
          className="
            mt-1.5
            flex
            items-center
            justify-center
            whitespace-nowrap
            text-[9px]
            text-zinc-300

            sm:mt-3
            sm:text-base
          "
        >
          <span>{product?.age ?? "-"} Years</span>

          <span className="mx-1 text-zinc-600 sm:mx-2">
            •
          </span>

          <span>{product?.height ?? "-"} cm</span>

          <span className="mx-1 text-zinc-600 sm:mx-2">
            •
          </span>

          <span>{product?.cup || "-"}</span>
        </div>

        {/* VIP / VERIFIED */}

        {(product?.is_vip || product?.is_verified) && (
          <div
            className="
              mt-2
              flex
              flex-wrap
              items-center
              justify-center
              gap-1

              sm:mt-4
              sm:gap-2
            "
          >
            {product?.is_vip && (
              <span
                className="
                  flex
                  items-center
                  gap-1
                  rounded-full
                  bg-yellow-500/15
                  px-1.5
                  py-0.5
                  text-[8px]
                  font-semibold
                  text-yellow-400

                  sm:gap-1.5
                  sm:px-3
                  sm:py-1.5
                  sm:text-sm
                "
              >
                <Crown className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
                VIP
              </span>
            )}

            {product?.is_verified && (
              <span
                className="
                  flex
                  items-center
                  gap-1
                  rounded-full
                  bg-emerald-500/15
                  px-1.5
                  py-0.5
                  text-[8px]
                  font-semibold
                  text-emerald-400

                  sm:gap-1.5
                  sm:px-3
                  sm:py-1.5
                  sm:text-sm
                "
              >
                <ShieldCheck className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
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
              mt-2.5
              border-t
              border-zinc-800
              pt-2

              sm:mt-5
              sm:pt-4
            "
          >
            <p
              className="
                mb-1.5
                text-[8px]
                font-bold
                uppercase
                tracking-wider
                text-zinc-500

                sm:mb-3
                sm:text-sm
              "
            >
              Contact
            </p>

            <div
              className="
                flex
                items-center
                justify-center
                gap-1

                sm:flex-wrap
                sm:gap-2
              "
            >
              {/* WHATSAPP */}

              {product?.whatsapp && (
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  aria-label="WhatsApp"
                  title="WhatsApp"
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-emerald-500/30
                    bg-emerald-500/10
                    text-emerald-400
                    transition
                    hover:bg-emerald-500
                    hover:text-white

                    sm:h-auto
                    sm:w-auto
                    sm:gap-2
                    sm:rounded-xl
                    sm:px-4
                    sm:py-2.5
                    sm:text-sm
                    sm:font-semibold
                  "
                >
                  <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

                  <span className="hidden sm:inline">
                    WhatsApp
                  </span>
                </button>
              )}

              {/* TELEGRAM */}

              {product?.telegram && (
                <button
                  type="button"
                  onClick={handleTelegram}
                  aria-label="Telegram"
                  title="Telegram"
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-sky-500/30
                    bg-sky-500/10
                    text-sky-400
                    transition
                    hover:bg-sky-500
                    hover:text-white

                    sm:h-auto
                    sm:w-auto
                    sm:gap-2
                    sm:rounded-xl
                    sm:px-4
                    sm:py-2.5
                    sm:text-sm
                    sm:font-semibold
                  "
                >
                  <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

                  <span className="hidden sm:inline">
                    Telegram
                  </span>
                </button>
              )}

              {/* WECHAT */}

              {product?.wechat && (
                <button
                  type="button"
                  onClick={handleWechat}
                  aria-label="WeChat"
                  title={`WeChat: ${product.wechat}`}
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-green-500/30
                    bg-green-500/10
                    text-green-400
                    transition
                    hover:bg-green-500
                    hover:text-white

                    sm:h-auto
                    sm:w-auto
                    sm:gap-2
                    sm:rounded-xl
                    sm:px-4
                    sm:py-2.5
                    sm:text-sm
                    sm:font-semibold
                  "
                >
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

                  <span className="hidden sm:inline">
                    WeChat
                  </span>
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
            mt-2.5
            border-t
            border-zinc-800
            pt-2
            text-center

            sm:mt-5
            sm:pt-4
          "
>
        <p
          className="
            break-words
            text-sm
            font-bold
            leading-tight
            text-red-500

            sm:text-2xl
          "
  >
    {product?.price || "-"}
  </p>

  <div
  className="
    mt-1
    space-y-1
    text-[8px]
    text-zinc-400

    sm:mt-2
    sm:text-sm
  "
>
  {product?.status_message && (
    <p className="font-semibold text-zinc-300">
      {product.status_message}
    </p>
  )}

  {product?.show_schedule && (
    <>
      {product?.available_time && (
        <p>
          🕒 {formatTime(product.available_time)}
        </p>
      )}

      {product?.available_date && (
        <p>
          📅 {formatDate(product.available_date)}
        </p>
      )}
    </>
  )}
</div>
</div>
        </div>
      </div>
    
  );
}

export default ProductCard;