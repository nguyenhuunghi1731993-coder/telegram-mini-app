function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white">
      <div
        className="
          mx-auto
          w-full
          max-w-[1600px]
          px-2
          sm:px-4
          md:px-5
          lg:px-6
          xl:px-8
        "
      >
        {children}
      </div>
    </div>
  );
}

export default MainLayout;