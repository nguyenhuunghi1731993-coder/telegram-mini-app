function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white">
      <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-5 md:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}

export default MainLayout;