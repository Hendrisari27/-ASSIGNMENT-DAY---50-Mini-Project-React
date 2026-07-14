import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProduct, fetchProducts } from "../api/mockApi";
import ProductCard from "../components/ProductCard";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) return <p className="status">Memuat produk…</p>;
  if (isError) return <p className="status error">Gagal memuat produk.</p>;

  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const visible =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div className="page">
      <h1>Produk</h1>

      <div className="filters">
        {categories.map((c) => (
          <button
            key={c}
            className={"button" + (category === c ? " button--primary" : "")}
            onClick={() => setSearchParams(c === "all" ? {} : { category: c })}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid">
        {visible.map((p) => (
          // Prefetch detail saat hover → klik terasa instan.
          <div
            key={p.id}
            onMouseEnter={() =>
              queryClient.prefetchQuery({
                queryKey: ["product", p.id],
                queryFn: () => fetchProduct(p.id),
              })
            }
          >
            <Link to={`/products/${p.id}`} className="card-link">
              <ProductCard product={p} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
