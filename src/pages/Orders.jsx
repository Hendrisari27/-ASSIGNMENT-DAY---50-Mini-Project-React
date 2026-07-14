import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrder, fetchOrders, formatRupiah } from "../api/mockApi";

function Orders() {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  if (isLoading) return <p className="status">Memuat order…</p>;
  if (isError) return <p className="status error">Gagal memuat order.</p>;

  return (
    <div className="page">
      <h1>Orders</h1>
      <ul className="list">
        {orders.map((o) => (
          // Prefetch detail order saat hover.
          <li
            key={o.id}
            className="list__row"
            onMouseEnter={() =>
              queryClient.prefetchQuery({
                queryKey: ["order", o.id],
                queryFn: () => fetchOrder(o.id),
              })
            }
          >
            <Link to={`/dashboard/orders/${o.id}`}>
              <strong>{o.id}</strong>
            </Link>
            <span>{o.date}</span>
            <span className={`badge badge--${o.status}`}>{o.status}</span>
            <span>{formatRupiah(o.total)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orders;
