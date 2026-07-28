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

  // ============================================
  // LOAD DATA FROM SUPABASE
  // ============================================

  useEffect(() => {
    async function loadGirls() {
      try {
        setLoading(true);

        const data = await getGirls();

        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load profiles:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadGirls();
  }, []);

  // ============================================
  // SEARCH + CATEGORY FILTER
  // ============================================

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((item) => {
      const name = String(item?.name || "").toLowerCase();
      const code = String(item?.code || "").toLowerCase();
      const area = String(item?.area || "").toLowerCase();

      const matchSearch =
        keyword === "" ||
        name.includes(keyword) ||
        code.includes(keyword) ||
        area.includes(keyword);

      const matchCategory =
        category === "All" ||
        String(item?.area || "") === category;

      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  return (
    <MainLayout>
      <Header />

      <main className="pb-16">
        {/* SEARCH + CATEGORY */}

        <div className="w-full">
          <SearchBar
            value={search}
            onChange={setSearch}
          />

          <CategoryMenu
            activeCategory={category}
            setActiveCategory={setCategory}
          />

          {/* SECTION TITLE */}

          <SectionTitle
            title="Featured Girls"
            subtitle={
              category === "All"
                ? "Showing all verified profiles"
                : `${category} Area`
            }
            count={filteredProducts.length}
          />

          {/* PRODUCTS */}

          {loading ? (
            <div className="py-16 text-center text-zinc-500">
              Loading profiles...
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <EmptyState />
          )}
        </div>
      </main>
    </MainLayout>
  );
}

export default Home;