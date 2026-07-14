import { formatRupiah } from "../api/mockApi";

// Komponen presentasional murni. Navigasi & prefetch detail ditangani oleh
// komponen induk (Products.jsx) yang membungkus kartu ini.
function ProductCard({ product }) {
  return (
    <article className="card">
      <div className="card__emoji" aria-hidden="true">{product.emoji}</div>
      <h3>{product.name}</h3>
      <p className="card__category">{product.category}</p>
      <p className="card__price">{formatRupiah(product.price)}</p>
    </article>
  );
}

export default ProductCard;
