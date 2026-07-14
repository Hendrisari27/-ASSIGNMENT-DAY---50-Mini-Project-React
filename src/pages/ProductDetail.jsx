import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct, formatRupiah } from "../api/mockApi";

function ProductDetail() {
  const { productId } = useParams();
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
  });

  if (isLoading) return <p className="status">Memuat produk…</p>;
  if (isError || !product)
    return <p className="status error">Gagal memuat produk.</p>;

  return (
    <div className="page">
      <Link to="/products" className="button">
        ← Kembali ke produk
      </Link>
      <h1>
        {product.emoji} {product.name}
      </h1>
      <p className="card__category">Kategori: {product.category}</p>
      <p className="card__price">Harga: {formatRupiah(product.price)}</p>
      <p>{product.description}</p>
    </div>
  );
}

export default ProductDetail;
