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

useEffect(() => {
    async function loadGirls() {
        const data = await getGirls();
        setProducts(data);
    }

    loadGirls();
}, []);
  
  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((item) => {
      // Tìm theo tên, tên tiếng Trung, mã, khu vực
      const matchSearch =
        keyword === "" ||
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword) ||
        item.area.toLowerCase().includes(keyword);

      // Lọc theo Category
      const matchCategory =
        category === "All" || item.area === category;

      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  return (
    <MainLayout>
      <Header />

      <main className="pb-12">
        <SearchBar
          value={search}
          onChange={setSearch}
        />

        <CategoryMenu
          activeCategory={category}
          setActiveCategory={setCategory}
        />

        <SectionTitle
          title="Featured Girls"
          subtitle={
            category === "All"
              ? "Showing all verified profiles"
              : `${category} Area`
          }
          count={filteredProducts.length}
        />

        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <EmptyState />
        )}
      </main>
    </MainLayout>
  );
}

export default Home;