import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchOrder, formatRupiah } from "../api/mockApi";

function OrderDetail() {
  const { orderId } = useParams();
  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
  });

  if (isLoading) return <p className="status">Memuat order…</p>;
  if (isError || !order)
    return <p className="status error">Gagal memuat order.</p>;

  return (
    <div className="page">
      <Link to="/dashboard/orders" className="button">
        ← Kembali ke orders
      </Link>
      <h1>{order.id}</h1>
      <p>
        Tanggal: {order.date} · Status:{" "}
        <span className={`badge badge--${order.status}`}>{order.status}</span>
      </p>

      <h2>Item</h2>
      <ul className="list">
        {order.items.map((it) => (
          <li key={it.productId} className="list__row">
            <span>{it.name}</span>
            <span>×{it.qty}</span>
            <span>{formatRupiah(it.price)}</span>
            <span>{formatRupiah(it.price * it.qty)}</span>
          </li>
        ))}
      </ul>
      <p className="card__price">Total: {formatRupiah(order.total)}</p>
    </div>
  );
}

export default OrderDetail;
