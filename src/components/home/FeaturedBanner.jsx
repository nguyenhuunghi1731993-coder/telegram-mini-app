import Button from "../common/Button";

function FeaturedBanner() {
  return (
    <section className="px-6 pb-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 p-8 shadow-2xl">

        {/* Hiệu ứng ánh sáng */}
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative z-10 max-w-lg">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Premium Collection
          </span>

          <h2 className="mt-5 text-5xl font-bold text-white">
            Featured Girls
          </h2>

          <p className="mt-4 text-lg text-white/90">
            Discover verified profiles with premium photos,
            videos and real reviews.
          </p>

          <div className="mt-8">
            <Button>
              Explore Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedBanner;