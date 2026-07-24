import { useEffect, useMemo, useState } from "react";
import { getGirls } from "../services/girlService";

import MainLayout from "../layouts/MainLayout";

import Header from "../components/layout/Header";
import SearchBar from "../components/home/SearchBar";
import CategoryMenu from "../components/home/CategoryMenu";
import ProductGrid from "../components/home/ProductGrid";

import SectionTitle from "../components/common/SectionTitle";
import EmptyState from "../components/common/EmptyState";

function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD DATA FROM SUPABASE
  // =========================

  useEffect(() => {
    let mounted = true;

    async function loadGirls() {
      try {
        setLoading(true);
        setError("");

        const data = await getGirls();

        if (!mounted) return;

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Load girls error:", err);

        if (!mounted) return;

        setError(
          err?.message || "Không thể tải danh sách."
        );

        setProducts([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadGirls();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredProducts = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    return products.filter((item) => {

      // Chỉ hiển thị profile Active
      if (item.status === false) {
        return false;
      }

      const name = String(
        item.name || ""
      ).toLowerCase();

      const code = String(
        item.code || ""
      ).toLowerCase();

      const area = String(
        item.area || ""
      ).toLowerCase();

      const location = String(
        item.location || ""
      ).toLowerCase();

      // SEARCH
      const matchSearch =
        keyword === "" ||
        name.includes(keyword) ||
        code.includes(keyword) ||
        area.includes(keyword) ||
        location.includes(keyword);

      // CATEGORY
      const matchCategory =
        category === "All" ||
        String(item.area || "").toLowerCase() ===
          category.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  // =========================
  // UI
  // =========================

  return (
    <MainLayout>

      <Header />

      <main className="px-6 pb-10">

        {/* SEARCH */}

        <SearchBar
          value={search}
          onChange={setSearch}
        />

        {/* CATEGORY */}

        <CategoryMenu
          activeCategory={category}
          setActiveCategory={setCategory}
        />

        {/* TITLE */}

        <SectionTitle
          title="Featured Girls"
          subtitle={
            category === "All"
              ? "Showing all verified profiles"
              : `${category} Area`
          }
          count={filteredProducts.length}
        />

        {/* LOADING */}

        {loading && (
          <div className="py-20 text-center text-zinc-500">
            Loading profiles...
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {/* PRODUCTS */}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <ProductGrid
              products={filteredProducts}
            />
          )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <EmptyState />
          )}

      </main>

    </MainLayout>
  );
}

export default Home;